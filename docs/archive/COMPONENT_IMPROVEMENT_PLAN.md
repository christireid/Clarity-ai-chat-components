# Clarity-Chat Component Library Improvement Plan

## Executive Summary

After comprehensive review of 70+ AI components and 50+ hooks, this plan identifies **critical integration gaps** and proposes a unified architecture to transform isolated components into a cohesive, interconnected system.

---

## Current State Assessment

### Strengths ✅
- Consistent component + hook pattern across all components
- Strong accessibility support (useReducedMotion everywhere)
- Shared animation constants (DURATION_SECONDS, EASING_FRAMER)
- Well-typed TypeScript interfaces
- Individual components are high quality

### Critical Gaps ❌
1. **Isolated Components**: 70+ components with only 3 shared contexts
2. **Fragmented Streaming**: Multiple streaming hooks/components that don't communicate
3. **No Agent Orchestration**: 5+ agent-related components with no shared state
4. **Missing Composition**: No way to wire components together declaratively
5. **External Integration**: No standard pattern for integrating with AI SDKs (Vercel AI, LangChain)

---

## Phase 1: Core Integration Layer (Priority: Critical)

### 1.1 Create `ClarityChatProvider` - Unified Context

**Problem**: Components can't share streaming state, messages, or tool execution status.

**Solution**: Create a root provider that unifies all AI state.

```typescript
// New file: /src/providers/ClarityChatProvider.tsx

interface ClarityChatContextValue {
  // Messages
  messages: Message[]
  isStreaming: boolean
  streamingMessageId: string | null

  // Streaming Status
  streamStatus: StreamStatusState
  tokenUsage: TokenUsage
  timeStats: TimeStats

  // Tool Execution
  activeTools: ToolExecution[]
  toolHistory: ToolExecution[]

  // Thinking/Reasoning
  thinkingSteps: ThinkingStep[]
  isThinking: boolean

  // Configuration
  agentConfig: AgentConfig
  additionalContext: Map<string, ContextEntry>

  // Actions
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>
  regenerate: (messageId: string) => Promise<void>
  stopGeneration: () => void

  // Tool Actions
  approveTool: (toolId: string) => void
  rejectTool: (toolId: string) => void
}

export function ClarityChatProvider({
  children,
  adapter, // Vercel AI, LangChain, custom
  config,
}: ClarityChatProviderProps) {
  // Unified state management
}
```

**Components that would auto-connect**:
- ThinkingBar, ThinkingPill → read `isThinking`, `thinkingSteps`
- StreamStatusProgress → read `streamStatus`, `tokenUsage`
- ToolExecutionCard, ToolCard → read `activeTools`
- ChainOfThought → read `thinkingSteps`
- Conversations → read `messages`
- Sender → use `sendMessage`
- ResponseActions → use `regenerate`, feedback

### 1.2 Create `useConnectedComponent` Hook

**Problem**: Each component requires manual wiring to state.

**Solution**: Higher-order hook that auto-connects components to context.

```typescript
// New file: /src/hooks/useConnectedComponent.ts

// Auto-connected ThinkingBar
export function useConnectedThinkingBar() {
  const { isThinking, thinkingSteps, streamStatus } = useClarityChat()

  return useThinkingBar({
    isActive: isThinking,
    steps: thinkingSteps.length,
    progress: streamStatus.progress,
  })
}

// Auto-connected StreamProgress
export function useConnectedStreamProgress() {
  const { streamStatus, tokenUsage, timeStats } = useClarityChat()

  return {
    progress: streamStatus.progress,
    tokens: tokenUsage,
    timeRemaining: timeStats.remaining,
    status: streamStatus.phase,
  }
}

// Usage becomes trivial:
function MyChat() {
  return (
    <ClarityChatProvider adapter={vercelAIAdapter}>
      <ThinkingBar connected /> {/* Auto-connects */}
      <StreamStatusProgress connected />
      <Conversations connected />
      <Sender connected />
    </ClarityChatProvider>
  )
}
```

---

## Phase 2: Component Composition System (Priority: High)

### 2.1 Create `ChatComposer` - Declarative Layout

**Problem**: Building a chat UI requires manually assembling 10+ components.

**Solution**: Composable chat builder with sensible defaults.

```typescript
// New file: /src/components/ai/ChatComposer.tsx

export function ChatComposer({
  children,
  layout = 'standard',
  features = ['thinking', 'streaming', 'tools', 'suggestions'],
}: ChatComposerProps) {
  return (
    <div className="chat-composer" data-layout={layout}>
      <ChatComposer.Header />
      <ChatComposer.Messages />
      <ChatComposer.Input />
    </div>
  )
}

// Slot components
ChatComposer.Header = () => { /* Welcome, ModelSelector */ }
ChatComposer.Messages = () => { /* Conversations with ThinkingBar, ToolCards */ }
ChatComposer.Thinking = () => { /* ThinkingBar or ThinkingPill based on config */ }
ChatComposer.Tools = () => { /* ToolExecutionCard list */ }
ChatComposer.Input = () => { /* Sender with Attachments, Prompts */ }
ChatComposer.Suggestions = () => { /* Suggestion chips */ }

// Usage:
<ChatComposer layout="split-panel" features={['thinking', 'tools']}>
  <ChatComposer.Header>
    <Welcome title="My Assistant" />
    <ModelSelector />
  </ChatComposer.Header>

  <ChatComposer.Messages>
    {/* Custom message rendering */}
  </ChatComposer.Messages>

  <ChatComposer.Input>
    <Sender allowAttachments allowVoice />
    <Prompts items={myPrompts} />
  </ChatComposer.Input>
</ChatComposer>
```

### 2.2 Create Message Enhancement System

**Problem**: Messages need citations, code blocks, tool results - requires manual assembly.

**Solution**: Extensible message renderer with plugins.

```typescript
// New file: /src/components/ai/MessageRenderer.tsx

interface MessagePlugin {
  name: string
  match: (content: string) => boolean
  render: (match: string, props: PluginProps) => React.ReactNode
}

const defaultPlugins: MessagePlugin[] = [
  codeBlockPlugin,    // Renders CodeSnippet for ```code```
  citationPlugin,     // Renders InlineCitation for [1], [2]
  toolResultPlugin,   // Renders ToolCard for tool results
  linkPreviewPlugin,  // Renders LinkPreview for URLs
  imagePlugin,        // Renders ImageGallery for images
  filePlugin,         // Renders FileCard for files
  tablePlugin,        // Renders DataTable for markdown tables
]

export function MessageRenderer({
  content,
  plugins = defaultPlugins,
  components, // Override default component implementations
}: MessageRendererProps) {
  // Parse content and apply plugins
}

// Usage:
<MessageRenderer
  content={message.content}
  plugins={[...defaultPlugins, myCustomPlugin]}
  components={{
    CodeBlock: MyCustomCodeBlock,
  }}
/>
```

---

## Phase 3: Agent Execution Unification (Priority: High)

### 3.1 Create `AgentExecutionProvider`

**Problem**: AgentRunFeed, ToolExecutionCard, ChainOfThought, ToolCard show agent state but don't share it.

**Solution**: Unified agent execution context.

```typescript
// New file: /src/providers/AgentExecutionProvider.tsx

interface AgentExecutionState {
  // Current execution
  executionId: string | null
  status: 'idle' | 'planning' | 'executing' | 'complete' | 'error'

  // Steps
  plan: PlanStep[]
  currentStep: number
  completedSteps: PlanStep[]

  // Tools
  toolCalls: ToolCall[]
  pendingApprovals: ToolCall[]

  // Thinking
  thoughts: ThoughtStep[]
  currentThought: string | null

  // Time tracking
  startedAt: Date | null
  estimatedCompletion: Date | null
}

export function AgentExecutionProvider({ children }) {
  // Manages all agent execution state
}

// Connected components:
export function ConnectedAgentRunFeed() {
  const { plan, currentStep, toolCalls, status } = useAgentExecution()
  return <AgentRunFeed steps={plan} activeStep={currentStep} tools={toolCalls} />
}

export function ConnectedChainOfThought() {
  const { thoughts, currentThought } = useAgentExecution()
  return <ChainOfThought steps={thoughts} activeStep={currentThought} />
}

export function ConnectedToolApproval() {
  const { pendingApprovals, approveTool, rejectTool } = useAgentExecution()
  return pendingApprovals.map(tool => (
    <ApprovalCard
      key={tool.id}
      tool={tool}
      onApprove={() => approveTool(tool.id)}
      onReject={() => rejectTool(tool.id)}
    />
  ))
}
```

### 3.2 Create `AgentPanel` Composite Component

**Problem**: No unified view of agent execution.

**Solution**: Pre-composed agent execution panel.

```typescript
// New file: /src/components/ai/AgentPanel.tsx

export function AgentPanel({
  variant = 'sidebar', // 'sidebar' | 'inline' | 'modal'
  showPlan = true,
  showThinking = true,
  showTools = true,
  showTimeline = true,
}: AgentPanelProps) {
  const execution = useAgentExecution()

  return (
    <div className={`agent-panel agent-panel-${variant}`}>
      {showPlan && <Plan tasks={execution.plan} />}
      {showThinking && <ChainOfThought steps={execution.thoughts} />}
      {showTools && <ToolExecutionList tools={execution.toolCalls} />}
      {showTimeline && <ProgressTracker steps={execution.completedSteps} />}

      {execution.pendingApprovals.length > 0 && (
        <AgentPanel.Approvals />
      )}
    </div>
  )
}
```

---

## Phase 4: External SDK Integration (Priority: High)

### 4.1 Create Adapter System

**Problem**: No standard way to integrate with Vercel AI SDK, LangChain, etc.

**Solution**: Adapter pattern for external frameworks.

```typescript
// New file: /src/adapters/types.ts

interface ChatAdapter {
  // Core methods
  sendMessage: (message: string) => Promise<StreamableResponse>
  streamMessage: (message: string) => AsyncIterable<StreamChunk>
  stopGeneration: () => void

  // Tool handling
  handleToolCall?: (tool: ToolCall) => Promise<ToolResult>

  // State mapping
  mapMessages: (externalMessages: unknown[]) => Message[]
  mapStreamStatus: (externalStatus: unknown) => StreamStatusState
}

// New file: /src/adapters/vercel-ai.ts
export function createVercelAIAdapter(options: VercelAIOptions): ChatAdapter {
  return {
    sendMessage: async (message) => {
      // Map to useChat from 'ai'
    },
    streamMessage: async function* (message) {
      // Use streamText from 'ai'
    },
    mapMessages: (messages) => {
      // Convert Vercel AI messages to clarity-chat format
    },
    mapStreamStatus: (status) => {
      // Map streaming state
    },
  }
}

// New file: /src/adapters/langchain.ts
export function createLangChainAdapter(options: LangChainOptions): ChatAdapter {
  // LangChain integration
}

// New file: /src/adapters/anthropic.ts
export function createAnthropicAdapter(options: AnthropicOptions): ChatAdapter {
  // Direct Anthropic API integration
}

// Usage:
import { createVercelAIAdapter } from '@clarity-chat/react/adapters'
import { useChat } from 'ai'

const adapter = createVercelAIAdapter({ useChat })

<ClarityChatProvider adapter={adapter}>
  {/* All components auto-connected */}
</ClarityChatProvider>
```

### 4.2 Create SDK Bridge Hooks

**Problem**: Users need to manually sync external SDK state with components.

**Solution**: Bridge hooks that connect SDKs to components.

```typescript
// New file: /src/hooks/bridges/useVercelAIBridge.ts

export function useVercelAIBridge(vercelChat: ReturnType<typeof useChat>) {
  // Maps Vercel AI state to clarity-chat components

  return {
    // For ThinkingBar
    thinkingBarProps: {
      isActive: vercelChat.isLoading,
      status: vercelChat.isLoading ? 'thinking' : 'idle',
    },

    // For StreamStatusProgress
    streamProgressProps: {
      tokens: extractTokens(vercelChat),
      progress: calculateProgress(vercelChat),
    },

    // For Conversations
    conversationsProps: {
      items: mapConversations(vercelChat.messages),
      activeKey: getCurrentMessageId(vercelChat),
    },

    // For Sender
    senderProps: {
      onSend: vercelChat.append,
      isLoading: vercelChat.isLoading,
    },

    // For ResponseActions
    responseActionsProps: {
      onRegenerate: vercelChat.reload,
      onStop: vercelChat.stop,
    },
  }
}

// Usage:
function MyChat() {
  const chat = useChat({ api: '/api/chat' })
  const bridge = useVercelAIBridge(chat)

  return (
    <>
      <ThinkingBar {...bridge.thinkingBarProps} />
      <Conversations {...bridge.conversationsProps} />
      <Sender {...bridge.senderProps} />
    </>
  )
}
```

---

## Phase 5: Component Enhancement (Priority: Medium)

### 5.1 Add Missing Hooks to Standalone Components

**Problem**: Some components don't export hooks for external state management.

| Component | Missing Hook | Priority |
|-----------|--------------|----------|
| SafetyStatusCard | useSafetyStatus | Medium |
| SessionSummaryCard | useSessionSummary | Medium |
| ModelSelector | useModelSelector | High |
| ApprovalCard | useApproval | High |
| AgentRunFeed | useAgentRun | High |

### 5.2 Create Inter-Component Events

**Problem**: Components can't communicate without prop drilling.

**Solution**: Event bus for component communication.

```typescript
// New file: /src/events/ClarityEvents.ts

type ClarityEvent =
  | { type: 'message:sent'; message: Message }
  | { type: 'message:received'; message: Message }
  | { type: 'tool:started'; tool: ToolCall }
  | { type: 'tool:completed'; tool: ToolCall; result: ToolResult }
  | { type: 'tool:approval:requested'; tool: ToolCall }
  | { type: 'thinking:started' }
  | { type: 'thinking:step'; step: ThinkingStep }
  | { type: 'thinking:completed' }
  | { type: 'citation:clicked'; citation: Citation }
  | { type: 'file:uploaded'; file: FileData }
  | { type: 'suggestion:selected'; suggestion: Suggestion }

export function useClarityEvents() {
  const emit = (event: ClarityEvent) => { /* ... */ }
  const on = (type: ClarityEvent['type'], handler: (event: ClarityEvent) => void) => { /* ... */ }

  return { emit, on }
}

// Usage in components:
function MySuggestion({ suggestion }) {
  const { emit } = useClarityEvents()

  return (
    <Suggestion
      onClick={() => emit({ type: 'suggestion:selected', suggestion })}
    />
  )
}

// Listen in other components:
function MySender() {
  const { on } = useClarityEvents()
  const [value, setValue] = useState('')

  useEffect(() => {
    return on('suggestion:selected', (e) => {
      setValue(e.suggestion.text)
    })
  }, [])
}
```

### 5.3 Create Component Presets

**Problem**: Common configurations require repeated setup.

**Solution**: Pre-configured component variants.

```typescript
// New file: /src/presets/index.ts

// Chat Presets
export const MinimalChat = () => (
  <ChatComposer layout="minimal">
    <Conversations variant="compact" />
    <Sender variant="minimal" />
  </ChatComposer>
)

export const FullFeaturedChat = () => (
  <ChatComposer layout="full" features={['thinking', 'tools', 'suggestions', 'citations']}>
    <Welcome variant="hero" />
    <ThinkingBar variant="detailed" />
    <Conversations showTimestamps groupMessages />
    <AgentPanel variant="sidebar" />
    <Sender allowAttachments allowVoice submitOnEnter />
    <Prompts showRecent showFavorites />
  </ChatComposer>
)

export const AgentChat = () => (
  <AgentExecutionProvider>
    <ChatComposer layout="split" features={['agent', 'tools', 'plan']}>
      <AgentPanel showPlan showThinking showTools />
      <Conversations />
      <Sender />
    </ChatComposer>
  </AgentExecutionProvider>
)

// Component Presets
export const CompactToolCard = (props) => <ToolCard size="sm" variant="minimal" {...props} />
export const DetailedThinking = (props) => <ThinkingBar variant="detailed" showSteps {...props} />
```

---

## Phase 6: Developer Experience (Priority: Medium)

### 6.1 Create Storybook Integration Stories

**Problem**: No examples of components working together.

**Solution**: Add integration stories.

```typescript
// New stories: /src/stories/integrations/

// Full Chat Integration
export const FullChatIntegration: Story = {
  render: () => (
    <ClarityChatProvider adapter={mockAdapter}>
      <div className="h-screen">
        <Welcome />
        <ThinkingBar connected />
        <Conversations connected />
        <Sender connected />
      </div>
    </ClarityChatProvider>
  ),
}

// Agent Execution Flow
export const AgentExecutionFlow: Story = {
  render: () => (
    <AgentExecutionProvider initialState={mockAgentState}>
      <AgentPanel />
    </AgentExecutionProvider>
  ),
}

// Streaming with Progress
export const StreamingWithProgress: Story = {
  render: () => (
    <StreamStatusProvider>
      <StreamStatusProgress connected />
      <ThinkingBar connected />
      <StreamingMessage content={streamingContent} />
    </StreamStatusProvider>
  ),
}
```

### 6.2 Create Debug Tools

**Problem**: Hard to debug component state and interactions.

**Solution**: Development-mode debugging tools.

```typescript
// New file: /src/dev/ClarityDevTools.tsx

export function ClarityDevTools() {
  if (process.env.NODE_ENV !== 'development') return null

  const chat = useClarityChat()
  const agent = useAgentExecution()
  const events = useClarityEvents()

  return (
    <div className="clarity-devtools">
      <Tabs>
        <Tab label="Messages">{/* Message inspector */}</Tab>
        <Tab label="Stream">{/* Stream status */}</Tab>
        <Tab label="Tools">{/* Tool calls */}</Tab>
        <Tab label="Events">{/* Event log */}</Tab>
        <Tab label="Config">{/* Current config */}</Tab>
      </Tabs>
    </div>
  )
}

// Usage:
<ClarityChatProvider>
  <MyApp />
  <ClarityDevTools />
</ClarityChatProvider>
```

---

## Implementation Roadmap

### Sprint 1 (Week 1-2): Core Integration
- [ ] Create ClarityChatProvider
- [ ] Create useConnectedComponent hooks for top 10 components
- [ ] Create StreamStatusProvider bridge
- [ ] Write integration tests

### Sprint 2 (Week 3-4): Agent Unification
- [ ] Create AgentExecutionProvider
- [ ] Create AgentPanel composite
- [ ] Connect AgentRunFeed, ChainOfThought, ToolCard, ToolExecutionCard
- [ ] Add approval workflow

### Sprint 3 (Week 5-6): Composition System
- [ ] Create ChatComposer
- [ ] Create MessageRenderer with plugins
- [ ] Create component presets
- [ ] Update documentation

### Sprint 4 (Week 7-8): External Integration
- [ ] Create adapter system types
- [ ] Implement Vercel AI adapter
- [ ] Implement LangChain adapter
- [ ] Create bridge hooks
- [ ] Write SDK integration guides

### Sprint 5 (Week 9-10): Polish
- [ ] Add missing hooks to standalone components
- [ ] Create event system
- [ ] Create dev tools
- [ ] Add integration Storybook stories
- [ ] Performance optimization

---

## New Files to Create

```
/src/
├── providers/
│   ├── ClarityChatProvider.tsx       # Core unified provider
│   ├── AgentExecutionProvider.tsx    # Agent state provider
│   ├── StreamStatusProvider.tsx      # Streaming state provider (enhance existing)
│   └── index.ts
│
├── adapters/
│   ├── types.ts                      # Adapter interfaces
│   ├── vercel-ai.ts                  # Vercel AI SDK adapter
│   ├── langchain.ts                  # LangChain adapter
│   ├── anthropic.ts                  # Anthropic direct adapter
│   └── index.ts
│
├── hooks/
│   ├── connected/
│   │   ├── useConnectedThinkingBar.ts
│   │   ├── useConnectedStreamProgress.ts
│   │   ├── useConnectedConversations.ts
│   │   ├── useConnectedSender.ts
│   │   ├── useConnectedToolCard.ts
│   │   └── index.ts
│   │
│   └── bridges/
│       ├── useVercelAIBridge.ts
│       ├── useLangChainBridge.ts
│       └── index.ts
│
├── components/ai/
│   ├── ChatComposer.tsx              # Declarative chat builder
│   ├── MessageRenderer.tsx           # Plugin-based message rendering
│   ├── AgentPanel.tsx                # Unified agent view
│   └── index.ts (update)
│
├── events/
│   ├── ClarityEvents.ts              # Event system
│   └── index.ts
│
├── presets/
│   ├── chat-presets.tsx              # Pre-configured chat layouts
│   ├── component-presets.tsx         # Pre-configured components
│   └── index.ts
│
└── dev/
    ├── ClarityDevTools.tsx           # Development tools
    └── index.ts
```

---

## Success Metrics

1. **Integration Time**: Reduce time to build a full chat UI from 2+ hours to <15 minutes
2. **Boilerplate Reduction**: Reduce setup code by 80% with connected components
3. **External SDK Support**: Support 3+ major AI SDKs out of the box
4. **Component Reuse**: Increase component composition from 3% to 40%
5. **Developer Satisfaction**: Improve DX scores in user feedback

---

## Questions for Review

1. Should ClarityChatProvider support multiple simultaneous chats?
2. Should we maintain backward compatibility with non-connected usage?
3. What's the priority for specific SDK adapters (Vercel AI vs LangChain vs Anthropic)?
4. Should the event system be opt-in or always available?
5. How much should ChatComposer be opinionated vs flexible?

---

*Generated: January 2026*
*Library Version: clarity-chat v0.x*
