# Usage Examples Guide

This guide provides comprehensive usage examples for common scenarios with Clarity Chat components.

---

## Basic Chat Interface

### Simple Chat Window

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    setIsLoading(true)
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add assistant response
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'This is a response',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  )
}
```

---

## Custom Message Display

### Custom Message Component

```tsx
import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function CustomMessageList({ messages }: { messages: MessageType[] }) {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast notification
  }

  const handleFeedback = (type: 'up' | 'down') => {
    // Send feedback to API
    console.log('Feedback:', type)
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onCopy={handleCopy}
          onFeedback={handleFeedback}
          showAvatar
          showTimestamp
        />
      ))}
    </div>
  )
}
```

---

## Form with Validation

### Form with Input Validation

```tsx
import { Input, Button, ErrorMessage } from '@clarity-chat/primitives'
import { useState } from 'react'

function ContactForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setError('Email is required')
      return false
    }
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email address')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateEmail(email)) {
      // Submit form
      console.log('Email:', email)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) validateEmail(e.target.value)
          }}
          onBlur={() => validateEmail(email)}
          placeholder="Enter your email"
          variant={error ? 'error' : 'default'}
        />
        <ErrorMessage error={error} />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

---

## Token Management

### Token Counter with Warnings

```tsx
import { TokenCounter } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function TokenAwareChat() {
  const [tokens, setTokens] = useState(0)
  const [message, setMessage] = useState('')

  // Simulate token counting
  useEffect(() => {
    const estimatedTokens = Math.ceil(message.length / 4)
    setTokens(estimatedTokens)
  }, [message])

  return (
    <div className="space-y-4">
      <TokenCounter
        tokens={tokens}
        limit={2000}
        warningThreshold={0.8}
        showCost
        costPerToken={0.0001}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
    </div>
  )
}
```

---

## File Upload

### File Upload with Preview

```tsx
import { FileUpload } from '@clarity-chat/react'
import { useState } from 'react'

function FileUploadExample() {
  const [files, setFiles] = useState<File[]>([])

  const handleUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  return (
    <div className="space-y-4">
      <FileUpload
        onUpload={handleUpload}
        accept="image/*,application/pdf"
        maxSize={5 * 1024 * 1024} // 5MB
        multiple
      />
      {files.length > 0 && (
        <div className="space-y-2">
          <h3>Uploaded Files:</h3>
          {files.map((file, index) => (
            <div key={index} className="text-sm">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Command Palette

### Command Palette Integration

```tsx
import { CommandPalette } from '@clarity-chat/react'
import { useState } from 'react'

function AppWithCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: <PlusIcon />,
      shortcut: 'Ctrl+N',
      group: 'Actions',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      shortcut: 'Ctrl+,',
      group: 'Actions',
    },
    {
      id: 'search',
      label: 'Search',
      icon: <SearchIcon />,
      shortcut: 'Ctrl+K',
      group: 'Navigation',
    },
  ]

  const handleSelect = (command: typeof commands[0]) => {
    console.log('Selected:', command.id)
    setIsOpen(false)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Command Palette</button>
      <CommandPalette
        open={isOpen}
        onOpenChange={setIsOpen}
        commands={commands}
        onSelect={handleSelect}
      />
    </>
  )
}
```

---

## Toast Notifications

### Toast System Integration

```tsx
import { useToast, ToastProvider } from '@clarity-chat/react'

function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  )
}

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Message sent successfully',
      variant: 'success',
    })
  }

  const handleError = () => {
    toast({
      title: 'Error',
      description: 'Failed to send message',
      variant: 'error',
    })
  }

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  )
}
```

---

## Theme Switching

### Theme Switcher Integration

```tsx
import { ThemeSwitcher } from '@clarity-chat/react'

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <ThemeSwitcher variant="toggle" />
    </header>
  )
}
```

---

## Error Handling

### Error Boundary Setup

```tsx
import { ErrorBoundary } from '@clarity-chat/react'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-destructive rounded-lg">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      fallback={ErrorFallback}
      onError={(error) => {
        // Log to error tracking service
        console.error('Error caught:', error)
      }}
    >
      <MyApp />
    </ErrorBoundary>
  )
}
```

---

## Streaming Messages

### Streaming Message Display

```tsx
import { StreamingMessage } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function StreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const startStreaming = async () => {
    setIsStreaming(true)
    setContent('')

    // Simulate streaming
    const words = ['Hello', 'world', 'this', 'is', 'streaming']
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setContent((prev) => prev + (prev ? ' ' : '') + word)
    }

    setIsStreaming(false)
  }

  return (
    <div>
      <button onClick={startStreaming}>Start Streaming</button>
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
        onComplete={() => console.log('Streaming complete')}
      />
    </div>
  )
}
```

---

## Advanced: Custom Chat Input

### Custom Chat Input with Features

```tsx
import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function AdvancedChatInput() {
  const [message, setMessage] = useState('')

  const handleSubmit = async (content: string) => {
    // Send message to API
    console.log('Sending:', content)
    setMessage('')
  }

  return (
    <ChatInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSubmit}
      maxLength={500}
      showCharCounter
      warningThreshold={0.8}
      animateHeight
      glowOnFocus
      placeholder="Type your message..."
    />
  )
}
```

---

## Best Practices

### 1. Always Provide Error Handling

```tsx
try {
  await handleSend(message)
} catch (error) {
  toast({
    title: 'Error',
    description: 'Failed to send message',
    variant: 'error',
  })
}
```

### 2. Use Loading States

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (content: string) => {
  setIsLoading(true)
  try {
    await sendMessage(content)
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Optimize Re-renders

```tsx
// Use React.memo for expensive components
const MessageList = React.memo(({ messages }) => {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
})
```

### 4. Handle Empty States

```tsx
{messages.length === 0 ? (
  <EmptyState message="No messages yet" />
) : (
  <MessageList messages={messages} />
)}
```

### 5. Accessibility

```tsx
// Always provide labels
<Input
  aria-label="Email address"
  placeholder="Enter email"
  type="email"
/>

// Use proper ARIA attributes
<Button aria-label="Send message" onClick={handleSend}>
  <SendIcon />
</Button>
```

---

## Common Patterns

### Pattern 1: Controlled Input

```tsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Pattern 2: Form Validation

```tsx
const [error, setError] = useState('')

const validate = (value: string) => {
  if (!value) {
    setError('Required')
    return false
  }
  setError('')
  return true
}
```

### Pattern 3: Async Operations

```tsx
const [loading, setLoading] = useState(false)

const handleAsync = async () => {
  setLoading(true)
  try {
    await asyncOperation()
  } finally {
    setLoading(false)
  }
}
```

---

## Troubleshooting

### Issue: Messages not updating

**Solution**: Ensure you're using controlled components properly:

```tsx
// ✅ Correct
const [messages, setMessages] = useState([])
setMessages((prev) => [...prev, newMessage])

// ❌ Incorrect
messages.push(newMessage) // This won't trigger re-render
```

### Issue: Styling conflicts

**Solution**: Use className prop for custom styling:

```tsx
<Button className="custom-class">Click</Button>
```

### Issue: TypeScript errors

**Solution**: Import types correctly:

```tsx
import type { Message } from '@clarity-chat/types'
import type { ChatInputProps } from '@clarity-chat/react'
```

---

## Additional Resources

- [API Documentation](./api/primitives.md)
- [Integration Guide](./integration-guide.md)
- [Design System Guide](../../DESIGN_SYSTEM_GUIDE.md)
