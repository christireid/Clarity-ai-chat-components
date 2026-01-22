/**
 * Theme Selector Component
 *
 * UI component for selecting and switching between theme presets
 *
 * Accessibility features:
 * - Full keyboard navigation (Arrow keys, Home, End)
 * - Proper ARIA radiogroup pattern with roving tabindex
 * - Focus management
 */

'use client'

import * as React from 'react'
import { useTheme, type ThemePresetName } from '../../theme/ThemeProvider'
import { getAllThemes } from '../../theme/theme-builder'

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
 * - Full keyboard navigation (Arrow keys, Home, End)
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
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  const handleThemeSelect = React.useCallback(
    (themeName: ThemePresetName, focusTarget?: HTMLButtonElement | null) => {
      setPreset(themeName)
      onThemeChange?.(themeName)
      // Move focus to newly selected item (WAI-ARIA radiogroup pattern)
      if (focusTarget) {
        focusTarget.focus()
      }
    },
    [setPreset, onThemeChange]
  )

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const isHorizontal = orientation === 'horizontal'
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

      let newIndex = currentIndex

      switch (e.key) {
        case nextKey:
          e.preventDefault()
          newIndex = (currentIndex + 1) % allThemes.length
          break
        case prevKey:
          e.preventDefault()
          newIndex = (currentIndex - 1 + allThemes.length) % allThemes.length
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = allThemes.length - 1
          break
        default:
          return
      }

      const newTheme = allThemes[newIndex]
      if (newTheme) {
        const newButton = buttonRefs.current.get(newTheme.name)
        handleThemeSelect(newTheme.name, newButton)
      }
    },
    [orientation, allThemes, handleThemeSelect]
  )

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`theme-selector ${isHorizontal ? 'flex flex-row gap-2 overflow-x-auto' : 'flex flex-col gap-1'} ${className || ''}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {allThemes.map(({ name, metadata, config: _config }, index) => {
        const isActive = theme.preset === name

        return (
          <button
            key={name}
            ref={(el) => {
              if (el) buttonRefs.current.set(name, el)
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleThemeSelect(name)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              theme-option
              flex items-center gap-3 p-3 rounded-lg
              border transition-all duration-150 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isHorizontal ? 'flex-col min-w-[120px]' : 'flex-row'}
            `}
          >
            {showPreview && metadata.preview && (
              <div className="theme-preview flex gap-1 items-center">
                <div
                  className="w-8 h-8 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: metadata.preview.primaryColor }}
                  aria-hidden="true"
                />
                {!isHorizontal && (
                  <>
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-xs"
                      style={{
                        backgroundColor: metadata.preview.secondaryColor,
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-xs"
                      style={{
                        backgroundColor: metadata.preview.backgroundColor,
                      }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>
            )}

            <div
              className={`theme-info ${isHorizontal ? 'text-center' : 'flex-1'}`}
            >
              <div className="font-medium text-sm">{metadata.displayName}</div>
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
                aria-hidden="true"
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
 *
 * Accessibility features:
 * - Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
 * - Proper ARIA listbox pattern with aria-activedescendant
 * - Focus management and restoration
 */
export interface ThemeSelectorDropdownProps {
  className?: string
  onThemeChange?: (theme: ThemePresetName) => void
  /** Accessible label for the selector */
  'aria-label'?: string
}

export function ThemeSelectorDropdown({
  className,
  onThemeChange,
  'aria-label': ariaLabel = 'Select theme',
}: ThemeSelectorDropdownProps) {
  const { theme, setPreset } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const allThemes = React.useMemo(() => getAllThemes(), [])
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const listboxRef = React.useRef<HTMLDivElement>(null)
  const optionRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const listboxId = React.useId()

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }, [])

  const handleThemeSelect = React.useCallback(
    (themeName: ThemePresetName) => {
      setPreset(themeName)
      onThemeChange?.(themeName)
      handleClose()
    },
    [setPreset, onThemeChange, handleClose]
  )

  const handleToggle = React.useCallback(() => {
    if (!isOpen) {
      // Opening - set focus to currently selected item
      const selectedIndex = allThemes.findIndex((t) => t.name === theme.preset)
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
    setIsOpen(!isOpen)
  }, [isOpen, allThemes, theme.preset])

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) =>
            prev < allThemes.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(allThemes.length - 1)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && allThemes[focusedIndex]) {
            handleThemeSelect(allThemes[focusedIndex].name)
          }
          break
        case 'Tab':
          handleClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, allThemes, handleThemeSelect, handleClose])

  // Scroll focused item into view
  React.useEffect(() => {
    if (isOpen && focusedIndex >= 0 && allThemes[focusedIndex]) {
      const focusedOption = optionRefs.current.get(allThemes[focusedIndex].name)
      focusedOption?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, focusedIndex, allThemes])

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        listboxRef.current &&
        !listboxRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, handleClose])

  const currentTheme = allThemes.find((t) => t.name === theme.preset)

  // Get aria-activedescendant value
  const activeDescendant =
    isOpen && focusedIndex >= 0 && allThemes[focusedIndex]
      ? `${listboxId}-option-${allThemes[focusedIndex].name}`
      : undefined

  return (
    <div className={`theme-selector-dropdown relative ${className || ''}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="
          flex items-center justify-between gap-2
          px-4 py-2 rounded-lg
          border border-border
          bg-background
          hover:bg-accent
          transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        "
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-label={ariaLabel}
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
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dropdown menu */}
          <div
            ref={listboxRef}
            id={listboxId}
            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-popover border border-border/60 rounded-lg shadow-2xl backdrop-blur-sm
              max-h-96 overflow-y-auto
              focus:outline-none
            "
            role="listbox"
            aria-label={ariaLabel}
            tabIndex={-1}
          >
            {allThemes.map(({ name, metadata }, index) => {
              const isActive = theme.preset === name
              const isFocused = index === focusedIndex
              const optionId = `${listboxId}-option-${name}`

              return (
                <button
                  key={name}
                  id={optionId}
                  ref={(el) => {
                    if (el) optionRefs.current.set(name, el)
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleThemeSelect(name)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3
                    text-left transition-colors focus:outline-none
                    ${isActive ? 'bg-accent' : isFocused ? 'bg-accent/50' : 'hover:bg-accent/50'}
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {metadata.preview && (
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex-shrink-0"
                        style={{
                          backgroundColor: metadata.preview.primaryColor,
                        }}
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
                      aria-hidden="true"
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
