# Peer Dependencies API Documentation

> **Version:** 2.0.0 **Last Updated:** January 26, 2026

## Table of Contents

1. [Overview](#overview)
2. [Required Peer Dependencies](#required-peer-dependencies)
3. [Optional Peer Dependencies](#optional-peer-dependencies)
4. [Component Dependency Matrix](#component-dependency-matrix)
5. [Fallback Behaviors](#fallback-behaviors)
6. [Installation Examples](#installation-examples)
7. [Usage Examples by Feature](#usage-examples-by-feature)
8. [Troubleshooting](#troubleshooting)

---

## Overview

@clarity-chat/react uses a peer dependency architecture to keep the core bundle size minimal while
providing powerful features. This allows you to install only the dependencies you need for your
specific use case.

### Bundle Size Impact

| Configuration   | Bundle Size | Features                       |
| --------------- | ----------- | ------------------------------ |
| Core only       | ~150KB      | Basic chat, streaming          |
| Core + Markdown | ~220KB      | + Rich text rendering          |
| Core + RAG      | ~450KB      | + PDF/DOCX loading, embeddings |
| Full Featured   | ~800KB      | All features enabled           |

### Dependency Categories

- **Required**: Must be installed for any usage
- **Optional**: Install only if using specific features
- **Recommended**: Strongly suggested for production use

---

## Required Peer Dependencies

These must be installed for @clarity-chat/react to function.

### React (^18.0.0 || ^19.0.0)

**Purpose:** Core framework for all components

**Why Required:** All components are React components

**Installation:**

```bash
npm install react react-dom
# or
pnpm add react react-dom
# or
yarn add react react-dom
```

**Version Notes:**

- React 18.0.0+ required for concurrent features
- React 19.0.0+ supported with improved streaming
- Server Components support in Next.js 13+

---

### Framer Motion (^12.23.25)

**Purpose:** Declarative animations and gesture handling

**Why Required:** Used across 124+ components for:

- Message animations (fade in, slide)
- Scroll-based effects
- Gesture interactions (drag, swipe)
- Layout animations
- Reduced motion support

**Installation:**

```bash
npm install framer-motion
```

**Bundle Size:** ~60KB (minified + gzipped)

**Key Features Used:**

- `motion.*` components for animated elements
- `AnimatePresence` for enter/exit animations
- `useReducedMotion` hook for accessibility
- Spring animations for natural motion
- Layout animations for smooth transitions

**Example:**

```tsx
import { motion } from 'framer-motion'

// Used internally in MessageList
;<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
  {message.content}
</motion.div>
```

---

### Lucide React (^0.500.0)

**Purpose:** Icon library with 1000+ SVG icons

**Why Required:** Used in 18+ components for UI icons

**Installation:**

```bash
npm install lucide-react
```

**Bundle Size:** ~5KB (tree-shakeable, only imports used icons)

**Components Using Icons:**

- Search components (Search, Filter, X icons)
- Chat input (Send, Paperclip, Mic icons)
- Navigation (Menu, ChevronDown, etc.)
- Message actions (Copy, Edit, Delete icons)

**Example:**

```tsx
import { Search, Send, Paperclip } from 'lucide-react'

// Used in ChatInput
;<button aria-label="Send message">
  <Send className="h-4 w-4" />
</button>
```

---

### Zod (^3.24.0)

**Purpose:** TypeScript-first schema validation

**Why Required:** Runtime validation for:

- API responses
- User input
- Configuration objects
- Type-safe forms

**Installation:**

```bash
npm install zod
```

**Bundle Size:** ~15KB (minified + gzipped)

**Use Cases:**

```tsx
import { z } from 'zod'

// Message validation
const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  createdAt: z.date(),
})

// Config validation
const ChatConfigSchema = z.object({
  api: z.string().url(),
  maxTokens: z.number().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
})
```

---

## Optional Peer Dependencies

Install these only if using specific features.

### React DOM (^18.0.0 || ^19.0.0)

**Status:** Optional (automatically available in most React apps)

**Purpose:** DOM rendering (usually already installed)

**When Needed:**

- Client-side rendering
- Server-side rendering with hydration
- Not needed for React Native

**Installation:**

```bash
npm install react-dom
```

---

### FlowToken (^1.0.0)

**Status:** Optional

**Purpose:** Advanced token counting and optimization

**When Needed:**

- Token budget monitoring
- Cost optimization
- Token usage analytics
- Multi-model token counting

**Components:**

- `TokenBudgetBar`
- `useTokenBudgetMonitor`
- `useTokenValidator`

**Installation:**

```bash
npm install flowtoken
```

**Example:**

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { useTokenBudgetMonitor } from '@clarity-chat/react/hooks'

function Chat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    maxTokens: 4000,
  })

  const { tokensUsed, percentage } = useTokenBudgetMonitor({
    messages,
    maxTokens: 4000,
    model: 'gpt-4',
  })

  return (
    <div>
      <TokenBudgetBar current={tokensUsed} max={4000} percentage={percentage} />
    </div>
  )
}
```

**Fallback:** If not installed, token counting uses simple character-based estimation (4 chars ≈ 1
token)

---

### Mermaid (^11.0.0)

**Status:** Optional

**Purpose:** Diagram rendering (flowcharts, sequence diagrams, etc.)

**When Needed:**

- Rendering AI-generated diagrams
- Technical documentation chat
- Architecture discussions

**Bundle Size:** ~200KB (loaded dynamically)

**Installation:**

```bash
npm install mermaid
```

**Example:**

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

// Automatically renders mermaid code blocks
;<EnhancedMarkdownRenderer>
  {`
  \`\`\`mermaid
  graph TD
    A[Start] --> B[Process]
    B --> C[End]
  \`\`\`
  `}
</EnhancedMarkdownRenderer>
```

**Fallback:** Code blocks show as plain text with syntax highlighting

---

### PDF.js (^3.0.0 || ^4.0.0)

**Status:** Optional

**Purpose:** PDF document parsing and text extraction

**When Needed:**

- RAG (Retrieval Augmented Generation) with PDFs
- Document Q&A
- PDF content analysis

**Components:**

- `PDFLoader`
- `useRAGPipeline` (with PDF support)
- `DocumentIntegration`

**Bundle Size:** ~400KB (loaded on-demand)

**Installation:**

```bash
npm install pdfjs-dist
```

**Example:**

```tsx
import { PDFLoader } from '@clarity-chat/react/document-loaders'

async function loadPDF() {
  const loader = new PDFLoader()
  const documents = await loader.load('/path/to/document.pdf')

  // documents = [
  //   { content: 'Page 1 text...', metadata: { page: 1 } },
  //   { content: 'Page 2 text...', metadata: { page: 2 } }
  // ]

  return documents
}
```

**Fallback:** PDF upload shows warning: "Install pdfjs-dist to enable PDF support"

---

### Mammoth (^1.0.0)

**Status:** Optional

**Purpose:** DOCX document parsing

**When Needed:**

- RAG with Word documents
- Document Q&A with .docx files
- Corporate document analysis

**Bundle Size:** ~100KB

**Installation:**

```bash
npm install mammoth
```

**Example:**

```tsx
import { DOCXLoader } from '@clarity-chat/react/document-loaders'

async function loadDOCX() {
  const loader = new DOCXLoader()
  const documents = await loader.load('/path/to/document.docx')

  return documents
}
```

**Fallback:** DOCX upload shows warning: "Install mammoth to enable DOCX support"

---

### Cohere AI (^7.0.0)

**Status:** Optional

**Purpose:** Reranking search results for better RAG accuracy

**When Needed:**

- Semantic search with reranking
- Improving RAG retrieval quality
- Multi-document relevance scoring

**Installation:**

```bash
npm install cohere-ai
```

**Example:**

```tsx
import { useRAGPipeline } from '@clarity-chat/react/hooks'

function RAGChat() {
  const { query } = useRAGPipeline({
    documents: myDocuments,
    reranker: {
      enabled: true,
      provider: 'cohere',
      apiKey: process.env.COHERE_API_KEY,
      topK: 5,
    },
  })

  const results = await query('What is the refund policy?')
}
```

**Fallback:** Reranking disabled, uses basic vector similarity only

---

### Shiki (^3.0.0)

**Status:** Optional

**Purpose:** Advanced syntax highlighting with VS Code themes

**When Needed:**

- Beautiful code highlighting
- Multiple language support
- Custom themes

**Bundle Size:** ~50KB + themes

**Installation:**

```bash
npm install shiki
```

**Example:**

```tsx
import { CodeBlock } from '@clarity-chat/react'

;<CodeBlock language="typescript" theme="github-dark" showLineNumbers>
  {`const greeting = 'Hello World'`}
</CodeBlock>
```

**Fallback:** Uses Prism.js if available, or plain text

---

### JSZip (^3.10.0)

**Status:** Optional

**Purpose:** ZIP file creation for batch exports

**When Needed:**

- Exporting multiple conversations
- Batch download features
- Archive creation

**Installation:**

```bash
npm install jszip
```

**Example:**

```tsx
import { BatchExportDialog } from '@clarity-chat/react'

;<BatchExportDialog conversations={conversations} format="zip" />
```

**Fallback:** Individual file downloads instead of ZIP

---

### Prism.js (^1.29.0)

**Status:** Optional

**Purpose:** Lightweight syntax highlighting

**When Needed:**

- Code highlighting (lighter alternative to Shiki)
- Basic syntax support

**Bundle Size:** ~10KB + languages

**Installation:**

```bash
npm install prismjs
```

**Fallback:** Plain text code blocks

---

### React Markdown (^10.0.0)

**Status:** Optional

**Purpose:** Markdown rendering

**When Needed:**

- Rendering AI responses with markdown
- Rich text formatting
- Lists, tables, links, etc.

**Installation:**

```bash
npm install react-markdown remark-gfm rehype-highlight
```

**Example:**

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

;<EnhancedMarkdownRenderer>
  {`
  # Heading

  - List item 1
  - List item 2

  \`\`\`js
  console.log('Hello')
  \`\`\`
  `}
</EnhancedMarkdownRenderer>
```

**Fallback:** Plain text with basic formatting

---

### Remark GFM (^4.0.0)

**Status:** Optional (requires react-markdown)

**Purpose:** GitHub Flavored Markdown support

**Features:**

- Tables
- Task lists
- Strikethrough
- Autolinks

**Installation:**

```bash
npm install remark-gfm
```

---

### Rehype Highlight (^7.0.0)

**Status:** Optional (requires react-markdown)

**Purpose:** Syntax highlighting in markdown code blocks

**Installation:**

```bash
npm install rehype-highlight
```

---

## Component Dependency Matrix

### Core Components (Required Peers Only)

| Component          | React | Framer Motion | Lucide | Zod | Notes                   |
| ------------------ | ----- | ------------- | ------ | --- | ----------------------- |
| `ClarityChat`      | ✅    | ✅            | ✅     | ✅  | Core chat component     |
| `ChatWindow`       | ✅    | ✅            | ✅     | ✅  | Full-featured chat UI   |
| `ChatInput`        | ✅    | ✅            | ✅     | ✅  | Message input           |
| `MessageList`      | ✅    | ✅            | ❌     | ✅  | Scrollable message list |
| `StreamingMessage` | ✅    | ✅            | ❌     | ❌  | Real-time streaming     |
| `TypingIndicator`  | ✅    | ✅            | ❌     | ❌  | Animated typing dots    |

### Advanced Components (Optional Peers)

| Component                  | Required Peers               | Optional Peers                               | Features                  |
| -------------------------- | ---------------------------- | -------------------------------------------- | ------------------------- |
| `EnhancedMarkdownRenderer` | React, Framer Motion         | react-markdown, remark-gfm, rehype-highlight | Rich markdown with GFM    |
| `CodeBlock`                | React                        | shiki, prismjs                               | Syntax highlighting       |
| `DocumentIntegration`      | React, Framer Motion, Lucide | pdfjs-dist, mammoth                          | File upload & parsing     |
| `TokenBudgetBar`           | React, Framer Motion         | flowtoken                                    | Token usage visualization |
| `SemanticMessageSearch`    | React, Framer Motion, Lucide | cohere-ai                                    | Search with reranking     |
| `BatchExportDialog`        | React, Framer Motion, Lucide | jszip                                        | Multi-conversation export |

### Hooks Dependency Matrix

| Hook                    | Required Peers | Optional Peers                 | Purpose             |
| ----------------------- | -------------- | ------------------------------ | ------------------- |
| `useClarityChat`        | React, Zod     | -                              | Core chat state     |
| `useTokenBudgetMonitor` | React          | flowtoken                      | Token tracking      |
| `useRAGPipeline`        | React, Zod     | pdfjs-dist, mammoth, cohere-ai | Document RAG        |
| `useSemanticCache`      | React          | -                              | Response caching    |
| `useAgent`              | React, Zod     | -                              | Agent orchestration |

---

## Fallback Behaviors

### 1. Missing Animation Library (Framer Motion)

**Impact:** Components will not render (framer-motion is required)

**Error:**

```
Error: Cannot find module 'framer-motion'
```

**Solution:** Install framer-motion

```bash
npm install framer-motion
```

---

### 2. Missing Icon Library (Lucide React)

**Impact:** Icons will not display (lucide-react is required)

**Error:**

```
Error: Cannot find module 'lucide-react'
```

**Solution:** Install lucide-react

```bash
npm install lucide-react
```

---

### 3. Missing Validation (Zod)

**Impact:** Runtime validation disabled, potential type safety issues

**Fallback:** Basic JavaScript validation

**Warning:**

```
Warning: Zod not found. Runtime validation disabled. Install zod for type safety.
```

---

### 4. Missing Markdown Renderer

**Impact:** Markdown renders as plain text

**Fallback Behavior:**

```tsx
// With react-markdown
<ReactMarkdown>{content}</ReactMarkdown>

// Without react-markdown (fallback)
<pre className="whitespace-pre-wrap">{content}</pre>
```

**Detection:**

```tsx
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

// Automatically detects and uses fallback
;<EnhancedMarkdownRenderer>{markdownContent}</EnhancedMarkdownRenderer>
```

---

### 5. Missing Syntax Highlighter

**Priority:** Shiki → Prism → Plain text

```tsx
// Code block rendering logic
if (shikiAvailable) {
  return <ShikiHighlighter code={code} lang={lang} />
} else if (prismAvailable) {
  return <PrismHighlighter code={code} lang={lang} />
} else {
  return (
    <pre>
      <code>{code}</code>
    </pre>
  )
}
```

---

### 6. Missing Document Loaders

**Behavior:** File upload shows format-specific warnings

```tsx
// PDF upload without pdfjs-dist
<FileUpload onUpload={handleUpload}>
  {!isPDFSupported && (
    <Alert>PDF support requires pdfjs-dist. Install it to enable PDF uploads.</Alert>
  )}
</FileUpload>
```

**Detection Code:**

```tsx
const isPDFSupported = (() => {
  try {
    require('pdfjs-dist')
    return true
  } catch {
    return false
  }
})()
```

---

### 7. Missing Token Counter (FlowToken)

**Fallback:** Character-based estimation

```tsx
// With flowtoken
import { countTokens } from 'flowtoken'
const tokens = countTokens(text, 'gpt-4')

// Without flowtoken (fallback)
const tokens = Math.ceil(text.length / 4)
```

**Accuracy:**

- FlowToken: ~99% accurate
- Fallback: ~75% accurate

---

### 8. Missing Reranker (Cohere)

**Behavior:** Semantic search works without reranking

```tsx
const results = await query('search query', {
  reranker: cohereAvailable
    ? {
        enabled: true,
        provider: 'cohere',
      }
    : {
        enabled: false, // Fallback to vector similarity only
      },
})
```

**Quality Impact:**

- With reranking: Top 3 results ~95% relevant
- Without reranking: Top 3 results ~80% relevant

---

## Installation Examples

### Minimal Installation (Core Features)

**Use Case:** Basic chat with streaming

```bash
npm install react react-dom framer-motion lucide-react zod
npm install @clarity-chat/react
```

**Bundle Size:** ~150KB

**Features:**

- Chat interface
- Message streaming
- Basic animations
- Input handling

**Example:**

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" placeholder="Ask me anything..." />
}
```

---

### Standard Installation (Markdown Support)

**Use Case:** Chat with rich text formatting

```bash
npm install react react-dom framer-motion lucide-react zod
npm install react-markdown remark-gfm rehype-highlight
npm install @clarity-chat/react
```

**Bundle Size:** ~220KB

**Features:**

- All core features
- Markdown rendering
- Code highlighting
- Tables, lists, links

**Example:**

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

function App() {
  return (
    <ChatWindow
      api="/api/chat"
      messageRenderer={(msg) => <EnhancedMarkdownRenderer>{msg.content}</EnhancedMarkdownRenderer>}
    />
  )
}
```

---

### Advanced Installation (RAG Support)

**Use Case:** Document Q&A with PDFs and DOCX

```bash
# Core dependencies
npm install react react-dom framer-motion lucide-react zod

# Markdown rendering
npm install react-markdown remark-gfm rehype-highlight

# Document loaders
npm install pdfjs-dist mammoth

# Optional: Reranking
npm install cohere-ai

npm install @clarity-chat/react
```

**Bundle Size:** ~450KB (base) + documents loaded on demand

**Features:**

- All standard features
- PDF parsing
- DOCX parsing
- Vector search
- Optional reranking

**Example:**

```tsx
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { PDFLoader, DOCXLoader } from '@clarity-chat/react/document-loaders'

function DocumentChat() {
  const pdfLoader = new PDFLoader()
  const docxLoader = new DOCXLoader()

  const { query, documents } = useRAGPipeline({
    loaders: [pdfLoader, docxLoader],
    reranker: {
      enabled: true,
      provider: 'cohere',
      apiKey: process.env.COHERE_API_KEY,
    },
  })

  const handleQuery = async (question: string) => {
    const results = await query(question)
    console.log('Relevant docs:', results)
  }

  return <ChatWindow onSubmit={handleQuery} />
}
```

---

### Full Installation (All Features)

**Use Case:** Enterprise app with all features

```bash
# Core dependencies
npm install react react-dom framer-motion lucide-react zod

# Markdown & syntax highlighting
npm install react-markdown remark-gfm rehype-highlight shiki prismjs

# Document processing
npm install pdfjs-dist mammoth jszip

# Advanced features
npm install flowtoken cohere-ai

npm install @clarity-chat/react
```

**Bundle Size:** ~800KB (with code splitting)

**Features:** Everything enabled

---

### Next.js Installation

```bash
npm install react react-dom framer-motion lucide-react zod
npm install @clarity-chat/react
```

**next.config.js:**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@clarity-chat/react'],
  webpack: (config, { isServer }) => {
    // Externalize optional dependencies
    if (isServer) {
      config.externals.push({
        'pdfjs-dist': 'commonjs pdfjs-dist',
        mammoth: 'commonjs mammoth',
        'cohere-ai': 'commonjs cohere-ai',
      })
    }
    return config
  },
}

module.exports = nextConfig
```

**Example:**

```tsx
// app/page.tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main>
      <ClarityChat api="/api/chat" />
    </main>
  )
}
```

---

### Vite Installation

```bash
npm install react react-dom framer-motion lucide-react zod
npm install @clarity-chat/react
```

**vite.config.ts:**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clarity-chat/react'],
  },
})
```

---

## Usage Examples by Feature

### 1. Basic Chat

**Peers Required:** react, framer-motion, lucide-react, zod

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      placeholder="Type a message..."
      initialMessages={[{ id: '1', role: 'assistant', content: 'Hello! How can I help?' }]}
    />
  )
}
```

---

### 2. Chat with Markdown

**Peers Required:** react, framer-motion, lucide-react, zod, react-markdown, remark-gfm

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

function App() {
  return (
    <ChatWindow
      api="/api/chat"
      messageRenderer={(message) => (
        <EnhancedMarkdownRenderer remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {message.content}
        </EnhancedMarkdownRenderer>
      )}
    />
  )
}
```

---

### 3. Chat with Code Highlighting

**Peers Required:** react, framer-motion, react-markdown, shiki or prismjs

```tsx
import { CodeBlock } from '@clarity-chat/react'

function MessageWithCode({ message }) {
  // Automatically uses shiki if available, falls back to prism
  return (
    <CodeBlock
      code={message.code}
      language="typescript"
      theme="github-dark"
      showLineNumbers
      highlightLines={[3, 4, 5]}
    />
  )
}
```

---

### 4. Document Q&A (RAG)

**Peers Required:** react, zod, pdfjs-dist, mammoth

**Peers Optional:** cohere-ai (for reranking)

```tsx
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { PDFLoader } from '@clarity-chat/react/document-loaders'
import { ChatWindow } from '@clarity-chat/react'

function DocumentChat() {
  const [documents, setDocuments] = useState([])

  const { query, addDocuments } = useRAGPipeline({
    reranker: {
      enabled: true, // Requires cohere-ai
      provider: 'cohere',
      apiKey: process.env.COHERE_API_KEY,
      topK: 5,
    },
  })

  const handleFileUpload = async (file: File) => {
    const loader = new PDFLoader()
    const docs = await loader.load(file)
    await addDocuments(docs)
  }

  const handleQuery = async (question: string) => {
    const results = await query(question)
    // results = relevant document chunks
    return results
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      <ChatWindow onSubmit={handleQuery} />
    </div>
  )
}
```

---

### 5. Token Budget Monitoring

**Peers Required:** react, framer-motion

**Peers Optional:** flowtoken (for accurate counting)

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { useTokenBudgetMonitor } from '@clarity-chat/react/hooks'
import { TokenBudgetBar } from '@clarity-chat/react'

function ChatWithTokens() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    maxTokens: 4000,
  })

  // Uses flowtoken if available, falls back to estimation
  const { tokensUsed, percentage, remaining } = useTokenBudgetMonitor({
    messages,
    maxTokens: 4000,
    model: 'gpt-4',
  })

  return (
    <div>
      <TokenBudgetBar
        current={tokensUsed}
        max={4000}
        percentage={percentage}
        showWarning={percentage > 80}
      />
      <p>Tokens remaining: {remaining}</p>
    </div>
  )
}
```

---

### 6. Batch Export

**Peers Required:** react, framer-motion, lucide-react

**Peers Optional:** jszip (for ZIP export)

```tsx
import { BatchExportDialog } from '@clarity-chat/react'

function ConversationManager() {
  const [conversations, setConversations] = useState([])

  return (
    <BatchExportDialog
      conversations={conversations}
      format="zip" // Requires jszip, falls back to individual downloads
      onExport={(exported) => {
        console.log('Exported:', exported)
      }}
    />
  )
}
```

---

### 7. Semantic Search

**Peers Required:** react, framer-motion, lucide-react

**Peers Optional:** cohere-ai (for reranking)

```tsx
import { SemanticMessageSearch } from '@clarity-chat/react'

function SearchableChat() {
  const [messages, setMessages] = useState([])

  return (
    <SemanticMessageSearch
      messages={messages}
      reranker={{
        enabled: true, // Requires cohere-ai
        provider: 'cohere',
        apiKey: process.env.COHERE_API_KEY,
      }}
      onResultClick={(message) => {
        console.log('Selected message:', message)
      }}
    />
  )
}
```

---

## Troubleshooting

### Issue: "Cannot find module 'framer-motion'"

**Cause:** framer-motion is a required peer dependency

**Solution:**

```bash
npm install framer-motion
```

---

### Issue: "Cannot find module 'lucide-react'"

**Cause:** lucide-react is a required peer dependency

**Solution:**

```bash
npm install lucide-react
```

---

### Issue: Markdown not rendering

**Cause:** react-markdown not installed

**Solution:**

```bash
npm install react-markdown remark-gfm rehype-highlight
```

**Or:** Use plain text fallback (already handled automatically)

---

### Issue: Code blocks show no syntax highlighting

**Cause:** Neither shiki nor prismjs installed

**Solution:** Install one of:

```bash
npm install shiki
# or
npm install prismjs
```

**Fallback:** Plain text code blocks (automatic)

---

### Issue: PDF upload fails

**Cause:** pdfjs-dist not installed

**Solution:**

```bash
npm install pdfjs-dist
```

**Error shown:**

```
PDF support requires pdfjs-dist. Install with: npm install pdfjs-dist
```

---

### Issue: Token counts inaccurate

**Cause:** flowtoken not installed, using character estimation

**Solution:**

```bash
npm install flowtoken
```

**Note:** Character estimation is ~75% accurate vs flowtoken's ~99%

---

### Issue: Reranking not working

**Cause:** cohere-ai not installed

**Solution:**

```bash
npm install cohere-ai
```

**Fallback:** Vector similarity only (still functional)

---

### Issue: "Module not found" in production build

**Cause:** Peer dependencies not listed in package.json

**Solution:** Add to your package.json:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.500.0",
    "zod": "^3.24.0"
  }
}
```

---

### Issue: Large bundle size

**Cause:** Installing all optional dependencies

**Solution:** Only install what you need:

- **Basic chat:** Core peers only (~150KB)
- **+ Markdown:** Add react-markdown (~220KB)
- **+ RAG:** Add pdfjs-dist, mammoth (~450KB)
- **Full featured:** All peers (~800KB)

**Optimization:**

```tsx
// Dynamic imports for heavy dependencies
const PDFLoader = lazy(() => import('@clarity-chat/react/document-loaders').then(m => ({ default: m.PDFLoader })))

<Suspense fallback={<Loading />}>
  <PDFLoader />
</Suspense>
```

---

### Issue: TypeScript errors with peer dependencies

**Cause:** Missing type definitions

**Solution:**

```bash
npm install --save-dev @types/react @types/react-dom
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

---

## Version Compatibility Matrix

| @clarity-chat/react | React      | Framer Motion | Next.js          | Vite     |
| ------------------- | ---------- | ------------- | ---------------- | -------- |
| 2.0.x               | 18.x, 19.x | 12.x          | 13.x, 14.x, 15.x | 5.x      |
| 1.x                 | 18.x       | 11.x          | 13.x, 14.x       | 4.x, 5.x |

---

## Best Practices

1. **Install required peers first**

   ```bash
   npm install react framer-motion lucide-react zod
   ```

2. **Add optional peers incrementally**
   - Start with core features
   - Add markdown when needed
   - Add RAG dependencies for document Q&A

3. **Use dynamic imports for heavy dependencies**

   ```tsx
   const PDFLoader = lazy(() => import('./PDFLoader'))
   ```

4. **Check peer availability before using features**

   ```tsx
   const isPDFSupported = (() => {
     try {
       require.resolve('pdfjs-dist')
       return true
     } catch {
       return false
     }
   })()
   ```

5. **Document peer requirements in your README**

   ```md
   ## Dependencies

   Required:

   - react ^18.0.0
   - framer-motion ^12.0.0

   Optional:

   - react-markdown ^10.0.0 (for markdown support)
   ```

---

## Related Documentation

- [Installation Guide](./installation.md)
- [Migration Guide](./migration-guide.md)
- [Bundle Optimization](./bundle-optimization.md)
- [Component API Reference](./components.md)
- [Hooks API Reference](./hooks.md)

---

**Last Updated:** January 26, 2026
