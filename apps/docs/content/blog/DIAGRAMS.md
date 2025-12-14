# Blog Post Diagrams

Mermaid diagrams for embedding in blog posts. Copy these into your markdown files or render them
with a Mermaid-compatible viewer.

---

## Post 1: Psychology of Response Timing

### Response Timing Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant LLM

    User->>UI: Sends message
    UI->>UI: Show "Reading..." (800ms)
    UI->>API: POST /chat
    API->>LLM: Generate response
    UI->>UI: Show "Thinking..." (1200ms)
    LLM-->>API: Stream tokens
    API-->>UI: SSE stream
    UI->>UI: Show "Writing..."
    UI-->>User: Display response with typing effect
```

### Expected Wait Times by Query Type

```mermaid
gantt
    title Expected Processing Time by Query Complexity
    dateFormat X
    axisFormat %L ms

    section Greeting
    Expected wait    :0, 500

    section Simple Fact
    Expected wait    :0, 1500

    section Explanation
    Expected wait    :0, 2500

    section Code Generation
    Expected wait    :0, 4000

    section Analysis
    Expected wait    :0, 5000
```

---

## Post 7: SSE vs WebSockets

### Protocol Comparison

```mermaid
graph LR
    subgraph SSE
        A[Client] -->|HTTP GET| B[Server]
        B -->|text/event-stream| A
    end

    subgraph WebSocket
        C[Client] <-->|ws://| D[Server]
    end
```

### Decision Tree

```mermaid
flowchart TD
    A[Need real-time communication?] -->|Yes| B{Bidirectional?}
    A -->|No| Z[Use REST API]

    B -->|Yes| C{High frequency?}
    B -->|No| D[Use SSE]

    C -->|Yes| E[Use WebSocket]
    C -->|No| F{Need reconnection handling?}

    F -->|Yes| D
    F -->|No| E
```

---

## Post 8: Context Window Management

### Four Strategies

```mermaid
flowchart LR
    subgraph Sliding Window
        SW1[Msg 1] --> SW2[Msg 2]
        SW2 --> SW3[Msg 3]
        SW3 --> SW4[Keep last N]
    end

    subgraph Summarization
        SU1[Old messages] --> SU2[Summary]
        SU2 --> SU3[Recent messages]
    end

    subgraph RAG
        RA1[Query] --> RA2[Vector Search]
        RA2 --> RA3[Relevant chunks]
    end

    subgraph Semantic Pruning
        SP1[All messages] --> SP2[Score relevance]
        SP2 --> SP3[Keep important]
    end
```

### Token Budget Allocation

```mermaid
pie title Token Budget (128k context)
    "System Prompt" : 2000
    "Conversation History" : 50000
    "Retrieved Context (RAG)" : 30000
    "Current Query" : 1000
    "Response Buffer" : 45000
```

---

## Post 11: Retry Pattern

### Exponential Backoff

```mermaid
sequenceDiagram
    participant Client
    participant API

    Client->>API: Request 1
    API-->>Client: 429 Rate Limited

    Note over Client: Wait 1s

    Client->>API: Request 2
    API-->>Client: 500 Server Error

    Note over Client: Wait 2s

    Client->>API: Request 3
    API-->>Client: 500 Server Error

    Note over Client: Wait 4s

    Client->>API: Request 4
    API-->>Client: 200 OK
```

### Error Classification Flow

```mermaid
flowchart TD
    A[API Error] --> B{Status Code?}

    B -->|4xx| C{Which 4xx?}
    B -->|5xx| D[Server Error - Retry]
    B -->|Network| E[Network Error - Retry]

    C -->|401| F[Auth Error - No Retry]
    C -->|429| G[Rate Limit - Retry with backoff]
    C -->|400| H[Client Error - No Retry]

    D --> I{Retry count < max?}
    E --> I
    G --> I

    I -->|Yes| J[Wait & Retry]
    I -->|No| K[Return Error]

    J --> A
```

---

## Post 12: Optimistic UI

### Message State Machine

```mermaid
stateDiagram-v2
    [*] --> pending: User clicks send

    pending --> sending: API call starts
    pending --> failed: Validation error

    sending --> sent: API success
    sending --> failed: API error

    failed --> sending: User retries

    sent --> [*]
```

---

## Post 17: RAG Pipeline

### Complete RAG Architecture

```mermaid
flowchart TB
    subgraph Ingestion
        D[Documents] --> C[Chunking]
        C --> E[Embedding]
        E --> V[(Vector Store)]
    end

    subgraph Query
        Q[User Query] --> QE[Query Embedding]
        QE --> VS[Vector Search]
        V --> VS
        VS --> RR[Reranking]
        RR --> CTX[Context Assembly]
    end

    subgraph Generation
        CTX --> P[Prompt + Context]
        P --> LLM[LLM]
        LLM --> R[Response]
    end
```

### Chunking Strategies

```mermaid
flowchart LR
    subgraph Fixed Size
        F1[500 tokens] --> F2[500 tokens] --> F3[500 tokens]
    end

    subgraph Semantic
        S1[Section 1] --> S2[Section 2] --> S3[Paragraph]
    end

    subgraph Hierarchical
        H1[Document] --> H2[Section]
        H2 --> H3[Paragraph]
        H1 -.->|parent| H2
        H2 -.->|parent| H3
    end
```

### Hybrid Search

```mermaid
flowchart TD
    Q[Query] --> VEC[Vector Search]
    Q --> KW[Keyword Search]

    VEC --> SC1[Score × 0.7]
    KW --> SC2[Score × 0.3]

    SC1 --> MERGE[Merge & Sort]
    SC2 --> MERGE

    MERGE --> RERANK[Reranking Model]
    RERANK --> TOP[Top K Results]
```

---

## Post 18: AI Agents & Function Calling

### Agent Loop

```mermaid
flowchart TD
    A[User Message] --> B[LLM]
    B --> C{Tool Call?}

    C -->|No| D[Return Response]
    C -->|Yes| E[Parse Tool Call]

    E --> F{Requires Confirmation?}
    F -->|Yes| G[Show Confirmation UI]
    F -->|No| H[Execute Tool]

    G --> I{User Confirms?}
    I -->|Yes| H
    I -->|No| J[Cancel & Respond]

    H --> K[Tool Result]
    K --> B

    D --> L[End]
    J --> L
```

### Tool Execution Safety

```mermaid
flowchart LR
    subgraph Input Validation
        I1[Tool Call] --> I2[Schema Validation]
        I2 --> I3[Permission Check]
    end

    subgraph Execution
        I3 --> E1[Rate Limit Check]
        E1 --> E2[Execute]
        E2 --> E3[Log Action]
    end

    subgraph Output Validation
        E3 --> O1[Sanitize Result]
        O1 --> O2[Return to LLM]
    end
```

---

## Post 19: Prompt Injection Security

### Defense Layers

```mermaid
flowchart TD
    INPUT[User Input] --> L1[Layer 1: Input Validation]
    L1 --> L2[Layer 2: Intent Classification]
    L2 --> L3[Layer 3: Privilege Separation]
    L3 --> LLM[LLM Processing]
    LLM --> L4[Layer 4: Output Validation]
    L4 --> L5[Layer 5: Action Verification]
    L5 --> OUTPUT[Safe Response]

    L1 -.->|Flag suspicious| LOG[Security Log]
    L2 -.->|High risk| LOG
    L4 -.->|Sensitive data| LOG
```

### Attack Vectors

```mermaid
mindmap
    root((Prompt Injection))
        Direct
            Ignore instructions
            New persona
            System prompt leak
        Indirect
            Document injection
            URL content
            User data
        Encoded
            Base64
            Unicode
            HTML entities
        Multi-turn
            Gradual manipulation
            Context poisoning
```

---

## Post 20: AI Memory Systems

### Memory Types

```mermaid
flowchart TB
    subgraph Short-term
        ST1[Conversation Context]
        ST2[Session State]
    end

    subgraph Long-term
        LT1[User Preferences]
        LT2[Learned Facts]
        LT3[Conversation Summaries]
    end

    subgraph Working Memory
        WM1[Current Task]
        WM2[Active Tools]
        WM3[Pending Actions]
    end

    ST1 --> MERGE[Memory Integration]
    LT1 --> MERGE
    WM1 --> MERGE
    MERGE --> LLM[LLM Context]
```

### Memory Retrieval

```mermaid
sequenceDiagram
    participant User
    participant Chat
    participant Memory
    participant LLM

    User->>Chat: New message
    Chat->>Memory: Query relevant memories
    Memory-->>Chat: User preferences, past context
    Chat->>LLM: Message + memories
    LLM-->>Chat: Response
    Chat->>Memory: Store new facts/preferences
    Chat-->>User: Display response
```

---

## Post 24: AI Chat Analytics

### Metrics Pipeline

```mermaid
flowchart LR
    subgraph Collection
        E1[Message Events]
        E2[Session Events]
        E3[Error Events]
    end

    subgraph Processing
        E1 --> P1[Enrich]
        E2 --> P1
        E3 --> P1
        P1 --> P2[Aggregate]
    end

    subgraph Storage
        P2 --> S1[(Time Series DB)]
        P2 --> S2[(Analytics Warehouse)]
    end

    subgraph Visualization
        S1 --> V1[Real-time Dashboard]
        S2 --> V2[Reports]
    end
```

### Key Metrics Hierarchy

```mermaid
mindmap
    root((AI Chat Metrics))
        Engagement
            Sessions/day
            Messages/session
            Session duration
            Return rate
        Quality
            Response relevance
            Task completion
            Error rate
            Regeneration rate
        Performance
            Response latency
            Time to first token
            Throughput
        Cost
            Cost per session
            Cost per message
            Token efficiency
```

---

## Usage Instructions

### Embedding in Markdown

Most markdown renderers support Mermaid with code blocks:

````markdown
```mermaid
flowchart LR
    A --> B
```
````

### Static Image Generation

Use the Mermaid CLI for static images:

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagram.mmd -o diagram.svg
```

### Styling

Add custom styling in the diagram:

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': { 'primaryColor': '#3b82f6'}}}%%
flowchart LR
    A[Start] --> B[End]
```

---

## Diagram Specifications from Graphics Requirements

These diagrams fulfill the specifications in `GRAPHICS_REQUIREMENTS.md`:

| Requirement               | Diagram                   | Location |
| ------------------------- | ------------------------- | -------- |
| Response timing flow      | Response Timing Flow      | Post 1   |
| SSE vs WebSocket          | Protocol Comparison       | Post 7   |
| Context window strategies | Four Strategies           | Post 8   |
| Retry pattern             | Exponential Backoff       | Post 11  |
| Message state machine     | Message State Machine     | Post 12  |
| RAG pipeline              | Complete RAG Architecture | Post 17  |
| Agent loop                | Agent Loop                | Post 18  |
| Security layers           | Defense Layers            | Post 19  |
| Memory architecture       | Memory Types              | Post 20  |
| Analytics pipeline        | Metrics Pipeline          | Post 24  |
