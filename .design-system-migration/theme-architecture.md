# Theme Architecture

## Overview

This document describes the canonical theme architecture for the Clarity AI Chat Components design
system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           THEME SYSTEM                                   │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │   Pre-Hydration Script  │  ← Prevents flash
                    │   (inline in <head>)    │
                    └───────────┬─────────────┘
                                ↓
                    ┌─────────────────────────┐
                    │   ThemeProvider         │  ← React context
                    │   - Mode: light/dark    │
                    │   - Preset selection    │
                    │   - Transition handling │
                    └───────────┬─────────────┘
                                ↓
         ┌──────────────────────┼──────────────────────┐
         ↓                      ↓                      ↓
┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────┐
│  CSS Variables  │  │  Tailwind Config    │  │  CVA Variants   │
│  (tokens.css)   │  │  (color mapping)    │  │  (glass, etc)   │
└─────────────────┘  └─────────────────────┘  └─────────────────┘
         ↓                      ↓                      ↓
         └──────────────────────┼──────────────────────┘
                                ↓
                    ┌─────────────────────────┐
                    │   Component Styling     │
                    │   - Tailwind classes    │
                    │   - Glass primitives    │
                    │   - Custom CSS vars     │
                    └─────────────────────────┘
```

## Theme Selection Mechanism

### Dark Mode Strategy: `class`

The system uses Tailwind's class-based dark mode:

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class'], // Uses .dark class on html/body
  // ...
}
```

### Theme Variant Strategy: `data-theme`

Additional theme variants use a data attribute:

```html
<html class="dark" data-theme="glassmorphism"></html>
```

### CSS Selectors

```css
/* Light mode (default) */
:root {
  /* tokens */
}

/* Dark mode */
.dark {
  /* dark tokens */
}

/* Theme variants */
[data-theme='glassmorphism'] {
  /* glassmorphism overrides */
}
[data-theme='glassmorphism'].dark {
  /* dark glassmorphism */
}
```

## Pre-Hydration Script

To prevent theme flash during SSR/hydration, include this inline script in `<head>`:

```html
<script>
  ;(function () {
    // Get stored theme or default to system
    var theme = localStorage.getItem('clarity-chat-theme')
    var parsed = theme ? JSON.parse(theme) : { mode: 'system' }
    var mode = parsed.mode

    // Resolve system preference
    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Apply class immediately
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    }

    // Apply theme variant if set
    if (parsed.preset) {
      document.documentElement.setAttribute('data-theme', parsed.preset)
    }

    // Block FOUC
    document.documentElement.style.colorScheme = mode
  })()
</script>
```

### Next.js Integration

For Next.js apps, add to `app/layout.tsx`:

```tsx
export default function RootLayout({ children }) {
  const themeScript = `
    (function() {
      var theme = localStorage.getItem('clarity-chat-theme');
      var parsed = theme ? JSON.parse(theme) : { mode: 'system' };
      var mode = parsed.mode;
      if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      }
      if (parsed.preset) {
        document.documentElement.setAttribute('data-theme', parsed.preset);
      }
      document.documentElement.style.colorScheme = mode;
    })();
  `

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

## Theme Override Sanitization

Runtime theme customization must sanitize CSS values to prevent XSS:

```typescript
const UNSAFE_PATTERNS = [
  /url\s*\(/i,
  /expression\s*\(/i,
  /javascript:/i,
  /behavior:/i,
  /-moz-binding/i,
  /@import/i,
  /<script/i,
]

function sanitizeThemeValue(value: string): string | null {
  if (typeof value !== 'string') return null

  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(value)) {
      console.warn(`[Clarity Theme] Blocked unsafe CSS value: ${value}`)
      return null
    }
  }

  return value
}

function applyThemeOverrides(overrides: Record<string, string>) {
  const root = document.documentElement

  for (const [key, value] of Object.entries(overrides)) {
    const sanitized = sanitizeThemeValue(value)
    if (sanitized !== null) {
      root.style.setProperty(`--${key}`, sanitized)
    }
  }
}
```

## Accessibility Integrations

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### prefers-reduced-transparency

```css
@media (prefers-reduced-transparency: reduce) {
  .glass-panel,
  .glass-surface,
  [class*='backdrop-blur'] {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: oklch(var(--background)) !important;
  }
}
```

### prefers-contrast: more

```css
@media (prefers-contrast: more) {
  :root {
    --primary: 214 90% 35%;
    --border: 216 22% 50%;
    --muted-foreground: 215 20% 30%;
  }

  .glass-panel {
    backdrop-filter: none;
    background: var(--card);
    border: 2px solid var(--border);
  }
}
```

### forced-colors (Windows High Contrast)

```css
@media (forced-colors: active) {
  .glass-panel {
    background: Canvas;
    border: 1px solid CanvasText;
    forced-color-adjust: none;
  }

  button {
    border: 2px solid ButtonText;
  }
}
```

## @supports Fallback

For browsers without backdrop-filter support:

```css
/* Default: solid background */
.glass-surface {
  background: oklch(var(--card));
  border: 1px solid oklch(var(--border));
}

/* Enhanced: with backdrop-filter */
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glass-surface {
    background: oklch(var(--background) / var(--glass-bg-opacity));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  }
}
```

## Visual Test Mode

For stable visual regression testing (Chromatic, Percy):

```css
.visual-test-mode,
.visual-test-mode * {
  /* Disable blur for deterministic snapshots */
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;

  /* Disable animations */
  animation: none !important;
  transition: none !important;
}

/* Ensure backgrounds are still visible */
.visual-test-mode .glass-panel,
.visual-test-mode .glass-surface {
  background: oklch(var(--card)) !important;
  border: 1px solid oklch(var(--border)) !important;
}
```

### Storybook Integration

```tsx
// .storybook/preview.tsx
export const decorators = [
  (Story, context) => {
    const isVisualTest = context.globals.visualTestMode || process.env.CHROMATIC === 'true'

    return (
      <div className={isVisualTest ? 'visual-test-mode' : ''}>
        <Story />
      </div>
    )
  },
]
```

## Typography Smoothing on Glass

For better text rendering on glass surfaces:

```css
.glass-panel,
.glass-surface,
[class*='backdrop-blur'] {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

## Isolation for Stacking Contexts

When nesting glass surfaces, use isolation:

```css
.glass-overlay {
  isolation: isolate;
}

.glass-overlay > .glass-surface {
  /* Creates new stacking context, preventing backdrop-filter inheritance issues */
}
```

## Theme Transition Handling

```css
/* During theme transitions */
.theme-transitioning,
.theme-transitioning * {
  transition:
    background-color var(--theme-transition-duration, 200ms) ease-in-out,
    border-color var(--theme-transition-duration, 200ms) ease-in-out,
    color var(--theme-transition-duration, 200ms) ease-in-out,
    fill var(--theme-transition-duration, 200ms) ease-in-out,
    stroke var(--theme-transition-duration, 200ms) ease-in-out !important;
}

/* Exclude elements that should change immediately */
.theme-transitioning img,
.theme-transitioning video,
.theme-transitioning iframe,
.theme-transitioning [data-no-theme-transition] {
  transition: none !important;
}
```

## Performance Guidelines

1. **Limit Glass Surfaces**: Maximum 2-3 glass surfaces visible per viewport on mobile
2. **Never Animate backdrop-filter**: Use transform/opacity for glass animations
3. **LCP Elements**: Avoid blur on Largest Contentful Paint elements
4. **Use will-change Sparingly**: Only add `will-change: backdrop-filter` for interactive elements
5. **Layer Hierarchy**: Use isolation to prevent re-computation cascades

## File Structure

```
packages/react/src/theme/
├── index.ts                    # Public exports
├── theme.css                   # CSS variables (canonical source)
├── ThemeProvider.tsx           # React context provider
├── theme-context.ts            # Context definition
├── theme-types.ts              # TypeScript types
├── theme-builder.ts            # Theme composition utilities
├── create-theme.ts             # Theme factory
├── theme-sanitizer.ts          # Override sanitization (NEW)
├── theme-script.ts             # Pre-hydration script (NEW)
├── tokens/
│   ├── colors.ts               # Color token definitions
│   ├── shadows.ts              # Shadow tokens
│   ├── animations.ts           # Animation tokens
│   ├── spacing.ts              # Spacing tokens
│   ├── radius.ts               # Border radius tokens
│   └── typography.ts           # Typography tokens
├── modern-presets/
│   ├── index.ts                # Preset exports
│   ├── base.ts                 # Base preset factory
│   ├── default.ts              # Default theme
│   ├── glassmorphism.ts        # Glass theme preset
│   └── [...other presets]
└── THEMING.md                  # Documentation
```
