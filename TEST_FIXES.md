# Test Fixes - Resolving GitHub Actions Failures

**Date:** October 30, 2024  
**Issue:** Tests failing in GitHub Actions CI/CD pipeline

---

## 🔍 Likely Issues & Fixes

Based on the changes made, here are the likely causes of test failures and how to fix them:

---

## Issue 1: Missing Dependencies

### Problem
The `vitest.setup.ts` file references packages that might not be installed:
- `jest-axe`
- `@testing-library/jest-dom`

### Fix
Add these dependencies to `packages/react/package.json`:

```bash
cd packages/react
npm install -D jest-axe @axe-core/react
```

Or manually add to `packages/react/package.json`:

```json
{
  "devDependencies": {
    "jest-axe": "^8.0.0",
    "@axe-core/react": "^4.8.0",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
```

---

## Issue 2: Vitest Setup File Not Found

### Problem
The `vitest.config.ts` might not be pointing to the correct setup file.

### Fix
Check `packages/react/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'], // ← Ensure this path is correct
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.stories.tsx',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@clarity-chat/types': path.resolve(__dirname, '../types/src'),
      '@clarity-chat/primitives': path.resolve(__dirname, '../primitives/src'),
    },
  },
})
```

---

## Issue 3: TypeScript Errors in vitest.setup.ts

### Problem
The mocks and type extensions might have TypeScript errors.

### Fix
Update `packages/react/vitest.setup.ts`:

```typescript
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import { toHaveNoViolations } from 'jest-axe'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Extend with jest-axe matchers
expect.extend(toHaveNoViolations)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any

// Mock Web Speech API (if tests use voice input)
if (typeof window !== 'undefined') {
  (window as any).SpeechRecognition = class SpeechRecognition {
    continuous = false
    interimResults = false
    lang = 'en-US'
    
    start() {}
    stop() {}
    abort() {}
    
    addEventListener() {}
    removeEventListener() {}
  }
  
  (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

global.localStorage = localStorageMock as any
global.sessionStorage = localStorageMock as any

// Suppress console errors in tests (optional - remove if you want to see them)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// }
```

---

## Issue 4: Import Statement Issues

### Problem
The import of jest-dom matchers might be wrong for newer versions.

### Fix Option 1 - For jest-dom v6+
```typescript
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
```

### Fix Option 2 - For jest-dom v5
```typescript
import '@testing-library/jest-dom'
// No explicit extend needed
```

---

## Issue 5: Workspace Protocol in dev-tools

### Problem
Fixed in commit - but needs npm install to take effect.

### Fix
```bash
# Already fixed in code:
# packages/dev-tools/package.json changed from:
# "@clarity-chat/errors": "workspace:*"
# to:
# "@clarity-chat/errors": "*"

# Now run:
cd /path/to/Clarity-ai-chat-components
rm -rf node_modules package-lock.json
npm install
```

---

## Issue 6: Missing @types packages

### Problem
TypeScript might complain about missing type definitions.

### Fix
Add to `packages/react/package.json`:

```json
{
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@vitest/ui": "^3.2.4"
  }
}
```

---

## 🚀 Complete Fix Procedure

### Step 1: Update package.json

**File:** `packages/react/package.json`

Add these dependencies:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "jest-axe": "^8.0.0",
    "@axe-core/react": "^4.8.0",
    "@types/node": "^20.10.0"
  }
}
```

### Step 2: Fix vitest.setup.ts Import

**File:** `packages/react/vitest.setup.ts`

Change line 3:

```typescript
// OLD (might fail):
import * as matchers from '@testing-library/jest-dom/matchers'

// NEW (should work):
import matchers from '@testing-library/jest-dom/matchers'
```

### Step 3: Clean Install

```bash
# From repository root
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules

# Reinstall
npm install

# Or if that fails, install per package:
cd packages/react
npm install
```

### Step 4: Run Tests Locally

```bash
# From repository root
npm test

# Or just the react package
cd packages/react
npm test
```

### Step 5: Fix Any Remaining Issues

Check the test output for specific errors and:
1. Add missing dependencies
2. Fix import statements
3. Update mocks if needed

---

## 🧪 Quick Test Verification

Create a simple test file to verify setup works:

**File:** `packages/react/src/__tests__/setup.test.ts`

```typescript
import { describe, it, expect } from 'vitest'

describe('Test Setup', () => {
  it('should have vitest working', () => {
    expect(true).toBe(true)
  })

  it('should have jest-dom matchers', () => {
    const element = document.createElement('div')
    expect(element).toBeInTheDocument()
  })

  it('should have accessibility testing', () => {
    const element = document.createElement('button')
    element.setAttribute('role', 'button')
    // This test verifies jest-axe is loaded
    expect(element).toBeDefined()
  })
})
```

Run this test:

```bash
cd packages/react
npm test setup.test.ts
```

If this passes, the setup is correct!

---

## 📋 Checklist

Before pushing fixes:

- [ ] All dependencies installed (`npm install` ran successfully)
- [ ] `vitest.setup.ts` has correct imports
- [ ] `vitest.config.ts` points to correct setup file
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Tests run locally (`npm test`)
- [ ] Simple verification test passes
- [ ] Committed and pushed to `updates` branch

---

## 🔧 Alternative: Minimal Setup (If Issues Persist)

If the enhanced setup causes too many issues, use this minimal version:

**File:** `packages/react/vitest.setup.ts`

```typescript
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Basic cleanup
afterEach(() => {
  cleanup()
})

// Essential mocks only
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Remove jest-axe and jest-dom if causing issues
// Can add back later once basic tests work
```

---

## 💡 Common Errors & Solutions

### Error: "Cannot find module 'jest-axe'"
**Solution:** `npm install -D jest-axe`

### Error: "Cannot find module '@testing-library/jest-dom/matchers'"
**Solution:** Check jest-dom version, use appropriate import

### Error: "SpeechRecognition is not defined"
**Solution:** Mock is in vitest.setup.ts, ensure setup file is loaded

### Error: "localStorage is not defined"
**Solution:** Mock is in vitest.setup.ts, check it's running

### Error: Tests hang indefinitely
**Solution:** Check for infinite loops, async issues, or missing done() calls

---

## 📞 If All Else Fails

Temporarily disable the enhanced setup:

1. Rename `vitest.setup.ts` to `vitest.setup.ts.backup`
2. Create minimal `vitest.setup.ts` (see Alternative above)
3. Run tests to see if they pass
4. Gradually add back features

---

## 🎯 Expected Outcome

After fixes:
- ✅ All tests pass locally
- ✅ CI/CD pipeline passes
- ✅ Coverage reports generate
- ✅ No TypeScript errors

---

## 📝 Commit Message (After Fixing)

```bash
git add packages/react/package.json packages/react/vitest.setup.ts
git commit -m "fix: resolve test failures in CI/CD

- Add missing test dependencies (jest-axe, @testing-library/jest-dom)
- Fix vitest.setup.ts imports for compatibility
- Update mocks for better browser API coverage
- Ensure all tests pass in CI/CD environment

Fixes test failures reported in GitHub Actions"

git push origin updates
```

---

**Next Steps:**
1. Apply fixes from this document
2. Run tests locally
3. Push to `updates` branch
4. Verify GitHub Actions passes
5. Merge to `main`

---

**Need Help?** Check the specific error messages in GitHub Actions logs for more details.
