# Assistant UI

## Overview

- **Repository URL**: https://github.com/Yonom/assistant-ui
- **Documentation URL**: https://www.assistant-ui.com/docs
- **GitHub stars**: 8,200+
- **License**: MIT
- **Maintained by**: Y Combinator-backed open-source project (Yonom/assistant-ui)
- **Latest version**: @assistant-ui/tap@0.3.0 (November 2025)
- **NPM Package**: @assistant-ui/react (2,200+ dependent projects)
- **Contributors**: 111+
- **Commits**: 2,535+ on main branch
- **Maintenance Status**: Actively maintained (1,132 releases tracked)

## Project Philosophy

Assistant UI is an open-source TypeScript/React library that brings "the UX of ChatGPT in your React
app" through **composable primitives** rather than monolithic components. The architecture is
inspired by Radix UI and shadcn/ui, emphasizing:

- **Composability over monolithic solutions**: Provide building blocks, not pre-built components
- **Robust defaults**: Handle complex features (streaming, auto-scroll, accessibility) out
  of the box
- **Complete customization**: "Full control over every pixel" while maintaining functionality
- **Provider-agnostic**: Works with Claude, ChatGPT, Grok, Perplexity, and other LLM providers
- **Backend-flexible**: Supports AI SDK, LangGraph, Mastra, custom protocols

## Component Architecture

### Core Components

Assistant UI provides three main component patterns:

1. **Thread** - Main chat container with messages and composer
2. **AssistantModal** - Floating chat bubble for overlay experiences
3. **AssistantSidebar** - Co-pilot side panel for form-filling and assistance

All components are built from **primitive components** that can be composed together.

### Component Hierarchy

```
AssistantRuntimeProvider (root context)
  └── Thread.Root
      ├── Thread.Viewport
      │   ├── Thread.Empty (conditional)
      │   ├── Thread.Messages
      │   │   └── Message.Root (per message)
      │   │       ├── Message.Parts / Message.Content
      │   │       ├── Message.Attachments
      │   │       └── ActionBar.Root
      │   └── Thread.ViewportFooter
      ├── Thread.ScrollToBottom
      ├── Thread.Suggestions
      └── Composer.Root
          ├── Composer.Input
          ├── Composer.Attachments
          └── Composer.Send
```

### Primitive Component Categories

**Thread Management** (16 primitives in `/primitives/thread/`):

- `ThreadPrimitiveRoot` - Core thread wrapper
- `ThreadPrimitiveEmpty` - Empty state display
- `ThreadPrimitiveIf` - Conditional rendering
- `ThreadPrimitiveViewport` - Scrollable container
- `ThreadPrimitiveViewportProvider` - Viewport context
- `ThreadPrimitiveViewportFooter` - Footer area
- `ThreadPrimitiveViewportSlack` - Alternative viewport
- `ThreadPrimitiveMessages` - Message list renderer
- `ThreadPrimitiveMessageByIndex` - Indexed message access
- `ThreadPrimitiveScrollToBottom` - Scroll utility
- `ThreadPrimitiveSuggestion` - Single suggestion
- `ThreadPrimitiveSuggestions` - Suggestion group
- `ThreadPrimitiveSuggestionByIndex` - Indexed suggestion access
- `threadList/` - Multi-thread list view
- `threadListItem/` - Individual thread item
- `threadListItemMore/` - Extended thread actions

**Message Handling** (7 primitives in `/primitives/message/`):

- `MessagePrimitiveRoot` - Main message container
- `MessagePrimitiveParts` / `MessagePrimitiveContent` - Content rendering
- `MessagePrimitivePartByIndex` - Individual part access
- `MessagePrimitiveIf` - Conditional rendering
- `MessagePrimitiveAttachments` - Attachment container
- `MessagePrimitiveAttachmentByIndex` - Individual attachment access
- `MessagePrimitiveError` - Error state display
- `Unstable_PartsGrouped` - Grouped rendering (experimental)
- `Unstable_PartsGroupedByParentId` - Parent-based grouping (experimental)

**User Input**:

- `composer/` - Message composition interface
- `attachment/` - File attachment handling
- `suggestion/` - AI-generated suggestions
- `reasoning/` - Reasoning display (extended model output)

**UI Controls**:

- `actionBar/` - Primary action toolbar
- `actionBarMore/` - Extended actions menu
- `branchPicker/` - Conversation branch selection
- `assistantModal/` - Modal dialog wrapper
- `error/` - Error state display

### Composition Patterns

**Compound Component Pattern**: Each primitive exposes sub-components that work together:

```typescript
<Thread.Root>
  <Thread.Viewport>
    <Thread.Messages />
  </Thread.Viewport>
  <Composer.Root>
    <Composer.Input />
    <Composer.Send />
  </Composer.Root>
</Thread.Root>
```

**Index-based Access**: Dynamic list rendering through indexed components:

```typescript
// Messages render via index
Array.from({ length: messagesLength }, (_, index) => (
  <ThreadPrimitiveMessageByIndex key={index} index={index} />
))
```

**Radix UI Primitives**: Built on top of Radix UI's `Primitive.div` and `Primitive.form`:

```typescript
// ComposerRoot extends Primitive.form
const ComposerPrimitiveRoot = forwardRef<Element, Props>((props, ref) => {
  const send = useComposerSend();
  return (
    <Primitive.form
      {...props}
      ref={ref}
      onSubmit={composeEventHandlers(props.onSubmit, handleSubmit)}
    />
  );
});
```

**Component Override Pattern**: Role-specific component customization:

```typescript
<ThreadPrimitiveMessages
  components={{
    UserMessage: CustomUserMessage,
    AssistantMessage: CustomAssistantMessage,
    SystemMessage: CustomSystemMessage,
    EditComposer: CustomEditComposer,
  }}
/>
```

## Thread Management

### Thread Concept

Assistant UI models conversations as **threads** with:

- Linear message history
- Branching support for conversation navigation
- Message editing capabilities
- Multi-turn conversation handling
- Streaming response support
- Interruption and retry mechanisms

Threads are the central state container for:

- Messages (user, assistant, system)
- Tool calls and results
- Attachments
- Message status (pending, streaming, complete, error)
- Conversation metadata

### State Management

**Store-based Architecture**: Uses `@assistant-ui/store` for state management:

```typescript
// Core hooks from store
useAui() // Main API hook
useAuiState() // State access hook
useAuiEvent() // Event handling hook
AuiProvider // Context provider
AuiIf // Conditional rendering component
```

**Runtime-based State**: Thread state is managed by **Runtime** objects:

- **AssistantRuntimeProvider**: Connects runtimes to components
- **ThreadRuntime**: Provides thread state, messages, viewport management
- **MessageRuntime**: Manages individual message state
- **ComposerRuntime**: Controls input and send functionality
- **AttachmentRuntime**: Handles file attachments

**State Access Pattern**:

```typescript
// Access thread state
const aui = useAui()
const threadState = useAuiState(() => aui.thread())

// Access message state
const messageState = useAuiState(() => aui.message())

// Access specific properties
const messagesLength = useAuiState(() => aui.thread().messages.length)
```

**Reactive Updates**: State hooks provide reactive updates optimized for streaming:

```typescript
// Component re-renders when messagesLength changes
const ThreadMessages = () => {
  const messagesLength = useAuiState(() => aui.thread().messages.length);
  return (
    <>
      {Array.from({ length: messagesLength }, (_, index) => (
        <MessageByIndex key={index} index={index} />
      ))}
    </>
  );
};
```

### Message History

**Thread Message Types**:

```typescript
// Union type of all message variants
type ThreadMessage = ThreadSystemMessage | ThreadUserMessage | ThreadAssistantMessage

// System messages
interface ThreadSystemMessage {
  role: 'system'
  content: string
}

// User messages with attachments
interface ThreadUserMessage {
  role: 'user'
  content: MessagePart[]
  readonly attachments: CompleteAttachment[]
}

// Assistant messages with status tracking
interface ThreadAssistantMessage {
  role: 'assistant'
  content: MessagePart[]
  status: MessageStatus
  readonly unstable_state?: unknown
  readonly unstable_annotations?: unknown
  readonly unstable_data?: unknown
}
```

**Message Status Tracking**:

```typescript
// Overall message state
type MessageStatus = 'running' | 'complete' | 'incomplete' | 'tool-calls' | 'interrupt'

// Individual part status
type MessagePartStatus = 'running' | 'complete' | 'incomplete'

// Tool call status
type ToolCallMessagePartStatus = 'running' | 'complete' | 'error'
```

**Message Parts**: Messages are composed of typed parts:

```typescript
type MessagePart =
  | TextMessagePart
  | ReasoningMessagePart
  | ImageMessagePart
  | FileMessagePart
  | ToolCallMessagePart
  | AudioMessagePart
```

**History Management**:

- Messages stored in thread state array
- Index-based access for efficient rendering
- Branching support through parent/source ID tracking
- Step tracking with usage metrics

```typescript
interface AppendMessage {
  parentId?: string
  sourceId?: string
  content: MessagePart[]
}

interface ThreadStep {
  messageId: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}
```

### API

```typescript
// Runtime Provider - connects runtime to components
import { AssistantRuntimeProvider } from "@assistant-ui/react";

<AssistantRuntimeProvider runtime={myRuntime}>
  <Thread />
</AssistantRuntimeProvider>

// Thread API - main hooks
import { useAui, useAuiState } from "@assistant-ui/react";

const MyComponent = () => {
  const aui = useAui();
  const thread = useAuiState(() => aui.thread());
  const messages = useAuiState(() => aui.thread().messages);

  return <div>Message count: {messages.length}</div>;
};

// Runtime types available
type Runtime =
  | LocalRuntime        // Custom in-memory runtime
  | ExternalStoreRuntime // External state management
  | DataStreamRuntime   // Data Stream Protocol
  | LangGraphRuntime    // LangGraph Cloud
  | CustomRuntime;      // Custom implementations

// Runtime configuration
interface RunConfig {
  [key: string]: unknown; // Custom properties for metadata
}
```

## Message Rendering

### Message Types

Assistant UI supports comprehensive message types:

**Text Messages**:

- Plain text content
- Markdown rendering with code highlighting
- Rich text formatting

**Code Blocks**:

- Syntax highlighting
- Copy functionality
- Language detection
- Line numbers

**Images**:

- Image attachments
- Inline image display
- Preview support

**Files**:

- File attachments
- Download functionality
- File metadata display

**Tool Calls**:

- Tool execution visualization
- Tool parameters display
- Tool results rendering
- Status indicators (pending, running, complete, error)

**Reasoning**:

- Extended model output
- Chain-of-thought display
- Reasoning visualization

**Audio**:

- Audio message parts
- Audio attachments
- Playback controls

**Attachments**:

- Multiple attachment support
- Attachment preview
- Attachment metadata

### Message Component API

```typescript
// Message Root Component
interface MessagePrimitiveRoot {
  // Extends standard div props
  props: ComponentPropsWithoutRef<typeof Primitive.div>

  // State access via hooks
  state: {
    message: ThreadMessage
    isHovering: boolean
    viewportRef: RefObject<HTMLElement>
  }

  // Composition
  children: ReactNode
}

// Message Parts Component
interface MessagePrimitiveParts {
  // Role-specific customization
  components?: {
    Text?: ComponentType<TextPartProps>
    Image?: ComponentType<ImagePartProps>
    File?: ComponentType<FilePartProps>
    ToolCall?: ComponentType<ToolCallPartProps>
    Reasoning?: ComponentType<ReasoningPartProps>
  }
}

// Message Content (alias for Parts)
type MessagePrimitiveContent = MessagePrimitiveParts

// Message Attachments
interface MessagePrimitiveAttachments {
  components?: {
    Attachment?: ComponentType<AttachmentProps>
  }
}

// Message Actions
interface ActionBarPrimitive {
  // Action buttons like copy, edit, regenerate
  children: ReactNode
}
```

**Message State Access**:

```typescript
const MyMessage = () => {
  const aui = useAui();
  const message = useAuiState(() => aui.message());
  const role = useAuiState(() => aui.message().role);
  const isEditing = useAuiState(() => aui.message().isEditing);

  return (
    <Message.Root>
      <Message.Parts />
      {role === 'assistant' && <ActionBar.Root />}
    </Message.Root>
  );
};
```

### Customization

**Component Override Pattern**:

```typescript
// Custom message rendering by role
<ThreadPrimitiveMessages
  components={{
    UserMessage: ({ message }) => (
      <div className="user-message">
        <Avatar user={message.user} />
        <Message.Content />
      </div>
    ),

    AssistantMessage: ({ message }) => (
      <div className="assistant-message">
        <Message.Content />
        <ActionBar.Root>
          <ActionBar.Copy />
          <ActionBar.Reload />
        </ActionBar.Root>
      </div>
    ),

    SystemMessage: ({ message }) => (
      <div className="system-message">
        {message.content}
      </div>
    ),
  }}
/>
```

**Part-level Customization**:

```typescript
// Custom rendering for specific message parts
<Message.Parts
  components={{
    Text: ({ part }) => (
      <div className="text-part">
        <Markdown>{part.text}</Markdown>
      </div>
    ),

    ToolCall: ({ part }) => (
      <ToolCallUI
        toolName={part.toolName}
        args={part.args}
        result={part.result}
        status={part.status}
      />
    ),

    Image: ({ part }) => (
      <img src={part.url} alt={part.alt} />
    ),
  }}
/>
```

**Edit Mode Customization**:

```typescript
// Custom edit composer
<ThreadPrimitiveMessages
  components={{
    EditComposer: ({ message }) => (
      <Composer.Root>
        <textarea defaultValue={message.content} />
        <button>Save</button>
        <button>Cancel</button>
      </Composer.Root>
    ),

    UserMessageEditComposer: CustomUserEditComposer,
    AssistantMessageEditComposer: CustomAssistantEditComposer,
  }}
/>
```

**Styling Approaches**:

- CSS classes via className prop
- Inline styles via style prop
- CSS-in-JS (no built-in preference)
- Tailwind CSS (commonly used in examples)
- shadcn/ui theming integration

## Tool Calling UI

### Tool Call Visualization

Assistant UI provides advanced tool calling capabilities through:

**1. Generative UI** - Render tool calls as interactive React components:

```typescript
// Make tools with UI renderers
import { makeAssistantTool, makeAssistantToolUI } from "@assistant-ui/react";

const weatherTool = makeAssistantTool({
  name: "get_weather",
  description: "Get weather for a location",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async ({ location }) => {
    const data = await fetchWeather(location);
    return data;
  },
});

// Register custom UI for tool execution
makeAssistantToolUI(weatherTool, {
  ToolFallback: ({ args }) => (
    <div className="tool-call">
      Checking weather for {args.location}...
    </div>
  ),

  ToolResult: ({ result }) => (
    <div className="weather-card">
      <h3>{result.location}</h3>
      <p>{result.temperature}°C</p>
      <p>{result.conditions}</p>
    </div>
  ),
});
```

**2. Tool Call Message Parts**:

```typescript
interface ToolCallMessagePart {
  type: 'tool-call'
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  result?: unknown
  status: ToolCallMessagePartStatus
}

type ToolCallMessagePartStatus = 'running' | 'complete' | 'error'
```

**3. Default Tool Rendering**: Built-in components for tool calls:

- `ToolFallback` - Default tool call display
- `ToolGroup` - Grouping multiple tool calls
- Custom tool renderers per tool type

### Status Indicators

**Tool Execution States**:

```typescript
// From INTERNAL.ToolExecutionStatus
enum ToolExecutionStatus {
  Pending = 'pending',
  Running = 'running',
  Complete = 'complete',
  Error = 'error',
}
```

**Visual States**:

- **Pending**: Tool call queued, awaiting execution
- **Running**: Tool currently executing, show loading state
- **Complete**: Tool finished successfully, show results
- **Error**: Tool execution failed, show error message

**Status Visualization Patterns**:

```typescript
const ToolCallUI = ({ part }: { part: ToolCallMessagePart }) => {
  switch (part.status) {
    case "running":
      return (
        <div className="tool-running">
          <Spinner /> Executing {part.toolName}...
        </div>
      );

    case "complete":
      return (
        <div className="tool-complete">
          <CheckIcon /> {part.toolName} completed
          <ToolResult result={part.result} />
        </div>
      );

    case "error":
      return (
        <div className="tool-error">
          <ErrorIcon /> {part.toolName} failed
        </div>
      );
  }
};
```

### Results Display

**Custom Result Rendering**:

```typescript
// Tool-specific result components
makeAssistantToolUI(searchTool, {
  ToolResult: ({ result }) => (
    <div className="search-results">
      <h3>Search Results</h3>
      {result.items.map(item => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </div>
  ),
});

// Generic result fallback
<Message.Parts
  components={{
    ToolCall: ({ part }) => {
      if (part.status !== "complete") return <ToolPending />;
      return <pre>{JSON.stringify(part.result, null, 2)}</pre>;
    },
  }}
/>
```

**Interactive Results**: Tool results can be full React components:

```typescript
// Interactive chart as tool result
makeAssistantToolUI(analyticsTool, {
  ToolResult: ({ result }) => (
    <InteractiveChart
      data={result.data}
      onDataPointClick={handleClick}
      filters={result.filters}
    />
  ),
});
```

### User Experience

**Human-in-the-Loop**: Tool calls can require user approval:

```typescript
// Frontend tool calls with user confirmation
const deleteFileTool = makeAssistantTool({
  name: "delete_file",
  requiresApproval: true, // User must approve
  execute: async ({ fileId }) => {
    await deleteFile(fileId);
  },
});

// UI shows approval prompt
<ToolCallUI>
  <ToolApprovalPrompt
    toolName="delete_file"
    args={{ fileId: "123" }}
    onApprove={handleApprove}
    onReject={handleReject}
  />
</ToolCallUI>
```

**Tool Call Grouping**: Multiple tool calls can be grouped:

```typescript
// Group related tool calls together
<ToolGroup>
  <ToolCall name="search_products" />
  <ToolCall name="get_inventory" />
  <ToolCall name="calculate_price" />
</ToolGroup>
```

**Inline Tool Execution**: Tools execute inline within conversation flow, maintaining context and
conversation continuity.

**Tool Call Examples**:

- LangGraph Stockbroker example: Human-in-the-loop workflow patterns
- Artifacts example: Website generation with live preview
- Browser Use integration: Browser automation tools

## API Design Patterns

### Component Props Philosophy

**1. Primitive-First Design**: Components expose minimal required props:

```typescript
// ThreadRoot - just a div with ref forwarding
interface ThreadPrimitiveRoot.Props
  extends ComponentPropsWithoutRef<typeof Primitive.div> {}

// MessageRoot - minimal surface area
interface MessagePrimitiveRoot.Props
  extends ComponentPropsWithoutRef<typeof Primitive.div> {}
```

**2. Composition over Configuration**: Prefer composing components over prop drilling:

```typescript
// Good: Compose sub-components
<Thread.Root>
  <Thread.Viewport>
    <Thread.Messages />
  </Thread.Viewport>
  <Composer.Root />
</Thread.Root>

// Avoid: Single component with many props
<Thread
  viewport={...}
  messages={...}
  composer={...}
  showScrollButton={...}
/>
```

**3. Component Override Pattern**: Customize via component replacement:

```typescript
// Override specific components
<Thread.Messages
  components={{
    UserMessage: CustomUserMessage,
    AssistantMessage: CustomAssistantMessage,
  }}
/>
```

**4. Ref Forwarding**: All primitives support ref forwarding:

```typescript
const ComposerPrimitiveRoot = forwardRef<Element, Props>((props, ref) => {
  return <Primitive.form {...props} ref={ref} />;
});
```

**5. Event Handler Composition**: Merge custom handlers with built-in handlers:

```typescript
// composeEventHandlers allows both to run
<Primitive.form
  onSubmit={composeEventHandlers(props.onSubmit, handleSubmit)}
/>
```

### Hook Usage

**State Access Hooks** (from `@assistant-ui/store`):

```typescript
// Main API hook
const aui = useAui()

// Reactive state hook
const state = useAuiState(() => aui.thread())

// Event subscription hook
useAuiEvent((event) => {
  console.log('Event:', event)
})
```

**Specialized Runtime Hooks**:

```typescript
// Composer hooks
const send = useComposerSend()

// Message hooks
const message = useMessage()
const messageState = useMessageState()

// Thread hooks
const thread = useThread()
const threadState = useThreadState()

// Attachment hooks
const attachment = useAttachment()
```

**Custom Hooks for Composition**:

```typescript
// Ref composition
const combinedRef = useComposedRefs(ref1, ref2, ref3)

// Hover tracking
const hoverRef = useIsHoveringRef()

// Viewport tracking
const viewportRef = useMessageViewportRef()
```

**Hook Patterns**:

- Hooks follow "use[Entity]" naming convention
- State hooks use selectors: `useAuiState(() => aui.thread().messages)`
- Hooks are context-aware (MessageRuntime, ThreadRuntime, etc.)
- Hooks return stable references for performance

### Context Patterns

**Multi-Level Context Architecture**:

```typescript
// Root level: AssistantRuntimeProvider
<AssistantRuntimeProvider runtime={runtime}>

  // Thread level: ThreadRuntime context
  <Thread.Root>

    // Viewport level: ViewportProvider
    <Thread.ViewportProvider>

      // Message level: MessageRuntime context (per message)
      <Message.Root>

        // ActionBar level: ActionBarRuntime context
        <ActionBar.Root />

      </Message.Root>

    </Thread.ViewportProvider>

    // Composer level: ComposerRuntime context
    <Composer.Root />

  </Thread.Root>

</AssistantRuntimeProvider>
```

**Context Consumption Pattern**:

```typescript
// Hooks consume nearest context
const MyComponent = () => {
  // Gets from MessageRuntime context
  const aui = useAui();
  const message = useAuiState(() => aui.message());

  // Component automatically has access to message-specific state
  return <div>{message.content}</div>;
};
```

**Provider Flexibility**: Supports runtime switching:

```typescript
// Switch runtimes dynamically
const [runtime, setRuntime] = useState(initialRuntime);

<AssistantRuntimeProvider runtime={runtime}>
  <Thread />
</AssistantRuntimeProvider>

// Runtime can be:
// - LocalRuntime (in-memory)
// - ExternalStoreRuntime (external state)
// - DataStreamRuntime (streaming protocol)
// - LangGraphRuntime (LangGraph Cloud)
// - Custom runtime implementation
```

### Type Safety

**Full TypeScript Support**:

```typescript
// All components are generic typed
const ComposerPrimitiveRoot = forwardRef<Element, Props>(...);

// Namespace exports for type access
namespace MessagePrimitiveRoot {
  export type Element = ComponentRef<typeof Primitive.div>;
  export type Props = ComponentPropsWithoutRef<typeof Primitive.div>;
}

// Discriminated unions for message types
type ThreadMessage =
  | ThreadSystemMessage
  | ThreadUserMessage
  | ThreadAssistantMessage;

// Type-safe tool definitions
const tool = makeAssistantTool({
  name: "tool_name",
  parameters: z.object({
    param: z.string(),
  }),
  execute: async ({ param }) => {
    // param is typed as string
  },
});
```

**Type Exports**:

```typescript
// All types are exported for consumer use
export type {
  AssistantClient,
  AssistantState,
  ThreadMessage,
  MessageRole,
  MessageStatus,
  MessagePart,
  ToolCallMessagePart,
  RunConfig,
  AppendMessage,
  ThreadStep,
}
```

**Type Safety Features**:

- Exhaustive type checking with `never` assertions
- Discriminated unions for message types
- Generic component types
- Ref type safety via forwardRef
- Zod integration for runtime validation
- Type-safe tool parameters and results

## Customization System

### Theme System

**shadcn/ui Integration**: Assistant UI is designed to work seamlessly with shadcn/ui theming:

```typescript
// Uses class-based theming
<div className="dark">
  <Thread />
</div>

// localStorage-based theme persistence
const theme = localStorage.getItem('theme');
```

**CSS Variables**: Likely uses CSS custom properties for theming (following shadcn/ui patterns):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

**Theme Examples**: Multiple theme clones demonstrated:

- ChatGPT Clone - ChatGPT styling
- Claude Clone - Claude-inspired design
- Grok Clone - Grok visual styling
- Perplexity Clone - Dark theme with cyan accents

### Component Overrides

**Message Component Overrides**:

```typescript
<Thread.Messages
  components={{
    // Override entire message component by role
    UserMessage: CustomUserMessage,
    AssistantMessage: CustomAssistantMessage,
    SystemMessage: CustomSystemMessage,

    // Override edit mode composers
    EditComposer: CustomEditComposer,
    UserMessageEditComposer: CustomUserEditComposer,
    AssistantMessageEditComposer: CustomAssistantEditComposer,
  }}
/>
```

**Part-Level Overrides**:

```typescript
<Message.Parts
  components={{
    Text: CustomTextPart,
    Image: CustomImagePart,
    File: CustomFilePart,
    ToolCall: CustomToolCallPart,
    Reasoning: CustomReasoningPart,
  }}
/>
```

**Attachment Overrides**:

```typescript
<Message.Attachments
  components={{
    Attachment: CustomAttachment,
  }}
/>
```

**Tool UI Overrides**:

```typescript
makeAssistantToolUI(tool, {
  ToolFallback: CustomToolPending,
  ToolResult: CustomToolResult,
})
```

### Styling Approach

**Unstyled Primitives**: Components are unstyled by default, allowing complete styling control:

```typescript
// No default classes applied
<Thread.Root className="my-custom-thread">
  <Thread.Viewport className="my-viewport">
    <Thread.Messages className="my-messages" />
  </Thread.Viewport>
</Thread.Root>
```

**Styling Methods Supported**:

1. **Tailwind CSS** - Most common in examples
2. **CSS Modules** - Supported via className
3. **CSS-in-JS** - Supported (emotion, styled-components)
4. **Plain CSS** - Via className and global styles
5. **Inline styles** - Via style prop

**Component Initialization**: CLI command suggests pre-styled components:

```bash
npx assistant-ui init
# Likely copies pre-styled components to your project
# Similar to shadcn/ui's approach
```

## Visual Design

Assistant UI follows a **minimalist, functional design system**:

**Design Principles**:

- Clean, uncluttered interfaces
- Emphasis on readability
- Consistent spacing and typography
- Accessible color contrasts
- Smooth animations and transitions

**Layout Patterns**:

- Flex-based layouts for messages
- Sticky composer at bottom
- Auto-scrolling viewport
- Floating scroll-to-bottom button
- Message grouping by role

**Visual Elements**:

- Avatar support for user/assistant
- Action bars on hover
- Attachment previews
- Code syntax highlighting
- Markdown rendering
- Tool call cards
- Status indicators (loading, error, etc.)

**Accessibility**:

- WCAG compliance
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

**Design System Integration**:

- Works with any design system
- shadcn/ui recommended
- Radix UI primitives underneath
- Composable for custom designs

## Key Differentiators

1. **Radix UI-Inspired Architecture**: Uses composable primitives rather than monolithic components,
   enabling unprecedented customization flexibility

2. **Robust Defaults**: Handles complex features (streaming, auto-scroll, accessibility,
   retry, interruptions) out of the box

3. **Provider-Agnostic**: Works with any LLM provider (Claude, ChatGPT, Grok, Perplexity, etc.) and
   any backend (AI SDK, LangGraph, Mastra, custom)

4. **Generative UI**: Render tool calls as interactive React components, not just JSON or text

5. **Human-in-the-Loop**: Built-in support for tool approval workflows and frontend tool execution

6. **Store-based State Management**: Uses `@assistant-ui/store` for optimized state management with
   streaming support

7. **Multiple UI Patterns**: Supports thread (full page), modal (floating), and sidebar (co-pilot)
   patterns out of the box

8. **TypeScript-First**: Full TypeScript support with comprehensive type definitions and Zod
   integration

9. **Y Combinator Backed**: Institutional validation and commitment to ongoing development

10. **Active Community**: 8.2k+ stars, 111+ contributors, used by hundreds of companies

## Strengths

1. **Composability**: Unmatched flexibility through primitive components

2. **Production Features**: Streaming, auto-scroll, retry, interruptions, attachments, markdown,
   code highlighting, voice input all built-in

3. **Tool Calling**: Best-in-class tool calling UI with generative UI and human-in-the-loop patterns

4. **Type Safety**: Comprehensive TypeScript support with excellent type definitions

5. **Backend Flexibility**: Works with any backend (AI SDK, LangGraph, custom protocols)

6. **Documentation**: Comprehensive docs, examples, and video tutorials

7. **Active Development**: Frequent updates, active maintenance, responsive to issues

8. **Community Adoption**: Used by major companies (LangChain, Athena Intelligence, etc.)

9. **Multiple Runtimes**: Supports local, external store, streaming protocol, LangGraph, and custom
   runtimes

10. **Accessibility**: Built-in WCAG compliance and keyboard navigation

11. **Developer Experience**: CLI tools for quick setup, extensive examples, good TypeScript support

12. **Performance**: Optimized rendering with memo, efficient state updates, minimal re-renders

## Weaknesses

1. **Learning Curve**: Primitive-based approach requires understanding composition patterns

2. **Verbose Setup**: More code required compared to monolithic components (trade-off for
   flexibility)

3. **Documentation Gaps**: Some 404s on documentation pages suggest incomplete docs coverage

4. **No Built-in Virtualization**: ThreadMessages doesn't implement virtualization for long
   conversations

5. **Styling Required**: Unstyled by default means more setup work (though CLI helps)

6. **Context Complexity**: Multi-level context architecture can be confusing

7. **Beta Features**: Some APIs marked "unstable\_" indicating they may change

8. **Runtime Abstraction**: Runtime concept adds abstraction layer that may be overkill for simple
   use cases

9. **No Built-in Persistence**: Requires external solution or cloud service for chat history

10. **Bundle Size**: Multiple packages (@assistant-ui/react, @assistant-ui/store, integrations)
    could increase bundle size

## Notable Examples

1. **Modal Example**: https://www.assistant-ui.com/examples - Floating chat bubble
2. **ChatGPT Clone**: Custom styling matching ChatGPT aesthetic
3. **Claude Clone**: Claude-inspired customization
4. **LangGraph Stockbroker**: Human-in-the-loop agentic workflows
5. **Artifacts**: Open-source Claude Artifacts implementation for website generation
6. **Mem0 Integration**: Personalized chat with memory
7. **Form Filling Co-Pilot**: Sidebar-based form automation
8. **FastAPI + LangGraph**: Backend integration patterns

**GitHub Examples**: https://github.com/Yonom/assistant-ui/tree/main/examples

- with-ai-sdk-v6
- with-langgraph
- with-cloud
- with-tanstack
- with-react-hook-form
- with-custom-thread-list
- with-external-store
- with-store

## Developer Experience

### Setup Complexity

**Rating**: ⭐⭐⭐⭐ (4/5 - Easy)

**Quick Start**:

```bash
# New project
npx assistant-ui create

# Existing project
npx assistant-ui init
```

**Manual Setup**:

1. Install package: `npm install @assistant-ui/react`
2. Choose runtime integration (AI SDK, LangGraph, etc.)
3. Wrap app in AssistantRuntimeProvider
4. Add Thread/Modal/Sidebar component
5. Customize styling

**Complexity Factors**:

- CLI makes initial setup very easy
- Runtime selection adds decision point
- Styling requires effort (unstyled by default)
- TypeScript setup is straightforward

### Learning Curve

**Rating**: ⭐⭐⭐ (3/5 - Moderate)

**Time to Productivity**:

- **Basic chat**: 15-30 minutes (CLI + minimal customization)
- **Customized UI**: 2-4 hours (styling, component overrides)
- **Advanced features**: 1-2 days (tool calling, custom runtime, generative UI)
- **Mastery**: 1-2 weeks (understanding all primitives, patterns, optimizations)

**Learning Challenges**:

- Primitive composition pattern unfamiliar to some
- Multi-level context architecture to understand
- Runtime abstraction adds complexity
- Tool calling UI patterns require study
- Many hooks and APIs to learn

**Learning Resources**:

- Documentation website
- Video tutorials on YouTube
- 14 example projects
- Active Discord community
- TypeScript types help discovery

### Documentation Quality

**Rating**: ⭐⭐⭐⭐ (4/5 - Good)

**Strengths**:

- Comprehensive documentation site
- Multiple example projects
- Video tutorials
- TypeScript types well documented
- Integration guides for major platforms

**Weaknesses**:

- Some 404s on documentation pages
- Some primitives lack detailed docs
- Advanced patterns not always documented
- Migration guides could be better
- Some experimental APIs not well documented

**Documentation Coverage**:

- Getting started: Excellent
- Component API: Good
- Hook API: Good
- Runtime API: Moderate
- Advanced patterns: Moderate
- Examples: Excellent

### TypeScript Support

**Rating**: ⭐⭐⭐⭐⭐ (5/5 - Excellent)

**Type Quality**:

- Comprehensive type definitions
- Discriminated unions for message types
- Generic component types
- Namespace exports for element/prop types
- Full type inference

**Developer Experience**:

- Excellent IDE autocomplete
- Type-safe tool definitions with Zod
- Helpful error messages
- Type-safe event handlers
- Type-safe component overrides

**Type Safety Features**:

```typescript
// Discriminated unions
type ThreadMessage = ThreadSystemMessage | ThreadUserMessage | ThreadAssistantMessage;

// Generic components
const Component = forwardRef<Element, Props>(...);

// Namespace exports
namespace MessagePrimitiveRoot {
  export type Element = ComponentRef<typeof Primitive.div>;
  export type Props = ComponentPropsWithoutRef<typeof Primitive.div>;
}

// Type-safe tools
const tool = makeAssistantTool({
  parameters: z.object({ location: z.string() }),
  execute: async ({ location }) => {
    // location is typed as string
  },
});
```

## Inspiration for Clarity Chat

### Thread Management Patterns

1. **Store-based State Management**
   - **Pattern**: Use dedicated store package for state management
   - **Why adopt**: Optimized for streaming, reactive updates, better performance than direct state
   - **Implementation**: Create `@clarity/store` or use Zustand/Jotai with similar API

2. **Runtime Abstraction**
   - **Pattern**: Separate runtime logic from UI components
   - **Why adopt**: Backend flexibility, easier testing, clean separation of concerns
   - **Implementation**: `ChatRuntime` interface with implementations for different backends

3. **Index-based Message Access**
   - **Pattern**: Access messages by index rather than iteration
   - **Why adopt**: Efficient re-rendering, better performance with large message lists
   - **Implementation**: `MessageByIndex` component, index-based hooks

4. **Multi-level Context Architecture**
   - **Pattern**: Thread → Message → ActionBar context hierarchy
   - **Why adopt**: Scoped state access, better performance, clearer component boundaries
   - **Implementation**: `ThreadProvider → MessageProvider → ActionBarProvider`

5. **Message Status Tracking**
   - **Pattern**: Granular status for messages and parts (running, complete, error)
   - **Why adopt**: Better UX, accurate loading states, error handling
   - **Implementation**: `MessageStatus`, `PartStatus`, `ToolCallStatus` types

6. **Message Parts Architecture**
   - **Pattern**: Messages composed of typed parts (text, image, tool call, etc.)
   - **Why adopt**: Flexible content rendering, type-safe part handling
   - **Implementation**: `MessagePart` union type with part-specific renderers

7. **Thread Branching Support**
   - **Pattern**: Parent/source ID tracking for conversation branches
   - **Why adopt**: Enable conversation exploration, compare responses
   - **Implementation**: `parentId`, `sourceId` on messages

8. **Step Tracking with Usage Metrics**
   - **Pattern**: Track token usage per message
   - **Why adopt**: Cost tracking, analytics, user transparency
   - **Implementation**: `ThreadStep` with usage metrics

### Tool Calling UI Patterns

1. **Generative UI for Tools**
   - **Pattern**: Render tool calls as interactive React components
   - **Why adopt**: Much better UX than JSON, enables rich interactions
   - **Implementation**: `makeToolUI` registry for tool-specific components

2. **Tool Status Visualization**
   - **Pattern**: Clear visual states (pending, running, complete, error)
   - **Why adopt**: User understanding, progress indication, error handling
   - **Implementation**: Status-based rendering with appropriate icons/animations

3. **Human-in-the-Loop Approval**
   - **Pattern**: Require user approval for certain tool calls
   - **Why adopt**: Safety, user control, compliance
   - **Implementation**: `requiresApproval` flag with approval UI

4. **Tool Result Components**
   - **Pattern**: Custom React components for tool results
   - **Why adopt**: Rich, interactive results vs. plain text
   - **Implementation**: `ToolResult` component registry

5. **Tool Call Grouping**
   - **Pattern**: Group related tool calls together
   - **Why adopt**: Cleaner UI, better understanding of multi-tool workflows
   - **Implementation**: `ToolGroup` component with collapse/expand

6. **Inline Tool Execution**
   - **Pattern**: Tools execute inline within conversation flow
   - **Why adopt**: Maintains context, natural conversation flow
   - **Implementation**: Tool calls as message parts, rendered inline

### Component Architecture

1. **Primitive-First Composition**
   - **Approach**: Provide unstyled primitive components that compose together
   - **Why it works**: Maximum flexibility, users control styling, Radix UI pattern proven
   - **For Clarity**: Balance between primitives and pre-styled components (offer both)

2. **Compound Component Pattern**
   - **Approach**: `Thread.Root`, `Thread.Messages`, `Thread.Viewport` composition
   - **Why it works**: Clear component relationships, flexible composition, good DX
   - **For Clarity**: Use for complex components like Chat, Message, Composer

3. **Component Override System**
   - **Approach**: Override components via `components` prop
   - **Why it works**: Easy customization, type-safe, clear API
   - **For Clarity**: Implement for Message, Thread, and other customizable components

4. **Ref Forwarding Pattern**
   - **Approach**: All primitives forward refs
   - **Why it works**: Integration with other libraries, imperative APIs, accessibility
   - **For Clarity**: Implement consistently across all components

5. **Event Handler Composition**
   - **Approach**: Merge user handlers with built-in handlers
   - **Why it works**: Users can add custom logic without breaking built-in behavior
   - **For Clarity**: Use `composeEventHandlers` utility

6. **Hook-based State Access**
   - **Approach**: `useAui`, `useAuiState`, `useMessage`, etc.
   - **Why it works**: Reactive, composable, familiar to React developers
   - **For Clarity**: Provide hooks for thread, message, composer, attachment state

7. **Namespace Type Exports**
   - **Approach**: `MessagePrimitiveRoot.Props`, `MessagePrimitiveRoot.Element`
   - **Why it works**: Clear type access, no naming conflicts, good DX
   - **For Clarity**: Use namespace exports for all component types

8. **Viewport Management**
   - **Approach**: Separate viewport concept with auto-scroll, scroll-to-bottom
   - **Why it works**: Complex scroll behavior abstracted, flexible layouts
   - **For Clarity**: Implement viewport abstraction for scroll management

9. **Attachment Handling**
   - **Approach**: Separate attachment primitives with index-based access
   - **Why it works**: Flexible attachment rendering, type-safe
   - **For Clarity**: Support multiple attachment types with custom renderers

10. **Conditional Rendering Components**
    - **Approach**: `Thread.If`, `Message.If` for conditional rendering
    - **Why it works**: Declarative, works with context state, clean API
    - **For Clarity**: Provide conditional rendering utilities based on state
