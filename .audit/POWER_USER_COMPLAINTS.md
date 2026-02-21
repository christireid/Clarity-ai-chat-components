# POWER USER COMPLAINTS

**Perspective:** Hostile power user — high standards, deep technical expectations, no patience

---

## My experience evaluating Clarity Chat

I'm a senior engineer building an AI-powered customer support tool. I need a React chat UI library. I found this repo. Here's what I think.

---

### Complaint 1: This can't be installed
I literally cannot use this. `npm install @clarity-chat/react` returns 404. The README lies to me in the first instruction. **Instant credibility destruction.**

### Complaint 2: The react package is a god package
I cloned the repo to evaluate. The `packages/react/src/` directory has **52 subdirectories** and **1,732 files**. This isn't a component library — it's an entire application framework crammed into one package.

I see:
- `rbac/` — Why does a chat UI library have role-based access control?
- `multi-tenancy/` — This is a SaaS infrastructure concern, not a UI concern
- `vector-stores/` — This belongs in a backend, not a React package
- `webhooks/` — Same
- `ci-cd/` — What??
- `document-loaders/` — This is LangChain territory
- `quotas/` — Rate limiting in a UI library?

**This tells me the developer doesn't understand what a component library is.** A component library provides composable UI primitives. It does NOT provide backend infrastructure, access control, or data pipelines.

### Complaint 3: Bundle size will be catastrophic
With 19MB of source and barrel exports, tree-shaking will struggle. If I `import { ClarityChat } from '@clarity-chat/react'`, how much gets bundled? I bet it's massive. No bundle size analysis is published. No size-limit CI check visible.

### Complaint 4: Too many packages for zero users
16 packages in a monorepo for a project with 0 users. Most successful libraries START with 1 package and split when they have a reason to. This is premature modularity.

Do I really need to install `@clarity-chat/types`, `@clarity-chat/utils`, `@clarity-chat/primitives`, `@clarity-chat/error-handling`, `@clarity-chat/token-optimization`, AND `@clarity-chat/memory` just to get a chat window? That's 7 packages for one component.

### Complaint 5: No real accessibility verification
Claims "WCAG AA with AAA targets." Show me:
- axe-core test results
- Screen reader testing reports
- Keyboard navigation test suite
- Color contrast analysis

I see none of this. Accessibility claims without evidence are worse than no claims — they're misleading.

### Complaint 6: Token optimization is a visualization layer, not optimization
The "token optimization" feature is really "token counting + UI display." The actual optimization (caching, compression) depends on the AI provider. Calling this "token optimization" oversells what it does.

The honest description: "Token usage monitoring and cost visualization."

### Complaint 7: Memory system is unproven
The "conversation memory" feature has never been used with real conversations at scale. There's no documentation of:
- Memory capacity limits
- Performance characteristics
- Storage backends supported
- Migration paths
- Data retention policies

### Complaint 8: 3 documentation sites, 0 deployed
I found apps/docs, apps/streamlined-docs, and apps/docs-site. Three documentation sites for a product with no users and no deployed docs. This is absurd.

### Complaint 9: Premature enterprise theater
Sales decks, enterprise licenses, implementation guides, pricing tiers, terms of service, privacy policies — all for a product with zero users. This isn't enterprise-ready. It's enterprise-cosplay.

### Complaint 10: The code review scripts are more complex than the product
50+ scripts in package.json including 9 "review" scripts, 4 "security" scripts, 3 "analyze" scripts. The meta-tooling around the code is more elaborate than the actual user-facing product.

---

## Would I use this?

**No.** Not in its current state.

**Would I consider it if:**
1. It was published to npm — YES, I'd evaluate it
2. It had a deployed demo — YES, I'd click around
3. The react package was focused (just UI) — YES, I'd take it seriously
4. It had >1,000 weekly npm downloads — YES, social proof matters
5. It had real accessibility test results — YES, that would be a differentiator

**The engineering quality is visible.** TypeScript strict mode, React 18/19 support, proper error boundaries — these are good signals. But signals don't matter if I can't install the product.

---

## Verdict

Strong engineering. Zero product discipline. Would not recommend to my team until the fundamentals are fixed.
