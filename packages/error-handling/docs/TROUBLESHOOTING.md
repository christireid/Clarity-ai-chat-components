# Troubleshooting Guide

Solutions and debugging tips for common Clarity Chat errors.

## Quick Reference

| Error Code | Error Type | Quick Fix |
|------------|------------|-----------|
| `MISSING_API_ENDPOINT` | Configuration | Add `apiEndpoint` prop |
| `INVALID_MODEL` | Configuration | Use supported model name |
| `MISSING_API_KEY` | Configuration | Add `apiKey` prop or env var |
| `API_REQUEST_FAILED` | API | Check endpoint and server logs |
| `INVALID_API_RESPONSE` | API | Verify response format |
| `SERVER_ERROR` | API | Check server status |
| `INVALID_API_KEY` | Authentication | Verify API key is correct |
| `INSUFFICIENT_PERMISSIONS` | Authentication | Check API key permissions |
| `RATE_LIMIT_EXCEEDED` | Rate Limit | Wait before retry |
| `QUOTA_EXCEEDED` | Rate Limit | Upgrade plan or wait |
| `INVALID_INPUT` | Validation | Check input format |
| `REQUIRED_FIELD_MISSING` | Validation | Provide required field |
| `VALUE_TOO_LONG` | Validation | Reduce input length |
| `STREAM_CONNECTION_LOST` | Stream | Connection will auto-retry |
| `STREAM_MALFORMED_DATA` | Stream | Check server stream format |
| `MESSAGE_TOO_LONG` | Token Limit | Reduce message length |
| `CONTEXT_TOO_LONG` | Token Limit | Clear conversation history |
| `CONNECTION_FAILED` | Network | Check internet connection |
| `REQUEST_TIMEOUT` | Timeout | Increase timeout or check network |

## Configuration Errors

### MISSING_API_ENDPOINT

**Problem:** No API endpoint configured

**Solution:**
```tsx
<ChatContainer apiEndpoint="/api/chat" />
```

**Details:**
The `apiEndpoint` prop is required to specify where chat requests should be sent.

---

### INVALID_MODEL

**Problem:** Specified model is not supported

**Solution:**
```tsx
// Use a supported model
<ChatContainer model="gpt-4" />

// Valid models: gpt-3.5-turbo, gpt-4, claude-2, etc.
```

**Details:**
Check your AI provider's documentation for available models.

---

### MISSING_API_KEY

**Problem:** No API key provided

**Solution:**

Option 1 - Props:
```tsx
<ChatContainer apiKey={process.env.REACT_APP_API_KEY} />
```

Option 2 - Environment variable:
```env
CLARITY_API_KEY=your-api-key-here
```

**Details:**
API keys should never be committed to version control. Use environment variables.

---

### INVALID_CONFIGURATION

**Problem:** Configuration value has wrong type

**Solution:**
```tsx
// ❌ Wrong
<ChatContainer maxTokens="100" />

// ✅ Correct
<ChatContainer maxTokens={100} />
```

**Details:**
Check the TypeScript types for correct prop types.

---

### MISSING_REQUIRED_PROP

**Problem:** Required component prop is missing

**Solution:**
```tsx
// Check component documentation for required props
<ChatContainer
  apiEndpoint="/api/chat"  // Required
  apiKey={apiKey}           // Required
/>
```

## API Errors

### API_REQUEST_FAILED

**Problem:** HTTP request to API failed

**Possible Causes:**
- Server is down
- Endpoint URL is incorrect
- Network connectivity issues
- CORS configuration

**Solution Steps:**

1. Check endpoint URL:
```tsx
// Make sure endpoint is correct
<ChatContainer apiEndpoint="/api/chat" />
```

2. Verify server is running:
```bash
curl http://localhost:3000/api/chat
```

3. Check server logs for errors

4. Verify CORS configuration:
```javascript
// Express example
app.use(cors({
  origin: 'http://localhost:3000'
}))
```

---

### INVALID_API_RESPONSE

**Problem:** API returned unexpected format

**Expected Format:**
```json
{
  "content": "Response message",
  "role": "assistant"
}
```

**Solution:**
Ensure your API endpoint returns the correct format:

```javascript
// Express example
app.post('/api/chat', (req, res) => {
  res.json({
    content: "Hello!",
    role: "assistant"
  })
})
```

---

### SERVER_ERROR

**Problem:** Server returned 500+ status code

**Solution Steps:**

1. Check server logs for error details
2. Verify database connections
3. Check for unhandled exceptions
4. Ensure all dependencies are available

**Debugging:**
```javascript
try {
  // Your server code
} catch (error) {
  console.error('Server error:', error)
  res.status(500).json({ error: error.message })
}
```

## Authentication Errors

### INVALID_API_KEY

**Problem:** API key is invalid or expired

**Solution:**

1. Generate new API key
2. Update environment variables
3. Restart application

```env
CLARITY_API_KEY=new-api-key-here
```

**Debugging:**
```bash
# Test API key
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com
```

---

### INSUFFICIENT_PERMISSIONS

**Problem:** API key lacks required permissions

**Solution:**

1. Check API key permissions in dashboard
2. Ensure key has required scopes
3. Generate new key with correct permissions

**Required Permissions:**
- `chat:read`
- `chat:write`
- `messages:create`

## Rate Limit Errors

### RATE_LIMIT_EXCEEDED

**Problem:** Too many requests in short time

**Solution:**

Use automatic retry with backoff:
```tsx
const { executeAsync } = useAsyncError()

await executeAsync(apiCall, {
  maxRetries: 3,
  retryDelay: 2000  // Wait 2 seconds between retries
})
```

**Manual handling:**
```tsx
if (error instanceof RateLimitError) {
  const waitTime = error.retryAfter || 60
  console.log(`Rate limited. Retry after ${waitTime} seconds`)
  
  setTimeout(() => {
    // Retry request
  }, waitTime * 1000)
}
```

---

### QUOTA_EXCEEDED

**Problem:** API quota limit reached

**Solution:**

1. Check current usage in dashboard
2. Wait for quota reset (usually monthly)
3. Upgrade to higher tier plan
4. Implement request caching

**Prevent quota issues:**
```tsx
// Cache responses
const cache = new Map()

const getCachedResponse = async (message) => {
  if (cache.has(message)) {
    return cache.get(message)
  }
  
  const response = await fetchResponse(message)
  cache.set(message, response)
  return response
}
```

## Validation Errors

### INVALID_INPUT

**Problem:** Input doesn't match expected format

**Solution:**

Validate input before sending:
```tsx
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    throw createValidationError.invalidFormat('email', 'email format')
  }
}
```

---

### REQUIRED_FIELD_MISSING

**Problem:** Required field not provided

**Solution:**
```tsx
const sendMessage = (message: string) => {
  if (!message || message.trim() === '') {
    throw createValidationError.requiredField('message')
  }
  
  // Send message
}
```

---

### VALUE_TOO_LONG

**Problem:** Input exceeds maximum length

**Solution:**

Truncate or validate length:
```tsx
const MAX_LENGTH = 1000

const validateLength = (text: string) => {
  if (text.length > MAX_LENGTH) {
    throw createValidationError.valueTooLong('message', MAX_LENGTH, text.length)
  }
}
```

## Stream Errors

### STREAM_CONNECTION_LOST

**Problem:** Streaming connection interrupted

**Solution:**

Connection will automatically retry. Handle gracefully:
```tsx
const { executeAsync } = useAsyncError()

await executeAsync(
  async () => await streamResponse(),
  { 
    maxRetries: 5,
    retryDelay: 1000 
  }
)
```

---

### STREAM_MALFORMED_DATA

**Problem:** Server sent invalid stream data

**Expected Format:**
```
data: {"content": "token", "done": false}

data: {"content": "", "done": true}

```

**Solution:**

Verify server stream format:
```javascript
// Server-side (Express)
res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Connection', 'keep-alive')

// Send properly formatted data
res.write(`data: ${JSON.stringify({ content: "Hello", done: false })}\n\n`)
```

## Token Limit Errors

### MESSAGE_TOO_LONG

**Problem:** Message exceeds token limit

**Solution:**

1. Reduce message length
2. Split into multiple messages
3. Use summarization

```tsx
const MAX_TOKENS = 4096

const truncateMessage = (message: string) => {
  // Simple character-based truncation
  // In production, use proper tokenizer
  const maxChars = MAX_TOKENS * 4  // Rough estimate
  return message.slice(0, maxChars)
}
```

---

### CONTEXT_TOO_LONG

**Problem:** Conversation history too long

**Solution:**

Clear older messages:
```tsx
const [messages, setMessages] = useState<Message[]>([])

const trimHistory = () => {
  // Keep only last 10 messages
  setMessages(prev => prev.slice(-10))
}
```

## Network Errors

### CONNECTION_FAILED

**Problem:** Cannot connect to server

**Solution Steps:**

1. Check internet connection
2. Verify server is running
3. Check firewall settings
4. Verify URL is correct

**Debugging:**
```bash
# Test connectivity
ping api.example.com

# Test endpoint
curl https://api.example.com/api/chat
```

---

### REQUEST_TIMEOUT

**Problem:** Request took too long

**Solution:**

Increase timeout:
```tsx
const { executeAsync } = useAsyncError()

await executeAsync(
  async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)  // 30 seconds
    
    try {
      const response = await fetch('/api/chat', {
        signal: controller.signal
      })
      return response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  },
  { maxRetries: 2 }
)
```

## Debugging Techniques

### 1. Enable Development Logging

```tsx
const { handleError } = useErrorHandler({
  logErrors: true
})
```

### 2. Check Error Details

```tsx
try {
  // Your code
} catch (error) {
  if (error instanceof ClarityChatError) {
    console.log('Error code:', error.code)
    console.log('Solution:', error.solution)
    console.log('Context:', error.context)
  }
}
```

### 3. Use Browser DevTools

- Network tab: Check API requests
- Console: View error logs
- React DevTools: Inspect component state

### 4. Test in Isolation

```tsx
// Test API endpoint independently
const testEndpoint = async () => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'test' })
  })
  console.log('Response:', await response.json())
}
```

### 5. Check Environment Variables

```tsx
console.log('API Endpoint:', process.env.REACT_APP_API_ENDPOINT)
console.log('API Key:', process.env.REACT_APP_API_KEY ? '✅ Set' : '❌ Missing')
```

### 6. Enable Verbose Error Messages

```tsx
if (process.env.NODE_ENV === 'development') {
  Error.stackTraceLimit = Infinity
}
```

### 7. Use Error Boundaries

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Common Workflows

### Debugging API Issues

1. **Test endpoint directly:**
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

2. **Check network tab** in browser DevTools

3. **Add logging** to API handler:
   ```javascript
   app.post('/api/chat', (req, res) => {
     console.log('Request:', req.body)
     // Process request
     console.log('Response:', response)
     res.json(response)
   })
   ```

4. **Verify CORS** if frontend and backend on different ports

### Debugging State Issues

1. **Add logging** to state updates:
   ```tsx
   const [state, setState] = useState(initial)
   
   const updateState = (newState) => {
     console.log('Updating state:', newState)
     setState(newState)
   }
   ```

2. **Use React DevTools** to inspect component state

3. **Check for stale closures** in callbacks

### Debugging Performance Issues

1. **Use React Profiler:**
   ```tsx
   import { Profiler } from 'react'
   
   <Profiler id="Chat" onRender={(id, phase, actualDuration) => {
     console.log(`${id} ${phase} took ${actualDuration}ms`)
   }}>
     <ChatComponent />
   </Profiler>
   ```

2. **Check for unnecessary re-renders:**
   ```tsx
   // Use React.memo for expensive components
   const ExpensiveComponent = React.memo(({ data }) => {
     // Component code
   })
   ```

3. **Optimize heavy computations:**
   ```tsx
   const result = useMemo(() => {
     return expensiveComputation(data)
   }, [data])
   ```

## Getting Help

If you're still experiencing issues:

1. **Check documentation:**
   - [Error Handling Guide](./ERROR_HANDLING.md)
   - [API Reference](../README.md)

2. **Search existing issues:**
   - [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

3. **Ask the community:**
   - [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
   - [Discord Server](https://discord.gg/claritychat)

4. **Create a new issue:**
   - Provide error message and stack trace
   - Include minimal reproduction code
   - Describe expected vs actual behavior
   - List environment details (OS, Node version, etc.)
