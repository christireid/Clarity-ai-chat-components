import * as React from 'react'
import { designTokens } from './design-tokens'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor?: string
  radius?: number
  fontFamily?: string
}

interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  mode: 'light' | 'dark'
  toggleMode: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Partial<ThemeConfig>
  storageKey?: string
}

/**
 * ThemeProvider - Provides theme context to all Clarity Chat components
 * 
 * Features:
 * - Light/Dark mode support
 * - System preference detection
 * - LocalStorage persistence
 * - CSS variable injection
 * - Real-time theme switching
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme={{ mode: 'dark', radius: 8 }}>
 *   <ChatWindow />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = { mode: 'system' },
  storageKey = 'clarity-chat-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeConfig>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          return { ...defaultTheme, ...JSON.parse(stored) }
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error)
      }
    }
    return { mode: 'system', ...defaultTheme }
  })

  // Resolve actual mode (light/dark) from system preference if needed
  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>('light')

  // Listen to system preference changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateMode = () => {
      if (theme.mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedMode(theme.mode)
      }
    }

    updateMode()

    // Listen for changes
    mediaQuery.addEventListener('change', updateMode)
    return () => mediaQuery.removeEventListener('change', updateMode)
  }, [theme.mode])

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement
    
    // Remove old class
    root.classList.remove('light', 'dark')
    
    // Add new class
    root.classList.add(resolvedMode)

    // Apply CSS variables
    if (theme.primaryColor) {
      root.style.setProperty('--primary', theme.primaryColor)
    }
    
    if (theme.radius !== undefined) {
      root.style.setProperty('--radius', `${theme.radius}px`)
    }
    
    if (theme.fontFamily) {
      root.style.setProperty('--font-sans', theme.fontFamily)
    }
  }, [resolvedMode, theme])

  // Save to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(theme))
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }, [theme, storageKey])

  const setTheme = React.useCallback((newTheme: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...newTheme }))
  }, [])

  const toggleMode = React.useCallback(() => {
    setThemeState((prev) => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }))
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      mode: resolvedMode,
      toggleMode,
    }),
    [theme, setTheme, resolvedMode, toggleMode]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme hook - Access theme context
 * 
 * @example
 * ```tsx
 * const { mode, toggleMode, theme, setTheme } = useTheme()
 * 
 * // Toggle dark mode
 * <button onClick={toggleMode}>
 *   {mode === 'dark' ? '☀️' : '🌙'}
 * </button>
 * 
 * // Customize theme
 * <button onClick={() => setTheme({ primaryColor: '#3b82f6' })}>
 *   Set Blue Theme
 * </button>
 * ```
 */
export function useTheme() {
  const context = React.useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

/**
 * ThemeToggle - Pre-built theme toggle button
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useTheme()
  
  return (
    <button
      onClick={toggleMode}
      className={className}
      aria-label="Toggle theme"
      type="button"
    >
      {mode === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
