# Peer Dependencies

Clarity Chat uses peer dependencies to keep the bundle size small and give you control over which
features you need. This guide explains which peer dependencies are required for different features.

## Overview

Peer dependencies are packages that Clarity Chat expects you to install in your project. This
approach:

- Reduces bundle size by avoiding duplicate dependencies
- Gives you control over versions
- Allows you to opt into only the features you need

## Required Peer Dependencies

### React

```bash
npm install react react-dom
```

Required for all components. Clarity Chat supports React 18+.

## Optional Peer Dependencies

### Syntax Highlighting (shiki)

**Required for:** `CodeBlock` component with syntax highlighting

```bash
npm install shiki
```

**What it does:** Provides VS Code-quality syntax highlighting for code blocks.

**If not installed:** CodeBlock will display a warning banner and fall back to basic `<pre><code>`
formatting without syntax highlighting. All other features (copy button, line numbers, etc.) will
continue to work.

**Example:**

```tsx
import { CodeBlock } from '@clarity-chat/react'

// With shiki installed:
<CodeBlock language="typescript" theme="github-dark">
  {`const greeting = "Hello, World!"`}
</CodeBlock>

// Without shiki: Shows warning + basic formatting
<CodeBlock language="typescript">
  {`const greeting = "Hello, World!"`}
</CodeBlock>
```

### Markdown Rendering (react-markdown)

**Required for:** `EnhancedMarkdownRenderer` component

```bash
npm install react-markdown remark-gfm remark-math rehype-katex
```

**What it does:** Renders markdown content with GitHub Flavored Markdown support and math equations.

**If not installed:** Components using markdown rendering will display an error message with
installation instructions.

### Validation (zod)

**Required for:** Type-safe validation in forms and schemas

```bash
npm install zod
```

**What it does:** Provides runtime validation for user inputs and API responses.

**If not installed:** Validation features will be disabled and show warnings in development mode.

## Installation Strategies

### Minimal Install (Chat Only)

```bash
npm install react react-dom @clarity-chat/react
```

This gives you basic chat functionality without code highlighting or advanced features.

### Full-Featured Install

```bash
npm install react react-dom @clarity-chat/react shiki react-markdown remark-gfm remark-math rehype-katex zod
```

This enables all features including code highlighting, markdown rendering, and validation.

### Selective Install

Install only what you need:

```bash
# If you only need CodeBlock:
npm install react react-dom @clarity-chat/react shiki

# If you only need markdown:
npm install react react-dom @clarity-chat/react react-markdown remark-gfm

# If you need both:
npm install react react-dom @clarity-chat/react shiki react-markdown remark-gfm
```

## Troubleshooting

### "CodeBlock requires 'shiki' for syntax highlighting"

This warning appears when you use `<CodeBlock>` without installing shiki. To fix:

```bash
npm install shiki
```

Or use the basic fallback mode by ignoring the warning (code will still display, just without syntax
highlighting).

### Build Errors with shiki

If you encounter build errors with shiki in Next.js or other frameworks:

1. Make sure you're using the latest version of shiki
2. Check your bundler configuration for WASM support
3. See shiki's documentation for framework-specific setup

### Version Compatibility

| Peer Dependency | Minimum Version | Recommended Version |
| --------------- | --------------- | ------------------- |
| react           | 18.0.0          | 18.3.0+             |
| react-dom       | 18.0.0          | 18.3.0+             |
| shiki           | 1.0.0           | 1.22.0+             |
| react-markdown  | 9.0.0           | 9.0.0+              |
| zod             | 3.22.0          | 3.23.0+             |

## Migration Guide

### From 1.x to 2.x

In version 2.x, we externalized several dependencies as peer dependencies:

**Before (1.x):**

```bash
npm install @clarity-chat/react
# All dependencies bundled
```

**After (2.x):**

```bash
npm install @clarity-chat/react shiki
# Explicitly install peer dependencies
```

**Benefits:**

- 60% smaller bundle size
- Better tree-shaking
- More control over versions
- Faster installs when dependencies are shared

## FAQ

### Why peer dependencies?

Peer dependencies reduce bundle size and prevent version conflicts. Instead of bundling shiki (6MB+)
into every install, you only install it if you need code highlighting.

### What happens if I don't install a peer dependency?

Components that require the missing dependency will show a helpful error message with installation
instructions. Other components will continue to work normally.

### Can I use a different syntax highlighter?

Yes! The `CodeBlock` component is designed to be extensible. You can create your own highlighter by
implementing the same interface.

### Do peer dependencies affect tree-shaking?

Yes, positively! Peer dependencies improve tree-shaking because your bundler can better analyze and
remove unused code.

## Support

For more help:

- [Documentation](https://clarity-chat.dev/docs)
- [GitHub Issues](https://github.com/clarity-chat/clarity-chat/issues)
- [Discord Community](https://discord.gg/clarity-chat)
