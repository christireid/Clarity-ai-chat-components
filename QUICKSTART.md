# 🚀 Clarity Chat - Quick Start Guide

## Getting Started in 5 Minutes

### Prerequisites
```bash
node --version  # v18+ required
npm --version   # v9+ required
```

### Installation

```bash
# Clone the repository (when published)
git clone https://github.com/code-clarity/clarity-chat.git
cd clarity-chat

# Install dependencies
npm install

# Build all packages
npm run build
```

### Development

```bash
# Start Storybook (interactive component playground)
npm run storybook
# Visit http://localhost:6006

# Build packages individually
cd packages/types && npm run build
cd packages/primitives && npm run build
cd packages/react && npm run build
```

## Basic Usage

### 1. Simple Chat Window

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'default',
      role: 'user' as const,
      content,
      status: 'sent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])

    // Call your AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
    
    const aiMessage = await response.json()
    setMessages(prev => [...prev, aiMessage])
  }

  return (
    <div className="h-screen p-4">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

### 2. Using the useChat Hook

```tsx
import { useChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, isLoading, sendMessage } = useChat({
    onSendMessage: async (message) => {
      // Your AI integration
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(message),
      })
      // Handle response...
    }
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

### 3. Individual Components

```tsx
import { Message, MessageList, ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function CustomChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={messages}
        onMessageCopy={(id, content) => {
          console.log('Copied:', content)
        }}
        onMessageFeedback={(id, type) => {
          console.log('Feedback:', id, type)
        }}
      />
      
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={(content) => {
          // Handle message
          setInput('')
        }}
      />
    </div>
  )
}
```

### 4. Streaming Responses

```tsx
import { useStreaming } from '@clarity-chat/react'
import { Message } from '@clarity-chat/react'

function StreamingExample() {
  const { content, isStreaming, startStreaming } = useStreaming({
    onChunk: (chunk) => console.log('Chunk:', chunk),
    onComplete: (text) => console.log('Complete:', text),
  })

  const handleStream = async () => {
    const response = await fetch('/api/stream')
    await startStreaming(response.body!)
  }

  return (
    <div>
      <button onClick={handleStream}>Start Stream</button>
      {isStreaming && (
        <Message
          message={{
            id: '1',
            chatId: '1',
            role: 'assistant',
            content,
            status: 'streaming',
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
        />
      )}
    </div>
  )
}
```

### 5. Custom Thinking Indicator

```tsx
import { ThinkingIndicator } from '@clarity-chat/react'
import type { AIStatus } from '@clarity-chat/types'

function AIProcessing() {
  const [status, setStatus] = useState<AIStatus>({
    stage: 'researching',
    topic: 'Latest React patterns',
    progress: 45,
    startedAt: new Date(),
  })

  return (
    <ThinkingIndicator status={status} />
  )
}
```

## Component Showcase

### Buttons

```tsx
import { Button } from '@clarity-chat/primitives'

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button loading>Loading...</Button>
```

### Inputs

```tsx
import { Input, Textarea } from '@clarity-chat/primitives'

<Input placeholder="Type here..." />
<Input error="This field is required" />
<Input icon={<SearchIcon />} iconPosition="left" />

<Textarea autoResize maxRows={6} />
```

### Badges

```tsx
import { Badge } from '@clarity-chat/primitives'

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
<Badge dot>Live</Badge>
```

### Avatars

```tsx
import { Avatar } from '@clarity-chat/primitives'

<Avatar src="/user.jpg" alt="User" />
<Avatar fallback="JD" size="lg" />
<Avatar status="online" />
<Avatar status="busy" />
```

## Theming

### Light/Dark Mode

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark')

// Or use a theme provider
import { ThemeProvider } from 'next-themes'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {/* Your app */}
    </ThemeProvider>
  )
}
```

### Custom Colors

```css
/* globals.css */
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other colors */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

## TypeScript Support

All components are fully typed:

```tsx
import type {
  Message,
  Chat,
  User,
  AIStatus,
  Project,
  KnowledgeBase,
  SavedPrompt,
  UserSettings,
} from '@clarity-chat/types'

// Autocomplete and type checking everywhere!
const message: Message = {
  id: '1',
  chatId: '1',
  role: 'user', // ✅ 'user' | 'assistant' | 'system'
  content: 'Hello',
  status: 'sent', // ✅ 'pending' | 'sending' | 'sent' | 'streaming' | 'error'
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## Storybook

View all components interactively:

```bash
npm run storybook
```

Then open http://localhost:6006 to see:
- 📚 Component documentation
- 🎮 Interactive controls
- 🎨 Dark mode toggle
- ♿ Accessibility tests
- 📐 Layout measurements

## Common Patterns

### Message with Code

```tsx
<Message
  message={{
    role: 'assistant',
    content: `Here's the code:\n\n\`\`\`tsx\nfunction Hello() {\n  return <div>Hello</div>\n}\n\`\`\``,
    // ... other fields
  }}
/>
```

### Error Handling

```tsx
const { error, sendMessage } = useChat()

if (error) {
  return <div className="text-red-500">Error: {error.message}</div>
}
```

### Custom Actions

```tsx
<Message
  message={message}
  onCopy={(content) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied!')
  }}
  onFeedback={(type) => {
    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ messageId: message.id, type }),
    })
  }}
  onRetry={() => {
    sendMessage(message.content)
  }}
/>
```

## Next Steps

1. **Explore Storybook** - See all components in action
2. **Read the README** - Understand the architecture
3. **Check examples/** - See complete implementations
4. **Join Discord** - Get help from the community
5. **Read the docs** - Deep dive into features

## Resources

- 📖 [Full Documentation](./README.md)
- 🎨 [Design System](./packages/primitives/README.md)
- 🔧 [API Reference](./packages/types/src/)
- 💬 [Discord Community](#)
- 🐛 [Issue Tracker](#)

## Support

Questions? Reach out:
- Email: team@codeclarity.ai
- Website: https://codeclarity.ai
- Twitter: @codeclarity

---

**Happy Coding! 🚀**

Built with ❤️ by Code & Clarity
