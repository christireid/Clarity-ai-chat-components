# Design System Inventory

## Overview

This document provides a comprehensive inventory of all styling surfaces in the Clarity AI Chat
Components repository.

## Token Systems (Multiple - Requires Consolidation)

### 1. Root Global Tokens (`/styles/globals.css`)

**Format**: HSL for Tailwind compatibility **Prefix**: Unprefixed (shadcn convention)

| Category | Variables                                                | Notes                    |
| -------- | -------------------------------------------------------- | ------------------------ |
| Core     | `--background`, `--foreground`, `--card`, `--popover`    | Light/dark variants      |
| Brand    | `--primary`, `--secondary`, `--accent`                   | With foreground variants |
| State    | `--destructive`, `--success`, `--warning`, `--info`      | Semantic colors          |
| Glass    | `--glass-bg-opacity`, `--glass-blur`, `--glass-saturate` | Glass effect variables   |
| Gradient | `--pastel-*-start`, `--pastel-*-end`                     | OKLCH pastel gradients   |
| Shadow   | `--shadow-xs` to `--shadow-xl`                           | Elevation system         |

### 2. Clarity Tokens (`/packages/react/src/theme/theme.css`)

**Format**: OKLCH for perceptual uniformity **Prefix**: `--clarity-*`

| Category   | Variables                                          | Notes               |
| ---------- | -------------------------------------------------- | ------------------- |
| Core       | `--clarity-background`, `--clarity-foreground`     | OKLCH format        |
| Surfaces   | `--clarity-card`, `--clarity-popover`              | Surface colors      |
| Brand      | `--clarity-primary`, `--clarity-secondary`         | Brand colors        |
| State      | `--clarity-destructive`, `--clarity-success`       | Semantic            |
| Radius     | `--clarity-radius` through `--clarity-radius-full` | Border radius scale |
| Typography | `--clarity-font-sans`, `--clarity-font-mono`       | Font families       |
| Animation  | `--duration-*`, `--ease-*`                         | Timing and easing   |
| Spacing    | `--space-1` to `--space-16`                        | Responsive clamp()  |
| Z-index    | `--z-base` to `--z-toast`                          | Stacking contexts   |

**Backwards Compatibility Layer**: Maps `--clarity-*` to unprefixed versions.

### 3. Docs Site Tokens (`/apps/docs/styles/globals.css`)

**Format**: Hex/RGBA **Prefix**: `--color-*`, `--glass-*`, `--gradient-*`

| Category   | Variables                                        | Notes               |
| ---------- | ------------------------------------------------ | ------------------- |
| Background | `--color-bg-primary/secondary/tertiary/elevated` | Different naming    |
| Text       | `--color-text-primary/secondary/tertiary/muted`  | Different naming    |
| Brand      | `--color-brand`, `--color-accent-*`              | Indigo-rose palette |
| Glass      | `--glass-bg`, `--glass-border`, `--glass-blur`   | Different from root |
| Gradients  | `--gradient-brand`, `--gradient-cta`             | Premium gradients   |
| Code       | `--code-bg`, `--code-text`, `--code-*`           | Night Owl theme     |
| Motion     | `--duration-*`, `--ease-*`                       | Animation timing    |
| Radius     | `--radius-sm/md/lg/xl`                           | Different scale     |

### 4. Storybook Tokens (`/apps/storybook/.storybook/globals.css`)

**Format**: Hex **Prefix**: `--sb-*`

| Category   | Variables                              | Notes              |
| ---------- | -------------------------------------- | ------------------ |
| Background | `--sb-bg-primary/secondary/tertiary`   | Storybook-specific |
| Text       | `--sb-text-primary/secondary/tertiary` | Zinc palette       |
| Brand      | `--sb-brand-primary`, `--sb-brand-*`   | Blue accent        |
| Shadows    | `--sb-shadow-sm/md/lg/xl`              | Different values   |
| Border     | `--sb-border`, `--sb-border-radius`    | UI borders         |

## Tailwind Configuration

### Root Config (`/tailwind.config.js`)

- **Dark Mode**: `['class']`
- **Colors**: HSL variables via `hsl(var(--*))`
- **Border Radius**: Dynamic with `var(--radius)`
- **Shadows**: xs through 2xl
- **Backdrop Blur**: xs (2px) to 3xl (32px)
- **Backdrop Saturate**: 0, 50, 100, 150, 200
- **Glass Backgrounds**: OKLCH gradients (5 colors, light/dark)
- **Glass Borders**: OKLCH with alpha (6 variants)
- **Animations**: 25+ keyframes, including glass effects

### Per-App Configs

- 46 total tailwind.config files across packages/apps
- Most extend or copy root config
- Some have custom content paths

## Glass Implementations

### 1. Root Glass Utilities (`/styles/globals.css`)

```css
.glass-panel {
  background: linear-gradient(...oklch from var(--background)...);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid oklch(from var(--border) l c h / var(--glass-border-opacity));
}
.glass-animated {
  animation: gradient-shift...;
}
.glass-glow {
  animation: glow-pulse...;
}
.glass-subtle {
  --glass-bg-opacity: 0.4;
  --glass-blur: 8px;
}
.glass-strong {
  --glass-bg-opacity: 0.8;
  --glass-blur: 20px;
}
```

### 2. CVA Glass Variants (`/packages/primitives/src/lib/glass-variants.ts`)

- **Intensity**: subtle, medium, strong
- **Gradient**: none, blue, purple, pink, green, amber
- **Border**: none, light, medium, strong
- **Animated**: none, gradient, glow, both
- **Hover**: none, lift, glow, brighten
- **Compound Variants**: 15 intensity+gradient combinations

### 3. Docs Glass Card (`/apps/docs/styles/globals.css`)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

- Different variables than root system
- Different opacity values

## Theme Provider

### Location: `/packages/react/src/theme/ThemeProvider.tsx`

**Features**:

- Light/Dark/System mode selection
- 16 theme presets (default, neutral, vibrant, glassmorphism, etc.)
- localStorage persistence
- Cross-tab BroadcastChannel sync
- prefers-color-scheme detection
- prefers-contrast: more detection
- forced-colors (Windows High Contrast) detection
- prefers-reduced-motion via useReducedMotion hook
- Smooth theme transitions with `theme-transitioning` class
- Custom theme support via `customTheme` prop

**Missing from Spec**:

- `prefers-reduced-transparency` support
- `@supports` fallback for backdrop-filter
- Visual test mode class
- Pre-hydration inline script
- Theme override sanitization

## Accessibility Features

### Already Implemented

| Feature                  | Location                                | Status   |
| ------------------------ | --------------------------------------- | -------- |
| `prefers-reduced-motion` | globals.css, theme.css, Tailwind plugin | Complete |
| `prefers-contrast: high` | globals.css, ThemeProvider              | Complete |
| `forced-colors: active`  | ThemeProvider                           | Basic    |
| High contrast mode class | globals.css                             | Complete |
| Reduced motion class     | globals.css                             | Complete |
| Larger text class        | globals.css                             | Complete |
| Screen reader mode       | globals.css                             | Basic    |
| Focus rings              | Various                                 | Partial  |

### Missing

| Feature                        | Requirement                   |
| ------------------------------ | ----------------------------- |
| `prefers-reduced-transparency` | Solid backgrounds, no blur    |
| `@supports` fallback           | Graceful degradation          |
| Visual test mode               | Disable blur for snapshots    |
| Typography smoothing on glass  | Antialiasing on blur surfaces |

## Storybook Integration

### Location: `/apps/storybook/.storybook/`

**preview.tsx Features**:

- ThemeProvider decorator with mode/preset selection
- ReducedMotionEffect component for a11y testing
- Multiple global controls (reduceMotion, themeMode, themePreset)
- Dark mode addon integration

**globals.css Features**:

- Separate token system (`--sb-*`)
- Custom docs styling
- Callout components
- Animation utilities

## Apps and Their Styling

| App                      | Token System | Glass System  | Notes                       |
| ------------------------ | ------------ | ------------- | --------------------------- |
| `/apps/docs`             | `--color-*`  | `.glass-card` | Premium Indigo-Rose palette |
| `/apps/streamlined-docs` | `--color-*`  | `.glass-card` | Same as docs                |
| `/apps/storybook`        | `--sb-*`     | None specific | Zinc palette                |
| `/apps/marketing-site`   | Unknown      | Unknown       | Needs audit                 |
| `/apps/examples`         | Various      | Various       | 40+ examples                |
| `/apps/docs-site`        | Unknown      | Unknown       | Alternative docs            |

## Conflicts and Duplication

### Token Naming Conflicts

| Surface      | Root           | Clarity                | Docs                   | Storybook            |
| ------------ | -------------- | ---------------------- | ---------------------- | -------------------- |
| Background   | `--background` | `--clarity-background` | `--color-bg-primary`   | `--sb-bg-primary`    |
| Primary text | `--foreground` | `--clarity-foreground` | `--color-text-primary` | `--sb-text-primary`  |
| Brand color  | `--primary`    | `--clarity-primary`    | `--color-brand`        | `--sb-brand-primary` |
| Border       | `--border`     | `--clarity-border`     | `--color-border`       | `--sb-border`        |

### Glass Variable Conflicts

| Variable   | Root                     | Docs                  |
| ---------- | ------------------------ | --------------------- |
| Background | `--glass-bg-opacity`     | `--glass-bg`          |
| Blur       | `--glass-blur` (12px)    | `--glass-blur` (24px) |
| Border     | `--glass-border-opacity` | `--glass-border`      |

### Color Format Conflicts

| System                | Format             |
| --------------------- | ------------------ |
| Root globals.css      | HSL (for Tailwind) |
| Clarity theme.css     | OKLCH              |
| Docs globals.css      | Hex/RGBA           |
| Storybook globals.css | Hex                |

## Files Requiring Updates

### Critical (Theme/Token Source)

- [ ] `/styles/globals.css`
- [ ] `/packages/react/src/theme/theme.css`
- [ ] `/packages/primitives/src/lib/glass-variants.ts`
- [ ] `/tailwind.config.js`

### Apps

- [ ] `/apps/docs/styles/globals.css`
- [ ] `/apps/streamlined-docs/styles/globals.css`
- [ ] `/apps/storybook/.storybook/globals.css`
- [ ] `/apps/storybook/.storybook/preview.tsx`

### Components (Overlay Glass Variants)

- [ ] Dialog
- [ ] Sheet
- [ ] Popover
- [ ] DropdownMenu
- [ ] Tooltip
- [ ] Command

## Recommendations

### Consolidation Strategy

1. Use `/packages/react/src/theme/theme.css` as canonical token source
2. Maintain backwards compatibility layer for unprefixed variables
3. Unify glass variables under `--glass-*` prefix
4. Standardize on OKLCH for glass, HSL for Tailwind integration

### Missing Implementations

1. Add `prefers-reduced-transparency` media query support
2. Add `@supports (backdrop-filter: blur(1px))` fallback
3. Add `.visual-test-mode` class for Chromatic
4. Add pre-hydration script for SSR apps
5. Add theme override sanitization utility

### Documentation Updates

1. Update THEMING.md with unified token list
2. Add glass usage guidelines
3. Document accessibility features
