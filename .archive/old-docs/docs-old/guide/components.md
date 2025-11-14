# Components Overview

Clarity Chat ships a comprehensive suite of UI primitives for building production-grade chat experiences. Components are designed to be composable, themeable, and accessible by default.

## Core Layout

- `ChatWindow` orchestrates the full messaging surface, including header, conversation timeline, and composer.
- `ConversationPane` renders chronological message threads with virtualization support for long histories.
- `Composer` provides multiline authoring with attachments, slash commands, and keyboard shortcuts.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const messages: Message[] = [
  {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'How can I help you today?',
    createdAt: new Date(),
    status: 'sent',
  },
]

export function BasicChat() {
  return <ChatWindow messages={messages} onSendMessage={() => {}} />
}
```

## Message Presentation

- `Message` supports markdown, citations, inline code, and nested tool traces.
- `StreamingMessage` shows token-by-token output with typing indicators.
- `MessageActions` surfaces reactions, copy, and retry affordances.

## System Controls

- `ModelSelector` lets operators toggle between foundation models or fine-tunes.
- `TemperatureSlider` exposes tuning for creativity versus determinism.
- `SafetyPanel` aggregates moderation and policy outcomes before publishing a reply.

## Operational Widgets

- `ConversationTimeline` visualises turns, tool calls, and agent state.
- `FollowUpSuggestions` seeds the user with context-aware prompts.
- `SessionSummary` packages transcripts for downstream analytics.

## Next Steps

- Explore the Storybook catalog locally (`npm run storybook`, then visit `http://localhost:6006`) for live component examples.
- Review the [Message Handling](/guide/messages) guide for data modeling best practices.
- Consult the [Customization](/guide/customization) guide to align components with your brand.
