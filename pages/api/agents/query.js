import { query } from '../../../lib/database.js';

// Main agent query endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query: userQuery, agent_type = 'general' } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Log the query
    console.log(`[${agent_type}] Processing query: ${userQuery}`);

    // Simple keyword-based search for now
    const searchTerms = userQuery.toLowerCase();
    
    // Try to search the database if available
    let candidates = [];
    try {
      if (process.env.DATABASE_URL) {
        const result = await query(
          `SELECT * FROM candidate_search_view 
           WHERE LOWER(name) LIKE $1 
           OR LOWER(skills) LIKE $1 
           OR LOWER(summary) LIKE $1
           LIMIT 10`,
          [`%${searchTerms}%`]
        );
        candidates = result.rows;
      }
    } catch (dbError) {
      console.log('Database search failed, using fallback:', dbError.message);
    }

    // Generate AI response
    let response;
    if (candidates.length > 0) {
      response = {
        type: 'candidates_found',
        message: `Found ${candidates.length} candidates matching your query.`,
        candidates: candidates.slice(0, 5), // Limit to top 5
        total_found: candidates.length
      };
    } else {
      response = {
        type: 'no_results',
        message: `No candidates found matching "${userQuery}". Try different keywords or check if resumes have been uploaded.`,
        suggestions: [
          'Try broader search terms',
          'Check spelling',
          'Upload more resumes to the system'
        ]
      };
    }

    // Add agent metadata
    response.agent = {
      type: agent_type,
      timestamp: new Date().toISOString(),
      query_processed: userQuery
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process query',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}