import pg from 'pg';

const { Pool } = pg;

// Database connection
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  console.warn('No DATABASE_URL found, database features will be unavailable');
}

export async function query(text, params) {
  if (!pool) {
    throw new Error('Database not configured');
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getCandidate(id) {
  const result = await query('SELECT * FROM candidates WHERE id = $1', [id]);
  return result.rows[0];
}

export async function searchCandidates(searchTerm) {
  const result = await query(
    `SELECT * FROM candidates 
     WHERE LOWER(name) LIKE LOWER($1) 
     OR LOWER(skills) LIKE LOWER($1) 
     OR LOWER(experience) LIKE LOWER($1)
     LIMIT 20`,
    [`%${searchTerm}%`]
  );
  return result.rows;
}

export default pool;