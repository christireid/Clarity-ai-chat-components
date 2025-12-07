import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Tutorial: Adding RAG to Your Chatbot',
    description: 'Add retrieval-augmented generation to chat over your documents.',
};
export default function AddingRAGTutorial() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Tutorial" }), _jsx("h1", { children: "Adding RAG to Your Chatbot" }), _jsx("p", { className: "docs-lead", children: "Enable your chatbot to answer questions based on your documents using retrieval-augmented generation." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What is RAG?" }), _jsx("p", { children: "Retrieval-Augmented Generation (RAG) enhances AI responses by retrieving relevant information from a knowledge base before generating answers. This allows your chatbot to:" }), _jsxs("ul", { children: [_jsx("li", { children: "Answer questions about your specific documents" }), _jsx("li", { children: "Provide accurate, source-backed responses" }), _jsx("li", { children: "Stay up-to-date without retraining" }), _jsx("li", { children: "Cite sources for transparency" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Architecture Overview" }), _jsx("pre", { children: _jsx("code", { children: `┌─────────────────────────────────────────────┐
│                                             │
│  User Query                                 │
│       ↓                                     │
│  Embed Query (OpenAI Embeddings)            │
│       ↓                                     │
│  Vector Search (Pinecone/Weaviate)          │
│       ↓                                     │
│  Retrieve Top K Documents                   │
│       ↓                                     │
│  Rerank Results (optional)                  │
│       ↓                                     │
│  Build Prompt with Context                  │
│       ↓                                     │
│  Generate Response (GPT-4)                  │
│                                             │
└─────────────────────────────────────────────┘` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Install Dependencies" }), _jsx("pre", { children: _jsx("code", { children: `npm install @pinecone-database/pinecone
npm install langchain
npm install pdf-parse  # for PDF processing` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Setup Vector Store" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "lib/vector-store.ts" }), ":"] }), _jsx("pre", { children: _jsx("code", { children: `import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})

const index = pinecone.index('clarity-chat-docs')

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY
})

export async function storeDocument(
  text: string,
  metadata: { title: string; url?: string }
) {
  // Split into chunks
  const chunks = splitIntoChunks(text, {
    size: 500,
    overlap: 50
  })
  
  // Generate embeddings
  const vectors = await Promise.all(
    chunks.map(async (chunk, i) => ({
      id: \`\${metadata.title}-\${i}\`,
      values: await embeddings.embedQuery(chunk),
      metadata: {
        ...metadata,
        text: chunk,
        chunkIndex: i
      }
    }))
  )
  
  // Upsert to Pinecone
  await index.upsert(vectors)
}

export async function retrieveDocuments(
  query: string,
  k: number = 5
) {
  const queryEmbedding = await embeddings.embedQuery(query)
  
  const results = await index.query({
    vector: queryEmbedding,
    topK: k,
    includeMetadata: true
  })
  
  return results.matches.map(match => ({
    text: match.metadata?.text as string,
    score: match.score,
    metadata: match.metadata
  }))
}

function splitIntoChunks(
  text: string,
  { size, overlap }: { size: number; overlap: number }
) {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    const end = start + size
    chunks.push(text.slice(start, end))
    start = end - overlap
  }
  
  return chunks
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Document Upload API" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "app/api/upload/route.ts" }), ":"] }), _jsx("pre", { children: _jsx("code", { children: `import { NextRequest, NextResponse } from 'next/server'
import { storeDocument } from '@/lib/vector-store'
import pdf from 'pdf-parse'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    )
  }
  
  // Extract text based on file type
  let text: string
  
  if (file.type === 'application/pdf') {
    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await pdf(buffer)
    text = data.text
  } else if (file.type === 'text/plain') {
    text = await file.text()
  } else {
    return NextResponse.json(
      { error: 'Unsupported file type' },
      { status: 400 }
    )
  }
  
  // Store in vector database
  await storeDocument(text, {
    title: file.name,
    uploadedAt: new Date().toISOString()
  })
  
  return NextResponse.json({
    success: true,
    filename: file.name,
    chunks: Math.ceil(text.length / 500)
  })
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 4: Update Chat API with RAG" }), _jsxs("p", { children: ["Update ", _jsx("code", { children: "app/api/chat/route.ts" }), ":"] }), _jsx("pre", { children: _jsx("code", { children: `import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { retrieveDocuments } from '@/lib/vector-store'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  // Retrieve relevant documents
  const docs = await retrieveDocuments(lastMessage.content, 5)
  
  // Build context from retrieved documents
  const context = docs
    .map((doc, i) => \`[Source \${i + 1}]: \${doc.text}\`)
    .join('\\n\\n')
  
  // Create augmented prompt
  const systemMessage = {
    role: 'system',
    content: \`You are a helpful AI assistant. Answer questions based on the provided context. 
    
Context:
\${context}

Instructions:
- Answer questions using the context above
- If you use information from a source, cite it as [Source N]
- If the context doesn't contain relevant information, say so
- Be concise and accurate\`
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      systemMessage,
      ...messages
    ]
  })
  
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 5: Add Document Upload UI" }), _jsx(CodePlayground, { initialCode: `'use client'
import { useChat } from 'ai/react'
import { useState } from 'react'

export default function RAGChat() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  })

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const data = await response.json()
      setUploadedFiles([...uploadedFiles, data.filename])
    }
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="mb-4">
        <FileUpload
          onUpload={handleFileUpload}
          acceptedTypes={['.pdf', '.txt', '.md']}
          maxSize={10 * 1024 * 1024}
        />
        {uploadedFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Uploaded: {uploadedFiles.join(', ')}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Ask questions about your documents..."
        />
      </div>
    </div>
  )
}

render(<RAGChat />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 6: Add Citation Display" }), _jsx("pre", { children: _jsx("code", { children: `import { Message, CitationCard } from '@clarity-chat/react'

function MessageWithCitations({ message }) {
  // Extract citations from message
  const citations = extractCitations(message.content)
  
  return (
    <div>
      <Message content={message.content} />
      {citations.length > 0 && (
        <div className="mt-2 space-y-2">
          {citations.map((citation, i) => (
            <CitationCard
              key={i}
              source={citation.source}
              text={citation.text}
              url={citation.url}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function extractCitations(text: string) {
  const regex = /\\[Source (\\d+)\\]/g
  const matches = [...text.matchAll(regex)]
  return matches.map(match => ({
    source: \`Source \${match[1]}\`,
    text: '...',  // Retrieve from metadata
    url: '#'
  }))
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced: Hybrid Search" }), _jsx("p", { children: "Combine vector search with keyword search for better retrieval:" }), _jsx("pre", { children: _jsx("code", { children: `import { HybridSearch } from '@clarity-chat/react/utils'

const hybridSearch = new HybridSearch({
  vectorStore: pineconeIndex,
  fullTextSearch: elasticsearchClient,
  alpha: 0.7  // Weight between vector (0.7) and keyword (0.3)
})

export async function retrieveDocuments(query: string) {
  const results = await hybridSearch.search({
    query,
    k: 10,  // Retrieve more initially
    filters: {
      // Optional metadata filters
      language: 'en',
      updatedAfter: '2024-01-01'
    }
  })
  
  // Rerank results
  const reranked = await rerank(query, results, {
    model: 'cohere-rerank-v3',
    topK: 5  // Final number of documents
  })
  
  return reranked
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs(Callout, { type: "tip", title: "Optimization Tips", children: ["\u2022 Chunk size: 300-1000 tokens works well for most use cases", _jsx("br", {}), "\u2022 Overlap: 10-20% of chunk size prevents losing context", _jsx("br", {}), "\u2022 Top-k: Start with 3-5 documents, adjust based on results", _jsx("br", {}), "\u2022 Reranking: Improves relevance, add if quality isn't sufficient"] }), _jsxs("ul", { children: [_jsx("li", { children: "Use semantic chunking instead of fixed-size for better context preservation" }), _jsx("li", { children: "Store metadata (title, date, author) for better filtering" }), _jsx("li", { children: "Implement hybrid search for technical documents" }), _jsx("li", { children: "Cache embeddings to reduce API costs" }), _jsx("li", { children: "Monitor retrieval quality and iterate" }), _jsx("li", { children: "Implement feedback loops to improve over time" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rag-document-chat", className: "docs-card", children: [_jsx("h3", { children: "RAG Cookbook" }), _jsx("p", { children: "Advanced RAG patterns" })] }), _jsxs("a", { href: "/guides/token-optimization", className: "docs-card", children: [_jsx("h3", { children: "Token Optimization" }), _jsx("p", { children: "Reduce RAG costs" })] }), _jsxs("a", { href: "/examples/rag-workbench-demo", className: "docs-card", children: [_jsx("h3", { children: "RAG Workbench Demo" }), _jsx("p", { children: "Full RAG application" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map