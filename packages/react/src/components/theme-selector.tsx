/**
 * Theme Selector Component
 * 
 * UI component for selecting and switching between theme presets
 */

import * as React from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { getAllThemes } from '../theme/theme-builder'
import type { ThemePresetName } from '../theme/presets'

export interface ThemeSelectorProps {
  /**
   * Show theme preview colors
   */
  showPreview?: boolean
  
  /**
   * Layout orientation
   */
  orientation?: 'horizontal' | 'vertical'
  
  /**
   * Custom className
   */
  className?: string
  
  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: ThemePresetName) => void
}

/**
 * Theme Selector - Choose from built-in theme presets
 * 
 * Features:
 * - Visual theme preview
 * - Horizontal or vertical layout
 * - Keyboard navigation
 * - Active theme indication
 * 
 * @example
 * ```tsx
 * <ThemeSelector 
 *   showPreview 
 *   orientation="vertical"
 *   onThemeChange={(theme) => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export function ThemeSelector({
  showPreview = true,
  orientation = 'vertical',
  className,
  onThemeChange,
}: ThemeSelectorProps) {
  const { theme, setPreset } = useTheme()
  const allThemes = React.useMemo(() => getAllThemes(), [])
  
  const handleThemeSelect = React.useCallback(
    (themeName: ThemePresetName) => {
      setPreset(themeName)
      onThemeChange?.(themeName)
    },
    [setPreset, onThemeChange]
  )
  
  const isHorizontal = orientation === 'horizontal'
  
  return (
    <div
      className={`theme-selector ${isHorizontal ? 'flex flex-row gap-2 overflow-x-auto' : 'flex flex-col gap-1'} ${className || ''}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {allThemes.map(({ name, metadata, config: _config }) => {
        const isActive = theme.preset === name
        
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => handleThemeSelect(name)}
            className={`
              theme-option
              flex items-center gap-3 p-3 rounded-lg
              border-2 transition-all
              ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isHorizontal ? 'flex-col min-w-[120px]' : 'flex-row'}
            `}
          >
            {showPreview && metadata.preview && (
              <div className="theme-preview flex gap-1 items-center">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: metadata.preview.primaryColor }}
                  aria-hidden="true"
                />
                {!isHorizontal && (
                  <>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: metadata.preview.secondaryColor }}
                      aria-hidden="true"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: metadata.preview.backgroundColor }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>
            )}
            
            <div className={`theme-info ${isHorizontal ? 'text-center' : 'flex-1'}`}>
              <div className="font-medium text-sm">
                {metadata.displayName}
              </div>
              {!isHorizontal && (
                <div className="text-xs text-muted-foreground">
                  {metadata.description}
                </div>
              )}
            </div>
            
            {isActive && (
              <svg
                className="w-5 h-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Selected"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Theme Selector Dropdown - Compact theme selector
 */
export interface ThemeSelectorDropdownProps {
  className?: string
  onThemeChange?: (theme: ThemePresetName) => void
}

export function ThemeSelectorDropdown({
  className,
  onThemeChange,
}: ThemeSelectorDropdownProps) {
  const { theme, setPreset } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const allThemes = React.useMemo(() => getAllThemes(), [])
  
  const handleThemeSelect = React.useCallback(
    (themeName: ThemePresetName) => {
      setPreset(themeName)
      setIsOpen(false)
      onThemeChange?.(themeName)
    },
    [setPreset, onThemeChange]
  )
  
  const currentTheme = allThemes.find(t => t.name === theme.preset)
  
  return (
    <div className={`theme-selector-dropdown relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between gap-2
          px-4 py-2 rounded-lg
          border border-border
          bg-background
          hover:bg-accent
          transition-colors
        "
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="font-medium text-sm">
          {currentTheme?.metadata.displayName || 'Select Theme'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown menu */}
          <div
            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-popover border border-border rounded-lg shadow-lg
              max-h-96 overflow-y-auto
            "
            role="listbox"
          >
            {allThemes.map(({ name, metadata }) => {
              const isActive = theme.preset === name
              
              return (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleThemeSelect(name)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3
                    text-left transition-colors
                    ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {metadata.preview && (
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: metadata.preview.primaryColor }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {metadata.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {metadata.description}
                      </div>
                    </div>
                  </div>
                  
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Selected"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
