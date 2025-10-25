# Clarity Chat 🚀

> Premium AI Chat Component Library by [Code & Clarity](https://codeclarity.ai)

A comprehensive, production-ready React component library for building AI-powered chat applications. Built with TypeScript, Tailwind CSS, and modern web technologies.

## ✨ Features

### 🎨 Beautiful Design
- **Modern UI** with Tailwind CSS and shadcn/ui
- **Dark mode** support out of the box
- **Responsive** design for all screen sizes
- **Smooth animations** powered by Framer Motion
- **Hooked principles** for delightful micro-interactions

### 🧩 Comprehensive Components
- **Message components** with rich text, code highlighting, and markdown support
- **Chat interface** with streaming support
- **Input components** with autocomplete and file upload
- **Status indicators** showing AI thinking/processing stages
- **Project management** for organizing conversations
- **Knowledge base** auto-generation from conversations

### 🛠️ Developer Experience
- **TypeScript-first** with complete type definitions
- **Composable primitives** for maximum flexibility
- **Copy-paste ready** components
- **Storybook** with interactive documentation
- **Zero config** - works out of the box

### 🚀 Advanced Features
- Real-time **streaming responses**
- **Context management** for documents, images, and links
- **Prompt library** with templates
- **Usage tracking** and analytics
- **Export** to PDF, DOCX, and Markdown
- **Feedback system** for training models

## 📦 Packages

This monorepo contains **TWO COMPLETE LIBRARIES**:

### 🎨 Chat Component Library
- **@clarity-chat/react** - Full-featured chat UI components (34 components, 20+ hooks)
- **@clarity-chat/primitives** - Core UI primitives (Button, Avatar, Input, Card, etc.)
- **@clarity-chat/types** - TypeScript type definitions

### 🛡️ Error Handling Library (NEW!)
- **@clarity-chat/error-handling** - Specialized error handling system
  - 10 custom error classes with helpful context
  - 24+ factory functions for consistent error creation
  - 5 error recovery hooks with automatic retry
  - ErrorBoundary with modern functional API
  - 85%+ test coverage
  - 1,300+ lines of documentation

### 📚 Documentation & Tools
- **@clarity-chat/storybook** - Interactive component documentation
- **@clarity-chat/docs** - Documentation website

## 🏁 Quick Start

### Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives
```

### Basic Usage (Chat Only)

```tsx
import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  const handleSendMessage = async (content: string) => {
    // Your AI integration here
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  )
}
```

### Advanced Usage (Chat + Error Handling)

```tsx
import { ChatWindow, useChat, useStreaming } from '@clarity-chat/react'
import { 
  ErrorBoundary, 
  useAsyncError, 
  createApiError 
} from '@clarity-chat/error-handling'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, sendMessage } = useChat()
  const { stream } = useStreaming()
  const { executeAsync, isLoading, retryCount } = useAsyncError()

  const handleSend = async (content: string) => {
    await executeAsync(
      async () => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: content })
        })
        
        if (!response.ok) {
          throw createApiError.serverError(response.status)
        }
        
        return await stream(response)
      },
      {
        maxRetries: 3,
        retryDelay: 1000
      }
    )
  }

  return (
    <ErrorBoundary>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        isLoading={isLoading}
      />
      {retryCount > 0 && <p>Retrying... (Attempt {retryCount})</p>}
    </ErrorBoundary>
  )
}
```

## 🏗️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Start docs site
npm run docs

# Build all packages
npm run build

# Run tests
npm run test
```

### Project Structure

```
clarity-chat/
├── packages/
│   ├── types/          # TypeScript types
│   ├── primitives/     # Base components
│   └── react/          # React components
├── apps/
│   ├── storybook/      # Component documentation
│   └── docs/           # Documentation site
├── examples/
│   └── basic-chat/     # Example applications
└── styles/
    └── globals.css     # Global styles
```

## 📚 Documentation

- **Storybook**: Run `npm run storybook` to view interactive component docs
- **Docs Site**: Run `npm run docs` to view the full documentation
- **TypeScript**: All components include complete TypeScript definitions

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo setup with Turborepo
- [x] Core type definitions
- [x] Primitive components (Button, Avatar, Input, etc.)
- [x] Message component with markdown and code highlighting
- [x] Basic chat window
- [x] Storybook setup

### Phase 2: Core Features ✅
- [x] Advanced input with autocomplete (@mentions, /commands)
- [x] File upload handling with drag & drop
- [x] Context management for documents and files
- [x] Project organization with sidebar
- [x] Prompt library with templates

### Phase 3: Production Infrastructure ✅ **NEW**
- [x] **Error Handling System** - ErrorBoundary + RetryButton + useErrorRecovery
- [x] **Token Management** - TokenCounter + useTokenTracker with cost estimation
- [x] **Network Resilience** - NetworkStatus monitoring + auto-reconnection
- [x] **Message Operations** - Edit, regenerate, branch, undo/redo
- [x] **Realistic Typing** - Multi-stage indicators with adaptive timing
- [x] **Comprehensive Tests** - 28 tests covering core functionality
- [x] **Full Documentation** - Architecture, examples, API reference

**🎉 What's New in v2.0:**
- Production-ready error recovery with exponential backoff
- Real-time token tracking with cost transparency
- Message editing, regeneration, and conversation branching
- Natural typing indicators that adapt to message length
- Complete integration examples and deployment guides

### Phase 4: Extended Features (Next)
- [ ] ContextVisualizer component (show what AI "sees")
- [ ] ConversationList with search and filtering
- [ ] Mobile keyboard handling (useMobileKeyboard)
- [ ] Voice input with speech-to-text
- [ ] Design system overhaul (glassmorphism)
- [ ] Pre-built templates (support bot, code assistant)
- [ ] Video tutorials and landing page

## 🤝 Contributing

This is a private project by Code & Clarity. For inquiries, contact us at team@codeclarity.ai

## 📄 License

Proprietary - © 2024 Code & Clarity. All rights reserved.

## 🎨 Design Philosophy

Built on the principles of "Hooked" by Nir Eyal:

1. **Trigger** - Clear visual cues and intuitive interfaces
2. **Action** - Easy-to-use components with minimal friction
3. **Variable Reward** - Delightful animations and micro-interactions
4. **Investment** - Features that improve with use (prompts, knowledge bases)

## 🏢 About Code & Clarity

Code & Clarity is a boutique technical studio focused on AI, frontend engineering, and developer experience. We turn complex AI systems into intuitive products.

Visit us at [codeclarity.ai](https://codeclarity.ai)

---

**Built with ❤️ by Code & Clarity**
