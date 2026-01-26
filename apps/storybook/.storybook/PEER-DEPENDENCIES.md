# Peer Dependencies Configuration

## Overview

Clarity Chat Components use a flexible peer dependency system that allows developers to install only the features they need. This document explains how peer dependencies are configured in Storybook.

## Why Storybook Has All Peers Installed

Unlike production apps, Storybook has **all peer dependencies installed** (both required and optional) to enable:

1. **Comprehensive Testing** - Test all component features and variations
2. **Fallback UI Demonstration** - Show what happens when peers are missing
3. **Bundle Size Analysis** - Analyze impact of different dependency combinations
4. **Documentation** - Generate accurate documentation for all features

## Dependency Categories

### Required Peers (Always Needed)

```json
{
  "react": "^19.0.0",
  "framer-motion": "^12.23.25",
  "lucide-react": "^0.500.0",
  "zod": "^3.24.0"
}
```

**Total Size:** ~290KB (with core components)

These dependencies are externalized from the bundle and must be provided by the consuming application.

### Optional Peers (Feature-Specific)

#### Document Processing (~2.7MB)

```json
{
  "pdfjs-dist": "^4.0.0",    // PDF parsing and rendering
  "mammoth": "^1.8.0"         // DOCX document parsing
}
```

**Use Case:** File upload with PDF/DOCX support

#### Markdown Rendering (~105KB)

```json
{
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "rehype-highlight": "^7.0.2",
  "prismjs": "^1.30.0"
}
```

**Use Case:** Rendering markdown messages with syntax highlighting

#### Advanced Features (~1.1MB)

```json
{
  "mermaid": "^11.0.0",       // Diagram rendering
  "shiki": "^3.0.0",          // Advanced syntax highlighting
  "cohere-ai": "^7.0.0",      // Reranking service
  "flowtoken": "^1.0.40",     // Token streaming
  "jszip": "^3.10.0"          // ZIP file handling
}
```

**Use Case:** Enterprise features and advanced rendering

## Testing Missing Dependencies

Storybook includes a custom addon to simulate missing peer dependencies:

### Using the Peer Dependency Simulator

1. **Open Storybook** - `pnpm dev`
2. **Find the Package Icon** - In the toolbar (📦)
3. **Click to Open Menu** - Shows all peer dependencies
4. **Toggle Dependencies** - Mark any optional peer as "MISSING"
5. **Observe Components** - See fallback UIs in action

### Example Test Scenarios

#### Scenario 1: Missing PDF Support

```
1. Mark `pdfjs-dist` as missing
2. Navigate to file upload story
3. Verify: "PDF Support Not Available" message appears
4. Verify: PDF files are filtered from accept types
5. Verify: Installation instructions are shown
```

#### Scenario 2: Missing Markdown Support

```
1. Mark `react-markdown` as missing
2. Navigate to message list story
3. Verify: Markdown renders as plain text
4. Verify: Code blocks use basic formatting
5. Verify: No console errors occur
```

#### Scenario 3: Missing Mermaid Support

```
1. Mark `mermaid` as missing
2. Send message with mermaid diagram code
3. Verify: Diagram code renders in code block
4. Verify: Warning message about missing mermaid
5. Verify: Installation instructions provided
```

## Fallback Strategies

### Strategy 1: Informative Error Messages

When a feature requires a missing peer, show:

- Clear explanation of what's missing
- Installation command (`npm install package-name`)
- Link to documentation (if applicable)
- Alternative workarounds (if any)

**Example:**

```tsx
if (!isPDFJSAvailable()) {
  return (
    <div className="missing-peer-message">
      <AlertCircle />
      <h4>PDF Support Not Available</h4>
      <p>Install pdfjs-dist to enable PDF uploads</p>
      <code>npm install pdfjs-dist</code>
    </div>
  )
}
```

### Strategy 2: Graceful Degradation

When possible, provide reduced functionality:

- **Missing Shiki** → Fall back to Prism.js
- **Missing Reranking** → Skip reranking step, use basic similarity
- **Missing Mermaid** → Render diagram as code block

**Example:**

```tsx
// Use advanced highlighter if available, fall back to basic
const highlighter = isShikiAvailable()
  ? await import('shiki').then(m => m.getHighlighter())
  : await import('prismjs').then(m => m.highlight)
```

### Strategy 3: Feature Detection

Check for peer availability at runtime:

```tsx
import { checkPeerAvailability } from '@clarity-chat/react/internal'

const features = checkPeerAvailability()

if (features.pdfSupport) {
  // Enable PDF upload
}

if (features.markdownSupport) {
  // Enable markdown rendering
}
```

## Bundle Size Tracking

### Component Size Breakdown

| Component | Size | Gzipped | With Required Peers |
|-----------|------|---------|---------------------|
| ChatInput | 8KB | 2.5KB | ~158KB |
| MessageList | 12KB | 3.5KB | ~162KB |
| ClarityChat | 45KB | 12KB | ~285KB |
| EnhancedMarkdownRenderer | 25KB | 7KB | ~600KB |

### Configuration Sizes

| Configuration | Total | Gzipped | Use Case |
|---------------|-------|---------|----------|
| Core Only | 290KB | 85KB | Basic chat |
| + Markdown | 395KB | 110KB | With rendering |
| + Documents | 2.9MB | 780KB | File uploads |
| Full Install | 4.5MB | 1.2MB | All features |

## Storybook Stories

### Foundation Stories

Located in `stories/Foundation/`:

1. **PeerDependencies.stories.tsx**
   - Overview of all dependencies
   - Installation instructions
   - Size information
   - Required vs optional breakdown

2. **FallbackBehavior.stories.tsx**
   - Demonstrates all fallback UIs
   - Shows missing dependency messages
   - Includes installation instructions
   - Tests error boundaries

3. **BundleSize.stories.tsx**
   - Compares different configurations
   - Shows tree-shaking examples
   - Demonstrates dynamic imports
   - Optimization best practices

### Component Stories with Peer Requirements

Each component story includes peer dependency information:

```typescript
export const WithPDFSupport: Story = {
  args: {
    enablePDF: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Requires \`pdfjs-dist\` to be installed.

\`\`\`bash
npm install pdfjs-dist
\`\`\`

Size impact: +2.5MB
        `,
      },
    },
  },
}
```

## Development Workflow

### Adding a New Optional Peer

1. **Add to package.json**

```json
{
  "peerDependencies": {
    "new-library": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "new-library": {
      "optional": true
    }
  }
}
```

2. **Add to Storybook's package.json**

```json
{
  "dependencies": {
    "new-library": "^1.0.0"
  }
}
```

3. **Add to Peer Dependency Simulator**

Edit `.storybook/addons/peer-dependency-simulator/register.tsx`:

```typescript
const PEER_DEPENDENCIES: PeerDependency[] = [
  // ... existing deps
  {
    name: 'new-library',
    required: false,
    description: 'Description of library',
    bundleSize: '~100KB',
  },
]
```

4. **Create Fallback UI**

```tsx
export function FeatureComponent() {
  const isAvailable = checkPeerAvailable('new-library')

  if (!isAvailable) {
    return <FallbackUI libraryName="new-library" />
  }

  return <FullFeature />
}
```

5. **Add Story**

Create story demonstrating the feature with and without the peer:

```typescript
export const WithNewLibrary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Requires `new-library` for full functionality',
      },
    },
  },
}
```

6. **Update Bundle Size Data**

Add size information to `.storybook/addons/bundle-size-display/register.tsx`:

```typescript
const COMPONENT_SIZES: Record<string, BundleSizeInfo> = {
  FeatureComponent: {
    component: 'FeatureComponent',
    size: '20KB',
    gzipped: '6KB',
    totalSize: '120KB',
    dependencies: [
      { name: 'new-library', size: '100KB', required: false },
    ],
  },
}
```

## Best Practices

### For Library Maintainers

1. **Keep Core Small** - Externalize everything possible
2. **Make Features Optional** - Use `peerDependenciesMeta.optional: true`
3. **Provide Fallbacks** - Always have a degraded mode
4. **Document Requirements** - Clear docs on what needs what
5. **Test Without Peers** - Verify fallbacks work correctly

### For Library Users

1. **Install Incrementally** - Start with core, add features as needed
2. **Use Dynamic Imports** - Lazy load heavy features
3. **Tree-Shake Aggressively** - Import only what you use
4. **Monitor Bundle Size** - Track impact of each dependency
5. **Test Missing Peers** - Verify graceful degradation

## Troubleshooting

### Issue: Storybook Shows Missing Peer Warning

**Cause:** Not all peers are installed in Storybook

**Solution:**

```bash
cd apps/storybook
pnpm install
```

### Issue: Bundle Size Panel Shows N/A

**Cause:** Component not in bundle size database

**Solution:** Add size data to `bundle-size-display/register.tsx`

### Issue: Peer Dependency Toggle Not Working

**Cause:** Preview decorator not registered

**Solution:** Check `preview.tsx` includes `withPeerDependencySimulation`

### Issue: Fallback UI Not Showing

**Cause:** Component not checking for peer availability

**Solution:** Implement feature detection:

```tsx
import { checkPeerAvailable } from '@clarity-chat/react/internal'

const hasPeer = checkPeerAvailable('library-name')
```

## Resources

- [Peer Dependencies Documentation](../../docs/peer-dependencies.md)
- [Bundle Size Optimization](../../docs/bundle-size.md)
- [Component Stories](../stories/)
- [Storybook Configuration](./README.md)

---

**Last Updated:** January 2026
