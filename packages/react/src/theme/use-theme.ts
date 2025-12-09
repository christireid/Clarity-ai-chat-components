/**
 * useTheme Hook
 *
 * Hook to access theme context and theme manipulation functions.
 *
 * @module theme/use-theme
 */

'use client'

import * as React from 'react'
import { ThemeContext } from './theme-context'

/**
 * Hook to access theme configuration and manipulation
 *
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, toggleMode, setPreset } = useTheme()
 *
 *   return (
 *     <div>
 *       <p>Current mode: {mode}</p>
 *       <button onClick={toggleMode}>Toggle Theme</button>
 *       <button onClick={() => setPreset('vibrant')}>
 *         Vibrant Theme
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @returns Theme context value with theme state and manipulation functions
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
