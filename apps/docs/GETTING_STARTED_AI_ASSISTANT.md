# 🚀 Getting Started with AI Documentation Assistant

**Estimated Time**: 5 minutes
**Prerequisites**: OpenAI API key
**Status**: Ready to launch!

---

## ✅ Pre-Flight Checklist

Everything you need is already set up:

- ✅ All code implemented (16 files)
- ✅ All dependencies configured (`package.json`)
- ✅ Environment template ready (`.env.example`)
- ✅ Documentation complete (3 comprehensive guides)
- ✅ Testing completed (1 bug found & fixed)
- ✅ All commits pushed to GitHub

**You're just 5 commands away from a fully functional AI assistant!**

---

## 🎯 Quick Start (Copy & Paste)

### Step 1: Install Dependencies (30 seconds)

```bash
pnpm install
```

**What this does**: Installs all AI assistant dependencies:
- `openai` - For GPT-4 and embeddings
- `@anthropic-ai/sdk` - For Claude (optional)
- `@pinecone-database/pinecone` - For vector database
- `@upstash/redis` - For session storage
- `gray-matter`, `uuid`, `tsx` - Utilities

**Expected output**:
```
✓ All dependencies installed successfully
```

---

### Step 2: Configure Environment (30 seconds)

```bash
# Copy template
cp apps/docs/.env.example apps/docs/.env.local

# Add your OpenAI API key (replace with your actual key)
echo 'OPENAI_API_KEY=sk-proj-your-actual-key-here' >> apps/docs/.env.local
```

**Get your API key**: https://platform.openai.com/api-keys

**What you need**:
- ✅ OpenAI API key (required)
- ⬜ Anthropic API key (optional - for Claude)
- ⬜ Pinecone credentials (optional - for production)
- ⬜ Upstash Redis credentials (optional - for production)

**For local testing, only OpenAI API key is required!**

---

### Step 3: Index Documentation (1 minute)

```bash
# Preview what will be indexed (free)
pnpm index-docs:dry-run

# Generate embeddings (costs ~$0.001)
pnpm index-docs
```

**Expected output**:
```
🚀 Starting documentation indexing...

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

**What this does**:
1. Scans all `.md`, `.mdx`, and `page.tsx` files
2. Chunks content into ~1000 character segments
3. Generates embeddings using OpenAI
4. Stores in local JSON file (`.vector-store.json`)

---

### Step 4: Start Development Server (10 seconds)

```bash
pnpm docs
```

**Expected output**:
```
> next dev

  ▲ Next.js 15.1.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

✓ Ready in 2.3s
```

---

### Step 5: Test the AI Assistant! (2 minutes)

1. **Open your browser**: http://localhost:3000

2. **Look for the AI button**:
   - Bottom-right corner
   - Purple gradient button
   - Says "Ask AI"
   - Has a pulse animation

3. **Click to open the chat window**

4. **Try these test questions**:

   **Test 1 - Basic RAG Query**:
   ```
   How do I get started with Clarity Chat?
   ```
   **Expected**: Should return answer with citations from docs

   **Test 2 - Technical Query**:
   ```
   How do I implement streaming messages?
   ```
   **Expected**: Should include code example with citations

   **Test 3 - Component Query**:
   ```
   What components are available?
   ```
   **Expected**: Should list components with links to docs

   **Test 4 - Simple Greeting**:
   ```
   Hello!
   ```
   **Expected**: Friendly greeting (no citations needed)

5. **Verify features work**:
   - ✅ Responses stream word-by-word (not all at once)
   - ✅ Citations appear at bottom with relevance %
   - ✅ Session persists on page refresh
   - ✅ Escape key closes the chat
   - ✅ Suggested questions work

---

## 🎉 Success Indicators

### ✅ You'll know it's working when:

1. **Chat button appears** (bottom-right corner)
2. **Button animates** (pulse effect)
3. **Chat opens smoothly** (animated slide-in)
4. **Messages stream** (text appears word-by-word)
5. **Citations show** (📚 Sources at bottom)
6. **Session persists** (refresh page, conversation remains)

### ❌ If something's not working:

**Problem**: Chat button doesn't appear
- **Solution**: Check console for errors, verify imports in `layout.tsx`

**Problem**: "OPENAI_API_KEY is not set"
- **Solution**: Check `.env.local` file exists and has your key

**Problem**: "No results found"
- **Solution**: Run `pnpm index-docs` to index documentation

**Problem**: Responses are slow
- **Solution**: Normal! First token takes ~500ms, streaming makes it feel fast

**Problem**: Session doesn't persist
- **Solution**: Expected in development (uses in-memory storage)

---

## 🔍 Debugging Commands

```bash
# Check if .env.local exists
ls -la apps/docs/.env.local

# Check if vector store was created
ls -la .vector-store.json

# View indexing stats
cat .vector-store.json | jq 'keys | length'  # Count vectors

# Test API endpoint directly
curl http://localhost:3000/api/docs-assistant

# Check dev server logs
pnpm docs  # Watch console for errors
```

---

## 📊 What Happens Behind the Scenes

### When you ask a question:

```
1. User types: "How do I use ChatWindow?"
   ↓
2. Generate query embedding (100ms)
   OpenAI API: text-embedding-3-small
   ↓
3. Search vector store (50ms)
   Find 5 most similar documentation chunks
   ↓
4. Build context (10ms)
   Combine retrieved docs into prompt
   ↓
5. Stream response (2-5s)
   GPT-4 generates answer token-by-token
   ↓
6. Save session (50ms)
   Store conversation for 30 days
   ↓
7. Display with citations
   Show sources with relevance scores
```

**Total time**: 2-6 seconds (feels instant due to streaming!)

---

## 💰 Cost Breakdown

### What you just spent:

- **Indexing**: ~$0.001 (one-time)
- **Your first query**: ~$0.0015 (if using GPT-4)

### Ongoing costs (estimates):

**Light usage** (10 queries/day):
- ~$0.50/month

**Medium usage** (100 queries/day):
- ~$5/month

**Heavy usage** (1000 queries/day):
- ~$50/month

**Want to reduce costs?**
- Use Claude instead: Set `AI_MODEL=claude-3-5-sonnet-20241022`
- Implement caching (coming in V2)
- Use smaller embedding model

---

## 🚀 Next Steps

### Now that it's working:

1. **Test with real questions**
   - Ask about your actual use cases
   - Verify answers are accurate
   - Check citation quality

2. **Customize the prompts** (optional)
   - Edit `apps/docs/lib/ai/prompts.ts`
   - Adjust personality and tone
   - Add project-specific context

3. **Deploy to staging**
   - Set up Upstash Redis
   - Set up Pinecone
   - Deploy to Vercel preview

4. **Gather feedback**
   - Share with team
   - Monitor usage patterns
   - Identify gaps in documentation

---

## 📚 Additional Documentation

Need more details? Check these guides:

1. **[AI_ASSISTANT_README.md](./AI_ASSISTANT_README.md)**
   - Complete reference guide
   - Production deployment
   - Advanced configuration

2. **[PHASE_2_COMPLETE.md](../../docs/PHASE_2_COMPLETE.md)**
   - Feature overview
   - Architecture details
   - Cost analysis

3. **[PHASE_2_TESTING_REPORT.md](../../docs/PHASE_2_TESTING_REPORT.md)**
   - Testing methodology
   - Bug fixes
   - Performance metrics

---

## 🎯 Quick Reference Commands

```bash
# Install
pnpm install

# Configure
cp apps/docs/.env.example apps/docs/.env.local
# Then edit .env.local to add OPENAI_API_KEY

# Index docs
pnpm index-docs:dry-run   # Preview (free)
pnpm index-docs           # Generate embeddings (~$0.001)
pnpm index-docs:clear     # Clear and re-index

# Run
pnpm docs                 # Start dev server

# Test
curl http://localhost:3000/api/docs-assistant  # Health check
```

---

## ✨ You're All Set!

The AI Documentation Assistant is now running and ready to help your users navigate the Clarity Chat documentation.

**What's next?**
- Start testing with real questions
- Customize prompts for your needs
- Deploy to production when ready

**Need help?**
- Check [AI_ASSISTANT_README.md](./AI_ASSISTANT_README.md)
- Review [PHASE_2_TESTING_REPORT.md](../../docs/PHASE_2_TESTING_REPORT.md)
- Open an issue on GitHub

---

**Enjoy your AI-powered documentation! 🚀**
