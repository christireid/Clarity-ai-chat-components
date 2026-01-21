'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function ThemeProviderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Top-Level Provider</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">ThemeProvider</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Context provider that delivers theme capabilities to all Clarity Chat components.
          Supports light/dark mode, system preference detection, 30 built-in presets,
          cross-tab synchronization, and smooth animated transitions.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Theming & Appearance
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system', preset: 'default' }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            30 Theme Presets
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Cross-Tab Sync
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            System Preference
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            Animated Transitions
          </span>
        </div>
      </section>

      {/* Why ThemeProvider */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why ThemeProvider?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">
              What It Solves
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Inconsistent theme state across components
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Flash of wrong theme on page load
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Theme preference not persisting across sessions
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Multiple tabs showing different themes
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              Key Benefits
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                30 professionally designed theme presets
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Cross-tab synchronization via BroadcastChannel
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Respects prefers-reduced-motion
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                CSS variable injection for full customization
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Basic Usage</h2>

        <CollapsibleSection title="System Preference Detection" defaultOpen={true}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    // Automatically follows system light/dark preference
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Using Theme Presets" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    // Use one of 30 built-in presets
    <ThemeProvider
      defaultTheme={{
        mode: 'dark',
        preset: 'glassmorphism-dark'  // Modern glass effects
      }}
    >
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}

// Available presets (15 themes × light/dark variants = 30):
// Core: default, neutral, vibrant, high-contrast
// 2025 Trending: glassmorphism, aurora, neumorphism
// Nature: ocean, sunset, forest, rose
// Professional: midnight, slate, emerald, amber`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Cross-Tab Synchronization" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider
      defaultTheme={{ mode: 'system' }}
      enableCrossTabSync={true}        // Default: true
      crossTabSyncDebounce={100}        // Debounce rapid changes
      storageKey="my-app-theme"         // Custom localStorage key
    >
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}

// Theme changes in one tab automatically sync to all other tabs
// Uses BroadcastChannel API (Chrome 54+, Firefox 38+, Safari 15.4+)
// Gracefully falls back to localStorage-only in older browsers`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* Advanced Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Advanced Examples</h2>

        <CollapsibleSection title="Theme Toggle with useTheme Hook" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Access and control theme from any component using the useTheme hook.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider, useTheme } from '@clarity-chat/react'

function ThemeControls() {
  const {
    theme,            // Current ThemeConfig
    mode,             // Resolved mode: 'light' | 'dark'
    toggleMode,       // Toggle between light/dark
    setTheme,         // Update theme config
    setPreset,        // Change preset
    availablePresets  // List of all 30 presets
  } = useTheme()

  return (
    <div className="flex gap-4">
      {/* Simple toggle */}
      <button onClick={toggleMode}>
        {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Mode selector */}
      <select
        value={theme.mode}
        onChange={(e) => setTheme({ mode: e.target.value })}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      {/* Preset picker */}
      <select
        value={theme.preset || 'default'}
        onChange={(e) => setPreset(e.target.value)}
      >
        {availablePresets.map(preset => (
          <option key={preset} value={preset}>{preset}</option>
        ))}
      </select>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      <ThemeControls />
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Built-in Theme Components" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use the included ThemeToggle and ThemeModeSelector components.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import {
  ThemeProvider,
  ThemeToggle,
  ThemeModeSelector
} from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      {/* Simple toggle button with animated icon */}
      <ThemeToggle
        size="md"           // 'sm' | 'md' | 'lg'
        variant="ghost"     // 'default' | 'outline' | 'ghost'
        showLabel={false}   // Show "Light" / "Dark" text
      />

      {/* Three-way selector (light/dark/system) */}
      <ThemeModeSelector
        variant="inline"    // 'buttons' | 'inline' | 'dropdown'
        size="md"
      />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Custom Theme Configuration" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Create fully custom themes with your own color palette.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider, createTheme } from '@clarity-chat/react'

// Create a custom theme using the simple API
const myCustomTheme = createTheme({
  // Brand colors
  primary: '#6366f1',     // Indigo-500
  secondary: '#ec4899',   // Pink-500

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  // Base palette
  background: '#ffffff',
  foreground: '#171717',

  // Border radius scale
  radius: 8,              // Base radius in pixels

  // Typography
  fontFamily: 'Inter, system-ui, sans-serif',
})

function App() {
  return (
    <ThemeProvider defaultTheme={myCustomTheme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Animation Speed Control" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Control theme transition animations for different user experiences.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ThemeProvider } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider
      defaultTheme={{ mode: 'system' }}
      animationSpeed="normal"  // 'none' | 'fast' | 'normal' | 'slow'
      // none: 0ms (instant switch)
      // fast: 100ms
      // normal: 200ms (default)
      // slow: 400ms
    >
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}

// Note: Animation is automatically disabled if user has
// prefers-reduced-motion enabled in their OS settings`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        {/* Props */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">ThemeProvider Props</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Prop</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Default</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">defaultTheme</td>
                  <td className="p-3 font-mono text-sm">ThemeConfig</td>
                  <td className="p-3 text-muted-foreground">{`{ mode: 'system' }`}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Initial theme configuration
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">storageKey</td>
                  <td className="p-3 font-mono text-sm">string</td>
                  <td className="p-3 text-muted-foreground">&apos;clarity-chat-theme&apos;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    localStorage key for persistence
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">enableCrossTabSync</td>
                  <td className="p-3 font-mono text-sm">boolean</td>
                  <td className="p-3 text-muted-foreground">true</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Sync theme across browser tabs via BroadcastChannel
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">crossTabSyncDebounce</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-muted-foreground">100</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Debounce delay for cross-tab messages (ms)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">animationSpeed</td>
                  <td className="p-3 font-mono text-sm">&apos;none&apos; | &apos;fast&apos; | &apos;normal&apos; | &apos;slow&apos;</td>
                  <td className="p-3 text-muted-foreground">&apos;normal&apos;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Speed of theme transition animations
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">children</td>
                  <td className="p-3 font-mono text-sm">React.ReactNode</td>
                  <td className="p-3 text-muted-foreground">Required</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Child components that will receive theme context
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ThemeConfig */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">ThemeConfig Interface</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'  // Theme mode
  preset?: ThemePresetName           // Built-in preset name
  customTheme?: CompleteThemeConfig  // Full custom theme
  customizations?: PartialThemeConfig // Override specific values
  simpleConfig?: SimpleThemeConfig   // Simple color-based config
  enableTransitions?: boolean        // Enable/disable animations
  transitionDuration?: number        // Custom duration in ms
}`}</code>
          </pre>
        </div>

        {/* useTheme Return Value */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">useTheme() Return Value</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const {
  theme,            // ThemeConfig - Current configuration
  setTheme,         // (config: Partial<ThemeConfig>) => void
  mode,             // 'light' | 'dark' - Resolved mode (not 'system')
  toggleMode,       // () => void - Toggle light/dark
  resolvedTheme,    // CompleteThemeConfig | null - Full resolved theme
  setPreset,        // (preset: ThemePresetName) => void
  availablePresets, // ThemePresetName[] - All 30 preset names
} = useTheme()`}</code>
          </pre>
        </div>

        {/* Available Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Available Theme Presets</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Core Themes</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>default / default-dark</li>
                <li>neutral / neutral-dark</li>
                <li>vibrant / vibrant-dark</li>
                <li>high-contrast / high-contrast-dark</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">2025 Trending</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>glassmorphism / glassmorphism-dark</li>
                <li>aurora / aurora-dark</li>
                <li>neumorphism / neumorphism-dark</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Nature-Inspired</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>ocean / ocean-dark</li>
                <li>sunset / sunset-dark</li>
                <li>forest / forest-dark</li>
                <li>rose / rose-dark</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Professional</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>midnight / midnight-dark</li>
                <li>slate / slate-dark</li>
                <li>emerald / emerald-dark</li>
                <li>amber / amber-dark</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Hooks & Components */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Related Hooks & Components</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-1">useTheme</h3>
            <p className="text-sm text-muted-foreground">
              Access and control theme from any component
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-1">ThemeToggle</h3>
            <p className="text-sm text-muted-foreground">
              Animated toggle button for light/dark mode
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-1">ThemeModeSelector</h3>
            <p className="text-sm text-muted-foreground">
              Three-way selector (light/dark/system)
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-1">useThemeColors</h3>
            <p className="text-sm text-muted-foreground">
              Access resolved color values for custom styling
            </p>
          </div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="mb-12 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <h2 className="text-xl font-semibold mb-4">Browser Support</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Cross-Tab Sync (BroadcastChannel API):</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Chrome 54+, Firefox 38+, Edge 79+, Safari 15.4+</li>
            <li>Gracefully falls back to localStorage-only persistence</li>
            <li>Theme changes sync on page reload in older browsers</li>
          </ul>
          <p className="mt-4">
            <strong>Reduced Motion:</strong> Automatically disabled when user has{' '}
            <code className="px-1 bg-background rounded">prefers-reduced-motion: reduce</code>
          </p>
        </div>
      </section>

      {/* Feedback */}
      <section className="border-t pt-8">
        <FeedbackWidget pageId="theme-provider" />
      </section>
    </div>
  )
}
