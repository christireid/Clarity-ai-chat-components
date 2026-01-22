# Theme Hooks

Theme hooks provide access to theme configuration, colors, design tokens, keyboard shortcuts, and analytics for building themed chat interfaces.

## Overview

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useThemeColors` | Access theme colors | HSL + hex values, isDark detection |
| `useDesignTokens` | Design system tokens | Shadows, radius, rings, animation |
| `useThemeShortcuts` | Keyboard shortcuts | Platform-aware theme switching |
| `useThemeAnalytics` | Theme usage tracking | Events, summaries, most-used themes |

---

## useThemeColors

**Access theme colors in both HSL and hex formats with theme mode detection.**

### Signature

```typescript
function useThemeColors(): UseThemeColorsReturn

interface UseThemeColorsReturn {
  // Color values (HSL strings without "hsl()")
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  card: string
  cardForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  destructiveForeground: string
  popover: string
  popoverForeground: string

  // Theme state
  isDark: boolean
  isLight: boolean
  mode: 'light' | 'dark'
  themeName: string

  // Hex color values
  hex: {
    primary: string
    // ... all colors as hex
  }

  // Utilities
  getCSSVar: (colorName: keyof ThemeColorValues) => string
  getHSL: (colorName: keyof ThemeColorValues) => string
}
```

### Examples

#### Basic Usage

```tsx
import { useThemeColors } from '@clarity-chat/react/hooks/theme'

function ThemedComponent() {
  const { primary, background, isDark } = useThemeColors()

  return (
    <div style={{
      backgroundColor: `hsl(${background})`,
      color: `hsl(${primary})`
    }}>
      Current mode: {isDark ? 'Dark' : 'Light'}
    </div>
  )
}
```

#### Using Hex Colors

```tsx
function HexColorUsage() {
  const { hex } = useThemeColors()

  return (
    <div style={{
      backgroundColor: hex.primary,
      color: hex.primaryForeground
    }}>
      Using hex colors for compatibility
    </div>
  )
}
```

#### CSS Variables

```tsx
function CSSVariableExample() {
  const { getCSSVar } = useThemeColors()

  return (
    <div style={{
      backgroundColor: getCSSVar('background'),
      color: getCSSVar('foreground'),
      borderColor: getCSSVar('border')
    }}>
      Using CSS variable references
    </div>
  )
}
```

#### Theme-Adaptive Components

```tsx
function AdaptiveCard() {
  const { card, cardForeground, border, ring, isDark, getHSL } = useThemeColors()

  return (
    <div
      style={{
        backgroundColor: getHSL('card'),
        color: getHSL('cardForeground'),
        border: `1px solid hsl(${border})`,
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.5)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      className="rounded-lg p-4"
    >
      <h3>Adaptive Card</h3>
      <p>This card adapts to the current theme</p>
    </div>
  )
}
```

#### Color Palette Display

```tsx
function ColorPalette() {
  const colors = useThemeColors()

  const colorKeys: Array<keyof ThemeColorValues> = [
    'primary',
    'secondary',
    'background',
    'foreground',
    'accent',
    'destructive',
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {colorKeys.map((colorName) => (
        <div key={colorName} className="flex flex-col">
          <div
            style={{
              backgroundColor: `hsl(${colors[colorName]})`,
              height: '60px',
              borderRadius: '8px',
              border: '1px solid hsl(var(--clarity-border))',
            }}
          />
          <span className="mt-2 text-sm">
            {colorName}
          </span>
          <span className="text-xs text-muted-foreground">
            {colors.hex[colorName]}
          </span>
        </div>
      ))}
    </div>
  )
}
```

#### Dynamic Styling Based on Theme

```tsx
function DynamicThemedButton() {
  const { primary, primaryForeground, isDark } = useThemeColors()

  const buttonStyle = {
    backgroundColor: `hsl(${primary})`,
    color: `hsl(${primaryForeground})`,
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: isDark
      ? '0 4px 12px rgba(0, 0, 0, 0.6)'
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s',
  }

  return (
    <button
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 6px 16px rgba(0, 0, 0, 0.7)'
          : '0 6px 16px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 12px rgba(0, 0, 0, 0.6)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      Themed Button
    </button>
  )
}
```

### Color Values

All colors are provided as HSL strings in the format `"h s% l%"` (without the `hsl()` wrapper):

```typescript
// Example values
primary: "222.2 47.4% 11.2%"        // Dark blue-gray
background: "0 0% 100%"              // White
destructive: "0 84.2% 60.2%"        // Red
```

To use in CSS:

```tsx
style={{ color: `hsl(${primary})` }}
```

### When to Use

- **Use for:** Theme-aware styling, dynamic colors, theme detection
- **Best when:** Building custom components that need theme integration
- **Alternatives:** CSS variables directly if you don't need JS access

---

## useDesignTokens

**Access design system tokens for consistent spacing, shadows, borders, and animations.**

### Signature

```typescript
function useDesignTokens(): DesignTokens

interface DesignTokens {
  shadows: {
    xs: string        // 'shadow-xs'
    sm: string        // 'shadow-sm'
    md: string        // 'shadow-md'
    lg: string        // 'shadow-lg'
    xl: string        // 'shadow-xl'
    '2xl': string     // 'shadow-2xl'
  }
  radius: {
    sm: string        // 'rounded-sm'
    md: string        // 'rounded-md'
    lg: string        // 'rounded-lg'
    xl: string        // 'rounded-xl'
    full: string      // 'rounded-full'
  }
  rings: {
    default: string   // 'ring-1 ring-border/50'
    focus: string     // 'ring-[3px] ring-ring/50 ring-offset-1'
    selected: string  // 'ring-2 ring-primary/50'
  }
  opacity: {
    subtle: string    // '/10'
    medium: string    // '/30'
    strong: string    // '/50'
  }
  duration: {
    instant: string   // 'duration-150'
    fast: string      // 'duration-200'
    normal: string    // 'duration-300'
    slow: string      // 'duration-500'
  }
}

// Helper hooks
function useInteractiveClasses(options?: {
  hover?: boolean
  focus?: boolean
  disabled?: boolean
}): string

function useCardClasses(options?: {
  interactive?: boolean
  selected?: boolean
}): string
```

### Examples

#### Basic Token Usage

```tsx
import { useDesignTokens } from '@clarity-chat/react/hooks/theme'

function TokenExample() {
  const tokens = useDesignTokens()

  return (
    <div className={`${tokens.radius.lg} ${tokens.shadows.md} p-4 bg-card`}>
      <h3>Consistent Design</h3>
      <p>Using design tokens for consistency</p>
    </div>
  )
}
```

#### Interactive Components

```tsx
function InteractiveCard() {
  const tokens = useDesignTokens()

  return (
    <div
      className={`
        ${tokens.radius.lg}
        ${tokens.shadows.sm}
        ${tokens.rings.default}
        p-6 bg-card
        transition-all ${tokens.duration.fast}
        hover:${tokens.shadows.md}
        hover:-translate-y-0.5
        focus-visible:${tokens.rings.focus}
        cursor-pointer
      `}
    >
      Hover and focus me
    </div>
  )
}
```

#### Using Helper Hooks

```tsx
function InteractiveButton() {
  const interactiveClasses = useInteractiveClasses({
    hover: true,
    focus: true,
    disabled: false,
  })

  return (
    <button className={`px-4 py-2 bg-primary text-primary-foreground rounded-md ${interactiveClasses}`}>
      Click me
    </button>
  )
}
```

#### Card with Selection State

```tsx
function SelectableCard({ selected }: { selected: boolean }) {
  const cardClasses = useCardClasses({
    interactive: true,
    selected,
  })

  return (
    <div className={`p-4 ${cardClasses}`}>
      {selected ? '✓ Selected' : 'Click to select'}
    </div>
  )
}
```

#### Shadow Scale

```tsx
function ShadowScale() {
  const tokens = useDesignTokens()

  return (
    <div className="flex gap-4">
      <div className={`${tokens.shadows.xs} p-4 bg-card rounded`}>XS</div>
      <div className={`${tokens.shadows.sm} p-4 bg-card rounded`}>SM</div>
      <div className={`${tokens.shadows.md} p-4 bg-card rounded`}>MD</div>
      <div className={`${tokens.shadows.lg} p-4 bg-card rounded`}>LG</div>
      <div className={`${tokens.shadows.xl} p-4 bg-card rounded`}>XL</div>
      <div className={`${tokens.shadows['2xl']} p-4 bg-card rounded`}>2XL</div>
    </div>
  )
}
```

#### Opacity Variants

```tsx
function OpacityExample() {
  const tokens = useDesignTokens()

  return (
    <div className="flex gap-4">
      <div className={`bg-primary${tokens.opacity.subtle} p-4 rounded`}>
        10% opacity
      </div>
      <div className={`bg-primary${tokens.opacity.medium} p-4 rounded`}>
        30% opacity
      </div>
      <div className={`bg-primary${tokens.opacity.strong} p-4 rounded`}>
        50% opacity
      </div>
    </div>
  )
}
```

#### Animation Durations

```tsx
function AnimatedElements() {
  const tokens = useDesignTokens()

  return (
    <div className="flex flex-col gap-4">
      <button className={`bg-primary text-white px-4 py-2 rounded transition-colors ${tokens.duration.instant} hover:bg-primary/90`}>
        Instant (150ms)
      </button>
      <button className={`bg-primary text-white px-4 py-2 rounded transition-colors ${tokens.duration.fast} hover:bg-primary/90`}>
        Fast (200ms)
      </button>
      <button className={`bg-primary text-white px-4 py-2 rounded transition-colors ${tokens.duration.normal} hover:bg-primary/90`}>
        Normal (300ms)
      </button>
      <button className={`bg-primary text-white px-4 py-2 rounded transition-colors ${tokens.duration.slow} hover:bg-primary/90`}>
        Slow (500ms)
      </button>
    </div>
  )
}
```

#### Complete Design System Component

```tsx
function DesignSystemCard({ disabled = false }) {
  const tokens = useDesignTokens()
  const interactiveClasses = useInteractiveClasses({
    hover: true,
    focus: true,
    disabled,
  })

  return (
    <div
      className={`
        ${tokens.radius.lg}
        ${tokens.shadows.md}
        ${tokens.rings.default}
        ${interactiveClasses}
        p-6
        bg-card text-card-foreground
      `}
    >
      <h3 className="text-lg font-semibold mb-2">Design System Card</h3>
      <p className="text-muted-foreground">
        This card uses all design tokens for consistency
      </p>
    </div>
  )
}
```

### useInteractiveClasses

Returns Tailwind classes for interactive elements:

```tsx
// Default (all enabled)
const classes = useInteractiveClasses()
// "transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px] cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"

// Disabled state
const disabled = useInteractiveClasses({ disabled: true })
// "transition-all duration-200 opacity-50 cursor-not-allowed pointer-events-none"

// Only hover
const hoverOnly = useInteractiveClasses({ hover: true, focus: false })
// "transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px] cursor-pointer"
```

### useCardClasses

Returns Tailwind classes for card elements:

```tsx
// Basic card
const basic = useCardClasses()
// "rounded-lg bg-card text-card-foreground ring-1 ring-border/30 shadow-xs"

// Interactive card
const interactive = useCardClasses({ interactive: true })
// Adds hover and focus states

// Selected card
const selected = useCardClasses({ selected: true })
// "... ring-2 ring-primary/50 shadow-sm"
```

### When to Use

- **Use for:** Consistent design system, Tailwind-based styling
- **Best when:** Building custom components that follow design system
- **Alternatives:** Direct Tailwind classes if you don't need dynamic tokens

---

## useThemeShortcuts

**Enable keyboard shortcuts for theme switching with platform-aware key combinations.**

### Signature

```typescript
function useThemeShortcuts(options?: UseThemeShortcutsOptions): {
  currentMode: 'light' | 'dark' | 'system'
  themeConfig: ThemeConfig
  shortcuts: {
    toggle: string
    cycle: string
    light: string
    dark: string
    system: string
  }
}

interface UseThemeShortcutsOptions {
  enableToggle?: boolean           // Default: true
  enableCycle?: boolean            // Default: true
  enableDirectMode?: boolean       // Default: true
  toggleKey?: string               // Default: 'l'
  cycleKey?: string               // Default: 't'
  lightKey?: string               // Default: '1'
  darkKey?: string                // Default: '2'
  systemKey?: string              // Default: '3'
  requireMeta?: boolean           // Default: true (Ctrl/Cmd)
  requireShift?: boolean          // Default: true
  onShortcut?: (
    action: 'toggle' | 'cycle' | 'direct',
    newMode: 'light' | 'dark' | 'system'
  ) => void
}
```

### Default Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + Shift + L` | Toggle | Switch between light and dark |
| `Ctrl/Cmd + Shift + T` | Cycle | Cycle through all modes |
| `Ctrl/Cmd + Shift + 1` | Direct | Set light mode |
| `Ctrl/Cmd + Shift + 2` | Direct | Set dark mode |
| `Ctrl/Cmd + Shift + 3` | Direct | Set system mode |

### Examples

#### Basic Usage

```tsx
import { useThemeShortcuts } from '@clarity-chat/react/hooks/theme'

function App() {
  // Enable default shortcuts
  useThemeShortcuts()

  return <YourApp />
}
```

#### Custom Shortcuts

```tsx
function CustomShortcuts() {
  useThemeShortcuts({
    toggleKey: 'k',              // Ctrl+K
    requireMeta: true,
    requireShift: false,
  })

  return <YourApp />
}
```

#### Display Shortcuts to User

```tsx
function ShortcutHelp() {
  const { shortcuts } = useThemeShortcuts()

  return (
    <div className="p-4 bg-card rounded-lg">
      <h3 className="font-semibold mb-2">Theme Shortcuts</h3>
      <ul className="space-y-1 text-sm">
        <li><kbd>{shortcuts.toggle}</kbd> - Toggle light/dark</li>
        <li><kbd>{shortcuts.cycle}</kbd> - Cycle all modes</li>
        <li><kbd>{shortcuts.light}</kbd> - Light mode</li>
        <li><kbd>{shortcuts.dark}</kbd> - Dark mode</li>
        <li><kbd>{shortcuts.system}</kbd> - System mode</li>
      </ul>
    </div>
  )
}
```

#### Track Shortcut Usage

```tsx
function TrackedShortcuts() {
  const [lastAction, setLastAction] = useState<string | null>(null)

  useThemeShortcuts({
    onShortcut: (action, newMode) => {
      setLastAction(`${action}: ${newMode}`)
      console.log(`Theme changed via ${action} to ${newMode}`)
    },
  })

  return (
    <div>
      {lastAction && (
        <div className="text-sm text-muted-foreground">
          Last shortcut: {lastAction}
        </div>
      )}
    </div>
  )
}
```

#### Conditional Shortcuts

```tsx
function ConditionalShortcuts({ enableShortcuts }: { enableShortcuts: boolean }) {
  useThemeShortcuts({
    enableToggle: enableShortcuts,
    enableCycle: enableShortcuts,
    enableDirectMode: enableShortcuts,
  })

  return <YourApp />
}
```

#### Simple Toggle Shortcut

```tsx
function SimpleToggle() {
  // Only enable toggle (Ctrl+Shift+L)
  useThemeShortcuts({
    enableToggle: true,
    enableCycle: false,
    enableDirectMode: false,
  })

  return <YourApp />
}
```

#### Platform-Specific Shortcuts

```tsx
function PlatformShortcuts() {
  const isMac = navigator.platform.toUpperCase().includes('MAC')

  const { shortcuts } = useThemeShortcuts()

  return (
    <div className="text-sm">
      <p>Press <kbd>{shortcuts.toggle}</kbd> to toggle theme</p>
      <p className="text-xs text-muted-foreground mt-1">
        {isMac ? 'Use Cmd key' : 'Use Ctrl key'}
      </p>
    </div>
  )
}
```

### Shortcut Actions

**Toggle**: Switches between light and dark mode only (ignores system mode)
```typescript
light → dark → light → dark
```

**Cycle**: Cycles through all three modes
```typescript
light → dark → system → light
```

**Direct**: Sets specific mode immediately
```typescript
Ctrl+Shift+1 → light (always)
Ctrl+Shift+2 → dark (always)
Ctrl+Shift+3 → system (always)
```

### When to Use

- **Use for:** Improving UX with keyboard shortcuts
- **Best when:** Power users, accessibility features
- **Alternatives:** Manual theme toggle buttons if shortcuts aren't needed

---

## useThemeAnalytics

**Track theme usage patterns, mode changes, and user preferences.**

### Signature

```typescript
function useThemeAnalytics(options?: UseThemeAnalyticsOptions): UseThemeAnalyticsReturn

interface UseThemeAnalyticsOptions {
  onEvent?: (event: ThemeAnalyticsEvent) => void
  debug?: boolean                     // Console logging (dev only)
  trackModeChanges?: boolean         // Default: true
  trackPresetChanges?: boolean       // Default: true
  trackCustomThemes?: boolean        // Default: true
  trackErrors?: boolean              // Default: true
}

interface UseThemeAnalyticsReturn {
  trackModeChange: (
    previousMode: ThemeMode | null,
    newMode: ThemeMode,
    source?: 'user' | 'system' | 'cross-tab'
  ) => void
  trackPresetChange: (
    previousPreset: string | null,
    newPreset: string,
    source?: 'user' | 'system' | 'cross-tab'
  ) => void
  trackCustomTheme: (themeName: string) => void
  trackError: (errorMessage: string) => void
  events: ThemeAnalyticsEvent[]
  clearEvents: () => void
  getSummary: () => ThemeAnalyticsSummary
}

interface ThemeAnalyticsSummary {
  totalEvents: number
  modeChanges: number
  presetChanges: number
  customThemeApplications: number
  errors: number
  mostUsedMode: ThemeMode | null
  mostUsedPreset: string | null
  sessionDuration: number
}
```

### Examples

#### Basic Analytics Tracking

```tsx
import { useThemeAnalytics } from '@clarity-chat/react/hooks/theme'

function App() {
  const analytics = useThemeAnalytics({
    onEvent: (event) => {
      // Send to your analytics service
      sendToAnalytics('theme_event', {
        type: event.type,
        ...event.data,
      })
    },
    debug: process.env.NODE_ENV === 'development',
  })

  return <YourApp analytics={analytics} />
}
```

#### Track Mode Changes

```tsx
function ThemeToggle() {
  const { theme, setTheme, mode } = useTheme()
  const analytics = useThemeAnalytics()

  const handleToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setTheme({ mode: newMode })
    analytics.trackModeChange(mode, newMode, 'user')
  }

  return (
    <button onClick={handleToggle}>
      Toggle Theme
    </button>
  )
}
```

#### Track Preset Changes

```tsx
function PresetSelector() {
  const [currentPreset, setCurrentPreset] = useState('default')
  const analytics = useThemeAnalytics()

  const handlePresetChange = (preset: string) => {
    analytics.trackPresetChange(currentPreset, preset, 'user')
    setCurrentPreset(preset)
    applyPreset(preset)
  }

  return (
    <select onChange={(e) => handlePresetChange(e.target.value)}>
      <option value="default">Default</option>
      <option value="ocean">Ocean</option>
      <option value="sunset">Sunset</option>
    </select>
  )
}
```

#### Display Analytics Summary

```tsx
function AnalyticsDashboard() {
  const analytics = useThemeAnalytics()
  const summary = analytics.getSummary()

  return (
    <div className="p-4 bg-card rounded-lg">
      <h3 className="font-semibold mb-4">Theme Analytics</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Events:</span>
          <span className="font-mono">{summary.totalEvents}</span>
        </div>
        <div className="flex justify-between">
          <span>Mode Changes:</span>
          <span className="font-mono">{summary.modeChanges}</span>
        </div>
        <div className="flex justify-between">
          <span>Most Used Mode:</span>
          <span className="font-mono">{summary.mostUsedMode || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Session Duration:</span>
          <span className="font-mono">
            {Math.floor(summary.sessionDuration / 1000)}s
          </span>
        </div>
      </div>
    </div>
  )
}
```

#### Export Analytics Data

```tsx
function ExportAnalytics() {
  const analytics = useThemeAnalytics()

  const exportData = () => {
    const summary = analytics.getSummary()
    const events = analytics.events

    const data = {
      summary,
      events,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-analytics-${Date.now()}.json`
    a.click()
  }

  return (
    <button onClick={exportData}>
      Export Analytics
    </button>
  )
}
```

#### Track Cross-Tab Synchronization

```tsx
function CrossTabTracking() {
  const analytics = useThemeAnalytics()
  const { mode } = useTheme()
  const previousMode = useRef<ThemeMode | null>(null)

  useEffect(() => {
    // Listen for storage events (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme-mode' && e.newValue) {
        const newMode = e.newValue as ThemeMode
        analytics.trackModeChange(previousMode.current, newMode, 'cross-tab')
        previousMode.current = newMode
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [analytics])

  return null
}
```

#### Track Theme Errors

```tsx
function ThemeErrorBoundary({ children }: { children: React.ReactNode }) {
  const analytics = useThemeAnalytics()

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('theme')) {
        analytics.trackError(event.message)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [analytics])

  return <>{children}</>
}
```

#### Real-time Analytics Display

```tsx
function RealtimeAnalytics() {
  const analytics = useThemeAnalytics()
  const [recentEvents, setRecentEvents] = useState<ThemeAnalyticsEvent[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      // Get last 5 events
      setRecentEvents(analytics.events.slice(-5))
    }, 1000)

    return () => clearInterval(interval)
  }, [analytics])

  return (
    <div className="p-4 bg-card rounded-lg">
      <h4 className="font-semibold mb-2">Recent Events</h4>
      <div className="space-y-1 text-xs font-mono">
        {recentEvents.map((event, i) => (
          <div key={i} className="flex justify-between">
            <span>{event.type}</span>
            <span className="text-muted-foreground">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Event Types

```typescript
type ThemeAnalyticsEventType =
  | 'theme_change'              // General theme change
  | 'mode_toggle'              // Light/dark toggle
  | 'preset_change'            // Preset/theme selection
  | 'custom_theme_applied'     // Custom theme applied
  | 'theme_error'              // Theme-related error
```

### Event Sources

```typescript
type EventSource =
  | 'user'        // User interaction (click, shortcut)
  | 'system'      // System preference change
  | 'cross-tab'   // Synchronized from another tab
```

### When to Use

- **Use for:** Understanding user preferences, A/B testing themes
- **Best when:** Analytics-driven design, user research
- **Alternatives:** Skip if you don't need usage tracking

---

## Common Patterns

### Complete Themed Component

```tsx
function CompleteThemedCard() {
  const colors = useThemeColors()
  const tokens = useDesignTokens()

  return (
    <div
      className={`
        ${tokens.radius.lg}
        ${tokens.shadows.md}
        ${tokens.rings.default}
        p-6
        transition-all ${tokens.duration.normal}
        hover:${tokens.shadows.lg}
      `}
      style={{
        backgroundColor: `hsl(${colors.card})`,
        color: `hsl(${colors.cardForeground})`,
      }}
    >
      <h3 className="text-lg font-semibold mb-2">Themed Card</h3>
      <p className="text-sm" style={{ color: `hsl(${colors.mutedForeground})` }}>
        This card combines colors and design tokens
      </p>
    </div>
  )
}
```

### Theme Switcher with Analytics

```tsx
function ThemeSwitcher() {
  const { mode, setTheme } = useTheme()
  const colors = useThemeColors()
  const analytics = useThemeAnalytics()

  const handleToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setTheme({ mode: newMode })
    analytics.trackModeChange(mode, newMode, 'user')
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-colors"
      style={{
        backgroundColor: `hsl(${colors.muted})`,
        color: `hsl(${colors.mutedForeground})`,
      }}
    >
      {colors.isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

### Theme-Aware App Shell

```tsx
function AppShell() {
  const colors = useThemeColors()
  const tokens = useDesignTokens()
  useThemeShortcuts()
  useThemeAnalytics()

  return (
    <div
      className={`min-h-screen transition-colors ${tokens.duration.normal}`}
      style={{
        backgroundColor: `hsl(${colors.background})`,
        color: `hsl(${colors.foreground})`,
      }}
    >
      <header
        className={`${tokens.shadows.sm} p-4`}
        style={{
          backgroundColor: `hsl(${colors.card})`,
          borderBottom: `1px solid hsl(${colors.border})`,
        }}
      >
        <ThemeSwitcher />
      </header>
      <main className="container mx-auto py-8">
        <YourContent />
      </main>
    </div>
  )
}
```

---

## Troubleshooting

### Colors Not Updating

**Problem:** Colors don't change when theme switches.

**Solution:** Ensure component is inside `ThemeProvider`:

```tsx
import { ThemeProvider } from '@clarity-chat/react/theme'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

### CSS Variables Not Working

**Problem:** `getCSSVar()` returns incorrect values.

**Solution:** Ensure CSS variables are defined in your global CSS:

```css
:root {
  --clarity-primary: 222.2 47.4% 11.2%;
  --clarity-background: 0 0% 100%;
  /* ... other variables */
}
```

### Shortcuts Not Working

**Problem:** Keyboard shortcuts don't trigger.

**Solutions:**

1. Check if input/textarea has focus (shortcuts may be blocked)
2. Verify `requireMeta` and `requireShift` settings
3. Check for conflicting shortcuts in your app

```tsx
// Debug shortcuts
useThemeShortcuts({
  onShortcut: (action, mode) => {
    console.log('Shortcut triggered:', action, mode)
  },
})
```

### Analytics Events Not Firing

**Problem:** `onEvent` callback not called.

**Solutions:**

1. Ensure tracking options are enabled
2. Check that you're calling track methods
3. Verify callback is defined

```tsx
const analytics = useThemeAnalytics({
  trackModeChanges: true,  // Ensure enabled
  onEvent: (event) => {
    console.log('Event:', event)  // Debug output
  },
  debug: true,  // Enable debug mode
})
```

---

## Related Hooks

- **[UI Hooks](/docs/api/hooks/ui.md)**: UI state management hooks
- **[Keyboard Hooks](/docs/api/hooks/keyboard.md)**: Keyboard interaction hooks

---

## Best Practices

### 1. Use Design Tokens for Consistency

Always prefer design tokens over hardcoded values:

```tsx
// Good
const tokens = useDesignTokens()
<div className={`${tokens.radius.lg} ${tokens.shadows.md}`} />

// Avoid
<div className="rounded-lg shadow-md" />
```

### 2. Combine Colors and Tokens

Use both hooks together for complete theming:

```tsx
const colors = useThemeColors()
const tokens = useDesignTokens()

return (
  <div
    className={`${tokens.radius.lg} ${tokens.shadows.md} p-4`}
    style={{
      backgroundColor: `hsl(${colors.card})`,
      color: `hsl(${colors.cardForeground})`,
    }}
  />
)
```

### 3. Enable Shortcuts in Root Component

Enable shortcuts once at the app root:

```tsx
function App() {
  useThemeShortcuts()  // Enable once
  return <YourApp />
}
```

### 4. Track All Theme Changes

Comprehensive analytics tracking:

```tsx
const analytics = useThemeAnalytics({
  trackModeChanges: true,
  trackPresetChanges: true,
  trackCustomThemes: true,
  trackErrors: true,
})
```

### 5. Use CSS Variables for Performance

Prefer CSS variables when possible:

```tsx
// Good (CSS updates automatically)
<div className="bg-card text-foreground" />

// Use colors hook only when needed in JS
const { primary } = useThemeColors()
const adjustedColor = adjustBrightness(primary, 0.1)
```
