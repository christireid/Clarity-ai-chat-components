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

### Theme Color Swatches

Visual preview of each theme's color palette:

#### Default Theme

```
┌─────────────────────────────────────────────────────────────────┐
│  default (Light)                                                │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #6366f1 (Indigo)                          │
│  Background ████████  #ffffff (White)                           │
│  Card       ████████  #f4f4f5 (Zinc-100)                        │
│  Border     ████████  #e4e4e7 (Zinc-200)                        │
│  Foreground ████████  #09090b (Zinc-950)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  default-dark                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #818cf8 (Indigo-400)                      │
│  Background ████████  #18181b (Zinc-900)                        │
│  Card       ████████  #27272a (Zinc-800)                        │
│  Border     ████████  #3f3f46 (Zinc-700)                        │
│  Foreground ████████  #fafafa (Zinc-50)                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Neutral Theme

```
┌─────────────────────────────────────────────────────────────────┐
│  neutral (Light)                                                │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #171717 (Neutral-900)                     │
│  Background ████████  #ffffff (White)                           │
│  Card       ████████  #f5f5f5 (Neutral-100)                     │
│  Border     ████████  #e5e5e5 (Neutral-200)                     │
│  Foreground ████████  #0a0a0a (Neutral-950)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  neutral-dark                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #f5f5f5 (Neutral-100)                     │
│  Background ████████  #0a0a0a (Neutral-950)                     │
│  Card       ████████  #171717 (Neutral-900)                     │
│  Border     ████████  #262626 (Neutral-800)                     │
│  Foreground ████████  #fafafa (Neutral-50)                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Vibrant Theme

```
┌─────────────────────────────────────────────────────────────────┐
│  vibrant (Light)                                                │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #a855f7 (Purple-500)                      │
│  Accent     ████████  #ec4899 (Pink-500)                        │
│  Background ████████  #ffffff (White)                           │
│  Card       ████████  #faf5ff (Purple-50)                       │
│  Foreground ████████  #3b0764 (Purple-950)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  vibrant-dark                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #c084fc (Purple-400)                      │
│  Accent     ████████  #f472b6 (Pink-400)                        │
│  Background ████████  #0f0a14 (Deep Purple)                     │
│  Card       ████████  #1a1225 (Dark Purple)                     │
│  Foreground ████████  #faf5ff (Purple-50)                       │
└─────────────────────────────────────────────────────────────────┘
```

#### High Contrast Theme

```
┌─────────────────────────────────────────────────────────────────┐
│  high-contrast (Light) - WCAG AAA ✓                             │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #1d4ed8 (Blue-700)                        │
│  Background ████████  #ffffff (White)                           │
│  Card       ████████  #f0f0f0 (Gray-100)                        │
│  Border     ████████  #000000 (Black)                           │
│  Foreground ████████  #000000 (Black)                           │
│  Contrast ratio: 21:1 ✓                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  high-contrast-dark - WCAG AAA ✓                                │
├─────────────────────────────────────────────────────────────────┤
│  Primary    ████████  #93c5fd (Blue-300)                        │
│  Background ████████  #000000 (Black)                           │
│  Card       ████████  #171717 (Neutral-900)                     │
│  Border     ████████  #ffffff (White)                           │
│  Foreground ████████  #ffffff (White)                           │
│  Contrast ratio: 21:1 ✓                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Template-Specific Themes

For common use cases, we provide semantic theme aliases:

| Theme              | Best For                    | Based On           |
| ------------------ | --------------------------- | ------------------ |
| `codeEditorTheme`  | Code editors, IDEs          | neutral-dark       |
| `supportChatTheme` | Customer support interfaces | default (light)    |
| `aiAssistantTheme` | General AI assistants       | default (light)    |
| `devToolsTheme`    | Developer tools, CLIs       | neutral-dark       |
| `enterpriseTheme`  | Corporate/business apps     | neutral (light)    |
| `creativeTheme`    | Marketing, creative apps    | vibrant (light)    |
| `accessibleTheme`  | Accessibility-first apps    | high-contrast      |
| `nightModeTheme`   | Low-light environments      | high-contrast-dark |

```tsx
import { codeEditorTheme, supportChatTheme } from '@clarity-chat/react'

// Use in templates
;<ThemeProvider defaultTheme={{ customTheme: codeEditorTheme }}>
  <CodeHelperTemplate />
</ThemeProvider>
```

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

const myTheme = createTheme({
  brandColor: '#6366f1', // Your brand's primary color
})

function App() {
  return (
    <ThemeProvider defaultTheme={{ customTheme: myTheme }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}
```

Alternatively, use `simpleConfig` for inline configuration:

```tsx
<ThemeProvider defaultTheme={{ simpleConfig: { brandColor: '#6366f1' } }}>
  <ClarityChat api="/api/chat" />
</ThemeProvider>
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
  lightShadows,
} from '@clarity-chat/react'

// Use in your components
const MyComponent = () => (
  <div
    style={{
      padding: spacingTokens[4], // 1rem
      borderRadius: radiusTokens.lg, // 0.5rem
      fontFamily: fontFamilyTokens.sans,
      boxShadow: lightShadows.md,
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

## Migrating from Legacy Presets

If you were using the legacy theme system (11 presets), follow this guide to migrate to the modern
8-preset system.

### Preset Mapping Table

| Legacy Preset   | Modern Equivalent | Notes                                         |
| --------------- | ----------------- | --------------------------------------------- |
| `clarity-light` | `default`         | Direct replacement                            |
| `clarity-dark`  | `default-dark`    | Direct replacement                            |
| `ocean`         | `default`         | Use `brandColor: '#0ea5e9'` for ocean blue    |
| `sunset`        | `vibrant`         | Use `brandColor: '#f97316'` for orange accent |
| `forest`        | `default`         | Use `brandColor: '#22c55e'` for green accent  |
| `midnight`      | `neutral-dark`    | Similar dark aesthetic                        |
| `corporate`     | `neutral`         | Professional, minimal style                   |
| `minimal`       | `neutral`         | Clean, understated design                     |
| `minimal-dark`  | `neutral-dark`    | Dark minimal variant                          |
| `playful`       | `vibrant`         | Bold, colorful style                          |
| `high-contrast` | `high-contrast`   | **Unchanged** - same name                     |

### Migration Examples

#### Before (Legacy)

```tsx
// OLD: Direct import from presets
import { oceanTheme } from '@clarity-chat/react/presets'

;<ThemeProvider defaultTheme={oceanTheme}>
  <ClarityChat api="/api/chat" />
</ThemeProvider>
```

#### After (Modern)

```tsx
// NEW: Use preset name or createTheme
import { ThemeProvider, createTheme } from '@clarity-chat/react'

// Option 1: Use closest modern preset
<ThemeProvider defaultTheme={{ preset: 'default' }}>
  <ClarityChat api="/api/chat" />
</ThemeProvider>

// Option 2: Recreate with brand color
const oceanTheme = createTheme({
  extends: 'default',
  brandColor: '#0ea5e9', // Ocean blue
  name: 'ocean',
})

<ThemeProvider defaultTheme={{ customTheme: oceanTheme }}>
  <ClarityChat api="/api/chat" />
</ThemeProvider>
```

#### String Preset Names

```tsx
// Before (Legacy)
<ThemeProvider defaultTheme="ocean">

// After (Modern)
<ThemeProvider defaultTheme={{ preset: 'default' }}>
// Or with brand color:
<ThemeProvider defaultTheme={{ simpleConfig: { brandColor: '#0ea5e9' } }}>
```

### Recreating Legacy Themes

If you need exact visual parity with legacy themes, use `createTheme`:

```tsx
import { createTheme } from '@clarity-chat/react'

// Ocean Theme
const oceanTheme = createTheme({
  extends: 'default',
  brandColor: '#0ea5e9',
  name: 'ocean',
})

// Sunset Theme
const sunsetTheme = createTheme({
  extends: 'vibrant',
  brandColor: '#f97316',
  colors: {
    accent: '#eab308',
  },
  name: 'sunset',
})

// Forest Theme
const forestTheme = createTheme({
  extends: 'default',
  brandColor: '#22c55e',
  name: 'forest',
})

// Midnight Theme
const midnightTheme = createTheme({
  extends: 'neutral-dark',
  colors: {
    background: '230 25% 8%',
    primary: '220 90% 60%',
  },
  name: 'midnight',
})

// Corporate Theme
const corporateTheme = createTheme({
  extends: 'neutral',
  radius: 'sm',
  name: 'corporate',
})

// Playful Theme
const playfulTheme = createTheme({
  extends: 'vibrant',
  brandColor: '#ec4899',
  radius: 'xl',
  name: 'playful',
})
```

### Breaking Changes

1. **Import paths changed**: `@clarity-chat/react/presets` no longer exists
2. **Direct theme objects**: Pass via `{ customTheme: theme }` not directly
3. **String presets**: Use `{ preset: 'name' }` format

### Development Warnings

In development mode, using a legacy preset name will log a helpful warning:

```
[Clarity Chat] Unknown theme preset "ocean". Available presets: default, default-dark, neutral, neutral-dark, vibrant, vibrant-dark, high-contrast, high-contrast-dark. Falling back to "default".
```

This warning only appears in development and helps identify code that needs updating.

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

---

## API Reference

### ThemeProvider

The root component that provides theme context to all Clarity Chat components.

```tsx
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Partial<ThemeConfig> | CompleteThemeConfig
  storageKey?: string // localStorage key for persistence (default: 'clarity-chat-theme')
}
```

**Props:**

| Prop           | Type                                          | Default                | Description                      |
| -------------- | --------------------------------------------- | ---------------------- | -------------------------------- |
| `children`     | `ReactNode`                                   | Required               | Child components                 |
| `defaultTheme` | `Partial<ThemeConfig> \| CompleteThemeConfig` | `{ mode: 'system' }`   | Initial theme configuration      |
| `storageKey`   | `string`                                      | `'clarity-chat-theme'` | localStorage key for persistence |

**Examples:**

```tsx
// Minimal usage
<ThemeProvider>
  <App />
</ThemeProvider>

// With preset
<ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
  <App />
</ThemeProvider>

// With custom theme (simplified API)
<ThemeProvider defaultTheme={myCustomTheme}>
  <App />
</ThemeProvider>

// With custom theme (explicit)
<ThemeProvider defaultTheme={{ customTheme: myCustomTheme }}>
  <App />
</ThemeProvider>
```

### useTheme Hook

Access and manipulate the current theme from any component.

```tsx
const {
  theme, // Current ThemeConfig
  setTheme, // Update theme partially
  mode, // Resolved mode ('light' | 'dark')
  toggleMode, // Toggle between light/dark
  resolvedTheme, // Complete resolved theme config
  setPreset, // Set a theme preset
  availablePresets, // List of available presets
} = useTheme()
```

**Example:**

```tsx
function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  return <button onClick={toggleMode}>{mode === 'dark' ? '☀️' : '🌙'}</button>
}
```

### createTheme

Create a custom theme with optional preset extension.

```tsx
function createTheme(config: SimpleThemeConfig): CompleteThemeConfig

interface SimpleThemeConfig {
  extends?: ThemePresetName // Base preset to extend
  mode?: 'light' | 'dark' // Theme mode
  name?: string // Theme name
  brandColor?: string // Primary brand color (hex)
  colors?: Partial<ColorConfig> // Color overrides
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' // Border radius
}
```

**Examples:**

```tsx
// Simple brand color customization
const myTheme = createTheme({
  brandColor: '#6366f1',
})

// Extend a preset with customizations
const myTheme = createTheme({
  extends: 'neutral-dark',
  brandColor: '#22c55e',
  radius: 'lg',
  name: 'my-custom-theme',
})

// Full color customization
const myTheme = createTheme({
  mode: 'dark',
  colors: {
    primary: '142 71% 45%', // HSL format
    background: '#0a0a0a', // Hex format
    foreground: '#fafafa',
  },
})
```

### Color Utilities

#### getContrastRatio

Calculate WCAG contrast ratio between two colors.

```tsx
function getContrastRatio(color1: string, color2: string): number

// Example
const ratio = getContrastRatio('#000000', '#ffffff') // Returns 21
```

#### meetsContrastRequirement

Check if colors meet WCAG contrast requirements.

```tsx
function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA'
): boolean

// Example
meetsContrastRequirement('#000', '#fff', 'AAA') // true
meetsContrastRequirement('#777', '#fff', 'AA') // false
```

#### hexToHSLString / hslStringToHex

Convert between hex and HSL color formats.

```tsx
hexToHSLString('#6366f1') // '239 84% 67%'
hslStringToHex('239 84% 67%') // '#6366f1'
```

### ThemeContrastChecker

Component for visual WCAG accessibility analysis.

```tsx
interface ThemeContrastCheckerProps {
  theme?: CompleteThemeConfig // Theme to analyze (uses current if not provided)
  showDetails?: boolean // Show detailed color pair info
  showOnlyFailing?: boolean // Only show failing contrasts
  className?: string // Additional CSS classes
}
```

**Example:**

```tsx
// Check current theme
<ThemeContrastChecker />

// Check a specific theme
<ThemeContrastChecker theme={myCustomTheme} showOnlyFailing />
```

---

## Architecture

### Theme System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's App                              │
├─────────────────────────────────────────────────────────────────┤
│  ThemeProvider                                                  │
│  ├── Receives: defaultTheme (preset, customTheme, or config)   │
│  ├── Resolves: mode (light/dark/system)                        │
│  ├── Applies: CSS variables to :root                           │
│  └── Persists: user preferences to localStorage                │
├─────────────────────────────────────────────────────────────────┤
│  Theme Context                                                  │
│  ├── theme: Current configuration                               │
│  ├── resolvedTheme: Complete theme object                       │
│  ├── mode: 'light' | 'dark'                                     │
│  └── setTheme, toggleMode, setPreset                           │
├─────────────────────────────────────────────────────────────────┤
│  CSS Custom Properties                                          │
│  ├── --clarity-primary, --clarity-background, etc.             │
│  ├── Applied to document.documentElement                        │
│  └── Consumed by all Clarity Chat components                   │
└─────────────────────────────────────────────────────────────────┘
```

### CSS Variable Naming

All CSS variables use the `--clarity-` prefix:

| Variable                       | Description                 |
| ------------------------------ | --------------------------- |
| `--clarity-background`         | Page background             |
| `--clarity-foreground`         | Default text color          |
| `--clarity-primary`            | Primary brand color         |
| `--clarity-primary-foreground` | Text on primary background  |
| `--clarity-secondary`          | Secondary/muted backgrounds |
| `--clarity-accent`             | Accent highlights           |
| `--clarity-destructive`        | Error/danger states         |
| `--clarity-muted`              | Subtle backgrounds          |
| `--clarity-card`               | Card backgrounds            |
| `--clarity-border`             | Border colors               |
| `--clarity-input`              | Input field borders         |
| `--clarity-ring`               | Focus ring color            |
| `--clarity-radius`             | Base border radius          |

### Design Token Layers

```css
@layer clarity-tokens {
  /* Core design tokens - colors, spacing, typography */
}

@layer clarity-components {
  /* Component-specific styles */
}

@layer clarity-utilities {
  /* Utility classes */
}
```

---

## Troubleshooting

### Theme not applying

1. Ensure `ThemeProvider` wraps your app
2. Check CSS import: `import '@clarity-chat/react/styles.css'`
3. Verify no conflicting CSS variables

### Colors look wrong

1. HSL values should NOT include `hsl()` wrapper
2. Correct: `--clarity-primary: 239 84% 67%`
3. Incorrect: `--clarity-primary: hsl(239 84% 67%)`

### Dark mode not working

1. Check mode is set: `defaultTheme={{ mode: 'dark' }}`
2. Or use system: `defaultTheme={{ mode: 'system' }}`
3. Verify `prefers-color-scheme` media query isn't overridden

### Theme transitions not smooth

1. Ensure `enableTransitions` is not `false`
2. Check for `prefers-reduced-motion` media query
3. Add `data-no-theme-transition` to elements that shouldn't animate

### localStorage not persisting

1. Check `storageKey` prop uniqueness
2. Verify localStorage is available (not in incognito/private mode)
3. Ensure no quota exceeded errors

---

## Best Practices

### 1. Start with a Preset

Don't build themes from scratch. Extend an existing preset:

```tsx
const myTheme = createTheme({
  extends: 'neutral',
  brandColor: '#your-color',
})
```

### 2. Test Accessibility

Always verify contrast ratios:

```tsx
import { ThemeContrastChecker } from '@clarity-chat/react'

// In development
;<ThemeContrastChecker showOnlyFailing />
```

### 3. Use Semantic Theme Names

Use template-specific themes for clarity:

```tsx
import { codeEditorTheme, supportChatTheme } from '@clarity-chat/react'
```

### 4. Respect User Preferences

Support system color scheme:

```tsx
<ThemeProvider defaultTheme={{ mode: 'system' }}>
```

### 5. Test Both Modes

Always test themes in light AND dark mode:

```tsx
<ThemeProvider defaultTheme={{ preset: 'default' }}>
<ThemeProvider defaultTheme={{ preset: 'default-dark' }}>
```
