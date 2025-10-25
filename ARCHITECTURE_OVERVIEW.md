# Clarity Chat AI - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLARITY CHAT AI v2.0                          │
│                  Production-Ready AI Chat Library                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ MessageList  │  │  ChatInput   │  │ TokenCounter │              │
│  │              │  │              │  │              │              │
│  │ • Display    │  │ • Send msg   │  │ • Count      │              │
│  │ • Scroll     │  │ • Voice      │  │ • Warning    │              │
│  │ • Auto-load  │  │ • File       │  │ • Cost       │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ RetryButton  │  │NetworkStatus │  │StreamCancel  │              │
│  │              │  │              │  │              │              │
│  │ • Retry      │  │ • Monitor    │  │ • Cancel     │              │
│  │ • Backoff    │  │ • Ping       │  │ • Progress   │              │
│  │ • Progress   │  │ • Quality    │  │ • Indicator  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Uses
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         HOOK LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────── STREAMING ───────────────┐                        │
│  │                                          │                        │
│  │  useStreamingSSE                         │                        │
│  │  • Fetch + ReadableStream                │                        │
│  │  • Auto-reconnect (exponential backoff)  │                        │
│  │  • Auth (header + cookie fallback)       │                        │
│  │  • Resume from last event ID             │                        │
│  │  • Heartbeat monitoring                  │                        │
│  │                                          │                        │
│  │  useStreamingWebSocket                   │                        │
│  │  • WebSocket connection                  │                        │
│  │  • Ping-pong heartbeat                   │                        │
│  │  • Auto-reconnect                        │                        │
│  │  • Binary + text support                 │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                       │
│  ┌─────────────── ERROR HANDLING ───────────┐                        │
│  │                                           │                        │
│  │  useErrorRecovery                         │                        │
│  │  • Retry with exponential backoff         │                        │
│  │  • Error classification (network/auth)    │                        │
│  │  • User-friendly messages                 │                        │
│  │  • Configurable retry conditions          │                        │
│  │  • Manual retry support                   │                        │
│  └───────────────────────────────────────────┘                        │
│                                                                       │
│  ┌─────────────── TOKEN MANAGEMENT ──────────┐                       │
│  │                                            │                       │
│  │  useTokenTracker                           │                       │
│  │  • Input/output token tracking             │                       │
│  │  • Cost estimation (GPT-4, Claude, etc.)   │                       │
│  │  • Warning thresholds (80%, 95%)           │                       │
│  │  • Context limit validation                │                       │
│  │  • Pruning suggestions                     │                       │
│  └────────────────────────────────────────────┘                       │
│                                                                       │
│  ┌─────────────── MESSAGE OPERATIONS ────────┐                       │
│  │                                            │                       │
│  │  useMessageOperations                      │                       │
│  │  • Edit messages (with version history)    │                       │
│  │  • Regenerate AI responses                 │                       │
│  │  • Branch conversations                    │                       │
│  │  • Undo/redo operations                    │                       │
│  │  • Delete messages                         │                       │
│  └────────────────────────────────────────────┘                       │
│                                                                       │
│  ┌─────────────── REALISTIC UX ──────────────┐                       │
│  │                                            │                       │
│  │  useRealisticTyping                        │                       │
│  │  • Multi-stage indicators                  │                       │
│  │  • Adaptive delays (input-based)           │                       │
│  │  • Progress tracking                       │                       │
│  │  • Prevents instant responses              │                       │
│  └────────────────────────────────────────────┘                       │
│                                                                       │
│  ┌─────────────── UTILITY HOOKS ─────────────┐                       │
│  │                                            │                       │
│  │  useAutoScroll, useClipboard               │                       │
│  │  useDebounce, useThrottle                  │                       │
│  │  useLocalStorage, useMediaQuery            │                       │
│  │  useKeyboardShortcuts, useToggle           │                       │
│  └────────────────────────────────────────────┘                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Communicates with
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────── API ENDPOINTS ─────────────┐                         │
│  │                                          │                         │
│  │  POST /api/chat                          │                         │
│  │  • Regular request-response              │                         │
│  │  • JSON payload                          │                         │
│  │                                          │                         │
│  │  POST /api/chat/stream                   │                         │
│  │  • SSE streaming                         │                         │
│  │  • Content-Type: text/event-stream       │                         │
│  │  • Authorization: Bearer token           │                         │
│  │                                          │                         │
│  │  WS /api/chat/ws                         │                         │
│  │  • WebSocket connection                  │                         │
│  │  • Bidirectional                         │                         │
│  │  • Real-time updates                     │                         │
│  └──────────────────────────────────────────┘                         │
│                                                                       │
│  ┌───────────── AI PROVIDERS ──────────────┐                         │
│  │                                          │                         │
│  │  • OpenAI (GPT-4, GPT-3.5)               │                         │
│  │  • Anthropic (Claude 3)                  │                         │
│  │  • Custom models                         │                         │
│  └──────────────────────────────────────────┘                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Normal Message Flow

```
User Types Message
        │
        ▼
  ChatInput Component
        │
        ▼
  useTokenTracker ────► Check token limit
        │                     │
        │                     ▼
        │              [OK] / [Exceeds]
        │                     │
        ▼                     │
  useErrorRecovery            │
        │                     │
        ▼                     │
  POST /api/chat              │
        │                     │
        ▼                     │
  AI Provider                 │
        │                     │
        ▼                     │
  Response                    │
        │                     │
        ▼                     │
  useRealisticTyping ────► Add delay
        │
        ▼
  Display Response
        │
        ▼
  useTokenTracker ────► Update count
```

### 2. Streaming Message Flow

```
User Types Message
        │
        ▼
  ChatInput Component
        │
        ▼
  useStreamingSSE ────► connect()
        │
        ▼
  POST /api/chat/stream
        │
        ▼
  [Server-Sent Events]
        │
        ├─► event: token ────► Accumulate
        ├─► event: token ────► Display
        ├─► event: token ────► Partial update
        └─► event: done  ────► Finalize
                 │
                 ▼
           disconnect()
                 │
                 ▼
         useTokenTracker ────► Update count
```

### 3. Error Recovery Flow

```
API Request Fails
        │
        ▼
  useErrorRecovery
        │
        ├─► Classify Error
        │   ├─► Network? ────► Retry
        │   ├─► Rate limit? ─► Wait + Retry
        │   ├─► Server? ─────► Retry
        │   └─► Auth? ───────► Don't retry
        │
        ▼
  Exponential Backoff
        │
        ├─► Attempt 1: 1s delay
        ├─► Attempt 2: 3s delay
        └─► Attempt 3: 10s delay
                 │
                 ▼
           [Success] / [Max attempts]
                 │            │
                 ▼            ▼
           Return data   Show error + retry button
```

### 4. Network Reconnection Flow

```
Network Goes Offline
        │
        ▼
  NetworkStatus ────► Detect offline
        │
        ▼
  useStreamingSSE ───► Auto-disconnect
        │
        ▼
  Display "Offline" warning
        │
        │ [Network restored]
        │
        ▼
  NetworkStatus ────► Detect online
        │
        ▼
  useStreamingSSE ───► Auto-reconnect
        │
        ▼
  Resume conversation
```

---

## State Management

### Message State

```
useMessageOperations
        │
        ├─► messages: MessageWithOperations[]
        │   ├─► id, role, content, timestamp
        │   ├─► branchId (for forking)
        │   ├─► parentId (for context)
        │   └─► version (for edits)
        │
        ├─► history: MessageOperation[]
        │   └─► type, messageId, timestamp, previousState
        │
        └─► Operations
            ├─► addMessage()
            ├─► editMessage()
            ├─► deleteMessage()
            ├─► regenerateMessage()
            ├─► branchConversation()
            ├─► undo()
            └─► redo()
```

### Token State

```
useTokenTracker
        │
        ├─► tokens: number (total)
        ├─► inputTokens: number (user)
        ├─► outputTokens: number (assistant)
        ├─► estimatedCost: number (USD)
        │
        ├─► Thresholds
        │   ├─► isNearLimit (80%)
        │   └─► isCritical (95%)
        │
        └─► Operations
            ├─► addMessage()
            ├─► removeMessage()
            ├─► clear()
            └─► canSend()
```

### Error State

```
useErrorRecovery
        │
        ├─► error: Error | null
        ├─► errorType: 'network' | 'ratelimit' | 'server' | 'auth'
        ├─► errorMessage: string (user-friendly)
        │
        ├─► Retry State
        │   ├─► attemptNumber: number
        │   ├─► canRetry: boolean
        │   ├─► isRetrying: boolean
        │   └─► isLoading: boolean
        │
        └─► Operations
            ├─► execute()
            ├─► retry()
            └─► reset()
```

---

## Component Hierarchy

```
<ErrorBoundary>
  │
  └─► <ChatApplication>
       │
       ├─► <NetworkStatus />
       │
       ├─► <TokenCounter />
       │
       ├─► <MessageList>
       │    │
       │    └─► <Message>
       │         ├─► <CopyButton />
       │         ├─► [Edit Button]
       │         ├─► [Regenerate Button]
       │         └─► [Branch Button]
       │
       ├─► <TypingIndicator>
       │    └─► Progress bar + stage label
       │
       ├─► <StreamCancellation />
       │
       ├─► <RetryButton />
       │    └─► Countdown + attempts
       │
       └─► <ChatInput>
            ├─► Text input
            ├─► File upload
            └─► Voice input
```

---

## Hook Dependencies

```
Component
    │
    ├─► useMessageOperations
    │    │
    │    └─► (stores messages in state)
    │
    ├─► useTokenTracker
    │    │
    │    ├─► Uses messages from useMessageOperations
    │    └─► Calculates tokens + cost
    │
    ├─► useRealisticTyping
    │    │
    │    └─► (independent timing logic)
    │
    ├─► useStreamingSSE
    │    │
    │    ├─► Uses useErrorRecovery internally
    │    └─► Auto-reconnection logic
    │
    └─► useErrorRecovery
         │
         └─► Wraps API calls with retry
```

---

## Performance Considerations

### 1. Message List Virtualization
```typescript
// For 1000+ messages
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={100}
>
  {MessageItem}
</FixedSizeList>
```

### 2. Memoization
```typescript
// Prevent unnecessary re-renders
const MessageList = React.memo(MessageListComponent)
const TokenCounter = React.memo(TokenCounterComponent)
```

### 3. Debouncing
```typescript
// Debounce token counting
const { debouncedValue } = useDebounce(inputText, 300)
const tokens = estimateTokens(debouncedValue)
```

### 4. Lazy Loading
```typescript
// Code splitting for large components
const AdvancedChatInput = React.lazy(
  () => import('./AdvancedChatInput')
)
```

---

## Security Architecture

### 1. Authentication

```
Client ──────► useStreamingSSE
                    │
                    ├─► Prefer: Authorization header
                    │   (Bearer token)
                    │
                    └─► Fallback: Cookie-based auth
                        (credentials: 'include')
```

### 2. Token Refresh

```
API Call
    │
    ├─► Check token expiration
    │   │
    │   └─► < 5 minutes? ──► Refresh token
    │                             │
    │                             └─► Continue with new token
    │
    └─► Make request
```

### 3. Rate Limiting

```
Client Request
        │
        ▼
useErrorRecovery
        │
        ├─► Detect 429 (rate limit)
        │   │
        │   └─► Wait (exponential backoff)
        │       │
        │       └─► Retry
        │
        └─► Success
```

---

## Deployment Architecture

```
┌──────────────────────────────────────┐
│         CDN (Cloudflare)             │
│  • Static assets                     │
│  • Edge caching                      │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│      Frontend (React App)            │
│  • Clarity Chat AI components        │
│  • Deployed on Vercel/Netlify        │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│       API Gateway                    │
│  • Rate limiting                     │
│  • Authentication                    │
│  • CORS handling                     │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│     Backend Services                 │
│  • Node.js + Express                 │
│  • SSE streaming endpoints           │
│  • WebSocket server                  │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│        AI Providers                  │
│  • OpenAI API                        │
│  • Anthropic API                     │
│  • Custom models                     │
└──────────────────────────────────────┘
```

---

## Monitoring & Observability

### 1. Error Tracking
```
ErrorBoundary ──────► Sentry.captureException()
useErrorRecovery ───► Log retry attempts
NetworkStatus ──────► Track connection quality
```

### 2. Analytics
```
User Actions ────────► analytics.track()
  • message_sent
  • message_edited
  • conversation_branched
  • token_warning
  • error_retry
```

### 3. Performance Metrics
```
useRealisticTyping ─────► Track response times
useStreamingSSE ────────► Track latency
useTokenTracker ────────► Track token usage
```

---

## Summary

**Clarity Chat AI v2.0** provides:

1. **Complete Infrastructure** - Streaming, error recovery, token management
2. **Production-Ready** - Zero configuration needed
3. **Type-Safe** - 100% TypeScript with full type coverage
4. **Accessible** - WCAG 2.1 AA compliant
5. **Performant** - Optimized for 1000+ messages
6. **Secure** - Auth + rate limiting + error handling
7. **Observable** - Monitoring + analytics + error tracking

**Result:** Enterprise-grade AI chat in hours, not weeks.
