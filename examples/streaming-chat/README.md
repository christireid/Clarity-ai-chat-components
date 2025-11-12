# Streaming Chat Demo

Next.js application demonstrating real-time streaming responses with Server-Sent Events (SSE), including stream cancellation and progress tracking.

## Features

✅ **Real-Time Streaming** - See AI responses character by character  
✅ **SSE Integration** - Server-Sent Events for streaming  
✅ **Stream Cancellation** - Stop generation mid-stream  
✅ **Auto-Scroll** - Messages automatically scroll as they stream  
✅ **Token Tracking** - Monitor token usage in real-time  
✅ **Network Status** - Connection monitoring  
✅ **Error Boundary** - Graceful error handling  
✅ **Progress Indicator** - Visual feedback during streaming  
✅ **TypeScript** - Full type safety  
✅ **Next.js 14** - App router with React Server Components  

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

### Tech Stack
- **Next.js 14** - App router, React Server Components
- **TypeScript** - Type safety
- **Clarity Chat Components** - UI components and hooks
- **Fetch API** - Streaming responses
- **AbortController** - Request cancellation

### File Structure

```
streaming-chat/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main chat page (client component)
│   │   ├── layout.tsx         # Root layout
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts   # Streaming API endpoint
├── package.json
└── README.md
```

## Key Concepts

### 1. Server-Sent Events (SSE)

Streams data from server to client in real-time:

```typescript
// Client side - Reading stream
const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const chunk = decoder.decode(value, { stream: true })
  // Process chunk...
}
```

### 2. Message Status States

Messages have dynamic status during streaming:

```typescript
type MessageStatus = 'sending' | 'sent' | 'error'

// Creating message
{ status: 'sending' } // While streaming

// Stream complete
{ status: 'sent' }    // Success

// Error occurred
{ status: 'error' }   // Failed
```

### 3. Stream Cancellation

Use AbortController to cancel ongoing requests:

```typescript
const abortController = new AbortController()

fetch('/api/chat', { 
  signal: abortController.signal 
})

// Later...
abortController.abort() // Cancels request
```

### 4. Incremental Updates

Update message content as chunks arrive:

```typescript
let accumulatedContent = ''

// For each chunk
accumulatedContent += parsed.content

setMessages(prev =>
  prev.map(msg =>
    msg.id === streamingMsgId
      ? { ...msg, content: accumulatedContent }
      : msg
  )
)
```

### 5. Auto-Scroll During Stream

Messages auto-scroll as content streams in:

```typescript
const { scrollRef } = useAutoScroll({
  dependencies: [messages], // Re-scrolls on every update
})

<div ref={scrollRef}>
  <ChatWindow messages={messages} />
</div>
```

## Implementation Details

### Client Side (page.tsx)

**State Management:**
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [isStreaming, setIsStreaming] = useState(false)
const abortControllerRef = useRef<AbortController | null>(null)
```

**Sending Message:**
```typescript
const handleSendMessage = async (content: string) => {
  // 1. Add user message
  const userMessage = { /* ... */ }
  setMessages(prev => [...prev, userMessage])
  
  // 2. Create streaming assistant message
  const assistantMessage = { 
    content: '', 
    status: 'sending' 
  }
  setMessages(prev => [...prev, assistantMessage])
  
  // 3. Stream response
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
    signal: abortController.signal,
  })
  
  // 4. Read stream
  const reader = response.body?.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    // Update message incrementally
    accumulatedContent += chunk
    setMessages(prev => prev.map(/* update */))
  }
  
  // 5. Mark complete
  setMessages(prev => prev.map(msg => 
    msg.id === assistantMessage.id
      ? { ...msg, status: 'sent' }
      : msg
  ))
}
```

**Cancelling Stream:**
```typescript
const handleCancel = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()
    setIsStreaming(false)
  }
}
```

### Server Side (api/chat/route.ts)

**Streaming Response:**
```typescript
export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Create readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Simulate streaming
      const response = "Your AI response here"
      const words = response.split(' ')
      
      for (const word of words) {
        // Send SSE formatted chunk
        const chunk = `data: ${JSON.stringify({ 
          content: word + ' ' 
        })}\n\n`
        
        controller.enqueue(
          new TextEncoder().encode(chunk)
        )
        
        await new Promise(r => setTimeout(r, 50))
      }
      
      // Signal completion
      controller.enqueue(
        new TextEncoder().encode('data: [DONE]\n\n')
      )
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
```

## Usage Patterns

### Basic Streaming Chat

```typescript
import { ChatWindow, useAutoScroll } from '@clarity-chat/react'

function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, userMessage])
    
    // Create streaming message
    const streamMsg = { content: '', status: 'sending' }
    setMessages(prev => [...prev, streamMsg])
    
    // Stream response
    const response = await fetch('/api/chat', { /* ... */ })
    const reader = response.body?.getReader()
    
    let accumulated = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      accumulated += decoder.decode(value)
      setMessages(prev => prev.map(msg =>
        msg.id === streamMsg.id
          ? { ...msg, content: accumulated }
          : msg
      ))
    }
    
    // Mark complete
    setMessages(prev => prev.map(msg =>
      msg.id === streamMsg.id
        ? { ...msg, status: 'sent' }
        : msg
    ))
  }
  
  return (
    <div ref={scrollRef}>
      <ChatWindow 
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
```

### With Cancellation

```typescript
const abortControllerRef = useRef<AbortController | null>(null)
const [isStreaming, setIsStreaming] = useState(false)

const handleSendMessage = async (content: string) => {
  abortControllerRef.current = new AbortController()
  setIsStreaming(true)
  
  try {
    const response = await fetch('/api/chat', {
      signal: abortControllerRef.current.signal,
    })
    
    // Stream handling...
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Cancelled by user')
    }
  } finally {
    setIsStreaming(false)
    abortControllerRef.current = null
  }
}

const handleCancel = () => {
  abortControllerRef.current?.abort()
}

// UI
{isStreaming && (
  <Button onClick={handleCancel}>Stop Generation</Button>
)}
```

### With Token Tracking

```typescript
const { tokens, addMessage } = useTokenTracker({
  modelName: 'gpt-3.5-turbo'
})

const handleSendMessage = async (content: string) => {
  // Track user message
  addMessage({ role: 'user', content })
  
  // ... streaming ...
  
  // Track assistant message
  addMessage({ role: 'assistant', content: accumulatedContent })
}

<TokenCounter 
  currentTokens={tokens}
  maxTokens={16000}
/>
```

## Customization

### Change Streaming Speed

Adjust delay in API route:

```typescript
// Fast streaming (10ms per chunk)
await new Promise(r => setTimeout(r, 10))

// Slow streaming (100ms per chunk)
await new Promise(r => setTimeout(r, 100))

// Realistic (30-50ms per chunk)
await new Promise(r => setTimeout(r, 30 + Math.random() * 20))
```

### Integrate Real AI API

Replace simulated API with OpenAI:

```typescript
import OpenAI from 'openai'

export async function POST(req: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { messages } = await req.json()
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    stream: true,
  })
  
  const encoder = new TextEncoder()
  
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          
          if (content) {
            const data = `data: ${JSON.stringify({ content })}\n\n`
            controller.enqueue(encoder.encode(data))
          }
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      }
    }
  )
}
```

### Add Markdown Rendering

Use MarkdownRenderer for formatted responses:

```typescript
import { MarkdownRenderer } from '@clarity-chat/react'

// In Message component
<MarkdownRenderer content={message.content} />
```

### Error Recovery

Handle network errors gracefully:

```typescript
try {
  // Streaming...
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled
    setMessages(prev => 
      prev.filter(msg => msg.id !== streamMsg.id)
    )
  } else {
    // Network or other error
    setMessages(prev => prev.map(msg =>
      msg.id === streamMsg.id
        ? { 
            ...msg, 
            content: 'Error: ' + error.message,
            status: 'error'
          }
        : msg
    ))
  }
}
```

## Best Practices

1. **Always Clean Up** - Abort requests on unmount
2. **Show Progress** - Visual indicator during streaming
3. **Enable Cancellation** - Allow users to stop generation
4. **Handle Errors** - Network issues, timeouts, etc.
5. **Optimize Updates** - Don't re-render entire list
6. **Track Tokens** - Monitor usage for cost control
7. **Auto-Scroll** - Keep latest content visible
8. **Type Everything** - Full TypeScript coverage

## Troubleshooting

### Stream not working
- Check Content-Type is `text/event-stream`
- Ensure chunks are SSE formatted: `data: {...}\n\n`
- Verify no buffering middleware

### Auto-scroll issues
- Confirm scrollRef attached to scrollable container
- Ensure messages array in dependencies
- Check overflow-auto on container

### Cancellation not working
- Verify AbortController passed to fetch
- Check signal reference not lost
- Ensure abort() called correctly

### Type errors
- Use Message type from @clarity-chat/types
- Include all required fields (chatId, status, etc.)
- Status must be 'sending' | 'sent' | 'error'

## Performance Tips

1. **Debounce Updates** - Update UI every N chunks, not every chunk
2. **Virtual Scrolling** - Use VirtualizedMessageList for long chats
3. **Memoization** - Memoize expensive computations
4. **Lazy Loading** - Load old messages on demand
5. **Web Workers** - Process chunks in background

## Next Steps

To learn more:
- Try [AI Assistant](../ai-assistant) for optimistic updates
- Check [Enterprise Knowledge Hub](../enterprise-knowledge-hub) for RAG
- Explore [Complete Features Demo](../complete-features-demo) for all features

## License

MIT - see repository root for details
