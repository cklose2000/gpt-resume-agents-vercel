// Health check endpoint
export default function handler(req, res) {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      node_version: process.version,
      platform: process.platform,
      memory_usage: process.memoryUsage()
    },
    services: {
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      supabase: process.env.SUPABASE_URL ? 'configured' : 'not configured',
      llmwhisperer: process.env.LLMWHISPERER_API_KEY ? 'configured' : 'not configured'
    }
  };

  res.status(200).json(healthData);
}