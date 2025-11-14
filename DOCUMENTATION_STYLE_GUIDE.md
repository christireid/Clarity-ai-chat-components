# Clarity Chat Documentation Style Guide

**Version:** 1.0  
**Last Updated:** 2024  
**Purpose:** Unified style guide for all Clarity Chat documentation

---

## Table of Contents

1. [Voice & Tone](#voice--tone)
2. [Structure Standards](#structure-standards)
3. [Writing Guidelines](#writing-guidelines)
4. [Code Examples](#code-examples)
5. [Visual Design](#visual-design)
6. [Terminology](#terminology)
7. [Templates](#templates)
8. [Quality Checklist](#quality-checklist)

---

## Voice & Tone

### Core Principles

**Clear, Direct, Friendly**
- Write like you're explaining to a colleague
- Be concise but warm
- Avoid jargon unless necessary (then explain it)
- Use active voice

**Minimal Fluff, Maximum Signal**
- Get to the point quickly
- Remove unnecessary words
- Focus on actionable information
- Skip marketing speak

**Tailored for Busy Engineers**
- Respect their time
- Put important info first
- Use scannable formats (lists, tables, code blocks)
- Provide quick wins

**Consistent Across All Docs**
- Same terminology everywhere
- Same structure patterns
- Same code style
- Same tone

### Voice Examples

**❌ Bad:**
> "Clarity Chat is an amazing, revolutionary library that will transform your development experience and make building AI chat interfaces incredibly easy and delightful!"

**✅ Good:**
> "Clarity Chat provides production-ready components and hooks for building AI chat interfaces. Get started in 60 seconds."

**❌ Bad:**
> "A component can be created by utilizing the ChatWindow component, which enables developers to implement chat functionality."

**✅ Good:**
> "Create a chat interface using the `ChatWindow` component:"

---

## Structure Standards

### README Structure

Every package README should follow this structure:

```markdown
# Package Name

Brief one-line description (max 160 characters)

## Installation

```bash
npm install @clarity-chat/package-name
```

## Quick Start

Minimal example (3-5 lines of code)

```tsx
// Example here
```

## Features

- Feature 1
- Feature 2
- Feature 3

## API Reference

Link to full API docs or key APIs here

## Examples

Link to examples or show 1-2 examples

## Learn More

- [Full Documentation](./docs/package-name.md)
- [API Reference](./docs/api/package-name.md)
- [Examples](./examples/package-name)
```

### Guide Structure

Every guide should follow this structure:

```markdown
# Guide Title

Brief description (2-3 sentences)

## Overview

What this guide covers and who it's for

## Prerequisites

What readers need to know before starting

## [Main Content Sections]

Use clear, descriptive headings

## Examples

Working, copy-pasteable examples

## Next Steps

What to read next or related guides

## See Also

Links to related content
```

### API Reference Structure

Every API reference should follow this structure:

```markdown
# Component/Hook/Utility Name

Brief description

## Import

```tsx
import { ComponentName } from '@clarity-chat/react'
```

## Props/Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | `string` | - | Description |

## Examples

### Basic Usage

```tsx
// Example
```

### Advanced Usage

```tsx
// Example
```

## Related

- [Related Component](./related-component.md)
- [Guide](./guides/guide.md)
```

---

## Writing Guidelines

### Headings

- **Use descriptive headings** - "Creating a Chat Interface" not "Usage"
- **Use sentence case** - Capitalize first word only
- **Be specific** - "Handling Streaming Responses" not "Streaming"
- **Limit depth** - Max 4 levels (H1 → H4)

### Paragraphs

- **Keep short** - 2-4 sentences max
- **One idea per paragraph**
- **Use lists** - Break up long paragraphs
- **Lead with the point** - Most important info first

### Lists

- **Use bullet points** for unordered lists
- **Use numbered lists** for steps/sequences
- **Keep items parallel** - Same grammatical structure
- **Limit length** - Max 7-9 items per list

### Code Blocks

- **Always specify language** - `tsx`, `bash`, `json`, etc.
- **Include context** - Show imports, setup if needed
- **Make copy-pasteable** - Should work as-is
- **Add comments** - Explain "why" not just "what"

### Links

- **Use descriptive text** - "Read the API reference" not "click here"
- **Link to specific sections** - Use anchors when possible
- **Check links** - Ensure they work and are current
- **External links** - Mark with `[text](url) [external]` or open in new tab

---

## Code Examples

### Code Example Standards

1. **Always TypeScript** - Use `.tsx` for React examples
2. **Include Imports** - Show where things come from
3. **Complete Examples** - Should run without modification
4. **Add Comments** - Explain key decisions
5. **Progressive Complexity** - Simple → Intermediate → Advanced

### Example Format

```tsx
// ✅ Good Example
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

/**
 * Basic chat interface example
 * 
 * This example shows the minimal setup required to create
 * a working chat interface with Clarity Chat.
 */
function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

```tsx
// ❌ Bad Example (missing imports, no comments, incomplete)
function App() {
  return <ChatWindow />
}
```

### Code Block Labels

Use descriptive labels for code blocks:

```tsx
// Basic usage
```

```tsx
// With memory enabled
```

```tsx
// Custom theme configuration
```

### Inline Code

- Use backticks for: component names, prop names, function names, file paths
- Use code blocks for: multi-line examples, full components

---

## Visual Design

### Typography

- **Headings:** Use semantic heading levels (H1 → H6)
- **Body:** 16px base font size, 1.6 line height
- **Code:** Monospace font, 14px
- **Links:** Underlined, colored, hover states

### Spacing

- **Use 8px grid** - All spacing multiples of 8px
- **Consistent margins** - 16px, 24px, 32px, 48px
- **Code block padding** - 16px
- **Section spacing** - 32px between major sections

### Code Blocks

- **Syntax highlighting** - Always enabled
- **Copy button** - Include copy-to-clipboard
- **Line numbers** - For long examples (>20 lines)
- **Filename** - Show filename when relevant

### Callouts

Use callouts for important information:

```markdown
> **Note:** This is a note callout

> **Tip:** This is a tip callout

> **Warning:** This is a warning callout

> **Error:** This is an error callout
```

### Diagrams

- **Use Mermaid** - For flowcharts, sequence diagrams
- **Use SVG** - For architecture diagrams
- **Add alt text** - For accessibility
- **Keep simple** - Don't overcomplicate

---

## Terminology

### Consistent Terms

Use these terms consistently throughout:

| Term | Usage | Don't Use |
|------|-------|-----------|
| Component | React component | Widget, Element |
| Hook | React hook | Function, Utility |
| Message | Chat message | Chat bubble, Text |
| Conversation | Chat conversation | Thread, Chat |
| API | API endpoint | Endpoint, Route |
| Streaming | Real-time streaming | Live updates, SSE |
| Memory | Conversation memory | Context, History |

### Capitalization

- **Components:** PascalCase - `ChatWindow`, `MessageList`
- **Hooks:** camelCase with "use" prefix - `useClarityChat`, `useStreamingSSE`
- **Props:** camelCase - `isLoading`, `onSendMessage`
- **Files:** kebab-case - `chat-window.tsx`, `use-clarity-chat.ts`
- **Packages:** kebab-case - `@clarity-chat/react`

### Abbreviations

- **Spell out first time** - "Server-Sent Events (SSE)"
- **Use consistently** - Once defined, use abbreviation
- **Common abbreviations** - API, UI, UX, a11y, SSR, CSR

---

## Templates

### README Template

```markdown
# Package Name

Brief description (one sentence)

[Badges: npm version, license, etc.]

## Installation

\`\`\`bash
npm install @clarity-chat/package-name
\`\`\`

## Quick Start

\`\`\`tsx
import { ComponentName } from '@clarity-chat/package-name'

function App() {
  return <ComponentName />
}
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Documentation

- [Full Guide](./docs/guide.md)
- [API Reference](./docs/api.md)
- [Examples](./examples)

## License

MIT
```

### Guide Template

```markdown
# Guide Title

Brief description (2-3 sentences)

## Overview

What this guide covers and who it's for.

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## [Main Section 1]

Content here

## [Main Section 2]

Content here

## Examples

\`\`\`tsx
// Example code
\`\`\`

## Next Steps

- [Related Guide](./related-guide.md)
- [API Reference](./api-reference.md)

## See Also

- [Related Content](./related.md)
```

### API Reference Template

```markdown
# ComponentName

Brief description

## Import

\`\`\`tsx
import { ComponentName } from '@clarity-chat/react'
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | `string` | - | Description |

## Examples

### Basic Usage

\`\`\`tsx
// Example
\`\`\`

### Advanced Usage

\`\`\`tsx
// Example
\`\`\`

## Related

- [Related Component](./related.md)
- [Guide](./guides/guide.md)
```

---

## Quality Checklist

Before publishing any documentation, ensure:

### Content

- [ ] Clear, concise writing
- [ ] No typos or grammatical errors
- [ ] Consistent terminology
- [ ] Accurate information (matches code)
- [ ] Up-to-date (uses latest APIs)

### Structure

- [ ] Follows template structure
- [ ] Clear headings hierarchy
- [ ] Logical flow
- [ ] Good use of lists/tables
- [ ] Proper linking

### Code Examples

- [ ] All examples work (tested)
- [ ] Copy-pasteable
- [ ] Include imports
- [ ] Add comments
- [ ] Progressive complexity

### Visual

- [ ] Consistent spacing
- [ ] Code blocks formatted
- [ ] Diagrams clear
- [ ] Callouts used appropriately
- [ ] Dark mode works

### Accessibility

- [ ] Alt text for images
- [ ] Descriptive link text
- [ ] Proper heading hierarchy
- [ ] Code blocks accessible
- [ ] Color contrast sufficient

### Links

- [ ] All links work
- [ ] Links are descriptive
- [ ] Internal links use relative paths
- [ ] External links marked
- [ ] Deep links work

---

## Examples

### Good Documentation Example

```markdown
# useClarityChat Hook

The flagship hook for building AI chat interfaces with memory integration.

## Import

\`\`\`tsx
import { useClarityChat } from '@clarity-chat/react'
\`\`\`

## Basic Usage

Create a chat interface with minimal configuration:

\`\`\`tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
\`\`\`

## With Memory

Enable conversation memory for context-aware responses:

\`\`\`tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  },
})
\`\`\`

## API Reference

See [full API reference](./api/use-clarity-chat.md) for all options.
```

### Bad Documentation Example

```markdown
# useClarityChat

This hook is really great and you should use it. It does lots of things.

\`\`\`tsx
// Example
const chat = useClarityChat()
\`\`\`

It's awesome!
```

---

## Style Guide Updates

This style guide is a living document. Update it when:
- New patterns emerge
- Community feedback suggests changes
- Best practices evolve

**Last Updated:** [Date]  
**Version:** 1.0
