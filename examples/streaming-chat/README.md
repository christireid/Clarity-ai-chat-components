# Streaming Chat Example

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

> Real-time streaming AI chat interface built with Clarity Chat patterns and Next.js App Router.

![Streaming Chat Demo](./public/screenshot.png)

## ✨ Features

- **Real-time streaming** - See AI responses appear word-by-word as they're generated
- **Accessible design** - WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Responsive layout** - Works beautifully on mobile, tablet, and desktop
- **Error handling** - Graceful error states with retry functionality
- **Loading states** - Skeleton UI while content loads
- **Dark mode ready** - CSS variables for easy theme customization

## 🚀 Quick Start

```bash
# Navigate to this example
cd examples/streaming-chat

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (optional for demo mode)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

> **Note:** This example includes a demo mode that works without API keys, simulating streaming responses to showcase the UI patterns.

## 📋 Prerequisites

- Node.js 20+
- pnpm 10+
- (Optional) OpenAI API key for real AI responses - [Get one here](https://platform.openai.com/api-keys)

## 🏗️ Architecture

```
streaming-chat/
├── src/
│   └── app/
│       ├── layout.tsx        # Root layout with metadata
│       ├── page.tsx          # Main chat interface
│       ├── loading.tsx       # Loading skeleton
│       ├── error.tsx         # Error boundary
│       ├── globals.css       # Tailwind + CSS variables
│       └── api/
│           └── chat/
│               └── route.ts  # Streaming API endpoint
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

### Data Flow

```
┌─────────────┐     POST /api/chat     ┌─────────────┐
│   Client    │ ───────────────────────▶│  API Route  │
│  (page.tsx) │                         │  (route.ts) │
└─────────────┘                         └─────────────┘
       ▲                                       │
       │                                       │
       │    ReadableStream (chunked text)      │
       └───────────────────────────────────────┘
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main chat UI with `useStreamingChat` hook |
| `src/app/api/chat/route.ts` | Streaming API endpoint (demo + production patterns) |
| `src/app/error.tsx` | Error boundary with retry functionality |
| `src/app/loading.tsx` | Skeleton loading state |

## 🎨 Customization

### Adding Real AI Integration

Replace the demo response in `src/app/api/chat/route.ts`:

```typescript
// Using Vercel AI SDK (recommended)
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
  })

  return result.toTextStreamResponse()
}
```

### Using OpenAI SDK Directly

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    stream: true,
  })

  return new Response(stream.toReadableStream())
}
```

### Styling

This example uses Tailwind CSS with CSS variables. Customize colors in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;     /* Primary color (blue) */
  --background: 0 0% 100%;           /* Background color */
  --foreground: 222.2 84% 4.9%;      /* Text color */
  /* ... more variables */
}
```

## 🔗 Related Examples

- [memory-examples](../memory-examples) - Add conversation memory and context
- [token-optimization](../token-optimization) - Optimize token usage and costs
- [enterprise-ai-ops](../enterprise-ai-ops) - Enterprise AI operations dashboard

## 🐛 Troubleshooting

<details>
<summary>Port 3000 already in use</summary>

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
pnpm dev -- -p 3001
```

</details>

<details>
<summary>API key not working</summary>

1. Ensure your `.env.local` file exists (not `.env.example`)
2. Check the key format: `OPENAI_API_KEY=sk-...`
3. Verify your API key is active at [OpenAI Dashboard](https://platform.openai.com/api-keys)

</details>

<details>
<summary>Streaming not working</summary>

Ensure your API route returns a `ReadableStream` and sets proper headers:

```typescript
return new Response(stream, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
  },
})
```

</details>

## 📚 Learn More

- [Clarity Chat Documentation](../../packages/react/README.md)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel AI SDK](https://ai-sdk.dev)
- [Streaming Responses Guide](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

## 📄 License

MIT © [Code & Clarity](https://codeandclarity.com)
