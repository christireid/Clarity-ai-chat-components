# Components

> UI components for building AI chat interfaces.

## Component Hierarchy

```
Top-Level (Drop-in Ready)
├── ClarityChat          # Complete chat interface
└── ClarityChatPresets   # Pre-configured chat variants

Mid-Level (Composable)
├── ChatWindow           # Chat container with header/body/footer
├── ChatInput            # Message input with rich features
├── MessageList          # Virtualized message list
├── StreamingMessage     # Real-time streaming display
└── ...

Low-Level (Primitives)
├── Message              # Single message display
├── MessageMetadata      # Message timestamps, tokens
├── TypingIndicator      # Typing animation
└── ...
```

## Quick Start

### Drop-in Usage

```tsx
import { ClarityChat } from '@clarity-chat/react'

function App() {
  return <ClarityChat api="/api/chat" placeholder="Ask me anything..." />
}
```

### Composable Usage

```tsx
import { ChatWindow, ChatInput, MessageList, useClarityChat } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatWindow>
      <MessageList messages={chat.messages} />
      <ChatInput
        value={chat.input}
        onChange={chat.setInput}
        onSubmit={() => chat.append({ role: 'user', content: chat.input })}
      />
    </ChatWindow>
  )
}
```

## Component Categories

### Chat Core

- `ClarityChat` - Complete chat solution
- `ChatWindow` - Chat container
- `ChatInput` - Message input
- `MessageList` - Virtualized messages

### Messages

- `Message` - Single message
- `StreamingMessage` - Streaming display
- `MessageMetadata` - Metadata display
- `MessageActions` - Copy, edit, delete

### Indicators

- `TypingIndicator` - Typing animation
- `ThinkingIndicator` - AI thinking state
- `NetworkStatus` - Connection status

### Tools & Agents

- `ToolInvocationCard` - Tool calls display
- `AgentRunFeed` - Agent execution feed

### Enterprise

- `AuditLogViewer` - Audit logs
- `UsageDashboard` - Usage metrics
- `SafetyStatusCard` - Content safety

## File Structure

Each component folder should contain:

```
ComponentName/
├── index.ts              # Public exports
├── ComponentName.tsx     # Main component
├── types.ts              # Component types
├── hooks.ts              # Component hooks (optional)
├── utils.ts              # Component utilities (optional)
└── README.md             # Component documentation
```

## Design Principles

1. **Composability**: Components can be used together or independently
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Theming**: Full theme customization support
4. **Performance**: Virtualization for large lists
5. **TypeScript**: Full type safety
