const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'devops',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'sharedappdb',
  port: process.env.DB_PORT || 5432
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM devs');
    const names = result.rows.map(row => `<li>${row.name}</li>`).join('');
    res.send(`<h1>Team 6 Node.js app with shared DB is up and running!</h1><ul>${names}</ul>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

app.listen(3000, () => console.log('Node.js app listening on port 3000'));
