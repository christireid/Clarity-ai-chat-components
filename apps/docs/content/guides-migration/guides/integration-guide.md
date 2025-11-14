# Integration Guide

Complete guide for integrating Clarity Chat into your application.

## 🚀 Quick Start

### Installation

```bash
npm install @clarity-chat/react
```

### Basic Setup

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </ThemeProvider>
  )
}
```

## 📦 Component Integration

### Enhanced Markdown Rendering

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

<EnhancedMarkdownRenderer
  content={markdownContent}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
  }}
  isStreaming={isStreaming}
/>
```

### Prompt Suggestions

```tsx
import { PromptSuggestions, usePromptSuggestions } from '@clarity-chat/react'

const suggestions = usePromptSuggestions(messages)
<PromptSuggestions
  suggestions={suggestions}
  onSelect={(s) => sendMessage(s.text)}
  layout="chips"
/>
```

### Advanced Search

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  enableAdvancedFilters
  onResultsChange={setFiltered}
/>
```

### Batch Export

```tsx
import { BatchExportDialog } from '@clarity-chat/react'

<BatchExportDialog
  resources={conversations}
  onExport={handleExport}
  progress={exportProgress}
/>
```

## 🔧 Configuration

### Using Configuration Builder

```tsx
import { createChatConfig } from '@clarity-chat/react'

const config = createChatConfig()
  .withStreaming({
    provider: 'openai',
    endpoint: '/api/chat',
    retryPolicy: 'exponential',
  })
  .withAccessibility({
    screenReader: true,
    keyboardShortcuts: true,
  })
  .withPersistence({
    storage: 'indexeddb',
    maxHistory: 1000,
  })
  .build()
```

## 💾 Persistence

### IndexedDB for Large Conversations

```tsx
import { useConversationStorage } from '@clarity-chat/react'

const { saveConversation, loadConversation } = useConversationStorage({
  maxMessages: 1000,
  autoCleanup: true,
})

// Save
await saveConversation('conv-123', messages)

// Load
const messages = await loadConversation('conv-123')
```

### Message History Hook

```tsx
import { useMessageHistory } from '@clarity-chat/react'

const {
  messages,
  paginatedMessages,
  search,
  save,
  load,
} = useMessageHistory({
  conversationId: 'conv-123',
  enablePagination: true,
  pageSize: 50,
})
```

## 🎨 Theming

### Using Built-in Themes

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

<ThemeProvider theme={themes.ocean}>
  {/* Your chat components */}
</ThemeProvider>
```

### Custom Theme

```tsx
import { createTheme } from '@clarity-chat/react'

const customTheme = createTheme({
  colors: {
    primary: '#your-color',
    // ... other colors
  },
})
```

## ⚡ Performance Optimization

### Virtual Scrolling

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
  itemHeight={100}
/>
```

### Debounced Input

```tsx
import { useDebounce } from '@clarity-chat/react'

const debouncedQuery = useDebounce(searchQuery, 300)
```

## 🔍 Search & Filter

### Basic Search

```tsx
import { MessageSearch } from '@clarity-chat/react'

<MessageSearch
  messages={messages}
  onResultsChange={setFiltered}
/>
```

### Advanced Search with Filters

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  enableAdvancedFilters
  enableFuzzySearch
  onResultsChange={setFiltered}
/>
```

## 📤 Export

### Single Export

```tsx
import { ExportDialog } from '@clarity-chat/react'

<ExportDialog
  open={showExport}
  onOpenChange={setShowExport}
  onExport={handleExport}
  resourceType="chat"
  resourceName="Conversation 1"
/>
```

### Batch Export

```tsx
import { BatchExportDialog } from '@clarity-chat/react'

<BatchExportDialog
  open={showBatchExport}
  onOpenChange={setShowBatchExport}
  resources={conversations}
  onExport={handleBatchExport}
  progress={exportProgress}
/>
```

## 🎯 Best Practices

1. **Use IndexedDB for large conversations** (>1000 messages)
2. **Enable pagination** for better performance
3. **Use virtual scrolling** for long message lists
4. **Debounce search queries** to reduce API calls
5. **Batch export operations** for multiple conversations
6. **Use configuration builder** for type-safe setup
7. **Enable accessibility features** by default

## 📚 Additional Resources

- [API Reference](./api/components.md)
- [Hooks Documentation](./api/hooks.md)
- [Examples](../examples/README.md)
- [Performance Guide](./performance.md)
