'use client'

/**
 * ThemeEditor (ThemeCustomizer) Component - API Reference Documentation
 *
 * Visual theme editor with live preview, color picker, and CSS variable export
 * for custom branding and theme creation.
 */

import * as React from 'react'
import {
  Paintbrush,
  Palette,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Accessibility,
  Code2,
  RefreshCw,
  Type,
  Droplet,
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
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the theme editor container.',
  },
  {
    name: 'onThemeChange',
    type: '(theme: CompleteThemeConfig) => void',
    description:
      'Callback invoked when the theme is modified. Receives the complete theme configuration.',
  },
  {
    name: 'showPresets',
    type: 'boolean',
    default: 'true',
    description:
      'Show the preset themes tab with 10+ built-in themes organized by category.',
  },
  {
    name: 'showColors',
    type: 'boolean',
    default: 'true',
    description:
      'Show the color customization tab with color pickers and smart palette generator.',
  },
  {
    name: 'showTypography',
    type: 'boolean',
    default: 'true',
    description:
      'Show the typography controls tab for font family and size scale selection.',
  },
  {
    name: 'showAccessibility',
    type: 'boolean',
    default: 'true',
    description:
      'Show the accessibility tab with contrast checking and color blindness simulation (8 types).',
  },
  {
    name: 'showExport',
    type: 'boolean',
    default: 'true',
    description:
      'Show the export tab with JSON, CSS variables, and Tailwind config export options.',
  },
  {
    name: 'compact',
    type: 'boolean',
    default: 'false',
    description:
      'Enable compact mode with reduced padding and max-width for embedding in sidebars.',
  },
  {
    name: 'persistTheme',
    type: 'boolean',
    default: 'true',
    description:
      'Enable automatic theme persistence to localStorage. Changes are saved and restored on mount.',
  },
  {
    name: 'storageKey',
    type: 'string',
    default: "'clarity-theme-customizer'",
    description:
      'localStorage key for persisting theme state. Change this to avoid conflicts with other instances.',
  },
]

const typographySettingsProps: PropDefinition[] = [
  {
    name: 'fontFamily',
    type: "'system' | 'inter' | 'roboto' | 'mono'",
    description:
      'Font family selection. System uses native OS fonts, Inter and Roboto are Google Fonts.',
  },
  {
    name: 'sizeScale',
    type: "'compact' | 'default' | 'large'",
    description:
      'Typography size scale. Compact (0.875x), Default (1x), Large (1.125x).',
  },
]

const colorConfigKeys: PropDefinition[] = [
  {
    name: 'primary',
    type: 'string (HSL)',
    description: 'Primary brand color for buttons, links, and interactive elements.',
  },
  {
    name: 'secondary',
    type: 'string (HSL)',
    description: 'Secondary brand color for alternate actions and highlights.',
  },
  {
    name: 'accent',
    type: 'string (HSL)',
    description: 'Accent color for badges, notifications, and emphasis.',
  },
  {
    name: 'background',
    type: 'string (HSL)',
    description: 'Main background color for the application.',
  },
  {
    name: 'foreground',
    type: 'string (HSL)',
    description: 'Primary text color for body content.',
  },
  {
    name: 'muted',
    type: 'string (HSL)',
    description: 'Muted background color for cards, panels, and secondary surfaces.',
  },
  {
    name: 'mutedForeground',
    type: 'string (HSL)',
    description: 'Muted text color for subtitles, captions, and secondary text.',
  },
  {
    name: 'border',
    type: 'string (HSL)',
    description: 'Border color for dividers, inputs, and component boundaries.',
  },
  {
    name: 'success',
    type: 'string (HSL)',
    description: 'Success state color for confirmations and positive feedback.',
  },
  {
    name: 'destructive',
    type: 'string (HSL)',
    description: 'Destructive/error state color for warnings and errors.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ThemeCustomizer } from '@clarity-chat/react'
import type { CompleteThemeConfig } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ThemeProvider, ThemeCustomizer } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider>
      <div className="container mx-auto p-4">
        <ThemeCustomizer />
      </div>
    </ThemeProvider>
  )
}`

const withCallbackCode = `import { ThemeProvider, ThemeCustomizer } from '@clarity-chat/react'
import type { CompleteThemeConfig } from '@clarity-chat/react'

function App() {
  const handleThemeChange = (theme: CompleteThemeConfig) => {
    console.log('Theme changed:', theme.name)
    console.log('Primary color:', theme.colors.primary)

    // Save to backend, analytics, etc.
    savethemeToBackend(theme)
  }

  return (
    <ThemeProvider>
      <ThemeCustomizer onThemeChange={handleThemeChange} />
    </ThemeProvider>
  )
}`

const compactModeCode = `import { ThemeCustomizer } from '@clarity-chat/react'

function Sidebar() {
  return (
    <aside className="w-80 p-4">
      <ThemeCustomizer
        compact={true}
        showPresets={true}
        showColors={true}
        showTypography={false}
        showAccessibility={false}
        showExport={true}
      />
    </aside>
  )
}`

const persistenceCode = `import { ThemeCustomizer } from '@clarity-chat/react'

function App() {
  return (
    <div>
      {/* User-specific theme persistence */}
      <ThemeCustomizer
        persistTheme={true}
        storageKey="user-theme-preferences"
      />

      {/* Admin theme editor (no persistence) */}
      <ThemeCustomizer
        persistTheme={false}
        onThemeChange={(theme) => saveToDatabase(theme)}
      />
    </div>
  )
}`

const programmaticCode = `import { useTheme, createTheme } from '@clarity-chat/react'

function ThemeControls() {
  const { setTheme } = useTheme()

  const applyCustomTheme = () => {
    const customTheme = createTheme({
      extends: 'neutral-dark',
      brandColor: '#10b981', // Emerald green
      radius: 'lg',
      name: 'my-custom-theme',
    })

    setTheme({ customTheme })
  }

  const applyPreset = () => {
    setTheme({ preset: 'vibrant-dark' })
  }

  return (
    <div>
      <button onClick={applyCustomTheme}>Apply Custom Theme</button>
      <button onClick={applyPreset}>Apply Preset</button>

      <ThemeCustomizer />
    </div>
  )
}`

const exportImportCode = `import { ThemeCustomizer } from '@clarity-chat/react'
import { createTheme } from '@clarity-chat/react'

function ThemeManager() {
  const handleThemeChange = (theme: CompleteThemeConfig) => {
    // Export theme as JSON
    const json = JSON.stringify(theme, null, 2)
    console.log('Theme JSON:', json)

    // Export as CSS variables
    const cssVars = Object.entries(theme.colors)
      .map(([key, value]) => \`  --clarity-\${key}: \${value};\`)
      .join('\\n')
    console.log('CSS Variables:\\n', cssVars)
  }

  const importTheme = (json: string) => {
    const theme = JSON.parse(json)
    setTheme({ customTheme: theme })
  }

  return (
    <div>
      <ThemeCustomizer onThemeChange={handleThemeChange} />

      <button onClick={() => {
        const json = localStorage.getItem('exported-theme')
        if (json) importTheme(json)
      }}>
        Import Theme
      </button>
    </div>
  )
}`

const accessibilityCode = `import { ThemeCustomizer } from '@clarity-chat/react'

function AccessibleThemeEditor() {
  return (
    <ThemeCustomizer
      showAccessibility={true}
      onThemeChange={(theme) => {
        // The accessibility tab shows:
        // 1. Contrast ratio checks (WCAG AA/AAA)
        // 2. Color blindness simulation (8 types)
        // 3. Live contrast badges for all color combinations

        console.log('Theme colors:', theme.colors)
      }}
    />
  )
}`

const workflowGuideCode = `import { ThemeProvider, ThemeCustomizer, ClarityChat } from '@clarity-chat/react'

function ThemeWorkflowDemo() {
  const [currentTheme, setCurrentTheme] = React.useState(null)

  return (
    <ThemeProvider>
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Theme Editor */}
        <div>
          <h2>Customize Your Theme</h2>
          <ThemeCustomizer
            onThemeChange={setCurrentTheme}
            showPresets={true}
            showColors={true}
            showAccessibility={true}
            showExport={true}
          />
        </div>

        {/* Right: Live Preview */}
        <div>
          <h2>Live Preview</h2>
          <ClarityChat
            api="/api/chat"
            initialMessages={[
              {
                id: '1',
                role: 'assistant',
                content: 'Preview your theme changes in real-time!',
              },
            ]}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}`

const typescriptCode = `// Main component props
interface ThemeCustomizerProps {
  /** Additional CSS classes */
  className?: string
  /** Callback when theme changes */
  onThemeChange?: (theme: CompleteThemeConfig) => void
  /** Show preset selector */
  showPresets?: boolean
  /** Show color customization */
  showColors?: boolean
  /** Show typography controls */
  showTypography?: boolean
  /** Show accessibility info */
  showAccessibility?: boolean
  /** Show export options */
  showExport?: boolean
  /** Compact mode */
  compact?: boolean
  /** Enable theme persistence to localStorage */
  persistTheme?: boolean
  /** Storage key for persistence */
  storageKey?: string
}

// Typography settings
interface TypographySettings {
  fontFamily: 'system' | 'inter' | 'roboto' | 'mono'
  sizeScale: 'compact' | 'default' | 'large'
}

// Complete theme configuration
interface CompleteThemeConfig {
  name: string
  mode: 'light' | 'dark'
  colors: ColorConfig
  typography: TypographyConfig
  spacing: SpacingConfig
  borders: BorderConfig
  shadows: ShadowConfig
  animations: AnimationConfig
  components: ComponentConfig
}

// Color configuration (HSL format)
interface ColorConfig {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  input: string
  ring: string
  success: string
  destructive: string
  // ... 20+ total color tokens
}`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [activeTab, setActiveTab] = React.useState('presets')

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl border border-border/50 bg-card shadow-lg">
        {/* Mock Header */}
        <div className="px-4 py-3 border-b border-border bg-muted/30 rounded-t-lg -mt-6 -mx-6 mb-4">
          <h3 className="font-semibold text-foreground">Theme Customizer</h3>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your chat
          </p>
        </div>

        {/* Mock Tabs */}
        <div className="flex border-b border-border -mx-6 px-6 mb-4">
          {['Presets', 'Colors', 'Typography', 'Accessibility', 'Export'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.toLowerCase()
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Mock Content */}
        <div className="space-y-4">
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Mode:</span>
                <div className="flex rounded-lg bg-muted p-1">
                  {['Light', 'Dark', 'System'].map((mode) => (
                    <button
                      key={mode}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        mode === 'Dark'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  'Default',
                  'Neutral',
                  'Vibrant',
                  'High Contrast',
                  'Ocean',
                  'Forest',
                ].map((preset) => (
                  <div
                    key={preset}
                    className="p-3 rounded-lg border border-border/50 bg-muted/30 hover:border-brand-500/50 cursor-pointer transition-colors"
                  >
                    <div className="w-full h-8 rounded mb-2 bg-gradient-to-r from-brand-500 to-brand-600" />
                    <p className="text-xs text-center">{preset}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {['Primary', 'Secondary', 'Accent'].map((color) => (
                  <div key={color} className="flex items-center gap-3">
                    <label className="text-sm font-medium w-24">{color}</label>
                    <input
                      type="color"
                      className="w-12 h-8 rounded border border-border cursor-pointer"
                      defaultValue="#6366f1"
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-mono"
                      defaultValue="239 84% 67%"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  {['System', 'Inter', 'Roboto', 'Mono'].map((font) => (
                    <button
                      key={font}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-background hover:border-brand-500/50"
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Size Scale</label>
                <div className="flex gap-2">
                  {['Compact', 'Default', 'Large'].map((size) => (
                    <button
                      key={size}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Contrast Ratios</h4>
                <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                  {[
                    { label: 'Text/Background', ratio: '14.5:1', level: 'AAA' },
                    { label: 'Primary Button', ratio: '4.8:1', level: 'AA' },
                    { label: 'Muted Text', ratio: '7.2:1', level: 'AAA' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{item.ratio}</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                          {item.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  Color Blindness Simulation
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Protanopia',
                    'Deuteranopia',
                    'Tritanopia',
                    'Achromatopsia',
                  ].map((type) => (
                    <div
                      key={type}
                      className="p-2 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <div className="flex gap-1 mb-1">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <div className="w-4 h-4 rounded bg-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">{type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-3">
              {['Export as JSON', 'Export as CSS Variables', 'Copy Tailwind Config'].map(
                (action) => (
                  <button
                    key={action}
                    className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted/50 text-left flex items-center justify-between"
                  >
                    {action}
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Interactive demo showing the theme customizer interface
      </p>
    </div>
  )
}

// ============================================================================
// Page Configuration
// ============================================================================

const features: FeatureHighlight[] = [
  {
    icon: Eye,
    label: 'Live Preview',
    description: 'Real-time theme changes',
  },
  {
    icon: Droplet,
    label: 'Color Picker',
    description: 'Advanced color selection',
  },
  {
    icon: Download,
    label: 'Export/Import',
    description: 'JSON and CSS variable export',
  },
  {
    icon: Palette,
    label: 'Preset Themes',
    description: '10+ built-in themes',
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
      { id: 'typography-settings', title: 'Typography Settings' },
      { id: 'color-config', title: 'Color Configuration' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-callback', title: 'With Callback' },
      { id: 'example-compact', title: 'Compact Mode' },
      { id: 'example-persistence', title: 'Theme Persistence' },
      { id: 'example-programmatic', title: 'Programmatic Control' },
      { id: 'example-export', title: 'Export/Import' },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    children: [
      { id: 'guide-workflow', title: 'Theme Customization Workflow' },
      { id: 'guide-accessibility', title: 'Accessibility Testing' },
      { id: 'guide-export', title: 'Exporting Themes' },
    ],
  },
  { id: 'theme-structure', title: 'Theme Structure' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'related', title: 'Related' },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'ThemeProvider',
    type: 'component',
    description: 'Root theme context provider',
    href: '/reference/components/theme-provider',
  },
  {
    name: 'useTheme',
    type: 'hook',
    description: 'Access and manipulate theme configuration',
    href: '/reference/hooks/use-theme',
  },
  {
    name: 'createTheme',
    type: 'utility',
    description: 'Create custom themes programmatically',
    href: '/reference/utilities/create-theme',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'ThemeProvider',
    href: '/reference/components/theme-provider',
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

export default function ThemeEditorPage() {
  return (
    <DocumentationPage
      title="ThemeEditor"
      description="Visual theme editor with live preview, color picker, and CSS variable export for custom branding"
      icon={Paintbrush}
      badges={[{ label: 'Experimental', variant: 'experimental' }]}
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
            <code>ThemeEditor</code> (internally <code>ThemeCustomizer</code>)
            is a comprehensive, interactive theme customization interface. It
            provides a visual editor for creating, modifying, and exporting
            custom themes with real-time preview capabilities.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>10+ Built-in Presets:</strong> Professional themes
              organized by category (neutral, vibrant, high-contrast)
            </li>
            <li>
              <strong>Advanced Color Picker:</strong> HSL color selection with
              smart palette generation
            </li>
            <li>
              <strong>Typography Controls:</strong> Font family and size scale
              customization with live preview
            </li>
            <li>
              <strong>Accessibility Testing:</strong> Contrast ratio checking
              and color blindness simulation (8 types)
            </li>
            <li>
              <strong>Export Options:</strong> JSON, CSS variables, and
              Tailwind config formats
            </li>
            <li>
              <strong>Theme Persistence:</strong> Automatic localStorage saving
              and restoration
            </li>
            <li>
              <strong>Live Preview:</strong> Real-time theme updates across all
              components
            </li>
            <li>
              <strong>Compact Mode:</strong> Responsive layout for sidebars and
              panels
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
          <ul className="space-y-2">
            <li>
              <strong>Brand Customization:</strong> Allow users to match your
              chat interface to their brand colors
            </li>
            <li>
              <strong>White-label Solutions:</strong> Enable customers to create
              custom-branded experiences
            </li>
            <li>
              <strong>Design Systems:</strong> Build and test theme variations
              for your design system
            </li>
            <li>
              <strong>Accessibility Tools:</strong> Create high-contrast themes
              for users with visual impairments
            </li>
            <li>
              <strong>Theme Marketplaces:</strong> Export and share custom
              themes as JSON
            </li>
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
          Interactive theme editor with all five tabs: Presets, Colors,
          Typography, Accessibility, and Export.
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
            ThemeEditor must be used inside a <code>ThemeProvider</code>. The
            simplest setup shows all tabs:
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

        <SubSection id="typography-settings" title="Typography Settings">
          <p className="text-sm text-muted-foreground mb-4">
            Typography configuration options for font family and size scale:
          </p>
          <PropsTable props={typographySettingsProps} />
        </SubSection>

        <SubSection id="color-config" title="Color Configuration Keys">
          <p className="text-sm text-muted-foreground mb-4">
            Main color tokens in the theme system (all values in HSL format):
          </p>
          <PropsTable props={colorConfigKeys} />
          <p className="text-xs text-muted-foreground mt-4">
            Note: The complete theme includes 20+ color tokens. These are the
            primary customizable colors.
          </p>
        </SubSection>
      </section>

      {/* Examples Section */}
      <section id="examples" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Examples</h2>

        <SubSection id="example-basic" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Drop-in theme editor with all features enabled:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicThemeEditor.tsx"
          />
        </SubSection>

        <SubSection id="example-callback" title="With Theme Change Callback">
          <p className="text-muted-foreground mb-4">
            React to theme changes with a callback function:
          </p>
          <CodeBlock
            code={withCallbackCode}
            language="tsx"
            filename="ThemeEditorWithCallback.tsx"
          />
        </SubSection>

        <SubSection id="example-compact" title="Compact Mode">
          <p className="text-muted-foreground mb-4">
            Embed the theme editor in a sidebar with selective tabs:
          </p>
          <CodeBlock
            code={compactModeCode}
            language="tsx"
            filename="CompactThemeEditor.tsx"
          />
        </SubSection>

        <SubSection id="example-persistence" title="Theme Persistence">
          <p className="text-muted-foreground mb-4">
            Control theme persistence with custom storage keys:
          </p>
          <CodeBlock
            code={persistenceCode}
            language="tsx"
            filename="PersistentThemeEditor.tsx"
          />
        </SubSection>

        <SubSection id="example-programmatic" title="Programmatic Control">
          <p className="text-muted-foreground mb-4">
            Combine ThemeEditor with programmatic theme control:
          </p>
          <CodeBlock
            code={programmaticCode}
            language="tsx"
            filename="ProgrammaticThemeControl.tsx"
          />
        </SubSection>

        <SubSection id="example-export" title="Export/Import Themes">
          <p className="text-muted-foreground mb-4">
            Export themes as JSON or CSS variables for external use:
          </p>
          <CodeBlock
            code={exportImportCode}
            language="tsx"
            filename="ThemeExportImport.tsx"
          />
        </SubSection>
      </section>

      {/* Guides Section */}
      <section id="guides" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">Guides</h2>

        <SubSection id="guide-workflow" title="Theme Customization Workflow">
          <p className="text-muted-foreground mb-4">
            Complete workflow for creating and previewing custom themes:
          </p>
          <CodeBlock
            code={workflowGuideCode}
            language="tsx"
            filename="ThemeWorkflow.tsx"
          />
          <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h5 className="font-semibold text-foreground mb-2">
              Recommended Workflow:
            </h5>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>
                <strong>Start with a Preset:</strong> Choose a base theme from
                the Presets tab
              </li>
              <li>
                <strong>Customize Colors:</strong> Adjust brand colors in the
                Colors tab
              </li>
              <li>
                <strong>Set Typography:</strong> Select font family and size
                scale
              </li>
              <li>
                <strong>Check Accessibility:</strong> Verify contrast ratios
                and color blindness compatibility
              </li>
              <li>
                <strong>Export Theme:</strong> Download as JSON or CSS
                variables
              </li>
            </ol>
          </div>
        </SubSection>

        <SubSection id="guide-accessibility" title="Accessibility Testing">
          <p className="text-muted-foreground mb-4">
            Use the accessibility tab to ensure your theme meets WCAG standards:
          </p>
          <CodeBlock
            code={accessibilityCode}
            language="tsx"
            filename="AccessibilityTesting.tsx"
          />
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Contrast Ratio Guidelines
              </h5>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">WCAG AA:</strong> 4.5:1
                  for normal text, 3:1 for large text (18px+)
                </li>
                <li>
                  <strong className="text-foreground">WCAG AAA:</strong> 7:1
                  for normal text, 4.5:1 for large text
                </li>
                <li>
                  The accessibility tab shows real-time contrast ratios for all
                  color combinations
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Color Blindness Simulation
              </h5>
              <p className="text-sm text-muted-foreground mb-3">
                The theme editor simulates 8 types of color blindness:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong className="text-foreground">Protanopia:</strong>{' '}
                  <span className="text-muted-foreground">Red-blind</span>
                </div>
                <div>
                  <strong className="text-foreground">Deuteranopia:</strong>{' '}
                  <span className="text-muted-foreground">Green-blind</span>
                </div>
                <div>
                  <strong className="text-foreground">Tritanopia:</strong>{' '}
                  <span className="text-muted-foreground">Blue-blind</span>
                </div>
                <div>
                  <strong className="text-foreground">Achromatopsia:</strong>{' '}
                  <span className="text-muted-foreground">Total color blindness</span>
                </div>
                <div>
                  <strong className="text-foreground">Protanomaly:</strong>{' '}
                  <span className="text-muted-foreground">Red-weak</span>
                </div>
                <div>
                  <strong className="text-foreground">Deuteranomaly:</strong>{' '}
                  <span className="text-muted-foreground">Green-weak</span>
                </div>
                <div>
                  <strong className="text-foreground">Tritanomaly:</strong>{' '}
                  <span className="text-muted-foreground">Blue-weak</span>
                </div>
                <div>
                  <strong className="text-foreground">Achromatomaly:</strong>{' '}
                  <span className="text-muted-foreground">Partial color blindness</span>
                </div>
              </div>
            </div>
          </div>
        </SubSection>

        <SubSection id="guide-export" title="Exporting Themes">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The Export tab provides three format options:
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <Code2 className="w-6 h-6 text-brand-500 mb-3" />
                <h5 className="font-semibold text-foreground mb-2">
                  JSON Export
                </h5>
                <p className="text-sm text-muted-foreground">
                  Complete theme configuration as JSON. Can be imported back
                  into ThemeEditor or used programmatically.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <Settings className="w-6 h-6 text-brand-500 mb-3" />
                <h5 className="font-semibold text-foreground mb-2">
                  CSS Variables
                </h5>
                <p className="text-sm text-muted-foreground">
                  All theme tokens as CSS custom properties. Drop into any
                  :root selector for instant styling.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <Palette className="w-6 h-6 text-brand-500 mb-3" />
                <h5 className="font-semibold text-foreground mb-2">
                  Tailwind Config
                </h5>
                <p className="text-sm text-muted-foreground">
                  Theme colors formatted for Tailwind CSS configuration. Ready
                  to paste into tailwind.config.js.
                </p>
              </div>
            </div>
          </div>
        </SubSection>
      </section>

      {/* Theme Structure Section */}
      <section id="theme-structure" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Theme Structure
        </h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            A complete theme configuration includes multiple sections. The theme
            editor primarily focuses on colors and typography, but themes can
            include spacing, borders, shadows, animations, and component-specific
            overrides.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Color System</h4>
          <p>
            All colors are defined in HSL format (e.g., "239 84% 67%") without
            the <code>hsl()</code> wrapper. This allows for easy manipulation
            with CSS <code>calc()</code> and alpha channels.
          </p>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 not-prose">
            <pre className="text-sm font-mono">
              <code>{`{
  "colors": {
    "primary": "239 84% 67%",        // Brand color
    "primaryForeground": "0 0% 100%", // Text on primary
    "background": "0 0% 100%",        // Main background
    "foreground": "0 0% 9%",          // Main text
    "muted": "240 5% 96%",            // Secondary background
    "border": "240 6% 90%"            // Border color
    // ... 20+ more tokens
  }
}`}</code>
            </pre>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            10+ Built-in Presets
          </h4>
          <p>ThemeEditor includes professionally designed presets:</p>
          <ul className="space-y-2">
            <li>
              <strong>default / default-dark:</strong> Clean, professional with
              indigo accents
            </li>
            <li>
              <strong>neutral / neutral-dark:</strong> Minimal, monochrome
              (Linear-inspired)
            </li>
            <li>
              <strong>vibrant / vibrant-dark:</strong> Bold purple with pink
              accents
            </li>
            <li>
              <strong>high-contrast / high-contrast-dark:</strong> WCAG AAA
              compliant (7:1 contrast)
            </li>
            <li>
              <strong>ocean / forest / sunset:</strong> Nature-inspired color
              palettes
            </li>
          </ul>
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
          <p>
            ThemeEditor is designed with accessibility as a core feature:
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Keyboard Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd> -
              Navigate between controls
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">
                Arrow Keys
              </kbd>{' '}
              - Navigate between tabs (when tab is focused)
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Space</kbd> -{' '}
              Activate buttons and select options
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> -{' '}
              Activate focused elements
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">ARIA Support</h4>
          <ul className="space-y-2">
            <li>
              Tabs use proper <code>role="tablist"</code>,{' '}
              <code>role="tab"</code>, and <code>role="tabpanel"</code>
            </li>
            <li>
              Color pickers have <code>aria-label</code> descriptions
            </li>
            <li>
              Radio groups use <code>role="radiogroup"</code> and{' '}
              <code>aria-checked</code>
            </li>
            <li>
              Live regions announce important changes to screen readers
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Built-in Accessibility Testing
          </h4>
          <p>
            The Accessibility tab provides comprehensive testing tools to ensure
            your custom themes are accessible:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Contrast Ratio Checking:</strong> Real-time WCAG AA/AAA
              compliance badges
            </li>
            <li>
              <strong>Color Blindness Simulation:</strong> Preview your theme
              through 8 different types of color vision deficiency
            </li>
            <li>
              <strong>Accessibility Recommendations:</strong> Warnings when
              contrast ratios fall below WCAG standards
            </li>
          </ul>
        </div>
      </section>
    </DocumentationPage>
  )
}
