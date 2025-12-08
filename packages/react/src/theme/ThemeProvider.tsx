import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  applyThemeToDocument,
  createTheme as createThemeLegacy,
} from './theme-builder'
import {
  modernThemes,
  isValidModernThemeName,
  type ModernThemePresetName,
} from './modern-presets'
import {
  createTheme as createThemeModern,
  type SimpleThemeConfig,
} from './create-theme'
import type { CompleteThemeConfig, PartialThemeConfig } from './theme-config'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../animations/motion-safe'
import { cn } from '@clarity-chat/primitives'

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme preset name (modern themes only)
 */
export type ThemePresetName = ModernThemePresetName

export interface ThemeConfig {
  mode: ThemeMode
  preset?: ThemePresetName
  customTheme?: CompleteThemeConfig
  customizations?: PartialThemeConfig
  // Simple theme config (modern API)
  simpleConfig?: SimpleThemeConfig
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

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

/**
 * Check if a value is a CompleteThemeConfig (has colors, typography, etc.)
 * vs a ThemeConfig (has mode, preset, customTheme, etc.)
 */
function isCompleteThemeConfig(value: unknown): value is CompleteThemeConfig {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  // CompleteThemeConfig has 'colors' and 'typography' as required fields
  return (
    'colors' in obj && 'typography' in obj && typeof obj.colors === 'object'
  )
}

/**
 * Normalize theme input to ThemeConfig format
 * Allows users to pass either:
 * - Partial<ThemeConfig> (e.g., { preset: 'default' })
 * - CompleteThemeConfig (e.g., defaultLightTheme directly)
 */
function normalizeThemeInput(
  input: Partial<ThemeConfig> | CompleteThemeConfig | undefined
): Partial<ThemeConfig> {
  if (!input) return { mode: 'system' }

  // If it's a complete theme config, wrap it
  if (isCompleteThemeConfig(input)) {
    return {
      mode: input.mode || 'light',
      customTheme: input,
    }
  }

  return input as Partial<ThemeConfig>
}

/**
 * Animation speed options for theme transitions
 */
export type ThemeAnimationSpeed = 'none' | 'fast' | 'normal' | 'slow'

/**
 * Animation speed durations in milliseconds
 */
const animationSpeedMap: Record<ThemeAnimationSpeed, number> = {
  none: 0,
  fast: 100,
  normal: 200,
  slow: 400,
}

export interface ThemeProviderProps {
  children: React.ReactNode
  /**
   * Default theme configuration.
   *
   * Accepts either:
   * - Theme config object: `{ preset: 'default' }` or `{ customTheme: myTheme }`
   * - Complete theme directly: `myTheme` (will be wrapped automatically)
   *
   * @example
   * // Using preset
   * <ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
   *
   * @example
   * // Using custom theme (wrapped)
   * <ThemeProvider defaultTheme={{ customTheme: myTheme }}>
   *
   * @example
   * // Using custom theme (direct - simplified API)
   * <ThemeProvider defaultTheme={myTheme}>
   */
  defaultTheme?: Partial<ThemeConfig> | CompleteThemeConfig
  /**
   * Key used for localStorage persistence
   * @default 'clarity-chat-theme'
   */
  storageKey?: string
  /**
   * Enable cross-tab theme synchronization via BroadcastChannel API.
   *
   * When enabled, theme changes in one tab are automatically reflected in all
   * other tabs of the same origin. This provides a seamless user experience
   * across multiple browser tabs.
   *
   * **Browser Support:**
   * - Chrome 54+, Firefox 38+, Safari 15.4+, Edge 79+
   * - Not supported in older browsers (gracefully degrades to localStorage-only)
   * - Not available in Web Workers or Service Workers
   *
   * **Fallback Behavior:**
   * If BroadcastChannel is not supported, the provider will:
   * 1. Log a warning to the console (in development)
   * 2. Continue to work with localStorage persistence only
   * 3. Theme changes will sync on page reload but not in real-time
   *
   * @default true
   *
   * @example
   * // Enable cross-tab sync (default)
   * <ThemeProvider enableCrossTabSync>
   *
   * @example
   * // Disable for embedded/iframe contexts where sync isn't needed
   * <ThemeProvider enableCrossTabSync={false}>
   */
  enableCrossTabSync?: boolean
  /**
   * Debounce delay for cross-tab sync messages in milliseconds.
   * Prevents flooding with messages during rapid theme changes.
   *
   * Set to 0 to disable debouncing (immediate sync).
   *
   * @default 100
   */
  crossTabSyncDebounce?: number
  /**
   * Animation speed for theme transitions.
   * Controls how fast color changes animate when switching themes.
   *
   * - 'none': No animation (instant switch)
   * - 'fast': 100ms transition
   * - 'normal': 200ms transition (default)
   * - 'slow': 400ms transition
   *
   * Note: This is automatically set to 'none' if user prefers reduced motion.
   *
   * @default 'normal'
   */
  animationSpeed?: ThemeAnimationSpeed
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
  defaultTheme: defaultThemeInput,
  storageKey = 'clarity-chat-theme',
  enableCrossTabSync = true,
  crossTabSyncDebounce = 100,
  animationSpeed = 'normal',
}: ThemeProviderProps) {
  // Normalize the input to handle both ThemeConfig and CompleteThemeConfig
  const normalizedDefault = React.useMemo(
    () => normalizeThemeInput(defaultThemeInput),
    [defaultThemeInput]
  )

  // Initialize with defaults (SSR-safe)
  const [theme, setThemeState] = React.useState<ThemeConfig>(() => ({
    mode: 'system',
    ...normalizedDefault,
  }))

  // Track if we've hydrated from localStorage
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate from localStorage after mount (SSR-safe)
  React.useEffect(() => {
    if (isHydrated) return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Only restore persistable preferences (mode, preset)
        // Don't restore customTheme as it may be stale
        const persistedPreferences: Partial<ThemeConfig> = {}
        if (parsed.mode) persistedPreferences.mode = parsed.mode
        if (parsed.preset) persistedPreferences.preset = parsed.preset
        if (parsed.enableTransitions !== undefined) {
          persistedPreferences.enableTransitions = parsed.enableTransitions
        }

        if (Object.keys(persistedPreferences).length > 0) {
          setThemeState((prev) => ({ ...prev, ...persistedPreferences }))
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }

    setIsHydrated(true)
  }, [storageKey, isHydrated])

  // Resolve actual mode (light/dark) from system preference if needed
  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(
    'light'
  )

  // Resolved theme configuration
  const [resolvedTheme, setResolvedTheme] =
    React.useState<CompleteThemeConfig | null>(null)

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

  // Helper to get theme by preset name
  const getThemeByPreset = React.useCallback(
    (preset: ThemePresetName): CompleteThemeConfig => {
      if (isValidModernThemeName(preset)) {
        return modernThemes[preset]
      }
      // Warn about invalid preset and fallback to default
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Clarity Chat] Unknown theme preset "${preset}". ` +
            `Available presets: ${Object.keys(modernThemes).join(', ')}. ` +
            `Falling back to "default".`
        )
      }
      return modernThemes['default']
    },
    []
  )

  // Build complete theme configuration
  React.useEffect(() => {
    let complete: CompleteThemeConfig

    // If custom theme provided, use it
    if (theme.customTheme) {
      complete = theme.customTheme
    }
    // If simple config provided (modern API), use it
    else if (theme.simpleConfig) {
      complete = createThemeModern(theme.simpleConfig)
    }
    // If preset specified, load it
    else if (theme.preset) {
      const baseTheme = getThemeByPreset(theme.preset)
      complete = theme.customizations
        ? createThemeLegacy(baseTheme, theme.customizations)
        : baseTheme
    }
    // Otherwise, use default based on resolved mode
    else {
      const defaultPreset = resolvedMode === 'dark' ? 'default-dark' : 'default'
      complete = modernThemes[defaultPreset]
    }

    setResolvedTheme(complete)
  }, [theme, resolvedMode, getThemeByPreset])

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  // Apply theme to document
  React.useEffect(() => {
    if (!resolvedTheme) return

    const root = document.documentElement
    // Disable transitions if user prefers reduced motion, explicitly disabled, or animation is 'none'
    const enableTransitions =
      theme.enableTransitions !== false &&
      !prefersReducedMotion &&
      animationSpeed !== 'none'

    // Use animationSpeed prop, but allow theme.transitionDuration to override if set
    const baseTransitionDuration =
      theme.transitionDuration || animationSpeedMap[animationSpeed]
    const transitionDuration = getMotionSafeDuration(
      prefersReducedMotion,
      baseTransitionDuration
    )

    // Add transition class for smooth color changes
    if (enableTransitions) {
      root.style.setProperty(
        '--theme-transition-duration',
        `${transitionDuration}ms`
      )
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
  }, [
    resolvedTheme,
    theme.enableTransitions,
    theme.transitionDuration,
    prefersReducedMotion,
    animationSpeed,
  ])

  // Save to localStorage (only persist user preferences, not full theme config)
  React.useEffect(() => {
    // Don't persist until hydrated to avoid overwriting with defaults
    if (!isHydrated) return

    if (typeof window !== 'undefined') {
      try {
        // Only persist user-changeable preferences
        const toStore: Partial<ThemeConfig> = {
          mode: theme.mode,
        }
        if (theme.preset) toStore.preset = theme.preset
        if (theme.enableTransitions !== undefined) {
          toStore.enableTransitions = theme.enableTransitions
        }

        localStorage.setItem(storageKey, JSON.stringify(toStore))
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }, [
    theme.mode,
    theme.preset,
    theme.enableTransitions,
    storageKey,
    isHydrated,
  ])

  // Cross-tab theme synchronization using BroadcastChannel
  React.useEffect(() => {
    if (!enableCrossTabSync || typeof window === 'undefined') return
    if (typeof BroadcastChannel === 'undefined') return // Not supported in older browsers

    const channelName = `${storageKey}-sync`
    let channel: BroadcastChannel | null = null

    try {
      channel = new BroadcastChannel(channelName)

      // Listen for theme changes from other tabs
      channel.onmessage = (event) => {
        if (event.data?.type === 'theme-change') {
          const newTheme = event.data.theme as Partial<ThemeConfig>
          setThemeState((prev) => ({ ...prev, ...newTheme }))
        }
      }
    } catch (error) {
      // BroadcastChannel may not be available in some environments
      console.warn('Cross-tab theme sync not available:', error)
    }

    return () => {
      channel?.close()
    }
  }, [storageKey, enableCrossTabSync])

  // Broadcast theme changes to other tabs with debouncing
  const broadcastRef = React.useRef<BroadcastChannel | null>(null)
  const broadcastTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)

  React.useEffect(() => {
    if (!enableCrossTabSync || typeof window === 'undefined') return
    if (typeof BroadcastChannel === 'undefined') {
      // Log warning in development only
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[Clarity Chat] BroadcastChannel API not available. ' +
            'Cross-tab theme sync will fall back to localStorage-only persistence. ' +
            'Theme changes will sync on page reload but not in real-time.'
        )
      }
      return
    }
    if (!isHydrated) return // Don't broadcast until hydrated

    const channelName = `${storageKey}-sync`

    // Debounced broadcast function
    const broadcastTheme = () => {
      try {
        if (!broadcastRef.current) {
          broadcastRef.current = new BroadcastChannel(channelName)
        }

        // Broadcast the theme change
        broadcastRef.current.postMessage({
          type: 'theme-change',
          theme: {
            mode: theme.mode,
            preset: theme.preset,
            enableTransitions: theme.enableTransitions,
          },
        })
      } catch {
        // Silently fail if broadcast not available
      }
    }

    // Clear any pending broadcast
    if (broadcastTimeoutRef.current) {
      clearTimeout(broadcastTimeoutRef.current)
    }

    // Apply debouncing if configured
    if (crossTabSyncDebounce > 0) {
      broadcastTimeoutRef.current = setTimeout(
        broadcastTheme,
        crossTabSyncDebounce
      )
    } else {
      broadcastTheme()
    }

    return () => {
      // Don't close channel here - we want to keep broadcasting on changes
      // Clean up timeout on unmount
      if (broadcastTimeoutRef.current) {
        clearTimeout(broadcastTimeoutRef.current)
      }
    }
  }, [
    theme.mode,
    theme.preset,
    theme.enableTransitions,
    storageKey,
    enableCrossTabSync,
    crossTabSyncDebounce,
    isHydrated,
  ])

  // Cleanup broadcast channel on unmount
  React.useEffect(() => {
    return () => {
      broadcastRef.current?.close()
      broadcastRef.current = null
    }
  }, [])

  // Memoize theme manipulation callbacks (already using useCallback - good!)
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

  // Available presets
  const availablePresets = React.useMemo(
    () => Object.keys(modernThemes) as ThemePresetName[],
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
    [
      theme,
      setTheme,
      resolvedMode,
      toggleMode,
      resolvedTheme,
      setPreset,
      availablePresets,
    ]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme hook - Access theme context
 *
 * @example
 * ```tsx
 * const { mode, toggleMode, setPreset } = useTheme()
 *
 * // Toggle dark mode
 * <button onClick={toggleMode}>
 *   {mode === 'dark' ? 'Light' : 'Dark'}
 * </button>
 *
 * // Change preset
 * <button onClick={() => setPreset('vibrant')}>
 *   Vibrant Theme
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
 * ThemeToggle - Enhanced theme toggle button with smooth animations
 *
 * Features:
 * - Smooth icon transitions
 * - Reduced motion support
 * - Loading state during transition
 * - Accessible with ARIA labels
 * - Keyboard support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeToggle />
 *
 * // With label
 * <ThemeToggle showLabel />
 *
 * // Custom className
 * <ThemeToggle className="custom-styles" />
 * ```
 */
export interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ThemeModeSelector - Three-way mode selector (light/dark/system)
 *
 * Unlike ThemeToggle which only toggles between light/dark,
 * this component provides access to all three modes including system.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeModeSelector />
 *
 * // Inline variant
 * <ThemeModeSelector variant="inline" />
 *
 * // With custom className
 * <ThemeModeSelector className="my-selector" />
 * ```
 */
export interface ThemeModeSelectorProps {
  className?: string
  variant?: 'buttons' | 'inline' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
}

export function ThemeModeSelector({
  className,
  variant = 'buttons',
  size = 'md',
}: ThemeModeSelectorProps) {
  const { theme, setTheme, mode } = useTheme()
  const currentMode = theme.mode

  const modes: Array<{
    value: ThemeMode
    label: string
    icon: React.ReactNode
  }> = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      value: 'system',
      label: 'System',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8m-4-4v4" />
        </svg>
      ),
    },
  ]

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative inline-block', className)}>
        <select
          value={currentMode}
          onChange={(e) => setTheme({ mode: e.target.value as ThemeMode })}
          className={cn(
            'appearance-none rounded-lg border border-border bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring/40',
            'pr-8 cursor-pointer',
            sizeClasses[size]
          )}
          aria-label="Select theme mode"
        >
          {modes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-lg bg-muted p-1',
          className
        )}
        role="radiogroup"
        aria-label="Theme mode"
      >
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setTheme({ mode: m.value })}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              sizeClasses[size],
              currentMode === m.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            role="radio"
            aria-checked={currentMode === m.value}
            aria-label={m.label}
          >
            {m.icon}
            <span className="sr-only sm:not-sr-only">{m.label}</span>
          </button>
        ))}
      </div>
    )
  }

  // Default: buttons variant
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="radiogroup"
      aria-label="Theme mode"
    >
      {modes.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => setTheme({ mode: m.value })}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            sizeClasses[size],
            currentMode === m.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:bg-muted'
          )}
          role="radio"
          aria-checked={currentMode === m.value}
          aria-label={m.label}
        >
          {m.icon}
          <span>{m.label}</span>
        </button>
      ))}
      {/* Show resolved mode when in system mode */}
      {currentMode === 'system' && (
        <span className="text-xs text-muted-foreground ml-2">
          (using {mode})
        </span>
      )}
    </div>
  )
}

export function ThemeToggle({
  className,
  showLabel = false,
  variant = 'ghost',
  size = 'md',
}: ThemeToggleProps) {
  const { mode, toggleMode, theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const handleToggle = React.useCallback(() => {
    setIsTransitioning(true)
    toggleMode()
    setTimeout(() => {
      setIsTransitioning(false)
    }, theme.transitionDuration || 200)
  }, [toggleMode, theme.transitionDuration])

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  }

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline:
      'border border-border/40 hover:bg-accent/50 hover:border-primary/50',
    ghost: 'hover:bg-accent/50',
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isTransitioning}
      whileHover={{
        scale: getMotionSafeValue(prefersReducedMotion, 1.05, 1),
      }}
      whileTap={{
        scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1),
      }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2.5 rounded-lg',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        showLabel && 'px-3.5',
        className
      )}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{
            rotate: getMotionSafeValue(prefersReducedMotion, -90, 0),
            opacity: 0,
            scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
          }}
          animate={{
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            rotate: getMotionSafeValue(prefersReducedMotion, 90, 0),
            opacity: 0,
            scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
          }}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
            ease: 'easeOut',
          }}
          className="flex items-center gap-2.5"
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
              aria-hidden="true"
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
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {showLabel && (
            <span className="text-sm font-semibold">
              {mode === 'dark' ? 'Light' : 'Dark'}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading indicator */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg"
        >
          <motion.div
            animate={{
              rotate: prefersReducedMotion ? 0 : 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </motion.button>
  )
}
