# CI/CD Test Failures - Fix Plan

**Date**: October 30, 2024  
**Investigation**: Complete  
**Status**: Ready to implement fixes

---

## 🔍 Root Causes Identified

### 1. **errors Package - Jest with No Tests** ❌
**Problem**:
- `packages/errors/package.json` has `"test": "jest"`
- Jest is configured in `jest.config.js`
- **NO test files exist** in the package
- This causes Jest to fail when CI runs tests

**Fix**: Change test script to skip gracefully

### 2. **Mixed Test Runners** ⚠️
**Problem**:
- Most packages use **Vitest**
- `errors` package uses **Jest**
- Inconsistent test infrastructure

**Fix**: Standardize on one test runner or handle gracefully

### 3. **Build-Dependent Tests** ⚠️
**Problem**:
- `turbo.json` config: `"test": { "dependsOn": ["^build"] }`
- Tests won't run until ALL packages build
- If any package fails to build, ALL tests fail

**Fix**: Ensure all packages build correctly first

### 4. **Accessibility Tests - Storybook Dependency** ⚠️
**Problem**:
- Accessibility tests need Storybook to build
- If Storybook build fails, a11y tests fail
- The workflow has `|| true` (continue-on-error) but still marks as failed

**Fix**: Ensure Storybook builds correctly or improve error handling

---

## 🛠️ Fixes to Implement

### Fix 1: errors Package Test Script

**File**: `packages/errors/package.json`

**Change**:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "echo \"No tests yet\" && exit 0"
  }
}
```

**Reason**: Package has no tests, so gracefully skip instead of running Jest

---

### Fix 2: Add .gitkeep for Future Tests

**File**: `packages/errors/src/__tests__/.gitkeep`

Create directory structure for future tests:
```bash
mkdir -p packages/errors/src/__tests__
touch packages/errors/src/__tests__/.gitkeep
```

---

### Fix 3: Improve CI Workflow - Skip Tests for Docs

**File**: `.github/workflows/test.yml`

**Add paths filter** to skip CI for documentation-only changes:

```yaml
on:
  push:
    branches: [main, updates, develop]
    paths-ignore:
      - 'docs/**'
      - '*.md'
      - 'PHASE*.md'
      - 'VISUAL*.md'
      - 'README.md'
  pull_request:
    branches: [main, updates, develop]
    paths-ignore:
      - 'docs/**'
      - '*.md'
```

**Reason**: Documentation changes don't affect code, so skip expensive CI runs

---

### Fix 4: Improve Accessibility Test Error Handling

**File**: `.github/workflows/test.yml` (lines 116-117)

**Current**:
```yaml
- name: Run accessibility tests
  run: npm run test:a11y --workspace=@clarity-chat/storybook || true
```

**Better**:
```yaml
- name: Run accessibility tests
  run: npm run test:a11y --workspace=@clarity-chat/storybook
  continue-on-error: true
```

**Reason**: Use GitHub Actions' native `continue-on-error` instead of shell `|| true`

---

### Fix 5: Ensure Storybook Workspace Exists

**Check**: Verify `@clarity-chat/storybook` package exists

```bash
ls -la apps/storybook/ || ls -la packages/storybook/
```

If it doesn't exist, the accessibility test will fail.

---

### Fix 6: Optional - Remove Build Dependency from Tests

**File**: `turbo.json`

**Consider changing** (if builds are fast enough):
```json
{
  "tasks": {
    "test": {
      "dependsOn": []  // Remove build dependency
    }
  }
}
```

**Reason**: Allow tests to run independently if build fails

**Trade-off**: Tests might fail if they need built artifacts

---

## 📋 Implementation Order

### Priority 1: Quick Fixes (Do First) ✅

1. **Fix errors package test script**
   ```bash
   cd packages/errors
   # Edit package.json, change test script
   ```

2. **Add paths-ignore to CI workflow**
   ```bash
   # Edit .github/workflows/test.yml
   # Add paths-ignore section
   ```

### Priority 2: Verification (Do Second) ✅

3. **Check Storybook exists**
   ```bash
   ls -la apps/ packages/ | grep storybook
   ```

4. **Verify all packages have build scripts**
   ```bash
   for pkg in packages/*/package.json; do
     echo "$pkg:" && grep '"build"' "$pkg" || echo "  ❌ No build script"
   done
   ```

### Priority 3: Optional Improvements ⏳

5. **Standardize test runner** (future work)
   - Migrate errors package from Jest to Vitest
   - Or add proper Jest tests

6. **Improve error messages** (future work)
   - Add better CI failure messages
   - Create troubleshooting guide

---

## 🧪 Testing the Fixes

### Local Testing:

```bash
# 1. Install dependencies
npm ci

# 2. Test errors package
npm run test --workspace=@clarity-chat/errors
# Should output: "No tests yet" and exit 0

# 3. Run all tests
npm run test
# Should complete without errors

# 4. Build all packages
npm run build
# Should complete successfully

# 5. Type check
npm run typecheck
# Should pass
```

### CI Testing:

After implementing fixes:
1. Commit changes
2. Push to GitHub
3. Check GitHub Actions
4. All jobs should pass ✅

---

## 📝 Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `packages/errors/package.json` | Change test script to exit 0 | ✅ Fixes test failures |
| `.github/workflows/test.yml` | Add paths-ignore for docs | ✅ Skips CI for docs |
| `.github/workflows/test.yml` | Use continue-on-error | ✅ Better error handling |
| `packages/errors/src/__tests__/.gitkeep` | Create test directory | ✅ Future-proof |

---

## ✅ Expected Results

After implementing these fixes:

1. ✅ **Test & Coverage (18.x, 20.x)** - Will PASS
   - errors package won't fail
   - All other tests run normally

2. ✅ **Accessibility Tests** - Will PASS or gracefully fail
   - Better error handling
   - Won't block other tests

3. ✅ **Build Packages** - Will PASS
   - All packages have build scripts
   - No missing dependencies

4. ✅ **Security Audit** - Already passing

5. ✅ **Documentation commits** - Won't trigger CI
   - Saves CI minutes
   - Faster workflow

---

## 🚀 Ready to Implement

All fixes are identified and ready. Would you like me to:

1. ✅ Implement all fixes automatically
2. ✅ Create a single commit with all changes
3. ✅ Push to GitHub
4. ✅ Monitor CI results

Or would you prefer to review each fix individually first?

---

**Status**: Investigation Complete ✅  
**Fixes Identified**: 6 changes  
**Estimated Time**: 5 minutes to implement  
**Expected Outcome**: All CI tests passing ✅
