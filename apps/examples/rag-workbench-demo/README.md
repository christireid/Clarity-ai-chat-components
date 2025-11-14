# RAG Workbench Demo

**Document Q&A with Retrieval Augmented Generation**

A demonstration application showcasing how to build a RAG (Retrieval Augmented Generation) system using Clarity Chat. Upload documents, ask questions, and get AI-powered answers with source citations.

## 🎯 What This Demonstrates

- **Document Upload**: Text file parsing and chunking
- **Vector Search**: Semantic search using embeddings (simulated)
- **Context Injection**: Relevant chunks injected into prompts
- **Source Citations**: AI responses include document references
- **Multiple Models**: Compare RAG responses across different AI models
- **Token Efficiency**: Track tokens used for context vs. response

## 🚀 Features

### 1. Document Management
- Upload .txt, .md, .pdf files (text extraction)
- View uploaded documents
- Delete documents
- Chunk documents into searchable segments

### 2. RAG Pipeline
- **Chunking**: Split documents into 500-token segments
- **Search**: Find relevant chunks based on query
- **Context Building**: Inject top-N chunks into prompt
- **Response**: AI generates answer with context
- **Citations**: Responses reference source documents

### 3. AI Integration
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3 models)
- Google AI (Gemini Pro)
- Real-time streaming responses

### 4. Analytics
- Tokens used per query (context + response)
- Cost estimation
- Response time tracking
- Context relevance scoring

## 📋 Quick Start

### 1. Install Dependencies

```bash
cd examples/rag-workbench-demo
npm install --legacy-peer-deps
```

### 2. Set Up API Keys

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002)

## 🏗️ Architecture

### RAG Pipeline Flow

```
1. Document Upload
   ↓
2. Text Extraction
   ↓
3. Chunking (500 tokens)
   ↓
4. User Query
   ↓
5. Semantic Search (find relevant chunks)
   ↓
6. Context Assembly
   ↓
7. Prompt Construction (query + context)
   ↓
8. AI Generation
   ↓
9. Response with Citations
```

### File Structure

```
rag-workbench-demo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # RAG chat endpoint
│   │   │   ├── documents/route.ts  # Document upload/list
│   │   │   └── search/route.ts     # Semantic search
│   │   ├── page.tsx                # Main UI
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── rag.ts                  # RAG utilities
│   │   ├── chunking.ts             # Document chunking
│   │   └── search.ts               # Search algorithms
│   └── types/
│       └── document.ts             # Type definitions
├── public/
├── .env.local
└── package.json
```

## 💡 Usage Examples

### Upload a Document

```typescript
// Upload document
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/documents', {
  method: 'POST',
  body: formData
})

const { documentId, chunks } = await response.json()
```

### Ask a Question

```typescript
// Query with RAG
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "What are the main findings?",
    documentIds: [documentId],
    model: "gpt-4-turbo",
    topK: 3  // Number of chunks to retrieve
  })
})

// Stream response
const reader = response.body.getReader()
// ... handle streaming
```

### Response Format

```json
{
  "answer": "Based on the documents, the main findings are...",
  "sources": [
    {
      "documentId": "doc-123",
      "documentName": "research.txt",
      "chunkIndex": 2,
      "text": "The study found that...",
      "relevanceScore": 0.92
    }
  ],
  "tokens": {
    "context": 1200,
    "prompt": 50,
    "completion": 300,
    "total": 1550
  },
  "cost": 0.0234,
  "responseTime": 3200
}
```

## 🎨 UI Components

### Document Manager
- Drag-and-drop upload
- Document list with metadata
- Delete confirmation
- Upload progress indicator

### Query Interface
- Question input
- Model selector
- Document filter (which docs to search)
- Top-K chunks selector

### Response Display
- Streaming AI response
- Source citations (expandable)
- Token usage stats
- Cost breakdown

### Analytics Dashboard
- Total documents uploaded
- Total queries processed
- Average response time
- Total cost

## 🧪 Testing

### Test Cases

1. **Single Document Q&A**
   - Upload one document
   - Ask questions about it
   - Verify citations reference correct chunks

2. **Multi-Document Search**
   - Upload multiple documents
   - Ask cross-document questions
   - Verify relevant chunks from multiple sources

3. **Model Comparison**
   - Same question across models
   - Compare response quality
   - Compare token usage and cost

4. **Token Limits**
   - Test with large documents
   - Verify chunk selection doesn't exceed context
   - Test fallback when context too large

### Manual Testing

```bash
# 1. Upload test document
curl -X POST http://localhost:3002/api/documents \
  -F "file=@test.txt"

# 2. Query the document
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the main topic?",
    "documentIds": ["doc-123"],
    "model": "gpt-3.5-turbo"
  }'
```

## 📊 RAG Implementation Details

### Chunking Strategy

```typescript
// Simple overlap chunking
const chunkSize = 500  // tokens
const overlap = 50     // overlap between chunks

function chunkDocument(text: string): Chunk[] {
  const tokens = tokenize(text)
  const chunks = []
  
  for (let i = 0; i < tokens.length; i += chunkSize - overlap) {
    chunks.push({
      text: tokens.slice(i, i + chunkSize).join(''),
      startToken: i,
      endToken: Math.min(i + chunkSize, tokens.length)
    })
  }
  
  return chunks
}
```

### Search Algorithm (Simple Version)

```typescript
// Keyword-based search (production would use embeddings)
function searchChunks(query: string, chunks: Chunk[], topK: number): Chunk[] {
  const queryTerms = query.toLowerCase().split(' ')
  
  // Score each chunk
  const scored = chunks.map(chunk => ({
    chunk,
    score: calculateScore(queryTerms, chunk.text.toLowerCase())
  }))
  
  // Return top K
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk)
}
```

### Production Enhancements

For production RAG systems, consider:

1. **Vector Embeddings**
   - Use OpenAI embeddings API
   - Store in vector database (Pinecone, Weaviate, Chroma)
   - Semantic search vs keyword search

2. **Hybrid Search**
   - Combine keyword + vector search
   - Better retrieval accuracy

3. **Re-ranking**
   - Use cross-encoder models
   - Improve relevance of top chunks

4. **Metadata Filtering**
   - Filter by document type, date, author
   - Pre-filter before vector search

5. **Context Optimization**
   - Dynamic chunk sizing based on model
   - Token budget management
   - Chunk compression techniques

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm run build
npx vercel --prod

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t rag-workbench-demo .

# Run container
docker run -p 3002:3002 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  rag-workbench-demo
```

## 📚 Learn More

- [RAG Pattern Guide](https://platform.openai.com/docs/guides/rag)
- [LangChain RAG](https://python.langchain.com/docs/use_cases/question_answering/)
- [Vector Search Best Practices](https://www.pinecone.io/learn/vector-search/)

## 🔧 Configuration

### RAG Settings

Adjust in `src/lib/rag.ts`:

```typescript
export const RAG_CONFIG = {
  chunkSize: 500,        // tokens per chunk
  overlap: 50,           // overlap between chunks
  topK: 3,               // chunks to retrieve
  maxContextTokens: 3000, // max context size
  temperature: 0.3,       // lower for factual responses
}
```

## 🐛 Troubleshooting

**Document upload fails**
- Check file size limit (default: 10MB)
- Verify file encoding (UTF-8)

**No relevant chunks found**
- Try different search terms
- Check if document was properly chunked
- Reduce topK value

**Context too large error**
- Reduce chunkSize or topK
- Use smaller documents
- Filter to specific documents

**Hallucination issues**
- Lower temperature (0.0-0.3)
- Add "only answer from context" to prompt
- Use Claude models (better at staying grounded)

## 📝 License

Part of Clarity Chat - MIT License
