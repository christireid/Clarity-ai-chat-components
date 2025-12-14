'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
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
 * Size configurations for Tailwind classes
 */
const sizeClasses = {
  sm: {
    container: 'w-16 h-12 p-1 rounded',
    gap: 'gap-0.5',
    circleSize: 'w-1 h-1',
    cardRadius: 'rounded-sm',
    cardPadding: 'p-0.5',
    lineHeight: 'h-0.5',
    buttonSize: 'h-1.5 w-5',
    labelSize: 'text-[9px]',
  },
  md: {
    container: 'w-24 h-[72px] p-1.5 rounded-md',
    gap: 'gap-1',
    circleSize: 'w-1.5 h-1.5',
    cardRadius: 'rounded',
    cardPadding: 'p-1',
    lineHeight: 'h-[3px]',
    buttonSize: 'h-2 w-7',
    labelSize: 'text-[10px]',
  },
  lg: {
    container: 'w-32 h-24 p-2 rounded-lg',
    gap: 'gap-1',
    circleSize: 'w-1.5 h-1.5',
    cardRadius: 'rounded-md',
    cardPadding: 'p-1',
    lineHeight: 'h-[3px]',
    buttonSize: 'h-2 w-7',
    labelSize: 'text-[11px]',
  },
} as const

/**
 * Size width values for grid calculations
 */
const sizeWidths = {
  sm: 64,
  md: 96,
  lg: 128,
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

  const classes = sizeClasses[size]
  const colors = theme.colors

  // Generate display name
  const displayName = React.useMemo(() => {
    if (customTheme?.name) return customTheme.name
    if (preset) {
      return preset.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }
    return 'Custom'
  }, [customTheme, preset])

  // CSS variables for dynamic theme colors
  const themeVars = {
    '--thumb-bg': toHSL(colors.background),
    '--thumb-card': toHSL(colors.card),
    '--thumb-primary': toHSL(colors.primary),
    '--thumb-foreground': toHSL(colors.foreground),
    '--thumb-muted-fg': toHSL(colors.mutedForeground),
    '--thumb-destructive': toHSL(colors.destructive),
    '--thumb-warning': toHSL(colors.warning),
    '--thumb-success': toHSL(colors.success),
  } as React.CSSProperties

  return (
    <div
      style={themeVars}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className
      )}
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
      <div
        className={cn(
          'flex flex-col overflow-hidden transition-all duration-150 ease-in-out relative',
          classes.container,
          classes.gap,
          selected
            ? 'border-2 shadow-md ring-2 ring-offset-0'
            : 'border shadow-sm'
        )}
        style={
          {
            backgroundColor: 'var(--thumb-bg)',
            borderColor: selected ? 'var(--thumb-primary)' : 'rgba(0,0,0,0.1)',
            boxShadow: selected
              ? `0 0 0 2px color-mix(in srgb, var(--thumb-primary), transparent 80%)`
              : '0 1px 3px rgba(0,0,0,0.1)',
            '--tw-ring-color': selected
              ? 'color-mix(in srgb, var(--thumb-primary), transparent 80%)'
              : 'transparent',
          } as React.CSSProperties
        }
      >
        {/* Header area with dots */}
        <div className="flex items-center gap-[3px]">
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{
              backgroundColor: 'var(--thumb-destructive)',
              // Inline style for deterministic visual-regression tests
              borderRadius: '50%',
            }}
          />
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{
              backgroundColor: 'var(--thumb-warning)',
              borderRadius: '50%',
            }}
          />
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{
              backgroundColor: 'var(--thumb-success)',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Card preview */}
        <div
          className={cn(
            'flex-1 flex flex-col gap-0.5',
            classes.cardRadius,
            classes.cardPadding
          )}
          style={{ backgroundColor: 'var(--thumb-card)' }}
        >
          <div
            className={cn('w-[70%] rounded-sm opacity-90', classes.lineHeight)}
            style={{ backgroundColor: 'var(--thumb-foreground)', borderRadius: '1px' }}
          />
          <div
            className={cn('w-[50%] rounded-sm opacity-90', classes.lineHeight)}
            style={{ backgroundColor: 'var(--thumb-muted-fg)', borderRadius: '1px' }}
          />
          <div
            className={cn('mt-auto rounded-sm', classes.buttonSize)}
            style={{ backgroundColor: 'var(--thumb-primary)', borderRadius: '1px' }}
          />
        </div>
      </div>

      {showLabel && (
        <div
          className={cn(
            'font-medium text-center truncate',
            classes.labelSize,
            selected ? '' : 'text-muted-foreground'
          )}
          style={{
            maxWidth: sizeWidths[size],
            color: selected ? 'var(--thumb-primary)' : undefined,
          }}
        >
          {displayName}
        </div>
      )}
    </div>
  )
}

/**
 * ThemePreviewGrid - Grid of theme preview thumbnails
 *
 * Features:
 * - Keyboard navigation with arrow keys (roving tabindex)
 * - Home/End key support
 * - Filter by light/dark themes
 * - Accessible radiogroup pattern
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
  const gridRef = React.useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)

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

  // Initialize focused index when selection changes
  React.useEffect(() => {
    if (selectedPreset) {
      const index = presets.indexOf(selectedPreset)
      if (index !== -1) {
        setFocusedIndex(index)
      }
    }
  }, [selectedPreset, presets])

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!onSelect) return

      const presetsCount = presets.length
      let newIndex = focusedIndex

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          newIndex = focusedIndex < presetsCount - 1 ? focusedIndex + 1 : 0
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          newIndex = focusedIndex > 0 ? focusedIndex - 1 : presetsCount - 1
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = presetsCount - 1
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < presetsCount) {
            onSelect(presets[focusedIndex])
          }
          return
        default:
          return
      }

      setFocusedIndex(newIndex)

      // Focus the new item
      const items = gridRef.current?.querySelectorAll('[role="radio"]')
      if (items && items[newIndex]) {
        ;(items[newIndex] as HTMLElement).focus()
      }
    },
    [focusedIndex, presets, onSelect]
  )

  // Calculate grid template columns based on size
  const gridMinWidth = sizeWidths[size] + 16

  return (
    <div
      ref={gridRef}
      className={cn('grid gap-4 p-2', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`,
      }}
      role="radiogroup"
      aria-label="Theme selection"
      onKeyDown={handleKeyDown}
    >
      {presets.map((preset, index) => (
        <ThemePreviewGridItem
          key={preset}
          preset={preset}
          selected={selectedPreset === preset}
          focused={focusedIndex === index}
          size={size}
          onClick={onSelect ? () => onSelect(preset) : undefined}
          onFocus={() => setFocusedIndex(index)}
          tabIndex={
            onSelect
              ? focusedIndex === index || (focusedIndex === -1 && index === 0)
                ? 0
                : -1
              : undefined
          }
        />
      ))}
    </div>
  )
}

/**
 * Internal grid item component with radio role for accessibility
 */
interface ThemePreviewGridItemProps {
  preset: ModernThemePresetName
  selected: boolean
  focused: boolean
  size: 'sm' | 'md' | 'lg'
  onClick?: () => void
  onFocus?: () => void
  tabIndex?: number
}

function ThemePreviewGridItem({
  preset,
  selected,
  size,
  onClick,
  onFocus,
  tabIndex,
}: ThemePreviewGridItemProps) {
  const theme = modernThemes[preset]
  const classes = sizeClasses[size]
  const colors = theme.colors

  const displayName = preset
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

  // CSS variables for dynamic theme colors
  const themeVars = {
    '--thumb-bg': toHSL(colors.background),
    '--thumb-card': toHSL(colors.card),
    '--thumb-primary': toHSL(colors.primary),
    '--thumb-foreground': toHSL(colors.foreground),
    '--thumb-muted-fg': toHSL(colors.mutedForeground),
    '--thumb-destructive': toHSL(colors.destructive),
    '--thumb-warning': toHSL(colors.warning),
    '--thumb-success': toHSL(colors.success),
  } as React.CSSProperties

  return (
    <div
      style={themeVars}
      onClick={onClick}
      onFocus={onFocus}
      className={cn(
        'flex flex-col items-center gap-1.5',
        onClick ? 'cursor-pointer' : 'cursor-default',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg'
      )}
      role={onClick ? 'radio' : undefined}
      tabIndex={tabIndex}
      aria-checked={onClick ? selected : undefined}
      aria-label={`Theme preview: ${displayName}${selected ? ' (selected)' : ''}`}
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
    >
      <div
        className={cn(
          'flex flex-col overflow-hidden transition-all duration-150 ease-in-out relative',
          classes.container,
          classes.gap,
          selected
            ? 'border-2 shadow-md ring-2 ring-offset-0'
            : 'border shadow-sm'
        )}
        style={
          {
            backgroundColor: 'var(--thumb-bg)',
            borderColor: selected ? 'var(--thumb-primary)' : 'rgba(0,0,0,0.1)',
            boxShadow: selected
              ? `0 0 0 2px color-mix(in srgb, var(--thumb-primary), transparent 80%)`
              : '0 1px 3px rgba(0,0,0,0.1)',
            '--tw-ring-color': selected
              ? 'color-mix(in srgb, var(--thumb-primary), transparent 80%)'
              : 'transparent',
          } as React.CSSProperties
        }
      >
        {/* Header area with dots */}
        <div className="flex items-center gap-[3px]">
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{ backgroundColor: 'var(--thumb-destructive)', borderRadius: '50%' }}
          />
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{ backgroundColor: 'var(--thumb-warning)', borderRadius: '50%' }}
          />
          <div
            className={cn('rounded-full', classes.circleSize)}
            style={{ backgroundColor: 'var(--thumb-success)', borderRadius: '50%' }}
          />
        </div>

        {/* Card preview */}
        <div
          className={cn(
            'flex-1 flex flex-col gap-0.5',
            classes.cardRadius,
            classes.cardPadding
          )}
          style={{ backgroundColor: 'var(--thumb-card)' }}
        >
          <div
            className={cn('w-[70%] rounded-sm opacity-90', classes.lineHeight)}
            style={{ backgroundColor: 'var(--thumb-foreground)', borderRadius: '1px' }}
          />
          <div
            className={cn('w-[50%] rounded-sm opacity-90', classes.lineHeight)}
            style={{ backgroundColor: 'var(--thumb-muted-fg)', borderRadius: '1px' }}
          />
          <div
            className={cn('mt-auto rounded-sm', classes.buttonSize)}
            style={{ backgroundColor: 'var(--thumb-primary)', borderRadius: '1px' }}
          />
        </div>
      </div>

      <div
        className={cn(
          'font-medium text-center truncate',
          classes.labelSize,
          selected ? '' : 'text-muted-foreground'
        )}
        style={{
          maxWidth: sizeWidths[size],
          color: selected ? 'var(--thumb-primary)' : undefined,
        }}
      >
        {displayName}
      </div>
    </div>
  )
}

export default ThemePreviewThumbnail
