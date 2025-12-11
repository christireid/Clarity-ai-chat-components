# Streaming Chat

> Advanced SSE streaming demo with cancel, retry, and real-time token tracking.

## Features

- Real-time token counting (input & output)
- Stream cancellation with Stop button
- Retry failed messages
- Tokens per second metrics
- Stream duration tracking
- Visual streaming cursor
- Connection status indicator
- Dark theme with accent colors

## Quick Start

```bash
# Clone the example
npx degit clarity-chat/clarity-chat/examples/streaming-chat my-streaming-app
cd my-streaming-app

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your OpenAI API key

# Run development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to see the demo.

## What You'll Learn

1. How to implement SSE streaming with metadata
2. Stream cancellation with AbortController
3. Real-time metrics calculation
4. Graceful error handling and retry logic

## Key Code

### Stream with Metadata

The API route sends not just content, but also metrics:

```typescript
// Types of SSE events
{ type: 'init', inputTokens: 150, model: 'gpt-4' }
{ type: 'text-delta', content: 'Hello', outputTokens: 1, elapsedMs: 50 }
{ type: 'finish', reason: 'stop', totalMs: 2500, outputTokens: 100 }
{ type: 'error', message: 'Rate limit exceeded' }
```

### AbortController for Cancellation

```typescript
// Create controller before fetch
abortControllerRef.current = new AbortController()

const response = await fetch('/api/chat', {
  signal: abortControllerRef.current.signal,
})

// Cancel on button click
const cancelStream = () => {
  abortControllerRef.current?.abort()
}
```

### Token Metrics

```typescript
interface StreamMetrics {
  inputTokens: number   // Tokens in the prompt
  outputTokens: number  // Tokens generated so far
  elapsedMs: number     // Time since start
  tokensPerSecond: number // Generation speed
}

// Calculate tokens/second
const tps = elapsed > 0
  ? Math.round((outputTokens / elapsed) * 1000)
  : 0
```

## Project Structure

```
streaming-chat/
├── app/
│   ├── api/chat/route.ts   # Streaming API with metrics
│   ├── globals.css         # Dark theme styles
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── streaming-chat.tsx  # Main component (~400 lines)
├── .env.example
├── package.json
└── README.md
```

## Customization

### Add Custom Metrics

Extend the metrics panel to show additional data:

```typescript
// In the API route
const data = JSON.stringify({
  type: 'text-delta',
  content,
  outputTokens,
  elapsedMs,
  // Add custom metrics
  estimatedCost: outputTokens * 0.00003,
  model: 'gpt-4-turbo',
})
```

### Change the Theme

This example uses a dark theme with green accent. Edit `globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue */
  --background: 0 0% 100%; /* Light */
}
```

### Adjust Token Limits

Change the progress bar limits in `TokenCounter`:

```typescript
<TokenCounter label="Input" count={metrics.inputTokens} max={200000} />
<TokenCounter label="Output" count={metrics.outputTokens} max={8192} />
```

## Related Examples

- [basic-chat](../basic-chat) - Simpler implementation
- [multi-provider](../multi-provider) - Multiple AI providers
- [token-optimization](../token-optimization) - Advanced token management

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework
- [React 19](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [OpenAI API](https://platform.openai.com) - AI backend

## License

MIT
