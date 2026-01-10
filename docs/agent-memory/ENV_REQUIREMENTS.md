# Environment Requirements

## Required API Keys

### OPENAI_API_KEY
- **Required for:** OpenAI provider demos, AI assistant (if OpenAI mode)
- **Fallback:** Shows "Setup Required" card with instructions
- **Demo routes affected:** All OpenAI-specific demos

### ANTHROPIC_API_KEY
- **Required for:** Claude/Anthropic provider demos, AI assistant (if Anthropic mode)
- **Fallback:** Shows "Setup Required" card with instructions
- **Demo routes affected:** All Anthropic-specific demos

### GOOGLE_API_KEY (or GEMINI_API_KEY)
- **Required for:** Gemini provider demos
- **Fallback:** Shows "Setup Required" card with instructions
- **Demo routes affected:** All Gemini-specific demos

## Optional Variables

### RAG_INDEX_PATH
- **Purpose:** Path to RAG index for docs assistant
- **Default:** ./data/docs-index
- **Behavior if missing:** Assistant operates without RAG context

### DOCS_SEARCH_ENABLED
- **Purpose:** Enable/disable docs search feature
- **Default:** true
- **Behavior if missing:** Search enabled by default

## Graceful Fallback Behavior

When API keys are missing:
1. Show clear "Setup Required" card
2. Display which key is needed
3. Provide link to setup guide
4. Do NOT silently fail
5. Do NOT show error states that look like bugs

## Local Development Setup

```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

## Provider Priority (for assistant)
1. ANTHROPIC_API_KEY (preferred)
2. OPENAI_API_KEY (fallback)
3. GOOGLE_API_KEY (secondary fallback)
4. Mock mode (if all missing)
