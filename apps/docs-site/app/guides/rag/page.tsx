import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'RAG Guide - Clarity Chat',
  description: 'Complete guide to Retrieval-Augmented Generation (RAG) for answering questions about your documents.',
}

export default function RAGGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>RAG: Retrieval-Augmented Generation</h1>
        <p className="docs-lead">
          Make AI answer questions using YOUR documents, not just its training data. Like giving the AI a textbook before the test.
        </p>
      </div>

      <section className="docs-section">
        <h2>The Problem RAG Solves</h2>
        <p>
          Normal AI (like ChatGPT) only knows what it was trained on. Ask it about your company's Q3 sales report? It can't help - it never saw that document.
        </p>

        <p className="mt-4">
          RAG solves this: Upload your documents → AI can answer questions about them. It's like ctrl+F but the AI understands context and can synthesize answers.
        </p>

        <div className="my-6 p-6 bg-muted/50 rounded-xl border-2">
          <div className="text-center space-y-2">
            <div className="text-4xl">📚 → 🔍 → 💡 → 💬</div>
            <div className="text-sm text-muted-foreground">
              Documents → Search → AI Reads → Answers
            </div>
          </div>
        </div>

        <Callout type="info" title="Real Example">
          User: "What were our Q3 sales?"<br/>
          Normal AI: "I don't know." ❌<br/>
          RAG AI: *searches your docs* "Q3 sales were $2.5M, up 15% from Q2." ✅
        </Callout>
      </section>

      <section className="docs-section">
        <h2>How RAG Works (Simple Version)</h2>
        
        <h3>Step 1: Index (One-time setup)</h3>
        <CodeBlock
          language="text"
          code={`1. Take your document (PDF, Word, etc.)
2. Split into small chunks (paragraphs)
3. Convert each chunk to numbers (embeddings)
4. Store in vector database (Pinecone, Weaviate, etc.)`}
        />

        <h3>Step 2: Query (Every question)</h3>
        <CodeBlock
          language="text"
          code={`1. User asks: "What's our return policy?"
2. Convert question to numbers (embedding)
3. Find similar chunks in your database (vector search)
4. Send those chunks to AI as context
5. AI reads the chunks and answers`}
        />

        <div className="mt-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
          <div className="font-semibold mb-2">🎯 Key Insight</div>
          <p className="text-sm">
            RAG doesn't retrain the AI. It gives the AI relevant documents to read
            RIGHT BEFORE answering. Like giving someone a cheat sheet during a test.
          </p>
        </div>
      </section>

      <section className="docs-section">
        <h2>Implementation Overview</h2>
        <CodeBlock
          language="typescript"
          code={`// 1. CREATE EMBEDDINGS (one-time)
import OpenAI from 'openai'
const openai = new OpenAI()

// Split document into chunks
const chunks = splitDocument(documentText, 1000)

// Create embeddings
const embeddings = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: chunks
})

// Store in vector DB
await pinecone.upsert({
  vectors: chunks.map((chunk, i) => ({
    id: \`doc-\${i}\`,
    values: embeddings.data[i].embedding,
    metadata: { text: chunk }
  }))
})

// 2. SEARCH & ANSWER (every question)
async function answerQuestion(question: string) {
  // Convert question to embedding
  const questionEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question
  })

  // Search for similar chunks
  const results = await pinecone.query({
    vector: questionEmbedding.data[0].embedding,
    topK: 3
  })

  // Build context from results
  const context = results.matches
    .map(m => m.metadata.text)
    .join('\\n\\n')

  // Ask AI with context
  const answer = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: \`Answer based on this context:\\n\\n\${context}\`
      },
      {
        role: 'user',
        content: question
      }
    ]
  })

  return answer.choices[0].message.content
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Chunking Strategies</h2>

        <h3>Fixed Size (Simple)</h3>
        <CodeBlock
          language="typescript"
          code={`// Split every 1000 characters
function chunkBySize(text: string, size: number): string[] {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

// Pros: Simple, fast
// Cons: Might split mid-sentence`}
        />

        <h3>Semantic (Better)</h3>
        <CodeBlock
          language="typescript"
          code={`// Split by paragraphs, sentences
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,  // Keep context between chunks
  separators: ['\\n\\n', '\\n', '. ', ' ']
})

const chunks = await splitter.splitText(text)

// Pros: Preserves meaning
// Cons: Slower`}
        />
      </section>

      <section className="docs-section">
        <h2>Choosing Vector Databases</h2>

        <div className="space-y-4">
          <div className="p-4 border-2 rounded-xl">
            <div className="font-semibold mb-2">Pinecone</div>
            <div className="text-sm space-y-1">
              <div>✅ Easiest to set up</div>
              <div>✅ Fully managed</div>
              <div>❌ Can be expensive at scale</div>
            </div>
          </div>

          <div className="p-4 border-2 rounded-xl">
            <div className="font-semibold mb-2">Weaviate</div>
            <div className="text-sm space-y-1">
              <div>✅ Open source</div>
              <div>✅ Self-hostable</div>
              <div>❌ More setup required</div>
            </div>
          </div>

          <div className="p-4 border-2 rounded-xl">
            <div className="font-semibold mb-2">Supabase Vector</div>
            <div className="text-sm space-y-1">
              <div>✅ Free tier</div>
              <div>✅ Built into Postgres</div>
              <div>❌ Slower than dedicated vector DBs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Improving RAG Quality</h2>

        <h3>1. Hybrid Search</h3>
        <p>Combine vector search with keyword matching:</p>
        <CodeBlock
          language="typescript"
          code={`// Vector search finds semantically similar
const vectorResults = await vectorSearch(question)

// Keyword search finds exact matches
const keywordResults = await keywordSearch(question)

// Combine both
const combined = mergeAndRerank(vectorResults, keywordResults)`}
        />

        <h3>2. Reranking</h3>
        <p>Re-order results by relevance:</p>
        <CodeBlock
          language="typescript"
          code={`import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY })

// After vector search
const reranked = await cohere.rerank({
  model: 'rerank-english-v3.0',
  query: question,
  documents: searchResults.map(r => r.text),
  topN: 3
})

// Use reranked results for AI context`}
        />

        <h3>3. Metadata Filtering</h3>
        <CodeBlock
          language="typescript"
          code={`// Only search specific documents
const results = await pinecone.query({
  vector: embedding,
  topK: 5,
  filter: {
    department: 'engineering',  // Only engineering docs
    year: { $gte: 2024 }        // Only recent docs
  }
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Common Pitfalls</h2>

        <Callout type="warning" title="Chunk Size Matters">
          Too small (100 chars): Loses context, poor results<br/>
          Too large (5000 chars): Wastes tokens, slow<br/>
          Sweet spot: 500-1500 characters
        </Callout>

        <Callout type="warning" title="Don't Forget Overlap">
          Use 10-20% overlap between chunks. Otherwise information at chunk
          boundaries gets lost.
        </Callout>

        <Callout type="warning" title="Embeddings Can Be Stale">
          If you update a document, re-embed it! Old embeddings point to old content.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Measuring RAG Quality</h2>
        <CodeBlock
          language="typescript"
          code={`import { ResponseQualityMeter } from '@clarity-chat/react'

// After RAG response, evaluate
const metrics = await evaluateRAGResponse(answer, question, sources)

<ResponseQualityMeter
  metrics={[
    { 
      label: 'Groundedness',
      score: 0.92,
      description: 'Answer based on sources, not hallucinated'
    },
    {
      label: 'Answer Relevancy',
      score: 0.88,
      description: 'Actually answers the question'
    },
    {
      label: 'Context Relevancy',
      score: 0.85,
      description: 'Retrieved chunks are relevant'
    }
  ]}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rag-document-chat" className="docs-card">
            <h3>RAG Recipe</h3>
            <p>Complete implementation</p>
          </a>
          <a href="/reference/components/citation-card" className="docs-card">
            <h3>Citation Card</h3>
            <p>Show sources</p>
          </a>
          <a href="/reference/components/context-card" className="docs-card">
            <h3>Context Card</h3>
            <p>Manage documents</p>
          </a>
        </div>
      </section>
    </div>
  )
}

