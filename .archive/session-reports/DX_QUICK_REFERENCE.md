# 🚀 Clarity Chat - Quick Reference

## The Simplest Way (Recommended)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** One component, zero configuration.

## With More Control

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages} // No conversion needed! ✨
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

## Common Patterns

### With Memory
```tsx
<ClarityChat 
  api="/api/chat"
  memory={{ enabled: true, strategy: 'sliding-window' }}
/>
```

### With Custom Styling
```tsx
<ClarityChat 
  api="/api/chat"
  className="h-screen rounded-lg"
  showHeader
  sessionTitle="AI Assistant"
/>
```

### With Error Handling
```tsx
const { messages, append, isLoading, error } = useClarityChat({
  api: '/api/chat',
})

if (error) {
  return <div>Error: {error.message}</div>
}

return <ChatWindow messages={messages} isLoading={isLoading} ... />
```

## What Changed?

### ✅ Before (Old Way)
```tsx
const { messages } = useClarityChat({ api: '/api/chat' })
const converted = convertCoreMessagesToMessages(messages) // Required!
return <ChatWindow messages={converted} />
```

### ✨ After (New Way)
```tsx
// Option 1: Super simple
return <ClarityChat api="/api/chat" />

// Option 2: More control, no conversion needed
const { messages } = useClarityChat({ api: '/api/chat' })
return <ChatWindow messages={messages} /> // Works directly!
```

## API Reference

### `ClarityChat` Component

**Props:**
- `api` (required) - API endpoint URL
- `memory?` - Memory configuration
- `transport?` - 'sse' | 'websocket'
- `className?` - Custom CSS classes
- `showHeader?` - Show header
- `sessionTitle?` - Header title
- All other `UseClarityChatOptions` props

### `ChatWindow` Component

**Props:**
- `messages` - `Message[] | CoreMessage[]` (accepts both!)
- `isLoading?` - Loading state
- `onSendMessage` - Send handler
- All other existing props

### `useClarityChat` Hook

**Returns:**
- `messages` - `CoreMessage[]` (works directly with ChatWindow!)
- `append` - Add message
- `isLoading` - Loading state
- `error` - Error state
- `memoryInfo` - Memory statistics
- All other existing return values

## Migration Guide

### Step 1: Remove Conversion
```diff
- const converted = convertCoreMessagesToMessages(messages)
- <ChatWindow messages={converted} />
+ <ChatWindow messages={messages} />
```

### Step 2: (Optional) Use ClarityChat Component
```diff
- const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
- return <ChatWindow messages={messages} isLoading={isLoading} ... />
+ return <ClarityChat api="/api/chat" />
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
