# Clarity Chat Theming Guide

A comprehensive guide to customizing Clarity Chat's appearance.

## Quick Start

### Zero Configuration

Clarity Chat works beautifully out of the box. Just import the styles:

```tsx
import '@clarity-chat/react/styles.css'
import { ClarityChat } from '@clarity-chat/react'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

### Theme Presets

Choose from 8 built-in themes:

```tsx
import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}
```

**Available Presets:**

| Preset               | Description                             |
| -------------------- | --------------------------------------- |
| `default`            | Clean, professional with indigo accents |
| `default-dark`       | Dark variant of default                 |
| `neutral`            | Minimal, monochrome (Linear-inspired)   |
| `neutral-dark`       | True dark mode                          |
| `vibrant`            | Bold purple with pink accents           |
| `vibrant-dark`       | Deep purple dark theme                  |
| `high-contrast`      | WCAG AAA compliant                      |
| `high-contrast-dark` | Accessible dark theme                   |

---

## Customization Methods

### 1. CSS Variables (Simplest)

Override CSS custom properties in your stylesheet:

```css
:root {
  /* Primary brand color */
  --clarity-primary: 239 84% 67%;
  --clarity-primary-foreground: 0 0% 100%;

  /* Border radius (affects all components) */
  --clarity-radius: 0.75rem;

  /* Custom background */
  --clarity-background: 0 0% 98%;
}
```

**Key Variables:**

| Variable               | Description                               |
| ---------------------- | ----------------------------------------- |
| `--clarity-primary`    | Primary brand color (HSL without `hsl()`) |
| `--clarity-background` | Page background                           |
| `--clarity-foreground` | Text color                                |
| `--clarity-card`       | Card/message background                   |
| `--clarity-border`     | Border color                              |
| `--clarity-radius`     | Base border radius                        |
| `--clarity-ring`       | Focus ring color                          |

### 2. Brand Color Shorthand

Generate a full palette from a single color:

```tsx
import { createTheme, ThemeProvider } from '@clarity-chat/react'

const theme = createTheme({
  brandColor: '#6366f1', // Your brand's primary color
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}
```

### 3. Custom Theme Object

Full control over all theme tokens:

```tsx
import { createTheme } from '@clarity-chat/react'

const theme = createTheme({
  // Extend an existing preset
  extends: 'neutral-dark',

  // Mode (light or dark)
  mode: 'dark',

  // Color overrides (hex or HSL supported)
  colors: {
    primary: '#10b981', // Hex format
    background: '0 0% 5%', // HSL format
    foreground: '0 0% 95%',
  },

  // Border radius preset
  radius: 'lg', // 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

  // Custom name
  name: 'my-custom-theme',
})
```

---

## Dark Mode

### Automatic System Detection

```tsx
<ThemeProvider defaultTheme={{ mode: 'system' }}>
  {/* Automatically follows OS preference */}
</ThemeProvider>
```

### Manual Toggle

```tsx
import { useTheme } from '@clarity-chat/react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme.mode === 'dark' ? 'light' : 'dark')}>
      {theme.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

---

## Accessibility

### High Contrast Theme

For users who need maximum contrast (WCAG AAA - 7:1 ratio):

```tsx
<ThemeProvider defaultTheme={{ preset: 'high-contrast' }}>
  <ClarityChat api="/api/chat" />
</ThemeProvider>
```

### Custom Accessible Colors

When creating custom themes, ensure proper contrast:

```tsx
import { createTheme, getContrastRatio, meetsContrastRequirement } from '@clarity-chat/react'

// Check if colors meet WCAG requirements
const foreground = '#000000'
const background = '#ffffff'

const ratio = getContrastRatio(foreground, background) // 21:1
const isAAA = meetsContrastRequirement(foreground, background, 'AAA') // true
```

---

## Design Tokens

Access design tokens directly for custom components:

```tsx
import {
  lightColors,
  darkColors,
  spacingTokens,
  radiusTokens,
  fontFamilyTokens,
  shadowTokens,
} from '@clarity-chat/react'

// Use in your components
const MyComponent = () => (
  <div
    style={{
      padding: spacingTokens[4], // 1rem
      borderRadius: radiusTokens.lg, // 0.5rem
      fontFamily: fontFamilyTokens.sans,
    }}
  >
    Content
  </div>
)
```

---

## CSS Architecture

### Namespace

All Clarity Chat CSS variables are prefixed with `--clarity-` to avoid conflicts:

```css
/* Clarity Chat variables */
--clarity-primary
--clarity-background
--clarity-radius

/* Won't conflict with other libraries */
--primary
--background
```

### Backwards Compatibility

Legacy variable names are mapped automatically:

```css
/* These are equivalent */
--primary: var(--clarity-primary);
--background: var(--clarity-background);
```

### CSS Layers

Styles are organized in CSS layers for proper cascade:

```css
@layer clarity-tokens {
  /* Design tokens */
}

@layer clarity-components {
  /* Component styles */
}

@layer clarity-utilities {
  /* Utility classes */
}
```

---

## Migration from v1

If upgrading from an older version:

1. **Variable names**: Old variables (`--primary`) continue to work
2. **Theme presets**: Old preset names are still supported
3. **New features**: `createTheme()` and modern presets are additions, not replacements

---

## Examples

### Corporate Branding

```tsx
const corporateTheme = createTheme({
  extends: 'default',
  colors: {
    primary: '#0066cc', // Company blue
    accent: '#ff6600', // Company orange
  },
  radius: 'sm', // Subtle rounded corners
})
```

### Playful App

```tsx
const playfulTheme = createTheme({
  extends: 'vibrant',
  colors: {
    primary: '#f472b6', // Pink
    accent: '#818cf8', // Purple
  },
  radius: 'xl', // Extra rounded
})
```

### Developer Tool

```tsx
const devTheme = createTheme({
  extends: 'neutral-dark',
  colors: {
    primary: '#22c55e', // Green (like terminal)
  },
  radius: 'sm', // Sharp corners
})
```
