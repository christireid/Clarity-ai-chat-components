import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'RAG Document Chat - Cookbook - Clarity Chat',
    description: 'Build a chat app that can answer questions about your documents using RAG and vector search.',
};
export default function RAGDocumentChatPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "RAG Document Chat" }), _jsx("p", { className: "docs-lead", children: "Let users chat with their documents. Upload a PDF, ask questions about it, get answers with citations. Like having a research assistant who read all your docs." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You'll Build" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Upload PDF/TXT files" }), _jsx("li", { children: "\u2705 Chunk and embed documents" }), _jsx("li", { children: "\u2705 Vector similarity search" }), _jsx("li", { children: "\u2705 AI answers with citations" }), _jsx("li", { children: "\u2705 Show which documents were used" })] }), _jsx(Callout, { type: "info", title: "What's RAG?", children: "RAG = Retrieval-Augmented Generation. Instead of the AI just guessing, it SEARCHES your documents first, then answers based on what it found. Much more accurate than pure AI." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Architecture Overview" }), _jsx(CodeBlock, { language: "text", code: `User uploads PDF → Split into chunks → Create embeddings → Store in Pinecone

User asks question → Search similar chunks → Send to OpenAI → Get answer with sources` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Prerequisites" }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react openai @pinecone-database/pinecone pdf-parse

# Get API keys:
# - OpenAI: https://platform.openai.com/api-keys
# - Pinecone: https://www.pinecone.io/

# Add to .env.local:
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=docs-index` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Upload & Process Documents" }), _jsx(CodeBlock, { language: "typescript", code: `// app/api/upload/route.ts
import { NextRequest } from 'next/server'
import pdf from 'pdf-parse'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'

const openai = new OpenAI()
const pinecone = new Pinecone()
const index = pinecone.index(process.env.PINECONE_INDEX!)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  // 1. Extract text from PDF
  const buffer = Buffer.from(await file.arrayBuffer())
  const data = await pdf(buffer)
  const text = data.text

  // 2. Split into chunks (simple approach)
  const chunkSize = 1000
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }

  // 3. Create embeddings for each chunk
  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunks
  })

  // 4. Store in Pinecone
  const vectors = chunks.map((chunk, i) => ({
    id: \`\${file.name}-chunk-\${i}\`,
    values: embeddings.data[i].embedding,
    metadata: {
      text: chunk,
      fileName: file.name,
      chunkIndex: i
    }
  }))

  await index.upsert(vectors)

  return Response.json({
    success: true,
    chunks: chunks.length,
    fileName: file.name
  })
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Search & Answer API" }), _jsx(CodeBlock, { language: "typescript", code: `// app/api/chat/route.ts
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI()
const pinecone = new Pinecone()
const index = pinecone.index(process.env.PINECONE_INDEX!)

export async function POST(req: Request) {
  const { messages } = await req.json()
  const userQuestion = messages[messages.length - 1].content

  // 1. Convert question to embedding
  const questionEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuestion
  })

  // 2. Search for similar chunks
  const searchResults = await index.query({
    vector: questionEmbedding.data[0].embedding,
    topK: 3,
    includeMetadata: true
  })

  // 3. Build context from top results
  const context = searchResults.matches
    .map(match => match.metadata?.text)
    .join('\\n\\n')

  // 4. Generate answer with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: \`Answer based on this context. Cite sources.

Context:
\${context}\`
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Build the UI" }), _jsx(CodeBlock, { language: "typescript", code: `'use client'

import { ChatWindow, FileUpload, ContextCard } from '@clarity-chat/react'
import { useState } from 'react'

export default function RAGChatPage() {
  const [messages, setMessages] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Handle document upload
  const handleUpload = async (files: File[]) => {
    const formData = new FormData()
    formData.append('file', files[0])

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    setDocuments(prev => [...prev, {
      id: result.fileName,
      type: 'document',
      name: result.fileName,
      isActive: true,
      metadata: {
        chunks: result.chunks
      }
    }])
  }

  // Handle chat
  const handleSendMessage = async (content: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMsg])

    setIsLoading(true)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg] })
    })

    // Stream response (see OpenAI streaming recipe for details)
    // ...
  }

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      {/* Sidebar: Document Management */}
      <div className="border-r p-4 space-y-4">
        <h2 className="font-semibold">Your Documents</h2>
        
        <FileUpload
          onUpload={handleUpload}
          acceptedFileTypes={['application/pdf', '.txt']}
          maxFileSize={10 * 1024 * 1024}
        />

        <div className="space-y-2">
          {documents.map(doc => (
            <ContextCard
              key={doc.id}
              context={doc}
              onToggle={(id) => {
                setDocuments(prev => prev.map(d =>
                  d.id === id ? { ...d, isActive: !d.isActive } : d
                ))
              }}
            />
          ))}
        </div>
      </div>

      {/* Main: Chat */}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask a question about your documents..."
      />
    </div>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Adding Citations" }), _jsx("p", { children: "Show users which documents were used:" }), _jsx(CodeBlock, { language: "typescript", code: `// Modify your API route to return citations
const citations = searchResults.matches.map(match => ({
  source: match.metadata?.fileName,
  chunkText: match.metadata?.text,
  confidence: match.score
}))

// Include in streamed response metadata
// Then in your UI:
import { CitationCard } from '@clarity-chat/react'

<div className="mt-2 space-y-2">
  <p className="text-sm font-medium">Sources:</p>
  {message.citations?.map(citation => (
    <CitationCard key={citation.id} citation={citation} />
  ))}
</div>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Improvements" }), _jsx("h3", { children: "Better Chunking" }), _jsx(CodeBlock, { language: "typescript", code: `// Use semantic chunking instead of fixed size
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200, // Overlap for context
  separators: ['\\n\\n', '\\n', '. ', ' ']
})

const chunks = await splitter.splitText(text)` }), _jsx("h3", { children: "Reranking for Better Results" }), _jsx(CodeBlock, { language: "typescript", code: `// After vector search, rerank with Cohere
import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY })

const reranked = await cohere.rerank({
  model: 'rerank-english-v2.0',
  query: userQuestion,
  documents: searchResults.matches.map(m => m.metadata.text),
  topN: 3
})` }), _jsx("h3", { children: "Hybrid Search (Vector + Keyword)" }), _jsx(CodeBlock, { language: "typescript", code: `// Combine vector search with keyword matching
const vectorResults = await index.query({ ... })
const keywordResults = await searchKeywords(userQuestion)

// Merge and deduplicate
const combined = mergeResults(vectorResults, keywordResults)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Production Checklist" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Handle large PDFs (chunk processing in background)" }), _jsx("li", { children: "\u2705 Show upload progress" }), _jsx("li", { children: "\u2705 Validate file types and sizes" }), _jsx("li", { children: "\u2705 Store metadata (author, date, etc.)" }), _jsx("li", { children: "\u2705 Add document search/filter" }), _jsx("li", { children: "\u2705 Implement document deletion" }), _jsx("li", { children: "\u2705 Cache embeddings (don't re-embed same doc)" }), _jsx("li", { children: "\u2705 Rate limit vector searches" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/openai-streaming-chat", className: "docs-card", children: [_jsx("h3", { children: "OpenAI Streaming" }), _jsx("p", { children: "Foundation for streaming responses" })] }), _jsxs("a", { href: "/cookbook/multi-modal-chat", className: "docs-card", children: [_jsx("h3", { children: "Multi-Modal Chat" }), _jsx("p", { children: "Add images and videos" })] }), _jsxs("a", { href: "/cookbook/agent-with-tools", className: "docs-card", children: [_jsx("h3", { children: "Agent with Tools" }), _jsx("p", { children: "Combine with function calling" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map