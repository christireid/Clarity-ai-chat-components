import * as React from 'react'
import { designTokens } from './design-tokens'
import { themes, type ThemePresetName } from './presets'
import { applyThemeToDocument, createTheme } from './theme-builder'
import type { CompleteThemeConfig, PartialThemeConfig } from './theme-config'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  preset?: ThemePresetName
  customTheme?: CompleteThemeConfig
  customizations?: PartialThemeConfig
  // Legacy support
  primaryColor?: string
  radius?: number
  fontFamily?: string
  // Transition settings
  enableTransitions?: boolean
  transitionDuration?: number
}

interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  mode: 'light' | 'dark'
  toggleMode: () => void
  resolvedTheme: CompleteThemeConfig | null
  setPreset: (preset: ThemePresetName) => void
  availablePresets: ThemePresetName[]
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
  
  // Resolved theme configuration
  const [resolvedTheme, setResolvedTheme] = React.useState<CompleteThemeConfig | null>(null)

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

  // Build complete theme configuration
  React.useEffect(() => {
    let complete: CompleteThemeConfig
    
    // If custom theme provided, use it
    if (theme.customTheme) {
      complete = theme.customTheme
    }
    // If preset specified, load it
    else if (theme.preset) {
      const baseTheme = themes[theme.preset]
      complete = theme.customizations 
        ? createTheme(baseTheme, theme.customizations)
        : baseTheme
    }
    // Otherwise, use default based on resolved mode
    else {
      const defaultPreset = resolvedMode === 'dark' ? 'default-dark' : 'default-light'
      complete = themes[defaultPreset]
      
      // Apply legacy customizations
      if (theme.primaryColor || theme.radius || theme.fontFamily) {
        const customizations: PartialThemeConfig = {}
        if (theme.primaryColor) {
          customizations.colors = { primary: theme.primaryColor }
        }
        complete = createTheme(complete, customizations)
      }
    }
    
    setResolvedTheme(complete)
  }, [theme, resolvedMode])
  
  // Apply theme to document
  React.useEffect(() => {
    if (!resolvedTheme) return
    
    const root = document.documentElement
    const enableTransitions = theme.enableTransitions !== false
    const transitionDuration = theme.transitionDuration || 200
    
    // Add transition class for smooth color changes
    if (enableTransitions) {
      root.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`)
      root.classList.add('theme-transitioning')
    }
    
    // Apply theme
    applyThemeToDocument(resolvedTheme)
    
    // Remove transition class after animation completes
    if (enableTransitions) {
      const timeout = setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, transitionDuration)
      
      return () => clearTimeout(timeout)
    }
  }, [resolvedTheme, theme.enableTransitions, theme.transitionDuration])

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

  const setPreset = React.useCallback((preset: ThemePresetName) => {
    setThemeState((prev) => ({ ...prev, preset }))
  }, [])
  
  const availablePresets = React.useMemo(
    () => Object.keys(themes) as ThemePresetName[],
    []
  )
  
  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      mode: resolvedMode,
      toggleMode,
      resolvedTheme,
      setPreset,
      availablePresets,
    }),
    [theme, setTheme, resolvedMode, toggleMode, resolvedTheme, setPreset, availablePresets]
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
