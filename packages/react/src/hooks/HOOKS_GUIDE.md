# Clarity Chat Hooks Guide

Comprehensive documentation for all hooks in the React hooks library. This guide covers Connected Hooks, Bridge Hooks, Context Hooks, and Composition Hooks.

---

## Table of Contents

1. [Connected Hooks](#connected-hooks)
2. [Bridge Hooks](#bridge-hooks)
3. [Context Hooks](#context-hooks)
4. [Composition Hooks](#composition-hooks)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Connected Hooks

Connected Hooks automatically wire components to `ClarityChatProvider`. They eliminate manual prop passing by deriving component props directly from provider state.

**Purpose**: Auto-wire components to `ClarityChatProvider`
**Location**: `hooks/connected/index.tsx`

### Overview

Connected Hooks follow a consistent pattern:
- Derive component props from provider state
- Handle prop transformations and formatting
- Return typed prop objects ready for component consumption
- Support optional manual prop overrides

### When to Use Connected Hooks

Use connected hooks when:
- Building UI with ClarityChatProvider context available
- You want automatic state synchronization
- Props should follow provider updates automatically
- Building internal clarity-chat components

### When to Use Manual Wiring

Manual wiring preferred when:
- Integrating external SDKs (use Bridge Hooks instead)
- Props need custom transformation logic
- You need maximum flexibility and control
- Component lives outside ClarityChatProvider context

---

### useConnectedThinkingBar

Provides props for the ThinkingBar component, showing AI thinking progress.

**TypeScript Signature**:
```typescript
function useConnectedThinkingBar(): ConnectedThinkingBarProps

interface ConnectedThinkingBarProps {
  isActive: boolean
  status: 'idle' | 'thinking' | 'processing' | 'complete' | 'error'
  progress?: number
  currentStep?: string
  totalSteps?: number
  estimatedTime?: number
}
```

**Properties**:
- `isActive`: Whether thinking is active or streaming
- `status`: Current phase of operation
- `progress`: Percentage (0-100) of completion
- `currentStep`: Current thinking step content
- `totalSteps`: Total number of thinking steps
- `estimatedTime`: Estimated milliseconds until completion

**Usage Example**:
```tsx
import { useConnectedThinkingBar } from '@/hooks'

export function ChatInterface() {
  const thinkingBarProps = useConnectedThinkingBar()

  return (
    <div>
      {thinkingBarProps.isActive && (
        <ThinkingBar {...thinkingBarProps} />
      )}
    </div>
  )
}
```

**Alternative with Connected Prop**:
```tsx
// If using component's connected prop support
<ThinkingBar connected />
```

**State Mapping**:
- Derives from: `isThinking`, `thinkingSteps`, `streamStatus`
- Updates on: Thinking state changes, stream phase changes
- Automatic re-renders: Yes, on provider state updates

---

### useConnectedThinkingPill

Compact version of thinking indicator, showing minimal thinking state.

**TypeScript Signature**:
```typescript
function useConnectedThinkingPill(): ConnectedThinkingPillProps

interface ConnectedThinkingPillProps {
  isActive: boolean
  label?: string
  variant?: 'default' | 'minimal' | 'detailed'
}
```

**Usage Example**:
```tsx
import { useConnectedThinkingPill } from '@/hooks'

export function CompactChat() {
  const pillProps = useConnectedThinkingPill()

  return <ThinkingPill {...pillProps} />
}
```

---

### useConnectedStreamProgress

Shows streaming progress with token and time information.

**TypeScript Signature**:
```typescript
function useConnectedStreamProgress(): ConnectedStreamProgressProps

interface ConnectedStreamProgressProps {
  progress: number
  status: 'idle' | 'connecting' | 'streaming' | 'complete' | 'error'
  tokensUsed: number
  tokensTotal?: number
  timeElapsed?: number
  timeRemaining?: number
  showTokens?: boolean
  showTime?: boolean
}
```

**Usage Example**:
```tsx
import { useConnectedStreamProgress } from '@/hooks'

export function ProgressDisplay() {
  const progressProps = useConnectedStreamProgress()

  return (
    <ProgressBar
      {...progressProps}
      showTokens={true}
      showTime={true}
    />
  )
}
```

**Token Display Pattern**:
```tsx
function TokenDisplay() {
  const { tokensUsed, tokensTotal, showTokens } = useConnectedStreamProgress()

  if (!showTokens) return null

  return (
    <span className="tokens">
      {tokensUsed} / {tokensTotal || '∞'} tokens
    </span>
  )
}
```

---

### useConnectedConversations

Provides conversation list with grouped messages.

**TypeScript Signature**:
```typescript
function useConnectedConversations(): ConnectedConversationsProps

interface ConnectedConversationsProps {
  items: Array<{
    key: string
    label: string
    messages: ChatMessage[]
  }>
  activeKey?: string
  showTimestamps?: boolean
}
```

**Usage Example**:
```tsx
import { useConnectedConversations } from '@/hooks'

export function ConversationList() {
  const convProps = useConnectedConversations()

  return (
    <div className="conversations">
      {convProps.items.map((conv) => (
        <Conversation
          key={conv.key}
          title={conv.label}
          messages={conv.messages}
          active={conv.key === convProps.activeKey}
        />
      ))}
    </div>
  )
}
```

**Extension Pattern** (Multiple conversations):
```tsx
// Currently supports single main conversation
// Future: Extend to support conversation switching
const conversations = useConnectedConversations()
// Returns: { items: [{ key: 'main', label: 'Chat', messages }] }
```

---

### useConnectedSender

Provides message sending interface with loading state.

**TypeScript Signature**:
```typescript
function useConnectedSender(): ConnectedSenderProps

interface ConnectedSenderProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => Promise<void>
  onStop?: () => void
  isLoading: boolean
  disabled?: boolean
  placeholder?: string
}
```

**Usage Example**:
```tsx
import { useConnectedSender } from '@/hooks'

export function MessageInput() {
  const senderProps = useConnectedSender()
  const [input, setInput] = React.useState('')

  const handleSend = async () => {
    await senderProps.onSend(input)
    setInput('')
  }

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={senderProps.placeholder}
        disabled={senderProps.disabled || senderProps.isLoading}
      />
      <button onClick={handleSend} disabled={senderProps.isLoading}>
        {senderProps.isLoading ? 'Sending...' : 'Send'}
      </button>
      {senderProps.isLoading && senderProps.onStop && (
        <button onClick={senderProps.onStop}>Stop</button>
      )}
    </div>
  )
}
```

**Placeholder Pattern**:
```tsx
// Placeholder changes based on state
// When streaming: 'Generating response...'
// When idle: 'Type a message...'
const { placeholder, isLoading } = useConnectedSender()
```

**Attachment Handling**:
```tsx
const senderProps = useConnectedSender()

const handleSendWithAttachments = async (content: string, files: File[]) => {
  const attachments: MessageAttachment[] = files.map(file => ({
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type,
    data: await file.arrayBuffer(),
  }))

  await senderProps.onSend(content, attachments)
}
```

---

### useConnectedToolCard

Manages tool execution approvals and display.

**TypeScript Signature**:
```typescript
function useConnectedToolCard(): ConnectedToolCardProps

interface ConnectedToolCardProps {
  tools: ToolExecution[]
  onApprove?: (toolId: string) => void
  onReject?: (toolId: string) => void
}
```

**Usage Example**:
```tsx
import { useConnectedToolCard } from '@/hooks'

export function ToolExecutionPanel() {
  const toolProps = useConnectedToolCard()

  return (
    <div className="tools">
      {toolProps.tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onApprove={() => toolProps.onApprove?.(tool.id)}
          onReject={() => toolProps.onReject?.(tool.id)}
        />
      ))}
    </div>
  )
}
```

**Tool States**:
```tsx
// Tool execution states
enum ToolExecutionStatus {
  'pending'    // Awaiting approval
  'approved'   // User approved
  'rejected'   // User rejected
  'executing'  // Running
  'complete'   // Done
  'error'      // Failed
}
```

---

### useConnectedChainOfThought

Shows thinking steps progression.

**TypeScript Signature**:
```typescript
function useConnectedChainOfThought(): ConnectedChainOfThoughtProps

interface ConnectedChainOfThoughtProps {
  steps: Array<{
    id: string
    content: string
    status: 'pending' | 'active' | 'complete'
  }>
  isExpanded?: boolean
}
```

**Usage Example**:
```tsx
import { useConnectedChainOfThought } from '@/hooks'

export function ThinkingSteps() {
  const thoughtProps = useConnectedChainOfThought()

  return (
    <div className={`thought-chain ${thoughtProps.isExpanded ? 'expanded' : 'collapsed'}`}>
      {thoughtProps.steps.map((step) => (
        <StepItem
          key={step.id}
          content={step.content}
          status={step.status}
        />
      ))}
    </div>
  )
}
```

**Step Status Styling**:
```tsx
function StepItem({ content, status }: StepProps) {
  const statusClass = {
    pending: 'step-pending',
    active: 'step-active',
    complete: 'step-complete',
  }[status]

  return <div className={statusClass}>{content}</div>
}
```

---

### useConnectedResponseActions

Provides message action buttons (regenerate, copy, like, dislike).

**TypeScript Signature**:
```typescript
function useConnectedResponseActions(
  messageId?: string
): ConnectedResponseActionsProps

interface ConnectedResponseActionsProps {
  onRegenerate?: () => void
  onCopy?: () => void
  onLike?: () => void
  onDislike?: () => void
  isRegenerating?: boolean
  messageId?: string
}
```

**Usage Example**:
```tsx
import { useConnectedResponseActions } from '@/hooks'

export function MessageActions({ messageId }: { messageId?: string }) {
  const actions = useConnectedResponseActions(messageId)

  return (
    <div className="message-actions">
      {actions.onRegenerate && (
        <button onClick={actions.onRegenerate} disabled={actions.isRegenerating}>
          {actions.isRegenerating ? '⟳ Regenerating' : '↻ Regenerate'}
        </button>
      )}
      {actions.onCopy && <button onClick={actions.onCopy}>📋 Copy</button>}
      {actions.onLike && <button onClick={actions.onLike}>👍 Like</button>}
      {actions.onDislike && <button onClick={actions.onDislike}>👎 Dislike</button>}
    </div>
  )
}
```

**Custom Message ID**:
```tsx
// Auto-use last message if no ID provided
const actions1 = useConnectedResponseActions()

// Target specific message
const actions2 = useConnectedResponseActions('msg-123')
```

**Event Emission**:
```tsx
// Actions emit 'message:sent' event for analytics
// { action: 'copy', messageId: '...' }
// { action: 'like', messageId: '...' }
// { action: 'dislike', messageId: '...' }
```

---

### useConnectedWelcome

Provides welcome screen suggestion callbacks.

**TypeScript Signature**:
```typescript
function useConnectedWelcome(): ConnectedWelcomeProps

interface ConnectedWelcomeProps {
  onSuggestionClick?: (suggestion: { text: string }) => void
}
```

**Usage Example**:
```tsx
import { useConnectedWelcome } from '@/hooks'

export function WelcomeScreen() {
  const welcomeProps = useConnectedWelcome()

  const suggestions = [
    { text: 'What is React?' },
    { text: 'How does state work?' },
    { text: 'Explain hooks' },
  ]

  return (
    <div className="welcome">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.text}
          onClick={() => welcomeProps.onSuggestionClick?.(suggestion)}
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  )
}
```

---

### useConnectedPrompts

Provides prompt template callbacks with variable substitution.

**TypeScript Signature**:
```typescript
function useConnectedPrompts(): ConnectedPromptsProps

interface ConnectedPromptsProps {
  onSelect?: (prompt: { description: string }, variables?: Record<string, string>) => void
}
```

**Usage Example**:
```tsx
import { useConnectedPrompts } from '@/hooks'

export function PromptTemplates() {
  const promptProps = useConnectedPrompts()

  const prompts = [
    {
      description: 'Explain {{topic}} like I\'m 5',
      variables: ['topic'],
    },
    {
      description: 'Find bugs in this {{language}} code',
      variables: ['language'],
    },
  ]

  return (
    <div>
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.description}
          prompt={prompt}
          onSelect={(variables) =>
            promptProps.onSelect?.(prompt, variables)
          }
        />
      ))}
    </div>
  )
}
```

**Variable Substitution Pattern**:
```tsx
// Template: "Explain {{topic}} in {{language}}"
// Variables: { topic: "React", language: "simple terms" }
// Result: "Explain React in simple terms"

// Implementation: Automatically replaces {{name}} with variable values
```

---

### useConnectedSuggestion

Similar to prompts, for suggestion chips/pills.

**TypeScript Signature**:
```typescript
function useConnectedSuggestion(): ConnectedSuggestionProps

interface ConnectedSuggestionProps {
  onSelect?: (suggestion: { text: string }) => void
}
```

**Usage Example**:
```tsx
import { useConnectedSuggestion } from '@/hooks'

export function SuggestionChips() {
  const suggestionProps = useConnectedSuggestion()

  const suggestions = [
    { text: 'Continue writing' },
    { text: 'Summarize' },
    { text: 'Translate to Spanish' },
  ]

  return (
    <div className="suggestions">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.text}
          onClick={() => suggestionProps.onSelect?.(suggestion)}
          className="suggestion-chip"
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  )
}
```

**Event Emission**:
```tsx
// Emits 'suggestion:selected' event before sending message
// Useful for analytics and tracking suggestion engagement
```

---

### useConnectedAttachments

Manages message attachments from current input.

**TypeScript Signature**:
```typescript
function useConnectedAttachments(): ConnectedAttachmentsProps

interface ConnectedAttachmentsProps {
  attachments: MessageAttachment[]
  onRemove?: (id: string) => void
}
```

**Usage Example**:
```tsx
import { useConnectedAttachments } from '@/hooks'

export function AttachmentList() {
  const attachmentsProps = useConnectedAttachments()

  return (
    <div className="attachments">
      {attachmentsProps.attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.id}
          attachment={attachment}
          onRemove={() => attachmentsProps.onRemove?.(attachment.id)}
        />
      ))}
    </div>
  )
}
```

---

### useConnectedApprovalCard

Shows pending tool approvals for user confirmation.

**TypeScript Signature**:
```typescript
function useConnectedApprovalCard(): ConnectedApprovalCardProps

interface ConnectedApprovalCardProps {
  pendingApprovals: ToolExecution[]
  onApprove: (toolId: string) => void
  onReject: (toolId: string, reason?: string) => void
}
```

**Usage Example**:
```tsx
import { useConnectedApprovalCard } from '@/hooks'

export function ApprovalQueue() {
  const approvalProps = useConnectedApprovalCard()

  if (approvalProps.pendingApprovals.length === 0) {
    return null
  }

  return (
    <div className="approval-queue">
      <h3>Pending Approvals</h3>
      {approvalProps.pendingApprovals.map((tool) => (
        <ApprovalCard
          key={tool.id}
          tool={tool}
          onApprove={() => approvalProps.onApprove(tool.id)}
          onReject={(reason) => approvalProps.onReject(tool.id, reason)}
        />
      ))}
    </div>
  )
}
```

**Rejection with Reason**:
```tsx
const handleReject = (toolId: string) => {
  const reason = 'User rejected due to security concerns'
  approvalProps.onReject(toolId, reason)
}
```

---

### useConnectedProps

Universal hook to get connected props by component name.

**TypeScript Signature**:
```typescript
function useConnectedProps(componentName: string): Record<string, unknown> | null
```

**Supported Components**:
- `thinkingbar`, `thinkingpill`, `streamstatusprogress`, `streamprogress`
- `conversations`, `sender`, `toolcard`, `toolexecutioncard`
- `chainofthought`, `responseactions`, `welcome`
- `prompts`, `suggestion`, `attachments`, `approvalcard`

**Usage Example**:
```tsx
import { useConnectedProps } from '@/hooks'

export function DynamicComponent({ componentName }: { componentName: string }) {
  const props = useConnectedProps(componentName)

  if (!props) {
    return <p>Component not connected</p>
  }

  // Type narrowing would be needed in production
  return <ComponentRegistry[componentName] {...props} />
}
```

---

### withConnected HOC

Higher-order component for adding connected support to any component.

**TypeScript Signature**:
```typescript
function withConnected<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P & WithConnectedProps>

interface WithConnectedProps {
  connected?: boolean
}
```

**Usage Example**:
```tsx
import { withConnected } from '@/hooks'

interface ThinkingBarProps {
  isActive: boolean
  status: 'idle' | 'thinking' | 'processing'
}

function ThinkingBar(props: ThinkingBarProps) {
  return <div>{props.isActive && `Status: ${props.status}`}</div>
}

// Wrap component
export default withConnected(ThinkingBar, 'thinkingbar')

// Usage
<ThinkingBar connected /> // Auto-wired!
<ThinkingBar connected={false} isActive={true} status="thinking" /> // Manual props override
```

**Manual Override Pattern**:
```tsx
// Connected props merged with manual props
<ThinkingBar
  connected
  status="custom-status" // Overrides connected value
/>
```

---

## Bridge Hooks

Bridge Hooks integrate external AI SDKs (Vercel AI, LangChain, Anthropic) with clarity-chat components.

**Purpose**: Integrate external SDKs with consistent prop mapping
**Location**: `hooks/bridges/index.ts`

### Common Bridge Pattern

All bridge hooks:
1. Accept SDK state as input
2. Map SDK state to clarity-chat props
3. Handle loading, error, and token states
4. Return consistent `BaseBridgeProps` plus SDK-specific properties

**Base Bridge Result**:
```typescript
interface BaseBridgeProps {
  thinkingBarProps: { isActive, status, progress?, currentStep? }
  thinkingPillProps: { isActive, label? }
  streamProgressProps: { progress, status, tokensUsed, tokensTotal?, timeRemaining? }
  conversationsProps: { items, activeKey }
  senderProps: { onSend, onStop?, isLoading, disabled?, placeholder? }
  responseActionsProps: { onRegenerate?, onCopy?, isRegenerating? }
  isLoading: boolean
  error?: Error
}
```

---

### useVercelAIBridge

Integrates Vercel AI SDK's `useChat` hook with clarity-chat components.

**TypeScript Signature**:
```typescript
function useVercelAIBridge(chat: ReturnType<typeof useChat>): VercelAIBridgeResult

interface VercelAIBridgeResult extends BaseBridgeProps {
  // Additional Vercel-specific properties
  reload: () => Promise<void>
  setMessages: (messages: Message[]) => void
  input: string
  setInput: (input: string) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
```

**Usage Example**:
```tsx
import { useChat } from 'ai/react'
import { useVercelAIBridge } from '@/hooks'

export function VercelAIChat() {
  const chat = useChat({ api: '/api/chat' })
  const bridge = useVercelAIBridge(chat)

  return (
    <div className="chat">
      <ThinkingBar {...bridge.thinkingBarProps} />
      <Conversations {...bridge.conversationsProps} />
      <Sender {...bridge.senderProps} />
      <ResponseActions {...bridge.responseActionsProps} />
    </div>
  )
}
```

**Complete Example with Form**:
```tsx
export function VercelAIChatForm() {
  const chat = useChat({
    api: '/api/chat',
    onError: (error) => console.error('Chat error:', error),
  })

  const bridge = useVercelAIBridge(chat)

  return (
    <form onSubmit={bridge.handleSubmit} className="chat-form">
      <input
        value={bridge.input}
        onChange={bridge.handleInputChange}
        placeholder={bridge.senderProps.placeholder}
        disabled={bridge.isLoading}
      />
      <button type="submit" disabled={bridge.isLoading}>
        {bridge.isLoading ? 'Sending...' : 'Send'}
      </button>

      <div className="messages">
        {bridge.conversationsProps.items[0]?.messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
    </form>
  )
}
```

**Stream Text Integration**:
```tsx
// useChat supports streaming responses
const chat = useChat({
  api: '/api/chat',
  streamMode: 'server-sent-events', // or 'fetch'
})

const bridge = useVercelAIBridge(chat)
// Automatically updates progressProps as stream arrives
```

---

### useLangChainBridge

Integrates LangChain.js chat models with clarity-chat components.

**TypeScript Signature**:
```typescript
function useLangChainBridge(options: LangChainBridgeOptions): LangChainBridgeResult

interface LangChainBridgeOptions {
  langchain: LangChainHookReturn
  generateId?: () => string
}

interface LangChainBridgeResult extends BaseBridgeProps {
  clearConversation: () => void
  model?: LangChainChatModel
}
```

**Usage Example**:
```tsx
import { useLangChainChat } from 'langchain-hook' // hypothetical hook
import { useLangChainBridge } from '@/hooks'

export function LangChainChat() {
  const langchain = useLangChainChat({
    model: new ChatOpenAI({ temperature: 0.7 }),
  })

  const bridge = useLangChainBridge({ langchain })

  return (
    <div className="langchain-chat">
      <Conversations {...bridge.conversationsProps} />
      <Sender {...bridge.senderProps} />
      <button onClick={bridge.clearConversation}>Clear Chat</button>
    </div>
  )
}
```

**Custom ID Generator**:
```tsx
const bridge = useLangChainBridge({
  langchain,
  generateId: () => {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  },
})
```

**Message Mapping**:
```typescript
// LangChain messages mapped to clarity format:
// { type: 'human', content: '...' } -> { role: 'user', content: '...' }
// { type: 'ai', content: '...' } -> { role: 'assistant', content: '...' }
// { type: 'system', content: '...' } -> { role: 'system', content: '...' }
```

---

### useAnthropicBridge

Integrates Anthropic SDK directly with clarity-chat components.

**TypeScript Signature**:
```typescript
function useAnthropicBridge(options: AnthropicBridgeOptions): AnthropicBridgeResult

interface AnthropicBridgeOptions {
  anthropic: AnthropicHookState
  showTokenUsage?: boolean
}

interface AnthropicBridgeResult extends BaseBridgeProps {
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  stopGeneration: () => void
}
```

**Usage Example**:
```tsx
import { useAnthropicChat } from '@/hooks' // Your custom hook
import { useAnthropicBridge } from '@/hooks'

export function AnthropicChat() {
  const anthropic = useAnthropicChat({
    apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229',
  })

  const bridge = useAnthropicBridge({ anthropic })

  return (
    <div className="anthropic-chat">
      <StreamStatusProgress {...bridge.streamProgressProps} />
      <Conversations {...bridge.conversationsProps} />
      <Sender {...bridge.senderProps} />

      <div className="token-usage">
        {bridge.usage.inputTokens} input → {bridge.usage.outputTokens} output
        ({bridge.usage.totalTokens} total)
      </div>
    </div>
  )
}
```

**Token Usage Display**:
```tsx
const bridge = useAnthropicBridge({ anthropic, showTokenUsage: true })

// Usage automatically tracked
const { usage } = bridge
const costEstimate = (usage.inputTokens * 0.003 + usage.outputTokens * 0.015) / 1000
```

**Stop Generation**:
```tsx
<Sender
  {...bridge.senderProps}
  onStop={bridge.stopGeneration}
/>
```

**Content Block Handling**:
```typescript
// Automatically extracts text from Anthropic content blocks
// Supports: text, tool_use, tool_result
// Returns concatenated text content
```

---

### useGenericBridge

Factory function for creating bridges for any external SDK.

**TypeScript Signature**:
```typescript
function useGenericBridge<TMessage = unknown>(
  options: GenericBridgeOptions<TMessage>
): BaseBridgeProps

interface GenericBridgeOptions<TMessage = unknown> {
  state: GenericChatState<TMessage>
  mapMessage: (message: TMessage, index: number) => {
    id: string
    role: string
    content: string
    createdAt?: Date
  }
  placeholder?: string
  thinkingLabel?: string
}

interface GenericChatState<TMessage = unknown> {
  messages: TMessage[]
  isLoading: boolean
  error?: Error
  sendMessage: (content: string) => Promise<void>
  stop?: () => void
}
```

**Usage Example - Custom SDK**:
```tsx
import { useCustomChatSDK } from 'custom-sdk'
import { useGenericBridge } from '@/hooks'

export function CustomSDKChat() {
  const customChat = useCustomChatSDK()

  const bridge = useGenericBridge({
    state: customChat,
    mapMessage: (msg, index) => ({
      id: msg.id || `msg-${index}`,
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text,
      createdAt: msg.timestamp,
    }),
    placeholder: 'Ask anything...',
    thinkingLabel: 'Thinking...',
  })

  return (
    <>
      <ThinkingPill {...bridge.thinkingPillProps} />
      <Conversations {...bridge.conversationsProps} />
      <Sender {...bridge.senderProps} />
    </>
  )
}
```

**Complex Message Mapping**:
```tsx
const bridge = useGenericBridge({
  state: myChat,
  mapMessage: (msg, i) => {
    // Handle various message formats
    const content =
      typeof msg.body === 'string'
        ? msg.body
        : Array.isArray(msg.body)
          ? msg.body.map(b => b.text).join('\n')
          : JSON.stringify(msg.body)

    return {
      id: msg.messageId,
      role: msg.isFromUser ? 'user' : 'assistant',
      content,
      createdAt: new Date(msg.timestamp),
    }
  },
})
```

**With Custom Handlers**:
```tsx
interface CustomMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  metadata?: Record<string, any>
}

const bridge = useGenericBridge<CustomMessage>({
  state: customState,
  mapMessage: (msg) => ({
    id: msg.id,
    role: msg.sender,
    content: msg.text,
  }),
})
```

---

### Bridge Comparison Table

| Feature | Vercel AI | LangChain | Anthropic | Generic |
|---------|-----------|-----------|-----------|---------|
| Token tracking | Basic | None | Full | Custom |
| Regenerate | ✓ | ✗ | ✗ | ✗ |
| Stream progress | ✓ | Partial | ✓ | Partial |
| Thinking steps | ✗ | ✗ | ✓ (with API) | ✗ |
| Easy setup | ✓✓ | ✓ | ✓ | ✗ |
| Flexibility | Good | Good | Good | Excellent |
| Message formats | 1 | 3 | 1 | Custom |

---

## Context Hooks

Context Hooks access and manage state from `ClarityChatProvider`.

**Purpose**: Access provider state and manage chat context
**Location**: `hooks/use-clarity-chat/`, `hooks/context/`

---

### useClarityChat

Primary hook for accessing chat provider state and methods.

**TypeScript Signature**:
```typescript
function useClarityChat(options?: UseClarityChatOptions): UseClarityChatReturn

interface UseClarityChatReturn {
  // State
  messages: ChatMessage[]
  streamingMessage?: ChatMessage
  isThinking: boolean
  isStreaming: boolean
  thinkingSteps: ThinkingStep[]
  activeTools: ToolExecution[]
  pendingApprovals: ToolExecution[]
  streamStatus: StreamStatus
  error?: Error

  // Methods
  sendMessage: (content: string, attachments?: MessageAttachment[]) => Promise<void>
  stopGeneration: () => void
  regenerate: (messageId: string) => Promise<void>
  approveTool: (toolId: string) => void
  rejectTool: (toolId: string) => void

  // Memory
  memoryInfo?: ClarityChatMemoryInfo

  // Token stats
  tokenStats?: ClarityChatTokenStats

  // Events
  emit: (event: string, data?: any) => void
  on: (event: string, handler: (data: any) => void) => () => void
}
```

**Configuration Options**:
```typescript
interface UseClarityChatOptions {
  api?: string // API endpoint
  memory?: {
    enabled: boolean
    strategy: 'vector-store' | 'sliding-window' | 'summarization'
    maxMessages?: number
  }
  transport?: 'sse' | 'websocket'
  promptOptimization?: {
    enabled: boolean
    model: string
  }
}
```

**Basic Usage**:
```tsx
import { useClarityChat } from '@/hooks'

export function ChatWindow() {
  const {
    messages,
    isStreaming,
    sendMessage,
    stopGeneration,
  } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      {isStreaming && (
        <button onClick={stopGeneration}>Stop</button>
      )}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}
```

**Advanced: Memory Integration**:
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'vector-store',
    maxMessages: 50,
  },
})

// Access memory info
if (chat.memoryInfo) {
  console.log(`${chat.memoryInfo.messagesStored} messages in memory`)
  console.log(`Compression ratio: ${chat.memoryInfo.compressionRatio}%`)
}
```

**Token Statistics**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })

if (chat.tokenStats) {
  const remaining = chat.tokenStats.budgetRemaining
  const percent = (remaining / chat.tokenStats.budgetTotal) * 100

  return <ProgressBar value={percent} label={`${remaining} tokens left`} />
}
```

**Event Subscription Pattern**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })

React.useEffect(() => {
  // Subscribe to message events
  const unsubscribe = chat.on('message:sent', (data) => {
    console.log('User sent:', data)
  })

  // Cleanup
  return unsubscribe
}, [chat])

// Emit custom events
chat.emit('custom:event', { data: 'value' })
```

**Error Handling**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })

React.useEffect(() => {
  if (chat.error) {
    console.error('Chat error:', chat.error.message)
    // Show error notification
  }
}, [chat.error])
```

---

### useAgent

Hook for agent-based interactions with tool orchestration.

**TypeScript Signature**:
```typescript
function useAgent(options: UseAgentOptions): UseAgentReturn

interface UseAgentOptions {
  model: string
  tools?: Tool[]
  api?: string
  config?: Record<string, any>
}

interface UseAgentReturn {
  run: (input: { query: string; context?: any }) => Promise<string>
  isLoading: boolean
  error: Error | null
  state: {
    currentStep: number
    totalSteps: number
    toolCalls: any[]
  }
}
```

**Basic Usage**:
```tsx
import { useAgent } from '@/hooks'

export function AgentChat() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [webSearchTool, calculatorTool],
    api: '/api/agent',
  })

  const handleQuery = async (query: string) => {
    try {
      const response = await agent.run({ query })
      console.log('Agent response:', response)
    } catch (err) {
      console.error('Agent failed:', err)
    }
  }

  return (
    <div>
      <input
        placeholder="Ask the agent..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleQuery(e.currentTarget.value)
          }
        }}
        disabled={agent.isLoading}
      />
      {agent.isLoading && <p>Agent thinking... (Step {agent.state.currentStep}/{agent.state.totalSteps})</p>}
      {agent.error && <p className="error">{agent.error.message}</p>}
    </div>
  )
}
```

**Tool Orchestration**:
```tsx
interface Tool {
  name: string
  description: string
  schema: JSONSchema
  execute: (input: any) => Promise<any>
}

const tools: Tool[] = [
  {
    name: 'search',
    description: 'Search the web',
    schema: { type: 'object', properties: { query: { type: 'string' } } },
    execute: async (input) => {
      const results = await fetch(`/api/search?q=${input.query}`)
      return results.json()
    },
  },
]

const agent = useAgent({ model: 'gpt-4', tools })
```

**Agent State Tracking**:
```tsx
const agent = useAgent({ model: 'gpt-4', tools })

// Track multi-step execution
React.useEffect(() => {
  if (agent.state.totalSteps > 1) {
    console.log(`Progress: ${agent.state.currentStep}/${agent.state.totalSteps}`)
    agent.state.toolCalls.forEach(call => {
      console.log(`- Called: ${call.tool} with args:`, call.args)
    })
  }
}, [agent.state])
```

---

### useContextMonitor

Monitors context window usage and provides optimization recommendations.

**TypeScript Signature**:
```typescript
function useContextMonitor(options: UseContextMonitorOptions): {
  utilization: ContextUtilization
  efficiency: ContextEfficiency
  warnings: ContextWarning[]
  recommendations: OptimizationRecommendation[]
  breakdown: ContextBreakdown
}

interface ContextUtilization {
  tokensUsed: number
  tokensTotal: number
  percentUsed: number
  status: 'critical' | 'warning' | 'good' | 'optimal'
}

interface ContextWarning {
  type: WarningType
  level: WarningLevel
  message: string
}

interface OptimizationRecommendation {
  priority: 'high' | 'medium' | 'low'
  suggestion: string
  potentialSavings: number
}
```

**Usage Example**:
```tsx
import { useContextMonitor } from '@/hooks'

export function ContextDisplay() {
  const monitor = useContextMonitor({
    warningThreshold: 0.7,
    criticalThreshold: 0.85,
  })

  return (
    <div className="context-monitor">
      <div className={`status ${monitor.utilization.status}`}>
        {monitor.utilization.percentUsed}% utilized
      </div>

      {monitor.warnings.map((warning) => (
        <Alert key={warning.message} level={warning.level}>
          {warning.message}
        </Alert>
      ))}

      <div className="recommendations">
        {monitor.recommendations.map((rec) => (
          <Suggestion key={rec.suggestion} priority={rec.priority}>
            {rec.suggestion} (saves ~{rec.potentialSavings} tokens)
          </Suggestion>
        ))}
      </div>
    </div>
  )
}
```

---

## Composition Hooks

Composition Hooks help build custom layouts and UI compositions.

**Purpose**: Build custom layouts with flexible composition
**Location**: `hooks/prompt-composer/`, `hooks/dashboard/`

---

### usePromptComposer

Progressive disclosure system for building context-aware prompt interfaces.

**TypeScript Signature**:
```typescript
function usePromptComposer(config: PromptComposerConfig): UsePromptComposerReturn

interface UsePromptComposerReturn {
  // State
  promptState: PromptState
  contextItems: ContextItem[]
  attachments: Attachment[]
  suggestions: Suggestion[]
  commands: Command[]

  // Methods
  addContextItem: (item: ContextItem) => void
  removeContextItem: (id: string) => void
  rankContextItems: () => ContextItem[]
  attachFile: (file: File) => Promise<void>
  detachFile: (id: string) => void

  // Token budgeting
  tokenBudget: number
  tokensUsed: number
  estimateTokens: (content: string) => number

  // Submission
  buildPrompt: () => PromptMessage
  submit: () => Promise<void>

  // Progressive disclosure
  expandLevel: number
  setExpandLevel: (level: number) => void
}

interface PromptComposerConfig {
  api: string
  tokenBudget?: number
  features?: {
    context?: {
      enabled: boolean
      triggers: string[] // e.g., ['@', '#']
      providers: ContextProvider[]
    }
    attachments?: {
      enabled: boolean
      maxSize: number
      types: string[]
    }
    suggestions?: boolean
    commands?: boolean
  }
}
```

**Basic Usage**:
```tsx
import { usePromptComposer } from '@/hooks'

export function PromptComposerUI() {
  const composer = usePromptComposer({
    api: '/api/chat',
    tokenBudget: 8000,
    features: {
      context: {
        enabled: true,
        triggers: ['@'],
        providers: [fileProvider, docProvider],
      },
      attachments: {
        enabled: true,
        maxSize: 10 * 1024 * 1024,
        types: ['text/*', 'application/pdf'],
      },
    },
  })

  return (
    <div className="prompt-composer">
      <PromptEditor
        value={composer.promptState.content}
        contextItems={composer.contextItems}
        onAddContext={composer.addContextItem}
      />

      <TokenBudgetBar
        used={composer.tokensUsed}
        total={composer.tokenBudget}
      />

      <div className="attachments">
        {composer.attachments.map((att) => (
          <AttachmentTag
            key={att.id}
            attachment={att}
            onRemove={() => composer.detachFile(att.id)}
          />
        ))}
      </div>

      <button onClick={() => composer.submit()}>Send</button>
    </div>
  )
}
```

**Context Ranking Pattern**:
```tsx
// Smart relevance ranking for @mentions
const ranked = composer.rankContextItems()

// Returns items sorted by relevance
// Uses semantic similarity and usage frequency
```

**Token Budget Management**:
```tsx
const composer = usePromptComposer({ api: '/api/chat', tokenBudget: 8000 })

const handleAddContent = (content: string) => {
  const tokens = composer.estimateTokens(content)

  if (composer.tokensUsed + tokens > composer.tokenBudget) {
    console.warn('Would exceed token budget')
    return
  }

  composer.addContextItem({
    id: crypto.randomUUID(),
    type: 'text',
    content,
    tokens,
  })
}
```

**Progressive Disclosure States**:
```tsx
// 9 disclosure levels for progressive expansion
// 0-3: Collapsed (titles only)
// 4-6: Partial (summaries)
// 7-9: Expanded (full content)

const levels = {
  0: 'Minimal - Show nothing',
  4: 'Summary - Show titles and summaries',
  9: 'Full - Show complete content',
}

composer.setExpandLevel(4) // Switch to summary view
```

**File Attachment Handling**:
```tsx
const handleDrop = async (files: File[]) => {
  for (const file of files) {
    try {
      await composer.attachFile(file)
    } catch (err) {
      console.error(`Failed to attach ${file.name}:`, err)
    }
  }
}

const attachments = composer.attachments
// Access file content and metadata
```

---

### useDashboardComposer

Orchestrates multiple data sources for dashboard/panel layouts.

**TypeScript Signature**:
```typescript
function useDashboardComposer<T extends Record<string, unknown>>(
  options: UseDashboardComposerOptions<T>
): DashboardComposerState<T> & DashboardComposerActions

interface DashboardComposerState<T extends Record<string, unknown>> {
  sources: { [K in keyof T]: DataSourceState<T[K]> }
  isLoading: boolean
  isReady: boolean
  hasError: boolean
  errors: Array<{ key: string; error: Error }>
  isStale: boolean
  loadingProgress: number
}

interface DashboardComposerActions {
  refetchAll: () => Promise<void>
  refetch: (key: string) => Promise<void>
  invalidateAll: () => void
  invalidate: (key: string) => void
  reset: () => void
}
```

**Usage Example - Multi-Source Dashboard**:
```tsx
import { useDashboardComposer } from '@/hooks'

export function AdminDashboard() {
  const dashboard = useDashboardComposer({
    sources: [
      {
        key: 'users',
        fetcher: async () => {
          const res = await fetch('/api/users')
          return res.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        maxRetries: 3,
      },
      {
        key: 'stats',
        fetcher: async () => {
          const res = await fetch('/api/stats')
          return res.json()
        },
        staleTime: 1 * 60 * 1000, // 1 minute
      },
      {
        key: 'events',
        fetcher: async () => {
          const res = await fetch('/api/events')
          return res.json()
        },
        required: false,
      },
    ],
    fetchOnMount: true,
    parallel: true,
    onSuccess: () => console.log('All data loaded'),
    onError: (errors) => console.error('Load errors:', errors),
  })

  if (dashboard.isLoading) {
    return <Spinner progress={dashboard.loadingProgress} />
  }

  return (
    <div className="dashboard">
      {dashboard.sources.users.data && (
        <UserPanel users={dashboard.sources.users.data} />
      )}

      {dashboard.sources.stats.data && (
        <StatsPanel stats={dashboard.sources.stats.data} />
      )}

      {dashboard.sources.events.data && (
        <EventPanel events={dashboard.sources.events.data} />
      )}

      {dashboard.hasError && (
        <ErrorBanner errors={dashboard.errors} />
      )}

      <button onClick={() => dashboard.refetchAll()}>Refresh</button>
    </div>
  )
}
```

**Selective Refetch Pattern**:
```tsx
const dashboard = useDashboardComposer({
  sources: [
    { key: 'users', fetcher: fetchUsers },
    { key: 'posts', fetcher: fetchPosts },
  ],
})

// Refetch specific source
const handleUserCreated = async () => {
  await dashboard.refetch('users')
  // Only users data is refreshed
}

// Refetch all
const handleRefreshAll = async () => {
  await dashboard.refetchAll()
}
```

**Stale Data Management**:
```tsx
const dashboard = useDashboardComposer({
  sources: [
    {
      key: 'data',
      fetcher: fetchData,
      staleTime: 5 * 60 * 1000, // Stale after 5 minutes
    },
  ],
})

if (dashboard.isStale) {
  return (
    <StaleDataBanner
      onRefresh={() => dashboard.refetchAll()}
    />
  )
}
```

**Error Boundaries**:
```tsx
const dashboard = useDashboardComposer({
  sources: [
    { key: 'critical', fetcher: fetchCritical, required: true },
    { key: 'optional', fetcher: fetchOptional, required: false },
  ],
})

// Can render if optional fails, but not if required fails
const canRender = dashboard.isReady || !dashboard.sources.critical.error

if (dashboard.sources.optional.error && !dashboard.sources.optional.data) {
  return <PartialDashboard criticalData={dashboard.sources.critical.data} />
}
```

---

## Common Patterns

### Provider Setup

Before using any hooks, wrap your app with `ClarityChatProvider`:

```tsx
import { ClarityChatProvider } from '@/providers'

export function App() {
  return (
    <ClarityChatProvider>
      <ChatInterface />
    </ClarityChatProvider>
  )
}
```

### Hook Composition

Combine multiple hooks for rich functionality:

```tsx
export function AdvancedChat() {
  // Context hooks
  const chat = useClarityChat({ api: '/api/chat' })
  const agent = useAgent({ model: 'gpt-4', tools: [webSearch] })

  // Connected hooks
  const senderProps = useConnectedSender()
  const thinkingProps = useConnectedThinkingBar()

  // Composition
  const composer = usePromptComposer({ api: '/api/chat' })

  return (
    <div className="advanced-chat">
      <ThinkingBar {...thinkingProps} />
      <PromptComposer {...composer} />
      <Sender {...senderProps} />
    </div>
  )
}
```

### Error Handling

Consistent error handling across hooks:

```tsx
export function SafeChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  React.useEffect(() => {
    if (chat.error) {
      // Handle specific error types
      if (chat.error.message.includes('rate limit')) {
        showNotification('Rate limited. Please wait.')
      } else if (chat.error.message.includes('auth')) {
        redirectToLogin()
      } else {
        showNotification('Chat error: ' + chat.error.message)
      }
    }
  }, [chat.error])

  return <ChatWindow {...chat} />
}
```

### Token Management

Track and manage token usage:

```tsx
export function TokenAwareChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const monitor = useContextMonitor({ warningThreshold: 0.8 })

  const canContinueChat = monitor.utilization.percentUsed < 90

  return (
    <div>
      <TokenDisplay
        used={monitor.utilization.tokensUsed}
        total={monitor.utilization.tokensTotal}
        status={monitor.utilization.status}
      />

      {!canContinueChat && (
        <WarningBanner>
          Context window nearly full. Start a new conversation?
        </WarningBanner>
      )}

      <Sender
        {...useConnectedSender()}
        disabled={!canContinueChat}
      />
    </div>
  )
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Hook returns `null` from useConnectedProps

**Cause**: Component not wrapped with `ClarityChatProvider`

**Solution**:
```tsx
// ✗ Wrong
<MyComponent />

// ✓ Correct
<ClarityChatProvider>
  <MyComponent />
</ClarityChatProvider>
```

#### Issue: Bridge hook not updating UI

**Cause**: External SDK state not propagating

**Solution**:
```tsx
// Ensure SDK hook dependency is tracked
const chat = useChat({ api: '/api/chat' })
const bridge = useVercelAIBridge(chat) // Pass chat object

// Verify bridge props are used
<ThinkingBar {...bridge.thinkingBarProps} />
```

#### Issue: Message not sending

**Cause**: Async function not properly awaited

**Solution**:
```tsx
// ✗ Wrong
const handleSend = () => {
  senderProps.onSend(message) // Not awaited
}

// ✓ Correct
const handleSend = async () => {
  try {
    await senderProps.onSend(message)
  } catch (err) {
    console.error('Send failed:', err)
  }
}
```

#### Issue: Memory leak warnings

**Cause**: Event listeners not unsubscribed

**Solution**:
```tsx
React.useEffect(() => {
  const unsubscribe = chat.on('message:sent', handler)

  // Cleanup on unmount
  return () => unsubscribe()
}, [chat])
```

#### Issue: Token estimation inaccurate

**Cause**: Using wrong model for tokenization

**Solution**:
```tsx
const composer = usePromptComposer({
  api: '/api/chat',
  model: 'gpt-4', // Specify correct model
})

// Estimate will use correct tokenizer
const tokens = composer.estimateTokens(content)
```

#### Issue: Progressive disclosure not working

**Cause**: Expand level not affecting rendered content

**Solution**:
```tsx
// Ensure component responds to expandLevel
const composer = usePromptComposer(config)

<ContextView
  items={composer.contextItems}
  expandLevel={composer.expandLevel}
  onExpandChange={composer.setExpandLevel}
/>
```

### Performance Optimization

**Memoize connected props**:
```tsx
const senderProps = React.useMemo(
  () => useConnectedSender(),
  [] // Only recalculate if dependencies change
)
```

**Debounce frequent updates**:
```tsx
const composer = usePromptComposer(config)

const debouncedEstimate = React.useMemo(
  () => debounce((content: string) => composer.estimateTokens(content), 300),
  [composer]
)
```

**Lazy load heavy bridges**:
```tsx
const LangChainChat = React.lazy(() =>
  import('./LangChainChat').then(m => ({
    default: m.LangChainChat,
  }))
)

// Use with Suspense
<React.Suspense fallback={<Loading />}>
  <LangChainChat />
</React.Suspense>
```

### Debugging

**Enable debug mode**:
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  debug: true, // Logs all state changes
})
```

**Monitor hook state**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })

React.useEffect(() => {
  console.log('Chat state:', {
    messages: chat.messages.length,
    isStreaming: chat.isStreaming,
    isThinking: chat.isThinking,
    error: chat.error?.message,
  })
}, [chat.messages, chat.isStreaming, chat.isThinking, chat.error])
```

**Validate bridge setup**:
```tsx
const externalChat = useChat({ api: '/api/chat' })
const bridge = useVercelAIBridge(externalChat)

console.assert(
  bridge.conversationsProps.items.length > 0,
  'Bridge not receiving messages'
)

console.assert(
  bridge.senderProps.onSend,
  'Bridge onSend handler missing'
)
```

---

## Summary

- **Connected Hooks**: Auto-wire components to ClarityChatProvider
- **Bridge Hooks**: Integrate external SDKs with consistent props
- **Context Hooks**: Access provider state and manage chat/agent logic
- **Composition Hooks**: Build custom layouts with flexible composition

Choose the right hook layer for your needs:
- **Top-level (Drop-in ready)**: `useClarityChat`, `useAgent`, Connected Hooks
- **Mid-level (Framework integration)**: Bridge Hooks, `usePromptComposer`
- **Low-level (Custom logic)**: Raw state hooks in subdirectories
