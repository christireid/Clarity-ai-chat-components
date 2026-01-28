# Vercel AI SDK

## Overview

- Repository URL: https://github.com/vercel/ai
- Documentation URL: https://ai-sdk.dev/
- GitHub stars: 21,300+
- License: Not specified in public docs (view repository root)
- Maintained by: Vercel
- Latest version: Active development (Node.js 18+ required)
- Package: `ai` (npm install ai)

## Component Inventory

### UI Components

The Vercel AI SDK **does not provide pre-built UI components**. Instead, it provides:

**Headless Hooks** - Framework-agnostic state management hooks that developers use to build their
own UI:

- `useChat` - Chat interface state management
- `useCompletion` - Text completion state management
- `useObject` - Structured object generation state management
- Framework support: React, Svelte, Vue, Angular, Solid

**Philosophy**: Vercel takes a "bring your own UI" approach, providing state management and stream
handling while leaving visual design to developers. This contrasts with component libraries that
provide ready-to-use UI elements.

## Hooks & Utilities

### useChat Hook

```typescript
// Signature
const {
  messages,
  sendMessage,
  status,
  stop,
  regenerate,
  error,
  setMessages
} = useChat(options);

// Options Interface
interface UseChatOptions {
  // Transport configuration
  transport?: DefaultChatTransport | TextStreamChatTransport | DirectChatTransport;

  // Unique identifier for the chat
  id?: string;

  // UI update throttling (React only)
  experimental_throttle?: number;

  // Event callbacks
  onFinish?: ({
    message: UIMessage;
    messages: UIMessage[];
    isAbort: boolean;
    isDisconnect: boolean;
    isError: boolean;
  }) => void;

  onError?: (error: Error) => void;
  onData?: (data: unknown) => void;
}

// Transport Configuration
new DefaultChatTransport({
  api: '/api/chat',                    // API endpoint
  headers?: Record<string, string> | (() => Record<string, string>);
  body?: Record<string, unknown> | (() => Record<string, unknown>);
  credentials?: 'include' | 'same-origin' | (() => string);

  // Custom request transformation
  prepareSendMessagesRequest?: ({
    id: string;
    messages: UIMessage[];
    trigger: 'submit-user-message' | 'regenerate-assistant-message';
    messageId?: string;
  }) => { body: unknown };
})

// Return Value
interface UseChatReturn {
  // State
  messages: UIMessage[];
  error?: Error;
  status: 'submitted' | 'streaming' | 'ready' | 'error';

  // Actions
  sendMessage: (
    message: { text: string; files?: FileList | FileUIPart[] },
    options?: {
      headers?: Record<string, string>;
      body?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }
  ) => void;

  stop: () => void;              // Abort current response
  regenerate: () => void;        // Resend last message
  setMessages: (messages: UIMessage[]) => void;
}

// UIMessage Format
interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: UIMessagePart[];
  metadata?: Record<string, unknown>;
}

type UIMessagePart =
  | { type: 'text'; text: string }
  | { type: 'tool-call'; toolName: string; args: unknown; toolCallId: string }
  | { type: 'tool-result'; toolName: string; result: unknown; toolCallId: string }
  | { type: 'reasoning'; text: string }
  | { type: 'source-url'; url: string; title?: string; id: string }
  | { type: 'source-document'; title?: string; id: string }
  | { type: 'file'; filename: string; url: string; mediaType: string };

// Usage Example
const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' })
});

sendMessage({ text: 'Hello!' });

// With Files
sendMessage({
  text: 'Check this image',
  files: fileInputRef.current?.files
});

// Request-Level Options (Recommended)
sendMessage(
  { text: input },
  {
    headers: { Authorization: 'Bearer token' },
    body: { temperature: 0.7, max_tokens: 100 },
    metadata: { userId: 'user123' }
  }
);
```

**Key Features**:

- Multiple transport types (HTTP, direct agent, text stream)
- File upload support (FileList or custom file objects)
- Granular status states (submitted, streaming, ready, error)
- Rich message parts (text, tool calls, reasoning, sources, files)
- Request-level configuration overrides
- Stop/regenerate controls
- Metadata tracking for usage stats and custom data

### useCompletion Hook

```typescript
// Signature
const {
  completion,
  complete,
  error,
  setCompletion,
  stop,
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  isLoading,
} = useCompletion(options)

// Options Interface
interface UseCompletionOptions {
  api?: string // Default: '/api/completion'
  id?: string // Unique identifier
  initialInput?: string // Starting prompt
  initialCompletion?: string // Starting result
  onFinish?: (prompt: string, completion: string) => void
  onError?: (error: Error) => void
  headers?: Record<string, string> | Headers
  body?: object
  credentials?: 'omit' | 'same-origin' | 'include'
  streamProtocol?: 'text' | 'data' // Default: 'data'
  fetch?: FetchFunction
  experimental_throttle?: number // React: throttle UI updates (ms)
}

// Return Value
interface UseCompletionReturn {
  completion: string // Current generated text
  complete: (
    prompt: string,
    options?: { headers?: object; body?: object }
  ) => Promise<string | null | undefined>
  error: Error | undefined
  setCompletion: (completion: string) => void
  stop: () => void
  input: string // User input state
  setInput: React.Dispatch<React.SetStateAction<string>>
  handleInputChange: (event: any) => void // Form helper
  handleSubmit: (event?: { preventDefault?: () => void }) => void
  isLoading: boolean
}

// Usage Example
const { completion, complete, isLoading } = useCompletion({
  api: '/api/completion',
})

await complete('Write a poem about TypeScript')
```

**Differences from useChat**:

- No message history management (single completion per request)
- Simpler state model (just completion text, not message array)
- Form helper methods (handleInputChange, handleSubmit)
- Designed for autocomplete, text generation, not conversations

### useObject Hook

```typescript
// Signature (Experimental)
const {
  object,
  submit,
  error,
  isLoading,
  stop,
  clear
} = experimental_useObject<RESULT, INPUT>({
  api: string;
  schema: ZodSchema | JSONSchema;
  id?: string;
  initialValue?: DeepPartial<RESULT>;
  fetch?: FetchFunction;
  headers?: Record<string, string> | Headers;
  credentials?: RequestCredentials;
  onError?: (error: Error) => void;
  onFinish?: (result: OnFinishResult) => void;
});

// Return Value
interface UseObjectReturn<T> {
  submit: (input: INPUT) => void;
  object: DeepPartial<T> | undefined;  // Incrementally built object
  error: Error | undefined;
  isLoading: boolean;
  stop: () => void;
  clear: () => void;
}

// Usage Example
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

const { object, submit, isLoading } = useObject({
  api: '/api/generate',
  schema: z.object({
    title: z.string(),
    items: z.array(z.string())
  }),
});

submit('Generate a todo list');
// object progressively fills in as stream arrives
```

**Key Features**:

- Streams and parses JSON objects incrementally
- Schema validation (Zod or JSON Schema)
- Type-safe structured data
- Real-time UI updates as object builds
- Currently experimental (React, Svelte, Vue only)

### useAssistant Hook

**Status**: Referenced in documentation navigation but detailed docs returned 500 error. Based on
naming and Vercel's patterns, this likely integrates with OpenAI Assistants API, providing thread
management and persistent assistant conversations.

### Other Hooks

**Supporting Utilities**:

- `convertToModelMessages` - Convert UIMessage format to provider-specific format
- `pruneMessages` - Optimize message history for token limits
- `readUIMessageStream` - Client-side stream consumption
- `useStreamableValue` - RSC: read streamable values
- `useActions` - RSC: access server actions
- `useAIState` - RSC: access AI state
- `useUIState` - RSC: access UI state

## SDK Architecture

### Core Design

**Three-Layer Architecture**:

1. **AI SDK Core** (`ai` package)
   - Provider-agnostic abstraction layer
   - Core functions: `generateText`, `streamText`, `generateObject`, `streamObject`
   - Multimodal support: `embed`, `rerank`, `generateImage`, `transcribe`, `generateSpeech`
   - Tool integration: `tool`, `dynamicTool`, `ToolLoopAgent`
   - Middleware: `wrapLanguageModel` for cross-cutting concerns

2. **AI SDK UI** (Framework-specific packages: `@ai-sdk/react`, `@ai-sdk/vue`, etc.)
   - Headless hooks for state management
   - Framework adapters (React, Svelte, Vue, Angular, Solid)
   - No UI components - developers build their own
   - Transport abstraction for HTTP/direct communication

3. **AI SDK RSC** (React Server Components - Experimental)
   - `streamUI()` - Stream React components from server
   - `createAI()` - Setup RSC context
   - `createStreamableUI()` - Build streamable components
   - State management: `getAIState()`, `getMutableAIState()`
   - **Status**: Experimental, docs recommend AI SDK UI for production

**Design Philosophy**:

- **Headless by default** - Provide logic, not UI
- **Framework agnostic** - Adapters for major frameworks
- **Provider agnostic** - Switch providers with one line of code
- **TypeScript-first** - Full type safety throughout
- **Streaming-first** - Built for real-time responses

### Provider Support

**40+ Providers** supported through unified API:

**Official Providers**:

- OpenAI, Azure OpenAI
- Anthropic
- Google (Generative AI, Vertex AI)
- Amazon Bedrock
- Mistral AI
- Cohere
- Groq, Together.ai, Fireworks
- DeepSeek, DeepInfra
- Cerebras, Baseten
- xAI Grok
- Hugging Face
- 15+ additional specialized providers

**Community Providers** (40+):

- Ollama, OpenRouter
- Cloudflare Workers AI
- llama.cpp
- And many more

**Provider Registry Pattern**:

```typescript
import { createProviderRegistry, customProvider } from 'ai'

// Switch providers by changing import
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'

// Same code, different provider
const result = streamText({
  model: openai('gpt-4o'), // or anthropic('claude-opus-4-5')
  prompt: 'Hello',
})
```

**Key Feature**: "Switch between AI providers by changing a single line of code"

### Stream Handling

**Advanced Streaming Infrastructure**:

**Stream Types**:

- Text streams (progressive text output)
- Object streams (incremental JSON parsing)
- UI streams (React components from server - RSC)
- Value streams (arbitrary data streaming)

**Stream Utilities**:

- `smoothStream` - Progressive output refinement
- `simulateReadableStream` - Testing support
- Backpressure management - Flow control
- Stream resumption - Resilient connections
- `experimental_throttle` - UI update throttling

**Client-Side**:

```typescript
// Messages stream progressively
const { messages, status } = useChat()
// status: 'submitted' -> 'streaming' -> 'ready'

// Object builds incrementally
const { object } = useObject({ schema })
// object: { title: "..." } -> { title: "...", items: [...] }
```

**Server-Side**:

```typescript
import { streamText } from 'ai'

const result = streamText({
  model,
  messages,
})

return result.toUIMessageStreamResponse({
  sendReasoning: true, // Include reasoning parts
  sendSources: true, // Include source citations
  messageMetadata: ({ part }) => {
    if (part.type === 'finish') {
      return { totalTokens: part.totalUsage.totalTokens }
    }
  },
})
```

## React Server Components

### RSC Integration

**Status**: Experimental - "We recommend using AI SDK UI for production"

**Core Concept**: Stream React components directly from server to client, not just data.

**Primary APIs**:

- `streamUI()` - Main function for streaming UI
- `createAI()` - Setup provider context
- `createStreamableUI()` - Build streamable components
- `createStreamableValue()` - Stream arbitrary values

### Server Actions

**Pattern**: Use Server Actions as backend for AI operations:

```typescript
'use server';

import { streamUI, createStreamableUI } from 'ai/rsc';

export async function generateUI(prompt: string) {
  const ui = createStreamableUI(<div>Loading...</div>);

  // Stream components as they're generated
  const result = await streamUI({
    model,
    prompt,
    text: ({ content }) => <div>{content}</div>,
    tools: {
      showWeather: {
        description: 'Show weather',
        parameters: z.object({ city: z.string() }),
        generate: ({ city }) => <WeatherCard city={city} />
      }
    }
  });

  return result.value;
}
```

### Streaming from Server

**Capabilities**:

- Progressive component rendering
- Multi-step interfaces
- State persistence
- Loading and error handling
- Authentication support

**Client Consumption**:

```typescript
import { useActions, useUIState } from 'ai/rsc'

const { generateUI } = useActions()
const [messages, setMessages] = useUIState()

const handleSubmit = async () => {
  const response = await generateUI(input)
  setMessages([...messages, response])
}
```

**Recommendation**: While powerful, Vercel recommends **AI SDK UI for production** due to RSC's
experimental status.

## API Design Patterns

### Hook Design Philosophy

**Principles**:

1. **Headless Architecture** - No UI opinions, pure state management
2. **Progressive Enhancement** - Start simple, add complexity as needed
3. **Sensible Defaults** - Works out of the box with minimal config
4. **Request-Level Overrides** - Global config + per-request customization
5. **Granular Control** - stop(), regenerate(), status tracking
6. **Rich Type System** - Full TypeScript support with generics

**Example of Progressive API**:

```typescript
// Simple - just works
useChat({ transport: new DefaultChatTransport({ api: '/api/chat' }) })

// Add global config
useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { 'X-API-Key': key },
  }),
})

// Override per request
sendMessage({ text: input }, { headers: { 'X-Custom': 'value' } })
```

**Transport Abstraction** - Pluggable communication layer:

- `DefaultChatTransport` - Standard HTTP
- `TextStreamChatTransport` - Plain text streaming
- `DirectChatTransport` - In-process agent (no HTTP)

### Type Safety

**Schema Integration**:

- Zod schemas (primary)
- JSON Schema
- Valibot schemas

**Type Inference**:

```typescript
const schema = z.object({
  title: z.string(),
  items: z.array(z.string()),
})

const { object } = useObject({ schema })
// object type: DeepPartial<{ title: string; items: string[] }>
```

**Generic Hooks**:

```typescript
experimental_useObject<RESULT, INPUT>(...)
// Full type safety from schema to return value
```

**Provider Model Types**:

```typescript
import { LanguageModel } from 'ai'

function myFunction(model: LanguageModel) {
  // Works with any provider
}
```

### Developer Experience

**What Makes It Easy**:

1. **Single Package** - `npm install ai` for everything
2. **Zero Config Start** - Sensible defaults
3. **Provider Switching** - Change one line to switch AI providers
4. **Framework Adapters** - Works with React, Vue, Svelte, etc.
5. **TypeScript Native** - Built with TS from ground up
6. **Error Handling Built-in** - Automatic error states
7. **Stream Management** - No manual stream handling needed

**Community Feedback** (from homepage):

- "From idea → working ai app in 15 mins"
- "Probably the best way to build an ai app right now"
- "The barrier to implementing it is just a matter of minutes"
- "Pure magic" for typed JSON objects

## Streaming Capabilities

### Client-Side Streaming

**Automatic Stream Handling**:

```typescript
const { messages, status } = useChat()

// Status progression:
// 'submitted' -> 'streaming' -> 'ready'

// Messages update in real-time as tokens arrive
messages.map((msg) =>
  msg.parts.map((part) => {
    if (part.type === 'text') return part.text
    // Incremental rendering
  })
)
```

**Throttling** (React):

```typescript
useChat({
  experimental_throttle: 50, // Update UI max every 50ms
})
```

### Server-Side Streaming

**Core Streaming Functions**:

```typescript
import { streamText, streamObject } from 'ai';

// Text streaming
const result = streamText({
  model,
  messages,
  tools,
});

// Convert to different response types:
result.toDataStreamResponse()      // Raw data stream
result.toTextStreamResponse()      // Plain text stream
result.toUIMessageStreamResponse() // Rich UI message stream

// Object streaming (incremental JSON)
const result = streamObject({
  model,
  schema: z.object({ ... }),
  prompt,
});

for await (const partialObject of result.partialObjectStream) {
  console.log(partialObject);  // Progressively complete object
}
```

**Stream Response Options**:

```typescript
result.toUIMessageStreamResponse({
  sendReasoning: true, // Include model reasoning
  sendSources: true, // Include source citations
  messageMetadata: ({ part }) => ({
    tokens: part.totalUsage?.totalTokens,
  }),
})
```

### UI Patterns

**Common Streaming Patterns**:

1. **Progressive Text Display**:

```typescript
const { completion, isLoading } = useCompletion();

return (
  <div>
    {completion}
    {isLoading && <BlinkingCursor />}
  </div>
);
```

2. **Message List with Streaming**:

```typescript
const { messages, status } = useChat();

return messages.map((msg, i) => (
  <Message
    key={msg.id}
    isStreaming={i === messages.length - 1 && status === 'streaming'}
  >
    {msg.parts.map(part => renderPart(part))}
  </Message>
));
```

3. **Incremental Object Building**:

```typescript
const { object } = useObject({ schema });

return (
  <div>
    <h1>{object?.title || 'Loading...'}</h1>
    <ul>
      {object?.items?.map(item => <li>{item}</li>)}
    </ul>
  </div>
);
```

4. **Stop/Regenerate Controls**:

```typescript
const { stop, regenerate, status } = useChat();

<button
  onClick={stop}
  disabled={!['streaming','submitted'].includes(status)}
>
  Stop
</button>
<button
  onClick={regenerate}
  disabled={!['ready','error'].includes(status)}
>
  Retry
</button>
```

**Advanced**: Multi-part messages with tool calls, reasoning, sources:

```typescript
msg.parts.map(part => {
  switch (part.type) {
    case 'text': return <Text>{part.text}</Text>;
    case 'tool-call': return <ToolCall {...part} />;
    case 'tool-result': return <ToolResult {...part} />;
    case 'reasoning': return <Reasoning>{part.text}</Reasoning>;
    case 'source-url': return <Source url={part.url} />;
    case 'file': return <FileAttachment {...part} />;
  }
})
```

## Visual Design

**N/A** - Vercel AI SDK does not provide UI components or visual design. It's a headless library
focused on state management and streaming logic. Developers bring their own UI components and
styling.

This is a deliberate design choice to:

- Remain framework agnostic
- Not impose design opinions
- Allow integration with any design system
- Keep the SDK focused on AI logic, not presentation

## Key Differentiators

1. **Headless Architecture** - Pure logic, no UI components (vs component libraries)
2. **Provider Agnostic** - 40+ providers, switch with one line of code
3. **Framework Agnostic** - Works with React, Vue, Svelte, Angular, Solid
4. **Streaming-First** - Built from ground up for real-time responses
5. **TypeScript Native** - Full type safety, schema validation
6. **Multi-Modal Support** - Text, objects, images, speech, embeddings, transcription
7. **Tool Integration** - First-class function calling and agentic loops
8. **Zero to Production in Minutes** - Minimal setup, sensible defaults
9. **Rich Message Format** - Text, tool calls, reasoning, sources, files in single message
10. **Transport Abstraction** - HTTP, direct agent, or custom transport layers

**Unique Features**:

- `experimental_useObject` - Stream and parse JSON incrementally
- `ToolLoopAgent` - Multi-step autonomous reasoning
- `DirectChatTransport` - No HTTP, direct agent integration
- Request-level configuration overrides
- Message part types (reasoning, sources, tools)
- Schema-based validation (Zod, JSON Schema, Valibot)

## Strengths

1. **Exceptional Developer Experience**
   - "15 minutes from idea to working app"
   - Minimal boilerplate
   - Sensible defaults with deep customization

2. **Best-in-Class Streaming**
   - Automatic stream handling
   - Progressive rendering
   - Backpressure management
   - Stream resumption

3. **Provider Flexibility**
   - 40+ providers supported
   - Switch providers instantly
   - No vendor lock-in

4. **Type Safety**
   - Full TypeScript support
   - Schema validation
   - Type inference from schemas

5. **Framework Support**
   - React, Vue, Svelte, Angular, Solid
   - Same API across frameworks

6. **Tool Integration**
   - Easy function calling
   - Multi-step agent loops
   - Dynamic tool definition

7. **Production Ready**
   - Used by Vercel and major companies
   - 21K+ GitHub stars
   - Active development and community

8. **Documentation Quality**
   - Comprehensive guides
   - Clear API reference
   - Multiple examples

9. **Multi-Modal**
   - Text generation
   - Structured objects
   - Image generation
   - Speech synthesis/transcription
   - Embeddings and reranking

10. **Flexibility**
    - Custom transports
    - Middleware for cross-cutting concerns
    - Provider registry for custom providers

## Weaknesses

1. **No UI Components**
   - Developers must build their own UI
   - Higher initial effort for UI implementation
   - No out-of-box chat interface

2. **RSC Experimental Status**
   - Server Components integration not production-ready
   - Docs recommend using UI SDK instead
   - Uncertain future of RSC features

3. **Learning Curve**
   - Headless architecture requires understanding
   - Need to learn transport system
   - Multiple API surfaces (Core, UI, RSC)

4. **Message Format Complexity**
   - UIMessage with parts array is powerful but complex
   - Rendering logic required for each part type
   - More complex than simple string messages

5. **Documentation Gaps**
   - Some pages return 500 errors (useAssistant, streaming docs)
   - Limited examples for advanced features
   - RSC docs incomplete

6. **Framework Lock-in (Sort of)**
   - While multi-framework, each needs specific adapter
   - Can't easily share hook logic across frameworks

7. **Opinionated in Some Areas**
   - Transport abstraction adds indirection
   - Message format may not match all use cases

8. **Limited Visual Guidance**
   - No design system or UI patterns
   - No component examples for common UIs
   - Developers start from scratch on UI

## Notable Examples

**From Documentation** (specific examples encountered 500 errors, but docs reference):

- Next.js chatbot implementations (App Router and Pages Router)
- Svelte chat applications
- Vue.js completions
- Tool calling examples
- Multi-modal examples (images, files, audio)
- Agent loop implementations

**Community Examples** (referenced in homepage):

- Production AI apps built in 15 minutes
- Typed JSON object generation
- Multi-provider switching demos

## Developer Experience

### Setup Complexity

**Extremely Simple**:

1. Install package:

```bash
npm install ai @ai-sdk/openai
```

2. Create API route:

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })
  return result.toDataStreamResponse()
}
```

3. Use hook:

```typescript
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' })
  });

  return (
    <div>
      {messages.map(m => <div key={m.id}>{m.parts[0].text}</div>)}
      <button onClick={() => sendMessage({ text: 'Hello' })}>Send</button>
    </div>
  );
}
```

**Rating**: 10/10 - Among the easiest AI SDKs to get started with

### Learning Curve

**Progressive Complexity**:

- **Basic usage**: 15-30 minutes to working app
- **Understanding transports**: 1-2 hours
- **Advanced features** (tools, agents): Few hours
- **Multi-modal**: Additional learning per modality

**Steepness**: Low to Medium

- Simple cases are very simple
- Complexity scales with requirements
- Good defaults minimize configuration

### Documentation Quality

**Strengths**:

- Clear getting started guides
- Comprehensive API reference
- Multiple framework examples
- Good TypeScript documentation

**Weaknesses**:

- Some 500 errors on documentation pages
- RSC docs incomplete/experimental
- Limited advanced examples
- Could use more UI implementation guidance

**Rating**: 7.5/10

- Excellent for basic use cases
- Good API reference
- Some gaps in advanced topics

### TypeScript Support

**Exceptional**:

1. **Full Type Safety**:

```typescript
const { object } = useObject<{ title: string; items: string[] }>()
// object: DeepPartial<{ title: string; items: string[] }> | undefined
```

2. **Schema Integration**:

```typescript
const schema = z.object({ title: z.string() })
useObject({ schema }) // Types inferred from schema
```

3. **Generic APIs**:

```typescript
interface UseChatReturn { ... }
interface UseChatOptions { ... }
// All interfaces exported and documented
```

4. **Provider Type Safety**:

```typescript
import { LanguageModel } from 'ai';
function works(model: LanguageModel) { ... }
```

5. **InferUITools** for tool type inference

**Rating**: 10/10 - Best-in-class TypeScript support

## Inspiration for Clarity Chat

### Hook Patterns to Adopt

1. **Progressive API Design** - Start simple, add complexity as needed
   - Why: Lowers barrier to entry while supporting advanced use cases
   - Example: Basic `useChat()` to advanced with transports and metadata

2. **Request-Level Overrides** - Global config + per-request customization
   - Why: Flexibility without repetitive configuration
   - Example: `sendMessage(text, { headers: {...} })`

3. **Granular Status States** - Not just loading/error but detailed states
   - Why: Better UX control (show stop button during streaming, regenerate when ready)
   - Example: 'submitted' | 'streaming' | 'ready' | 'error'

4. **Rich Message Format with Parts** - Messages contain multiple typed parts
   - Why: Supports text, tool calls, reasoning, sources, files in single message
   - Example: `UIMessagePart[]` with discriminated union types

5. **Transport Abstraction** - Pluggable communication layer
   - Why: Supports HTTP, direct agents, custom protocols
   - Example: `DefaultChatTransport`, `DirectChatTransport`

6. **Stop/Regenerate Controls** - Built-in streaming control
   - Why: Common UX patterns should be easy
   - Example: `stop()`, `regenerate()` methods

### API Design to Emulate

1. **Headless Hook Pattern** - Provide state management, not UI
   - Why: Maximum flexibility, framework agnostic, no design opinions
   - Implementation: Separate hooks package from components package

2. **Schema-Based Type Safety** - Use Zod/JSON Schema for validation and types
   - Why: Runtime validation + compile-time types from single source
   - Implementation: Accept schema parameter, infer types

3. **Sensible Defaults** - Works with minimal configuration
   - Why: 15-minute setup time is competitive advantage
   - Implementation: Default API routes, standard message format

4. **TypeScript-First** - Build with TS, export all interfaces
   - Why: Better DX, catches errors early, enables IDE autocomplete
   - Implementation: Full generic support, exported types

5. **Callback Hooks** - onFinish, onError, onData events
   - Why: Easy integration with analytics, logging, error handling
   - Implementation: Optional callbacks in hook options

6. **Framework Adapters** - Same API, different packages
   - Why: Reach wider audience without compromising each framework
   - Implementation: `@clarity/react`, `@clarity/vue`, etc.

### Streaming Approaches

1. **Status-Based UI Updates** - Use granular status for conditional rendering
   - Why: Clean way to show loading, streaming, ready states
   - Implementation: Return status from hooks, update based on stream state

2. **Incremental Object Building** - Stream and parse JSON progressively
   - Why: Show partial results immediately, better UX than waiting
   - Implementation: `DeepPartial<T>` type, progressive parsing

3. **Message Metadata** - Attach token usage, timing to messages
   - Why: Enable token budgets, performance monitoring, cost tracking
   - Implementation: `metadata` field on messages with usage stats

4. **Stream Throttling** - Limit UI update frequency
   - Why: Prevent UI thrashing on fast streams
   - Implementation: `experimental_throttle` option

5. **Multiple Stream Types** - Text, objects, UI components
   - Why: Different use cases need different streaming patterns
   - Implementation: Different hooks and response types

6. **Server Stream Response Helpers** - Easy conversion to streamable responses
   - Why: Reduce boilerplate in API routes
   - Implementation: `.toUIMessageStreamResponse()` pattern

### Key Takeaways for Clarity Chat

**DO**:

- Provide headless hooks in addition to UI components
- Support request-level configuration overrides
- Include granular status states beyond loading/error
- Build TypeScript-first with full type inference
- Make simple cases extremely simple (15-min setup)
- Include stop/regenerate controls in streaming
- Support metadata for usage tracking
- Provide sensible defaults with deep customization

**DON'T**:

- Couple state management to UI implementation
- Force single configuration style
- Use only boolean loading states
- Sacrifice type safety for convenience
- Require complex setup for basic usage
- Forget streaming control UX
- Ignore token usage and cost tracking
- Make simple cases require complex configuration

**COMPETITIVE EDGE**:

- Vercel has no UI components - Clarity can provide both hooks AND components
- RSC is experimental - Clarity can focus on production-ready patterns
- Documentation gaps - Clarity can have comprehensive docs from day one
- Focus on clarity and simplicity in API design
- Provide UI implementation guidance that Vercel lacks
