# AI Documentation Assistant - Setup Guide

This guide walks you through setting up the AI-powered documentation assistant for Clarity Chat.

## Phase 2.2: Documentation Indexing

### Prerequisites

1. **Node.js 20+** and **pnpm** installed
2. **OpenAI API key** (for embeddings)
3. **Pinecone account** (production) OR local development mode

### Step 1: Install Dependencies

```bash
# Install required dependencies
pnpm add openai @pinecone-database/pinecone gray-matter tsx

# Or add them individually
pnpm add openai                        # OpenAI API client
pnpm add @pinecone-database/pinecone   # Pinecone vector database
pnpm add gray-matter                    # Parse frontmatter in MD/MDX
pnpm add tsx                            # Run TypeScript scripts
```

### Step 2: Configure Environment Variables

Copy the `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

**Minimum required for indexing:**

```env
# OpenAI API Key (Required for embeddings)
OPENAI_API_KEY=sk-proj-...

# Pinecone (Optional - uses local store if not provided)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=clarity-docs
```

### Step 3: Run the Indexing Script

#### Option A: Dry Run (Preview)

See what would be indexed without actually generating embeddings:

```bash
pnpm index-docs:dry-run
```

**Output:**
```
🚀 Starting documentation indexing...

📁 Scanning documentation directories...
  ✓ apps/docs/app/reference/components: 42 files
  ✓ apps/docs/app/reference/hooks: 18 files
  ✓ apps/docs/app/guides: 12 files
  ✓ apps/docs/app/cookbook: 8 files
  ✓ apps/docs/app/examples: 15 files
  ✓ docs: 5 files

📄 Found 100 documentation files

📝 Processing files and generating chunks...
  ✓ apps/docs/app/reference/components/button/page.tsx: 3 chunks
  [...]

📦 Generated 287 chunks

💰 Estimated cost: $0.0012 (1,435 tokens)

🏃 Dry run complete - no embeddings generated
```

#### Option B: Index with Existing Data

Index all docs (keeps existing vectors):

```bash
pnpm index-docs
```

#### Option C: Fresh Index (Clear First)

Clear all existing vectors and re-index from scratch:

```bash
pnpm index-docs:clear
```

**Expected output:**
```
🚀 Starting documentation indexing...

Using local vector store (development mode)

🗑️  Clearing existing index...

📁 Scanning documentation directories...
[...]

🧠 Generating embeddings...
  Processing batch 1/3...
  ✓ Batch 1 complete
  Processing batch 2/3...
  ✓ Batch 2 complete
  Processing batch 3/3...
  ✓ Batch 3 complete

✅ Indexing complete!

📊 Statistics:
  Files processed: 100
  Chunks created: 287
  Total tokens: 1,435
  Estimated cost: $0.0012
  Time elapsed: 12.43s

📚 Vector store stats:
  Total vectors: 287
  Dimensions: 1536

🎉 Done!
```

### Development Mode (No Pinecone)

If you don't have Pinecone configured, the system automatically uses a local vector store:

- Vectors are stored in `.vector-store.json` in the project root
- Perfect for development and testing
- No external dependencies required

### Production Mode (Pinecone)

For production use, set up Pinecone:

1. **Create account**: https://www.pinecone.io/
2. **Create index**:
   - Name: `clarity-docs`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Environment: `us-east-1-aws` (or your preferred region)
3. **Add credentials** to `.env.local`
4. **Run indexing**: `pnpm index-docs:clear`

### Troubleshooting

#### Error: "OPENAI_API_KEY environment variable is not set"

**Solution:** Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

Get your API key from: https://platform.openai.com/api-keys

#### Error: "PINECONE_API_KEY environment variable is not set"

This is just a warning. The system will use local storage instead. If you want to use Pinecone:

1. Sign up at https://www.pinecone.io/
2. Create an index with dimensions=1536, metric=cosine
3. Add credentials to `.env.local`

#### Warning: "Could not read directory"

Some directories might not exist yet. This is normal. The script skips missing directories automatically.

#### Error: Rate limit exceeded

If you're processing a large number of docs and hit OpenAI's rate limit:

1. Wait a few minutes
2. Re-run the script - it will resume from where it left off
3. Consider upgrading your OpenAI plan for higher limits

### Performance Tips

#### Chunking Configuration

Edit `scripts/index-docs.ts` to adjust chunk sizes:

```typescript
const chunks = chunkText(cleanContent, {
  maxChunkSize: 1000,  // Increase for larger chunks (fewer chunks)
  overlap: 200,         // Increase for more context overlap
  splitOnSentences: true // Keep true for better readability
})
```

**Trade-offs:**
- **Larger chunks** (1500+): Fewer API calls, more context, potentially less precise
- **Smaller chunks** (500-): More API calls, more precise, less context
- **Recommended**: 800-1200 characters per chunk

#### Batch Processing

The script processes embeddings in batches of 100 to optimize API usage:

```typescript
const batchSize = 100 // Adjust if needed
```

#### Cost Optimization

To minimize costs during development:

1. Use `--dry-run` first to estimate costs
2. Test with a subset of docs (comment out directories in `DOC_DIRS`)
3. Use `text-embedding-3-small` (default) instead of `text-embedding-3-large`

### Next Steps

After indexing is complete:

1. **✅ Phase 2.2 Complete!** - Your docs are now indexed
2. **➡️ Phase 2.3**: Build the API endpoint for RAG-powered responses
3. **➡️ Phase 2.4**: Connect the UI to the API
4. **➡️ Phase 2.5**: Add session memory with Redis

### File Structure

```
apps/docs/lib/ai/
├── embeddings.ts       # Embedding generation utilities
├── vectorStore.ts      # Vector store interface (Pinecone + Local)
└── prompts.ts          # System prompts

scripts/
└── index-docs.ts       # Main indexing script

.vector-store.json      # Local vector store (gitignored)
```

### API Reference

#### embeddings.ts

```typescript
// Generate single embedding
const embedding = await generateEmbedding(text)

// Generate batch embeddings (more efficient)
const embeddings = await generateEmbeddingsBatch(texts)

// Chunk large text
const chunks = chunkText(text, { maxChunkSize: 1000, overlap: 200 })

// Calculate similarity
const score = cosineSimilarity(embedding1, embedding2)
```

#### vectorStore.ts

```typescript
// Get vector store (auto-selects Pinecone or Local)
const store = getVectorStore()

// Initialize
await store.initialize()

// Store embeddings
await store.upsertBatch(chunks)

// Search
const results = await store.search(queryEmbedding, topK: 5)

// Get stats
const stats = await store.getStats()
```

### Maintenance

#### Re-indexing

Run whenever documentation is updated:

```bash
# Update existing vectors (fast)
pnpm index-docs

# Full re-index (slower, but ensures no stale data)
pnpm index-docs:clear
```

#### Automated Re-indexing

Add to your CI/CD pipeline:

```yaml
# .github/workflows/index-docs.yml
name: Index Documentation
on:
  push:
    paths:
      - 'apps/docs/**'
      - 'docs/**'

jobs:
  index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm index-docs
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PINECONE_API_KEY: ${{ secrets.PINECONE_API_KEY }}
```

### Cost Estimates

Based on OpenAI pricing (as of 2024):

| Docs Size | Tokens | Cost (Initial) | Cost (Monthly Re-index) |
|-----------|--------|----------------|------------------------|
| Small (50 files) | ~500K | $0.01 | ~$0.05 |
| Medium (100 files) | ~1M | $0.02 | ~$0.10 |
| Large (500 files) | ~5M | $0.10 | ~$0.50 |

**Notes:**
- Costs are for embeddings only (using text-embedding-3-small)
- Re-indexing is typically cheaper as you only update changed files
- Pinecone free tier includes 1M vectors

### Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [.env.example](.env.example) file
3. Open an issue on GitHub
4. Join our Discord community

---

**Next**: [Phase 2.3 - API Endpoint](./PHASE_2_3_API_ENDPOINT.md)
