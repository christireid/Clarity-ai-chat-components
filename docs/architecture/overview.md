# System Architecture Overview - Enhanced

This document provides a comprehensive overview of Clarity Chat's architecture, design decisions, and technical implementation.

---

## 📐 Complete System Architecture

```mermaid
graph TB
    subgraph "Development Layer"
        DEV[Developer]
        CLI[CLI Tools]
        STORY[Storybook]
        DEV --> CLI
        DEV --> STORY
    end
    
    subgraph "User Application Layer"
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
    
    subgraph "Primitives Layer"
        PRIM[Radix UI Primitives]
        MSG --> PRIM
        INPUT --> PRIM
    end

    subgraph "External Services"
        USESTREAM --> API[AI API]
        USEANALYTICS --> GA[Google Analytics]
        USEANALYTICS --> MIXPANEL[Mixpanel]
        USEERROR --> SENTRY[Sentry]
    end
    
    CLI --> APP
    STORY --> WINDOW

    style APP fill:#4A90E2,color:#fff
    style WINDOW fill:#7ED321,color:#fff
    style USECHAT fill:#F5A623,color:#fff
    style API fill:#BD10E0,color:#fff
```

---

## 📦 **Monorepo Structure**

### Package Organization

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

### Package Dependency Graph

```mermaid
graph TB
    subgraph "Core Packages"
        REACT[@clarity-chat/react<br/>Main Library]
        TYPES[@clarity-chat/types<br/>TypeScript Definitions]
        PRIMS[@clarity-chat/primitives<br/>Base Components]
        ERROR[@clarity-chat/error-handling<br/>Error System]
    end
    
    subgraph "Tool Packages"
        DEV[@clarity-chat/dev-tools<br/>Development Utilities]
        CLI[@clarity-chat/cli<br/>Command Line Tools]
    end
    
    subgraph "Applications"
        STORY[apps/storybook]
        DOCS[apps/docs]
    end
    
    subgraph "Examples"
        EX1[examples/basic-chat]
        EX2[examples/ai-assistant]
        EX3[examples/customer-support]
        EXN[examples/... 6 more]
    end
    
    REACT --> TYPES
    REACT --> PRIMS
    REACT --> ERROR
    PRIMS --> TYPES
    ERROR --> TYPES
    
    STORY --> REACT
    DOCS --> REACT
    DEV --> REACT
    CLI --> REACT
    
    EX1 --> REACT
    EX2 --> REACT
    EX3 --> REACT
    EXN --> REACT
    
    style REACT fill:#4A90E2,color:#fff
    style TYPES fill:#50E3C2,color:#fff
    style STORY fill:#F5A623,color:#fff
    style EX2 fill:#ec4899,color:#fff
```

---

## 🎨 **Component Hierarchy**

### **Complete Component Tree**

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

    style WINDOW fill:#4A90E2,color:#fff
    style MSGLIST fill:#7ED321,color:#fff
    style INPUT fill:#F5A623,color:#fff
```

### Component Size & Complexity Matrix

```mermaid
graph LR
    subgraph "Small & Simple"
        S1[Avatar<br/>50 LOC]
        S2[CopyButton<br/>40 LOC]
        S3[Skeleton<br/>30 LOC]
    end
    
    subgraph "Medium & Moderate"
        M1[Message<br/>250 LOC]
        M2[ChatInput<br/>300 LOC]
        M3[ThemeSelector<br/>200 LOC]
    end
    
    subgraph "Large & Complex"
        L1[ChatWindow<br/>800 LOC]
        L2[MessageList<br/>600 LOC]
        L3[AdvancedChatInput<br/>500 LOC]
    end
    
    style S1 fill:#7ED321,color:#fff
    style S2 fill:#7ED321,color:#fff
    style S3 fill:#7ED321,color:#fff
    style M1 fill:#F5A623,color:#fff
    style M2 fill:#F5A623,color:#fff
    style M3 fill:#F5A623,color:#fff
    style L1 fill:#ef4444,color:#fff
    style L2 fill:#ef4444,color:#fff
    style L3 fill:#ef4444,color:#fff
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
graph TB
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

    style USECHAT fill:#4A90E2,color:#fff
    style LOCALSTORAGE fill:#F5A623,color:#fff
```

### State Update Propagation

```mermaid
sequenceDiagram
    participant Action
    participant Hook
    participant Context
    participant Component
    participant Storage
    
    Action->>Hook: setState(newValue)
    Hook->>Hook: Process update
    Hook->>Context: Broadcast change
    
    par Parallel Updates
        Context->>Component: Notify Component A
        Context->>Component: Notify Component B
        Context->>Component: Notify Component N
    end
    
    Hook->>Storage: Persist state
    Storage-->>Hook: Confirm saved
    
    Note over Component: All components re-render<br/>with new state
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

#### Theme System Architecture

```mermaid
graph TB
    subgraph "Theme Definition"
        DEF[Theme Object]
        DEF --> COLORS[11 Color Properties]
        DEF --> TYPO[Typography Scale]
        DEF --> SPACING[Spacing System]
        DEF --> RADIUS[Border Radius]
        DEF --> SHADOWS[Shadow Elevation]
    end
    
    subgraph "Theme Provider"
        PROVIDER[ThemeProvider Component]
        PROVIDER --> CONTEXT[React Context]
        PROVIDER --> CSS[CSS Variables]
    end
    
    subgraph "Theme Consumption"
        HOOK[useTheme Hook]
        COMP[Styled Components]
        UTIL[Theme Utilities]
    end
    
    DEF --> PROVIDER
    CONTEXT --> HOOK
    CSS --> COMP
    HOOK --> COMP
    HOOK --> UTIL
    
    style DEF fill:#4A90E2,color:#fff
    style PROVIDER fill:#50E3C2,color:#fff
    style COMP fill:#F5A623,color:#fff
```

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

#### Analytics Event Pipeline

```mermaid
graph LR
    subgraph "Event Generation"
        USER[User Action]
        AUTO[Auto-tracking]
        CUSTOM[Custom Events]
    end
    
    subgraph "Processing"
        HOOK[useAnalytics Hook]
        QUEUE[Event Queue]
        BATCH[Batch Processor<br/>100ms intervals]
    end
    
    subgraph "Providers"
        GA4[Google Analytics 4]
        MIX[Mixpanel]
        POST[PostHog]
        AMP[Amplitude]
        SEG[Segment]
        API[Custom API]
    end
    
    USER --> HOOK
    AUTO --> HOOK
    CUSTOM --> HOOK
    
    HOOK --> QUEUE
    QUEUE --> BATCH
    
    BATCH --> GA4
    BATCH --> MIX
    BATCH --> POST
    BATCH --> AMP
    BATCH --> SEG
    BATCH --> API

    style HOOK fill:#4A90E2,color:#fff
    style BATCH fill:#F5A623,color:#fff
    style GA4 fill:#50E3C2,color:#fff
```

**Supported Providers:**
1. Google Analytics 4 (GA4)
2. Mixpanel
3. PostHog
4. Amplitude
5. Segment
6. Custom API
7. Console (development)

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

#### Error Class Hierarchy

```mermaid
classDiagram
    ClarityChatError <|-- ConfigurationError
    ClarityChatError <|-- APIError
    ClarityChatError <|-- ValidationError
    ClarityChatError <|-- StreamError
    ClarityChatError <|-- TokenLimitError
    ClarityChatError <|-- NetworkError
    ClarityChatError <|-- ComponentError
    
    APIError <|-- AuthenticationError
    APIError <|-- RateLimitError
    APIError <|-- TimeoutError
    
    class ClarityChatError {
        +string message
        +string code
        +any metadata
        +Date timestamp
        +serialize()
        +toJSON()
    }
    
    class APIError {
        +number statusCode
        +string endpoint
        +retry()
    }
    
    class ValidationError {
        +array errors
        +string field
    }
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

    style ERROR fill:#E74C3C,color:#fff
    style RECOVER fill:#2ECC71,color:#fff
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

#### Accessibility Architecture

```mermaid
graph TB
    subgraph "Keyboard Navigation"
        KB1[Global Shortcuts]
        KB2[Focus Management]
        KB3[Roving Tabindex]
        KB4[Focus Trap]
    end
    
    subgraph "Screen Reader Support"
        SR1[ARIA Live Regions]
        SR2[Landmark Regions]
        SR3[Descriptive Labels]
        SR4[Announcements]
    end
    
    subgraph "Visual Accessibility"
        VIS1[Contrast Checking<br/>AAA 7:1]
        VIS2[Reduced Motion]
        VIS3[Focus Indicators]
        VIS4[Color-blind Themes]
    end
    
    subgraph "Testing & Validation"
        TEST1[jest-axe]
        TEST2[Manual Testing]
        TEST3[Screen Reader Testing]
    end
    
    KB1 --> TEST1
    SR1 --> TEST3
    VIS1 --> TEST1
    
    style KB1 fill:#4A90E2,color:#fff
    style SR1 fill:#50E3C2,color:#fff
    style VIS1 fill:#F5A623,color:#fff
    style TEST1 fill:#ec4899,color:#fff
```

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

#### Provider Adapter Pattern

```mermaid
graph TB
    subgraph "Application Layer"
        APP[Your App]
        CONFIG[Adapter Config]
    end
    
    subgraph "Adapter Layer"
        FACTORY[Adapter Factory]
        FACTORY --> OAI[OpenAI Adapter]
        FACTORY --> ANT[Anthropic Adapter]
        FACTORY --> AZ[Azure OpenAI Adapter]
        FACTORY --> COH[Cohere Adapter]
        FACTORY --> HF[Hugging Face Adapter]
        FACTORY --> CUSTOM[Custom Adapter]
    end
    
    subgraph "API Layer"
        API1[OpenAI API]
        API2[Anthropic API]
        API3[Azure API]
        API4[Cohere API]
        API5[HF API]
        API6[Custom API]
    end
    
    APP --> CONFIG
    CONFIG --> FACTORY
    
    OAI --> API1
    ANT --> API2
    AZ --> API3
    COH --> API4
    HF --> API5
    CUSTOM --> API6
    
    style FACTORY fill:#4A90E2,color:#fff
    style OAI fill:#50E3C2,color:#fff
    style CUSTOM fill:#F5A623,color:#fff
```

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

### Performance Strategy Overview

```mermaid
graph LR
    subgraph "Optimization Techniques"
        V[Virtualization]
        CS[Code Splitting]
        M[Memoization]
        DT[Debounce/Throttle]
        LC[Lazy Loading]
    end
    
    subgraph "Metrics Tracked"
        FCP[First Contentful Paint]
        TTI[Time to Interactive]
        CLS[Cumulative Layout Shift]
        FID[First Input Delay]
    end
    
    subgraph "Results"
        FAST[< 1s Load Time]
        SMOOTH[60 FPS Scrolling]
        LOW[< 50KB Initial Bundle]
    end
    
    V --> SMOOTH
    CS --> LOW
    M --> SMOOTH
    DT --> SMOOTH
    LC --> FAST
    
    FCP --> FAST
    TTI --> FAST
    
    style FAST fill:#7ED321,color:#fff
    style SMOOTH fill:#10b981,color:#fff
    style LOW fill:#50E3C2,color:#fff
```

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

```mermaid
graph TB
    subgraph "Testing Strategy"
        E2E[E2E Tests - 5%<br/>Critical user flows]
        INT[Integration Tests - 25%<br/>Component interactions]
        UNIT[Unit Tests - 70%<br/>Individual functions/components]
    end
    
    subgraph "Tools"
        VITEST[Vitest]
        RTL[React Testing Library]
        AXE[jest-axe]
        CHROM[Chromatic]
        PLAY[Playwright]
    end
    
    UNIT --> VITEST
    UNIT --> RTL
    INT --> RTL
    INT --> AXE
    E2E --> PLAY
    E2E --> CHROM
    
    style E2E fill:#ef4444,color:#fff
    style INT fill:#F5A623,color:#fff
    style UNIT fill:#7ED321,color:#fff
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
    SRC[Source TS/TSX] --> TSUP[tsup Build Tool]
    TSUP --> ESM[ES Modules]
    TSUP --> CJS[CommonJS]
    TSUP --> DTS[Type Definitions]
    
    ESM --> TERSER[Terser Minification]
    CJS --> TERSER
    
    TERSER --> BUNDLE[Final Bundle]
    
    BUNDLE --> NPM[npm Registry]
    
    style SRC fill:#4A90E2,color:#fff
    style TSUP fill:#50E3C2,color:#fff
    style BUNDLE fill:#F5A623,color:#fff
    style NPM fill:#7ED321,color:#fff
```

### Bundle Size Analysis

```mermaid
graph TB
    subgraph "Bundle Breakdown"
        TOTAL[Total: ~120 KB]
        CORE[Core: 45 KB]
        COMP[Components: 35 KB]
        HOOKS[Hooks: 15 KB]
        UTILS[Utils: 10 KB]
        THEME[Themes: 8 KB]
        TYPES[Types: 7 KB]
    end
    
    TOTAL --> CORE
    TOTAL --> COMP
    TOTAL --> HOOKS
    TOTAL --> UTILS
    TOTAL --> THEME
    TOTAL --> TYPES
    
    style TOTAL fill:#4A90E2,color:#fff
    style CORE fill:#F5A623,color:#fff
    style COMP fill:#50E3C2,color:#fff
```

**Build Configuration:**
```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  minify: true,
  treeshake: true,
})
```

**Target Bundle Sizes:**
- Initial load: < 50 KB (gzipped)
- Full library: < 120 KB (gzipped)
- Tree-shakeable for minimal imports

---

## 🚀 **Deployment Architecture**

### Multi-Environment Strategy

```mermaid
graph TB
    subgraph "Development"
        DEV[Local Development]
        DEV --> STORY[Storybook Dev]
        DEV --> TEST[Test Suite]
    end
    
    subgraph "Staging"
        STAGE[Staging Environment]
        STAGE --> PREVIEW[Preview Deployment]
        STAGE --> E2E[E2E Tests]
    end
    
    subgraph "Production"
        NPM[npm Registry]
        CDN[CDN Distribution]
        DOCS[Documentation Site]
    end
    
    DEV --> STAGE
    STAGE --> NPM
    STAGE --> CDN
    STAGE --> DOCS
    
    style DEV fill:#4A90E2,color:#fff
    style STAGE fill:#F5A623,color:#fff
    style NPM fill:#7ED321,color:#fff
```

---

## 📈 **Metrics & Monitoring**

### Key Performance Indicators

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Bundle Size | < 120 KB | 118 KB | ✅ |
| Test Coverage | 80% | 78% | 🟡 |
| Lighthouse Score | 95+ | 96 | ✅ |
| Build Time | < 30s | 24s | ✅ |
| Storybook Stories | 100+ | 94 | 🟡 |
| Documentation Pages | 50+ | 47 | 🟡 |

---

## 🔗 **Related Documentation**

- [Component API Reference](../api/components.md)
- [Hooks API Reference](../api/hooks.md)
- [Contributing Guide](./contributing.md)
- [Examples Gallery](../examples/README.md)
- [Theming Guide](../guides/theming.md)
- [Streaming Guide](../guides/streaming.md)

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
