import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Card,
  CardContent,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'

/**
 * Types of prompt suggestions based on context
 */
export type PromptSuggestionType = 
  | 'starter' // Initial prompts for new conversations
  | 'follow-up' // Context-aware follow-ups
  | 'quick-reply' // Quick reply chips
  | 'template' // Saved template suggestions

/**
 * A single prompt suggestion
 */
export interface PromptSuggestion {
  id: string
  text: string
  label?: string
  description?: string
  icon?: React.ReactNode
  category?: string
  type: PromptSuggestionType
  /** Confidence score (0-1) for context-aware suggestions */
  confidence?: number
  /** Keywords for matching suggestions to context */
  keywords?: string[]
  /** Usage count for popularity sorting */
  usageCount?: number
}

/**
 * Props for PromptSuggestions component
 */
export interface PromptSuggestionsProps {
  /** Suggestions to display */
  suggestions: PromptSuggestion[]
  /** Callback when suggestion is selected */
  onSelect: (suggestion: PromptSuggestion) => void
  /** Current conversation messages for context-aware suggestions */
  messages?: Message[]
  /** Type of suggestions to show */
  suggestionType?: PromptSuggestionType
  /** Layout style */
  layout?: 'chips' | 'cards' | 'list'
  /** Show loading state */
  isLoading?: boolean
  /** Maximum number of suggestions to show */
  maxSuggestions?: number
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Show categories */
  showCategories?: boolean
  className?: string
}

/**
 * PromptSuggestions Component
 * 
 * Displays context-aware prompt suggestions based on conversation state.
 * Supports starter prompts, follow-ups, quick replies, and templates.
 * 
 * Features:
 * - Context-aware suggestions based on conversation history
 * - Animated, accessible UI
 * - Multiple layout options
 * - Category grouping
 * - Confidence-based sorting
 * 
 * @example
 * ```tsx
 * <PromptSuggestions
 *   suggestions={suggestions}
 *   onSelect={(suggestion) => sendMessage(suggestion.text)}
 *   messages={messages}
 *   suggestionType="follow-up"
 *   layout="chips"
 * />
 * ```
 */
export const PromptSuggestions = React.memo(function PromptSuggestions({
  suggestions,
  onSelect,
  messages = [],
  suggestionType = 'starter',
  layout = 'chips',
  isLoading = false,
  maxSuggestions = 6,
  emptyState,
  showCategories = false,
  className,
}: PromptSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | 'all'>('all')

  // Filter and sort suggestions
  const processedSuggestions = React.useMemo(() => {
    let filtered = suggestions

    // Filter by type
    if (suggestionType) {
      filtered = filtered.filter((s) => s.type === suggestionType)
    }

    // Filter by category if needed
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    // Sort by confidence (for context-aware) or usage count
    filtered = [...filtered].sort((a, b) => {
      if (suggestionType === 'follow-up' && a.confidence && b.confidence) {
        return b.confidence - a.confidence
      }
      if (a.usageCount && b.usageCount) {
        return b.usageCount - a.usageCount
      }
      return 0
    })

    // Limit results
    return filtered.slice(0, maxSuggestions)
  }, [suggestions, suggestionType, selectedCategory, maxSuggestions])

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    suggestions.forEach((s) => {
      if (s.category) cats.add(s.category)
    })
    return Array.from(cats)
  }, [suggestions])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {Array.from({ length: maxSuggestions }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    )
  }

  // Empty state
  if (processedSuggestions.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>
    }
    return null
  }

  // Render chips layout
  if (layout === 'chips') {
    return (
      <div className={cn('space-y-3', className)}>
        {showCategories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {processedSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(suggestion)}
                  className={cn(
                    'group relative',
                    'hover:bg-primary hover:text-primary-foreground',
                    'transition-all duration-150 ease-out',
                    'hover:scale-105 active:scale-95'
                  )}
                  aria-label={suggestion.label || suggestion.text}
                >
                  {suggestion.icon && (
                    <span className="mr-2">{suggestion.icon}</span>
                  )}
                  <span>{suggestion.label || suggestion.text}</span>
                  {suggestion.confidence !== undefined && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-xs"
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Render cards layout
  if (layout === 'cards') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3', className)}>
        <AnimatePresence mode="popLayout">
          {processedSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
              }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all',
                  'hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] hover:border-primary',
                  'hover:-translate-y-1'
                )}
                onClick={() => onSelect(suggestion)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {suggestion.icon && (
                      <div className="flex-shrink-0">{suggestion.icon}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">
                        {suggestion.label || suggestion.text}
                      </h4>
                      {suggestion.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {suggestion.description}
                        </p>
                      )}
                      {suggestion.confidence !== undefined && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {Math.round(suggestion.confidence * 100)}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // Render list layout
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout">
        {processedSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{
              duration: 0.2,
              delay: index * 0.03,
            }}
          >
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-left',
                'hover:bg-accent'
              )}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion.icon && (
                <span className="mr-2">{suggestion.icon}</span>
              )}
              <div className="flex-1 text-left">
                <div className="font-medium">{suggestion.label || suggestion.text}</div>
                {suggestion.description && (
                  <div className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </div>
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

/**
 * Hook to generate context-aware prompt suggestions
 */
export function usePromptSuggestions(
  messages: Message[],
  options?: {
    maxSuggestions?: number
    suggestionType?: PromptSuggestionType
  }
) {
  const { maxSuggestions = 6, suggestionType = 'follow-up' } = options || {}

  const suggestions = React.useMemo(() => {
    if (messages.length === 0) {
      // Return starter prompts for empty conversations
      return [
        {
          id: 'starter-1',
          text: 'Help me get started',
          label: 'Get Started',
          type: 'starter' as const,
          description: 'Begin a new conversation',
        },
        {
          id: 'starter-2',
          text: 'What can you help me with?',
          label: 'Capabilities',
          type: 'starter' as const,
          description: 'Learn about available features',
        },
      ]
    }

    // Generate context-aware follow-ups based on last message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return []

    const lastContent = lastMessage.content.toLowerCase()
    const followUps: PromptSuggestion[] = []

    // Example: If last message is about code, suggest code-related follow-ups
    if (lastContent.includes('code') || lastContent.includes('function')) {
      followUps.push({
        id: 'follow-up-code-1',
        text: 'Can you explain this in more detail?',
        label: 'Explain More',
        type: 'follow-up',
        confidence: 0.8,
        keywords: ['code', 'explain'],
      })
      followUps.push({
        id: 'follow-up-code-2',
        text: 'Show me an example',
        label: 'Show Example',
        type: 'follow-up',
        confidence: 0.75,
        keywords: ['code', 'example'],
      })
    }

    // Add generic follow-ups
    followUps.push({
      id: 'follow-up-generic-1',
      text: 'Tell me more',
      label: 'More Info',
      type: 'follow-up',
      confidence: 0.6,
    })

    return followUps.slice(0, maxSuggestions)
  }, [messages, maxSuggestions, suggestionType])

  return suggestions
}
