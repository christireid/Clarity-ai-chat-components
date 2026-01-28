'use client'

/**
 * Source Component
 *
 * A citation/reference component for displaying sources in AI-generated content.
 * Provides inline source pills that expand on hover to show full citation details.
 *
 * Features:
 * - Inline citation pills with hover expansion
 * - Multiple variants (pill, inline, card)
 * - Confidence score display
 * - Clickable links to source URLs
 * - Grouped source lists
 * - Accessible with keyboard navigation
 * - Smooth animations with reduced motion support
 *
 * @example
 * ```tsx
 * // Inline citation pill
 * <Source
 *   title="OpenAI Documentation"
 *   url="https://platform.openai.com/docs"
 *   index={1}
 * />
 *
 * // With quote excerpt
 * <Source
 *   title="Research Paper"
 *   url="https://arxiv.org/..."
 *   quote="Large language models demonstrate..."
 *   confidence={0.92}
 * />
 *
 * // Card variant for source lists
 * <Source
 *   variant="card"
 *   title="API Documentation"
 *   description="Official REST API reference"
 *   url="https://docs.example.com"
 *   favicon="https://example.com/favicon.ico"
 * />
 *
 * // Source list
 * <SourceList
 *   sources={[
 *     { title: "Source 1", url: "..." },
 *     { title: "Source 2", url: "..." },
 *   ]}
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Source variant
 */
export type SourceVariant = 'pill' | 'inline' | 'card' | 'minimal'

/**
 * Source data structure
 */
export interface SourceData {
  /** Unique identifier */
  id?: string
  /** Source title */
  title: string
  /** Source URL */
  url?: string
  /** Description or summary */
  description?: string
  /** Quoted excerpt from the source */
  quote?: string
  /** Confidence score (0-1) */
  confidence?: number
  /** Favicon URL */
  favicon?: string
  /** Source type (e.g., 'web', 'document', 'api') */
  type?: 'web' | 'document' | 'api' | 'database' | 'file' | 'unknown'
  /** Publication date */
  date?: Date | string
  /** Author name */
  author?: string
}

/**
 * Props for Source component
 */
export interface SourceProps extends SourceData {
  /** Display variant */
  variant?: SourceVariant
  /** Citation index number */
  index?: number
  /** Show confidence score */
  showConfidence?: boolean
  /** Show quote on hover/expand */
  showQuote?: boolean
  /** Additional CSS class */
  className?: string
  /** Click handler */
  onClick?: () => void
  /** Disable animations */
  disableAnimations?: boolean
  /** Open link in new tab */
  openInNewTab?: boolean
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Confidence level colors
 */
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return 'text-success'
  if (confidence >= 0.7) return 'text-info'
  if (confidence >= 0.5) return 'text-warning'
  return 'text-muted-foreground'
}

/**
 * Source type icons
 */
const SOURCE_TYPE_ICONS: Record<string, React.ReactNode> = {
  web: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  unknown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Format date
 */
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * External link icon
 */
const ExternalLinkIcon = React.memo(function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
})

ExternalLinkIcon.displayName = 'ExternalLinkIcon'

/**
 * Favicon with fallback
 */
interface FaviconProps {
  src?: string
  type?: string
  alt: string
  className?: string
}

const Favicon = React.memo(function Favicon({ src, type = 'unknown', alt, className }: FaviconProps) {
  const [error, setError] = React.useState(false)

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-contain rounded', className)}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <span className={cn('text-muted-foreground', className)}>
      {SOURCE_TYPE_ICONS[type] || SOURCE_TYPE_ICONS.unknown}
    </span>
  )
})

Favicon.displayName = 'Favicon'

/**
 * Hover card for detailed source info
 */
interface SourceHoverCardProps {
  source: SourceData
  showQuote?: boolean
  showConfidence?: boolean
  openInNewTab?: boolean
}

const SourceHoverCard = React.memo(function SourceHoverCard({
  source,
  showQuote = true,
  showConfidence = true,
  openInNewTab = true,
}: SourceHoverCardProps) {
  return (
    <div className="source-hover-card">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-muted/50 flex items-center justify-center p-1.5">
          <Favicon src={source.favicon} type={source.type} alt={source.title} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground truncate">
            {source.title}
          </h4>
          {source.url && (
            <p className="text-xs text-muted-foreground truncate">
              {extractDomain(source.url)}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {source.description && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {source.description}
        </p>
      )}

      {/* Quote */}
      {showQuote && source.quote && (
        <blockquote className="mt-2 pl-3 border-l-2 border-primary/30 text-xs text-muted-foreground italic line-clamp-3">
          "{source.quote}"
        </blockquote>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          {source.author && <span>{source.author}</span>}
          {source.date && <span>{formatDate(source.date)}</span>}
        </div>
        {showConfidence && source.confidence !== undefined && (
          <span className={cn('font-medium tabular-nums', getConfidenceColor(source.confidence))}>
            {Math.round(source.confidence * 100)}% match
          </span>
        )}
      </div>

      {/* Link */}
      {source.url && (
        <a
          href={source.url}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          View source
          <ExternalLinkIcon className="w-3 h-3" />
        </a>
      )}
    </div>
  )
})

SourceHoverCard.displayName = 'SourceHoverCard'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Source - Citation/reference component
 *
 * Displays source citations inline with AI-generated content.
 * Supports multiple variants for different use cases.
 */
export function Source({
  id,
  title,
  url,
  description,
  quote,
  confidence,
  favicon,
  type = 'web',
  date,
  author,
  variant = 'pill',
  index,
  showConfidence = true,
  showQuote = true,
  className,
  onClick,
  disableAnimations = false,
  openInNewTab = true,
}: SourceProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const [isHovered, setIsHovered] = React.useState(false)
  const [showCard, setShowCard] = React.useState(false)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Source data object
  const sourceData: SourceData = {
    id,
    title,
    url,
    description,
    quote,
    confidence,
    favicon,
    type,
    date,
    author,
  }

  // Hover handlers with delay
  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
    hoverTimeoutRef.current = setTimeout(() => {
      setShowCard(true)
    }, 300)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setShowCard(false)
  }, [])

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Render pill variant (inline citation marker)
  if (variant === 'pill') {
    return (
      <span
        className={cn('source-pill relative inline-flex', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.span
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          className={cn(
            'source-pill-inner',
            'inline-flex items-center justify-center',
            'min-w-[1.25rem] h-5 px-1.5 rounded-full',
            'text-xs font-medium tabular-nums',
            'bg-primary/10 text-primary',
            'hover:bg-primary/20 cursor-pointer',
            'transition-colors duration-150'
          )}
          onClick={onClick || (url ? () => window.open(url, openInNewTab ? '_blank' : '_self') : undefined)}
          role="button"
          tabIndex={0}
          aria-label={`Source ${index ?? ''}: ${title}`}
        >
          {index ?? '•'}
        </motion.span>

        {/* Hover card */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.95 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.95 }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
                ease: EASING_FRAMER.out,
              }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
            >
              <SourceHoverCard
                source={sourceData}
                showQuote={showQuote}
                showConfidence={showConfidence}
                openInNewTab={openInNewTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    )
  }

  // Render inline variant (text-based citation)
  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'source-inline',
          'inline-flex items-center gap-1',
          'text-sm text-muted-foreground',
          'hover:text-foreground cursor-pointer',
          'transition-colors duration-150',
          className
        )}
        onClick={onClick || (url ? () => window.open(url, openInNewTab ? '_blank' : '_self') : undefined)}
        role="button"
        tabIndex={0}
        aria-label={`Source: ${title}`}
      >
        <span className="w-3.5 h-3.5">
          <Favicon src={favicon} type={type} alt={title} />
        </span>
        <span className="underline underline-offset-2 decoration-muted-foreground/50">
          {title}
        </span>
        {url && <ExternalLinkIcon className="w-3 h-3 opacity-50" />}
      </span>
    )
  }

  // Render minimal variant
  if (variant === 'minimal') {
    return (
      <a
        href={url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={cn(
          'source-minimal',
          'text-xs text-primary hover:underline',
          className
        )}
        aria-label={`Source: ${title}`}
      >
        [{index ?? title}]
      </a>
    )
  }

  // Render card variant
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn('source-card', className)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="source-card-icon">
          <Favicon src={favicon} type={type} alt={title} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="source-card-title">{title}</h4>
            {showConfidence && confidence !== undefined && (
              <span className={cn(
                'text-xs font-medium tabular-nums px-1.5 py-0.5 rounded-full',
                'bg-current/10',
                getConfidenceColor(confidence)
              )}>
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
          {url && (
            <p className="source-card-url">{extractDomain(url)}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="source-card-description">{description}</p>
      )}

      {/* Quote */}
      {showQuote && quote && (
        <blockquote className="source-card-quote">
          "{quote}"
        </blockquote>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {author && <span>{author}</span>}
          {date && <span>{formatDate(date)}</span>}
        </div>
        {url && (
          <a
            href={url}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className="source-card-link"
            onClick={(e) => e.stopPropagation()}
          >
            Open
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

Source.displayName = 'Source'

// =============================================================================
// SOURCE LIST COMPONENT
// =============================================================================

/**
 * Props for SourceList
 */
export interface SourceListProps {
  /** Sources to display */
  sources: SourceData[]
  /** Display variant */
  variant?: 'cards' | 'compact' | 'inline'
  /** Title for the section */
  title?: string
  /** Show confidence scores */
  showConfidence?: boolean
  /** Maximum sources to show (0 = all) */
  maxSources?: number
  /** Additional CSS class */
  className?: string
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg'
}

const GAP_CLASSES = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

/**
 * SourceList - Display multiple sources
 */
export function SourceList({
  sources,
  variant = 'cards',
  title = 'Sources',
  showConfidence = true,
  maxSources = 0,
  className,
  gap = 'md',
}: SourceListProps) {
  const displaySources = maxSources > 0 ? sources.slice(0, maxSources) : sources
  const hasMore = maxSources > 0 && sources.length > maxSources

  if (sources.length === 0) return null

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        <span className="text-xs text-muted-foreground">{title}:</span>
        {displaySources.map((source, index) => (
          <Source
            key={source.id || index}
            {...source}
            variant="inline"
            index={index + 1}
          />
        ))}
        {hasMore && (
          <span className="text-xs text-muted-foreground">
            +{sources.length - maxSources} more
          </span>
        )}
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          {title}
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {sources.length}
          </span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {displaySources.map((source, index) => (
            <Source
              key={source.id || index}
              {...source}
              variant="pill"
              index={index + 1}
              showConfidence={showConfidence}
            />
          ))}
          {hasMore && (
            <span className="inline-flex items-center px-2 h-5 text-xs text-muted-foreground">
              +{sources.length - maxSources}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Cards variant (default)
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
        {title}
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          {sources.length}
        </span>
      </h4>
      <div className={cn('grid', GAP_CLASSES[gap])}>
        {displaySources.map((source, index) => (
          <Source
            key={source.id || index}
            {...source}
            variant="card"
            index={index + 1}
            showConfidence={showConfidence}
          />
        ))}
      </div>
      {hasMore && (
        <button className="text-sm text-primary hover:underline">
          Show {sources.length - maxSources} more sources
        </button>
      )}
    </div>
  )
}

SourceList.displayName = 'SourceList'
