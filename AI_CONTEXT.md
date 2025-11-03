# Clarity Chat AI Context File 🤖

**Purpose**: Instant AI agent context for the Clarity AI Chat Components library  
**Last Updated**: November 3, 2025  
**Status**: Production-Ready

> **For AI Agents**: Read this for instant understanding of the Clarity Chat library

---

## 📋 Quick Stats

- **Components**: 70+
- **Hooks**: 28 (A+ quality, 96/100)
- **Test Coverage**: 64%
- **TypeScript**: 100%
- **Status**: Production-Ready ✅

## 🏗️ Architecture

**Monorepo Structure**:
```
@clarity-chat/react      # Main package (70+ components, 28 hooks)
@clarity-chat/primitives # Base UI (Button, Badge, Card, etc.)
@clarity-chat/types      # TypeScript definitions
@clarity-chat/errors     # Error utilities
```

## 🎨 Key Components

1. **ChatWindow** - Complete chat interface
2. **Message** - Single message display
3. **StreamingMessage** - Real-time streaming
4. **ModelSelector** - AI model picker
5. **ContextManager** - Document management
6. **FileUpload** - Drag & drop files
7. **VoiceInput** - Speech-to-text

## 🪝 Key Hooks

1. **useChat()** - Chat state management
2. **useStreaming()** - Stream handling
3. **useLocalStorage()** - Persistent state
4. **useDebounce()** - Value debouncing
5. **useClipboard()** - Copy to clipboard

## 🚀 Quick Start

\`\`\`typescript
import { ChatWindow, ThemeProvider, useChat } from '@clarity-chat/react'

const { messages, sendMessage } = useChat({
  onSendMessage: async (msg) => {
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(msg)
    })
  }
})

<ThemeProvider defaultTheme="ocean">
  <ChatWindow messages={messages} onSend={sendMessage} />
</ThemeProvider>
\`\`\`

## 📚 Documentation Files

- **AI_CONTEXT_COMPONENTS.md** - Component API reference
- **AI_CONTEXT_HOOKS.md** - Hooks API reference
- **AI_CONTEXT_ARCHITECTURE.md** - Architecture deep dive
- **AI_CONTEXT_EXAMPLES.md** - Code recipes
- **AI_CONTEXT_TYPES.md** - TypeScript types
- **AI_CONTEXT_QUICK_REFERENCE.md** - Fast lookup

Run \`./generate-ai-context.sh\` to combine all files.

---

_AI context file - instant library understanding_
