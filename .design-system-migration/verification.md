# Verification Checklist

## Build Verification

### Commands to Run

```bash
# From repository root
pnpm install        # Install dependencies
pnpm build          # Build all packages
pnpm typecheck      # TypeScript type checking
pnpm lint           # ESLint
pnpm test           # Run tests
```

### Build Status

| Package/App              | Build   | TypeCheck | Lint    | Test    |
| ------------------------ | ------- | --------- | ------- | ------- |
| @clarity-chat/react      | Pending | Pending   | Pending | Pending |
| @clarity-chat/primitives | Pending | Pending   | Pending | Pending |
| apps/docs                | Pending | Pending   | Pending | N/A     |
| apps/storybook           | Pending | Pending   | Pending | Pending |
| apps/streamlined-docs    | Pending | Pending   | Pending | N/A     |

---

## Theme Verification

### Light/Dark Mode

- [ ] Toggle works without page reload
- [ ] No flash on page load (pre-hydration script)
- [ ] No hydration mismatch warnings in console
- [ ] System preference detection works
- [ ] Persists across sessions (localStorage)
- [ ] Cross-tab sync works (BroadcastChannel)

### Theme Transitions

- [ ] Smooth color transitions (200ms default)
- [ ] No transition on media elements
- [ ] Respects prefers-reduced-motion
- [ ] theme-transitioning class applied/removed correctly

---

## Glass Surface Verification

### Visual Check

- [ ] Glass surfaces have visible blur effect
- [ ] Borders are visible but subtle
- [ ] Dark mode uses 5-15% white opacity
- [ ] Dark mode uses 12-16px blur
- [ ] Saturate boost visible (120-180%)
- [ ] Gradients are smooth (OKLCH)

### Fallback Check

```css
/* Test by disabling backdrop-filter in DevTools */
```

- [ ] Solid fallback appears when backdrop-filter disabled
- [ ] Content remains readable
- [ ] UI remains usable

---

## Accessibility Verification

### Contrast Ratios

Use browser DevTools or axe to verify:

| Element                 | Requirement | Actual | Pass    |
| ----------------------- | ----------- | ------ | ------- |
| Body text on background | 4.5:1       | TBD    | Pending |
| Body text on glass      | 4.5:1       | TBD    | Pending |
| Large text on glass     | 3:1         | TBD    | Pending |
| Primary button          | 4.5:1       | TBD    | Pending |
| Focus ring              | 3:1         | TBD    | Pending |
| Borders on glass        | 3:1         | TBD    | Pending |

### Media Query Testing

- [ ] prefers-reduced-motion: animations disabled
- [ ] prefers-reduced-transparency: solid backgrounds, no blur
- [ ] prefers-contrast: more: enhanced contrast
- [ ] forced-colors: active: Windows High Contrast works

### Focus Management

- [ ] Focus rings visible on all interactive elements
- [ ] Focus rings visible on glass backgrounds
- [ ] Tab order is logical
- [ ] Skip links work

### Screen Reader

- [ ] No ARIA errors in axe audit
- [ ] Overlays announce correctly
- [ ] Theme toggle announces state

---

## Performance Verification

### Metrics to Check

| Metric                      | Target  | Actual | Pass    |
| --------------------------- | ------- | ------ | ------- |
| LCP                         | < 2.5s  | TBD    | Pending |
| FID                         | < 100ms | TBD    | Pending |
| CLS                         | < 0.1   | TBD    | Pending |
| Glass surfaces per viewport | <= 3    | TBD    | Pending |

### Performance Checklist

- [ ] No layout shift from theme change
- [ ] No layout shift from glass loading
- [ ] LCP element does not have blur
- [ ] Animations don't cause jank
- [ ] backdrop-filter is not animated
- [ ] will-change used sparingly

---

## Visual Regression Testing

### Chromatic/Percy

- [ ] `.visual-test-mode` disables blur
- [ ] Snapshots are deterministic
- [ ] All stories capture correctly

### Manual Visual Check

- [ ] Apps look consistent
- [ ] Glass surfaces look premium
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Icons render correctly

---

## Cross-Browser Testing

| Browser         | Version | Theme | Glass | A11y | Pass    |
| --------------- | ------- | ----- | ----- | ---- | ------- |
| Chrome          | Latest  | TBD   | TBD   | TBD  | Pending |
| Firefox         | Latest  | TBD   | TBD   | TBD  | Pending |
| Safari          | Latest  | TBD   | TBD   | TBD  | Pending |
| Edge            | Latest  | TBD   | TBD   | TBD  | Pending |
| Chrome (Mobile) | Latest  | TBD   | TBD   | TBD  | Pending |
| Safari (iOS)    | Latest  | TBD   | TBD   | TBD  | Pending |

---

## Storybook Verification

- [ ] All stories load without errors
- [ ] Theme toggle in toolbar works
- [ ] Reduced motion toggle works
- [ ] Theme presets selectable
- [ ] Docs render correctly
- [ ] ArgTypes tables work
- [ ] Controls work

---

## Integration Testing

### Apps

- [ ] docs app runs (`pnpm --filter docs dev`)
- [ ] storybook runs (`pnpm --filter storybook dev`)
- [ ] streamlined-docs runs
- [ ] marketing-site runs
- [ ] examples run

### Package Imports

```typescript
// Test these imports work
import { ThemeProvider, useTheme } from '@clarity-chat/react'
import { glassVariants } from '@clarity-chat/primitives'
```

- [ ] All public exports work
- [ ] No circular dependencies
- [ ] Types are correct

---

## Final Checklist

Before marking migration complete:

- [ ] All builds pass
- [ ] All tests pass
- [ ] No console errors
- [ ] No hydration warnings
- [ ] Accessibility audit clean
- [ ] Performance targets met
- [ ] Visual regression approved
- [ ] Documentation updated
