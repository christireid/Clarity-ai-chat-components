# Basic Chat Demo

A simple chat application demonstrating the Clarity Chat component library.

## Features

- ✅ Basic chat interface with `ChatWindow`
- ✅ Message history
- ✅ Loading states
- ✅ Simulated AI responses

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

This demo shows the most basic implementation of Clarity Chat:

```tsx
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    
    // Call your AI API here
    // ...
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}
```

## Next Steps

- Replace simulated responses with actual AI API calls
- Add error handling
- Implement message persistence
- Add user authentication

## Learn More

- [Clarity Chat Documentation](../../packages/react/README.md)
- [API Reference](../../packages/react/docs/API.md)
- [Storybook](../../apps/storybook)
