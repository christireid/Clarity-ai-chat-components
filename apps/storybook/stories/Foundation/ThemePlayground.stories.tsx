import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState, useCallback } from 'react'
import {
  ThemeProvider,
  createTheme,
  useTheme,
  ThemeContrastChecker,
  getThemeCSS,
  type CompleteThemeConfig,
} from '@clarity-chat/react'

const meta: Meta = {
  title: 'Foundation/Theme Playground',
  parameters: {
    docs: {
      description: {
        component: `
# Interactive Theme Playground

Create and customize themes in real-time. Adjust colors, border radius, and see live previews of your changes. Export your custom theme as code.

## Features

- **Live Color Editing** - Pick colors and see changes instantly
- **Preset Starting Points** - Begin with any of our 8 built-in themes
- **Accessibility Checking** - Verify WCAG contrast compliance
- **Code Export** - Get your custom theme as copy-paste code
- **Dark Mode Preview** - Toggle between light and dark variants
        `,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/**
 * Color input with label
 */
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium w-32">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border-2 border-gray-300"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 text-sm font-mono border rounded"
        placeholder="#000000"
      />
    </div>
  )
}

/**
 * Radius selector
 */
function RadiusSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full') => void
}) {
  const options = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium w-32">Border Radius</label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              value === opt
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Preset selector
 */
function PresetSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const presets = [
    'default',
    'default-dark',
    'neutral',
    'neutral-dark',
    'vibrant',
    'vibrant-dark',
    'high-contrast',
    'high-contrast-dark',
  ]
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium w-32">Base Preset</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded bg-background"
      >
        {presets.map((preset) => (
          <option key={preset} value={preset}>
            {preset.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Sample UI components to preview the theme
 */
function ThemePreviewUI() {
  return (
    <div className="space-y-6 p-6 bg-background text-foreground rounded-lg border">
      <h3 className="text-xl font-bold">Live Preview</h3>

      {/* Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Buttons</p>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Primary
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Secondary
          </button>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Destructive
          </button>
          <button className="px-4 py-2 border border-border bg-background text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
            Outline
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Cards</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card text-card-foreground rounded-lg border">
            <h4 className="font-semibold mb-1">Card Title</h4>
            <p className="text-sm text-muted-foreground">
              This is a card component with muted text.
            </p>
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">
            <h4 className="font-semibold mb-1">Accent Card</h4>
            <p className="text-sm opacity-80">
              This uses the accent color palette.
            </p>
          </div>
        </div>
      </div>

      {/* Message bubbles */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Chat Bubbles
        </p>
        <div className="space-y-3">
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-2 bg-primary text-primary-foreground rounded-2xl rounded-br-md">
              Hey! This is a user message.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 bg-muted text-foreground rounded-2xl rounded-bl-md">
              This is an assistant response with some helpful information.
            </div>
          </div>
        </div>
      </div>

      {/* Form elements */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Form Elements
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Input field..."
            className="flex-1 px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Code export panel
 */
function CodeExport({ theme }: { theme: CompleteThemeConfig }) {
  const [copied, setCopied] = useState(false)

  const code = `import { createTheme } from '@clarity-chat/react'

const customTheme = createTheme({
  extends: '${theme.mode === 'dark' ? 'default-dark' : 'default'}',
  brandColor: '${theme.colors?.primary ? `hsl(${theme.colors.primary})` : '#6366f1'}',
  name: 'custom-theme',
})

// Use in your app:
<ThemeProvider defaultTheme={customTheme}>
  <YourApp />
</ThemeProvider>`

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Export Code</p>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Main playground component
 */
function ThemePlaygroundInner() {
  const { resolvedTheme } = useTheme()
  const [brandColor, setBrandColor] = useState('#6366f1')
  const [accentColor, setAccentColor] = useState('#ec4899')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [radius, setRadius] = useState<
    'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  >('md')
  const [basePreset, setBasePreset] = useState('default')
  const [showAccessibility, setShowAccessibility] = useState(false)

  // Create custom theme
  const customTheme = React.useMemo(() => {
    return createTheme({
      extends: basePreset as any,
      brandColor,
      radius,
      name: 'playground-theme',
    })
  }, [brandColor, radius, basePreset])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Theme Playground</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Customize and preview your theme in real-time
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold">Theme Settings</h2>

            <PresetSelector value={basePreset} onChange={setBasePreset} />
            <ColorInput
              label="Brand Color"
              value={brandColor}
              onChange={setBrandColor}
            />
            <ColorInput
              label="Accent Color"
              value={accentColor}
              onChange={setAccentColor}
            />
            <RadiusSelector value={radius} onChange={setRadius} />

            <div className="pt-4 border-t">
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="text-sm text-primary hover:underline"
              >
                {showAccessibility ? 'Hide' : 'Show'} Accessibility Report
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <ThemeProvider defaultTheme={customTheme}>
              <ThemePreviewUI />

              {showAccessibility && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <ThemeContrastChecker showDetails showOnlyFailing={false} />
                </div>
              )}

              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                <CodeExport theme={customTheme} />
              </div>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Playground wrapper with theme context
 */
function ThemePlayground() {
  return (
    <ThemeProvider>
      <ThemePlaygroundInner />
    </ThemeProvider>
  )
}

/**
 * Interactive Theme Playground
 *
 * Create custom themes with live preview, accessibility checking, and code export.
 */
export const Playground: Story = {
  render: () => <ThemePlayground />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
  },
}

/**
 * Contrast Checker Only
 *
 * Standalone accessibility checker for analyzing theme contrast ratios.
 */
export const AccessibilityChecker: Story = {
  render: () => (
    <ThemeProvider>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Theme Accessibility Checker</h1>
        <ThemeContrastChecker showDetails />
      </div>
    </ThemeProvider>
  ),
}

/**
 * Dark Theme Playground
 *
 * Start with a dark theme base for your customizations.
 */
export const DarkThemePlayground: Story = {
  render: () => (
    <ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
      <ThemePlaygroundInner />
    </ThemeProvider>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
