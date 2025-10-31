import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Streaming Message - Clarity Chat',
  description: 'Display AI responses with token-by-token streaming, tool calls, thinking steps, citations, and error handling.',
}

# Streaming Message

Display AI responses with real-time token-by-token streaming, tool call visualization, chain-of-thought reasoning, citations, and comprehensive error states.

## Overview

The Streaming Message component provides advanced rendering capabilities for AI responses:

- **Token-by-token streaming** - Animated cursor showing live content generation
- **Partial JSON rendering** - Parse and display incomplete JSON responses
- **Tool call visualization** - Display and manage function calls with approve/reject
- **Thinking steps** - Chain-of-thought reasoning visualization
- **Citations** - Source references with confidence scores
- **Error states** - Comprehensive error handling and display
- **Smooth animations** - Framer Motion transitions for all elements

## Installation

The Streaming Message component is included in the Clarity Chat React package:

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { StreamingMessage } from '@clarity-chat/react'
import { useState } from 'react'

function ChatMessage() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`content\` | \`string\` | **Required** | Accumulated message content as it streams |
| \`isStreaming\` | \`boolean\` | \`false\` | Whether streaming is currently in progress |
| \`toolCalls\` | \`ToolCall[]\` | \`[]\` | Tool/function calls made during streaming |
| \`citations\` | \`Citation[]\` | \`[]\` | Source citations and references |
| \`thinkingSteps\` | \`string[]\` | \`[]\` | Completed chain-of-thought reasoning steps |
| \`currentThinkingStep\` | \`string\` | \`undefined\` | Current thinking step being processed |
| \`error\` | \`string\` | \`undefined\` | Error message if streaming failed |
| \`showThinking\` | \`boolean\` | \`true\` | Display thinking steps section |
| \`showCitations\` | \`boolean\` | \`true\` | Display citations section |
| \`showTools\` | \`boolean\` | \`true\` | Display tool calls section |
| \`onToolApprove\` | \`(toolCall: ToolCall) => void\` | \`undefined\` | Callback when tool is approved |
| \`onToolReject\` | \`(toolCall: ToolCall) => void\` | \`undefined\` | Callback when tool is rejected |
| \`className\` | \`string\` | \`undefined\` | Additional CSS classes |

## Features

### Real-Time Streaming

Display content as it arrives with an animated cursor:

\`\`\`tsx
import { StreamingMessage } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function StreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const startStreaming = async () => {
    setIsStreaming(true)
    
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ message: 'Tell me a story' }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      setContent(prev => prev + chunk)
    }

    setIsStreaming(false)
  }

  return (
    <div>
      <button onClick={startStreaming}>Start Streaming</button>
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
      />
    </div>
  )
}
\`\`\`

**Streaming features:**
- Animated blinking cursor (▋) appears while streaming
- Smooth content updates as tokens arrive
- Automatic content parsing and formatting
- Support for partial JSON rendering

### Partial JSON Rendering

Automatically parse and format incomplete JSON responses:

\`\`\`tsx
<StreamingMessage
  content='{"name": "John", "age": 30, "hobbies": ["read'
  isStreaming={true}
/>
// Renders:
// - Complete JSON object: { "name": "John", "age": 30 }
// - Incomplete remainder: "hobbies": ["read▋
\`\`\`

**JSON parsing features:**
- Attempts to parse complete JSON objects
- Finds last valid closing brace
- Displays formatted JSON with syntax highlighting
- Shows incomplete remainder as plain text
- Gracefully handles malformed JSON

### Tool Call Visualization

Display function calls with approval/rejection controls:

\`\`\`tsx
import { StreamingMessage } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/types'

function ToolCallExample() {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([
    {
      id: 'tool_1',
      type: 'function',
      function: {
        name: 'search_web',
        arguments: JSON.stringify({
          query: 'latest AI news',
          limit: 5
        })
      }
    }
  ])

  const handleApprove = (tool: ToolCall) => {
    console.log('Approved:', tool.function.name)
    // Execute the tool
  }

  const handleReject = (tool: ToolCall) => {
    console.log('Rejected:', tool.function.name)
    // Cancel the tool
  }

  return (
    <StreamingMessage
      content="Let me search for that information..."
      toolCalls={toolCalls}
      onToolApprove={handleApprove}
      onToolReject={handleReject}
    />
  )
}
\`\`\`

**Tool call features:**
- Visual cards for each tool call
- Formatted function arguments
- Optional approve/reject buttons
- Stagger animations for multiple tools
- Icon-based visual distinction

### Chain-of-Thought Reasoning

Display AI thinking steps in real-time:

\`\`\`tsx
<StreamingMessage
  content="Based on my analysis..."
  thinkingSteps={[
    'Analyzing the user question',
    'Searching knowledge base',
    'Evaluating relevance of 15 sources',
  ]}
  currentThinkingStep="Synthesizing final answer..."
  showThinking={true}
/>
\`\`\`

**Thinking features:**
- Completed steps shown with checkmarks
- Current step shown with spinner
- Collapsible thinking section
- Stagger animations for step appearance
- Color-coded visual hierarchy

### Citations and Sources

Display source references with confidence scores:

\`\`\`tsx
import type { Citation } from '@clarity-chat/types'

function CitationExample() {
  const citations: Citation[] = [
    {
      id: 'cite_1',
      source: 'Technical Documentation',
      chunkText: 'React 18 introduces automatic batching...',
      confidence: 0.92,
      url: 'https://react.dev/blog/2022/03/29/react-v18'
    },
    {
      id: 'cite_2',
      source: 'API Reference',
      chunkText: 'The useTransition hook lets you update...',
      confidence: 0.88
    }
  ]

  return (
    <StreamingMessage
      content="React 18 brings several improvements..."
      citations={citations}
      showCitations={true}
    />
  )
}
\`\`\`

**Citation features:**
- Source title and preview text
- Confidence score badges
- Truncated preview with line-clamp
- Icon-based visual distinction
- Stagger animations for multiple citations

### Error Handling

Display streaming errors with helpful context:

\`\`\`tsx
<StreamingMessage
  content="I was processing your request..."
  error="Connection timeout: The AI service did not respond within 30 seconds"
  isStreaming={false}
/>
\`\`\`

**Error features:**
- Prominent error cards with icons
- Detailed error messages
- Maintains partial content before error
- Visual distinction from normal content
- Accessible error announcements

## Complete Example: Full Streaming Interface

\`\`\`tsx
import { useState, useCallback } from 'react'
import { StreamingMessage } from '@clarity-chat/react'
import type { ToolCall, Citation } from '@clarity-chat/types'

function AdvancedStreamingChat() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [citations, setCitations] = useState<Citation[]>([])
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])
  const [currentThinkingStep, setCurrentThinkingStep] = useState<string>()
  const [error, setError] = useState<string>()

  const startStreaming = useCallback(async (message: string) => {
    setIsStreaming(true)
    setContent('')
    setToolCalls([])
    setCitations([])
    setThinkingSteps([])
    setCurrentThinkingStep(undefined)
    setError(undefined)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Streaming failed')
      }

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
            case 'content':
              setContent(prev => prev + data.delta)
              break
            case 'thinking':
              setCurrentThinkingStep(data.step)
              break
            case 'thinking_complete':
              setThinkingSteps(prev => [...prev, data.step])
              setCurrentThinkingStep(undefined)
              break
            case 'tool_call':
              setToolCalls(prev => [...prev, data.tool])
              break
            case 'citation':
              setCitations(prev => [...prev, data.citation])
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

  const handleToolApprove = useCallback((tool: ToolCall) => {
    console.log('Executing tool:', tool.function.name)
    // Execute the approved tool
  }, [])

  const handleToolReject = useCallback((tool: ToolCall) => {
    console.log('Rejecting tool:', tool.function.name)
    // Remove rejected tool from list
    setToolCalls(prev => prev.filter(t => t.id !== tool.id))
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => startStreaming('Explain React Server Components')}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isStreaming ? 'Streaming...' : 'Start Chat'}
      </button>

      <div className="mt-4">
        <StreamingMessage
          content={content}
          isStreaming={isStreaming}
          toolCalls={toolCalls}
          citations={citations}
          thinkingSteps={thinkingSteps}
          currentThinkingStep={currentThinkingStep}
          error={error}
          showThinking={true}
          showCitations={true}
          showTools={true}
          onToolApprove={handleToolApprove}
          onToolReject={handleToolReject}
        />
      </div>
    </div>
  )
}
\`\`\`

## Animation Details

The component uses Framer Motion for smooth animations:

### Content Animation
\`\`\`tsx
// Main container fade-in
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2 }}
\`\`\`

### Thinking Steps Animation
\`\`\`tsx
// Stagger effect for each step
{thinkingSteps.map((step, index) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {step}
  </motion.div>
))}
\`\`\`

### Tool Calls Animation
\`\`\`tsx
// Slide in from left with stagger
<motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
>
  {/* Tool card */}
</motion.div>
\`\`\`

### Citations Animation
\`\`\`tsx
// Fade and slide up with stagger
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  {/* Citation card */}
</motion.div>
\`\`\`

## TypeScript Interfaces

### StreamingMessageProps
\`\`\`typescript
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
\`\`\`

### ToolCall Interface
\`\`\`typescript
interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}
\`\`\`

### Citation Interface
\`\`\`typescript
interface Citation {
  id: string
  source: string
  chunkText: string
  confidence?: number // 0-1
  url?: string
  metadata?: Record<string, unknown>
}
\`\`\`

## Accessibility

The Streaming Message component follows accessibility best practices:

- **Semantic HTML**: Proper heading hierarchy and structure
- **ARIA labels**: Descriptive labels for all interactive elements
- **Live regions**: Updates announced to screen readers during streaming
- **Keyboard navigation**: All buttons and interactive elements keyboard accessible
- **Focus management**: Proper focus indicators and management
- **Color contrast**: WCAG AA compliant color combinations
- **Motion preferences**: Respects \`prefers-reduced-motion\` for animations
- **Error announcements**: Errors announced with \`role="alert"\`

## Server-Sent Events Example

Complete SSE streaming implementation:

\`\`\`tsx
// Server-side (Next.js API route)
export async function POST(request: Request) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send thinking step
      controller.enqueue(encoder.encode(
        \`data: \${JSON.stringify({ type: 'thinking', step: 'Analyzing query' })}\n\n\`
      ))
      
      // Send tool call
      controller.enqueue(encoder.encode(
        \`data: \${JSON.stringify({
          type: 'tool_call',
          tool: {
            id: 'tool_1',
            type: 'function',
            function: { name: 'search', arguments: '{"query":"AI"}' }
          }
        })}\n\n\`
      ))
      
      // Stream content
      const text = 'Hello, this is a streaming response.'
      for (const char of text) {
        controller.enqueue(encoder.encode(
          \`data: \${JSON.stringify({ type: 'content', delta: char })}\n\n\`
        ))
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      // Send citation
      controller.enqueue(encoder.encode(
        \`data: \${JSON.stringify({
          type: 'citation',
          citation: {
            id: 'cite_1',
            source: 'Documentation',
            chunkText: 'Relevant excerpt...',
            confidence: 0.95
          }
        })}\n\n\`
      ))
      
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
\`\`\`

## Related Components

- [Message](/reference/components/message) - Static message component
- [Message List](/reference/components/message-list) - Container for multiple messages
- [Thinking Indicator](/reference/components/thinking-indicator) - Standalone loading animation
- [Citation Card](/reference/components/citation-card) - Individual citation component
- [Tool Invocation Card](/reference/components/tool-invocation-card) - Standalone tool display

## Best Practices

1. **Content accumulation**: Always append to content, never replace
2. **Error handling**: Always handle streaming errors gracefully
3. **Tool approval**: Require user approval for sensitive operations
4. **Performance**: Use React.memo for expensive child components
5. **Accessibility**: Ensure streaming updates are announced to screen readers
6. **Partial JSON**: Test with incomplete JSON structures
7. **Network errors**: Handle connection drops and timeouts
8. **Resource cleanup**: Cancel streams when component unmounts
9. **Rate limiting**: Throttle rapid content updates if needed
10. **Testing**: Test with various streaming speeds and error conditions

## Advanced Features

### Custom Cursors
\`\`\`tsx
// Customize the blinking cursor
<style>{\`
  .streaming-cursor {
    animation: blink 1s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
\`}</style>
\`\`\`

### Custom Thinking Styles
\`\`\`tsx
// Override thinking step appearance
<StreamingMessage
  thinkingSteps={steps}
  className="[&_.thinking-step]:text-purple-600"
/>
\`\`\`

### Partial Content Parsing
The component includes intelligent parsing for:
- Incomplete JSON objects
- Malformed markdown
- Partial code blocks
- Truncated tables
\`\`\`

## Performance Considerations

- **Debouncing**: Content updates are debounced to prevent excessive re-renders
- **Memoization**: Child components are memoized where appropriate
- **Animation optimization**: Uses CSS transforms for smooth animations
- **Virtual scrolling**: Consider for very long streaming responses
- **Memory management**: Cleans up resources on unmount
