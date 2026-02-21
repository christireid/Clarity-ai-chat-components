# CTO RISK REGISTER

**Perspective:** Paranoid CTO
**Mission:** What could kill this project technically?

---

## Critical Risks (Existential)

### RISK-001: The react package is a monolith disguised as a package
- **Severity:** CRITICAL
- **Evidence:** 19MB source, 1,732 files, 52 subdirectories
- **Impact:** Unbuildable without memory flags. Untestable at scale. Un-tree-shakeable. Any contributor will be overwhelmed.
- **Root cause:** No architectural boundary enforcement. Every feature was added to the same package.
- **Fix:** Extract non-UI subsystems (RBAC, multi-tenancy, vector-stores, webhooks, etc.) into separate packages or delete them entirely.

### RISK-002: Never been published or installed
- **Severity:** CRITICAL
- **Evidence:** npm downloads = 0. No publish has ever been attempted.
- **Impact:** Unknown whether the package actually works when installed. Export paths may be broken. Peer dependencies may be wrong. Tree-shaking may fail.
- **Root cause:** Development has focused on features, not distribution.
- **Fix:** Dry-run publish immediately. Test installation in a clean project.

### RISK-003: Unknown build/test/typecheck status
- **Severity:** HIGH
- **Evidence:** No CI results visible for current branch. Previous audit estimated 27% test coverage.
- **Impact:** Merging this code could break main. Publishing broken packages destroys credibility.
- **Fix:** Run full quality gates before any publish.

---

## High Risks (Major)

### RISK-004: Duplicate code explosion
- **Severity:** HIGH (partially remediated)
- **Evidence:** Previous audit found 150 duplicate APIs. Recent consolidation deleted 18,800 lines. Unknown how many remain.
- **Impact:** Maintenance nightmare. Inconsistent behavior. API confusion.
- **Status:** Partially fixed by recent work (45 files deleted). More remains.

### RISK-005: Circular dependency risk
- **Severity:** HIGH
- **Evidence:** token-optimization imports from primitives (UI helpers like `cn`)
- **Impact:** Circular deps cause build failures, bundle bloat, and runtime errors
- **Fix:** Extract shared utilities to `utils` package

### RISK-006: 3 documentation sites, 0 deployed
- **Severity:** HIGH
- **Evidence:** apps/docs, apps/streamlined-docs, apps/docs-site all exist
- **Impact:** No one can read documentation. Contributors don't know which is canonical.
- **Fix:** Pick one. Delete the others. Deploy it.

### RISK-007: Marketing site build artifacts in source control
- **Severity:** MEDIUM
- **Evidence:** 42 .d.ts files, 43 .js files alongside .tsx sources
- **Impact:** Git history bloat. Merge conflicts on generated files. Confusion.
- **Fix:** Add to .gitignore, delete from tracking.

---

## Medium Risks (Significant)

### RISK-008: No automated accessibility testing
- **Severity:** MEDIUM
- **Evidence:** WCAG AA claimed, but no axe-core, pa11y, or similar in test suite
- **Impact:** Accessibility claims are unverified. Could be misleading.
- **Fix:** Add axe-core to component tests.

### RISK-009: Overengineered script surface
- **Severity:** MEDIUM
- **Evidence:** 50+ scripts in root package.json including review, security, analysis scripts that may not work
- **Impact:** New contributors overwhelmed. Broken scripts erode trust.
- **Fix:** Remove all scripts that aren't actively used and verified.

### RISK-010: Security overrides accumulation
- **Severity:** MEDIUM
- **Evidence:** 18+ pnpm overrides patching CVEs in transitive dependencies
- **Impact:** Manual override management is error-prone. May miss future CVEs.
- **Fix:** Audit overrides, remove ones for deps no longer used. Set up automated security scanning.

### RISK-011: No end-to-end integration test
- **Severity:** MEDIUM
- **Evidence:** test-nextjs, test-vite, test-webpack exist but unknown if they work
- **Impact:** Publishing may produce packages that don't work in real frameworks
- **Fix:** Verify all three integration test apps work with the built packages.

---

## Low Risks (Manageable)

### RISK-012: Large files still exist
- **Severity:** LOW
- **Evidence:** Previous audit found 15 files >1,000 lines
- **Impact:** Hard to review, hard to maintain
- **Fix:** Split during normal development

### RISK-013: TypeScript `any` usage
- **Severity:** LOW
- **Evidence:** Previous audit found 104 files with `: any` in public APIs
- **Impact:** Defeats type safety, bad DX for consumers
- **Fix:** Gradual replacement

---

## Risk Mitigation Priority

| Priority | Risk | Action | Effort |
|---|---|---|---|
| P0 | RISK-002 | Dry-run publish, test installation | 4 hours |
| P0 | RISK-003 | Run full quality gates | 2 hours |
| P0 | RISK-001 | Audit & extract non-UI code from react package | 20 hours |
| P1 | RISK-006 | Pick one docs site, delete others, deploy | 4 hours |
| P1 | RISK-005 | Fix circular dependency | 4 hours |
| P1 | RISK-004 | Continue duplicate consolidation | 10 hours |
| P2 | RISK-007 | Clean marketing site artifacts | 1 hour |
| P2 | RISK-008 | Add axe-core tests | 8 hours |
| P2 | RISK-009 | Clean up scripts | 2 hours |
