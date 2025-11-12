# Comprehensive Usage Guide - Clarity Chat

**Complete guide to using all Clarity Chat features**

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Components](#core-components)
3. [Enhanced Features](#enhanced-features)
4. [Hooks](#hooks)
5. [Configuration](#configuration)
6. [Performance](#performance)
7. [Examples](#examples)

---

## 🚀 Quick Start

### Installation

```bash
npm install @clarity-chat/react
```

### Basic Example

```tsx
import { ChatWindow, ThemeProvider, themes, useChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, sendMessage } = useChat()
  
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
      />
    </ThemeProvider>
  )
}
```

---

## 🧩 Core Components

### ChatWindow

Main chat container component.

```tsx
<ChatWindow>
  <MessageList messages={messages} />
  <ChatInput onSendMessage={handleSend} />
</ChatWindow>
```

### MessageList

Display list of messages with virtual scrolling support.

```tsx
<MessageList
  messages={messages}
  enableVirtualScrolling
  itemHeight={100}
/>
```

### ChatInput

Input component with auto-resize and file upload.

```tsx
<ChatInput
  onSendMessage={handleSend}
  placeholder="Type your message..."
  enableFileUpload
  enableVoiceInput
/>
```

---

## ✨ Enhanced Features

### Enhanced Markdown Renderer

Render markdown with KaTeX and Mermaid support.

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

<EnhancedMarkdownRenderer
  content={markdownContent}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
    codeTheme: 'dark',
  }}
  isStreaming={isStreaming}
/>
```

**Features:**
- ✅ LaTeX/math formula rendering
- ✅ Mermaid diagram support
- ✅ Syntax highlighting
- ✅ Streaming content handling

### Enhanced Code Block

Code blocks with line numbers and folding.

```tsx
import { EnhancedCodeBlock } from '@clarity-chat/react'

<EnhancedCodeBlock
  code={codeString}
  language="typescript"
  showLineNumbers
  enableFolding
  maxHeight={20}
  filename="example.ts"
  highlightLines={[3, 5, 7]}
/>
```

**Features:**
- ✅ Line numbers
- ✅ Code folding
- ✅ Language detection
- ✅ Highlighted lines
- ✅ Copy functionality

### Streaming Text Renderer

Configurable streaming text display.

```tsx
import { StreamingTextRenderer } from '@clarity-chat/react'

<StreamingTextRenderer
  text={streamingText}
  isStreaming={true}
  typingSpeed={30}
  displayMode="character"
  showCursor={true}
/>
```

**Features:**
- ✅ Character-by-character display
- ✅ Chunk-based display
- ✅ Configurable typing speed
- ✅ Animated cursor

### Prompt Suggestions

Context-aware prompt suggestions.

```tsx
import { PromptSuggestions, usePromptSuggestions } from '@clarity-chat/react'

const suggestions = usePromptSuggestions(messages, {
  maxSuggestions: 6,
  suggestionType: 'follow-up',
})

<PromptSuggestions
  suggestions={suggestions}
  onSelect={(suggestion) => sendMessage(suggestion.text)}
  layout="chips"
  showCategories
/>
```

**Features:**
- ✅ Starter prompts
- ✅ Follow-up suggestions
- ✅ Context-aware recommendations
- ✅ Multiple layouts

### Advanced Message Search

Full-featured search with filtering.

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  enableAdvancedFilters
  enableFuzzySearch
  showFilterCount
  onResultsChange={setFilteredMessages}
/>
```

**Filters:**
- By role (user/assistant/system)
- By date range
- By model
- By token count
- By attachments
- By error status

### Batch Export

Export multiple conversations at once.

```tsx
import { BatchExportDialog } from '@clarity-chat/react'

<BatchExportDialog
  open={showExport}
  onOpenChange={setShowExport}
  resources={conversations}
  onExport={handleBatchExport}
  progress={exportProgress}
/>
```

**Formats:**
- PDF
- Markdown
- JSON
- HTML
- DOCX

### Message Metadata

Comprehensive message metadata display.

```tsx
import { MessageMetadata } from '@clarity-chat/react'

<MessageMetadata
  message={message}
  showCost
  showResponseTime
  showConfidence
  showTokens
  showModel
  showSources
/>
```

**Displays:**
- Token usage (input/output)
- Cost estimation
- Response time
- Model information
- Confidence scores
- Source attribution

---

## 🎣 Hooks

### useChat

Main chat hook for message management.

```tsx
const { messages, sendMessage, isLoading, error } = useChat({
  initialMessages: [],
  onSendMessage: async (message) => {
    // Handle message sending
  },
})
```

### useMessageHistory

Message history with persistence and pagination.

```tsx
const {
  messages,
  paginatedMessages,
  search,
  filter,
  save,
  load,
} = useMessageHistory({
  conversationId: 'conv-123',
  enablePagination: true,
  pageSize: 50,
  autoSave: true,
})
```

### useConversationStorage

IndexedDB-based conversation storage.

```tsx
const {
  saveConversation,
  loadConversation,
  listConversations,
} = useConversationStorage({
  maxMessages: 1000,
  chunkSize: 100,
  autoCleanup: true,
})
```

### useStreamingSSE

Server-Sent Events streaming.

```tsx
const { connect, disconnect, isConnected } = useStreamingSSE({
  url: '/api/chat/stream',
  autoReconnect: true,
  onMessage: (event) => {
    // Handle streaming chunks
  },
})
```

### usePromptSuggestions

Generate context-aware suggestions.

```tsx
const suggestions = usePromptSuggestions(messages, {
  maxSuggestions: 6,
  suggestionType: 'follow-up',
})
```

---

## ⚙️ Configuration

### Configuration Builder

Type-safe configuration using builder pattern.

```tsx
import { createChatConfig } from '@clarity-chat/react'

const config = createChatConfig()
  .withStreaming({
    provider: 'openai',
    endpoint: '/api/chat',
    retryPolicy: 'exponential',
    maxRetries: 3,
  })
  .withAccessibility({
    screenReader: true,
    keyboardShortcuts: true,
  })
  .withPersistence({
    storage: 'indexeddb',
    maxHistory: 1000,
    autoSave: true,
  })
  .withMarkdown({
    enableKaTeX: true,
    enableMermaid: true,
  })
  .withSearch({
    enableFuzzySearch: true,
    enableAdvancedFilters: true,
  })
  .build()
```

---

## ⚡ Performance

### Virtual Scrolling

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
  itemHeight={100}
  overscan={5}
/>
```

### Performance Utilities

```tsx
import {
  calculateVisibleRange,
  createDebouncedFunction,
  MemoryManager,
  PerformanceTracker,
} from '@clarity-chat/react'

// Virtual scrolling
const { start, end } = calculateVisibleRange(totalItems, scrollTop, {
  itemHeight: 100,
  containerHeight: 600,
})

// Debouncing
const debouncedSearch = createDebouncedFunction(search, { delay: 300 })

// Memory management
const cache = new MemoryManager(100)
cache.set('key', value)

// Performance tracking
const tracker = new PerformanceTracker()
const stop = tracker.start('render')
// ... operation
stop()
const avgTime = tracker.getAverage('render')
```

---

## 📖 Complete Example

```tsx
import * as React from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useChat,
  useMessageHistory,
  usePromptSuggestions,
  EnhancedMarkdownRenderer,
  PromptSuggestions,
  AdvancedMessageSearch,
  MessageMetadata,
  createChatConfig,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function CompleteChatExample() {
  // Configuration
  const config = React.useMemo(
    () =>
      createChatConfig()
        .withStreaming({
          provider: 'openai',
          endpoint: '/api/chat/stream',
          retryPolicy: 'exponential',
        })
        .withPersistence({
          storage: 'indexeddb',
          maxHistory: 1000,
        })
        .withMarkdown({
          enableKaTeX: true,
          enableMermaid: true,
        })
        .build(),
    []
  )

  // Message history
  const {
    messages,
    paginatedMessages,
    save,
    load,
  } = useMessageHistory({
    conversationId: 'main-chat',
    enablePagination: true,
  })

  // Chat operations
  const { sendMessage, isLoading } = useChat({
    initialMessages: messages,
  })

  // Prompt suggestions
  const suggestions = usePromptSuggestions(messages)

  // Load on mount
  React.useEffect(() => {
    load()
  }, [load])

  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow>
        {/* Search */}
        <AdvancedMessageSearch
          messages={messages}
          enableAdvancedFilters
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {paginatedMessages.map((message) => (
            <div key={message.id}>
              {message.role === 'assistant' ? (
                <EnhancedMarkdownRenderer
                  content={message.content}
                  config={config.markdown}
                />
              ) : (
                <p>{message.content}</p>
              )}
              <MessageMetadata message={message} />
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <PromptSuggestions
          suggestions={suggestions}
          onSelect={(s) => sendMessage(s.text)}
        />

        {/* Input */}
        <ChatInput
          onSendMessage={async (content) => {
            await sendMessage(content)
            await save()
          }}
        />
      </ChatWindow>
    </ThemeProvider>
  )
}
```

---

## 🎯 Best Practices

1. **Use IndexedDB** for conversations with 1000+ messages
2. **Enable pagination** for better performance
3. **Use virtual scrolling** for long lists
4. **Debounce search** to reduce API calls
5. **Batch exports** for multiple conversations
6. **Use configuration builder** for type safety
7. **Enable accessibility** features by default

---

**For more examples, see:** `examples/integration-examples/`
