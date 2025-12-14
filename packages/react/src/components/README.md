# Components

> UI components for building AI chat interfaces, organized by domain.

## Directory Structure

Components are now organized into domain-specific subdirectories for better discoverability:

```
components/
├── chat/              # Core chat components
│   ├── clarity-chat.tsx
│   ├── chat-window.tsx
│   ├── chat-input.tsx
│   ├── chat-recipes.tsx
│   └── ...
├── message/           # Message display components
│   ├── message.tsx
│   ├── streaming-message.tsx
│   ├── thinking-indicator.tsx
│   └── ...
├── input/             # User input components
│   ├── advanced-chat-input.tsx
│   ├── voice-input.tsx
│   └── ...
├── search/            # Search functionality
│   ├── message-search.tsx
│   ├── advanced-message-search.tsx
│   └── ...
├── dashboards/        # Analytics & monitoring
│   ├── analytics-dashboard.tsx
│   ├── usage-dashboard.tsx
│   └── ...
├── token/             # Token management
│   ├── token-counter.tsx
│   ├── token-usage-meter.tsx
│   └── ...
├── theme-components/  # Theme UI
│   ├── theme-switcher.tsx
│   ├── theme-preview.tsx
│   └── ...
├── navigation/        # Keyboard nav & command palette
│   ├── command-palette.tsx
│   ├── keyboard-shortcuts-modal.tsx
│   └── ...
├── conversation/      # Conversation management
│   ├── conversation-list.tsx
│   ├── conversation-timeline.tsx
│   └── ...
├── feedback/          # Error handling & status
│   ├── error-boundary.tsx
│   ├── network-status.tsx
│   └── ...
├── media/             # Documents & files
│   ├── document-viewer.tsx
│   ├── export-dialog.tsx
│   └── ...
├── ui/                # Generic UI primitives
│   ├── skeleton.tsx
│   ├── toast.tsx
│   └── ...
├── ai/                # AI-specific features
│   ├── agent-run-feed.tsx
│   ├── model-selector.tsx
│   └── ...
├── prompt/            # Prompt suggestions
│   ├── prompt-suggestions.tsx
│   ├── prompt-library.tsx
│   └── ...
├── context/           # Context management
│   ├── context-card.tsx
│   ├── history-manager.tsx
│   └── ...
├── code/              # Code display (existing)
├── enterprise/        # Enterprise features (existing)
├── ai-ops/            # AI operations (existing)
└── ab-testing/        # A/B testing (existing)
```

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

### Importing from Specific Domains

```tsx
// Import directly from domain for better tree-shaking
import { ClarityChat } from '@clarity-chat/react/components/chat'
import { TokenCounter } from '@clarity-chat/react/components/token'
import { ErrorBoundary } from '@clarity-chat/react/components/feedback'
```

## Domain Guide

| Domain | Purpose | Key Components |
|--------|---------|----------------|
| `chat/` | Core chat experience | ClarityChat, ChatWindow, ChatInput |
| `message/` | Message display | Message, StreamingMessage, TypingIndicator |
| `input/` | User input | AdvancedChatInput, VoiceInput, MentionInput |
| `search/` | Search functionality | MessageSearch, SemanticMessageSearch |
| `dashboards/` | Analytics | AnalyticsDashboard, UsageDashboard |
| `token/` | Token management | TokenCounter, TokenOptimizationPanel |
| `theme-components/` | Theme UI | ThemeSwitcher, ThemeCustomizer |
| `navigation/` | Navigation | CommandPalette, KeyboardShortcutsModal |
| `conversation/` | Conversations | ConversationList, ConversationTimeline |
| `feedback/` | Error/status | ErrorBoundary, NetworkStatus |
| `media/` | Documents/files | DocumentViewer, ExportDialog |
| `ui/` | UI primitives | Skeleton, Toast, EmptyState |
| `ai/` | AI features | AgentRunFeed, ModelSelector |
| `prompt/` | Prompts | PromptSuggestions, PromptLibrary |
| `context/` | Context/memory | ContextCard, HistoryManager |

## Design Principles

1. **Composability**: Components can be used together or independently
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Theming**: Full theme customization support
4. **Performance**: Virtualization for large lists
5. **TypeScript**: Full type safety
6. **Domain Organization**: Related components grouped together
