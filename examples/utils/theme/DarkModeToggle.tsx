'use client'

/**
 * Dark Mode Toggle Component
 *
 * A reusable dark mode toggle for chat applications.
 * Persists preference to localStorage and respects system preferences.
 */

import { useState, useEffect, useCallback } from 'react'

// ============================================================================
// Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system'

export interface DarkModeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  defaultMode?: ThemeMode
  storageKey?: string
  onChange?: (mode: ThemeMode, isDark: boolean) => void
}

// ============================================================================
// Hook
// ============================================================================

export interface UseDarkModeOptions {
  defaultMode?: ThemeMode
  storageKey?: string
  onChange?: (isDark: boolean) => void
}

export interface UseDarkModeReturn {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export function useDarkMode(
  options: UseDarkModeOptions = {}
): UseDarkModeReturn {
  const {
    defaultMode = 'system',
    storageKey = 'theme-mode',
    onChange,
  } = options

  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [isDark, setIsDark] = useState(false)

  // Initialize from localStorage and system preference
  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(storageKey) as ThemeMode | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setModeState(stored)
    }

    // Set up system preference listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (mode === 'system') {
        updateTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [storageKey, mode])

  // Update theme when mode changes
  const updateTheme = useCallback(
    (newMode: ThemeMode) => {
      let dark: boolean

      if (newMode === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        dark = newMode === 'dark'
      }

      setIsDark(dark)

      // Update document class
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      onChange?.(dark)
    },
    [onChange]
  )

  // Apply theme on mode change
  useEffect(() => {
    updateTheme(mode)
  }, [mode, updateTheme])

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode)
      localStorage.setItem(storageKey, newMode)
      updateTheme(newMode)
    },
    [storageKey, updateTheme]
  )

  const toggle = useCallback(() => {
    // Cycle: light -> dark -> system -> light
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    setMode(nextMode)
  }, [mode, setMode])

  return { mode, isDark, setMode, toggle }
}

// ============================================================================
// Icons
// ============================================================================

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

function SystemIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

// ============================================================================
// Component
// ============================================================================

export function DarkModeToggle({
  className = '',
  showLabel = false,
  size = 'md',
  defaultMode = 'system',
  storageKey = 'theme-mode',
  onChange,
}: DarkModeToggleProps) {
  const { mode, isDark, toggle } = useDarkMode({
    defaultMode,
    storageKey,
    onChange: (dark) => onChange?.(mode, dark),
  })

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }[size]

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size]

  const labels: Record<ThemeMode, string> = {
    light: 'Light mode',
    dark: 'Dark mode',
    system: 'System preference',
  }

  const getIcon = () => {
    if (mode === 'system') return <SystemIcon className={iconSize} />
    return isDark ? (
      <MoonIcon className={iconSize} />
    ) : (
      <SunIcon className={iconSize} />
    )
  }

  return (
    <button
      onClick={toggle}
      className={`
        inline-flex items-center gap-2
        ${sizeClasses}
        rounded-lg
        bg-muted hover:bg-muted/80
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${className}
      `}
      aria-label={`Toggle theme. Current: ${labels[mode]}`}
      title={labels[mode]}
    >
      {getIcon()}
      {showLabel && <span className="text-sm font-medium">{labels[mode]}</span>}
    </button>
  )
}

// ============================================================================
// Dropdown Version
// ============================================================================

export interface DarkModeDropdownProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  defaultMode?: ThemeMode
  storageKey?: string
  onChange?: (mode: ThemeMode, isDark: boolean) => void
}

export function DarkModeDropdown({
  className = '',
  size = 'md',
  defaultMode = 'system',
  storageKey = 'theme-mode',
  onChange,
}: DarkModeDropdownProps) {
  const { mode, isDark, setMode } = useDarkMode({
    defaultMode,
    storageKey,
    onChange: (dark) => onChange?.(mode, dark),
  })
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }[size]

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size]

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] =
    [
      {
        value: 'light',
        label: 'Light',
        icon: <SunIcon className={iconSize} />,
      },
      { value: 'dark', label: 'Dark', icon: <MoonIcon className={iconSize} /> },
      {
        value: 'system',
        label: 'System',
        icon: <SystemIcon className={iconSize} />,
      },
    ]

  const currentIcon = options.find((o) => o.value === mode)?.icon

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2
          ${sizeClasses}
          rounded-lg
          bg-muted hover:bg-muted/80
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select theme"
      >
        {currentIcon}
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            className="absolute right-0 z-20 mt-2 w-40 py-1 bg-background border rounded-lg shadow-lg"
            role="listbox"
            aria-label="Theme options"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    setMode(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm
                    hover:bg-muted transition-colors
                    ${mode === option.value ? 'font-medium text-primary' : ''}
                  `}
                  role="option"
                  aria-selected={mode === option.value}
                >
                  {option.icon}
                  {option.label}
                  {mode === option.value && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default DarkModeToggle
