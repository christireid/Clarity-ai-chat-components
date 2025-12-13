/**
 * Clarity Chat - Theme Customizer Component
 *
 * A comprehensive, interactive theme customization interface.
 * Features live preview, preset selection, color pickers, and
 * accessibility information.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useTheme, type ThemePresetName } from '../theme/ThemeProvider'
import {
  modernThemes,
  modernThemeMetadata,
  getThemesByCategory,
  type ModernThemePresetName,
} from '../theme/modern-presets'
import type { CompleteThemeConfig, ColorConfig } from '../theme/theme-config'
import { createTheme } from '../theme/create-theme'
import {
  getContrastRatio,
  hslStringToHex,
  hexToHSLString,
} from '../theme/color-utils'
import {
  simulateColorBlindness,
  type ColorBlindnessType,
  analyzeColor,
  generateHarmoniousPalette,
  type ColorHarmony,
} from '../theme/color-advanced'
import { useReducedMotion } from '../hooks/use-reduced-motion'

// ============================================================================
// Types
// ============================================================================

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
}

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  showHex?: boolean
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Color Picker with hex input and visual swatch
 */
function ColorPicker({
  label,
  value,
  onChange,
  showHex = true,
}: ColorPickerProps) {
  const hex = value.startsWith('#') ? value : hslStringToHex(value)
  const [localHex, setLocalHex] = React.useState(hex)

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
      <label className="text-sm font-medium text-foreground min-w-[100px]">
        {label}
      </label>
      <div className="relative">
        <input
          type="color"
          value={hex}
          onChange={handleColorChange}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border overflow-hidden"
          style={{ padding: 0 }}
        />
      </div>
      {showHex && (
        <input
          type="text"
          value={localHex}
          onChange={handleHexChange}
          className="w-24 px-2 py-1.5 text-sm font-mono rounded-md border border-border bg-background text-foreground"
          placeholder="#000000"
        />
      )}
    </div>
  )
}

/**
 * Theme Preview Card
 */
function ThemePreviewCard({
  name,
  isSelected,
  onClick,
}: {
  name: ModernThemePresetName
  isSelected: boolean
  onClick: () => void
}) {
  const metadata = modernThemeMetadata[name]
  const theme = modernThemes[name]
  const prefersReducedMotion = useReducedMotion()

  const bgHex = hslStringToHex(theme.colors.background)
  const fgHex = hslStringToHex(theme.colors.foreground)
  const primaryHex = hslStringToHex(theme.colors.primary)
  const secondaryHex = hslStringToHex(theme.colors.secondary)

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
      className={cn(
        'relative rounded-xl p-3 text-left transition-all duration-200',
        'border-2',
        isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      )}
      style={{ backgroundColor: bgHex }}
    >
      {/* Color swatches */}
      <div className="flex gap-1.5 mb-2">
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
      <p
        className="text-sm font-semibold truncate"
        style={{ color: fgHex }}
      >
        {metadata.displayName}
      </p>
      <p
        className="text-xs opacity-70 truncate"
        style={{ color: fgHex }}
      >
        {metadata.description.slice(0, 30)}...
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
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

/**
 * Contrast Checker Badge
 */
function ContrastBadge({
  foreground,
  background,
  label,
}: {
  foreground: string
  background: string
  label: string
}) {
  const ratio = getContrastRatio(foreground, background)
  const passesAA = ratio >= 4.5
  const passesAAA = ratio >= 7

  return (
    <div className="flex items-center gap-2 text-sm">
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
 * Color Blindness Preview
 */
function ColorBlindnessPreview({ color }: { color: string }) {
  const types: Array<{ type: ColorBlindnessType; label: string }> = [
    { type: 'protanopia', label: 'Protanopia' },
    { type: 'deuteranopia', label: 'Deuteranopia' },
    { type: 'tritanopia', label: 'Tritanopia' },
  ]

  const hex = color.startsWith('#') ? color : hslStringToHex(color)

  return (
    <div className="flex gap-2">
      <div className="text-center">
        <div
          className="w-8 h-8 rounded-lg border border-border"
          style={{ backgroundColor: hex }}
        />
        <span className="text-[10px] text-muted-foreground">Original</span>
      </div>
      {types.map(({ type, label }) => {
        const simulated = simulateColorBlindness(hex, type)
        return (
          <div key={type} className="text-center">
            <div
              className="w-8 h-8 rounded-lg border border-border"
              style={{ backgroundColor: simulated }}
            />
            <span className="text-[10px] text-muted-foreground">
              {label.slice(0, 4)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Palette Generator
 */
function PaletteGenerator({
  baseColor,
  onSelectColor,
}: {
  baseColor: string
  onSelectColor?: (color: string) => void
}) {
  const [harmony, setHarmony] = React.useState<ColorHarmony>('complementary')
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

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {harmonies.map((h) => (
          <button
            key={h}
            onClick={() => setHarmony(h)}
            className={cn(
              'px-2 py-1 text-xs rounded-md capitalize transition-colors',
              harmony === h
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {h.replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {palette.map((color, i) => (
          <button
            key={i}
            onClick={() => onSelectColor?.(hexToHSLString(color))}
            className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function ThemeCustomizer({
  className,
  onThemeChange,
  showPresets = true,
  showColors = true,
  showTypography = false,
  showAccessibility = true,
  showExport = true,
  compact = false,
}: ThemeCustomizerProps) {
  const { theme, setTheme, mode, resolvedTheme, setPreset, availablePresets } =
    useTheme()
  const [activeTab, setActiveTab] = React.useState<
    'presets' | 'colors' | 'typography' | 'accessibility' | 'export'
  >('presets')
  const [customColors, setCustomColors] = React.useState<Partial<ColorConfig>>(
    {}
  )
  const prefersReducedMotion = useReducedMotion()

  // Determine current preset - check customTheme first, then preset property
  const getCurrentPreset = (): ModernThemePresetName => {
    if (theme.preset) return theme.preset as ModernThemePresetName
    if (theme.customTheme?.name) {
      // Check if customTheme name matches a known preset
      const presetNames = Object.keys(modernThemes) as ModernThemePresetName[]
      const matchingPreset = presetNames.find(
        (p) => p === theme.customTheme?.name
      )
      if (matchingPreset) return matchingPreset
    }
    return mode === 'dark' ? 'default-dark' : 'default'
  }
  const currentPreset = getCurrentPreset()
  const categories = getThemesByCategory()

  // Handle preset selection
  const handlePresetSelect = (name: ModernThemePresetName) => {
    setPreset(name as ThemePresetName)
    setCustomColors({})
  }

  // Handle color customization
  const handleColorChange = (key: keyof ColorConfig, value: string) => {
    const newColors = { ...customColors, [key]: value }
    setCustomColors(newColors)

    // Create new theme with custom colors
    const baseTheme = modernThemes[currentPreset as ModernThemePresetName]
    const customTheme = createTheme({
      extends: currentPreset as ModernThemePresetName,
      colors: newColors,
    })
    setTheme({ customTheme })
    onThemeChange?.(customTheme)
  }

  // Get current colors
  const currentColors = resolvedTheme?.colors || modernThemes['default'].colors

  const tabs = [
    { id: 'presets', label: 'Presets', show: showPresets },
    { id: 'colors', label: 'Colors', show: showColors },
    { id: 'typography', label: 'Typography', show: showTypography },
    { id: 'accessibility', label: 'A11y', show: showAccessibility },
    { id: 'export', label: 'Export', show: showExport },
  ].filter((t) => t.show)

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border shadow-lg overflow-hidden',
        compact ? 'max-w-md' : 'max-w-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Theme Customizer</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of your chat
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
              'border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <motion.div
              key="presets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-4"
            >
              {/* Mode Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Mode:
                </span>
                <div className="flex rounded-lg bg-muted p-1">
                  {(['light', 'dark', 'system'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setTheme({ mode: m })}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-md capitalize transition-colors',
                        theme.mode === m
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {theme.mode === 'system' && (
                  <span className="text-xs text-muted-foreground">
                    (using {mode})
                  </span>
                )}
              </div>

              {/* Theme Categories */}
              {Object.entries(categories).map(([category, themeNames]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {themeNames
                      .filter((name) =>
                        mode === 'dark'
                          ? name.endsWith('-dark')
                          : !name.endsWith('-dark')
                      )
                      .map((name) => (
                        <ThemePreviewCard
                          key={name}
                          name={name}
                          isSelected={currentPreset === name}
                          onClick={() => handlePresetSelect(name)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Primary Colors */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Brand Colors
                </h4>
                <ColorPicker
                  label="Primary"
                  value={currentColors.primary}
                  onChange={(v) => handleColorChange('primary', v)}
                />
                <ColorPicker
                  label="Secondary"
                  value={currentColors.secondary}
                  onChange={(v) => handleColorChange('secondary', v)}
                />
                <ColorPicker
                  label="Accent"
                  value={currentColors.accent}
                  onChange={(v) => handleColorChange('accent', v)}
                />
              </div>

              {/* Background Colors */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Background
                </h4>
                <ColorPicker
                  label="Background"
                  value={currentColors.background}
                  onChange={(v) => handleColorChange('background', v)}
                />
                <ColorPicker
                  label="Foreground"
                  value={currentColors.foreground}
                  onChange={(v) => handleColorChange('foreground', v)}
                />
              </div>

              {/* Palette Generator */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Palette Generator
                </h4>
                <PaletteGenerator
                  baseColor={currentColors.primary}
                  onSelectColor={(c) => handleColorChange('primary', c)}
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setCustomColors({})
                  setPreset(currentPreset as ThemePresetName)
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Reset to preset defaults
              </button>
            </motion.div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <motion.div
              key="typography"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Font Family */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Font Family
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'system', label: 'System', family: 'system-ui, sans-serif' },
                    { id: 'inter', label: 'Inter', family: '"Inter", system-ui, sans-serif' },
                    { id: 'roboto', label: 'Roboto', family: '"Roboto", system-ui, sans-serif' },
                    { id: 'mono', label: 'Monospace', family: 'ui-monospace, monospace' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg border transition-colors text-left',
                        'hover:border-primary/50',
                        'border-border bg-background'
                      )}
                      style={{ fontFamily: font.family }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Scale */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Size Scale
                </h4>
                <div className="flex gap-2">
                  {['compact', 'default', 'large'].map((size) => (
                    <button
                      key={size}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors capitalize',
                        'hover:border-primary/50',
                        size === 'default'
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Preview
                </h4>
                <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                  <p className="text-xs text-muted-foreground">Extra Small Text</p>
                  <p className="text-sm text-muted-foreground">Small Body Text</p>
                  <p className="text-base text-foreground">Base Body Text</p>
                  <p className="text-lg font-medium text-foreground">Large Text</p>
                  <p className="text-xl font-semibold text-foreground">Heading XL</p>
                  <p className="text-2xl font-bold text-foreground">Heading 2XL</p>
                </div>
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground">
                Typography changes require theme rebuild. Use the ThemeBuilder API for full control.
              </p>
            </motion.div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Contrast Checks */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Contrast Ratios
                </h4>
                <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                  <ContrastBadge
                    foreground={currentColors.foreground}
                    background={currentColors.background}
                    label="Text/Background"
                  />
                  <ContrastBadge
                    foreground={currentColors.primaryForeground}
                    background={currentColors.primary}
                    label="Primary Button"
                  />
                  <ContrastBadge
                    foreground={currentColors.mutedForeground}
                    background={currentColors.muted}
                    label="Muted Text"
                  />
                </div>
              </div>

              {/* Color Blindness Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Color Blindness Preview
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground min-w-[70px]">
                      Primary:
                    </span>
                    <ColorBlindnessPreview color={currentColors.primary} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground min-w-[70px]">
                      Destructive:
                    </span>
                    <ColorBlindnessPreview color={currentColors.destructive} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground min-w-[70px]">
                      Success:
                    </span>
                    <ColorBlindnessPreview color={currentColors.success} />
                  </div>
                </div>
              </div>

              {/* WCAG Info */}
              <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                <p className="text-sm text-info">
                  <strong>WCAG Guidelines:</strong> AA requires 4.5:1 for normal
                  text, 3:1 for large text. AAA requires 7:1 and 4.5:1
                  respectively.
                </p>
              </div>
            </motion.div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-4"
            >
              <ExportPanel theme={resolvedTheme} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Export Panel Component
 */
function ExportPanel({ theme }: { theme: CompleteThemeConfig | null }) {
  const [exportFormat, setExportFormat] = React.useState<
    'json' | 'css' | 'tailwind'
  >('css')
  const [copied, setCopied] = React.useState(false)

  if (!theme) return null

  const generateCSS = (): string => {
    const lines = [':root {']
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      lines.push(`  --${cssKey}: ${value};`)
    })
    lines.push(`  --radius: ${theme.borders.radius.lg};`)
    lines.push('}')
    return lines.join('\n')
  }

  const generateTailwind = (): string => {
    const config = {
      theme: {
        extend: {
          colors: {} as Record<string, string>,
        },
      },
    }

    Object.entries(theme.colors).forEach(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      config.theme.extend.colors[kebabKey] = `hsl(${value})`
    })

    return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`
  }

  const getExportContent = (): string => {
    switch (exportFormat) {
      case 'json':
        return JSON.stringify(theme, null, 2)
      case 'css':
        return generateCSS()
      case 'tailwind':
        return generateTailwind()
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = getExportContent()
    const ext = exportFormat === 'json' ? 'json' : exportFormat === 'css' ? 'css' : 'js'
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clarity-theme.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="flex gap-2">
        {(['css', 'json', 'tailwind'] as const).map((format) => (
          <button
            key={format}
            onClick={() => setExportFormat(format)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md capitalize transition-colors',
              exportFormat === format
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {format === 'tailwind' ? 'Tailwind' : format.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Code Preview */}
      <div className="relative">
        <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-xs font-mono text-foreground max-h-64">
          {getExportContent()}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            'border border-border hover:bg-muted'
          )}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Download File
        </button>
      </div>
    </div>
  )
}

export default ThemeCustomizer
