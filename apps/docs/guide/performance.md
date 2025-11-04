# Performance

Deliver fast, efficient chat interfaces with sensible defaults and targeted optimisations.

## Virtualised Timelines

`ConversationPane` and `ChatWindow` use windowing for large histories. Provide stable `message.id` values and avoid inline function recreation to preserve virtualization caches.

## Streaming Efficiency

- Batch token payloads on the server to reduce render thrash.
- Use `StreamingMessage` which only re-renders diffed spans.
- Debounce analytics updates to once per second during active streams.

## Memoization Tips

```tsx
import { memo, useMemo } from 'react'
import { ChatWindow } from '@clarity-chat/react'

const MemoChatWindow = memo(ChatWindow)

export function FastChat({ initialMessages }) {
  const messages = useMemo(() => initialMessages, [initialMessages])

  return <MemoChatWindow messages={messages} />
}
```

## Asset Optimisation

- Lazy load heavy model adapters (e.g., embeddings, summarisation) with dynamic imports.
- Tree-shake unused components via ESM deep imports (`@clarity-chat/react/message`).
- Leverage the `size-limit` script to monitor bundle size regressions.

Continue with the [Accessibility](/guide/accessibility) guide to keep experiences inclusive.
