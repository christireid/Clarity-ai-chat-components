# Examples

Complete working examples demonstrating different use cases and integrations.

## Demo Applications

All examples are available in the [`examples/`](https://github.com/yourusername/clarity-chat/tree/main/examples) directory of the repository.

### 1. Basic Chat (Vite + React)

Simple chat application with simulated AI responses.

**Features:**
- Basic message handling
- Loading states
- User and AI messages
- Clean, minimal setup

**Location:** `examples/basic-chat/`

**Quick Start:**
```bash
cd examples/basic-chat
npm install
npm run dev
```

[View Source](https://github.com/yourusername/clarity-chat/tree/main/examples/basic-chat) | [Live Demo](#)

---

### 2. Streaming Chat (Next.js 15 + SSE)

Real-time streaming chat with Server-Sent Events.

**Features:**
- Token-by-token streaming
- Cancellation support
- Edge Runtime deployment
- OpenAI integration example

**Location:** `examples/streaming-chat/`

**Quick Start:**
```bash
cd examples/streaming-chat
npm install
npm run dev
```

[View Source](https://github.com/yourusername/clarity-chat/tree/main/examples/streaming-chat) | [Live Demo](#)

---

### 3. Customer Support (Next.js + Supabase)

Customer support chat with conversation history.

**Features:**
- Customer information collection
- Persistent conversation storage
- Real-time updates with Supabase
- Support dashboard ready
- SQL migrations included

**Location:** `examples/customer-support/`

**Quick Start:**
```bash
cd examples/customer-support
npm install

# Set up Supabase
cp .env.example .env.local
# Add your Supabase credentials

# Run migrations
npm run db:migrate

npm run dev
```

[View Source](https://github.com/yourusername/clarity-chat/tree/main/examples/customer-support) | [Live Demo](#)

---

### 4. Multi-User Chat (Remix + Socket.io)

Real-time multi-user chat application.

**Features:**
- Multiple chat rooms
- User presence indicators
- Typing indicators
- Join/leave notifications
- WebSocket communication

**Location:** `examples/multi-user-chat/`

**Quick Start:**
```bash
cd examples/multi-user-chat
npm install
npm run dev

# Open multiple browser windows to test
```

[View Source](https://github.com/yourusername/clarity-chat/tree/main/examples/multi-user-chat) | [Live Demo](#)

---

### 5. AI Assistant (Vite + TanStack Query)

Advanced AI assistant with state management.

**Features:**
- TanStack Query integration
- Persistent conversations
- Optimistic updates
- Automatic caching
- React Query DevTools
- Conversation management

**Location:** `examples/ai-assistant/`

**Quick Start:**
```bash
cd examples/ai-assistant
npm install
npm run dev
```

[View Source](https://github.com/yourusername/clarity-chat/tree/main/examples/ai-assistant) | [Live Demo](#)

---

## Example Comparison

| Feature | Basic | Streaming | Customer Support | Multi-User | AI Assistant |
|---------|-------|-----------|------------------|------------|--------------|
| Framework | Vite | Next.js 15 | Next.js 15 | Remix | Vite |
| Backend | Simulated | SSE | Supabase | Socket.io | TanStack Query |
| Real-time | ❌ | ✅ (SSE) | ✅ (Supabase) | ✅ (WebSocket) | ❌ |
| Persistence | ❌ | ❌ | ✅ (Database) | ❌ | ✅ (LocalStorage) |
| Multi-user | ❌ | ❌ | ❌ | ✅ | ❌ |
| Complexity | Beginner | Intermediate | Advanced | Advanced | Intermediate |
| Lines of Code | ~200 | ~400 | ~600 | ~700 | ~500 |

## Code Snippets

### Basic Chat Example

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulated AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: "${content}"`,
        timestamp: Date.now(),
      }])
      setIsLoading(false)
    }, 1000)
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
}
```

### Streaming Chat Example

```tsx
const handleSendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let accumulatedContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') break

        const parsed = JSON.parse(data)
        accumulatedContent += parsed.content
        
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        )
      }
    }
  }
}
```

## Interactive Storybook

Explore all components interactively in Storybook:

```bash
npm run storybook
```

Visit `http://localhost:6006` to see:

- 23+ component stories
- Interactive controls
- Props documentation
- Code examples
- Multiple variants

## Running Examples

### Clone the Repository

```bash
git clone https://github.com/yourusername/clarity-chat.git
cd clarity-chat
```

### Install Dependencies

```bash
npm install
```

### Run an Example

```bash
cd examples/basic-chat
npm run dev
```

### Run Storybook

```bash
npm run storybook
```

## Next Steps

- [Getting Started](/guide/getting-started) - Learn the basics
- [API Reference](/api/components) - Component documentation
- [Cookbook](/cookbook) - Common patterns
- [Integration Guides](/integrations/nextjs) - Framework-specific guides
