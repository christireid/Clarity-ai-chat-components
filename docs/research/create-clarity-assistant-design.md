# `createClarityAssistant` Server Action Wrapper

## Goals
- Provide a thin facade over Vercel’s `createAI` / `createAssistant` helpers tailored for Clarity’s component APIs.
- Reduce boilerplate for state serialization, tool metadata, attachment handling, and persona persistence.
- Ensure parity between App Router (RSC) and traditional API route integrations.

## Proposed API
```ts
import { createClarityAssistant } from '@clarity-chat/react/server'
import { anthropic } from '@ai-sdk/anthropic'

export const assistant = createClarityAssistant({
  defaultPersona: 'support',
  tools: { scheduleCall, lookupOrder },
  storage: {
    conversations: prisma.conversation,
    messages: prisma.message,
    attachments: prisma.attachment,
  },
  model: anthropic({ model: 'claude-3-5-sonnet-20240620' }),
  safety: {
    piiDetection: true,
    allowUnsafeTools: ['lookupOrder'],
  },
})

export const { respond, updatePersona, clearConversation } = assistant.actions
```

### Options
| Option | Description |
| --- | --- |
| `model` | Required. Accepts any AI SDK model binding (`openai`, `anthropic`, etc.). |
| `tools` | Map of tool definitions; automatically exposed to Clarity `ToolInvocationCard` via metadata. |
| `storage` | Optional Prisma/DB adapters implementing CRUD interfaces. Defaults to in-memory store for prototypes. |
| `defaultPersona` | Seeds Clarity `PersonaPanel`; persisted per conversation. |
| `safety` | Toggles on-device PII detection + moderation bridging to Clarity safety components. |
| `attachments` | Configuration for automatic attachment hydration (supports experimental metadata from Vercel). |

### Returned helpers
- `assistant.actions.respond` — drop-in replacement for `createAI().actions.respond`, returns streamable message payload compatible with `useStreamableUI` / `StreamBlock`.
- `assistant.state` — typed server-side state (messages, persona, analytics metrics) synced with Clarity components.
- `assistant.withConversation(handler)` — wraps API routes or server actions ensuring multi-tenant data isolation, quotas, and audit logging.
- `assistant.observability` — surfaces `traceId`, latency, token metrics for analytics adapter.

## Implementation Outline
1. **State Container**: wrap Vercel `createAI` but extend stored state with Clarity-specific fields (persona, safety flags, analytics IDs).
2. **Tool Metadata**: intercept AI SDK tool events to capture arguments/results + render hints consumed by `ToolInvocationCard`.
3. **Attachments**: map experimental attachments to Clarity `MessageAttachment` schema; auto-fetch signed URLs if configured.
4. **Safety Pipeline**: run Clarity safety middleware before emitting model responses; attach moderation metadata for UI badges.
5. **Observability Hook**: capture AI SDK `traceId` and pass to analytics adapter.
6. **Type Inference**: expose generics for model response type + tool argument schema to propagate types through hooks/components.

## Developer Experience
- Works seamlessly with the integration guide: `useAIState` + `StreamBlock` render server responses, while fallback to `/api/chat` remains possible.
- CLI snippet: `clarity-chat add assistant --model openai:gpt-4o --tools scheduleCall`. Generates boilerplate using this wrapper.

## Open Questions
- How to balance state hydration vs. payload size in RSC? (Potential solution: streaming updates via `StreamBlock` increments.)
- Do we auto-generate Prisma schema or provide templates only? (Prefer templates + `clarity-chat prisma apply` command.)
- How aggressively should we enforce safety checks? (Default on for enterprise plan, optional for starter.)

## Next Steps
- Build storage interface abstraction (`ConversationStore`) with Prisma + Upstash adapters.
- Implement wrapper in `packages/react/src/server/create-clarity-assistant.ts` with unit + integration tests.
- Update docs + sample repo plan to include assistant usage sample.
- Coordinate with analytics adapter work to leverage emitted trace metadata.

