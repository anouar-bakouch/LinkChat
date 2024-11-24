import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);

        if (!user) {
            return triggerNotConnected(response);
        }

        if (request.method === 'GET') {
            const { conversationId } = request.query;
            if (!conversationId) {
                return new Response(JSON.stringify({ message: 'Conversation ID is required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Execute the query to fetch messages
            const result = await db.sql`SELECT id, user_id, content, created_at FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_at ASC`;
            console.log('Query executed successfully:', result);

            // Return the result as JSON
            return new Response(JSON.stringify(result.rows), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (request.method === 'POST') {
            const { receiver_id, content, receiver_type, image_url } = await request.json();

            if (!receiver_id || !content || !receiver_type) {
                return new Response(JSON.stringify({ error: "Receiver ID, content, and receiver type are required." }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Enregistrer le message dans la base de données
            const result = await db.sql`
                INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type, image_url)
                VALUES (${user.id}, ${user.username}, ${receiver_id}, ${content}, ${receiver_type}, ${image_url})
                RETURNING message_id, sender_id, sender_name, receiver_id, content, timestamp, receiver_type, image_url;
            `;

            if (result.rowCount === 0) {
                return new Response(JSON.stringify({ error: "Failed to insert message" }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return new Response(JSON.stringify(result.rows[0]), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ message: `Method ${request.method} not allowed` }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}