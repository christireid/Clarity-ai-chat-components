/**
 * Theme Context
 *
 * @module theme/theme-context
 */

import * as React from 'react'
import type { ThemeContextValue } from './theme-types'

/**
 * React context for theme state
 */
export const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

ThemeContext.displayName = 'ThemeContext'
