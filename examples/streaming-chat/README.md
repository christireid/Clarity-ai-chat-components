# Streaming Chat Demo

Real-time AI chat with Server-Sent Events (SSE) streaming using Next.js 15 App Router.

## Features

- ✅ **Real-time streaming**: Uses SSE for token-by-token response delivery
- ✅ **Cancellation support**: Cancel streaming responses in progress
- ✅ **Next.js 15 App Router**: Modern React Server Components architecture
- ✅ **Edge Runtime**: Deployed to edge for low latency worldwide
- ✅ **Production ready**: Error handling, abort signals, proper cleanup

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

## How It Works

### Client Side (page.tsx)

The client manages message state and establishes SSE connection:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
  signal: abortController.signal, // For cancellation
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

// Read stream chunks
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const chunk = decoder.decode(value)
  // Update message with new content
}
```

### Server Side (route.ts)

The API route creates a `ReadableStream` for SSE:

```typescript
export const runtime = 'edge' // Deploy to edge

export async function POST(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      // Stream response chunks
      for await (const chunk of generateResponse()) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
      }
      
      // Send done signal
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
```

## Integration with Real AI APIs

Replace the simulated streaming with actual API calls:

### OpenAI Integration

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages,
  stream: true,
})

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content
  if (content) {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
  }
}
```

### Anthropic Claude Integration

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const stream = await anthropic.messages.stream({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages,
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    const content = chunk.delta.text
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
  }
}
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Cloudflare Pages

```bash
# Build
npm run build

# Deploy
npx wrangler pages publish .next
```

## Environment Variables

Create `.env.local` for API keys:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Project Structure

```
streaming-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # SSE streaming endpoint
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main chat page
│   │   └── globals.css            # Global styles
│   └── ...
├── public/                        # Static assets
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## Key Features Demonstrated

1. **Server-Sent Events (SSE)**: Real-time streaming from server to client
2. **Abort Controller**: Cancel in-progress requests
3. **Edge Runtime**: Fast, globally distributed responses
4. **Error Handling**: Graceful degradation and error states
5. **TypeScript**: Full type safety throughout
6. **Modern React**: React 19 with Server Components

## Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [OpenAI Streaming](https://platform.openai.com/docs/api-reference/streaming)
- [Anthropic Streaming](https://docs.anthropic.com/claude/reference/streaming)

## License

MIT
