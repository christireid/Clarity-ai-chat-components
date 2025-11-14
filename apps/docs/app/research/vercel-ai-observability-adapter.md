# Vercel `withAITracing` → Clarity Analytics Adapter Plan

## Objectives
- Capture tracing data emitted by Vercel AI SDK (`withAITracing`, `instrumentOpenAI`) and forward it into Clarity’s analytics pipeline.
- Expose consistent metrics (latency, token usage, model/provider, tool invocations) inside `@clarity-chat/analytics` dashboards and `UsageDashboard` component.
- Support both server action flows (`createClarityAssistant`) and traditional API routes.

## Data Flow Overview
1. **Server Layer**
   - Developers wrap `streamText` or assistant actions with Vercel’s `withAITracing` helper.
   - The helper emits spans via `onTrace` callback (requires Vercel AI Observability beta) containing metadata: `traceId`, `model`, `provider`, `elapsed`, `tokenUsage`, `toolCalls`.
   - The adapter normalizes these spans into Clarity analytics events with schema:
     ```ts
     type AITraceEvent = {
       traceId: string
       conversationId?: string
       userId?: string
       model: string
       provider: string
       latencyMs: number
       promptTokens?: number
       completionTokens?: number
       totalTokens?: number
       toolCalls?: Array<{ name: string; latencyMs?: number; status: 'success' | 'error' }>
       timestamp: string
       metadata?: Record<string, any>
     }
     ```
   - Events are emitted via Clarity analytics provider (`analytics.track('ai.trace', event)`).
2. **Client Layer**
   - `UsageDashboard` and new summary widgets consume the normalized events via analytics context, enabling live latency charts, token burn tables, and tool success rates.

## Adapter API Sketch
```ts
import { withClarityTracing } from '@clarity-chat/analytics/vercel'

export const POST = withClarityTracing(async (req) => {
  const body = await req.json()

  const response = await streamText({
    model: openai({ model: 'gpt-4o' }),
    messages: body.messages,
  })

  return response.toAIStreamResponse()
})
```

Options include:
- `conversationId`, `userId` resolvers for correlating traces with Clarity state.
- `analytics` override allowing custom event consumers.
- `disabled` flag for dev environments.

## Implementation Steps
1. **Server Utility** (`packages/react/src/analytics/vercel-tracing.ts`)
   - Provide `withClarityTracing(handler, options?)` higher-order function that wraps Next.js Route Handler / server action.
   - Inside, call `withAITracing` if available; otherwise fallback to passthrough.
   - Normalize `trace` payload to `AITraceEvent`, derive conversation/user IDs via resolver callbacks.
   - Emit event using `useAnalytics().track` (server-safe) or direct provider invocation.
2. **Analytics Schema Update**
   - Extend analytics event types to include `ai.trace` with strongly typed payload.
   - Update `UsageDashboard` to visualize new metrics (latency line chart, token usage table).
3. **Documentation & Guides**
   - Add adapter section to integration guide referencing new helper.
   - Provide sample instrumentation in the upcoming public repo plan.
   - Update marketing positioning with observability capabilities.
4. **Testing**
   - Unit tests: mock `withAITracing` spans, ensure normalized events match schema.
   - Integration test (Playwright) verifying latency metrics render in dashboard when streaming conversation.
   - Fallback behavior when Vercel Observability not enabled.

## Timeline
- Week 1: Implement utility + tests, extend analytics types.
- Week 2: Dashboard updates, documentation, sample repo wiring.

## Risks & Mitigations
- **Beta API changes**: encapsulate Vercel trace format behind adapter; version guard to avoid runtime crashes.
- **Performance overhead**: ensure event emission is async/non-blocking; batch analytics calls if necessary.
- **Privacy**: scrub sensitive message content before logging (emit counts/IDs only).

