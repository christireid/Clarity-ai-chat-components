/**
 * SourceCitation Component
 *
 * Displays AI response sources/citations with expandable details,
 * favicon support, and multiple display variants. Inspired by Prompt-Kit's
 * Source component pattern, adapted to Clarity's design system.
 *
 * Features:
 * - Multiple display variants (inline, card, list)
 * - Favicon support with fallback
 * - Expandable source details on hover/click
 * - Grouped sources display
 * - Direct links to original sources
 * - Full accessibility (ARIA, keyboard navigation)
 * - Respects reduced motion preferences
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Basic usage with multiple sources
 * <SourceCitation
 *   sources={[
 *     { url: 'https://example.com', title: 'Example', snippet: 'Content...' },
 *     { url: 'https://docs.com', title: 'Documentation', snippet: 'More...' }
 *   ]}
 *   variant="card"
 * />
 *
 * // Inline variant for embedding in text
 * <SourceCitation
 *   sources={sources}
 *   variant="inline"
 *   maxVisible={3}
 * />
 *
 * // List variant with callbacks
 * <SourceCitation
 *   sources={sources}
 *   variant="list"
 *   onSourceClick={(source) => console.log('Clicked:', source)}
 *   showConfidence
 * />
 * ```
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { SIZE_CONFIG } from './constants'
import { groupSourcesByDomain } from './utils'
import { ChevronDownIcon, DocumentIcon } from './icons'
import {
  SourceCitationSkeleton,
  Favicon,
  InlineSourceItem,
  CardSourceItem,
  ListSourceItem,
} from './components'
import type { SourceCitationProps } from './types'

/**
 * SourceCitation - Display AI response sources with rich details
 *
 * A comprehensive component for displaying source citations from AI responses.
 * Supports multiple display variants (inline, card, list), favicons, confidence
 * scores, and expandable details. Fully accessible with keyboard navigation
 * and screen reader support.
 */
export function SourceCitation({
  sources,
  variant = 'card',
  size = 'md',
  maxVisible,
  showConfidence = false,
  showDomain = true,
  showDate = false,
  showAuthor = false,
  showFavicons = true,
  expandOnHover = true,
  onSourceClick,
  onExpandChange,
  openInNewTab = true,
  groupByDomain = false,
  title,
  className,
  sourceClassName,
  disableAnimations = false,
  loading = false,
  emptyMessage = 'No sources available',
  'aria-label': ariaLabel,
}: SourceCitationProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const [showAll, setShowAll] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]

  // Calculate visible sources
  const visibleSources = React.useMemo(() => {
    if (!maxVisible || showAll) return sources
    return sources.slice(0, maxVisible)
  }, [sources, maxVisible, showAll])

  const hiddenCount = sources.length - visibleSources.length

  // Handle show more toggle
  const handleShowMore = () => {
    setShowAll(true)
    onExpandChange?.(true)
  }

  // Loading state
  if (loading) {
    return <SourceCitationSkeleton variant={variant} count={maxVisible || 3} />
  }

  // Empty state
  if (sources.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-6 text-center',
          className
        )}
        role="status"
      >
        <DocumentIcon size={32} className="text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  // Grouped sources
  if (groupByDomain && variant !== 'inline') {
    const groups = groupSourcesByDomain(sources)

    return (
      <div
        className={cn('w-full', className)}
        role="region"
        aria-label={ariaLabel || 'Source citations grouped by domain'}
      >
        {title && (
          <h3 className={cn('font-semibold text-foreground mb-3', sizeConfig.title)}>
            {title}
          </h3>
        )}

        <div className="space-y-4">
          {Array.from(groups.entries()).map(([domain, domainSources]) => (
            <div key={domain}>
              <div className="flex items-center gap-2 mb-2">
                <Favicon url={domainSources[0].url} size={size} />
                <span className={cn(sizeConfig.title, 'text-foreground')}>{domain}</span>
                <span className="text-xs text-muted-foreground">
                  ({domainSources.length} source{domainSources.length > 1 ? 's' : ''})
                </span>
              </div>

              {variant === 'card' ? (
                <div className="grid gap-2 pl-6">
                  {domainSources.map((source, index) => (
                    <CardSourceItem
                      key={`${source.url}-${index}`}
                      source={source}
                      index={sources.indexOf(source)}
                      size={size}
                      showFavicons={false}
                      showConfidence={showConfidence}
                      showDomain={false}
                      showDate={showDate}
                      showAuthor={showAuthor}
                      onClick={() => onSourceClick?.(source, sources.indexOf(source))}
                      openInNewTab={openInNewTab}
                      prefersReducedMotion={prefersReducedMotion}
                      className={sourceClassName}
                    />
                  ))}
                </div>
              ) : (
                <ul className="pl-6" role="list">
                  {domainSources.map((source, index) => (
                    <ListSourceItem
                      key={`${source.url}-${index}`}
                      source={source}
                      index={sources.indexOf(source)}
                      size={size}
                      showFavicons={false}
                      showConfidence={showConfidence}
                      showDomain={false}
                      expandOnHover={expandOnHover}
                      onClick={() => onSourceClick?.(source, sources.indexOf(source))}
                      openInNewTab={openInNewTab}
                      prefersReducedMotion={prefersReducedMotion}
                      className={sourceClassName}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div
        className={cn('inline-flex flex-wrap items-center', sizeConfig.gap, className)}
        role="list"
        aria-label={ariaLabel || `${sources.length} source citations`}
      >
        {title && (
          <span className={cn(sizeConfig.snippet, 'text-muted-foreground mr-1')}>
            {title}:
          </span>
        )}

        {visibleSources.map((source, index) => (
          <InlineSourceItem
            key={`${source.url}-${index}`}
            source={source}
            index={index}
            size={size}
            showFavicons={showFavicons}
            showConfidence={showConfidence}
            expandOnHover={expandOnHover}
            onClick={() => onSourceClick?.(source, index)}
            openInNewTab={openInNewTab}
            prefersReducedMotion={prefersReducedMotion}
            className={sourceClassName}
          />
        ))}

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={handleShowMore}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md',
              'text-primary hover:bg-primary/10 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              sizeConfig.snippet
            )}
          >
            +{hiddenCount} more
            <ChevronDownIcon size={12} />
          </button>
        )}
      </div>
    )
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div
        className={cn('w-full', className)}
        role="region"
        aria-label={ariaLabel || `${sources.length} source citations`}
      >
        {title && (
          <h3 className={cn('font-semibold text-foreground mb-3', sizeConfig.title)}>
            {title}
          </h3>
        )}

        <div className="grid gap-2.5">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleSources.map((source, index) => (
              <CardSourceItem
                key={`${source.url}-${index}`}
                source={source}
                index={index}
                size={size}
                showFavicons={showFavicons}
                showConfidence={showConfidence}
                showDomain={showDomain}
                showDate={showDate}
                showAuthor={showAuthor}
                onClick={() => onSourceClick?.(source, index)}
                openInNewTab={openInNewTab}
                prefersReducedMotion={prefersReducedMotion}
                className={sourceClassName}
              />
            ))}
          </AnimatePresence>
        </div>

        {hiddenCount > 0 && (
          <motion.button
            type="button"
            onClick={handleShowMore}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'mt-3 w-full py-2 text-sm font-medium text-primary',
              'rounded-lg border border-primary/30 bg-primary/5',
              'hover:bg-primary/10 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            Show {hiddenCount} more source{hiddenCount > 1 ? 's' : ''}
          </motion.button>
        )}
      </div>
    )
  }

  // List variant
  return (
    <div
      className={cn('w-full', className)}
      role="region"
      aria-label={ariaLabel || `${sources.length} source citations`}
    >
      {title && (
        <h3 className={cn('font-semibold text-foreground mb-2', sizeConfig.title)}>
          {title}
        </h3>
      )}

      <ul role="list" className="space-y-0">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleSources.map((source, index) => (
            <ListSourceItem
              key={`${source.url}-${index}`}
              source={source}
              index={index}
              size={size}
              showFavicons={showFavicons}
              showConfidence={showConfidence}
              showDomain={showDomain}
              expandOnHover={expandOnHover}
              onClick={() => onSourceClick?.(source, index)}
              openInNewTab={openInNewTab}
              prefersReducedMotion={prefersReducedMotion}
              className={sourceClassName}
            />
          ))}
        </AnimatePresence>
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={handleShowMore}
          className={cn(
            'mt-2 text-sm font-medium text-primary hover:text-primary/80',
            'focus:outline-none focus-visible:underline'
          )}
        >
          Show {hiddenCount} more source{hiddenCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}

SourceCitation.displayName = 'SourceCitation'
