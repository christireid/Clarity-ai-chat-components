# Type Definitions

All packages expose strict TypeScript definitions for safer integrations.

## Core Types

- `Message` – canonical chat message shape used across hooks and components.
- `ChatParticipant` – describes system, user, assistant, or tool identities.
- `Attachment` – metadata for uploaded files, including name, size, type, and URL.
- `ToolInvocation` – captures tool call requests and responses.

```ts
import type { Message, Attachment } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  chatId: 'demo',
  role: 'assistant',
  content: 'Your order ships tomorrow!',
  createdAt: new Date(),
  status: 'sent',
  attachments: [
    {
      id: 'invoice',
      name: 'invoice.pdf',
      url: 'https://cdn.example.com/invoice.pdf',
      type: 'application/pdf',
      size: 1024,
    } satisfies Attachment,
  ],
}
```

## Utility Types

- `ModelConfig` – unify provider-specific options (temperature, top_p, maxTokens).
- `StreamingAdapter` – interface for SSE/WebSocket streaming implementations.
- `CostBreakdown` – track prompt/output tokens and currency-converted totals.

## Type Augmentation

Extend types to include domain-specific metadata:

```ts
declare module '@clarity-chat/types' {
  interface MessageMetadata {
    ticketId?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
  }
}
```

Continue to the [Utilities](/api/utilities) reference for helper functions and adapters.
