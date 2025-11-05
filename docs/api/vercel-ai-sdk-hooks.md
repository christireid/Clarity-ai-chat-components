# Vercel AI SDK Compatible Hooks API Reference

Complete API reference for Vercel AI SDK compatible hooks in Clarity Chat.

## Table of Contents

- [useChat](#usechat)
- [useCompletion](#usecompletion)
- [useAssistant](#useassistant)
- [Utilities](#utilities)

---

## useChat

React hook for managing chat conversations with streaming support.

### Import

```tsx
import { useChat } from '@clarity-chat/react'
```

### API

```tsx
const {
  messages,
  setMessages,
  append,
  reload,
  stop,
  handleSubmit,
  input,
  setInput,
  isLoading,
  error,
  data,
  abort,
} = useChat(options)
```

### Options

```tsx
interface UseChatOptions {
  /** API endpoint URL */
  api?: string
  
  /** Initial messages */
  initialMessages?: CoreMessage[]
  
  /** Additional body data to send with requests */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Maximum number of steps for agentic workflows */
  maxSteps?: number
  
  /** Stream protocol: 'sse' | 'data' */
  streamProtocol?: 'sse' | 'data'
  
  /** Generate unique ID for each message */
  id?: string
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when stream finishes */
  onFinish?: (message: CoreMessage) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback when message is appended */
  onMessageAppend?: (message: CoreMessage) => void
  
  /** Transform messages before sending */
  transform?: (messages: CoreMessage[]) => CoreMessage[]
  
  /** Experimental features */
  experimental?: {
    streamProtocol?: 'sse' | 'data' | 'webstream'
    [key: string]: any
  }
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Keep previous message when error occurs */
  keepLastMessageOnError?: boolean
  
  /** Send extra message fields */
  sendExtraMessageFields?: boolean
}
```

### Return Value

```tsx
interface UseChatReturn {
  /** Current messages */
  messages: CoreMessage[]
  
  /** Set messages directly */
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  
  /** Append a message */
  append: (
    message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
    options?: { data?: Record<string, any> }
  ) => Promise<string | null>
  
  /** Reload/retry the last assistant message */
  reload: (options?: { data?: Record<string, any> }) => Promise<string | null>
  
  /** Stop the current stream */
  stop: () => void
  
  /** Submit a user message (creates user message and triggers assistant response) */
  handleSubmit: (
    event?: React.FormEvent<HTMLFormElement>,
    options?: { data?: Record<string, any> }
  ) => void
  
  /** Input value */
  input: string
  
  /** Set input value */
  setInput: React.Dispatch<React.SetStateAction<string>>
  
  /** Whether currently loading */
  isLoading: boolean
  
  /** Current error */
  error: Error | undefined
  
  /** Current assistant message being streamed */
  data: CoreMessage | undefined
  
  /** Abort controller for current request */
  abort: () => void
}
```

### Example

```tsx
function Chat() {
  const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Finished:', message)
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {messageToText(m)}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

---

## useCompletion

React hook for text completions with streaming support.

### Import

```tsx
import { useCompletion } from '@clarity-chat/react'
```

### API

```tsx
const {
  completion,
  setCompletion,
  complete,
  stop,
  isLoading,
  error,
  abort,
} = useCompletion(options)
```

### Options

```tsx
interface UseCompletionOptions {
  /** API endpoint URL */
  api?: string
  
  /** Initial completion text */
  initialCompletion?: string
  
  /** Additional body data */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when completion finishes */
  onFinish?: (prompt: string, completion: string) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Custom completion ID generator */
  id?: string
  
  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}
```

### Return Value

```tsx
interface UseCompletionReturn {
  /** Current completion text */
  completion: string
  
  /** Set completion text directly */
  setCompletion: React.Dispatch<React.SetStateAction<string>>
  
  /** Complete the given prompt */
  complete: (
    prompt: string,
    options?: { body?: Record<string, any> }
  ) => Promise<string | null>
  
  /** Stop the current completion */
  stop: () => void
  
  /** Whether currently loading */
  isLoading: boolean
  
  /** Current error */
  error: Error | undefined
  
  /** Abort controller for current request */
  abort: () => void
}
```

### Example

```tsx
function Completion() {
  const { completion, complete, isLoading, stop } = useCompletion({
    api: '/api/completion',
    onFinish: (prompt, completion) => {
      console.log('Completed:', completion)
    },
  })

  return (
    <div>
      <button onClick={() => complete('Hello')} disabled={isLoading}>
        Complete
      </button>
      {isLoading && <button onClick={stop}>Stop</button>}
      <div>{completion}</div>
    </div>
  )
}
```

---

## useAssistant

React hook for AI assistants with tool calling support.

### Import

```tsx
import { useAssistant } from '@clarity-chat/react'
```

### API

```tsx
const {
  status,
  messages,
  setMessages,
  submitMessage,
  handleSubmit,
  input,
  setInput,
  isLoading,
  error,
  data,
  toolInvocations,
  stop,
  abort,
  append,
} = useAssistant(options)
```

### Options

```tsx
interface UseAssistantOptions {
  /** API endpoint URL */
  api?: string
  
  /** Assistant ID */
  assistantId?: string
  
  /** Thread ID (for multi-turn conversations) */
  threadId?: string
  
  /** Initial messages */
  initialMessages?: CoreMessage[]
  
  /** Additional body data */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Maximum number of steps */
  maxSteps?: number
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when assistant finishes */
  onFinish?: (message: CoreMessage) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback when tool is invoked */
  onToolCall?: (toolCall: ToolInvocation) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}
```

### Return Value

```tsx
interface UseAssistantReturn {
  /** Current status */
  status: 'idle' | 'in_progress' | 'awaiting_message'
  
  /** Current messages */
  messages: CoreMessage[]
  
  /** Set messages directly */
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  
  /** Submit a message to the assistant */
  submitMessage: (
    message: string | CoreMessage,
    options?: { data?: Record<string, any> }
  ) => Promise<void>
  
  /** Handle form submission */
  handleSubmit: (
    event?: React.FormEvent<HTMLFormElement>,
    options?: { data?: Record<string, any> }
  ) => void
  
  /** Input value */
  input: string
  
  /** Set input value */
  setInput: React.Dispatch<React.SetStateAction<string>>
  
  /** Whether currently loading */
  isLoading: boolean
  
  /** Current error */
  error: Error | undefined
  
  /** Current assistant message being streamed */
  data: CoreMessage | undefined
  
  /** Current tool invocations */
  toolInvocations: ToolInvocation[]
  
  /** Stop the current assistant */
  stop: () => void
  
  /** Abort controller for current request */
  abort: () => void
  
  /** Append a message manually */
  append: (message: CoreMessage) => void
}
```

### Example

```tsx
function Assistant() {
  const {
    status,
    messages,
    submitMessage,
    input,
    setInput,
    isLoading,
    toolInvocations,
  } = useAssistant({
    api: '/api/assistant',
    assistantId: 'my-assistant',
    onToolCall: (toolCall) => {
      console.log('Tool called:', toolCall.toolName)
    },
  })

  return (
    <div>
      <div>Status: {status}</div>
      {messages.map((m) => (
        <div key={m.id}>{messageToText(m)}</div>
      ))}
      {toolInvocations.map((inv) => (
        <div key={inv.toolCallId}>Tool: {inv.toolName}</div>
      ))}
      <form onSubmit={(e) => {
        e.preventDefault()
        submitMessage(input)
        setInput('')
      }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

---

## Utilities

### Message Helpers

```tsx
import {
  messageToText,
  extractTextContent,
  hasToolCalls,
  extractToolCalls,
  formatMessagesForAPI,
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
  validateMessage,
  estimateTokenCount,
  filterMessagesByRole,
  getLastMessageByRole,
  truncateMessagesToTokenLimit,
} from '@clarity-chat/react'
```

### Streaming Parser

```tsx
import {
  parseStreamingChunk,
  extractContentFromChunk,
  hasToolInvocation,
  extractToolInvocation,
  parseSSEDataLine,
  createStreamingReader,
  parseStreamingResponse,
  StreamingAccumulator,
} from '@clarity-chat/react'
```

### StreamableValue

```tsx
import {
  createStreamableValue,
  readStreamableValue,
  readStreamableUI,
  createStreamableValueTransformer,
} from '@clarity-chat/react'
```

---

## Type Definitions

### CoreMessage

```tsx
interface CoreMessage {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: CoreMessageContent
  name?: string
  toolCallId?: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }>
}
```

### CoreMessageContent

```tsx
type CoreMessageContent =
  | string
  | Array<{
      type: 'text'
      text: string
    } | {
      type: 'image'
      image: string | ArrayBuffer
    } | {
      type: 'tool-call'
      toolCallId: string
      toolName: string
      args: Record<string, any>
    } | {
      type: 'tool-result'
      toolCallId: string
      toolName: string
      result: any
    }>
```

### ToolInvocation

```tsx
interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result'
  result?: any
  error?: string
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors:

```tsx
const { error, isLoading } = useChat({
  api: '/api/chat',
  onError: (error) => {
    // Log to error tracking service
    console.error('Chat error:', error)
  },
})

if (error) {
  return <div>Error: {error.message}</div>
}
```

### 2. Loading States

Show loading indicators:

```tsx
{isLoading && <div>Thinking...</div>}
```

### 3. Message Validation

Validate messages before sending:

```tsx
import { validateMessage, createUserMessage } from '@clarity-chat/react'

const message = createUserMessage(input)
const { valid, errors } = validateMessage(message)

if (!valid) {
  console.error('Invalid message:', errors)
  return
}

await append(message)
```

### 4. Token Management

Limit conversation history:

```tsx
import { truncateMessagesToTokenLimit } from '@clarity-chat/react'

const limitedMessages = truncateMessagesToTokenLimit(messages, 4000)
```

### 5. Tool Calling

Handle tool invocations:

```tsx
const { toolInvocations } = useAssistant({
  api: '/api/assistant',
  onToolCall: (toolCall) => {
    // Execute tool
    executeTool(toolCall.toolName, toolCall.args)
  },
})
```

---

## Migration from Vercel AI SDK

See [MIGRATION_FROM_VERCEL.md](../../MIGRATION_FROM_VERCEL.md) for detailed migration guide.

## Additional Resources

- [Examples](../../examples/vercel-ai-sdk-compatible/)
- [Integration Guide](../../VERCEL_AI_SDK_INTEGRATION.md)
- [Complete Documentation](../README.md)
