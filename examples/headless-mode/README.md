# Headless Mode

> Build a complete chat UI with pure React - no library components, just patterns you can copy.

![Advanced](https://img.shields.io/badge/Difficulty-Advanced-red)
![Headless](https://img.shields.io/badge/Mode-Headless-purple)
![Custom UI](https://img.shields.io/badge/UI-Your%20Own-blue)

## What You'll Learn

- Building a chat UI with pure React state and fetch
- Handling SSE streaming responses
- Token tracking and cost estimation
- Auto-scroll behavior patterns
- Integrating with any design system

## Why Headless?

| Pre-built Components | Headless Mode      |
| -------------------- | ------------------ |
| Quick to start       | Full UI control    |
| Opinionated styling  | Your design system |
| Library dependency   | Zero dependencies  |
| Consistent look      | Unique look        |

**Choose headless when:**

- You have an existing design system
- You need pixel-perfect custom UI
- You want zero library lock-in
- You're building a white-label product

## Quick Start

```bash
cd examples/headless-mode
pnpm install
cp .env.example .env.local  # Add your OpenAI API key
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010)

## Patterns Demonstrated

This example shows reusable patterns you can copy into your own projects:

### Token Estimation

```typescript
// Simple token estimation (4 chars ≈ 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Cost estimation for GPT-4 Turbo
function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1000) * 0.01 // $0.01/1K input
  const outputCost = (outputTokens / 1000) * 0.03 // $0.03/1K output
  return inputCost + outputCost
}
```

### Auto-Scroll Hook

```typescript
function useAutoScroll(messagesLength: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100)
  }, [])

  useEffect(() => {
    if (isNearBottom) scrollToBottom()
  }, [messagesLength, isNearBottom, scrollToBottom])

  return { scrollRef, scrollToBottom, isNearBottom, handleScroll }
}
```

### SSE Streaming

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (reader) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  const lines = chunk.split('\n')

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6)
      if (data === '[DONE]') continue

      const parsed = JSON.parse(data)
      if (parsed.type === 'text-delta' && parsed.content) {
        // Append content to your state
      }
    }
  }
}
```

## Production Considerations

- **Accessibility**: You're responsible for ARIA labels, focus management
- **Keyboard nav**: Implement your own keyboard shortcuts
- **Error handling**: Build your own error UI and retry logic
- **Loading states**: Design your own loading indicators

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

- **Add tools**: Check [tool-calling](../tool-calling)
- **Multiple providers**: See [multi-provider](../multi-provider)
- **Compare to components**: Try [quickstart](../quickstart)
