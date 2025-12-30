# Regression Guards

## Overview

This document outlines the regression guards implemented to prevent future issues.

## TypeScript Configuration Guards

### 1. Vitest Type Declarations (`types/vitest.d.ts`)

Ensures jest-dom matchers are properly typed for all tests.

```typescript
// apps/docs/types/vitest.d.ts
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<
    typeof expect.stringContaining,
    T
  > {}
}
```

### 2. Component Prop Backward Compatibility

**CodePlayground** (`components/Playground/CodePlayground.tsx`):

- Added `code` as alias for `initialCode`
- Added deprecated `height` prop for backward compatibility

**Pagination** (`components/Navigation/Pagination.tsx`):

- Added `previous` as alias for `prev`

## Recommended CI/CD Checks

### Pre-commit Hooks

```yaml
# Add to .husky/pre-commit or package.json scripts
- pnpm lint
- pnpm typecheck
```

### GitHub Actions Workflow

```yaml
# Recommended additions to CI workflow
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck
        working-directory: apps/docs

  test:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test
        working-directory: apps/docs
```

## Error Threshold Monitoring

### Current Baseline

- TypeScript errors: 142 (reduced from 435)
- ESLint errors: Varies
- Test failures: 0 expected

### Recommended Thresholds

- Block PR if TypeScript errors increase by more than 10%
- Block PR if any P0 issues are introduced
- Warning if P1 issues increase

## Files to Watch

### Critical Files (Changes require review)

- `apps/docs/lib/ai/streaming.ts` - SSE streaming logic
- `apps/docs/lib/animations.ts` - Animation system
- `apps/docs/lib/logger.ts` - Logging infrastructure
- `apps/docs/components/AI/systemPrompt.ts` - AI prompt configuration

### High-Impact Components

- `components/Playground/CodePlayground.tsx`
- `components/Navigation/Pagination.tsx`
- `components/Analytics/Analytics.tsx`

## Test Coverage Requirements

### Minimum Coverage Targets

- lib/ai/\* : 80% line coverage
- components/AI/\* : 70% line coverage
- lib/animations.ts : 60% line coverage

### Critical Path Tests

1. Chat API streaming works end-to-end
2. All routes return 200 status
3. Animation variants export correctly
4. Analytics tracking functions

## Known Technical Debt

### P2 Issues (Monitor but don't block)

1. Three.js type issues in particle components (4 errors)
2. SpeechRecognition Web API types (3 errors)
3. tsparticles config type mismatches (10+ errors)
4. Animation Variants type strictness (4 errors)

### Future Improvements

1. Add proper Web Speech API type declarations
2. Create custom Three.js JSX type declarations
3. Upgrade tsparticles to latest version with better types
4. Consider using `as const satisfies Variants` pattern for animations
