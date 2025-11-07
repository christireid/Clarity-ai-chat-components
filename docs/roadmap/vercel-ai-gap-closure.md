# Vercel AI SDK Competitive Gap Closure Plan

## 1. Objective & Success Metrics
- **Goal:** neutralize emerging differentiators in Vercel’s AI SDK while doubling down on Clarity’s enterprise strengths.
- **Primary metrics:**
  - Time-to-integrate Clarity with an existing Vercel AI project < 2 hours (measured via solution engineer playbooks).
  - ≥ 90% feature parity on SDK talking points (streamed UI, assistant server state, tool events, observability).
  - Launch of 3 public assets (integration sample repo, docs, marketing material) demonstrating parity + differentiation.

## 2. Workstreams & Deliverables

### WS1 — Streamed UI Parity
- **Deliverables:**
  - `useStreamableUI` hook mirroring Vercel’s `createStreamableUI` signature.
  - `<StreamBlock>` component composing streamed fragments into Clarity layouts.
  - Demo showcasing server-driven progressive tables/cards.
- **Owners:** Frontend Platform squad.
- **Dependencies:** Input from design systems for motion/placeholder guidelines.
- **Timeline:**
  - Design spike (1 wk)
  - Implementation + tests (2 wks)
  - Storybook/docs updates (0.5 wk)

### WS2 — Assistant Server Actions Bridge
- **Deliverables:**
  - `createClarityAssistant` wrapper around Next.js server actions aligning with Vercel’s `createAI` helpers.
  - Sample integration for optimistic UI with Clarity components.
  - Guide covering persistence (Prisma/Upstash) and multi-tenant context.
- **Owners:** Runtime Experience squad.
- **Dependencies:** Collaboration with DX docs team for tutorials.
- **Timeline:** 2 weeks implementation, 1 week documentation & QA.

### WS3 — Tool Invocation UX & Attachments
- **Deliverables:**
  - Update `ToolInvocationCard` to support nested/parallel tool calls and streaming status updates.
  - Enhance `MessageAttachment` schema with size, visibility, and preview flags aligned with Vercel’s `experimentalAttachments` payload.
  - Regression tests covering tool/attachment lifecycle.
- **Owners:** Components squad.
- **Timeline:** 1.5 weeks dev, 0.5 week QA.

### WS4 — Observability & Analytics Bridge
- **Deliverables:**
  - Adapters ingesting Vercel `withAITracing` spans into Clarity analytics events.
  - Dashboard templates showing latency, token usage, CSAT correlation.
  - CLI command or script enabling teams to enable tracing quickly.
- **Owners:** Analytics squad.
- **Dependencies:** Coordination with Vercel observability APIs (beta access).
- **Timeline:** 3 weeks (1 research, 1 build, 1 docs/QA).

### WS5 — Public Enablement Assets
- **Deliverables:**
  - Public GitHub sample: Vercel’s canonical chat demo reskinned with Clarity (CI-tested).
  - Blog/tutorial + Loom walkthrough.
  - Sales enablement updates (deck slide, pricing calculator snippet).
- **Owners:** Developer Relations + Marketing.
- **Timeline:** 2 weeks following completion of WS1–WS3.

## 3. Dependencies & Risks
- **API Stability:** Vercel’s experimental streaming APIs may change; maintain close contact with their developer relations for early warnings.
- **Resource Allocation:** Overlap with other roadmap commitments (e.g., multi-provider enhancements). Mitigate by staffing cross-functional tiger team for 6 weeks.
- **Documentation Debt:** Ensure docs team is looped in Sprint 0 to prevent lagging publications.
- **Beta Access:** Observability integration depends on Vercel’s AI tracing beta—secure access agreement upfront.

## 4. Timeline Overview

| Week | Focus |
| --- | --- |
| 1 | WS1 design spike, WS2 planning, secure observability beta |
| 2 | WS1 build, WS2 implementation, WS3 kick-off |
| 3 | WS1 testing, WS2 testing, WS3 QA, WS4 research |
| 4 | WS4 build, WS5 prep (sample repo scaffolding) |
| 5 | WS4 finalize, WS5 content creation |
| 6 | Consolidated QA, launch docs, marketing, enablement |

## 5. QA & Validation Plan
- Storybook visual regression for new components (`<StreamBlock>`, enhanced tool cards).
- Playwright flows covering streaming UI, assistant server actions, attachments, and tool events end-to-end.
- Beta customer advisory session to validate parity claims.
- Analytics instrumentation verifying tracing data reaches dashboards.

## 6. Launch Checklist
- [ ] Publish updated docs (integration guide + assistant/streaming tutorials).
- [ ] Release notes summarizing new hooks/components.
- [ ] Sales & CS enablement session covering positioning guide.
- [ ] Sample repo announced via blog/newsletter.
- [ ] Metrics dashboards pre-configured for customer onboarding.

## 7. Post-Launch Follow-Up
- Monitor adoption metrics and gather feedback tickets weekly for first quarter post-launch.
- Prioritize iterations (e.g., WebSocket feature parity, auto-summarization) based on customer interviews.
- Schedule quarterly competitive review to reassess Vercel AI SDK updates.

