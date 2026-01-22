# AI Service Integration Mapping

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 1 - Service Integration Mapping

## Overview

This document maps all AI service integrations, supported providers, models, and API endpoint patterns in the Clarity Chat library.

## Supported AI Providers

### 1. OpenAI

**Provider Identifier**: `openai`

**API Configuration**:
- Endpoint Pattern: `/api/llm/openai` or custom proxy endpoint
- Authentication: API key via `OPENAI_API_KEY` environment variable
- Adapter: `createOpenAIAdapter` (`packages/react/src/hooks/clarity-tokens/adapters/openai.ts`)

**Supported Models**:
- `gpt-4o` - Latest GPT-4 optimized model (200K context)
- `gpt-4o-mini` - Smaller, faster GPT-4o variant
- `gpt-4` - GPT-4 base model (8K context)
- `gpt-4-turbo` - GPT-4 Turbo (128K context)
- `gpt-3.5-turbo` - GPT-3.5 Turbo (16K context)
- `o1` - Reasoning model
- `o1-mini` - Smaller reasoning model
- `o1-preview` - Preview reasoning model
- `o3-mini` - O3 mini reasoning model

**Token Counting**:
- Uses `gpt-tokenizer` library (99%+ accuracy)
- Encoding: `o200k_base` for GPT-4o/o-series, `cl100k_base` for GPT-4/GPT-3.5
- Client-side counting (no API calls needed)

**API Features**:
- Streaming support (SSE)
- Function calling
- JSON mode
- Vision capabilities (GPT-4o, GPT-4 Turbo)
- System messages

**Components Using OpenAI**:
- All chat components (via adapters)
- Token counting components
- Model selector

**Hooks Using OpenAI**:
- `useClarityChat` (via adapter)
- `useTokenCounter` (for token counting)
- `useAssistant` (OpenAI Assistant API)

### 2. Anthropic (Claude)

**Provider Identifier**: `anthropic`

**API Configuration**:
- Endpoint Pattern: `/api/llm/anthropic` or custom proxy endpoint
- Authentication: API key via `ANTHROPIC_API_KEY` environment variable
- Adapter: `createAnthropicAdapter` (`packages/react/src/hooks/clarity-tokens/adapters/anthropic.ts`)

**Supported Models**:
- `claude-3-5-sonnet` - Claude 3.5 Sonnet (200K context)
- `claude-3-5-haiku` - Claude 3.5 Haiku (200K context)
- `claude-3-opus` - Claude 3 Opus (200K context)
- `claude-3-sonnet` - Claude 3 Sonnet (200K context)
- `claude-3-haiku` - Claude 3 Haiku (200K context)
- `claude-sonnet-4` - Claude Sonnet 4
- `claude-opus-4` - Claude Opus 4

**Token Counting**:
- Uses estimation (no public tokenizer available)
- Estimation based on character count (~3.8 chars per token)
- Uses `gpt-tokenizer` with `cl100k_base` as proxy (~90% accuracy)
- Server-side counting available via API (not implemented in client)

**API Features**:
- Streaming support (SSE)
- System messages (separate parameter)
- Long context windows (200K tokens)
- Vision capabilities
- Tool use (function calling)

**Components Using Anthropic**:
- All chat components (via adapters)
- Token counting components (with estimation)
- Model selector

**Hooks Using Anthropic**:
- `useClarityChat` (via adapter)
- `useTokenCounter` (with estimation)
- `useAssistant` (if Anthropic Assistant API supported)

### 3. Google (Gemini)

**Provider Identifier**: `google`

**API Configuration**:
- Endpoint Pattern: `/api/llm/google` or custom proxy endpoint
- Authentication: API key via `GOOGLE_AI_API_KEY` or `GEMINI_API_KEY` environment variable
- Adapter: Not yet implemented in clarity-tokens adapters (planned)

**Supported Models**:
- `gemini-1.5-pro` - Gemini 1.5 Pro (large context)
- `gemini-1.5-flash` - Gemini 1.5 Flash (faster)
- `gemini-pro` - Gemini Pro
- `gemini-2.0-flash` - Gemini 2.0 Flash
- `gemini-2.0-pro` - Gemini 2.0 Pro

**Token Counting**:
- Uses estimation (no public tokenizer available)
- Estimation based on character count (~4 chars per token)
- Server-side counting available via API (`countTokens` endpoint)
- Uses `gpt-tokenizer` with `cl100k_base` as proxy (~90% accuracy)

**API Features**:
- Streaming support
- Function calling
- Vision capabilities
- Multi-modal support

**Components Using Google**:
- All chat components (via adapters when implemented)
- Model selector

**Hooks Using Google**:
- `useClarityChat` (via adapter when implemented)
- `useTokenCounter` (with estimation)

### 4. Other Providers

**DeepSeek**:
- Models: `deepseek-chat`, `deepseek-coder`, `deepseek-r1`
- Token counting: Estimation
- Adapter: Not implemented

**Meta (Llama)**:
- Models: `llama-3`, `llama-3.1`, `llama-3.2`, `llama-3.3`
- Token counting: Uses llama-tokenizer-js (client-side)
- Adapter: Not implemented

**Mistral**:
- Models: `mistral-large`, `mistral-medium`, `mistral-small`
- Token counting: Estimation
- Adapter: Not implemented

## API Endpoint Patterns

### Standard Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "messages": [...],
  "model": "gpt-4o",
  "stream": true
}
```

### Streaming Response Format
- **SSE (Server-Sent Events)**: `text/event-stream`
- **Data Stream**: Vercel AI SDK format
- **WebSocket**: Custom WebSocket protocol

### Error Response Format
```json
{
  "error": {
    "code": "RATE_LIMIT",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

## Component-to-Service Mapping

### Direct Integration Components
- **ChatWindow**: Uses hooks that call AI services
- **ClarityChat**: Uses `useClarityChat` hook
- **ModelSelector**: Displays available models per provider

### Indirect Integration Components
- **TokenCounter**: Uses token counting (provider-specific)
- **TokenOptimizationDashboard**: Uses optimization hooks
- **ErrorBoundary**: Handles AI service errors
- **NetworkStatus**: Monitors AI service connectivity

## Hook-to-Service Mapping

### Core Chat Hooks
- `useClarityChat`: Supports all providers via adapters
- `useChatEnhanced`: Provider-agnostic (uses API endpoint)
- `useAssistant`: OpenAI Assistant API specific

### Streaming Hooks
- `useStreamingSSE`: Provider-agnostic (uses API endpoint)
- `useStreaming`: Provider-agnostic
- `useStreamingWebSocket`: Provider-agnostic

### Token Hooks
- `useTokenCounter`: Provider-specific token counting
- `useTokenOptimization`: Provider-agnostic (uses adapters)
- `useCostEstimator`: Provider-specific pricing

## Adapter Pattern

The library uses an adapter pattern to abstract provider differences:

```typescript
// Create adapter
const adapter = createOpenAIAdapter({
  endpoint: '/api/llm/openai',
  stream: true
})

// Use adapter
const response = await adapter(request)
```

**Adapter Responsibilities**:
- Convert generic `LLMRequest` to provider-specific format
- Handle provider-specific response formats
- Manage authentication headers
- Handle errors and retries
- Support streaming

## Model Registry

Models are registered in `packages/token-optimization/src/models/model-registry.ts`:

**Model Information Includes**:
- Provider name
- Context window size
- Token encoding type
- Pricing (input/output per token)
- Capabilities (text, code, vision, functions)

## Token Counting Accuracy

| Provider | Method | Accuracy | Notes |
|----------|--------|----------|-------|
| OpenAI | gpt-tokenizer | 99%+ | Client-side, exact counting |
| Anthropic | Estimation | ~90% | Uses gpt-tokenizer as proxy |
| Google | Estimation | ~90% | Uses gpt-tokenizer as proxy |
| Llama | llama-tokenizer-js | 95%+ | Client-side counting |
| Others | Character-based | ~70% | Fallback estimation |

## Rate Limiting

**Provider Rate Limits**:
- OpenAI: Varies by tier (Tier 1: 500 RPM, Tier 2: 5000 RPM)
- Anthropic: Varies by tier
- Google: Varies by tier

**Library Handling**:
- Detects rate limit errors (429 status)
- Parses `Retry-After` headers
- Implements exponential backoff
- Queues requests when rate limited

## Authentication

**Security Best Practices**:
- API keys stored server-side only
- Client uses proxy endpoints
- Adapters support custom headers for proxy auth
- No API keys in browser code

**Environment Variables**:
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_AI_API_KEY` or `GEMINI_API_KEY` - Google API key

## Demo Mode

When no API keys are configured, the library runs in demo mode:
- Uses mock responses
- Simulates streaming
- No actual AI calls
- Useful for development and testing

## Multi-Provider Support

The library supports using multiple providers simultaneously:
- Model routing based on query complexity
- Fallback to alternative providers on errors
- Provider comparison features
- Unified interface across providers

## Notes

- All adapters follow the same interface pattern
- Token counting accuracy varies by provider
- Streaming is supported for all major providers
- Error handling is provider-agnostic
- Cost tracking is provider-specific (uses pricing data)
