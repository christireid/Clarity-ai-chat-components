# CRANKY ENGINEER NOTES

**Perspective:** Cranky senior engineer who has seen too much
**Mood:** Tired, experienced, intolerant of waste

---

## The Good (I'll say this once, then complain)

- TypeScript strict mode everywhere. Thank you.
- Error boundaries exist and are properly structured.
- React 18/19 patterns are correct. No legacy class components where they shouldn't be.
- The monorepo workspace structure is standard pnpm + Turborepo. Nothing exotic.
- The README is honest. I appreciate not being lied to.

Now for the complaints.

---

## DX Friction

### 1. I need 2-4GB heap to build a component library
```json
"build": "NODE_OPTIONS='--max-old-space-size=2048' turbo run build --concurrency=2"
```
This is a symptom, not a solution. If your component library needs 2GB to build, you have too much code. My laptop shouldn't need a memory flag to compile your buttons.

### 2. 50+ scripts in package.json
There are 9 "review" scripts, 4 "security" scripts, 3 "analyze" scripts, 6 "docs" scripts, and various generators. Most of these reference custom scripts in a `scripts/` directory that may or may not work.

I ran `pnpm review` and got... I don't know, because I can't verify if these scripts even execute without errors. **Untested meta-tooling is worse than no meta-tooling** because it gives the illusion of quality.

### 3. No `.nvmrc` or `.node-version`
The package.json says `node >= 20.0.0` but there's no `.nvmrc` file. First contributor runs `nvm use`, gets confused.

### 4. `dompurify` and `tsx` as root dependencies
Why are these root workspace dependencies instead of in the packages that use them? `tsx` is a dev tool, not a production dependency.

---

## Anti-patterns

### 5. The react package is a god module
52 subdirectories. 1,732 files. 19MB of source. This violates every principle of modular design.

A component library should contain:
- Components (JSX)
- Hooks (custom React hooks)
- Types
- Styles
- Utils (tiny, focused)

It should NOT contain:
- RBAC, multi-tenancy, webhooks, vector stores, CI/CD, document loaders, embeddings, evaluation frameworks, observability, quotas, reranking

These are different concerns. They belong in different packages or different projects entirely. Putting them all in one package means every user downloads everything. Tree-shaking is not magic — barrel exports defeat it.

### 6. Multiple barrel exports that may conflict
```
packages/react/src/index.ts (50 lines)
packages/react/src/public-api.ts (369 lines)
packages/react/src/core.ts
packages/react/src/extended.ts
```
Four entry points for one package. Which one is canonical? What happens when someone imports from the wrong one? This is a recipe for confusion.

### 7. Word documents in a code repository
`packages/AI_Chat_UI_Competitor_Inventory_Report.docx`
`packages/Clarity_Chat_Strategic_Recommendations.docx`

No. Word documents do not belong in a code repository. Use Markdown or don't put them here.

### 8. 91KB globals.css at the packages root
4,190 lines of CSS. At the root of the packages directory. Not imported by anything I can find. Just... existing.

---

## Over-engineering

### 9. 16 packages for 0 users
The dependency tree for a simple chat import:
```
@clarity-chat/react
  → @clarity-chat/types
  → @clarity-chat/utils
  → @clarity-chat/primitives
  → @clarity-chat/token-optimization
  → @clarity-chat/memory
  → @clarity-chat/error-handling
```
7 packages for one component. This is premature decomposition. Ship one package. Split later when you have a reason.

### 10. 3 documentation sites
`apps/docs`, `apps/streamlined-docs`, `apps/docs-site`. Why three? Pick one. Delete the others. Deploy it.

### 11. 3D hero and magnetic buttons for a marketing site nobody visits
`apps/marketing-site/components/3d/Hero3D.tsx`
`apps/marketing-site/components/ui/MagneticButton.tsx`
`apps/marketing-site/components/ui/TiltCard.tsx`
`apps/marketing-site/components/ui/SpotlightCard.tsx`

You built a Three.js hero animation for a website with zero visitors. This is not polish — this is avoidance. Polish comes after product-market fit.

### 12. Code review and security scripts that are more complex than the product
There's an entire `scripts/code-review.ts` with multiple modes (security, performance, typescript, tailwind). There's a `scripts/security-audit.ts`. These are tools for a team. You are 1 person. Use ESLint and move on.

---

## Reinventing Wheels

### 13. Custom logger when `console.log` exists
Multiple custom logger implementations across packages (some now deleted). For a pre-release component library, `console.log` with a prefix is fine. Ship first, instrument later.

### 14. Custom cache implementations
Multiple cache implementations when `Map` with a TTL check would suffice for a component library. The `TieredCache`, `SmartCache`, `ExactCache`, `AdvancedContextCache`, `AdvancedSemanticCache` — this is a caching framework, not a component library utility.

### 15. Custom error classes when Error exists
9 different validation error classes. At this stage, `new Error('validation failed: ...')` is fine. Ship first, type later.

---

## What I Would Do

1. Delete 70% of `packages/react/src/` (everything that isn't components, hooks, types, or minimal utils)
2. Merge all packages into 1: `@clarity-chat/react`
3. Delete 2 of 3 docs sites
4. Delete the marketing site (premature)
5. Remove all custom scripts except build, test, lint, typecheck
6. Publish to npm
7. Write a blog post
8. Go outside

---

## Verdict

The engineering skill is real. The architecture knowledge is real. The problem-solving ability is real. But it's all been applied to the wrong problems. Building RBAC for a chat library nobody uses is not engineering — it's procrastination.

Ship something small. Get feedback. Iterate. This is how good products are built.
