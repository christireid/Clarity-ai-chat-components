# Clarity Chat Architecture

High-level overview of how Clarity Chat is structured and how components work together.

---

## System Overview

```mermaid
flowchart TB
    subgraph Ecosystem["Clarity Chat Ecosystem"]
        direction TB
        UI["🎨 UI Layer<br/>Components, Primitives, Themes"]
        Hooks["⚡ Hooks Layer<br/>useClarityChat, useStreaming, useMemory"]
        AI["🤖 AI Layer<br/>Memory, RAG, Agents"]
    end

    UI --> Hooks
    Hooks --> AI

    style Ecosystem fill:#f8fafc,stroke:#e2e8f0
    style UI fill:#dbeafe,stroke:#3b82f6
    style Hooks fill:#fef3c7,stroke:#f59e0b
    style AI fill:#dcfce7,stroke:#22c55e
```

---

## Component Architecture

### Layer 1: UI Components

**Purpose:** Visual presentation and user interaction

```mermaid
graph TD
    CW[ChatWindow] --> ML[MessageList<br/>Virtualized]
    CW --> CI[ChatInput]
    CW --> TC[TokenCounter<br/>optional]

    ML --> M[Message]
    M --> MB[MessageBubble]
    M --> MA[MessageActions]
    M --> MM[MessageMetadata]

    CI --> TA[Textarea]
    CI --> VI[VoiceInput<br/>optional]
    CI --> FU[FileUpload<br/>optional]

    style CW fill:#3b82f6,stroke:#1d4ed8,color:#fff
    style ML fill:#60a5fa,stroke:#3b82f6
    style CI fill:#60a5fa,stroke:#3b82f6
    style TC fill:#93c5fd,stroke:#60a5fa
    style M fill:#93c5fd,stroke:#60a5fa
```

**Key Components:**
- `ChatWindow` - Main container orchestrating all chat UI
- `Message` - Individual message display with actions
- `ChatInput` - User input with voice and file support
- `MessageList` - Virtualized list for performance

---

### Layer 2: Hooks Layer

**Purpose:** State management and business logic

```mermaid
graph TD
    UC[useClarityChat<br/>Flagship Hook] --> UCE[useChatEnhanced]
    UC --> UM[useMemory<br/>optional]

    UCE --> USSE[useStreamingSSE]
    UCE --> UER[useErrorRecovery]
    UCE --> UTT[useTokenCount]

    UM --> USCM[useSlidingContextManager]
    UM --> UVSA[useVectorStoreAdapter]
    UM --> UMR[useMemoryRetrieval]

    style UC fill:#f59e0b,stroke:#d97706,color:#fff
    style UCE fill:#fbbf24,stroke:#f59e0b
    style UM fill:#fbbf24,stroke:#f59e0b
```

**Key Hooks:**
- `useClarityChat` - Main chat hook with memory integration
- `useStreamingSSE` - Server-Sent Events streaming support
- `useMemory` - Memory management with multiple strategies
- `useTokenCount` - Real-time token usage and cost tracking

---

### Layer 3: AI Infrastructure

**Purpose:** AI features and integrations

```mermaid
graph TD
    subgraph Memory["Memory System"]
        SW[Sliding Window]
        SC[Semantic Chunks]
        VS[Vector Store]
    end

    subgraph RAG["RAG Pipeline"]
        DL[Document Loaders]
        TS[Text Splitting]
        EM[Embeddings]
        RT[Retrieval]
    end

    subgraph Agents["Agent System"]
        RP[ReAct Pattern]
        TC[Tool Calling]
        OR[Orchestration]
    end

    Memory --> RAG
    RAG --> Agents

    style Memory fill:#dcfce7,stroke:#22c55e
    style RAG fill:#e0e7ff,stroke:#6366f1
    style Agents fill:#fce7f3,stroke:#ec4899
```

---

## Data Flow

### Message Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant CI as ChatInput
    participant H as useClarityChat
    participant M as Memory System
    participant API as AI API
    participant ML as MessageList

    U->>CI: Types message
    CI->>H: onSendMessage(content)
    H->>H: Token tracking
    H->>M: Retrieve context (if enabled)
    M-->>H: Context bundle
    H->>API: POST /api/chat (SSE)

    loop Streaming Response
        API-->>H: Token chunk
        H-->>ML: Update message state
        ML-->>U: Render streaming text
    end

    H->>M: Store message
    ML->>U: Final rendered message
```

### Memory Flow

```mermaid
sequenceDiagram
    participant Msg as New Message
    participant MS as Memory System
    participant VDB as Vector Store
    participant CE as Context Engine
    participant API as AI API

    Msg->>MS: Process message
    MS->>MS: Calculate importance score
    MS->>VDB: Store embedding
    MS->>MS: Update context window

    Note over MS,CE: Context Retrieval
    MS->>VDB: Semantic search
    VDB-->>MS: Relevant memories
    MS->>CE: Bundle context
    CE-->>API: Enriched request
```

---

## Component Relationships

```mermaid
graph TB
    subgraph Container["ChatWindow Container"]
        State[Manages State]
        Send[Handles Sending]
        Render[Renders Children]
    end

    subgraph List["MessageList"]
        Scroll[Manages Scroll]
        Virtual[Virtualizes Rendering]
        RenderMsg[Renders Messages]
    end

    subgraph Msg["Message Component"]
        Display[Displays Content]
        Actions[Handles Interactions]
        Meta[Shows Metadata]
    end

    Container --> List
    List --> Msg

    style Container fill:#3b82f6,stroke:#1d4ed8,color:#fff
    style List fill:#60a5fa,stroke:#3b82f6
    style Msg fill:#93c5fd,stroke:#60a5fa
```

---

## Hook Composition

```mermaid
graph LR
    subgraph Core["useClarityChat"]
        direction TB
        Main[Main Logic]
    end

    subgraph Enhanced["useChatEnhanced"]
        SSE[useStreamingSSE<br/>SSE Connection]
        Error[useErrorRecovery<br/>Retry Logic]
        Token[useTokenCount<br/>Usage Tracking]
    end

    subgraph MemoryHooks["useMemory"]
        Sliding[useSlidingContextManager<br/>Context Window]
        Vector[useVectorStoreAdapter<br/>Vector Integration]
    end

    Core --> Enhanced
    Core --> MemoryHooks

    style Core fill:#f59e0b,stroke:#d97706,color:#fff
    style Enhanced fill:#fef3c7,stroke:#f59e0b
    style MemoryHooks fill:#fef3c7,stroke:#f59e0b
```

---

## Theme System

```mermaid
graph TD
    TP[ThemeProvider<br/>Root] --> TC[Theme Context]
    TP --> TA[Theme Application]

    TC --> Colors[Colors]
    TC --> Typography[Typography]
    TC --> Spacing[Spacing]
    TC --> Shadows[Shadows]

    TA --> CSS[CSS Variables]
    TA --> TW[Tailwind Classes]
    TA --> Styles[Component Styles]

    style TP fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style TC fill:#a78bfa,stroke:#8b5cf6
    style TA fill:#a78bfa,stroke:#8b5cf6
```

---

## State Management

```mermaid
graph TD
    subgraph Local["Local State (useState)"]
        UI[UI-specific state<br/>modals, inputs]
    end

    subgraph Hook["Hook State (useClarityChat)"]
        Chat[Chat state<br/>messages, loading, error]
    end

    subgraph Context["Context State (Providers)"]
        Theme[ThemeProvider]
        Memory[MemoryProvider]
    end

    Local --> Hook
    Hook --> Context

    style Local fill:#fecaca,stroke:#ef4444
    style Hook fill:#fef08a,stroke:#eab308
    style Context fill:#bbf7d0,stroke:#22c55e
```

---

## Performance Optimizations

### Virtualization Strategy

```mermaid
graph LR
    subgraph Visible["Viewport"]
        V1[Message 5]
        V2[Message 6]
        V3[Message 7]
    end

    subgraph Above["Above Viewport"]
        A1[Message 1-4<br/>Not Rendered]
    end

    subgraph Below["Below Viewport"]
        B1[Message 8-100+<br/>Not Rendered]
    end

    Above -.-> Visible
    Visible -.-> Below

    style Visible fill:#22c55e,stroke:#16a34a,color:#fff
    style Above fill:#f3f4f6,stroke:#d1d5db
    style Below fill:#f3f4f6,stroke:#d1d5db
```

### Memory Optimization

| Strategy | Purpose | Impact |
|----------|---------|--------|
| Sliding Window | Limits context size | -50% token usage |
| Token Optimization | Compresses context | -30% additional |
| Semantic Caching | Reuses similar contexts | -40% API calls |

---

## Integration Points

### API Integration

```mermaid
sequenceDiagram
    participant Hook as useClarityChat
    participant API as /api/chat
    participant AI as AI Provider

    Hook->>API: POST { messages, context }
    API->>AI: Forward request
    AI-->>API: SSE Stream
    API-->>Hook: Stream response

    Note over Hook,AI: Supports OpenAI, Anthropic, Google
```

### Vector Store Integration

```mermaid
graph LR
    MS[Memory System] --> VS{Vector Store}

    VS --> P[Pinecone]
    VS --> Q[Qdrant]
    VS --> W[Weaviate]
    VS --> C[Chroma]

    style MS fill:#22c55e,stroke:#16a34a,color:#fff
    style VS fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## File Structure

```
packages/
├── react/                    # Main library (@clarity-chat/react)
│   ├── src/
│   │   ├── components/       # 70+ UI components
│   │   ├── hooks/            # 35+ React hooks
│   │   ├── memory/           # Memory system
│   │   ├── theme/            # Theme system
│   │   └── utils/            # Utilities
│   └── styles.css            # Global styles
├── primitives/               # Base UI components (@clarity-chat/primitives)
├── memory/                   # Memory package (@clarity-chat/memory)
├── types/                    # TypeScript types (@clarity-chat/types)
└── cli/                      # CLI tool (@clarity-chat/cli)
```

---

## Key Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Component Composition** | Flexibility and reusability | More components to learn |
| **Hook-Based Architecture** | Separation of concerns, testability | Requires React knowledge |
| **Virtual Scrolling** | Performance with 1000+ messages | Slightly more complex |
| **Pluggable Memory** | Flexibility for different use cases | Configuration needed |
| **CSS Variables + Tailwind** | Easy customization, performance | Bundle size consideration |

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
  colors: { primary: '#your-color' },
  spacing: { sm: '0.5rem' },
}

<ThemeProvider theme={customTheme}>
  <ChatWindow />
</ThemeProvider>
```

---

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Getting Started](./getting-started.md) - Quick start guide
- [Memory Guide](./clarity-memory/GETTING_STARTED.md) - Memory system documentation
- [Best Practices](./best-practices.md) - Production patterns

---

**Last Updated:** December 2025
