import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { hashPassword } from '../lib/hash';

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

    const { username, email, password } = await request.json();

    // Connect to PostgreSQL
    const client = await db.connect();

    try {
        // Check if user already exists
        const existingUser = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert new user into the database
        const result = await client.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        const newUser = result.rows[0];

        // Generate token
        const token = await generateToken();

        // Store token in Redis with a 1-hour expiration
        await redis.set(token, JSON.stringify({ userId: newUser.id, username: newUser.username }), { ex: 3600 });

        return new Response(JSON.stringify({ token }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    } finally {
        client.release();
    }
}