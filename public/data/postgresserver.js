import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;
import randomWords from 'random-words';
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  host: 'localhost',
});

// if testing mode, create endpoint table if does not exist yet and insert data
const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'pgSchema.sql')).toString();
if (process.env.NODE_ENV === 'test') {
  pool.query(schema, (err, res) => {
    if (res) {
      console.log('Table is ready');
    }
  })
}

// test queries
const test = fs.readFileSync(path.join(__dirname, 'pgTesting.sql')).toString();
if (process.env.NODE_ENV === 'test') {
  const res = await pool.query(test);
  if (res) {
    console.log('Data inserted');
  }
}


// Create new unique endpoint url and add into table
const addNewEndpoint = async () => {
  let url = randomWords();
  let rowCount = 1;

  while (rowCount !== 0) {
    try {
      const res = await pool.query(`SELECT id FROM endpointTest WHERE link = $1;`, [url]);
      rowCount = res.rowCount;
    } catch(err) {
      return err.stack;
    }
  }

  await pool.query(`INSERT INTO endpointTest (link) VALUES ($1);`, [url]);
  return url;
}

// Update count and last requested timestamp in table when new request has been made to specific url endpoint
const updateEndpoint = async (url) => {
  let count = await pool.query(`SELECT count FROM endpointTest WHERE link = $1;`, [url]);
  count = count.rows[0].count;

  await pool.query(`UPDATE endpointTest SET count = $1, last_request_at = NOW() WHERE link = $2;`, [count + 1, url]);

  const res = await pool.query(`SELECT * FROM endpointTest WHERE link = $1;`, [url]);
  return res.rows;
}

export { addNewEndpoint, updateEndpoint };
