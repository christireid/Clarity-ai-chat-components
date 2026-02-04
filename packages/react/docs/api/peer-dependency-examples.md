# Peer Dependency Examples

> **@clarity-chat/react v2.0.0** **Complete code examples for every peer dependency combination**

## Table of Contents

1. [Minimal Setup Examples](#minimal-setup-examples)
2. [Markdown Combinations](#markdown-combinations)
3. [Document Loading Examples](#document-loading-examples)
4. [Advanced Feature Combinations](#advanced-feature-combinations)
5. [Framework-Specific Examples](#framework-specific-examples)
6. [Error Handling & Fallbacks](#error-handling--fallbacks)

---

## Minimal Setup Examples

### Example 1: Basic Chat (Required Peers Only)

**Peers:** react, framer-motion, lucide-react, zod

**Installation:**

```bash
npm install react framer-motion lucide-react zod @clarity-chat/react
```

**Code:**

```tsx
// app.tsx
import React from 'react'
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return (
    <div className="h-screen">
      <ClarityChat
        api="/api/chat"
        placeholder="Type a message..."
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'Hello! How can I help you today?',
          },
        ]}
      />
    </div>
  )
}
```

**API Route (Next.js):**

```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      },
    }),
    {
      headers: { 'Content-Type': 'text/plain' },
    }
  )
}
```

**Bundle Size:** ~125KB

---

### Example 2: Custom Styled Chat

**Peers:** react, framer-motion, lucide-react, zod

```tsx
import React from 'react'
import { ChatWindow, useClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function CustomChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    maxRetries: 3,
    retryDelay: 1000,
  })

  return (
    <ChatWindow
      messages={messages}
      onSubmit={(message) => append({ role: 'user', content: message })}
      isLoading={isLoading}
      placeholder="Ask me anything..."
      className="bg-gradient-to-b from-gray-50 to-gray-100"
      theme={{
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
      }}
    />
  )
}
```

---

## Markdown Combinations

### Example 3: Basic Markdown Support

**Peers:** react, framer-motion, lucide-react, zod, react-markdown, remark-gfm

**Installation:**

```bash
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm
npm install @clarity-chat/react
```

**Code:**

```tsx
import React from 'react'
import { ChatWindow, EnhancedMarkdownRenderer } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function MarkdownChat() {
  return (
    <ChatWindow
      api="/api/chat"
      messageRenderer={(message) => (
        <EnhancedMarkdownRenderer>{message.content}</EnhancedMarkdownRenderer>
      )}
    />
  )
}
```

**Example Output:**

Input:

```
# Hello World

This is **bold** and this is *italic*.

- Item 1
- Item 2
- Item 3
```

Renders as formatted HTML with proper styling.

**Bundle Size:** ~205KB

---

### Example 4: Markdown with Code Highlighting

**Peers:** react, framer-motion, react-markdown, remark-gfm, rehype-highlight

**Installation:**

```bash
npm install react-markdown remark-gfm rehype-highlight
```

**Code:**

```tsx
import React from 'react'
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function CodeChat() {
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

**Example Input:**

````markdown
Here's a TypeScript example:

```typescript
interface User {
  id: string
  name: string
  email: string
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`
}
```
````

**Renders with syntax highlighting.**

---

### Example 5: Markdown with Shiki (VS Code Quality)

**Peers:** react, framer-motion, react-markdown, shiki

**Installation:**

```bash
npm install shiki
```

**Code:**

```tsx
import React from 'react'
import { CodeBlock } from '@clarity-chat/react'

interface CodeMessageProps {
  language: string
  code: string
}

export function CodeMessage({ language, code }: CodeMessageProps) {
  return (
    <CodeBlock
      language={language}
      theme="github-dark"
      showLineNumbers
      highlightLines={[3, 4, 5]}
      wrapLines
    >
      {code}
    </CodeBlock>
  )
}
```

**Advanced Example with Custom Theme:**

```tsx
import React from 'react'
import { CodeBlock } from '@clarity-chat/react'

const customTheme = {
  name: 'custom-dark',
  type: 'dark',
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
  },
  tokenColors: [
    {
      scope: ['keyword'],
      settings: { foreground: '#569cd6' },
    },
    {
      scope: ['string'],
      settings: { foreground: '#ce9178' },
    },
  ],
}

export function CustomCodeBlock({ code }: { code: string }) {
  return (
    <CodeBlock language="typescript" theme={customTheme} showLineNumbers>
      {code}
    </CodeBlock>
  )
}
```

---

### Example 6: Markdown with Mermaid Diagrams

**Peers:** react, framer-motion, react-markdown, mermaid

**Installation:**

```bash
npm install mermaid
```

**Code:**

```tsx
import React from 'react'
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

export default function DiagramChat() {
  const content = `
# System Architecture

Here's our system architecture:

\`\`\`mermaid
graph TD
    A[Client] -->|HTTP| B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    C --> E[Database]
    D --> E
    E --> F[Cache]
\`\`\`

The architecture ensures high availability.
  `

  return (
    <EnhancedMarkdownRenderer
      enableMermaid
      mermaidConfig={{
        theme: 'dark',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#fff',
          primaryBorderColor: '#1e40af',
        },
      }}
    >
      {content}
    </EnhancedMarkdownRenderer>
  )
}
```

**Supported Diagram Types:**

- Flowcharts
- Sequence diagrams
- Class diagrams
- State diagrams
- ER diagrams
- Gantt charts
- Pie charts

---

## Document Loading Examples

### Example 7: PDF Document Q&A

**Peers:** react, zod, pdfjs-dist

**Installation:**

```bash
npm install pdfjs-dist
```

**Code:**

```tsx
import React, { useState } from 'react'
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { PDFLoader } from '@clarity-chat/react/document-loaders'
import { ChatWindow, FileUpload } from '@clarity-chat/react'

export default function PDFChat() {
  const [documents, setDocuments] = useState<Document[]>([])

  const { query, addDocuments, isLoading } = useRAGPipeline({
    embeddings: {
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    },
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    const loader = new PDFLoader()
    const docs = await loader.load(file)

    await addDocuments(docs)
    setDocuments((prev) => [...prev, ...docs])
  }

  const handleQuery = async (question: string) => {
    const results = await query(question, { topK: 3 })

    // Format results for chat
    const context = results.map((r) => r.content).join('\n\n')

    // Send to LLM with context
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
      }),
    })

    return response.json()
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <FileUpload accept=".pdf" onUpload={handleFileUpload} isLoading={isLoading}>
          Upload PDF Document
        </FileUpload>

        {documents.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">{documents.length} pages loaded</p>
        )}
      </div>

      <ChatWindow
        onSubmit={handleQuery}
        placeholder="Ask questions about your document..."
        disabled={documents.length === 0}
      />
    </div>
  )
}
```

**API Route:**

```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { question, context } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant. Answer questions based on the following context:\n\n${context}`,
      },
      {
        role: 'user',
        content: question,
      },
    ],
  })

  return Response.json({
    answer: response.choices[0].message.content,
  })
}
```

---

### Example 8: Multi-Format Document Loader

**Peers:** pdfjs-dist, mammoth

**Installation:**

```bash
npm install pdfjs-dist mammoth
```

**Code:**

```tsx
import React, { useState } from 'react'
import { PDFLoader, DOCXLoader } from '@clarity-chat/react/document-loaders'
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { FileUpload } from '@clarity-chat/react'

export default function MultiFormatChat() {
  const [supportedFormats] = useState(['.pdf', '.docx', '.txt', '.md'])

  const { addDocuments } = useRAGPipeline()

  const handleFileUpload = async (file: File) => {
    let docs

    switch (file.type) {
      case 'application/pdf':
        const pdfLoader = new PDFLoader()
        docs = await pdfLoader.load(file)
        break

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxLoader = new DOCXLoader()
        docs = await docxLoader.load(file)
        break

      case 'text/plain':
      case 'text/markdown':
        const text = await file.text()
        docs = [
          {
            content: text,
            metadata: { filename: file.name },
          },
        ]
        break

      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }

    await addDocuments(docs)
  }

  return (
    <FileUpload accept={supportedFormats.join(',')} onUpload={handleFileUpload} multiple>
      Upload Documents (PDF, DOCX, TXT, MD)
    </FileUpload>
  )
}
```

---

### Example 9: RAG with Reranking

**Peers:** pdfjs-dist, cohere-ai

**Installation:**

```bash
npm install pdfjs-dist cohere-ai
```

**Code:**

```tsx
import React from 'react'
import { useRAGPipeline } from '@clarity-chat/react/hooks'
import { PDFLoader } from '@clarity-chat/react/document-loaders'

export default function RerankingChat() {
  const { query, addDocuments } = useRAGPipeline({
    embeddings: {
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    },
    reranker: {
      enabled: true,
      provider: 'cohere',
      apiKey: process.env.COHERE_API_KEY,
      model: 'rerank-english-v3.0',
      topK: 5,
    },
    chunkSize: 500,
    chunkOverlap: 100,
  })

  const handleQuery = async (question: string) => {
    // First: Vector similarity search (fast, returns ~20 results)
    // Then: Reranking with Cohere (accurate, returns top 5)
    const results = await query(question, {
      topK: 5,
      includeScores: true,
    })

    console.log(
      'Reranked results:',
      results.map((r) => ({
        content: r.content.substring(0, 100),
        score: r.score,
      }))
    )

    return results
  }

  return <div>{/* Your chat UI */}</div>
}
```

**Performance Comparison:**

| Method          | Accuracy (Top 3) | Speed  | Cost       |
| --------------- | ---------------- | ------ | ---------- |
| Vector Only     | ~80%             | Fast   | Free       |
| Vector + Rerank | ~95%             | Medium | ~$0.001/1K |

---

## Advanced Feature Combinations

### Example 10: Token Budget Monitoring

**Peers:** react, framer-motion, flowtoken

**Installation:**

```bash
npm install flowtoken
```

**Code:**

```tsx
import React from 'react'
import { useClarityChat } from '@clarity-chat/react'
import { useTokenBudgetMonitor } from '@clarity-chat/react/hooks'
import { TokenBudgetBar } from '@clarity-chat/react'

export default function TokenAwareChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    maxTokens: 4000,
  })

  const { tokensUsed, percentage, remaining, warning } = useTokenBudgetMonitor({
    messages,
    maxTokens: 4000,
    model: 'gpt-4',
    warningThreshold: 0.8,
  })

  return (
    <div>
      <div className="p-4 border-b">
        <TokenBudgetBar
          current={tokensUsed}
          max={4000}
          percentage={percentage}
          showWarning={warning}
        />

        <div className="mt-2 text-sm">
          <span className={warning ? 'text-red-600' : 'text-gray-600'}>
            {tokensUsed} / 4000 tokens ({percentage.toFixed(1)}%)
          </span>
          <span className="ml-4 text-gray-500">{remaining} tokens remaining</span>
        </div>
      </div>

      {warning && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            ⚠️ Approaching token limit. Consider starting a new conversation.
          </p>
        </div>
      )}

      {/* Chat interface */}
    </div>
  )
}
```

**With Automatic Truncation:**

```tsx
import { useTokenBudgetMonitor } from '@clarity-chat/react/hooks'

export function AutoTruncatingChat() {
  const { messages, append, setMessages } = useClarityChat({
    api: '/api/chat',
  })

  const { tokensUsed, optimizeMessages } = useTokenBudgetMonitor({
    messages,
    maxTokens: 4000,
    model: 'gpt-4',
  })

  // Automatically truncate when approaching limit
  React.useEffect(() => {
    if (tokensUsed > 3500) {
      const optimized = optimizeMessages({
        strategy: 'sliding-window',
        keepLast: 10,
      })
      setMessages(optimized)
    }
  }, [tokensUsed])

  return <ChatWindow messages={messages} onSubmit={append} />
}
```

---

### Example 11: Semantic Search with Highlighting

**Peers:** react, framer-motion, lucide-react, cohere-ai (optional)

**Code:**

```tsx
import React, { useState } from 'react'
import { SemanticMessageSearch } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

export default function SearchableChat() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      {/* Chat */}
      <div className="flex-1">
        <ChatWindow messages={messages} highlightedMessageId={selectedMessage} />
      </div>

      {/* Search Sidebar */}
      <div className="w-96 border-l">
        <SemanticMessageSearch
          messages={messages}
          reranker={{
            enabled: true,
            provider: 'cohere',
            apiKey: process.env.COHERE_API_KEY,
          }}
          onResultClick={(message) => {
            setSelectedMessage(message.id)
            // Scroll to message
            document.getElementById(message.id)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }}
          highlightMatches
          showScores
        />
      </div>
    </div>
  )
}
```

---

### Example 12: Batch Export with ZIP

**Peers:** react, framer-motion, lucide-react, jszip

**Installation:**

```bash
npm install jszip
```

**Code:**

```tsx
import React, { useState } from 'react'
import { BatchExportDialog } from '@clarity-chat/react'
import { Button } from '@clarity-chat/react/ui'

export default function ConversationManager() {
  const [conversations] = useState([
    { id: '1', title: 'Project Planning', messages: [...] },
    { id: '2', title: 'Code Review', messages: [...] },
    { id: '3', title: 'Bug Investigation', messages: [...] }
  ])

  const [showExport, setShowExport] = useState(false)

  return (
    <div>
      <Button onClick={() => setShowExport(true)}>
        Export All Conversations
      </Button>

      {showExport && (
        <BatchExportDialog
          conversations={conversations}
          format="zip"
          formatOptions={{
            includeMetadata: true,
            formatMessages: 'markdown',
            filename: `conversations-${new Date().toISOString()}.zip`
          }}
          onExport={(blob) => {
            // Download the ZIP file
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `conversations-${Date.now()}.zip`
            a.click()
          }}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
```

---

## Framework-Specific Examples

### Example 13: Next.js App Router

**Full Stack Example with All Features**

**Installation:**

```bash
npx create-next-app@latest my-chat-app
cd my-chat-app
npm install react framer-motion lucide-react zod
npm install react-markdown remark-gfm shiki
npm install pdfjs-dist mammoth cohere-ai flowtoken
npm install @clarity-chat/react
```

**app/page.tsx:**

```tsx
'use client'

import { ClarityChat } from '@clarity-chat/react'
import { useTokenBudgetMonitor } from '@clarity-chat/react/hooks'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main className="h-screen">
      <ClarityChat api="/api/chat" enableMarkdown enableCodeHighlighting maxTokens={4000} />
    </main>
  )
}
```

**app/api/chat/route.ts:**

```typescript
import { OpenAI } from 'openai'
import { StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

**next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@clarity-chat/react'],
  webpack: (config, { isServer }) => {
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

---

### Example 14: Vite + React

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clarity-chat/react', 'framer-motion', 'lucide-react', 'react-markdown'],
    exclude: [
      'pdfjs-dist', // Load on demand
      'mammoth',
      'shiki',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'clarity-chat': ['@clarity-chat/react'],
          markdown: ['react-markdown', 'remark-gfm'],
          'document-loaders': ['pdfjs-dist', 'mammoth'],
        },
      },
    },
  },
})
```

**src/main.tsx:**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="h-screen">
      <ClarityChat api="/api/chat" />
    </div>
  </React.StrictMode>
)
```

---

### Example 15: Remix

**app/routes/\_index.tsx:**

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function Index() {
  return (
    <div className="h-screen">
      <ClarityChat api="/api/chat" />
    </div>
  )
}
```

**app/routes/api.chat.tsx:**

```typescript
import type { ActionFunction } from '@remix-run/node'
import { OpenAI } from 'openai'

const openai = new OpenAI()

export const action: ActionFunction = async ({ request }) => {
  const { messages } = await request.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      },
    }),
    {
      headers: { 'Content-Type': 'text/plain' },
    }
  )
}
```

---

## Error Handling & Fallbacks

### Example 16: Graceful Degradation

**Code:**

```tsx
import React from 'react'
import { PeerDependencyChecker } from '@clarity-chat/react/types/peer-dependencies'
import { ChatWindow } from '@clarity-chat/react'

export default function AdaptiveChat() {
  const features = PeerDependencyChecker.checkAll().features

  return (
    <div>
      {!features.hasMarkdown && (
        <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            💡 Install react-markdown for rich text formatting:
            <code className="ml-2 px-2 py-1 bg-blue-100 rounded">
              npm install react-markdown remark-gfm
            </code>
          </p>
        </div>
      )}

      {!features.hasSyntaxHighlighting && (
        <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            💡 Install shiki for code highlighting:
            <code className="ml-2 px-2 py-1 bg-blue-100 rounded">npm install shiki</code>
          </p>
        </div>
      )}

      <ChatWindow
        api="/api/chat"
        enableMarkdown={features.hasMarkdown}
        enableCodeHighlighting={features.hasSyntaxHighlighting}
      />
    </div>
  )
}
```

---

### Example 17: Feature Detection & Warnings

**Code:**

```tsx
import React, { useEffect } from 'react'
import {
  validatePeerDependencies,
  getMissingPeersForFeature,
  getInstallCommand,
} from '@clarity-chat/react/types/peer-dependencies'

export function FeatureCheck() {
  useEffect(() => {
    // Check component requirements
    const chatResult = validatePeerDependencies('ChatWindow', true)
    if (!chatResult.valid) {
      console.error(chatResult.message)
    }

    // Check feature requirements
    const markdownMissing = getMissingPeersForFeature('markdown')
    if (markdownMissing.length > 0) {
      const cmd = getInstallCommand('npm', markdownMissing)
      console.warn(`Markdown features disabled. ${cmd}`)
    }

    const ragMissing = getMissingPeersForFeature('pdfLoading')
    if (ragMissing.length > 0) {
      const cmd = getInstallCommand('npm', ragMissing)
      console.warn(`PDF loading disabled. ${cmd}`)
    }
  }, [])

  return null
}
```

---

### Example 18: Dynamic Feature Loading

**Code:**

```tsx
import React, { lazy, Suspense } from 'react'
import { PeerDependencyChecker } from '@clarity-chat/react/types/peer-dependencies'

// Lazy load heavy components
const EnhancedMarkdownRenderer = lazy(() =>
  import('@clarity-chat/react').then((m) => ({
    default: m.EnhancedMarkdownRenderer,
  }))
)

const PDFLoader = lazy(() =>
  import('@clarity-chat/react/document-loaders').then((m) => ({
    default: m.PDFLoader,
  }))
)

export function AdaptiveRenderer({ content, type }: Props) {
  const features = PeerDependencyChecker.checkAll().features

  // Markdown
  if (type === 'markdown') {
    if (features.hasMarkdown) {
      return (
        <Suspense fallback={<div>Loading renderer...</div>}>
          <EnhancedMarkdownRenderer>{content}</EnhancedMarkdownRenderer>
        </Suspense>
      )
    }
    return <pre className="whitespace-pre-wrap">{content}</pre>
  }

  // PDF
  if (type === 'pdf') {
    if (features.hasPDFSupport) {
      return (
        <Suspense fallback={<div>Loading PDF...</div>}>
          <PDFLoader file={content} />
        </Suspense>
      )
    }
    return (
      <div className="p-4 bg-yellow-50">
        <p>PDF support requires pdfjs-dist</p>
        <code>npm install pdfjs-dist</code>
      </div>
    )
  }

  return <div>{content}</div>
}
```

---

### Example 19: Progressive Enhancement

**Code:**

```tsx
import React from 'react'
import { ChatWindow } from '@clarity-chat/react'
import { PeerDependencyChecker } from '@clarity-chat/react/types/peer-dependencies'

export default function ProgressiveChat() {
  const check = PeerDependencyChecker.checkAll()

  // Build configuration based on available features
  const config = {
    api: '/api/chat',
    enableMarkdown: check.features.hasMarkdown,
    enableCodeHighlighting: check.features.hasSyntaxHighlighting,
    enableDiagrams: check.features.hasDiagramSupport,
    tokenCounting: check.features.hasAccurateTokenCounting ? 'accurate' : 'estimated',
  }

  return (
    <div>
      {/* Show available features */}
      <div className="p-4 bg-gray-50">
        <h3 className="font-bold mb-2">Available Features:</h3>
        <ul className="space-y-1 text-sm">
          <li>{check.features.hasMarkdown ? '✅' : '❌'} Rich text formatting</li>
          <li>{check.features.hasSyntaxHighlighting ? '✅' : '❌'} Code highlighting</li>
          <li>{check.features.hasDiagramSupport ? '✅' : '❌'} Diagram rendering</li>
          <li>
            {check.features.hasAccurateTokenCounting ? '✅' : '⚠️'} Token counting
            {!check.features.hasAccurateTokenCounting && ' (estimated)'}
          </li>
        </ul>
      </div>

      <ChatWindow {...config} />
    </div>
  )
}
```

---

## Related Documentation

- [Peer Dependencies API](./peer-dependencies.md)
- [Peer Dependency Matrix](./peer-dependency-matrix.md)
- [Installation Guide](./installation.md)
- [Bundle Optimization](./bundle-optimization.md)

---

**Last Updated:** January 26, 2026
