import type { CompleteThemeConfig } from './theme-config'
import type { ThemeConfig, ThemeAnimationSpeed } from './theme-types'

/**
 * ThemeProvider props
 */
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
