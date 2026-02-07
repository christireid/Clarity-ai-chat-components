# Monorepo Inventory

> Generated 2026-02-07 as part of the Staff+ consolidation audit. Branch:
> `claude/continue-work-uGkck`

---

## 1. Workspace Map

### 1.1 Packages

| #   | Package                            | Version   | Source Files | Internal Deps                     | Export Entrypoints                                                    |
| --- | ---------------------------------- | --------- | ------------ | --------------------------------- | --------------------------------------------------------------------- |
| 1   | `@clarity-chat/types`              | 1.0.0     | 15           | none (leaf)                       | 2 (`.`, `./memory`)                                                   |
| 2   | `@clarity-chat/primitives`         | 1.0.0     | 76           | none (leaf)                       | 14                                                                    |
| 3   | `@clarity-chat/utils`              | 1.0.0     | 24           | none (leaf)                       | 10                                                                    |
| 4   | `@clarity-chat/ai-infrastructure`  | 0.1.0     | 2            | none (leaf)                       | 1                                                                     |
| 5   | `@clarity-chat/license`            | 1.0.0     | 12           | none (leaf)                       | 1                                                                     |
| 6   | `@clarity-chat/typescript-config`  | 0.1.0     | 0 (JSON)     | none (leaf)                       | 4 JSON configs                                                        |
| 7   | `@clarity-chat/error-handling`     | 2.0.0     | 35           | primitives                        | 2 (`.`, `./accessibility`)                                            |
| 8   | `@clarity-chat/token-optimization` | 1.0.0     | 104          | primitives, utils                 | 4 (`.`, `./react`, `./compression`, `./cache`)                        |
| 9   | `@clarity-chat/memory`             | 0.1.0     | 65           | token-optimization, utils         | 1                                                                     |
| 10  | `@clarity-chat/dev-tools`          | 1.0.0     | 56           | utils, error-handling, primitives | 5                                                                     |
| 11  | `@clarity-chat/playground`         | 0.1.0     | 39           | error-handling, primitives        | 3                                                                     |
| 12  | `@clarity-chat/testing-utils`      | 2.0.0     | 0            | primitives (peer), react (peer)   | 2                                                                     |
| 13  | `@clarity-chat/codemods`           | 1.0.0     | 11           | react, primitives                 | 1                                                                     |
| 14  | `@clarity-chat/cli`                | 0.1.0     | 48           | utils                             | 0 (binary)                                                            |
| 15  | **`@clarity-chat/react`**          | **2.0.0** | **1,453**    | **7 packages**                    | **5** (`.`, `./extended`, `./advanced`, `./internal`, `./styles.css`) |

**Totals: 15 packages, 1,940 source files (excluding tests/stories)**

### 1.2 Apps

| App                       | Framework             | Source Files | Internal Deps                                                                                     |
| ------------------------- | --------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `apps/component-showcase` | Next.js 15 / React 19 | 88           | 8 packages (error-handling, license, memory, primitives, react, token-optimization, types, utils) |

### 1.3 Dependency Graph

```
Layer 0 (Leaves):
  types  primitives  utils  ai-infrastructure  license  typescript-config

Layer 1:
  error-handling ──► primitives
  token-optimization ──► primitives, utils

Layer 2:
  memory ──► token-optimization, utils
  dev-tools ──► utils, error-handling, primitives
  playground ──► error-handling, primitives

Layer 3 (Hub):
  react ──► license, error-handling, memory, primitives, token-optimization, types, utils

Layer 4 (Consumers):
  component-showcase ──► react + 7 direct deps
  codemods ──► react, primitives
  testing-utils ──► react (peer), primitives (peer)
  cli ──► utils
```

`@clarity-chat/react` is the hub — 74.9% of all source files (1,453 of 1,940).

---

## 2. Categorized Index

### 2.1 `@clarity-chat/react` — Internal Structure

**Export tiers:** | Tier | File | Export Lines | Purpose | |------|------|-------------|---------| |
Public | `public-api.ts` | 83 | Stable API for consumers | | Internal | `internal.ts` | 172 |
Unstable/experimental exports | | Extended | `extended.ts` | — | Extended component set | | Advanced
| `advanced.ts` | — | Advanced/power-user APIs |

**Hooks (170 files across 25 categories):**

| Category           | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `accessibility`    | Screen reader, focus management, ARIA                     |
| `agents`           | Agent orchestration hooks                                 |
| `ai`               | AI model interaction hooks                                |
| `bridges`          | Cross-framework bridges                                   |
| `chat`             | Core chat state management                                |
| `clarity-tokens`   | Token counting/management                                 |
| `connected`        | Provider-connected hooks                                  |
| `context`          | React context consumers                                   |
| `dashboard`        | Dashboard analytics hooks                                 |
| `embeddings`       | Vector embedding hooks                                    |
| `input`            | Input handling, autocomplete                              |
| `keyboard`         | Keyboard shortcuts, command palette                       |
| `memory`           | Conversation memory hooks                                 |
| `message`          | Message manipulation hooks                                |
| `model`            | Model selection/routing hooks                             |
| `performance`      | Performance monitoring hooks                              |
| `prompt-composer`  | Prompt composition hooks                                  |
| `resilience`       | Retry, circuit breaker, backoff                           |
| `security`         | Security/sanitization hooks                               |
| `storage`          | localStorage/sessionStorage hooks                         |
| `streaming`        | SSE/streaming response hooks                              |
| `theme`            | Theme switching hooks                                     |
| `token`            | Token budget hooks                                        |
| `ui`               | General UI hooks (safe timeout/interval, clipboard, etc.) |
| `use-clarity-chat` | Main facade hook                                          |

**Components (648 files across 25 categories):**

| Category           | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `ab-testing`       | A/B test variant components                             |
| `ai-ops`           | AI operations monitoring                                |
| `ai`               | AI-specific UI (avatars, typing indicators)             |
| `chat`             | Chat containers, bubbles, layouts                       |
| `clarity`          | Clarity-branded wrappers                                |
| `code`             | Code display, syntax highlighting                       |
| `context`          | Context providers                                       |
| `conversation`     | Conversation list, history                              |
| `dashboards`       | Analytics dashboards                                    |
| `demos`            | Demo/example components                                 |
| `enterprise`       | Enterprise features                                     |
| `feedback`         | Rating, feedback widgets                                |
| `input`            | Chat input, mentions, attachments                       |
| `media`            | Image/file preview                                      |
| `memory`           | Memory visualization                                    |
| `message`          | Message bubbles, actions                                |
| `navigation`       | Nav, breadcrumbs                                        |
| `pro`              | Pro/premium features                                    |
| `prompt-composer`  | Visual prompt builder                                   |
| `prompt`           | Prompt templates                                        |
| `search`           | Search UI                                               |
| `structured-input` | Form-based inputs                                       |
| `theme-components` | Theme pickers                                           |
| `token`            | Token usage display                                     |
| `tool-approval`    | Tool/function-call approval UI                          |
| `ui`               | Generic UI primitives (ErrorBoundary, CopyButton, etc.) |

**Utilities (128 files):** Streaming helpers, message formatting, ID generation, type guards,
validation, performance utils.

### 2.2 `@clarity-chat/primitives` (76 files, 88 exports)

Core UI primitives: Button, Card, Badge, Dialog, Input, Tabs, Tooltip, Select, Switch, etc. Also
exports `cn()` (clsx + tailwind-merge), glass-variant utilities, and icon components.

### 2.3 `@clarity-chat/utils` (24 files, 10 sub-path exports)

Domain-agnostic utilities organized by sub-path:

- `./format` — String/number formatting
- `./cache` — Generic caching
- `./logger` — Structured logging
- `./progress` — Progress tracking
- `./errors` — Error class hierarchy
- `./async` — debounce, throttle, retry
- `./validation` — assertDefined, type guards
- `./math` — Math helpers
- `./env` — Environment detection

### 2.4 `@clarity-chat/error-handling` (35 files, 39 exports)

Error boundaries (ChatErrorBoundary, FormErrorBoundary), error recovery strategies, error reporting
providers, accessibility-aware error display.

### 2.5 `@clarity-chat/token-optimization` (104 files, 4 sub-paths)

Token counting, budget management, semantic compression, caching layer, model routing, complexity
analysis.

### 2.6 `@clarity-chat/memory` (65 files)

Conversation memory management, summarization, vector store integration, sliding window strategies.

### 2.7 `@clarity-chat/types` (15 files, 2 sub-paths)

Shared type definitions: ChatMessage, ProviderConfig, StreamEvent, MemoryEntry, etc.

### 2.8 Showcase App (88 files)

**Local components (9 files, 1,708 lines):** | Component | Purpose | Lines |
|-----------|---------|-------| | `sidebar.tsx` | Navigation sidebar with category links | ~200 | |
`doc-panel.tsx` | Documentation tab panel with copy chip | ~250 | | `component-section.tsx` |
Section wrapper with optional docs tab | ~300 | | `playground.tsx` | Interactive component
playground | ~180 | | `api-key-input.tsx` | API key + model selector | ~150 | | `search-dialog.tsx`
| Command-K search dialog | ~200 | | `code-highlight.tsx` | Syntax highlighting wrapper | ~120 | |
`app-error-boundary.tsx` | App-level error boundary | ~100 | | `section-error-boundary.tsx` |
Per-section error boundary | ~100 |

**Local utilities (6 files, 697 lines):** | Utility | Purpose | Lines |
|---------|---------|-------| | `lib/live-chat-adapter.ts` | Anthropic API adapter for live demos |
~150 | | `lib/sse-utils.ts` | SSE stream parsing (parseLinesFromBuffer, parseSSELine) | ~153 | |
`lib/clarity-chat-types.ts` | Local type copies (dts disabled in dev) | ~121 | |
`lib/demo-utils.tsx` | Shared demo utilities (useAbortController, StreamingCursor, etc.) | ~80 | |
`lib/use-search-index.ts` | Singleton search index hook | ~60 | | `lib/slugify.ts` | URL slug
generator | ~10 |

**Pages: 25 routes** including 18 component category pages, stats, connected demo, and an
`/api/chat` edge proxy.

**Data layer: 23 doc files** (25,146 lines total) using
`Record<string, ComponentDoc | ComponentDoc[]>` keyed by section title.

**Tests: 3 test files** — components.test.tsx (32 tests), docs-integrity.test.ts,
pages-smoke.test.ts.

**Style system:** `globals.css` (601 lines) — 26 CSS custom properties, 20+ glassmorphism classes
(glass, glass-card, orb-_, glow-_), Prism.js theme, prefers-reduced-motion support.

---

## 3. Duplication Matrix

### 3.1 Critical Duplications (P0)

| #   | Symbol             | Locations           | Issue                                                                                                                                                                                                                                    | Risk                                                                          |
| --- | ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| D1  | `cn()`             | 4 locations         | `packages/react/src/utils/cn.ts` uses bare `clsx()` without `twMerge` — **fundamentally broken** for Tailwind class conflict resolution. Canonical version in `primitives` uses `twMerge(clsx())`. Also in `dev-tools` and `playground`. | **CRITICAL** — silent style bugs in any component using the react-internal cn |
| D2  | `generateId`       | 12+ implementations | Scattered across react (4+ files), utils, memory, token-optimization. Mix of `crypto.randomUUID()`, `Math.random().toString(36)`, counter-based, and nanoid-style.                                                                       | **HIGH** — ID collisions possible, inconsistent formats                       |
| D3  | `ChatMessage` type | 12+ definitions     | Incompatible timestamp fields (`timestamp: string` vs `Date` vs `number`), different status enums (`'sending'                                                                                                                            | 'sent'                                                                        | 'error'`vs`'pending' | 'streaming' | 'complete' | 'error'`), extra fields in some variants. Showcase has 2 additional diverged copies. | **HIGH** — runtime type mismatches at integration boundaries |
| D4  | `debounce`         | 6 implementations   | `utils/async`, `react/utils/optimization/performance.ts`, `react/hooks/input/`, `primitives/utils/`, `token-optimization/`, `dev-tools/`. Different cancellation semantics (some return cancel fn, some don't).                          | **HIGH** — inconsistent behavior across packages                              |
| D5  | `throttle`         | 6 implementations   | Same locations as debounce. Some use leading-edge, some trailing-edge, some configurable.                                                                                                                                                | **HIGH** — inconsistent behavior across packages                              |

### 3.2 High-Priority Duplications (P1)

| #   | Symbol             | Locations           | Issue                                                                                                                                                             |
| --- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------- | ------ | ----------------------------------- |
| D6  | `deepMerge`        | 8 implementations   | Different mutability guarantees (some mutate target, some clone). In react (3), utils (1), memory (1), token-optimization (1), dev-tools (1), error-handling (1). |
| D7  | `ErrorBoundary`    | 13+ implementations | 4 within `@clarity-chat/react` alone, plus variants in error-handling, primitives, dev-tools, playground, and showcase (2).                                       |
| D8  | `CircuitState`     | 5 definitions       | 3 incompatible conventions: lowercase strings (`'closed'                                                                                                          | 'open' | 'half-open'`), uppercase strings (`'CLOSED' | 'OPEN' | 'HALF_OPEN'`), and TypeScript enum. |
| D9  | `assertDefined`    | 2 implementations   | `react/src/internal/assertions.ts` has its own copy instead of importing from `utils/validation`.                                                                 |
| D10 | `useReducedMotion` | 4 implementations   | Independent copies in primitives, error-handling, token-optimization, and react.                                                                                  |
| D11 | SSE parsing        | 3 implementations   | `showcase/lib/sse-utils.ts`, `react/src/utils/streaming/streaming-helpers.ts`, `react/src/adapters/shared.ts`. Each parses `data:` lines differently.             |
| D12 | `CopyButton`       | Migration artifact  | Both `copy-button.tsx` (kebab-case) and `CopyButton.tsx` (PascalCase) exist in the same directory under `react/src/components/ui/`.                               |

### 3.3 Lower-Priority Duplications (P2)

| #   | Symbol                               | Locations              | Issue                                                                                                                                                                                       |
| --- | ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D13 | Model routing                        | 2 locations            | `ai-infrastructure` has `classifyQueryComplexity`/`getStreamingFunctionWithRouting`; `token-optimization` has `ComplexityAnalyzer`/`ModelRouter`. Both do complexity-based model selection. |
| D14 | Token budget types                   | Re-exported            | `QualityGateConfig`, `CostAwareConfig`, `SemanticCacheConfig` re-exported through both `memory` and `token-optimization`.                                                                   |
| D15 | `showcase/lib/clarity-chat-types.ts` | 1 copy                 | 121 lines directly copied from `ClarityChatProvider.tsx`. Has TODO to delete when dts enabled.                                                                                              |
| D16 | `showcase/app/chat/types.ts`         | 1 diverged copy        | 42 lines with independently diverged `ChatMessage` type (different status enum, extra fields).                                                                                              |
| D17 | `CopyChip` in `doc-panel.tsx`        | Showcase local         | Functionally redundant with `CopyButton` from `@clarity-chat/react/internal`. Both use `useClipboard`.                                                                                      |
| D18 | Dead CSS classes                     | Showcase `globals.css` | `.component-section`, `.component-grid-2`, `.component-grid-3` — likely dead, superseded by React `ComponentSection`/`ComponentGrid` components.                                            |

### 3.4 API Surface Concerns

| #   | Finding                                                                                                                                       | Recommendation                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| A1  | 5 showcase imports from `@clarity-chat/react/internal` (`useSafeInterval`, `useSafeTimeout`, `useSmoothedText`, `AnimatedDots`, `CopyButton`) | Promote stable hooks to public API                                |
| A2  | `testing-utils` has 0 source files — serves as config-only                                                                                    | Consider merging into `typescript-config` or documenting intent   |
| A3  | `@clarity-chat/react` tsconfig excludes 40+ glob patterns                                                                                     | Indicates large amounts of code not type-checked — technical debt |

---

## 4. Tooling Summary

| Tool       | Version  | Notes                                 |
| ---------- | -------- | ------------------------------------- |
| pnpm       | 10.21.0  | Workspace protocol (`workspace:*`)    |
| Turborepo  | 2.6.3    | Build orchestration                   |
| tsup       | (latest) | Package bundling; `dts: false` in dev |
| Vitest     | 4.0.16   | Test runner with happy-dom            |
| ESLint     | 9.39.1   | Flat config                           |
| Next.js    | 15       | Showcase app                          |
| React      | 19.2.0   | `'use client'` directives             |
| Changesets | ✓        | Version management                    |

---

## 5. Key Metrics

| Metric                           | Value                                   |
| -------------------------------- | --------------------------------------- |
| Total packages                   | 15                                      |
| Total source files (packages)    | 1,940                                   |
| Total source files (showcase)    | 88                                      |
| `@clarity-chat/react` share      | 74.9% of all package source             |
| Public API exports (`react`)     | 83 lines                                |
| Internal exports (`react`)       | 172 lines                               |
| Hook categories                  | 25                                      |
| Component categories             | 25                                      |
| Critical duplications (P0)       | 5                                       |
| High-priority duplications (P1)  | 7                                       |
| Lower-priority duplications (P2) | 6                                       |
| Showcase test count              | 32 component tests + 2 integrity suites |
