# Vercel AI SDK Chat Feature Audit

> Comprehensive survey of Vercel’s AI SDK capabilities relevant to chat experiences, paired with Clarity coverage and action items.

| Area | Vercel AI SDK Capability | Details / References | Clarity Coverage | Gap / Action |
| --- | --- | --- | --- | --- |
| Core Messaging | `streamText`, `generateText` | Streaming SSE responses, incremental deltas, abort support. Docs: sdk.vercel.ai/docs | `MessageList`, `useStreaming*` handle SSE/WS | Ensure examples show direct consumption of `streamText` payloads (docs ✅) |
| Structured Outputs | `generateObject`, `streamObject` | Zod schemas, automatic retries | `ToolInvocationCard`, typed renderers; partial coverage via schema-aware components | Build sample showing structured JSON rendered in `ContextCard` |
| Tool Calling | Tool map in `streamText`, emits `tool-call` events | Requires manual event handling | `ToolInvocationCard`, `AgentRunFeed` visualize tools | Update components for nested/parallel calls (roadmap WS3) |
| UI Streaming | `createStreamableUI` | Server-driven JSX fragments | Not yet supported | WS1: deliver `useStreamableUI` + `<StreamBlock>` |
| Server Actions | `createAI`, `createAssistant` | React Server Components state | Clarity `ChatWindow` works with `useAIState` per integration guide | Ship helper `createClarityAssistant` (roadmap WS2) |
| Client Hooks | `useChat`, `useAssistant`, `useCompletion` | Handles message state, SSE, attachments | Clarity components interop via integration guide | Provide adapter snippet to map attachments to `MessageAttachment` (docs ✅) |
| Attachments | `experimentalAttachments` (files/URLs) | Multipart form data, vendor-specific metadata | `AdvancedChatInput`, `FileUpload`, `MessageAttachment` | Expand schema to include preview flags (roadmap WS3) |
| Multimodal | `generateImage`, `generateSpeech`, `streamSpeech` | TTS, image gen helpers | `MultiModalPreview`, `VoiceInput` components | Add tutorial linking these to Vercel endpoints |
| Safety | None beyond provider moderation | relies on upstream API | Clarity safety suite (PII, toxicity, overrides) | Highlight as differentiator in marketing (done) |
| Analytics | `withAITracing`, `instrumentOpenAI` | Integrates with Vercel observability (beta) | Clarity analytics dashboards, usage tracking | Build span adapters (roadmap WS4) |
| History Persistence | Example Prisma/SQLite patterns | Not provided out-of-box | `ProjectSidebar`, `ConversationTimeline` expect store | Provide sample schema + migrations in repo plan |
| Personas | Not included | N/A | `PersonaPanel`, `MemoryInspector` | Add recipe showing persona toggles syncing with Vercel state |
| Exporting | Manual | N/A | `ExportDialog`, `ChatWindow` `onExport` | Document wiring to storage |
| Feedback | Not provided | N/A | `ResponseQualityMeter`, `MessageList` feedback handlers | Show integration mapping to SDK responses |
| Retry | Abort signal only | Developer handles UI | `RetryButton`, `useChat` wrapper | Document connecting to `append` and `stop` |
| Themes | None | N/A | Theme system, dark mode, motion | Continue as differentiator |
| Accessibility | Basic sample components | No guarantees | Full WCAG 2.1 AA across components | Emphasize in docs/marketing |
| CLI / Dev Tools | Vercel CLI for deployment | No UI tooling | Clarity CLI, VSCode extension | Demo commands in enablement |

## Key Findings
- Vercel prioritizes runtime abstractions; everything above the transport/UI layer remains manual—consistent with our opportunity space.
- Attachments, tool events, and streamed UI blocks are the highest-risk gaps to close for parity narratives.
- Clarity’s enterprise modules (safety, RBAC, analytics) remain clear differentiators; ensure they are front-and-center in sales collateral.

## Follow-Up Actions
- Align roadmap WS1–WS4 with identified gaps and track progress weekly in Eng sync.
- Update docs to reference this audit alongside the integration guide for a single source of truth.
- Incorporate table into sales enablement to reinforce parity story.

## Related Documents
- `docs/research/vercel-ai-sdk-competitive-analysis.md`
- `docs/research/vercel-ai-sdk-integration-guide.md`
- `docs/research/vercel-ai-sdk-sample-repo-plan.md`
- `commercial-docs/VERCEL_COMPETITIVE_POSITIONING.md`

