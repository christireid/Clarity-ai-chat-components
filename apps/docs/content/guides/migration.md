# Migration Guide

This guide helps you migrate between versions of Clarity Chat and from other chat libraries.

## Upgrading from v1.x to v2.x

### Breaking Changes

#### Component Props

Some component props have been renamed for consistency:

```tsx
// v1.x
<ChatWindow 
  onMessage={handleMessage}
  enableMarkdown={true}
/>

// v2.x
<ChatWindow 
  onSendMessage={handleMessage}
  enableMarkdown={true}
/>
```

#### Hook API Changes

The `useChat` hook has been enhanced:

```tsx
// v1.x
const { messages, sendMessage } = useChat({
  initialMessages: [],
})

// v2.x
const { messages, sendMessage, isLoading, error } = useChat({
  initialMessages: [],
  onError: (error) => console.error(error),
})
```

#### Type Changes

Message types have been updated:

```tsx
// v1.x
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// v2.x
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: Record<string, any>
}
```

### Migration Steps

1. **Update Dependencies**

```bash
npm install @clarity-chat/react@latest
```

2. **Update Component Props**

Search and replace:
- `onMessage` → `onSendMessage`
- `onSubmit` → `onSendMessage`
- `isTyping` → `isLoading`

3. **Update Hook Usage**

Update `useChat` calls to use new API:

```tsx
// Before
const { messages, send } = useChat()

// After
const { messages, sendMessage } = useChat()
```

4. **Update Type Imports**

```tsx
// Before
import type { Message } from '@clarity-chat/types'

// After (if using new types)
import type { Message } from '@clarity-chat/react'
```

## Migrating from Other Libraries

### From react-chat-ui

```tsx
// react-chat-ui
import { ChatFeed, MessageGroup } from 'react-chat-ui'

// Clarity Chat
import { ChatWindow } from '@clarity-chat/react'

// Before
<ChatFeed
  messages={messages}
  isTyping={isTyping}
/>

// After
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
/>
```

### From react-chatbot-kit

```tsx
// react-chatbot-kit
import Chatbot from 'react-chatbot-kit'

// Clarity Chat
import { ChatWindow } from '@clarity-chat/react'

// Before
<Chatbot
  config={config}
  messageParser={MessageParser}
  actionProvider={ActionProvider}
/>

// After
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
/>
```

### From Vercel AI SDK

```tsx
// Vercel AI SDK
import { useChat } from 'ai/react'

// Clarity Chat
import { useChat } from '@clarity-chat/react'

// Before
const { messages, input, handleInputChange, handleSubmit } = useChat()

// After
const { messages, sendMessage, isLoading } = useChat({
  onSendMessage: async (content) => {
    // Your send logic
  },
})
```

## Common Migration Patterns

### Message Format Conversion

```tsx
// Convert from old format
function convertMessages(oldMessages: OldMessage[]): Message[] {
  return oldMessages.map(msg => ({
    id: msg.id || Date.now().toString(),
    role: msg.role,
    content: msg.text || msg.content,
    timestamp: msg.timestamp || Date.now(),
  }))
}
```

### Event Handler Conversion

```tsx
// Before
const handleMessage = (message: string) => {
  // Handle message
}

// After
const handleSendMessage = async (content: string) => {
  // Handle message (now async)
  await sendToAPI(content)
}
```

### State Management Conversion

```tsx
// Before (manual state)
const [messages, setMessages] = useState([])

const handleSend = (text: string) => {
  setMessages([...messages, { text, role: 'user' }])
}

// After (with hook)
const { messages, sendMessage } = useChat({
  onSendMessage: async (content) => {
    // Auto-manages state
  },
})
```

## Troubleshooting

### Type Errors

If you see TypeScript errors:

1. Update your TypeScript version:
```bash
npm install -D typescript@latest
```

2. Clear type cache:
```bash
rm -rf node_modules/.cache
```

### Styling Issues

If styles are missing:

```tsx
// Import default styles
import '@clarity-chat/react/styles.css'
```

### Performance Issues

Enable virtualization for large message lists:

```tsx
<ChatWindow
  messages={messages}
  virtualizeMessages
  onSendMessage={handleSend}
/>
```

## Need Help?

- Check the [API Reference](/api/components) for updated APIs
- Review [Examples](/examples/) for migration patterns
- Open an issue on [GitHub](https://github.com/christireid/Clarity-ai-chat-components/issues)
