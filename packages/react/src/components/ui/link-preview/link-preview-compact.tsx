'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card, Badge, cn } from '@clarity-chat/primitives'
import { duration, ANIMATION_PRESETS } from '../../../animations/constants'
import type { LinkPreviewCompactProps } from './types'
import { getDomain, isValidUrl } from './url-utils'
import { LinkPreviewError } from './error'

export function LinkPreviewCompact({
  metadata,
  onClick,
  showFavicon = true,
  className,
}: LinkPreviewCompactProps) {
  const [faviconError, setFaviconError] = React.useState(false)
  const domain = getDomain(metadata.url)
  const prefersReducedMotion = useReducedMotion()
  const isValid = isValidUrl(metadata.url)
  const title = metadata.title?.trim() ? metadata.title.trim() : domain
  const subtitle =
    metadata.title?.trim() && metadata.title.trim() !== domain ? domain : null

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick()
    }
  }

  // Show error state for invalid URLs
  if (!isValid) {
    return (
      <LinkPreviewError
        url={metadata.url}
        error="Invalid URL format"
        className={className}
      />
    )
  }

  const content = (
    <Card
      className={cn(
        'p-3 transition-all shadow-sm',
        onClick &&
          'cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'link' : undefined}
      aria-label={onClick ? `Open link: ${title}` : `Link preview: ${title}`}
    >
      <div className="flex items-center gap-3">
        {/* Favicon or placeholder */}
        {showFavicon && (
          <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center">
            {metadata.favicon && !faviconError ? (
              <img
                src={metadata.favicon}
                alt={`${domain} favicon`}
                className="w-5 h-5"
                onError={() => setFaviconError(true)}
                loading="lazy"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              >
                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        {/* Embed type badge */}
        {metadata.embedType &&
          metadata.embedType !== 'default' &&
          metadata.embedType !== 'generic' && (
            <Badge
              variant="secondary"
              className="text-[10px] uppercase flex-shrink-0"
            >
              {metadata.embedType}
            </Badge>
          )}

        {/* Arrow indicator for clickable */}
        {onClick && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-muted-foreground flex-shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </Card>
  )

  if (prefersReducedMotion) {
    return content
  }

  return (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      transition={{ duration: duration('fast') }}
    >
      {content}
    </motion.div>
  )
}

LinkPreviewCompact.displayName = 'LinkPreviewCompact'
