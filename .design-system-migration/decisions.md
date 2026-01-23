# Design System Decisions

## Decision Log

### D001: Tailwind Version Strategy

**Date**: 2026-01-22 **Decision**: Continue with Tailwind v3.4.18 patterns **Rationale**:

- Repository uses Tailwind 3.4.18, not v4
- Migrating to v4 is out of scope for this design system task
- Glass utilities will use v3-compatible classes (backdrop-blur-md, etc.)
- Custom utilities configured in tailwind.config.js

### D002: Theme Switching Mechanism

**Date**: 2026-01-22 **Decision**: Use existing `class` dark mode with `data-theme` attribute
**Rationale**:

- Already implemented in ThemeProvider.tsx
- Compatible with shadcn/ui conventions
- Supports multiple theme variants beyond light/dark
- Pre-hydration script needed for SSR (Next.js apps)

### D003: Token Architecture

**Date**: 2026-01-22 **Decision**: Three-tier token system (primitive → semantic → component)
**Structure**:

```
Primitives: Raw values (colors, spacing, etc.)
├── --color-blue-500: oklch(60% 0.15 240)
├── --spacing-4: 1rem
└── --radius-md: 0.375rem

Semantic: Purpose-based mapping
├── --color-primary: var(--color-blue-500)
├── --color-background: var(--color-white)
└── --color-foreground: var(--color-gray-900)

Component: Component-specific tokens
├── --button-bg: var(--color-primary)
├── --card-bg: var(--color-background)
└── --glass-bg-opacity: 0.6
```

### D004: Glass Surface Implementation

**Date**: 2026-01-22 **Decision**: Centralize glass in primitives package with CVA variants
**Rationale**:

- Single source of truth for glass styles
- Type-safe variants via CVA
- Reusable across all packages and apps
- Consistent accessibility handling

### D005: Color Space Strategy

**Date**: 2026-01-22 **Decision**: HSL for Tailwind integration, OKLCH for glass effects
**Rationale**:

- HSL is Tailwind's expected format for `hsl(var(--color))`
- OKLCH provides better perceptual uniformity for glass gradients
- Existing implementation already uses this dual approach

### D006: Overlay Component Glass Variants

**Date**: 2026-01-22 **Decision**: Add glass/frosted variants to specific overlay components only
**Target Components**:

- Dialog
- Sheet
- Popover
- DropdownMenu
- Tooltip
- Command

**Excluded** (solid for readability):

- Button
- Input
- Textarea
- Tables
- Small toggles

### D007: Accessibility Strategy

**Date**: 2026-01-22 **Decision**: Implement three accessibility modes **Modes**:

1. `prefers-reduced-motion`: Disable animations
2. `prefers-reduced-transparency`: Solid backgrounds, no blur
3. `forced-colors`: Windows High Contrast support

**Contrast Requirements**:

- Normal text: 4.5:1 minimum (WCAG AA)
- Large text (18px+ or 14px bold): 3:1 minimum
- UI components: 3:1 minimum

### D008: Performance Constraints

**Date**: 2026-01-22 **Decision**: Limit glass surfaces and avoid animated backdrop-filter
**Rules**:

- Maximum 2-3 glass surfaces per viewport on mobile
- Never animate backdrop-filter property
- LCP elements must not have blur
- Use `will-change: backdrop-filter` sparingly

### D009: Visual Test Mode

**Date**: 2026-01-22 **Decision**: Add `.visual-test-mode` class to disable blur **Implementation**:

```css
.visual-test-mode,
.visual-test-mode * {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
```

**Purpose**: Stable visual regression snapshots in Chromatic/Percy

### D010: Theme Override Sanitization

**Date**: 2026-01-22 **Decision**: Block potentially dangerous CSS values **Blocked Patterns**:

- `url()`
- `expression()`
- `javascript:`
- `behavior:`
- `-moz-binding`

**Implementation**: Validate theme overrides before applying
