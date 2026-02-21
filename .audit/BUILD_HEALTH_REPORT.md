# BUILD HEALTH REPORT

**Date:** 2026-02-21

---

## Executive Summary

The build system is professionally configured but masks fundamental problems: the codebase is too large to build without memory flags, the marketing site has compiled artifacts in source control, and critical quality gates (typecheck, lint, test) have unknown pass/fail status because they haven't been run in a CI pipeline against the current state.

---

## Build System Configuration

| Aspect | Status | Details |
|---|---|---|
| Package manager | pnpm 10.21.0 | Correct, workspace configured |
| Build orchestrator | Turborepo 2.6.3 | Correct, caching enabled |
| Bundler | tsup 8.5.1 | Correct for library packages |
| TypeScript | 5.9.3 (strict) | Correct, strict mode |
| Linter | ESLint 9 | Modern flat config |
| Formatter | Prettier | Configured |
| Git hooks | Husky + lint-staged | Configured |
| Test framework | Vitest 4.0.16 | Configured |
| E2E | Playwright 1.57.0 | Configured |

**Verdict:** Config is professional-grade. The tooling is modern and correct.

---

## Build System Red Flags

### 1. Memory pressure
```
"build": "NODE_OPTIONS='--max-old-space-size=2048' turbo run build --concurrency=2"
"build:legacy": "NODE_OPTIONS='--max-old-space-size=4096' turbo run build --concurrency=2"
"test": "NODE_OPTIONS='--max-old-space-size=4096' turbo run test"
```
- Needing 2-4GB heap for builds is a symptom of the 19MB react package
- `--concurrency=2` means builds can't parallelize properly
- This will get worse as code grows

### 2. Compiled artifacts in source control
The marketing site has 42 `.d.ts` files and 43 `.js` files checked in alongside `.tsx` source files. This means either:
- The build output was accidentally committed
- Or the marketing site was copied from a build and modified
Either way, these should be in .gitignore.

### 3. Misplaced files at packages root
- `packages/globals.css` (91KB, 4,190 lines) — global CSS at the wrong level
- `packages/*.docx` — Word documents in a code directory
- `packages/COMPONENT_IMPROVEMENT_PLAN.md` — planning doc at wrong level

### 4. Duplicate apps
Three documentation apps exist (docs, streamlined-docs, docs-site), creating maintenance burden and confusion about which is canonical.

---

## Dependency Health

### React version
- Pinned to React 19.2.0 via pnpm overrides — correct and modern

### Notable dependencies
| Dependency | Usage | Concern |
|---|---|---|
| `dompurify` | Root dependency | Should be in packages, not root |
| `tsx` | Root dependency AND devDependency | Duplicated |
| 26+ security overrides in pnpm | Various CVE patches | Shows active maintenance |

### Workspace dependency graph
```
types (0 internal deps)
  └── utils
      └── primitives
          └── token-optimization
          └── memory
          └── error-handling
              └── react (depends on ALL above)
```

The dependency tree is reasonable. Previous audit identified a circular dependency risk (token-optimization → primitives) that needs resolution.

---

## Script Coverage

| Category | Scripts | Status |
|---|---|---|
| Build | build, build:packages, build:sequential | Exist |
| Test | test, test:watch, test:coverage, test:e2e | Exist |
| Lint | lint, lint:fix | Exist |
| Typecheck | typecheck | Exists |
| Format | format, format:check | Exist |
| Release | changeset, version-packages, release | Exist but never used |
| Dev | dev, storybook | Exist |
| Quality gate | check, check:all | Exist |

**Over-engineering signal:** 50+ scripts in root package.json, including:
- 9 "review" scripts
- 4 "security" scripts
- 3 "analyze" scripts
- Multiple code generators

Most of these have never been used or verified.

---

## DX Assessment

### Getting started
```bash
git clone ...
pnpm install
pnpm build        # Requires 2GB+ heap
pnpm storybook    # To see components
```

**Pain points:**
1. `pnpm install` will take significant time (large monorepo)
2. `pnpm build` requires memory flags — confusing for first-time contributors
3. No single "pnpm dev" that shows something immediately useful
4. No quick-start development mode documented

### Contributing
- CONTRIBUTING.md exists and is well-written
- But references features and workflows that may not work (e.g., `plop` generators)
- No verification that the "happy path" actually works end-to-end

---

## Critical Build Issues

### Issue 1: The react package is too large to maintain
- 19MB source, 1,732 files
- Contains entire subsystems that don't belong (RBAC, multi-tenancy, vector stores, CI/CD)
- Any "pnpm typecheck" on this package will be slow and memory-intensive
- Tree-shaking may not be effective due to barrel exports

### Issue 2: No CI/CD running against current branch
- 26 GitHub Actions workflows claimed
- But current branch hasn't been pushed to trigger CI
- Unknown whether typecheck, lint, or tests pass

### Issue 3: Unknown test coverage
- 450+ tests claimed in ROADMAP
- No recent coverage report
- Previous audit estimated 27% coverage — far below the 60% target

### Issue 4: Release pipeline never tested
- Changesets configured but never used
- No npm publish has ever occurred
- The entire publish flow is untested

---

## Recommendations

1. **Verify builds work:** Run `pnpm build:packages`, `pnpm typecheck`, `pnpm lint`, `pnpm test` and document results
2. **Remove compiled artifacts** from marketing-site source control
3. **Delete or archive** docs-site and streamlined-docs (pick one docs app)
4. **Move misplaced files** out of packages/ root
5. **Reduce react package** by moving subsystems to separate packages or deleting them
6. **Test the release pipeline** with a dry-run publish
7. **Remove unused scripts** from root package.json (keep only what's actively used)
