# Vite Smoke Test - @clarity-chat/react

**Purpose**: Validate that `@clarity-chat/react` works correctly in a Vite + React + TypeScript environment.

## Quick Start

```bash
# From monorepo root
pnpm install

# Start dev server
pnpm --filter "@clarity-chat/test-vite" dev

# Build for production
pnpm --filter "@clarity-chat/test-vite" build

# Preview production build
pnpm --filter "@clarity-chat/test-vite" preview
```

## Success Criteria

✅ **Setup Time**: < 10 minutes
✅ **Build**: No errors
✅ **TypeScript**: Types resolve correctly
✅ **Runtime**: Hook initializes without errors
✅ **Dev Server**: Starts successfully

## What This Tests

1. **Package Installation**: SDK installs via workspace protocol
2. **Import Resolution**: Vite resolves `@clarity-chat/react` correctly
3. **TypeScript**: Types are available and correct
4. **Core Functionality**: `useClarityChat` hook works
5. **Build System**: Production build completes successfully

## Expected Output

When you run `pnpm dev`, you should see:
- Vite dev server starts on http://localhost:5173
- Page loads with "Clarity Chat - Vite Smoke Test" title
- Clicking "Initialize Chat Hook" shows validation results
- Console logs confirm hook initialization

## Troubleshooting

### Build Fails
```bash
# Ensure react package is built first
pnpm --filter "@clarity-chat/react" build
```

### TypeScript Errors
```bash
# Check TypeScript version
pnpm why typescript

# Should be ^5.7.2 or compatible
```

### Import Errors
```bash
# Verify workspace protocol works
pnpm list @clarity-chat/react
```

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Install time | <2 min | ⏱️ |
| First build | <30 sec | ⏱️ |
| Dev server start | <5 sec | ⏱️ |
| HMR update | <200ms | ⏱️ |

## Phase 4 Validation

This app contributes **+1.33 points** to the audit score (4 points total ÷ 3 test apps).

**Validation Status**: 🧪 Ready for testing
