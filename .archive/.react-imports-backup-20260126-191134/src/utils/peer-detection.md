# Peer Detection Utilities

Runtime detection of optional peer dependencies to enable graceful degradation and adaptive
component behavior.

## Overview

The peer detection utilities allow components to check if optional dependencies are installed and
adapt their behavior accordingly. This enables:

- **Graceful degradation**: Components work with or without optional dependencies
- **Progressive enhancement**: Better features when dependencies are available
- **Bundle optimization**: Only load what you need
- **Developer experience**: Clear feedback about missing dependencies

## Quick Start

### Basic Usage

```tsx
import { usePeerCapabilities } from '@clarity-chat/react/utils'

function MyComponent() {
  const { capabilities, isLoading } = usePeerCapabilities()

  if (isLoading) {
    return <Skeleton />
  }

  return <div>{capabilities.diagrams ? <MermaidDiagram /> : <PlainTextDiagram />}</div>
}
```

### Check Specific Peer

```tsx
import { usePeerAvailable } from '@clarity-chat/react/utils'

function TokenCounter() {
  const { available: hasFlowtoken } = usePeerAvailable('flowtoken')

  return hasFlowtoken ? <AccurateTokenCount /> : <EstimatedTokenCount />
}
```

### Load Peer Module

```tsx
import { usePeerModule } from '@clarity-chat/react/utils'

function DiagramRenderer({ code }: Props) {
  const { module: mermaid, available } = usePeerModule('mermaid')

  React.useEffect(() => {
    if (mermaid) {
      mermaid.initialize({ theme: 'dark' })
    }
  }, [mermaid])

  if (!available) {
    return <PlainTextDiagram code={code} />
  }

  return <MermaidDiagram code={code} />
}
```

## API Reference

### Hooks

#### `usePeerCapabilities()`

Detects all optional peer dependencies and returns a capabilities object.

**Returns:**

```typescript
{
  capabilities: PeerCapabilities | null
  isLoading: boolean
  error: Error | null
}
```

**Capabilities Object:**

```typescript
interface PeerCapabilities {
  tokenCounting: boolean // flowtoken
  diagrams: boolean // mermaid
  pdfParsing: boolean // pdfjs-dist
  docxParsing: boolean // mammoth
  reranking: boolean // cohere-ai
  syntaxHighlighting: boolean // shiki
  zipHandling: boolean // jszip
  markdown: boolean // react-markdown
  markdownGfm: boolean // remark-gfm
  markdownCodeHighlight: boolean // rehype-highlight
  prismHighlighting: boolean // prismjs
}
```

**Example:**

```tsx
function FeatureDashboard() {
  const { capabilities, isLoading, error } = usePeerCapabilities()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <h2>Available Features</h2>
      {capabilities.diagrams && <DiagramFeature />}
      {capabilities.pdfParsing && <PDFUploadFeature />}
      {capabilities.tokenCounting && <TokenOptimizationFeature />}
    </div>
  )
}
```

#### `usePeerAvailable(packageName: string)`

Checks if a specific peer dependency is available.

**Parameters:**

- `packageName` - NPM package name to check (e.g., 'flowtoken', 'mermaid')

**Returns:**

```typescript
{
  available: boolean | null
  isLoading: boolean
  error: Error | null
}
```

**Example:**

```tsx
function SyntaxHighlighter({ code, language }: Props) {
  const { available: hasShiki, isLoading } = usePeerAvailable('shiki')

  if (isLoading) return <CodeSkeleton />

  return hasShiki ? (
    <ShikiHighlighter code={code} language={language} />
  ) : (
    <BasicCodeBlock code={code} />
  )
}
```

#### `usePeerModule<T>(packageName: string)`

Loads a peer dependency module if available.

**Parameters:**

- `packageName` - NPM package name to load
- `T` - TypeScript type for the module (optional)

**Returns:**

```typescript
{
  module: T | null
  available: boolean | null
  isLoading: boolean
  error: Error | null
}
```

**Example:**

```tsx
function PDFViewer({ file }: Props) {
  const { module: pdfjs, available, isLoading } = usePeerModule('pdfjs-dist')
  const [numPages, setNumPages] = React.useState<number>(0)

  React.useEffect(() => {
    if (pdfjs && file) {
      pdfjs.getDocument(file).promise.then((pdf) => {
        setNumPages(pdf.numPages)
      })
    }
  }, [pdfjs, file])

  if (isLoading) return <LoadingSpinner />
  if (!available) return <DownloadPDFLink file={file} />

  return <PDFDocument file={file} numPages={numPages} />
}
```

### Functions

#### `detectPeerCapabilities()`

Detects all optional peer dependencies (async version).

**Returns:** `Promise<PeerCapabilities>`

**Example:**

```tsx
// Server-side or async context
async function checkCapabilities() {
  const capabilities = await detectPeerCapabilities()
  console.log('Available features:', capabilities)
}
```

#### `isPeerAvailable(packageName: string)`

Checks if a specific peer is available (async version).

**Parameters:**

- `packageName` - NPM package name to check

**Returns:** `Promise<boolean>`

**Example:**

```tsx
// Server-side check
async function canProcessPDF() {
  const hasPdfjs = await isPeerAvailable('pdfjs-dist')
  return hasPdfjs
}
```

#### `getPeerModule<T>(packageName: string)`

Gets a peer module if available (async version).

**Parameters:**

- `packageName` - NPM package name to load
- `T` - TypeScript type for the module (optional)

**Returns:** `Promise<T | null>`

**Example:**

```tsx
// Dynamic import
async function loadMermaid() {
  const mermaid = await getPeerModule('mermaid')
  if (mermaid) {
    await mermaid.initialize({ theme: 'dark' })
    return mermaid
  }
  return null
}
```

#### `clearPeerCache(packageName?: string)`

Clears the peer detection cache.

**Parameters:**

- `packageName` - Optional package name to clear (clears all if omitted)

**Example:**

```tsx
// Clear specific cache
clearPeerCache('mermaid')

// Clear all cache
clearPeerCache()
```

#### `getPeerDetectionStats()`

Gets detection statistics for debugging.

**Returns:**

```typescript
{
  total: number
  available: string[]
  unavailable: string[]
  inFlight: number
}
```

**Example:**

```tsx
function DebugPanel() {
  const stats = getPeerDetectionStats()

  return (
    <div>
      <h3>Peer Detection Stats</h3>
      <p>Total checked: {stats.total}</p>
      <p>Available: {stats.available.join(', ')}</p>
      <p>Missing: {stats.unavailable.join(', ')}</p>
      <p>In-flight: {stats.inFlight}</p>
    </div>
  )
}
```

#### `getInstallationInstructions(capabilities: PeerCapabilities)`

Generates installation commands for missing dependencies.

**Parameters:**

- `capabilities` - Capabilities object from `usePeerCapabilities()`

**Returns:**

```typescript
{
  missing: string[]
  npm: string | null
  pnpm: string | null
  yarn: string | null
}
```

**Example:**

```tsx
function SetupGuide() {
  const { capabilities } = usePeerCapabilities()

  if (!capabilities) return null

  const instructions = getInstallationInstructions(capabilities)

  if (instructions.missing.length === 0) {
    return <div>All dependencies installed!</div>
  }

  return (
    <div>
      <h3>Missing Dependencies</h3>
      <p>Install with npm:</p>
      <code>{instructions.npm}</code>
      <p>Or with pnpm:</p>
      <code>{instructions.pnpm}</code>
    </div>
  )
}
```

## Supported Peers

| Package            | Capability              | Purpose                              |
| ------------------ | ----------------------- | ------------------------------------ |
| `flowtoken`        | `tokenCounting`         | Accurate token counting for LLMs     |
| `mermaid`          | `diagrams`              | Diagram rendering from markdown      |
| `pdfjs-dist`       | `pdfParsing`            | PDF document parsing                 |
| `mammoth`          | `docxParsing`           | DOCX document parsing                |
| `cohere-ai`        | `reranking`             | Search result reranking              |
| `shiki`            | `syntaxHighlighting`    | Code syntax highlighting (preferred) |
| `jszip`            | `zipHandling`           | ZIP archive handling                 |
| `react-markdown`   | `markdown`              | Markdown rendering                   |
| `remark-gfm`       | `markdownGfm`           | GitHub Flavored Markdown             |
| `rehype-highlight` | `markdownCodeHighlight` | Code highlighting in markdown        |
| `prismjs`          | `prismHighlighting`     | Alternative syntax highlighting      |

## Patterns

### Progressive Enhancement

```tsx
function EnhancedCodeBlock({ code, language }: Props) {
  const { capabilities } = usePeerCapabilities()

  // Best: Shiki with themes
  if (capabilities?.syntaxHighlighting) {
    return <ShikiHighlighter code={code} language={language} />
  }

  // Good: Prism with basic highlighting
  if (capabilities?.prismHighlighting) {
    return <PrismHighlighter code={code} language={language} />
  }

  // Fallback: Plain code block
  return (
    <pre>
      <code>{code}</code>
    </pre>
  )
}
```

### Conditional Features

```tsx
function ChatInput() {
  const { capabilities } = usePeerCapabilities()

  return (
    <div>
      <TextArea />
      {capabilities?.pdfParsing && <PDFUploadButton />}
      {capabilities?.docxParsing && <DocxUploadButton />}
      {capabilities?.zipHandling && <ZipUploadButton />}
    </div>
  )
}
```

### Adaptive UI

```tsx
function TokenBudgetMonitor({ conversation }: Props) {
  const { available: hasFlowtoken } = usePeerAvailable('flowtoken')

  return (
    <div>
      <h3>Token Usage</h3>
      {hasFlowtoken ? (
        <AccurateTokenDisplay conversation={conversation} />
      ) : (
        <>
          <EstimatedTokenDisplay conversation={conversation} />
          <InstallFlowTokenPrompt />
        </>
      )}
    </div>
  )
}
```

### User Feedback

```tsx
function FeatureSetupPrompt() {
  const { capabilities } = usePeerCapabilities()
  const instructions = getInstallationInstructions(capabilities)

  if (instructions.missing.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <h4>Optional Features Available</h4>
      <p>Install these packages to unlock additional features:</p>
      <ul>
        {instructions.missing.map((pkg) => (
          <li key={pkg}>
            <code>{pkg}</code>
          </li>
        ))}
      </ul>
      <code className="block mt-2">{instructions.pnpm}</code>
    </div>
  )
}
```

## Performance Considerations

### Caching

Detection results are automatically cached to avoid repeated import attempts:

```tsx
// First call: Performs detection
const result1 = await isPeerAvailable('flowtoken')

// Second call: Uses cached result
const result2 = await isPeerAvailable('flowtoken')
```

### Concurrent Detection

Multiple concurrent checks for the same package are deduplicated:

```tsx
// Only one actual detection happens
const [check1, check2, check3] = await Promise.all([
  isPeerAvailable('mermaid'),
  isPeerAvailable('mermaid'),
  isPeerAvailable('mermaid'),
])
```

### Loading States

Always provide loading states for better UX:

```tsx
function MyComponent() {
  const { capabilities, isLoading } = usePeerCapabilities()

  if (isLoading) {
    return <Skeleton />
  }

  // Render based on capabilities
}
```

## Testing

### Mock Peer Availability

```tsx
import { clearPeerCache } from '@clarity-chat/react/utils'

describe('MyComponent', () => {
  beforeEach(() => {
    clearPeerCache()
  })

  it('renders with flowtoken', async () => {
    // Test with dependency available
  })

  it('renders without flowtoken', async () => {
    // Test fallback behavior
  })
})
```

### Test Both Paths

Always test both available and unavailable scenarios:

```tsx
describe('AdaptiveComponent', () => {
  it('uses enhanced version when peer available', async () => {
    const { result } = renderHook(() => usePeerAvailable('shiki'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Test enhanced behavior
  })

  it('uses fallback when peer unavailable', async () => {
    const { result } = renderHook(() => usePeerAvailable('non-existent-pkg'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Test fallback behavior
  })
})
```

## Best Practices

1. **Always provide loading states**
   - Show skeleton or spinner while detecting
   - Avoid layout shifts

2. **Handle errors gracefully**
   - Check for error state from hooks
   - Provide fallback UI

3. **Give user feedback**
   - Show which features are unavailable
   - Provide installation instructions

4. **Cache aggressively**
   - Detection results are cached automatically
   - Clear cache only when needed

5. **Test both paths**
   - Test with dependencies available
   - Test fallback behavior

6. **Document requirements**
   - List optional dependencies in component docs
   - Explain feature differences

## Examples

See [peer-detection-example.tsx](../examples/peer-detection-example.tsx) for complete working
examples including:

- Capabilities dashboard
- Adaptive token counter
- Adaptive diagram renderer
- Adaptive syntax highlighter
- Installation instructions display

## Related

- [markdown-fallback.tsx](./markdown/markdown-fallback.tsx) - Markdown peer detection example
- [package.json](../../package.json) - Peer dependencies configuration
