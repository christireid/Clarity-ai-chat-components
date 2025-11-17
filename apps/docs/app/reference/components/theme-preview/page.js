import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
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
};
export default function ThemePreviewPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Theme Preview" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "An interactive theme preview and live editor component for testing and customizing theme colors with real-time visual feedback across all UI elements." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Overview" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Theme Preview component provides a comprehensive live preview of theme appearance with sample UI elements including buttons, cards, inputs, and status messages. It includes an optional interactive editor for customizing colors with color pickers, hex value inputs, theme validation, and export functionality. The component also supports side-by-side theme comparison." }), _jsx("h3", { className: "text-xl font-semibold mb-3 mt-6", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Live preview panel with sample UI components (buttons, cards, inputs, status messages)" }), _jsx("li", { children: "Interactive color editor with color pickers and hex value inputs" }), _jsx("li", { children: "Real-time theme updates with immediate visual feedback" }), _jsx("li", { children: "Theme validation to check color contrast and accessibility" }), _jsx("li", { children: "Export functionality to copy theme JSON to clipboard" }), _jsx("li", { children: "Edit mode toggle to switch between view and edit modes" }), _jsx("li", { children: "HSL to Hex color conversion for editing compatibility" }), _jsx("li", { children: "Theme comparison component for side-by-side theme testing" }), _jsx("li", { children: "Integration with useTheme hook for current theme access" }), _jsx("li", { children: "Callback support for theme change notifications" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Installation" }), _jsx("div", { className: "bg-muted p-4 rounded-lg", children: _jsx("code", { className: "text-sm", children: "npm install @clarity-chat/react" }) }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Requires ThemeProvider wrapper and theme configuration." })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemePreview } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props API" }), _jsx("h3", { className: "text-xl font-semibold mb-3", children: "ThemePreview" }), _jsx("div", { className: "overflow-x-auto mb-6", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "showEditor" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "false" }), _jsx("td", { className: "p-2", children: "Show interactive color editor with controls" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onThemeChange" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(theme) => void" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Callback when theme colors are modified" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "''" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) }), _jsx("h3", { className: "text-xl font-semibold mb-3", children: "ThemeComparison" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Required" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "theme1" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "ThemePresetName" }), _jsx("td", { className: "p-2", children: "Yes" }), _jsx("td", { className: "p-2", children: "First theme to compare" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "theme2" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "ThemePresetName" }), _jsx("td", { className: "p-2", children: "Yes" }), _jsx("td", { className: "p-2", children: "Second theme to compare" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "No" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Type Definitions" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `interface ThemePreviewProps {
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Theme Builder Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemePreview } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Settings Page Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemePreview } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Theme Comparison Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemeComparison } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Custom Theme Import Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemePreview } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "TypeScript Support" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The component is fully typed with comprehensive TypeScript definitions:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import type { 
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Accessibility" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Theme Preview component implements accessibility features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Semantic HTML:" }), " Proper heading hierarchy and labeled form controls"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color Pickers:" }), " Native input type=\"color\" with keyboard support"] }), _jsxs("li", { children: [_jsx("strong", { children: "Text Inputs:" }), " Hex values editable via text input for precise control"] }), _jsxs("li", { children: [_jsx("strong", { children: "Validation:" }), " Built-in theme validation for color contrast issues"] }), _jsxs("li", { children: [_jsx("strong", { children: "Focus Management:" }), " Keyboard navigation through editor controls"] }), _jsxs("li", { children: [_jsx("strong", { children: "Labels:" }), " All color inputs have descriptive labels"] }), _jsxs("li", { children: [_jsx("strong", { children: "Preview Samples:" }), " Sample UI shows real accessibility impact"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Styling" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Customize the appearance using the className prop:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemePreview } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Theme Selector:" }), " Dropdown for choosing theme presets"] }), _jsxs("li", { children: [_jsx("strong", { children: "Theme Switcher:" }), " Toggle between light and dark themes"] }), _jsxs("li", { children: [_jsx("strong", { children: "Settings Panel:" }), " Configure application preferences"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color Picker:" }), " Standalone color selection component"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Always validate themes before saving to ensure color contrast compliance" }), _jsx("li", { children: "Provide export functionality so users can backup their custom themes" }), _jsx("li", { children: "Show sample UI elements that represent your actual application components" }), _jsx("li", { children: "Include status messages in preview to test warning/error/success colors" }), _jsx("li", { children: "Use onThemeChange callback to auto-save changes or mark as unsaved" }), _jsx("li", { children: "Implement theme comparison to help users choose between options" }), _jsx("li", { children: "Test custom themes with different content lengths and edge cases" }), _jsx("li", { children: "Store custom themes in user preferences or local storage" }), _jsx("li", { children: "Provide preset themes as starting points for customization" }), _jsx("li", { children: "Show theme metadata (name, author, version) in preview" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Use Cases" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Theme Builder Tool" }), _jsx("p", { className: "text-muted-foreground", children: "Create a dedicated theme builder page where users can create, customize, and export custom themes with live preview of all changes." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Settings Panel" }), _jsx("p", { className: "text-muted-foreground", children: "Include theme preview in application settings to let users test and customize appearance before applying changes." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Documentation Site" }), _jsx("p", { className: "text-muted-foreground", children: "Show theme preview on documentation pages to demonstrate theme system capabilities and help developers test integration." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Brand Customization" }), _jsx("p", { className: "text-muted-foreground", children: "Allow enterprise clients to create branded themes matching their corporate identity with live preview of brand colors." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Theme Marketplace" }), _jsx("p", { className: "text-muted-foreground", children: "Use theme comparison to showcase different theme options in a marketplace, helping users choose themes that fit their preferences." })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Performance Tips" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Use React.memo to prevent unnecessary re-renders of preview samples" }), _jsx("li", { children: "Debounce theme change callbacks to avoid excessive API calls" }), _jsx("li", { children: "Memoize color conversion functions (hexToHsl, hslToHex)" }), _jsx("li", { children: "Lazy load the theme editor panel only when showEditor is true" }), _jsx("li", { children: "Cache validated theme results to avoid repeated validation" }), _jsx("li", { children: "Use CSS variables for theme colors for efficient updates" }), _jsx("li", { children: "Implement virtual scrolling if displaying many theme presets" }), _jsx("li", { children: "Optimize color picker rendering with requestAnimationFrame" })] })] }), _jsx("footer", { className: "mt-16 pt-8 border-t", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("a", { href: "/reference/components", className: "text-primary hover:underline", children: "\u2190 Back to Components" }), _jsx("a", { href: "/reference/components/theme-selector", className: "text-primary hover:underline", children: "Next: Theme Selector \u2192" })] }) })] }));
}
//# sourceMappingURL=page.js.map