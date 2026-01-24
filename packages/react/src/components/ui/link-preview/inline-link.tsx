'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { duration } from '../../../animations/constants'
import type { InlineLinkProps } from './types'
import { isValidUrl, sanitizeUrl } from './url-utils'
import { useLinkPreview } from './use-link-preview'
import { LinkPreviewSkeleton } from './skeleton'
import { LinkPreview } from './link-preview'

export function InlineLink({
  url,
  onPreview,
  children,
  className,
  showHoverPreview = true,
}: InlineLinkProps) {
  const [showPreview, setShowPreview] = React.useState(false)
  const { metadata, loading, error, fetchMetadata } = useLinkPreview()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const isValid = isValidUrl(url)

  const handleMouseEnter = () => {
    if (!showHoverPreview || !isValid) return

    // Debounce the preview fetch
    timeoutRef.current = setTimeout(() => {
      if (!metadata && !loading && !error) {
        fetchMetadata(url)
      }
      setShowPreview(true)
    }, 300)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowPreview(false)
  }

  const handleFocus = () => {
    if (showHoverPreview && isValid && !metadata && !loading && !error) {
      fetchMetadata(url)
    }
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // For invalid URLs, show a warning style
  if (!isValid) {
    return (
      <span
        className={cn('text-destructive/70 cursor-not-allowed', className)}
        title="Invalid URL"
      >
        {children || url}
      </span>
    )
  }

  return (
    <span className="relative inline-block">
      <a
        href={sanitizeUrl(url) || 'about:blank'}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'text-primary hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onClick={(e) => {
          if (onPreview) {
            e.preventDefault()
            onPreview(url)
          }
        }}
        aria-describedby={
          showPreview && metadata
            ? `preview-${url.replace(/[^a-z0-9]/gi, '-')}`
            : undefined
        }
      >
        {children || url}
      </a>

      {/* Hover Preview */}
      {showHoverPreview && (
        <AnimatePresence>
          {showPreview && (metadata || loading) && (
            <motion.div
              id={`preview-${url.replace(/[^a-z0-9]/gi, '-')}`}
              role="tooltip"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              transition={{ duration: duration('fast') }}
              className="absolute bottom-full left-0 mb-2 w-80 z-50"
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={handleMouseLeave}
            >
              {loading ? (
                <LinkPreviewSkeleton variant="card" />
              ) : metadata ? (
                <LinkPreview
                  metadata={metadata}
                  onClick={() =>
                    window.open(
                      sanitizeUrl(url) || url,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </span>
  )
}

InlineLink.displayName = 'InlineLink'
