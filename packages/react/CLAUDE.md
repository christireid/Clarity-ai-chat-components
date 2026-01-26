# React Package Development Guide

> **Package**: @clarity-chat/react **Last Updated**: January 26, 2026 **Version**: 1.0+

## Overview

This document provides guidance for developing and maintaining the `@clarity-chat/react` package,
which contains the core React components for Clarity AI Chat Components.

---

## Table of Contents

1. [Package Structure](#package-structure)
2. [Development Patterns](#development-patterns)
3. [Component Guidelines](#component-guidelines)
4. [Hook Guidelines](#hook-guidelines)
5. [Testing Strategy](#testing-strategy)
6. [Performance Considerations](#performance-considerations)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Type Safety](#type-safety)

---

## Package Structure

```
packages/react/
├── src/
│   ├── components/        # React components
│   │   ├── ai/           # AI-specific components
│   │   ├── conversation/ # Conversation management
│   │   ├── dashboards/   # Analytics dashboards
│   │   ├── feedback/     # User feedback
│   │   ├── input/        # Input components
│   │   ├── media/        # Media components
│   │   ├── message/      # Message display
│   │   ├── navigation/   # Navigation components
│   │   ├── prompt/       # Prompt components
│   │   ├── search/       # Search components
│   │   └── ui/           # Base UI components
│   ├── hooks/            # React hooks
│   │   ├── use-clarity-chat/    # Core chat hook
│   │   └── clarity-tokens/      # Token management hooks
│   ├── primitives/       # Base primitives
│   │   └── chat/         # Chat primitives
│   ├── examples/         # Example implementations
│   ├── utils/            # Utility functions
│   └── index.ts          # Main exports
├── tests/                # Test files
├── package.json          # Package configuration
└── tsconfig.json         # TypeScript configuration
```

---

## Development Patterns

### 1. Component Organization

Components are organized by domain:

- **ai/**: AI-specific functionality (persona panel, model selector, knowledge base)
- **conversation/**: Conversation management (list, timeline, branches)
- **input/**: Input components (chat input, file upload, voice input)
- **message/**: Message display (content, actions, metadata)
- **ui/**: Base UI primitives (button, card, badge)

### 2. Naming Conventions

All component files use **PascalCase**:

```
✅ Good: MessageList.tsx, ChatInput.tsx, VoiceInput.tsx
❌ Bad: message-list.tsx, chat_input.tsx, voiceInput.tsx
```

### 3. Import Organization

```tsx
// External dependencies
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Internal dependencies (absolute imports)
import { useClarityChat } from '@/hooks/use-clarity-chat'
import { Button } from '@/components/ui/button'
import { cn } from '@clarity-chat/primitives'

// Types
import type { Message, ChatConfig } from '@/types'
```

### 4. Component Structure

```tsx
// 1. Imports
import React from 'react'
import type { ComponentProps } from './types'

// 2. Type definitions
interface MyComponentProps extends ComponentProps {
  // Props
}

// 3. Component implementation
export function MyComponent({ prop1, prop2, ...props }: MyComponentProps) {
  // Hooks (order: state, refs, context, custom hooks)
  const [state, setState] = useState()
  const ref = useRef()
  const context = useContext(MyContext)
  const { data } = useCustomHook()

  // Effects
  useEffect(() => {
    // Effect logic
  }, [])

  // Event handlers
  const handleClick = () => {
    // Handler logic
  }

  // Render helpers
  const renderContent = () => {
    // Helper logic
  }

  // Render
  return <div className={cn('base-classes', props.className)}>{renderContent()}</div>
}

// 4. Display name
MyComponent.displayName = 'MyComponent'
```

---

## Component Guidelines

### 1. Use TypeScript Strictly

```tsx
// ✅ Good: Proper typing
interface ChatMessageProps {
  message: Message
  onEdit?: (id: string, content: string) => void
  isStreaming: boolean
}

export function ChatMessage({ message, onEdit, isStreaming }: ChatMessageProps) {
  // Implementation
}

// ❌ Bad: Any types
export function ChatMessage(props: any) {
  // Implementation
}
```

### 2. Implement Accessibility First

```tsx
// ✅ Good: ARIA labels, keyboard navigation
<button
  onClick={handleDelete}
  onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
  aria-label={`Delete message ${messageId}`}
  className="delete-btn"
>
  <TrashIcon aria-hidden="true" />
</button>

// ❌ Bad: No accessibility
<div onClick={handleDelete}>
  <TrashIcon />
</div>
```

### 3. Use Branded Types for IDs

```tsx
// ✅ Good: Type-safe IDs
type MessageId = string & { readonly __brand: 'MessageId' }
type ConversationId = string & { readonly __brand: 'ConversationId' }

function deleteMessage(id: MessageId) {
  // TypeScript ensures correct ID type
}

// ❌ Bad: Plain strings
function deleteMessage(id: string) {
  // Could accidentally pass wrong ID type
}
```

### 4. Memoize Expensive Components

```tsx
// ✅ Good: Memoized component
export const MessageList = React.memo(function MessageList({ messages }: Props) {
  return (
    <div>
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  )
})

// ❌ Bad: Re-renders on every parent update
export function MessageList({ messages }: Props) {
  // Will re-render even if messages haven't changed
}
```

### 5. Provide Sensible Defaults

```tsx
// ✅ Good: Defaults for optional props
interface ChatWindowProps {
  theme?: 'light' | 'dark'
  maxMessages?: number
  enableVoice?: boolean
}

export function ChatWindow({
  theme = 'light',
  maxMessages = 100,
  enableVoice = false,
  ...props
}: ChatWindowProps) {
  // Implementation
}
```

### 6. Support Reduced Motion

```tsx
// ✅ Good: Respect reduced motion
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function AnimatedMessage({ message }: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    >
      {message.content}
    </motion.div>
  )
}

// ❌ Bad: Always animate
export function AnimatedMessage({ message }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {message.content}
    </motion.div>
  )
}
```

---

## Hook Guidelines

### 1. Follow React Hooks Rules

```tsx
// ✅ Good: Hooks at top level
function useMyHook() {
  const [state, setState] = useState()
  const [other, setOther] = useState()

  useEffect(() => {
    // Effect
  }, [state])

  return { state, setState }
}

// ❌ Bad: Conditional hooks
function useMyHook(condition: boolean) {
  if (condition) {
    const [state, setState] = useState() // ❌ Conditional hook
  }
}
```

### 2. Return Object, Not Array

```tsx
// ✅ Good: Object return (easier to use)
function useChat() {
  return {
    messages,
    append,
    isLoading,
  }
}

const { messages, isLoading } = useChat()

// ❌ Bad: Array return (harder to destructure selectively)
function useChat() {
  return [messages, append, isLoading]
}

const [messages, , isLoading] = useChat() // Must include empty slot
```

### 3. Document Complex Hooks

````tsx
/**
 * Custom hook for managing chat state with memory integration
 *
 * @param config - Chat configuration
 * @returns Chat state and handlers
 *
 * @example
 * ```tsx
 * const { messages, append, isLoading } = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true },
 * })
 * ```
 */
export function useClarityChat(config: ChatConfig) {
  // Implementation
}
````

### 4. Memoize Callbacks

```tsx
// ✅ Good: Memoized callbacks
export function useMessageActions() {
  const handleEdit = useCallback((id: string, content: string) => {
    // Edit logic
  }, [])

  const handleDelete = useCallback((id: string) => {
    // Delete logic
  }, [])

  return { handleEdit, handleDelete }
}

// ❌ Bad: New function on every render
export function useMessageActions() {
  return {
    handleEdit: (id: string, content: string) => {
      // Creates new function each render
    },
    handleDelete: (id: string) => {
      // Creates new function each render
    },
  }
}
```

---

## Testing Strategy

### 1. Unit Tests for Hooks

```tsx
// tests/hooks/use-clarity-chat.test.ts
import { renderHook, act } from '@testing-library/react'
import { useClarityChat } from '@/hooks/use-clarity-chat'

describe('useClarityChat', () => {
  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    expect(result.current.messages).toEqual([])
  })

  it('appends messages', async () => {
    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    await act(async () => {
      await result.current.append({ role: 'user', content: 'Hello' })
    })

    expect(result.current.messages).toHaveLength(1)
  })
})
```

### 2. Component Tests

```tsx
// tests/components/ChatMessage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatMessage } from '@/components/message/ChatMessage'

describe('ChatMessage', () => {
  const mockMessage = {
    id: '1',
    role: 'user',
    content: 'Hello',
  }

  it('renders message content', () => {
    render(<ChatMessage message={mockMessage} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<ChatMessage message={mockMessage} onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith('1', 'Hello')
  })
})
```

### 3. Accessibility Tests

```tsx
// tests/components/Button.test.tsx
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Button } from '@/components/ui/button'

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### 4. Coverage Requirements

- **Unit Tests**: 85%+ coverage for hooks and utilities
- **Component Tests**: 80%+ coverage for components
- **Integration Tests**: Critical user flows
- **Accessibility Tests**: All interactive components

---

## Performance Considerations

### 1. Lazy Load Heavy Components

```tsx
// ✅ Good: Lazy loading
const MonacoEditor = React.lazy(() => import('./MonacoEditor'))

function CodeEditor() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MonacoEditor />
    </Suspense>
  )
}
```

### 2. Virtual Scrolling for Long Lists

```tsx
// ✅ Good: Virtual scrolling for >50 messages
import { useVirtualizer } from '@tanstack/react-virtual'

function MessageList({ messages }: Props) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <Message key={item.index} message={messages[item.index]} />
        ))}
      </div>
    </div>
  )
}
```

### 3. Debounce Input Handlers

```tsx
// ✅ Good: Debounced input
import { debounce } from '@clarity-chat/utils'

function SearchInput() {
  const handleSearch = debounce((query: string) => {
    // Search logic
  }, 300)

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

### 4. Memoize Expensive Computations

```tsx
// ✅ Good: Memoized computation
function TokenCounter({ messages }: Props) {
  const totalTokens = useMemo(() => {
    return messages.reduce((acc, msg) => acc + countTokens(msg.content), 0)
  }, [messages])

  return <div>Total: {totalTokens} tokens</div>
}
```

---

## Accessibility Requirements

### 1. Keyboard Navigation

All interactive components must support keyboard navigation:

- **Enter/Space**: Activate buttons
- **Tab**: Focus next element
- **Shift+Tab**: Focus previous element
- **Escape**: Close modals/dialogs
- **Arrow keys**: Navigate lists/menus

### 2. ARIA Attributes

```tsx
// ✅ Good: ARIA attributes
<button
  aria-label="Send message"
  aria-disabled={isLoading}
  aria-pressed={isPressed}
>
  <SendIcon aria-hidden="true" />
</button>

<div role="status" aria-live="polite">
  {isLoading ? 'Sending...' : 'Message sent'}
</div>
```

### 3. Color Contrast

All text must meet WCAG 2.1 AA standards:

- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio
- **Interactive elements**: 3:1 contrast ratio

### 4. Focus Indicators

```tsx
// ✅ Good: Visible focus indicator
<button className="focus-visible:ring-2 focus-visible:ring-blue-500">
  Click me
</button>

// ❌ Bad: No focus indicator
<button className="focus:outline-none">
  Click me
</button>
```

---

## Type Safety

### 1. Branded Types for IDs

```tsx
// packages/react/src/types/branded.ts
export type MessageId = string & { readonly __brand: 'MessageId' }
export type ConversationId = string & { readonly __brand: 'ConversationId' }
export type UserId = string & { readonly __brand: 'UserId' }

// Type guards
export function isMessageId(value: string): value is MessageId {
  return typeof value === 'string' && value.length > 0
}
```

### 2. Discriminated Unions

```tsx
// ✅ Good: Discriminated union
type Message =
  | { type: 'text'; content: string }
  | { type: 'image'; imageUrl: string; caption?: string }
  | { type: 'file'; fileName: string; fileSize: number }

function renderMessage(message: Message) {
  switch (message.type) {
    case 'text':
      return <TextMessage content={message.content} />
    case 'image':
      return <ImageMessage url={message.imageUrl} caption={message.caption} />
    case 'file':
      return <FileMessage name={message.fileName} size={message.fileSize} />
  }
}
```

### 3. Generic Components

```tsx
// ✅ Good: Generic component
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <div key={keyExtractor(item)}>{renderItem(item)}</div>
      ))}
    </div>
  )
}
```

### 4. Strict TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Common Patterns

### 1. Error Boundaries

```tsx
// ✅ Good: Error boundary wrapper
<ErrorBoundary fallback={<ErrorFallback />}>
  <ChatComponent />
</ErrorBoundary>
```

### 2. Loading States

```tsx
// ✅ Good: Loading state
{
  isLoading ? <Skeleton /> : <Content />
}
```

### 3. Conditional Rendering

```tsx
// ✅ Good: Early return
function Message({ message }: Props) {
  if (!message) return null

  return <div>{message.content}</div>
}

// ❌ Bad: Nested ternaries
function Message({ message }: Props) {
  return message ? <div>{message.content}</div> : null
}
```

---

## Key Files

### Component Exports

```tsx
// src/index.ts
export { ClarityChatApp } from './components/ClarityChatApp'
export { ChatWindow } from './components/ChatWindow'
export { ChatMessage } from './components/message/ChatMessage'
export { ChatInput } from './components/input/ChatInput'
// ... more exports
```

### Hook Exports

```tsx
// src/hooks/index.ts
export { useClarityChat } from './use-clarity-chat/use-clarity-chat'
export { useTokenBudgetMonitor } from './clarity-tokens/use-token-budget-monitor'
// ... more exports
```

### Type Exports

```tsx
// src/types/index.ts
export type { Message, MessageId } from './message'
export type { Conversation, ConversationId } from './conversation'
export type { ChatConfig } from './config'
// ... more exports
```

---

## Development Workflow

### Before Starting

1. Pull latest from `main` branch
2. Check `git status` for uncommitted changes
3. Run `pnpm install` from monorepo root
4. Run `pnpm build` to ensure clean build

### During Development

1. Write TypeScript with strict mode enabled
2. Add tests for new functionality (85%+ coverage)
3. Run `pnpm lint` to catch issues
4. Run `pnpm test` in packages/react directory
5. Check accessibility with axe DevTools

### Before Committing

1. Run full test suite: `pnpm test`
2. Check TypeScript: `pnpm typecheck`
3. Lint code: `pnpm lint`
4. Format code: `pnpm format`
5. Review diff carefully

---

## Resources

### Internal Documentation

- [Main CLAUDE.md](../../apps/streamlined-docs/CLAUDE.md) - Repository-wide guide
- [Architecture](../../docs/architecture.md) - System architecture
- [Best Practices](../../docs/best-practices.md) - Coding best practices

### External Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `pnpm typecheck` for detailed errors
2. **Test Failures**: Check test isolation and mock dependencies
3. **Build Errors**: Clear `dist` folder and rebuild
4. **Import Errors**: Verify tsconfig paths configuration

### Debugging Tips

1. Use React DevTools for component debugging
2. Enable Profiler to identify performance issues
3. Use TypeScript's `satisfies` for type checking
4. Add `console.log` statements during development (remove before commit)

---

**Last Updated**: January 26, 2026 (Wave 3.4 completion)
