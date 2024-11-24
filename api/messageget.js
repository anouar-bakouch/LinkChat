import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};


function unauthorizedResponse() {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });
}

export default async function handler(request) {
    try {
        // Check if the user is authenticated
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const url = new URL(request.url);
        const receiver_id = url.searchParams.get("receiver_id");
        const receiver_type = url.searchParams.get("receiver_type");

        if (!receiver_id) {
            return new Response(JSON.stringify({ message: "Receiver ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Execute the query to fetch messages
        const result = await sql`SELECT * FROM messages WHERE receiver_id = ${receiver_id} AND receiver_type = ${receiver_type}`;
        console.log('Query executed successfully:', result);

        // Return the result as JSON
        return new Response(JSON.stringify(result.rows), {
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