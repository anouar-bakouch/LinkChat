import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateToken() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
    }

    const { username, password } = await request.json();

    // Connect to PostgreSQL
    const client = await db.connect();

    try {
        // Fetch user from the database
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
        }

        // Verify password
        const hashedPassword = await hashPassword(password);
        if (hashedPassword !== user.password) {
            return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
        }

        // Generate token
        const token = await generateToken();

        // Store token in Redis with a 1-hour expiration
        await redis.set(token, JSON.stringify({ userId: user.id, username: user.username }), { ex: 3600 });

        // Update last login date
        await client.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    } finally {
        client.release();
    }
}