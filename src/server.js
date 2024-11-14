const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const redis = require('redis');
const { promisify } = require('util');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// PostgreSQL client setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});
redisClient.connect();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, hashedPassword]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    await setAsync(token, JSON.stringify({ userId: user.id, username: user.username }));

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});