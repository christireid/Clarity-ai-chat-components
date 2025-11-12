import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { RAGPipelineDiagram } from '@/components/Diagrams/RAGPipelineDiagram';
export const metadata = {
    title: 'RAG Guide - Clarity Chat',
    description: 'Complete guide to Retrieval-Augmented Generation (RAG) for answering questions about your documents.',
};
export default function RAGGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "RAG: Retrieval-Augmented Generation" }), _jsx("p", { className: "docs-lead", children: "Make AI answer questions using YOUR documents, not just its training data. Like giving the AI a textbook before the test." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "The Problem RAG Solves" }), _jsx("p", { children: "Normal AI (like ChatGPT) only knows what it was trained on. Ask it about your company's Q3 sales report? It can't help - it never saw that document." }), _jsx("p", { className: "mt-4", children: "RAG solves this: Upload your documents \u2192 AI can answer questions about them. It's like ctrl+F but the AI understands context and can synthesize answers." }), _jsx(RAGPipelineDiagram, {}), _jsxs(Callout, { type: "info", title: "Real Example", children: ["User: \"What were our Q3 sales?\"", _jsx("br", {}), "Normal AI: \"I don't know.\" \u274C", _jsx("br", {}), "RAG AI: *searches your docs* \"Q3 sales were $2.5M, up 15% from Q2.\" \u2705"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "How RAG Works (Simple Version)" }), _jsx("h3", { children: "Step 1: Index (One-time setup)" }), _jsx(CodeBlock, { language: "text", code: `1. Take your document (PDF, Word, etc.)
2. Split into small chunks (paragraphs)
3. Convert each chunk to numbers (embeddings)
4. Store in vector database (Pinecone, Weaviate, etc.)` }), _jsx("h3", { children: "Step 2: Query (Every question)" }), _jsx(CodeBlock, { language: "text", code: `1. User asks: "What's our return policy?"
2. Convert question to numbers (embedding)
3. Find similar chunks in your database (vector search)
4. Send those chunks to AI as context
5. AI reads the chunks and answers` }), _jsxs("div", { className: "mt-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-2", children: "\uD83C\uDFAF Key Insight" }), _jsx("p", { className: "text-sm", children: "RAG doesn't retrain the AI. It gives the AI relevant documents to read RIGHT BEFORE answering. Like giving someone a cheat sheet during a test." })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Implementation Overview" }), _jsx(CodeBlock, { language: "typescript", code: `// 1. CREATE EMBEDDINGS (one-time)
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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Chunking Strategies" }), _jsx("h3", { children: "Fixed Size (Simple)" }), _jsx(CodeBlock, { language: "typescript", code: `// Split every 1000 characters
function chunkBySize(text: string, size: number): string[] {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

// Pros: Simple, fast
// Cons: Might split mid-sentence` }), _jsx("h3", { children: "Semantic (Better)" }), _jsx(CodeBlock, { language: "typescript", code: `// Split by paragraphs, sentences
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,  // Keep context between chunks
  separators: ['\\n\\n', '\\n', '. ', ' ']
})

const chunks = await splitter.splitText(text)

// Pros: Preserves meaning
// Cons: Slower` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Choosing Vector Databases" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 border-2 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-2", children: "Pinecone" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsx("div", { children: "\u2705 Easiest to set up" }), _jsx("div", { children: "\u2705 Fully managed" }), _jsx("div", { children: "\u274C Can be expensive at scale" })] })] }), _jsxs("div", { className: "p-4 border-2 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-2", children: "Weaviate" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsx("div", { children: "\u2705 Open source" }), _jsx("div", { children: "\u2705 Self-hostable" }), _jsx("div", { children: "\u274C More setup required" })] })] }), _jsxs("div", { className: "p-4 border-2 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-2", children: "Supabase Vector" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsx("div", { children: "\u2705 Free tier" }), _jsx("div", { children: "\u2705 Built into Postgres" }), _jsx("div", { children: "\u274C Slower than dedicated vector DBs" })] })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Improving RAG Quality" }), _jsx("h3", { children: "1. Hybrid Search" }), _jsx("p", { children: "Combine vector search with keyword matching:" }), _jsx(CodeBlock, { language: "typescript", code: `// Vector search finds semantically similar
const vectorResults = await vectorSearch(question)

// Keyword search finds exact matches
const keywordResults = await keywordSearch(question)

// Combine both
const combined = mergeAndRerank(vectorResults, keywordResults)` }), _jsx("h3", { children: "2. Reranking" }), _jsx("p", { children: "Re-order results by relevance:" }), _jsx(CodeBlock, { language: "typescript", code: `import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY })

// After vector search
const reranked = await cohere.rerank({
  model: 'rerank-english-v3.0',
  query: question,
  documents: searchResults.map(r => r.text),
  topN: 3
})

// Use reranked results for AI context` }), _jsx("h3", { children: "3. Metadata Filtering" }), _jsx(CodeBlock, { language: "typescript", code: `// Only search specific documents
const results = await pinecone.query({
  vector: embedding,
  topK: 5,
  filter: {
    department: 'engineering',  // Only engineering docs
    year: { $gte: 2024 }        // Only recent docs
  }
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Common Pitfalls" }), _jsxs(Callout, { type: "warning", title: "Chunk Size Matters", children: ["Too small (100 chars): Loses context, poor results", _jsx("br", {}), "Too large (5000 chars): Wastes tokens, slow", _jsx("br", {}), "Sweet spot: 500-1500 characters"] }), _jsx(Callout, { type: "warning", title: "Don't Forget Overlap", children: "Use 10-20% overlap between chunks. Otherwise information at chunk boundaries gets lost." }), _jsx(Callout, { type: "warning", title: "Embeddings Can Be Stale", children: "If you update a document, re-embed it! Old embeddings point to old content." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Measuring RAG Quality" }), _jsx(CodeBlock, { language: "typescript", code: `import { ResponseQualityMeter } from '@clarity-chat/react'

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
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rag-document-chat", className: "docs-card", children: [_jsx("h3", { children: "RAG Recipe" }), _jsx("p", { children: "Complete implementation" })] }), _jsxs("a", { href: "/reference/components/citation-card", className: "docs-card", children: [_jsx("h3", { children: "Citation Card" }), _jsx("p", { children: "Show sources" })] }), _jsxs("a", { href: "/reference/components/context-card", className: "docs-card", children: [_jsx("h3", { children: "Context Card" }), _jsx("p", { children: "Manage documents" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map