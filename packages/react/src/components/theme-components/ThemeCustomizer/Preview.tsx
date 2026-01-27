/**
 * Clarity Chat - Theme Preview and Accessibility Components
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  getContrastRatio,
  hslStringToHex,
  hexToHSLString,
} from '../../../theme/color-utils'
import { simulateColorBlindness } from '../../../theme/color-advanced'
import type {
  ColorConfig,
  CompleteThemeConfig,
} from '../../../theme/theme-config'
import type {
  ContrastBadgeProps,
  ColorBlindnessPreviewProps,
  ColorBlindnessPanelFullProps,
  EnhancedExportPanelProps,
  TypographySettings,
  FONT_FAMILIES,
  SIZE_SCALES,
} from './types'
import {
  ALL_COLOR_BLINDNESS_TYPES,
  FONT_FAMILIES as FONTS,
  SIZE_SCALES as SCALES,
} from './types'

/**
 * Contrast Checker Badge
 */
export function ContrastBadge({
  foreground,
  background,
  label,
}: ContrastBadgeProps) {
  const ratio = getContrastRatio(foreground, background)
  const passesAA = ratio >= 4.5
  const passesAAA = ratio >= 7

  return (
    <div
      className="flex items-center gap-2 text-sm"
      role="status"
      aria-label={`${label} contrast ratio: ${ratio.toFixed(2)} to 1, ${passesAAA ? 'passes AAA' : passesAA ? 'passes AA' : 'fails'}`}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span
        className={cn(
          'px-2 py-0.5 rounded font-mono text-xs',
          passesAAA
            ? 'bg-success/20 text-success'
            : passesAA
              ? 'bg-warning/20 text-warning'
              : 'bg-destructive/20 text-destructive'
        )}
      >
        {ratio.toFixed(2)}:1
      </span>
      <span className="text-xs text-muted-foreground">
        {passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail'}
      </span>
    </div>
  )
}

/**
 * Color Blindness Preview - All 8 types with toggle
 */
export function ColorBlindnessPreview({
  color,
  showAllTypes = false,
}: ColorBlindnessPreviewProps) {
  const [expanded, setExpanded] = React.useState(showAllTypes)
  const hex = color.startsWith('#') ? color : hslStringToHex(color)

  const displayTypes = expanded
    ? ALL_COLOR_BLINDNESS_TYPES
    : ALL_COLOR_BLINDNESS_TYPES.slice(0, 3)

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-lg border border-border"
            style={{ backgroundColor: hex }}
            title="Original color"
          />
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Original
          </span>
        </div>
        {displayTypes.map(({ type, label, description }) => {
          const simulated = simulateColorBlindness(hex, type)
          return (
            <div
              key={type}
              className="text-center"
              title={`${label}: ${description}`}
            >
              <div
                className="w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: simulated }}
              />
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                {label.slice(0, 5)}
              </span>
            </div>
          )
        })}
      </div>
      {!showAllTypes && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
        >
          {expanded
            ? 'Show fewer'
            : `Show all ${ALL_COLOR_BLINDNESS_TYPES.length} types`}
        </button>
      )}
    </div>
  )
}

/**
 * Full Color Blindness Panel with all types and descriptions
 */
export function ColorBlindnessPanelFull({
  colors,
}: ColorBlindnessPanelFullProps) {
  const [selectedColor, setSelectedColor] =
    React.useState<keyof ColorConfig>('primary')
  const colorOptions: Array<{ key: keyof ColorConfig; label: string }> = [
    { key: 'primary', label: 'Primary' },
    { key: 'destructive', label: 'Destructive' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
  ]

  const hex = colors[selectedColor]?.startsWith('#')
    ? colors[selectedColor]
    : hslStringToHex(colors[selectedColor] || '#000000')

  return (
    <div className="space-y-4">
      {/* Color selector */}
      <div className="flex gap-2 flex-wrap">
        {colorOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedColor(key)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              selectedColor === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* All 8 types grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div
            className="w-full aspect-square rounded-lg border-2 border-border"
            style={{ backgroundColor: hex }}
          />
          <span className="text-xs text-foreground font-medium block mt-1">
            Original
          </span>
        </div>
        {ALL_COLOR_BLINDNESS_TYPES.map(
          ({ type, label, description, prevalence }) => {
            const simulated = simulateColorBlindness(hex, type)
            return (
              <div key={type} className="text-center group relative">
                <div
                  className="w-full aspect-square rounded-lg border border-border transition-all group-hover:border-primary"
                  style={{ backgroundColor: simulated }}
                />
                <span className="text-xs text-muted-foreground block mt-1">
                  {label}
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-lg border whitespace-nowrap">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">{description}</p>
                    <p className="text-muted-foreground">
                      Affects: {prevalence}
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}

/**
 * Enhanced Export Panel with complete theme output
 */
export function EnhancedExportPanel({
  theme,
  typography,
}: EnhancedExportPanelProps) {
  const [exportFormat, setExportFormat] = React.useState<
    'json' | 'css' | 'tailwind' | 'scss' | 'figma'
  >('css')
  const [includeTypography, setIncludeTypography] = React.useState(true)
  const [includeBorders, setIncludeBorders] = React.useState(true)
  const [includeShadows, setIncludeShadows] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  if (!theme) return null

  const generateCSS = (): string => {
    const lines = [':root {', '  /* Colors */']
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      lines.push(`  --${cssKey}: ${value};`)
    })

    if (includeBorders) {
      lines.push('', '  /* Borders */')
      lines.push(`  --radius-sm: ${theme.borders.radius.sm};`)
      lines.push(`  --radius-md: ${theme.borders.radius.md};`)
      lines.push(`  --radius-lg: ${theme.borders.radius.lg};`)
      lines.push(`  --radius-xl: ${theme.borders.radius.xl};`)
      lines.push(`  --radius-full: ${theme.borders.radius.full};`)
    }

    if (includeTypography) {
      lines.push('', '  /* Typography */')
      const fontConfig = FONTS.find((f) => f.id === typography.fontFamily)
      const sizeConfig = SCALES.find((s) => s.id === typography.sizeScale)
      lines.push(
        `  --font-sans: ${fontConfig?.family || 'system-ui, sans-serif'};`
      )
      lines.push(`  --font-size-base: ${sizeConfig?.multiplier || 1}rem;`)
      lines.push(
        `  --font-size-sm: calc(0.875rem * ${sizeConfig?.multiplier || 1});`
      )
      lines.push(
        `  --font-size-lg: calc(1.125rem * ${sizeConfig?.multiplier || 1});`
      )
    }

    if (includeShadows) {
      lines.push('', '  /* Shadows */')
      lines.push(`  --shadow-sm: ${theme.shadows.sm};`)
      lines.push(`  --shadow-md: ${theme.shadows.md};`)
      lines.push(`  --shadow-lg: ${theme.shadows.lg};`)
    }

    lines.push('}')
    return lines.join('\n')
  }

  const generateSCSS = (): string => {
    const lines = ['// Theme Variables', '']

    lines.push('// Colors')
    Object.entries(theme.colors).forEach(([key, value]) => {
      const scssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      lines.push(`$${scssKey}: hsl(${value});`)
    })

    if (includeBorders) {
      lines.push('', '// Borders')
      lines.push(`$radius-sm: ${theme.borders.radius.sm};`)
      lines.push(`$radius-md: ${theme.borders.radius.md};`)
      lines.push(`$radius-lg: ${theme.borders.radius.lg};`)
    }

    if (includeTypography) {
      lines.push('', '// Typography')
      const fontConfig = FONTS.find((f) => f.id === typography.fontFamily)
      lines.push(
        `$font-sans: ${fontConfig?.family || 'system-ui, sans-serif'};`
      )
    }

    return lines.join('\n')
  }

  const generateTailwind = (): string => {
    const config: Record<string, unknown> = {
      theme: {
        extend: {
          colors: {} as Record<string, string>,
          borderRadius: {} as Record<string, string>,
          fontFamily: {} as Record<string, string[]>,
          boxShadow: {} as Record<string, string>,
        },
      },
    }

    Object.entries(theme.colors).forEach(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      ;(
        config.theme as Record<string, Record<string, Record<string, string>>>
      ).extend.colors[kebabKey] = `hsl(${value})`
    })

    if (includeBorders) {
      ;(
        config.theme as Record<string, Record<string, Record<string, string>>>
      ).extend.borderRadius = {
        sm: theme.borders.radius.sm,
        md: theme.borders.radius.md,
        lg: theme.borders.radius.lg,
        xl: theme.borders.radius.xl,
      }
    }

    if (includeTypography) {
      const fontConfig = FONTS.find((f) => f.id === typography.fontFamily)
      ;(
        config.theme as Record<string, Record<string, Record<string, string[]>>>
      ).extend.fontFamily = {
        sans: fontConfig?.family.split(', ') || ['system-ui', 'sans-serif'],
      }
    }

    if (includeShadows) {
      ;(
        config.theme as Record<string, Record<string, Record<string, string>>>
      ).extend.boxShadow = {
        sm: theme.shadows.sm,
        md: theme.shadows.md,
        lg: theme.shadows.lg,
      }
    }

    return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`
  }

  const generateFigmaTokens = (): string => {
    const tokens: Record<string, unknown> = {
      color: {},
      borderRadius: {},
      typography: {},
      shadow: {},
    }

    Object.entries(theme.colors).forEach(([key, value]) => {
      const hex = hslStringToHex(value)
      ;(tokens.color as Record<string, unknown>)[key] = {
        value: hex,
        type: 'color',
      }
    })

    if (includeBorders) {
      ;(tokens.borderRadius as Record<string, unknown>) = {
        sm: { value: theme.borders.radius.sm, type: 'borderRadius' },
        md: { value: theme.borders.radius.md, type: 'borderRadius' },
        lg: { value: theme.borders.radius.lg, type: 'borderRadius' },
      }
    }

    if (includeTypography) {
      const fontConfig = FONTS.find((f) => f.id === typography.fontFamily)
      ;(tokens.typography as Record<string, unknown>) = {
        fontFamily: { value: fontConfig?.family, type: 'fontFamily' },
        sizeScale: { value: typography.sizeScale, type: 'other' },
      }
    }

    return JSON.stringify(tokens, null, 2)
  }

  const getExportContent = (): string => {
    switch (exportFormat) {
      case 'json':
        return JSON.stringify(
          {
            ...theme,
            _typography: typography,
          },
          null,
          2
        )
      case 'css':
        return generateCSS()
      case 'scss':
        return generateSCSS()
      case 'tailwind':
        return generateTailwind()
      case 'figma':
        return generateFigmaTokens()
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = getExportContent()
    const extensions: Record<string, string> = {
      json: 'json',
      css: 'css',
      scss: 'scss',
      tailwind: 'js',
      figma: 'tokens.json',
    }
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clarity-theme.${extensions[exportFormat]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Export Format
        </label>
        <div
          className="flex gap-2 flex-wrap"
          role="radiogroup"
          aria-label="Export format"
        >
          {(['css', 'scss', 'tailwind', 'json', 'figma'] as const).map(
            (format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md capitalize transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  exportFormat === format
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                role="radio"
                aria-checked={exportFormat === format}
              >
                {format === 'figma' ? 'Figma Tokens' : format.toUpperCase()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Include Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Include</label>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeTypography}
              onChange={(e) => setIncludeTypography(e.target.checked)}
              className="rounded border-border focus:ring-2 focus:ring-ring"
            />
            Typography
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeBorders}
              onChange={(e) => setIncludeBorders(e.target.checked)}
              className="rounded border-border focus:ring-2 focus:ring-ring"
            />
            Borders
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeShadows}
              onChange={(e) => setIncludeShadows(e.target.checked)}
              className="rounded border-border focus:ring-2 focus:ring-ring"
            />
            Shadows
          </label>
        </div>
      </div>

      {/* Code Preview */}
      <div className="relative">
        <pre
          className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto scrollbar-hide text-xs font-mono text-foreground max-h-64"
          aria-label="Export preview"
        >
          {getExportContent()}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            'border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          aria-live="polite"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Download File
        </button>
      </div>
    </div>
  )
}
