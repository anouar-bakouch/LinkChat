import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};  

// fetch all users

export default async function handler(request) {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM users');
        const users = result.rows;
        return new Response(JSON.stringify(users), {
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