# Feature Flags for Optional Peer Dependencies

Clarity Chat Components provides feature flags that allow you to **explicitly opt-out** of optional
features to reduce bundle size, even when peer dependencies are installed.

## Overview

By default, Clarity Chat will use all available peer dependencies if they are installed. However,
you may want to disable certain features to:

- **Reduce bundle size** - Some dependencies like `shiki` (~200KB) or `mermaid` (~300KB) can be
  large
- **Improve load times** - Fewer dependencies mean faster initial page loads
- **Simplify deployment** - Skip features you don't need
- **Control costs** - Smaller bundles mean less bandwidth usage

## Available Feature Flags

### 1. `CLARITY_DISABLE_SYNTAX_HIGHLIGHTING`

Disables Shiki syntax highlighting in code blocks.

**Peer Dependencies**: `shiki` **Bundle Impact**: ~200KB when enabled **Fallback**: Basic
`<pre><code>` rendering without syntax highlighting

```bash
# .env or .env.local
CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
```

**What changes:**

- `CodeBlock` component will render plain code without syntax highlighting
- No Shiki imports or bundles
- Still preserves all other CodeBlock features (copy button, line numbers, etc.)

**Example:**

```tsx
// With syntax highlighting (default)
<CodeBlock language="typescript">
  const greeting = "Hello, World!"
</CodeBlock>
// → Renders with VS Code-quality highlighting

// With CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
<CodeBlock language="typescript">
  const greeting = "Hello, World!"
</CodeBlock>
// → Renders as plain monospace text
```

---

### 2. `CLARITY_DISABLE_MARKDOWN`

Disables react-markdown rendering for rich markdown content.

**Peer Dependencies**: `react-markdown`, `remark-gfm`, `rehype-highlight` **Bundle Impact**: ~95KB
(react-markdown: 50KB, remark-gfm: 15KB, rehype-highlight: 30KB) **Fallback**: Plain text formatting
with basic structure preservation

```bash
# .env or .env.local
CLARITY_DISABLE_MARKDOWN=true
```

**What changes:**

- `EnhancedMarkdownRenderer` will use plain text fallback
- No react-markdown, remark-gfm, or rehype-highlight imports
- Basic formatting preserved (headers, lists, code blocks, links)
- No advanced features (tables, task lists, footnotes)

**Example:**

```tsx
// With markdown rendering (default)
<EnhancedMarkdownRenderer
  content="# Hello\n\nThis is **bold** and *italic*"
/>
// → Full markdown rendering with all GFM features

// With CLARITY_DISABLE_MARKDOWN=true
<EnhancedMarkdownRenderer
  content="# Hello\n\nThis is **bold** and *italic*"
/>
// → Basic text formatting, semantic HTML structure
```

---

### 3. `CLARITY_DISABLE_EXPORTS`

Disables JSZip-powered batch conversation exports.

**Peer Dependencies**: `jszip` **Bundle Impact**: ~110KB **Fallback**: Single conversation exports
still work (JSON, Markdown, HTML, Text)

```bash
# .env or .env.local
CLARITY_DISABLE_EXPORTS=true
```

**What changes:**

- `exportMultipleConversations()` will throw an error
- No JSZip imports or bundles
- Single conversation exports via `exportConversation()` still work normally

**Example:**

```tsx
// With batch exports (default)
await exportMultipleConversations(conversations, {
  format: 'json',
})
// → Creates a ZIP file with all conversations

// With CLARITY_DISABLE_EXPORTS=true
await exportMultipleConversations(conversations, {
  format: 'json',
})
// → Throws error explaining feature is disabled

// Single exports still work
await exportConversation(messages, { format: 'json' })
// → Works normally
```

---

## How to Use Feature Flags

### Environment Variables (Recommended)

Set environment variables in your `.env` or `.env.local` file:

```bash
# Disable syntax highlighting
CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true

# Disable markdown rendering
CLARITY_DISABLE_MARKDOWN=true

# Disable batch exports
CLARITY_DISABLE_EXPORTS=true
```

**Next.js**: Use `NEXT_PUBLIC_` prefix for client-side access:

```bash
NEXT_PUBLIC_CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
```

**Vite**: Environment variables are automatically exposed with `VITE_` prefix:

```bash
VITE_CLARITY_DISABLE_MARKDOWN=true
```

### Programmatic Configuration (Advanced)

You can also set feature flags at runtime:

```typescript
import { setFeatureFlags } from '@clarity-chat/react/config'

// Disable features programmatically
setFeatureFlags({
  disableSyntaxHighlighting: true,
  disableMarkdown: false,
  disableBatchExports: true,
})
```

**Note**: Runtime configuration takes precedence over environment variables.

---

## Checking Feature Availability

### Check if a Feature is Enabled

```typescript
import { isFeatureEnabled } from '@clarity-chat/react/config'

if (isFeatureEnabled('syntax-highlighting')) {
  console.log('Syntax highlighting is enabled')
} else {
  console.log('Syntax highlighting is disabled')
}
```

### Check if a Feature is Available (Enabled + Dependencies Installed)

```typescript
import { isFeatureAvailable } from '@clarity-chat/react/config'

if (isFeatureAvailable('markdown')) {
  // Feature is enabled AND react-markdown is installed
  console.log('Markdown rendering available')
} else {
  // Either disabled OR dependencies missing
  console.log('Markdown rendering unavailable')
}
```

### Get Feature Status

```typescript
import { getFeatureFlagSummary } from '@clarity-chat/react/config'

const summary = getFeatureFlagSummary()

console.log(summary['syntax-highlighting'])
// {
//   enabled: true,
//   available: true,
//   disabled: false,
//   missingDependencies: [],
//   status: 'Feature available'
// }
```

### Log All Feature Flags (Debugging)

```typescript
import { logFeatureFlagStatus } from '@clarity-chat/react/config'

// Log all features
logFeatureFlagStatus()

// Log only unavailable features
logFeatureFlagStatus(true)
```

---

## Bundle Size Impact

Here's the potential bundle size savings when disabling features:

| Feature Flag                          | Peer Dependencies                                  | Size Saved | Notes                               |
| ------------------------------------- | -------------------------------------------------- | ---------- | ----------------------------------- |
| `CLARITY_DISABLE_SYNTAX_HIGHLIGHTING` | `shiki`                                            | ~200KB     | VS Code-quality syntax highlighting |
| `CLARITY_DISABLE_MARKDOWN`            | `react-markdown`, `remark-gfm`, `rehype-highlight` | ~95KB      | GitHub Flavored Markdown            |
| `CLARITY_DISABLE_EXPORTS`             | `jszip`                                            | ~110KB     | ZIP archive creation                |
| **Total**                             |                                                    | **~405KB** | Maximum potential savings           |

**Note**: These are approximate sizes after gzip compression. Actual savings depend on:

- Your bundler configuration (webpack, Vite, etc.)
- Tree-shaking effectiveness
- Other dependencies using the same packages

---

## Best Practices

### 1. Start with Everything Enabled

Don't disable features preemptively. Start with all features enabled and only disable them if:

- Bundle size is a concern
- You're sure you don't need the feature
- You've measured the impact

### 2. Use Environment-Specific Configuration

Enable all features in development, disable heavy ones in production:

```bash
# .env.development (all features enabled)
CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=false
CLARITY_DISABLE_MARKDOWN=false
CLARITY_DISABLE_EXPORTS=false

# .env.production (optimize for size)
CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
CLARITY_DISABLE_MARKDOWN=false
CLARITY_DISABLE_EXPORTS=true
```

### 3. Document Your Choices

If you disable features, document why in your project README:

```markdown
## Clarity Chat Configuration

We've disabled the following features to optimize bundle size:

- Syntax highlighting (200KB saved) - We don't display code in our chat
- Batch exports (110KB saved) - Users only export individual conversations
```

### 4. Test Fallback Behavior

Always test your application with features disabled to ensure fallbacks work correctly:

```typescript
// Test with features disabled
process.env.CLARITY_DISABLE_MARKDOWN = 'true'

// Verify fallback renders correctly
render(<EnhancedMarkdownRenderer content="# Test" />)
expect(screen.getByText(/markdown rendering is unavailable/i)).toBeInTheDocument()
```

---

## Migration Guide

### Coming from Pre-2.0 Versions

In Clarity Chat 2.0+, peer dependencies are **optional** by default. You need to:

1. **Install only what you need:**

   ```bash
   # Full feature set
   npm install shiki react-markdown remark-gfm rehype-highlight jszip

   # Minimal setup (no optional features)
   npm install
   ```

2. **Explicitly disable features** (even if dependencies are installed):
   ```bash
   # .env
   CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
   ```

### For Enterprise/Large Apps

If you're building a large application, consider:

1. **Lazy load heavy features:**

   ```typescript
   const CodeBlock = React.lazy(() => import('@clarity-chat/react/code-block'))
   ```

2. **Use feature flags per environment:**
   - Development: All features enabled (better DX)
   - Staging: Mirror production settings
   - Production: Optimize for size

3. **Monitor bundle size:**
   ```bash
   npx vite-bundle-visualizer
   # or
   npx webpack-bundle-analyzer
   ```

---

## Troubleshooting

### Feature Flag Not Working

**Problem**: Set `CLARITY_DISABLE_MARKDOWN=true` but markdown still renders.

**Solutions**:

1. Restart your dev server (environment variables are loaded at startup)
2. Check if using Next.js - add `NEXT_PUBLIC_` prefix
3. Check if using Vite - add `VITE_` prefix
4. Clear feature flag cache programmatically:
   ```typescript
   import { clearFeatureFlagCache } from '@clarity-chat/react/config'
   clearFeatureFlagCache()
   ```

### Feature Disabled But Bundle Still Large

**Problem**: Disabled feature but bundle size didn't decrease.

**Solutions**:

1. Ensure the peer dependency is **not imported anywhere else** in your code
2. Check if another dependency uses the same package
3. Run bundle analyzer to verify the package is excluded
4. Try uninstalling the peer dependency completely:
   ```bash
   npm uninstall shiki
   ```

### Fallback Rendering Issues

**Problem**: Fallback UI looks broken or has errors.

**Solutions**:

1. Check for TypeScript errors in console
2. Verify your Tailwind CSS configuration includes Clarity styles
3. Test fallback components in isolation
4. Report issues at: https://github.com/clarity-chat/issues

---

## API Reference

### Type Definitions

```typescript
type FeatureFlag = 'syntax-highlighting' | 'markdown' | 'batch-exports'

interface FeatureFlagConfig {
  disableSyntaxHighlighting?: boolean
  disableMarkdown?: boolean
  disableBatchExports?: boolean
}
```

### Functions

- `isFeatureEnabled(feature: FeatureFlag): boolean` - Check if feature is enabled (not disabled)
- `isFeatureDisabled(feature: FeatureFlag): boolean` - Check if feature is explicitly disabled
- `isFeatureAvailable(feature: FeatureFlag): boolean` - Check if enabled AND dependencies available
- `getMissingDependencies(feature: FeatureFlag): string[]` - Get list of missing dependencies
- `getFeatureStatusMessage(feature: FeatureFlag): string` - Get user-friendly status message
- `setFeatureFlags(config: FeatureFlagConfig): void` - Set flags programmatically
- `getRuntimeConfig(): Readonly<FeatureFlagConfig>` - Get current runtime config
- `getFeatureFlagSummary(): Record<FeatureFlag, {...}>` - Get all feature states
- `logFeatureFlagStatus(onlyUnavailable?: boolean): void` - Log status to console
- `clearFeatureFlagCache(): void` - Clear internal cache

---

## FAQ

### Q: Do I need to set these flags?

**A:** No. By default, all features are enabled if their peer dependencies are installed. Only set
flags if you want to explicitly disable features.

### Q: What happens if I disable a feature but my code uses it?

**A:** The component will render a fallback UI with a message explaining the feature is disabled. No
errors will be thrown.

### Q: Can I disable features per-component?

**A:** No. Feature flags are application-wide. If you need per-component control, conditionally
render different components instead.

### Q: Does this affect bundle size if dependencies aren't installed?

**A:** No. If a peer dependency isn't installed, it won't be bundled regardless of feature flags.

### Q: Can I re-enable features at runtime?

**A:** Yes, using `setFeatureFlags()`. However, if the peer dependency wasn't bundled initially,
you'll need to reload the page after installing it.

---

## Support

- **Documentation**: https://clarity-chat.dev/docs/feature-flags
- **GitHub Issues**: https://github.com/clarity-chat/clarity-chat-components/issues
- **Discord**: https://discord.gg/clarity-chat

---

**Last Updated**: 2026-01-26
