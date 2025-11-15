# Phase 4: Runtime Safety Nets & Protections

## Overview

Runtime validation and developer-friendly error messages have been added to all top-level APIs to ensure a smooth developer experience and catch configuration errors early.

---

## Safety Nets Added

### 1. Input Validation

#### `ClarityChat` Component
- ✅ **API Endpoint Validation**: Validates that `api` prop is a non-empty string and properly formatted URL
- ✅ **Messages Validation**: Validates that `initialMessages` is an array (if provided)
- ✅ **Memory Strategy Validation**: Validates memory strategy when memory is enabled

**Location**: `packages/react/src/components/clarity-chat.tsx`

**Error Messages**:
```typescript
// Invalid API endpoint
"[ClarityChat] Invalid API endpoint: expected string, got undefined. Please provide a valid API endpoint URL, e.g., '/api/chat'"

// Empty API endpoint
"[ClarityChat] API endpoint cannot be empty. Please provide a valid API endpoint URL, e.g., '/api/chat'"

// Invalid format
"[ClarityChat] Invalid API endpoint format: 'invalid'. API endpoint must be a relative path (starting with '/') or absolute URL (starting with 'http://' or 'https://')"

// Invalid memory strategy
"[ClarityChat] Invalid memory strategy: 'invalid'. Valid strategies are: sliding-window, semantic-chunks, vector-store"
```

---

#### `useClarityChat` Hook
- ✅ **API Endpoint Validation**: Validates API endpoint format
- ✅ **Memory Configuration Validation**: Validates memory options when provided

**Location**: `packages/react/src/hooks/use-clarity-chat.ts`

---

#### `useAgent` Hook
- ✅ **Model Validation**: Validates that model is a non-empty string
- ✅ **Tools Validation**: Validates that tools is an array (if provided)

**Location**: `packages/react/src/hooks/use-agent.ts`

**Error Messages**:
```typescript
// Invalid model
"[useAgent] Invalid model: expected non-empty string, got undefined. Please provide a valid model identifier, e.g., 'gpt-4', 'claude-3-opus'."

// Invalid tools
"[useAgent] Invalid tools: expected array, got string. Please provide an array of tool objects."
```

---

#### `useRAGPipeline` Hook
- ✅ **Vector Store Provider Validation**: Validates provider is one of: 'pinecone', 'qdrant', 'weaviate', 'chroma'
- ✅ **Embedding Provider Validation**: Validates provider is one of: 'openai', 'cohere', 'custom'

**Location**: `packages/react/src/hooks/use-rag-pipeline.ts`

**Error Messages**:
```typescript
// Invalid vector store provider
"[useRAGPipeline] Invalid vector store provider: 'invalid'. Valid providers are: pinecone, qdrant, weaviate, chroma"

// Invalid embedding provider
"[useRAGPipeline] Invalid embedding provider: 'invalid'. Valid providers are: openai, cohere, custom"
```

---

#### `useStreamingChat` Hook
- ✅ **API Endpoint Validation**: Validates API endpoint format
- ✅ **Protocol Validation**: Validates protocol is 'sse' or 'websocket'

**Location**: `packages/react/src/hooks/use-streaming-chat.ts`

**Error Messages**:
```typescript
// Invalid protocol
"[useStreamingChat] Invalid streaming protocol: 'invalid'. Valid protocols are: sse, websocket"
```

---

### 2. Provider Context Validation

#### Memory Provider
- ✅ **Context Validation**: Validates that hooks are used within `MemoryProvider` when required

**Location**: `packages/react/src/utils/runtime-validation.ts`

**Error Messages**:
```typescript
"[useMemoryStore] useMemoryStore must be used within a MemoryProvider. Please wrap your component with <MemoryProvider> to use useMemoryStore."
```

---

### 3. Developer-Friendly Error Messages

All validation errors include:
- ✅ **Clear context**: Component/hook name in brackets
- ✅ **What went wrong**: Specific validation failure
- ✅ **Solution**: Actionable guidance on how to fix it
- ✅ **Examples**: Code examples where helpful

---

### 4. Development vs Production Behavior

- ✅ **Development Mode**: Errors are thrown immediately to help developers catch issues early
- ✅ **Production Mode**: Errors are logged but don't crash the app (graceful degradation)
- ✅ **Error Callbacks**: Errors are passed to `onError` callbacks when provided

---

## Validation Utilities

### Location
`packages/react/src/utils/runtime-validation.ts`

### Functions Available

| Function | Purpose | Used By |
|----------|---------|---------|
| `validateApiEndpoint` | Validate API endpoint URL | `ClarityChat`, `useStreamingChat` |
| `validateRequiredProp` | Validate required props | General purpose |
| `validateMemoryStrategy` | Validate memory strategy | `ClarityChat` |
| `validateProviderContext` | Validate provider context | Memory hooks |
| `validateMessages` | Validate messages array | `ClarityChat` |
| `validateFunction` | Validate function props | General purpose |
| `validateModel` | Validate model identifier | `useAgent` |
| `validateTools` | Validate tools array | `useAgent` |
| `validateVectorStoreProvider` | Validate vector store provider | `useRAGPipeline` |
| `validateEmbeddingProvider` | Validate embedding provider | `useRAGPipeline` |
| `validateStreamingProtocol` | Validate streaming protocol | `useStreamingChat` |
| `createDeveloperError` | Create developer-friendly errors | General purpose |
| `warnInDevelopment` | Warn in development mode | General purpose |

---

## Fallbacks & Guards

### Null/Undefined Handling
- ✅ All APIs handle `null`/`undefined` inputs gracefully
- ✅ Optional props have sensible defaults
- ✅ Required props throw clear errors

### Failed Async Operations
- ✅ Errors are caught and normalized
- ✅ User-friendly error messages are provided
- ✅ Error callbacks are invoked when provided

### Missing Dependencies
- ✅ Provider context checks prevent runtime errors
- ✅ Clear error messages guide developers to wrap components properly

---

## Error Handling Flow

```
User Input → Validation → Error?
                          ├─ Yes → Developer-Friendly Error Message
                          │         ├─ Development: Throw immediately
                          │         └─ Production: Log + Call onError callback
                          └─ No → Continue with execution
```

---

## Benefits

1. **Early Error Detection**: Configuration errors are caught at component initialization
2. **Better DX**: Clear, actionable error messages reduce debugging time
3. **Production Safety**: Graceful degradation prevents app crashes
4. **Type Safety**: Runtime validation complements TypeScript type checking
5. **Consistency**: Unified validation approach across all APIs

---

**Last Updated**: Phase 4 Implementation
