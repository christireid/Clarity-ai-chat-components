# Peer Detection Utility - Quick Start

## Overview

The peer detection utility (`peer-detection.ts`) enables runtime detection of optional peer
dependencies, allowing components to gracefully adapt based on what's available.

## Created Files

1. **`src/utils/peer-detection.ts`** - Main utility module
2. **`src/utils/__tests__/peer-detection.test.ts`** - Comprehensive test suite (24 tests, all
   passing)
3. **`src/examples/peer-detection-example.tsx`** - Working examples and demonstrations
4. **`src/utils/peer-detection.md`** - Complete documentation

## Key Features

- Runtime peer dependency detection
- Performance-optimized with caching
- Concurrent detection deduplication
- SSR-compatible
- React hooks for easy integration
- Installation instruction generator
- TypeScript support with full types

## Quick Examples

### 1. Check All Capabilities

```tsx
import { usePeerCapabilities } from '@clarity-chat/react/utils'

function MyComponent() {
  const { capabilities, isLoading } = usePeerCapabilities()

  if (isLoading) return <Skeleton />

  return (
    <div>
      {capabilities.diagrams && <MermaidDiagram />}
      {capabilities.pdfParsing && <PDFUploader />}
      {capabilities.tokenCounting && <AccurateTokenCounter />}
    </div>
  )
}
```

### 2. Check Specific Peer

```tsx
import { usePeerAvailable } from '@clarity-chat/react/utils'

function TokenCounter({ text }: Props) {
  const { available: hasFlowtoken } = usePeerAvailable('flowtoken')

  return hasFlowtoken ? <AccurateCount text={text} /> : <EstimatedCount text={text} />
}
```

### 3. Load Peer Module

```tsx
import { usePeerModule } from '@clarity-chat/react/utils'

function DiagramRenderer({ code }: Props) {
  const { module: mermaid, available } = usePeerModule('mermaid')

  React.useEffect(() => {
    if (mermaid) {
      mermaid.initialize({ theme: 'dark' })
    }
  }, [mermaid])

  return available ? <MermaidDiagram code={code} /> : <TextDiagram code={code} />
}
```

## Supported Peers

| Package            | Capability              | Purpose                 |
| ------------------ | ----------------------- | ----------------------- |
| `flowtoken`        | `tokenCounting`         | Accurate token counting |
| `mermaid`          | `diagrams`              | Diagram rendering       |
| `pdfjs-dist`       | `pdfParsing`            | PDF parsing             |
| `mammoth`          | `docxParsing`           | DOCX parsing            |
| `cohere-ai`        | `reranking`             | Search reranking        |
| `shiki`            | `syntaxHighlighting`    | Code highlighting       |
| `jszip`            | `zipHandling`           | ZIP handling            |
| `react-markdown`   | `markdown`              | Markdown rendering      |
| `remark-gfm`       | `markdownGfm`           | GFM support             |
| `rehype-highlight` | `markdownCodeHighlight` | Code highlighting       |
| `prismjs`          | `prismHighlighting`     | Alt highlighting        |

## API Summary

### Hooks

- **`usePeerCapabilities()`** - Get all capabilities
- **`usePeerAvailable(packageName)`** - Check specific peer
- **`usePeerModule<T>(packageName)`** - Load peer module

### Functions

- **`detectPeerCapabilities()`** - Async capability detection
- **`isPeerAvailable(packageName)`** - Async availability check
- **`getPeerModule<T>(packageName)`** - Async module loading
- **`clearPeerCache(packageName?)`** - Clear detection cache
- **`getPeerDetectionStats()`** - Get detection statistics
- **`getInstallationInstructions(capabilities)`** - Generate install commands

## Integration with Existing Code

The utility is already integrated into the exports:

```typescript
// From src/utils/index.ts
export {
  detectPeerCapabilities,
  getPeerModule,
  isPeerAvailable,
  clearPeerCache,
  getPeerDetectionStats,
  usePeerCapabilities,
  usePeerAvailable,
  usePeerModule,
  getInstallationInstructions,
  type PeerCapabilities,
} from './peer-detection'
```

## Testing

All 24 tests pass:

- Capability detection
- Caching behavior
- Concurrent detection
- React hooks
- Error handling
- SSR compatibility

```bash
pnpm test peer-detection
# ✓ 24 tests passed
```

## Performance

- **Caching**: Detection results cached automatically
- **Deduplication**: Concurrent checks for same package deduplicated
- **Lazy Loading**: Only detects when needed
- **No Bundle Impact**: Detection happens at runtime, not build time

## Next Steps

1. **Use in Components**: Replace manual peer checks with this utility
2. **Add to Documentation**: Update component docs to show peer-aware examples
3. **Consider Presets**: Create preset capability configurations
4. **Add Telemetry**: Track which peers are commonly used

## Related Files

- **Similar Pattern**: `src/utils/markdown/markdown-fallback.tsx` (uses similar pattern)
- **Package Config**: `package.json` (defines peer dependencies)
- **Type Definitions**: All types exported from main module

## Examples

See `src/examples/peer-detection-example.tsx` for:

- Complete capabilities dashboard
- Adaptive token counter
- Adaptive diagram renderer
- Adaptive syntax highlighter
- Installation instructions display

## Documentation

See `src/utils/peer-detection.md` for:

- Complete API reference
- Usage patterns
- Best practices
- Performance considerations
- Testing strategies
