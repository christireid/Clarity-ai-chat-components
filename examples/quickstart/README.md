# Quickstart

> Get a working AI chat running in under 5 minutes - no API keys required to start.

![Streaming](https://img.shields.io/badge/Streaming-SSE-blue)
![Difficulty](https://img.shields.io/badge/Difficulty-Beginner-green)
![Time](https://img.shields.io/badge/Time-5%20min-orange)

## What You'll Learn

- How to run Clarity Chat with zero configuration
- Streaming responses with Server-Sent Events (SSE)
- Upgrading from demo mode to production AI

## Quick Start

```bash
cd examples/quickstart
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - **it works immediately!**

No API keys needed. The example runs in demo mode by default.

## Features Demonstrated

| Feature          | Description                                |
| ---------------- | ------------------------------------------ |
| Demo Mode        | Works without API keys - great for testing |
| SSE Streaming    | Real-time token-by-token responses         |
| Stable | Add your API key to switch to real AI      |
| Dark Mode        | Automatic light/dark theme support         |

## Upgrade to Production

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key:

   ```
   OPENAI_API_KEY=sk-your-key-here
   DEMO_MODE=false
   ```

3. Restart the dev server:
   ```bash
   pnpm dev
   ```

That's it! You now have real AI responses.

## Code Highlights

The API route (`app/api/chat/route.ts`) automatically detects demo vs production mode:

```typescript
// Demo mode - works without API keys
const DEMO_MODE = process.env.DEMO_MODE !== 'false'

if (DEMO_MODE || !process.env.OPENAI_API_KEY) {
  // Stream simulated responses
} else {
  // Stream real OpenAI responses
}
```

## Production Considerations

- **API Key Security**: Never expose your API key in client-side code
- **Rate Limiting**: Add rate limiting before deploying to production
- **Error Handling**: The example includes basic error handling - extend for your needs
- **Cost Tracking**: Consider adding token counting for usage monitoring

## Next Steps

- **Add features**: Try [basic-chat](../basic-chat) for message editing, regeneration
- **Add streaming controls**: See [streaming-chat](../streaming-chat) for cancellation
- **Add function calling**: Check [tool-calling](../tool-calling) for AI tools
- **Go enterprise**: Explore [enterprise-rag](../../apps/examples/enterprise-rag) for RAG

## File Structure

```
quickstart/
├── app/
│   ├── api/chat/route.ts    # API endpoint (demo + production)
│   ├── globals.css          # Tailwind styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Chat interface
├── .env.example             # Environment template
├── package.json
└── README.md
```

## Related

- [Documentation](https://docs.clarity-chat.dev)
- [API Reference](https://docs.clarity-chat.dev/api)
- [GitHub](https://github.com/christireid/Clarity-ai-chat-components)
