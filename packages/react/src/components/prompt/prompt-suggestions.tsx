'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent, Badge, cn } from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'
import { Skeleton } from '../ui/skeleton'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../animations/constants'

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
export function PromptSuggestions({
  suggestions,
  onSelect,
  messages: _messages = [],
  suggestionType = 'starter',
  layout = 'chips',
  isLoading = false,
  maxSuggestions = 6,
  emptyState,
  showCategories = false,
  className,
}: PromptSuggestionsProps) {
  const prefersReducedMotion = useReducedMotion()
  const [selectedCategory, setSelectedCategory] = React.useState<
    string | 'all'
  >('all')

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
      <div className={cn('flex flex-wrap gap-2.5', className)}>
        {Array.from({ length: maxSuggestions }).map((_, i) => (
          <Skeleton key={i} width={112} height={36} rounded="full" />
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
      <div className={cn('space-y-3.5', className)}>
        {showCategories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
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
        <div className="flex flex-wrap gap-2.5">
          {processedSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: -10 }}
              transition={{
                // Framer Motion 12: Spring entrance for suggestions
                type: 'spring',
                damping: 22,
                stiffness: 300,
                delay: index * 0.05,
              }}
              viewport={{ once: true }}
            >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(suggestion)}
                  className={cn(
                    'group relative rounded-full px-4 py-2',
                    'bg-card/80 backdrop-blur-sm',
                    'border-border/50',
                    'hover:bg-gradient-to-r hover:from-primary hover:to-primary/90',
                    'hover:text-primary-foreground hover:border-primary/50',
                    'transition-all duration-200 ease-out',
                    'shadow-sm hover:shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.3)]',
                    'hover:-translate-y-0.5 hover:scale-[1.02]',
                    'active:scale-[0.98] active:translate-y-0'
                  )}
                  aria-label={suggestion.label || suggestion.text}
                >
                  {suggestion.icon && (
                    <span className="mr-2">{suggestion.icon}</span>
                  )}
                  <span>{suggestion.label || suggestion.text}</span>
                  {suggestion.confidence !== undefined && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Render cards layout
  if (layout === 'cards') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3.5', className)}>
        {processedSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? false : { opacity: 0, y: -10, scale: 0.96 }}
            transition={{
              // Framer Motion 12: Spring cards entrance
              type: 'spring',
              damping: 25,
              stiffness: 280,
              delay: index * 0.05,
            }}
            viewport={{ once: true }}
          >
            <Card
              hoverable
              className={cn(
                'cursor-pointer transition-all duration-200 ease-out',
                'bg-gradient-to-br from-card to-card/95',
                'border-border/40',
                'shadow-sm',
                'hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)]',
                'hover:border-primary/30',
                'hover:-translate-y-1 hover:scale-[1.01]',
                'active:scale-[0.99] active:translate-y-0',
                'group overflow-hidden'
              )}
              onClick={() => onSelect(suggestion)}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <CardContent className="px-4 py-4 relative">
                <div className="flex items-start gap-3.5">
                  {suggestion.icon && (
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.05, rotate: 3 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                        {suggestion.icon}
                      </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                        {suggestion.label || suggestion.text}
                      </h4>
                      {suggestion.description && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                          {suggestion.description}
                        </p>
                      )}
                      {suggestion.confidence !== undefined && (
                        <Badge
                          variant="secondary"
                          className="mt-2.5 text-xs bg-primary/10 text-primary border-0"
                        >
                          {Math.round(suggestion.confidence * 100)}% match
                        </Badge>
                      )}
                    </div>
                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  // Render list layout
  return (
    <div className={cn('space-y-2.5', className)}>
      {processedSuggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -10, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={prefersReducedMotion ? false : { opacity: 0, x: 10, scale: 0.98 }}
          transition={{
            duration: durations.normal,
            delay: index * 0.03,
            ease: EASING_FRAMER.sharp,
          }}
          viewport={{ once: true }}
        >
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-left',
                'hover:bg-accent/50'
              )}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion.icon && (
                <span className="mr-2.5">{suggestion.icon}</span>
              )}
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">
                  {suggestion.label || suggestion.text}
                </div>
                {suggestion.description && (
                  <div className="text-xs text-muted-foreground/90 mt-0.5">
                    {suggestion.description}
                  </div>
                )}
              </div>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

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
  }, [messages, maxSuggestions])

  return suggestions
}
