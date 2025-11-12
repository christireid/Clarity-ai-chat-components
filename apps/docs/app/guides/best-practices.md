# Best Practices Guide

This guide outlines best practices for using Clarity Chat components effectively.

---

## Component Usage

### 1. Always Use Controlled Components

**✅ Good:**
```tsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**❌ Bad:**
```tsx
<Input defaultValue="initial" /> // Uncontrolled
```

### 2. Provide Proper Error Handling

**✅ Good:**
```tsx
const [error, setError] = useState('')

const handleSubmit = async () => {
  try {
    await submitForm()
  } catch (err) {
    setError(err.message)
  }
}

<Input error={error} />
```

**❌ Bad:**
```tsx
const handleSubmit = async () => {
  await submitForm() // No error handling
}
```

### 3. Use Loading States

**✅ Good:**
```tsx
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submit()
  } finally {
    setLoading(false)
  }
}

<Button loading={loading}>Submit</Button>
```

**❌ Bad:**
```tsx
const handleSubmit = async () => {
  await submit() // No loading state
}
```

---

## Performance

### 1. Memoize Expensive Components

**✅ Good:**
```tsx
const MessageList = React.memo(({ messages }) => {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
})
```

**❌ Bad:**
```tsx
function MessageList({ messages }) {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
} // Re-renders on every parent update
```

### 2. Use useCallback for Event Handlers

**✅ Good:**
```tsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies])
```

**❌ Bad:**
```tsx
const handleClick = () => {
  // Handler logic
} // New function on every render
```

### 3. Optimize Re-renders

**✅ Good:**
```tsx
const MemoizedMessage = React.memo(Message, (prev, next) => {
  return prev.message.id === next.message.id &&
         prev.message.content === next.message.content
})
```

---

## Accessibility

### 1. Always Provide Labels

**✅ Good:**
```tsx
<Input
  aria-label="Email address"
  placeholder="Enter email"
  type="email"
/>
```

**❌ Bad:**
```tsx
<Input placeholder="Enter email" /> // No label
```

### 2. Use Semantic HTML

**✅ Good:**
```tsx
<Button aria-label="Send message">
  <SendIcon />
</Button>
```

**❌ Bad:**
```tsx
<div onClick={handleClick}>Send</div> // Not a button
```

### 3. Keyboard Navigation

**✅ Good:**
```tsx
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Click me
</Button>
```

---

## Styling

### 1. Use Design Tokens

**✅ Good:**
```tsx
<div className="rounded-lg border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
```

**❌ Bad:**
```tsx
<div className="rounded-xl border-2 border-gray-300 shadow-md">
```

### 2. Consistent Spacing

**✅ Good:**
```tsx
<div className="space-y-4">
  <Card />
  <Card />
</div>
```

**❌ Bad:**
```tsx
<div>
  <Card className="mb-4" />
  <Card className="mt-6" />
</div>
```

### 3. Use className Prop

**✅ Good:**
```tsx
<Button className="custom-class">Click</Button>
```

**❌ Bad:**
```tsx
<Button style={{ margin: '10px' }}>Click</Button>
```

---

## State Management

### 1. Lift State Up

**✅ Good:**
```tsx
function Parent() {
  const [value, setValue] = useState('')
  return <Child value={value} onChange={setValue} />
}
```

**❌ Bad:**
```tsx
function Child() {
  const [value, setValue] = useState('') // State in child
}
```

### 2. Use Proper State Updates

**✅ Good:**
```tsx
setMessages((prev) => [...prev, newMessage])
```

**❌ Bad:**
```tsx
messages.push(newMessage)
setMessages(messages) // Mutation
```

### 3. Avoid Unnecessary State

**✅ Good:**
```tsx
const isDisabled = !value || loading
```

**❌ Bad:**
```tsx
const [isDisabled, setIsDisabled] = useState(false)
useEffect(() => {
  setIsDisabled(!value || loading)
}, [value, loading])
```

---

## Error Handling

### 1. Provide User Feedback

**✅ Good:**
```tsx
try {
  await submit()
  toast({ title: 'Success', variant: 'success' })
} catch (error) {
  toast({ title: 'Error', description: error.message, variant: 'error' })
}
```

**❌ Bad:**
```tsx
try {
  await submit()
} catch (error) {
  console.error(error) // No user feedback
}
```

### 2. Use Error Boundaries

**✅ Good:**
```tsx
<ErrorBoundary fallback={ErrorFallback}>
  <App />
</ErrorBoundary>
```

**❌ Bad:**
```tsx
<App /> // No error boundary
```

### 3. Validate Input

**✅ Good:**
```tsx
const validate = (value: string) => {
  if (!value) return 'Required'
  if (value.length < 3) return 'Too short'
  return ''
}
```

---

## TypeScript

### 1. Use Proper Types

**✅ Good:**
```tsx
import type { Message } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  role: 'user',
  content: 'Hello',
}
```

**❌ Bad:**
```tsx
const message: any = {
  id: '1',
  role: 'user',
}
```

### 2. Type Props

**✅ Good:**
```tsx
interface Props {
  message: Message
  onSend: (content: string) => void
}
```

**❌ Bad:**
```tsx
function Component(props: any) {
  // No types
}
```

### 3. Use Type Guards

**✅ Good:**
```tsx
function isMessage(obj: unknown): obj is Message {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

---

## Testing

### 1. Test User Interactions

**✅ Good:**
```tsx
const { getByRole } = render(<Button>Click</Button>)
fireEvent.click(getByRole('button'))
expect(onClick).toHaveBeenCalled()
```

### 2. Test Accessibility

**✅ Good:**
```tsx
expect(getByRole('button')).toHaveAccessibleName('Submit')
```

### 3. Test Edge Cases

**✅ Good:**
```tsx
test('handles empty input', () => {
  render(<Input value="" />)
  // Test empty state
})
```

---

## Security

### 1. Sanitize User Input

**✅ Good:**
```tsx
const sanitized = DOMPurify.sanitize(userInput)
```

**❌ Bad:**
```tsx
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. Validate on Server

**✅ Good:**
```tsx
// Client validation
if (!isValid(value)) return

// Server validation
await api.validate(value)
```

### 3. Use HTTPS

**✅ Good:**
```tsx
const apiUrl = 'https://api.example.com'
```

---

## Common Mistakes

### 1. Missing Keys in Lists

**❌ Bad:**
```tsx
{messages.map((msg) => <Message message={msg} />)}
```

**✅ Good:**
```tsx
{messages.map((msg) => <Message key={msg.id} message={msg} />)}
```

### 2. Incorrect Event Handlers

**❌ Bad:**
```tsx
<Button onClick={handleClick()}>Click</Button> // Calls immediately
```

**✅ Good:**
```tsx
<Button onClick={handleClick}>Click</Button>
```

### 3. Stale Closures

**❌ Bad:**
```tsx
useEffect(() => {
  setTimeout(() => {
    console.log(count) // Stale value
  }, 1000)
}, [])
```

**✅ Good:**
```tsx
useEffect(() => {
  setTimeout(() => {
    console.log(count) // Current value
  }, 1000)
}, [count])
```

---

## Summary

1. **Always use controlled components** for predictable behavior
2. **Provide proper error handling** for better UX
3. **Use loading states** to show progress
4. **Optimize performance** with memoization
5. **Ensure accessibility** with proper labels and semantic HTML
6. **Follow design tokens** for consistency
7. **Handle errors gracefully** with user feedback
8. **Use TypeScript** for type safety
9. **Test thoroughly** including edge cases
10. **Sanitize input** for security

Following these best practices will help you build robust, accessible, and performant applications with Clarity Chat components.
