# RUTHLESS PRIORITY STACK RANK

**Scoring model:** Impact = Revenue Potential + Trust + Adoption + Survivability
**Method:** Highest impact per unit effort. Existential risks first.

---

## Tier 0: Existential Threats (Do or die)

These block ALL progress. Nothing else matters until these are fixed.

| # | Task | Impact | Effort | Why |
|---|---|---|---|---|
| T0-1 | **Delete/archive premature commercial docs** (pricing, sales deck, enterprise license, ToS, privacy policy, implementation guide) | 9 | 1h | These actively damage credibility. A pricing page for a product that can't be installed is a red flag. |
| T0-2 | **Delete non-UI subsystems from react package** (rbac, multi-tenancy, vector-stores, webhooks, ci-cd, document-loaders, embeddings, evaluation, observability, quotas, reranking, bundle-analyzer) | 10 | 4h | The react package must be a component library, not a platform. |
| T0-3 | **Clean misplaced files** (globals.css, .docx files, COMPONENT_IMPROVEMENT_PLAN.md from packages/) | 6 | 0.5h | Repo hygiene. These shouldn't be here. |
| T0-4 | **Delete/archive duplicate docs apps** (keep docs, delete streamlined-docs, docs-site) | 7 | 0.5h | 3 docs sites = confusion. Pick one canonical. |
| T0-5 | **Remove compiled artifacts from marketing-site** (.d.ts, .js files alongside .tsx sources) | 6 | 0.5h | Build artifacts in source control is a red flag. |

---

## Tier 1: Product Credibility Blockers

These prevent anyone from taking the project seriously.

| # | Task | Impact | Effort | Why |
|---|---|---|---|---|
| T1-1 | **Fix README first instruction** — add note that npm publish is pending, link to GitHub install | 9 | 0.5h | The first thing a user tries must not fail silently |
| T1-2 | **Simplify package.json scripts** — remove all unverified/unused scripts | 7 | 1h | 50+ scripts overwhelm contributors |
| T1-3 | **Sharpen README messaging** — lead with benefit, not features | 7 | 1h | Current messaging is generic |
| T1-4 | **Add .nvmrc** | 3 | 0.1h | Basic DX |
| T1-5 | **Move root deps** (dompurify, tsx) to correct packages | 4 | 0.5h | Root deps are a smell |

---

## Tier 2: Growth Unlocks

These enable future growth when the product is published.

| # | Task | Impact | Effort | Why |
|---|---|---|---|---|
| T2-1 | Consolidate react package entry points (4 → 2) | 6 | 2h | Reduce API confusion |
| T2-2 | Add axe-core accessibility tests to key components | 7 | 4h | Back up the accessibility claim |
| T2-3 | Clean up react/src — remove empty/stub directories | 5 | 2h | Reduce noise |
| T2-4 | Verify and document bundle size for key imports | 6 | 2h | Answer "how big is it?" |

---

## Tier 3: Optimization (Do after users exist)

| # | Task | Impact | Effort | Why |
|---|---|---|---|---|
| T3-1 | Split large files (>1,000 lines) | 3 | 10h | Maintainability |
| T3-2 | Continue duplicate API consolidation | 4 | 20h | Code quality |
| T3-3 | Increase test coverage to 60% | 4 | 20h | Confidence |
| T3-4 | Add visual regression tests | 3 | 8h | Prevent UI regressions |

---

## Execution Order

```
T0-1 → T0-2 → T0-3 → T0-4 → T0-5 → T1-1 → T1-2 → T1-3 → T1-4 → T1-5
```

Total Tier 0 + Tier 1 effort: ~10 hours
This is what stands between the current state and a publishable product.
