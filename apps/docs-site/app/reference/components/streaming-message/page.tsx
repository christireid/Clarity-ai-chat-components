import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Streaming Message - Clarity Chat',
  description: 'A component for displaying AI responses with token-by-token streaming, tool calls, thinking steps, citations, and error handling.',
}

# Streaming Message

A specialized component for displaying AI assistant responses with real-time token-by-token streaming, tool call visualization, thinking steps (chain-of-thought), citations, and error states.

## Overview

The Streaming Message component provides a complete AI response display system with:

- **Token-by-token streaming** - Real-time content display with cursor
- **Partial JSON rendering** - Safely render incomplete JSON during streaming
- **Tool call visualization** - Display function/tool calls with approval workflow
- **Thinking steps** - Show chain-of-thought reasoning process
- **Citations display** - Source references with confidence scores
- **Error handling** - Graceful error state display
- **Smooth animations** - Framer Motion transitions for all elements

## Installation

The Streaming Message component is included in the Clarity Chat React package:

```bash
npm install @clarity-chat/react
```

## Basic Usage

```tsx
import { StreamingMessage } from '@clarity-chat/react'

function AIResponse() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      showThinking={true}
      showCitations={true}
      showTools={true}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | **Required** | Accumulated message content being streamed |
| `isStreaming` | `boolean` | `false` | Whether streaming is currently in progress |
| `toolCalls` | `ToolCall[]` | `[]` | Array of tool/function calls made during streaming |
| `citations` | `Citation[]` | `[]` | Array of source citations/references |
| `thinkingSteps` | `string[]` | `[]` | Completed thinking steps (chain-of-thought) |
| `currentThinkingStep` | `string` | `undefined` | Current thinking step being processed |
| `error` | `string` | `undefined` | Error message if streaming failed |
| `showThinking` | `boolean` | `true` | Display thinking steps section |
| `showCitations` | `boolean` | `true` | Display citations inline |
| `showTools` | `boolean` | `true` | Display tool calls |
| `onToolApprove` | `(toolCall: ToolCall) => void` | `undefined` | Callback when tool call is approved |
| `onToolReject` | `(toolCall: ToolCall) => void` | `undefined` | Callback when tool call is rejected |
| `className` | `string` | `undefined` | Additional CSS classes for the container |

## Features

### Token-by-Token Streaming

Display content as it streams in real-time with an animated cursor:

```tsx
function StreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const streamMessage = async () => {
    setIsStreaming(true)
    const fullText = "This is a simulated streaming response..."
    
    for (let i = 0; i < fullText.length; i++) {
      setContent(fullText.slice(0, i + 1))
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setIsStreaming(false)
  }

  return (
    <div>
      <button onClick={streamMessage}>Start Streaming</button>
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
      />
    </div>
  )
}
```

**Visual features:**
- Animated cursor (▋) appears at the end during streaming
- Smooth text appearance
- Respects whitespace and line breaks with `whitespace-pre-wrap`

### Partial JSON Rendering

Safely render incomplete JSON during streaming:

```tsx
function JSONStreamingExample() {
  const [jsonContent, setJsonContent] = useState('{"name": "John", "age"')
  
  return (
    <StreamingMessage
      content={jsonContent}
      isStreaming={true}
    />
  )
}
```

**How it works:**
- Attempts to parse the content as JSON
- Falls back to finding the last complete JSON object
- Displays parsed JSON in a formatted code block
- Shows remainder text below with streaming cursor
- Gracefully handles malformed JSON

**Example output:**
```json
{
  "name": "John",
  "age": 30
}
```
```
, "city": "New Y▋
```

### Tool Call Visualization

Display and manage function/tool calls with approval workflow:

```tsx
function ToolCallExample() {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([
    {
      id: 'call_1',
      type: 'function',
      function: {
        name: 'search_database',
        arguments: '{"query": "latest sales data", "limit": 10}'
      }
    }
  ])

  const handleApprove = (toolCall: ToolCall) => {
    console.log('Approved:', toolCall.function.name)
    // Execute the tool call
  }

  const handleReject = (toolCall: ToolCall) => {
    console.log('Rejected:', toolCall.function.name)
    // Cancel the tool call
  }

  return (
    <StreamingMessage
      content="I'll search the database for you..."
      toolCalls={toolCalls}
      showTools={true}
      onToolApprove={handleApprove}
      onToolReject={handleReject}
    />
  )
}
```

**Tool call features:**
- Function name prominently displayed
- Arguments shown in formatted JSON
- Optional approve/reject buttons
- Stagger animations for multiple tools
- Color-coded with purple theme

### Thinking Steps (Chain-of-Thought)

Display the AI's reasoning process:

```tsx
function ThinkingExample() {
  const [thinkingSteps, setThinkingSteps] = useState([
    'Analyzing the user question',
    'Searching knowledge base',
    'Found 3 relevant documents'
  ])
  const [currentStep, setCurrentStep] = useState('Synthesizing answer...')

  return (
    <StreamingMessage
      content=""
      thinkingSteps={thinkingSteps}
      currentThinkingStep={currentStep}
      showThinking={true}
    />
  )
}
```

**Thinking display features:**
- Completed steps shown with checkmark icons
- Current step with spinning loader
- Stagger animations (0.1s delay between steps)
- Blue theme to distinguish from content
- Collapsible section (future enhancement)

**Visual hierarchy:**
- ✅ Completed steps (green checkmark)
- ⟳ Current step (spinning indicator)

### Citations and Sources

Display source references with confidence scores:

```tsx
function CitationExample() {
  const [citations, setCitations] = useState<Citation[]>([
    {
      id: 'cite_1',
      source: 'Product Documentation v2.1',
      chunkText: 'The maximum upload size is 100MB per file...',
      confidence: 0.95
    },
    {
      id: 'cite_2',
      source: 'FAQ - File Uploads',
      chunkText: 'Supported formats include PDF, DOCX, TXT...',
      confidence: 0.87
    }
  ])

  return (
    <StreamingMessage
      content="Based on the documentation, the maximum file size is 100MB."
      citations={citations}
      showCitations={true}
    />
  )
}
```

**Citation features:**
- Source title with truncation
- Confidence score badge (percentage)
- Excerpt preview (2-line clamp)
- Book icon for visual clarity
- Stagger animations (0.05s delay)

### Error Handling

Display streaming errors gracefully:

```tsx
function ErrorExample() {
  const [error, setError] = useState<string>()

  const handleStream = async () => {
    try {
      // Streaming logic
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed')
    }
  }

  return (
    <StreamingMessage
      content=""
      error={error}
    />
  )
}
```

**Error display features:**
- Red theme for visibility
- Error icon (X in circle)
- Clear error message
- Scale animation for attention
- Doesn't hide partial content

## Advanced Examples

### Complete Streaming Pipeline

Full example with all features integrated:

```tsx
import { useState, useCallback } from 'react'
import { StreamingMessage } from '@clarity-chat/react'
import type { ToolCall, Citation } from '@clarity-chat/types'

function CompleteStreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])
  const [currentThinkingStep, setCurrentThinkingStep] = useState<string>()
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [citations, setCitations] = useState<Citation[]>([])
  const [error, setError] = useState<string>()

  const handleStream = useCallback(async (query: string) => {
    setIsStreaming(true)
    setContent('')
    setThinkingSteps([])
    setCurrentThinkingStep(undefined)
    setToolCalls([])
    setCitations([])
    setError(undefined)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue

          const data = JSON.parse(line.slice(6))

          switch (data.type) {
            case 'thinking':
              if (data.step) {
                setCurrentThinkingStep(data.step)
              }
              if (data.completed) {
                setThinkingSteps(prev => [...prev, data.completed])
                setCurrentThinkingStep(undefined)
              }
              break

            case 'tool_call':
              setToolCalls(prev => [...prev, data.toolCall])
              break

            case 'content':
              setContent(prev => prev + data.delta)
              break

            case 'citation':
              setCitations(prev => [...prev, data.citation])
              break

            case 'error':
              setError(data.message)
              break
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed')
    } finally {
      setIsStreaming(false)
      setCurrentThinkingStep(undefined)
    }
  }, [])

  const handleToolApprove = useCallback((toolCall: ToolCall) => {
    console.log('Approved tool:', toolCall.function.name)
    // Send approval to backend
  }, [])

  const handleToolReject = useCallback((toolCall: ToolCall) => {
    console.log('Rejected tool:', toolCall.function.name)
    // Send rejection to backend
  }, [])

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleStream('What are the sales trends?')}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Ask Question
      </button>

      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
        thinkingSteps={thinkingSteps}
        currentThinkingStep={currentThinkingStep}
        toolCalls={toolCalls}
        citations={citations}
        error={error}
        showThinking={true}
        showCitations={true}
        showTools={true}
        onToolApprove={handleToolApprove}
        onToolReject={handleToolReject}
      />
    </div>
  )
}
```

### SSE Streaming Integration

Example with Server-Sent Events:

```tsx
function SSEStreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const connectSSE = () => {
    setIsStreaming(true)
    setContent('')

    const eventSource = new EventSource('/api/chat/sse')

    eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'content') {
        setContent(prev => prev + data.delta)
      }
      
      if (data.type === 'done') {
        setIsStreaming(false)
        eventSource.close()
      }
    })

    eventSource.addEventListener('error', () => {
      setIsStreaming(false)
      eventSource.close()
    })
  }

  return (
    <div>
      <button onClick={connectSSE}>Connect SSE</button>
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
      />
    </div>
  )
}
```

## Animation Details

The Streaming Message uses Framer Motion for smooth transitions:

```tsx
// Container animation
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>

// Thinking steps stagger
{thinkingSteps.map((step, index) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}

// Tool calls stagger
{toolCalls.map((tool, index) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}

// Citations stagger
{citations.map((cite, index) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
))}
```

## TypeScript Interfaces

### ToolCall Type

```typescript
interface ToolCall {
  id?: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}
```

### Citation Type

```typescript
interface Citation {
  id?: string
  source: string
  chunkText: string
  confidence?: number // 0-1
  url?: string
  metadata?: Record<string, unknown>
}
```

### StreamingMessageProps

```typescript
interface StreamingMessageProps {
  content: string
  isStreaming?: boolean
  toolCalls?: ToolCall[]
  citations?: Citation[]
  thinkingSteps?: string[]
  currentThinkingStep?: string
  error?: string
  showThinking?: boolean
  showCitations?: boolean
  showTools?: boolean
  onToolApprove?: (toolCall: ToolCall) => void
  onToolReject?: (toolCall: ToolCall) => void
  className?: string
}
```

## Accessibility

The Streaming Message component follows accessibility best practices:

- **Semantic HTML**: Proper heading hierarchy and structure
- **ARIA live regions**: Content updates announced to screen readers
- **Keyboard navigation**: Tool approval buttons are keyboard accessible
- **Color contrast**: All text meets WCAG AA standards
- **Focus management**: Logical focus order for interactive elements
- **Loading states**: Clear indication of streaming progress
- **Error communication**: Errors announced to assistive technologies

## Styling and Theming

The component uses Tailwind CSS classes and supports dark mode:

```tsx
// Light mode
<StreamingMessage
  content={content}
  className="bg-white text-gray-900"
/>

// Dark mode (automatic with dark: variants)
<StreamingMessage
  content={content}
  className="bg-gray-900 text-white"
/>
```

**Color themes:**
- **Content**: Default prose styling
- **Thinking**: Blue theme (`bg-blue-50`, `text-blue-900`)
- **Tool calls**: Purple theme (`bg-purple-50`, `text-purple-900`)
- **Citations**: Gray theme (`bg-gray-50`, `text-gray-900`)
- **Errors**: Red theme (`bg-red-50`, `text-red-900`)

## Performance Considerations

1. **Content updates**: Uses React state for efficient re-renders
2. **Animation performance**: GPU-accelerated Framer Motion animations
3. **Large content**: Consider virtualization for very long messages
4. **Memory management**: Clean up event listeners and streams
5. **Debouncing**: Consider debouncing rapid content updates

## Best Practices

1. **Error handling**: Always provide error callback for streaming failures
2. **Loading states**: Show isStreaming to indicate active streams
3. **Tool approvals**: Implement security checks before tool execution
4. **Citation limits**: Limit citations to top 5-10 most relevant
5. **Thinking steps**: Keep steps concise and meaningful
6. **Accessibility**: Test with screen readers and keyboard navigation
7. **Performance**: Monitor for memory leaks with long streams
8. **User control**: Provide stop/cancel button for long operations

## Related Components

- [Message](/reference/components/message) - Standard message display
- [Message List](/reference/components/message-list) - Message container
- [Thinking Indicator](/reference/components/thinking-indicator) - Simple loading state
- [Citation Card](/reference/components/citation-card) - Standalone citation display
- [Tool Invocation Card](/reference/components/tool-invocation-card) - Tool call details

## Hooks Used

The Streaming Message component can be enhanced with:

- [useStreamingSSE](/reference/hooks/use-streaming-sse) - Server-Sent Events streaming
- [useStreamingWebSocket](/reference/hooks/use-streaming-websocket) - WebSocket streaming

## Common Patterns

### With Stream Cancellation

```tsx
function CancellableStream() {
  const [abortController, setAbortController] = useState<AbortController>()
  
  const startStream = () => {
    const controller = new AbortController()
    setAbortController(controller)
    
    fetch('/api/stream', { signal: controller.signal })
      // ... streaming logic
  }
  
  const cancelStream = () => {
    abortController?.abort()
  }
  
  return (
    <>
      <button onClick={cancelStream}>Cancel</button>
      <StreamingMessage content={content} isStreaming={isStreaming} />
    </>
  )
}
```

### With Token Tracking

```tsx
function TokenTrackedStream() {
  const [tokens, setTokens] = useState(0)
  
  const updateContent = (newContent: string) => {
    setContent(newContent)
    setTokens(newContent.split(/\s+/).length) // Rough estimate
  }
  
  return (
    <div>
      <div className="text-sm text-gray-500">Tokens: {tokens}</div>
      <StreamingMessage content={content} isStreaming={isStreaming} />
    </div>
  )
}
```
