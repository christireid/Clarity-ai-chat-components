/**
 * Clarity Chat - Theme Customizer Types
 */

import type { CompleteThemeConfig, ColorConfig } from '../../../theme/theme-config'
import type { ColorBlindnessType, ColorHarmony } from '../../../theme/color-advanced'

export interface ThemeCustomizerProps {
  /** Additional CSS classes */
  className?: string
  /** Callback when theme changes */
  onThemeChange?: (theme: CompleteThemeConfig) => void
  /** Show preset selector */
  showPresets?: boolean
  /** Show color customization */
  showColors?: boolean
  /** Show typography controls */
  showTypography?: boolean
  /** Show accessibility info */
  showAccessibility?: boolean
  /** Show export options */
  showExport?: boolean
  /** Compact mode */
  compact?: boolean
  /** Enable theme persistence to localStorage */
  persistTheme?: boolean
  /** Storage key for persistence */
  storageKey?: string
}

export interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  showHex?: boolean
  id?: string
}

export type FontFamily = 'system' | 'inter' | 'roboto' | 'mono'
export type SizeScale = 'compact' | 'default' | 'large'

export interface TypographySettings {
  fontFamily: FontFamily
  sizeScale: SizeScale
}

export interface PersistentThemeState {
  preset: string
  customColors: Partial<ColorConfig>
  typography: TypographySettings
}

export interface ContrastBadgeProps {
  foreground: string
  background: string
  label: string
}

export interface ColorBlindnessPreviewProps {
  color: string
  showAllTypes?: boolean
}

export interface ColorBlindnessPanelFullProps {
  colors: ColorConfig
}

export interface SmartPaletteGeneratorProps {
  baseColor: string
  onApplyPalette: (colors: Partial<ColorConfig>) => void
  onSelectSingleColor?: (color: string) => void
}

export interface EnhancedExportPanelProps {
  theme: CompleteThemeConfig | null
  typography: TypographySettings
}

export interface ThemePreviewCardProps {
  name: string
  isSelected: boolean
  onClick: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}

// Constants

export const FONT_FAMILIES: Array<{ id: FontFamily; label: string; family: string }> = [
  { id: 'system', label: 'System', family: 'system-ui, sans-serif' },
  { id: 'inter', label: 'Inter', family: '"Inter", system-ui, sans-serif' },
  { id: 'roboto', label: 'Roboto', family: '"Roboto", system-ui, sans-serif' },
  { id: 'mono', label: 'Monospace', family: 'ui-monospace, monospace' },
]

export const SIZE_SCALES: Array<{ id: SizeScale; label: string; multiplier: number }> = [
  { id: 'compact', label: 'Compact', multiplier: 0.875 },
  { id: 'default', label: 'Default', multiplier: 1 },
  { id: 'large', label: 'Large', multiplier: 1.125 },
]

export const ALL_COLOR_BLINDNESS_TYPES: Array<{
  type: ColorBlindnessType
  label: string
  description: string
  prevalence: string
}> = [
  {
    type: 'protanopia',
    label: 'Protanopia',
    description: 'Red-blind',
    prevalence: '1% of males',
  },
  {
    type: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Green-blind',
    prevalence: '1% of males',
  },
  {
    type: 'tritanopia',
    label: 'Tritanopia',
    description: 'Blue-blind',
    prevalence: '0.003%',
  },
  {
    type: 'protanomaly',
    label: 'Protanomaly',
    description: 'Red-weak',
    prevalence: '1% of males',
  },
  {
    type: 'deuteranomaly',
    label: 'Deuteranomaly',
    description: 'Green-weak',
    prevalence: '5% of males',
  },
  {
    type: 'tritanomaly',
    label: 'Tritanomaly',
    description: 'Blue-weak',
    prevalence: '0.01%',
  },
  {
    type: 'achromatopsia',
    label: 'Achromatopsia',
    description: 'Total color blindness',
    prevalence: '0.003%',
  },
  {
    type: 'achromatomaly',
    label: 'Achromatomaly',
    description: 'Partial color blindness',
    prevalence: 'Rare',
  },
]

export const COLOR_ROLE_MAPPING: Array<{ role: keyof ColorConfig; label: string }> = [
  { role: 'primary', label: 'Primary' },
  { role: 'secondary', label: 'Secondary' },
  { role: 'accent', label: 'Accent' },
  { role: 'success', label: 'Success' },
  { role: 'destructive', label: 'Destructive' },
]
