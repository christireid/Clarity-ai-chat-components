# Import Optimization Guide

This guide explains the import optimization process for the React package, which improves bundle size and tree-shaking effectiveness.

## Overview

The React package has been optimized to use modern import patterns that enable better tree-shaking and smaller bundle sizes:

1. **Named imports instead of namespace imports** - Allows bundlers to eliminate unused code
2. **Type-only imports** - Erased at runtime, reducing bundle size
3. **Consolidated imports** - Cleaner code and fewer module evaluations
4. **Modern JSX transform** - No need for React in scope

## Optimization Scripts

### 1. Analyze Import Patterns

```bash
pnpm exec tsx scripts/analyze-imports.ts
```

This script analyzes all TypeScript files and reports:
- React namespace imports that can be optimized
- Type-only import candidates
- Duplicate imports from the same module
- Estimated bundle size savings

**Output**: Detailed report with file locations and suggestions

### 2. Fix Duplicate Imports

```bash
pnpm exec tsx scripts/fix-duplicate-imports.ts
```

Automatically consolidates duplicate imports from the same module:

**Before**:
```typescript
import { openAIModels } from './openai'
import { anthropicModels } from './anthropic'
// ... 100 lines later ...
import { openAIAdapter } from './openai'
import { anthropicAdapter } from './anthropic'
```

**After**:
```typescript
import { openAIAdapter, openAIModels } from './openai'
import { anthropicAdapter, anthropicModels } from './anthropic'
```

### 3. Fix React Namespace Imports

```bash
pnpm exec tsx scripts/fix-react-imports.ts
```

Converts React namespace imports to optimized named/type imports:

**Before**:
```typescript
import * as React from 'react'

export function MyComponent() {
  const [state, setState] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  return <div ref={ref}>Count: {state}</div>
}
```

**After**:
```typescript
import { useRef, useState } from 'react'

export function MyComponent() {
  const [state, setState] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  return <div ref={ref}>Count: {state}</div>
}
```

**With Types**:
```typescript
// Before
import * as React from 'react'

export const MyComponent: React.FC<{ title: React.ReactNode }> = ({ title }) => {
  return <div>{title}</div>
}

// After
import type { FC, ReactNode } from 'react'

export const MyComponent: FC<{ title: ReactNode }> = ({ title }) => {
  return <div>{title}</div>
}
```

## TypeScript Configuration

The `tsconfig.json` has been updated with import optimization settings:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,    // Enforce explicit type-only imports
    "allowSyntheticDefaultImports": true,  // Better import compatibility
    "esModuleInterop": true,         // ES module interop
    "isolatedModules": true          // Each file as separate module
  }
}
```

### `verbatimModuleSyntax: true`

This setting enforces that:
- Type imports must use `import type`
- No implicit type-only imports
- Better tree-shaking for bundlers
- Clearer distinction between runtime and compile-time code

## Best Practices

### 1. Use Named Imports

✅ **Good**:
```typescript
import { useState, useEffect } from 'react'
import { Button, Card } from '@clarity-chat/primitives'
```

❌ **Bad**:
```typescript
import * as React from 'react'
import * as Primitives from '@clarity-chat/primitives'
```

### 2. Use Type-Only Imports

✅ **Good**:
```typescript
import type { FC, ReactNode, ComponentProps } from 'react'
import type { Message, ChatConfig } from '@/types'
```

❌ **Bad**:
```typescript
import { FC, ReactNode, ComponentProps } from 'react'  // Imported as values
import { Message, ChatConfig } from '@/types'  // Imported as values
```

### 3. Consolidate Related Imports

✅ **Good**:
```typescript
import { useState, useEffect, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
```

❌ **Bad**:
```typescript
import { useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import type { FC } from 'react'
import type { ReactNode } from 'react'
```

### 4. Modern JSX Transform

With the modern JSX transform (React 17+), you don't need React in scope for JSX:

✅ **Good**:
```typescript
// No React import needed!
export function MyComponent() {
  return <div>Hello</div>
}

// Only import what you use
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

❌ **Old Pattern**:
```typescript
import * as React from 'react'  // Not needed with modern JSX!

export function MyComponent() {
  return <div>Hello</div>
}
```

## Bundle Size Impact

Based on analysis of 865 TypeScript files:

| Optimization | Count | Estimated Savings |
|--------------|-------|-------------------|
| React namespace → named imports | 344 | ~172 KB |
| Type-only imports | 296 | Runtime size reduction |
| Duplicate consolidation | 59 | Faster module evaluation |

**Total estimated savings**: ~172 KB + improved tree-shaking effectiveness

## Verification Steps

After running optimization scripts:

### 1. Type Check

```bash
pnpm typecheck
```

Ensure no TypeScript errors were introduced.

### 2. Build Test

```bash
pnpm build
```

Verify the package builds successfully.

### 3. Bundle Analysis

```bash
pnpm analyze-bundle
```

Compare bundle sizes before and after optimization.

### 4. Test Suite

```bash
pnpm test
```

Ensure all tests still pass.

## When to Run Optimizations

- **After major refactoring** - Clean up imports accumulated during development
- **Before releases** - Ensure optimal bundle size
- **Monthly maintenance** - Keep imports clean as codebase evolves
- **After adding dependencies** - Optimize new import patterns

## Troubleshooting

### TypeScript Errors After Optimization

If you encounter TypeScript errors after running optimizations:

1. **Check verbatimModuleSyntax conflicts**:
   ```bash
   # Look for mixed value/type imports
   grep -r "import.*from 'react'" src/ | grep -v "import type"
   ```

2. **Verify type imports are marked as type-only**:
   ```typescript
   // Wrong
   import { FC } from 'react'

   // Correct
   import type { FC } from 'react'
   ```

3. **Check for circular dependencies**:
   ```bash
   # Use madge to detect circular deps
   npx madge --circular src/
   ```

### Build Errors

If the build fails:

1. **Check for missing exports**:
   ```bash
   pnpm build 2>&1 | grep "export"
   ```

2. **Verify import paths are correct**:
   ```bash
   # Check tsconfig paths configuration
   cat tsconfig.json | grep -A 5 "paths"
   ```

3. **Clear build cache**:
   ```bash
   rm -rf dist/
   pnpm build
   ```

### Tests Failing

If tests break:

1. **Update test imports**:
   ```typescript
   // Update test files to use same import style
   import { render, screen } from '@testing-library/react'
   import type { RenderResult } from '@testing-library/react'
   ```

2. **Check mock imports**:
   ```typescript
   // Ensure mocks match new import structure
   vi.mock('react', () => ({
     useState: vi.fn(),
     useEffect: vi.fn(),
   }))
   ```

## Advanced Optimizations

### Custom Import Rules

Create `.eslintrc.js` rules to enforce import patterns:

```javascript
module.exports = {
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    'no-duplicate-imports': 'error',
  },
}
```

### Import Organization

Use tools like `eslint-plugin-import` to automatically organize imports:

```bash
pnpm add -D eslint-plugin-import
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
}
```

## Monitoring

Track bundle size over time to ensure optimizations are maintained:

### Size Limit Configuration

```javascript
// .size-limit.js
module.exports = [
  {
    name: 'Core Components',
    path: 'dist/components/index.js',
    limit: '50 KB',
  },
  {
    name: 'Hooks',
    path: 'dist/hooks/index.js',
    limit: '30 KB',
  },
]
```

### CI/CD Integration

```yaml
# .github/workflows/size-check.yml
name: Bundle Size Check
on: [pull_request]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Resources

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [React JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

## Related Documentation

- [Bundle Optimization Guide](./BUNDLE-OPTIMIZATION.md)
- [TypeScript Configuration](./TYPESCRIPT-CONFIG.md)
- [Developer Guide](../CLAUDE.md)
