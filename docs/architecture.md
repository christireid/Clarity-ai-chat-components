# Clarity Chat Architecture

High-level overview of how Clarity Chat is structured and how components work together.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Clarity Chat Ecosystem                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   UI Layer   │    │  Hooks Layer  │    │  AI Layer    │
│              │    │              │    │              │
│ Components   │    │ useClarityChat│    │ Memory      │
│ Primitives   │    │ useStreaming  │    │ RAG         │
│ Themes       │    │ useMemory    │    │ Agents      │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Component Architecture

### Layer 1: UI Components

**Purpose:** Visual presentation and user interaction

```
ChatWindow (Container)
    ├── MessageList (Virtualized)
    │   └── Message (Individual)
    │       ├── MessageBubble
    │       ├── MessageActions
    │       └── MessageMetadata
    ├── ChatInput
    │   ├── Textarea
    │   ├── VoiceInput (optional)
    │   └── FileUpload (optional)
    └── TokenCounter (optional)
```

**Key Components:**
- `ChatWindow` - Main container
- `Message` - Individual message display
- `ChatInput` - User input
- `MessageList` - Virtualized list

---

### Layer 2: Hooks Layer

**Purpose:** State management and business logic

```
useClarityChat (Flagship)
    ├── useChatEnhanced
    │   ├── useStreamingSSE
    │   ├── useErrorRecovery
    │   └── useTokenTracker
    └── useMemory (optional)
        ├── useSlidingContextManager
        ├── useVectorStoreAdapter
        └── useMemoryRetrieval
```

**Key Hooks:**
- `useClarityChat` - Main chat hook
- `useStreamingSSE` - Streaming support
- `useMemory` - Memory management
- `useTokenTracker` - Token optimization

---

### Layer 3: AI Infrastructure

**Purpose:** AI features and integrations

```
AI Infrastructure
    ├── Memory System
    │   ├── Sliding Window
    │   ├── Semantic Chunks
    │   └── Vector Store
    ├── RAG Pipeline
    │   ├── Document Loaders
    │   ├── Text Splitting
    │   ├── Embeddings
    │   └── Retrieval
    └── Agent System
        ├── ReAct Pattern
        ├── Tool Calling
        └── Orchestration
```

---

## Data Flow

### Message Flow

```
User Input
    │
    ▼
ChatInput Component
    │
    ▼
useClarityChat Hook
    │
    ├── Token Tracking
    ├── Memory Retrieval (if enabled)
    └── API Request
        │
        ▼
    Streaming Response (SSE/WebSocket)
        │
        ▼
    Message State Update
        │
        ▼
    MessageList Component
        │
        ▼
    Message Component (rendered)
```

### Memory Flow

```
New Message
    │
    ▼
Memory System
    │
    ├── Store Message
    ├── Update Context Window
    └── Retrieve Relevant Memories
        │
        ▼
    Context Enrichment
        │
        ▼
    API Request (with context)
```

---

## Component Relationships

### ChatWindow → MessageList → Message

```
ChatWindow (Container)
    ├── Manages overall state
    ├── Handles message sending
    └── Renders MessageList
        │
        └── MessageList (Virtualized)
            ├── Manages scroll position
            ├── Virtualizes rendering
            └── Renders Message components
                │
                └── Message (Individual)
                    ├── Displays content
                    ├── Handles interactions
                    └── Shows metadata
```

---

## Hook Relationships

### useClarityChat Composition

```
useClarityChat
    │
    ├── useChatEnhanced
    │   ├── useStreamingSSE
    │   │   └── Handles SSE connection
    │   ├── useErrorRecovery
    │   │   └── Handles errors & retries
    │   └── useTokenTracker
    │       └── Tracks token usage
    │
    └── useMemory (optional)
        ├── useSlidingContextManager
        │   └── Manages context window
        └── useVectorStoreAdapter
            └── Vector store integration
```

---

## Theme System

### Theme Architecture

```
ThemeProvider (Root)
    │
    ├── Theme Context
    │   ├── Colors
    │   ├── Typography
    │   ├── Spacing
    │   └── Shadows
    │
    └── Theme Application
        ├── CSS Variables
        ├── Tailwind Classes
        └── Component Styles
```

---

## State Management

### Component State

```
Component State
    ├── Local State (useState)
    │   └── UI-specific state
    ├── Hook State (useClarityChat)
    │   └── Chat state (messages, loading)
    └── Context State (ThemeProvider, MemoryProvider)
        └── Global state
```

---

## Performance Optimizations

### Virtualization

```
MessageList
    │
    ├── Virtual Scrolling
    │   └── Only renders visible messages
    ├── Memoization
    │   └── Prevents unnecessary re-renders
    └── Lazy Loading
        └── Loads messages on demand
```

### Memory Optimization

```
Memory System
    │
    ├── Sliding Window
    │   └── Limits context size
    ├── Token Optimization
    │   └── Compresses context
    └── Semantic Caching
        └── Reuses similar contexts
```

---

## Integration Points

### API Integration

```
useClarityChat
    │
    └── API Request
        ├── Endpoint: /api/chat
        ├── Method: POST
        ├── Body: { messages, context }
        └── Response: SSE Stream
```

### Vector Store Integration

```
Memory System
    │
    └── Vector Store
        ├── Pinecone
        ├── Qdrant
        ├── Weaviate
        └── Chroma
```

---

## File Structure

```
packages/
├── react/                    # Main library
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── hooks/            # React hooks
│   │   ├── memory/           # Memory system
│   │   ├── theme/            # Theme system
│   │   └── utils/           # Utilities
│   └── styles.css           # Global styles
├── primitives/               # Base UI components
├── types/                   # TypeScript types
└── error-handling/          # Error handling
```

---

## Key Design Decisions

### 1. Component Composition

**Decision:** Small, composable components  
**Rationale:** Flexibility and reusability

### 2. Hook-Based Architecture

**Decision:** Business logic in hooks  
**Rationale:** Separation of concerns, testability

### 3. Virtual Scrolling

**Decision:** Virtualized message lists  
**Rationale:** Performance with large message counts

### 4. Memory System

**Decision:** Pluggable memory strategies  
**Rationale:** Flexibility for different use cases

### 5. Theme System

**Decision:** CSS variables + Tailwind  
**Rationale:** Easy customization, performance

---

## Extension Points

### Custom Components

```tsx
// Extend ChatWindow with custom components
<ChatWindow
  renderMessage={(msg) => <CustomMessage message={msg} />}
  renderInput={() => <CustomInput />}
/>
```

### Custom Hooks

```tsx
// Compose with custom hooks
const { messages } = useClarityChat({ api: '/api/chat' })
const customData = useCustomHook(messages)
```

### Custom Themes

```tsx
// Create custom theme
const customTheme = {
  colors: { ... },
  spacing: { ... },
}

<ThemeProvider theme={customTheme}>
  <ChatWindow />
</ThemeProvider>
```

---

## Next Steps

- [Component API Reference](./apps/docs/app/api/components.md)
- [Hooks API Reference](./apps/docs/app/api/hooks.md)
- [Memory Guide](./docs/clarity-memory/GETTING_STARTED.md)
- [Performance Guide](./PERFORMANCE_GUIDE.md)

---

**Last Updated:** [Date]
