# CodeBlock Shiki Fallback

## Quick Start

The CodeBlock component now gracefully handles missing `shiki` peer dependency.

### With Shiki (Full Syntax Highlighting)

```bash
npm install shiki
```

```tsx
import { CodeBlock } from '@clarity-chat/react'

;<CodeBlock language="typescript" theme="github-dark">
  {`const greeting = "Hello, World!"`}
</CodeBlock>
```

**Result:** Full VS Code-quality syntax highlighting

### Without Shiki (Fallback Mode)

```tsx
import { CodeBlock } from '@clarity-chat/react'

;<CodeBlock language="typescript">{`const greeting = "Hello, World!"`}</CodeBlock>
```

**Result:**

- Warning banner with installation instructions
- Basic `<pre><code>` formatting
- All other features work (copy, line numbers, etc.)

## Features Available in Both Modes

| Feature             | With Shiki | Without Shiki |
| ------------------- | ---------- | ------------- |
| Copy Button         | ✅         | ✅            |
| Line Numbers        | ✅         | ✅            |
| Download Button     | ✅         | ✅            |
| Keyboard Shortcuts  | ✅         | ✅            |
| Word Wrap           | ✅         | ✅            |
| Line Highlighting   | ✅         | ✅            |
| Diff Markers        | ✅         | ✅            |
| Expand/Collapse     | ✅         | ✅            |
| Syntax Highlighting | ✅ VS Code | ❌ Plain Text |
| Warning Banner      | ❌ Hidden  | ✅ Shown      |

## Warning Banner

When shiki is not installed, users see:

```
⚠ CodeBlock requires 'shiki' for syntax highlighting.
Install it with: npm install shiki
See: https://clarity-chat.dev/docs/peer-dependencies
```

## Installation

### Option 1: Install shiki (Recommended)

```bash
npm install shiki
# or
pnpm add shiki
# or
yarn add shiki
```

### Option 2: Use Fallback Mode

No installation needed. Just use CodeBlock and ignore the warning.

## Implementation Details

### Dynamic Import

```typescript
let shikiModule: {
  codeToHtml: typeof import('shiki').codeToHtml
} | null = null

try {
  shikiModule = require('shiki')
} catch (err) {
  // Shiki not available, use fallback
}
```

### Conditional Rendering

```typescript
if (!shikiModule?.codeToHtml) {
  // Fallback to basic HTML
  setHighlightedHtml(`<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`)
  return
}

// Use shiki for syntax highlighting
const html = await shikiModule.codeToHtml(code, {
  lang: language,
  theme: shikiTheme,
})
```

### Warning Banner

```tsx
{
  !shikiModule && (
    <div role="alert">
      <p>CodeBlock requires 'shiki' for syntax highlighting.</p>
      <p>
        Install it with: <code>npm install shiki</code>
      </p>
      <a href="https://clarity-chat.dev/docs/peer-dependencies">Documentation</a>
    </div>
  )
}
```

## Bundle Size Impact

| Scenario      | Bundle Size |
| ------------- | ----------- |
| Without shiki | ~200KB      |
| With shiki    | ~6.2MB      |

**Recommendation:** Only install shiki if you use CodeBlock.

## TypeScript Support

Works with or without `@types/shiki`:

```typescript
// Fallback types when shiki not installed
type BundledLanguage = string
type BundledTheme = string
```

## Accessibility

- Warning uses `role="alert"` for screen readers
- Documentation link is keyboard accessible
- All features maintain WCAG 2.1 AA compliance

## Migration from 1.x

### Before (1.x)

```bash
npm install @clarity-chat/react
# shiki bundled automatically
```

### After (2.x)

```bash
npm install @clarity-chat/react shiki
# shiki is now a peer dependency
```

## Troubleshooting

### "Cannot find module 'shiki'"

**Solution:** Install shiki as a peer dependency:

```bash
npm install shiki
```

### Build errors with shiki in Next.js

**Solution:** Check Next.js configuration for WASM support. See
[shiki documentation](https://shiki.style/) for framework-specific setup.

### Warning banner won't go away

**Solution:** Make sure shiki is installed and rebuild your app:

```bash
npm install shiki
npm run build
```

## Related Documentation

- [Peer Dependencies Guide](/packages/react/docs/peer-dependencies.md)
- [CodeBlock Component](/packages/react/src/components/code/CodeBlock.tsx)
- [Shiki Documentation](https://shiki.style/)

## Support

- GitHub Issues: https://github.com/clarity-chat/clarity-chat/issues
- Documentation: https://clarity-chat.dev/docs
- Discord: https://discord.gg/clarity-chat
