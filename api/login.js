import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { hashPassword } from '../src/utils/hash';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            const error = { code: "BAD_REQUEST", message: "Missing username or password" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        // Hash the password using the same logic as in the frontend
        const hashedPassword = await hashPassword(username, password);

        const client = await db.connect();
        const { rowCount, rows } = await client.sql`SELECT * FROM users WHERE username = ${username} AND password = ${hashedPassword}`;
        if (rowCount !== 1) {
            const error = { code: "UNAUTHORIZED", message: "Identifiant ou mot de passe incorrect" };
            return new Response(JSON.stringify(error), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = rows[0];
        const token = crypto.randomUUID();
        await redis.set(token, JSON.stringify(user));

        // update the last_login field
        await client.sql`UPDATE users SET last_login = NOW() WHERE username = ${username}`;

        return new Response(JSON.stringify({ token, user }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}