# Components API Reference

Complete reference for all 47+ components in Clarity Chat.

---

## 📊 Component Architecture Overview

```mermaid
graph TB
    subgraph "Core Components"
        A[ChatWindow]
        B[MessageList]
        C[Message]
        D[ChatInput]
        E[AdvancedChatInput]
    end
    
    subgraph "Display Components"
        F[ThinkingIndicator]
        G[TypingIndicator]
        H[Avatar]
        I[CopyButton]
        J[Skeleton]
    end
    
    subgraph "Input Components"
        K[FileUpload]
        L[VoiceInput]
        M[Autocomplete]
    end
    
    subgraph "Context Components"
        N[ContextManager]
        O[ContextCard]
        P[ContextVisualizer]
    end
    
    subgraph "Organization"
        Q[ProjectSidebar]
        R[ConversationList]
        S[PromptLibrary]
    end
    
    subgraph "Error & Status"
        T[ErrorBoundary]
        U[NetworkStatus]
        V[RetryButton]
    end
    
    subgraph "Analytics"
        W[PerformanceDashboard]
        X[TokenCounter]
        Y[UsageDashboard]
    end
    
    subgraph "Theme"
        Z1[ThemeProvider]
        Z2[ThemeSelector]
        Z3[ThemePreview]
    end
    
    A --> B
    B --> C
    A --> D
    D --> L
    D --> K
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
    style Z1 fill:#ec4899,color:#fff
```

---

## 📑 Table of Contents

### Core Components
- [ChatWindow](#chatwindow)
- [MessageList](#messagelist)
- [Message](#message)
- [ChatInput](#chatinput)
- [AdvancedChatInput](#advancedchatinput)

### Display Components
- [ThinkingIndicator](#thinkingindicator)
- [TypingIndicator](#typingindicator)
- [Avatar](#avatar)
- [CopyButton](#copybutton)
- [Skeleton](#skeleton)

### Input Components
- [FileUpload](#fileupload)
- [VoiceInput](#voiceinput)
- [Autocomplete](#autocomplete)

### Context Components
- [ContextManager](#contextmanager)
- [ContextCard](#contextcard)
- [ContextVisualizer](#contextvisualizer)

### Organization Components
- [ProjectSidebar](#projectsidebar)
- [ConversationList](#conversationlist)
- [PromptLibrary](#promptlibrary)

### Error & Status Components
- [ErrorBoundary](#errorboundary)
- [ErrorBoundaryEnhanced](#errorboundaryenhanced)
- [NetworkStatus](#networkstatus)
- [RetryButton](#retrybutton)

### Analytics & Performance
- [PerformanceDashboard](#performancedashboard)
- [TokenCounter](#tokencounter)
- [UsageDashboard](#usagedashboard)

### Theme Components
- [ThemeProvider](#themeprovider)
- [ThemeSelector](#themeselector)
- [ThemePreview](#themepreview)

---

## Core Components

### ChatWindow

The main container component that orchestrates the entire chat interface.

#### Component Anatomy

```mermaid
graph TB
    subgraph "ChatWindow Structure"
        A[ChatWindow Container]
        A --> B[ProjectSidebar]
        A --> C[Main Content Area]
        A --> D[Theme Context]
        
        C --> E[Header/Title]
        C --> F[MessageList]
        C --> G[ChatInput]
        
        F --> H[Message Components]
        F --> I[TypingIndicator]
        
        G --> J[Text Input]
        G --> K[FileUpload Button]
        G --> L[VoiceInput Button]
        G --> M[Send Button]
        
        B --> N[Conversation List]
        B --> O[Settings]
    end
    
    style A fill:#4A90E2,color:#fff
    style C fill:#50E3C2,color:#fff
    style F fill:#F5A623,color:#fff
    style G fill:#ec4899,color:#fff
```

#### Component Tree

```mermaid
graph LR
    A[ChatWindow] --> B[ThemeProvider]
    B --> C[ErrorBoundary]
    C --> D[Layout Container]
    
    D --> E[Sidebar?]
    D --> F[Main]
    
    E --> G[ConversationList]
    E --> H[Settings]
    
    F --> I[MessageList]
    F --> J[ChatInput]
    
    I --> K[Message×N]
    J --> L[FileUpload]
    J --> M[VoiceInput]
    
    style A fill:#4A90E2,color:#fff
    style D fill:#50E3C2,color:#fff
    style I fill:#F5A623,color:#fff
    style J fill:#ec4899,color:#fff
```

**Import:**
```tsx
import { ChatWindow } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `messages` | `Message[]` | ✅ | - | Array of chat messages |
| `onSendMessage` | `(content: string) => Promise<void>` | ✅ | - | Handler for sending messages |
| `isLoading` | `boolean` | ❌ | `false` | Show loading indicator |
| `placeholder` | `string` | ❌ | `'Type a message...'` | Input placeholder text |
| `showSidebar` | `boolean` | ❌ | `true` | Display project sidebar |
| `showTimestamps` | `boolean` | ❌ | `true` | Show message timestamps |
| `enableVoiceInput` | `boolean` | ❌ | `false` | Enable voice input button |
| `enableFileUpload` | `boolean` | ❌ | `true` | Enable file attachments |
| `maxFileSize` | `number` | ❌ | `10485760` | Max file size in bytes (10MB) |
| `allowedFileTypes` | `string[]` | ❌ | `['*']` | Allowed MIME types |
| `className` | `string` | ❌ | - | Additional CSS classes |
| `style` | `CSSProperties` | ❌ | - | Inline styles |

**Type Definitions:**

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    tokens?: number
    cost?: number
    [key: string]: any
  }
  attachments?: Attachment[]
  citations?: Citation[]
}

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}
```

#### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant ChatWindow
    participant MessageList
    participant ChatInput
    participant API
    
    User->>ChatInput: Types message
    User->>ChatInput: Clicks send
    ChatInput->>ChatWindow: onSendMessage(content)
    ChatWindow->>ChatWindow: Add user message to state
    ChatWindow->>MessageList: Render with new message
    MessageList-->>User: Display user message
    
    ChatWindow->>API: POST /api/chat
    ChatWindow->>ChatWindow: Set isLoading = true
    ChatWindow->>MessageList: Show typing indicator
    
    API-->>ChatWindow: Response
    ChatWindow->>ChatWindow: Add assistant message
    ChatWindow->>ChatWindow: Set isLoading = false
    ChatWindow->>MessageList: Render with response
    MessageList-->>User: Display assistant message
```

**Usage Example:**

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })
      const data = await response.json()
      
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      placeholder="Ask me anything..."
      enableVoiceInput
      showSidebar
    />
  )
}
```

**Advanced Usage with All Features:**

```tsx
import {
  ChatWindow,
  ThemeProvider,
  ErrorBoundaryEnhanced,
  AnalyticsProvider,
  themes,
} from '@clarity-chat/react'

function AdvancedApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const { trackEvent } = useAnalytics()

  const handleSendMessage = async (content: string) => {
    trackEvent('message_sent', { content_length: content.length })
    // Your logic here
  }

  return (
    <ThemeProvider theme={themes.glassmorphism}>
      <AnalyticsProvider config={{ /* ... */ }}>
        <ErrorBoundaryEnhanced enableFeedback>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            enableVoiceInput
            enableFileUpload
            maxFileSize={50 * 1024 * 1024} // 50MB
            allowedFileTypes={['image/*', 'application/pdf']}
            showSidebar
            showTimestamps
          />
        </ErrorBoundaryEnhanced>
      </AnalyticsProvider>
    </ThemeProvider>
  )
}
```

---

### MessageList

Displays a list of messages with virtualization for performance.

#### Component Anatomy

```mermaid
graph TB
    subgraph "MessageList"
        A[Virtual Scroll Container]
        A --> B[Viewport]
        B --> C[Visible Messages Only]
        
        C --> D[Message 1]
        C --> E[Message 2]
        C --> F[Message N]
        
        A --> G[Scroll Handler]
        G --> H[Calculate Visible Range]
        H --> I[Render Window]
        
        A --> J[Loading Indicator?]
        J --> K[TypingIndicator]
    end
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
```

#### Virtualization Performance

```mermaid
graph LR
    subgraph "Without Virtualization"
        A1[1000 messages]
        A2[1000 DOM nodes]
        A3[Slow scrolling]
        A4[High memory usage]
    end
    
    subgraph "With Virtualization"
        B1[1000 messages]
        B2[~20 DOM nodes]
        B3[Smooth scrolling]
        B4[Low memory usage]
    end
    
    A1 --> A2 --> A3 --> A4
    B1 --> B2 --> B3 --> B4
    
    style A3 fill:#ef4444,color:#fff
    style A4 fill:#f59e0b,color:#fff
    style B3 fill:#7ED321,color:#fff
    style B4 fill:#10b981,color:#fff
```

**Import:**
```tsx
import { MessageList } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `messages` | `Message[]` | ✅ | - | Array of messages to display |
| `isLoading` | `boolean` | ❌ | `false` | Show loading indicator |
| `onRetry` | `(messageId: string) => void` | ❌ | - | Handler for retry button |
| `onEdit` | `(messageId: string, content: string) => void` | ❌ | - | Handler for edit button |
| `onDelete` | `(messageId: string) => void` | ❌ | - | Handler for delete button |
| `showTimestamps` | `boolean` | ❌ | `true` | Show message timestamps |
| `showAvatar` | `boolean` | ❌ | `true` | Show user avatars |
| `enableVirtualization` | `boolean` | ❌ | `true` | Enable virtual scrolling |
| `estimatedMessageHeight` | `number` | ❌ | `100` | Estimated height per message |
| `className` | `string` | ❌ | - | Additional CSS classes |

**Usage Example:**

```tsx
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleRetry = (messageId: string) => {
    // Retry logic
  }

  const handleEdit = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    )
  }

  const handleDelete = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }

  return (
    <MessageList
      messages={messages}
      onRetry={handleRetry}
      onEdit={handleEdit}
      onDelete={handleDelete}
      showTimestamps
      showAvatar
      enableVirtualization
    />
  )
}
```

---

### Message

Individual message component with rich content rendering.

#### Message Anatomy

```mermaid
graph TB
    subgraph "Message Component"
        A[Message Container]
        A --> B[Header]
        A --> C[Content Area]
        A --> D[Actions]
        A --> E[Footer]
        
        B --> F[Avatar]
        B --> G[Username/Role]
        B --> H[Timestamp]
        
        C --> I[Markdown Renderer]
        I --> J[Text Content]
        I --> K[Code Blocks]
        I --> L[LaTeX Math]
        I --> M[Links]
        
        C --> N[Attachments?]
        N --> O[Images]
        N --> P[Files]
        
        C --> Q[Citations?]
        
        D --> R[Copy Button]
        D --> S[Edit Button]
        D --> T[Retry Button]
        D --> U[Delete Button]
        
        E --> V[Metadata]
        E --> W[Token Count]
    end
    
    style A fill:#4A90E2,color:#fff
    style C fill:#50E3C2,color:#fff
    style I fill:#F5A623,color:#fff
```

#### Content Rendering Pipeline

```mermaid
graph LR
    A[Raw Content] --> B{Content Type?}
    B -->|Plain Text| C[Text Renderer]
    B -->|Markdown| D[Markdown Parser]
    B -->|Code| E[Syntax Highlighter]
    B -->|Math| F[KaTeX Renderer]
    
    D --> G[HTML Output]
    E --> H[Highlighted Code]
    F --> I[Rendered Equation]
    C --> J[Formatted Text]
    
    G --> K[Final Display]
    H --> K
    I --> K
    J --> K
    
    style A fill:#4A90E2,color:#fff
    style D fill:#F5A623,color:#fff
    style E fill:#50E3C2,color:#fff
    style F fill:#ec4899,color:#fff
    style K fill:#7ED321,color:#fff
```

**Import:**
```tsx
import { Message } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | `Message` | ✅ | - | Message object |
| `showAvatar` | `boolean` | ❌ | `true` | Display avatar |
| `showTimestamp` | `boolean` | ❌ | `true` | Display timestamp |
| `showActions` | `boolean` | ❌ | `true` | Show action buttons |
| `onCopy` | `() => void` | ❌ | - | Copy button handler |
| `onEdit` | `() => void` | ❌ | - | Edit button handler |
| `onRetry` | `() => void` | ❌ | - | Retry button handler |
| `onDelete` | `() => void` | ❌ | - | Delete button handler |
| `renderContent` | `(content: string) => ReactNode` | ❌ | - | Custom content renderer |
| `className` | `string` | ❌ | - | Additional CSS classes |

**Features:**
- ✅ Markdown rendering with syntax highlighting
- ✅ Code block copy functionality
- ✅ LaTeX math rendering (with KaTeX)
- ✅ Link preview cards
- ✅ Image attachments
- ✅ Citation cards

**Usage Example:**

```tsx
function MessageComponent() {
  const message: Message = {
    id: '1',
    role: 'assistant',
    content: '# Hello!\n\nThis is **markdown** with `code`.',
    timestamp: new Date(),
  }

  return (
    <Message
      message={message}
      showAvatar
      showTimestamp
      showActions
      onCopy={() => navigator.clipboard.writeText(message.content)}
      onRetry={() => console.log('Retry')}
    />
  )
}
```

---

### VoiceInput

Voice-to-text input component using Web Speech API.

#### Voice Input Flow

```mermaid
sequenceDiagram
    participant User
    participant VoiceInput
    participant WebSpeech as Web Speech API
    participant App
    
    User->>VoiceInput: Click microphone
    VoiceInput->>WebSpeech: Start recognition
    WebSpeech-->>VoiceInput: Recognition started
    VoiceInput-->>User: Show recording indicator
    
    loop User speaks
        User->>WebSpeech: Speech audio
        WebSpeech->>WebSpeech: Process audio
        WebSpeech-->>VoiceInput: Interim results
        VoiceInput-->>User: Display partial text
    end
    
    User->>VoiceInput: Stop speaking
    WebSpeech->>WebSpeech: Finalize transcription
    WebSpeech-->>VoiceInput: Final transcript
    VoiceInput->>App: onTranscript(text)
    VoiceInput-->>User: Auto-submit or edit
```

#### Browser Support Matrix

```mermaid
graph TB
    subgraph "Full Support ✅"
        A1[Chrome/Edge<br/>Desktop & Mobile]
        A2[Safari iOS 14.5+]
        A3[Safari macOS 14.3+]
    end
    
    subgraph "Partial Support ⚠️"
        B1[Opera<br/>Desktop only]
        B2[Samsung Internet<br/>Android only]
    end
    
    subgraph "No Support ❌"
        C1[Firefox<br/>All platforms]
        C2[Safari <14.3<br/>All platforms]
    end
    
    style A1 fill:#7ED321,color:#fff
    style A2 fill:#7ED321,color:#fff
    style A3 fill:#7ED321,color:#fff
    style B1 fill:#F5A623,color:#fff
    style B2 fill:#F5A623,color:#fff
    style C1 fill:#ef4444,color:#fff
    style C2 fill:#ef4444,color:#fff
```

**Import:**
```tsx
import { VoiceInput } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onTranscript` | `(text: string) => void` | ✅ | - | Handler for transcribed text |
| `onError` | `(error: Error) => void` | ❌ | - | Error handler |
| `lang` | `string` | ❌ | `'en-US'` | Language code (BCP 47) |
| `continuous` | `boolean` | ❌ | `false` | Continuous recording |
| `interimResults` | `boolean` | ❌ | `true` | Show interim results |
| `autoSubmit` | `boolean` | ❌ | `true` | Auto-submit on speech end |
| `className` | `string` | ❌ | - | Additional CSS classes |

**Supported Languages:**
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish (Spain)
- `fr-FR` - French (France)
- `de-DE` - German (Germany)
- `zh-CN` - Chinese (Simplified)
- `ja-JP` - Japanese
- And 20+ more...

**Usage Example:**

```tsx
function VoiceChat() {
  const handleTranscript = (text: string) => {
    console.log('Transcribed:', text)
    // Send message or update input
  }

  const handleError = (error: Error) => {
    console.error('Voice error:', error)
  }

  return (
    <div className="flex gap-2">
      <input type="text" placeholder="Type or speak..." />
      <VoiceInput
        onTranscript={handleTranscript}
        onError={handleError}
        lang="en-US"
        autoSubmit
        interimResults
      />
    </div>
  )
}
```

**Browser Support:**

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full support |
| Safari (iOS 14.5+) | ✅ Full support |
| Safari (macOS 14.3+) | ✅ Full support |
| Firefox | ❌ Not yet supported |

---

### ThemeProvider

Context provider for theming system.

#### Theme Context Flow

```mermaid
graph TB
    A[ThemeProvider] --> B[Theme Object]
    B --> C[CSS Variables Injection]
    C --> D[document.documentElement]
    
    A --> E[React Context]
    E --> F[useTheme Hook]
    
    D --> G[--clarity-primary]
    D --> H[--clarity-secondary]
    D --> I[--clarity-background]
    D --> J[... all theme vars]
    
    F --> K[Child Components]
    K --> L[Read Theme Values]
    
    style A fill:#4A90E2,color:#fff
    style E fill:#50E3C2,color:#fff
    style K fill:#F5A623,color:#fff
```

**Import:**
```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `theme` | `Theme` | ✅ | - | Theme object |
| `children` | `ReactNode` | ✅ | - | Child components |

**Built-in Themes:**

```typescript
import { themes } from '@clarity-chat/react'

// Available themes:
themes.default       // Clean, professional
themes.dark          // Dark mode
themes.ocean         // Blue ocean vibes
themes.sunset        // Warm sunset colors
themes.forest        // Green nature theme
themes.corporate     // Professional business
themes.glassmorphism // Modern glass effect
themes.neon          // Cyberpunk neon
themes.minimal       // Ultra minimal
themes.warm          // Cozy warm tones
themes.cool          // Cool blue/gray
```

#### Theme Comparison

```mermaid
graph LR
    subgraph "Light Themes"
        L1[default]
        L2[minimal]
        L3[warm]
    end
    
    subgraph "Dark Themes"
        D1[dark]
        D2[neon]
    end
    
    subgraph "Colorful Themes"
        C1[ocean]
        C2[sunset]
        C3[forest]
    end
    
    subgraph "Professional Themes"
        P1[corporate]
        P2[cool]
        P3[glassmorphism]
    end
    
    style L1 fill:#F9FAFB,color:#000
    style D1 fill:#1F2937,color:#fff
    style C1 fill:#0EA5E9,color:#fff
    style P1 fill:#1E40AF,color:#fff
```

**Custom Theme Example:**

```tsx
import { ThemeProvider, createTheme } from '@clarity-chat/react'

const myTheme = createTheme({
  name: 'My Custom Theme',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#111827',
    accent: '#ec4899',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
})

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

---

### ErrorBoundaryEnhanced

Enhanced error boundary with user feedback collection.

#### Error Handling Flow

```mermaid
stateDiagram-v2
    [*] --> Normal: Component renders
    Normal --> Error: Exception thrown
    Error --> ErrorBoundary: componentDidCatch()
    ErrorBoundary --> LogError: Log to console
    LogError --> CallOnError: Call onError prop
    CallOnError --> DisplayFallback: Show fallback UI
    
    DisplayFallback --> FeedbackForm: enableFeedback=true
    DisplayFallback --> SimpleError: enableFeedback=false
    
    FeedbackForm --> CollectInput: User provides context
    CollectInput --> SubmitFeedback: Submit to backend
    
    SubmitFeedback --> Reset: User clicks retry
    SimpleError --> Reset: User clicks retry
    
    Reset --> [*]: componentDidMount()
```

**Import:**
```tsx
import { ErrorBoundaryEnhanced } from '@clarity-chat/react'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ | - | Components to wrap |
| `fallback` | `ReactNode \| ((error, reset) => ReactNode)` | ❌ | Default UI | Custom fallback UI |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | ❌ | - | Error handler |
| `enableFeedback` | `boolean` | ❌ | `false` | Show feedback form |
| `resetKeys` | `any[]` | ❌ | - | Keys that trigger reset |

**Usage Example:**

```tsx
function App() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('Error caught:', error, errorInfo)
    // Send to error tracking service
  }

  return (
    <ErrorBoundaryEnhanced
      enableFeedback
      onError={handleError}
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    >
      <ChatWindow {...props} />
    </ErrorBoundaryEnhanced>
  )
}
```

---

## 🎯 Component Composition Patterns

### Pattern 1: Full-Featured Chat

```mermaid
graph TB
    A[App] --> B[ThemeProvider]
    B --> C[ErrorBoundaryEnhanced]
    C --> D[AnalyticsProvider]
    D --> E[ChatWindow]
    
    E --> F[ProjectSidebar]
    E --> G[MessageList]
    E --> H[ChatInput]
    
    G --> I[Message×N]
    H --> J[FileUpload]
    H --> K[VoiceInput]
    
    style A fill:#4A90E2,color:#fff
    style E fill:#50E3C2,color:#fff
    style G fill:#F5A623,color:#fff
```

### Pattern 2: Minimal Chat

```mermaid
graph TB
    A[App] --> B[ChatWindow]
    B --> C[MessageList]
    B --> D[ChatInput]
    
    C --> E[Message×N]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
```

### Pattern 3: Custom Layout

```mermaid
graph TB
    A[Custom Layout] --> B[Header]
    A --> C[ThemeProvider]
    A --> D[Footer]
    
    C --> E[MessageList]
    C --> F[ChatInput]
    C --> G[TokenCounter]
    
    E --> H[Message×N]
    
    style A fill:#4A90E2,color:#fff
    style C fill:#50E3C2,color:#fff
```

---

## 📚 Additional Resources

- **[Hooks API Reference](./hooks.md)** - All custom hooks
- **[Utilities API](./utilities.md)** - Helper functions
- **[TypeScript Types](./types.md)** - Complete type definitions
- **[Examples](../examples/README.md)** - Real-world usage examples
- **[Storybook](https://storybook.clarity-chat.dev)** - Interactive component explorer

---

## 🤝 Need Help?

- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 📖 [Full Documentation](../README.md)

---

**Next:** [Hooks API Reference →](./hooks.md)
