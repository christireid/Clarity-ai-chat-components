# Webpack Smoke Test - @clarity-chat/react

**Purpose**: Validate that `@clarity-chat/react` works correctly in a Webpack 5 + React + TypeScript environment.

## Quick Start

```bash
# From monorepo root
pnpm install

# Start dev server
pnpm --filter "@clarity-chat/test-webpack" dev

# Build for production
pnpm --filter "@clarity-chat/test-webpack" build
```

## Success Criteria

✅ **Setup Time**: < 10 minutes
✅ **Build**: No errors
✅ **TypeScript**: Types resolve correctly
✅ **Runtime**: Hook initializes without errors
✅ **Dev Server**: Starts successfully
✅ **Code Splitting**: Works correctly

## What This Tests

1. **Package Installation**: SDK installs via workspace protocol
2. **Import Resolution**: Webpack resolves `@clarity-chat/react` correctly
3. **TypeScript**: ts-loader compiles types correctly
4. **Module System**: CommonJS/ESM interop works
5. **Build System**: Production build completes with optimization
6. **Code Splitting**: Webpack splits code correctly

## Webpack Specific Validation

This test validates:
- ✅ Webpack 5 module resolution
- ✅ ts-loader TypeScript compilation
- ✅ Tree-shaking and dead code elimination
- ✅ Code splitting (splitChunks)
- ✅ Hot Module Replacement (HMR)
- ✅ Production optimization

## Expected Output

When you run `pnpm dev`, you should see:
- Webpack dev server starts on http://localhost:8080
- Page loads with "Clarity Chat - Webpack Smoke Test" title
- Clicking "Initialize Chat Hook" shows validation results
- Console logs confirm hook initialization
- HMR updates work on file changes

## Troubleshooting

### Build Fails
```bash
# Ensure react package is built first
pnpm --filter "@clarity-chat/react" build
```

### TypeScript Errors
```bash
# Check ts-loader configuration in webpack.config.js
# Ensure tsconfig.json has correct settings
```

### Module Resolution Errors
Check webpack.config.js has correct resolve extensions:
```js
resolve: {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
}
```

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Install time | <2 min | ⏱️ |
| First build | <60 sec | ⏱️ |
| Dev server start | <10 sec | ⏱️ |
| HMR update | <1 sec | ⏱️ |
| Bundle size | <300KB | ⏱️ |

## Phase 4 Validation

This app contributes **+1.34 points** to the audit score (4 points total ÷ 3 test apps).

**Validation Status**: 🧪 Ready for testing
