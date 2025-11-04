# Vercel AI SDK × Clarity Sample Repo Plan

## 1. Objectives
- Publish an open-source Next.js example demonstrating Vercel’s AI SDK wired directly into Clarity components.
- Provide a copy/paste starting point covering streaming chat, tool invocations, attachments, safety, analytics, and persistence.
- Serve as canonical proof of parity + differentiation for sales, marketing, and developer relations.

## 2. Target Experience
- **Framework:** Next.js 14 (App Router) with TypeScript.
- **Deployment:** Vercel-ready. Include `vercel.json` and environment variable instructions.
- **LLM Providers:** Default OpenAI (via `@ai-sdk/openai`), with optional Anthropic toggle.
- **Key Flows:**
  - Real-time streaming chat using `streamText` → Clarity `ChatWindow`.
  - Tool invocation example (e.g., weather lookup) rendered via `ToolInvocationCard`.
  - Attachment upload (PDF + image) using `AdvancedChatInput` and storage stub (Upstash/S3 mock).
  - Safety sidebar showing PII detection results from Clarity safety module.
  - Analytics dashboard view using Clarity analytics with Vercel trace IDs.

## 3. Repository Layout
```
vercel-clarity-sample/
├─ app/
│  ├─ api/
│  │  ├─ chat/route.ts          # streamText endpoint
│  │  └─ tools/weather.ts       # example tool handler
│  ├─ assistant/
│  │  └─ page.tsx               # createAI + ChatWindow integration
│  ├─ layout.tsx
│  └─ page.tsx                  # main chat experience
├─ components/
│  ├─ ChatExperience.tsx        # combines ChatWindow + AdvancedChatInput
│  └─ ToolEvents.tsx
├─ lib/
│  ├─ attachments.ts            # map experimentalAttachments → MessageAttachment
│  ├─ assistant.ts              # createClarityAssistant wrapper (when ready)
│  ├─ analytics.ts              # withAITracing → Clarity analytics adapter
│  └─ prisma/
│     └─ schema.prisma          # conversation, message, attachment models
├─ scripts/
│  └─ seed.ts                   # optional demo data
├─ public/
├─ README.md
└─ package.json
```

## 4. Implementation Tasks
1. **Bootstrap Next.js project** with Turborepo integration (optional) or standalone repo.
2. **API Routes**:
   - `app/api/chat/route.ts` using `streamText` and tool map.
   - Tool handler(s) returning mocked data for deterministic demos.
3. **Client Components**:
   - `ChatExperience` hooking `useChat` to Clarity components.
   - `ToolEvents` to display tool call status.
   - `SafetyPanel` using Clarity safety outputs.
4. **Persistence Layer**:
   - Prisma + SQLite (for local) with optional Postgres instructions.
   - Seed script and migrations.
5. **Attachments**:
   - Implement file upload pipeline (local temp storage or S3 placeholder).
   - Map attachments to Clarity preview components.
6. **Analytics Integration**:
   - Wrap `streamText` with `withAITracing` and forward span IDs to Clarity analytics provider.
   - Render minimal dashboard page.
7. **Testing**:
   - Vitest unit tests for lib functions.
   - Playwright scenario covering chat, tool call, attachment, safety indicator.
8. **Docs & Enablement**:
   - Detailed README with setup steps, env variables, and feature overview.
   - Link to integration guide, positioning doc, and roadmap.

## 5. Timeline & Milestones
- **Week 1:** Repo scaffolding, API routes, basic chat UI streaming.
- **Week 2:** Tool invocation, attachments, safety hooks.
- **Week 3:** Analytics bridge, persistence wiring, testing harness.
- **Week 4:** Polish (docs, CI, deployment), publish blog/Twitter announcement.

## 6. Resources & Owners
- **Tech Lead:** Runtime Experience squad lead.
- **Frontend:** 1 engineer from Components squad for UI wiring.
- **Backend:** 1 engineer for persistence + tool integrations.
- **DX/Docs:** 1 technical writer to own README/tutorial.
- **Designer:** Review theming & accessibility compliance.

## 7. Risks & Mitigations
- **Vercel API changes:** Pin SDK version; monitor release notes weekly.
- **LLM provider quotas:** Use staging keys and provide fallback `mock` mode.
- **Attachment storage complexity:** Start with in-memory/local for demo, document production options.
- **Analytics beta access:** Secure credentials early; provide graceful fallback if tracing unavailable.

## 8. Launch Checklist
- [ ] Repo public with MIT license and contribution guide.
- [ ] GitHub Actions running lint/test/build on PRs.
- [ ] Storybook story or video walkthrough embedded in README.
- [ ] Cross-link from Clarity docs (`integration-guide`, feature matrix) and marketing site.
- [ ] Announce via blog post + social + customer newsletter.

