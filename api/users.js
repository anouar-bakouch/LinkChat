import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();

  try {
    const result = await client.query('SELECT id, username FROM users');
    console.log(result.rows)
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}