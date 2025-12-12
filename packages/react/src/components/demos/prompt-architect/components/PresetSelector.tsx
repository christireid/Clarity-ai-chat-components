'use client'

/**
 * PresetSelector Component
 *
 * Dropdown to load pre-configured prompt templates.
 */

import * as React from 'react'
import { cn } from '../../../../utils/cn'
import type { PromptPreset } from '../types'
import { PROMPT_PRESETS, getPresetCategories } from '../utils/presets'

export interface PresetSelectorProps {
  /** Handler when preset is selected */
  onSelect: (preset: PromptPreset) => void
  /** Whether selector is disabled */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Category icons
 */
const CATEGORY_ICONS: Record<PromptPreset['category'], string> = {
  development: '🔧',
  writing: '✏️',
  data: '📊',
  analysis: '🔍',
  custom: '⚡',
}

/**
 * Preset selector dropdown
 */
export function PresetSelector({
  onSelect,
  disabled = false,
  className,
}: PresetSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Group presets by category
  const categories = getPresetCategories()
  const presetsByCategory = React.useMemo(() => {
    const grouped: Record<string, PromptPreset[]> = {}
    for (const category of categories) {
      grouped[category] = PROMPT_PRESETS.filter((p) => p.category === category)
    }
    return grouped
  }, [categories])

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSelect = (preset: PromptPreset) => {
    onSelect(preset)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2',
          'text-sm font-medium',
          'rounded-lg border border-border bg-background',
          'hover:bg-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <span>📚</span>
        <span>Load Preset</span>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 z-50',
            'min-w-[280px] max-h-[400px] overflow-auto',
            'rounded-lg border border-border bg-background shadow-lg',
            'py-1'
          )}
        >
          {categories.map((category) => (
            <div key={category}>
              {/* Category header */}
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span>{CATEGORY_ICONS[category]}</span>
                <span>{category}</span>
              </div>

              {/* Presets in category */}
              {presetsByCategory[category]?.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelect(preset)}
                  className={cn(
                    'w-full px-3 py-2 text-left',
                    'hover:bg-muted transition-colors',
                    'focus:outline-none focus:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{preset.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PresetSelector
