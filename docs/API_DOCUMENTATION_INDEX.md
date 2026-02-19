# API Documentation Index

Complete API documentation for Clarity AI Chat Components.

---

## Quick Links

| Document | Description | Status |
|----------|-------------|--------|
| [PromptComposer API Reference](./API_REFERENCE_PROMPT_COMPOSER.md) | Complete API for PromptComposer system | ✅ Complete |
| [Component Library](../packages/react/src/components/) | All React components | 📦 Source Code |
| [Hooks Library](../packages/react/src/hooks/) | All React hooks | 📦 Source Code |

---

## PromptComposer Documentation

**Location**: [API_REFERENCE_PROMPT_COMPOSER.md](./API_REFERENCE_PROMPT_COMPOSER.md)

### What's Included

1. **Overview**
   - System architecture
   - Key benefits (90% token savings)
   - Feature comparison

2. **Component API** (6 components)
   - PromptComposer (main)
   - ContextMentionInput (@mentions)
   - TokenBudgetIndicator (visualization)
   - ContextItemCard (display)
   - CommandPalette (/commands)
   - AttachmentManager (files)

3. **Hook API** (2 hooks)
   - usePromptComposer (main orchestrator)
   - useCommandPalette (command state)

4. **Type Definitions** (20+ types)
   - Core types (ContextItem, ContextProvider)
   - Command types
   - Suggestion types
   - Attachment types
   - Configuration types

5. **Utility Functions** (9 utilities)
   - buildPromptWithContext
   - createContextItem
   - rankByRelevance
   - calculateTokenSavings
   - filterContextItems
   - fuzzyMatch
   - calculateContextTokens
   - getTokenBudget
   - shouldAutoExpand

6. **Usage Examples** (5+ examples)
   - Basic usage
   - With file context
   - With commands
   - Full featured
   - Custom hook integration

7. **Integration Guides**
   - Next.js App Router
   - React + Vite
   - TypeScript strict mode
   - OpenAI API
   - Anthropic Claude API
   - Custom context providers

8. **Migration Guides**
   - From ChatInput
   - From MentionInput
   - From basic textarea
   - v0.x to v1.0 breaking changes

---

## Documentation Structure

```
docs/
├── API_REFERENCE_PROMPT_COMPOSER.md    # PromptComposer complete API
├── API_DOCUMENTATION_INDEX.md          # This file
├── architecture.md                     # System architecture
├── best-practices.md                   # Coding standards
└── plans/                             # Design documents
    └── 2026-01-27-prompt-composer-design.md

packages/react/
├── src/
│   ├── components/
│   │   └── prompt-composer/
│   │       ├── PromptComposer.tsx             # Main component
│   │       ├── ContextMentionInput.tsx        # @mention input
│   │       ├── TokenBudgetIndicator.tsx       # Token display
│   │       ├── ContextItemCard.tsx            # Context card
│   │       ├── CommandPalette.tsx             # /commands
│   │       ├── AttachmentManager.tsx          # File uploads
│   │       └── PromptComposer.example.tsx     # Live examples
│   │
│   └── hooks/
│       └── prompt-composer/
│           ├── usePromptComposer.ts           # Main hook
│           ├── context-utils.ts               # Utilities
│           ├── types.ts                       # Type definitions
│           └── index.ts                       # Exports
│
└── CLAUDE.md                                  # Package dev guide
```

---

## Quick Start Guide

### 1. Installation

```bash
npm install @clarity-chat/react
```

### 2. Basic Usage

```tsx
import { PromptComposer } from '@clarity-chat/react'

function App() {
  return (
    <PromptComposer
      api="/api/chat"
      tokenBudget={8000}
      onSubmit={(message) => console.log(message)}
    />
  )
}
```

### 3. With Context Providers

```tsx
import { PromptComposer, createContextItem } from '@clarity-chat/react'

const fileProvider = {
  type: 'file',
  search: async (query) => {
    const files = await searchFiles(query)
    return files.map(f => createContextItem({
      id: f.path,
      type: 'file',
      label: f.name,
      summary: `${f.name} - ${f.lines} lines`,
      preview: f.excerpt,
      full: f.content,
    }))
  },
}

function App() {
  return (
    <PromptComposer
      api="/api/chat"
      features={{
        context: {
          triggers: ['@'],
          providers: [fileProvider],
        },
      }}
    />
  )
}
```

---

## Key Features

### Progressive Context Expansion

**Problem**: Traditional AI chat sends full context → expensive, slow

**Solution**: PromptComposer uses 3 levels:

1. **Summary** (50 tokens): "Button.tsx - 250 lines, exports 3 components"
2. **Preview** (200 tokens): Show exports, types, key functions
3. **Full** (5000 tokens): Complete file content (only when needed)

**Result**: 90% token savings

### Smart Relevance Ranking

Context items are ranked by:
- Direct mention in message (+0.5)
- Related keywords (+0.3)
- Recently accessed (+0.2)
- Manual relevance score
- Priority boost

### Token Budget Visualization

Real-time display of:
- Current tokens / Budget
- Usage percentage
- Token savings vs traditional
- Cost saved in dollars
- Context breakdown by item

---

## API Quick Reference

### Components

```tsx
// Main component
<PromptComposer
  api="/api/chat"
  tokenBudget={8000}
  features={{ context, commands, attachments }}
  onSubmit={(message) => {}}
/>

// Context input
<ContextMentionInput
  value={value}
  onChange={(value, items) => {}}
  providers={[fileProvider]}
/>

// Token indicator
<TokenBudgetIndicator
  current={2300}
  max={8000}
  showSavings
/>

// Context card
<ContextItemCard
  item={contextItem}
  onExpand={(level) => {}}
  onRemove={() => {}}
/>

// Command palette
<CommandPalette
  commands={commands}
  query={query}
  onExecute={(cmd) => {}}
/>

// Attachments
<AttachmentManager
  attachments={files}
  onChange={setFiles}
  maxFiles={5}
/>
```

### Hooks

```tsx
// Main hook
const { state, actions, ref } = usePromptComposer({
  api: '/api/chat',
  tokenBudget: 8000,
})

// Command palette
const palette = useCommandPalette()
```

### Utilities

```tsx
// Build prompt with context
const result = buildPromptWithContext({
  message: 'Explain Button',
  contextItems: [fileContext],
  maxTokens: 8000,
})

// Create context item
const item = createContextItem({
  id: 'button',
  type: 'file',
  label: 'Button.tsx',
  summary: 'Button component',
  preview: 'exports Button, ButtonProps',
  full: fileContent,
})

// Rank by relevance
const ranked = rankByRelevance(items, message)

// Calculate savings
const savings = calculateTokenSavings(items, included)

// Filter items
const filtered = filterContextItems(items, query, true)

// Fuzzy match
const matches = fuzzyMatch('btn', 'Button.tsx') // true
```

---

## Type Reference

### Core Types

```tsx
type ContextType = 'file' | 'doc' | 'user' | 'web' | 'memory'

interface ContextItem {
  id: string
  type: ContextType
  label: string
  summary: string
  preview?: string
  full?: string
  tokens: { summary: number; preview: number; full: number }
  relevance?: number
  priority?: number
}

interface ContextProvider {
  type: ContextType
  search: (query: string) => Promise<ContextItem[]>
  priority?: number
  enabled?: boolean
}

interface Command {
  id: string
  trigger: string
  label: string
  description: string
  icon: React.ReactNode
  execute: () => void | Promise<void>
}

interface Suggestion {
  id: string
  type: 'starter' | 'continuation' | 'template' | 'smart'
  text: string
  icon?: React.ReactNode
}

interface Attachment {
  id: string
  type: 'image' | 'document' | 'code' | 'url'
  name: string
  size: number
  url: string
}

interface PromptMessage {
  content: string
  contextItems: ContextItem[]
  attachments: Attachment[]
  metadata?: {
    totalTokens: number
    timestamp: number
  }
}
```

---

## Common Patterns

### 1. File Context Provider

```tsx
const fileProvider: ContextProvider = {
  type: 'file',
  search: async (query) => {
    const files = await searchCodebase(query)
    return files.map(file => createContextItem({
      id: file.path,
      type: 'file',
      label: file.name,
      description: file.path,
      summary: `${file.name} - ${file.lines} lines`,
      preview: file.excerpt,
      full: file.content,
    }))
  },
  priority: 80,
}
```

### 2. Command with Args

```tsx
const commands: Command[] = [
  {
    id: 'search',
    trigger: '/search',
    label: 'Search',
    description: 'Search codebase',
    icon: <SearchIcon />,
    execute: async (args) => {
      const results = await search(args)
      showResults(results)
    },
  },
]
```

### 3. Custom Upload Handler

```tsx
<PromptComposer
  features={{
    attachments: {
      uploadHandler: async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const { url } = await response.json()

        return {
          id: Date.now().toString(),
          type: 'document',
          name: file.name,
          size: file.size,
          url,
        }
      },
    },
  }}
/>
```

---

## Performance Tips

### 1. Cache Provider Results

```tsx
const cache = new Map()

const fileProvider: ContextProvider = {
  search: async (query) => {
    const key = `files:${query}`
    if (cache.has(key)) return cache.get(key)

    const results = await searchFiles(query)
    cache.set(key, results)
    return results
  },
}
```

### 2. Debounce Search

```tsx
import { debounce } from 'lodash'

const debouncedSearch = debounce(searchFiles, 300)

const fileProvider: ContextProvider = {
  search: debouncedSearch,
}
```

### 3. Optimize Token Budgets

```tsx
const customBudgets = {
  file: { summary: 30, preview: 150, full: 3000 },
  doc: { summary: 20, preview: 100, full: 2000 },
}

<PromptComposer tokenBudgets={customBudgets} />
```

---

## Accessibility Features

- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- Focus management
- Reduced motion support
- High contrast mode
- Keyboard shortcuts

**Keyboard Shortcuts:**

- `Enter`: Submit
- `Shift+Enter`: New line
- `Escape`: Close dialogs
- `↑/↓`: Navigate
- `Tab`: Accept
- `/`: Commands
- `@`: Context

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Mobile

**Optional Features:**

- Voice Input: Requires Web Speech API (Chrome, Edge, Safari)
- Drag-Drop: All modern browsers
- Clipboard: Requires Clipboard API

---

## Troubleshooting

### Issue: Tokens don't match API

**Solution**: Use same tokenizer as AI provider

```tsx
import { encoding_for_model } from 'tiktoken'

const encoder = encoding_for_model('gpt-4')
const tokens = encoder.encode(text).length
```

### Issue: Context items not showing

**Solution**: Check provider is enabled and async

```tsx
const provider: ContextProvider = {
  type: 'file',
  search: async (query) => { /* ... */ },  // Must be async
  enabled: true,  // Must be enabled
}
```

### Issue: Commands not executing

**Solution**: Verify trigger starts with /

```tsx
{
  trigger: '/search',  // ✅ Correct
  trigger: 'search',   // ❌ Wrong
}
```

---

## Additional Resources

### Internal Docs

- [Main Documentation](../README.md)
- [Architecture Guide](./architecture.md)
- [Best Practices](./best-practices.md)
- [Package Dev Guide](../packages/react/CLAUDE.md)

### Examples

- [Component Demo](../apps/examples/component-demo/)
- [Storybook](../apps/storybook/)
- [Example File](../packages/react/src/components/prompt-composer/PromptComposer.example.tsx)

### External Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Anthropic API](https://docs.anthropic.com/claude/reference)

---

## Getting Help

1. Check the [API Reference](./API_REFERENCE_PROMPT_COMPOSER.md)
2. Review [Examples](../packages/react/src/components/prompt-composer/PromptComposer.example.tsx)
3. Search [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
4. Ask in [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Last Updated**: January 28, 2026
**Maintained By**: Clarity AI Team
**Status**: Complete
