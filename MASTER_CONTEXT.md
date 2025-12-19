# MASTER CONTEXT FILE — Clarity Chat

> **STATUS**: Phase 5 (Post-Review Implementation Complete)
> **LAST UPDATED**: 2025-12-19
> **OWNER**: Senior Product Manager (AI Agent)

## Non-Negotiable Operating Rules

1.  **Master Context File is law.** Everyone updates it as they learn things, implement things, or discover risks. No knowledge lives only in someone’s head or scattered notes.
2.  **No “plan-only” outcomes.** Every plan must become concrete tasks and implemented code (unless blocked by explicit constraints documented here).
3.  **Evidence-driven.** All claims (competitive, technical, market) must cite the evidence source (URL, doc section, code path, benchmark, or repro steps).
4.  **No fluff.** Prefer specifics: file paths, API shapes, example usage, performance implications, edge cases, and acceptance tests.
5.  **Keep what marketing/docs need.** If something is removed from the public API, preserve internal/demo/docs-site components as needed and document how they’re used.
6.  **No superfluous code.** Identify unused code, dead exports, redundant abstractions, and remove/refactor them safely with tests.
7.  **MANDATORY REGRESSION TESTS.** No phase can merge unless it includes at least one new regression test that would have failed before the phase.

---

## A) Product + Repo Context

### Product Identity
**Clarity Chat** is a comprehensive AI chat framework providing production-ready templates, tools, and examples for building modern AI applications with OpenAI, Anthropic, and Google AI.
**Target Audience**: React developers building AI applications (SaaS, internal tools, enterprise).
**Monetizable Promise**: drastically reduces the time to build high-quality, production-ready AI chat interfaces with enterprise features (RAG, analytics, safety).

### Tech Stack
*   **Monorepo**: Turborepo + PNPM (Use `npx pnpm` in this environment)
*   **Framework**: Next.js 15 (App Router) for Apps/Docs
*   **Core Library**: React + TypeScript 5.9.3 (Strict)
*   **Styling**: Tailwind CSS 3.4.0
*   **AI SDKs**: OpenAI, Anthropic, Google Generative AI
*   **Build**: tsup (for packages), Next.js build
*   **Testing**: Vitest (apps/docs), Playwright (e2e)

### Repo Map
*   **`/packages/react`**: Core `@clarity-chat/react` library. Main entry point for consumers.
*   **`/packages/primitives`**: Base UI components and hooks (Radix-like).
*   **`/packages/token-optimization`**: Logic for token budgeting, caching, and cost analysis.
*   **`/packages/memory`**: `@clarity-chat/memory` for context and session management.
*   **`/packages/cli`**: `@clarity-chat/cli` for scaffolding.
*   **`/packages/utils`**: Shared utilities (formatting, validation, async tools).
*   **`/apps/docs`**: Documentation site (Next.js).
*   **`/apps/examples`**: Example implementations (Multi-provider, RAG, etc.).
*   **`/.context`**: Existing project documentation (Architecture, Overview).

### Architecture
*   **Client-Side**: React components consume hooks which interface with AI providers.
*   **Server-Side**: Next.js API routes (in apps) handle streaming and key protection.
*   **State Management**: React Context (`TokenBudgetContext`, `ThemeContext`) + Hooks.
*   **Data Flow**: Components -> Hooks -> API Clients -> LLM Providers.

### Public API Surface (Inventory)
Based on `@clarity-chat/react` exports:
*   **`.` (Main)**: `ClarityChat`, `ClarityChatPresets`, `ThemeProvider`, `useClarityChat`.
*   **`./core`**: Core logic and providers without heavy UI.
*   **`./animations`**: Framer Motion wrappers and animation variants.
*   **`./analytics`**: Hooks and providers for cost/token tracking.
*   **`./memory`**: Memory strategies (Window, Summary, Vector).
*   **`./adapters`**: Model adapters for OpenAI, Anthropic, Google.
*   **`./prompt`**: Prompt optimization and template utilities.
*   **`./utils`**: Public helper functions.
*   **`./test-utils`**: Testing helpers for consumers.

---

## B) Full Inventory + Index

### Feature List (Current)
*   **Multi-Provider Support**: OpenAI, Anthropic, Google.
*   **Streaming**: Real-time token streaming, SSE.
*   **RAG**: Document upload, semantic search.
*   **Analytics**: Token cost calculation, dashboard.
*   **UI Components**: Comprehensive set of chat UI elements (input, message, code blocks).
*   **Enterprise**: SSO, RBAC, Multi-tenancy (in `packages/react/src/enterprise`).
*   **Safety**: PII detection, Jailbreak prevention.

### Component Inventory (Partial - `packages/react`)
*   **`ClarityChat`**: Main entry point.
*   **`ChatWindow`**: The chat interface container.
*   **`MessageList`**: Renders list of messages.
*   **`ChatInput`**: Input area with attachments/voice.
*   **`TokenCostPreview`**: Displays estimated cost.
*   **`ThemeCustomizer`**: Theming engine.

### Extensibility Points
*   **Providers**: `AIProvider`, `AnalyticsProvider`.
*   **Adapters**: `packages/react/src/adapters` (OpenAI, Anthropic, Google).
*   **Memory**: `packages/react/src/memory`.

---

## C) Quality + Risk Ledger

### Mitigated Risks
*   **Complexity**: `packages/react` complexity reduced by Headless extraction.
*   **State Management**: `TokenBudgetProvider` optimized to split Volatile (Usage) vs Stable (Config) state to prevent unnecessary re-renders.
*   **Security**: Added runtime check in `useClarityChat` to detect and block client-side API key leakage (`sk-...`).

### Known Issues / Risks
*   **Dependencies**: Heavy reliance on specific AI SDK versions.
*   **Testing**: `__tests__` folders exist, but coverage needs verification. Build/Test times are slow in sandbox.

---

## D) Competitive Intel Section (Updated Phase 1)

### TanStack AI
**Source**: `tanstack.com/ai`, `tanstack.com/blog/tanstack-ai-alpha-your-ai-your-way`
*   **Philosophy**: "Headless", "Type-safe", "Framework-agnostic".
*   **Architecture**: Isomorphic tools (define once, run anywhere). Separation of logic from UI.
*   **Planned Features**: Headless UI components ("Radix for AI").
*   **DX**: Heavy emphasis on TypeScript inference and Zod validation for tools.

### Comparison Matrix

| Feature | Clarity Chat | TanStack AI | Vercel AI SDK |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | **Full UI Library** (Styled) | **Headless Logic** (Unstyled) | **Full Stack** (Next.js focus) |
| **UI Approach** | "Mantine/Shadcn for AI" | "Radix for AI" (Planned) | `v0` components / Headless hooks |
| **Components** | 200+ (Styled, Themed) | 0 (Currently, planned Headless) | Basic (via AI SDK UI) |
| **Provider Support** | Multi (via Adapters) | Multi (Agnostic Adapters) | Multi (Core focus) |
| **Enterprise** | **Yes** (RAG, Security, Analytics) | No (Focus on DX/Tools) | Yes (via Vercel Platform) |
| **Tooling** | Strong (Token Opt, Safety) | Strong (Type-safe Tools) | Strong (Stream Data) |

### Positioning
*   **We Win If**: Users want a "Drop-in", beautiful, production-ready chat interface with Enterprise features (RAG/Security) out of the box. We are the "UI Layer" that sits on top of the logic.
*   **We Lose If**: Users want 100% control over the DOM and find our components too opinionated/heavy. Or if TanStack ships superior headless components that we don't integrate with.

### Risks
*   **TanStack Headless UI**: Once released, it could obsolete our internal logic if ours is not as flexible.
*   **Vercel AI SDK UI**: They are moving into UI components (v0).

---

## F) Implementation Patterns (Research Findings)

### RAG UI Best Practices
*   **Source Transparency**: Always show citations. Group them by relevance.
*   **Confidence Scores**: Display confidence level (High/Medium/Low) for enterprise users.
*   **Feedback Loops**: Allow thumbs up/down on specific citations to improve the RAG pipeline.

### Streaming UX
*   **Optimistic UI**: Show "Searching..." or "Thinking..." steps before the text stream starts.
*   **Partial Failure**: If stream fails, allow retry of *just* that message (idempotency).
*   **Latency Masking**: Use skeleton loaders or "typing" indicators during tool calls.

---

## E) The Plan (Living)

### Phase 0: Architect-Led Repo Understanding (COMPLETE)
*   [x] Audit project structure.
*   [x] Create Master Context File.
*   [x] Verify build/test commands (Requires `npx pnpm`).
*   [x] Map public API vs internal usage detail.

### Phase 1: Deep Competitive Research (TanStack AI) (COMPLETE)
*   [x] Deep dive TanStack AI (features, architecture, DX).
*   [x] Compare vs Clarity Chat.
*   [x] Identify gaps and "leapfrog" opportunities.

### Phase 2: Strategy + Product Plan (COMPLETE)
*   [x] **Strategy**: "The Beautiful, Enterprise-Ready UI Layer". Position as the "Shadcn for AI" (Copy-paste-able, beautiful) powered by a robust "Headless Core".
*   [x] **Priorities**:
    1.  **Headless Core Verification**: Ensure `packages/react/src/core.ts` is truly decoupled.
    2.  **Enterprise RAG Template**: Build the flagship demo that shows off RAG + Security + Analytics.
    3.  **Docs Refinement**: Highlight "Enterprise" and "Security" more prominently.
*   [x] **Pricing**: Open Source Core. Paid "Pro" Templates (SaaS Kits).

### Phase 3: Second Research Pass (Market/Patterns) (COMPLETE)
*   [x] 50+ Resources review (Focus on "AI Chat UI Patterns" and "RAG UI").
*   [x] Refine implementation patterns for RAG UI (citations, sources, confidence scores).

### Phase 4: Engineering Task Breakdown (COMPLETE)
*   [x] **Task 1: Headless Core Extraction**
    *   [x] Verify `packages/react/src/core.ts` dependencies.
    *   [x] Ensure it can be used without `packages/primitives` (UI agnostic).
    *   [x] Create a test case that uses *only* core logic (`packages/react/src/__tests__/headless-chat.test.tsx`).
*   [x] **Task 2: Enterprise RAG Template**
    *   [x] Create `apps/examples/enterprise-rag` (Existed).
    *   [x] Implement "Citation UI" pattern.
    *   [x] Implement "Confidence Score" UI.
    *   [x] Implement "Feedback Loops" (Thumbs up/down).
*   [x] **Task 3: Documentation Update**
    *   [x] Update `docs/getting-started.md` to mention Headless mode.

### Phase 5: Implementation & Review Loops (COMPLETE)
*   [x] **Review Loop 1 (QA)**:
    *   Headless mode verified via `headless-chat.test.tsx` (Passed).
    *   Dependencies verified (minimal imports).
    *   **Finding**: Headless implementation is clean and isolated.
*   [x] **Review Loop 2 (UI/UX)**:
    *   Enterprise RAG Template updated with Confidence Badges and Citations.
    *   Feedback loops added (Thumbs up/down buttons).
    *   **Finding**: UI follows "Source Transparency" best practice.
*   [x] **Review Loop 3 (GTM)**:
    *   Documentation updated to highlight "Headless Mode" for power users.
    *   **Finding**: This addresses the "too opinionated" objection from competitive analysis.

### Phase 6: Risk Mitigation & Enhancement (COMPLETE)
*   [x] **Fix State Management**: Optimized `TokenBudgetProvider` to prevent unnecessary re-renders.
*   [x] **Fix Security Risk**: Added client-side API key detection check.
*   [x] **Enhance Docs**: Added `docs/architecture/headless-vs-styled.md`.
*   [x] **Enhance Testing**: Added `tests/e2e/rag-template.spec.ts`.

---

## Change Log
*   **2025-12-19**: Initial creation of Master Context File. (Phase 0)
*   **2025-12-19**: Phase 0 Complete. Updated Repo Map, Tech Stack, and Public API Inventory. (Architect)
*   **2025-12-19**: Phase 1 Complete. Added Competitive Intel and Comparison Matrix. (PM/Research)
*   **2025-12-19**: Phase 2 Complete. Defined "Shadcn for AI" Strategy. (Strategy)
*   **2025-12-19**: Phase 3 Complete. Added Implementation Patterns for RAG/Streaming. (Research)
*   **2025-12-19**: Phase 4 Complete. Verified Headless Core functionality, Enhanced RAG Template, Updated Docs. (Engineering)
*   **2025-12-19**: Phase 5 Complete. Review loops finished. Final Convergence Review executed. (All)
*   **2025-12-19**: Phase 6 Complete. Risks mitigated (Performance, Security) and Enhancements implemented (Docs, E2E). (Engineering)
