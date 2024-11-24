import { db } from './db'; 

export default async function handler(request) {
    try {
        const { username, password } = await request.json();

        const client = await db.connect();
        const { rowCount, rows } = await client.sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
        if (rowCount !== 1) {
            const error = { code: "UNAUTHORIZED", message: "Identifiant ou mot de passe incorrect" };
            return new Response(JSON.stringify(error), {
                status: 401,    
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = rows[0];
        // Continue with the login process, e.g., generating a session token

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Login error:', error);
        const serverError = { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." };
        return new Response(JSON.stringify(serverError), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}