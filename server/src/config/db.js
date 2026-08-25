import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error('Missing DATABASE_URL. Check server/.env against server/.env.example.');
}

// A single shared connection pool used by every service. Each service issues
// plain parameterized SQL through this pool — there is no ORM and no
// PostgREST layer; the Express layer below is the only thing enforcing
// authentication and role-based access.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Convenience wrapper: query(text, params) -> rows
export const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result.rows;
};

// Convenience wrapper for a single expected row (or null).
export const queryOne = async (text, params) => {
  const rows = await query(text, params);
  return rows[0] || null;
};

// Runs `fn` inside a transaction, passing a client whose .query() participates
// in that transaction. Commits on success, rolls back and rethrows on error.
export const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
