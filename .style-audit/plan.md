# Implementation Plan

## Phase 1: Create Canonical Theme System ✓ (In Progress)

### 1.1 Create New theme.css
- [x] Document architecture
- [ ] Create consolidated theme.css with only light/dark
- [ ] Remove zen, vivid, reduced-contrast themes from CSS
- [ ] Add glass system with fallbacks
- [ ] Add backward compatibility layer

### 1.2 Create Customization API
- [ ] Create `customization/` directory
- [ ] Implement `apply-overrides.ts`
- [ ] Implement `validate-theme.ts`
- [ ] Add `ThemeOverrides` types
- [ ] Add unit tests

### 1.3 Create Glass Primitives
- [ ] Create `glass/` directory
- [ ] Implement glass.css utilities
- [ ] Add @supports fallbacks
- [ ] Add reduced-transparency support

## Phase 2: Remove Legacy Themes

### 2.1 Delete Modern Presets
- [ ] Delete `modern-presets/amber.ts`
- [ ] Delete `modern-presets/aurora.ts`
- [ ] Delete `modern-presets/emerald.ts`
- [ ] Delete `modern-presets/forest.ts`
- [ ] Delete `modern-presets/glassmorphism.ts`
- [ ] Delete `modern-presets/midnight.ts`
- [ ] Delete `modern-presets/neumorphism.ts`
- [ ] Delete `modern-presets/neutral.ts`
- [ ] Delete `modern-presets/ocean.ts`
- [ ] Delete `modern-presets/rose.ts`
- [ ] Delete `modern-presets/slate.ts`
- [ ] Delete `modern-presets/sunset.ts`
- [ ] Delete `modern-presets/vibrant.ts`
- [ ] Delete `modern-presets/high-contrast.ts`
- [ ] Keep `modern-presets/default.ts` (modify for light/dark only)
- [ ] Keep `modern-presets/base.ts` (utilities)
- [ ] Update `modern-presets/index.ts`

### 2.2 Update Example Themes
- [ ] Update `examples/custom-theming/lib/themes.ts`
- [ ] Remove all themes except light/dark demo
- [ ] Update documentation

### 2.3 Remove Theme References
- [ ] Search and remove zen/vivid references
- [ ] Remove theme selector components (or simplify)
- [ ] Update ThemeProvider for only light/dark

## Phase 3: Update Type Definitions

- [ ] Simplify `packages/types/src/theme.ts`
- [ ] Update `theme-config.ts`
- [ ] Update `theme-types.ts`
- [ ] Remove unused theme metadata types

## Phase 4: Migrate Apps/Packages

### 4.1 Update globals.css Files (29 files)
- [ ] `styles/globals.css` - simplify, import new theme
- [ ] `apps/docs/styles/globals.css`
- [ ] `apps/storybook/.storybook/globals.css`
- [ ] `apps/streamlined-docs/styles/globals.css`
- [ ] `apps/marketing-site/app/globals.css`
- [ ] All `apps/examples/*/globals.css` (11 files)
- [ ] All `examples/*/globals.css` (12 files)
- [ ] `packages/token-optimization/src/styles/globals.css`

### 4.2 Update Tailwind Configs
- [ ] Simplify root `tailwind.config.js`
- [ ] Update app/package configs to extend root

### 4.3 Update Component Code
- [ ] Remove theme-specific code from CodeBlock
- [ ] Update ThemeSelector to only show light/dark
- [ ] Update ThemeSwitcher
- [ ] Update any theme-specific variants

## Phase 5: Update Tests

- [ ] Fix `modern-presets.test.ts` (expect 2 themes)
- [ ] Update theme validator tests
- [ ] Update visual regression tests
- [ ] Run full test suite

## Phase 6: Update Documentation

- [ ] Update THEMING.md
- [ ] Update Storybook stories
- [ ] Update docs site theme pages
- [ ] Add customization examples

## Phase 7: Verification

- [ ] Run `pnpm build` for all packages
- [ ] Run `pnpm test`
- [ ] Run `pnpm lint`
- [ ] Visual check: light mode
- [ ] Visual check: dark mode
- [ ] Visual check: custom theme override
- [ ] Check reduced-transparency fallback
- [ ] Check no-backdrop-filter fallback

## Phase 8: Final Scoring

- [ ] Complete rubric.md
- [ ] Score each category
- [ ] Document deductions
- [ ] Iterate if < 98/100
