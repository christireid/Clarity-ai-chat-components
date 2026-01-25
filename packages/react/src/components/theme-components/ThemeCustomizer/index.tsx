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
import { useTheme, type ThemePresetName } from '../../../theme/ThemeProvider'
import {
  modernThemes,
  getThemesByCategory,
  type ModernThemePresetName,
} from '../../../theme/modern-presets'
import type { ColorConfig } from '../../../theme/theme-config'
import { createTheme } from '../../../theme/create-theme'
import { useReducedMotion } from '@clarity-chat/primitives'
import { useLocalStorage } from '../../../hooks/storage/use-local-storage'
import { ColorPicker, SmartPaletteGenerator } from './ColorPicker'
import { ThemePreviewCard } from './PresetSelector'
import {
  ContrastBadge,
  ColorBlindnessPanelFull,
  EnhancedExportPanel,
} from './Preview'
import type {
  ThemeCustomizerProps,
  TypographySettings,
  PersistentThemeState,
  FontFamily,
  SizeScale,
} from './types'
import { FONT_FAMILIES, SIZE_SCALES } from './types'
import { ANIMATION_PRESETS } from '../../../animations/constants'

/**
 * Main Theme Customizer Component
 */
export function ThemeCustomizer({
  className,
  onThemeChange,
  showPresets = true,
  showColors = true,
  showTypography = true,
  showAccessibility = true,
  showExport = true,
  compact = false,
  persistTheme = true,
  storageKey = 'clarity-theme-customizer',
}: ThemeCustomizerProps) {
  const {
    theme,
    setTheme,
    mode,
    toggleMode,
    resolvedTheme,
    setPreset,
    availablePresets,
  } = useTheme()
  const [activeTab, setActiveTab] = React.useState<
    'presets' | 'colors' | 'typography' | 'accessibility' | 'export'
  >('presets')
  const prefersReducedMotion = useReducedMotion()

  // Persistent state
  const [persistentState, setPersistentState] =
    useLocalStorage<PersistentThemeState | null>(storageKey, null)

  // Local state
  const [customColors, setCustomColors] = React.useState<Partial<ColorConfig>>(
    persistentState?.customColors || {}
  )
  const [typography, setTypography] = React.useState<TypographySettings>(
    persistentState?.typography || {
      fontFamily: 'system',
      sizeScale: 'default',
    }
  )
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Restore persistent state on mount
  React.useEffect(() => {
    if (persistTheme && persistentState) {
      if (persistentState.preset) {
        setPreset(persistentState.preset as ThemePresetName)
      }
      if (persistentState.customColors && Object.keys(persistentState.customColors).length > 0) {
        setCustomColors(persistentState.customColors)
      }
      if (persistentState.typography) {
        setTypography(persistentState.typography)
        applyTypographyToDocument(persistentState.typography)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount - intentionally empty to run once

  // Determine current preset - check customTheme first, then preset property
  const getCurrentPreset = (): ModernThemePresetName => {
    if (theme.preset) return theme.preset as ModernThemePresetName
    if (theme.customTheme?.name) {
      const presetNames = Object.keys(modernThemes) as ModernThemePresetName[]
      const matchingPreset = presetNames.find((p) => p === theme.customTheme?.name)
      if (matchingPreset) return matchingPreset
    }
    return mode === 'dark' ? 'default-dark' : 'default'
  }
  const currentPreset = getCurrentPreset()
  const categories = getThemesByCategory()

  // Save state when it changes
  const saveState = React.useCallback(
    (preset: ModernThemePresetName, colors: Partial<ColorConfig>, typo: TypographySettings) => {
      if (persistTheme) {
        setPersistentState({ preset, customColors: colors, typography: typo })
      }
    },
    [persistTheme, setPersistentState]
  )

  // Apply typography to document
  const applyTypographyToDocument = (typo: TypographySettings) => {
    const root = document.documentElement
    const fontConfig = FONT_FAMILIES.find((f) => f.id === typo.fontFamily)
    const sizeConfig = SIZE_SCALES.find((s) => s.id === typo.sizeScale)

    if (fontConfig) {
      root.style.setProperty('--font-sans', fontConfig.family)
    }
    if (sizeConfig) {
      root.style.setProperty('--font-size-multiplier', String(sizeConfig.multiplier))
    }
  }

  // Handle preset selection with transition animation
  const handlePresetSelect = (name: ModernThemePresetName) => {
    if (!prefersReducedMotion) {
      setIsTransitioning(true)
      setTimeout(() => setIsTransitioning(false), 300)
    }

    setPreset(name as ThemePresetName)
    setCustomColors({})
    saveState(name, {}, typography)
  }

  // Handle mode toggle - auto-select matching dark/light variant
  const handleModeToggle = (newMode: 'light' | 'dark' | 'system') => {
    setTheme({ mode: newMode })

    // Auto-select matching theme variant
    if (newMode !== 'system') {
      const baseName = currentPreset.replace('-dark', '')
      const targetPreset = newMode === 'dark' ? `${baseName}-dark` : baseName
      if (targetPreset in modernThemes) {
        setPreset(targetPreset as ThemePresetName)
        saveState(targetPreset as ModernThemePresetName, customColors, typography)
      }
    }
  }

  // Handle color customization
  const handleColorChange = (key: keyof ColorConfig, value: string) => {
    const newColors = { ...customColors, [key]: value }
    setCustomColors(newColors)

    const customTheme = createTheme({
      extends: currentPreset as ModernThemePresetName,
      colors: newColors,
    })
    setTheme({ customTheme })
    onThemeChange?.(customTheme)
    saveState(currentPreset, newColors, typography)
  }

  // Handle applying multiple colors from palette
  const handleApplyPalette = (colors: Partial<ColorConfig>) => {
    const newColors = { ...customColors, ...colors }
    setCustomColors(newColors)

    const customTheme = createTheme({
      extends: currentPreset as ModernThemePresetName,
      colors: newColors,
    })
    setTheme({ customTheme })
    onThemeChange?.(customTheme)
    saveState(currentPreset, newColors, typography)
  }

  // Handle typography changes
  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    const newTypography = { ...typography, fontFamily }
    setTypography(newTypography)
    applyTypographyToDocument(newTypography)
    saveState(currentPreset, customColors, newTypography)
  }

  const handleSizeScaleChange = (sizeScale: SizeScale) => {
    const newTypography = { ...typography, sizeScale }
    setTypography(newTypography)
    applyTypographyToDocument(newTypography)
    saveState(currentPreset, customColors, newTypography)
  }

  // Reset all customizations
  const handleReset = () => {
    setCustomColors({})
    setTypography({ fontFamily: 'system', sizeScale: 'default' })
    applyTypographyToDocument({ fontFamily: 'system', sizeScale: 'default' })
    setPreset(currentPreset as ThemePresetName)
    if (persistTheme) {
      setPersistentState(null)
    }
  }

  // Get current colors
  const currentColors = resolvedTheme?.colors || modernThemes['default'].colors

  // Tab navigation with keyboard
  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const tabIds = tabs.map((t) => t.id)
    const currentIndex = tabIds.indexOf(tabId)

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % tabIds.length
      setActiveTab(tabIds[nextIndex] as typeof activeTab)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length
      setActiveTab(tabIds[prevIndex] as typeof activeTab)
    }
  }

  const tabs = [
    { id: 'presets', label: 'Presets', show: showPresets },
    { id: 'colors', label: 'Colors', show: showColors },
    { id: 'typography', label: 'Typography', show: showTypography },
    { id: 'accessibility', label: 'Accessibility', show: showAccessibility },
    { id: 'export', label: 'Export', show: showExport },
  ].filter((t) => t.show)

  // Theme transition class
  const transitionClass =
    isTransitioning && !prefersReducedMotion ? 'transition-colors duration-300 ease-in-out' : ''

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border shadow-lg overflow-hidden',
        compact ? 'max-w-md' : 'max-w-2xl',
        transitionClass,
        className
      )}
      role="region"
      aria-label="Theme Customizer"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Theme Customizer</h3>
        <p className="text-sm text-muted-foreground">Customize the look and feel of your chat</p>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b border-border overflow-x-auto"
        role="tablist"
        aria-label="Theme customization sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
              'border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
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
              id="tabpanel-presets"
              role="tabpanel"
              aria-labelledby="tab-presets"
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-4"
            >
              {/* Mode Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground" id="mode-label">
                  Mode:
                </span>
                <div className="flex rounded-lg bg-muted p-1" role="radiogroup" aria-labelledby="mode-label">
                  {(['light', 'dark', 'system'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleModeToggle(m)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-md capitalize transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-ring',
                        theme.mode === m
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      role="radio"
                      aria-checked={theme.mode === m}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {theme.mode === 'system' && (
                  <span className="text-xs text-muted-foreground" aria-live="polite">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="listbox" aria-label={`${category} themes`}>
                    {themeNames
                      .filter((name) =>
                        mode === 'dark' ? name.endsWith('-dark') : !name.endsWith('-dark')
                      )
                      .map((name) => (
                        <ThemePreviewCard
                          key={name}
                          name={name}
                          isSelected={currentPreset === name}
                          onClick={() => handlePresetSelect(name as ModernThemePresetName)}
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
              id="tabpanel-colors"
              role="tabpanel"
              aria-labelledby="tab-colors"
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Primary Colors */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">Brand Colors</legend>
                <ColorPicker
                  label="Primary"
                  value={currentColors.primary}
                  onChange={(v) => handleColorChange('primary', v)}
                  id="color-primary"
                />
                <ColorPicker
                  label="Secondary"
                  value={currentColors.secondary}
                  onChange={(v) => handleColorChange('secondary', v)}
                  id="color-secondary"
                />
                <ColorPicker
                  label="Accent"
                  value={currentColors.accent}
                  onChange={(v) => handleColorChange('accent', v)}
                  id="color-accent"
                />
              </fieldset>

              {/* Background Colors */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">Background</legend>
                <ColorPicker
                  label="Background"
                  value={currentColors.background}
                  onChange={(v) => handleColorChange('background', v)}
                  id="color-background"
                />
                <ColorPicker
                  label="Foreground"
                  value={currentColors.foreground}
                  onChange={(v) => handleColorChange('foreground', v)}
                  id="color-foreground"
                />
              </fieldset>

              {/* Smart Palette Generator */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Palette Generator</h4>
                <SmartPaletteGenerator
                  baseColor={currentColors.primary}
                  onApplyPalette={handleApplyPalette}
                  onSelectSingleColor={(c) => handleColorChange('primary', c)}
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                Reset all customizations
              </button>
            </motion.div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <motion.div
              key="typography"
              id="tabpanel-typography"
              role="tabpanel"
              aria-labelledby="tab-typography"
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Font Family */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">Font Family</legend>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Select font family">
                  {FONT_FAMILIES.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleFontFamilyChange(font.id)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg border transition-colors text-left',
                        'focus:outline-none focus:ring-2 focus:ring-ring',
                        typography.fontFamily === font.id
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                      style={{ fontFamily: font.family }}
                      role="radio"
                      aria-checked={typography.fontFamily === font.id}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Font Size Scale */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground">Size Scale</legend>
                <div className="flex gap-2" role="radiogroup" aria-label="Select size scale">
                  {SIZE_SCALES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeScaleChange(size.id)}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors capitalize',
                        'focus:outline-none focus:ring-2 focus:ring-ring',
                        typography.sizeScale === size.id
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                      role="radio"
                      aria-checked={typography.sizeScale === size.id}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Live Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Live Preview</h4>
                <div
                  className="p-4 rounded-lg border border-border bg-muted/30 space-y-2"
                  style={{
                    fontFamily: FONT_FAMILIES.find((f) => f.id === typography.fontFamily)?.family,
                  }}
                >
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: `calc(0.75rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Extra Small Text
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: `calc(0.875rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Small Body Text
                  </p>
                  <p
                    className="text-foreground"
                    style={{
                      fontSize: `calc(1rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Base Body Text
                  </p>
                  <p
                    className="text-foreground font-medium"
                    style={{
                      fontSize: `calc(1.125rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Large Text
                  </p>
                  <p
                    className="text-foreground font-semibold"
                    style={{
                      fontSize: `calc(1.25rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Heading XL
                  </p>
                  <p
                    className="text-foreground font-bold"
                    style={{
                      fontSize: `calc(1.5rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                    }}
                  >
                    Heading 2XL
                  </p>
                </div>
              </div>

              {/* Current settings indicator */}
              <p className="text-xs text-muted-foreground">
                Current: {FONT_FAMILIES.find((f) => f.id === typography.fontFamily)?.label} font,{' '}
                {typography.sizeScale} size
              </p>
            </motion.div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              id="tabpanel-accessibility"
              role="tabpanel"
              aria-labelledby="tab-accessibility"
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-6"
            >
              {/* Contrast Checks */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Contrast Ratios</h4>
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

              {/* Full Color Blindness Panel */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Color Blindness Simulation
                  <span className="text-xs font-normal text-muted-foreground ml-2">(All 8 types)</span>
                </h4>
                <ColorBlindnessPanelFull colors={currentColors} />
              </div>

              {/* WCAG Info */}
              <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                <p className="text-sm text-foreground">
                  <strong>WCAG Guidelines:</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>
                    <strong>AA:</strong> 4.5:1 for normal text, 3:1 for large text
                  </li>
                  <li>
                    <strong>AAA:</strong> 7:1 for normal text, 4.5:1 for large text
                  </li>
                  <li>Color blindness affects ~8% of males, ~0.5% of females</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <motion.div
              key="export"
              id="tabpanel-export"
              role="tabpanel"
              aria-labelledby="tab-export"
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="space-y-4"
            >
              <EnhancedExportPanel theme={resolvedTheme} typography={typography} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ThemeCustomizer
