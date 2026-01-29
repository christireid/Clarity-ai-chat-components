# @clarity-chat/react API Documentation

> **Version:** 2.0.0 **Last Updated:** January 26, 2026

## Overview

Complete API documentation for @clarity-chat/react, covering peer dependencies, component APIs,
hooks, utilities, and type definitions.

---

## Quick Navigation

### 📦 Peer Dependencies

- [Peer Dependencies Guide](./peer-dependencies.md) - Complete guide to peer dependencies
- [Peer Dependency Matrix](./peer-dependency-matrix.md) - Visual component/dependency matrix
- [Usage Examples](./peer-dependency-examples.md) - Code examples for every combination

### 🎨 Components

- [Component API Reference](./components.md) - Full component API documentation
- [Hook API Reference](./hooks.md) - Complete hooks documentation
- [Type Definitions](./types.md) - TypeScript type definitions

#### Featured Component Documentation

- **[CommandPalette](./CommandPalette.README.md)** - Complete API documentation
  - [API Reference](./CommandPalette.md) - Detailed prop documentation
  - [TypeScript Definitions](./CommandPalette.d.ts) - Type definitions
  - [Code Examples](./CommandPalette.examples.tsx) - 12+ usage examples
  - [Testing Guide](./CommandPalette.test-guide.md) - Comprehensive tests
  - [Changelog](./CommandPalette.changelog.md) - Version history

### 🛠️ Guides

- [Installation Guide](./installation.md) - Setup instructions
- [Migration Guide](./migration-guide.md) - Upgrading from v1.x
- [Bundle Optimization](./bundle-optimization.md) - Reduce bundle size

---

## Peer Dependencies Overview

### Required (Must Install)

```bash
npm install react framer-motion lucide-react zod
```

| Package       | Version              | Purpose        | Bundle Size |
| ------------- | -------------------- | -------------- | ----------- |
| react         | ^18.0.0 \|\| ^19.0.0 | Core framework | ~45KB       |
| framer-motion | ^12.23.25            | Animations     | ~60KB       |
| lucide-react  | ^0.500.0             | Icons          | ~5KB        |
| zod           | ^3.24.0              | Validation     | ~15KB       |

**Total:** ~125KB

---

### Optional (Install As Needed)

#### Markdown Rendering

```bash
npm install react-markdown remark-gfm rehype-highlight
```

| Package          | Purpose                  | Bundle Size |
| ---------------- | ------------------------ | ----------- |
| react-markdown   | Markdown rendering       | ~40KB       |
| remark-gfm       | GitHub Flavored Markdown | ~15KB       |
| rehype-highlight | Code highlighting        | ~25KB       |

**Adds:** ~80KB

---

#### Document Loading (RAG)

```bash
npm install pdfjs-dist mammoth cohere-ai
```

| Package    | Purpose      | Bundle Size   |
| ---------- | ------------ | ------------- |
| pdfjs-dist | PDF parsing  | ~400KB (lazy) |
| mammoth    | DOCX parsing | ~100KB (lazy) |
| cohere-ai  | Reranking    | ~50KB         |

**Adds:** ~50KB base + ~500KB on-demand

---

#### Advanced Features

```bash
npm install flowtoken shiki jszip mermaid
```

| Package   | Purpose                             | Bundle Size    |
| --------- | ----------------------------------- | -------------- |
| flowtoken | Accurate token counting             | ~15KB          |
| shiki     | VS Code quality syntax highlighting | ~50KB + themes |
| jszip     | ZIP file creation                   | ~20KB          |
| mermaid   | Diagram rendering                   | ~200KB (lazy)  |

---

## Installation Scenarios

### 1. Minimal (Basic Chat)

```bash
npm install react framer-motion lucide-react zod @clarity-chat/react
```

**Bundle:** ~125KB **Features:** Chat interface, streaming, animations

---

### 2. Standard (+ Markdown)

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm rehype-highlight
npm install @clarity-chat/react
```

**Bundle:** ~205KB **Features:** + Rich text formatting, code highlighting

---

### 3. Advanced (+ RAG)

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm
npm install pdfjs-dist mammoth cohere-ai
npm install @clarity-chat/react
```

**Bundle:** ~255KB base + ~500KB lazy loaded **Features:** + PDF/DOCX loading, semantic search

---

### 4. Full Featured

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm shiki mermaid
npm install pdfjs-dist mammoth cohere-ai flowtoken jszip
npm install @clarity-chat/react
```

**Bundle:** ~300KB base + ~700KB lazy loaded **Features:** Everything enabled

---

## Component Matrix

### Core Components (Required Peers Only)

| Component        | Purpose                 | Required Peers             | Optional Peers  |
| ---------------- | ----------------------- | -------------------------- | --------------- |
| ClarityChat      | Complete chat interface | React, Framer, Lucide, Zod | Markdown, Shiki |
| ChatWindow       | Full-featured chat UI   | React, Framer, Lucide, Zod | Markdown        |
| ChatInput        | Message input           | React, Framer, Lucide, Zod | -               |
| MessageList      | Scrollable message list | React, Framer, Zod         | -               |
| StreamingMessage | Real-time streaming     | React, Framer              | Markdown        |
| TypingIndicator  | Animated typing dots    | React, Framer              | -               |

### Advanced Components (Optional Peers)

| Component                | Purpose                   | Required Peers        | Optional Peers          |
| ------------------------ | ------------------------- | --------------------- | ----------------------- |
| EnhancedMarkdownRenderer | Rich markdown rendering   | React, Framer         | react-markdown, mermaid |
| CodeBlock                | Syntax highlighting       | React                 | shiki, prismjs          |
| DocumentIntegration      | File upload & parsing     | React, Framer, Lucide | pdfjs-dist, mammoth     |
| TokenBudgetBar           | Token usage visualization | React, Framer         | flowtoken               |
| SemanticMessageSearch    | Search with reranking     | React, Framer, Lucide | cohere-ai               |
| BatchExportDialog        | Multi-conversation export | React, Framer, Lucide | jszip                   |

---

## Hook Matrix

| Hook                  | Purpose              | Required Peers | Optional Peers                 |
| --------------------- | -------------------- | -------------- | ------------------------------ |
| useClarityChat        | Core chat state      | React, Zod     | -                              |
| useTokenBudgetMonitor | Token tracking       | React          | flowtoken                      |
| useRAGPipeline        | Document RAG         | React, Zod     | pdfjs-dist, mammoth, cohere-ai |
| useSemanticCache      | Response caching     | React          | -                              |
| useAgent              | Agent orchestration  | React, Zod     | -                              |
| useCompletion         | Completion streaming | React, Zod     | -                              |

---

## Fallback Behaviors

### Missing Markdown Renderer

- **With react-markdown:** Full markdown with GFM, tables, lists
- **Without:** Plain text in `<pre>` tags

### Missing Syntax Highlighter

- **Priority:** shiki → prismjs → plain text
- **With shiki:** VS Code quality, 50+ themes
- **With prismjs:** Basic highlighting, 10+ themes
- **Without both:** Plain text code blocks

### Missing Document Loaders

- **With pdfjs-dist:** PDF parsing enabled
- **Without:** Warning shown: "Install pdfjs-dist for PDF support"

### Missing Token Counter

- **With flowtoken:** ~99% accurate token counting
- **Without:** Character estimation (~75% accurate)

### Missing Reranker

- **With cohere-ai:** ~95% accuracy in top 3 results
- **Without:** Vector similarity only (~80% accuracy)

---

## Quick Start Examples

### Basic Chat

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

### Chat with Markdown

```tsx
import { ChatWindow, EnhancedMarkdownRenderer } from '@clarity-chat/react'

export default function App() {
  return (
    <ChatWindow
      api="/api/chat"
      messageRenderer={(msg) => <EnhancedMarkdownRenderer>{msg.content}</EnhancedMarkdownRenderer>}
    />
  )
}
```

### Document Q&A

```tsx
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { PDFLoader } from '@clarity-chat/react/document-loaders'

export default function DocumentChat() {
  const { query, addDocuments } = useRAGPipeline({
    reranker: {
      enabled: true,
      provider: 'cohere',
      apiKey: process.env.COHERE_API_KEY,
    },
  })

  const handleFileUpload = async (file: File) => {
    const loader = new PDFLoader()
    const docs = await loader.load(file)
    await addDocuments(docs)
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      <ChatWindow onSubmit={query} />
    </div>
  )
}
```

---

## Feature Detection

```tsx
import { PeerDependencyChecker } from '@clarity-chat/react/types/peer-dependencies'

const check = PeerDependencyChecker.checkAll()

console.log('Features available:')
console.log('Markdown:', check.features.hasMarkdown)
console.log('Syntax highlighting:', check.features.hasSyntaxHighlighting)
console.log('PDF support:', check.features.hasPDFSupport)
console.log('DOCX support:', check.features.hasDOCXSupport)
console.log('Token counting:', check.features.hasAccurateTokenCounting)
console.log('Reranking:', check.features.hasReranking)
```

---

## Bundle Size Analysis

### Base Configuration (Required Peers)

```
react:           45KB
framer-motion:   60KB
lucide-react:    5KB (tree-shaken)
zod:             15KB
─────────────
Total:           ~125KB
```

### + Markdown

```
react-markdown:  40KB
remark-gfm:      15KB
rehype-highlight: 25KB
─────────────
Total:           ~205KB
```

### + Advanced Syntax Highlighting

```
shiki:           50KB
+ themes:        ~10KB each
─────────────
Total:           ~265KB (with 1 theme)
```

### + Document Loading

```
pdfjs-dist:      400KB (lazy loaded)
mammoth:         100KB (lazy loaded)
cohere-ai:       50KB
─────────────
Base Total:      ~255KB
On-demand:       ~500KB
```

---

## Performance Recommendations

### Small Projects (<1K users)

- Minimal setup (required peers only)
- Bundle: ~125KB
- Add markdown if needed (+80KB)

### Medium Projects (1K-10K users)

- Standard setup with markdown
- Add shiki for code highlighting
- Bundle: ~255KB
- Consider mermaid for diagrams

### Large Projects (10K+ users)

- Full featured setup
- Aggressive code splitting
- Lazy load heavy dependencies
- Bundle: ~300KB base + lazy loaded

---

## Code Splitting Best Practices

```tsx
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const EnhancedMarkdownRenderer = lazy(() =>
  import('@clarity-chat/react').then(m => ({
    default: m.EnhancedMarkdownRenderer
  }))
)

const PDFLoader = lazy(() =>
  import('@clarity-chat/react/document-loaders').then(m => ({
    default: m.PDFLoader
  }))
)

// Use with Suspense
<Suspense fallback={<Skeleton />}>
  <EnhancedMarkdownRenderer>{content}</EnhancedMarkdownRenderer>
</Suspense>
```

---

## TypeScript Configuration

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Troubleshooting

### "Cannot find module 'framer-motion'"

```bash
npm install framer-motion
```

### "Cannot find module 'lucide-react'"

```bash
npm install lucide-react
```

### Markdown not rendering

```bash
npm install react-markdown remark-gfm
```

### PDF upload fails

```bash
npm install pdfjs-dist
```

### Token counts inaccurate

```bash
npm install flowtoken
```

### Reranking not working

```bash
npm install cohere-ai
```

---

## Documentation Structure

```
docs/api/
├── README.md                           # This file
├── peer-dependencies.md                # Complete peer dependency guide
├── peer-dependency-matrix.md           # Visual matrix
├── peer-dependency-examples.md         # Code examples
├── components.md                       # Component API reference
├── hooks.md                            # Hooks API reference
├── types.md                            # Type definitions
├── installation.md                     # Installation guide
├── migration-guide.md                  # v1 to v2 migration
├── bundle-optimization.md              # Bundle size optimization
└── generated/                          # TypeDoc generated docs
    ├── index.html
    ├── modules.html
    └── ...
```

---

## Related Resources

### Documentation

- [Main Repository Documentation](../../../../README.md)
- [Contributing Guide](../../../../CONTRIBUTING.md)
- [Changelog](../../CHANGELOG.md)

### External Links

- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [Zod Validation](https://zod.dev)

### Support

- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

## Generating Documentation

### Generate TypeDoc Documentation

```bash
pnpm run docs:generate
```

### Serve Documentation Locally

```bash
pnpm run docs:serve
```

### Generate All Documentation

```bash
pnpm run docs:all
```

---

**Last Updated:** January 26, 2026 **Version:** 2.0.0
