# API Keys Setup for Docs Assistant

## Overview

The docs assistant uses **RAG (Retrieval-Augmented Generation)** which combines:
1. **Document Retrieval** - Searches your documentation
2. **LLM Generation** - Generates responses using AI models

## Required API Keys

### For Full RAG + LLM Functionality

**You only need ONE OpenAI API key** for both RAG and LLM:

```bash
OPENAI_API_KEY=sk-your-openai-key-here
```

This single key is used for:
- ✅ **RAG Semantic Search**: Generating embeddings for document search
- ✅ **LLM Generation**: Generating AI responses (using GPT models)

### Optional: Alternative LLM Providers

If you want to use a different LLM provider for generation (while still using OpenAI for RAG embeddings):

```bash
# Option 1: Use Anthropic Claude for LLM (still needs OpenAI for RAG)
OPENAI_API_KEY=sk-your-openai-key-here  # Required for RAG embeddings
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key  # Optional, for Claude LLM

# Option 2: Use Google Gemini for LLM (still needs OpenAI for RAG)
OPENAI_API_KEY=sk-your-openai-key-here  # Required for RAG embeddings
GEMINI_API_KEY=your-gemini-key  # Optional, for Gemini LLM
```

## How It Works

### RAG System

1. **Keyword Search** (No API needed)
   - Fast, free text search
   - Works without any API keys
   - Used first for speed

2. **Semantic Search** (Requires `OPENAI_API_KEY`)
   - Uses OpenAI embeddings API
   - More accurate for complex queries
   - Falls back to keyword search if no key

3. **Enhanced RAG** (Requires `OPENAI_API_KEY`)
   - Hybrid search (keyword + semantic)
   - Better accuracy and relevance
   - Enabled by default

### LLM Generation

The system will use:
1. **OpenAI** (if `OPENAI_API_KEY` is set) - Default
2. **Anthropic Claude** (if `ANTHROPIC_API_KEY` is set and model is Claude)
3. **Google Gemini** (if `GEMINI_API_KEY` is set and model is Gemini)
4. **Demo Mode** (if no keys are set) - Limited responses

## Setup Instructions

1. **Get an OpenAI API Key**:
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Add to `.env.local`**:
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Cost Considerations

- **RAG Embeddings**: ~$0.02 per 1M tokens (very cheap)
- **LLM Generation**: Varies by model (GPT-4 is more expensive than GPT-3.5)
- **Keyword Search**: Free (no API calls)

## Testing Your Setup

After adding your API key, test it:

1. Open the docs assistant
2. Ask a question like "How do I install Clarity Chat?"
3. You should see:
   - ✅ RAG-powered responses with sources
   - ✅ Accurate documentation references
   - ✅ No "Demo Mode" warnings

## Troubleshooting

### "Demo Mode Active" Warning

**Problem**: No valid API keys detected

**Solution**: 
- Check `.env.local` exists and has `OPENAI_API_KEY=sk-...`
- Ensure the key is valid (not a placeholder)
- Restart the dev server after adding the key

### RAG Not Working

**Problem**: Only keyword search, no semantic search

**Solution**:
- Ensure `OPENAI_API_KEY` is set correctly
- Check that embeddings were indexed: `npm run index-all`
- Verify the key has access to embeddings API

### LLM Not Responding

**Problem**: Messages sent but no response

**Solution**:
- Check API key validity
- Verify you have credits/quota on your OpenAI account
- Check browser console for errors
- Ensure the API route is accessible

## Summary

**You only need ONE OpenAI API key** for full RAG + LLM functionality. The same key is used for both:
- Generating embeddings (RAG semantic search)
- Generating responses (LLM)

No separate keys needed unless you want to use a different LLM provider (Claude/Gemini) for generation.
