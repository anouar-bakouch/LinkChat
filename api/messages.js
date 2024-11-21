import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();

  try {
    if (req.method === 'GET') {
      const { conversationId } = req.query;
      const result = await client.query(
        'SELECT id, user_id, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
        [conversationId]
      );
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      const { conversationId, userId, content } = req.body;
      const result = await client.query(
        'INSERT INTO messages (conversation_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [conversationId, userId, content]
      );
      res.status(201).json(result.rows[0]);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    client.release();
  }
}