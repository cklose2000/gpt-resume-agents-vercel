// Debug endpoint for troubleshooting
export default function handler(req, res) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: {
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV,
      vercel_url: process.env.VERCEL_URL
    },
    env_status: {
      database_url: !!process.env.DATABASE_URL,
      openai_api_key: !!process.env.OPENAI_API_KEY,
      supabase_url: !!process.env.SUPABASE_URL,
      llmwhisperer_key: !!process.env.LLMWHISPERER_API_KEY,
      intelligent_orchestrator: process.env.USE_INTELLIGENT_ORCHESTRATOR
    }
  };

  res.status(200).json(debugInfo);
}