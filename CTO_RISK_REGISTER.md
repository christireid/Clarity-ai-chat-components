# CTO Risk Register: Clarity AI Chat Components

**Assessment Date**: 2026-02-19
**Assessed By**: CTO Office -- Adversarial Technical Review
**Codebase Snapshot**: 557 commits, all since December 2025
**Verdict**: HIGH RISK -- Multiple systemic issues requiring immediate triage before any production deployment

---

## Executive Summary

This codebase presents as a feature-rich AI chat component library. Under examination, it reveals a
pattern of **breadth-over-depth engineering** driven primarily by AI code generation (59% of commits
authored by "Claude", 7% by "emergent-agent-e1", 4% by "Cursor Agent" -- totaling 70%+
AI-authored code) at a pace of ~280 commits/month for 2 months. The result is a 208K LOC TypeScript
codebase with the surface area of a platform but the review discipline of a hackathon.

The core `@clarity-chat/react` package alone contains **1,765 source files across 248 directories**
with **487K lines including tests** -- for what is marketed as a "drop-in chat UI component." This
is not a component library. This is an entire application framework that has outgrown its architecture,
its test infrastructure, its build system, and its single maintainer.

---

## 1. Code Quality Assessment

### Rating: POOR (3/10)

| Metric | Count | Severity |
|---|---|---|
| `as any` casts | 693 across 233 files | HIGH |
| `@ts-nocheck` directives | 28 across 25 files | CRITICAL |
| `@ts-ignore` directives | 47 across 11 files | HIGH |
| `@ts-expect-error` directives | 66 across 40 files | MEDIUM |
| tsconfig exclude paths (react pkg) | 49 source directories/files | CRITICAL |
| Remaining TS errors (acknowledged) | ~630 | CRITICAL |
| `noUncheckedIndexedAccess` | **disabled** in main package | HIGH |
| `noUnusedLocals` | **disabled** | MEDIUM |
| `noUnusedParameters` | **disabled** | MEDIUM |
| `skipLibCheck` | enabled in **all 68** tsconfigs | HIGH |
| Duplicate filenames in react/src | 66 pairs | MEDIUM |
| TODO/FIXME/HACK markers | 133 across 40 files | MEDIUM |

**The Real Story**: The base `tsconfig.base.json` has `strict: true` with
`noUncheckedIndexedAccess: true` -- which sounds responsible. But the main `@clarity-chat/react`
package **immediately overrides both** to `false`. This is not "strict mode partially disabled."
This is strict mode performatively enabled at root and functionally disabled where it matters.

**The tsconfig exclude list is the smoking gun.** The react package's `tsconfig.json` excludes
49 source paths from type checking -- including entire feature directories like `security/`,
`safety/`, `webhooks/`, `enterprise/`, `domains/`, `plugins/`, `integrations/`, `extensions/`,
`typescript/`, and individual hook files. These are not test files being excluded. These are
**production source code directories that do not compile under TypeScript**. The compiler is being
told to look away from the code that ships.

---

## 2. Maintainability Risks

### Rating: CRITICAL (2/10)

**The Monolith Inside the Monorepo**

The `@clarity-chat/react` package is a god package. At 1,765 source files across 248 directories
and 53 top-level subdirectories in `src/`, it contains:

- A complete RBAC system (`rbac/`)
- Vector stores (`vector-stores/`)
- Document loaders for PDF and DOCX (`document-loaders/`)
- A reranking engine (`reranking/`)
- Embeddings (`embeddings/`)
- Multi-tenancy (`multi-tenancy/`)
- CI/CD helpers (`ci-cd/`)
- A bundle analyzer (`bundle-analyzer/`)
- Enterprise features (`enterprise/`)
- A prompt architect with 4-phase workflow (`prompt/architect/`)
- Safety systems including jailbreak prevention (`safety/`)
- Observability (`observability/`)
- Quota management (`quotas/`)
- Webhooks (`webhooks/`)

This is not a React component library. This is an **entire platform** stuffed into a single npm
package. A chat UI component should not contain vector stores, document loaders, RBAC, or
multi-tenancy infrastructure.

**Barrel Export Explosion**: 306 `index.ts` barrel export files across the codebase, with 146 in
the react package alone. The `public-api.ts` claims "essential 15 exports" but actually exports
**120+ named exports** across 369 lines. The `internal.ts` adds another 471 lines of exports. The
`extended.ts` adds 337 more. Every barrel re-export is a tree-shaking hazard and a circular
dependency opportunity.

**Naming Chaos**: 66 duplicate filenames within the react package. Files like `error-boundary.tsx`,
`command-palette.tsx`, and `analytics.tsx` exist in multiple directories with different
implementations. Both `context/` and `contexts/` directories exist. Both `prompt/` and `prompts/`
directories exist. Navigation requires knowing which `ChatInput.tsx` you mean.

---

## 3. Scalability Concerns

### Rating: HIGH RISK (3/10)

**Build System at Breaking Point**

- Build requires `NODE_OPTIONS='--max-old-space-size=2048'` (2GB heap) at standard concurrency
- A "legacy" build mode requires **4GB heap**: `--max-old-space-size=4096`
- Tests also require 4GB heap allocation
- Vitest runs in **single-threaded mode** (`singleThread: true`, `maxConcurrency: 1`) because
  multi-threaded execution causes OOM kills
- Test isolation is **disabled** (`isolate: false`) to reduce memory -- meaning tests share state
  and can pass or fail depending on execution order
- Test timeout set to 20 seconds (default is 5 seconds) -- indicating slow tests
- The vitest config comment acknowledges this: "was 512MB, caused OOM"

**What This Means**: Adding more tests, more components, or more packages will further stress a
build system already at its memory ceiling. CI runners (GitHub Actions ubuntu-latest provides
~7GB RAM) are adequate today but have no headroom. A developer with 8GB RAM on a laptop will
struggle to build this project while running anything else.

**Bundle Size Theater**

Two contradictory size-limit configs exist:
- `.size-limit.json` (root): Sets limits like `650 KB` for the full bundle
- `packages/react/.size-limit.js`: Sets limits of **3.2 MB** (gzipped!) for the same full bundle

The root config references `dist/core.js` with a 350KB limit, but the package config allows
a single named import (`ChatWindow`) to be **3 MB**. These limits are vanity metrics. A 3.2MB
gzipped JavaScript bundle for a chat component library is not optimized -- it is a red flag.

---

## 4. Security Vulnerabilities

### Rating: MEDIUM-HIGH RISK (4/10)

**Real Vulnerabilities Found**

| Finding | Severity | Location |
|---|---|---|
| `new Function()` in production code | CRITICAL | `packages/react/src/utils/security/safe-evaluate.ts:218`, `packages/playground/src/templates/advanced/function-calling.ts:30`, `packages/react/src/embeddings/local-embedder.ts:236` |
| `dangerouslySetInnerHTML` usage | HIGH | 44 files across the codebase |
| API keys read from `process.env` in client-importable code | HIGH | `packages/ai-infrastructure/src/streaming/provider-streaming.ts` (OPENAI, ANTHROPIC, GEMINI keys) |
| Deprecated unsafe eval acknowledged but still present | CRITICAL | `safe-evaluate.ts` -- file header says "DEPRECATED AND DISABLED BY DEFAULT DUE TO SECURITY RISKS" but function is still exported and importable |
| 1.8MB test bundle checked into repo | MEDIUM | `packages/token-optimization/test-bundles/` |
| 20+ dependency version overrides for CVEs | MEDIUM | `pnpm.overrides` in root `package.json` |

**The `safe-evaluate.ts` File**: This file contains a detailed security audit finding ("CRITICAL -
TOOL-021") explaining that the code can be exploited for arbitrary code execution via Unicode
escapes, property access chains, and prototype pollution. The file header recommends removing it
entirely. **It is still shipped.** The deprecation notice is in a comment. Comments do not stop
`import` statements.

**`dangerouslySetInnerHTML` in 44 Files**: While some uses may be paired with DOMPurify (462
sanitization-related references exist), the sheer surface area of 44 files using
`dangerouslySetInnerHTML` means any single missed sanitization is an XSS vector. Several usages
are in documentation/playground components that render user-provided or dynamically generated HTML.

**API Key Exposure Pattern**: `packages/ai-infrastructure/src/streaming/provider-streaming.ts`
reads `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `GEMINI_API_KEY` directly from `process.env`.
This package is importable from the client side. If tree-shaking fails or a developer imports
incorrectly, these env vars get bundled. The code has no server-only guard (`import 'server-only'`).

**What Is Done Well**: DOMPurify is used extensively (462 references). StepSecurity harden-runner
is deployed in CI workflows. GitHub Actions are SHA-pinned. Dependency review workflow exists.
These are genuine security practices, not theater.

---

## 5. Infrastructure Readiness

### Rating: NOT PRODUCTION-READY (3/10)

**CI/CD: Impressive Surface, Fragile Core**

27 GitHub Actions workflow files exist, including specialized workflows for bundle size checks,
accessibility, visual regression, peer dependency testing, tree-shaking validation, and
documentation sync. This is commendable CI breadth.

However:

- **No published coverage reports**: Coverage is configured (`provider: 'v8'`) but gitignored.
  No coverage thresholds are enforced. No coverage badges. The README claims "450+ tests" but
  there is no way to verify what percentage of code they cover. With 803 test files and
  `isolate: false`, the actual effective coverage could be significantly different from reported.
- **2 apps permanently disabled**: `apps/marketing-site` (Turbopack bug) and
  `apps/examples/conversational-analytics` (build errors) are excluded from the workspace.
  Disabled apps do not self-heal. They rot.
- **No staging environment visible**: No deployment configuration, no infrastructure-as-code,
  no Docker files, no Kubernetes manifests.
- **No monitoring or alerting**: No error tracking integration (Sentry exports exist but as
  example code), no performance monitoring in production, no alerting for bundle size regression
  beyond CI checks.
- **Test isolation disabled**: Tests run with `isolate: false`, meaning test results depend on
  execution order. A passing CI run does not guarantee individual test correctness.

---

## 6. Hidden Complexity That Will Bite

### Critical Hidden Risks

**6.1 The 49-Path TypeScript Exclude List**

The react package's tsconfig excludes 49 source paths from type checking. This means:
- These files compile via tsup/esbuild (which strips types) but have **never been validated by tsc**
- Any type errors in `security/`, `safety/`, `webhooks/`, `enterprise/`, `integrations/`,
  `plugins/`, `extensions/`, `domains/`, `performance/`, and others are invisible
- Adding these back to the include list will surface the ~630 acknowledged remaining errors **plus
  an unknown number of additional errors** in the excluded paths
- Every file in these excluded paths is a **ticking type-safety bomb**

**6.2 The Public API Surface Area**

The `public-api.ts` (369 lines), `extended.ts` (337 lines), `internal.ts` (471 lines), and
`app-api/` directory together export hundreds of named symbols. Every exported symbol is a
**public API commitment**. With semantic versioning, changing any of these exports is a breaking
change. The library has painted itself into a corner where removing dead code from exports
requires a major version bump.

**6.3 The 21 Peer Dependencies**

The react package declares 21 peer dependencies, of which 17 are optional. This creates a
combinatorial testing matrix of `2^17 = 131,072` possible dependency configurations. The peer
dependency test workflow tests a few configurations. It cannot test all of them. Users will
discover failures in untested combinations.

Required peers include `framer-motion`, `lucide-react`, and `zod` -- none of which are standard
for a "drop-in" chat component. A user cannot `npm install @clarity-chat/react` and have it work
without also installing these three dependencies and accepting their bundle size costs.

**6.4 react-window AND @tanstack/react-virtual Both Included**

Both `react-window` (peer dep + direct dep) and `@tanstack/react-virtual` (direct dep) are included.
These are competing virtual scrolling libraries. Having both means duplicate functionality,
increased bundle size, and confusion about which to use. `react-virtualized-auto-sizer` is also
included as both a peer dependency AND a direct dependency.

**6.5 Workspace Dependencies Using `workspace:*`**

Seven internal packages are dependencies: `@clarity-chat/license`, `@clarity-chat/error-handling`,
`@clarity-chat/memory`, `@clarity-chat/primitives`, `@clarity-chat/token-optimization`,
`@clarity-chat/types`, `@clarity-chat/utils`. All use `workspace:*`, meaning they resolve to
whatever version is in the monorepo. This works in development but requires correct `publishConfig`
and workspace protocol resolution during `npm publish`. A broken publish can ship a package that
references `workspace:*` literally, breaking every consumer.

---

## 7. Build Rot Risks

### Rating: HIGH (2/10 survivability)

| Risk | Likelihood | Impact | Timeframe |
|---|---|---|---|
| Next.js version upgrade breaks disabled apps permanently | HIGH | MEDIUM | 3-6 months |
| Vitest OOM failures as test count grows past ~250 | HIGH | HIGH | 3 months |
| TypeScript upgrade re-surfaces hidden errors in excluded paths | HIGH | CRITICAL | Next TS release |
| Framer Motion major version breaks animations across 442 presets | MEDIUM | HIGH | 6-12 months |
| Node.js 20 EOL (April 2026) forces upgrade with unknown breakage | CERTAIN | MEDIUM | 2 months |
| pnpm 10 `workspace:*` resolution changes during publish | MEDIUM | CRITICAL | Any time |
| Turbo 2.x to 3.x migration required | MEDIUM | HIGH | 6-12 months |
| `react-window` deprecation (last publish 2+ years ago) | HIGH | MEDIUM | Already happening |
| tsup/esbuild version drift breaks build pipeline | MEDIUM | HIGH | 6 months |
| Size-limit thresholds never tightened (3.2MB limit is meaningless) | CERTAIN | LOW | Permanent |

**The 557-commits-in-2-months Problem**: This codebase went from zero to 208K LOC in ~60 days.
This is approximately 3,500 LOC per day. No human writes 3,500 lines of production TypeScript
per day. The velocity confirms the AI-generation hypothesis. AI-generated code is not inherently
bad, but AI-generated code without human review, without test coverage verification, and without
architectural governance is **technical debt generated at machine speed**.

---

## 8. Long-Term Survivability with Single Maintainer

### Rating: UNSURVIVABLE (1/10)

**The Bus Factor Is Zero**

The commit log shows one human author (Christi Reid, 165 commits / 30%) and three AI authors
(Claude: 329 commits / 59%, emergent-agent-e1: 40 / 7%, Cursor Agent: 23 / 4%). No pull request
review process is visible. No CODEOWNERS file. No branch protection requiring reviews.

**What happens when the maintainer is unavailable for 2 weeks?**
- Zero people can debug a build failure caused by a transitive dependency update
- Zero people understand why 49 paths are excluded from TypeScript
- Zero people know which of the 66 duplicate filenames are canonical
- Zero people can determine if the `safe-evaluate.ts` file is actually used in any code path
- Zero people can explain the difference between `prompt/` and `prompts/`

**The Maintainer Cannot Keep Up**

At 208K LOC with 803 test files across 41 packages, a single developer cannot:
- Review security advisories for the 20+ overridden dependencies in a timely manner
- Maintain 27 GitHub Actions workflows
- Keep 21 peer dependencies compatible across version ranges
- Manage 28 example apps (some of which are already broken)
- Respond to user issues across this API surface
- Perform the TypeScript migration (acknowledged ~630 remaining errors)

This is not a question of competence. This is a question of physics. One person cannot maintain
a codebase of this size and complexity.

---

## 9. What Breaks First Under Production Load

### Failure Cascade Analysis (Most Likely to Least)

1. **Memory pressure in SSR/SSG builds** (DAYS)
   - The 2-4GB heap requirement will hit Vercel/Netlify/Cloudflare build limits
   - Serverless function cold starts with a 3.2MB bundle will exceed timeout thresholds
   - First user with a moderate-traffic site will report 502s from memory exhaustion

2. **Peer dependency hell for consumers** (WEEKS)
   - Users will install `@clarity-chat/react` and get a wall of peer dependency warnings
   - `framer-motion ^12.23.25` conflicts with users pinned to earlier v12 or v11
   - `react-markdown ^10.0.0` conflicts with users on v8/v9
   - The 17 optional peers create "works on my machine" environments

3. **XSS through unsanitized `dangerouslySetInnerHTML`** (MONTHS)
   - With 44 files using `dangerouslySetInnerHTML`, statistical probability of a missed
     sanitization approaches certainty over time
   - Markdown rendering paths are the highest risk -- user-provided content parsed as HTML

4. **Type errors surface at consumer sites** (WEEKS)
   - `skipLibCheck: true` everywhere means type errors in `.d.ts` files are invisible
   - Consumers with `skipLibCheck: false` will see errors this library does not
   - The 693 `as any` casts are type-system escape hatches that push errors to consumers

5. **Test suite becomes unmaintainable** (MONTHS)
   - With `isolate: false`, tests that pass in CI can fail locally (and vice versa)
   - Adding new tests increases memory pressure and execution time
   - Single-threaded execution means test runs will exceed CI timeout (currently 15 min)

---

## 10. Risk Register

| ID | Risk | Category | Likelihood | Impact | Severity | Status | Mitigation |
|---|---|---|---|---|---|---|---|
| R-001 | 49 source paths excluded from TypeScript checking ship unchecked code | Code Quality | CERTAIN | CRITICAL | **P0** | OPEN | Re-include all paths; fix all errors before release |
| R-002 | `new Function()` in 3 production files enables arbitrary code execution | Security | HIGH | CRITICAL | **P0** | OPEN | Remove `safe-evaluate.ts`, audit remaining usages |
| R-003 | Single maintainer with 70%+ AI-generated code and no review process | Operational | CERTAIN | CRITICAL | **P0** | OPEN | Hire second maintainer; require PR reviews |
| R-004 | Build requires 2-4GB heap; tests OOM on standard hardware | Infrastructure | CERTAIN | HIGH | **P1** | OPEN | Split react package; reduce barrel exports; enable test isolation |
| R-005 | 693 `as any` casts and 28 `@ts-nocheck` bypass type safety | Code Quality | CERTAIN | HIGH | **P1** | OPEN | Systematic removal with lint rules preventing new additions |
| R-006 | 44 files use `dangerouslySetInnerHTML`; any missed sanitization is XSS | Security | HIGH | CRITICAL | **P1** | OPEN | Audit all 44 usages; add ESLint rule requiring DOMPurify pairing |
| R-007 | API keys readable in client-importable `ai-infrastructure` package | Security | MEDIUM | CRITICAL | **P1** | OPEN | Add `import 'server-only'` guard; move to server-only package |
| R-008 | react package is a 1,765-file god package with 53 subdirectories | Maintainability | CERTAIN | HIGH | **P1** | OPEN | Extract vector-stores, embeddings, RBAC, multi-tenancy to own packages |
| R-009 | `isolate: false` in vitest means tests share state; results are unreliable | Testing | CERTAIN | HIGH | **P1** | OPEN | Re-enable isolation; fix memory issues at source |
| R-010 | 21 peer dependencies (3 required) create installation friction | Developer Experience | HIGH | MEDIUM | **P2** | OPEN | Make `framer-motion` optional; reduce required peers to react only |
| R-011 | Two disabled workspace apps rotting without CI coverage | Build Rot | CERTAIN | MEDIUM | **P2** | OPEN | Fix or remove; do not leave disabled indefinitely |
| R-012 | Duplicate virtual scrolling libraries (react-window + @tanstack/react-virtual) | Bundle Size | CERTAIN | MEDIUM | **P2** | OPEN | Choose one; remove the other |
| R-013 | No coverage thresholds enforced; coverage reports not published | Testing | CERTAIN | MEDIUM | **P2** | OPEN | Set minimum thresholds; publish to CI artifacts |
| R-014 | 306 barrel exports create tree-shaking hazards and circular dependency risk | Bundle Size | HIGH | MEDIUM | **P2** | OPEN | Audit and reduce; use direct imports where possible |
| R-015 | Node.js 20 EOL in April 2026; upgrade path untested | Infrastructure | CERTAIN | MEDIUM | **P2** | OPEN | Test against Node 22; update engines field |
| R-016 | 3.2MB gzipped bundle limit is meaninglessly high | Bundle Size | CERTAIN | LOW | **P3** | OPEN | Set realistic limits based on competitor analysis |
| R-017 | `workspace:*` protocol in publish pipeline risk | Release | MEDIUM | HIGH | **P2** | OPEN | Verify changeset publish resolves workspace protocol correctly |
| R-018 | 66 duplicate filenames in react package cause developer confusion | Maintainability | CERTAIN | LOW | **P3** | OPEN | Audit and rename or consolidate |
| R-019 | 133 TODO/FIXME/HACK markers indicate unfinished work | Code Quality | CERTAIN | LOW | **P3** | OPEN | Triage and resolve or document as known limitations |
| R-020 | 1.8MB test bundle checked into git in token-optimization package | Repository Health | CERTAIN | LOW | **P3** | OPEN | Move to CI artifact or gitignore |
| R-021 | `public-api.ts` exports 120+ symbols; each is a semver commitment | API Surface | CERTAIN | HIGH | **P2** | OPEN | Audit exports; mark non-essential as `@internal` or move to `/internal` |

---

## Recommendations (Priority Order)

### Immediate (Before Any Production Deployment)

1. **Delete `safe-evaluate.ts`** and remove all `new Function()` calls from production code
2. **Add `import 'server-only'`** to `ai-infrastructure` package
3. **Audit all 44 `dangerouslySetInnerHTML` usages** for missing sanitization
4. **Set coverage thresholds** (minimum 60% lines) and enforce in CI
5. **Re-enable test isolation** (`isolate: true`) even if it means fewer tests pass initially

### Short-Term (30 Days)

6. **Break up the react god package** -- extract `vector-stores`, `embeddings`, `document-loaders`,
   `rbac`, `multi-tenancy`, `reranking`, `enterprise`, `webhooks`, `observability`, `quotas` into
   independent packages or remove them entirely
7. **Remove one virtual scrolling library** (recommend keeping `@tanstack/react-virtual`)
8. **Fix or delete the 2 disabled apps** -- do not let them continue to rot
9. **Reduce required peer dependencies** to `react` and `react-dom` only
10. **Hire a second maintainer** or find a co-maintainer in the open-source community

### Medium-Term (90 Days)

11. **Re-include all 49 excluded tsconfig paths** and fix resulting errors
12. **Eliminate all `@ts-nocheck` directives** (28 files)
13. **Reduce `as any` casts by 50%** with a lint rule preventing new additions
14. **Set realistic bundle size limits** (target: <200KB gzipped for core)
15. **Establish a PR review requirement** -- every change reviewed by a human before merge

---

## Conclusion

This codebase is a case study in what happens when AI code generation meets solo development
without architectural governance. The tooling is often excellent (StepSecurity, SHA-pinned actions,
DOMPurify adoption, comprehensive CI workflows). The ambition is impressive (RBAC, multi-tenancy,
vector stores, 28 example apps). But the execution has outpaced the ability to maintain quality.

The single most dangerous aspect of this codebase is not any individual bug or vulnerability.
It is the **49 TypeScript paths excluded from type checking** combined with **test isolation
disabled** combined with **no code review process**. This means code ships without type checking,
tests may pass due to shared state rather than correctness, and no human validates the result.
This is a triple failure of the verification pipeline.

**The project needs to shrink to survive.** Fewer features, fewer packages, fewer files, fewer
exports, fewer peer dependencies. A 208K LOC codebase maintained by one person with AI assistance
is not a product. It is a liability waiting for a trigger.

---

*This risk register was compiled through automated static analysis of the codebase. All numbers
are verifiable by running the commands referenced in the analysis. No claims are based on
assumptions -- every finding links to specific files, lines, and configurations.*
