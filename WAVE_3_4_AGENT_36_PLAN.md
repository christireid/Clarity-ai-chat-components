# Wave 3.4 Agent 36: Dependency CVE Patcher

**Agent Type**: `all-agents:security-auditor` **Priority**: P0 - Critical **Target**: Fix 3 known
CVEs **Estimated Time**: 1.5 hours **Risk Level**: Low (dependency updates)

---

## Mission Objective

Update dependencies with known security vulnerabilities to eliminate CVEs and improve security score
from 85/100 to 95/100.

### CVEs to Fix

1. **lodash-es@4.17.21** - CVE-2020-28500 (Prototype Pollution)
2. **lodash@4.17.21** - CVE-2020-28500 (Prototype Pollution)
3. **undici@5.28.4** - CVE-2024-24758 (HTTP Request Smuggling)

---

## Task 1: Audit Current Dependencies

### Step 1.1: Run Security Audit

**Command**:

```bash
# Check for known vulnerabilities
pnpm audit

# Get detailed report
pnpm audit --json > security-audit.json
```

**Expected Output**:

```
found 3 vulnerabilities (1 moderate, 2 high)

Moderate severity vulnerability:
- lodash: Prototype Pollution (CVE-2020-28500)
- lodash-es: Prototype Pollution (CVE-2020-28500)

High severity vulnerability:
- undici: HTTP Request Smuggling (CVE-2024-24758)
```

### Step 1.2: Identify Affected Packages

**Command**:

```bash
# Find which packages use vulnerable dependencies
pnpm why lodash
pnpm why lodash-es
pnpm why undici
```

**Document**:

- Direct vs transitive dependencies
- Number of packages depending on each
- Update constraints from package.json

---

## Task 2: Update lodash & lodash-es

### Problem Analysis

- **CVE-2020-28500**: Prototype pollution vulnerability
- **Affected Versions**: lodash@<4.17.21, lodash-es@<4.17.21
- **Fixed In**: lodash@4.17.21+ (but newer versions available with additional fixes)
- **Current**: 4.17.21 (technically patched, but outdated)
- **Target**: Latest stable (5.0.0+ if available, else 4.17.21+)

### Step 2.1: Check Latest Versions

**Command**:

```bash
# Check latest lodash versions
npm view lodash versions --json | tail -5
npm view lodash-es versions --json | tail -5
```

### Step 2.2: Update Package.json

**File**: `package.json` (root)

**Before**:

```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "lodash-es": "^4.17.21"
  }
}
```

**After**:

```json
{
  "dependencies": {
    "lodash": "^4.17.21", // Keep if no breaking changes
    "lodash-es": "^4.17.21" // Or update to latest if available
  },
  "resolutions": {
    "lodash": ">=4.17.21", // Force minimum version
    "lodash-es": ">=4.17.21"
  }
}
```

**Note**: If lodash 5.x is available and non-breaking, update to latest.

### Step 2.3: Update Lock File

**Command**:

```bash
# Remove old lock entries
rm -rf node_modules pnpm-lock.yaml

# Fresh install with updated versions
pnpm install

# Verify updates
pnpm list lodash
pnpm list lodash-es
```

### Step 2.4: Verify No Breaking Changes

**Test Command**:

```bash
# Run full test suite
pnpm test

# Run type checking
pnpm typecheck

# Build all packages
pnpm build
```

**Expected**: All tests pass, no TypeScript errors, builds succeed.

---

## Task 3: Update undici

### Problem Analysis

- **CVE-2024-24758**: HTTP Request Smuggling vulnerability
- **Affected Versions**: undici@<6.18.0
- **Fixed In**: undici@6.18.0+
- **Current**: 5.28.4 (vulnerable)
- **Target**: 6.18.0+ (patched)

### Step 3.1: Check undici Usage

**Command**:

```bash
# Check if direct or transitive dependency
pnpm why undici

# Check which packages require it
grep -r "undici" package.json packages/*/package.json apps/*/package.json
```

**Likely**: Transitive dependency from node-fetch or other HTTP libraries.

### Step 3.2: Force Update via Resolutions

**File**: `package.json` (root)

**Add**:

```json
{
  "pnpm": {
    "overrides": {
      "undici": ">=6.18.0"
    }
  },
  "resolutions": {
    "undici": ">=6.18.0"
  }
}
```

**Why This Works**:

- Forces all transitive dependencies to use undici@6.18.0+
- No code changes needed if undici is transitive
- pnpm respects both overrides and resolutions

### Step 3.3: Update and Verify

**Command**:

```bash
# Remove lock file to force resolution
rm pnpm-lock.yaml

# Reinstall with overrides
pnpm install

# Verify undici version
pnpm list undici

# Should show: undici@6.18.0 or higher
```

### Step 3.4: Test HTTP Functionality

**Test Script**: `scripts/test-http.ts` (NEW)

```typescript
// Test undici upgrade doesn't break HTTP
import { fetch } from 'undici'

async function testUndici() {
  try {
    // Test basic fetch
    const response = await fetch('https://httpbin.org/get')
    const data = await response.json()
    console.log('✅ Undici fetch works:', data.url)

    // Test headers
    const response2 = await fetch('https://httpbin.org/headers', {
      headers: { 'X-Test': 'value' },
    })
    const headers = await response2.json()
    console.log('✅ Undici headers work')

    return true
  } catch (error) {
    console.error('❌ Undici test failed:', error)
    return false
  }
}

testUndici().then((success) => {
  process.exit(success ? 0 : 1)
})
```

**Run**:

```bash
npx tsx scripts/test-http.ts
```

**Expected**: All tests pass, HTTP functionality works.

---

## Task 4: Run Security Audit After Updates

### Step 4.1: Verify CVEs Fixed

**Command**:

```bash
# Run audit again
pnpm audit

# Check specific CVEs
pnpm audit --json | grep -E "CVE-2020-28500|CVE-2024-24758"
```

**Expected Output**:

```
found 0 vulnerabilities
```

**If Still Showing Vulnerabilities**:

- Check if overrides applied correctly
- Verify pnpm-lock.yaml has new versions
- May need to update parent packages

### Step 4.2: Generate Security Report

**File**: `WAVE_3_4_AGENT_36_SECURITY_AUDIT.md` (NEW)

```markdown
# Security Audit Report - Agent 36

**Date**: 2026-01-26 **Status**: ✅ ALL CVEs PATCHED

## CVEs Fixed

### 1. CVE-2020-28500 (lodash/lodash-es)

- **Severity**: Moderate
- **Type**: Prototype Pollution
- **Before**: lodash@4.17.21 (vulnerable)
- **After**: lodash@4.17.21+ (with resolutions)
- **Status**: ✅ FIXED

### 2. CVE-2024-24758 (undici)

- **Severity**: High
- **Type**: HTTP Request Smuggling
- **Before**: undici@5.28.4 (vulnerable)
- **After**: undici@6.18.0+ (patched)
- **Status**: ✅ FIXED

## Dependency Changes

| Package   | Before  | After    | Change         |
| --------- | ------- | -------- | -------------- |
| lodash    | 4.17.21 | 4.17.21+ | Forced minimum |
| lodash-es | 4.17.21 | 4.17.21+ | Forced minimum |
| undici    | 5.28.4  | 6.18.0+  | Major update   |

## Security Score

- **Before**: 85/100
- **After**: 95/100
- **Improvement**: +10 points

## Verification

- ✅ pnpm audit: 0 vulnerabilities
- ✅ All tests passing
- ✅ Builds successful
- ✅ HTTP functionality verified
```

---

## Task 5: Update CI/CD Security Checks

### Step 5.1: Add Security Audit to CI

**File**: `.github/workflows/security.yml` (NEW or UPDATE)

```yaml
name: Security Audit

on:
  push:
    branches: [main, clean-up]
  pull_request:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Mondays

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run security audit
        run: pnpm audit --prod

      - name: Check for high/critical vulnerabilities
        run: |
          AUDIT_REPORT=$(pnpm audit --json)
          CRITICAL=$(echo $AUDIT_REPORT | jq '.metadata.vulnerabilities.critical')
          HIGH=$(echo $AUDIT_REPORT | jq '.metadata.vulnerabilities.high')

          if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
            echo "❌ Found $CRITICAL critical and $HIGH high severity vulnerabilities"
            exit 1
          fi

          echo "✅ No critical or high severity vulnerabilities"
```

**Why This Matters**:

- Automated weekly checks for new CVEs
- Blocks PRs with critical vulnerabilities
- Catches transitive dependency issues early

### Step 5.2: Add npm-audit-resolver Config

**File**: `.audit-resolve.json` (NEW)

```json
{
  "decisions": {
    "1234|example-package": {
      "decision": "postpone",
      "madeAt": 1706227200000,
      "expiresAt": 1708905600000,
      "reason": "Waiting for upstream fix"
    }
  }
}
```

**Note**: Only add decisions for accepted risks. Start with empty file.

---

## Task 6: Document Breaking Changes

### Step 6.1: Check for API Changes

**For lodash**:

- Check if any code uses lodash methods that changed
- Run ESLint to find lodash usage
- Verify no breaking changes in migration guide

**For undici**:

- Mostly transitive, unlikely to have breaking changes
- If direct usage exists, check API compatibility

**Command**:

```bash
# Find lodash usage
grep -r "import.*from 'lodash'" apps/ packages/

# Find undici usage
grep -r "import.*from 'undici'" apps/ packages/
```

### Step 6.2: Create Migration Guide (If Needed)

**File**: `docs/migrations/lodash-5-upgrade.md` (IF breaking changes)

```markdown
# Lodash 5.x Upgrade Guide

## Breaking Changes

### 1. Method X Removed

- **Before**: `_.methodX()`
- **After**: Use `_.methodY()` instead

### 2. Behavior Change in Method Y

- **Old Behavior**: ...
- **New Behavior**: ...
```

**Note**: Only create if breaking changes exist. Lodash 4.x → 4.x likely has none.

---

## Task 7: Verification & Testing

### Test Checklist

- [ ] `pnpm audit` shows 0 vulnerabilities
- [ ] All unit tests pass (`pnpm test`)
- [ ] All E2E tests pass (`pnpm test:e2e`)
- [ ] TypeScript compilation succeeds (`pnpm typecheck`)
- [ ] Builds complete without errors (`pnpm build`)
- [ ] No console errors in dev mode
- [ ] HTTP requests work (API routes functional)
- [ ] No lodash-related runtime errors
- [ ] Security workflow passes in CI

### Manual Testing

1. **Test API Routes**:

   ```bash
   # Start dev server
   pnpm dev

   # Test key endpoints
   curl http://localhost:3000/api/docs-assistant
   curl http://localhost:3000/api/live-demo-chat
   ```

2. **Test Components Using Lodash**:
   - Search components
   - Dashboard analytics
   - Any data transformation utilities

3. **Verify No Performance Regression**:
   - Measure bundle size before/after
   - Check for increased load times
   - Lighthouse audit

---

## Success Criteria

| Metric                  | Before | Target | Success Threshold |
| ----------------------- | ------ | ------ | ----------------- |
| Known CVEs              | 3      | 0      | 0 ✅              |
| Security Score          | 85/100 | 95/100 | ≥90 ✅            |
| High Severity Vulns     | 1      | 0      | 0 ✅              |
| Moderate Severity Vulns | 2      | 0      | 0 ✅              |
| Test Pass Rate          | 100%   | 100%   | 100% ✅           |

---

## Rollback Plan

### If lodash Update Breaks Code

```bash
# Revert package.json changes
git checkout HEAD~1 -- package.json

# Reinstall old versions
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### If undici Update Breaks HTTP

```bash
# Temporarily remove override
# Edit package.json, remove undici from overrides

# Reinstall
pnpm install

# Fix will need alternative approach (update parent packages)
```

### If Tests Fail

```bash
# Full rollback
git revert HEAD

# Or partial rollback
git checkout HEAD~1 -- <specific-file>
```

---

## Deliverables

### Files Created

1. `scripts/test-http.ts` - Undici verification script
2. `WAVE_3_4_AGENT_36_SECURITY_AUDIT.md` - Security report
3. `.github/workflows/security.yml` - Automated audits
4. `.audit-resolve.json` - Audit decision tracking

### Files Modified

1. `package.json` (root) - Add resolutions/overrides
2. `pnpm-lock.yaml` - Updated dependency versions

### Reports Generated

1. Security audit report (before/after)
2. Dependency change log
3. Agent 36 completion report

---

## Coordination

### Before Starting

- [ ] Verify no other agents touching dependencies
- [ ] Check for concurrent package.json changes
- [ ] Ensure CI is green

### During Execution

- [ ] Update progress in TodoWrite
- [ ] Commit after each major task
- [ ] Run tests incrementally

### After Completion

- [ ] Verify security score improvement
- [ ] Update Wave 3.4 status
- [ ] Prepare for Agent 37 (parallel execution OK)

---

**Agent 36 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES (no dependencies) **Parallel Safe**:
✅ YES (with Agents 37, 38, 39, 40) **Next Agent**: Agent 37 (Security Headers Auditor)
