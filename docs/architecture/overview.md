# System Architecture Overview

This document provides a comprehensive overview of Clarity Chat's architecture, design decisions, and technical implementation.

---

## 🏗️ **High-Level Architecture**

```mermaid
graph TB
    subgraph "User Application"
        APP[Your React App]
        APP --> THEME[ThemeProvider]
        APP --> ANALYTICS[AnalyticsProvider]
        APP --> ERROR[ErrorReporterProvider]
    end

    subgraph "@clarity-chat/react Package"
        THEME --> WINDOW[ChatWindow]
        ANALYTICS --> WINDOW
        ERROR --> WINDOW
        
        WINDOW --> MSGLIST[MessageList]
        WINDOW --> INPUT[ChatInput]
        WINDOW --> SIDEBAR[ProjectSidebar]
        
        MSGLIST --> MSG[Message]
        MSG --> MARKDOWN[ReactMarkdown]
        MSG --> CODE[Syntax Highlighting]
        
        INPUT --> VOICE[VoiceInput]
        INPUT --> FILE[FileUpload]
        INPUT --> AUTOCOMPLETE[Autocomplete]
    end

    subgraph "Hooks Layer"
        WINDOW --> USECHAT[useChat]
        WINDOW --> USESTREAM[useStreaming]
        WINDOW --> USEERROR[useErrorRecovery]
        WINDOW --> USEANALYTICS[useAnalytics]
    end

    subgraph "External Services"
        USESTREAM --> API[AI API]
        USEANALYTICS --> GA[Google Analytics]
        USEANALYTICS --> MIXPANEL[Mixpanel]
        USEERROR --> SENTRY[Sentry]
    end

    style APP fill:#4A90E2
    style WINDOW fill:#7ED321
    style USECHAT fill:#F5A623
    style API fill:#BD10E0
```

---

## 📦 **Monorepo Structure**

### **Package Organization**

```
Clarity-ai-chat-components/
├── packages/
│   ├── react/              # 🎯 Main library (32,650 LOC)
│   │   ├── src/
│   │   │   ├── components/     # 47 React components
│   │   │   ├── hooks/          # 25+ custom hooks
│   │   │   ├── analytics/      # Analytics system
│   │   │   ├── ai/             # AI features (suggestions, moderation)
│   │   │   ├── error/          # Error tracking integration
│   │   │   ├── accessibility/  # WCAG 2.1 AAA features
│   │   │   ├── theme/          # 11 built-in themes
│   │   │   ├── animations/     # Framer Motion animations
│   │   │   ├── templates/      # Pre-built templates
│   │   │   ├── utils/          # Utility functions
│   │   │   └── index.ts        # Public API exports
│   │   ├── __tests__/          # Test suite
│   │   └── package.json
│   │
│   ├── types/              # 📝 TypeScript definitions
│   │   └── src/
│   │       ├── message.ts      # Message types
│   │       ├── chat.ts         # Chat types
│   │       ├── context.ts      # Context types
│   │       └── index.ts
│   │
│   ├── primitives/         # 🧱 Base UI components
│   │   └── src/components/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── avatar.tsx
│   │       └── ... (10+ primitives)
│   │
│   ├── error-handling/     # 🛡️ Error recovery system
│   │   ├── src/
│   │   │   ├── errors/         # 10 specialized error classes
│   │   │   ├── components/     # ErrorBoundary, fallback UIs
│   │   │   ├── hooks/          # Error handling hooks
│   │   │   └── factories/      # Error factory functions
│   │   └── docs/
│   │
│   ├── dev-tools/          # 🛠️ Developer utilities
│   └── cli/                # 💻 CLI tools
│
├── apps/
│   ├── storybook/          # 📚 Interactive documentation
│   │   └── stories/            # Component stories
│   └── docs/               # 📖 VitePress documentation site
│
├── examples/               # 💡 Working examples (9 apps)
│   ├── basic-chat/
│   ├── ai-assistant/
│   ├── customer-support/
│   ├── streaming-chat/
│   └── ... (5 more)
│
└── docs/                   # 📄 Markdown documentation
    ├── getting-started/
    ├── guides/
    ├── api/
    └── architecture/
```

---

## 🎨 **Component Hierarchy**

### **Core Component Tree**

```mermaid
graph TD
    ROOT[ThemeProvider] --> WINDOW[ChatWindow]
    
    WINDOW --> HEADER[Header]
    WINDOW --> SIDEBAR[ProjectSidebar]
    WINDOW --> MAIN[Main Content Area]
    WINDOW --> FOOTER[Footer]
    
    SIDEBAR --> PROJLIST[Project List]
    SIDEBAR --> CONVLIST[Conversation List]
    
    MAIN --> MSGLIST[MessageList]
    MAIN --> CONTEXT[ContextManager]
    
    MSGLIST --> VIRTUALIZED[VirtualizedList]
    VIRTUALIZED --> MSG[Message]
    
    MSG --> AVATAR[Avatar]
    MSG --> CONTENT[Message Content]
    MSG --> ACTIONS[Message Actions]
    
    CONTENT --> MARKDOWN[ReactMarkdown]
    CONTENT --> CODE[Code Block]
    CONTENT --> THINKING[ThinkingIndicator]
    
    ACTIONS --> COPY[CopyButton]
    ACTIONS --> EDIT[Edit Button]
    ACTIONS --> RETRY[RetryButton]
    
    FOOTER --> INPUT[AdvancedChatInput]
    FOOTER --> VOICE[VoiceInput]
    FOOTER --> FILE[FileUpload]
    
    INPUT --> AUTOCOMPLETE[Autocomplete]
    INPUT --> MENTIONS[@mentions]
    INPUT --> COMMANDS[/commands]

    style WINDOW fill:#4A90E2
    style MSGLIST fill:#7ED321
    style INPUT fill:#F5A623
```

---

## 🔄 **Data Flow Architecture**

### **Message Lifecycle**

```mermaid
sequenceDiagram
    participant User
    participant ChatInput
    participant useChat
    participant API
    participant MessageList

    User->>ChatInput: Types message
    ChatInput->>ChatInput: Validate input
    ChatInput->>useChat: onSendMessage(content)
    
    useChat->>useChat: Create user message
    useChat->>MessageList: Update messages (optimistic)
    MessageList->>User: Show user message
    
    useChat->>API: POST /api/chat
    
    alt Streaming Response
        API-->>useChat: Stream chunk 1
        useChat->>MessageList: Update (interim)
        API-->>useChat: Stream chunk 2
        useChat->>MessageList: Update (interim)
        API-->>useChat: Stream complete
        useChat->>MessageList: Final update
    else Error
        API-->>useChat: Error response
        useChat->>useChat: Trigger error recovery
        useChat->>MessageList: Show error UI
    end
    
    MessageList->>User: Show AI response
```

### **State Management Flow**

```mermaid
graph LR
    subgraph "Component State"
        LOCAL[Component State<br/>useState]
    end
    
    subgraph "Context State"
        CHAT[ChatContext<br/>useContext]
        THEME[ThemeContext]
        ANALYTICS[AnalyticsContext]
    end
    
    subgraph "Hook State"
        USECHAT[useChat<br/>messages, send]
        USESTREAM[useStreaming<br/>stream status]
        USEERROR[useErrorRecovery<br/>retry logic]
    end
    
    subgraph "Persistent State"
        LOCALSTORAGE[LocalStorage<br/>useLocalStorage]
        SESSIONSTORAGE[SessionStorage]
    end
    
    LOCAL --> CHAT
    CHAT --> USECHAT
    USECHAT --> LOCALSTORAGE
    THEME --> LOCAL
    ANALYTICS --> USECHAT
    USESTREAM --> USECHAT
    USEERROR --> USECHAT

    style USECHAT fill:#4A90E2
    style LOCALSTORAGE fill:#F5A623
```

---

## 🧩 **Core Subsystems**

### **1. Theming System**

**Architecture:**
- CSS-in-JS with Tailwind CSS utilities
- Theme context provider for global access
- 11 pre-built themes with customization
- Live theme editor component
- CSS variables for runtime theme switching

**Key Files:**
```
src/theme/
├── index.ts              # Theme exports
├── themes/
│   ├── default.ts
│   ├── dark.ts
│   ├── ocean.ts
│   └── ... (8 more)
├── theme-provider.tsx    # Context provider
├── theme-editor.tsx      # Live editor UI
└── types.ts              # Theme TypeScript types
```

**Theme Structure:**
```typescript
interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    accent: string
  }
  typography: {
    fontFamily: string
    fontSize: { sm, base, lg, xl }
    fontWeight: { normal, medium, bold }
  }
  spacing: { ... }
  borderRadius: { ... }
  shadows: { ... }
}
```

---

### **2. Analytics System**

**Architecture:**
- Provider pattern with 7 supported platforms
- Event queue with batching
- Auto-tracking for common events
- Custom event support
- A/B testing utilities

**Supported Providers:**
1. Google Analytics 4 (GA4)
2. Mixpanel
3. PostHog
4. Amplitude
5. Segment
6. Custom API
7. Console (development)

**Event Flow:**
```mermaid
graph LR
    ACTION[User Action] --> HOOK[useAnalytics]
    HOOK --> QUEUE[Event Queue]
    QUEUE --> BATCH[Batch Processor]
    BATCH --> PROVIDER1[GA4]
    BATCH --> PROVIDER2[Mixpanel]
    BATCH --> PROVIDER3[PostHog]

    style ACTION fill:#4A90E2
    style BATCH fill:#F5A623
```

**Key Files:**
```
src/analytics/
├── index.ts
├── providers/
│   ├── google-analytics.ts
│   ├── mixpanel.ts
│   └── ... (5 more)
├── hooks/
│   ├── use-analytics.ts
│   ├── use-track-event.ts
│   └── use-page-view.ts
└── events.ts             # Predefined events (35+)
```

---

### **3. Error Handling System**

**Architecture:**
- 10 specialized error classes
- Automatic retry with exponential backoff
- Error boundaries at component level
- User feedback collection
- Integration with Sentry, Rollbar, Bugsnag

**Error Hierarchy:**
```
ClarityChatError (base)
├── ConfigurationError
├── APIError
│   ├── AuthenticationError
│   ├── RateLimitError
│   └── TimeoutError
├── ValidationError
├── StreamError
├── TokenLimitError
├── NetworkError
└── ComponentError
```

**Recovery Flow:**
```mermaid
graph TD
    ERROR[Error Occurs] --> BOUNDARY[ErrorBoundary]
    BOUNDARY --> CLASSIFY{Classify Error}
    
    CLASSIFY -->|Retryable| RETRY[Attempt Retry]
    CLASSIFY -->|Non-retryable| FALLBACK[Show Fallback UI]
    
    RETRY --> BACKOFF[Exponential Backoff]
    BACKOFF --> SUCCESS{Success?}
    
    SUCCESS -->|Yes| RECOVER[Recover State]
    SUCCESS -->|No| MAXRETRY{Max Retries?}
    
    MAXRETRY -->|Yes| FALLBACK
    MAXRETRY -->|No| RETRY
    
    FALLBACK --> FEEDBACK[Collect User Feedback]
    FEEDBACK --> REPORT[Report to Error Service]

    style ERROR fill:#E74C3C
    style RECOVER fill:#2ECC71
```

---

### **4. Streaming System**

**Architecture:**
- Support for SSE and WebSocket
- Automatic reconnection
- Backpressure handling
- Cancellation support

**Streaming Flow:**
```mermaid
sequenceDiagram
    participant Component
    participant useStreaming
    participant SSE/WebSocket
    participant Backend

    Component->>useStreaming: initiate stream
    useStreaming->>SSE/WebSocket: connect
    SSE/WebSocket->>Backend: establish connection
    
    loop Stream chunks
        Backend-->>SSE/WebSocket: send chunk
        SSE/WebSocket-->>useStreaming: receive chunk
        useStreaming->>Component: update state
        Component->>Component: render update
    end
    
    alt User cancels
        Component->>useStreaming: cancel()
        useStreaming->>SSE/WebSocket: close connection
    end
    
    SSE/WebSocket-->>Backend: connection closed
```

**Supported Protocols:**
- Server-Sent Events (SSE) - `useStreamingSSE`
- WebSocket - `useStreamingWebSocket`
- Fetch API with ReadableStream

---

### **5. Accessibility System**

**WCAG 2.1 AAA Compliance Features:**

1. **Keyboard Navigation**
   - Global keyboard shortcuts (Shift+?)
   - Focus trap in modals
   - Roving tabindex for lists
   - Focus restoration

2. **Screen Reader Support**
   - ARIA live regions for updates
   - Descriptive labels
   - Landmark regions
   - Announcement system

3. **Visual Accessibility**
   - AAA contrast ratios (7:1 minimum)
   - Reduced motion support
   - Focus indicators
   - Color-blind friendly themes

4. **Interaction Patterns**
   - Click and Enter key equivalence
   - Escape to close
   - Tab navigation
   - Arrow key navigation in lists

**Key Components:**
```
src/accessibility/
├── keyboard-shortcuts.tsx
├── focus-trap.tsx
├── screen-reader.tsx
├── contrast-checker.ts
└── use-keyboard-shortcuts.ts
```

---

## 🔌 **Integration Points**

### **AI Provider Integration**

**Supported Adapters:**
```typescript
// packages/react/src/adapters/
├── openai.ts          // OpenAI GPT-3.5/4
├── anthropic.ts       // Claude 2/3
├── azure-openai.ts    // Azure OpenAI
├── cohere.ts          // Cohere
├── huggingface.ts     // Hugging Face
└── custom.ts          // Custom adapter template
```

**Usage Pattern:**
```typescript
import { createOpenAIAdapter } from '@clarity-chat/react/adapters'

const adapter = createOpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
})

const response = await adapter.sendMessage(messages)
```

---

## ⚡ **Performance Optimizations**

### **1. Virtualization**
- Virtual scrolling for 1000+ messages
- Dynamic item heights
- Scroll restoration
- Component: `VirtualizedMessageList`

### **2. Code Splitting**
```typescript
// Lazy load heavy components
const ThemeEditor = lazy(() => import('./theme-editor'))
const PerformanceDashboard = lazy(() => import('./performance-dashboard'))
```

### **3. Memoization**
```typescript
// Strategic React.memo usage
export const Message = memo(MessageComponent)
export const MessageList = memo(MessageListComponent)
```

### **4. Debouncing & Throttling**
```typescript
// useDebounce for search/filter
const debouncedSearch = useDebounce(searchTerm, 300)

// useThrottle for scroll events
const throttledScroll = useThrottle(handleScroll, 100)
```

---

## 🧪 **Testing Strategy**

### **Test Coverage Goals**

| Category | Target | Actual |
|----------|--------|--------|
| Components | 80%+ | 75% |
| Hooks | 90%+ | 85% |
| Utils | 95%+ | 90% |
| Integration | 70%+ | 65% |
| **Overall** | **80%+** | **78%** |

### **Testing Pyramid**

```
         /\
        /  \      E2E Tests (5%)
       /____\     - Critical user flows
      /      \    
     /        \   Integration Tests (25%)
    /__________\  - Component interactions
   /            \ 
  /              \ Unit Tests (70%)
 /________________\ - Individual functions/components
```

### **Tools Used**
- **Vitest** - Unit and integration tests
- **React Testing Library** - Component testing
- **jest-axe** - Accessibility testing
- **Chromatic** - Visual regression testing
- **Playwright** - E2E testing (planned)

---

## 📊 **Build & Bundle Strategy**

### **Build Process**

```mermaid
graph LR
    SRC[Source TS/TSX] --> TSUP[tsup]
    TSUP --> ESM[ES Modules]
    TSUP --> CJS[CommonJS]
    TSUP --> DTS[Type Definitions]
    
    ESM --> TERSER[Terser Minification]
    CJS --> TERSER
    
    TERSER --> BUNDLE[Final Bundle]
    
    BUNDLE --> NPM[npm Registry]

    style SRC fill:#4A90E2
    style BUNDLE fill:#2ECC71
```

### **Bundle Targets**

```javascript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: 'terser',
  treeshake: true,
})
```

### **Size Budgets**

| Package | Budget | Actual | Status |
|---------|--------|--------|--------|
| @clarity-chat/react | 100KB | ~95KB | ✅ |
| @clarity-chat/error-handling | 50KB | ~45KB | ✅ |
| @clarity-chat/primitives | 30KB | ~28KB | ✅ |
| @clarity-chat/types | 10KB | ~8KB | ✅ |

---

## 🔐 **Security Considerations**

### **Input Sanitization**
```typescript
import DOMPurify from 'dompurify'

// Sanitize user input before rendering
const sanitizedContent = DOMPurify.sanitize(userInput)
```

### **XSS Protection**
- All user content sanitized
- CSP headers recommended
- Safe markdown rendering
- No `dangerouslySetInnerHTML` without sanitization

### **API Security**
- Never expose API keys in frontend
- Use backend API routes
- Implement rate limiting
- Token-based authentication

---

## 🚀 **Deployment Architecture**

### **Recommended Stack**

```
┌─────────────────────────────────────┐
│         Your Application            │
│  (Next.js / Vite / CRA)            │
└──────────────┬──────────────────────┘
               │
               ├─ Vercel / Netlify (Frontend)
               │
               ├─ Backend API
               │  ├─ Next.js API Routes
               │  ├─ Express.js
               │  └─ tRPC
               │
               └─ External Services
                  ├─ OpenAI API
                  ├─ Sentry (Errors)
                  ├─ Google Analytics
                  └─ Mixpanel
```

---

## 📚 **Design Patterns Used**

1. **Provider Pattern** - ThemeProvider, AnalyticsProvider
2. **Compound Components** - ChatWindow with sub-components
3. **Custom Hooks** - Encapsulate reusable logic
4. **Render Props** - Flexible rendering strategies
5. **Higher-Order Components** - withErrorBoundary
6. **Composition** - Build complex UIs from simple parts
7. **Factory Pattern** - Error factories, adapter factories

---

## 🎯 **Future Architecture Considerations**

### **Phase 5 Roadmap**

1. **Plugin System**
   - Event-driven architecture
   - Plugin registry
   - Hot reload support

2. **Real-time Collaboration**
   - WebRTC integration
   - CRDT for conflict resolution
   - Presence awareness

3. **Offline Support**
   - Service Worker
   - IndexedDB for local storage
   - Sync when online

4. **Advanced AI Features**
   - Multi-modal (image, audio, video)
   - RAG (Retrieval Augmented Generation)
   - Agent orchestration

---

## 📖 **Further Reading**

- [Design Decisions](./design-decisions.md) - Why we made specific choices
- [Monorepo Structure](./monorepo.md) - Deep dive into packages
- [Contributing Guide](./contributing.md) - How to contribute
- [Performance Guide](../guides/performance.md) - Optimization techniques

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
