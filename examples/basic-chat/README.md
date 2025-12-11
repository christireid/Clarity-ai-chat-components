# Basic Chat

> The simplest possible AI chat implementation with Clarity Chat - get started in under 5 minutes.

## Features

- Streaming responses with SSE
- Clean, minimal UI
- Error handling
- Loading states
- Keyboard accessible (WCAG 2.1 AA)
- Dark mode support
- Mobile responsive

## Quick Start

```bash
# Clone the example
npx degit clarity-chat/clarity-chat/examples/basic-chat my-chat-app
cd my-chat-app

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your OpenAI API key to .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## What You'll Learn

1. How to set up a basic chat interface
2. How to stream responses from OpenAI using SSE
3. Proper message state management patterns
4. Accessibility best practices for chat UIs

## Key Code

### Chat Component (150 lines)

The main chat component handles:
- Message state with `useState`
- Streaming responses via SSE
- Auto-scroll to latest message
- Keyboard navigation (Enter to send)

```typescript
// components/basic-chat.tsx
const sendMessage = async (content: string) => {
  // 1. Add user message to state
  // 2. Create assistant placeholder
  // 3. Stream response from API
  // 4. Update assistant message chunk by chunk
}
```

### API Route

```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  // Create SSE stream from OpenAI
  const stream = new ReadableStream({
    async start(controller) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        stream: true,
      })

      for await (const chunk of completion) {
        // Send each chunk as SSE event
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

## Project Structure

```
basic-chat/
├── app/
│   ├── api/chat/route.ts   # Streaming API endpoint
│   ├── globals.css         # Tailwind styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   └── basic-chat.tsx      # Main chat component
├── .env.example            # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Customization

### Change the AI Model

Edit the API route to use a different model:

```typescript
// app/api/chat/route.ts
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo', // or 'gpt-4', 'gpt-4-turbo-preview'
  messages,
  stream: true,
})
```

### Add a System Prompt

Prepend a system message to customize the AI's behavior:

```typescript
const systemMessage = {
  role: 'system',
  content: 'You are a helpful assistant specialized in coding.',
}

const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [systemMessage, ...messages],
  stream: true,
})
```

### Style the Messages

Edit `components/basic-chat.tsx` to customize the message bubbles:

```tsx
<div className={`
  max-w-[80%] p-4 rounded-2xl
  ${message.role === 'user'
    ? 'bg-blue-600 text-white'
    : 'bg-gray-100 dark:bg-gray-800'}
`}>
```

## Related Examples

- [streaming-chat](../streaming-chat) - Advanced streaming patterns
- [multi-provider](../multi-provider) - Switch between AI providers
- [custom-theming](../custom-theming) - Full theming capabilities

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework
- [React 19](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [OpenAI API](https://platform.openai.com) - AI backend

## License

MIT
