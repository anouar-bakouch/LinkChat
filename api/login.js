import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        const { username, password } = await request.json();
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(username + password));
        const hashed64 = btoa(String.fromCharCode(...new Uint8Array(hash)));

        const client = await db.connect();
        const { rowCount, rows } = await client.sql`SELECT * FROM users WHERE username = ${username} AND password = ${hashed64}`;
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