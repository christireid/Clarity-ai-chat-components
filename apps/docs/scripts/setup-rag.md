# RAG System Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) system for the docs assistant.

## Prerequisites

1. **OpenAI API Key** (required for embeddings)
   - Get one at: https://platform.openai.com/api-keys
   - Used for generating document embeddings

2. **LLM API Key** (choose one):
   - **OpenAI API Key** (same as above, or different)
   - **Anthropic API Key**: https://console.anthropic.com/
   - **Google Gemini API Key**: https://aistudio.google.com/app/apikey

## Setup Steps

### 1. Configure API Keys

Edit `.env.local` in the `apps/docs` directory:

```bash
# Required for embeddings
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Choose one or more for LLM responses:
# Option 1: Use OpenAI
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Option 2: Use Anthropic Claude (recommended for better RAG)
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here

# Option 3: Use Google Gemini
GEMINI_API_KEY=your-actual-gemini-key-here

# Optional: Specify which model to use
AI_MODEL=gpt-4-turbo-preview  # or claude-3-5-sonnet-20241022, gemini-1.5-pro, etc.
```

### 2. Index Documentation

First, create the keyword search index:

```bash
npm run index-docs
```

This creates `lib/ai/docs-index.json` with all documentation chunks.

### 3. Generate Embeddings

Generate embeddings and store them in the vector store:

```bash
npm run index-embeddings
```

This will:
- Read the documentation index
- Generate embeddings for each chunk using OpenAI
- Store them in the local vector store (`.vector-store.json`)

**Note**: This requires a valid `OPENAI_API_KEY`. The process may take a few minutes depending on the number of documents.

### 4. Verify Setup

Check that everything is working:

```bash
# Check if index exists
ls -lh lib/ai/docs-index.json

# Check if vector store exists
ls -lh .vector-store.json
```

### 5. Test the Assistant

Start the dev server and test the assistant:

```bash
npm run dev
```

The assistant should now:
- Use RAG to retrieve relevant documentation
- Generate responses based on the indexed content
- Show citations to source documents

## Production Setup (Optional)

For production, you can use Pinecone instead of local storage:

1. Get a Pinecone API key: https://www.pinecone.io/
2. Add to `.env.local`:
   ```bash
   PINECONE_API_KEY=your-pinecone-key
   PINECONE_ENVIRONMENT=us-east-1
   ```
3. Set `NODE_ENV=production` when running the embedding indexer

## Troubleshooting

### "No valid API keys configured - using demo mode"

- Make sure your API keys in `.env.local` are not placeholders
- Restart the dev server after updating `.env.local`
- Check that the keys don't contain `your-` or `placeholder` strings

### "Failed to generate embedding"

- Verify your `OPENAI_API_KEY` is valid
- Check your OpenAI account has credits/quota
- Ensure the key has access to the `text-embedding-3-small` model

### "Vector store is empty"

- Run `npm run index-embeddings` to populate it
- Check that `.vector-store.json` was created
- Verify the embedding generation completed successfully

### Assistant not using RAG

- Check that `ENHANCED_RAG` is not set to `false` in `.env.local`
- Verify the vector store has been populated
- Check server logs for RAG-related errors

## Features Enabled

With RAG properly configured, the assistant will:

✅ **Enhanced RAG** (default): Hybrid search with keyword + semantic search
✅ **Reciprocal Rank Fusion (RRF)**: Combines multiple search results
✅ **MMR (Maximal Marginal Relevance)**: Ensures diverse results
✅ **Reranking**: Improves result precision
✅ **Conversation Context**: Understands follow-up questions
✅ **Source Citations**: Shows where information came from

## Next Steps

- Monitor the assistant's responses for accuracy
- Update the index when documentation changes: `npm run index-all`
- Fine-tune RAG parameters in `apps/docs/app/api/docs-assistant/route.ts`
