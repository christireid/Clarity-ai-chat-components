'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

/**
 * PromptSuggestions Component
 *
 * Displays suggested prompts to help users get started or explore capabilities.
 * Inspired by Prompt Kit and CopilotKit patterns.
 *
 * @example
 * ```tsx
 * <PromptSuggestions
 *   suggestions={[
 *     { text: 'Explain how to use hooks', category: 'Learn' },
 *     { text: 'Show me a streaming example', category: 'Examples' },
 *   ]}
 *   onSelect={(suggestion) => setInput(suggestion.text)}
 * />
 * ```
 */

export interface Suggestion {
  /** Suggestion text */
  text: string
  /** Optional category/group */
  category?: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Optional description */
  description?: string
}

export interface PromptSuggestionsProps {
  /** List of suggestions to display */
  suggestions: (string | Suggestion)[]
  /** Callback when a suggestion is selected */
  onSelect: (suggestion: Suggestion) => void
  /** Title for the suggestions section */
  title?: string
  /** Layout variant */
  variant?: 'grid' | 'list' | 'chips'
  /** Number of columns for grid layout */
  columns?: 2 | 3 | 4
  /** Maximum suggestions to show (with "Show more" option) */
  maxVisible?: number
  /** Show category labels */
  showCategories?: boolean
  /** Additional CSS classes */
  className?: string
  /** Loading state */
  isLoading?: boolean
  /** Pass Through API for styling */
  pt?: {
    root?: React.HTMLAttributes<HTMLDivElement>
    title?: React.HTMLAttributes<HTMLHeadingElement>
    list?: React.HTMLAttributes<HTMLDivElement>
    item?: React.ButtonHTMLAttributes<HTMLButtonElement>
    category?: React.HTMLAttributes<HTMLSpanElement>
  }
}

export function PromptSuggestions({
  suggestions,
  onSelect,
  title = 'Suggested prompts',
  variant = 'grid',
  columns = 2,
  maxVisible,
  showCategories = true,
  className = '',
  isLoading = false,
  pt = {},
}: PromptSuggestionsProps) {
  const [showAll, setShowAll] = React.useState(false)

  // Normalize suggestions to Suggestion objects
  const normalizedSuggestions: Suggestion[] = suggestions.map((s) =>
    typeof s === 'string' ? { text: s } : s
  )

  // Group by category if showing categories
  const groupedSuggestions = React.useMemo(() => {
    if (!showCategories) return { '': normalizedSuggestions }

    return normalizedSuggestions.reduce(
      (acc, suggestion) => {
        const category = suggestion.category || ''
        if (!acc[category]) acc[category] = []
        acc[category].push(suggestion)
        return acc
      },
      {} as Record<string, Suggestion[]>
    )
  }, [normalizedSuggestions, showCategories])

  // Apply maxVisible limit
  const visibleSuggestions =
    maxVisible && !showAll
      ? normalizedSuggestions.slice(0, maxVisible)
      : normalizedSuggestions

  const hasMore = maxVisible ? normalizedSuggestions.length > maxVisible : false

  // Grid columns classes
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`} {...pt.root}>
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className={`grid ${columnClasses[columns]} gap-2`}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (normalizedSuggestions.length === 0) {
    return null
  }

  // Chips variant
  if (variant === 'chips') {
    return (
      <div className={`space-y-2 ${className}`} {...pt.root}>
        {title && (
          <h3
            className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"
            {...pt.title}
          >
            <Sparkles className="h-4 w-4" />
            {title}
          </h3>
        )}
        <div className="flex flex-wrap gap-2" {...pt.list}>
          {visibleSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(suggestion)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full
                border border-border bg-background hover:bg-muted
                transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              {...pt.item}
            >
              {suggestion.icon}
              {suggestion.text}
            </button>
          ))}
          {hasMore && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full
                text-primary hover:bg-primary/10 transition-colors"
            >
              +{normalizedSuggestions.length - maxVisible!} more
            </button>
          )}
        </div>
      </div>
    )
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`} {...pt.root}>
        {title && (
          <h3
            className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"
            {...pt.title}
          >
            <Sparkles className="h-4 w-4" />
            {title}
          </h3>
        )}
        <div className="space-y-1" {...pt.list}>
          {Object.entries(groupedSuggestions).map(([category, items]) => (
            <React.Fragment key={category || 'default'}>
              {category && showCategories && (
                <span
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1"
                  {...pt.category}
                >
                  {category}
                </span>
              )}
              {items.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelect(suggestion)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left
                    rounded-lg hover:bg-muted transition-colors group
                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                  {...pt.item}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {suggestion.icon || (
                      <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{suggestion.text}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  // Grid variant (default)
  return (
    <div className={`space-y-3 ${className}`} {...pt.root}>
      {title && (
        <h3
          className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"
          {...pt.title}
        >
          <Sparkles className="h-4 w-4" />
          {title}
        </h3>
      )}
      <div className={`grid ${columnClasses[columns]} gap-2`} {...pt.list}>
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="group flex flex-col items-start gap-1 p-3 text-left
              rounded-lg border border-border bg-card hover:bg-muted/50
              hover:border-primary/50 transition-all
              focus:outline-none focus:ring-2 focus:ring-primary/50"
            {...pt.item}
          >
            <div className="flex items-center gap-2 w-full">
              {suggestion.icon || (
                <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm font-medium truncate flex-1">
                {suggestion.text}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            {suggestion.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {suggestion.description}
              </p>
            )}
            {suggestion.category && showCategories && (
              <span
                className="text-xs text-primary/70 font-medium"
                {...pt.category}
              >
                {suggestion.category}
              </span>
            )}
          </button>
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm text-primary hover:underline"
        >
          Show {normalizedSuggestions.length - maxVisible!} more suggestions
        </button>
      )}
    </div>
  )
}

export default PromptSuggestions
