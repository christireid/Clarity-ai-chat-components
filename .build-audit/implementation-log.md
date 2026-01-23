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

### Fix 9: Missing React Package Exports

**Files**:

- `packages/react/src/public-api.ts`

**Issue**: Several exports were missing from the public API causing docs apps to fail:

- `ToastProvider`, `useToast` - needed for context-based toast notifications
- `SecurityManager` - needed for security playground
- `NIGHT_OWL_MONACO_THEME` - needed for code editor theming

**Fix**: Added missing exports to public-api.ts:

- Toast context exports from `./components/ui/toast`
- SecurityManager and types from `./security/security-manager`
- NIGHT_OWL_MONACO_THEME from `./components/code/themes`

**Verification**: Both docs apps now build successfully.

### Fix 10: Docs AI SDK Import Path

**Files**:

- `apps/docs/package.json`
- `apps/docs/app/examples/tool-calling-showcase/hooks/useAIToolOrchestration.ts`

**Issue**: AI SDK v4 changed the import path for React hooks. Import from `ai/react` was failing.

**Fix**:

- Added `@ai-sdk/react@^3.0.51` to dependencies
- Updated import to use `@ai-sdk/react` instead of `ai/react`

**Verification**: Docs build succeeds.

### Fix 11: Security Playground API Update

**File**: `apps/docs/app/playground/security/page.tsx`

**Issue**: Used non-existent `validateChatInput` method on SecurityManager.

**Fix**: Updated to use async `validateInput` method with proper result mapping.

**Verification**: Security playground builds and functions correctly.

### Fix 12: Streamlined-Docs Server Component Issues

**Files**:

- `apps/streamlined-docs/app/layout.tsx`
- `apps/streamlined-docs/app/api/page.tsx`
- `apps/streamlined-docs/app/playground/page.tsx`
- `apps/streamlined-docs/app/explore/themes/page.tsx`
- `apps/streamlined-docs/lib/utils.ts`
- `apps/streamlined-docs/components/Enhanced/FloatingActionButton.tsx`
- `apps/streamlined-docs/components/UI/AIAssistantButton.tsx` (created)
- `apps/streamlined-docs/components/UI/TemplateButton.tsx` (created)

**Issues**:

1. Event handlers passed from Server Components to Client Components
2. `cn()` function from primitives marked as client-only
3. Corrupted quotes in themes page

**Fixes**:

1. Moved event handlers into FloatingActionButton's default behavior
2. Created AIAssistantButton and TemplateButton client components
3. Rewrote themes page with proper quotes
4. Created local `cn()` implementation for server component compatibility

**Verification**: streamlined-docs builds successfully.

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
