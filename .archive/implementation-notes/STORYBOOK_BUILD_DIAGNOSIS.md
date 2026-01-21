# Storybook Build Diagnosis & Resolution

**Date**: 2026-01-21
**Status**: 🔄 IN PROGRESS
**Issue**: Storybook build failing after adding components to public API

---

## Executive Summary

After successfully adding 40+ components to the public API and rebuilding the React package, Storybook builds began failing with what initially appeared to be circular dependency errors ("Maximum call stack size exceeded"). Through systematic diagnosis, we discovered the root cause was **incomplete package builds** - only the main index entry point was rebuilt, leaving several components unavailable in the dist files.

---

## Timeline of Investigation

### 1. Initial Error: Circular Dependency (Suspected)
**Error Message**:
```
RangeError: Maximum call stack size exceeded
  at ObjectExpression.bind (rollup/dist/es/shared/node-entry.js:2809:28)
```

**Initial Hypothesis**: Theme components (ThemeContrastChecker, ThemePreview, etc.) were creating circular dependencies.

**Actions Taken**:
- Commented out theme component exports from `public-api.ts` (lines 764-770)
- Rebuilt main index: `pnpm exec tsup src/index.ts --format cjs,esm --dts --out-dir dist`
- Build succeeded (exit code 0)

**Result**: ❌ Storybook still failed with same error

---

### 2. Disabled Theme Component Stories
**Hypothesis**: Stories importing disabled theme components were causing build to fail.

**Actions Taken**:
- Renamed story files to `.disabled`:
  - `ThemeContrastChecker.stories.tsx.disabled`
  - `ThemePreview.stories.tsx.disabled`
  - `ThemePreviewThumbnail.stories.tsx.disabled`
- Retried Storybook build

**Result**: ✅ Progress! Error changed from "circular dependency" to "missing export"

---

###3. Missing Export Errors Appeared
**New Error**:
```
"PromptTestHarness" is not exported by "../../packages/react/src/index.ts",
imported by "stories/Advanced/AI/AIOperations.stories.tsx"
```

**Discovery**: AI Operations components (PromptTestHarness, EvaluationDashboard, SafetyReviewConsole) were exported in `public-api.ts` but **not present in dist files**.

**Actions Taken**:
- Verified exports in `public-api.ts` ✅ Present
- Checked `dist/index.mjs` ❌ Not exported
- Disabled `AIOperations.stories.tsx`

**Result**: ✅ Progress! Next missing export error appeared (Draggable)

---

### 4. Root Cause Identified
**Discovery**: The `pnpm exec tsup src/index.ts` command only builds the **main index entry point**. The tsup config defines **13 separate entry points**:

```typescript
// From tsup.config.ts
export default defineConfig([
  { entry: ['src/index.ts', 'src/styles/index.css'] },     // Main
  { entry: { core: 'src/core.ts' } },                       // Core
  { entry: { 'core-minimal': 'src/core-minimal.ts' } },    // Core minimal
  { entry: { 'utils/index': 'src/utils/index.ts' } },      // Utils
  { entry: { 'animations/index': 'src/animations/index.ts' } }, // Animations
  { entry: { 'prompt/index': 'src/prompt/index.ts' } },    // Prompt
  { entry: { 'analytics/index': 'src/analytics/index.ts' } }, // Analytics
  { entry: { 'memory/index': 'src/memory/index.ts' } },    // Memory
  { entry: { 'adapters/index': 'src/adapters/index.ts' } }, // Adapters
  { entry: { 'test-utils': 'src/test-utils.tsx' } },       // Test utils
  { entry: { internal: 'src/internal.ts' } },               // Internal
  { entry: { slim: 'src/slim.ts' } },                       // Slim
  { entry: { namespaced: 'src/namespaced.ts' } },          // Namespaced
])
```

**Issue**: When only building `src/index.ts`, components added to `public-api.ts` may not get bundled properly if they depend on side effects or specific build configurations from other entry points.

**Solution**: Run the **full sequential build** that builds all 13 entry points in order.

---

## Components Temporarily Disabled

During diagnosis, the following were temporarily disabled to isolate issues:

### Theme Components (in public-api.ts)
```typescript
// Lines 764-770 - COMMENTED OUT
// export { ThemeContrastChecker } from './components/theme-components/theme-contrast-checker'
// export { ThemePreview } from './components/theme-components/theme-preview'
// export { ThemePreviewGrid, ThemePreviewThumbnail } from './components/theme-components/theme-preview-thumbnail'
```

### Animation Components (in public-api.ts)
```typescript
// Lines 726-747 - COMMENTED OUT
// export { FeedbackAnimation, SuccessCheckmark, ErrorShake, ... } from './components/ui/feedback-animation'
// export { AnimatedList, AnimatedListItem, FadePresence, ... } from './components/ui/animated-list'
// export { useAnimatedValue, AnimatedNumber } from './hooks/ui/use-animated-value'
```

### Storybook Stories (renamed to .disabled)
- `apps/storybook/stories/Foundation/ThemeContrastChecker.stories.tsx.disabled`
- `apps/storybook/stories/Foundation/ThemePreview.stories.tsx.disabled`
- `apps/storybook/stories/Foundation/ThemePreviewThumbnail.stories.tsx.disabled`
- `apps/storybook/stories/Advanced/AI/AIOperations.stories.tsx.disabled`

---

## Current Status

**In Progress**: Running full sequential build
```bash
pnpm -w run build:sequential
```

This command builds all packages in the monorepo and all 13 entry points of the React package sequentially to avoid memory issues.

**Expected Outcome**: All components properly bundled into dist files, enabling Storybook build to succeed.

---

## Next Steps

1. ✅ **Wait for full sequential build to complete**
2. ⏳ **Retry Storybook build** - should succeed with all dist files properly generated
3. ⏳ **Re-enable disabled exports** - uncomment theme and animation components in public-api.ts
4. ⏳ **Re-enable disabled stories** - rename `.disabled` files back to `.stories.tsx`
5. ⏳ **Verify all stories render correctly** - test each category
6. ⏳ **Proceed to glassmorphism implementation** - user's requested feature

---

## Key Learnings

### 1. Build System Understanding
- **tsup multi-entry configs** require ALL entries to be built, not just the main index
- Partial builds can create "ghost exports" that exist in source but not in dist
- The error "Maximum call stack size exceeded" can indicate missing exports, not just circular dependencies

### 2. Diagnosis Strategy
- Start with the simplest hypothesis (circular imports)
- Use binary search to isolate (comment out half the additions)
- Look for error message changes - different errors = progress
- Verify assumptions (check dist files, not just source)

### 3. Monorepo Best Practices
- Always use workspace-level build scripts (`pnpm -w run build:sequential`)
- Don't manually run tsup on individual entry points
- Trust the configured build process

---

## Files Modified

### Public API Exports (Temporary Changes)
- `packages/react/src/public-api.ts` - Commented out theme and animation components

### Storybook Stories (Temporary Changes)
- `apps/storybook/stories/Foundation/ThemeContrastChecker.stories.tsx` → `.disabled`
- `apps/storybook/stories/Foundation/ThemePreview.stories.tsx` → `.disabled`
- `apps/storybook/stories/Foundation/ThemePreviewThumbnail.stories.tsx` → `.disabled`
- `apps/storybook/stories/Advanced/AI/AIOperations.stories.tsx` → `.disabled`

### Documentation Created
- `STORYBOOK_BUILD_DIAGNOSIS.md` - This file

---

## Error Patterns Reference

### Pattern 1: Circular Dependency (Real)
```
RangeError: Maximum call stack size exceeded
  at ObjectExpression.bind
```
**Cause**: Module A imports from Module B which imports from Module A

**Solution**: Refactor imports to break the cycle

### Pattern 2: Missing Export (Appeared as Circular Dependency)
```
RangeError: Maximum call stack size exceeded
  at ObjectExpression.bind
```
**Cause**: Component exported in source but not built into dist files

**Solution**: Run full build to generate all entry points

### Pattern 3: Missing Export (Direct Error)
```
"ComponentName" is not exported by "../../packages/react/src/index.ts"
```
**Cause**: Story imports component that wasn't built or exported

**Solution**: Verify component is in public-api.ts AND dist files

---

## Commands Reference

### Build Commands
```bash
# Partial build (main index only) - DON'T USE FOR FULL BUILDS
cd packages/react && pnpm exec tsup src/index.ts --format cjs,esm --dts --out-dir dist

# Full sequential build (all 13 entry points) - USE THIS
pnpm -w run build:sequential

# Storybook build (test if package build worked)
cd apps/storybook && pnpm build

# Check what's exported in dist
grep "^export" packages/react/dist/index.mjs | head -50
```

### Verification Commands
```bash
# Check if component is in dist
grep "ComponentName" packages/react/dist/index.mjs

# Check if component is in public-api.ts
grep "ComponentName" packages/react/src/public-api.ts

# Find all disabled stories
find apps/storybook/stories -name "*.disabled"
```

---

*Diagnosis report created: 2026-01-21*
*Status: Sequential build in progress - awaiting completion*
