/**
 * Theme Preview Component
 * 
 * Interactive theme preview and live editor
 */

import * as React from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { 
  getAllThemes, 
  hexToHsl, 
  hslToHex,
  // createTheme, // Reserved for future use
  validateTheme 
} from '../theme/theme-builder'
import type { CompleteThemeConfig } from '../theme/theme-config'
import type { ThemePresetName } from '../theme/presets'

export interface ThemePreviewProps {
  /**
   * Show editor controls
   */
  showEditor?: boolean
  
  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: CompleteThemeConfig) => void
  
  /**
   * Custom className
   */
  className?: string
}

/**
 * Theme Preview Component
 * 
 * Shows live preview of theme with editable colors
 * 
 * @example
 * ```tsx
 * <ThemePreview 
 *   showEditor
 *   onThemeChange={theme => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export function ThemePreview({
  showEditor = false,
  onThemeChange,
  className,
}: ThemePreviewProps) {
  const { resolvedTheme } = useTheme()
  const [localTheme, setLocalTheme] = React.useState<CompleteThemeConfig | null>(resolvedTheme)
  const [editMode, setEditMode] = React.useState(false)
  
  React.useEffect(() => {
    if (resolvedTheme) {
      setLocalTheme(resolvedTheme)
    }
  }, [resolvedTheme])
  
  const handleColorChange = React.useCallback((colorKey: string, hexValue: string) => {
    if (!localTheme) return
    
    const hslValue = hexToHsl(hexValue)
    const updatedTheme = {
      ...localTheme,
      colors: {
        ...localTheme.colors,
        [colorKey]: hslValue,
      },
    }
    
    setLocalTheme(updatedTheme)
    onThemeChange?.(updatedTheme)
  }, [localTheme, onThemeChange])
  
  if (!localTheme) return null
  
  return (
    <div className={`theme-preview ${className || ''}`}>
      {/* Preview Panel */}
      <div className="preview-panel space-y-4 p-6 rounded-lg border-2 border-border bg-background">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Theme Preview</h3>
          {showEditor && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1 text-sm rounded-md border border-border hover:bg-accent"
            >
              {editMode ? 'View Mode' : 'Edit Mode'}
            </button>
          )}
        </div>
        
        {/* Sample UI Components */}
        <div className="space-y-4">
          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">
              Destructive Button
            </button>
          </div>
          
          {/* Cards */}
          <div className="p-4 bg-card text-card-foreground rounded-lg border border-border">
            <h4 className="font-medium mb-2">Card Component</h4>
            <p className="text-sm text-muted-foreground">
              This is a sample card with muted text
            </p>
          </div>
          
          {/* Input */}
          <input
            type="text"
            placeholder="Sample input field"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring"
          />
          
          {/* Status Messages */}
          <div className="space-y-2">
            <div className="p-3 bg-success/10 text-success rounded-md border border-success/20">
              ✓ Success message
            </div>
            <div className="p-3 bg-warning/10 text-warning rounded-md border border-warning/20">
              ⚠ Warning message
            </div>
            <div className="p-3 bg-info/10 text-info rounded-md border border-info/20">
              ℹ Info message
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor Panel */}
      {showEditor && editMode && (
        <div className="editor-panel mt-6 p-6 rounded-lg border-2 border-border bg-card">
          <h3 className="text-lg font-semibold mb-4">Color Editor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(localTheme.colors).map(([key, value]) => {
              const hexValue = hslToHex(value)
              
              return (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={hexValue}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-border"
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={hexValue}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-background border border-input rounded font-mono"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => {
                if (localTheme) {
                  const validation = validateTheme(localTheme)
                  if (validation.warnings.length > 0) {
                    alert('Theme warnings:\n' + validation.warnings.join('\n'))
                  } else {
                    alert('Theme is valid!')
                  }
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Validate Theme
            </button>
            <button
              onClick={() => {
                if (localTheme) {
                  const json = JSON.stringify(localTheme, null, 2)
                  navigator.clipboard.writeText(json)
                  alert('Theme copied to clipboard!')
                }
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
            >
              Export Theme
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Theme Comparison Component
 * 
 * Compare two themes side by side
 */
export interface ThemeComparisonProps {
  theme1: ThemePresetName
  theme2: ThemePresetName
  className?: string
}

export function ThemeComparison({ theme1, theme2, className }: ThemeComparisonProps) {
  const allThemes = React.useMemo(() => getAllThemes(), [])
  const themeConfig1 = allThemes.find(t => t.name === theme1)
  const themeConfig2 = allThemes.find(t => t.name === theme2)
  
  if (!themeConfig1 || !themeConfig2) return null
  
  return (
    <div className={`theme-comparison grid grid-cols-2 gap-4 ${className || ''}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2">{themeConfig1.metadata.displayName}</h3>
        <ThemePreview />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{themeConfig2.metadata.displayName}</h3>
        <ThemePreview />
      </div>
    </div>
  )
}
