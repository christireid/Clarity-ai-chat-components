# MASTER CONTEXT FILE — Clarity Chat

> **STATUS**: Phase 4 (Engineering Task Breakdown)
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

### Known Issues / Risks
*   **Complexity**: `packages/react` is very large. Risk of tight coupling between UI and Logic.
*   **Dependencies**: Heavy reliance on specific AI SDK versions. `useClarityChat` has a hard dependency on `@clarity-chat/memory`.
*   **Testing**: `__tests__` folders exist, but coverage needs verification. Build/Test times are slow in sandbox.
*   **State Management**: Use of Context for "Token Budget" might cause re-render issues in large apps.

### Security
*   **Keys**: API keys handled in `.env.local` (good), but client-side leakage risk needs monitoring.
*   **Safety**: `packages/react/src/safety` exists, needs audit.

---

## D) Competitive Intel Section (Updated Phase 1)

### TanStack AI
*   **Philosophy**: "Headless", "Type-safe", "Framework-agnostic".
*   **Architecture**: Isomorphic tools (define once, run anywhere). Separation of logic from UI.
*   **Comparison**: TanStack is Headless-First. Clarity is UI-First (Batteries Included).

### Positioning
*   **We Win If**: Users want a "Drop-in", beautiful, production-ready chat interface with Enterprise features (RAG/Security) out of the box. We are the "UI Layer" that sits on top of the logic.
*   **We Lose If**: Users want 100% control over the DOM and find our components too opinionated/heavy. Or if TanStack ships superior headless components that we don't integrate with.

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

### Phase 2: Strategy + Product Plan (COMPLETE)
*   [x] **Strategy**: "The Beautiful, Enterprise-Ready UI Layer". Position as the "Shadcn for AI" (Copy-paste-able, beautiful) powered by a robust "Headless Core".
*   [x] **Priorities**:
    1.  **Headless Core Verification**: Ensure `packages/react/src/core.ts` is truly decoupled.
    2.  **Enterprise RAG Template**: Build the flagship demo that shows off RAG + Security + Analytics.
    3.  **Docs Refinement**: Highlight "Enterprise" and "Security" more prominently.

### Phase 3: Second Research Pass (Market/Patterns) (COMPLETE)
*   [x] 50+ Resources review (Focus on "AI Chat UI Patterns" and "RAG UI").
*   [x] Refine implementation patterns for RAG UI (citations, sources, confidence scores).

### Phase 4: Engineering Task Breakdown (CURRENT)
*   [ ] **Task 1: Headless Core Extraction**
    *   **Finding**: `useClarityChat` depends on `memory`. `useChatEnhanced` (the true headless hook) is NOT exported publicly.
    *   **Action**: Export `useChatEnhanced` as `useHeadlessChat` from `@clarity-chat/react`.
    *   **Verification**: Create a test for `useHeadlessChat` that runs without memory mocks.
*   [ ] **Task 2: Enterprise RAG Template**
    *   Create `apps/examples/enterprise-rag`.
    *   Implement "Citation UI" pattern.
    *   Implement "Confidence Score" UI.
*   [ ] **Task 3: Documentation Update**
    *   Update `docs/getting-started.md` to mention Headless mode.

### Phase 5+: Implementation
*   [ ] Execution loops.

---

## Change Log
*   **2025-12-19**: Initial creation of Master Context File. (Phase 0)
*   **2025-12-19**: Phase 4 In Progress. Discovered `useChatEnhanced` needs to be exported for true headless support. (Architect)
