# PROJECT MAP

## Repository Overview

| Metric | Value |
|--------|-------|
| **Repo Size** | 1.7GB |
| **Package Manager** | pnpm 10.21.0 |
| **Build Orchestrator** | Turbo 2.6.3 |
| **Packages** | 15 (8 public, 6 private, 1 config) |
| **Apps** | 10 (8 active, 2 disabled) |
| **Examples** | 42 example applications |
| **Test Files** | 602 |
| **CI Workflows** | 25 GitHub Actions |
| **Root Docs** | 87 markdown files |
| **Version** | 0.1.0 (monorepo) / 2.0.0 (react package) |

---

## Package Inventory

### Public Packages (8)

| Package | Version | Purpose | Tests |
|---------|---------|---------|-------|
| `@clarity-chat/react` | 2.0.0 | Core React component library | Yes |
| `@clarity-chat/primitives` | 1.0.0 | Base UI components (Radix-based) | Yes |
| `@clarity-chat/types` | 1.0.0 | TypeScript type definitions | No |
| `@clarity-chat/utils` | 1.0.0 | Utility functions | Yes |
| `@clarity-chat/error-handling` | 2.0.0 | Error boundaries for React 19 | Yes |
| `@clarity-chat/memory` | 1.0.0 | AI memory management | Yes |
| `@clarity-chat/token-optimization` | 1.0.0 | Token counting and optimization | Yes |
| `@clarity-chat/license` | 1.0.0 | License validation | Yes |

### Private Packages (6)

| Package | Purpose |
|---------|---------|
| `@clarity-chat/cli` | Developer CLI (experimental) |
| `@clarity-chat/testing-utils` | Internal test utilities |
| `@clarity-chat/ai-infrastructure` | AI infrastructure |
| `@clarity-chat/dev-tools` | Development tools |
| `@clarity-chat/codemods` | Automated code transformations |
| `@clarity-chat/playground` | Interactive playground |

---

## Apps

| App | Framework | Status |
|-----|-----------|--------|
| `docs` | Next.js | Active |
| `streamlined-docs` | Next.js | Active |
| `component-showcase` | Next.js | Active |
| `storybook` | Storybook 8 | Active |
| `marketing-site` | Next.js | Disabled (Turbopack bug) |
| `docs-site` | Next.js | Active |
| `test-nextjs` | Next.js | Active |
| `test-vite` | Vite | Active |
| `test-webpack` | Webpack | Active |
| `examples/` (42 apps) | Mixed | Active |

---

## Component Reality

| Category | File Count | Purpose |
|----------|-----------|---------|
| `clarity/` | 159 | Premium components |
| `ai/` | 78 | AI-specific |
| `message/` | 56 | Message display |
| `ui/` | 46 | Base UI |
| `chat/` | 37 | Core chat |
| Others (22 dirs) | ~369 | Various features |
| **Total .tsx files** | **745** | |
| **Substantial components** | **~89-150** | Excluding tests/utils |

## Hook Reality

| Metric | Count |
|--------|-------|
| Total hook files | 149 |
| Substantial hooks | ~15 core + ~50 utility |
| Claimed | 70+ |

---

## Infrastructure

- **CI/CD**: 25 GitHub Actions workflows (security-hardened, SHA-pinned)
- **Testing**: Vitest + Testing Library + Playwright + jest-axe
- **Build**: Turbo with remote caching, 2GB heap required
- **Quality**: ESLint + Prettier + Husky pre-commit hooks
- **Release**: Changesets for versioning
- **Bundle**: size-limit configured (650KB full, 350KB core, 300KB slim)
- **Security**: DOMPurify overrides, dependency pinning, StepSecurity

---

## Technical Debt Indicators

| Indicator | Count | Severity |
|-----------|-------|----------|
| `@ts-nocheck` | 28 files | Medium |
| `@ts-ignore` | 47 files | High |
| `as any` casts | 499 | High |
| Remaining TS errors | ~630 | High |
| Disabled apps | 2 | Medium |
| Root markdown files | 87 | Low (clutter) |
| TODO/FIXME comments | 22 | Low |
