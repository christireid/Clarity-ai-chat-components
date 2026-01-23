# Design Tokens

## Token Architecture

### Three-Tier System

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIMITIVE TOKENS                          │
│  Raw values - colors, spacing, typography, shadows           │
│  Format: OKLCH for colors, rem for spacing                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SEMANTIC TOKENS                           │
│  Purpose-based mapping - background, foreground, primary     │
│  Format: CSS variables referencing primitives                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT TOKENS                          │
│  Component-specific - button-bg, card-border, glass-blur     │
│  Format: CSS variables referencing semantic tokens           │
└─────────────────────────────────────────────────────────────┘
```

## Canonical Token List

### Color Primitives (OKLCH)

```css
:root {
  /* Neutrals */
  --primitive-white: 100% 0 0;
  --primitive-black: 0% 0 0;
  --primitive-gray-50: 98% 0.005 265;
  --primitive-gray-100: 96% 0.01 265;
  --primitive-gray-200: 92% 0.015 265;
  --primitive-gray-300: 85% 0.02 265;
  --primitive-gray-400: 70% 0.025 265;
  --primitive-gray-500: 55% 0.03 265;
  --primitive-gray-600: 45% 0.025 265;
  --primitive-gray-700: 35% 0.02 265;
  --primitive-gray-800: 25% 0.02 265;
  --primitive-gray-900: 18% 0.015 265;
  --primitive-gray-950: 12% 0.01 265;

  /* Brand - Blue/Indigo */
  --primitive-blue-50: 97% 0.02 250;
  --primitive-blue-100: 94% 0.04 250;
  --primitive-blue-200: 88% 0.08 250;
  --primitive-blue-300: 78% 0.12 250;
  --primitive-blue-400: 68% 0.16 250;
  --primitive-blue-500: 60% 0.2 265;
  --primitive-blue-600: 52% 0.2 265;
  --primitive-blue-700: 45% 0.18 265;
  --primitive-blue-800: 38% 0.15 265;
  --primitive-blue-900: 30% 0.12 265;

  /* Success - Green */
  --primitive-green-500: 55% 0.18 145;
  --primitive-green-600: 50% 0.16 145;

  /* Warning - Amber */
  --primitive-amber-500: 75% 0.18 70;
  --primitive-amber-600: 68% 0.16 70;

  /* Error - Red */
  --primitive-red-500: 55% 0.22 25;
  --primitive-red-600: 48% 0.2 25;

  /* Info - Blue */
  --primitive-info-500: 60% 0.15 230;
}
```

### Semantic Tokens (Light Mode)

```css
:root {
  /* Surfaces */
  --background: var(--primitive-white);
  --foreground: var(--primitive-gray-900);
  --card: var(--primitive-white);
  --card-foreground: var(--primitive-gray-900);
  --popover: var(--primitive-white);
  --popover-foreground: var(--primitive-gray-900);
  --muted: var(--primitive-gray-100);
  --muted-foreground: var(--primitive-gray-500);

  /* Interactive */
  --primary: var(--primitive-blue-500);
  --primary-foreground: var(--primitive-white);
  --secondary: var(--primitive-gray-100);
  --secondary-foreground: var(--primitive-gray-900);
  --accent: var(--primitive-gray-100);
  --accent-foreground: var(--primitive-gray-900);

  /* State */
  --destructive: var(--primitive-red-500);
  --destructive-foreground: var(--primitive-white);
  --success: var(--primitive-green-500);
  --success-foreground: var(--primitive-white);
  --warning: var(--primitive-amber-500);
  --warning-foreground: var(--primitive-gray-900);
  --info: var(--primitive-info-500);
  --info-foreground: var(--primitive-white);

  /* Borders */
  --border: var(--primitive-gray-200);
  --input: var(--primitive-gray-200);
  --ring: var(--primitive-blue-500);
}
```

### Semantic Tokens (Dark Mode)

```css
.dark {
  /* Surfaces */
  --background: var(--primitive-gray-950);
  --foreground: var(--primitive-gray-50);
  --card: var(--primitive-gray-950);
  --card-foreground: var(--primitive-gray-50);
  --popover: var(--primitive-gray-950);
  --popover-foreground: var(--primitive-gray-50);
  --muted: var(--primitive-gray-800);
  --muted-foreground: var(--primitive-gray-400);

  /* Interactive */
  --primary: 70% 0.2 265; /* Brighter in dark mode */
  --primary-foreground: var(--primitive-white);
  --secondary: var(--primitive-gray-800);
  --secondary-foreground: var(--primitive-gray-50);
  --accent: var(--primitive-gray-800);
  --accent-foreground: var(--primitive-gray-50);

  /* State */
  --destructive: 45% 0.2 25;
  --destructive-foreground: var(--primitive-gray-50);
  --success: var(--primitive-green-500);
  --success-foreground: var(--primitive-white);
  --warning: var(--primitive-amber-500);
  --warning-foreground: var(--primitive-gray-900);
  --info: var(--primitive-info-500);
  --info-foreground: var(--primitive-white);

  /* Borders */
  --border: var(--primitive-gray-800);
  --input: var(--primitive-gray-800);
  --ring: 70% 0.2 265;
}
```

### Glass Component Tokens

```css
:root {
  /* Glass Surface Variables */
  --glass-bg-opacity: 0.6;
  --glass-blur: 12px;
  --glass-saturate: 150%;
  --glass-border-opacity: 0.2;

  /* Intensity Presets */
  --glass-subtle-opacity: 0.4;
  --glass-subtle-blur: 8px;
  --glass-medium-opacity: 0.6;
  --glass-medium-blur: 12px;
  --glass-strong-opacity: 0.8;
  --glass-strong-blur: 20px;

  /* Pastel Gradients (OKLCH) */
  --glass-pastel-blue-start: oklch(95% 0.02 240);
  --glass-pastel-blue-end: oklch(97% 0.015 260);
  --glass-pastel-purple-start: oklch(95% 0.025 280);
  --glass-pastel-purple-end: oklch(97% 0.02 300);
  --glass-pastel-pink-start: oklch(96% 0.03 350);
  --glass-pastel-pink-end: oklch(98% 0.02 340);
  --glass-pastel-green-start: oklch(95% 0.03 160);
  --glass-pastel-green-end: oklch(97% 0.02 140);
  --glass-pastel-amber-start: oklch(96% 0.04 80);
  --glass-pastel-amber-end: oklch(98% 0.025 70);

  /* Animation */
  --glass-gradient-angle: 135deg;
  --glass-animation-speed: 8s;
}

.dark {
  /* Dark Mode Glass (per spec: 5-15% white, 12-16px blur, 120-180% saturate) */
  --glass-bg-opacity: 0.08; /* 8% white opacity */
  --glass-blur: 14px; /* 14px blur */
  --glass-saturate: 150%; /* 150% saturate */
  --glass-border-opacity: 0.15;

  /* Dark Pastel Gradients */
  --glass-pastel-blue-start: oklch(18% 0.04 240);
  --glass-pastel-blue-end: oklch(20% 0.035 260);
  --glass-pastel-purple-start: oklch(18% 0.045 280);
  --glass-pastel-purple-end: oklch(20% 0.04 300);
  --glass-pastel-pink-start: oklch(19% 0.05 350);
  --glass-pastel-pink-end: oklch(21% 0.04 340);
  --glass-pastel-green-start: oklch(18% 0.05 160);
  --glass-pastel-green-end: oklch(20% 0.04 140);
  --glass-pastel-amber-start: oklch(19% 0.06 80);
  --glass-pastel-amber-end: oklch(21% 0.045 70);
}
```

### Typography Tokens

```css
:root {
  /* Font Families */
  --font-sans:
    system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;

  /* Font Sizes */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing Tokens

```css
:root {
  /* Fixed Spacing */
  --space-px: 1px;
  --space-0: 0;
  --space-0.5: 0.125rem; /* 2px */
  --space-1: 0.25rem; /* 4px */
  --space-1.5: 0.375rem; /* 6px */
  --space-2: 0.5rem; /* 8px */
  --space-2.5: 0.625rem; /* 10px */
  --space-3: 0.75rem; /* 12px */
  --space-3.5: 0.875rem; /* 14px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-7: 1.75rem; /* 28px */
  --space-8: 2rem; /* 32px */
  --space-9: 2.25rem; /* 36px */
  --space-10: 2.5rem; /* 40px */
  --space-11: 2.75rem; /* 44px */
  --space-12: 3rem; /* 48px */
  --space-14: 3.5rem; /* 56px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
  --space-28: 7rem; /* 112px */
  --space-32: 8rem; /* 128px */
}
```

### Border Radius Tokens

```css
:root {
  --radius: 0.5rem; /* Base radius */
  --radius-none: 0;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Shadow Tokens

```css
:root {
  /* Elevation System */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.06);
  --shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.18), 0 12px 24px rgba(0, 0, 0, 0.08);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  /* Colored Shadows */
  --shadow-primary: 0 8px 16px -4px oklch(var(--primary) / 0.3);
  --shadow-success: 0 8px 16px -4px oklch(var(--success) / 0.3);
  --shadow-warning: 0 8px 16px -4px oklch(var(--warning) / 0.3);
  --shadow-destructive: 0 8px 16px -4px oklch(var(--destructive) / 0.3);
}

.dark {
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.45), 0 8px 16px rgba(0, 0, 0, 0.25);
  --shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3);
}
```

### Z-Index Tokens

```css
:root {
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  --z-toast: 1700;
}
```

### Animation Tokens

```css
:root {
  /* Durations */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-snappy: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

## HSL Compatibility Layer

For Tailwind CSS compatibility, semantic tokens are aliased to HSL format:

```css
:root {
  /* HSL aliases for Tailwind hsl(var(--*)) pattern */
  --background-hsl: 0 0% 100%;
  --foreground-hsl: 222.2 84% 4.9%;
  --primary-hsl: 221.2 83.2% 53.3%;
  /* ... etc */
}
```

## Token Usage Guidelines

### When to Use Each Tier

| Tier      | Use Case                 | Example                                  |
| --------- | ------------------------ | ---------------------------------------- |
| Primitive | Never in components      | Internal reference only                  |
| Semantic  | General styling          | `background: oklch(var(--background))`   |
| Component | Specific component needs | `--glass-blur: var(--glass-medium-blur)` |

### Color Format Guidelines

| Context          | Format | Reason                          |
| ---------------- | ------ | ------------------------------- |
| Tailwind classes | HSL    | Native support via `hsl(var())` |
| Glass effects    | OKLCH  | Perceptual uniformity           |
| Gradients        | OKLCH  | Smooth interpolation            |
| Shadows          | RGBA   | Alpha transparency              |
