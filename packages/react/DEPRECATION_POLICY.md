# Deprecation Policy

## Overview

This document outlines the deprecation policy for `@clarity-chat/react` package exports.

## Deprecated Re-exports

The following files contain deprecated re-exports that will be removed in v3.0.0:

### Token Optimization Utilities

- `src/utils/tokenization/estimator.ts` - Re-exports from `@clarity-chat/token-optimization`
- `src/utils/tokenization/model-pricing.ts` - Re-exports from `@clarity-chat/token-optimization`
- `src/utils/tokenization/model-registry.ts` - Re-exports from `@clarity-chat/token-optimization`

### Components

- `src/components/token/TokenCostPreview.tsx` - Re-exports from
  `@clarity-chat/token-optimization/react`

## Status

✅ **All deprecated exports have:**

1. JSDoc `@deprecated` tags with migration examples
2. Runtime `console.warn()` in development mode
3. Clear migration paths pointing to the correct package
4. **NOT exported** from `public-api.ts` (not in public API surface)

## Migration Timeline

- **v2.x**: Deprecation warnings active
- **v3.0.0**: Deprecated re-exports will be removed

## Internal Usage

These deprecated files are still used internally within the `@clarity-chat/react` package. Internal
code will be migrated before v3.0.0 release.

## External Users

External users importing from these paths will see deprecation warnings in development mode. Users
should migrate to importing from `@clarity-chat/token-optimization` directly.

## Deprecation Pattern

All deprecation warnings follow this pattern:

```typescript
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] <module>: Import from @clarity-chat/token-optimization instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
```

This ensures zero runtime overhead in production while providing helpful warnings during
development.
