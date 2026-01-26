'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card, Badge, cn } from '@clarity-chat/primitives'
import { duration, ANIMATION_PRESETS } from '../../../animations/constants'
import type { LinkPreviewProps } from './types'
import { getDomain, isValidUrl, sanitizeUrl } from './url-utils'
import { detectEmbedType } from './embed-detection'
import { LinkPreviewSkeleton } from './skeleton'
import { LinkPreviewError } from './error'
import { LinkPreviewCompact } from './LinkPreviewCompact'
import { ExpandableDescription } from './ExpandableDescription'
import { RichEmbed } from './RichEmbed'

export function LinkPreview({
  metadata,
  variant = 'card',
  onClick,
  onRemove,
  loading = false,
  showImage = true,
  showFavicon = true,
  showDomain = true,
  showDescription = true,
  expandableDescription = false,
  fallback,
  className,
  'aria-label': ariaLabel,
}: LinkPreviewProps) {
  const [imageError, setImageError] = React.useState(false)
  const [faviconError, setFaviconError] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion =
    prefersReducedMotion ||
    (typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const domain = getDomain(metadata.url)
  const isValid = isValidUrl(metadata.url)

  // Reset image error when metadata changes
  React.useEffect(() => {
    setImageError(false)
    setFaviconError(false)
  }, [metadata.image, metadata.favicon])

  // Loading state
  if (loading) {
    return <LinkPreviewSkeleton variant={variant} className={className} />
  }

  // URL validation - show error for invalid URLs
  if (!isValid && metadata.url) {
    return (
      <LinkPreviewError
        url={metadata.url}
        error="Invalid or unsafe URL"
        className={className}
      />
    )
  }

  // Fallback for missing required data
  if (!metadata.url && fallback) {
    return <>{fallback}</>
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <LinkPreviewCompact
        metadata={metadata}
        onClick={onClick}
        showFavicon={showFavicon}
        className={className}
      />
    )
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <a
        href={sanitizeUrl(metadata.url) || 'about:blank'}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
          className
        )}
        aria-label={ariaLabel || `Link to ${metadata.title || domain}`}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault()
            onClick()
          }
        }}
      >
        {showFavicon && metadata.favicon && !faviconError && (
          <img
            src={metadata.favicon}
            alt={`${domain} favicon`}
            className="w-4 h-4"
            onError={() => setFaviconError(true)}
            loading="lazy"
          />
        )}
        {metadata.title || domain}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    )
  }

  // Check for rich embed support
  const inferredEmbedType = metadata.embedType ?? detectEmbedType(metadata.url)
  const hasRichEmbed =
    inferredEmbedType === 'youtube' ||
    inferredEmbedType === 'vimeo' ||
    inferredEmbedType === 'spotify'

  // Handle keyboard navigation for card
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick()
    }
  }

  // Card variant (default)
  const cardContent = (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all shadow-sm',
        onClick &&
          'cursor-pointer hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
      onClick={hasRichEmbed ? undefined : onClick}
      onKeyDown={hasRichEmbed ? undefined : handleKeyDown}
      tabIndex={onClick && !hasRichEmbed ? 0 : undefined}
      role={onClick && !hasRichEmbed ? 'link' : undefined}
      aria-label={
        ariaLabel ||
        (onClick
          ? `Open link: ${metadata.title || domain}`
          : `Link preview: ${metadata.title || domain}`)
      }
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Remove link preview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}

      {/* Rich Embed (YouTube, etc.) */}
      {hasRichEmbed && (
        <div className="p-4 pb-0">
          <RichEmbed url={metadata.url} embedType={inferredEmbedType} />
        </div>
      )}

      <div className="flex gap-3.5 p-4">
        {/* Image (only if no rich embed) */}
        {showImage &&
          !hasRichEmbed &&
          (metadata.image && !imageError ? (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
              <img
                src={metadata.image}
                alt={
                  metadata.title
                    ? `Preview image for ${metadata.title}`
                    : 'Link preview image'
                }
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-muted-foreground/70"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ))}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Site Name / Domain */}
          {(showFavicon || showDomain) && (
            <div className="flex items-center gap-2">
              {showFavicon && metadata.favicon && !faviconError && (
                <img
                  src={metadata.favicon}
                  alt={`${domain} favicon`}
                  className="w-4 h-4 flex-shrink-0"
                  onError={() => setFaviconError(true)}
                  loading="lazy"
                />
              )}
              <p className="text-xs text-muted-foreground/90 truncate">
                {metadata.siteName || domain}
              </p>
              {inferredEmbedType &&
                inferredEmbedType !== 'default' &&
                inferredEmbedType !== 'generic' && (
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {inferredEmbedType}
                  </Badge>
                )}
            </div>
          )}

          {/* Title */}
          {metadata.title && (
            <h4 className="font-semibold text-sm line-clamp-2 leading-tight text-foreground">
              {metadata.title}
            </h4>
          )}

          {/* Description */}
          {showDescription &&
            metadata.description &&
            (expandableDescription ? (
              <ExpandableDescription description={metadata.description} />
            ) : (
              <p className="text-xs text-muted-foreground/90 line-clamp-2">
                {metadata.description.length > 160
                  ? metadata.description.slice(0, 160).trim() + '...'
                  : metadata.description}
              </p>
            ))}

          {/* URL Badge */}
          {showDomain && metadata.siteName && metadata.siteName !== domain && (
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-xs max-w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 mr-1 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                </svg>
                <span className="truncate">{domain}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Border Effect */}
      {onClick && !reduceMotion && !hasRichEmbed && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"
          aria-hidden="true"
        />
      )}
    </Card>
  )

  // Wrap with motion if animations are enabled
  if (reduceMotion) {
    return <div className={className}>{cardContent}</div>
  }

  return (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      transition={{ duration: duration('normal') }}
      className={className}
    >
      {cardContent}
    </motion.div>
  )
}

LinkPreview.displayName = 'LinkPreview'
