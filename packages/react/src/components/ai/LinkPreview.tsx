'use client'

/**
 * LinkPreview Component
 *
 * A component for displaying rich link previews with metadata extraction.
 * Shows URL previews with favicons, titles, descriptions, and images.
 *
 * Features:
 * - Multiple variants (card, inline, compact, minimal)
 * - Favicon display with fallback
 * - Image preview support
 * - Loading and error states
 * - Hover effects and animations
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LinkPreview
 *   url="https://example.com/article"
 *   title="Article Title"
 *   description="A brief description..."
 * />
 *
 * // With image
 * <LinkPreview
 *   url="https://example.com"
 *   title="Website"
 *   image="https://example.com/og-image.jpg"
 *   variant="card"
 * />
 *
 * // Compact inline
 * <LinkPreview url="https://github.com" variant="inline" />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type LinkPreviewVariant = 'card' | 'inline' | 'compact' | 'minimal'
export type LinkPreviewSize = 'sm' | 'md' | 'lg'

export interface LinkPreviewData {
  /** URL to preview */
  url: string
  /** Page title */
  title?: string
  /** Page description */
  description?: string
  /** Preview image URL */
  image?: string
  /** Favicon URL */
  favicon?: string
  /** Site name */
  siteName?: string
  /** Content type (article, video, etc.) */
  type?: 'article' | 'video' | 'image' | 'website' | 'profile'
  /** Author name */
  author?: string
  /** Published date */
  publishedAt?: Date | string
}

export interface LinkPreviewProps extends LinkPreviewData {
  /** Visual variant */
  variant?: LinkPreviewVariant
  /** Size preset */
  size?: LinkPreviewSize
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: string
  /** Whether to show image */
  showImage?: boolean
  /** Whether link opens in new tab */
  openInNewTab?: boolean
  /** Custom click handler */
  onClick?: (url: string) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Components
// ============================================================================

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ============================================================================
// LinkPreview Component
// ============================================================================

export function LinkPreview({
  url,
  title,
  description,
  image,
  favicon,
  siteName,
  type,
  author,
  publishedAt,
  variant = 'card',
  size = 'md',
  isLoading = false,
  error,
  showImage = true,
  openInNewTab = true,
  onClick,
  className,
}: LinkPreviewProps) {
  const prefersReducedMotion = useReducedMotion()
  const [imageError, setImageError] = React.useState(false)
  const [faviconError, setFaviconError] = React.useState(false)

  const displayFavicon = favicon || getFaviconUrl(url)
  const displayTitle = title || getDomain(url)
  const domain = getDomain(url)

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick(url)
    }
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const cardSizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          'link-preview link-preview-loading',
          variant === 'card' && 'link-preview-card',
          variant === 'inline' && 'link-preview-inline',
          variant === 'compact' && 'link-preview-compact',
          cardSizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading link preview"
      >
        <div className="link-preview-skeleton">
          {variant === 'card' && showImage && (
            <div className="link-preview-skeleton-image" />
          )}
          <div className="link-preview-skeleton-content">
            <div className="link-preview-skeleton-title" />
            {variant !== 'minimal' && (
              <div className="link-preview-skeleton-description" />
            )}
            <div className="link-preview-skeleton-domain" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          'link-preview link-preview-error',
          sizeClasses[size],
          className
        )}
        role="alert"
      >
        <span className="link-preview-error-icon">⚠️</span>
        <span className="link-preview-error-text">{error}</span>
      </div>
    )
  }

  const content = (
    <>
      {/* Image (card variant only) */}
      {variant === 'card' && showImage && image && !imageError && (
        <motion.div
          className="link-preview-image-container"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION_SECONDS.fast }}
        >
          <img
            src={image}
            alt=""
            className="link-preview-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {type && (
            <span className="link-preview-type-badge">
              {type === 'video' && '▶'}
              {type === 'article' && '📄'}
              {type === 'image' && '🖼'}
            </span>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="link-preview-content">
        {/* Header with favicon and domain */}
        <div className="link-preview-header">
          {!faviconError && displayFavicon && (
            <img
              src={displayFavicon}
              alt=""
              className="link-preview-favicon"
              width={16}
              height={16}
              onError={() => setFaviconError(true)}
            />
          )}
          <span className="link-preview-domain">
            {siteName || domain}
          </span>
          {author && variant === 'card' && (
            <span className="link-preview-author">• {author}</span>
          )}
        </div>

        {/* Title */}
        <h4 className="link-preview-title">{displayTitle}</h4>

        {/* Description (not for minimal/compact) */}
        {description && variant !== 'minimal' && variant !== 'compact' && (
          <p className="link-preview-description">{description}</p>
        )}

        {/* Metadata footer */}
        {publishedAt && variant === 'card' && (
          <div className="link-preview-meta">
            <time dateTime={new Date(publishedAt).toISOString()}>
              {formatDate(publishedAt)}
            </time>
          </div>
        )}
      </div>
    </>
  )

  return (
    <motion.a
      href={url}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={cn(
        'link-preview',
        `link-preview-${variant}`,
        sizeClasses[size],
        variant === 'card' && cardSizeClasses[size],
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.01,
              transition: { duration: DURATION_SECONDS.fast },
            }
      }
      aria-label={`Preview: ${displayTitle}`}
    >
      {content}
    </motion.a>
  )
}

// ============================================================================
// LinkPreviewList Component
// ============================================================================

export interface LinkPreviewListProps {
  /** Array of links to preview */
  links: LinkPreviewData[]
  /** Visual variant for all items */
  variant?: LinkPreviewVariant
  /** Size preset for all items */
  size?: LinkPreviewSize
  /** Maximum items to show */
  maxItems?: number
  /** Layout direction */
  layout?: 'horizontal' | 'vertical' | 'grid'
  /** Loading state */
  isLoading?: boolean
  /** Click handler */
  onLinkClick?: (url: string) => void
  /** Additional class names */
  className?: string
}

export function LinkPreviewList({
  links,
  variant = 'compact',
  size = 'md',
  maxItems,
  layout = 'vertical',
  isLoading = false,
  onLinkClick,
  className,
}: LinkPreviewListProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayLinks = maxItems ? links.slice(0, maxItems) : links
  const hiddenCount = maxItems && links.length > maxItems ? links.length - maxItems : 0

  return (
    <div
      className={cn(
        'link-preview-list',
        `link-preview-list-${layout}`,
        className
      )}
      role="list"
      aria-label="Link previews"
    >
      <AnimatePresence mode="popLayout">
        {displayLinks.map((link, index) => (
          <motion.div
            key={link.url}
            role="listitem"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
            transition={{
              duration: DURATION_SECONDS.normal,
              delay: prefersReducedMotion ? 0 : index * 0.05,
              ease: EASING_FRAMER.standard,
            }}
          >
            <LinkPreview
              {...link}
              variant={variant}
              size={size}
              isLoading={isLoading}
              onClick={onLinkClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {hiddenCount > 0 && (
        <div className="link-preview-list-more">
          +{hiddenCount} more link{hiddenCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// useLinkPreview Hook
// ============================================================================

export interface UseLinkPreviewOptions {
  /** Initial URL to preview */
  url?: string
  /** Auto-fetch metadata */
  autoFetch?: boolean
  /** Fetch function for metadata */
  fetchMetadata?: (url: string) => Promise<LinkPreviewData>
}

export interface UseLinkPreviewReturn {
  /** Current preview data */
  data: LinkPreviewData | null
  /** Loading state */
  isLoading: boolean
  /** Error message */
  error: string | null
  /** Fetch metadata for URL */
  fetch: (url: string) => Promise<void>
  /** Clear current preview */
  clear: () => void
  /** Set preview data manually */
  setData: (data: LinkPreviewData) => void
}

export function useLinkPreview(
  options: UseLinkPreviewOptions = {}
): UseLinkPreviewReturn {
  const { url: initialUrl, autoFetch = false, fetchMetadata } = options

  const [data, setData] = React.useState<LinkPreviewData | null>(
    initialUrl ? { url: initialUrl } : null
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetch = React.useCallback(
    async (url: string) => {
      if (!fetchMetadata) {
        setData({ url })
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const metadata = await fetchMetadata(url)
        setData(metadata)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch preview')
        setData({ url })
      } finally {
        setIsLoading(false)
      }
    },
    [fetchMetadata]
  )

  const clear = React.useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  // Auto-fetch on mount
  React.useEffect(() => {
    if (autoFetch && initialUrl && fetchMetadata) {
      fetch(initialUrl)
    }
  }, [autoFetch, initialUrl, fetchMetadata, fetch])

  return {
    data,
    isLoading,
    error,
    fetch,
    clear,
    setData,
  }
}

export default LinkPreview
