<!-- NOTE: These are draft marketing templates. All claims must be verified before use. -->

# Quick Start: Zero to AI Chat in 5 Minutes

Get a robust AI chat interface running in **under 5 minutes**. No complex setup. No configuration hell. Just clean, working code.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 20+** installed
- **React 18+** or **React 19** (both supported)
- A **chat API endpoint** (we'll show you how to create one)

---

## Step 1: Install (30 seconds)

Choose your package manager:

```bash
# npm
npm install @clarity-chat/react

# pnpm (recommended)
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react

# bun
bun add @clarity-chat/react
```

---

## Step 2: Add to Your App (1 minute)

### Option A: Fastest (One-Liner)

```tsx
import { chat } from '@clarity-chat/react'

export default function App() {
  return chat('/api/chat') // That's it! 🎉
}
```

### Option B: With Preset (Recommended)

```tsx
import { ChatPresets } from '@clarity-chat/react'

export default function App() {
  return ChatPresets.Enterprise('/api/chat')
}
```

### Option C: Full Control (Advanced)

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      features={{
        memory: true,
        tokenOptimization: true,
        safety: true,
      }}
    />
  )
}
```

---

## Step 3: Create API Endpoint (2 minutes)

### Next.js App Router

Create `app/api/chat/route.ts`:

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

### Next.js Pages Router

Create `pages/api/chat.ts`:

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export default async function handler(req: any, res: any) {
  const { messages } = req.body

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

### Express.js

```typescript
import express from 'express'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toDataStreamResponse()
})
```

---

## Step 4: Add Environment Variables (1 minute)

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

---

## Step 5: Run Your App (30 seconds)

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

Visit `http://localhost:3000` — you now have a working AI chat!

---

## What You Get Out of the Box

✅ **Streaming responses** with automatic reconnection
✅ **Token tracking** with real-time budget visualization
✅ **Beautiful animations** and smooth transitions
✅ **Dark mode** with theme switching
✅ **Full keyboard navigation** (try `Shift + ?`)
✅ **WCAG AAA accessibility** (screen reader support)
✅ **Mobile responsive** design
✅ **Error recovery** with automatic retry
✅ **Code highlighting** with copy-to-clipboard
✅ **Markdown rendering** with LaTeX support
✅ **File attachments** (images, PDFs, docs)

---

## Customization in 60 Seconds

### Add Token Optimization

```tsx
<ClarityChatApp
  api="/api/chat"
  features={{ tokenOptimization: true }}
/>
```

Now you see:
- Real-time token usage
- Budget warnings at 80%
- Cost estimation
- Provider comparison

### Enable Memory

```tsx
<ClarityChatApp
  api="/api/chat"
  features={{ memory: true }}
  config={{
    memory: {
      strategy: 'vector-store',
      maxTokens: 10000,
    },
  }}
/>
```

Now conversations persist and context is injected automatically.

### Use Enterprise Preset

```tsx
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

Enables everything:
- Token optimization
- Memory
- Safety features (PII redaction, prompt injection detection)
- Analytics
- Rate limiting
- Tool calling support

---

## Advanced Setup (5-10 Minutes)

### With Custom Hook

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

export default function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) =>
        append({ role: 'user', content })
      }
      header={{
        show: true,
        title: 'AI Assistant',
        showMessageCount: true,
      }}
    />
  )
}
```

### With Memory Provider

```tsx
import { MemoryProvider, ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return (
    <MemoryProvider
      config={{
        strategy: 'vector-store',
        maxTokens: 10000,
        vectorStore: {
          provider: 'pinecone',
          apiKey: process.env.PINECONE_API_KEY,
        },
      }}
    >
      <ClarityChatApp api="/api/chat" features={{ memory: true }} />
    </MemoryProvider>
  )
}
```

### With RAG (Retrieval-Augmented Generation)

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="rag"
      config={{
        rag: {
          enabled: true,
          vectorStore: 'pinecone',
          embeddingModel: 'text-embedding-3-small',
        },
      }}
    />
  )
}
```

---

## Common Patterns

### Pattern 1: Customer Support Bot

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function SupportBot() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="simple"
      config={{
        header: { title: 'Customer Support' },
        prompts: {
          starterPrompts: [
            { text: 'Track my order', category: 'order' },
            { text: 'Return policy', category: 'policy' },
            { text: 'Speak to human', category: 'escalation' },
          ],
        },
      }}
    />
  )
}
```

### Pattern 2: AI Code Assistant

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function CodeAssistant() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="pro"
      config={{
        header: { title: 'Code Assistant' },
        codeHighlight: {
          theme: 'night-owl',
          showLineNumbers: true,
        },
        prompts: {
          starterPrompts: [
            { text: 'Explain this code', category: 'explain' },
            { text: 'Find bugs', category: 'debug' },
            { text: 'Optimize performance', category: 'optimize' },
          ],
        },
      }}
    />
  )
}
```

### Pattern 3: Document Q&A with RAG

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function DocumentQA() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="rag"
      config={{
        header: { title: 'Document Q&A' },
        rag: {
          enabled: true,
          documentTypes: ['pdf', 'docx', 'txt'],
          citationDisplay: 'inline',
        },
      }}
    />
  )
}
```

---

## Troubleshooting

### Issue: Chat doesn't stream

**Solution:** Make sure your API returns a streaming response:

```typescript
// ✅ Correct
return result.toDataStreamResponse()

// ❌ Wrong
return Response.json({ messages })
```

### Issue: Token tracking doesn't work

**Solution:** Enable the feature:

```tsx
<ClarityChatApp
  api="/api/chat"
  features={{ tokenOptimization: true }}
/>
```

### Issue: Styles not loading

**Solution:** Import CSS in your root layout:

```tsx
// app/layout.tsx or pages/_app.tsx
import '@clarity-chat/react/styles.css'
```

### Issue: TypeScript errors

**Solution:** Update tsconfig.json:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

---

## Next Steps

### 1. Explore Examples

Browse 12+ robust examples:
```bash
git clone https://github.com/christireid/Clarity-ai-chat-components
cd Clarity-ai-chat-components/examples
npm install
npm run dev
```

### 2. Read Documentation

- [Architecture Guide](../architecture.md)
- [API Reference](../../packages/react/README.md)
- [Best Practices](../best-practices.md)
- [Token Optimization](../cookbook.md)

### 3. Join Community

- [Discord](https://discord.gg/clarity-chat)
- [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- [Twitter](https://twitter.com/clarity-chat)

---

## Comparison with Other Libraries

### vs. Vercel AI SDK

**Vercel AI SDK:**
```tsx
// Vercel: Need to build UI yourself
import { useChat } from 'ai/react'

export default function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  )
}
```

**Clarity:**
```tsx
// Clarity: UI included, token tracking built-in
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return <ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />
}
```

### vs. shadcn/ui AI

**shadcn/ui AI:**
```bash
# shadcn: Copy-paste each component
npx shadcn@latest add chat-message
npx shadcn@latest add chat-input
npx shadcn@latest add chat-bubble
# ... manually copy 10+ files
```

**Clarity:**
```bash
# Clarity: One npm install
npm install @clarity-chat/react
```

---

## Presets Reference

### Simple Preset

```tsx
<ClarityChatApp api="/api/chat" preset="simple" />
```

**Includes:**
- Basic chat UI
- Streaming
- Markdown rendering
- Code highlighting

### Pro Preset

```tsx
<ClarityChatApp api="/api/chat" preset="pro" />
```

**Includes:**
- Everything in Simple
- Token tracking
- Memory
- File attachments
- Voice input

### Enterprise Preset

```tsx
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

**Includes:**
- Everything in Pro
- Safety features (PII redaction, prompt injection detection)
- Analytics (7 providers)
- Rate limiting
- Tool calling support
- Multi-model support

### RAG Preset

```tsx
<ClarityChatApp api="/api/chat" preset="rag" />
```

**Includes:**
- Everything in Pro
- Vector store integration
- Document loaders (PDF, DOCX, TXT)
- Citation display
- Semantic search

---

## Performance Tips

### 1. Code Splitting

```tsx
import dynamic from 'next/dynamic'

const ClarityChatApp = dynamic(
  () => import('@clarity-chat/react').then(mod => mod.ClarityChatApp),
  { ssr: false }
)
```

### 2. Virtual Scrolling (Coming Soon)

```tsx
<ClarityChatApp
  api="/api/chat"
  config={{ virtualScrolling: true }}
/>
```

### 3. Lazy Loading

```tsx
<ClarityChatApp
  api="/api/chat"
  config={{
    lazyLoad: {
      images: true,
      markdown: true,
      codeHighlight: true,
    },
  }}
/>
```

---

## Summary: Your 5-Minute Checklist

- [ ] Install package: `npm install @clarity-chat/react`
- [ ] Add to app: `<ClarityChatApp api="/api/chat" />`
- [ ] Create API endpoint: `app/api/chat/route.ts`
- [ ] Add API key: `.env.local`
- [ ] Run app: `npm run dev`

**Total time: 5 minutes**

**What you get:**
- 150+ React components
- Token tracking and cost optimization
- Beautiful UI with dark mode
- Full accessibility
- Streaming responses
- Error recovery

**No configuration hell. No weeks of development. Just working code.**

---

## Need Help?

- **Docs:** https://clarity-chat.dev
- **Examples:** https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples
- **Discord:** https://discord.gg/clarity-chat
- **Issues:** https://github.com/christireid/Clarity-ai-chat-components/issues

---

**Ready to ship?** `npm install @clarity-chat/react`
