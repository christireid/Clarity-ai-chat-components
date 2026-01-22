import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import { ThemeProvider } from '@clarity-chat/react'
import {
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
 * Toast notification component
 */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {message}
      </div>
    </div>
  )
}

/**
 * Convert hex to HSL string for display
 */
function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Color input with label and dual hex/HSL display
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
  const hslValue =
    value.startsWith('#') && value.length === 7 ? hexToHSL(value) : 'N/A'

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium w-32">{label}</label>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-2 border-border"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm font-mono border border-input rounded bg-background text-foreground"
          placeholder="#000000"
          aria-label={`${label} hex value`}
        />
      </div>
      <div className="ml-[8.5rem] text-xs text-muted-foreground font-mono">
        HSL: {hslValue}
      </div>
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
  onCopySuccess,
}: {
  theme: CompleteThemeConfig
  onImport: (config: {
    brandColor: string
    radius: string
    preset: ModernThemePresetName
  }) => void
  onCopySuccess?: (message: string) => void
}) {
  const [activeTab, setActiveTab] = useState<'code' | 'css' | 'json'>('code')
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

  // Generate CSS variables
  const cssOutput = `:root {
  /* Primary Colors */
  --clarity-primary: ${theme.colors?.primary || '239 84% 56%'};
  --clarity-primary-foreground: ${theme.colors?.primaryForeground || '0 0% 100%'};

  /* Background & Foreground */
  --clarity-background: ${theme.colors?.background || '0 0% 100%'};
  --clarity-foreground: ${theme.colors?.foreground || '222 47% 11%'};

  /* Secondary & Accent */
  --clarity-secondary: ${theme.colors?.secondary || '240 5% 96%'};
  --clarity-secondary-foreground: ${theme.colors?.secondaryForeground || '222 47% 11%'};
  --clarity-accent: ${theme.colors?.accent || '240 5% 96%'};
  --clarity-accent-foreground: ${theme.colors?.accentForeground || '222 47% 11%'};

  /* Muted & Border */
  --clarity-muted: ${theme.colors?.muted || '240 5% 96%'};
  --clarity-muted-foreground: ${theme.colors?.mutedForeground || '240 4% 38%'};
  --clarity-border: ${theme.colors?.border || '240 6% 90%'};
  --clarity-input: ${theme.colors?.input || '240 6% 90%'};
  --clarity-ring: ${theme.colors?.ring || '239 84% 56%'};

  /* State Colors */
  --clarity-destructive: ${theme.colors?.destructive || '0 84% 50%'};
  --clarity-destructive-foreground: ${theme.colors?.destructiveForeground || '0 0% 100%'};
}`

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

  const getActiveContent = () => {
    switch (activeTab) {
      case 'code':
        return code
      case 'css':
        return cssOutput
      case 'json':
        return JSON.stringify(exportConfig, null, 2)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveContent())
      onCopySuccess?.(`${activeTab.toUpperCase()} copied to clipboard!`)
    } catch {
      console.warn('Clipboard API not available')
    }
  }

  const handleDownload = () => {
    const content = getActiveContent()
    const extensions = { code: 'tsx', css: 'css', json: 'json' }
    const mimeTypes = {
      code: 'text/typescript',
      css: 'text/css',
      json: 'application/json',
    }

    const blob = new Blob([content], { type: mimeTypes[activeTab] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-${theme.name || 'custom'}.${extensions[activeTab]}`
    a.click()
    URL.revokeObjectURL(url)
    onCopySuccess?.(`Downloaded as ${extensions[activeTab]}`)
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
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              Copy {activeTab.toUpperCase()}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted"
            >
              Download
            </button>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {(['code', 'css', 'json'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs text-foreground max-h-64">
          <code>{getActiveContent()}</code>
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
 * Default values for reset
 */
const DEFAULT_BRAND_COLOR = '#6366f1'
const DEFAULT_RADIUS = 'md' as const
const DEFAULT_PRESET = 'default' as ModernThemePresetName

/**
 * Main playground component
 */
function ThemePlaygroundInner() {
  const [brandColor, setBrandColor] = useState(DEFAULT_BRAND_COLOR)
  const [radius, setRadius] = useState<
    'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  >(DEFAULT_RADIUS)
  const [basePreset, setBasePreset] =
    useState<ModernThemePresetName>(DEFAULT_PRESET)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Show toast notification
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }

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
      color = DEFAULT_BRAND_COLOR // Default indigo when HSL can't be used in color picker
    }
    setBrandColor(color.startsWith('#') ? color : `#${color}`)
    setRadius(config.radius as 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full')
    setBasePreset(config.preset)
    showToast('Theme imported successfully!')
  }

  // Reset to defaults
  const handleReset = () => {
    setBrandColor(DEFAULT_BRAND_COLOR)
    setRadius(DEFAULT_RADIUS)
    setBasePreset(DEFAULT_PRESET)
    showToast('Reset to default theme')
  }

  // Check if current config differs from defaults
  const hasChanges =
    brandColor !== DEFAULT_BRAND_COLOR ||
    radius !== DEFAULT_RADIUS ||
    basePreset !== DEFAULT_PRESET

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
      <Toast message={toastMessage || ''} visible={!!toastMessage} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">
            Theme Playground
          </h1>
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm border border-border bg-background text-foreground rounded hover:bg-muted transition-colors"
            >
              Reset to Default
            </button>
          )}
        </div>
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

            <div className="pt-4 border-t border-border flex items-center justify-between">
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
                  onCopySuccess={showToast}
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
