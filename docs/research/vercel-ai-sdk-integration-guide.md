# Clarity × Vercel AI SDK Integration Guide

> **Goal:** pair Vercel’s server-side AI primitives with Clarity’s production-ready component library so teams can ship polished chat experiences without rebuilding UI, safety, or analytics from scratch.

## 1. Prerequisites
- Next.js 14+ (App Router) or Pages Router with API routes
- Vercel AI SDK (`ai` package) and provider adapters (`@ai-sdk/openai`, `@ai-sdk/anthropic`, etc.)
- Clarity React package (`@clarity-chat/react`) and peer dependencies (`react`, `react-dom`)
- Environment variables for your chosen LLM provider(s)

### Install dependencies

```bash
npm install ai @ai-sdk/openai @clarity-chat/react
```

If you plan to use advanced analytics or safety modules, add:

```bash
npm install @clarity-chat/analytics @clarity-chat/safety
```

## 2. Server: Streaming Chat Endpoint (App Router)

Vercel’s documentation centers on `streamText`. Keep that logic intact and focus on emitting responses Clarity can consume.

```ts
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages, attachments } = await req.json()

  const stream = await streamText({
    model: openai({ model: 'gpt-4.1' }),
    messages,
    tools: {
      // Optional tool definitions mirrored in the UI via ToolInvocationCard
    },
    experimental_attachments: attachments,
  })

  return stream.toAIStreamResponse()
}
```

For Pages Router, export a handler using `StreamingTextResponse`.

## 3. Client: Minimal Chat Surface

Use Vercel’s `useChat` hook to orchestrate message flow, then render Clarity’s components. This snippet intentionally mirrors the “basic chat” example from Vercel’s docs so teams can copy/paste.

```tsx
'use client'

import { useChat } from 'ai/react'
import {
  ChatWindow,
  AdvancedChatInput,
  ThinkingIndicator,
} from '@clarity-chat/react'

export function AssistantExperience() {
  const {
    messages,
    append,
    isLoading,
    stop,
    input,
    setInput,
  } = useChat({ api: '/api/chat' })

  return (
    <div className="flex h-full flex-col gap-3">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        aiStatus={isLoading ? 'thinking' : undefined}
        onSendMessage={(content) => append({ role: 'user', content })}
        onMessageRetry={(id) => stop(id)}
        showHeader
        showMessageCount
        onClear={() => window.location.reload()}
        headerActions={<ThinkingIndicator status={isLoading ? 'thinking' : 'ready'} />}
      />

      <AdvancedChatInput
        value={input}
        onChange={setInput}
        onSubmit={(value) => append({ role: 'user', content: value })}
        placeholder="Ask me anything…"
        maxFiles={5}
        onFileUpload={async (files) => uploadAttachments(files)}
      />
    </div>
  )
}
```

`uploadAttachments` should POST to your storage or directly to the chat endpoint. The Clarity `AdvancedChatInput` collects metadata and pipes it into `experimentalAttachments` automatically when you append messages.

## 4. Attaching Files & Rich Context

1. Use `FileUpload` (dropzone) for bulk attachments or rely on the built-in picker from `AdvancedChatInput`.
2. Transform Vercel’s `experimentalAttachments` into Clarity’s `MessageAttachment` (id, name, type, size, url) before passing them to `ChatWindow`.

```ts
import type { MessageAttachment } from '@clarity-chat/types'

function mapAttachment(att: any): MessageAttachment {
  return {
    id: att.id ?? crypto.randomUUID(),
    name: att.name,
    type: att.contentType,
    size: att.size ?? 0,
    url: att.url,
  }
}
```

Expose attachments via the `messages` array you feed Vercel; the Clarity UI will render previews and download buttons automatically.

## 5. Server Actions & `createAI`

When adopting Vercel’s App Router helpers (`createAI`, `createAssistant`), keep state on the server and stream updates into Clarity’s UI.

```ts
// app/actions/assistant.ts
import { createAI } from 'ai/rsc'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const ai = createAI({
  actions: {
    async reply(state, message) {
      return streamText({
        model: openai({ model: 'gpt-4.1-mini' }),
        messages: [...state.messages, message],
      })
    },
  },
  initialAIState: {
    messages: [],
  },
})
```

Client usage with Clarity hooks:

```tsx
import { useActions, useAIState } from 'ai/rsc'
import { ChatWindow } from '@clarity-chat/react'

export function AssistantRSC() {
  const { messages } = useAIState()
  const { reply } = useActions()

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => reply({ role: 'user', content })}
      isLoading={messages.at(-1)?.status === 'streaming'}
    />
  )
}
```

This keeps Vercel’s optimistic updates while leveraging Clarity’s UI.

## 6. Tool Invocation & Agent Runs

Vercel emits `tool_call` deltas. Map them into Clarity components for visibility:

```tsx
import { ToolInvocationCard } from '@clarity-chat/react'

function ToolEvents({ toolInvocations }) {
  return toolInvocations.map((tool) => (
    <ToolInvocationCard
      key={tool.id}
      name={tool.name}
      status={tool.status}
      arguments={tool.arguments}
      result={tool.result}
    />
  ))
}
```

Hook this into `useChat`’s `onResponse` callback or the server action by parsing the event stream.

## 7. Safety, Moderation & Compliance

Vercel defers moderation to the underlying model. Clarity layers additional protections:

- `@clarity-chat/safety` provides PII detection, toxicity scoring, and escalation hooks.
- `SafetyStatusCard` visualizes guardrail results beside each transcript entry.
- `@clarity-chat/audit` logs conversations with tenant, actor, and risk metadata for compliance reviews.

Integrate the middleware inside your API route before calling `streamText` and surface results via custom message metadata that Clarity components display.

## 8. Analytics & Observability

Pair Vercel’s `withAITracing` and Clarity analytics to capture full-funnel insights:

1. Wrap your `streamText` call with `withAITracing` to emit provider-level spans.
2. In the client, render `UsageDashboard`, `ResponseQualityMeter`, and custom metrics using `@clarity-chat/analytics`.
3. Forward Vercel’s trace IDs to Clarity’s analytics pipeline to correlate API latency with user satisfaction scores.

## 9. Multi-Tenancy & RBAC

Leverage Clarity’s built-in modules to cover enterprise requirements that Vercel leaves bespoke:

- `@clarity-chat/multi-tenancy` to partition conversations by workspace or customer.
- `@clarity-chat/rbac` to restrict sensitive tools to privileged roles.
- `@clarity-chat/quotas` to enforce usage caps per tenant and surface warning banners via `SettingsPanel`.

## 10. Testing & Hardening Checklist
- Unit test API routes with mock `streamText` emitters to guarantee attachments and tool payloads are forwarded correctly.
- Snapshot Clarity components using Storybook or Vitest to ensure UI integrations remain stable across provider changes.
- Run end-to-end tests (Playwright) to verify streaming, retry, and attachment flows.
- Add logging for SSE disconnects; Clarity’s `useStreaming*` hooks expose retry helpers.

## 11. Troubleshooting Quick Reference
- **Messages duplicate**: ensure you only append once per `delta` event; Clarity’s `MessageList` will merge updates when message IDs remain stable.
- **Attachments missing**: confirm the API route returns `experimental_attachments` per message. Map them into `MessageAttachment[]` before passing to `ChatWindow`.
- **Tool UI not updating**: parse `tool` events in `onResponse` and update component state; Clarity does not infer tool progress automatically without those callbacks.
- **SSE errors behind proxies**: enable Vercel edge functions or fall back to WebSocket streaming using Clarity’s `useStreamingWebsocket` hook.

---

By pairing Vercel’s flexible runtime with Clarity’s opinionated UX, teams keep the provider-agnostic benefits of the AI SDK while shipping enterprise-ready chat experiences in days instead of sprints.

## Further Reading
- `docs/research/vercel-ai-sdk-feature-audit.md` — capability-by-capability coverage map.
- `docs/research/vercel-ai-sdk-competitive-analysis.md` — strategic overview, differentiators, and roadmap.
- `docs/research/vercel-ai-sdk-sample-repo-plan.md` — implementation plan for the public reference app.
- `commercial-docs/VERCEL_COMPETITIVE_POSITIONING.md` — messaging guide for sales & marketing.

