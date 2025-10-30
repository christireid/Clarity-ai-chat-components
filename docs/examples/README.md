# Example Gallery

Explore our collection of working examples demonstrating different use cases and integration patterns.

---

## 🎯 Quick Links

| Example | Description | Tech Stack | Difficulty |
|---------|-------------|------------|------------|
| [Basic Chat](#basic-chat) | Simple chat interface | React, Vite | 🟢 Beginner |
| [AI Assistant](#ai-assistant) | Full-featured AI assistant | Next.js, OpenAI | 🟡 Intermediate |
| [Customer Support](#customer-support) | Support bot template | Next.js, tRPC | 🟡 Intermediate |
| [Streaming Chat](#streaming-chat) | Real-time streaming | React, SSE | 🟡 Intermediate |
| [Multi-User Chat](#multi-user-chat) | Collaborative chat | Next.js, Supabase | 🔴 Advanced |
| [Analytics Console](#analytics-console) | Analytics dashboard | React, Mixpanel | 🟡 Intermediate |
| [RAG Workbench](#rag-workbench) | Document Q&A | Next.js, Pinecone | 🔴 Advanced |
| [Model Comparison](#model-comparison) | Compare AI models | React, Multiple APIs | 🟡 Intermediate |

---

## 🟢 Basic Chat

**Location**: [`examples/basic-chat`](../../examples/basic-chat)

### Overview
The simplest implementation of Clarity Chat. Perfect for learning the basics and quick prototyping.

### Features
- ✅ Message sending and receiving
- ✅ Simple AI response simulation
- ✅ Theme switching
- ✅ Basic styling

### Tech Stack
- React 18
- TypeScript
- Vite
- Clarity Chat

### Quick Start
```bash
cd examples/basic-chat
npm install
npm run dev
```

### Code Snippet
```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Echo: ${content}`,
        timestamp: new Date()
      }])
    }, 1000)
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ThemeProvider>
  )
}
```

### Learning Goals
- Understand basic component structure
- Learn message state management
- Explore theming system

---

## 🟡 AI Assistant

**Location**: [`examples/ai-assistant`](../../examples/ai-assistant)

### Overview
Full-featured AI assistant with OpenAI integration, streaming responses, and advanced features.

### Features
- ✅ OpenAI GPT-4 integration
- ✅ Streaming responses (SSE)
- ✅ Context management
- ✅ File uploads
- ✅ Voice input
- ✅ Conversation history
- ✅ Analytics tracking
- ✅ Error handling

### Tech Stack
- Next.js 14 (App Router)
- TypeScript
- OpenAI API
- Vercel AI SDK
- Clarity Chat

### Quick Start
```bash
cd examples/ai-assistant
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY
npm run dev
```

### Code Snippet
```tsx
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

// app/page.tsx
import { useChat } from 'ai/react'
import { ChatWindow } from '@clarity-chat/react'

export default function Chat() {
  const { messages, input, handleSubmit, isLoading } = useChat()

  return <ChatWindow messages={messages} onSendMessage={handleSubmit} />
}
```

### Learning Goals
- Real API integration
- Streaming implementation
- Advanced state management
- Production patterns

---

## 🟡 Customer Support

**Location**: [`examples/customer-support`](../../examples/customer-support)

### Overview
Pre-built customer support bot with FAQ matching, ticket creation, and escalation.

### Features
- ✅ FAQ pattern matching
- ✅ Ticket creation
- ✅ Escalation to human agent
- ✅ Sentiment analysis
- ✅ Customer satisfaction rating
- ✅ Support analytics
- ✅ Multi-language support

### Tech Stack
- Next.js 14
- TypeScript
- tRPC
- Prisma
- PostgreSQL
- Clarity Chat

### Quick Start
```bash
cd examples/customer-support
npm install
cp .env.example .env.local
# Configure DATABASE_URL
npx prisma migrate dev
npm run dev
```

### Code Snippet
```tsx
import { SupportBotTemplate } from '@clarity-chat/react/templates'

export default function SupportPage() {
  return (
    <SupportBotTemplate
      config={{
        faqs: [
          { question: 'How do I reset my password?', answer: '...' },
          { question: 'What are your business hours?', answer: '...' }
        ],
        onCreateTicket: async (issue) => {
          const response = await fetch('/api/tickets', {
            method: 'POST',
            body: JSON.stringify(issue)
          })
          return response.json()
        },
        onEscalate: () => {
          // Connect to human agent
        }
      }}
    />
  )
}
```

### Learning Goals
- Template usage
- Backend integration
- Database operations
- Production deployment

---

## 🟡 Streaming Chat

**Location**: [`examples/streaming-chat`](../../examples/streaming-chat)

### Overview
Demonstrates real-time streaming with both SSE and WebSocket implementations.

### Features
- ✅ Server-Sent Events (SSE)
- ✅ WebSocket streaming
- ✅ Stream cancellation
- ✅ Reconnection handling
- ✅ Backpressure management

### Tech Stack
- React 18
- TypeScript
- Express.js
- Clarity Chat

### Quick Start
```bash
cd examples/streaming-chat
npm install
npm run dev # Starts both frontend and backend
```

### Code Snippet
```tsx
import { useStreamingSSE, ChatWindow } from '@clarity-chat/react'

function StreamingChat() {
  const { messages, streamMessage, cancelStream } = useStreamingSSE()

  const handleSend = async (content: string) => {
    await streamMessage('/api/stream', {
      method: 'POST',
      body: JSON.stringify({ message: content })
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onCancel={cancelStream}
    />
  )
}
```

### Learning Goals
- Streaming protocols
- Real-time updates
- Connection management
- Performance optimization

---

## 🔴 Multi-User Chat

**Location**: [`examples/multi-user-chat`](../../examples/multi-user-chat)

### Overview
Collaborative chat with multiple users, real-time sync, and presence awareness.

### Features
- ✅ Real-time synchronization
- ✅ User presence
- ✅ Typing indicators
- ✅ Read receipts
- ✅ User authentication
- ✅ Message persistence

### Tech Stack
- Next.js 14
- TypeScript
- Supabase (Auth + Realtime)
- PostgreSQL
- Clarity Chat

### Quick Start
```bash
cd examples/multi-user-chat
npm install
cp .env.example .env.local
# Configure SUPABASE_URL and SUPABASE_KEY
npm run dev
```

### Code Snippet
```tsx
import { createClient } from '@supabase/supabase-js'
import { ChatWindow, useChat } from '@clarity-chat/react'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default function CollaborativeChat() {
  const { messages, addMessage } = useChat()

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, payload => {
        addMessage(payload.new)
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### Learning Goals
- Real-time databases
- WebSocket integration
- User authentication
- Collaborative features

---

## 🟡 Analytics Console

**Location**: [`examples/analytics-console-demo`](../../examples/analytics-console-demo)

### Overview
Comprehensive analytics dashboard showing all tracked events and metrics.

### Features
- ✅ Event tracking visualization
- ✅ User journey analysis
- ✅ Performance metrics
- ✅ A/B testing dashboard
- ✅ Custom event filtering

### Tech Stack
- React 18
- TypeScript
- Mixpanel / Google Analytics
- Chart.js
- Clarity Chat

### Quick Start
```bash
cd examples/analytics-console-demo
npm install
cp .env.example .env.local
# Configure MIXPANEL_TOKEN
npm run dev
```

### Learning Goals
- Analytics integration
- Data visualization
- Event tracking patterns

---

## 🔴 RAG Workbench

**Location**: [`examples/rag-workbench-demo`](../../examples/rag-workbench-demo)

### Overview
Document Q&A system using Retrieval Augmented Generation (RAG) with vector database.

### Features
- ✅ PDF document upload
- ✅ Vector embedding
- ✅ Semantic search
- ✅ Context-aware responses
- ✅ Citation tracking
- ✅ Document visualization

### Tech Stack
- Next.js 14
- TypeScript
- OpenAI Embeddings
- Pinecone Vector DB
- LangChain
- Clarity Chat

### Quick Start
```bash
cd examples/rag-workbench-demo
npm install
cp .env.example .env.local
# Configure OPENAI_API_KEY and PINECONE_API_KEY
npm run dev
```

### Code Snippet
```tsx
import { ChatWindow, ContextManager } from '@clarity-chat/react'
import { useRAG } from '../hooks/use-rag'

export default function RAGWorkbench() {
  const { messages, query, documents } = useRAG()

  const handleSend = async (content: string) => {
    // Perform vector search
    const relevantDocs = await vectorDB.search(content)
    
    // Query with context
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `Context: ${relevantDocs}` },
        { role: 'user', content }
      ]
    })
  }

  return (
    <>
      <ContextManager documents={documents} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </>
  )
}
```

### Learning Goals
- RAG architecture
- Vector databases
- Embedding generation
- Advanced AI patterns

---

## 🟡 Model Comparison

**Location**: [`examples/model-comparison-demo`](../../examples/model-comparison-demo)

### Overview
Compare responses from different AI models side-by-side.

### Features
- ✅ Multiple AI providers (OpenAI, Anthropic, Cohere)
- ✅ Side-by-side comparison
- ✅ Response metrics (speed, tokens, cost)
- ✅ Model switching
- ✅ Export comparisons

### Tech Stack
- React 18
- TypeScript
- Multiple AI APIs
- Clarity Chat

### Quick Start
```bash
cd examples/model-comparison-demo
npm install
cp .env.example .env.local
# Configure API keys for multiple providers
npm run dev
```

### Learning Goals
- Multi-provider integration
- Performance comparison
- Cost analysis

---

## 🚀 Running All Examples

### Clone and Setup
```bash
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
npm install
```

### Run Specific Example
```bash
npm run dev --workspace=examples/basic-chat
npm run dev --workspace=examples/ai-assistant
```

### Run with Turborepo
```bash
turbo dev --filter=examples/*
```

---

## 📝 Creating Your Own Example

### 1. Create Directory
```bash
mkdir examples/my-example
cd examples/my-example
```

### 2. Initialize Project
```bash
npm init -y
npm install @clarity-chat/react react react-dom
npm install -D vite @vitejs/plugin-react typescript
```

### 3. Add to Workspace
```json
// Add to root package.json workspaces
{
  "workspaces": [
    "packages/*",
    "apps/*",
    "examples/*"
  ]
}
```

### 4. Create Example
See our [example template](../../examples/_template) for a starting point.

---

## 🤝 Contributing Examples

We welcome new examples! Please:

1. Follow the [Contributing Guide](../architecture/contributing.md)
2. Include a comprehensive README
3. Add `.env.example` for required environment variables
4. Document all features
5. Add to this gallery

---

## 📚 Additional Resources

- [Quick Start Guide](../getting-started/quick-start.md)
- [API Reference](../api/components.md)
- [Integration Guides](./integrations.md)
- [Deployment Guide](../guides/deployment.md)

---

## 💬 Need Help?

- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💡 [Request Examples](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
