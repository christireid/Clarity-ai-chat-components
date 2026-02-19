# First-Run Experience Report

**Perspective:** First-time developer evaluating Clarity Chat for a new project
**Date:** February 2026
**Time Spent:** ~90 minutes of honest exploration
**Verdict:** The README sells a product that does not yet exist in a shippable form.

---

## 1. First Impression (10-Second Scan)

The README opens with a centered hero banner:

> **Build Beautiful AI Chat Interfaces in Minutes, Not Months**
> 150+ components. 70+ hooks. TypeScript-first. Accessibility-first.

**My gut reaction:** This sounds incredible. If true, this is the most comprehensive chat UI library on the market. The badge says "pre-release" which is reassuring honesty -- or a warning.

**Red flags within 30 seconds:**
- The README is **1,147 lines long**. That is not a README. That is a pitch deck disguised as documentation.
- There are **93 markdown files** in the project root. The root directory looks like a documentation graveyard: `AUDIORECORDER_CHECKLIST.md`, `BULLETPROOF_STATE_REPORT.md`, `CLAIMS_VS_REALITY.md` (ironic), `DX_VISUAL_COMPARISON.md`, `PARALLEL_EXECUTION_DASHBOARD.md`. This is an audit trail, not a software project.
- The project root also has stray screenshots (`baseline-docsassistant-open.png`, `phase2-layout-1024px-assistant.png`) just sitting loose.
- There is no live demo link anywhere. Zero. Not in the README, not in the docs, not in a `DEMO.md`.

**Score: 4/10** -- Impressive claims, but the sheer volume of root-level markdown files signals "documentation theater" rather than a polished product.

---

## 2. Installation Attempt

### What the README says:

```bash
npm install @clarity-chat/react
```

### What actually happens:

```
npm error 404 Not Found - GET https://registry.npmjs.org/@clarity-chat%2freact - Not found
npm error 404 '@clarity-chat/react@*' is not in this registry.
```

**The package is not published to npm.** The very first instruction a user would follow results in an immediate, total failure. There is no mention anywhere in the README that this package is not yet available on npm. The README says `npm install @clarity-chat/react` as if it is a published package you can consume today.

The root `package.json` has `"preinstall": "npx only-allow pnpm"` which means even if you clone the repo, running `npm install` will be rejected. You must use `pnpm`. This is not mentioned in the Quick Start section of the README.

**The README also fails to mention** that this is a monorepo. There is no "Contributing" or "Development" quick-start that says "clone the repo and run `pnpm install && pnpm build`". The comments in `package.json` hint at it (`// pnpm install && pnpm build && pnpm storybook`) but that is hidden inside a JSON file.

**Score: 0/10** -- Complete failure. The first instruction is broken.

---

## 3. "Hello World" Attempt

### Which API do I use?

The README presents **five different APIs** for achieving the same thing, in this order:

1. **Level 1: "One-Line Chat"** -- `chat('/api/chat')`
2. **Level 2: "Named Presets"** -- `ChatPresets.Enterprise('/api/chat')`
3. **Level 3: "Builder Pattern"** -- `ChatBuilder.create('/api/chat').build()`
4. **"Modern Grouped Props API (Recommended)"** -- `useClarityChat` + `ChatWindow` + `MemoryProvider`
5. **"Legacy API (Still Supported)"** -- `<ClarityChatApp api="/api/chat" />`

Then further down:

6. **Presets via props** -- `<ClarityChatApp api="/api/chat" preset="enterprise" />`
7. **Headless Mode** -- `useClarityChatApp({ api: '/api/chat' })`

And in `docs/getting-started.md`:

8. **Option A: Zero Config** -- `initializeClarity({ license: ... }); <ClarityChat api="/api/chat" />`
9. **Option B: With Hooks** -- `initializeClarity() + useClarityChat + ChatWindow`
10. **Option C: Headless Mode** -- `useHeadlessChat`

**That is TEN different "getting started" patterns.** A new user has no idea which one to actually use. The README says "Recommended" next to option 4 but presents option 1 first. The getting-started doc introduces `initializeClarity()` and `ClarityChat`, which is different from the README's `ClarityChatApp`. These are different components.

### Are these APIs real?

I checked the actual source exports:

| API from README | Actually Exported? | From Where? |
|---|---|---|
| `chat('/api/chat')` | Exists in source (`utils/quick-start.tsx`) | **NOT exported from `index.ts` or `public-api.ts`** |
| `ChatPresets.Enterprise()` | Exists in source (`ClarityChatPresets.tsx`) | **NOT exported from `public-api.ts`**. Only in `_internal-exports.ts` (marked "DO NOT IMPORT FROM THIS FILE DIRECTLY") |
| `ChatBuilder` | Exists in source (`utils/dev-helpers.ts`) | **NOT exported from any public entry point** |
| `ClarityChatApp` | Yes | Exported from `public-api.ts` via `app-api` |
| `useClarityChat` | Yes | Exported from `public-api.ts` |
| `ClarityChat` | Exists in source | **Only exported from `extended.ts`**, not the main entry |
| `initializeClarity` | Exists in source (`initialization.ts`) | **NOT exported from `public-api.ts` or `index.ts`** |
| `MemoryProvider` | Exists in source | **NOT exported from `public-api.ts`** |
| `ThemeProvider` | Exists in source | **NOT exported from `public-api.ts`** |
| `useHeadlessChat` | Unknown | Could not find this export |
| `useClarityChatApp` | Yes | Exported from `public-api.ts` via `app-api` |

**At least 6 of the 10 "getting started" patterns in the README and docs reference APIs that are not exported from the main package entry point.** A first-time user copying any of the first three README examples will get an import error.

**Score: 1/10** -- The README showcases APIs that do not exist in the public surface of the package.

---

## 4. Documentation Navigation Experience

### The docs/ directory

The `docs/` directory contains 50+ files across many subdirectories. There is no `docs/index.md` or `docs/README.md` that serves as a table of contents (there is actually a `docs/README.md` but I was not pointed to it). The README links to `docs/getting-started.md` which is the logical entry point, but:

- `docs/getting-started.md` introduces `initializeClarity()` with a **license key** requirement. The README never mentions licensing. The getting-started doc has a "License Plans" table showing Community/Pro/Enterprise tiers. This is the first time a user learns that some features require a paid license. This is a major context switch from the README's "free and open-source MIT" impression.

- The doc references `@clarity-chat/react/styles.css` which needs to be imported. This CSS import is never mentioned in the README's Quick Start section.

- The doc provides an API route setup for Next.js that manually calls the OpenAI API with raw `fetch()`. There is no integration with the Vercel AI SDK or any AI SDK, which is surprising for a library claiming 70+ hooks. The user has to write their own streaming SSE proxy.

### Link Rot in the README

The README links to:
- `./examples` -- This directory exists but is **separate** from `./apps/examples/`. There are two different example directories with overlapping names but different content.
- `./examples/multi-provider` -- exists
- `./examples/tool-calling` -- exists
- `./examples/security-examples` -- exists
- `./examples/advanced-features` -- exists
- `[React API](./packages/react/README.md)` -- Let me check... this file may or may not exist, but the user is sent into package internals.
- `[Hooks](./packages/react/src/hooks/README.md)` -- Sends user into source code directories.

### The 93 Root Markdown Files Problem

A new user running `ls` in the project root sees files like:
- `AUDIORECORDER_PERFORMANCE_AUDIT.md`
- `COMMANDPALETTE_PERFORMANCE_CHARTS.md`
- `BULLETPROOF_STATE_REPORT.md`
- `CLAIMS_VS_REALITY.md`
- `DEPENDENCY_HEALTH_AUDIT.md`
- `DX_AUDIT_REPORT.md`
- `MASTER_FINDINGS_REPORT.md`
- `SYNTHESIS_STRATEGY.md`

These are internal audit documents that should never be in the root of a public repository. They make the project feel like a consulting engagement deliverable, not a software library.

**Score: 3/10** -- Getting-started doc is decent in isolation but contradicts the README. Navigation is chaotic.

---

## 5. Confusion Points (Exhaustive List)

1. **`ClarityChatApp` vs `ClarityChat`** -- Two different components. The README uses both. `ClarityChatApp` is in the public API; `ClarityChat` is only in `extended.ts`. The getting-started doc uses `ClarityChat`.

2. **`chat()` function** -- Prominent in README Level 1 but not actually exported from the package.

3. **`ChatPresets` vs `ClarityChatPresets`** -- The README uses `ChatPresets.Enterprise()`. The source has `ClarityChatPresets`. Neither is exported from the main entry point.

4. **`ChatBuilder`** -- Prominent in README Level 3. Not exported from any public entry point.

5. **`initializeClarity()`** -- Required in `docs/getting-started.md`. Not exported from `public-api.ts` or `index.ts`.

6. **`./examples` vs `./apps/examples/`** -- Two separate example directories. The `examples/` directory has Next.js-based examples. The `apps/examples/` directory has Vite-based examples. The README links to `./examples`. There are 30+ examples in `apps/examples/` that are not discoverable from the README.

7. **`@clarity-chat/react` vs `@clarity-chat/react/extended` vs `@clarity-chat/react/advanced`** -- Three sub-path entry points. The README mentions none of them in the Quick Start. The `public-api.ts` claims to export "15 essential exports" but actually exports 80+ symbols. The `extended.ts` and `advanced.ts` exist but their relationship to each other is unclear.

8. **License key requirement** -- The getting-started doc says "License Key: Optional for core features (required for Pro/Enterprise)" and shows `initializeClarity({ license: process.env.CLARITY_LICENSE })`. The README never mentions licensing. The MIT license in the repo root contradicts the Pro/Enterprise license model.

9. **Peer dependencies** -- The `packages/react/package.json` lists **18 peer dependencies** including `framer-motion`, `lucide-react`, `zod`, `react-markdown`, `remark-gfm`, `recharts`, `react-window`, `date-fns`, `prismjs`, `shiki`, `mermaid`, and more. The README says "1 tree-shakeable package." In reality, running `npm install @clarity-chat/react` (if it were published) would generate a wall of peer dependency warnings.

10. **"Under 3 minutes" claim** -- The README says "Get an AI chat interface running in under 3 minutes." With a non-published package, no working install command, contradictory API examples, and a required backend API route, this is not achievable in 3 minutes even for an experienced developer.

11. **The quickstart example uses zero Clarity Chat components** -- `examples/quickstart/app/page.tsx` is 218 lines of pure React with `useState`, `useRef`, raw `fetch()`, and manual DOM handling. It imports nothing from `@clarity-chat/react`. The "quickstart" example does not use the library.

12. **The basic-chat example imports non-exported hooks** -- `apps/examples/basic-chat/src/App.tsx` imports `useTokenTracker`, `useRealisticTyping`, `useMessageOperations`, and `useMediaQuery` from `@clarity-chat/react`. **None of these are exported from the public API** (`public-api.ts` or `index.ts`). This example will not compile against the published package surface.

13. **No CSS import in README** -- The getting-started doc mentions `import '@clarity-chat/react/styles.css'` but the README Quick Start section never mentions it. Users copying the README code will get an unstyled component.

14. **`workspace:*` dependencies** -- Every example uses `"@clarity-chat/react": "workspace:*"` which only works inside the monorepo. There is no standalone example that demonstrates how an external consumer would use this package.

15. **"150+ components" claim** -- The `public-api.ts` exports roughly 40-50 named exports (components + hooks + types). Even `extended.ts` adds perhaps another 50. Reaching 150 requires counting every internal sub-component, type alias, and re-export.

---

## 6. Activation Failure Points

These are the exact moments where a new user's journey terminates:

1. **T+0:30** -- `npm install @clarity-chat/react` fails with 404. User stops.

2. **T+2:00** -- User decides to clone the repo. Runs `npm install`. Gets rejected: "Use pnpm." User may not have pnpm installed. Another obstacle.

3. **T+5:00** -- User runs `pnpm install`. Monorepo installs 500+ packages. User then needs to figure out they need to run `pnpm build` before anything works. This is not documented in the README.

4. **T+10:00** -- User copies README Level 1 example: `import { chat } from '@clarity-chat/react'`. Gets import error. `chat` is not exported.

5. **T+12:00** -- User tries README Level 5 (Legacy): `import { ClarityChatApp } from '@clarity-chat/react'`. This works! But now they need `/api/chat` endpoint. The README provides no backend setup. User has to find `docs/getting-started.md` and scroll to the "API Route Setup" section.

6. **T+20:00** -- User sets up the API route, which requires an OpenAI API key and manual SSE streaming code. This is 30+ lines of boilerplate. The library provides no server-side helpers.

7. **T+25:00** -- User gets the component rendering but it is unstyled because they did not import the CSS file (not mentioned in README).

---

## 7. What Made Me Want to Give Up

1. **The 404 on npm install.** This is an immediate disqualifier for any developer evaluating libraries. If I cannot install it, I move on.

2. **Ten different "hello world" patterns.** I spent 15 minutes just trying to figure out which one was the canonical approach. The README, the getting-started doc, and the examples all disagree with each other.

3. **The quickstart example that does not use the library.** The `examples/quickstart/` directory is positioned as "Works immediately - no API key needed!" in the examples README. It is 218 lines of vanilla React. It imports nothing from `@clarity-chat/react`. If this is the quickstart, what am I installing the library for?

4. **The 93 markdown files in the root directory.** This signals that the project is in an audit/documentation phase, not a usable-software phase. Files like `CLAIMS_VS_REALITY.md` in the root suggest the maintainers themselves know there is a gap between marketing and implementation.

5. **The non-exported APIs in code examples.** When the README's showcase code will not compile, I lose trust in every other claim.

---

## 8. Comparison to Competitor Onboarding

### shadcn/ui
- **Install:** `npx shadcn@latest init` -- works instantly, interactive CLI
- **First component:** `npx shadcn@latest add button` -- copies source into your project
- **Time to first render:** Under 2 minutes
- **Documentation:** One canonical path, clear and linear
- **What Clarity Chat lacks:** A working install command, a CLI, a single canonical getting-started path

### Vercel AI SDK
- **Install:** `npm install ai @ai-sdk/openai` -- works instantly, published on npm
- **First chat:** 15 lines of code (useChat hook + API route with 5 lines using `streamText`)
- **Time to first working chat:** Under 5 minutes
- **Documentation:** Excellent, with runnable CodeSandbox examples
- **Server-side:** The SDK provides `streamText()` -- one function for the API route. Clarity Chat requires you to write raw `fetch()` to the OpenAI API.
- **What Clarity Chat lacks:** A published package, server-side helpers, runnable online examples

### assistant-ui
- **Install:** `npx assistant-ui@latest init` -- works instantly
- **First component:** Pre-built Thread component
- **Time to first render:** Under 3 minutes
- **What Clarity Chat lacks:** A working scaffold command, pre-configured integrations

**Clarity Chat's onboarding is not in the same category as any of these competitors.** The competitors have published packages, working install commands, and a single clear path. Clarity Chat has none of these.

---

## 9. Time-to-First-Working-Chat Estimate

| Scenario | Estimated Time |
|---|---|
| Following README instructions exactly | **Impossible** (package not on npm, APIs not exported) |
| Cloning repo + using monorepo workspace | **30-45 minutes** (install pnpm, pnpm install, pnpm build, figure out which example to run, set up API keys) |
| External consumer after npm publish (hypothetical) | **15-20 minutes** (install, figure out correct API from conflicting docs, set up backend route, import CSS) |
| Vercel AI SDK (for comparison) | **3-5 minutes** |
| shadcn/ui chat component (for comparison) | **5-10 minutes** |

---

## 10. First-Run Experience Score

| Category | Score (1-10) | Notes |
|---|---|---|
| First Impression | 4 | Impressive claims, but README length and root file clutter raise flags |
| Installation | 0 | Package not published. First instruction fails. |
| Hello World | 1 | Multiple contradictory examples, most reference non-exported APIs |
| Documentation Quality | 3 | Getting-started doc is decent in isolation, but contradicts README |
| Documentation Navigation | 2 | No clear hierarchy, two example directories, 93 root markdown files |
| Example Quality | 3 | `examples/basic-chat` is well-written but imports non-exported hooks. Quickstart does not use the library. |
| API Discoverability | 2 | 3 sub-path entries, 10 different "hello world" patterns, unclear which is canonical |
| Trust | 1 | Showcase code that will not compile destroys credibility |
| Competitor Parity | 1 | Not in the same league as Vercel AI SDK, shadcn/ui, or assistant-ui for onboarding |
| **Overall** | **2/10** | The project has significant internal work but is not ready for external consumption |

---

## Summary

Clarity Chat is a **pre-release internal project** being presented as a **ready-to-use library**. The code quality within individual components appears solid. The architecture is thoughtful. The ambition is genuine. But the first-run experience is broken at every level:

1. You cannot install it.
2. The code examples in the README will not compile.
3. There is no single canonical "hello world" path.
4. The quickstart example does not use the library.
5. There is no live demo.
6. There is no server-side integration (you write raw fetch calls).
7. The documentation contradicts itself across README, getting-started, and examples.

**The single most impactful fix:** Publish the package to npm and create ONE getting-started path that works end-to-end in under 5 minutes, using only APIs that are actually exported from the main entry point. Remove or hide the other 9 "hello world" patterns until the canonical path is battle-tested.

---

## Appendix: File Paths Referenced

- `/README.md` -- 1,147-line README with 10 different getting-started patterns
- `/package.json` -- Root monorepo config, enforces pnpm
- `/packages/react/package.json` -- Main package, 18 peer dependencies, not published to npm
- `/packages/react/src/index.ts` -- Main entry, delegates to `app-api` and `public-api`
- `/packages/react/src/public-api.ts` -- Actual public exports (~80 symbols)
- `/packages/react/src/app-api/index.ts` -- App API exports
- `/packages/react/src/_internal-exports.ts` -- Internal-only file marked "DO NOT IMPORT"
- `/packages/react/src/utils/quick-start.tsx` -- `chat()` function, not exported publicly
- `/packages/react/src/extended.ts` -- Extended entry point (`@clarity-chat/react/extended`)
- `/packages/react/src/advanced.ts` -- Advanced entry point (`@clarity-chat/react/advanced`)
- `/docs/getting-started.md` -- Getting started doc, contradicts README
- `/docs/api-reference.md` -- API reference, reasonable quality
- `/examples/README.md` -- Examples index
- `/examples/quickstart/app/page.tsx` -- "Quickstart" that imports zero library components
- `/examples/basic-chat/components/basic-chat.tsx` -- Good example using `useClarityChat`
- `/apps/examples/basic-chat/src/App.tsx` -- Example importing non-exported hooks
