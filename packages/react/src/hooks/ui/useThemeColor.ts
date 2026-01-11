'use client'

import { useMemo } from 'react'
import { parseOklch, type OklchColor } from '../../utils/color/oklch'

/**
 * Available Clarity color tokens
 */
export type ClarityColorToken =
  | 'primary'
  | 'primary-hover'
  | 'secondary'
  | 'background'
  | 'foreground'
  | 'surface-elevated'
  | 'surface-sunken'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

/**
 * Access theme color tokens as parsed OKLCH values
 */
export function useThemeColor(token: ClarityColorToken): OklchColor | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null

    const style = getComputedStyle(document.documentElement)
    const value = style.getPropertyValue(`--clarity-${token}`).trim()

    if (!value) return null

    try {
      return parseOklch(value)
    } catch {
      return null
    }
  }, [token])
}

/**
 * Access multiple theme colors at once as OKLCH values
 */
export function useOklchThemeColors<T extends ClarityColorToken>(
  tokens: T[]
): Record<T, OklchColor | null> {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return tokens.reduce(
        (acc, token) => ({ ...acc, [token]: null }),
        {} as Record<T, OklchColor | null>
      )
    }

    const style = getComputedStyle(document.documentElement)

    return tokens.reduce(
      (acc, token) => {
        const value = style.getPropertyValue(`--clarity-${token}`).trim()
        try {
          acc[token] = value ? parseOklch(value) : null
        } catch {
          acc[token] = null
        }
        return acc
      },
      {} as Record<T, OklchColor | null>
    )
  }, [tokens.join(',')])
}
