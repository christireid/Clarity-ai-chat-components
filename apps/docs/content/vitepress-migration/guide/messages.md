# Message Handling

Messages in Clarity Chat follow a consistent schema across adapters, enabling deterministic rendering and downstream analytics.

## Message Shape

```ts
interface ChatMessage {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  createdAt: Date
  updatedAt?: Date
  status: 'draft' | 'sent' | 'error' | 'streaming'
  metadata?: Record<string, unknown>
}
```

## Rendering Pipeline

1. **Normalization** – Adapter responses are normalized into the message schema.
2. **Enrichment** – Hooks append cost, latency, and moderation metadata.
3. **Presentation** – UI components render rich markdown, code blocks, and citations.
4. **Actions** – Copy, retry, regenerate, and feedback bindings mutate message state.

## Streaming Updates

Use `useStreamingChat` to patch the active assistant message as tokens arrive. `StreamingMessage` handles granular diffing and cursor animations.

## Error States

Set `status: 'error'` and populate `metadata.error` for surfaced failures. Components automatically render retry affordances and tooltips.

## Attachments

Messages support `metadata.attachments` for images, files, and references. The `AttachmentGallery` component renders previews with download links.

Continue with the [Error Handling](/guide/error-handling) guide to learn about retries, fallbacks, and guard rails.
