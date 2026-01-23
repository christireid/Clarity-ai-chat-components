# Canonical Theme Architecture

## Overview

A single, consolidated theme system with exactly **two built-in themes**: `light` and `dark`.
Designed for premium aesthetics, customer customization, and accessibility.

## Core Principles

1. **CSS Variables as Source of Truth** - All theming via custom properties
2. **OKLCH Color Format** - Perceptually uniform, wide gamut support
3. **Data-Attribute Theme Selection** - `data-theme="light|dark"`
4. **Semantic Tokens Only** - Intent-based, not visual
5. **Safe Customization** - Validated customer overrides

---

## Token Structure

### Layer 1: Primitive Tokens (Internal)
Not exposed to customers. Used to derive semantic tokens.
```css
/* Internal - do not document publicly */
--_white: 100% 0 0;
--_black: 0% 0 0;
--_blue-500: 60% 0.2 265;
/* etc */
```

### Layer 2: Semantic Tokens (Public API)
The customer-facing token set. Minimal and stable.

```css
:root {
  /* ===== Surface Colors ===== */
  --clarity-background: 100% 0 0;
  --clarity-foreground: 20% 0.02 250;

  --clarity-card: 100% 0 0;
  --clarity-card-foreground: 20% 0.02 250;

  --clarity-popover: 100% 0 0;
  --clarity-popover-foreground: 20% 0.02 250;

  /* ===== Brand Colors ===== */
  --clarity-primary: 60% 0.2 265;
  --clarity-primary-foreground: 100% 0 0;

  --clarity-secondary: 96% 0.01 265;
  --clarity-secondary-foreground: 20% 0.02 250;

  --clarity-accent: 96% 0.02 265;
  --clarity-accent-foreground: 20% 0.02 250;

  /* ===== Muted/Subtle ===== */
  --clarity-muted: 96% 0.01 265;
  --clarity-muted-foreground: 55% 0.02 265;

  /* ===== State Colors ===== */
  --clarity-destructive: 55% 0.22 25;
  --clarity-destructive-foreground: 100% 0 0;

  --clarity-success: 55% 0.18 145;
  --clarity-success-foreground: 100% 0 0;

  --clarity-warning: 75% 0.18 70;
  --clarity-warning-foreground: 25% 0.08 70;

  /* ===== UI Chrome ===== */
  --clarity-border: 90% 0.01 265;
  --clarity-input: 90% 0.01 265;
  --clarity-ring: 60% 0.2 265;

  /* ===== Layout ===== */
  --clarity-radius: 0.5rem;

  /* ===== Glass Parameters ===== */
  --clarity-glass-opacity: 0.7;
  --clarity-glass-blur: 12px;
  --clarity-glass-saturate: 150%;
  --clarity-glass-border-opacity: 0.2;

  /* ===== Typography ===== */
  --clarity-font-sans: system-ui, -apple-system, sans-serif;
  --clarity-font-mono: 'SF Mono', Consolas, monospace;

  /* ===== Timing ===== */
  --clarity-duration-fast: 150ms;
  --clarity-duration-normal: 200ms;
  --clarity-duration-slow: 300ms;
}
```

### Layer 3: Component Tokens (Internal)
Scoped to specific components. Derived from semantic tokens.
```css
/* Example: Button component tokens */
.clarity-button {
  --_button-bg: oklch(var(--clarity-primary));
  --_button-fg: oklch(var(--clarity-primary-foreground));
  --_button-radius: var(--clarity-radius);
}
```

---

## Theme Application

### HTML Structure
```html
<html data-theme="light">
  <!-- or -->
<html data-theme="dark">
```

### CSS Implementation
```css
/* Light mode (default) */
:root,
[data-theme="light"] {
  --clarity-background: 100% 0 0;
  --clarity-foreground: 20% 0.02 250;
  /* ... light values ... */
}

/* Dark mode */
[data-theme="dark"] {
  --clarity-background: 20% 0.02 250;
  --clarity-foreground: 95% 0.01 250;
  /* ... dark values ... */
}

/* Tailwind dark class compatibility */
.dark {
  /* Inherits from [data-theme="dark"] */
}
```

### Theme Toggle API
```typescript
// React hook
function useTheme() {
  return {
    theme: 'light' | 'dark' | 'system',
    setTheme: (theme: Theme) => void,
    resolvedTheme: 'light' | 'dark',
  };
}

// Vanilla JS
function setTheme(theme: 'light' | 'dark' | 'system'): void;
function getTheme(): 'light' | 'dark' | 'system';
function getResolvedTheme(): 'light' | 'dark';
```

---

## Glass Surface System

### GlassSurface Primitive
```css
.glass-surface {
  background: oklch(var(--clarity-background) / var(--clarity-glass-opacity));
  backdrop-filter: blur(var(--clarity-glass-blur)) saturate(var(--clarity-glass-saturate));
  border: 1px solid oklch(var(--clarity-border) / var(--clarity-glass-border-opacity));
}

/* Accessibility: Reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .glass-surface {
    backdrop-filter: none;
    background: oklch(var(--clarity-card));
    border: 1px solid oklch(var(--clarity-border));
  }
}

/* Fallback: No backdrop-filter support */
@supports not (backdrop-filter: blur(1px)) {
  .glass-surface {
    background: oklch(var(--clarity-card));
  }
}
```

### Glass Variants
```css
/* Subtle glass - lighter effect */
.glass-surface--subtle {
  --clarity-glass-opacity: 0.85;
  --clarity-glass-blur: 8px;
}

/* Strong glass - more pronounced */
.glass-surface--strong {
  --clarity-glass-opacity: 0.6;
  --clarity-glass-blur: 20px;
}
```

---

## File Structure

```
packages/react/src/theme/
├── index.ts              # Public exports
├── theme.css             # Canonical token definitions (ONLY light/dark)
├── use-theme.ts          # Theme hook
├── ThemeProvider.tsx     # Context provider
├── ThemeToggle.tsx       # Toggle component
├── customization/
│   ├── index.ts
│   ├── apply-overrides.ts    # Runtime override API
│   ├── validate-theme.ts     # Sanitization
│   └── types.ts              # ThemeOverrides type
├── glass/
│   ├── index.ts
│   ├── GlassSurface.tsx      # Glass primitive component
│   └── glass.css             # Glass utility classes
└── utils/
    ├── color-utils.ts        # OKLCH utilities
    └── theme-script.ts       # Anti-flash script
```

---

## Backward Compatibility

### Legacy Variable Mapping
```css
:root {
  /* Map clarity tokens to legacy shadcn names */
  --background: var(--clarity-background);
  --foreground: var(--clarity-foreground);
  --primary: var(--clarity-primary);
  --primary-foreground: var(--clarity-primary-foreground);
  /* ... etc ... */
  --radius: var(--clarity-radius);
}
```

### Tailwind Integration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--clarity-background) / <alpha-value>)',
        foreground: 'oklch(var(--clarity-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--clarity-primary) / <alpha-value>)',
          foreground: 'oklch(var(--clarity-primary-foreground) / <alpha-value>)',
        },
        // ... etc
      },
    },
  },
};
```

---

## Migration Path

### Phase 1: Create New System
1. Create consolidated theme.css with only light/dark
2. Add customization API
3. Add glass primitives

### Phase 2: Update Imports
1. Update all globals.css to import new theme.css
2. Remove duplicate variable definitions

### Phase 3: Remove Legacy
1. Delete modern-presets directory
2. Delete theme-specific components
3. Update tests

### Phase 4: Documentation
1. Update THEMING.md
2. Add customization examples
3. Update Storybook stories
