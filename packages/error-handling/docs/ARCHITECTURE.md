# Error Handling System Architecture

This document describes the architecture and design decisions of the Clarity Chat error handling
system.

## Overview

The error handling system provides a comprehensive, type-safe approach to error management in React
applications, with special focus on AI chat interfaces. It includes:

- Custom error class hierarchy
- React error boundaries with enhanced features
- Streaming error recovery
- Provider-specific error parsing
- Analytics and telemetry
- Circuit breaker pattern
- Accessibility support

## Error Class Hierarchy

```mermaid
classDiagram
    class Error {
        +name: string
        +message: string
        +stack?: string
    }

    class ClarityError {
        +code: string
        +recoverable: boolean
        +userMessage: string
        +solution?: string
        +docs?: string
        +context?: Record
        +cause?: Error
        +toJSON(): object
    }

    class ApiError {
        +code: ApiErrorCode
        +statusCode: number
        +endpoint?: string
        +method?: string
        +fromResponse(Response): ApiError
    }

    class StreamingError {
        +code: StreamingErrorCode
        +transport: StreamTransport
        +partialContent?: string
        +hasPartialContent: boolean
        +connectionFailed(): StreamingError
        +connectionLost(): StreamingError
        +timeout(): StreamingError
    }

    class ProviderError {
        +code: ProviderErrorCode
        +provider: AIProvider
        +model?: string
        +retryAfter?: number
        +rateLimit(): ProviderError
        +contextLengthExceeded(): ProviderError
        +fromProviderResponse(): ProviderError
    }

    class ValidationError {
        +fields: FieldError[]
        +statusCode: 400
        +field(): ValidationError
        +required(): ValidationError
        +combine(): ValidationError
    }

    Error <|-- ClarityError
    ClarityError <|-- ApiError
    ClarityError <|-- StreamingError
    ClarityError <|-- ProviderError
    ClarityError <|-- ValidationError
```

### Design Decisions

1. **Base `ClarityError` class**: All custom errors extend this base, providing consistent behavior:
   - `userMessage`: Safe message for end users (no sensitive info)
   - `solution`: Actionable guidance for recovery
   - `recoverable`: Indicates if retry is appropriate
   - `toJSON()`: Serialization for logging

2. **Specific error classes**: Each error type knows its domain:
   - `ApiError`: HTTP/REST API errors
   - `StreamingError`: SSE/WebSocket connection issues
   - `ProviderError`: AI provider-specific errors (OpenAI, Anthropic, etc.)
   - `ValidationError`: Input validation with field-level details

3. **Static factory methods**: Convenient creation with appropriate defaults:
   ```typescript
   StreamingError.connectionLost('sse', partialContent)
   ProviderError.rateLimit('openai', 30) // 30 second retry-after
   ```

## Error Boundary Architecture

```mermaid
flowchart TB
    subgraph "React Component Tree"
        App[App]
        EP[ErrorAnalyticsProvider]
        EBD[ErrorBoundaryDevTools]
        EEB[EnhancedErrorBoundary]
        CEB[ChatErrorBoundary]
        Chat[Chat Component]
    end

    subgraph "Error Handling Flow"
        Error[Error Thrown]
        Catch[componentDidCatch]
        Log[Log Error]
        Analytics[Record Analytics]
        Fallback[Show Fallback UI]
        Retry[User Retries]
        Reset[Reset Boundary]
    end

    App --> EP
    EP --> EBD
    EBD --> EEB
    EEB --> CEB
    CEB --> Chat

    Chat --> Error
    Error --> Catch
    Catch --> Log
    Catch --> Analytics
    Catch --> Fallback
    Fallback --> Retry
    Retry --> Reset
    Reset --> Chat
```

### Component Responsibilities

| Component                | Purpose                              |
| ------------------------ | ------------------------------------ |
| `ErrorAnalyticsProvider` | Context for error metrics collection |
| `ErrorBoundaryDevTools`  | Development-only debugging panel     |
| `EnhancedErrorBoundary`  | Generic error boundary with logging  |
| `ChatErrorBoundary`      | Chat-specific error handling         |

## Circuit Breaker State Machine

```mermaid
stateDiagram-v2
    [*] --> Closed

    Closed --> Closed: Success (reset failures)
    Closed --> Open: Failures >= Threshold

    Open --> HalfOpen: Reset time elapsed
    Open --> Open: Request blocked

    HalfOpen --> Closed: Success
    HalfOpen --> Open: Failure
```

### Circuit Breaker Configuration

```typescript
const config = {
  threshold: 5, // Failures before opening
  resetTime: 30000, // Time before half-open (ms)
  persistKey: 'chat', // localStorage persistence key
}
```

### State Transitions

1. **Closed → Open**: After `threshold` consecutive failures
2. **Open → Half-Open**: After `resetTime` ms have elapsed
3. **Half-Open → Closed**: On successful request
4. **Half-Open → Open**: On any failure

## Retry Strategy with Jitter

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant CB as Circuit Breaker

    C->>S: Request 1
    S-->>C: Error (429 Rate Limit)
    C->>CB: Record Failure
    Note over C: Wait 1s + jitter

    C->>S: Request 2 (Retry)
    S-->>C: Error (429)
    C->>CB: Record Failure
    Note over C: Wait 2s + jitter

    C->>S: Request 3 (Retry)
    S-->>C: Error (429)
    C->>CB: Record Failure
    Note over C: Wait 4s + jitter

    C->>S: Request 4 (Retry)
    S-->>C: Success ✓
    C->>CB: Record Success
```

### Jitter Formula

```typescript
function calculateDelayWithJitter(
  baseDelay: number,
  attempt: number,
  jitterFactor: number = 0.3
): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * jitterFactor * exponentialDelay
  return Math.floor(exponentialDelay + jitter)
}
```

**Why jitter?** Without jitter, multiple clients hitting the same rate limit will retry
simultaneously, causing a "thundering herd" problem. Random jitter spreads retries over time.

## Provider Error Detection

```mermaid
flowchart LR
    subgraph Input
        Response[API Response]
        Status[Status Code]
        Body[Error Body]
    end

    subgraph Detection
        Patterns[Pattern Matching]
        Confidence[Confidence Scoring]
    end

    subgraph Output
        Code[Error Code]
        Message[Message]
        Solution[Solution]
        Retry[Retry After]
    end

    Response --> Patterns
    Status --> Patterns
    Body --> Patterns
    Patterns --> Confidence
    Confidence --> Code
    Confidence --> Message
    Confidence --> Solution
    Confidence --> Retry
```

### Confidence Levels

| Level    | Meaning                  | Example                                |
| -------- | ------------------------ | -------------------------------------- |
| `high`   | Exact match on code/type | `error.type === 'rate_limit_exceeded'` |
| `medium` | Pattern in message       | `message.includes('too long')`         |
| `low`    | Status code only         | `statusCode >= 500`                    |

## Data Flow

```mermaid
flowchart TB
    subgraph "User Action"
        Send[Send Message]
    end

    subgraph "Error Path"
        Throw[Error Thrown]
        Boundary[Error Boundary]
        Analyze[Analyze Error]
        Log[Error Logger]
        Analytics[Analytics]
    end

    subgraph "Recovery"
        Fallback[Fallback UI]
        Countdown[Retry Countdown]
        Retry[Retry Request]
    end

    subgraph "External"
        Console[Console]
        Service[Logging Service]
        Dashboard[Analytics Dashboard]
    end

    Send --> Throw
    Throw --> Boundary
    Boundary --> Analyze
    Analyze --> Log
    Analyze --> Analytics
    Log --> Console
    Log --> Service
    Analytics --> Dashboard
    Analyze --> Fallback
    Fallback --> Countdown
    Countdown --> Retry
    Retry --> Send
```

## Backpressure Strategies

The error logger implements backpressure to prevent memory issues:

```mermaid
flowchart TD
    subgraph "Log Entry"
        New[New Log]
    end

    subgraph "Queue Check"
        Full{Queue Full?}
    end

    subgraph "Strategies"
        DropOldest[Drop Oldest]
        DropNewest[Drop Newest]
        Block[Block & Wait]
    end

    subgraph "Output"
        Queue[Add to Queue]
        Flush[Flush to Service]
    end

    New --> Full
    Full -->|No| Queue
    Full -->|Yes, drop-oldest| DropOldest --> Queue
    Full -->|Yes, drop-newest| DropNewest
    Full -->|Yes, block| Block --> Queue
    Queue --> Flush
```

## Accessibility Architecture

```mermaid
flowchart LR
    subgraph "Focus Management"
        Capture[Capture Focus]
        Move[Move to Error]
        Trap[Trap Focus]
        Restore[Restore Focus]
    end

    subgraph "Announcements"
        Live[aria-live region]
        SR[Screen Reader]
    end

    subgraph "Visual"
        Anim[Animations]
        Motion[prefers-reduced-motion]
    end

    Capture --> Move
    Move --> Trap
    Trap --> Restore
    Move --> Live
    Live --> SR
    Anim --> Motion
```

### Accessibility Features

1. **Focus management**: Focus moves to error on occurrence, returns on recovery
2. **ARIA live regions**: Errors announced to screen readers
3. **Reduced motion**: Animations disabled when requested
4. **Keyboard navigation**: Full keyboard support for error UI

## Extension Points

The system is designed for extensibility:

### Custom Error Types

```typescript
class CustomError extends ClarityError {
  constructor(message: string) {
    super(message, {
      recoverable: true,
      solution: 'Custom guidance',
    })
  }

  get userMessage(): string {
    return 'Custom user-friendly message'
  }
}
```

### Custom Analytics Callbacks

```typescript
<ErrorAnalyticsProvider
  callbacks={{
    onErrorRecorded: (entry) => sendToDatadog(entry),
    onCircuitTrip: (type) => alertPagerDuty(type),
  }}
>
```

### Custom Fallback Components

```typescript
<EnhancedErrorBoundary
  FallbackComponent={({ error, resetErrorBoundary }) => (
    <CustomErrorUI error={error} onRetry={resetErrorBoundary} />
  )}
>
```

## Performance Considerations

1. **Lazy loading**: Dev tools only load in development
2. **Memoization**: Context values are memoized
3. **Batching**: Error logger batches logs to reduce network calls
4. **Cleanup**: Stale circuit breaker entries are cleaned up

## Security Considerations

1. **No sensitive data in userMessage**: Error details stay in logs
2. **Input sanitization**: SSE parsing limits depth and size
3. **XSS prevention**: HTML entities escaped in error messages
4. **No stack traces in production**: Configurable via logger
