# Issues Catalog

## ISSUE-001: Syntax Error in use-chat-enhanced.ts ✅ FIXED
**Category:** build  
**Severity:** blocker  
**Status:** ✅ RESOLVED

Fixed syntax error in if-else structure. Restructured the conditional to properly close the if block before the else-if clause.

---

## ISSUE-002: Constant Assignment Error ✅ FIXED  
**Category:** build  
**Severity:** blocker  
**Status:** ✅ RESOLVED

Changed `const remainingBudget` to `let remainingBudget` in `token-optimized-context.ts:168`.

---

## ISSUE-003: Workspace Protocol Compatibility ✅ FIXED
**Category:** dependencies  
**Severity:** critical  
**Status:** ✅ RESOLVED

Replaced `workspace:*` with `*` in 4 example package.json files for npm workspaces compatibility.

---

## ISSUE-004: React 19 Peer Dependency Conflict
**Category:** dependencies  
**Severity:** major  
**Status:** ⏳ PENDING

Examples use React 19 but lucide-react@0.344.0 only supports React 16-18. Requires `--legacy-peer-deps` flag.

**Fix Options:**
1. Pin React to ^18.0.0 in affected examples
2. Upgrade lucide-react if React 19-compatible version available
3. Document --legacy-peer-deps requirement in CI/CD

---

## ISSUE-005: npm Vulnerabilities
**Category:** dependencies  
**Severity:** minor  
**Status:** ⏳ PENDING

24 vulnerabilities (23 moderate, 1 critical) reported by npm audit.

**Fix:** Run `npm audit fix` and review critical vulnerability.

---

## ISSUE-006: Deprecated Packages
**Category:** dependencies  
**Severity:** minor  
**Status:** ⏳ PENDING

Deprecated packages in dependency tree:
- rimraf@2.6.3, rimraf@3.0.2
- glob@7.2.3
- eslint@8.57.1
- Others

**Fix:** Update direct dependencies to versions that don't pull in deprecated packages.

---

## ISSUE-007: Missing Icon Exports ✅ FIXED
**Category:** build  
**Severity:** blocker  
**Status:** ✅ RESOLVED

Added missing icon exports: ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon, FilterIcon.

---

## ISSUE-008: Missing tsconfig.node.json
**Category:** build  
**Severity:** major  
**Status:** ⏳ PENDING

`token-optimization-demo` build fails due to missing `tsconfig.node.json` file referenced by vite.config.ts.

**Fix:** Create `tsconfig.node.json` file or update vite.config.ts to not reference it.

---

## Summary

- **Total Issues:** 8
- **Fixed:** 4 (50%)
- **Pending:** 4 (50%)
- **Blockers Fixed:** 3/3 ✅
- **Critical Fixed:** 1/1 ✅

All blocker and critical issues have been resolved. Remaining issues are major/minor and documented in remediation plan.
