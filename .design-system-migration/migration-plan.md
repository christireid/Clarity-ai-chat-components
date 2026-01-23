# Migration Plan

## Executive Summary

This plan outlines the systematic migration of the Clarity AI Chat Components codebase to a unified
Premium Glassmorphism Design System.

## Phase Overview

| Phase | Description                          | Status      |
| ----- | ------------------------------------ | ----------- |
| 0     | Repo Recon + Boundaries              | Complete    |
| 1     | Full Inventory                       | Complete    |
| 2     | Canonical Token + Theme Architecture | In Progress |
| 3     | Tailwind v3 Integration              | Pending     |
| 4     | Core Glass Primitives                | Pending     |
| 5     | shadcn/ui Variant Extensions         | Pending     |
| 6     | Repo-Wide Migration                  | Pending     |
| 7     | Performance Validation               | Pending     |
| 8     | Accessibility Pass                   | Pending     |
| 9     | Cleanup + Deduplication              | Pending     |

---

## Phase 2: Canonical Token + Theme Architecture

### Tasks

- [x] Document token architecture in `tokens.md`
- [x] Document theme architecture in `theme-architecture.md`
- [ ] Update `/styles/globals.css` with unified tokens
- [ ] Add `prefers-reduced-transparency` support
- [ ] Add `@supports` fallback for backdrop-filter
- [ ] Add visual test mode (`.visual-test-mode`)
- [ ] Create pre-hydration theme script
- [ ] Add theme override sanitization utility
- [ ] Verify no hydration mismatch

### Files to Update

| File                                          | Changes                                           |
| --------------------------------------------- | ------------------------------------------------- |
| `/styles/globals.css`                         | Add accessibility media queries, visual test mode |
| `/packages/react/src/theme/theme.css`         | Standardize as canonical source                   |
| `/packages/react/src/theme/ThemeProvider.tsx` | Add reduced-transparency support                  |

---

## Phase 3: Tailwind v3 Integration

### Tasks

- [ ] Verify color mapping uses HSL variables
- [ ] Add glass utility classes to config
- [ ] Ensure consistent shadow scale
- [ ] Add z-index scale
- [ ] Document Tailwind-token relationship

### Files to Update

| File                  | Changes                      |
| --------------------- | ---------------------------- |
| `/tailwind.config.js` | Ensure alignment with tokens |

---

## Phase 4: Core Glass Primitives

### Tasks

- [ ] Create/update `GlassSurface` component
- [ ] Create/update `GlassOverlay` component
- [ ] Implement `isolate` stacking pattern
- [ ] Add solid fallback for no backdrop-filter
- [ ] Add typography smoothing
- [ ] Document glass primitive usage

### Components to Create/Update

| Component      | Location                               | Status   |
| -------------- | -------------------------------------- | -------- |
| GlassSurface   | `/packages/primitives/src/components/` | Create   |
| GlassOverlay   | `/packages/primitives/src/components/` | Create   |
| MeshBackground | `/packages/primitives/src/components/` | Optional |
| NoiseOverlay   | `/packages/primitives/src/components/` | Optional |

---

## Phase 5: shadcn/ui Variant Extensions

### Tasks

- [ ] Add `variant="glass"` to Dialog
- [ ] Add `variant="glass"` to Sheet
- [ ] Add `variant="glass"` to Popover
- [ ] Add `variant="glass"` to DropdownMenu
- [ ] Add `variant="glass"` to Tooltip
- [ ] Add `variant="glass"` to Command
- [ ] Ensure focus rings visible on glass
- [ ] Test portal surfaces

### Components to Update

| Component    | Location                                                   | Changes           |
| ------------ | ---------------------------------------------------------- | ----------------- |
| Dialog       | `/packages/primitives/src/components/ui/dialog.tsx`        | Add glass variant |
| Sheet        | `/packages/primitives/src/components/ui/sheet.tsx`         | Add glass variant |
| Popover      | `/packages/primitives/src/components/ui/popover.tsx`       | Add glass variant |
| DropdownMenu | `/packages/primitives/src/components/ui/dropdown-menu.tsx` | Add glass variant |
| Tooltip      | `/packages/primitives/src/components/ui/tooltip.tsx`       | Add glass variant |
| Command      | `/packages/primitives/src/components/ui/command.tsx`       | Add glass variant |

### Excluded Components (Keep Solid)

- Button
- Input
- Textarea
- Table
- Toggle

---

## Phase 6: Repo-Wide Migration

### Apps Migration Checklist

#### `/apps/docs`

- [ ] Update globals.css to use canonical tokens
- [ ] Replace `--color-*` with unified system
- [ ] Update `.glass-card` to use primitives
- [ ] Add pre-hydration script to layout
- [ ] Verify nav/sidebar styling
- [ ] Test theme toggle

#### `/apps/streamlined-docs`

- [ ] Update globals.css (same as docs)
- [ ] Replace token references
- [ ] Add pre-hydration script
- [ ] Verify styling consistency

#### `/apps/storybook`

- [ ] Update `.storybook/globals.css`
- [ ] Replace `--sb-*` tokens with unified system
- [ ] Update preview.tsx decorators
- [ ] Add visual test mode support
- [ ] Verify all stories render correctly

#### `/apps/examples`

- [ ] Audit example apps for direct color usage
- [ ] Update to use theme tokens
- [ ] Test each example

#### `/apps/marketing-site`

- [ ] Audit current styling
- [ ] Update to unified system
- [ ] Verify responsive behavior

#### `/apps/docs-site`

- [ ] Audit current styling
- [ ] Update to unified system

### Packages Migration Checklist

#### `/packages/react`

- [ ] Verify ThemeProvider exports
- [ ] Update component styles
- [ ] Test all components

#### `/packages/primitives`

- [ ] Update glass-variants.ts if needed
- [ ] Add GlassSurface primitive
- [ ] Update shadcn components

---

## Phase 7: Performance Validation

### Tasks

- [ ] Run Lighthouse audit
- [ ] Check for hydration mismatches
- [ ] Verify no layout shift from glass
- [ ] Test LCP on pages with glass
- [ ] Verify glass surface count (max 2-3)
- [ ] Test @supports fallback

### Verification Commands

```bash
# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test
```

---

## Phase 8: Accessibility Pass

### Tasks

- [ ] Audit contrast ratios on glass surfaces
- [ ] Test focus indicators
- [ ] Verify keyboard navigation
- [ ] Test with prefers-reduced-motion
- [ ] Test with prefers-reduced-transparency
- [ ] Test with high contrast mode
- [ ] Run axe accessibility audit

### WCAG Requirements

| Requirement          | Minimum | Target |
| -------------------- | ------- | ------ |
| Normal text contrast | 4.5:1   | 4.5:1+ |
| Large text contrast  | 3:1     | 3:1+   |
| UI components        | 3:1     | 3:1+   |

---

## Phase 9: Cleanup + Deduplication

### Files to Remove/Consolidate

| Action      | File                        | Reason            |
| ----------- | --------------------------- | ----------------- |
| Consolidate | Duplicate token definitions | Multiple systems  |
| Remove      | Unused glass utilities      | After migration   |
| Update      | Import paths                | After restructure |

### Documentation Updates

- [ ] Update THEMING.md
- [ ] Update component documentation
- [ ] Add glass usage guidelines
- [ ] Update Storybook stories

---

## Rollback Plan

If issues arise:

1. Git revert to pre-migration commit
2. Redeploy previous version
3. Document issues in `implementation-log.md`
4. Create fix plan

---

## Success Criteria

1. One canonical token system repo-wide
2. Light/dark toggle works without flash
3. No hydration mismatch warnings
4. All glass surfaces use primitives
5. WCAG AA compliance verified
6. All builds pass
7. All tests pass
8. Storybook renders correctly
