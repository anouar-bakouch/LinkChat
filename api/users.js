import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  let client;
  try {

    client = await db.connect();
 
    const result = await db.sql`SELECT * FROM users`;

    return res.status(200).json(result.rows);
  } catch (error) {

    return res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  } finally {
    if (client) {

      client.release();
    }
  }
}