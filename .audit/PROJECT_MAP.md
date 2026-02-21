# PROJECT MAP

**Date:** 2026-02-21
**Auditor:** Multi-perspective strike team

---

## Repository Overview

| Metric | Value |
|---|---|
| Repo | christireid/Clarity-ai-chat-components |
| Language | TypeScript (99%+) |
| Monorepo | pnpm + Turborepo |
| Packages | 16 (7 core, 9 ancillary) |
| Apps | 11 |
| Total .ts/.tsx files | ~3,000+ |
| React package src | 19MB, 1,732 files, 52 subdirectories |
| npm published | **No** |
| npm downloads | **0** |
| GitHub stars | **0** |
| External users | **0** |
| Revenue | **$0** |
| Team | 1 person + AI tooling |
| Version | 0.1.0 (pre-release) |

---

## Apps (11)

| App | Purpose | Tech | Status |
|---|---|---|---|
| `docs` | Documentation site (primary) | Next.js | Exists, not deployed |
| `streamlined-docs` | Alternate docs site | Next.js | Duplicate of docs |
| `docs-site` | Third docs variant | Unknown | Appears empty/stub |
| `marketing-site` | Marketing landing page | Next.js | Has compiled .js/.d.ts checked in |
| `component-showcase` | Component demos | Next.js | Exists |
| `storybook` | Storybook stories | Storybook 8 | Exists |
| `examples` | Example projects | Various | 16+ examples |
| `test-nextjs` | Next.js integration test | Next.js | Test harness |
| `test-vite` | Vite integration test | Vite | Test harness |
| `test-webpack` | Webpack integration test | Webpack | Test harness |

**Red flags:**
- 3 documentation sites (docs, streamlined-docs, docs-site) — none deployed
- Marketing site has compiled JS/d.ts artifacts checked into source control (42 .d.ts, 43 .js)
- None of these apps are deployed anywhere

---

## Packages (16)

### Core (7) — Ship in v1

| Package | Purpose | Source Size | Files |
|---|---|---|---|
| `react` | UI components & hooks | **19MB** | 1,732 |
| `primitives` | Base UI (Radix-based) | 550K | ~60 |
| `types` | TypeScript definitions | ~30K | ~10 |
| `utils` | Shared utilities | 359K | ~40 |
| `token-optimization` | Token counting/caching | 1.5MB | ~80 |
| `memory` | Conversation memory | 662K | ~50 |
| `error-handling` | Error boundaries | 405K | ~40 |

### Ancillary (9) — Deferred/Experimental

| Package | Purpose | Status |
|---|---|---|
| `cli` | CLI scaffolding tool | Not published |
| `codemods` | Migration codemods | Not published |
| `dev-tools` | DevTools panel | Not published |
| `ai-infrastructure` | AI infra abstractions | Scope creep |
| `playground` | Interactive playground | Not published |
| `testing-utils` | Test helpers | Internal only |
| `license` | License management | Premature |
| `typescript-config` | Shared TS configs | Internal only |

**Red flags:**
- `react` package is 19MB / 1,732 files — absurdly large for a component library
- 52 subdirectories in react/src include: ci-cd, bundle-analyzer, document-loaders, embeddings, evaluation, multi-tenancy, observability, quotas, rbac, reranking, vector-stores, webhooks
- The react package is trying to be an entire AI platform, not a component library

---

## Misplaced Files in packages/

| File | Size | Issue |
|---|---|---|
| `globals.css` | 91KB (4,190 lines) | Should not be at packages root |
| `AI_Chat_UI_Competitor_Inventory_Report.docx` | 18KB | Word doc in code repo |
| `Clarity_Chat_Strategic_Recommendations.docx` | 21KB | Word doc in code repo |
| `COMPONENT_IMPROVEMENT_PLAN.md` | 16KB | Planning doc at wrong level |

---

## Build System

| Tool | Version |
|---|---|
| pnpm | 10.21.0 |
| Turborepo | 2.6.3 |
| TypeScript | 5.9.3 |
| Node.js | 20+ required |
| tsup | 8.5.1 (bundler) |
| Vite | 7.2.6 |
| Vitest | 4.0.16 |

**Build config:** Requires `--max-old-space-size=2048` minimum (4096 for legacy). This is a symptom of the massive codebase size.

---

## Tests

| Framework | Config |
|---|---|
| Vitest | Unit/integration |
| Playwright | E2E |
| Testing Library | React component tests |

**Claimed:** 450+ tests
**Coverage:** Unknown (no recent coverage report)

---

## CI/CD

- 26 GitHub Actions workflows (claimed in ROADMAP)
- Husky + lint-staged configured
- Changesets for versioning
- No deployment pipelines active (nothing is deployed)

---

## Documentation

| Location | Content | Status |
|---|---|---|
| Root README.md | Project overview | Recently cleaned up, honest |
| ROADMAP.md | Business plan | Brutally honest |
| CONTRIBUTING.md | Contributor guide | Standard, well-written |
| apps/docs/ | Full docs site | Not deployed |
| apps/streamlined-docs/ | Alt docs site | Duplicate, not deployed |
| apps/docs/app/commercial/ | Pricing, legal, sales | Premature for 0-user product |
| .packages-audit/ | Previous code audit | Extensive, partially executed |

---

## Commercial/Monetization Infrastructure

| Asset | Status | Appropriateness |
|---|---|---|
| PRICING.md | Detailed 4-tier pricing | Premature — 0 users |
| SALES_DECK_OUTLINE.md | Full sales presentation | Premature — 0 revenue |
| LICENSE-ENTERPRISE.md | Enterprise license | Premature — 0 customers |
| LICENSE-PRO.md | Pro license | Premature — 0 customers |
| TERMS_OF_SERVICE.md | Legal terms | Premature |
| PRIVACY_POLICY.md | Privacy policy | Premature |
| IMPLEMENTATION_GUIDE.md | Enterprise onboarding | Premature |

**Assessment:** Extensive commercial infrastructure for a product with zero users and zero npm downloads. This is premature optimization of the business model before validating product-market fit.

---

## What Actually Exists vs. What's Claimed

**The codebase is real.** There are genuine React components, hooks, TypeScript types, and infrastructure. The technical foundations (TypeScript strict, accessibility focus, React 18/19 support) are legitimate.

**What's missing:**
1. No npm publication — cannot be installed
2. No deployed documentation — cannot be read
3. No deployed demo — cannot be experienced
4. No users — no validation
5. No community — no feedback loop
6. No revenue — no business

**Bottom line:** This is a well-engineered codebase wrapped in a premature business shell, with zero connection to the market.
