# Headless Mode

> Use Clarity Chat's powerful hooks with your own custom UI - zero styling lock-in.

![Advanced](https://img.shields.io/badge/Difficulty-Advanced-red)
![Headless](https://img.shields.io/badge/Mode-Headless-purple)
![Custom UI](https://img.shields.io/badge/UI-Your%20Own-blue)

## What You'll Learn

- How to use core hooks without any pre-built components
- Building a custom chat UI with full control
- Integrating with any design system (Tailwind, MUI, Chakra, etc.)

## Why Headless?

| Pre-built Components | Headless Mode |
|---------------------|---------------|
| Quick to start | Full UI control |
| Opinionated styling | Your design system |
| Larger bundle | Import only what you need |
| Consistent look | Unique look |

**Choose headless when:**
- You have an existing design system
- You need pixel-perfect custom UI
- You want minimal bundle size
- You're building a white-label product

## Quick Start

```bash
cd examples/headless-mode
pnpm install
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010)

## Core Hooks Used

```typescript
import {
  useChat,           // Message sending, streaming, state
  useTokenTracker,   // Token counting, cost estimation
  useAutoScroll,     // Smart scroll behavior
} from '@clarity-chat/react/core'
```

### useChat

The main hook for chat functionality:

```typescript
const { sendMessage, isLoading, error } = useChat({
  api: '/api/chat',
  onMessage: (content) => {
    // Handle each streamed chunk
  },
  onFinish: (message) => {
    // Handle completion
  },
})
```

### useTokenTracker

Track token usage and costs:

```typescript
const { totalTokens, estimatedCost, trackTokens } = useTokenTracker({
  model: 'gpt-4-turbo-preview',
})

// Track usage manually
trackTokens(100, 'input')
trackTokens(50, 'output')
```

### useAutoScroll

Smart scroll behavior for chat:

```typescript
const { scrollRef, scrollToBottom, isNearBottom } = useAutoScroll({
  behavior: 'smooth',
  threshold: 100, // pixels from bottom
})

// Attach to your container
<div ref={scrollRef}>...</div>
```

## Available Core Hooks

| Hook | Purpose |
|------|---------|
| `useChat` | Core messaging and streaming |
| `useTokenTracker` | Token counting and cost tracking |
| `useAutoScroll` | Smart scroll management |
| `useMessageOperations` | Edit, delete, regenerate messages |
| `useStreamingSSE` | Low-level SSE handling |
| `useMemory` | Conversation memory/context |

## Production Considerations

- **Bundle size**: Headless mode imports ~40% less code
- **Accessibility**: You're responsible for ARIA labels, focus management
- **Keyboard nav**: Implement your own keyboard shortcuts
- **Error handling**: Build your own error UI

## File Structure

```
headless-mode/
├── app/
│   ├── api/chat/route.ts    # API endpoint
│   ├── globals.css          # Your styles
│   ├── layout.tsx           # Layout
│   └── page.tsx             # Custom chat UI
├── .env.example
├── package.json
└── README.md
```

## Next Steps

- **Add memory**: See [memory-examples](../memory-examples)
- **Add tools**: Check [tool-calling](../tool-calling)
- **Compare to styled**: Try [basic-chat](../basic-chat)
