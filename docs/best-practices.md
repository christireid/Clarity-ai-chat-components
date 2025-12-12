# Best Practices Guide

Production-ready patterns and recommendations for building with Clarity Chat.

---

## Component Usage

### ✅ Do: Use ChatWindow for Quick Development

```tsx
// ✅ Good: Use ChatWindow for standard interfaces
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

### ❌ Don't: Over-Customize ChatWindow

```tsx
// ❌ Bad: Over-customizing ChatWindow
<ChatWindow
  renderMessage={CustomMessage}
  renderInput={CustomInput}
  renderHeader={CustomHeader}
  // ... too many customizations
/>
// Better: Use MessageList + ChatInput for custom layouts
```

---

## Memory Management

### ✅ Do: Enable Memory for Multi-Turn Conversations

```tsx
// ✅ Good: Enable memory for context
const { messages } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  },
})
```

### ❌ Don't: Use Memory for Simple Chats

```tsx
// ❌ Bad: Unnecessary memory for simple chats
const { messages } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,  // Not needed for simple Q&A
  },
})
```

---

## Performance

### ✅ Do: Use Virtualized Lists for Many Messages

```tsx
// ✅ Good: Virtualized list for performance
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  // Only renders visible messages
/>
```

### ❌ Don't: Render All Messages

```tsx
// ❌ Bad: Rendering all messages
{messages.map(msg => (
  <Message key={msg.id} message={msg} />
))}
// Use VirtualizedMessageList instead
```

---

## Error Handling

### ✅ Do: Handle Errors Gracefully

```tsx
// ✅ Good: Proper error handling
const { messages, append, isLoading, error } = useClarityChat({
  api: '/api/chat',
})

if (error) {
  return <ErrorDisplay error={error} onRetry={handleRetry} />
}

return <ChatWindow {...props} />
```

### ❌ Don't: Ignore Errors

```tsx
// ❌ Bad: No error handling
const { messages } = useClarityChat({
  api: '/api/chat',
})

return <ChatWindow messages={messages} {...props} />
// What if there's an error?
```

---

## TypeScript

### ✅ Do: Use Proper Types

```tsx
// ✅ Good: Proper typing
import type { Message } from '@clarity-chat/types'

const messages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello',
    createdAt: Date.now(),
    status: 'sent',
  },
]
```

### ❌ Don't: Use `any`

```tsx
// ❌ Bad: Using any
const messages: any[] = [...]
// Loses type safety
```

---

## State Management

### ✅ Do: Use Hook State

```tsx
// ✅ Good: Let hooks manage state
const { messages, append } = useClarityChat({
  api: '/api/chat',
})
// Hook manages messages state
```

### ❌ Don't: Duplicate State

```tsx
// ❌ Bad: Duplicating state
const { messages } = useClarityChat({ api: '/api/chat' })
const [localMessages, setLocalMessages] = useState(messages)
// Unnecessary duplication
```

---

## API Integration

### ✅ Do: Use Proper SSE Format

```tsx
// ✅ Good: Correct SSE format
// Server-side
res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
```

### ❌ Don't: Use Wrong Format

```tsx
// ❌ Bad: Wrong format
res.write(chunk)  // Missing SSE format
```

---

## Accessibility

### ✅ Do: Use Semantic HTML

```tsx
// ✅ Good: Components handle accessibility
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  // Accessibility built-in
/>
```

### ❌ Don't: Skip Accessibility

```tsx
// ❌ Bad: Custom components without a11y
<div onClick={handleSend}>
  {/* Missing keyboard support, ARIA labels, etc. */}
</div>
```

---

## Theming

### ✅ Do: Use Theme Provider

```tsx
// ✅ Good: Use ThemeProvider
import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider theme={customTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### ❌ Don't: Override Styles Directly

```tsx
// ❌ Bad: Direct style overrides
<ChatWindow
  style={{ backgroundColor: 'red' }}
  // Better: Use theme system
/>
```

---

## Testing

### ✅ Do: Test User Interactions

```tsx
// ✅ Good: Test interactions
test('sends message on submit', async () => {
  const { getByPlaceholderText, getByText } = render(<App />)
  const input = getByPlaceholderText('Type a message...')
  fireEvent.change(input, { target: { value: 'Hello' } })
  fireEvent.click(getByText('Send'))
  await waitFor(() => {
    expect(getByText('Hello')).toBeInTheDocument()
  })
})
```

### ❌ Don't: Only Test Rendering

```tsx
// ❌ Bad: Only testing rendering
test('renders ChatWindow', () => {
  render(<ChatWindow messages={[]} />)
  // Not testing actual functionality
})
```

---

## Security

### ✅ Do: Validate Input

```tsx
// ✅ Good: Validate input
const handleSend = async (content: string) => {
  if (!content.trim()) return
  if (content.length > 10000) {
    throw new Error('Message too long')
  }
  await append({ role: 'user', content })
}
```

### ❌ Don't: Trust User Input

```tsx
// ❌ Bad: No validation
const handleSend = async (content: string) => {
  await append({ role: 'user', content })
  // No validation!
}
```

---

## Common Patterns

### Pattern 1: Production Chat

```tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

function ProductionChat() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      showTokenCounter={true}
    />
  )
}
```

### Pattern 2: Custom Layout

```tsx
import { MessageList, ChatInput } from '@clarity-chat/react'

function CustomLayout() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div className="custom-layout">
      <CustomHeader />
      <MessageList messages={messages} />
      <ChatInput
        onSend={async (content) => {
          await append({ role: 'user', content })
        }}
        disabled={isLoading}
      />
    </div>
  )
}
```

---

## Performance Tips

1. **Use Virtualization** - For lists with 100+ messages
2. **Memoize Callbacks** - Prevent unnecessary re-renders
3. **Lazy Load** - Load components on demand
4. **Optimize Imports** - Import only what you need

---

## Accessibility Tips

1. **Keyboard Navigation** - All components support keyboard
2. **Screen Readers** - ARIA labels included
3. **Focus Management** - Proper focus handling
4. **Color Contrast** - WCAG AAA compliant

---

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](../apps/examples/README.md) - 35+ production-ready examples
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Architecture](./architecture.md) - System design overview

---

**Last Updated:** December 2025
