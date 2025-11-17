# 🤖 AI Documentation Assistant - Setup Guide

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: January 17, 2025

---

## 📋 Overview

The AI Documentation Assistant is a fully-featured, production-ready RAG (Retrieval-Augmented Generation) system that helps users navigate Clarity Chat documentation through natural language queries.

### ✨ Features

- **🎯 RAG-Powered Responses** - Semantic search across indexed documentation
- **⚡ Real-Time Streaming** - Token-by-token response updates via SSE
- **💾 Session Persistence** - 30-day conversation history
- **📚 Source Citations** - Automatic citations with relevance scores
- **🛡️ Rate Limiting** - 100 requests/minute per user
- **🔄 Dual-Mode Storage** - Development (local) + Production (cloud)
- **🤖 Multi-Model Support** - OpenAI GPT-4 & Anthropic Claude

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js 20+ installed
- pnpm package manager
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Step-by-Step Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp apps/docs/.env.example apps/docs/.env.local

# 3. Add your OpenAI API key to .env.local
# Edit apps/docs/.env.local and add:
# OPENAI_API_KEY=sk-proj-your-key-here

# 4. Index the documentation (generates embeddings)
pnpm index-docs:dry-run    # Preview what will be indexed (free)
pnpm index-docs            # Generate embeddings (~$0.001 cost)

# 5. Start the development server
pnpm docs

# 6. Test the assistant!
# Open: http://localhost:3000
# Click: "Ask AI" button (bottom-right corner)
# Try asking: "How do I implement streaming messages?"
```

**That's it!** The AI assistant is now running locally with:
- ✅ Local vector storage (no Pinecone needed)
- ✅ In-memory sessions (no Redis needed)
- ✅ Full RAG functionality

---

## 📁 Project Structure

```
apps/docs/
├── .env.example                    # Environment configuration template
├── package.json                    # Dependencies for AI assistant
│
├── components/AI/
│   ├── ChatButton.tsx              # Floating chat trigger button
│   └── DocsAssistant.tsx           # Main AI assistant UI component
│
├── lib/ai/
│   ├── embeddings.ts               # OpenAI embedding generation
│   ├── vectorStore.ts              # Vector storage (Pinecone/Local)
│   ├── rag.ts                      # RAG implementation
│   ├── streaming.ts                # SSE streaming utilities
│   ├── sessionStore.ts             # Session management (Redis/Local)
│   └── prompts.ts                  # System prompts & personality
│
└── app/api/docs-assistant/
    └── route.ts                    # Next.js API endpoint

scripts/
└── index-docs.ts                   # Documentation indexing script

docs/
├── PHASE_2_COMPLETE.md             # Feature completion summary
├── PHASE_2_TESTING_REPORT.md       # Testing & bug fixes
└── AI_ASSISTANT_SETUP.md           # Detailed setup guide
```

---

## 🔧 Configuration

### Environment Variables

All configuration is done through environment variables in `apps/docs/.env.local`:

#### Required (Minimum Setup)

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

This is the **only required variable** for local development.

#### Optional (Enhanced Features)

```env
# Use Claude instead of GPT-4
ANTHROPIC_API_KEY=sk-ant-your-key-here
AI_MODEL=claude-3-5-sonnet-20241022

# Production vector storage
PINECONE_API_KEY=your-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=clarity-docs

# Production session storage
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

See [.env.example](./apps/docs/.env.example) for complete configuration options.

---

## 📊 Development vs Production

### Development Mode (Default)

**When**: `NODE_ENV=development` or missing production credentials

**Storage**:
- Vectors: Local JSON file (`.vector-store.json`)
- Sessions: In-memory Map

**Advantages**:
- ✅ No external dependencies
- ✅ Zero additional cost
- ✅ Fast setup (5 minutes)
- ✅ Perfect for testing

**Limitations**:
- ⚠️ Vectors lost on rebuild
- ⚠️ Sessions lost on restart
- ⚠️ Single-server only

### Production Mode

**When**: `NODE_ENV=production` AND Pinecone/Redis credentials provided

**Storage**:
- Vectors: Pinecone (cloud vector database)
- Sessions: Upstash Redis (cloud key-value store)

**Advantages**:
- ✅ Persistent storage
- ✅ Scalable to millions of vectors
- ✅ Multi-server support
- ✅ 30-day session retention

**Costs**:
- Free tier: 1M Pinecone vectors + 10K Redis requests/day
- Typical: $15/month for 10K queries
- High usage: $225/month for 100K queries

---

## 🎯 Usage Examples

### Basic Question

**User**: "How do I get started with Clarity Chat?"

**AI Response**:
```
To get started with Clarity Chat, you'll need to install the package
and set up the basic components...

📚 Sources:
- Getting Started Guide (/guides/getting-started) (92% relevance)
- Installation (/guides/installation) (87% relevance)
```

### Technical Question

**User**: "How do I implement streaming messages?"

**AI Response**:
```tsx
To implement streaming messages, use the StreamingMessage component
with the useChat hook:

import { StreamingMessage, useChat } from '@clarity-chat/react'

function ChatApp() {
  const { messages, isLoading } = useChat({
    api: '/api/chat',
    streaming: true
  })

  return (
    <StreamingMessage
      message={messages[messages.length - 1]}
      isStreaming={isLoading}
    />
  )
}

📚 Sources:
- StreamingMessage API (/reference/components/streaming-message) (95%)
- Streaming Guide (/guides/streaming) (88%)
```

---

## 🔍 How It Works

### 1. Documentation Indexing

```bash
pnpm index-docs
```

**Process**:
1. Scans all documentation files (`.md`, `.mdx`, `page.tsx`)
2. Chunks content into ~1000 character segments
3. Generates embeddings using OpenAI (text-embedding-3-small)
4. Stores in vector database (Pinecone or local JSON)

**Output**:
```
📁 Found 87 documentation files
📦 Generated 234 chunks
💰 Estimated cost: $0.0012
🧠 Generating embeddings...
  ✓ Batch 1/3 complete
  ✓ Batch 2/3 complete
  ✓ Batch 3/3 complete
✅ Indexing complete! (12.3s)
📚 Vector store stats: 234 vectors, 1536 dimensions
```

### 2. User Query Flow

```
User Question
    ↓
Generate Query Embedding (100ms)
    ↓
Search Vector Store (50ms)
    ↓
Retrieve Top 5 Documents
    ↓
Build Context (10ms)
    ↓
Send to LLM with Context
    ↓
Stream Response Token-by-Token (2-5s)
    ↓
Save to Session (50ms)
    ↓
Display with Citations
```

### 3. RAG (Retrieval-Augmented Generation)

**Without RAG** (simple queries):
- User: "Hello!"
- AI: Responds using general knowledge
- No documentation retrieval needed

**With RAG** (technical queries):
- User: "How do I use the ChatWindow component?"
- System: Searches indexed docs for "ChatWindow component"
- Finds: ChatWindow API docs, examples, guides
- AI: Responds with retrieved context + citations

**Automatic Classification**:
The system automatically determines when to use RAG based on query patterns:
- ✅ RAG: "how", "what", "show me", "example"
- ❌ No RAG: "hi", "thanks", "hello"

---

## 🧪 Testing

### Manual Testing Checklist

```bash
# 1. Index docs
pnpm index-docs
# ✅ Should complete without errors
# ✅ Should show ~234 chunks indexed
# ✅ Should cost ~$0.001

# 2. Start dev server
pnpm docs
# ✅ Should start on http://localhost:3000

# 3. Test UI
# ✅ Chat button appears (bottom-right)
# ✅ Button has pulse animation
# ✅ Click opens chat window
# ✅ Empty state shows suggested questions

# 4. Test queries
Try these questions:
- "How do I get started?" (should use RAG)
- "What components are available?" (should use RAG)
- "Thanks!" (should not use RAG)

# ✅ Responses should stream token-by-token
# ✅ Citations should appear at the end
# ✅ Session should persist on refresh
```

### API Endpoint Testing

```bash
# Health check
curl http://localhost:3000/api/docs-assistant

# Expected response:
{
  "status": "ok",
  "service": "Clarity Chat Documentation Assistant",
  "version": "1.0.0",
  "features": {
    "rag": true,
    "streaming": true,
    "rateLimit": true
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "OPENAI_API_KEY is not set"

**Solution**:
```bash
# Ensure .env.local exists
ls apps/docs/.env.local

# Add API key
echo "OPENAI_API_KEY=sk-proj-your-key" >> apps/docs/.env.local

# Restart dev server
pnpm docs
```

#### 2. "No results found"

**Cause**: Documentation not indexed yet

**Solution**:
```bash
# Index the docs
pnpm index-docs

# Verify indexing
# Should see: "234 vectors indexed" (or similar)
```

#### 3. "Rate limit exceeded"

**Cause**: Too many requests in short time

**Solution**:
- Wait 60 seconds
- Or increase `RATE_LIMIT_MAX_REQUESTS` in `.env.local`

#### 4. "Session not persisting"

**Development**: Expected behavior (in-memory storage)

**Production**: Check Redis credentials in `.env.local`

#### 5. "Slow responses"

**Check**:
1. OpenAI API status
2. Network connection
3. Try Claude instead: `AI_MODEL=claude-3-5-sonnet-20241022`

---

## 💰 Cost Analysis

### Development

| Item | Cost | Frequency |
|------|------|-----------|
| Indexing | $0.001 | One-time |
| Queries | $0 | Unlimited (using local LLM) |
| **Total** | **$0.001** | **One-time** |

### Production (10K queries/month)

| Item | Cost/Month | Provider |
|------|------------|----------|
| Embeddings | $0.20 | OpenAI |
| LLM (GPT-4) | $15.00 | OpenAI |
| Vector DB | $0 | Pinecone (free tier) |
| Sessions | $0 | Upstash (free tier) |
| **Total** | **~$15/month** | - |

### Production (100K queries/month)

| Item | Cost/Month | Provider |
|------|------------|----------|
| Embeddings | $2.00 | OpenAI |
| LLM (GPT-4) | $150.00 | OpenAI |
| Vector DB | $70.00 | Pinecone (paid tier) |
| Sessions | $5.00 | Upstash |
| **Total** | **~$225/month** | - |

### Cost Optimization Tips

1. **Use Claude** - $0.001 per query vs $0.0015 for GPT-4
2. **Implement Caching** - Cache common queries for 24h
3. **Batch Indexing** - Only re-index changed docs
4. **Use Free Tiers** - Pinecone (1M vectors) + Upstash (10K requests/day)

---

## 🚀 Production Deployment

### 1. Set Up External Services

**Upstash Redis** (Session Storage):
1. Go to https://console.upstash.com/
2. Create new Redis database
3. Copy REST URL and token
4. Add to `.env.local`

**Pinecone** (Vector Database):
1. Go to https://www.pinecone.io/
2. Create new index:
   - Name: `clarity-docs`
   - Dimensions: `1536`
   - Metric: `cosine`
3. Copy API key and environment
4. Add to `.env.local`

### 2. Configure Environment

```env
# Production .env.local
OPENAI_API_KEY=sk-proj-your-key
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=clarity-docs
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NODE_ENV=production
```

### 3. Index Documentation

```bash
# Clear and re-index for production
pnpm index-docs:clear

# Verify indexing completed
# Should see: "234 vectors indexed to Pinecone"
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables → Add all vars from .env.local
```

### 5. Post-Deployment

1. **Test**: Visit your deployment URL, test AI assistant
2. **Monitor**: Set up Sentry or similar for error tracking
3. **Billing**: Configure billing alerts in OpenAI/Pinecone
4. **Scale**: Monitor usage, adjust rate limits as needed

---

## 📈 Performance

### Latency Breakdown

| Operation | Time | Notes |
|-----------|------|-------|
| Query embedding | ~100ms | OpenAI API call |
| Vector search | <50ms | Pinecone or local |
| Context building | ~10ms | In-memory processing |
| LLM first token | ~500ms | GPT-4 Turbo |
| Full response | 2-5s | Streaming makes it feel instant |
| Session save | ~50ms | Redis write |
| **Total** | **2-6s** | **Perceived as instant** |

### Optimizations Applied

- ✅ Edge runtime (faster cold starts)
- ✅ Streaming responses (instant feedback)
- ✅ Batch embedding generation
- ✅ Vector search caching
- ✅ Connection pooling (Redis)
- ✅ Request validation (prevents abuse)

---

## 🔒 Security

### Built-In Protections

- ✅ **Rate Limiting**: 100 requests/minute per user/IP
- ✅ **Token Limits**: 10K tokens max per request
- ✅ **Request Validation**: Message format and size checks
- ✅ **Error Sanitization**: No sensitive data in errors
- ✅ **CORS Handling**: Configured for production
- ✅ **Edge Runtime**: Isolated execution environment

### Best Practices

1. **Never commit** `.env.local` to git
2. **Rotate API keys** regularly
3. **Monitor usage** for anomalies
4. **Set billing alerts** in provider dashboards
5. **Use environment-specific** keys (dev vs prod)

---

## 📚 Additional Resources

### Documentation

- [Phase 2 Completion Summary](../../docs/PHASE_2_COMPLETE.md)
- [Testing Report](../../docs/PHASE_2_TESTING_REPORT.md)
- [Detailed Setup Guide](../../docs/AI_ASSISTANT_SETUP.md)

### API References

- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)

### Support

- **GitHub Issues**: [Report a bug](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Documentation**: Browse docs at http://localhost:3000
- **Examples**: Check `/examples` directory

---

## ✨ What's Next?

### Optional Enhancements

- [ ] **User Feedback** - Add thumbs up/down for responses
- [ ] **Response Caching** - Cache common queries for 24h
- [ ] **Analytics** - Track usage patterns and popular queries
- [ ] **Conversation Export** - Let users download chat history
- [ ] **Multi-Language** - Support for non-English docs
- [ ] **Voice Input** - Speech-to-text for questions

### Future Features (V2)

- [ ] **Multi-Turn Context** - Maintain context across multiple questions
- [ ] **Code Execution** - Run example code in sandbox
- [ ] **Interactive Examples** - Editable code snippets
- [ ] **User Authentication** - Personalized experiences
- [ ] **Cross-Device Sync** - Continue conversations on any device
- [ ] **Team Collaboration** - Share conversations with team members

---

## 🙏 Credits

**Built with**:
- OpenAI GPT-4 & Embeddings API
- Anthropic Claude 3.5 Sonnet
- Pinecone Vector Database
- Upstash Redis
- Next.js 15 & React 19
- Framer Motion
- TypeScript

**Powered by**: Clarity Chat component library (dogfooding!)

---

## 📄 License

MIT License - Part of the Clarity Chat project

**Author**: Christi Reid
**Organization**: Code & Clarity
**Repository**: [GitHub](https://github.com/christireid/Clarity-ai-chat-components)

---

**The AI Documentation Assistant is production-ready and waiting for you to test it!** 🚀

Start with `pnpm install` and you'll be chatting with AI in 5 minutes.
