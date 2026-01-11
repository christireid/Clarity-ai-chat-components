# Message Operations

Empower users and operators with advanced controls for message lifecycle management.

## Editing

Use the `MessageActions` component or `useMessageOperations` hook to enable post-send edits.

```tsx
import { Message, useMessageOperations } from '@clarity-chat/react'

export function EditableMessage(props) {
  const { editMessage } = useMessageOperations({ chatId: props.message.chatId })

  return (
    <Message
      {...props}
      onEdit={async content => {
        await editMessage(props.message.id, content)
      }}
    />
  )
}
```

## Branching & Rewrites

- `createBranch` helps spawn alternative responses without losing original context.
- Use `regenerateMessage` to request a new assistant answer with updated instructions.

## Feedback Signals

Capture explicit thumbs up/down via `onFeedback` and persist results to your analytics warehouse.

## Audit Trail

Leverage `ConversationTimeline` to visualise when messages were edited, branched, or deleted. Pair with `SessionSummary` for exportable reports.

Return to the [Hooks](/guide/hooks) overview for more automation patterns.
