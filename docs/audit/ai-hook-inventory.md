# AI Hook Inventory

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 1 - Hook Discovery

## Overview

This document catalogs all AI-related hooks in the Clarity Chat library, their parameters, return values, dependencies, and usage patterns.

## Hook Categories

### 1. Core Chat Hooks

#### useClarityChat
- **Location**: `packages/react/src/hooks/chat/use-clarity-chat.ts`
- **Purpose**: Main hook for chat functionality with streaming, memory, and tools
- **Key Features**:
  - Message management
  - Streaming support
  - Memory integration
  - Token tracking
  - Error handling
- **Parameters**:
  - `api`: API endpoint URL
  - `initialMessages`: Initial conversation messages
  - `memory`: Memory configuration
  - `features`: Feature flags
- **Returns**:
  - `messages`: Current messages
  - `append`: Add message function
  - `isLoading`: Loading state
  - `error`: Error state
  - `tokenStats`: Token usage statistics
- **Dependencies**:
  - `useChatEnhanced` - Core chat logic
  - `useMemory` - Memory management
  - `useTokenCounter` - Token tracking
- **AI Integration**: Primary hook for AI chat interactions

#### useChat (useChatEnhanced)
- **Location**: `packages/react/src/hooks/chat/use-chat-enhanced.ts`
- **Purpose**: Enhanced chat hook with Vercel AI SDK compatibility
- **Key Features**:
  - Streaming support
  - Message management
  - Error handling
  - Transform functions
- **Parameters**:
  - `api`: API endpoint
  - `initialMessages`: Initial messages
  - `onFinish`: Completion callback
  - `onError`: Error callback
  - `stream`: Enable streaming
- **Returns**:
  - `messages`: Message array
  - `append`: Add message
  - `reload`: Reload last message
  - `stop`: Stop streaming
  - `input`: Input value
  - `setInput`: Set input function
- **Dependencies**: Streaming utilities, message conversion
- **AI Integration**: Core chat functionality

#### useAssistant
- **Location**: `packages/react/src/hooks/chat/use-assistant.ts`
- **Purpose**: Assistant-style conversations with tool calling
- **Key Features**:
  - Tool calling support
  - Multi-step workflows
  - Thread management
  - Request caching
  - Parallel tool execution
- **Parameters**:
  - `api`: API endpoint
  - `assistantId`: Assistant ID
  - `threadId`: Thread ID
  - `onToolCall`: Tool call callback
  - `enableCache`: Request caching
  - `cacheToolResults`: Cache tool results
- **Returns**:
  - `status`: Assistant status
  - `messages`: Messages
  - `submitMessage`: Submit function
  - `toolInvocations`: Tool calls
  - `stop`: Stop function
- **Dependencies**:
  - `processStream` - Streaming helpers
  - Tool execution logic
- **AI Integration**: Assistant API integration

#### useClarityChatWithTools
- **Location**: `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts`
- **Purpose**: Chat with tool/function calling support
- **Key Features**:
  - Tool definitions
  - Tool execution
  - Result handling
- **Parameters**:
  - `tools`: Tool definitions
  - `onToolCall`: Tool call handler
- **Returns**: Chat state with tool support
- **AI Integration**: Function calling

#### useClarityObject
- **Location**: `packages/react/src/hooks/chat/use-clarity-object.ts`
- **Purpose**: Structured output generation
- **Key Features**:
  - Schema validation
  - Type-safe output
  - Streaming support
- **Parameters**:
  - `schema`: Output schema
  - `api`: API endpoint
- **Returns**: Structured output
- **AI Integration**: Structured generation

#### useCompletion
- **Location**: `packages/react/src/hooks/chat/use-completion.ts`
- **Purpose**: Text completion (non-chat)
- **Key Features**:
  - Simple completion
  - Streaming support
- **Parameters**:
  - `api`: API endpoint
  - `prompt`: Input prompt
- **Returns**: Completion result
- **AI Integration**: Text completion

#### useRAGPipeline
- **Location**: `packages/react/src/hooks/chat/use-rag-pipeline.ts`
- **Purpose**: Retrieval-Augmented Generation pipeline
- **Key Features**:
  - Document retrieval
  - Context injection
  - Citation generation
- **Parameters**:
  - `knowledgeBase`: Knowledge base config
  - `retrievalConfig`: Retrieval settings
- **Returns**: RAG pipeline state
- **AI Integration**: RAG functionality

### 2. Streaming Hooks

#### useStreamingSSE
- **Location**: `packages/react/src/hooks/streaming/use-streaming-sse.tsx`
- **Purpose**: Server-Sent Events streaming
- **Key Features**:
  - Automatic reconnection
  - Heartbeat monitoring
  - Event parsing
  - Resume from last event ID
- **Parameters**:
  - `url`: SSE endpoint
  - `autoReconnect`: Enable reconnection
  - `maxReconnectAttempts`: Max retries
  - `onMessage`: Message handler
  - `onError`: Error handler
- **Returns**:
  - `status`: Connection status
  - `events`: Received events
  - `data`: Accumulated data
  - `connect`: Connect function
  - `disconnect`: Disconnect function
- **Dependencies**: Fetch API, TextDecoder
- **AI Integration**: SSE streaming for AI responses

#### useStreaming
- **Location**: `packages/react/src/hooks/streaming/use-streaming.ts`
- **Purpose**: Generic streaming hook
- **Key Features**:
  - Chunk accumulation
  - Error handling
  - Progress tracking
- **Parameters**:
  - `url`: Endpoint URL
  - `onChunk`: Chunk handler
  - `onComplete`: Completion handler
- **Returns**: Streaming state and controls
- **AI Integration**: Generic streaming

#### useStreamingChat
- **Location**: `packages/react/src/hooks/streaming/use-streaming-chat.ts`
- **Purpose**: Chat-specific streaming
- **Key Features**:
  - Message accumulation
  - Chat-specific handling
- **Parameters**:
  - `apiEndpoint`: Chat API endpoint
  - `onChunk`: Chunk handler
- **Returns**: Chat streaming state
- **AI Integration**: Chat streaming

#### useStreamingWebSocket
- **Location**: `packages/react/src/hooks/streaming/use-streaming-websocket.tsx`
- **Purpose**: WebSocket streaming
- **Key Features**:
  - WebSocket connection
  - Message handling
  - Reconnection
- **Parameters**:
  - `url`: WebSocket URL
  - `onMessage`: Message handler
- **Returns**: WebSocket state
- **AI Integration**: WebSocket streaming

#### useStreamableUI
- **Location**: `packages/react/src/hooks/streaming/use-streamable-ui.ts`
- **Purpose**: UI-optimized streaming
- **Key Features**:
  - Smooth rendering
  - Performance optimization
  - Frame-rate management
- **Parameters**: Streaming configuration
- **Returns**: Optimized streaming state
- **AI Integration**: UI-optimized streaming

#### useSmoothedText
- **Location**: `packages/react/src/hooks/streaming/use-smoothed-text.ts`
- **Purpose**: Smooth text rendering for streaming
- **Key Features**:
  - 60fps rendering
  - Smooth animations
  - Chunk batching
- **Parameters**:
  - `text`: Streaming text
  - `speed`: Animation speed
- **Returns**: Smoothed text state
- **AI Integration**: Smooth text display

#### useStreamStatus
- **Location**: `packages/react/src/hooks/streaming/use-stream-status.ts`
- **Purpose**: Stream status tracking
- **Key Features**:
  - Status monitoring
  - Token tracking
  - Time tracking
- **Parameters**: Stream configuration
- **Returns**: Stream status
- **AI Integration**: Status tracking

### 3. Token Management Hooks

#### useTokenCounter
- **Location**: `packages/react/src/hooks/clarity-tokens/use-token-counter.ts`
- **Purpose**: Accurate token counting
- **Key Features**:
  - Multi-model support
  - Caching
  - Chat message counting
- **Parameters**:
  - `model`: Model identifier
  - `enableCaching`: Cache results
- **Returns**:
  - `count`: Count function
  - `countChat`: Count chat messages
  - `isWithinLimit`: Limit check
- **Dependencies**: `AccurateTokenCounter` class
- **AI Integration**: Token counting for all models

#### useLazyTokenCounter
- **Location**: `packages/react/src/hooks/clarity-tokens/use-lazy-token-counter.ts`
- **Purpose**: Lazy-loaded token counter
- **Key Features**:
  - Lazy initialization
  - Shared instance
  - Preloading
- **Parameters**: Model configuration
- **Returns**: Lazy counter state
- **AI Integration**: Optimized token counting

#### useTokenOptimization
- **Location**: `packages/react/src/hooks/clarity-tokens/use-token-optimization.ts`
- **Purpose**: Comprehensive token optimization
- **Key Features**:
  - Multiple strategies
  - Compression
  - Caching
  - Cost tracking
- **Parameters**:
  - `model`: Model identifier
  - `strategies`: Optimization strategies
- **Returns**: Optimization state and functions
- **Dependencies**:
  - `useTokenCounter`
  - Compression utilities
  - Cache hooks
- **AI Integration**: Token optimization

#### useTokenLimitGuard
- **Location**: `packages/react/src/hooks/clarity-tokens/use-token-limit-guard.ts`
- **Purpose**: Enforces token limits
- **Key Features**:
  - Limit checking
  - Truncation policies
  - Summarization
  - Refusal handling
- **Parameters**:
  - `maxInputTokens`: Maximum tokens
  - `policy`: Guard policy
  - `summarizeFn`: Summarization function
- **Returns**:
  - `guardMessages`: Guard function
  - `isWithinLimit`: Check function
- **Dependencies**: `useTokenCounter`
- **AI Integration**: Token limit enforcement

#### useTokenTracker
- **Location**: `packages/react/src/hooks/token/use-token-tracker.tsx`
- **Purpose**: Track token usage over time
- **Key Features**:
  - Usage tracking
  - Cost estimation
  - Warnings
  - Pruning suggestions
- **Parameters**:
  - `modelName`: Model name
  - `maxTokens`: Maximum tokens
  - `warningThreshold`: Warning threshold
- **Returns**: Token tracking state
- **AI Integration**: Usage tracking

#### useTokenBudgetMonitor
- **Location**: `packages/react/src/hooks/token/use-token-budget-monitor.tsx`
- **Purpose**: Monitor token budget
- **Key Features**:
  - Budget tracking
  - Alerts
  - Usage limits
- **Parameters**: Budget configuration
- **Returns**: Budget state
- **AI Integration**: Budget management

#### useCostEstimator
- **Location**: `packages/react/src/hooks/clarity-tokens/use-cost-estimator.ts`
- **Purpose**: Estimate API costs
- **Key Features**:
  - Cost calculation
  - Multi-model support
  - Pricing data
- **Parameters**: Model and pricing config
- **Returns**: Cost estimation functions
- **AI Integration**: Cost tracking

#### useContextWindow
- **Location**: `packages/react/src/hooks/clarity-tokens/use-context-window.ts`
- **Purpose**: Manage context window
- **Key Features**:
  - Context management
  - Truncation strategies
  - Summarization
- **Parameters**: Context configuration
- **Returns**: Context management functions
- **AI Integration**: Context window management

#### useSemanticCache
- **Location**: `packages/react/src/hooks/clarity-tokens/use-semantic-cache.ts`
- **Purpose**: Semantic response caching
- **Key Features**:
  - Embedding-based caching
  - Similarity matching
  - Cache hits
- **Parameters**: Cache configuration
- **Returns**: Cache state and functions
- **AI Integration**: Semantic caching

#### useExactCache
- **Location**: `packages/react/src/hooks/clarity-tokens/use-exact-cache.ts`
- **Purpose**: Exact match caching
- **Key Features**:
  - Exact matching
  - Storage backends
  - TTL management
- **Parameters**: Cache store configuration
- **Returns**: Cache functions
- **AI Integration**: Response caching

#### usePromptCompressor
- **Location**: `packages/react/src/hooks/clarity-tokens/use-prompt-compressor.ts`
- **Purpose**: Compress prompts
- **Key Features**:
  - Multiple strategies
  - Token reduction
  - Quality preservation
- **Parameters**: Compression config
- **Returns**: Compression functions
- **AI Integration**: Prompt optimization

#### useStreamOptimizer
- **Location**: `packages/react/src/hooks/clarity-tokens/use-stream-optimizer.ts`
- **Purpose**: Optimize streaming
- **Key Features**:
  - Chunk batching
  - Buffer management
  - Performance optimization
- **Parameters**: Optimization config
- **Returns**: Optimized streaming
- **AI Integration**: Streaming optimization

### 4. Memory/Context Hooks

#### useMemory
- **Location**: `packages/react/src/hooks/message/use-message-history.tsx` (or memory hooks)
- **Purpose**: Memory management for conversations
- **Key Features**:
  - Message persistence
  - Context management
  - Retrieval
- **Parameters**: Memory configuration
- **Returns**: Memory state and functions
- **AI Integration**: Conversation memory

#### useContextMonitor
- **Location**: `packages/react/src/hooks/context/use-context-monitor.tsx`
- **Purpose**: Monitor context usage
- **Key Features**:
  - Token tracking
  - Usage alerts
  - Optimization suggestions
- **Parameters**: Monitor configuration
- **Returns**: Context monitoring state
- **AI Integration**: Context monitoring

### 5. Message Management Hooks

#### useMessageOperations
- **Location**: `packages/react/src/hooks/message/use-message-operations.ts`
- **Purpose**: Message editing and management
- **Key Features**:
  - Edit messages
  - Regenerate
  - Branch conversations
  - Delete messages
- **Parameters**: Messages array
- **Returns**: Operation functions
- **AI Integration**: Message management

#### useOptimisticMessage
- **Location**: `packages/react/src/hooks/message/use-optimistic-message.ts`
- **Purpose**: Optimistic message updates
- **Key Features**:
  - Immediate UI updates
  - Rollback on error
- **Parameters**: Message configuration
- **Returns**: Optimistic state
- **AI Integration**: Optimistic updates

### 6. Utility Hooks

#### useRetryWithBackoff
- **Location**: `packages/react/src/hooks/resilience/use-retry-with-backoff.ts`
- **Purpose**: Retry logic with exponential backoff
- **Key Features**:
  - Exponential backoff
  - Max retries
  - Error handling
- **Parameters**: Retry configuration
- **Returns**: Retry function
- **AI Integration**: Error recovery

#### useCircuitBreaker
- **Location**: `packages/react/src/hooks/resilience/use-circuit-breaker.ts`
- **Purpose**: Circuit breaker pattern
- **Key Features**:
  - Failure detection
  - Automatic recovery
  - State management
- **Parameters**: Circuit breaker config
- **Returns**: Circuit breaker state
- **AI Integration**: Failure handling

## Hook Dependency Graph

```
useClarityChat
├── useChatEnhanced
│   ├── useStreamingSSE
│   └── Message conversion utilities
├── useMemory
│   └── Storage hooks
└── useTokenCounter
    └── AccurateTokenCounter

useAssistant
├── processStream (streaming helpers)
├── Tool execution logic
└── Caching (optional)

useTokenOptimization
├── useTokenCounter
├── useSemanticCache
├── usePromptCompressor
└── useStreamOptimizer

useStreamingSSE
├── Fetch API
├── TextDecoder
└── Reconnection logic
```

## Hook Usage Patterns

### Basic Chat Pattern
```tsx
const chat = useClarityChat({ api: '/api/chat' })
// Returns: messages, append, isLoading, error
```

### Streaming Pattern
```tsx
const stream = useStreamingSSE({
  url: '/api/stream',
  onMessage: (event) => handleChunk(event.data)
})
```

### Token Management Pattern
```tsx
const tokenCounter = useTokenCounter({ model: 'gpt-4o' })
const count = tokenCounter.count(text)
const isWithinLimit = tokenCounter.isWithinLimit(messages, maxTokens)
```

### Optimization Pattern
```tsx
const optimization = useTokenOptimization({
  model: 'gpt-4o',
  strategies: ['compression', 'caching']
})
```

## Notes

- All hooks support TypeScript with full type safety
- Hooks follow React best practices (cleanup, memoization)
- Error handling is built into hooks
- Hooks are composable and can be used together
- Performance optimizations include memoization and lazy loading
