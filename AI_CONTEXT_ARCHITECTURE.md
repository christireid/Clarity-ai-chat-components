# Clarity Chat - Architecture & Patterns

**For AI Agents**: Deep dive into architecture, design patterns, and internal structure

---

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────┐
│                  Application Layer                   │
│  (Your App using Clarity Chat Components)           │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            @clarity-chat/react (Main Package)        │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │  Components  │    Hooks     │  Providers   │    │
│  │   (70+)      │    (28)      │   (Theme,    │    │
│  │              │              │   Analytics) │    │
│  └──────────────┴──────────────┴──────────────┘    │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │ AI Infra     │  Adapters    │  Utilities   │    │
│  │ (Vector,     │  (8 models)  │  (Helpers,   │    │
│  │  Agents,     │              │   Validators)│    │
│  │  RAG)        │              │              │    │
│  └──────────────┴──────────────┴──────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           @clarity-chat/primitives                   │
│  Base UI Components (Button, Badge, Card, etc.)     │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            @clarity-chat/types                       │
│  Shared TypeScript Definitions                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Design Patterns

### 1. Provider Pattern
**Theme and context management**

```typescript
// ThemeProvider - Top-level theme context
<ThemeProvider defaultTheme="ocean">
  <App />
</ThemeProvider>

// AnalyticsProvider - Analytics tracking
<AnalyticsProvider config={analyticsConfig}>
  <App />
</AnalyticsProvider>

// ErrorBoundary - Error catching
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Typical app structure
<ThemeProvider defaultTheme="ocean">
  <AnalyticsProvider config={analytics}>
    <ErrorBoundary fallback={<ErrorDisplay />}>
      <ChatApp />
    </ErrorBoundary>
  </AnalyticsProvider>
</ThemeProvider>
```

---

### 2. Compound Component Pattern
**Related components work together**

```typescript
// Example: ContextManager + ContextCard
<ContextManager
  contexts={contexts}
  onAdd={onAdd}
  onRemove={onRemove}
  onToggle={onToggle}
>
  {contexts.map(ctx => (
    <ContextCard
      key={ctx.id}
      context={ctx}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  ))}
</ContextManager>

// Components share context and work seamlessly together
```

---

### 3. Render Props Pattern
**Flexible rendering control**

```typescript
// Example: MessageList with custom renderers
<MessageList
  messages={messages}
  renderMessage={(msg) => (
    <CustomMessage {...msg} />
  )}
  renderEmpty={() => (
    <CustomEmptyState />
  )}
  renderLoading={() => (
    <CustomLoader />
  )}
/>
```

---

### 4. Hook Composition Pattern
**Combining multiple hooks**

```typescript
// Example: Complete chat feature
function useCompleteChat() {
  const chat = useChat(chatOptions)
  const scroll = useAutoScroll({ enabled: true })
  const clipboard = useClipboard()
  const shortcuts = useKeyboardShortcuts(shortcuts)

  return {
    ...chat,
    scrollRef: scroll.scrollRef,
    copyMessage: (id: string) => {
      const msg = chat.messages.find(m => m.id === id)
      if (msg) clipboard.copy(msg.content)
    }
  }
}
```

---

## 🔄 Data Flow

### Message Flow
```
User Input → ChatInput
     ↓
  onSend callback
     ↓
useChat hook
     ↓
onSendMessage (your API call)
     ↓
API Response
     ↓
Update messages state
     ↓
MessageList displays
     ↓
Auto-scroll (useAutoScroll)
```

### Streaming Flow
```
API Call → ReadableStream
     ↓
useStreaming hook
     ↓
Chunk-by-chunk processing
     ↓
onChunk callbacks
     ↓
Update content state
     ↓
StreamingMessage displays
     ↓
onComplete when done
```

### Context Flow
```
File/URL Input → FileUpload
     ↓
onFileUpload callback
     ↓
Process/Parse content
     ↓
Create Context object
     ↓
ContextManager.onAdd
     ↓
Update contexts state
     ↓
ContextCard displays
     ↓
Toggle active state affects chat context
```

---

## 🧩 Component Composition

### Level 1: Atomic Components
**Smallest building blocks from @clarity-chat/primitives**

```typescript
import { Button, Badge, Card, Avatar } from '@clarity-chat/primitives'

// These are the foundation
<Button variant="default" size="md">Click me</Button>
<Badge variant="success">Online</Badge>
<Card className="p-4">Content</Card>
<Avatar name="John Doe" size="md" />
```

**Button Variants**: `default | destructive | outline | secondary | ghost | link | success | error | surface`

**Badge Variants**: `default | secondary | destructive | outline | success | warning | info | subtle`

---

### Level 2: Feature Components
**Built from primitives + hooks**

```typescript
import { CopyButton, ThinkingIndicator, TokenCounter } from '@clarity-chat/react'

// These combine primitives with logic
<CopyButton text="Copy this" />
<ThinkingIndicator status={aiStatus} />
<TokenCounter tokens={1234} cost={0.002} />
```

---

### Level 3: Composite Components
**Complex features combining multiple components**

```typescript
import { ChatWindow, ContextManager, ModelSelector } from '@clarity-chat/react'

// These are complete features
<ChatWindow
  messages={messages}
  onSend={handleSend}
  enableVoice
  enableFileUpload
/>
```

---

### Level 4: Templates
**Pre-built complete applications**

```typescript
import { AIAssistantTemplate, CustomerSupportTemplate } from '@clarity-chat/react'

// Complete apps ready to use
<AIAssistantTemplate
  modelAdapter={openAIAdapter}
  apiKey={API_KEY}
  onMessage={handleMessage}
/>
```

---

## 🎨 Theme Architecture

### Theme Structure
```typescript
interface Theme {
  name: string
  colors: {
    // Base colors
    primary: string        // Main brand color
    secondary: string      // Secondary accent
    background: string     // Page background
    foreground: string     // Text color
    
    // Semantic colors
    muted: string          // Muted text/borders
    accent: string         // Highlights
    destructive: string    // Errors/warnings
    border: string         // Border color
    
    // UI elements
    input: string
    card: string
    popover: string
    
    // States
    'primary-foreground': string
    'secondary-foreground': string
    // ...more variants
  }
  
  fonts: {
    sans: string
    mono: string
  }
  
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  animations: {
    duration: string
    easing: string
  }
}
```

### Theme Usage
```typescript
// 1. Via Provider (Recommended)
<ThemeProvider defaultTheme="ocean">
  <App />
</ThemeProvider>

// 2. Via Hook
const { theme, setTheme } = useTheme()
setTheme('dark')

// 3. Custom Theme
const customTheme = {
  name: 'custom',
  colors: { /* ... */ }
}

<ThemeProvider defaultTheme={customTheme}>
  <App />
</ThemeProvider>
```

---

## 🤖 AI Infrastructure Architecture

### Model Adapter Pattern
**Unified interface for different AI providers**

```typescript
interface ModelAdapter {
  name: string
  supportsStreaming: boolean
  
  sendMessage(params: {
    messages: Message[]
    model: string
    temperature?: number
    maxTokens?: number
  }): Promise<string>
  
  streamMessage(params: {
    messages: Message[]
    model: string
    onChunk: (chunk: string) => void
    signal?: AbortSignal
  }): Promise<void>
}

// All adapters implement this interface
const openAIAdapter: ModelAdapter = { /* ... */ }
const anthropicAdapter: ModelAdapter = { /* ... */ }
```

---

### RAG Pipeline Architecture
```
┌──────────────────────────────────────────────┐
│  1. Document Loading                         │
│  PDFLoader, TextLoader, etc.                 │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  2. Text Splitting                           │
│  RecursiveCharacterTextSplitter              │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  3. Embedding Generation                     │
│  OpenAIEmbeddings, CohereEmbeddings         │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  4. Vector Store                             │
│  Pinecone, Qdrant, Weaviate, Chroma         │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  5. Retrieval                                │
│  Similarity search, Hybrid search            │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  6. Reranking (Optional)                     │
│  Cohere Rerank, Custom scoring               │
└──────────────────┬───────────────────────────┘
                   ▼
┌──────────────────────────────────────────────┐
│  7. Context Injection                        │
│  Add to prompt with citations                │
└──────────────────────────────────────────────┘
```

**Usage**:
```typescript
// 1. Load documents
const loader = new PDFLoader()
const docs = await loader.load('document.pdf')

// 2. Split text
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
})
const chunks = await splitter.splitDocuments(docs)

// 3. Create embeddings
const embeddings = new OpenAIEmbeddings({ apiKey })

// 4. Store in vector DB
const vectorStore = new PineconeStore({ apiKey, index })
await vectorStore.addDocuments(chunks, embeddings)

// 5. Query
const results = await vectorStore.similaritySearch(query, 5)
```

---

## 🔐 Security Architecture

### AI Safety Pipeline
```
User Input
    ↓
┌───────────────────┐
│ Prompt Injection  │ ← Detect malicious prompts
│ Detection         │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ PII Detection     │ ← Find sensitive data
│                   │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ Content Filter    │ ← Check for harmful content
│                   │
└────────┬──────────┘
         ↓
    Safe to send to AI
         ↓
    AI Response
         ↓
┌───────────────────┐
│ Content Filter    │ ← Check AI output
│                   │
└────────┬──────────┘
         ↓
    Safe to display
```

**Usage**:
```typescript
import { PIIDetector, ContentFilter, PromptInjection } from '@clarity-chat/react'

// Before sending
const piiResult = await PIIDetector.detect(userInput)
if (piiResult.found) {
  // Redact or warn
}

const injectionResult = await PromptInjection.detect(userInput)
if (injectionResult.detected) {
  // Block or sanitize
}

// After receiving
const filterResult = await ContentFilter.moderate(aiResponse)
if (!filterResult.safe) {
  // Don't display
}
```

---

## 📦 Package Architecture

### Monorepo Structure
```
clarity-ai-chat-components/
├── packages/
│   ├── react/              # Main package
│   │   ├── src/
│   │   │   ├── components/ # 70+ React components
│   │   │   ├── hooks/      # 28 custom hooks
│   │   │   ├── adapters/   # Model adapters
│   │   │   ├── agents/     # Agent system
│   │   │   ├── embeddings/ # Embedding providers
│   │   │   ├── vector-stores/ # Vector databases
│   │   │   ├── accessibility/ # A11y utils
│   │   │   ├── analytics/  # Analytics providers
│   │   │   ├── animations/ # Motion presets
│   │   │   ├── error/      # Error handling
│   │   │   ├── theme/      # Theme system
│   │   │   └── index.ts    # Main exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── primitives/         # Base UI (Button, Badge, Card)
│   │   ├── src/
│   │   │   └── components/
│   │   └── package.json
│   │
│   ├── types/              # Shared types
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── errors/             # Error utilities
│       └── src/
│
├── apps/
│   ├── docs-site/          # Documentation (Next.js)
│   └── storybook/          # Component playground
│
├── examples/               # Demo applications
│   ├── basic-chat/
│   ├── streaming-chat/
│   ├── customer-support/
│   └── ...10+ more
│
└── docs/                   # Markdown docs
    ├── getting-started/
    ├── api/
    └── guides/
```

---

## 🔧 Build Architecture

### Build Pipeline
```
Source TypeScript (.tsx, .ts)
         ↓
    TypeScript Compiler (tsc)
         ↓
    ESBuild (bundling)
         ↓
    Output Formats:
    ├── ESM (dist/index.mjs)
    ├── CJS (dist/index.js)
    └── Types (dist/index.d.ts)
```

### Build Commands
```bash
# Build single package
npm run build --workspace=@clarity-chat/react

# Build all packages (respects dependencies)
npm run build

# Watch mode
npm run dev

# Type checking
npm run typecheck
```

### Build Configuration

**Turbo.json** - Task orchestration
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

**TSConfig** - TypeScript configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx"
  }
}
```

---

## 🎭 State Management

### Component-Level State
```typescript
// Simple useState for local state
const [isOpen, setIsOpen] = useState(false)

// useToggle for boolean state
const modal = useToggle(false)

// useLocalStorage for persistent state
const [theme, setTheme] = useLocalStorage('theme', 'ocean')
```

### Global State (Context)
```typescript
// ThemeContext
const { theme, setTheme } = useTheme()

// No Redux/Zustand - uses React Context
// Keeps library lightweight and flexible
```

### Optimistic Updates
```typescript
// useOptimisticMessage for instant UI updates
const { addOptimistic, confirmOptimistic, revertOptimistic } = useOptimisticMessage()

// Add optimistic message
const tempId = addOptimistic(messageContent)

try {
  const result = await sendToAPI(messageContent)
  confirmOptimistic(tempId, result.id)
} catch (error) {
  revertOptimistic(tempId)
}
```

---

## 🎬 Animation Architecture

### Animation Layers

**1. Framer Motion (Base)**
```typescript
import { motion } from 'framer-motion'

// All animated components use Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

**2. Animation Presets**
```typescript
import { fadeIn, slideUp, scaleIn } from '@clarity-chat/react/animations'

<motion.div {...fadeIn}>Content</motion.div>
<motion.div {...slideUp}>Content</motion.div>
```

**3. Component-Specific Animations**
```typescript
// Message slide-in
<AnimatedList>
  {messages.map(msg => (
    <Message key={msg.id} {...msg} />
  ))}
</AnimatedList>

// Thinking indicator pulse
<ThinkingIndicator variant="pulse" />

// Suggestion chips stagger
<FollowUpSuggestions animate stagger />
```

---

## 📊 Analytics Architecture

### Analytics Flow
```
Component Event
     ↓
Analytics Hook
     ↓
AnalyticsProvider
     ↓
Multiple Providers:
├── Google Analytics 4
├── Mixpanel
├── PostHog
├── Amplitude
├── Segment
├── Heap
└── LogRocket
```

**Usage**:
```typescript
<AnalyticsProvider config={{
  providers: {
    googleAnalytics: { measurementId: 'G-XXX' },
    mixpanel: { token: 'xxx' },
    posthog: { apiKey: 'xxx' }
  }
}}>
  <App />
</AnalyticsProvider>

// Events automatically tracked:
// - message_sent
// - message_received
// - file_uploaded
// - model_changed
// - context_added
// ...35+ predefined events
```

---

## 🐛 Error Architecture

### Error Boundary Hierarchy
```
<ErrorBoundary> (Top-level)
    ↓
  <ChatWindow>
      ↓
    <MessageList>
      ↓
      <Message> (each has own error handling)
```

### Error Recovery Flow
```
Error Occurs
     ↓
Caught by ErrorBoundary
     ↓
Display ErrorDisplay component
     ↓
User clicks RetryButton
     ↓
useErrorRecovery hook
     ↓
Exponential backoff retry
     ↓
Success or max attempts
```

---

## 🔌 Plugin Architecture

### Plugin System
```typescript
interface Plugin {
  name: string
  version: string
  
  // Lifecycle hooks
  onInstall?: () => void
  onUninstall?: () => void
  
  // Message hooks
  beforeSend?: (message: Message) => Message | null
  afterReceive?: (message: Message) => Message
  
  // UI hooks
  renderToolbar?: () => React.ReactNode
  renderSidebar?: () => React.ReactNode
}

// Register plugin
<ChatWindow plugins={[myPlugin]} />
```

**Usage**:
```typescript
const translationPlugin: Plugin = {
  name: 'translator',
  version: '1.0.0',
  afterReceive: async (message) => {
    if (message.role === 'assistant') {
      const translated = await translate(message.content)
      return { ...message, content: translated }
    }
    return message
  }
}
```

---

## 🎯 Design Decisions

### Why Framer Motion?
- ✅ Industry standard for React animations
- ✅ Declarative API matches React paradigm
- ✅ Great TypeScript support
- ✅ Performance optimized
- ✅ Gesture support (drag, pan, etc.)

### Why No Redux/Zustand?
- ✅ Keep library lightweight
- ✅ Let consumers choose their state management
- ✅ React Context sufficient for theme/analytics
- ✅ Component-level state for UI

### Why Monorepo?
- ✅ Share code between packages
- ✅ Consistent versioning
- ✅ Single source of truth
- ✅ Easy local development

### Why TypeScript Strict Mode?
- ✅ Catch errors at compile time
- ✅ Better IDE support
- ✅ Self-documenting code
- ✅ Fewer runtime errors

---

## 📏 Code Organization Principles

### 1. Colocation
Related code lives together:
```
components/
  message.tsx              # Component
  message.test.tsx         # Tests
  message.stories.tsx      # Storybook
```

### 2. Feature-based Structure
```
ai/
  agents/         # Agent system
  embeddings/     # Embeddings
  vector-stores/  # Vector DBs
  adapters/       # Model adapters
```

### 3. Shared Utilities
```
utils/
  mobile.ts       # Mobile utilities
  validators.ts   # Validation
  formatters.ts   # Formatting
  constants.ts    # Constants
```

### 4. Type Definitions
```
types/
  @clarity-chat/types  # Shared package
  react-markdown.d.ts  # Augmentations
```

---

## 🧪 Testing Architecture

### Test Strategy
```
Unit Tests (Vitest)
├── Hooks: Test logic in isolation
├── Components: Test rendering & interactions
└── Utilities: Test pure functions

Integration Tests
├── Template flows
└── Multi-component interactions

E2E Tests (Future)
└── Full user journeys
```

### Test Patterns
```typescript
// Hook testing
const { result } = renderHook(() => useChat())
await act(async () => {
  await result.current.sendMessage('test')
})
expect(result.current.messages).toHaveLength(1)

// Component testing
render(<ChatInput onSend={mockSend} />)
const input = screen.getByRole('textbox')
await userEvent.type(input, 'Hello')
await userEvent.keyboard('{Enter}')
expect(mockSend).toHaveBeenCalledWith('Hello')
```

---

## 🚀 Performance Architecture

### Optimization Strategies

**1. Code Splitting**
```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

**2. Virtual Scrolling**
```typescript
// MessageList uses virtual scrolling for 1000+ messages
<MessageList virtualized messages={largeMessageArray} />
```

**3. Memoization**
```typescript
// All components use React.memo
export const Message = React.memo(function Message(props) {
  // Only re-renders when props change
})

// Callbacks use useCallback
const handleSend = useCallback((content) => {
  // ...
}, [dependencies])
```

**4. Tree-shaking**
```typescript
// Import only what you need
import { ChatWindow } from '@clarity-chat/react'
// Not: import * as Clarity from '@clarity-chat/react'
```

---

## 🔍 Key Architecture Insights for AI Agents

### 1. Component Hierarchy
```
Template (Complete app)
  └── Composite (ChatWindow)
      └── Feature (MessageList)
          └── Display (Message)
              └── Primitive (Button, Card)
```

### 2. Data Flow Direction
```
User Input → Callbacks → State Updates → Re-render → Display
```

### 3. Dependency Chain
```
@clarity-chat/react
  ↓ depends on
@clarity-chat/primitives
  ↓ depends on
@clarity-chat/types
```

### 4. Module Boundaries
- **Components**: UI rendering only
- **Hooks**: Logic and state
- **Adapters**: External API integration
- **Utilities**: Pure functions
- **Types**: Shared interfaces

---

**Architecture Quality**: Production-grade  
**Patterns**: Industry standard  
**Scalability**: Designed for growth  
**Maintainability**: Excellent  

_Complete architecture reference for AI agents._

