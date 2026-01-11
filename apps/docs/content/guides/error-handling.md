# Error Handling

Robust error handling keeps conversations resilient even when downstream models or tools fail.

## Categorising Failures

- **Transport errors**: Network or adapter failures. Surface retries and fallback models.
- **Tool invocation errors**: Tool outputs invalid or timed out. Present actionable logs to operators.
- **Content policy violations**: Flag messages via moderation adapters and block delivery.

## Recommended Patterns

1. Wrap async sends with `try/catch` and set message `status: 'error'` on failure.
2. Render contextual banners via `ChatWindow`'s `onError` callback.
3. Provide `onRetry` callbacks on `Message` to regenerate with new instructions.

```tsx
import { ChatWindow, useChat } from '@clarity-chat/react'

export function ReliableChat() {
  const { messages, sendMessage } = useChat({ chatId: 'resilient' })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={async content => {
        try {
          await sendMessage({ role: 'user', content })
        } catch (error) {
          console.error('Failed to send message', error)
        }
      }}
      onError={err => console.error('chat error', err)}
    />
  )
}
```

## Observability

Integrate application logs and tracing (e.g., OpenTelemetry) to capture request IDs, tokens used, and tool responses. Pair with `SessionSummary` to provide support teams with a full incident trail.

Review the [Customization](/guide/customization) guide to tailor error states to your brand voice.
