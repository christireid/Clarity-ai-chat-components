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

const confidenceColor = (value?: number) => {
  if (value === undefined) return 'text-primary'
  if (value >= 0.75) return 'text-success'
  if (value >= 0.5) return 'text-warning-foreground'
  return 'text-destructive'
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions,
  onSelect,
  title = 'Suggested follow-ups',
  subtitle = 'Keep the conversation moving with contextual prompts tailored to your last exchange.',
  layout = 'grid',
  isLoading = false,
  loadingCount = 4,
  emptyState,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const renderSuggestion = (suggestion: FollowUpSuggestion) => (
    <motion.li
      key={suggestion.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
    >
      <Button
        variant="surface"
        className={cn(
          'group flex w-full flex-col items-start gap-2 rounded-2xl border border-border/60 p-4 text-left shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)]',
          layout === 'list' && 'rounded-xl'
        )}
        onClick={() => onSelect(suggestion)}
        aria-label={`Follow up with ${suggestion.title}`}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
            {suggestion.icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
                {suggestion.icon}
              </span>
            )}
            <span>{suggestion.title}</span>
          </div>
          {suggestion.confidence !== undefined && (
            <span
              className={cn('text-xs font-medium', confidenceColor(suggestion.confidence))}
            >
              {Math.round(suggestion.confidence * 100)}% match
            </span>
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
              <Badge key={keyword} variant="subtle" className="text-xs font-medium">
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
        <li key={`skeleton-${index}`} className="rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4 shadow-inner">
          <div className="flex items-center gap-3">
            <Skeleton width={36} height={36} rounded="full" />
            <Skeleton width="70%" height={16} />
          </div>
          <SkeletonText lines={2} className="mt-3" />
          <div className="mt-3 flex gap-2">
            <Skeleton width={72} height={20} rounded="lg" />
            <Skeleton width={64} height={20} rounded="lg" />
          </div>
        </li>
      ))}
    </ul>
  )

  const hasSuggestions = suggestions.length > 0

  return (
    <Card ref={containerRef} className={cn('border-border/50 bg-[hsl(var(--surface-elevated))] shadow-[0_22px_48px_rgba(15,23,42,0.14)]', className)}>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && renderLoading()}

        {!isLoading && hasSuggestions && (
          <AnimatePresence initial={false}>
            <ul className={cn(gridClasses[layout], 'list-none p-0')}>{suggestions.map(renderSuggestion)}</ul>
          </AnimatePresence>
        )}

        {!isLoading && !hasSuggestions && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-[hsl(var(--surface-muted))] p-6 text-center text-sm text-muted-foreground">
            {emptyState || 'No follow-up suggestions available yet. Continue the conversation to generate more ideas.'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

FollowUpSuggestions.displayName = 'FollowUpSuggestions'

