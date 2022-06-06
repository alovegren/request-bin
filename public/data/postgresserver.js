import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();
import entropyString from 'entropy-string';
const { Entropy } = entropyString;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  host: 'localhost',
});

// const tableName = process.env.POSTGRES_TABLE_NAME;
// console.log('tableName', tableName);

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

const generateBinPath = () => {
  return new Entropy().mediumID();
};

// Create new unique endpoint url and add into table
const addNewEndpoint = async () => {
  const binPath = generateBinPath();
  let rowCount = 1;

  while (rowCount !== 0) {
    try {
      const res = await pool.query(`SELECT id FROM endpointTest WHERE link = $1;`, [binPath]);
      rowCount = res.rowCount;
    } catch(err) {
      return err.stack;
    }
  }

  await pool.query(`INSERT INTO endpointTest (link) VALUES ($1);`, [binPath]);
  return binPath;
}

// Update count and last requested timestamp in table when new request has been made to specific url endpoint
const updateEndpoint = async (binPath) => {
  let count = await pool.query(`SELECT count FROM endpointTest WHERE link = $1;`, [binPath]);

  if (count.rowCount === 0) {
    return {binNotFound: true};
  }

  count = count.rows[0].count;

  await pool.query(`UPDATE endpointTest SET count = $1, last_request_at = NOW() WHERE link = $2;`, [count + 1, binPath]);

  const res = await pool.query(`SELECT * FROM endpointTest WHERE link = $1;`, [binPath]);
  return res.rows[0];
}

// Retrieve information for the endpoint corresponding to the binPath it's given
// Returns an object with the relevant info, or an empty object if no matching data is found
const getEndpointInfo = async (binPath) => {
  const endpointInfo = await pool.query(`SELECT * FROM endpointTest WHERE link = $1;`, [binPath]);

  if (endpointInfo.rowCount === 0) {
    return {binNotFound: true};
  } else {
    return endpointInfo.rows[0];
  }
}

export { addNewEndpoint, updateEndpoint, getEndpointInfo };
