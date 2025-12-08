import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  ThemeContrastChecker,
  type CompleteThemeConfig,
  type ModernThemePresetName,
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
        className="w-10 h-10 rounded cursor-pointer border-2 border-border"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 text-sm font-mono border border-input rounded bg-background text-foreground"
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
  value: ModernThemePresetName
  onChange: (value: ModernThemePresetName) => void
}) {
  const presets: ModernThemePresetName[] = [
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
      <label className="text-sm font-medium w-32" id="preset-label">
        Base Preset
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModernThemePresetName)}
        className="flex-1 px-3 py-2 border rounded bg-background"
        aria-labelledby="preset-label"
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
 * Theme export/import panel
 */
function ThemeExportImport({
  theme,
  onImport,
}: {
  theme: CompleteThemeConfig
  onImport: (config: {
    brandColor: string
    radius: string
    preset: ModernThemePresetName
  }) => void
}) {
  const [copied, setCopied] = useState<'code' | 'json' | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importValue, setImportValue] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

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

  // Create exportable JSON config
  const exportConfig = {
    brandColor: theme.colors?.primary
      ? `hsl(${theme.colors.primary})`
      : '#6366f1',
    radius: 'md',
    preset: theme.mode === 'dark' ? 'default-dark' : 'default',
    name: theme.name,
    exportedAt: new Date().toISOString(),
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied('code')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback for older browsers or insecure contexts
      console.warn('Clipboard API not available')
    }
  }

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportConfig, null, 2))
      setCopied('json')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback for older browsers or insecure contexts
      console.warn('Clipboard API not available')
    }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(exportConfig, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-${theme.name || 'custom'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      const config = JSON.parse(importValue)
      if (config.brandColor && config.preset) {
        onImport({
          brandColor: config.brandColor.replace('hsl(', '').replace(')', ''),
          radius: config.radius || 'md',
          preset: config.preset as ModernThemePresetName,
        })
        setShowImport(false)
        setImportValue('')
        setImportError(null)
      } else {
        setImportError('Invalid theme config: missing brandColor or preset')
      }
    } catch {
      setImportError('Invalid JSON format')
    }
  }

  return (
    <div className="space-y-4">
      {/* Export Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Export Theme</p>
          <div className="flex gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              {copied === 'code' ? '✓ Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleCopyJSON}
              className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted"
            >
              {copied === 'json' ? '✓ Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted"
            >
              Download
            </button>
          </div>
        </div>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs text-foreground">
          <code>{code}</code>
        </pre>
      </div>

      {/* Import Section */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Import Theme</p>
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-sm text-primary hover:underline"
          >
            {showImport ? 'Cancel' : 'Import JSON'}
          </button>
        </div>

        {showImport && (
          <div className="space-y-2">
            <textarea
              value={importValue}
              onChange={(e) => {
                setImportValue(e.target.value)
                setImportError(null)
              }}
              placeholder='Paste theme JSON here...\n{"brandColor": "#6366f1", "preset": "default", "radius": "md"}'
              className="w-full h-24 p-3 text-xs font-mono border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
            {importError && (
              <p className="text-xs text-destructive">{importError}</p>
            )}
            <button
              onClick={handleImport}
              disabled={!importValue.trim()}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
            >
              Apply Imported Theme
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Main playground component
 */
function ThemePlaygroundInner() {
  const [brandColor, setBrandColor] = useState('#6366f1')
  const [radius, setRadius] = useState<
    'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  >('md')
  const [basePreset, setBasePreset] = useState<ModernThemePresetName>('default')
  const [showAccessibility, setShowAccessibility] = useState(false)

  // Handle theme import
  const handleImport = (config: {
    brandColor: string
    radius: string
    preset: ModernThemePresetName
  }) => {
    // Normalize brand color - accept hex colors only for the color picker
    let color = config.brandColor
    // If it's an HSL value (from a previous export), default to the hex
    if (color.includes('%') || color.includes(' ')) {
      color = '#6366f1' // Default indigo when HSL can't be used in color picker
    }
    setBrandColor(color.startsWith('#') ? color : `#${color}`)
    setRadius(config.radius as 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full')
    setBasePreset(config.preset)
  }

  // Create custom theme
  const customTheme = React.useMemo(() => {
    return createTheme({
      extends: basePreset,
      brandColor,
      radius,
      name: 'playground-theme',
    })
  }, [brandColor, radius, basePreset])

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Theme Playground
        </h1>
        <p className="text-muted-foreground mb-8">
          Customize and preview your theme in real-time
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border">
            <h2 className="text-lg font-semibold">Theme Settings</h2>

            <PresetSelector value={basePreset} onChange={setBasePreset} />
            <ColorInput
              label="Brand Color"
              value={brandColor}
              onChange={setBrandColor}
            />
            <RadiusSelector value={radius} onChange={setRadius} />

            <div className="pt-4 border-t border-border">
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
                <div className="p-4 bg-card text-card-foreground rounded-xl shadow-sm border border-border">
                  <ThemeContrastChecker showDetails showOnlyFailing={false} />
                </div>
              )}

              <div className="p-4 bg-card text-card-foreground rounded-xl shadow-sm border border-border">
                <ThemeExportImport
                  theme={customTheme}
                  onImport={handleImport}
                />
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
