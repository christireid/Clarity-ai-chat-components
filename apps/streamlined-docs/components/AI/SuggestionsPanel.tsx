'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Suggestion } from '@/lib/ai/suggestions'

export interface SuggestionsPanelProps {
  suggestions: Suggestion[]
  onSelectSuggestion?: (suggestion: Suggestion) => void
  className?: string
  variant?: 'default' | 'compact' | 'inline'
  title?: string
  showIcons?: boolean
}

export function SuggestionsPanel({
  suggestions,
  onSelectSuggestion,
  className,
  variant = 'default',
  title = 'Suggested Questions',
  showIcons = true,
}: SuggestionsPanelProps) {
  if (suggestions.length === 0) {
    return null
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="w-3 h-3" />
          {title}
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSelectSuggestion?.(suggestion)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs',
                'bg-secondary hover:bg-secondary/80',
                'text-secondary-foreground',
                'transition-colors duration-200',
                'flex items-center gap-1.5'
              )}
            >
              {showIcons && suggestion.icon && (
                <span className="text-sm">{suggestion.icon}</span>
              )}
              <span>{suggestion.question}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSuggestion?.(suggestion)}
            className={cn(
              'group relative px-4 py-2 rounded-lg text-sm',
              'bg-primary/5 hover:bg-primary/10',
              'border border-primary/20 hover:border-primary/30',
              'transition-all duration-200',
              'flex items-center gap-2'
            )}
          >
            {showIcons && suggestion.icon && (
              <span className="text-base">{suggestion.icon}</span>
            )}
            <span className="text-left">{suggestion.question}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-primary/10">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              onSelect={onSelectSuggestion}
              showIcon={showIcons}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface SuggestionCardProps {
  suggestion: Suggestion
  index: number
  onSelect?: (suggestion: Suggestion) => void
  showIcon?: boolean
}

function SuggestionCard({
  suggestion,
  index,
  onSelect,
  showIcon = true,
}: SuggestionCardProps) {
  const categoryColors: Record<Suggestion['category'], string> = {
    exploration: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    clarification: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    practical: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    related: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  }

  const categoryLabels: Record<Suggestion['category'], string> = {
    exploration: 'Explore',
    clarification: 'Clarify',
    practical: 'Practical',
    related: 'Related',
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect?.(suggestion)}
      className={cn(
        'w-full group relative',
        'p-4 rounded-lg',
        'bg-card hover:bg-accent/50',
        'border border-border hover:border-primary/30',
        'transition-all duration-200',
        'text-left'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && suggestion.icon && (
          <div className="text-2xl flex-shrink-0 mt-0.5">{suggestion.icon}</div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
            {suggestion.question}
          </p>

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full border',
                categoryColors[suggestion.category]
              )}
            >
              {categoryLabels[suggestion.category]}
            </span>

            {/* Relevance indicator */}
            {suggestion.relevance > 0.8 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                High relevance
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </div>
    </motion.button>
  )
}

/**
 * Suggestion chips for quick access
 */
export function SuggestionChips({
  suggestions,
  onSelectSuggestion,
  className,
  maxVisible = 3,
}: {
  suggestions: Suggestion[]
  onSelectSuggestion?: (suggestion: Suggestion) => void
  className?: string
  maxVisible?: number
}) {
  const visibleSuggestions = suggestions.slice(0, maxVisible)

  if (visibleSuggestions.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Lightbulb className="w-3 h-3" />
        Try:
      </span>
      {visibleSuggestions.map((suggestion) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSuggestion?.(suggestion)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            'bg-primary/10 hover:bg-primary/20',
            'text-primary',
            'border border-primary/20 hover:border-primary/30',
            'transition-all duration-200'
          )}
        >
          {suggestion.icon && <span className="mr-1">{suggestion.icon}</span>}
          {suggestion.question}
        </motion.button>
      ))}
    </div>
  )
}

/**
 * Floating suggestions bubble
 */
export function FloatingSuggestions({
  suggestions,
  onSelectSuggestion,
  onDismiss,
  className,
}: {
  suggestions: Suggestion[]
  onSelectSuggestion?: (suggestion: Suggestion) => void
  onDismiss?: () => void
  className?: string
}) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      className={cn(
        'fixed bottom-4 right-4 z-50',
        'max-w-sm',
        'bg-popover border border-border rounded-lg shadow-lg',
        'p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Quick suggestions</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelectSuggestion?.(suggestion)}
            className={cn(
              'w-full p-2 rounded-md text-left text-sm',
              'hover:bg-accent',
              'transition-colors',
              'flex items-center gap-2'
            )}
          >
            {suggestion.icon && <span>{suggestion.icon}</span>}
            <span className="flex-1">{suggestion.question}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
