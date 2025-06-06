import { query } from '../../lib/database.js';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        error: 'Database not configured',
        message: 'DATABASE_URL environment variable not set'
      });
    }

    // Test basic connection
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    
    // Test table existence
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    res.status(200).json({
      status: 'success',
      database: {
        connected: true,
        current_time: result.rows[0].current_time,
        version: result.rows[0].db_version
      },
      tables: tables.rows.map(row => row.table_name)
    });

  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      database: {
        connected: false
      }
    });
  }
}