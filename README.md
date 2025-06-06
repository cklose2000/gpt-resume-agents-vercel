# GPT Resume Agents - Vercel Deployment

🚀 **Intelligent Multi-Agent Resume Search System**

## Features

- **🤖 Multi-Agent System** - Intelligent resume search and ranking
- **💬 Conversational Interface** - Natural language resume queries  
- **📄 Document Processing** - Advanced PDF parsing with LLMWhisperer
- **🔍 Vector Search** - Semantic similarity matching
- **📊 Analytics** - Performance tracking and insights
- **⚡ Fast & Scalable** - Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **AI**: OpenAI GPT-4.1, Text Embedding 3
- **Database**: Supabase + Neon PostgreSQL
- **Document Processing**: LLMWhisperer v2
- **Deployment**: Vercel

## Quick Deploy to Vercel

1. **Connect this repository to Vercel**
2. **Set environment variables** (see below)
3. **Deploy!**

## Environment Variables

Set these in your Vercel dashboard:

```env
# AI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_CHAT_MODEL=gpt-4.1-2025-04-14
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-neon-database-url

# Document Processing
LLMWHISPERER_API_KEY=your-llmwhisperer-key

# Features
USE_INTELLIGENT_ORCHESTRATOR=true
ENABLE_ENHANCED_RAG=true
```

## Usage

After deployment:
1. Upload resumes to the system
2. Use natural language queries to search
3. Get intelligent, context-aware responses
4. Track performance and analytics

**Ready to deploy on Vercel!** ⚡
