# Import Optimization Scripts

Automated tools for optimizing import statements across the React package.

## Scripts Overview

| Script                     | Purpose                   | Safety      | Status          |
| -------------------------- | ------------------------- | ----------- | --------------- |
| `analyze-imports.ts`       | Analyze import patterns   | Read-only   | ✅ Production   |
| `fix-duplicate-imports.ts` | Consolidate duplicates    | High        | ✅ Production   |
| `fix-react-imports.ts`     | Optimize React imports    | Medium-High | ✅ Ready        |
| `optimize-imports.ts`      | Advanced AST optimization | Medium      | 🔬 Experimental |

## Quick Start

### 1. Analyze Current State

```bash
pnpm exec tsx scripts/analyze-imports.ts
```

**What it does**: Scans all TypeScript files and reports:

- React namespace imports that can be optimized
- Imports used only as types
- Duplicate imports from same modules
- Estimated bundle size savings

**Output**: Console report with file locations and suggestions **Runtime**: ~2 seconds for 865 files
**Safety**: ✅ Read-only, no modifications

### 2. Fix Duplicate Imports

```bash
pnpm exec tsx scripts/fix-duplicate-imports.ts
```

**What it does**: Consolidates duplicate imports from the same module

**Example**:

```typescript
// Before
import { a } from './module'
// ... code ...
import { b } from './module'

// After
import { a, b } from './module'
```

**Safety**: ✅ High - only consolidates, doesn't remove **Verification**: Run `pnpm typecheck` after

### 3. Optimize React Imports

```bash
pnpm exec tsx scripts/fix-react-imports.ts
```

**What it does**: Converts `import * as React` to optimized imports

**Example**:

```typescript
// Before
import * as React from 'react'

function Component() {
  const [count, setCount] = React.useState(0)
  return <div>{count}</div>
}

// After
import { useState } from 'react'

function Component() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}
```

**Safety**: ⚠️ Medium-High - smart detection, but verify after **Verification**: Run
`pnpm typecheck && pnpm test` after

## Detailed Script Documentation

### analyze-imports.ts

**Purpose**: Comprehensive import pattern analysis and reporting.

**Usage**:

```bash
pnpm exec tsx scripts/analyze-imports.ts
```

**Features**:

- Identifies all namespace imports (`import * as`)
- Detects React-specific patterns
- Finds type-only import candidates
- Reports duplicate imports
- Estimates bundle size impact
- Provides actionable suggestions

**Output Example**:

```
================================================================================
IMPORT ANALYSIS REPORT
================================================================================

SUMMARY
--------------------------------------------------------------------------------
Total files analyzed: 865
Total imports found: 2134
Namespace imports: 346
  └─ React namespace: 344
Type-only candidates: 296
Modules with duplicate imports: 25

================================================================================
REACT NAMESPACE IMPORTS (High Priority)
================================================================================
...
```

**No Side Effects**: This script only reads files, never modifies.

---

### fix-duplicate-imports.ts

**Purpose**: Automatically consolidate duplicate imports from same modules.

**Usage**:

```bash
pnpm exec tsx scripts/fix-duplicate-imports.ts
```

**Algorithm**:

1. Scans all TypeScript files
2. Groups imports by module path
3. Identifies modules imported multiple times
4. Consolidates into single import statement
5. Preserves import types (value vs type)
6. Sorts named imports alphabetically

**Handles**:

- Named imports: `import { a, b } from 'module'`
- Default imports: `import Default from 'module'`
- Type imports: `import type { Type } from 'module'`
- Mixed imports: `import Default, { named } from 'module'`

**Does NOT Handle**:

- Side-effect imports: `import 'module'`
- Namespace imports: `import * as Name from 'module'`

**Verification**:

```bash
# After running
pnpm typecheck  # Should pass
git diff --stat  # Review changes
```

---

### fix-react-imports.ts

**Purpose**: Convert React namespace imports to optimized named/type imports.

**Usage**:

```bash
pnpm exec tsx scripts/fix-react-imports.ts
```

**Smart Detection**:

- Analyzes actual React API usage in each file
- Separates hooks, types, and functions
- Detects when namespace must be preserved
- Handles modern JSX transform (no React needed)
- Removes unused React imports

**Conversion Rules**:

1. **Hooks** → Named imports

   ```typescript
   // Before
   React.useState(0)
   React.useEffect(() => {})

   // After
   import { useState, useEffect } from 'react'
   useState(0)
   useEffect(() => {})
   ```

2. **Types** → Type-only imports

   ```typescript
   // Before
   React.FC<Props>
   React.ReactNode

   // After
   import type { FC, ReactNode } from 'react'
   FC<Props>
   ReactNode
   ```

3. **Functions** → Named imports

   ```typescript
   // Before
   React.memo(Component)
   React.forwardRef(...)

   // After
   import { memo, forwardRef } from 'react'
   memo(Component)
   forwardRef(...)
   ```

4. **JSX Only** → No import needed

   ```typescript
   // Before
   import * as React from 'react'
   export function Component() {
     return <div>Hello</div>
   }

   // After
   export function Component() {
     return <div>Hello</div>
   }
   ```

**Preserves Namespace When**:

- Dynamic member access: `React[dynamicKey]`
- Class components: `React.Component`, `React.PureComponent`
- Complex patterns that can't be safely converted

**Verification**:

```bash
pnpm typecheck  # Check for type errors
pnpm test       # Run test suite
pnpm build      # Verify build works
git diff        # Review changes
```

---

### optimize-imports.ts

**Purpose**: Advanced TypeScript AST-based import optimization.

**Status**: 🔬 Experimental - Not for production use yet

**Features**:

- Full TypeScript AST parsing
- Unused import removal
- Type-only import detection
- Advanced import transformations

**Why Not Used**:

- More complex than needed for current task
- Requires extensive testing
- Simpler scripts handle 90% of cases

**Future Use**:

- Detecting truly unused imports
- Complex refactoring scenarios
- Automated code cleanup

## Best Practices

### Before Running Scripts

1. **Commit your work**

   ```bash
   git status  # Should be clean or have committed changes
   git add .
   git commit -m "Your work"
   ```

2. **Create a branch**

   ```bash
   git checkout -b optimize-imports
   ```

3. **Run analysis first**
   ```bash
   pnpm exec tsx scripts/analyze-imports.ts
   ```

### After Running Scripts

1. **Verify TypeScript**

   ```bash
   pnpm typecheck
   ```

2. **Run tests**

   ```bash
   pnpm test
   ```

3. **Build package**

   ```bash
   pnpm build
   ```

4. **Review changes**

   ```bash
   git diff --stat
   git diff  # Review actual changes
   ```

5. **Commit if successful**
   ```bash
   git add .
   git commit -m "feat: optimize imports for better tree-shaking"
   ```

### Incremental Approach

For large changes (like React imports):

```bash
# 1. Edit script to limit files (modify getAllTsFiles)
# Example: return fileList.slice(0, 50)

# 2. Run on batch
pnpm exec tsx scripts/fix-react-imports.ts

# 3. Verify
pnpm typecheck && pnpm test

# 4. Commit batch
git add .
git commit -m "feat: optimize React imports (batch 1/10)"

# 5. Repeat for next batch
```

## Troubleshooting

### Script Won't Run

```bash
# Ensure tsx is available
pnpm add -D tsx

# Try with pnpm exec
pnpm exec tsx scripts/analyze-imports.ts
```

### TypeScript Errors After Running

```bash
# Check for mixed value/type imports
grep -r "import.*from 'react'" src/ | grep -v "import type"

# Verify import paths
cat tsconfig.json | grep -A 5 "paths"

# Clear cache and rebuild
rm -rf dist/
pnpm build
```

### Unexpected Changes

```bash
# Revert all changes
git restore .

# Revert specific file
git restore src/path/to/file.tsx

# Review what changed
git diff HEAD
```

## Performance

| Script                   | Files | Runtime | Memory |
| ------------------------ | ----- | ------- | ------ |
| analyze-imports.ts       | 865   | ~2s     | ~100MB |
| fix-duplicate-imports.ts | 865   | ~3s     | ~150MB |
| fix-react-imports.ts     | 865   | ~5s     | ~200MB |

All scripts process files sequentially to ensure accuracy and debuggability.

## Contributing

### Adding New Scripts

1. Follow naming convention: `{action}-{target}.ts`
2. Include detailed JSDoc comments
3. Add error handling
4. Provide progress indicators
5. Generate summary report
6. Update this README

### Script Template

```typescript
#!/usr/bin/env tsx
/**
 * Script Name - Description
 *
 * Detailed explanation of what this script does.
 *
 * @module scripts/script-name
 */

import { readFileSync, writeFileSync } from 'node:fs'
// ... other imports

interface Result {
  filesProcessed: number
  filesModified: number
  errors: string[]
}

async function main() {
  console.log('Starting...\n')

  const result: Result = {
    filesProcessed: 0,
    filesModified: 0,
    errors: [],
  }

  // Processing logic...

  console.log('\n' + '='.repeat(80))
  console.log('RESULTS')
  console.log('='.repeat(80))
  console.log(`Files processed: ${result.filesProcessed}`)
  console.log(`Files modified: ${result.filesModified}`)

  if (result.errors.length > 0) {
    console.log(`\nErrors: ${result.errors.length}`)
    result.errors.forEach((err) => console.log(`  - ${err}`))
    process.exit(1)
  }

  console.log('\n✅ Complete!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
```

## Related Documentation

- [Import Optimization Guide](../docs/IMPORT-OPTIMIZATION.md)
- [Import Optimization Results](../docs/IMPORT-OPTIMIZATION-RESULTS.md)
- [Developer Guide](../CLAUDE.md)

## Support

If you encounter issues:

1. Check this README
2. Review the optimization guides in `docs/`
3. Run analysis script for diagnostic info
4. Check git diff to understand changes
5. Revert if needed: `git restore .`

---

**Last Updated**: January 26, 2026 **Maintainer**: Package team **Status**: Stable
