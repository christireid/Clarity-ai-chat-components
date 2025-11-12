# Streaming Chat Demo

Advanced streaming experience that renders tokens as soon as they arrive from the server.

## Features

- Server-Sent Events (SSE) based streaming endpoint.
- Typing indicator and retry controls during long responses.
- Graceful cancellation and abort handling.
- Transcript persistence for refreshing or sharing links.

## Running Locally

```bash
cd examples/streaming-chat
npm install
npm run dev
```

Ensure the `.env.local` file contains your API key and SSE endpoint configuration.

## Architecture

- **API Route** – Next.js route streams data using `TextEncoderStream`.
- **Client Hook** – `useStreamingChat` collects partial deltas and updates messages.
- **UI** – `StreamingMessage` animates text reveal and caret.

## Implementation Snippet

```tsx
import { useStreamingChat } from '@clarity-chat/react'

const { messages, streamMessage } = useStreamingChat({ chatId: 'streaming-demo' })

await streamMessage({
  role: 'user',
  content: 'Outline a migration plan from REST to GraphQL',
})
```

Inspect `examples/streaming-chat` for environment setup, API handlers, and UI integration tips.
