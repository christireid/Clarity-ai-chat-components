'use client'

import * as React from 'react'
import {
  modernThemes,
  type ModernThemePresetName,
} from '../theme/modern-presets'
import type { CompleteThemeConfig } from '../theme/theme-config'

/**
 * ThemePreviewThumbnail - Visual thumbnail preview of a theme
 *
 * Shows a mini preview of a theme's colors including:
 * - Background color
 * - Primary color
 * - Secondary/accent areas
 * - Card styling
 *
 * @example
 * ```tsx
 * // Preview a preset
 * <ThemePreviewThumbnail preset="default" />
 *
 * // Preview a custom theme
 * <ThemePreviewThumbnail theme={myCustomTheme} />
 *
 * // With selection state
 * <ThemePreviewThumbnail preset="neutral-dark" selected />
 * ```
 */

export interface ThemePreviewThumbnailProps {
  /**
   * Preset name to preview
   */
  preset?: ModernThemePresetName
  /**
   * Custom theme to preview (takes precedence over preset)
   */
  theme?: CompleteThemeConfig
  /**
   * Whether this thumbnail is selected
   */
  selected?: boolean
  /**
   * Size of the thumbnail
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Show the theme name label
   * @default true
   */
  showLabel?: boolean
  /**
   * Click handler
   */
  onClick?: () => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Convert HSL string to CSS hsl() value
 */
function toHSL(hslString: string): string {
  return `hsl(${hslString})`
}

/**
 * Size configurations
 */
const sizes = {
  sm: {
    width: 64,
    height: 48,
    borderRadius: 4,
    padding: 4,
  },
  md: {
    width: 96,
    height: 72,
    borderRadius: 6,
    padding: 6,
  },
  lg: {
    width: 128,
    height: 96,
    borderRadius: 8,
    padding: 8,
  },
} as const

export function ThemePreviewThumbnail({
  preset,
  theme: customTheme,
  selected = false,
  size = 'md',
  showLabel = true,
  onClick,
  className = '',
}: ThemePreviewThumbnailProps) {
  // Get the theme to preview
  const theme = React.useMemo(() => {
    if (customTheme) return customTheme
    if (preset && preset in modernThemes) return modernThemes[preset]
    return modernThemes['default']
  }, [customTheme, preset])

  const sizeConfig = sizes[size]
  const colors = theme.colors

  // Generate display name
  const displayName = React.useMemo(() => {
    if (customTheme?.name) return customTheme.name
    if (preset) {
      return preset.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }
    return 'Custom'
  }, [customTheme, preset])

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: onClick ? 'pointer' : 'default',
  }

  const thumbnailStyle: React.CSSProperties = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderRadius: sizeConfig.borderRadius,
    padding: sizeConfig.padding,
    backgroundColor: toHSL(colors.background),
    border: selected
      ? `2px solid ${toHSL(colors.primary)}`
      : '1px solid rgba(0,0,0,0.1)',
    boxShadow: selected
      ? `0 0 0 2px ${toHSL(colors.primary)}33`
      : '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: size === 'sm' ? 2 : 4,
    overflow: 'hidden',
    transition: 'all 150ms ease-in-out',
    position: 'relative',
  }

  // Mini UI preview elements
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  }

  const circleSize = size === 'sm' ? 4 : size === 'md' ? 5 : 6

  const cardStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: toHSL(colors.card),
    borderRadius: Math.max(2, sizeConfig.borderRadius - 4),
    padding: size === 'sm' ? 2 : 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }

  const lineStyle = (width: string, color: string): React.CSSProperties => ({
    height: size === 'sm' ? 2 : 3,
    width,
    backgroundColor: toHSL(color),
    borderRadius: 1,
    opacity: 0.9,
  })

  const buttonStyle: React.CSSProperties = {
    height: size === 'sm' ? 6 : 8,
    width: size === 'sm' ? 20 : 28,
    backgroundColor: toHSL(colors.primary),
    borderRadius: 2,
    marginTop: 'auto',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: size === 'sm' ? 9 : size === 'md' ? 10 : 11,
    fontWeight: 500,
    color: selected ? toHSL(colors.primary) : '#666',
    textAlign: 'center',
    maxWidth: sizeConfig.width,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      aria-label={`Theme preview: ${displayName}${selected ? ' (selected)' : ''}`}
      aria-pressed={onClick ? selected : undefined}
    >
      <div style={thumbnailStyle}>
        {/* Header area with dots */}
        <div style={headerStyle}>
          <div
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: '50%',
              backgroundColor: toHSL(colors.destructive),
            }}
          />
          <div
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: '50%',
              backgroundColor: toHSL(colors.warning),
            }}
          />
          <div
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: '50%',
              backgroundColor: toHSL(colors.success),
            }}
          />
        </div>

        {/* Card preview */}
        <div style={cardStyle}>
          <div style={lineStyle('70%', colors.foreground)} />
          <div style={lineStyle('50%', colors.mutedForeground)} />
          <div style={buttonStyle} />
        </div>
      </div>

      {showLabel && <div style={labelStyle}>{displayName}</div>}
    </div>
  )
}

/**
 * ThemePreviewGrid - Grid of theme preview thumbnails
 *
 * @example
 * ```tsx
 * <ThemePreviewGrid
 *   selectedPreset="default"
 *   onSelect={(preset) => setTheme({ preset })}
 * />
 * ```
 */
export interface ThemePreviewGridProps {
  /**
   * Currently selected preset
   */
  selectedPreset?: ModernThemePresetName
  /**
   * Callback when a theme is selected
   */
  onSelect?: (preset: ModernThemePresetName) => void
  /**
   * Size of thumbnails
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Show only light or dark themes
   */
  filter?: 'all' | 'light' | 'dark'
  /**
   * Additional class name
   */
  className?: string
}

export function ThemePreviewGrid({
  selectedPreset,
  onSelect,
  size = 'md',
  filter = 'all',
  className = '',
}: ThemePreviewGridProps) {
  const presets = React.useMemo(() => {
    const allPresets = Object.keys(modernThemes) as ModernThemePresetName[]

    if (filter === 'light') {
      return allPresets.filter((p) => !p.endsWith('-dark'))
    }
    if (filter === 'dark') {
      return allPresets.filter((p) => p.endsWith('-dark'))
    }
    return allPresets
  }, [filter])

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${sizes[size].width + 16}px, 1fr))`,
    gap: 16,
    padding: 8,
  }

  return (
    <div
      style={gridStyle}
      className={className}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {presets.map((preset) => (
        <ThemePreviewThumbnail
          key={preset}
          preset={preset}
          selected={selectedPreset === preset}
          size={size}
          onClick={onSelect ? () => onSelect(preset) : undefined}
        />
      ))}
    </div>
  )
}

export default ThemePreviewThumbnail
