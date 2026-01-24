/**
 * Clarity Chat - Color Picker Component
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { hslStringToHex, hexToHSLString } from '../../../theme/color-utils'
import {
  simulateColorBlindness,
  generateHarmoniousPalette,
  type ColorHarmony,
} from '../../../theme/color-advanced'
import type { ColorConfig } from '../../../theme/theme-config'
import type {
  ColorPickerProps,
  SmartPaletteGeneratorProps,
  ALL_COLOR_BLINDNESS_TYPES,
  COLOR_ROLE_MAPPING,
} from './types'
import {
  ALL_COLOR_BLINDNESS_TYPES as COLOR_BLINDNESS_TYPES,
  COLOR_ROLE_MAPPING as ROLE_MAPPING,
} from './types'

/**
 * Color Picker with hex input and visual swatch
 */
export function ColorPicker({
  label,
  value,
  onChange,
  showHex = true,
  id,
}: ColorPickerProps) {
  const hex = value.startsWith('#') ? value : hslStringToHex(value)
  const [localHex, setLocalHex] = React.useState(hex)
  const pickerId = id || `color-picker-${label.toLowerCase().replace(/\s+/g, '-')}`

  React.useEffect(() => {
    setLocalHex(hex)
  }, [hex])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    setLocalHex(newHex)
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      onChange(hexToHSLString(newHex))
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    setLocalHex(newHex)
    onChange(hexToHSLString(newHex))
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={pickerId}
        className="text-sm font-medium text-foreground min-w-[100px]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={pickerId}
          type="color"
          value={hex}
          onChange={handleColorChange}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border overflow-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{ padding: 0 }}
          aria-label={`Choose ${label} color`}
        />
      </div>
      {showHex && (
        <input
          type="text"
          value={localHex}
          onChange={handleHexChange}
          className="w-24 px-2 py-1.5 text-sm font-mono rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          placeholder="#000000"
          aria-label={`${label} hex value`}
        />
      )}
    </div>
  )
}

/**
 * Smart Palette Generator that applies colors to multiple roles
 */
export function SmartPaletteGenerator({
  baseColor,
  onApplyPalette,
  onSelectSingleColor,
}: SmartPaletteGeneratorProps) {
  const [harmony, setHarmony] = React.useState<ColorHarmony>('complementary')
  const [previewMapping, setPreviewMapping] = React.useState(false)
  const hex = baseColor.startsWith('#') ? baseColor : hslStringToHex(baseColor)
  const palette = generateHarmoniousPalette(hex, harmony, 5)

  const harmonies: ColorHarmony[] = [
    'complementary',
    'analogous',
    'triadic',
    'tetradic',
    'split-complementary',
    'monochromatic',
  ]

  const handleApplyAll = () => {
    const newColors: Partial<ColorConfig> = {}
    palette.forEach((color, index) => {
      const role = ROLE_MAPPING[index]
      if (role) {
        newColors[role.role] = hexToHSLString(color)
      }
    })
    onApplyPalette(newColors)
    setPreviewMapping(false)
  }

  return (
    <div className="space-y-4">
      {/* Harmony selector */}
      <div
        className="flex gap-2 flex-wrap"
        role="radiogroup"
        aria-label="Color harmony type"
      >
        {harmonies.map((h) => (
          <button
            key={h}
            onClick={() => setHarmony(h)}
            className={cn(
              'px-2 py-1 text-xs rounded-md capitalize transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              harmony === h
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            role="radio"
            aria-checked={harmony === h}
          >
            {h.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Palette preview with role mapping */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {palette.map((color, i) => (
            <div key={i} className="flex-1 text-center">
              <button
                onClick={() => onSelectSingleColor?.(hexToHSLString(color))}
                className="w-full aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ backgroundColor: color }}
                title={`Click to set as primary: ${color}`}
                aria-label={`Select color ${color} as primary`}
              />
              {previewMapping && ROLE_MAPPING[i] && (
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  → {ROLE_MAPPING[i].label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMapping(!previewMapping)}
            className="text-xs text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            {previewMapping ? 'Hide mapping' : 'Preview role mapping'}
          </button>
          <button
            onClick={handleApplyAll}
            className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Apply All Colors
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Click individual colors to set as primary, or "Apply All" to map entire palette.
      </p>
    </div>
  )
}
