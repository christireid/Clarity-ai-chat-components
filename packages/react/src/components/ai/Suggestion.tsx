'use client'

/**
 * Suggestion Component
 *
 * A component for displaying AI-generated suggestions, quick replies,
 * or action chips that users can click to send predefined messages.
 *
 * Features:
 * - Multiple variants (chips, cards, pills, inline)
 * - Icon support
 * - Keyboard navigation
 * - Loading states
 * - Animated appearance
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <SuggestionList
 *   suggestions={[
 *     { id: '1', label: 'Tell me more', value: 'Tell me more about this topic' },
 *     { id: '2', label: 'Show examples', value: 'Can you show me some examples?' },
 *   ]}
 *   onSelect={(suggestion) => sendMessage(suggestion.value)}
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

export type SuggestionVariant = 'chips' | 'cards' | 'pills' | 'inline' | 'compact'
export type SuggestionSize = 'sm' | 'md' | 'lg'

export interface SuggestionItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Value to send when selected */
  value?: string
  /** Description */
  description?: string
  /** Icon */
  icon?: React.ReactNode
  /** Whether disabled */
  isDisabled?: boolean
  /** Category/group */
  category?: string
  /** Metadata */
  metadata?: Record<string, unknown>
}

export interface SuggestionProps extends SuggestionItem {
  /** Visual variant */
  variant?: SuggestionVariant
  /** Size preset */
  size?: SuggestionSize
  /** Whether selected */
  isSelected?: boolean
  /** Whether loading */
  isLoading?: boolean
  /** Click handler */
  onClick?: () => void
  /** Additional class names */
  className?: string
}

export interface SuggestionListProps {
  /** Array of suggestions */
  suggestions: SuggestionItem[]
  /** Visual variant */
  variant?: SuggestionVariant
  /** Size preset */
  size?: SuggestionSize
  /** Layout direction */
  layout?: 'horizontal' | 'vertical' | 'wrap'
  /** Title/label */
  title?: string
  /** Maximum suggestions to show */
  maxVisible?: number
  /** Show shuffle button */
  shuffleable?: boolean
  /** Selected suggestion id */
  selectedId?: string
  /** Loading suggestion id */
  loadingId?: string
  /** Select handler */
  onSelect?: (suggestion: SuggestionItem) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Suggestion Component
// ============================================================================

export function Suggestion({
  id,
  label,
  value,
  description,
  icon,
  isDisabled = false,
  variant = 'chips',
  size = 'md',
  isSelected = false,
  isLoading = false,
  onClick,
  className,
}: SuggestionProps) {
  const prefersReducedMotion = useReducedMotion()

  const handleClick = () => {
    if (!isDisabled && !isLoading) {
      onClick?.()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && !isLoading) {
      e.preventDefault()
      onClick?.()
    }
  }

  // Inline variant (text link style)
  if (variant === 'inline') {
    return (
      <motion.button
        type="button"
        className={cn(
          'suggestion-inline',
          `suggestion-inline-${size}`,
          isSelected && 'suggestion-inline-selected',
          isDisabled && 'suggestion-inline-disabled',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || isLoading}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={!isDisabled ? { textDecoration: 'underline' } : {}}
      >
        {icon && <span className="suggestion-icon">{icon}</span>}
        {label}
        {isLoading && <span className="suggestion-spinner" />}
      </motion.button>
    )
  }

  // Card variant
  if (variant === 'cards') {
    return (
      <motion.button
        type="button"
        className={cn(
          'suggestion-card',
          `suggestion-card-${size}`,
          isSelected && 'suggestion-card-selected',
          isDisabled && 'suggestion-card-disabled',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || isLoading}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!isDisabled ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : {}}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        {icon && <span className="suggestion-card-icon">{icon}</span>}
        <div className="suggestion-card-content">
          <span className="suggestion-card-label">{label}</span>
          {description && (
            <span className="suggestion-card-description">{description}</span>
          )}
        </div>
        {isLoading && <span className="suggestion-spinner" />}
      </motion.button>
    )
  }

  // Pills variant
  if (variant === 'pills') {
    return (
      <motion.button
        type="button"
        className={cn(
          'suggestion-pill',
          `suggestion-pill-${size}`,
          isSelected && 'suggestion-pill-selected',
          isDisabled && 'suggestion-pill-disabled',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || isLoading}
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        {icon && <span className="suggestion-icon">{icon}</span>}
        {label}
        {isLoading && <span className="suggestion-spinner" />}
      </motion.button>
    )
  }

  // Chips variant (default)
  return (
    <motion.button
      type="button"
      className={cn(
        'suggestion-chip',
        `suggestion-chip-${size}`,
        isSelected && 'suggestion-chip-selected',
        isDisabled && 'suggestion-chip-disabled',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled || isLoading}
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isDisabled ? { scale: 1.02, backgroundColor: 'var(--suggestion-hover-bg)' } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: DURATION_SECONDS.fast }}
    >
      {icon && <span className="suggestion-icon">{icon}</span>}
      {label}
      {isLoading && <span className="suggestion-spinner" />}
    </motion.button>
  )
}

// ============================================================================
// SuggestionList Component
// ============================================================================

export function SuggestionList({
  suggestions,
  variant = 'chips',
  size = 'md',
  layout = 'wrap',
  title,
  maxVisible,
  shuffleable = false,
  selectedId,
  loadingId,
  onSelect,
  className,
}: SuggestionListProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displaySuggestions, setDisplaySuggestions] = React.useState(suggestions)
  const [showAll, setShowAll] = React.useState(false)

  React.useEffect(() => {
    setDisplaySuggestions(suggestions)
  }, [suggestions])

  const handleShuffle = () => {
    setDisplaySuggestions((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  const visibleSuggestions = maxVisible && !showAll
    ? displaySuggestions.slice(0, maxVisible)
    : displaySuggestions

  const hiddenCount = maxVisible && !showAll
    ? Math.max(0, displaySuggestions.length - maxVisible)
    : 0

  // Group by category if available
  const groupedSuggestions = React.useMemo(() => {
    const hasCategories = suggestions.some((s) => s.category)
    if (!hasCategories) return null

    const groups: Record<string, SuggestionItem[]> = {}
    visibleSuggestions.forEach((s) => {
      const category = s.category || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(s)
    })
    return groups
  }, [visibleSuggestions, suggestions])

  if (suggestions.length === 0) return null

  const renderSuggestions = (items: SuggestionItem[]) => (
    <AnimatePresence mode="popLayout">
      {items.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          transition={{
            duration: DURATION_SECONDS.fast,
            delay: prefersReducedMotion ? 0 : index * 0.03,
          }}
        >
          <Suggestion
            {...suggestion}
            variant={variant}
            size={size}
            isSelected={selectedId === suggestion.id}
            isLoading={loadingId === suggestion.id}
            onClick={() => onSelect?.(suggestion)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  )

  return (
    <motion.div
      className={cn(
        'suggestion-list',
        `suggestion-list-${layout}`,
        `suggestion-list-${variant}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      role="group"
      aria-label={title || 'Suggestions'}
    >
      {/* Header */}
      {(title || shuffleable) && (
        <div className="suggestion-list-header">
          {title && <span className="suggestion-list-title">{title}</span>}
          {shuffleable && (
            <button
              type="button"
              className="suggestion-shuffle"
              onClick={handleShuffle}
              aria-label="Shuffle suggestions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Grouped or flat list */}
      {groupedSuggestions ? (
        Object.entries(groupedSuggestions).map(([category, items]) => (
          <div key={category} className="suggestion-group">
            <span className="suggestion-group-label">{category}</span>
            <div className="suggestion-group-items">
              {renderSuggestions(items)}
            </div>
          </div>
        ))
      ) : (
        <div className="suggestion-list-items">
          {renderSuggestions(visibleSuggestions)}
        </div>
      )}

      {/* Show more */}
      {hiddenCount > 0 && (
        <button
          type="button"
          className="suggestion-show-more"
          onClick={() => setShowAll(true)}
        >
          Show {hiddenCount} more
        </button>
      )}
    </motion.div>
  )
}

// ============================================================================
// useSuggestions Hook
// ============================================================================

export interface UseSuggestionsOptions {
  /** Initial suggestions */
  initialSuggestions?: SuggestionItem[]
  /** Max suggestions to track */
  maxSuggestions?: number
}

export interface UseSuggestionsReturn {
  /** Current suggestions */
  suggestions: SuggestionItem[]
  /** Add suggestion */
  addSuggestion: (suggestion: SuggestionItem) => void
  /** Remove suggestion */
  removeSuggestion: (id: string) => void
  /** Set all suggestions */
  setSuggestions: (suggestions: SuggestionItem[]) => void
  /** Clear all suggestions */
  clear: () => void
  /** Shuffle suggestions */
  shuffle: () => void
  /** Selected suggestion */
  selected: SuggestionItem | null
  /** Select a suggestion */
  select: (id: string) => void
  /** Clear selection */
  clearSelection: () => void
}

export function useSuggestions(options: UseSuggestionsOptions = {}): UseSuggestionsReturn {
  const { initialSuggestions = [], maxSuggestions = 50 } = options
  const [suggestions, setSuggestions] = React.useState<SuggestionItem[]>(initialSuggestions)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const addSuggestion = React.useCallback(
    (suggestion: SuggestionItem) => {
      setSuggestions((prev) => {
        const newSuggestions = [suggestion, ...prev.filter((s) => s.id !== suggestion.id)]
        return newSuggestions.slice(0, maxSuggestions)
      })
    },
    [maxSuggestions]
  )

  const removeSuggestion = React.useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) setSelectedId(null)
  }, [selectedId])

  const clear = React.useCallback(() => {
    setSuggestions([])
    setSelectedId(null)
  }, [])

  const shuffle = React.useCallback(() => {
    setSuggestions((prev) => [...prev].sort(() => Math.random() - 0.5))
  }, [])

  const select = React.useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedId(null)
  }, [])

  const selected = React.useMemo(
    () => suggestions.find((s) => s.id === selectedId) || null,
    [suggestions, selectedId]
  )

  return {
    suggestions,
    addSuggestion,
    removeSuggestion,
    setSuggestions,
    clear,
    shuffle,
    selected,
    select,
    clearSelection,
  }
}

export default Suggestion
