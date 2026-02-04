# Peer Dependency Matrix

> **@clarity-chat/react v2.0.0** **Last Updated:** January 26, 2026

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PEER DEPENDENCIES                            │
├──────────────┬──────────────────────────────────────────────────┤
│   REQUIRED   │  React, Framer Motion, Lucide React, Zod        │
│   (Must      │  Bundle: ~80KB combined                         │
│   Install)   │  Used in: All components                        │
├──────────────┼──────────────────────────────────────────────────┤
│   OPTIONAL   │  Markdown Stack: react-markdown, remark-gfm     │
│   (Install   │  Document Loaders: pdfjs-dist, mammoth          │
│   As         │  Syntax Highlighting: shiki, prismjs            │
│   Needed)    │  Advanced: flowtoken, cohere-ai, jszip, mermaid │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Component Matrix

### Legend

- ✅ Required
- 🔶 Optional (enhanced functionality)
- ⚪ Not used
- 📦 Dynamically imported

---

## Core Components

| Component            | React | Framer | Lucide | Zod | Markdown | Shiki | PDF.js | Mammoth | FlowToken | Cohere | JSZip | Mermaid |
| -------------------- | ----- | ------ | ------ | --- | -------- | ----- | ------ | ------- | --------- | ------ | ----- | ------- |
| **ClarityChat**      | ✅    | ✅     | ✅     | ✅  | 🔶       | 🔶    | ⚪     | ⚪      | 🔶        | ⚪     | ⚪    | 🔶      |
| **ChatWindow**       | ✅    | ✅     | ✅     | ✅  | 🔶       | 🔶    | ⚪     | ⚪      | 🔶        | ⚪     | ⚪    | 🔶      |
| **ChatInput**        | ✅    | ✅     | ✅     | ✅  | ⚪       | ⚪    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | ⚪      |
| **MessageList**      | ✅    | ✅     | ⚪     | ✅  | ⚪       | ⚪    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | ⚪      |
| **StreamingMessage** | ✅    | ✅     | ⚪     | ⚪  | 🔶       | 🔶    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | ⚪      |
| **TypingIndicator**  | ✅    | ✅     | ⚪     | ⚪  | ⚪       | ⚪    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | ⚪      |

### Bundle Impact

```
Core Only (Required Peers):
  React: 45KB
  Framer Motion: 60KB
  Lucide React: 5KB (tree-shaken)
  Zod: 15KB
  ─────────────
  Total: ~125KB

Core + Markdown:
  + react-markdown: 40KB
  + remark-gfm: 15KB
  + rehype-highlight: 25KB
  ─────────────
  Total: ~205KB
```

---

## Advanced Components

| Component                    | React | Framer | Lucide | Markdown | Shiki | PDF.js | Mammoth | FlowToken | Cohere | JSZip | Mermaid |
| ---------------------------- | ----- | ------ | ------ | -------- | ----- | ------ | ------- | --------- | ------ | ----- | ------- |
| **EnhancedMarkdownRenderer** | ✅    | ✅     | ⚪     | 🔶       | 🔶    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | 🔶      |
| **CodeBlock**                | ✅    | ⚪     | ⚪     | ⚪       | 🔶    | ⚪     | ⚪      | ⚪        | ⚪     | ⚪    | ⚪      |
| **DocumentIntegration**      | ✅    | ✅     | ✅     | ⚪       | ⚪    | 📦     | 📦      | ⚪        | ⚪     | ⚪    | ⚪      |
| **TokenBudgetBar**           | ✅    | ✅     | ⚪     | ⚪       | ⚪    | ⚪     | ⚪      | 🔶        | ⚪     | ⚪    | ⚪      |
| **SemanticMessageSearch**    | ✅    | ✅     | ✅     | ⚪       | ⚪    | ⚪     | ⚪      | ⚪        | 🔶     | ⚪    | ⚪      |
| **BatchExportDialog**        | ✅    | ✅     | ✅     | ⚪       | ⚪    | ⚪     | ⚪      | ⚪        | ⚪     | 🔶    | ⚪      |

### Fallback Behaviors

| Component                    | Missing Peer   | Fallback Behavior                          |
| ---------------------------- | -------------- | ------------------------------------------ |
| **EnhancedMarkdownRenderer** | react-markdown | Plain text with `<pre>` tags               |
| **EnhancedMarkdownRenderer** | mermaid        | Code block shows mermaid syntax as text    |
| **CodeBlock**                | shiki, prismjs | Plain `<code>` block with no highlighting  |
| **DocumentIntegration**      | pdfjs-dist     | Warning: "PDF support requires pdfjs-dist" |
| **DocumentIntegration**      | mammoth        | Warning: "DOCX support requires mammoth"   |
| **TokenBudgetBar**           | flowtoken      | Character estimation (text.length / 4)     |
| **SemanticMessageSearch**    | cohere-ai      | Vector similarity without reranking        |
| **BatchExportDialog**        | jszip          | Individual file downloads                  |

---

## Hooks Matrix

| Hook                      | React | Zod | FlowToken | PDF.js | Mammoth | Cohere | Purpose              |
| ------------------------- | ----- | --- | --------- | ------ | ------- | ------ | -------------------- |
| **useClarityChat**        | ✅    | ✅  | ⚪        | ⚪     | ⚪      | ⚪     | Core chat state      |
| **useTokenBudgetMonitor** | ✅    | ⚪  | 🔶        | ⚪     | ⚪      | ⚪     | Token tracking       |
| **useRAGPipeline**        | ✅    | ✅  | ⚪        | 🔶     | 🔶      | 🔶     | Document RAG         |
| **useSemanticCache**      | ✅    | ⚪  | ⚪        | ⚪     | ⚪      | ⚪     | Response caching     |
| **useAgent**              | ✅    | ✅  | ⚪        | ⚪     | ⚪      | ⚪     | Agent orchestration  |
| **useCompletion**         | ✅    | ✅  | ⚪        | ⚪     | ⚪      | ⚪     | Completion streaming |
| **useTokenValidator**     | ✅    | ✅  | 🔶        | ⚪     | ⚪      | ⚪     | Token validation     |

---

## Feature Matrix

### Markdown Rendering

**Required Peers:**

- react
- framer-motion (for animations)

**Optional Peers:**

- react-markdown (rendering)
- remark-gfm (GitHub Flavored Markdown)
- rehype-highlight (code highlighting)
- mermaid (diagrams)

**Components Using:**

- EnhancedMarkdownRenderer
- ChatWindow
- StreamingMessage
- MessageList (when rendering markdown messages)

**Fallback Stack:**

```
With all peers:     Full markdown + GFM + diagrams + highlighted code
Without mermaid:    Full markdown + GFM + highlighted code (diagrams as text)
Without rehype:     Full markdown + GFM (plain code blocks)
Without remark-gfm: Basic markdown (no tables, task lists, etc.)
Without react-md:   Plain text in <pre> tags
```

**Bundle Size:**

```
react-markdown:   ~40KB
remark-gfm:       ~15KB
rehype-highlight: ~25KB
mermaid:          ~200KB (lazy loaded)
────────────────
Total:            ~80KB base + 200KB on-demand
```

---

### Syntax Highlighting

**Optional Peers:**

- shiki (VS Code quality highlighting)
- prismjs (lightweight alternative)

**Priority:** shiki → prismjs → plain text

**Components Using:**

- CodeBlock
- EnhancedMarkdownRenderer (via rehype-highlight)

**Comparison:**

| Feature      | Shiki              | Prism.js          | None      |
| ------------ | ------------------ | ----------------- | --------- |
| Bundle Size  | ~50KB + themes     | ~10KB + languages | 0KB       |
| Quality      | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐          | ⭐        |
| Themes       | 50+ VS Code themes | 10+ themes        | No themes |
| Languages    | 200+               | 100+              | N/A       |
| Line Numbers | ✅ Yes             | ✅ Yes            | ❌ No     |
| Highlighting | ✅ Yes             | ✅ Yes            | ❌ No     |

**Bundle Impact:**

```
With Shiki:   +50KB + ~10KB per theme
With Prism:   +10KB + ~2KB per language
Without both: 0KB (plain text)
```

---

### Document Loading (RAG)

**Required Peers:**

- react
- zod (for validation)

**Optional Peers:**

- pdfjs-dist (PDF parsing)
- mammoth (DOCX parsing)
- cohere-ai (reranking)

**Components/Hooks Using:**

- DocumentIntegration (component)
- useRAGPipeline (hook)
- PDFLoader (utility)
- DOCXLoader (utility)

**Supported Formats:**

| Format | Peer Required | Fallback          | Bundle Size   |
| ------ | ------------- | ----------------- | ------------- |
| .pdf   | pdfjs-dist    | Warning shown     | ~400KB (lazy) |
| .docx  | mammoth       | Warning shown     | ~100KB (lazy) |
| .txt   | None          | ✅ Native support | 0KB           |
| .md    | None          | ✅ Native support | 0KB           |

**Reranking:**

| Feature          | Without Cohere    | With Cohere        |
| ---------------- | ----------------- | ------------------ |
| Search Results   | Vector similarity | Vector + reranking |
| Accuracy (Top 3) | ~80%              | ~95%               |
| Bundle Size      | 0KB               | ~50KB              |
| API Cost         | Free              | ~$0.001/1K results |

---

### Token Management

**Optional Peer:**

- flowtoken

**Components/Hooks Using:**

- TokenBudgetBar
- useTokenBudgetMonitor
- useTokenValidator
- TokenAnalytics

**Comparison:**

| Feature     | With FlowToken                  | Without FlowToken    |
| ----------- | ------------------------------- | -------------------- |
| Accuracy    | ~99%                            | ~75%                 |
| Multi-model | ✅ GPT-3.5, GPT-4, Claude, etc. | ❌ Estimation only   |
| Bundle Size | ~15KB                           | 0KB                  |
| Speed       | Fast (native)                   | Faster (simple math) |

**Estimation Algorithm (Fallback):**

```typescript
// With flowtoken
import { countTokens } from 'flowtoken'
const tokens = countTokens(text, 'gpt-4') // Accurate

// Without flowtoken
const tokens = Math.ceil(text.length / 4) // ~75% accurate
```

---

### Export & Download

**Optional Peer:**

- jszip

**Components Using:**

- BatchExportDialog
- ConversationExporter

**Comparison:**

| Feature       | With JSZip     | Without JSZip         |
| ------------- | -------------- | --------------------- |
| Single Export | ✅ One file    | ✅ One file           |
| Batch Export  | ✅ ZIP archive | ❌ Multiple downloads |
| Compression   | ✅ Yes         | ❌ No                 |
| Bundle Size   | ~20KB          | 0KB                   |

---

## Installation Scenarios

### Scenario 1: Minimal Chat (Basic)

**Use Case:** Simple chat interface, no bells and whistles

**Install:**

```bash
npm install react framer-motion lucide-react zod
npm install @clarity-chat/react
```

**Bundle Size:** ~125KB

**What You Get:**

- ✅ Chat interface
- ✅ Message streaming
- ✅ Animations
- ✅ Basic validation
- ❌ No markdown
- ❌ No syntax highlighting
- ❌ No document loading

**Components Available:**

- ClarityChat
- ChatWindow
- ChatInput
- MessageList
- StreamingMessage
- TypingIndicator

---

### Scenario 2: Content Chat (Markdown)

**Use Case:** Chat with rich text formatting

**Install:**

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm rehype-highlight
npm install @clarity-chat/react
```

**Bundle Size:** ~205KB

**What You Get:**

- ✅ All basic features
- ✅ Markdown rendering
- ✅ GitHub Flavored Markdown
- ✅ Code highlighting (via rehype)
- ✅ Tables, lists, task lists
- ❌ No advanced syntax highlighting (shiki)
- ❌ No document loading

---

### Scenario 3: Developer Chat (Code-Heavy)

**Use Case:** Technical docs, code examples

**Install:**

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm shiki
npm install @clarity-chat/react
```

**Bundle Size:** ~255KB

**What You Get:**

- ✅ All markdown features
- ✅ VS Code quality syntax highlighting
- ✅ 50+ color themes
- ✅ Line numbers, highlighting
- ❌ No document loading

**Example:**

```tsx
import { CodeBlock } from '@clarity-chat/react'

;<CodeBlock language="typescript" theme="github-dark" showLineNumbers highlightLines={[3, 4, 5]}>
  {sourceCode}
</CodeBlock>
```

---

### Scenario 4: Document Q&A (RAG)

**Use Case:** Chat with PDFs and DOCX files

**Install:**

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm
npm install pdfjs-dist mammoth cohere-ai
npm install @clarity-chat/react
```

**Bundle Size:** ~255KB base + ~500KB for documents (lazy loaded)

**What You Get:**

- ✅ All markdown features
- ✅ PDF parsing
- ✅ DOCX parsing
- ✅ Semantic search with reranking
- ✅ Document chunking
- ❌ No advanced syntax highlighting (can add shiki)

---

### Scenario 5: Enterprise Chat (Full Featured)

**Use Case:** Production app with all features

**Install:**

```bash
# Core
npm install react framer-motion lucide-react zod

# Markdown & highlighting
npm install react-markdown remark-gfm shiki mermaid

# Document processing
npm install pdfjs-dist mammoth jszip

# Advanced features
npm install flowtoken cohere-ai

npm install @clarity-chat/react
```

**Bundle Size:** ~300KB base + ~700KB loaded on-demand

**What You Get:**

- ✅ Everything
- ✅ Markdown + diagrams
- ✅ Advanced syntax highlighting
- ✅ PDF/DOCX loading
- ✅ Accurate token counting
- ✅ Semantic search with reranking
- ✅ Batch export to ZIP
- ✅ All premium features

---

## Dependency Decision Tree

```
┌─────────────────────────────────────┐
│  Do you need rich text rendering?  │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────┐
  YES           NO
    │            │
    │            └─► Install: react, framer-motion, lucide-react, zod
    │                Bundle: ~125KB
    │
    ├─► Install react-markdown, remark-gfm
    │   Bundle: ~205KB
    │
    └─────────────────────────────────┐
│  Do you need advanced code highlighting?  │
└─────────┬─────────────────────────────────┘
          │
    ┌─────┴─────┐
  YES           NO
    │            │
    │            └─► Continue with rehype-highlight
    │
    └─► Install shiki
        Bundle: ~255KB

┌─────────────────────────────────────┐
│  Do you need document Q&A (RAG)?   │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────┐
  YES           NO
    │            │
    │            └─► Done
    │
    └─► Install pdfjs-dist, mammoth
        Bundle: ~255KB + ~500KB lazy loaded

        ┌─────────────────────────────────────┐
        │  Do you need reranking?             │
        └─────────┬───────────────────────────┘
                  │
            ┌─────┴─────┐
          YES           NO
            │            │
            │            └─► Done
            │
            └─► Install cohere-ai
                Bundle: +50KB
```

---

## Performance Impact

### Initial Bundle Size by Configuration

| Configuration | Base Bundle | Lazy Loaded | Total   |
| ------------- | ----------- | ----------- | ------- |
| Minimal       | 125KB       | 0KB         | 125KB   |
| + Markdown    | 205KB       | 0KB         | 205KB   |
| + Shiki       | 255KB       | ~10KB/theme | ~265KB  |
| + Mermaid     | 205KB       | ~200KB      | ~405KB  |
| + RAG         | 255KB       | ~500KB      | ~755KB  |
| Full Featured | 300KB       | ~700KB      | ~1000KB |

### Load Time Impact (3G Network)

| Configuration | Time to Interactive               |
| ------------- | --------------------------------- |
| Minimal       | ~0.5s                             |
| + Markdown    | ~0.8s                             |
| + Shiki       | ~1.0s                             |
| + RAG         | ~1.0s (base) + ~2s (first doc)    |
| Full Featured | ~1.2s (base) + ~3s (all features) |

### Memory Impact

| Configuration    | Heap Size | Notes                     |
| ---------------- | --------- | ------------------------- |
| Minimal          | ~10MB     | Basic chat                |
| + Markdown       | ~15MB     | React components          |
| + Shiki          | ~25MB     | Theme + language grammars |
| + RAG (100 docs) | ~50MB     | Vector embeddings         |
| Full Featured    | ~75MB     | All features loaded       |

---

## Recommendations

### For Small Projects (<1000 users)

```bash
npm install react framer-motion lucide-react zod @clarity-chat/react
```

- Keep it minimal
- Add markdown if needed
- Bundle: ~125-205KB

### For Medium Projects (1K-10K users)

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm shiki
npm install @clarity-chat/react
```

- Add rich text + syntax highlighting
- Consider mermaid for diagrams
- Bundle: ~255KB

### For Large Projects (10K+ users)

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm shiki mermaid
npm install pdfjs-dist mammoth cohere-ai flowtoken
npm install @clarity-chat/react
```

- Full featured
- Use code splitting aggressively
- Lazy load heavy dependencies
- Bundle: ~300KB base + lazy loaded

---

## Code Splitting Recommendations

```typescript
// Lazy load heavy features
const EnhancedMarkdownRenderer = lazy(() =>
  import('@clarity-chat/react').then(m => ({ default: m.EnhancedMarkdownRenderer }))
)

const PDFLoader = lazy(() =>
  import('@clarity-chat/react/document-loaders').then(m => ({ default: m.PDFLoader }))
)

const CodeBlock = lazy(() =>
  import('@clarity-chat/react').then(m => ({ default: m.CodeBlock }))
)

// Use Suspense
<Suspense fallback={<Skeleton />}>
  <EnhancedMarkdownRenderer>{content}</EnhancedMarkdownRenderer>
</Suspense>
```

---

## Related Documentation

- [Peer Dependencies API](./peer-dependencies.md)
- [Bundle Optimization Guide](./bundle-optimization.md)
- [Installation Guide](./installation.md)
- [Migration Guide](./migration-guide.md)

---

**Last Updated:** January 26, 2026
