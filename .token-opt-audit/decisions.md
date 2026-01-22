# Phase 0: Orientation & Guardrails — Findings

**Date**: 2026-01-22
**Phase**: Orientation & Guardrails
**Status**: ✅ COMPLETE

---

## Package Boundaries

### Location
- **Path**: `packages/token-optimization/`
- **Package Name**: `@clarity-chat/token-optimization`
- **Version**: 1.0.0
- **Type**: ES Module (`"type": "module"`)
- **License**: MIT ✅ (Commercial-compatible)

### Scope & Purpose
Token counting and optimization for LLM applications with:
- Token counting (multiple tokenizers)
- Provider-native caching (Anthropic, OpenAI, Google)
- Compression strategies
- Model routing
- Cost optimization
- React components and hooks
- Accessibility features

### Package Claim (from package.json)
> "Count and optimize LLM tokens with 90% cost savings. Works with GPT-4o, Claude, Gemini. Provider-native caching, compression, and React hooks included."

**⚠️ AUDIT FLAG**: "90% cost savings" claim needs benchmarking verification

---

## Build & Test Tooling

### Build System
- **Bundler**: `tsup` v8.5.1 (esbuild-based, fast)
- **Config**: `tsup.config.ts`
- **Entry Points**:
  - `index.ts` → Core functionality (Node.js + Browser)
  - `react.ts` → React components/hooks
  - `compression/index.ts` → Compression strategies
  - `cache/index.ts` → Caching systems
- **Output Formats**: CommonJS + ESM
- **TypeScript**: Declaration files generated (`dts: true`)
- **Source Maps**: Yes
- **Tree Shaking**: Enabled
- **External Dependencies**: react, react-dom, @dqbd/tiktoken, @tensorflow/tfjs, events
- **Target**: ES2020, platform-neutral

### Test Framework
- **Runner**: Vitest v4.0.16
- **Environment**:
  - Node.js (default)
  - JSDOM (for React hook tests in `src/__tests__/hooks/**`)
- **Coverage**: V8 provider with text/json/html reporters
- **Timeout**: 30s for tests and hooks
- **Config**: `vitest.config.ts`

### Type Checking
- **TypeScript**: v5.9.3
- **Config**: `tsconfig.json`
- **Command**: `pnpm typecheck`

### Linting
- **Tool**: ESLint
- **Command**: `pnpm lint`

---

## Storybook Configuration

### Location
- **Directory**: `packages/token-optimization/.storybook/`
- **Config**: `.storybook/main.ts`
- **Stories**: `.storybook/**/*.mdx`, `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`

### Framework
- **Type**: React + Vite
- **Addons**:
  - `@storybook/addon-essentials` (default tools)
  - `@storybook/addon-interactions` (interaction testing)
  - `@storybook/addon-a11y` (accessibility testing) ✅ WCAG validation

### Build Commands
- **Dev**: `pnpm storybook` (runs on port 6008)
- **Build**: `pnpm build-storybook`

### Stories Found (Sample)
```
src/react/components/TokenOptimizationBadge.stories.tsx
src/react/components/TokenUsageMeter.stories.tsx
src/react/components/TokenOptimizationPanel.stories.tsx
src/react/components/TokenOptimizationDashboard.stories.tsx
src/react/components/TokenCostPreview.stories.tsx
```

---

## Dependency Manager

### Tool
- **Manager**: pnpm v10.21.0
- **Workspace**: Turborepo monorepo
- **Lock File**: `package-lock.json` (legacy, should be pnpm-lock.yaml)

### Dependencies Analysis

#### Production Dependencies (7 total) ✅ All commercial-compatible
| Package | Version | License | Purpose | Risk |
|---------|---------|---------|---------|------|
| `@clarity-chat/primitives` | workspace:* | MIT | Internal package | ✅ Low |
| `fflate` | ^0.8.2 | MIT | Fast compression | ✅ Low |
| `gpt-tokenizer` | ^2.8.0 | MIT | Token counting | ✅ Low |
| `llm-splitter` | ^0.2.0 | MIT | Text chunking | ✅ Low |
| `lru-cache` | ^10.0.0 | ISC | Caching | ✅ Low |
| `lz-string` | ^1.5.0 | MIT | String compression | ✅ Low |
| `msgpackr` | ^1.11.0 | MIT | Binary serialization | ✅ Low |
| `validator` | ^13.12.0 | MIT | Input validation | ✅ Low |

**✅ NO GPL/AGPL/SSPL VIOLATIONS FOUND**

#### Peer Dependencies (Optional)
- `react` ^18.0.0 || ^19.0.0 (optional)
- `react-dom` ^18.0.0 || ^19.0.0 (optional)
- `framer-motion` ^12.0.0 (optional)

#### Notable External Dependencies (from tsup config)
- `@dqbd/tiktoken` (marked external - likely unused, needs verification)
- `@tensorflow/tfjs` (marked external - likely unused for basic tokenization)
- `events` (Node.js built-in)

**⚠️ AUDIT FLAG**: External deps marked in tsup might indicate dead code

---

## Code Structure

### Source Directory Layout
```
src/
├── __tests__/              # Test files (analytics, benchmarks, cache, etc.)
├── accessibility/          # WCAG-compliant utilities & components
├── analytics/              # Cost tracking & savings calculation
├── budget/                 # Token budget management
├── cache/                  # Tiered caching system
├── caching/                # Advanced semantic cache
├── chunking/               # Text chunking strategies
├── components/             # React components (non-/react path)
├── compression/            # Compression engines & strategies
├── cost/                   # Cost-aware optimization
├── deployment/             # Deployment utilities
├── errors/                 # Error handling system
├── files/                  # File optimization
├── formats/                # TOON, Markdown, HTML optimizers
├── health/                 # Health check system
├── hooks/                  # React hooks
├── models/                 # Model registry & pricing
├── observability/          # Logging, metrics, tracing
├── providers/              # Provider-native caching (Anthropic, OpenAI, Google)
├── quality/                # Quality gates
├── react/                  # React-specific exports
├── resilience/             # Circuit breakers
├── routing/                # Model routing & complexity analysis
├── security/               # Security features
├── styles/                 # Styling
├── tokenizers/             # Token counting implementations
├── utils/                  # Utilities
├── constants.ts
├── defaults.ts
├── factory.ts
├── index.ts                # Main entry point
├── legacy-compatibility.ts
├── react.ts                # React entry point
└── types.ts
```

### Lines of Code
- **Total**: ~38,175 lines (TypeScript + TSX)

### Public API Surface
- **Exports from index.ts**: 671 lines of exports (very large!)
- **Entry Points**: 4 (main, react, compression, cache)

**⚠️ AUDIT FLAGS**:
1. Very large export surface (671 lines) → potential for dead code
2. Overlap between `components/` and `react/components/`
3. Both `cache/` and `caching/` directories (naming confusion)
4. Commented-out security exports (lines 119-163 in index.ts)

---

## Documentation & Examples

### Files Present
- `README.md` (20KB) — Quick start, examples, API overview
- `CHANGELOG.md` — Version history
- `MIGRATION.md` — Migration guide
- `docs/` — Additional documentation
- `examples/` — Usage examples
- `audit/` — Previous audit results (exists!)

### Storybook Documentation
- MDX files in `.storybook/`
- Component stories for visualization

---

## Pre-existing Audit Work

### Found
- `packages/token-optimization/audit/` directory exists
- Indicates previous audit/review work

**Action**: Will examine in Phase 1 to avoid duplicating work

---

## Known Risks & Red Flags (Phase 0)

### High Priority
1. **Unverified claims**: "90% cost savings" (package.json), "60-90% savings" (README) — **MUST BE BENCHMARKED**
2. **Large export surface**: 671 lines of exports suggests potential dead code or over-engineering
3. **Commented-out code**: Security exports commented out (potential incomplete features)
4. **External deps**: @dqbd/tiktoken, @tensorflow/tfjs marked external but might be unused

### Medium Priority
5. **Directory naming**: `cache/` vs `caching/` (confusing), `components/` vs `react/components/`
6. **Lock file inconsistency**: Using `package-lock.json` instead of `pnpm-lock.yaml`
7. **Legacy compatibility layer**: Exists but might indicate API instability

### Low Priority
8. **Bundle size claims**: README claims ~30KB core, needs verification
9. **Accessibility claims**: WCAG AAA, needs Storybook validation
10. **Test coverage**: Not measured yet (needs Phase 1 check)

---

## Stop Condition: ✅ COMPLETE

All Phase 0 requirements met:
- ✅ Package boundaries identified
- ✅ Build tooling confirmed (tsup, Vitest)
- ✅ Test framework confirmed (Vitest with Node.js + JSDOM)
- ✅ Storybook location confirmed (.storybook/ + 5 story files)
- ✅ Dependency manager confirmed (pnpm 10.21.0)
- ✅ All dependencies verified as commercial-compatible (MIT/ISC)
- ✅ Findings recorded in this document

---

## Next Phase: Phase 1 — Full Indexing

**Plan**:
1. Index all 29 source directories
2. Map every export to its file
3. Identify all public vs internal APIs
4. Document every function/hook signature
5. Check test coverage per module
6. Examine existing audit/ directory

**No code changes allowed in Phase 1.**
