import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { comparePassword } from '../lib/comparePassword';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

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
        // Check if user exists
        const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 400 });
        }

        const user = existingUser.rows[0];

        // Compare the password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 400 });
        }

        // Generate token
        const token = await generateToken();

        // Store token in Redis with a 1-hour expiration
        await redis.set(token, JSON.stringify({ userId: user.id, username: user.username }), { ex: 3600 });

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    } finally {
        client.release();
    }
}