# Newsletter: SSE vs WebSockets for AI

**Subject:** You're probably overcomplicating your streaming

---

WebSockets sound impressive. "Real-time bidirectional communication" has a certain ring to it.

But for AI chat streaming? You probably don't need them.

## The Key Insight

AI streaming is **fundamentally one-way**: server to client. SSE (Server-Sent Events) was designed
exactly for this.

| Feature               | SSE       | WebSocket         |
| --------------------- | --------- | ----------------- |
| Memory per connection | ~2KB      | ~8KB              |
| Reconnection          | Automatic | Manual            |
| Proxy compatibility   | Excellent | Often problematic |
| Complexity            | Low       | Medium            |

```tsx
// SSE streaming - simple and effective
async function streamChat(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    // Process SSE data
    if (chunk.startsWith('data: ')) {
      const content = JSON.parse(chunk.slice(6))
      appendToMessage(content.text)
    }
  }
}
```

**When WebSockets DO make sense:**

- Multi-user chat rooms
- Real-time collaborative editing
- High-frequency bidirectional data

**For single-user AI chat?** SSE wins on simplicity, reliability, and infrastructure cost.

---

[Read the full article →](/blog/sse-vs-websockets)

_Clarity Chat provides both `useSSEStream` and `useWebSocketStream` hooks—use the right tool for
your use case._
