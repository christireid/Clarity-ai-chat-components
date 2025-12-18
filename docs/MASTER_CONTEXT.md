# CLARITY CHAT — MASTER CONTEXT

**Single Source of Truth for Commercial Library Development**

Last Updated: 2025-12-18 Quality Target: 97/100

---

## 1. Executive Overview

### What This Library Is

- **Product**: Clarity Chat - Premium AI Chat Component Library for React
- **Value Proposition**: Drop-in AI chat UI components that work out of the box with streaming,
  memory, tools, and enterprise features
- **Target Customer**: React developers building AI-powered chat applications, from startups to
  enterprise

### What This Library Is Not

- Not a backend/API solution (bring your own AI endpoint)
- Not a framework (React components only)
- Not infinitely configurable (opinionated, batteries-included)
- Not free (paid library with tiered plans)

### Commercial Context

- **Distribution Model**: Private npm/GitHub Packages (primary paywall)
- **Licensing Model**: Local license key validation (no network calls)
- **Plans**: community, pro, enterprise
- **Activation Target**: < 2 minutes from install to working chat

---

## 2. Repo Architecture Snapshot

### Repo Type

- **Structure**: pnpm monorepo with Turborepo
- **Package Manager**: pnpm 10.21.0
- **Build Tool**: tsup (most packages), Vite (some)
- **Test Framework**: Vitest
- **Node Version**: >=20.0.0

### Top-Level Structure

| Path                                 | Purpose                     | Status                        |
| ------------------------------------ | --------------------------- | ----------------------------- |
| `/packages/`                         | Core library packages       | Keep                          |
| `/apps/`                             | Demo apps, docs, storybook  | Keep (review)                 |
| `/examples/`                         | Standalone example projects | Keep (consolidate)            |
| `/docs/`                             | Documentation               | Keep (this file only remains) |
| `/tools/`                            | Build/dev tooling           | Keep                          |
| `/tests/`                            | E2E and visual tests        | Keep                          |
| `/scripts/`                          | Automation scripts          | Keep                          |
| `/.github/`                          | GitHub Actions, templates   | Keep (review)                 |
| `/.changeset/`                       | Changeset config            | Keep                          |
| `/infrastructure/`                   | Deployment configs          | Review                        |
| `/eslint-plugin-clarity-animations/` | Custom ESLint               | Review necessity              |
| `/styles/`                           | Global styles               | Review necessity              |

---

## 3. Package Inventory

### Public Packages (Consumer-Facing)

| Package                 | Version | Description            | Entry Points                                                                                       | Status      |
| ----------------------- | ------- | ---------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `@clarity-chat/react`   | 1.0.0   | Main React components  | `.`, `./core`, `./animations`, `./utils`, `./memory`, `./adapters`, `./test-utils`, `./styles.css` | **Primary** |
| `@clarity-chat/license` | 1.0.0   | License validation     | `.`                                                                                                | Keep        |
| `@clarity-chat/types`   | 1.0.0   | TypeScript definitions | `.`, `./memory`                                                                                    | Keep        |

### Internal Packages (Not Published Separately)

| Package                            | Version | Description            | Status              |
| ---------------------------------- | ------- | ---------------------- | ------------------- |
| `@clarity-chat/utils`              | 1.0.0   | Unified utilities      | Keep (internal dep) |
| `@clarity-chat/primitives`         | 1.0.0   | Base UI components     | Keep (internal dep) |
| `@clarity-chat/memory`             | 0.1.0   | Memory management      | Keep (internal dep) |
| `@clarity-chat/token-optimization` | 1.0.0   | Token utilities        | Keep (internal dep) |
| `@clarity-chat/error-handling`     | 2.0.0   | React error boundaries | Keep (internal dep) |
| `@clarity-chat/cli`                | -       | CLI tools              | Review necessity    |
| `@clarity-chat/dev-tools`          | -       | Dev utilities          | Review necessity    |
| `@clarity-chat/codemods`           | -       | Migration tools        | Review necessity    |
| `@clarity-chat/testing-utils`      | -       | Test helpers           | Keep (internal)     |
| `@clarity-chat/playground`         | -       | Dev playground         | Review necessity    |
| `typescript-config`                | -       | Shared TS config       | Keep                |

### Deprecated Packages (DELETE)

| Package                      | Reason                                              | Action     |
| ---------------------------- | --------------------------------------------------- | ---------- |
| `@clarity-chat/errors`       | Deprecated, re-exports `@clarity-chat/utils/errors` | **DELETE** |
| `@clarity-chat/shared-utils` | Deprecated, re-exports `@clarity-chat/utils`        | **DELETE** |

---

## 4. Public API Inventory

### Top-Level Components (Drop-in Ready)

| Component            | Package | Purpose                     |
| -------------------- | ------- | --------------------------- |
| `ClarityChat`        | react   | Main drop-in chat component |
| `ClarityChatPresets` | react   | Pre-configured variants     |
| `ChatComplete`       | react   | Full-featured recipe        |
| `ChatWithMemory`     | react   | Memory-enabled recipe       |
| `ChatWithAnalytics`  | react   | Analytics-enabled recipe    |

### Primary Hooks

| Hook               | Package | Purpose                 |
| ------------------ | ------- | ----------------------- |
| `useClarityChat`   | react   | Primary chat state hook |
| `useClarityObject` | react   | Structured output hook  |
| `useLicenseStatus` | license | License state           |
| `useIsLicensed`    | license | Boolean license check   |

### License Components

| Component         | Package | Purpose              |
| ----------------- | ------- | -------------------- |
| `LicenseProvider` | license | Context provider     |
| `Watermark`       | license | Unlicensed watermark |
| `LicenseGate`     | license | Feature gating       |
| `withLicense`     | license | HOC wrapper          |

---

## 5. File Inventory

### Root Files to DELETE (75 files)

#### Audit/Report Markdown Files (DELETE ALL)

```
ADVANCED_TOKEN_OPTIMIZATION_RESEARCH.md
ALL_ISSUES_FIXED_SUMMARY.md
CODE_REUSE_AUDIT.md
CODE_REUSE_AUDIT_REPORT.md
CODE_REUSE_AUDIT_REPORT_POST_REFACTOR.md
CODE_REUSE_AUDIT_SUMMARY.md
CODE_REUSE_CONSISTENCY_AUDIT.md
CODE_REUSE_CONSISTENCY_AUDIT_REPORT.md
CODE_REUSE_IMPLEMENTATION_COMPLETE.md
CODE_REUSE_IMPLEMENTATION_SUMMARY.md
COMMERCIAL_RELEASE_REPORT.md
COMPREHENSIVE_CODE_REVIEW_REPORT.md
COMPREHENSIVE_ENHANCEMENT_PLAN.md
COMPREHENSIVE_ISSUES_ANALYSIS.md
CONSOLIDATION_ACTION_PLAN.md
CONSOLIDATION_IMPLEMENTATION_PLAN.md
CURRENT_IMPLEMENTATION_AUDIT.md
DEPLOYMENT_READY_SUMMARY.md
DETAILED_AUDIT_FINDINGS.md
DOCS_AUDIT_COMPREHENSIVE.md
DOCS_AUDIT_SUMMARY.md
ENHANCED_UI_UX_SUMMARY.md
ENHANCEMENTS_DOCUMENTATION.md
FINAL_AUDIT_REPORT.md
FINAL_AUDIT_SUMMARY.md
FINAL_CODE_REUSE_CONSISTENCY_AUDIT.md
FINAL_IMPLEMENTATION_COMPLETION_REPORT.md
FINAL_VERIFICATION_COMPLETE.md
FINAL_VERIFICATION_REPORT.md
FUTURE_ROADMAP_2026.md
IMPLEMENTATION_COMPLETE.md
IMPLEMENTATION_COMPLETE_SUMMARY.md
IMPLEMENTATION_COMPLETION_REPORT.md
IMPLEMENTATION_SUMMARY.md
MIGRATION_SUMMARY.md
PACKAGE_INVENTORY_REPORT.md
PROJECT_COMPLETION_REPORT.md
REACT_TOKEN_OPTIMIZATION_STATUS.md
REMAINING_ISSUES_ANALYSIS.md
RIGOROUS_CODE_REVIEW_STRATEGIC_ANALYSIS.md
THIRD_ROUND_IMPLEMENTATION_SUMMARY.md
TOKEN_OPTIMIZATION_ENHANCEMENT_REPORT.md
TOKEN_OPTIMIZATION_RESEARCH_REPORT.md
TOKEN_OPTIMIZATION_ROUND3.md
UI_UX_ENHANCEMENT_PLAN.md
UPDATED_CODE_REUSE_AUDIT.md
VERIFICATION_REPORT_FINAL.md
import-fixes-report.md
```

#### Shell Scripts (DELETE ALL)

```
fix_aggressive_consoles.sh
fix_console_statements_comprehensive.sh
fix_final_cleanup.sh
fix_final_consoles.sh
fix_manual_consoles.sh
fix_remaining_consoles.sh
fix_ultra_final.sh
replace_console_statements.sh
update-api-logging.sh
```

#### Test Files at Root (DELETE)

```
test-functionality.mjs
test-functionality.d.mts
test-functionality.d.mts.map
test-integration.js
test-integration-core.js
test-integration-simple.js
test-react-integration.js
test-react-integration.mjs
```

#### Generated Type Files at Root (DELETE)

```
generate-ai-context.d.ts
generate-ai-context.d.ts.map
```

#### Python Scripts (DELETE)

```
fix_imports.py
```

### Root Files to KEEP

| File                       | Reason                   |
| -------------------------- | ------------------------ |
| `README.md`                | Package documentation    |
| `CHANGELOG.md`             | Version history          |
| `LICENSE`                  | Legal                    |
| `CONTRIBUTING.md`          | Contributor guide        |
| `CODE_OF_CONDUCT.md`       | Community standards      |
| `SECURITY.md`              | Security policy          |
| `TESTING.md`               | Test documentation       |
| `package.json`             | Root package config      |
| `pnpm-workspace.yaml`      | Workspace config         |
| `pnpm-lock.yaml`           | Lock file                |
| `turbo.json`               | Turborepo config         |
| `tsconfig.json`            | TypeScript config        |
| `tsconfig.base.json`       | Base TS config           |
| `eslint.config.js`         | ESLint config            |
| `.prettierrc`              | Prettier config          |
| `.prettierignore`          | Prettier ignore          |
| `tailwind.config.js`       | Tailwind config          |
| `playwright.config.ts`     | E2E test config          |
| `typedoc.json`             | API docs config          |
| `lint-staged.config.js`    | Pre-commit config        |
| `plopfile.js`              | Code generators          |
| `vercel.json`              | Deployment config        |
| `.size-limit.json`         | Bundle size config       |
| `deploy-docs.sh`           | Docs deployment (review) |
| `setup-github-packages.sh` | Package setup (review)   |

### Directories to REVIEW

| Directory                                  | Issue            | Action                             |
| ------------------------------------------ | ---------------- | ---------------------------------- |
| `/examples/` at root AND `/apps/examples/` | Duplication      | Consolidate                        |
| `/docs/` at root                           | Many audit files | Clean, keep only MASTER_CONTEXT.md |
| `/.archive/`                               | Old files        | DELETE entire directory            |
| `/.context/`                               | Context files    | Review necessity                   |
| `/infrastructure/`                         | Deployment       | Review necessity                   |

---

## 6. Duplication & Smells

### Package Duplication

| Issue                                      | Location                                    | Resolution                  |
| ------------------------------------------ | ------------------------------------------- | --------------------------- |
| `errors` package re-exports `utils/errors` | `/packages/errors/`                         | DELETE package              |
| `shared-utils` re-exports `utils`          | `/packages/shared-utils/`                   | DELETE package              |
| Examples in two locations                  | `/examples/` and `/apps/examples/`          | Consolidate to `/examples/` |
| Multiple docs directories                  | `/docs/`, `/apps/docs/`, `/apps/docs-site/` | Clarify purpose             |

### Code Smells

| Issue                            | Location                               | Resolution               |
| -------------------------------- | -------------------------------------- | ------------------------ |
| TODOs in production code         | `packages/react/src/index.ts` L209-223 | Remove or implement      |
| Legacy hook exported             | `useChatLegacy`                        | Remove deprecated export |
| Excessive exports                | `@clarity-chat/react` ~500 exports     | Reduce public surface    |
| `publishConfig.access: "public"` | All packages                           | Change to private        |

### Config Issues

| Issue                            | Location               | Resolution                   |
| -------------------------------- | ---------------------- | ---------------------------- |
| Public access set                | All package.json files | Set to restricted/private    |
| No registry override for private | package.json           | Add GitHub Packages registry |

---

## 7. Research Notes

### Commercial Library Standards

#### Observed Standard: Monorepo Structure

- **Why it matters**: Clear package boundaries, independent versioning, selective publishing
- **Implementation**: pnpm workspaces + Turborepo (already in place)
- **Risk**: Over-fragmentation leads to dependency hell

#### Observed Standard: Minimal Public API

- **Why it matters**: Smaller API = less breaking changes, easier maintenance
- **Implementation**: Export only what customers need, internal packages stay internal
- **Risk**: Current `@clarity-chat/react` exports ~500 symbols - too many

#### Observed Standard: Private Distribution

- **Why it matters**: Primary paywall for commercial libraries
- **Implementation**: npm private packages OR GitHub Packages with org permissions
- **Risk**: Token leakage, CI auth complexity

#### Observed Standard: Local License Validation

- **Why it matters**: No network dependency, fast startup, works offline
- **Implementation**: Already implemented in `@clarity-chat/license`
- **Risk**: Key sharing (mitigated by distribution control)

#### Observed Standard: Build Outputs

- **Why it matters**: Compatibility across bundlers and environments
- **Implementation**: ESM primary, CJS fallback, bundled types, tree-shakeable
- **Risk**: Dual package hazard if not careful

### Publishing Research Notes

#### npm Private Packages

- Requires npm organization with paid plan
- Scoped packages (@org/package)
- Auth via `.npmrc` with `//registry.npmjs.org/:_authToken`
- CI needs NPM_TOKEN secret

#### GitHub Packages

- Free for public repos, free private with limits
- Auth via `GITHUB_TOKEN` or PAT
- Registry: `https://npm.pkg.github.com`
- Requires `publishConfig.registry` in package.json
- Better integration with GitHub Actions

#### Provenance

- npm publish --provenance (npm 9.5+)
- Requires GitHub Actions OIDC
- Creates verifiable build attestations

---

## 8. Rearchitecture Plan v1 (Architect)

### Phase 1: Cleanup (No Breaking Changes)

1. Delete 75 audit/temp files at root
2. Delete deprecated packages (`errors`, `shared-utils`)
3. Delete `.archive/` directory
4. Clean `/docs/` - keep only MASTER_CONTEXT.md
5. Remove examples duplication (keep `/examples/`, review `/apps/examples/`)

**Acceptance Criteria**:

- `pnpm install` succeeds
- `pnpm build` succeeds
- `pnpm test` passes
- No orphaned imports

### Phase 2: Package Restructure

1. Update all `publishConfig.access` to `"restricted"`
2. Add GitHub Packages registry to publishConfig
3. Remove TODO comments and dead code from exports
4. Remove deprecated `useChatLegacy` export
5. Consolidate internal packages (don't publish separately)

**Acceptance Criteria**:

- Only `@clarity-chat/react` and `@clarity-chat/license` are publishable
- Internal packages are workspace dependencies only
- Build outputs correct (ESM, CJS, types)

### Phase 3: API Surface Reduction

1. Audit all exports from `@clarity-chat/react`
2. Move internal utilities to non-exported modules
3. Create clear "public" vs "internal" boundaries
4. Update barrel exports to be minimal

**Acceptance Criteria**:

- Public API < 100 exports
- All exports documented
- Types match exports exactly

### Phase 4: Publishing Pipeline

1. Configure GitHub Actions for private publishing
2. Add provenance support
3. Create release workflow
4. Test publish to GitHub Packages (dry run)

**Acceptance Criteria**:

- CI can publish on tag
- Provenance attestations created
- Version bumps automated via changesets

### Phase 5: License Integration

1. Review existing license implementation
2. Ensure watermark appears for unlicensed
3. Test dev vs production behavior
4. Document activation flow

**Acceptance Criteria**:

- Install → Activate < 2 minutes
- Dev mode: warning only
- Prod mode: watermark for unlicensed
- License validation is synchronous and local

---

## 9. Rearchitecture Plan v2 (PM Reviewed)

### Risk Analysis

| Risk                         | Mitigation                             |
| ---------------------------- | -------------------------------------- |
| Breaking existing imports    | Changelog + deprecation warnings first |
| CI auth for private packages | Document token setup, test in dry run  |
| Customer confusion           | Clear migration guide                  |
| Lost test coverage           | Run full test suite after each phase   |

### Sequencing (Safe Order)

1. **Phase 1**: Cleanup - Zero risk, just deleting unused files
2. **Phase 2**: Package config - Low risk, no code changes
3. **Phase 3**: API reduction - Medium risk, may need deprecation period
4. **Phase 4**: Publishing - Medium risk, test thoroughly
5. **Phase 5**: License - Low risk, already implemented

### Rollback Plan

Each phase is committed separately. If issues:

1. Revert to previous commit
2. Identify failure cause
3. Fix and re-attempt

### Definition of Done (Per Phase)

#### Phase 1 Done When:

- [ ] All 75+ files deleted
- [ ] `pnpm install && pnpm build && pnpm test` passes
- [ ] No import errors
- [ ] Git clean (no untracked audit files)

#### Phase 2 Done When:

- [ ] All publishConfig updated
- [ ] Internal packages not in npm publish list
- [ ] Build outputs verified (ESM/CJS/types)

#### Phase 3 Done When:

- [ ] Export count < 100
- [ ] No internal utilities exposed
- [ ] Types accurate

#### Phase 4 Done When:

- [ ] GitHub Action publishes successfully
- [ ] Provenance verified
- [ ] Changeset workflow tested

#### Phase 5 Done When:

- [ ] Fresh install works
- [ ] License activation < 2 min
- [ ] Watermark appears when unlicensed
- [ ] Dev mode warns but works

---

## 10. Licensing Plan

### Current State (Implemented)

- Local-only verification (no network)
- Plan tiers: community, pro, enterprise
- Grace period support (14 days)
- Domain restrictions
- Dev vs production behavior
- Watermark component
- React hooks and HOCs

### Gaps Identified

1. `publishConfig.access: "public"` - defeats distribution control
2. No CI workflow for private publishing
3. License package itself is set to public
4. Need activation documentation

### Licensing Plan v2

#### Distribution Control (Primary)

1. Change all `publishConfig.access` to `"restricted"`
2. Publish to GitHub Packages (org-controlled)
3. Customer gets npm token with read access
4. Token tied to their GitHub account

#### Runtime License (Secondary)

1. Keep existing `@clarity-chat/license` implementation
2. Add `initializeClarity()` convenience function
3. Improve error messages
4. Add telemetry opt-in (not phone-home)

#### Customer Activation Flow

```bash
# 1. Configure npm (one-time)
npm config set @clarity-chat:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_TOKEN

# 2. Install
npm install @clarity-chat/react

# 3. Set license key
# .env.local
CLARITY_LICENSE=CC-1-eyJ...

# 4. Use
import { ClarityChat } from '@clarity-chat/react'
<ClarityChat api="/api/chat" />
```

---

## 11. QA Checklist

### Install Tests

- [ ] Fresh Next.js 14 app install
- [ ] Fresh Next.js 15 app install
- [ ] Fresh Vite app install
- [ ] TypeScript strict mode
- [ ] ESM import works
- [ ] CJS require works (if supported)

### License Tests

- [ ] No license: watermark shown
- [ ] Invalid license: watermark shown
- [ ] Valid license: no watermark
- [ ] Expired license: grace period behavior
- [ ] Dev mode: warning only
- [ ] Prod mode: watermark if unlicensed

### Functionality Tests

- [ ] Basic chat renders
- [ ] Streaming works
- [ ] Memory integration works
- [ ] Theme customization works
- [ ] Accessibility passes axe

### Build Tests

- [ ] Tree-shaking works
- [ ] Bundle size within limits
- [ ] Types resolve correctly
- [ ] No duplicate React

---

## 12. Quality Scoring Rubric

| Category                  | Weight | Criteria                                   |
| ------------------------- | ------ | ------------------------------------------ |
| Architecture & Boundaries | 15     | Clear package separation, minimal coupling |
| Public API Hygiene        | 15     | Minimal exports, stable interfaces         |
| Consistency & Naming      | 10     | Uniform patterns, predictable names        |
| Build Correctness         | 10     | ESM/CJS/types all work                     |
| Types Quality             | 10     | No `any`, accurate types                   |
| Docs Alignment            | 10     | Docs match code                            |
| Test Coverage             | 10     | >80% coverage, meaningful tests            |
| Performance               | 10     | Bundle size, runtime perf                  |
| Security                  | 5      | No vulns, safe defaults                    |
| Maintainability           | 5      | Clear code, no tech debt                   |

### Current Score: TBD (Post-Implementation)

### Score History

| Date       | Score | Notes                  |
| ---------- | ----- | ---------------------- |
| 2025-12-18 | -     | Initial audit complete |

---

## 13. Final Release Procedure

1. Pull latest main
2. Ensure all phases complete
3. Run full test suite
4. Version bump via changeset
5. Create release commit
6. Tag release
7. Push to main
8. CI publishes to GitHub Packages
9. Verify install from fresh project
10. Update documentation site

---

_This document is the single source of truth. No other audit or planning documents may remain in the
repository._
