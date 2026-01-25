'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, Card, CardContent } from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'
import { Skeleton, SkeletonText } from '../ui/skeleton'
import { DURATION_SECONDS as durations, ANIMATION_PRESETS } from '../../animations/constants'

/**
 * A single suggestion card
 */
export interface SuggestionCard {
  /** Unique identifier */
  id?: string
  /** Icon for the card (can be emoji or React node) */
  icon: React.ReactNode
  /** Card title */
  title: string
  /** Card description */
  description?: string
  /** Category for filtering */
  category?: string
  /** Keywords for search */
  keywords?: string[]
  /** Badge text (e.g., "Popular", "New") */
  badge?: string
  /** Whether this card is disabled */
  disabled?: boolean
  /** Custom data to pass through onClick */
  data?: Record<string, unknown>
}

/**
 * Category filter configuration
 */
export interface CategoryFilter {
  /** Category identifier */
  id: string
  /** Display label */
  label: string
  /** Icon for the category */
  icon?: React.ReactNode
  /** Count of items in this category */
  count?: number
}

/**
 * Props for SuggestionCards component
 */
export interface SuggestionCardsProps {
  /** Cards to display */
  cards: SuggestionCard[]
  /** Callback when a card is clicked */
  onCardClick?: (card: SuggestionCard) => void
  /** Available categories for filtering */
  categories?: CategoryFilter[]
  /** Currently selected category */
  selectedCategory?: string
  /** Callback when category changes */
  onCategoryChange?: (categoryId: string | null) => void
  /** Grid layout configuration */
  columns?: 1 | 2 | 3 | 4 | 'auto'
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show loading state */
  isLoading?: boolean
  /** Number of skeleton cards when loading */
  loadingCount?: number
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Search query for filtering */
  searchQuery?: string
  /** Show category filter bar */
  showCategoryFilter?: boolean
  /** Maximum cards to display (with "show more" option) */
  maxCards?: number
  /** Callback when "show more" is clicked */
  onShowMore?: () => void
  /** Whether more cards are available */
  hasMore?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Get column classes based on columns prop
 */
function getGridClasses(columns: SuggestionCardsProps['columns']): string {
  switch (columns) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-1 sm:grid-cols-2'
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    case 'auto':
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
}

/**
 * Get size classes for cards
 */
function getSizeClasses(size: SuggestionCardsProps['size']): {
  card: string
  icon: string
  title: string
  description: string
} {
  switch (size) {
    case 'sm':
      return {
        card: 'p-3',
        icon: 'w-8 h-8 text-lg',
        title: 'text-sm font-medium',
        description: 'text-xs',
      }
    case 'lg':
      return {
        card: 'p-5',
        icon: 'w-14 h-14 text-2xl',
        title: 'text-lg font-semibold',
        description: 'text-sm',
      }
    case 'md':
    default:
      return {
        card: 'p-4',
        icon: 'w-10 h-10 text-xl',
        title: 'text-base font-semibold',
        description: 'text-xs',
      }
  }
}

/**
 * Filter cards based on category and search query
 */
function filterCards(
  cards: SuggestionCard[],
  category: string | null | undefined,
  searchQuery: string | undefined
): SuggestionCard[] {
  let filtered = cards

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((card) => card.category === category)
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter((card) => {
      const matchesTitle = card.title.toLowerCase().includes(query)
      const matchesDescription = card.description?.toLowerCase().includes(query)
      const matchesKeywords = card.keywords?.some((k) =>
        k.toLowerCase().includes(query)
      )
      return matchesTitle || matchesDescription || matchesKeywords
    })
  }

  return filtered
}

/**
 * SuggestionCards Component
 *
 * A grid of interactive suggestion cards with categories, search filtering,
 * and animated transitions. Ideal for onboarding, feature discovery, and
 * quick action selection.
 *
 * Features:
 * - Responsive grid layout
 * - Category filtering
 * - Search filtering
 * - Loading states with skeletons
 * - Empty state handling
 * - Animated card transitions
 * - Badge support for highlighting
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <SuggestionCards
 *   cards={[
 *     { icon: '📝', title: 'Write', description: 'Generate content' },
 *     { icon: '🔍', title: 'Research', description: 'Find information' },
 *     { icon: '💻', title: 'Code', description: 'Write and debug code' },
 *   ]}
 *   onCardClick={(card) => handleClick(card)}
 *   columns={3}
 *   size="md"
 * />
 * ```
 */
export function SuggestionCards({
  cards,
  onCardClick,
  categories,
  selectedCategory,
  onCategoryChange,
  columns = 'auto',
  size = 'md',
  isLoading = false,
  loadingCount = 6,
  emptyState,
  searchQuery,
  showCategoryFilter = true,
  maxCards,
  onShowMore,
  hasMore = false,
  className,
}: SuggestionCardsProps) {
  const prefersReducedMotion = useReducedMotion()
  const sizeClasses = getSizeClasses(size)
  const gridClasses = getGridClasses(columns)

  // Filter cards
  const filteredCards = React.useMemo(
    () => filterCards(cards, selectedCategory, searchQuery),
    [cards, selectedCategory, searchQuery]
  )

  // Apply max cards limit
  const displayCards = maxCards ? filteredCards.slice(0, maxCards) : filteredCards
  const remainingCount = maxCards ? filteredCards.length - maxCards : 0

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Category filter skeleton */}
        {showCategoryFilter && categories && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width={80} height={32} rounded="full" variant="shimmer" />
            ))}
          </div>
        )}

        {/* Cards skeleton */}
        <div className={cn('grid gap-4', gridClasses)}>
          {Array.from({ length: loadingCount }).map((_, i) => (
            <motion.div
              key={i}
              {...ANIMATION_PRESETS.scale}
              transition={{ duration: durations.normal, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className={cn('overflow-hidden', sizeClasses.card)}>
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <Skeleton
                      width={size === 'sm' ? 32 : size === 'lg' ? 56 : 40}
                      height={size === 'sm' ? 32 : size === 'lg' ? 56 : 40}
                      rounded="lg"
                      variant="shimmer"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="60%" height={16} variant="shimmer" />
                      <SkeletonText lines={2} variant="shimmer" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (filteredCards.length === 0) {
    return (
      <motion.div
        {...ANIMATION_PRESETS.scale}
        transition={{ duration: durations.normal }}
        viewport={{ once: true }}
        className={cn('rounded-xl border border-dashed border-border/40 bg-muted/20 p-8 text-center', className)}
      >
        {emptyState || (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground/80">No suggestions found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Check back later for new suggestions'}
            </p>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category filter bar */}
      {showCategoryFilter && categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <motion.button
            {...ANIMATION_PRESETS.scale}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            viewport={{ once: true }}
            onClick={() => onCategoryChange?.(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              !selectedCategory || selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-foreground/80 hover:bg-muted hover:text-foreground'
            )}
          >
            All
            <span className="ml-1.5 text-xs opacity-70">({cards.length})</span>
          </motion.button>
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              {...ANIMATION_PRESETS.scale}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
                delay: (index + 1) * 0.03,
              }}
              viewport={{ once: true }}
              onClick={() => onCategoryChange?.(category.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium',
                'flex items-center gap-1.5',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-foreground/80 hover:bg-muted hover:text-foreground'
              )}
            >
              {category.icon && <span className="text-sm">{category.icon}</span>}
              {category.label}
              {category.count !== undefined && (
                <span className="text-xs opacity-70">({category.count})</span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Cards grid */}
      <div className={cn('grid gap-4', gridClasses)}>
        {displayCards.map((card, index) => (
          <motion.div
            key={card.id || `${card.title}-${index}`}
            layout
            {...ANIMATION_PRESETS.slideUp}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              delay: index * 0.03,
            }}
            viewport={{ once: true }}
          >
            <Card
              hoverable={!card.disabled}
              className={cn(
                'group cursor-pointer overflow-hidden',
                'bg-gradient-to-br from-card to-card/95',
                'border-border/40',
                'shadow-sm',
                'transition-all duration-200 ease-out',
                !card.disabled && [
                  'hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)]',
                  'hover:border-primary/30',
                  'hover:-translate-y-1 hover:scale-[1.01]',
                  'active:scale-[0.99] active:translate-y-0',
                ],
                card.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !card.disabled && onCardClick?.(card)}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <CardContent className={cn('relative', sizeClasses.card)}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      'flex-shrink-0 rounded-xl',
                      'bg-primary/10 flex items-center justify-center',
                      'text-primary',
                      'group-hover:bg-primary group-hover:text-primary-foreground',
                      'transition-colors duration-200',
                      sizeClasses.icon
                    )}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                      {card.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={cn(
                            'text-foreground group-hover:text-primary transition-colors duration-200',
                            sizeClasses.title
                          )}
                        >
                          {card.title}
                        </h3>
                        {card.badge && (
                          <span
                            className={cn(
                              'flex-shrink-0 px-2 py-0.5 rounded-full',
                              'text-[10px] font-semibold uppercase tracking-wide',
                              'bg-primary/10 text-primary'
                            )}
                          >
                            {card.badge}
                          </span>
                        )}
                      </div>
                      {card.description && (
                        <p
                          className={cn(
                            'text-muted-foreground/80 line-clamp-2 mt-1',
                            sizeClasses.description
                          )}
                        >
                          {card.description}
                        </p>
                      )}
                      {card.keywords && card.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.keywords.slice(0, 3).map((keyword) => (
                            <span
                              key={keyword}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full',
                        'bg-muted/50 flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100',
                        'translate-x-1 group-hover:translate-x-0',
                        'transition-all duration-200'
                      )}
                    >
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

      {/* Show more button */}
      {(hasMore || remainingCount > 0) && onShowMore && (
        <motion.div
          {...ANIMATION_PRESETS.fadeIn}
          transition={{ duration: durations.normal, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center pt-2"
        >
          <button
            onClick={onShowMore}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium',
              'bg-muted/50 hover:bg-muted',
              'text-foreground/80 hover:text-foreground',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            )}
          >
            Show more
            {remainingCount > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                (+{remainingCount})
              </span>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}

SuggestionCards.displayName = 'SuggestionCards'

/**
 * Hook for managing suggestion cards with categories and search
 */
export function useSuggestionCards(
  cards: SuggestionCard[],
  options?: {
    initialCategory?: string
    maxCards?: number
  }
) {
  const { initialCategory, maxCards: initialMaxCards } = options || {}

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    initialCategory || null
  )
  const [searchQuery, setSearchQuery] = React.useState('')
  const [maxCards, setMaxCards] = React.useState(initialMaxCards)

  // Extract categories from cards
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>()
    cards.forEach((card) => {
      if (card.category) {
        categoryMap.set(card.category, (categoryMap.get(card.category) || 0) + 1)
      }
    })
    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      count,
    }))
  }, [cards])

  // Filter cards
  const filteredCards = React.useMemo(
    () => filterCards(cards, selectedCategory, searchQuery),
    [cards, selectedCategory, searchQuery]
  )

  // Display cards with limit
  const displayCards = maxCards ? filteredCards.slice(0, maxCards) : filteredCards
  const hasMore = maxCards ? filteredCards.length > maxCards : false

  const handleShowMore = React.useCallback(() => {
    setMaxCards((prev) => (prev ? prev + (initialMaxCards || 6) : undefined))
  }, [initialMaxCards])

  const resetFilters = React.useCallback(() => {
    setSelectedCategory(null)
    setSearchQuery('')
    setMaxCards(initialMaxCards)
  }, [initialMaxCards])

  return {
    cards: displayCards,
    allCards: filteredCards,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    maxCards,
    hasMore,
    showMore: handleShowMore,
    resetFilters,
  }
}
