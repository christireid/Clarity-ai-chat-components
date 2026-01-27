# Clarity Chat Design Token System

This document explains the theming architecture, color token system, and how to extend or customize
the design system.

## Overview

The Clarity Chat theme system uses a layered approach:

1. **OKLCH Colors** (`--clarity-*`) - Modern, perceptually uniform color definitions
2. **HSL Compatibility Layer** (`--*`) - Tailwind CSS compatible color values
3. **Tailwind Config** - Utility class generation
4. **Design Tokens** - TypeScript constants for programmatic access

## File Structure

```
packages/react/src/theme/
├── theme.css           # CSS custom properties (OKLCH + HSL)
├── design-tokens.ts    # TypeScript token constants
├── create-theme.ts     # Theme creation utilities
├── index.ts            # Public exports
└── README.md           # This file

Root config files:
├── tailwind.config.js  # Tailwind color definitions
└── styles/globals.css  # App-level CSS variables
```

## Color Format Architecture

### Why Two Color Formats?

We use **OKLCH** for color definitions because it provides:

- Perceptually uniform lightness
- Better color interpolation
- Wider gamut support (P3 displays)

However, **Tailwind CSS** expects HSL format for its `hsl()` wrapper:

```js
// tailwind.config.js
success: {
  DEFAULT: 'hsl(var(--success))',  // Expects: "142.1 76.2% 36.3%"
}
```

### The Compatibility Layer

In `theme.css`, we define both formats:

```css
:root {
  /* OKLCH - Modern color definition (use for advanced CSS) */
  --clarity-success: 75% 0.18 145;

  /* HSL - Tailwind compatibility (used by utility classes) */
  --success: 142.1 76.2% 36.3%;
}
```

**IMPORTANT**: When adding new colors, you must define BOTH:

1. `--clarity-[color]` with OKLCH values for direct CSS usage
2. `--[color]` with HSL values for Tailwind classes

### Color Token Categories

| Category    | OKLCH Variable          | HSL Variable    | Usage                         |
| ----------- | ----------------------- | --------------- | ----------------------------- |
| Primary     | `--clarity-primary`     | `--primary`     | Brand color, CTAs             |
| Secondary   | `--clarity-secondary`   | `--secondary`   | Secondary actions             |
| Destructive | `--clarity-destructive` | `--destructive` | Errors, delete actions        |
| Success     | `--clarity-success`     | `--success`     | Success states, online status |
| Warning     | `--clarity-warning`     | `--warning`     | Warnings, away status         |
| Info        | `--clarity-info`        | `--info`        | Informational badges          |

## Adding a New Semantic Color

### Step 1: Define OKLCH values in theme.css

```css
/* In theme.css :root */
--clarity-custom: 65% 0.2 280; /* OKLCH: lightness chroma hue */
--clarity-custom-foreground: 98% 0 0;
```

### Step 2: Add HSL compatibility layer

```css
/* In theme.css backwards compat section */
--custom: 270 60% 50%; /* HSL: hue saturation% lightness% */
--custom-foreground: 0 0% 100%;
```

### Step 3: Add dark mode variants

```css
/* In theme.css .dark section */
.dark {
  --clarity-custom: 70% 0.15 280;
  --custom: 270 50% 60%;
}
```

### Step 4: Add to Tailwind config

```js
// tailwind.config.js
colors: {
  custom: {
    DEFAULT: 'hsl(var(--custom))',
    foreground: 'hsl(var(--custom-foreground))',
  },
}
```

### Step 5: Add to globals.css (if used in app)

```css
/* styles/globals.css */
:root {
  --custom: 270 60% 50%;
  --custom-foreground: 0 0% 100%;
}
.dark {
  --custom: 270 50% 60%;
  --custom-foreground: 0 0% 100%;
}
```

## Dark Mode HSL Values

Some dark mode colors intentionally differ from light mode beyond simple lightness adjustments:

| Color              | Light Mode          | Dark Mode                  | Reason                                                     |
| ------------------ | ------------------- | -------------------------- | ---------------------------------------------------------- |
| info-foreground    | `0 0% 100%` (white) | `222.2 47.4% 11.2%` (dark) | White text on light blue needs dark text on saturated blue |
| warning-foreground | `0 0% 0%` (black)   | `0 0% 0%` (black)          | Yellow maintains good contrast with black in both modes    |

## Using Colors in Components

### Tailwind Classes (Preferred)

```tsx
<div className="bg-success text-success-foreground">Success message</div>
```

### CSS Custom Properties

```css
.custom-element {
  /* For Tailwind compatibility */
  background: hsl(var(--success));

  /* For OKLCH (modern browsers) */
  background: oklch(var(--clarity-success));
}
```

### TypeScript Access

```tsx
import { designTokens } from '@clarity-chat/react/theme'

const successColor = designTokens.colors.success // CSS variable reference
```

## Shadows and Effects

Colored shadows use OKLCH for better color reproduction:

```css
--shadow-success: 0 4px 14px -3px oklch(var(--clarity-success) / 0.3);
```

## Animation Tokens

Animations are defined in both `theme.css` (CSS) and `tailwind.config.js` (utilities):

| Animation       | CSS Class               | Description            |
| --------------- | ----------------------- | ---------------------- |
| `ripple`        | `animate-ripple`        | Button click feedback  |
| `error-shake`   | `animate-shake`         | Form validation error  |
| `scale-in`      | `animate-scale-in`      | Modal/popover entrance |
| `fade-scale-in` | -                       | Dialog entrance        |
| `success-pulse` | `animate-success-pulse` | Success confirmation   |

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Z-Index Scale

Consistent layering across components:

| Layer           | Value | Usage               |
| --------------- | ----- | ------------------- |
| `base`          | 0     | Default content     |
| `dropdown`      | 1000  | Dropdown menus      |
| `sticky`        | 1100  | Sticky headers      |
| `fixed`         | 1200  | Fixed elements      |
| `modalBackdrop` | 1300  | Modal overlays      |
| `modal`         | 1400  | Modal dialogs       |
| `popover`       | 1500  | Popovers            |
| `tooltip`       | 1600  | Tooltips            |
| `toast`         | 1700  | Toast notifications |

## Troubleshooting

### Colors not applying

1. Check that CSS variables are defined in globals.css
2. Verify Tailwind config includes the color
3. Ensure both OKLCH and HSL versions exist

### Dark mode colors wrong

1. Verify `.dark` class is on `<html>` or `<body>`
2. Check that dark mode HSL values are defined
3. Test with browser dev tools color picker

### Animation not working

1. Check `prefers-reduced-motion` setting
2. Verify keyframes are defined in theme.css or tailwind.config.js
3. Ensure animation utility class exists

## Migration Guide

### From hardcoded colors to tokens

```diff
- className="bg-green-500 text-white"
+ className="bg-success text-success-foreground"

- className="bg-red-600 text-white"
+ className="bg-destructive text-destructive-foreground"

- className="bg-amber-500 text-black"
+ className="bg-warning text-warning-foreground"

- className="bg-blue-500 text-white"
+ className="bg-info text-info-foreground"
```

### From inline styles to tokens

```diff
- style={{ backgroundColor: 'rgb(34, 197, 94)' }}
+ className="bg-success"

- style={{ color: '#ef4444' }}
+ className="text-destructive"
```

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors like `bg-green-500`
2. **Define both formats** - OKLCH for CSS, HSL for Tailwind
3. **Test dark mode** - Verify contrast ratios in both themes
4. **Respect reduced motion** - Use the reduced-motion media query
5. **Use foreground pairs** - Every background color needs a foreground variant
