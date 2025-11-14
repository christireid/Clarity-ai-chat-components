import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Preview Component | Clarity Chat',
  description: 'Interactive theme preview and live editor for testing and customizing theme colors with real-time visual feedback.',
  keywords: [
    'theme preview',
    'theme editor',
    'color customization',
    'live preview',
    'theme builder',
    'theme comparison',
    'color picker',
    'theme validation',
    'clarity chat',
    'react component',
  ],
}

export default function ThemePreviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Theme Preview</h1>
      <p className="text-xl text-muted-foreground mb-8">
        An interactive theme preview and live editor component for testing and customizing 
        theme colors with real-time visual feedback across all UI elements.
      </p>

      {/* Overview Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Theme Preview component provides a comprehensive live preview of theme appearance 
          with sample UI elements including buttons, cards, inputs, and status messages. It 
          includes an optional interactive editor for customizing colors with color pickers, 
          hex value inputs, theme validation, and export functionality. The component also 
          supports side-by-side theme comparison.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Live preview panel with sample UI components (buttons, cards, inputs, status messages)</li>
          <li>Interactive color editor with color pickers and hex value inputs</li>
          <li>Real-time theme updates with immediate visual feedback</li>
          <li>Theme validation to check color contrast and accessibility</li>
          <li>Export functionality to copy theme JSON to clipboard</li>
          <li>Edit mode toggle to switch between view and edit modes</li>
          <li>HSL to Hex color conversion for editing compatibility</li>
          <li>Theme comparison component for side-by-side theme testing</li>
          <li>Integration with useTheme hook for current theme access</li>
          <li>Callback support for theme change notifications</li>
        </ul>
      </section>

      {/* Installation Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Installation</h2>
        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm">
            npm install @clarity-chat/react
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Requires ThemeProvider wrapper and theme configuration.
        </p>
      </section>

      {/* Basic Usage Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemePreview } from '@clarity-chat/react'
import { ThemeProvider } from '@clarity-chat/react/theme'

function App() {
  return (
    <ThemeProvider>
      {/* Basic preview */}
      <ThemePreview />
      
      {/* With editor controls */}
      <ThemePreview 
        showEditor
        onThemeChange={(theme) => {
          console.log('Theme updated:', theme)
        }}
      />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Props API Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props API</h2>
        
        <h3 className="text-xl font-semibold mb-3">ThemePreview</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">showEditor</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2 font-mono text-sm">false</td>
                <td className="p-2">Show interactive color editor with controls</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onThemeChange</td>
                <td className="p-2 font-mono text-sm">(theme) =&gt; void</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Callback when theme colors are modified</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">''</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3">ThemeComparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Required</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">theme1</td>
                <td className="p-2 font-mono text-sm">ThemePresetName</td>
                <td className="p-2">Yes</td>
                <td className="p-2">First theme to compare</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">theme2</td>
                <td className="p-2 font-mono text-sm">ThemePresetName</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Second theme to compare</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">No</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Definitions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Type Definitions</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`interface ThemePreviewProps {
  showEditor?: boolean
  onThemeChange?: (theme: CompleteThemeConfig) => void
  className?: string
}

interface ThemeComparisonProps {
  theme1: ThemePresetName
  theme2: ThemePresetName
  className?: string
}

// Theme preset names
type ThemePresetName = 
  | 'light' 
  | 'dark' 
  | 'midnight'
  | 'solarized'
  | 'nord'
  // ... and more

// Complete theme configuration
interface CompleteThemeConfig {
  metadata: {
    name: string
    displayName: string
    description: string
    author?: string
    version?: string
  }
  colors: {
    // Base colors
    background: string    // HSL format
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    
    // Primary colors
    primary: string
    primaryForeground: string
    
    // Secondary colors
    secondary: string
    secondaryForeground: string
    
    // Muted colors
    muted: string
    mutedForeground: string
    
    // Accent colors
    accent: string
    accentForeground: string
    
    // Status colors
    destructive: string
    destructiveF foreground: string
    success: string
    warning: string
    info: string
    
    // Border colors
    border: string
    input: string
    ring: string
  }
  // ... additional theme properties
}`}</code>
          </pre>
        </div>
      </section>

      {/* Theme Builder Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Theme Builder Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemePreview } from '@clarity-chat/react'
import { ThemeProvider } from '@clarity-chat/react/theme'
import { useState } from 'react'

function ThemeBuilder() {
  const [customTheme, setCustomTheme] = useState(null)
  const [saveEnabled, setSaveEnabled] = useState(false)

  const handleThemeChange = (theme) => {
    setCustomTheme(theme)
    setSaveEnabled(true)
  }

  const saveTheme = async () => {
    if (!customTheme) return

    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customTheme.metadata.name,
          config: customTheme
        })
      })

      if (response.ok) {
        alert('Theme saved successfully!')
        setSaveEnabled(false)
      }
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Failed to save theme')
    }
  }

  return (
    <ThemeProvider>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Theme Builder</h1>
          
          <div className="flex gap-2">
            <button
              onClick={saveTheme}
              disabled={!saveEnabled}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              Save Theme
            </button>
            <button
              onClick={() => {
                if (customTheme) {
                  const json = JSON.stringify(customTheme, null, 2)
                  const blob = new Blob([json], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = \`\${customTheme.metadata.name}.json\`
                  a.click()
                }
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
            >
              Download JSON
            </button>
          </div>
        </div>

        <ThemePreview 
          showEditor
          onThemeChange={handleThemeChange}
        />

        {customTheme && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Theme Info</h3>
            <div className="text-sm space-y-1">
              <p>Name: {customTheme.metadata.name}</p>
              <p>Display Name: {customTheme.metadata.displayName}</p>
              <p>Colors: {Object.keys(customTheme.colors).length}</p>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Settings Page Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Settings Page Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemePreview } from '@clarity-chat/react'
import { useTheme } from '@clarity-chat/react/theme'
import { useState } from 'react'

function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [showCustomization, setShowCustomization] = useState(false)

  return (
    <div className="settings-page">
      <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>

      {/* Theme selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Choose Theme
        </label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="midnight">Midnight</option>
          <option value="solarized">Solarized</option>
        </select>
      </div>

      {/* Customization toggle */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showCustomization}
            onChange={(e) => setShowCustomization(e.target.checked)}
          />
          <span className="text-sm">Enable theme customization</span>
        </label>
      </div>

      {/* Theme preview */}
      <div className="border rounded-lg p-6">
        <ThemePreview 
          showEditor={showCustomization}
          onThemeChange={(newTheme) => {
            console.log('Theme customized:', newTheme)
            // Optionally save to user preferences
          }}
        />
      </div>
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Theme Comparison Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Theme Comparison Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemeComparison } from '@clarity-chat/react'
import { ThemeProvider } from '@clarity-chat/react/theme'
import { useState } from 'react'

function ThemeShowcase() {
  const [theme1, setTheme1] = useState('light')
  const [theme2, setTheme2] = useState('dark')

  const themeOptions = [
    'light',
    'dark',
    'midnight',
    'solarized',
    'nord',
    'dracula',
    'monokai'
  ]

  return (
    <ThemeProvider>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Theme Comparison</h1>

        {/* Theme selectors */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              First Theme
            </label>
            <select
              value={theme1}
              onChange={(e) => setTheme1(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              {themeOptions.map(name => (
                <option key={name} value={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Second Theme
            </label>
            <select
              value={theme2}
              onChange={(e) => setTheme2(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              {themeOptions.map(name => (
                <option key={name} value={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <ThemeComparison 
          theme1={theme1}
          theme2={theme2}
        />

        {/* Quick comparison guide */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Comparison Tips</h3>
          <ul className="text-sm space-y-1">
            <li>• Compare contrast ratios for readability</li>
            <li>• Check color accessibility for different vision types</li>
            <li>• Test both themes with your UI components</li>
            <li>• Consider user preferences and brand guidelines</li>
          </ul>
        </div>
      </div>
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Custom Theme Import Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Custom Theme Import Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemePreview } from '@clarity-chat/react'
import { ThemeProvider } from '@clarity-chat/react/theme'
import { useState } from 'react'

function ThemeImporter() {
  const [importedTheme, setImportedTheme] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result as string)
        
        // Validate theme structure
        if (!json.metadata || !json.colors) {
          throw new Error('Invalid theme format')
        }

        setImportedTheme(json)
        setError(null)
      } catch (err) {
        setError('Failed to parse theme file')
        console.error(err)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Import Custom Theme</h1>

      {/* File upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Upload Theme JSON
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold"
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Preview imported theme */}
      {importedTheme ? (
        <ThemeProvider theme={importedTheme}>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Imported: {importedTheme.metadata.displayName}
            </h2>
            <ThemePreview 
              showEditor
              onThemeChange={(theme) => {
                setImportedTheme(theme)
              }}
            />

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  // Apply theme permanently
                  localStorage.setItem('custom-theme', JSON.stringify(importedTheme))
                  alert('Theme saved!')
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Apply Theme
              </button>
              <button
                onClick={() => {
                  setImportedTheme(null)
                  setError(null)
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              >
                Clear
              </button>
            </div>
          </div>
        </ThemeProvider>
      ) : (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Upload a theme JSON file to preview
          </p>
        </div>
      )}
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* TypeScript Support Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">TypeScript Support</h2>
        <p className="text-muted-foreground mb-4">
          The component is fully typed with comprehensive TypeScript definitions:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import type { 
  ThemePreviewProps,
  ThemeComparisonProps,
  CompleteThemeConfig
} from '@clarity-chat/react'
import { ThemePreview, ThemeComparison } from '@clarity-chat/react'

// Type-safe theme preview
const preview Props: ThemePreviewProps = {
  showEditor: true,
  onThemeChange: (theme: CompleteThemeConfig) => {
    console.log('Theme colors:', theme.colors)
    console.log('Theme metadata:', theme.metadata)
  },
  className: 'custom-preview'
}

function TypedThemePreview() {
  const [theme, setTheme] = useState<CompleteThemeConfig | null>(null)

  return (
    <ThemePreview
      {...previewProps}
      onThemeChange={(newTheme) => {
        setTheme(newTheme)
        // Type inference works automatically
        const primaryColor = newTheme.colors.primary
        const themeName = newTheme.metadata.name
      }}
    />
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility</h2>
        <p className="text-muted-foreground mb-4">
          The Theme Preview component implements accessibility features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Semantic HTML:</strong> Proper heading hierarchy and labeled form controls</li>
          <li><strong>Color Pickers:</strong> Native input type="color" with keyboard support</li>
          <li><strong>Text Inputs:</strong> Hex values editable via text input for precise control</li>
          <li><strong>Validation:</strong> Built-in theme validation for color contrast issues</li>
          <li><strong>Focus Management:</strong> Keyboard navigation through editor controls</li>
          <li><strong>Labels:</strong> All color inputs have descriptive labels</li>
          <li><strong>Preview Samples:</strong> Sample UI shows real accessibility impact</li>
        </ul>
      </section>

      {/* Styling Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Styling</h2>
        <p className="text-muted-foreground mb-4">
          Customize the appearance using the className prop:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { ThemePreview } from '@clarity-chat/react'

function StyledThemePreview() {
  return (
    <ThemePreview
      showEditor
      className="custom-theme-preview"
    />
  )
}

/* Custom CSS */
.custom-theme-preview {
  max-width: 1200px;
  margin: 0 auto;
}

.custom-theme-preview .preview-panel {
  background: linear-gradient(to bottom, #f0f9ff, #ffffff);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-theme-preview .editor-panel {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
}

.custom-theme-preview input[type="color"] {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.custom-theme-preview input[type="color"]:hover {
  transform: scale(1.05);
}`}</code>
          </pre>
        </div>
      </section>

      {/* Related Components Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Theme Selector:</strong> Dropdown for choosing theme presets</li>
          <li><strong>Theme Switcher:</strong> Toggle between light and dark themes</li>
          <li><strong>Settings Panel:</strong> Configure application preferences</li>
          <li><strong>Color Picker:</strong> Standalone color selection component</li>
        </ul>
      </section>

      {/* Best Practices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Always validate themes before saving to ensure color contrast compliance</li>
          <li>Provide export functionality so users can backup their custom themes</li>
          <li>Show sample UI elements that represent your actual application components</li>
          <li>Include status messages in preview to test warning/error/success colors</li>
          <li>Use onThemeChange callback to auto-save changes or mark as unsaved</li>
          <li>Implement theme comparison to help users choose between options</li>
          <li>Test custom themes with different content lengths and edge cases</li>
          <li>Store custom themes in user preferences or local storage</li>
          <li>Provide preset themes as starting points for customization</li>
          <li>Show theme metadata (name, author, version) in preview</li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Use Cases</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Theme Builder Tool</h3>
            <p className="text-muted-foreground">
              Create a dedicated theme builder page where users can create, customize, 
              and export custom themes with live preview of all changes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
            <p className="text-muted-foreground">
              Include theme preview in application settings to let users test and 
              customize appearance before applying changes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Documentation Site</h3>
            <p className="text-muted-foreground">
              Show theme preview on documentation pages to demonstrate theme system 
              capabilities and help developers test integration.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Brand Customization</h3>
            <p className="text-muted-foreground">
              Allow enterprise clients to create branded themes matching their corporate 
              identity with live preview of brand colors.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Theme Marketplace</h3>
            <p className="text-muted-foreground">
              Use theme comparison to showcase different theme options in a marketplace, 
              helping users choose themes that fit their preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use React.memo to prevent unnecessary re-renders of preview samples</li>
          <li>Debounce theme change callbacks to avoid excessive API calls</li>
          <li>Memoize color conversion functions (hexToHsl, hslToHex)</li>
          <li>Lazy load the theme editor panel only when showEditor is true</li>
          <li>Cache validated theme results to avoid repeated validation</li>
          <li>Use CSS variables for theme colors for efficient updates</li>
          <li>Implement virtual scrolling if displaying many theme presets</li>
          <li>Optimize color picker rendering with requestAnimationFrame</li>
        </ul>
      </section>

      {/* Footer Navigation */}
      <footer className="mt-16 pt-8 border-t">
        <div className="flex justify-between items-center">
          <a href="/reference/components" className="text-primary hover:underline">
            ← Back to Components
          </a>
          <a href="/reference/components/theme-selector" className="text-primary hover:underline">
            Next: Theme Selector →
          </a>
        </div>
      </footer>
    </div>
  )
}
