# Theme Customization Guide

## Overview

Clarity Chat supports safe customer customization without modifying library internals.
Customers can brand the UI with their colors, adjust glass parameters, and more.

## Customization Methods

### Method 1: CSS Override File (Recommended)

Import your custom CSS **after** the Clarity styles:

```css
/* your-brand-theme.css */

/* Light mode overrides */
:root,
[data-theme="light"] {
  /* Brand colors */
  --clarity-primary: 55% 0.25 200;           /* Your brand blue */
  --clarity-primary-foreground: 100% 0 0;    /* White text on primary */

  /* Accent color */
  --clarity-accent: 90% 0.1 200;

  /* Border radius */
  --clarity-radius: 0.75rem;                  /* More rounded */
}

/* Dark mode overrides */
[data-theme="dark"] {
  --clarity-primary: 65% 0.2 200;            /* Lighter in dark mode */
}
```

```tsx
// In your app
import '@clarity-chat/react/styles.css';
import './your-brand-theme.css';  // After clarity styles
```

### Method 2: Runtime API

```typescript
import { applyThemeOverrides } from '@clarity-chat/react';

// Apply brand overrides
applyThemeOverrides({
  colors: {
    primary: '#3b82f6',           // Hex supported
    primaryForeground: '#ffffff',
  },
  radius: '0.75rem',
  glass: {
    opacity: 0.8,
    blur: '16px',
  },
});

// Apply to specific element
applyThemeOverrides(overrides, {
  scope: document.getElementById('chat-container'),
  mode: 'dark',                   // Apply to dark mode only
});

// Persist to localStorage
applyThemeOverrides(overrides, {
  persist: true,
});
```

---

## Customizable Tokens

### Color Tokens

| Token | Description | Example Value |
|-------|-------------|---------------|
| `--clarity-primary` | Primary brand color | `60% 0.2 265` |
| `--clarity-primary-foreground` | Text on primary | `100% 0 0` |
| `--clarity-secondary` | Secondary surface | `96% 0.01 265` |
| `--clarity-secondary-foreground` | Text on secondary | `20% 0.02 250` |
| `--clarity-accent` | Accent/highlight | `96% 0.02 265` |
| `--clarity-accent-foreground` | Text on accent | `20% 0.02 250` |
| `--clarity-muted` | Muted background | `96% 0.01 265` |
| `--clarity-muted-foreground` | Muted text | `55% 0.02 265` |
| `--clarity-background` | Page background | `100% 0 0` |
| `--clarity-foreground` | Default text | `20% 0.02 250` |
| `--clarity-card` | Card background | `100% 0 0` |
| `--clarity-card-foreground` | Card text | `20% 0.02 250` |
| `--clarity-border` | Border color | `90% 0.01 265` |
| `--clarity-ring` | Focus ring color | `60% 0.2 265` |

### Layout Tokens

| Token | Description | Default | Range |
|-------|-------------|---------|-------|
| `--clarity-radius` | Border radius | `0.5rem` | `0` - `2rem` |

### Glass Tokens

| Token | Description | Default | Safe Range |
|-------|-------------|---------|------------|
| `--clarity-glass-opacity` | Background opacity | `0.7` | `0.5` - `0.95` |
| `--clarity-glass-blur` | Blur amount | `12px` | `4px` - `24px` |
| `--clarity-glass-saturate` | Color saturation | `150%` | `100%` - `200%` |
| `--clarity-glass-border-opacity` | Border opacity | `0.2` | `0.05` - `0.4` |

---

## Color Format Support

### OKLCH (Recommended)
```css
--clarity-primary: 60% 0.2 265;   /* L C H */
--clarity-primary: 60% 0.2 265 / 0.5;  /* With alpha */
```

### Hex
```css
--clarity-primary: #6366f1;
--clarity-primary: #6366f180;     /* With alpha */
```

### RGB/RGBA
```css
--clarity-primary: rgb(99, 102, 241);
--clarity-primary: rgba(99, 102, 241, 0.5);
```

### HSL/HSLA
```css
--clarity-primary: hsl(239, 84%, 67%);
--clarity-primary: hsla(239, 84%, 67%, 0.5);
```

---

## TypeScript Types

```typescript
interface ThemeOverrides {
  colors?: Partial<{
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    ring: string;
  }>;

  radius?: string;

  glass?: Partial<{
    opacity: number;      // 0.5 - 0.95
    blur: string;         // '4px' - '24px'
    saturate: string;     // '100%' - '200%'
    borderOpacity: number; // 0.05 - 0.4
  }>;
}

interface ApplyOptions {
  scope?: HTMLElement;    // Default: document.documentElement
  mode?: 'light' | 'dark' | 'both';  // Default: 'both'
  persist?: boolean;      // Save to localStorage
}

function applyThemeOverrides(
  overrides: ThemeOverrides,
  options?: ApplyOptions
): void;

function clearThemeOverrides(scope?: HTMLElement): void;

function getActiveOverrides(): ThemeOverrides | null;
```

---

## Value Sanitization

For security, all override values are validated:

### Allowed Patterns
- Hex colors: `#rgb`, `#rrggbb`, `#rrggbbaa`
- OKLCH: `L% C H` or `L% C H / alpha`
- RGB/RGBA: `rgb(r, g, b)`, `rgba(r, g, b, a)`
- HSL/HSLA: `hsl(h, s%, l%)`, `hsla(h, s%, l%, a)`
- Lengths: Numbers with `px`, `rem`, `em`, `%`

### Blocked Patterns (Security)
- `url()` - Prevents external resource injection
- `expression()` - IE expression injection
- `javascript:` - Script injection
- `behavior:` - IE behavior injection
- `@import` - CSS import injection
- `data:` - Data URI injection in unsafe contexts

### Validation Behavior
- Invalid values are **silently ignored** in production
- In development, a console warning is shown
- The default value remains in effect

```typescript
// Example: Invalid value handling
applyThemeOverrides({
  colors: {
    primary: 'url(evil.com)',  // Blocked, uses default
    secondary: '#ff0000',       // Valid, applied
  },
});
// Console (dev only): Warning: Invalid value for 'primary': blocked pattern 'url('
```

---

## Complete Example: Brand Theme

```css
/* acme-corp-theme.css */

/*
 * ACME Corp Brand Theme
 * Primary: ACME Blue (#0066cc)
 * Secondary: ACME Gray
 */

:root,
[data-theme="light"] {
  /* ACME Blue primary */
  --clarity-primary: 50% 0.2 240;
  --clarity-primary-foreground: 100% 0 0;

  /* Subtle blue tints for surfaces */
  --clarity-secondary: 97% 0.02 240;
  --clarity-accent: 95% 0.03 240;

  /* Warmer background */
  --clarity-background: 99% 0.005 60;

  /* Slightly more rounded */
  --clarity-radius: 0.625rem;

  /* Stronger glass effect */
  --clarity-glass-opacity: 0.65;
  --clarity-glass-blur: 16px;
}

[data-theme="dark"] {
  /* Brighter blue for dark mode */
  --clarity-primary: 65% 0.18 240;

  /* Dark blue-tinted background */
  --clarity-background: 15% 0.03 240;
  --clarity-card: 18% 0.025 240;

  /* Softer glass in dark mode */
  --clarity-glass-opacity: 0.75;
}
```

```tsx
// App.tsx
import { ClarityChat } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
import './acme-corp-theme.css';

export function App() {
  return (
    <ClarityChat
      // Theme overrides can also be passed as props
      themeOverrides={{
        colors: { primary: '#0066cc' }
      }}
    />
  );
}
```

---

## Best Practices

1. **Test both modes** - Always check light and dark appearances
2. **Check contrast** - Ensure text is readable (4.5:1 minimum)
3. **Use OKLCH** - Better color interpolation than HSL
4. **Keep glass subtle** - Aggressive glass hurts readability
5. **Respect preferences** - Don't force glass on users who prefer solid
6. **Mobile first** - Test on real devices, reduce blur if needed

---

## Troubleshooting

### Overrides not applying
1. Check CSS load order (your file must come after clarity)
2. Check specificity (use `[data-theme="light"]` not just `:root`)
3. Verify value format is valid

### Glass not working
1. Check browser support (`@supports` will show fallback)
2. Check `prefers-reduced-transparency` isn't reducing
3. Ensure values are within safe bounds

### Colors look wrong
1. OKLCH values are `L% C H`, not `L C H%`
2. Lightness is 0-100%, not 0-1
3. Chroma is typically 0-0.4, not 0-100
