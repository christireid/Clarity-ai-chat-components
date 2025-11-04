# Clarity vs. Vercel AI SDK — Positioning Guide

## 1. Audience & Context
- **Primary buyers:** Heads of Product, Engineering Directors, and Platform Leads already building on Vercel or evaluating modern AI chat stacks.
- **Secondary influencers:** Developer Experience teams and Design Systems leads responsible for UI cohesion and compliance.
- These teams likely prototyped with Vercel’s AI SDK but stalled when they had to design production-ready chat UI, safety guardrails, and analytics.

## 2. Narrative Arc
1. **Acknowledge momentum:** “Vercel’s AI SDK is the fastest way to wire LLMs into your app.”
2. **Expose the gap:** “It stops at the transport layer—no UI, no safety net, no analytics.”
3. **Present Clarity:** “Clarity delivers the missing 80%: polished chat surfaces, enterprise controls, and insight tooling.”
4. **Close with partnership:** “You keep the Vercel foundation. We snap in on top and reduce time-to-production by weeks.”

## 3. Core Value Pillars
- **Production-Ready Experiences:** Ship premium chat UI out-of-box (`ChatWindow`, `AdvancedChatInput`, `MessageList`, `ToolInvocationCard`).
- **Enterprise Guardrails:** Built-in PII detection, RBAC, quotas, audit trails, and safety dashboards.
- **Full-Funnel Insights:** Usage analytics, latency monitors, CSAT tracking, and feedback loops without adding third-party tooling.
- **Composable & Interoperable:** Works with Vercel `useChat`, `streamText`, `createAI`; zero lock-in when extending provider coverage (OpenAI, Anthropic, Google, Bedrock, etc.).
- **Developer Velocity:** Storybook, CLI, VS Code extension, and ready-made templates turn prototypes into production.

## 4. Proof Points & Assets
- Competitive matrix already highlighting Clarity’s enterprise coverage versus Vercel’s headless SDK. See `apps/docs-site/components/Diagrams/FeatureMatrix.tsx` for visuals.
- Integration playbook in `docs/research/vercel-ai-sdk-integration-guide.md` demonstrates copy/paste migration.
- Safety modules (`packages/react/src/safety`) and analytics stack (`packages/react/src/analytics`) provide tangible differentiators.
- Customer proof: cite pilot teams reducing build time by 4–6 weeks when replacing bespoke Tailwind scaffolding.
- Feature audit reference: `docs/research/vercel-ai-sdk-feature-audit.md` summarizes parity and action items.
- Sample repo plan: `docs/research/vercel-ai-sdk-sample-repo-plan.md` outlines public showcase scope.

## 5. Messaging Headlines
- **“Keep Vercel’s engine. Add Clarity’s cockpit.”**
- **“From prototype to production in days, not sprints.”**
- **“Enterprise trust layered on top of your existing AI SDK stack.”**
- **“Beautiful chat UI, compliance, and analytics — ready the same day.”**

## 6. Objection Handling
| Objection | Response | Asset |
| --- | --- | --- |
| “We already use Vercel AI SDK” | Clarity complements it. Plug our UI and safety components into your existing `/api/chat` route without replatforming. | Integration guide, sample code |
| “We can build the UI ourselves” | Teams underestimate the effort for accessibility, theming, streaming states, attachments, and governance. Clarity ships these with battle-tested components. | Feature matrix, Storybook demos |
| “We need guardrails and compliance” | Vercel offloads safety to the model vendor. Clarity adds PII detection, audit logs, and RBAC controls mapped to your tenants. | Safety docs, audit modules |
| “We want to stay flexible with models” | Clarity adapters sit on top of the same provider ecosystem (OpenAI, Anthropic, Google, Bedrock). We integrate with your existing SDK usage. | Adapter docs, `useStreamingSSE` | 

## 7. Competitive One-Liner
> “Vercel AI SDK connects you to the model. Clarity turns that connection into a polished, governable product.”

## 8. Call to Action Options
- **Fast lane:** “Install @clarity-chat/react and follow the Vercel integration guide to launch in < 2 hours.”
- **Enterprise lane:** “Book a design audit; we’ll map your SDK usage and drop in compliance-ready components.”
- **Expansion lane:** “Activate analytics and safety modules to unlock exec dashboards custom-tailored to AI chat.”

## 9. Enablement Checklist
- [ ] Update sales deck with new positioning headline and matrix slide.
- [ ] Publish a blog/tutorial highlighting the copy/paste migration from Vercel’s sample app.
- [ ] Prepare price justification comparing Clarity vs. building UI/guardrails internally (time-to-value calculator).
- [ ] Record a 5-minute Loom walkthrough of the integration guide for async sharing.

## 10. Key Metrics to Track Post-Launch
- Win rate against teams defaulting to Vercel AI SDK-only builds.
- Time from kickoff to first production conversation UI after adopting Clarity.
- Adoption of safety/analytics modules in deals originating from Vercel ecosystems.
- Expansion revenue from teams layering Clarity on top of existing Vercel usage.

