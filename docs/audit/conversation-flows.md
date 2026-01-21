# Conversation Flow Documentation

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 1 - Flow Documentation

## Overview

This document maps the complete conversation flow from user input through AI service calls to response presentation, including state management and context handling.

## Primary Flow: User Message to AI Response

```mermaid
sequenceDiagram
    participant User
    participant ChatInput
    participant ChatWindow
    participant useClarityChat
    participant TokenCounter
    participant APIEndpoint
    participant AIService
    participant StreamingHook
    participant MessageList
    participant User as User

    User->>ChatInput: Types message
    ChatInput->>ChatInput: Validate input
    ChatInput->>ChatInput: Check token count
    ChatInput->>ChatWindow: onSubmit(message)
    ChatWindow->>useClarityChat: append(userMessage)
    useClarityChat->>TokenCounter: Check token limit
    TokenCounter-->>useClarityChat: Within limit
    useClarityChat->>useClarityChat: Add user message to state
    useClarityChat->>APIEndpoint: POST /api/chat
    Note over useClarityChat,APIEndpoint: { messages, model, stream: true }
    APIEndpoint->>AIService: Forward request
    AIService-->>APIEndpoint: Stream chunks
    APIEndpoint-->>StreamingHook: SSE events
    StreamingHook->>useClarityChat: onChunk(chunk)
    useClarityChat->>useClarityChat: Accumulate content
    useClarityChat->>ChatWindow: Update messages state
    ChatWindow->>MessageList: Render updated messages
    MessageList->>User: Display streaming text
    StreamingHook->>useClarityChat: onComplete()
    useClarityChat->>TokenCounter: Update token stats
    useClarityChat->>ChatWindow: Final message state
    ChatWindow->>MessageList: Render final message
```

## Streaming Flow Detail

```mermaid
sequenceDiagram
    participant Hook
    participant FetchAPI
    participant StreamReader
    participant Decoder
    participant ChunkProcessor
    participant StateManager
    participant Component

    Hook->>FetchAPI: fetch(url, { stream: true })
    FetchAPI-->>Hook: Response with body stream
    Hook->>StreamReader: response.body.getReader()
    loop For each chunk
        StreamReader->>StreamReader: reader.read()
        StreamReader-->>Hook: { done, value }
        Hook->>Decoder: decode(value, { stream: true })
        Decoder-->>Hook: text chunk
        Hook->>ChunkProcessor: processChunk(chunk)
        ChunkProcessor->>ChunkProcessor: Parse SSE format
        ChunkProcessor->>ChunkProcessor: Extract data
        ChunkProcessor->>StateManager: accumulateContent(data)
        StateManager->>StateManager: Update message content
        StateManager->>Component: Trigger re-render
        Component->>Component: Display updated content
    end
    StreamReader-->>Hook: done = true
    Hook->>StateManager: Finalize message
    Hook->>Component: onComplete callback
```

## Token Management Flow

```mermaid
flowchart TD
    A[User Input] --> B{Token Counter}
    B --> C{Within Limit?}
    C -->|Yes| D[Send to AI]
    C -->|No| E{Policy?}
    E -->|truncate| F[Truncate Old Messages]
    E -->|summarize| G[Summarize Old Messages]
    E -->|refuse| H[Show Error]
    F --> D
    G --> D
    D --> I[AI Processing]
    I --> J[Update Token Stats]
    J --> K[Display Usage]
    
    style C fill:#ffeb3b
    style E fill:#ff9800
    style H fill:#f44336
```

## Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Response Status}
    B -->|200 OK| C[Process Response]
    B -->|429 Rate Limit| D[Parse Retry-After]
    B -->|401/403 Auth| E[Show Auth Error]
    B -->|500 Server| F[Retry with Backoff]
    B -->|Network Error| G[Check Connection]
    
    D --> H{Retry Logic}
    H -->|Wait| I[Queue Request]
    H -->|Max Retries| J[Show Rate Limit Error]
    
    F --> K{Retry Count}
    K -->|< Max| L[Exponential Backoff]
    K -->|>= Max| M[Show Server Error]
    
    G --> N{Online?}
    N -->|Yes| O[Retry Request]
    N -->|No| P[Show Offline Error]
    
    C --> Q[Update UI]
    E --> R[Error Banner]
    J --> R
    M --> R
    P --> R
    
    style B fill:#2196f3
    style D fill:#ff9800
    style E fill:#f44336
    style F fill:#ff9800
```

## Context Window Management Flow

```mermaid
flowchart TD
    A[New Message] --> B[Count Current Tokens]
    B --> C{Exceeds Limit?}
    C -->|No| D[Add Message]
    C -->|Yes| E{Strategy}
    E -->|Truncate| F[Remove Oldest Messages]
    E -->|Summarize| G[Summarize Old Messages]
    E -->|Hybrid| H[Truncate + Summarize]
    
    F --> I[Update Context]
    G --> I
    H --> I
    
    I --> J[Send to AI]
    J --> K[Receive Response]
    K --> L[Update Token Count]
    L --> M[Display Usage]
    
    style C fill:#ffeb3b
    style E fill:#ff9800
```

## State Management Architecture

```mermaid
graph TB
    subgraph "Component Layer"
        A[ChatWindow]
        B[ChatInput]
        C[MessageList]
    end
    
    subgraph "Hook Layer"
        D[useClarityChat]
        E[useStreamingSSE]
        F[useTokenCounter]
        G[useMemory]
    end
    
    subgraph "State Storage"
        H[React State]
        I[localStorage]
        J[Server Storage]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    G --> I
    D --> J
    
    style D fill:#4caf50
    style H fill:#2196f3
    style I fill:#ff9800
    style J fill:#9c27b0
```

## Memory/Context Flow

```mermaid
sequenceDiagram
    participant Component
    participant useMemory
    participant Storage
    participant useClarityChat
    participant AIService

    Component->>useClarityChat: Send message
    useClarityChat->>useMemory: Get context
    useMemory->>Storage: Load messages
    Storage-->>useMemory: Messages
    useMemory->>useMemory: Filter by relevance
    useMemory->>useMemory: Apply token limit
    useMemory-->>useClarityChat: Context messages
    useClarityChat->>AIService: Request with context
    AIService-->>useClarityChat: Response
    useClarityChat->>useMemory: Save new message
    useMemory->>Storage: Persist message
    useClarityChat->>Component: Update UI
```

## Multi-Turn Conversation Flow

```mermaid
stateDiagram-v2
    [*] --> Empty: Initial Load
    Empty --> UserTyping: User starts typing
    UserTyping --> Validating: User submits
    Validating --> Sending: Input valid
    Validating --> Error: Input invalid
    Sending --> Streaming: AI responds
    Streaming --> Complete: Stream finished
    Streaming --> Error: Stream failed
    Complete --> UserTyping: User continues
    Complete --> [*]: User exits
    Error --> UserTyping: Retry
    Error --> [*]: Cancel
```

## Tool Calling Flow

```mermaid
sequenceDiagram
    participant User
    participant Chat
    participant AI
    participant ToolExecutor
    participant Tool
    participant Chat as Chat

    User->>Chat: Send message with tool request
    Chat->>AI: Request with tool definitions
    AI-->>Chat: Tool call response
    Chat->>ToolExecutor: Execute tool
    ToolExecutor->>Tool: Call tool function
    Tool-->>ToolExecutor: Tool result
    ToolExecutor->>Chat: Return result
    Chat->>AI: Send tool result
    AI-->>Chat: Final response
    Chat->>User: Display response
```

## Rate Limiting Flow

```mermaid
flowchart TD
    A[Request Ready] --> B{Rate Limit Check}
    B -->|Allowed| C[Send Request]
    B -->|Limited| D[Check Retry-After]
    D --> E{Has Retry-After?}
    E -->|Yes| F[Wait Retry-After seconds]
    E -->|No| G[Exponential Backoff]
    F --> H[Queue Request]
    G --> H
    H --> I{Queue Full?}
    I -->|No| J[Add to Queue]
    I -->|Yes| K[Reject Request]
    J --> L[Process Queue]
    L --> C
    C --> M{Response}
    M -->|Success| N[Update Rate Limit State]
    M -->|429| D
    M -->|Other Error| O[Handle Error]
    
    style B fill:#ffeb3b
    style D fill:#ff9800
    style K fill:#f44336
```

## Component Interaction Flow

```mermaid
graph LR
    A[ChatInput] -->|onSubmit| B[ChatWindow]
    B -->|calls| C[useClarityChat]
    C -->|uses| D[useStreamingSSE]
    C -->|uses| E[useTokenCounter]
    C -->|uses| F[useMemory]
    D -->|updates| G[Message State]
    E -->|tracks| H[Token Stats]
    F -->|manages| I[Context]
    G -->|renders| J[MessageList]
    H -->|displays| K[TokenCounter]
    I -->|shows| L[ContextVisualizer]
    
    style C fill:#4caf50
    style D fill:#2196f3
    style E fill:#ff9800
    style F fill:#9c27b0
```

## State Synchronization Flow

```mermaid
sequenceDiagram
    participant Client1
    participant Client2
    participant Server
    participant Database

    Client1->>Server: Send message
    Server->>Database: Save message
    Server-->>Client1: Confirm
    Server->>Server: Broadcast update
    Server-->>Client2: Push update
    Client2->>Client2: Update local state
    
    Note over Client1,Client2: Both clients see same state
```

## Notes

- All flows support both streaming and non-streaming modes
- Error handling is integrated at each step
- Token management happens before sending requests
- State updates are batched for performance
- Memory/context is managed transparently
- Rate limiting is handled automatically
