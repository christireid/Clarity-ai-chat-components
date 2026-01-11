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
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
  STAGGER_TIMING,
} from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Individual source data
 */
export interface Source {
  /** Source URL */
  url: string
  /** Source title/name */
  title: string
  /** Text snippet/excerpt from the source */
  snippet: string
  /** Optional favicon URL (auto-fetched if not provided) */
  favicon?: string
  /** Relevance/confidence score (0-1) */
  confidence?: number
  /** Source domain (auto-extracted if not provided) */
  domain?: string
  /** Publication date */
  date?: string | Date
  /** Author name */
  author?: string
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>
}

/**
 * Display variant for the component
 */
export type SourceCitationVariant = 'inline' | 'card' | 'list'

/**
 * Size variant for the component
 */
export type SourceCitationSize = 'sm' | 'md' | 'lg'

/**
 * Props for the SourceCitation component
 */
export interface SourceCitationProps {
  /** Array of source citations */
  sources: Source[]
  /** Display variant */
  variant?: SourceCitationVariant
  /** Size variant */
  size?: SourceCitationSize
  /** Maximum sources to show before "show more" */
  maxVisible?: number
  /** Show confidence/relevance scores */
  showConfidence?: boolean
  /** Show source domain */
  showDomain?: boolean
  /** Show publication date */
  showDate?: boolean
  /** Show author */
  showAuthor?: boolean
  /** Show favicons */
  showFavicons?: boolean
  /** Expand on hover (for inline/list) */
  expandOnHover?: boolean
  /** Callback when a source is clicked */
  onSourceClick?: (source: Source, index: number) => void
  /** Callback when expand/collapse state changes */
  onExpandChange?: (expanded: boolean) => void
  /** Open links in new tab */
  openInNewTab?: boolean
  /** Group sources by domain */
  groupByDomain?: boolean
  /** Header title */
  title?: string
  /** Custom class name */
  className?: string
  /** Custom class for individual source items */
  sourceClassName?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Loading state */
  loading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Accessible label */
  'aria-label'?: string
}

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const SIZE_CONFIG = {
  sm: {
    container: 'text-xs',
    title: 'text-xs font-medium',
    snippet: 'text-[10px]',
    favicon: 'w-3 h-3',
    badge: 'text-[9px] px-1 py-0',
    padding: 'p-1.5',
    gap: 'gap-1.5',
    iconSize: 12,
  },
  md: {
    container: 'text-sm',
    title: 'text-sm font-medium',
    snippet: 'text-xs',
    favicon: 'w-4 h-4',
    badge: 'text-[10px] px-1.5 py-0.5',
    padding: 'p-2.5',
    gap: 'gap-2',
    iconSize: 14,
  },
  lg: {
    container: 'text-base',
    title: 'text-base font-semibold',
    snippet: 'text-sm',
    favicon: 'w-5 h-5',
    badge: 'text-xs px-2 py-0.5',
    padding: 'p-3.5',
    gap: 'gap-3',
    iconSize: 16,
  },
} as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Get favicon URL for a domain
 */
function getFaviconUrl(url: string, providedFavicon?: string): string {
  if (providedFavicon) return providedFavicon
  try {
    const urlObj = new URL(url)
    // Use Google's favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
  } catch {
    return ''
  }
}

/**
 * Format date for display
 */
function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get confidence label and color
 */
function getConfidenceDisplay(confidence: number): {
  label: string
  color: string
  bgColor: string
} {
  if (confidence >= 0.9) {
    return {
      label: 'High',
      color: 'text-success',
      bgColor: 'bg-success/10',
    }
  }
  if (confidence >= 0.7) {
    return {
      label: 'Medium',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    }
  }
  if (confidence >= 0.5) {
    return {
      label: 'Low',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    }
  }
  return {
    label: 'Very Low',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
  }
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Group sources by domain
 */
function groupSourcesByDomain(sources: Source[]): Map<string, Source[]> {
  const groups = new Map<string, Source[]>()
  sources.forEach((source) => {
    const domain = source.domain || extractDomain(source.url)
    const existing = groups.get(domain) || []
    groups.set(domain, [...existing, source])
  })
  return groups
}

// =============================================================================
// ICONS
// =============================================================================

interface IconProps {
  size?: number
  className?: string
}

const ExternalLinkIcon: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const ChevronDownIcon: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const DocumentIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

const GlobeIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

// =============================================================================
// FAVICON COMPONENT
// =============================================================================

interface FaviconProps {
  url: string
  favicon?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Favicon: React.FC<FaviconProps> = ({
  url,
  favicon,
  size = 'md',
  className,
}) => {
  const [error, setError] = React.useState(false)
  const faviconUrl = getFaviconUrl(url, favicon)
  const sizeConfig = SIZE_CONFIG[size]

  if (error || !faviconUrl) {
    return (
      <div
        className={cn(
          sizeConfig.favicon,
          'flex items-center justify-center rounded bg-muted/50',
          className
        )}
      >
        <GlobeIcon size={sizeConfig.iconSize - 4} className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className={cn(sizeConfig.favicon, 'rounded object-contain', className)}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}

// =============================================================================
// CONFIDENCE BADGE
// =============================================================================

interface ConfidenceBadgeProps {
  confidence: number
  size?: 'sm' | 'md' | 'lg'
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  size = 'md',
}) => {
  const { label, color, bgColor } = getConfidenceDisplay(confidence)
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeConfig.badge,
        color,
        bgColor
      )}
      title={`${Math.round(confidence * 100)}% relevance`}
    >
      {label}
    </span>
  )
}

// =============================================================================
// INLINE SOURCE ITEM
// =============================================================================

interface InlineSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  expandOnHover: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

const InlineSourceItem: React.FC<InlineSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  expandOnHover,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)

  const handleClick = (e: React.MouseEvent) => {
    onClick?.()
    if (!openInNewTab) {
      e.preventDefault()
      window.location.href = source.url
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
      if (openInNewTab) {
        window.open(source.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = source.url
      }
    }
  }

  return (
    <motion.a
      href={source.url}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.fast,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.faster,
      }}
      className={cn(
        'inline-flex items-center rounded-md border border-border/60',
        'bg-background hover:bg-muted/50 hover:border-primary/40',
        'transition-all duration-150 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        sizeConfig.gap,
        size === 'sm' ? 'px-1.5 py-0.5' : size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1',
        className
      )}
      role="link"
      aria-label={`Source ${index + 1}: ${source.title} from ${domain}`}
    >
      {/* Citation number */}
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-full',
          'bg-primary/10 text-primary font-semibold',
          size === 'sm' ? 'w-4 h-4 text-[9px]' : size === 'lg' ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'
        )}
      >
        {index + 1}
      </span>

      {/* Favicon */}
      {showFavicons && (
        <Favicon url={source.url} favicon={source.favicon} size={size} />
      )}

      {/* Title/Domain */}
      <span className={cn(sizeConfig.title, 'truncate max-w-[120px] text-foreground')}>
        {source.title || domain}
      </span>

      {/* Confidence badge */}
      {showConfidence && source.confidence !== undefined && (
        <ConfidenceBadge confidence={source.confidence} size={size} />
      )}

      {/* External link indicator */}
      <ExternalLinkIcon
        size={sizeConfig.iconSize - 2}
        className="flex-shrink-0 text-muted-foreground"
      />

      {/* Hover tooltip with snippet */}
      <AnimatePresence>
        {expandOnHover && isHovered && source.snippet && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: durations.fast }}
            className={cn(
              'absolute z-50 top-full left-0 mt-1.5 p-2.5 rounded-lg',
              'bg-popover border border-border shadow-lg',
              'max-w-xs w-max'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-muted-foreground line-clamp-3">
              {source.snippet}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  )
}

// =============================================================================
// CARD SOURCE ITEM
// =============================================================================

interface CardSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  showDomain: boolean
  showDate: boolean
  showAuthor: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

const CardSourceItem: React.FC<CardSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  showDomain,
  showDate,
  showAuthor,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)
  const hasDetails = source.snippet && source.snippet.length > 100

  const handleClick = (e: React.MouseEvent) => {
    onClick?.()
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.fast,
      }}
      className={cn(
        'group relative rounded-lg border border-border/60 bg-card',
        'hover:border-primary/40 hover:shadow-sm transition-all duration-150',
        'focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-1',
        sizeConfig.padding,
        className
      )}
      onClick={handleClick}
      role="article"
      aria-label={`Source ${index + 1}: ${source.title}`}
    >
      {/* Header */}
      <div className={cn('flex items-start', sizeConfig.gap)}>
        {/* Citation number */}
        <span
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            'bg-primary/10 text-primary font-semibold',
            size === 'sm' ? 'w-5 h-5 text-[10px]' : size === 'lg' ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'
          )}
        >
          {index + 1}
        </span>

        {/* Favicon */}
        {showFavicons && (
          <Favicon url={source.url} favicon={source.favicon} size={size} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={source.url}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              onClick={handleLinkClick}
              className={cn(
                sizeConfig.title,
                'text-foreground hover:text-primary truncate',
                'focus:outline-none focus-visible:underline'
              )}
            >
              {source.title}
            </a>

            {showConfidence && source.confidence !== undefined && (
              <ConfidenceBadge confidence={source.confidence} size={size} />
            )}
          </div>

          {/* Meta row */}
          <div className={cn('flex items-center gap-2 mt-0.5', sizeConfig.snippet, 'text-muted-foreground')}>
            {showDomain && <span>{domain}</span>}
            {showDomain && (showDate || showAuthor) && <span aria-hidden="true">-</span>}
            {showDate && source.date && <span>{formatDate(source.date)}</span>}
            {showDate && source.date && showAuthor && source.author && (
              <span aria-hidden="true">-</span>
            )}
            {showAuthor && source.author && <span>{source.author}</span>}
          </div>
        </div>

        {/* External link */}
        <a
          href={source.url}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={handleLinkClick}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-md',
            'text-muted-foreground hover:text-primary hover:bg-primary/10',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label={`Open ${source.title} in ${openInNewTab ? 'new tab' : 'current tab'}`}
        >
          <ExternalLinkIcon size={sizeConfig.iconSize} />
        </a>
      </div>

      {/* Snippet */}
      {source.snippet && (
        <div className="mt-2">
          <p className={cn(sizeConfig.snippet, 'text-muted-foreground', !isExpanded && 'line-clamp-2')}>
            {source.snippet}
          </p>

          {hasDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className={cn(
                'mt-1 text-primary hover:text-primary/80',
                'text-xs font-medium focus:outline-none focus-visible:underline'
              )}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Metadata */}
      {source.metadata && Object.keys(source.metadata).length > 0 && isExpanded && (
        <div className="mt-3 pt-2 border-t border-border/40">
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            {Object.entries(source.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5">
                <dt className="text-[10px] text-muted-foreground">{key}:</dt>
                <dd className="text-[10px] font-medium text-foreground">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </motion.div>
  )
}

// =============================================================================
// LIST SOURCE ITEM
// =============================================================================

interface ListSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  showDomain: boolean
  expandOnHover: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

const ListSourceItem: React.FC<ListSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  showDomain,
  expandOnHover,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)

  return (
    <motion.li
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.fast,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.faster,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex items-start py-2 border-b border-border/40 last:border-b-0',
        'hover:bg-muted/30 transition-colors -mx-2 px-2 rounded-md',
        sizeConfig.gap,
        className
      )}
      role="listitem"
    >
      {/* Citation number */}
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-full',
          'bg-primary/10 text-primary font-semibold mt-0.5',
          size === 'sm' ? 'w-4 h-4 text-[9px]' : size === 'lg' ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'
        )}
      >
        {index + 1}
      </span>

      {/* Favicon */}
      {showFavicons && (
        <Favicon
          url={source.url}
          favicon={source.favicon}
          size={size}
          className="mt-0.5"
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={source.url}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={() => onClick?.()}
            className={cn(
              sizeConfig.title,
              'text-foreground hover:text-primary truncate',
              'focus:outline-none focus-visible:underline'
            )}
          >
            {source.title}
          </a>

          {showDomain && (
            <span className={cn(sizeConfig.snippet, 'text-muted-foreground')}>
              ({domain})
            </span>
          )}

          {showConfidence && source.confidence !== undefined && (
            <ConfidenceBadge confidence={source.confidence} size={size} />
          )}
        </div>

        {/* Snippet preview */}
        <AnimatePresence>
          {(expandOnHover ? isHovered : true) && source.snippet && (
            <motion.p
              initial={expandOnHover ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: durations.fast }}
              className={cn(
                sizeConfig.snippet,
                'text-muted-foreground mt-0.5 line-clamp-2'
              )}
            >
              {source.snippet}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* External link */}
      <a
        href={source.url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={cn(
          'flex-shrink-0 p-1 rounded-md mt-0.5',
          'text-muted-foreground hover:text-primary',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-label={`Open ${source.title}`}
      >
        <ExternalLinkIcon size={sizeConfig.iconSize - 2} />
      </a>
    </motion.li>
  )
}

// =============================================================================
// SKELETON LOADER
// =============================================================================

interface SourceCitationSkeletonProps {
  variant: SourceCitationVariant
  count?: number
}

const SourceCitationSkeleton: React.FC<SourceCitationSkeletonProps> = ({
  variant,
  count = 3,
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2" role="status" aria-label="Loading sources">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/40 animate-pulse"
          >
            <div className="w-5 h-5 rounded-full bg-muted/60" />
            <div className="w-16 h-3 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-3" role="status" aria-label="Loading sources">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/40 bg-muted/20 animate-pulse">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-muted/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/60 rounded w-2/3" />
                <div className="h-3 bg-muted/40 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-3 bg-muted/40 rounded" />
              <div className="h-3 bg-muted/40 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // List variant
  return (
    <div className="space-y-2" role="status" aria-label="Loading sources">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-2 py-2 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-muted/60" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-muted/60 rounded w-1/2" />
            <div className="h-3 bg-muted/40 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

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

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook for managing source citation state
 */
export interface UseSourceCitationOptions {
  /** Initial sources */
  initialSources?: Source[]
  /** Maximum sources to keep in state */
  maxSources?: number
}

export interface UseSourceCitationReturn {
  /** Current sources */
  sources: Source[]
  /** Add a source */
  addSource: (source: Source) => void
  /** Add multiple sources */
  addSources: (sources: Source[]) => void
  /** Remove a source by URL */
  removeSource: (url: string) => void
  /** Clear all sources */
  clearSources: () => void
  /** Set all sources (replace) */
  setSources: (sources: Source[]) => void
  /** Update a source by URL */
  updateSource: (url: string, updates: Partial<Omit<Source, 'url'>>) => void
  /** Get source by URL */
  getSource: (url: string) => Source | undefined
  /** Check if a source exists */
  hasSource: (url: string) => boolean
  /** Get sources sorted by confidence */
  sortedByConfidence: Source[]
  /** Get unique domains */
  domains: string[]
}

export function useSourceCitation({
  initialSources = [],
  maxSources,
}: UseSourceCitationOptions = {}): UseSourceCitationReturn {
  const [sources, setSources] = React.useState<Source[]>(initialSources)

  const addSource = React.useCallback(
    (source: Source) => {
      setSources((prev) => {
        const exists = prev.some((s) => s.url === source.url)
        if (exists) return prev
        const newSources = [...prev, source]
        if (maxSources && newSources.length > maxSources) {
          return newSources.slice(-maxSources)
        }
        return newSources
      })
    },
    [maxSources]
  )

  const addSources = React.useCallback(
    (newSources: Source[]) => {
      setSources((prev) => {
        const urlSet = new Set(prev.map((s) => s.url))
        const uniqueNew = newSources.filter((s) => !urlSet.has(s.url))
        const combined = [...prev, ...uniqueNew]
        if (maxSources && combined.length > maxSources) {
          return combined.slice(-maxSources)
        }
        return combined
      })
    },
    [maxSources]
  )

  const removeSource = React.useCallback((url: string) => {
    setSources((prev) => prev.filter((s) => s.url !== url))
  }, [])

  const clearSources = React.useCallback(() => {
    setSources([])
  }, [])

  const updateSource = React.useCallback(
    (url: string, updates: Partial<Omit<Source, 'url'>>) => {
      setSources((prev) =>
        prev.map((s) => (s.url === url ? { ...s, ...updates } : s))
      )
    },
    []
  )

  const getSource = React.useCallback(
    (url: string) => sources.find((s) => s.url === url),
    [sources]
  )

  const hasSource = React.useCallback(
    (url: string) => sources.some((s) => s.url === url),
    [sources]
  )

  const sortedByConfidence = React.useMemo(
    () =>
      [...sources].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)),
    [sources]
  )

  const domains = React.useMemo(() => {
    const domainSet = new Set(sources.map((s) => s.domain || extractDomain(s.url)))
    return Array.from(domainSet)
  }, [sources])

  return {
    sources,
    addSource,
    addSources,
    removeSource,
    clearSources,
    setSources,
    updateSource,
    getSource,
    hasSource,
    sortedByConfidence,
    domains,
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export type {
  Source as SourceCitationSource,
}
