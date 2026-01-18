# Testing RAG + OpenAI Configuration

## Current Status

✅ **API Key Configured**: OpenAI API key is set in `.env.local`
✅ **Keyword Index**: Exists (5.6MB) - Fast text search working
⚠️ **Embeddings**: Not yet indexed - Semantic search will use query embeddings only

## How Dual RAG Works

The enhanced RAG system uses **hybrid search** combining:

1. **Keyword Search** (✅ Working)
   - Fast text-based search
   - No API calls needed
   - Finds exact matches, function names, etc.

2. **Semantic Search** (⚠️ Partial)
   - Uses OpenAI embeddings API
   - Generates query embeddings on-the-fly
   - Will search existing embeddings if indexed
   - Falls back gracefully if no embeddings exist

3. **Reciprocal Rank Fusion (RRF)**
   - Combines keyword + semantic results
   - Weighted: 40% keyword, 60% semantic
   - Better accuracy than either alone

## Testing the System

### Test 1: Basic Query (Keyword-Only Mode)

Since embeddings aren't indexed yet, the system will:
- ✅ Use keyword search (fast, working)
- ⚠️ Try semantic search (will generate query embedding, but find no results)
- ✅ Combine results using RRF (will use keyword results primarily)

**Expected Behavior:**
- Responses should work
- Sources should be found via keyword search
- Citations should appear

### Test 2: After Indexing Embeddings

Once you run `npm run index-embeddings`:
- ✅ Full hybrid search enabled
- ✅ Better semantic matching
- ✅ More accurate results

## Current Configuration

- **Enhanced RAG**: Enabled (default)
- **Keyword Search**: ✅ Working
- **Semantic Search**: ⚠️ Query embeddings only (no document embeddings yet)
- **RRF**: ✅ Enabled
- **Reranking**: ✅ Enabled
- **MMR**: ✅ Enabled

## Next Steps

1. **Test current setup** (keyword-only mode)
2. **Index embeddings** for full semantic search: `npm run index-embeddings`
3. **Test again** with full hybrid search

## API Key Usage

Your OpenAI API key is used for:
- ✅ **Query Embeddings**: Generated on-the-fly for each query (semantic search)
- ✅ **LLM Generation**: GPT models for responses
- ⚠️ **Document Embeddings**: Not yet generated (run `index-embeddings`)

Even without document embeddings, the system works with:
- Keyword search (fast, accurate for exact terms)
- Query embeddings (semantic understanding of user questions)
- LLM generation (AI responses)
