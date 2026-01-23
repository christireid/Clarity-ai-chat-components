# Implementation Log

## Session: 2026-01-23

### Fix 1: @clarity-chat/react Sequential Build Script

**File**: `packages/react/scripts/build-sequential.mjs` **Issue**: Script ran `npx tsup <entry>`
which loaded tsup.config.ts with 13 parallel configs, causing 169 simultaneous builds and race
conditions. **Fix**: Added `--no-config` flag to bypass config file and run truly sequential builds.
**Verification**: `pnpm build` in packages/react now succeeds.

### Fix 2: @clarity-chat/codemods Missing Build Config

**File**: `packages/codemods/tsup.config.ts` (created) **Issue**: Package had no tsup.config.ts,
causing "No input files" error. **Fix**: Created tsup.config.ts with entry point, formats, and DTS
disabled (verbatimModuleSyntax issues). **Verification**: `pnpm build` in packages/codemods
succeeds.

### Fix 3: Marketing-Site Turbopack Panic

**File**: `apps/marketing-site/next.config.ts` **Issue**: Empty `turbopack: {}` config caused
Turbopack internal error. **Fix**: Removed turbopack config block. **Verification**: Partial -
marketing-site now attempts webpack build.

### Fix 4: Citation Component Missing className Prop

**Files**:

- `apps/examples/enterprise-rag/src/app/page.tsx`
- `apps/examples/rag-workbench-demo/src/app/page.tsx` **Issue**: Citation component requires
  className prop but it wasn't being passed. **Fix**: Added `className=""` to all Citation usages.
  **Verification**: TypeScript compilation passes.

### Fix 5: useTokenTracker Missing Functions

**File**: `apps/examples/advanced-chat-features/src/App.tsx` **Issue**: Code used non-existent
`addInputTokens`/`addOutputTokens` functions. **Fix**: Changed to use `addTokenMessage` from the
hook's API. **Verification**: TypeScript compilation passes.

### Fix 6: Missing DynamicCompressionEngine Export

**File**: `packages/token-optimization/src/index.ts` **Issue**: DynamicCompressionEngine class was
not exported from main index. **Fix**: Added export for DynamicCompressionEngine in compression
exports. **Verification**: Build succeeds, export available.

### Fix 7: Duplicate Import in component-demo

**File**: `apps/examples/component-demo/src/App.tsx` **Issue**: `EnhancedMarkdownRenderer` imported
twice. **Fix**: Removed duplicate import line. **Verification**: Build passes.

### Fix 8: Storybook Missing CLI Dependency

**File**: `apps/storybook/package.json` **Issue**: `storybook` package not listed as dependency,
causing "storybook: not found". **Fix**: Added `storybook` to devDependencies. **Verification**:
Partial - CLI found but ESM/CJS issue remains.

---

## Pending Issues

### Storybook ESM/CJS Compatibility

- Storybook 8.6.15 uses esbuild-register which doesn't handle ESM `import.meta` properly
- Error: "require is not defined in ES module scope"
- **Root cause**: esbuild-register converts ESM to CJS but `import.meta.url` becomes broken
- **Workaround attempts**:
  1. Used `createRequire` - still fails
  2. Simplified to direct addon names - still fails
  3. Cleared caches - still fails
- **Recommended fix**: Upgrade to Storybook 10 (uses native ESM) or downgrade to pure CJS config

### Example App TypeScript Errors

- Several example apps have TypeScript errors (missing imports, type mismatches)
- These are example/demo apps, not published packages
- Lower priority - don't affect core package publishing
