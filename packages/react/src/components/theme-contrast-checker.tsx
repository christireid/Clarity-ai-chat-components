/**
 * Theme Contrast Checker Component
 *
 * Analyzes the current theme and displays WCAG compliance status
 * for all color pairs. Shows which combinations pass AA, AAA, or fail.
 */

import * as React from 'react'
import { useTheme } from '../theme/ThemeProvider'
import {
  getContrastRatio,
  meetsContrastRequirement,
  hslStringToHex,
} from '../theme/color-utils'
import type { CompleteThemeConfig } from '../theme/theme-config'

/**
 * WCAG compliance levels
 */
type WCAGLevel = 'AAA' | 'AA' | 'Fail'

/**
 * Color pair analysis result
 */
interface ColorPairAnalysis {
  name: string
  foreground: string
  background: string
  foregroundHex: string
  backgroundHex: string
  ratio: number
  level: WCAGLevel
  passesAA: boolean
  passesAAA: boolean
}

/**
 * Convert an HSL string to hex, handling edge cases
 */
function safeHslToHex(hslString: string): string {
  try {
    if (hslString.startsWith('#')) return hslString
    return hslStringToHex(hslString)
  } catch {
    return '#000000'
  }
}

/**
 * Get WCAG level from contrast ratio
 */
function getWCAGLevel(ratio: number): WCAGLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

/**
 * Color pair definitions to check
 */
const COLOR_PAIRS: Array<{
  name: string
  foreground: keyof CompleteThemeConfig['colors']
  background: keyof CompleteThemeConfig['colors']
}> = [
  {
    name: 'Text on Background',
    foreground: 'foreground',
    background: 'background',
  },
  { name: 'Text on Card', foreground: 'cardForeground', background: 'card' },
  {
    name: 'Primary on Background',
    foreground: 'primary',
    background: 'background',
  },
  {
    name: 'Primary Text on Primary',
    foreground: 'primaryForeground',
    background: 'primary',
  },
  {
    name: 'Secondary Text on Secondary',
    foreground: 'secondaryForeground',
    background: 'secondary',
  },
  {
    name: 'Accent Text on Accent',
    foreground: 'accentForeground',
    background: 'accent',
  },
  {
    name: 'Muted Text on Muted',
    foreground: 'mutedForeground',
    background: 'muted',
  },
  {
    name: 'Destructive Text',
    foreground: 'destructiveForeground',
    background: 'destructive',
  },
  {
    name: 'Popover Text',
    foreground: 'popoverForeground',
    background: 'popover',
  },
]

export interface ThemeContrastCheckerProps {
  /**
   * Custom theme to analyze. If not provided, uses the current theme context.
   */
  theme?: CompleteThemeConfig
  /**
   * Show detailed information for each color pair
   */
  showDetails?: boolean
  /**
   * Custom class name
   */
  className?: string
  /**
   * Only show failing color pairs
   */
  showOnlyFailing?: boolean
}

/**
 * Badge component for displaying WCAG level
 */
function LevelBadge({ level }: { level: WCAGLevel }) {
  const colors = {
    AAA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    AA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    Fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level]}`}
    >
      {level === 'Fail' ? '✗ Fail' : `✓ ${level}`}
    </span>
  )
}

/**
 * Color swatch component
 */
function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-xs font-mono">{label}</span>
    </div>
  )
}

/**
 * ThemeContrastChecker - Visual WCAG accessibility analyzer
 *
 * Analyzes color contrast ratios in your theme and displays
 * compliance status for each color pair.
 *
 * @example
 * ```tsx
 * // Use with current theme
 * <ThemeContrastChecker />
 *
 * // Analyze a custom theme
 * <ThemeContrastChecker theme={myCustomTheme} />
 *
 * // Show only failing contrasts
 * <ThemeContrastChecker showOnlyFailing />
 * ```
 */
export function ThemeContrastChecker({
  theme: customTheme,
  showDetails = true,
  className = '',
  showOnlyFailing = false,
}: ThemeContrastCheckerProps) {
  const { resolvedTheme } = useTheme()
  const theme = customTheme || resolvedTheme

  // Analyze all color pairs
  const analysis = React.useMemo<ColorPairAnalysis[]>(() => {
    if (!theme?.colors) return []

    return COLOR_PAIRS.map((pair) => {
      const foreground = theme.colors[pair.foreground] || '0 0% 0%'
      const background = theme.colors[pair.background] || '0 0% 100%'

      const foregroundHex = safeHslToHex(foreground)
      const backgroundHex = safeHslToHex(background)

      const ratio = getContrastRatio(foregroundHex, backgroundHex)
      const passesAA = meetsContrastRequirement(
        foregroundHex,
        backgroundHex,
        'AA'
      )
      const passesAAA = meetsContrastRequirement(
        foregroundHex,
        backgroundHex,
        'AAA'
      )

      return {
        name: pair.name,
        foreground,
        background,
        foregroundHex,
        backgroundHex,
        ratio,
        level: getWCAGLevel(ratio),
        passesAA,
        passesAAA,
      }
    })
  }, [theme])

  // Filter based on showOnlyFailing
  const filteredAnalysis = showOnlyFailing
    ? analysis.filter((a) => a.level === 'Fail')
    : analysis

  // Summary stats
  const summary = React.useMemo(() => {
    const total = analysis.length
    const passing = analysis.filter((a) => a.passesAA).length
    const passingAAA = analysis.filter((a) => a.passesAAA).length
    const failing = analysis.filter((a) => !a.passesAA).length

    return { total, passing, passingAAA, failing }
  }, [analysis])

  if (!theme) {
    return (
      <div className={`p-4 text-sm text-muted-foreground ${className}`}>
        No theme available. Wrap your component in a ThemeProvider.
      </div>
    )
  }

  return (
    <div className={`theme-contrast-checker ${className}`}>
      {/* Summary Header */}
      <div className="mb-4 p-4 rounded-lg bg-card border">
        <h3 className="text-lg font-semibold mb-2">
          Theme Accessibility Report
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold">{summary.total}</div>
            <div className="text-muted-foreground">Color Pairs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {summary.passing}
            </div>
            <div className="text-muted-foreground">Pass AA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {summary.passingAAA}
            </div>
            <div className="text-muted-foreground">Pass AAA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {summary.failing}
            </div>
            <div className="text-muted-foreground">Failing</div>
          </div>
        </div>

        {/* Overall status */}
        <div className="mt-3 pt-3 border-t">
          {summary.failing === 0 ? (
            <p className="text-green-600 font-medium">
              ✓ All color pairs meet WCAG AA requirements
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              ⚠ {summary.failing} color pair{summary.failing > 1 ? 's' : ''}{' '}
              need attention
            </p>
          )}
        </div>
      </div>

      {/* Color Pair Details */}
      {showDetails && (
        <div className="space-y-2">
          {filteredAnalysis.map((pair) => (
            <div
              key={pair.name}
              className={`p-3 rounded-lg border ${
                pair.level === 'Fail'
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{pair.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {pair.ratio.toFixed(2)}:1
                  </span>
                  <LevelBadge level={pair.level} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <ColorSwatch
                  color={pair.foregroundHex}
                  label={pair.foregroundHex}
                />
                <span className="text-muted-foreground">on</span>
                <ColorSwatch
                  color={pair.backgroundHex}
                  label={pair.backgroundHex}
                />
              </div>

              {/* Preview */}
              <div
                className="mt-2 p-2 rounded text-sm"
                style={{
                  backgroundColor: pair.backgroundHex,
                  color: pair.foregroundHex,
                }}
              >
                Sample text preview
              </div>

              {/* Suggestions for failing pairs */}
              {pair.level === 'Fail' && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  💡 Tip: Increase contrast by darkening the foreground or
                  lightening the background
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* WCAG Reference */}
      <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
        <p className="font-medium mb-1">WCAG Contrast Requirements:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            • <strong>AA (Normal Text):</strong> 4.5:1 minimum ratio
          </li>
          <li>
            • <strong>AAA (Enhanced):</strong> 7:1 minimum ratio
          </li>
          <li>
            • <strong>AA (Large Text):</strong> 3:1 minimum ratio (18pt+ or
            14pt+ bold)
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ThemeContrastChecker
