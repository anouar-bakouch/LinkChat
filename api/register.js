import { db } from '@vercel/postgres';
import { hashPassword } from '../utils/hash'; // Adjust the import path as necessary

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
            const error = { code: "BAD_REQUEST", message: "Missing username, email, or password" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const client = await db.connect();

        try {
            // Check if user already exists
            const existingUser = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
            if (existingUser.rows.length > 0) {
                return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
            }

            // Hash the password using the same logic as in the frontend
            const hashedPassword = await hashPassword(username, password);

            // Insert new user into the database
            const result = await client.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [username, email, hashedPassword]
            );
            const newUser = result.rows[0];

            return new Response(JSON.stringify(newUser), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}