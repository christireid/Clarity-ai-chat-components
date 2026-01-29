'use client'

/**
 * OptionList Component
 *
 * A selectable option list for presenting choices to users.
 * Supports single/multi select, keyboard navigation, and search filtering.
 *
 * Features:
 * - Multiple variants (list, grid, cards, radio, checkbox)
 * - Single or multi-select modes
 * - Keyboard navigation
 * - Search/filter functionality
 * - Icon and description support
 * - Loading and disabled states
 * - Grouped options
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <OptionList
 *   options={[
 *     { id: '1', label: 'Option 1', description: 'First option' },
 *     { id: '2', label: 'Option 2', description: 'Second option' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type OptionListVariant = 'list' | 'grid' | 'cards' | 'radio' | 'checkbox' | 'compact'
export type OptionListSize = 'sm' | 'md' | 'lg'

export interface OptionItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Whether option is disabled */
  disabled?: boolean
  /** Optional badge/tag */
  badge?: string
  /** Optional metadata */
  meta?: string
  /** Optional group */
  group?: string
}

export interface OptionGroup {
  /** Group identifier */
  id: string
  /** Group label */
  label: string
  /** Options in this group */
  options: OptionItem[]
}

export interface OptionListProps {
  /** Array of options */
  options: OptionItem[]
  /** Grouped options (alternative to options) */
  groups?: OptionGroup[]
  /** Selected value(s) */
  value?: string | string[]
  /** Display variant */
  variant?: OptionListVariant
  /** Size preset */
  size?: OptionListSize
  /** Whether multiple selections allowed */
  multiple?: boolean
  /** Whether to show search input */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Whether list is loading */
  isLoading?: boolean
  /** Maximum visible items before scroll */
  maxVisible?: number
  /** Empty state message */
  emptyMessage?: string
  /** Grid columns (for grid variant) */
  columns?: number
  /** Change handler */
  onChange?: (value: string | string[]) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Components
// ============================================================================

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

// ============================================================================
// OptionItem Component
// ============================================================================

interface OptionItemComponentProps {
  option: OptionItem
  isSelected: boolean
  variant: OptionListVariant
  size: OptionListSize
  multiple: boolean
  onSelect: () => void
}

function OptionItemComponent({
  option,
  isSelected,
  variant,
  size,
  multiple,
  onSelect,
}: OptionItemComponentProps) {
  const prefersReducedMotion = useReducedMotion()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!option.disabled) onSelect()
    }
  }

  return (
    <motion.div
      className={cn(
        'option-list-item',
        `option-list-item-${variant}`,
        `option-list-item-${size}`,
        isSelected && 'option-list-item-selected',
        option.disabled && 'option-list-item-disabled'
      )}
      onClick={() => !option.disabled && onSelect()}
      onKeyDown={handleKeyDown}
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={isSelected}
      aria-disabled={option.disabled}
      tabIndex={option.disabled ? -1 : 0}
      whileHover={!option.disabled && !prefersReducedMotion ? { scale: 1.01 } : {}}
      whileTap={!option.disabled && !prefersReducedMotion ? { scale: 0.99 } : {}}
      layout={!prefersReducedMotion}
    >
      {/* Selection indicator */}
      {(variant === 'radio' || variant === 'checkbox' || variant === 'list') && (
        <div className={cn(
          'option-list-indicator',
          multiple ? 'option-list-indicator-checkbox' : 'option-list-indicator-radio'
        )}>
          <AnimatePresence>
            {isSelected && (
              <motion.span
                className="option-list-indicator-check"
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                exit={prefersReducedMotion ? {} : { scale: 0 }}
                transition={{ duration: DURATION_SECONDS.fast }}
              >
                {multiple ? <CheckIcon /> : null}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Icon */}
      {option.icon && (
        <div className="option-list-icon">{option.icon}</div>
      )}

      {/* Content */}
      <div className="option-list-content">
        <div className="option-list-label-row">
          <span className="option-list-label">{option.label}</span>
          {option.badge && (
            <span className="option-list-badge">{option.badge}</span>
          )}
        </div>
        {option.description && (
          <span className="option-list-description">{option.description}</span>
        )}
        {option.meta && (
          <span className="option-list-meta">{option.meta}</span>
        )}
      </div>

      {/* Selected check for card variant */}
      {(variant === 'cards' || variant === 'grid') && isSelected && (
        <motion.div
          className="option-list-selected-badge"
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: DURATION_SECONDS.fast }}
        >
          <CheckIcon />
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================================================
// OptionList Component
// ============================================================================

export function OptionList({
  options = [],
  groups,
  value,
  variant = 'list',
  size = 'md',
  multiple = false,
  searchable = false,
  searchPlaceholder = 'Search options...',
  isLoading = false,
  maxVisible,
  emptyMessage = 'No options available',
  columns = 2,
  onChange,
  className,
}: OptionListProps) {
  const prefersReducedMotion = useReducedMotion()
  const [searchQuery, setSearchQuery] = React.useState('')
  const listRef = React.useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  // Normalize value to array for easier handling
  const selectedValues = React.useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  // Flatten options from groups if provided
  const allOptions = React.useMemo(() => {
    if (groups) {
      return groups.flatMap((g) => g.options)
    }
    return options
  }, [options, groups])

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return allOptions
    const query = searchQuery.toLowerCase()
    return allOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query)
    )
  }, [allOptions, searchQuery])

  // Filter groups based on search
  const filteredGroups = React.useMemo(() => {
    if (!groups) return undefined
    if (!searchQuery.trim()) return groups

    const query = searchQuery.toLowerCase()
    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(query) ||
            opt.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.options.length > 0)
  }, [groups, searchQuery])

  // Handle selection
  const handleSelect = (optionId: string) => {
    if (multiple) {
      const newValue = selectedValues.includes(optionId)
        ? selectedValues.filter((v) => v !== optionId)
        : [...selectedValues, optionId]
      onChange?.(newValue)
    } else {
      onChange?.(optionId)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledOptions = filteredOptions.filter((o) => !o.disabled)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) =>
          prev < enabledOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : enabledOptions.length - 1
        )
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(enabledOptions.length - 1)
        break
    }
  }

  // Focus management
  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="radio"], [role="checkbox"]')
      const item = items[focusedIndex] as HTMLElement
      item?.focus()
    }
  }, [focusedIndex])

  const containerStyle = React.useMemo(() => {
    const style: React.CSSProperties = {}
    if (maxVisible) {
      style.maxHeight = maxVisible * 52 // approximate item height
      style.overflowY = 'auto'
    }
    if (variant === 'grid') {
      style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    }
    return style
  }, [maxVisible, variant, columns])

  return (
    <motion.div
      className={cn('option-list', `option-list-${variant}`, `option-list-${size}`, className)}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="group"
      aria-label="Option list"
      onKeyDown={handleKeyDown}
    >
      {/* Search */}
      {searchable && (
        <div className="option-list-search">
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="option-list-search-input"
            aria-label="Search options"
          />
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="option-list-loading">
          <motion.div
            className="option-list-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: durations.slower, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading options...</span>
        </div>
      ) : (
        <>
          {/* Options container */}
          <div
            ref={listRef}
            className={cn(
              'option-list-container',
              `option-list-container-${variant}`
            )}
            style={containerStyle}
            role={multiple ? 'group' : 'radiogroup'}
          >
            {filteredGroups ? (
              // Grouped options
              filteredGroups.map((group) => (
                <div key={group.id} className="option-list-group">
                  <div className="option-list-group-label">{group.label}</div>
                  <div className="option-list-group-options">
                    {group.options.map((option) => (
                      <OptionItemComponent
                        key={option.id}
                        option={option}
                        isSelected={selectedValues.includes(option.id)}
                        variant={variant}
                        size={size}
                        multiple={multiple}
                        onSelect={() => handleSelect(option.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : filteredOptions.length > 0 ? (
              // Flat options
              filteredOptions.map((option) => (
                <OptionItemComponent
                  key={option.id}
                  option={option}
                  isSelected={selectedValues.includes(option.id)}
                  variant={variant}
                  size={size}
                  multiple={multiple}
                  onSelect={() => handleSelect(option.id)}
                />
              ))
            ) : (
              // Empty state
              <div className="option-list-empty">
                <span>{emptyMessage}</span>
              </div>
            )}
          </div>

          {/* Selection count for multi-select */}
          {multiple && selectedValues.length > 0 && (
            <div className="option-list-selection-count">
              {selectedValues.length} selected
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

// ============================================================================
// useOptionList Hook
// ============================================================================

export interface UseOptionListOptions {
  /** Initial options */
  initialOptions?: OptionItem[]
  /** Initial value */
  initialValue?: string | string[]
  /** Whether multiple selections allowed */
  multiple?: boolean
}

export interface UseOptionListReturn {
  /** Current options */
  options: OptionItem[]
  /** Current value */
  value: string | string[]
  /** Add an option */
  addOption: (option: OptionItem) => void
  /** Remove an option */
  removeOption: (id: string) => void
  /** Update an option */
  updateOption: (id: string, updates: Partial<OptionItem>) => void
  /** Select an option */
  select: (id: string) => void
  /** Deselect an option */
  deselect: (id: string) => void
  /** Toggle an option */
  toggle: (id: string) => void
  /** Select all options */
  selectAll: () => void
  /** Clear selection */
  clearSelection: () => void
  /** Check if an option is selected */
  isSelected: (id: string) => boolean
}

export function useOptionList(options: UseOptionListOptions = {}): UseOptionListReturn {
  const { initialOptions = [], initialValue, multiple = false } = options

  const [optionsList, setOptionsList] = React.useState<OptionItem[]>(initialOptions)
  const [value, setValue] = React.useState<string | string[]>(
    initialValue ?? (multiple ? [] : '')
  )

  const selectedValues = React.useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  const addOption = React.useCallback((option: OptionItem) => {
    setOptionsList((prev) => [...prev, option])
  }, [])

  const removeOption = React.useCallback((id: string) => {
    setOptionsList((prev) => prev.filter((o) => o.id !== id))
    setValue((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((v) => v !== id)
      }
      return prev === id ? '' : prev
    })
  }, [])

  const updateOption = React.useCallback((id: string, updates: Partial<OptionItem>) => {
    setOptionsList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    )
  }, [])

  const select = React.useCallback((id: string) => {
    if (multiple) {
      setValue((prev) => {
        const arr = Array.isArray(prev) ? prev : [prev].filter(Boolean)
        return arr.includes(id) ? arr : [...arr, id]
      })
    } else {
      setValue(id)
    }
  }, [multiple])

  const deselect = React.useCallback((id: string) => {
    setValue((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((v) => v !== id)
      }
      return prev === id ? '' : prev
    })
  }, [])

  const toggle = React.useCallback((id: string) => {
    if (selectedValues.includes(id)) {
      deselect(id)
    } else {
      select(id)
    }
  }, [selectedValues, select, deselect])

  const selectAll = React.useCallback(() => {
    if (multiple) {
      setValue(optionsList.filter((o) => !o.disabled).map((o) => o.id))
    }
  }, [multiple, optionsList])

  const clearSelection = React.useCallback(() => {
    setValue(multiple ? [] : '')
  }, [multiple])

  const isSelected = React.useCallback(
    (id: string) => selectedValues.includes(id),
    [selectedValues]
  )

  return {
    options: optionsList,
    value,
    addOption,
    removeOption,
    updateOption,
    select,
    deselect,
    toggle,
    selectAll,
    clearSelection,
    isSelected,
  }
}

export default OptionList
