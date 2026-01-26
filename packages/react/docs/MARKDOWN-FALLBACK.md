# Markdown Rendering Fallback

## Overview

The `@clarity-chat/react` library provides graceful fallback for missing markdown dependencies. If
`react-markdown` and related packages are not installed, the library will automatically render
content as formatted plain text while maintaining accessibility and a clear user experience.

## How It Works

### 1. Automatic Detection

When a markdown-rendering component initializes, it automatically detects whether `react-markdown`
is available:

```typescript
import { useMarkdownAvailability } from '@clarity-chat/react'

function MyComponent() {
  const { isAvailable, isLoading, ReactMarkdown, remarkGfm, rehypeHighlight } =
    useMarkdownAvailability()

  if (!isAvailable) {
    // Use fallback rendering
  }
}
```

### 2. Fallback Renderer

When markdown dependencies are missing, a plain text renderer with basic formatting is used:

```typescript
import { PlainTextMarkdown } from '@clarity-chat/react'

<PlainTextMarkdown
  content={markdownContent}
  showFallbackMessage={true} // Shows informational message about missing dependency
/>
```

## Features of Fallback Renderer

### Supported Markdown Features

The fallback renderer provides basic markdown formatting:

- **Headers**: `# H1` through `###### H6` converted to semantic HTML headings
- **Bold**: `**text**` converted to `<strong>`
- **Italic**: `*text*` converted to `<em>`
- **Inline Code**: `` `code` `` with proper styling
- **Code Blocks**: ``` preserved with language class
- **Links**: `[text](url)` converted to anchor tags with security attributes
- **Lists**: Both ordered and unordered lists
- **Paragraphs**: Proper spacing and line breaks

### Accessibility (WCAG Compliance)

The fallback renderer maintains full WCAG accessibility:

- **Semantic HTML**: Uses proper heading hierarchy, lists, and paragraph elements
- **ARIA Attributes**: `role="status"` and `aria-live="polite"` on informational messages
- **Link Security**: External links include `rel="noopener noreferrer"`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper labeling and announcements

### User Notification

When fallback mode is active, users see a clear, non-intrusive message:

```
Note: Enhanced markdown rendering is unavailable. Install `react-markdown` for full markdown support.
```

This message:

- Uses ARIA live region for screen reader announcements
- Can be hidden with `showFallbackMessage={false}`
- Styled to be informative but not alarming
- Automatically hidden during streaming to avoid interruption

## Installation Instructions

To enable full markdown rendering, install the peer dependencies:

```bash
npm install react-markdown remark-gfm rehype-highlight
```

### Optional Dependencies

The following are optional and enable additional features:

- `remark-gfm`: GitHub Flavored Markdown (tables, strikethrough, task lists)
- `rehype-highlight`: Syntax highlighting for code blocks
- `mermaid`: Diagram rendering
- `katex`: Mathematical formula rendering

```bash
npm install mermaid katex
```

## Component Examples

### EnhancedMarkdownRenderer

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

;<EnhancedMarkdownRenderer
  content={markdownContent}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
    enableCopyButton: true,
  }}
/>
```

**Fallback Behavior:**

- If `react-markdown` is missing: Uses PlainTextMarkdown with informational message
- If `remark-gfm` is missing: GFM features disabled, standard markdown still works
- If `rehype-highlight` is missing: Code blocks render without syntax highlighting
- If `mermaid` is missing: Mermaid code blocks render as plain code
- If `katex` is missing: Math notation renders as plain text

### MessageOptimized

```tsx
import { MessageOptimized } from '@clarity-chat/react'

;<MessageOptimized message={message} showAvatar={true} showTimestamp={true} />
```

**Fallback Behavior:**

- Assistant messages automatically use PlainTextMarkdown when react-markdown unavailable
- No fallback message shown (cleaner UX in chat interface)
- Full formatting preserved with basic markdown features

## Performance Considerations

### Bundle Size Impact

With all dependencies:

- `react-markdown`: ~50KB
- `remark-gfm`: ~20KB
- `rehype-highlight`: ~30KB
- **Total**: ~100KB

Without dependencies:

- Fallback renderer: ~5KB
- **Savings**: ~95KB

### Loading Performance

The fallback system uses lazy loading:

1. Component mounts
2. Async check for react-markdown availability
3. If available: Load and render with react-markdown
4. If unavailable: Render with PlainTextMarkdown
5. No blocking or waiting - renders immediately with available option

### Runtime Performance

- **Fallback renderer**: Faster initial render (no AST parsing)
- **Full markdown**: More features but slightly slower parsing
- Both options memoized for optimal re-render performance

## Migration Guide

### From Required to Optional

If upgrading from a version where react-markdown was required:

1. **No code changes needed** - components automatically adapt
2. **Optional removal**: Can remove react-markdown if basic formatting is sufficient
3. **Recommended**: Keep react-markdown installed for full feature set

### Adding Full Markdown Support

If currently using fallback and want full features:

```bash
npm install react-markdown remark-gfm rehype-highlight
```

**No code changes needed** - components automatically detect and use full renderer.

## Troubleshooting

### Issue: Fallback message showing unexpectedly

**Cause**: react-markdown not properly installed or import failing

**Solution**:

```bash
npm install react-markdown
# Verify installation
npm list react-markdown
```

### Issue: GitHub Flavored Markdown not working

**Cause**: remark-gfm not installed

**Solution**:

```bash
npm install remark-gfm
```

### Issue: Code blocks not highlighted

**Cause**: rehype-highlight not installed

**Solution**:

```bash
npm install rehype-highlight
```

### Issue: Fallback shows wrong content

**Cause**: HTML escaping issue or complex markdown

**Solution**:

- Install full markdown dependencies for complex content
- Report issue with example content for fallback improvement

## API Reference

### `useMarkdownAvailability()`

Hook to detect markdown dependency availability.

**Returns:**

```typescript
{
  isAvailable: boolean | null,  // null while loading
  isLoading: boolean,            // true during initial check
  ReactMarkdown: Component | null,
  remarkGfm: Plugin | null,
  rehypeHighlight: Plugin | null,
}
```

### `PlainTextMarkdown`

Component for plain text markdown rendering.

**Props:**

```typescript
interface PlainTextMarkdownProps {
  content: string // Markdown content to render
  className?: string // Additional CSS classes
  showFallbackMessage?: boolean // Show info message (default: true)
}
```

### `loadMarkdownDependencies()`

Utility function to preload markdown dependencies.

**Returns:** `Promise<boolean>` - true if successful, false if unavailable

**Usage:**

```typescript
import { loadMarkdownDependencies } from '@clarity-chat/react'

// Preload during app initialization
loadMarkdownDependencies().then((available) => {
  console.log('Markdown available:', available)
})
```

## Best Practices

### 1. Preload Dependencies

For better UX, preload markdown dependencies during app initialization:

```typescript
// In your app entry point
import { loadMarkdownDependencies } from '@clarity-chat/react'

loadMarkdownDependencies()
```

### 2. Conditional Feature Flags

Adjust UI based on availability:

```typescript
const { isAvailable } = useMarkdownAvailability()

<div>
  {isAvailable ? (
    <button>Insert Table</button> // GFM feature
  ) : (
    <button disabled title="Install react-markdown for tables">
      Insert Table
    </button>
  )}
</div>
```

### 3. User Communication

If your app heavily relies on markdown, inform users:

```typescript
const { isAvailable } = useMarkdownAvailability()

{!isAvailable && (
  <Alert variant="info">
    For the best experience, install react-markdown package
  </Alert>
)}
```

### 4. Testing

Test both modes in your application:

```typescript
// Mock markdown unavailability
jest.mock('react-markdown', () => {
  throw new Error('Not installed')
})

// Test fallback behavior
test('renders with fallback', () => {
  render(<EnhancedMarkdownRenderer content="# Hello" />)
  expect(screen.getByText(/Enhanced markdown rendering is unavailable/)).toBeInTheDocument()
})
```

## Security

### XSS Prevention

Both full and fallback renderers include XSS protection:

- **Full renderer**: Uses react-markdown's built-in sanitization
- **Fallback renderer**: HTML escaping for all user content
- **Links**: External links include security attributes
- **Code blocks**: Content escaped to prevent script injection

### Content Security Policy

The fallback renderer is CSP-friendly:

- No inline scripts
- No eval or dynamic code execution
- All content statically rendered
- External resources only for optional features (KaTeX CDN)

## Contributing

Found an edge case in the fallback renderer? Please contribute!

1. Add test case demonstrating the issue
2. Implement fix in `markdown-fallback.tsx`
3. Verify accessibility compliance
4. Submit pull request with documentation

Example markdown patterns to test:

- Nested lists
- Mixed formatting
- Edge cases in link parsing
- Code block language detection
- Table formatting
