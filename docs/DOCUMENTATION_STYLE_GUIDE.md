# 📝 Clarity Chat Documentation Style Guide

**Version**: 1.0  
**Last Updated**: 2024  
**Purpose**: Ensure consistent, high-quality documentation across all Clarity Chat assets

---

## 🎯 Voice & Tone

### Core Principles

**Clear, Direct, Friendly**
- Write like you're helping a colleague
- Be concise but warm
- Avoid jargon unless necessary
- Explain acronyms on first use

**Minimal Fluff, Maximum Signal**
- Every sentence should add value
- Cut unnecessary words
- Get to the point quickly
- Use examples over explanations

**Tailored for Busy Engineers**
- Respect their time
- Make it scannable
- Put important info first
- Provide quick wins

**Consistent Across All Docs**
- Same terminology everywhere
- Same structure patterns
- Same code style
- Same tone

### Writing Style

**Active Voice**
- ✅ "The hook manages state automatically"
- ❌ "State is managed automatically by the hook"

**Short Sentences**
- ✅ "The component renders messages. It handles streaming automatically."
- ❌ "The component renders messages and handles streaming automatically, which makes it easy to use."

**Scannable Structure**
- Use headings liberally
- Use bullet points for lists
- Use code blocks for examples
- Use callouts for important info

**Helpful, Not Condescending**
- ✅ "You can customize the theme by passing a theme object."
- ❌ "Obviously, you'll want to customize the theme..."

---

## 📐 Documentation Structure

### README Structure

```markdown
# Package Name

One-sentence description of what this package does and why it matters.

[Badges: npm version, license, etc.]

## Quick Start

Installation command and minimal example (copy-paste ready).

## Features

Scannable bullet list of key features.

## Installation

```bash
npm install @clarity-chat/package-name
```

## Basic Usage

Complete, working example with imports and context.

## Advanced Usage

More complex examples showing power features.

## API Reference

Link to detailed API docs or brief overview.

## Examples

Links to example apps or Storybook.

## Documentation

Links to guides, cookbooks, etc.

## Contributing

Link to contributing guide.

## License

MIT
```

### Guide Structure

```markdown
# Guide Title

Brief overview of what you'll learn and why it matters.

## Prerequisites

What you need to know or have installed.

## Overview

Conceptual explanation (what and why).

## Step-by-Step Tutorial

1. First step with code example
2. Second step with code example
3. etc.

## Common Pitfalls

Things to watch out for.

## Next Steps

What to learn next.

## Related Resources

Links to related docs, examples, etc.
```

### API Reference Structure

```markdown
# Component/Hook Name

One-sentence description.

## Import

```tsx
import { ComponentName } from '@clarity-chat/react'
```

## Props/Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop | `Type` | `default` | Description |

## Basic Example

Complete, working example.

## Advanced Examples

More complex use cases.

## Related

Links to related components/hooks.
```

---

## 💻 Code Example Standards

### Formatting

**Always Include:**
- Language tag (```tsx, ```bash, etc.)
- Complete imports
- Context (not just snippets)
- Realistic data
- TypeScript types

**Example:**

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function MyChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### Content Standards

**✅ DO:**
- Use React 19 patterns (function components, hooks)
- Use latest Clarity APIs
- Show complete examples
- Use realistic data
- Include error handling
- Add helpful comments
- Show multiple patterns

**❌ DON'T:**
- Use class components
- Use deprecated APIs
- Show incomplete snippets
- Use `foo`/`bar` placeholders
- Skip error handling
- Use contrived examples
- Show only one pattern

### Import Paths

**Standard Format:**
```tsx
// Main exports
import { Component, Hook } from '@clarity-chat/react'

// Sub-exports (if needed)
import { ThemeProvider } from '@clarity-chat/react/theme'

// Primitives
import { Button, Card } from '@clarity-chat/primitives'
```

---

## 🎨 Visual Elements

### Headings

**Hierarchy:**
- `#` - Page title
- `##` - Major sections
- `###` - Subsections
- `####` - Minor subsections (use sparingly)

**Naming:**
- Use descriptive, scannable headings
- Use sentence case
- Be specific, not generic

### Callouts

**Info:**
```markdown
> **Note**: This is an informational note.
```

**Warning:**
```markdown
> **Warning**: This is a warning about potential issues.
```

**Tip:**
```markdown
> **Tip**: This is a helpful tip.
```

**Error:**
```markdown
> **Error**: This shows an error case.
```

### Code Blocks

**Inline Code:**
- Use backticks for: function names, prop names, file names, commands
- Example: Use the `useClarityChat` hook

**Code Blocks:**
- Always include language tag
- Show complete examples
- Include context
- Add comments for clarity

### Lists

**Bullet Points:**
- Use for unordered lists
- Keep items parallel
- Use consistent punctuation

**Numbered Lists:**
- Use for step-by-step instructions
- Keep steps sequential
- One action per step

### Tables

**Format:**
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
```

**Use For:**
- Prop tables
- Comparison tables
- Feature matrices

---

## 📚 Terminology

### Consistent Terms

**Components:**
- "Component" not "widget" or "element"
- Use exact component names: `ChatWindow`, `MessageList`

**Hooks:**
- "Hook" not "function" or "utility"
- Use exact hook names: `useClarityChat`, `useStreaming`

**Concepts:**
- "Message" not "chat message" or "conversation message"
- "Memory" not "context" or "history"
- "Streaming" not "real-time updates"

### Naming Conventions

**Files:**
- `kebab-case.md` for markdown files
- `PascalCase.tsx` for React components
- `camelCase.ts` for utilities

**Headings:**
- Sentence case: "Getting Started with Clarity Chat"
- Not title case: "Getting Started With Clarity Chat"

---

## 🔗 Linking Standards

### Internal Links

**To Documentation:**
```markdown
[Getting Started Guide](./getting-started.md)
```

**To Examples:**
```markdown
[Basic Chat Example](../../examples/basic-chat)
```

**To Storybook:**
```markdown
[ChatWindow Story](http://localhost:6006/?path=/story/components-chatwindow--default)
```

**To API Reference:**
```markdown
[useClarityChat API](./api/use-clarity-chat.md)
```

### External Links

**Always Include:**
- Descriptive link text
- `target="_blank"` for external links (if applicable)
- Clear indication it's external

---

## ✅ Quality Checklist

### Before Publishing

**Content:**
- [ ] All examples compile and work
- [ ] All examples use latest APIs
- [ ] Terminology is consistent
- [ ] Structure follows style guide
- [ ] Code examples are copy-paste ready

**Technical:**
- [ ] All links work
- [ ] All code blocks have language tags
- [ ] All imports are correct
- [ ] All TypeScript types are accurate
- [ ] No deprecated APIs used

**Style:**
- [ ] Voice and tone are consistent
- [ ] Headings follow hierarchy
- [ ] Lists are properly formatted
- [ ] Tables are properly formatted
- [ ] Callouts are used appropriately

**Accessibility:**
- [ ] Images have alt text
- [ ] Code blocks are accessible
- [ ] Links are descriptive
- [ ] Headings are logical
- [ ] Content is keyboard navigable

---

## 📖 Examples

### Good README Example

```markdown
# @clarity-chat/react

> Enterprise-grade React components and hooks for building AI chat applications.

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)

## Quick Start

```bash
npm install @clarity-chat/react
```

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function MyChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

## Features

- 🚀 **Flagship Chat Hook** - `useClarityChat` with full Vercel AI SDK compatibility
- 💾 **Memory Management** - Three strategies: sliding-window, semantic-chunks, vector-store
- 🎯 **Structured Output** - Type-safe object generation with `useClarityObject<T>`
- 🛠️ **Tool UI Registry** - Automatic rendering of tool results
- 📡 **Dual Transport** - SSE and WebSocket streaming support

## Documentation

- [Getting Started Guide](../../docs/getting-started-clarity-chat.md)
- [API Reference](./docs/api.md)
- [Examples](../../apps/examples/README.md)
- [Storybook](http://localhost:6006)

## License

MIT
```

### Good Guide Example

```markdown
# Getting Started with Memory

Learn how to enable context-aware conversations with Clarity's built-in memory system.

## Prerequisites

- Basic knowledge of React hooks
- Clarity Chat installed (`npm install @clarity-chat/react`)

## Overview

Clarity's memory system allows your chat application to remember previous conversations and maintain context across sessions. It supports three strategies:

- **sliding-window**: Fast, recent context only
- **semantic-chunks**: Context-aware retrieval
- **vector-store**: Long-term memory

## Step 1: Wrap Your App

```tsx
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MyChat />
    </MemoryProvider>
  )
}
```

## Step 2: Enable Memory in Your Hook

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, memoryEnabled } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  // ... rest of component
}
```

## Common Pitfalls

> **Warning**: Memory requires additional setup for vector-store strategy. See [Vector Store Setup](./vector-store-setup.md) for details.

## Next Steps

- Learn about [Memory Strategies](./memory-strategies.md)
- Explore [Advanced Memory Patterns](./advanced-memory.md)
- Check out [Memory Examples](../../examples/memory-examples)

## Related Resources

- [Memory API Reference](./api/memory.md)
- [Memory Storybook Stories](http://localhost:6006/?path=/story/hooks-useclaritychat--with-memory)
```

---

## 🚀 Applying This Guide

### For New Documentation

1. Review this style guide
2. Follow the structure templates
3. Use the code example standards
4. Check against the quality checklist
5. Get review from team

### For Existing Documentation

1. Audit against this guide
2. Update to match standards
3. Fix terminology inconsistencies
4. Improve code examples
5. Update structure where needed

---

**Questions?** Open an issue or reach out to the documentation team.
