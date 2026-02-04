# Next.js Smoke Test - @clarity-chat/react

**Purpose**: Validate that `@clarity-chat/react` works correctly in a Next.js 15 App Router environment.

## Quick Start

```bash
# From monorepo root
pnpm install

# Start dev server
pnpm --filter "@clarity-chat/test-nextjs" dev

# Build for production
pnpm --filter "@clarity-chat/test-nextjs" build

# Start production server
pnpm --filter "@clarity-chat/test-nextjs" start
```

## Success Criteria

✅ **Setup Time**: < 10 minutes
✅ **Build**: No errors
✅ **TypeScript**: Types resolve correctly
✅ **Runtime**: Hook initializes without errors
✅ **Dev Server**: Starts successfully
✅ **App Router**: Works with 'use client' boundary

## What This Tests

1. **Package Installation**: SDK installs via workspace protocol
2. **Import Resolution**: Next.js resolves `@clarity-chat/react` correctly
3. **TypeScript**: Types are available and correct
4. **Client Components**: Works with 'use client' directive
5. **Build System**: Production build completes successfully
6. **Transpilation**: Next.js transpiles the package correctly

## Next.js Specific Validation

This test validates:
- ✅ Package transpilation via `transpilePackages` config
- ✅ Client Component boundary (`'use client'`)
- ✅ Server/Client separation works correctly
- ✅ No hydration mismatches
- ✅ Production optimization doesn't break the SDK

## Expected Output

When you run `pnpm dev`, you should see:
- Next.js dev server starts on http://localhost:3001
- Page loads with "Clarity Chat - Next.js Smoke Test" title
- Clicking "Initialize Chat Hook" shows validation results
- Console logs confirm hook initialization

## Troubleshooting

### Build Fails
```bash
# Ensure react package is built first
pnpm --filter "@clarity-chat/react" build
```

### Transpilation Errors
Check `next.config.js` has:
```js
transpilePackages: ['@clarity-chat/react']
```

### TypeScript Errors
```bash
# Check TypeScript version
pnpm why typescript

# Should be ^5.7.2 or compatible
```

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Install time | <2 min | ⏱️ |
| First build | <45 sec | ⏱️ |
| Dev server start | <8 sec | ⏱️ |
| Fast Refresh | <500ms | ⏱️ |

## Phase 4 Validation

This app contributes **+1.33 points** to the audit score (4 points total ÷ 3 test apps).

**Validation Status**: 🧪 Ready for testing
