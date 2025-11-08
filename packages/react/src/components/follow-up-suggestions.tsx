import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import { Skeleton, SkeletonText } from './skeleton'

export interface FollowUpSuggestion {
  id: string
  title: string
  description?: string
  keywords?: string[]
  icon?: React.ReactNode
  confidence?: number
}

export interface FollowUpSuggestionsProps {
  /** Suggestions to display */
  suggestions: FollowUpSuggestion[]
  /** Callback when a suggestion is selected */
  onSelect: (suggestion: FollowUpSuggestion) => void
  /** Optional heading */
  title?: string
  /** Optional description text under the heading */
  subtitle?: string
  /** Layout style */
  layout?: 'grid' | 'list'
  /** Show loading state */
  isLoading?: boolean
  /** Number of placeholder cards to render while loading */
  loadingCount?: number
  /** Empty state render when no suggestions */
  emptyState?: React.ReactNode
  className?: string
}

const gridClasses = {
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  list: 'flex flex-col gap-3',
}

export const FollowUpSuggestions = React.memo(function FollowUpSuggestions({
  suggestions,
  onSelect,
  title = 'Suggested follow-ups',
  subtitle = 'Keep the conversation moving with contextual prompts tailored to your last exchange.',
  layout = 'grid',
  isLoading = false,
  loadingCount = 4,
  emptyState,
  className,
}: FollowUpSuggestionsProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const renderSuggestion = (suggestion: FollowUpSuggestion, index: number) => (
    <motion.li
      key={suggestion.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Button
        variant="outline"
        className={cn(
          'group flex w-full flex-col items-start gap-2 rounded-xl p-4 text-left shadow-[0_1px_3px_rgba(15,23,42,0.1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] hover:border-primary/40 hover:bg-accent/5',
          layout === 'list' && 'rounded-lg'
        )}
        onClick={() => onSelect(suggestion)}
        aria-label={`Follow up with ${suggestion.title}`}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
            {suggestion.icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-primary/20 group-hover:bg-primary/15 transition-colors">
                {suggestion.icon}
              </span>
            )}
            <span className="group-hover:text-primary transition-colors">
              {suggestion.title}
            </span>
          </div>
          {suggestion.confidence !== undefined && (
            <Badge
              variant={
                suggestion.confidence >= 0.75
                  ? 'success'
                  : suggestion.confidence >= 0.5
                    ? 'warning'
                    : 'secondary'
              }
              className="shrink-0"
            >
              {Math.round(suggestion.confidence * 100)}%
            </Badge>
          )}
        </div>

        {suggestion.description && (
          <p className="text-sm text-muted-foreground/80">
            {suggestion.description}
          </p>
        )}

        {suggestion.keywords && suggestion.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestion.keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="subtle"
                className="text-xs font-medium"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </Button>
    </motion.li>
  )

  const renderLoading = () => (
    <ul className={cn(gridClasses[layout])}>
      {Array.from({ length: loadingCount }).map((_, index) => (
        <motion.li
          key={`skeleton-${index}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="rounded-xl border border-border/60 bg-muted/50 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.1)]"
        >
          <div className="flex items-center gap-3">
            <Skeleton width={32} height={32} rounded="lg" variant="shimmer" />
            <Skeleton width="70%" height={16} variant="shimmer" />
          </div>
          <SkeletonText lines={2} className="mt-3" variant="shimmer" />
          <div className="mt-3 flex gap-2">
            <Skeleton width={72} height={20} rounded="full" variant="shimmer" />
            <Skeleton width={64} height={20} rounded="full" variant="shimmer" />
          </div>
        </motion.li>
      ))}
    </ul>
  )

  const hasSuggestions = suggestions.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card ref={containerRef} className={cn('shadow-[0_10px_24px_rgba(15,23,42,0.12)]', className)}>
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-primary/20">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {subtitle}
              </CardDescription>
            </div>
            {hasSuggestions && !isLoading && (
              <Badge variant="secondary">{suggestions.length}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && renderLoading()}

          {!isLoading && hasSuggestions && (
            <AnimatePresence initial={false}>
              <ul className={cn(gridClasses[layout], 'list-none p-0')}>
                {suggestions.map((suggestion, index) =>
                  renderSuggestion(suggestion, index)
                )}
              </ul>
            </AnimatePresence>
          )}

          {!isLoading && !hasSuggestions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-dashed bg-muted/50 p-8 text-center"
            >
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                {emptyState ||
                  'No follow-up suggestions available yet. Continue the conversation to generate more ideas.'}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

FollowUpSuggestions.displayName = 'FollowUpSuggestions'
