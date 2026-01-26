/**
 * Clarity Chat - Theme Preset Selector Component
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  modernThemes,
  modernThemeMetadata,
  type ModernThemePresetName,
} from '../../../theme/modern-presets'
import { hslStringToHex } from '../../../theme/color-utils'
import type { ThemePreviewCardProps } from './types'

/**
 * Theme Preview Card with keyboard support
 */
export function ThemePreviewCard({
  name,
  isSelected,
  onClick,
  onKeyDown,
}: ThemePreviewCardProps) {
  const metadata = modernThemeMetadata[name as ModernThemePresetName]
  const theme = modernThemes[name as ModernThemePresetName]
  const prefersReducedMotion = useReducedMotion()

  if (!metadata || !theme) {
    return null
  }

  const bgHex = hslStringToHex(theme.colors.background)
  const fgHex = hslStringToHex(theme.colors.foreground)
  const primaryHex = hslStringToHex(theme.colors.primary)
  const secondaryHex = hslStringToHex(theme.colors.secondary)

  return (
    <motion.button
      onClick={onClick}
      onKeyDown={onKeyDown}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
      className={cn(
        'relative rounded-xl p-3 text-left transition-all duration-200',
        'border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      )}
      style={{ backgroundColor: bgHex }}
      role="option"
      aria-selected={isSelected}
      aria-label={`${metadata.displayName} theme - ${metadata.description}`}
      tabIndex={0}
    >
      {/* Color swatches */}
      <div className="flex gap-1.5 mb-2" aria-hidden="true">
        <div
          className="w-6 h-6 rounded-full border border-black/10"
          style={{ backgroundColor: primaryHex }}
        />
        <div
          className="w-6 h-6 rounded-full border border-black/10"
          style={{ backgroundColor: secondaryHex }}
        />
        <div
          className="w-6 h-6 rounded-full border border-black/10"
          style={{ backgroundColor: fgHex }}
        />
      </div>

      {/* Theme name */}
      <p className="text-sm font-semibold truncate" style={{ color: fgHex }}>
        {metadata.displayName}
      </p>
      <p className="text-xs opacity-70 truncate" style={{ color: fgHex }}>
        {metadata.description.slice(0, 30)}...
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}
