/**
 * SuggestionChips Component
 *
 * Smart suggestion chips for PromptComposer.
 * Displays context-aware prompts that users can quickly select.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { Suggestion } from '../../hooks/prompt-composer/types'

export interface SuggestionChipsProps {
  /** Suggestions to display */
  suggestions: Suggestion[]
  /** Callback when suggestion is selected */
  onSelect: (suggestion: Suggestion) => void
  /** Maximum number of suggestions to show */
  maxVisible?: number
  /** Layout style */
  layout?: 'chips' | 'grid' | 'list'
  /** Position relative to input */
  position?: 'top' | 'bottom' | 'floating'
  /** Custom render function */
  renderSuggestion?: (suggestion: Suggestion) => React.ReactNode
  /** Show confidence scores */
  showConfidence?: boolean
  /** Enable keyboard navigation */
  enableKeyboardNav?: boolean
  /** Selected index (for keyboard nav) */
  selectedIndex?: number
  /** Callback when selection changes */
  onSelectionChange?: (index: number) => void
  /** Callback when dismissed */
  onDismiss?: () => void
  className?: string
}

/**
 * Get color class based on confidence score
 */
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600 dark:text-green-400'
  if (confidence >= 0.6) return 'text-blue-600 dark:text-blue-400'
  if (confidence >= 0.4) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-gray-600 dark:text-gray-400'
}

/**
 * Get type badge color
 */
function getTypeBadgeColor(type: string): string {
  switch (type) {
    case 'starter':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'continuation':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    case 'template':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    case 'smart':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
  }
}

/**
 * SuggestionChips Component
 *
 * Displays smart suggestion chips that users can click to quickly fill the prompt.
 * Supports keyboard navigation, confidence scores, and multiple layouts.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SuggestionChips
 *   suggestions={suggestions}
 *   onSelect={(suggestion) => setValue(suggestion.text)}
 *   maxVisible={6}
 * />
 *
 * // With keyboard navigation
 * <SuggestionChips
 *   suggestions={suggestions}
 *   onSelect={handleSelect}
 *   enableKeyboardNav
 *   selectedIndex={selectedIndex}
 *   onSelectionChange={setSelectedIndex}
 * />
 *
 * // Grid layout with confidence
 * <SuggestionChips
 *   suggestions={suggestions}
 *   onSelect={handleSelect}
 *   layout="grid"
 *   showConfidence
 * />
 * ```
 */
export function SuggestionChips({
  suggestions,
  onSelect,
  maxVisible = 6,
  layout = 'chips',
  position = 'top',
  renderSuggestion,
  showConfidence = false,
  enableKeyboardNav = false,
  selectedIndex = -1,
  onSelectionChange,
  onDismiss,
  className,
}: SuggestionChipsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Limit suggestions to maxVisible
  const visibleSuggestions = React.useMemo(
    () => suggestions.slice(0, maxVisible),
    [suggestions, maxVisible]
  )

  // Keyboard navigation
  React.useEffect(() => {
    if (!enableKeyboardNav) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (visibleSuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowRight':
        case 'Tab':
          e.preventDefault()
          onSelectionChange?.(
            Math.min(selectedIndex + 1, visibleSuggestions.length - 1)
          )
          break
        case 'ArrowLeft':
          e.preventDefault()
          onSelectionChange?.(Math.max(selectedIndex - 1, 0))
          break
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < visibleSuggestions.length) {
            e.preventDefault()
            onSelect(visibleSuggestions[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onDismiss?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    enableKeyboardNav,
    visibleSuggestions,
    selectedIndex,
    onSelect,
    onSelectionChange,
    onDismiss,
  ])

  // Scroll selected chip into view
  React.useEffect(() => {
    if (containerRef.current && selectedIndex >= 0 && enableKeyboardNav) {
      const chips = containerRef.current.querySelectorAll('[data-suggestion]')
      const selected = chips[selectedIndex] as HTMLElement
      if (selected) {
        selected.scrollIntoView({ block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedIndex, enableKeyboardNav])

  if (visibleSuggestions.length === 0) {
    return null
  }

  // Render suggestion chip content
  const renderChipContent = (suggestion: Suggestion, index: number) => {
    if (renderSuggestion) {
      return renderSuggestion(suggestion)
    }

    return (
      <>
        {/* Icon */}
        {suggestion.icon && (
          <span className="shrink-0" aria-hidden="true">
            {suggestion.icon}
          </span>
        )}

        {/* Text */}
        <span className="truncate">{suggestion.text}</span>

        {/* Confidence score */}
        {showConfidence && suggestion.confidence !== undefined && (
          <span
            className={cn(
              'shrink-0 text-xs font-medium ml-1',
              getConfidenceColor(suggestion.confidence)
            )}
          >
            {Math.round(suggestion.confidence * 100)}%
          </span>
        )}

        {/* Type badge */}
        {layout !== 'chips' && (
          <span
            className={cn(
              'shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ml-2',
              getTypeBadgeColor(suggestion.type)
            )}
          >
            {suggestion.type}
          </span>
        )}

        {/* Keyboard hint */}
        {enableKeyboardNav && selectedIndex === index && (
          <span
            className="shrink-0 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono ml-2"
            aria-hidden="true"
          >
            ↵
          </span>
        )}
      </>
    )
  }

  // Container classes based on position
  const containerClasses = cn(
    'animate-in fade-in slide-in-from-top-2 duration-200',
    position === 'floating' && 'absolute z-50',
    className
  )

  // Layout: Chips (default)
  if (layout === 'chips') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'flex flex-wrap gap-2',
          containerClasses
        )}
        role="listbox"
        aria-label="Suggested prompts"
      >
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            data-suggestion={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5',
              'text-sm font-medium',
              'bg-gray-100 hover:bg-gray-200',
              'dark:bg-gray-800 dark:hover:bg-gray-700',
              'text-gray-700 dark:text-gray-300',
              'rounded-full transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              enableKeyboardNav &&
                selectedIndex === index &&
                'ring-2 ring-blue-500 bg-gray-200 dark:bg-gray-700'
            )}
            role="option"
            aria-selected={enableKeyboardNav && selectedIndex === index}
            title={suggestion.description}
          >
            {renderChipContent(suggestion, index)}
          </button>
        ))}

        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Dismiss suggestions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    )
  }

  // Layout: Grid
  if (layout === 'grid') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2',
          containerClasses
        )}
        role="listbox"
        aria-label="Suggested prompts"
      >
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            data-suggestion={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'flex flex-col items-start gap-1 p-3',
              'text-left',
              'bg-gray-50 hover:bg-gray-100',
              'dark:bg-gray-900 dark:hover:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'rounded-lg transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              enableKeyboardNav &&
                selectedIndex === index &&
                'ring-2 ring-blue-500 bg-gray-100 dark:bg-gray-800'
            )}
            role="option"
            aria-selected={enableKeyboardNav && selectedIndex === index}
          >
            {/* Header */}
            <div className="flex items-center gap-2 w-full">
              {suggestion.icon && (
                <span className="shrink-0 text-lg" aria-hidden="true">
                  {suggestion.icon}
                </span>
              )}
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100 flex-1 truncate">
                {suggestion.text}
              </span>
              {showConfidence && suggestion.confidence !== undefined && (
                <span
                  className={cn(
                    'shrink-0 text-xs font-medium',
                    getConfidenceColor(suggestion.confidence)
                  )}
                >
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            {suggestion.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {suggestion.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium',
                  getTypeBadgeColor(suggestion.type)
                )}
              >
                {suggestion.type}
              </span>
              {enableKeyboardNav && selectedIndex === index && (
                <span
                  className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono"
                  aria-hidden="true"
                >
                  Press Enter
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  // Layout: List
  if (layout === 'list') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'space-y-1',
          containerClasses
        )}
        role="listbox"
        aria-label="Suggested prompts"
      >
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            data-suggestion={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={cn(
              'w-full flex items-center gap-3 p-3',
              'text-left',
              'bg-gray-50 hover:bg-gray-100',
              'dark:bg-gray-900 dark:hover:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'rounded-lg transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              enableKeyboardNav &&
                selectedIndex === index &&
                'ring-2 ring-blue-500 bg-gray-100 dark:bg-gray-800'
            )}
            role="option"
            aria-selected={enableKeyboardNav && selectedIndex === index}
          >
            {/* Icon */}
            {suggestion.icon && (
              <span className="shrink-0 text-xl" aria-hidden="true">
                {suggestion.icon}
              </span>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {suggestion.text}
              </div>
              {suggestion.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {suggestion.description}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="shrink-0 flex items-center gap-2">
              {showConfidence && suggestion.confidence !== undefined && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    getConfidenceColor(suggestion.confidence)
                  )}
                >
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              )}
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium',
                  getTypeBadgeColor(suggestion.type)
                )}
              >
                {suggestion.type}
              </span>
              {enableKeyboardNav && selectedIndex === index && (
                <span
                  className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono"
                  aria-hidden="true"
                >
                  ↵
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return null
}

SuggestionChips.displayName = 'SuggestionChips'
