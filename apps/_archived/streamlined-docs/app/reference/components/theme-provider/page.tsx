'use client'

/**
 * ThemeProvider Component - API Reference Documentation
 *
 * Dynamic theme management with light/dark mode, custom color schemes, system preference
 * detection, and comprehensive accessibility features.
 */

import * as React from 'react'
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Zap,
  Shield,
  Paintbrush,
  Accessibility,
  Eye,
  RefreshCw,
  Code2,
} from 'lucide-react'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import type {
  FeatureHighlight,
  RelatedAPI,
  FooterLink,
  TocItem,
} from '@/components/Docs/DocumentationPage'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Props Data
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

const coreProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Child components that will have access to the theme context.',
  },
  {
    name: 'defaultTheme',
    type: 'Partial<ThemeConfig> | CompleteThemeConfig',
    default: "{ mode: 'system' }",
    description:
      'Initial theme configuration. Accepts preset names, custom themes, or theme config objects.',
  },
  {
    name: 'storageKey',
    type: 'string',
    default: "'clarity-chat-theme'",
    description:
      'localStorage key for persisting theme preferences. Change this to avoid conflicts.',
  },
  {
    name: 'enableCrossTabSync',
    type: 'boolean',
    default: 'true',
    description:
      'Enable cross-tab theme synchronization via BroadcastChannel API. Theme changes propagate to all open tabs in real-time.',
  },
  {
    name: 'crossTabSyncDebounce',
    type: 'number',
    default: '100',
    description:
      'Debounce delay for cross-tab sync messages in milliseconds. Set to 0 for immediate sync.',
  },
  {
    name: 'animationSpeed',
    type: "'none' | 'fast' | 'normal' | 'slow'",
    default: "'normal'",
    description:
      'Animation speed for theme transitions. Automatically set to "none" if user prefers reduced motion.',
  },
]

const themeConfigProps: PropDefinition[] = [
  {
    name: 'mode',
    type: "'light' | 'dark' | 'system'",
    default: "'system'",
    description:
      'Theme mode. "system" automatically follows OS preference.',
  },
  {
    name: 'preset',
    type: 'ThemePresetName',
    description:
      'Built-in theme preset name. Available: default, default-dark, neutral, neutral-dark, vibrant, vibrant-dark, high-contrast, high-contrast-dark.',
  },
  {
    name: 'customTheme',
    type: 'CompleteThemeConfig',
    description:
      'Complete custom theme object. Use createTheme() to generate.',
  },
  {
    name: 'customizations',
    type: 'PartialThemeConfig',
    description:
      'Partial theme customizations to merge with the base preset.',
  },
  {
    name: 'simpleConfig',
    type: 'SimpleThemeConfig',
    description:
      'Simplified theme config with brandColor shorthand. Modern API for quick customization.',
  },
  {
    name: 'enableTransitions',
    type: 'boolean',
    default: 'true',
    description:
      'Enable smooth color transitions when switching themes. Respects prefers-reduced-motion.',
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '200',
    description:
      'Duration of theme transition animations in milliseconds. Overrides animationSpeed if set.',
  },
]

const simpleThemeConfigProps: PropDefinition[] = [
  {
    name: 'brandColor',
    type: 'string',
    description:
      'Primary brand color in hex format. Generates a complete color palette automatically.',
  },
  {
    name: 'extends',
    type: 'ThemePresetName',
    description:
      'Base preset to extend. Inherits all properties from the preset.',
  },
  {
    name: 'mode',
    type: "'light' | 'dark'",
    description: 'Theme mode for the custom theme.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Custom name for your theme.',
  },
  {
    name: 'colors',
    type: 'Partial<ColorConfig>',
    description:
      'Color overrides. Accepts hex (#6366f1) or HSL (239 84% 67%) format.',
  },
  {
    name: 'radius',
    type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
    description: 'Border radius preset for all components.',
  },
]

const useThemeReturnProps: PropDefinition[] = [
  {
    name: 'theme',
    type: 'ThemeConfig',
    description: 'Current theme configuration object.',
  },
  {
    name: 'setTheme',
    type: '(theme: Partial<ThemeConfig>) => void',
    description:
      'Update theme configuration. Merges with existing theme.',
  },
  {
    name: 'mode',
    type: "'light' | 'dark'",
    description: 'Resolved theme mode (always light or dark, never system).',
  },
  {
    name: 'toggleMode',
    type: '() => void',
    description: 'Toggle between light and dark mode.',
  },
  {
    name: 'resolvedTheme',
    type: 'CompleteThemeConfig | null',
    description:
      'Complete resolved theme with all color tokens and properties.',
  },
  {
    name: 'setPreset',
    type: '(preset: ThemePresetName) => void',
    description: 'Set theme to a built-in preset.',
  },
  {
    name: 'availablePresets',
    type: 'ThemePresetName[]',
    description: 'Array of all available theme preset names.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ThemeProvider, useTheme } from '@clarity-chat/react'
import type { ThemeConfig, ThemePresetName } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`

const withPresetCode = `import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider
      defaultTheme={{
        preset: 'neutral-dark',
        enableTransitions: true,
        animationSpeed: 'normal'
      }}
      storageKey="my-app-theme"
      enableCrossTabSync={true}
    >
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`

const customThemeCode = `import { ThemeProvider, createTheme, ClarityChat } from '@clarity-chat/react'

// Create a custom theme
const customTheme = createTheme({
  extends: 'default',
  brandColor: '#6366f1', // Your brand color
  radius: 'lg',
  name: 'my-brand-theme',
})

function App() {
  return (
    <ThemeProvider defaultTheme={{ customTheme }}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`

const simpleConfigCode = `import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider
      defaultTheme={{
        simpleConfig: {
          brandColor: '#6366f1',
          radius: 'lg'
        }
      }}
    >
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`

const nestedProvidersCode = `import { ThemeProvider } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      <Layout>
        {/* Override theme for a specific section */}
        <ThemeProvider
          defaultTheme={{ preset: 'high-contrast' }}
          storageKey="admin-theme"
        >
          <AdminPanel />
        </ThemeProvider>
      </Layout>
    </ThemeProvider>
  )
}`

const useThemeCode = `import { useTheme } from '@clarity-chat/react'

function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  return (
    <button onClick={toggleMode}>
      {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

function ThemePresetSelector() {
  const { setPreset, availablePresets } = useTheme()

  return (
    <select onChange={(e) => setPreset(e.target.value as ThemePresetName)}>
      {availablePresets.map((preset) => (
        <option key={preset} value={preset}>
          {preset}
        </option>
      ))}
    </select>
  )
}`

const createCustomThemeCode = `import { createTheme } from '@clarity-chat/react'

// Step 1: Start with a preset
const myTheme = createTheme({
  extends: 'neutral-dark',

  // Step 2: Add your brand color
  brandColor: '#10b981', // Emerald green

  // Step 3: Customize border radius
  radius: 'lg',

  // Step 4: Override specific colors
  colors: {
    background: '0 0% 5%',     // Very dark background
    foreground: '0 0% 98%',    // Off-white text
    accent: '#22c55e',         // Green accent
  },

  // Step 5: Name your theme
  name: 'my-custom-theme',
})

// Use in ThemeProvider
<ThemeProvider defaultTheme={{ customTheme: myTheme }}>
  <App />
</ThemeProvider>`

const accessibilityCode = `import { ThemeProvider, createTheme } from '@clarity-chat/react'

// High contrast theme for accessibility
const accessibleTheme = createTheme({
  extends: 'high-contrast',
  colors: {
    // Ensure 7:1 contrast ratio (WCAG AAA)
    primary: '#1d4ed8',      // Dark blue
    background: '#ffffff',   // Pure white
    foreground: '#000000',   // Pure black
    border: '#000000',       // Black borders
  },
})

function AccessibleApp() {
  return (
    <ThemeProvider
      defaultTheme={{ customTheme: accessibleTheme }}
      animationSpeed="none" // Disable animations for motion sensitivity
    >
      <App />
    </ThemeProvider>
  )
}`

const themeSwitcherCode = `import { useTheme } from '@clarity-chat/react'
import { Sun, Moon, Monitor } from 'lucide-react'

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const modes = ['light', 'dark', 'system'] as const

  return (
    <div className="flex gap-2">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme({ mode })}
          className={\`px-3 py-2 rounded \${
            theme.mode === mode
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }\`}
        >
          {mode === 'light' && <Sun className="w-4 h-4" />}
          {mode === 'dark' && <Moon className="w-4 h-4" />}
          {mode === 'system' && <Monitor className="w-4 h-4" />}
        </button>
      ))}
    </div>
  )
}`

const typescriptCode = `// ThemeProvider props
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Partial<ThemeConfig> | CompleteThemeConfig
  storageKey?: string
  enableCrossTabSync?: boolean
  crossTabSyncDebounce?: number
  animationSpeed?: 'none' | 'fast' | 'normal' | 'slow'
}

// Theme configuration
interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  preset?: ThemePresetName
  customTheme?: CompleteThemeConfig
  customizations?: PartialThemeConfig
  simpleConfig?: SimpleThemeConfig
  enableTransitions?: boolean
  transitionDuration?: number
}

// Simple theme config (modern API)
interface SimpleThemeConfig {
  brandColor?: string
  extends?: ThemePresetName
  mode?: 'light' | 'dark'
  name?: string
  colors?: Partial<ColorConfig>
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

// useTheme hook return type
interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  mode: 'light' | 'dark'
  toggleMode: () => void
  resolvedTheme: CompleteThemeConfig | null
  setPreset: (preset: ThemePresetName) => void
  availablePresets: ThemePresetName[]
}

// Available presets
type ThemePresetName =
  | 'default'
  | 'default-dark'
  | 'neutral'
  | 'neutral-dark'
  | 'vibrant'
  | 'vibrant-dark'
  | 'high-contrast'
  | 'high-contrast-dark'`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const presets = [
    { name: 'default', label: 'Default', color: '#6366f1' },
    { name: 'neutral-dark', label: 'Neutral Dark', color: '#171717' },
    { name: 'vibrant', label: 'Vibrant', color: '#a855f7' },
    { name: 'high-contrast', label: 'High Contrast', color: '#1d4ed8' },
  ]

  const [selectedPreset, setSelectedPreset] = React.useState('default')

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setSelectedPreset(preset.name)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedPreset === preset.name
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-border/50 hover:border-brand-300'
            }`}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: preset.color }}
            />
            <p className="text-sm font-medium text-center">{preset.label}</p>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="p-6 rounded-xl border border-border/50 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Theme Preview</h3>
          <span className="text-xs text-muted-foreground">
            Preset: {selectedPreset}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <p className="text-sm font-medium">Primary Color</p>
            <p className="text-xs opacity-80">Interactive elements</p>
          </div>

          <div className="p-3 rounded-lg bg-muted text-foreground">
            <p className="text-sm font-medium">Muted Background</p>
            <p className="text-xs text-muted-foreground">Secondary surfaces</p>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-lg border border-border bg-background">
              <p className="text-xs text-foreground">Background</p>
            </div>
            <div className="flex-1 p-3 rounded-lg border-2 border-primary/50">
              <p className="text-xs text-primary">Border</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          All colors are automatically adjusted for light/dark mode and respect
          accessibility standards.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Page Configuration
// ============================================================================

const features: FeatureHighlight[] = [
  {
    icon: Sun,
    label: 'Light/Dark Mode',
    description: 'Automatic system preference detection',
  },
  {
    icon: Paintbrush,
    label: 'Custom Themes',
    description: 'CSS variable-based theming',
  },
  {
    icon: Zap,
    label: 'Smooth Transitions',
    description: 'Animated theme switching',
  },
  {
    icon: RefreshCw,
    label: 'Persistent State',
    description: 'localStorage synchronization',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'theme-config', title: 'ThemeConfig' },
      { id: 'simple-config', title: 'SimpleThemeConfig' },
      { id: 'use-theme-return', title: 'useTheme Return' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-preset', title: 'With Preset' },
      { id: 'example-custom', title: 'Custom Theme' },
      { id: 'example-simple', title: 'Simple Config' },
      { id: 'example-nested', title: 'Nested Providers' },
      { id: 'example-hook', title: 'Using useTheme' },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    children: [
      { id: 'guide-custom', title: 'Creating Custom Themes' },
      { id: 'guide-switcher', title: 'Theme Switcher' },
      { id: 'guide-accessibility', title: 'Accessibility' },
    ],
  },
  { id: 'presets', title: 'Available Presets' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'related', title: 'Related' },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'useTheme',
    type: 'hook',
    description: 'Access and manipulate theme configuration',
    href: '/reference/hooks/use-theme',
  },
  {
    name: 'createTheme',
    type: 'utility',
    description: 'Create custom themes with type safety',
    href: '/reference/utilities/create-theme',
  },
  {
    name: 'ThemeToggle',
    type: 'component',
    description: 'Pre-built theme toggle button',
    href: '/reference/components/theme-toggle',
  },
  {
    name: 'ThemeModeSelector',
    type: 'component',
    description: 'Three-way mode selector (light/dark/system)',
    href: '/reference/components/theme-mode-selector',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'ClarityChatApp',
    href: '/reference/components/clarity-chat-app',
    direction: 'previous',
  },
  {
    label: 'useTheme',
    href: '/reference/hooks/use-theme',
    direction: 'next',
  },
]

// ============================================================================
// Props Tables
// ============================================================================

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ThemeProviderPage() {
  return (
    <DocumentationPage
      title="ThemeProvider"
      description="Dynamic theme management with light/dark mode, custom color schemes, and system preference detection"
      icon={Palette}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview Section */}
      <section id="overview" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>ThemeProvider</code> is the root component for Clarity Chat's
            theming system. It provides theme context to all child components,
            manages light/dark mode, persists user preferences, and handles
            theme switching with smooth animations.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Automatic System Detection:</strong> Follows OS
              dark/light mode preferences automatically
            </li>
            <li>
              <strong>8 Built-in Presets:</strong> Professional themes ready to
              use out of the box
            </li>
            <li>
              <strong>CSS Variable Based:</strong> Easy customization through
              standard CSS variables
            </li>
            <li>
              <strong>Smooth Transitions:</strong> Animated theme switching
              with reduced motion support
            </li>
            <li>
              <strong>LocalStorage Persistence:</strong> Remembers user theme
              preferences
            </li>
            <li>
              <strong>Cross-Tab Sync:</strong> Theme changes propagate across
              browser tabs
            </li>
            <li>
              <strong>Accessibility First:</strong> High contrast mode and WCAG
              AAA support
            </li>
            <li>
              <strong>TypeScript Support:</strong> Fully typed with strict
              definitions
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Theming Architecture
          </h4>
          <p>
            ThemeProvider uses CSS custom properties (variables) to apply
            themes at runtime. All theme colors are defined in HSL format for
            easy manipulation, and the provider automatically handles:
          </p>
          <ul className="space-y-2">
            <li>System preference detection via media queries</li>
            <li>CSS variable injection to document root</li>
            <li>Transition animations for smooth color changes</li>
            <li>High contrast and forced colors mode support</li>
          </ul>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Installation
        </h2>
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">
            Import the component and styles:
          </p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Live Demo</h2>
        <p className="text-muted-foreground mb-6">
          Preview different theme presets and see how they affect component
          styling.
        </p>

        <LiveDemo />
      </section>

      {/* Basic Usage Section */}
      <section id="basic-usage" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Basic Usage
        </h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Wrap your app with ThemeProvider to enable theming. The simplest
            setup follows the system preference:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="App.tsx"
          />
        </div>
      </section>

      {/* Props Reference Section */}
      <section id="props" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Props Reference
        </h2>

        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="theme-config" title="ThemeConfig Object">
          <p className="text-sm text-muted-foreground mb-4">
            The <code>defaultTheme</code> prop accepts a ThemeConfig object
            with these properties:
          </p>
          <PropsTable props={themeConfigProps} />
        </SubSection>

        <SubSection id="simple-config" title="SimpleThemeConfig Object">
          <p className="text-sm text-muted-foreground mb-4">
            Simplified theme configuration for quick customization:
          </p>
          <PropsTable props={simpleThemeConfigProps} />
        </SubSection>

        <SubSection id="use-theme-return" title="useTheme() Return Value">
          <p className="text-sm text-muted-foreground mb-4">
            The <code>useTheme</code> hook returns these properties:
          </p>
          <PropsTable props={useThemeReturnProps} />
        </SubSection>
      </section>

      {/* Examples Section */}
      <section id="examples" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Examples</h2>

        <SubSection id="example-basic" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Minimal setup with system preference:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicTheme.tsx"
          />
        </SubSection>

        <SubSection id="example-preset" title="With Preset">
          <p className="text-muted-foreground mb-4">
            Use a built-in theme preset with custom settings:
          </p>
          <CodeBlock
            code={withPresetCode}
            language="tsx"
            filename="PresetTheme.tsx"
          />
        </SubSection>

        <SubSection id="example-custom" title="Custom Theme">
          <p className="text-muted-foreground mb-4">
            Create a fully custom theme with <code>createTheme()</code>:
          </p>
          <CodeBlock
            code={customThemeCode}
            language="tsx"
            filename="CustomTheme.tsx"
          />
        </SubSection>

        <SubSection id="example-simple" title="Simple Config">
          <p className="text-muted-foreground mb-4">
            Quick customization with brand color shorthand:
          </p>
          <CodeBlock
            code={simpleConfigCode}
            language="tsx"
            filename="SimpleConfig.tsx"
          />
        </SubSection>

        <SubSection id="example-nested" title="Nested Providers">
          <p className="text-muted-foreground mb-4">
            Override themes for specific sections of your app:
          </p>
          <CodeBlock
            code={nestedProvidersCode}
            language="tsx"
            filename="NestedThemes.tsx"
          />
        </SubSection>

        <SubSection id="example-hook" title="Using useTheme Hook">
          <p className="text-muted-foreground mb-4">
            Access and manipulate theme from any component:
          </p>
          <CodeBlock
            code={useThemeCode}
            language="tsx"
            filename="ThemeControls.tsx"
          />
        </SubSection>
      </section>

      {/* Guides Section */}
      <section id="guides" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Guides</h2>

        <SubSection id="guide-custom" title="Creating Custom Themes">
          <p className="text-muted-foreground mb-4">
            Step-by-step guide to creating your own theme:
          </p>
          <CodeBlock
            code={createCustomThemeCode}
            language="tsx"
            filename="CreateTheme.tsx"
          />
        </SubSection>

        <SubSection id="guide-switcher" title="Building a Theme Switcher">
          <p className="text-muted-foreground mb-4">
            Create an interactive theme mode selector:
          </p>
          <CodeBlock
            code={themeSwitcherCode}
            language="tsx"
            filename="ThemeSwitcher.tsx"
          />
        </SubSection>

        <SubSection id="guide-accessibility" title="Accessibility Best Practices">
          <p className="text-muted-foreground mb-4">
            Ensure your custom themes meet WCAG standards:
          </p>
          <CodeBlock
            code={accessibilityCode}
            language="tsx"
            filename="AccessibleTheme.tsx"
          />
        </SubSection>
      </section>

      {/* Available Presets Section */}
      <section id="presets" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Available Presets
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: 'default',
              description: 'Clean, professional with indigo accents',
              mode: 'light',
            },
            {
              name: 'default-dark',
              description: 'Dark variant of default theme',
              mode: 'dark',
            },
            {
              name: 'neutral',
              description: 'Minimal, monochrome (Linear-inspired)',
              mode: 'light',
            },
            {
              name: 'neutral-dark',
              description: 'True dark mode with neutral tones',
              mode: 'dark',
            },
            {
              name: 'vibrant',
              description: 'Bold purple with pink accents',
              mode: 'light',
            },
            {
              name: 'vibrant-dark',
              description: 'Deep purple dark theme',
              mode: 'dark',
            },
            {
              name: 'high-contrast',
              description: 'WCAG AAA compliant (7:1 contrast)',
              mode: 'light',
            },
            {
              name: 'high-contrast-dark',
              description: 'Accessible dark theme',
              mode: 'dark',
            },
          ].map((preset) => (
            <div
              key={preset.name}
              className="p-4 rounded-lg border border-border/50 bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {preset.name}
                </code>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {preset.mode}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TypeScript Section */}
      <section id="typescript" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          TypeScript
        </h2>
        <p className="text-muted-foreground mb-4">
          Full type definitions for theme configuration:
        </p>
        <CodeBlock
          code={typescriptCode}
          language="tsx"
          filename="types.ts"
          showLineNumbers
        />
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Accessibility
        </h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" aria-hidden="true" />
            High Contrast Mode
          </h4>
          <p>
            ThemeProvider automatically detects and responds to system-level
            high contrast settings via <code>prefers-contrast: more</code>{' '}
            media query.
          </p>
          <ul className="space-y-2">
            <li>Automatically adjusts colors for higher contrast</li>
            <li>Applies darker borders for better definition</li>
            <li>
              Use <code>high-contrast</code> preset for WCAG AAA compliance
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Forced Colors Mode
          </h4>
          <p>
            Supports Windows High Contrast mode via{' '}
            <code>forced-colors: active</code> media query. When active, the
            system controls all colors.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Reduced Motion
          </h4>
          <p>
            Respects <code>prefers-reduced-motion</code> user preference:
          </p>
          <ul className="space-y-2">
            <li>
              Theme transitions disabled automatically when reduced motion is
              preferred
            </li>
            <li>
              Override with <code>animationSpeed="none"</code> prop
            </li>
            <li>All animations use zero duration when motion is reduced</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Color Contrast Guidelines
          </h4>
          <p>When creating custom themes, ensure:</p>
          <ul className="space-y-2">
            <li>
              <strong>WCAG AA:</strong> 4.5:1 contrast for normal text, 3:1 for
              large text
            </li>
            <li>
              <strong>WCAG AAA:</strong> 7:1 contrast for normal text, 4.5:1
              for large text
            </li>
            <li>Use high-contrast preset as a starting point</li>
            <li>
              Test with tools like{' '}
              <code>&lt;ThemeContrastChecker /&gt;</code>
            </li>
          </ul>
        </div>
      </section>
    </DocumentationPage>
  )
}
