# API Design Patterns Extracted from Competitors

**Research Date**: January 27, 2026 **Sources**: 10 competitive analysis reports **Purpose**:
Identify common API design patterns across AI chat component libraries

---

## Component Prop Patterns

### Simple Prop APIs

**Found in**: shadcn/ui AI, Ant Design X, Prompt Kit, Blocks.so

**Characteristics**:

- Flat prop structure
- Direct value passing
- Minimal nesting
- Clear prop names

**Example from Ant Design X**:

```tsx
<Sender onSubmit={handleSubmit} placeholder="Type a message" loading={isLoading} />
```

**Example from Blocks.so**:

```tsx
<AIChatWithModelSelection onSubmit={handleSubmit} value={input} onChange={setInput} />
```

**Benefits**:

- Easy to learn
- Minimal cognitive overhead
- Quick to prototype

**Trade-offs**:

- Limited customization depth
- Can become unwieldy with many options

---

### Slot-Based Customization

**Found in**: Ant Design X, Assistant UI, Vercel AI SDK

**Characteristics**:

- Named slots for UI sections
- Prefix/suffix patterns
- Header/footer patterns
- Action slots

**Example from Ant Design X**:

```tsx
<Sender
  prefix={<Icon type="mic" />}
  suffix={<Button icon={<SendOutlined />} />}
  header={<ChatHeader />}
  footer={<ChatFooter />}
/>
```

**Example from Vercel AI SDK**:

```tsx
<Message header={<MessageHeader />} footer={<MessageFooter />} actions={<MessageActions />} />
```

**Benefits**:

- Flexible UI composition
- Maintains component structure
- Easy to understand injection points

**Trade-offs**:

- Limited to predefined slots
- Can't restructure core layout

---

### Configuration Objects

**Found in**: Vercel AI SDK, LangChain UI, CopilotKit

**Characteristics**:

- Grouped related options
- Nested configuration
- Type-safe sub-objects
- Clear concern separation

**Example from Vercel AI SDK**:

```tsx
<ChatInput
  suggestions={{
    enabled: true,
    max: 3,
    debounce: 300,
  }}
  streaming={{
    enabled: true,
    chunkSize: 50,
  }}
/>
```

**Example from CopilotKit**:

```tsx
<CopilotTextarea
  autosuggestionsConfig={{
    textareaPurpose: 'Task description',
    chatApiConfigs: {
      maxTokens: 1000,
      temperature: 0.7,
    },
  }}
/>
```

**Benefits**:

- Organized configuration
- Autocomplete friendly
- Easy to extend
- Clear grouping

**Trade-offs**:

- More verbose
- Deeper nesting
- Requires object creation

---

### Render Props Pattern

**Found in**: Vercel AI SDK, Assistant UI, CopilotKit

**Characteristics**:

- Functions as children
- Custom rendering control
- Flexible UI structure
- Access to component state

**Example from Vercel AI SDK**:

```tsx
<Messages>
  {(message) => (
    <div className="custom-message">
      {message.content}
      {message.role === 'assistant' && <CopyButton />}
    </div>
  )}
</Messages>
```

**Example from CopilotKit**:

```tsx
<CopilotChat
  components={{
    Message: ({ message }) => <CustomMessageBubble message={message} />,
  }}
/>
```

**Benefits**:

- Maximum flexibility
- Full control over rendering
- Access to internal state
- Easy to customize

**Trade-offs**:

- More boilerplate
- Requires more knowledge
- Can be verbose

---

### Builder/Chaining Pattern

**Found in**: Prompt Kit, Ant Design X

**Characteristics**:

- Fluent API
- Method chaining
- Progressive configuration
- Composable operations

**Example from Prompt Kit**:

```tsx
const prompt = usePromptBuilder()
  .withSystemMessage('You are a helpful assistant')
  .withUserMessage(input)
  .withMaxTokens(1000)
  .withTemperature(0.7)
  .build()
```

**Benefits**:

- Intuitive API
- Self-documenting
- Easy to chain operations
- Discoverable via autocomplete

**Trade-offs**:

- Less common in React
- Can be harder to type
- May require more setup

---

## Composition Patterns

### Compound Components

**Found in**: Assistant UI, Vercel AI SDK, shadcn/ui AI, Ant Design X

**Characteristics**:

- Parent-child component relationships
- Shared implicit state
- Dot notation naming
- Clear hierarchy

**Example from Assistant UI**:

```tsx
<Thread>
  <Thread.Viewport>
    <Thread.Messages />
    <Thread.Followup />
  </Thread.Viewport>
  <Thread.ScrollToBottom />
  <Thread.Input />
</Thread>
```

**Example from Vercel AI SDK (implied pattern)**:

```tsx
<Chat>
  <Chat.Messages />
  <Chat.Input />
  <Chat.Suggestions />
</Chat>
```

**Example from Ant Design X**:

```tsx
<XAgent>
  <XAgent.Request>
    <Sender />
  </XAgent.Request>
  <XAgent.Response>
    <MessageList />
  </XAgent.Response>
</XAgent>
```

**Benefits**:

- Clear component relationships
- Shared context automatically
- Flexible layout composition
- Self-documenting structure

**Trade-offs**:

- More components to learn
- Context overhead
- Must understand relationships

**Common in**: All major libraries as primary pattern

---

### Headless Components

**Found in**: Vercel AI SDK, CopilotKit, Assistant UI

**Characteristics**:

- Logic without UI
- Hooks-based
- Bring-your-own-UI
- Maximum flexibility

**Example from Vercel AI SDK**:

```tsx
const { messages, input, handleSubmit, handleInputChange } = useChat()

return (
  <div className="my-chat">
    {messages.map((msg) => (
      <div key={msg.id}>{msg.content}</div>
    ))}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
    </form>
  </div>
)
```

**Example from CopilotKit**:

```tsx
const { messages, sendMessage, isLoading } = useCopilotChat()

return <CustomChatUI messages={messages} onSend={sendMessage} loading={isLoading} />
```

**Benefits**:

- Complete UI control
- No styling constraints
- Framework agnostic (hooks level)
- Easy to customize

**Trade-offs**:

- More implementation work
- No default UI
- Higher learning curve

**Common in**: All modern libraries as advanced option

---

### Provider Pattern

**Found in**: Assistant UI, Vercel AI SDK, CopilotKit, LangChain UI

**Characteristics**:

- Context-based state sharing
- Top-level configuration
- Shared runtime
- Nested provider support

**Example from Assistant UI**:

```tsx
<AssistantRuntimeProvider runtime={runtime}>
  <Thread />
  <Sidebar />
</AssistantRuntimeProvider>
```

**Example from Vercel AI SDK**:

```tsx
<ChatProvider>
  <ChatMessages />
  <ChatInput />
</ChatProvider>
```

**Example from CopilotKit**:

```tsx
<CopilotKit runtimeUrl="/api/copilotkit">
  <CopilotSidebar />
  <YourApp />
</CopilotKit>
```

**Benefits**:

- Centralized configuration
- Shared state management
- Clean component tree
- Easy to add features

**Trade-offs**:

- Context overhead
- Must understand provider placement
- Can be hard to debug

**Common in**: Universal pattern across all libraries

---

### Primitive Composition

**Found in**: shadcn/ui AI, Blocks.so

**Characteristics**:

- Low-level building blocks
- Copy-paste primitives
- Compose your own
- No runtime dependency

**Example from shadcn/ui AI**:

```tsx
// You compose primitives into your own component
import { ChatBubble } from '@/components/ui/chat/chat-bubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'

function MyChat() {
  return (
    <div className="chat-container">
      <ChatMessageList>
        {messages.map((m) => (
          <ChatBubble key={m.id} variant={m.role}>
            {m.content}
          </ChatBubble>
        ))}
      </ChatMessageList>
      <ChatInput onSubmit={handleSubmit} />
    </div>
  )
}
```

**Example from Blocks.so**:

```tsx
// Copy entire pre-composed block
import { AIChatWithModelSelection } from '@/components/ai-02'

// Or copy individual pieces and compose yourself
```

**Benefits**:

- No dependency bloat
- Full code ownership
- Easy to modify
- No black boxes

**Trade-offs**:

- More manual work
- No automatic updates
- Must maintain yourself

**Philosophy**: "Copy code, not packages"

---

### Slot-Based Composition

**Found in**: Ant Design X, Assistant UI

**Characteristics**:

- Named slots for sections
- Predefined extension points
- Maintains structure
- Easy to customize

**Example from Ant Design X**:

```tsx
<Conversations
  items={conversations}
  renderItem={(info) => (
    <Conversations.Item
      label={info.label}
      actions={<Button>Delete</Button>}
      extra={<Badge count={info.unread} />}
    />
  )}
/>
```

**Example from Assistant UI**:

```tsx
<Composer send={<CustomSendButton />} attachments={<CustomAttachmentArea />} />
```

**Benefits**:

- Flexible customization
- Maintains component structure
- Clear injection points

**Trade-offs**:

- Limited to predefined slots
- Can't fully restructure

---

## Hook Patterns

### Chat Hooks

**Found in**: Vercel AI SDK, CopilotKit, Assistant UI

**Characteristics**:

- Manage chat state
- Handle message flow
- Provide control functions
- Stream-aware

**Example from Vercel AI SDK**:

```tsx
const {
  messages, // Message[] - all messages
  input, // string - current input
  handleSubmit, // (e: FormEvent) => void
  handleInputChange, // (e: ChangeEvent) => void
  append, // (message: Message) => Promise<void>
  reload, // () => Promise<void>
  stop, // () => void
  isLoading, // boolean
  error, // Error | undefined
} = useChat({
  api: '/api/chat',
  onResponse: (response) => {},
  onFinish: (message) => {},
  onError: (error) => {},
})
```

**Example from CopilotKit**:

```tsx
const { messages, sendMessage, isLoading, stop, regenerate, setMessages } = useCopilotChat()
```

**Example from Assistant UI**:

```tsx
const { messages, append, reload, isRunning } = useThread()
```

**Common Pattern**:

- Return object with state + actions
- Streaming-aware flags
- Control functions (stop, reload, regenerate)
- Lifecycle callbacks

**Benefits**:

- Complete control
- Predictable API
- Easy to test
- Framework patterns

**Trade-offs**:

- Must build UI
- More manual wiring

---

### Completion Hooks

**Found in**: Vercel AI SDK

**Characteristics**:

- Single completion request
- Text generation
- No message history
- Streaming support

**Example from Vercel AI SDK**:

```tsx
const {
  completion, // string - generated text
  input, // string - current input
  handleSubmit, // (e: FormEvent) => void
  handleInputChange, // (e: ChangeEvent) => void
  isLoading, // boolean
  error, // Error | undefined
  stop, // () => void
} = useCompletion({
  api: '/api/completion',
  onResponse: (response) => {},
  onFinish: (completion) => {},
  onError: (error) => {},
})
```

**Use Cases**:

- Autocomplete
- Text generation
- Single-shot completions
- Form assistance

**Benefits**:

- Simpler than chat
- No message management
- Focused use case

**Trade-offs**:

- No conversation history
- Limited to text output

---

### Context/Readable Hooks

**Found in**: CopilotKit

**Characteristics**:

- Inject app context to AI
- Automatic prompt enhancement
- Reactive updates
- Scoped to component tree

**Example from CopilotKit**:

```tsx
const { user, cart } = useAppState()

useCopilotReadable({
  description: 'Current user information',
  value: user,
  categories: ['user_context'],
})

useCopilotReadable({
  description: 'Shopping cart contents',
  value: cart,
  convert: (cart) => JSON.stringify(cart),
})
```

**Benefits**:

- No manual prompt engineering
- Automatic context injection
- Reactive to state changes
- Component-scoped

**Trade-offs**:

- Framework-specific
- Must understand context flow

---

### Tool Hooks

**Found in**: CopilotKit, LangChain UI

**Characteristics**:

- Register AI tools/functions
- Render tool results as UI
- Schema validation
- Async handlers

**Example from CopilotKit**:

```tsx
useFrontendTool({
  name: 'show_weather',
  description: 'Display weather information',
  parameters: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string(),
  }),
  render: ({ city, temperature, condition }, status) => (
    <WeatherCard
      city={city}
      temp={temperature}
      condition={condition}
      loading={status === 'executing'}
    />
  ),
  handler: async ({ city }) => {
    const weather = await fetchWeather(city)
    return weather
  },
})
```

**Example from LangChain UI**:

```tsx
useRenderToolCall({
  name: 'database_query',
  render: (args, result, status) => (
    <DatabaseQueryResult query={args.sql} results={result} executing={status === 'executing'} />
  ),
})
```

**Benefits**:

- Generative UI pattern
- Type-safe tool definitions
- Visual tool results
- Interactive components

**Trade-offs**:

- Complex setup
- Framework-specific
- Requires backend integration

---

### Agent Hooks

**Found in**: CopilotKit, LangChain UI

**Characteristics**:

- Connect to AI agents
- Bidirectional state
- Real-time updates
- Agent control

**Example from CopilotKit**:

```tsx
const { agent } = useAgent({
  agentId: 'weather_agent',
  name: 'Weather Assistant',
  initialState: { city: 'New York' },
})

// Read agent state
console.log(agent.state.city)

// Update agent state
agent.setState({ city: 'San Francisco' })

// Control agent
await agent.run("What's the weather?")
agent.stop()

// Status
console.log(agent.status) // 'idle' | 'running' | 'stopped' | 'error'
```

**Benefits**:

- Full agent integration
- Bidirectional state flow
- Real-time updates
- Programmatic control

**Trade-offs**:

- Requires agent framework
- Complex state management
- Higher learning curve

---

## SDK Initialization Patterns

### Direct LLM Integration

**Found in**: Vercel AI SDK, CopilotKit

**Characteristics**:

- Direct API calls
- Provider adapters
- Configuration objects
- Edge runtime support

**Example from Vercel AI SDK**:

```tsx
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: 'You are a helpful assistant.',
  })

  return result.toDataStreamResponse()
}
```

**Example from CopilotKit**:

```tsx
import { CopilotRuntime } from '@copilotkit/runtime'
import { OpenAIAdapter } from '@copilotkit/runtime'

const runtime = new CopilotRuntime({
  adapter: new OpenAIAdapter({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  }),
})

export async function POST(req: Request) {
  return runtime.handleRequest(req)
}
```

**Benefits**:

- Simple setup
- Direct control
- No middleware
- Flexible configuration

**Trade-offs**:

- Manual implementation
- No built-in orchestration

---

### Agent Framework Integration

**Found in**: LangChain UI, CopilotKit

**Characteristics**:

- Framework adapters
- Complex orchestration
- Multi-step workflows
- Tool integration

**Example from LangChain UI**:

```tsx
import { LangGraphAdapter } from '@copilotkit/runtime'
import { myAgent } from './agents/myAgent'

const runtime = new CopilotRuntime({
  adapter: new LangGraphAdapter({
    agent: myAgent,
    agentId: 'my_agent',
  }),
})
```

**Example from CopilotKit with LangGraph**:

```tsx
import { graph } from './my-langgraph-agent'

const runtime = new CopilotRuntime({
  adapter: new LangGraphAdapter({
    graph,
    agentId: 'complex_agent',
  }),
})
```

**Benefits**:

- Complex orchestration
- Multi-agent support
- Rich ecosystem
- Advanced patterns

**Trade-offs**:

- Higher complexity
- Framework dependency
- Steeper learning curve

---

### Runtime Provider Pattern

**Found in**: Assistant UI, CopilotKit

**Characteristics**:

- Abstract runtime layer
- Custom implementations
- Backend agnostic
- Flexible integration

**Example from Assistant UI**:

```tsx
// Custom runtime
import { useLocalRuntime } from '@assistant-ui/react'

const MyApp = () => {
  const runtime = useLocalRuntime(adapter)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  )
}
```

**Benefits**:

- Backend flexibility
- Custom implementations
- Easy to swap backends
- Testing friendly

**Trade-offs**:

- More abstraction
- Must implement runtime

---

### Edge Runtime Support

**Found in**: Vercel AI SDK

**Characteristics**:

- Edge function compatible
- Streaming support
- Low latency
- Global deployment

**Example from Vercel AI SDK**:

```tsx
export const runtime = 'edge'

export async function POST(req: Request) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: await req.json(),
  })

  return result.toDataStreamResponse()
}
```

**Benefits**:

- Low latency
- Global distribution
- Cost effective
- Scalable

**Trade-offs**:

- Runtime limitations
- Size constraints

---

## Configuration Patterns

### Flat Configuration

**Found in**: Blocks.so, shadcn/ui AI

**Characteristics**:

- All options at top level
- Simple prop passing
- No nesting
- Easy to understand

**Example**:

```tsx
<AIChat
  model="gpt-4"
  temperature={0.7}
  maxTokens={1000}
  streaming={true}
  onResponse={handleResponse}
/>
```

**Benefits**:

- Simple API
- Easy to learn
- Quick prototyping

**Trade-offs**:

- Can become cluttered
- Limited organization

---

### Nested Configuration

**Found in**: Vercel AI SDK, CopilotKit, Ant Design X

**Characteristics**:

- Grouped related options
- Hierarchical structure
- Type-safe objects
- Clear organization

**Example from Vercel AI SDK**:

```tsx
const { messages } = useChat({
  api: '/api/chat',
  experimental_throttle: 50,
  onResponse: (response) => {},
  onFinish: (message) => {},
  body: {
    user: userId,
    context: appContext,
  },
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

**Example from Ant Design X**:

```tsx
<Conversations
  items={conversations}
  menu={(conversation) => ({
    items: [
      { key: 'delete', label: 'Delete' },
      { key: 'archive', label: 'Archive' },
    ],
  })}
  renderItem={(info) => <Conversations.Item {...info} />}
/>
```

**Benefits**:

- Organized configuration
- Autocomplete friendly
- Scalable
- Clear grouping

**Trade-offs**:

- More verbose
- Deeper nesting

---

### UI-Driven Configuration

**Found in**: Blocks.so

**Characteristics**:

- Runtime UI controls
- User-facing configuration
- Dropdowns and toggles
- No prop-based config

**Example from Blocks.so**:

```tsx
// Component provides UI controls
<AIChatCompact
// Configuration happens through:
// - Dropdown menus (model, mode, performance)
// - Toggle switches (streaming, auto-complete)
// - Settings panels
/>
```

**Benefits**:

- User control
- Discoverable options
- No props needed
- Dynamic configuration

**Trade-offs**:

- Less programmatic control
- UI complexity
- State management needed

---

### Builder Pattern

**Found in**: Prompt Kit

**Characteristics**:

- Fluent API
- Method chaining
- Progressive building
- Type-safe

**Example**:

```tsx
const config = createChatConfig()
  .withModel('gpt-4')
  .withTemperature(0.7)
  .withMaxTokens(1000)
  .withSystemMessage('You are helpful')
  .build()

;<Chat config={config} />
```

**Benefits**:

- Intuitive API
- Self-documenting
- Type-safe chaining
- Reusable configs

**Trade-offs**:

- Less common in React
- More setup code

---

## Theming Approaches

### CSS Variables

**Found in**: shadcn/ui AI, Magic UI, Blocks.so

**Characteristics**:

- CSS custom properties
- Runtime theming
- Dark/light mode
- Easy customization

**Example from shadcn/ui AI**:

```css
:root {
  --chat-background: white;
  --chat-message-user: #007bff;
  --chat-message-assistant: #f3f4f6;
  --chat-text: #1f2937;
}

.dark {
  --chat-background: #1f2937;
  --chat-message-user: #3b82f6;
  --chat-message-assistant: #374151;
  --chat-text: #f9fafb;
}
```

**Benefits**:

- Runtime switching
- No rebuild needed
- Easy to override
- Standard CSS

**Trade-offs**:

- Limited to colors/sizes
- Browser support needed

---

### Tailwind-Based

**Found in**: shadcn/ui AI, Blocks.so, Magic UI

**Characteristics**:

- Utility classes
- Theme configuration
- Dark mode utilities
- Responsive design

**Example**:

```tsx
<div className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-50">
  <ChatMessage className="bg-muted dark:bg-slate-800" />
</div>
```

**Tailwind Config**:

```js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      muted: 'hsl(var(--muted))'
    }
  }
}
```

**Benefits**:

- Rapid styling
- Consistent design
- Responsive utilities
- Dark mode support

**Trade-offs**:

- Requires Tailwind
- Class name verbosity

---

### Component Prop Theming

**Found in**: CopilotKit, Ant Design X

**Characteristics**:

- Props for customization
- Icon replacement
- Label customization
- Sub-component styling

**Example from CopilotKit**:

```tsx
<CopilotSidebar
  className="custom-sidebar"
  icons={{
    openIcon: <CustomOpenIcon />,
    closeIcon: <CustomCloseIcon />,
    spinnerIcon: <CustomSpinner />,
  }}
  labels={{
    title: 'My Assistant',
    initial: 'How can I help?',
    placeholder: 'Ask me anything...',
  }}
/>
```

**Example from Ant Design X**:

```tsx
<Sender
  prefix={<Icon type="mic" />}
  suffix={<Button icon={<SendOutlined />} />}
  placeholder="Type a message..."
/>
```

**Benefits**:

- Type-safe
- Component-level control
- Easy to understand
- Flexible

**Trade-offs**:

- More props
- Can be verbose

---

### Design Token System

**Found in**: Ant Design X

**Characteristics**:

- Semantic tokens
- Centralized design
- Theme configuration
- Consistent system

**Example from Ant Design X**:

```tsx
import { ConfigProvider } from 'antd'

;<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#00b96b',
      borderRadius: 8,
      fontSize: 14,
    },
    components: {
      Conversations: {
        itemBg: '#f5f5f5',
        itemHoverBg: '#e8e8e8',
      },
    },
  }}
>
  <Conversations />
</ConfigProvider>
```

**Benefits**:

- Centralized theming
- Consistent design
- Easy to maintain
- Type-safe tokens

**Trade-offs**:

- Requires setup
- Framework-specific

---

## Context Usage Patterns

### Simple Context Provider

**Found in**: Vercel AI SDK, shadcn/ui AI

**Characteristics**:

- Single provider
- Shared state
- No nesting needed
- Simple API

**Example**:

```tsx
<ChatProvider>
  <ChatMessages />
  <ChatInput />
  <ChatSidebar />
</ChatProvider>
```

**Benefits**:

- Simple setup
- Easy to understand
- Single source of truth

**Trade-offs**:

- Limited flexibility
- Global state only

---

### Nested Context Providers

**Found in**: Assistant UI, CopilotKit

**Characteristics**:

- Multiple providers
- Hierarchical context
- Scoped state
- Composable

**Example from Assistant UI**:

```tsx
<AssistantRuntimeProvider runtime={runtime}>
  <Thread>
    <ThreadProvider>
      <Messages />
      <Composer />
    </ThreadProvider>
  </Thread>
</AssistantRuntimeProvider>
```

**Benefits**:

- Scoped state
- Multiple contexts
- Flexible composition

**Trade-offs**:

- More complex
- Must understand hierarchy

---

### Context with Hooks

**Found in**: All modern libraries

**Characteristics**:

- Hook-based access
- Type-safe
- Easy to consume
- Standard React pattern

**Example**:

```tsx
// Provider
;<ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>

// Consumer hook
function MyComponent() {
  const { messages, sendMessage } = useChatContext()
  return <div>...</div>
}
```

**Benefits**:

- Standard React
- Type-safe
- Easy to test
- Composable

**Trade-offs**:

- Requires hook understanding
- Context overhead

---

### Scoped Context

**Found in**: CopilotKit

**Characteristics**:

- Component tree scoped
- No global pollution
- Multiple instances
- Isolated state

**Example from CopilotKit**:

```tsx
function TaskManager() {
  // Context scoped to this subtree
  useCopilotReadable({
    description: 'Tasks',
    value: tasks,
  })

  return <CopilotSidebar /> // Has access to tasks
}

function ProjectManager() {
  // Different context scope
  useCopilotReadable({
    description: 'Projects',
    value: projects,
  })

  return <CopilotSidebar /> // Has access to projects
}
```

**Benefits**:

- No pollution
- Multiple instances
- Clear boundaries
- Testable

**Trade-offs**:

- Must understand scoping
- Can be confusing

---

## Common Patterns Across Multiple Libraries

### 1. Streaming Support

**Found in**: Vercel AI SDK, CopilotKit, Assistant UI, LangChain UI, Ant Design X

**Common Pattern**:

```tsx
// All provide streaming-aware states
const { isLoading, isStreaming, stop } = useChat()

// All support stop() during streaming
;<Button onClick={stop} disabled={!isStreaming}>
  Stop
</Button>

// All provide chunk-by-chunk updates
messages.map((msg) => <Message content={msg.content} streaming={msg.isStreaming} />)
```

**Universal Features**:

- Stream-aware boolean flags
- Stop function
- Chunk handling
- Real-time updates

---

### 2. Message Structure

**Found in**: All libraries

**Common Pattern**:

```tsx
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
  metadata?: Record<string, any>
}
```

**Universal Properties**:

- Unique ID
- Role distinction
- Content field
- Timestamp
- Extensible metadata

---

### 3. Callback Lifecycle

**Found in**: Vercel AI SDK, CopilotKit, Assistant UI

**Common Pattern**:

```tsx
useChat({
  onResponse: (response) => {}, // Stream starts
  onFinish: (message) => {}, // Stream completes
  onError: (error) => {}, // Error occurs
})
```

**Universal Callbacks**:

- Start/response
- Finish/complete
- Error handling

---

### 4. Input Handling

**Found in**: All libraries

**Common Pattern**:

```tsx
const { input, handleInputChange, handleSubmit } = useChat()

;<form onSubmit={handleSubmit}>
  <input value={input} onChange={handleInputChange} />
</form>
```

**Universal Features**:

- Controlled input
- Form submission
- Change handlers

---

### 5. Loading States

**Found in**: All libraries

**Common Pattern**:

```tsx
const { isLoading } = useChat()

;<Button type="submit" disabled={isLoading}>
  {isLoading ? 'Sending...' : 'Send'}
</Button>
```

**Universal States**:

- Boolean loading flag
- Disabled during loading
- Loading indicators

---

### 6. Provider Pattern

**Found in**: All modern libraries

**Common Pattern**:

```tsx
<ChatProvider config={config}>
  <ChatComponents />
</ChatProvider>
```

**Universal Features**:

- Top-level provider
- Centralized config
- Shared state

---

### 7. Compound Component Pattern

**Found in**: Assistant UI, Ant Design X, shadcn/ui AI (implied)

**Common Pattern**:

```tsx
<Chat>
  <Chat.Messages />
  <Chat.Input />
</Chat>
```

**Universal Features**:

- Dot notation
- Implicit state sharing
- Flexible composition

---

### 8. Headless + Styled Variants

**Found in**: Vercel AI SDK, CopilotKit, shadcn/ui AI

**Common Pattern**:

```tsx
// Headless
import { useChat } from 'library/hooks'

// Styled
import { Chat } from 'library/components'
```

**Universal Approach**:

- Headless hooks for logic
- Styled components for UI
- Both options available

---

## Key Insights

### Most Common Patterns

1. **Provider Pattern** - Universal across all libraries
2. **Hook-Based APIs** - Standard in modern React libraries
3. **Compound Components** - Preferred for complex UIs
4. **Streaming Support** - Essential for AI applications
5. **Message-Based Architecture** - Common data model
6. **Callback Lifecycle** - Standard event handling

### Emerging Patterns

1. **Generative UI** - Tools render as components (CopilotKit, LangChain)
2. **Context Awareness** - Auto-inject app state (CopilotKit)
3. **Agent Integration** - Direct agent framework support (CopilotKit, LangChain)
4. **Human-in-the-Loop** - Approval workflows (CopilotKit)
5. **Bidirectional State** - Agent ↔️ App state sharing (CopilotKit)

### Design Philosophy Trends

1. **Headless First** - Separate logic from UI
2. **Progressive Enhancement** - Simple → Complex customization path
3. **Type Safety** - TypeScript + Zod validation
4. **Copy-Paste Culture** - Own your code (shadcn, Blocks.so)
5. **Framework Flexibility** - Support multiple backends

### Anti-Patterns to Avoid

1. **Mega Components** - Single component with 100+ props
2. **Global Configuration Only** - No component-level overrides
3. **Prop Drilling** - Use context instead
4. **Tightly Coupled UI** - Separate logic from presentation
5. **No Streaming Support** - Essential for AI
6. **Hardcoded Prompts** - Allow dynamic configuration

---

## Recommendations for Clarity

### Core API Design

1. **Adopt**: Headless hooks + styled components (like Vercel + CopilotKit)
2. **Adopt**: Compound component pattern (like Assistant UI)
3. **Adopt**: Provider pattern with nested contexts (like Assistant UI)
4. **Adopt**: Streaming-first architecture (universal)
5. **Adopt**: Type-safe with Zod (like CopilotKit)

### Unique Opportunities

1. **Better than CopilotKit**: Simpler agent integration
2. **Better than Vercel**: Pre-built components included
3. **Better than shadcn**: Runtime package, not just copy-paste
4. **Better than Blocks.so**: Composable primitives + prebuilts
5. **Better than all**: Multi-framework support (React, Vue, Svelte)

### API Signature Recommendations

**Chat Hook**:

```tsx
const {
  messages,
  input,
  handleSubmit,
  handleInputChange,
  append,
  reload,
  stop,
  isLoading,
  isStreaming,
  error,
} = useClarityChat({
  api: '/api/chat',
  onResponse: (response) => {},
  onFinish: (message) => {},
  onError: (error) => {},
})
```

**Component API**:

```tsx
<Clarity.Chat>
  <Clarity.Messages />
  <Clarity.Input />
</Clarity.Chat>

// Or prebuilt
<ClarityChat config={config} />
```

**Generative UI**:

```tsx
useClarityTool({
  name: 'show_weather',
  parameters: z.object({
    city: z.string(),
    temp: z.number(),
  }),
  render: (args, status) => <WeatherCard {...args} />,
})
```

**Context Awareness**:

```tsx
useClarityContext({
  description: 'User preferences',
  value: preferences,
})
```

---

## Sources

1. shadcn/ui AI - `/docs/research/competitors/shadcn-ai.md`
2. Vercel AI SDK - `/docs/research/competitors/vercel-ai.md`
3. Ant Design X - `/docs/research/competitors/ant-design-x.md`
4. Prompt Kit - `/docs/research/competitors/prompt-kit.md`
5. Assistant UI - `/docs/research/competitors/assistant-ui.md`
6. Aceternity UI - `/docs/research/competitors/aceternity-ui.md`
7. Blocks.so AI - `/docs/research/competitors/blocks-ai.md`
8. LangChain UI - `/docs/research/competitors/langchain-ui.md`
9. CopilotKit - `/docs/research/competitors/copilotkit.md`
10. Magic UI - `/docs/research/competitors/magic-ui.md`

---

**Analysis Complete**: January 27, 2026
