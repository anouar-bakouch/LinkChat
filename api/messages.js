import { db } from '@vercel/postgres';
import { getConnecterUser, triggerNotConnected } from "../lib/session";

export default async (request, response) => {
  try {
    const headers = new Headers(request.headers);
    const user = await getConnecterUser(request);
    if (user === undefined || user === null) {
      console.log("Not connected");
      return triggerNotConnected(response);
    }

    if (request.method === 'GET') {
      const { conversationId } = request.query;
      if (!conversationId) {
        return response.status(400).json({ message: 'Conversation ID is required' });
      }

      // Execute the query to fetch messages
      const result = await db.sql`SELECT id, user_id, content, created_at FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_at ASC`;
      console.log('Query executed successfully:', result);

      // Return the result as JSON
      return response.status(200).json(result.rows);
    } else {
      response.setHeader('Allow', ['GET']);
      return response.status(405).json({ message: `Method ${request.method} not allowed` });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
};