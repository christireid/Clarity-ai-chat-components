'use client'

import * as React from 'react'
import { Card, cn } from '@clarity-chat/primitives'
import type { LinkPreviewErrorProps } from './types'
import { getDomain, isValidUrl } from './url-utils'

export function LinkPreviewError({
  url,
  error,
  onRetry,
  className,
}: LinkPreviewErrorProps) {
  const domain = getDomain(url)
  const isInvalidUrl = !isValidUrl(url)

  return (
    <Card
      className={cn(
        'p-4 border-destructive/20 bg-destructive/5 shadow-sm',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded bg-destructive/10 flex items-center justify-center text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {isInvalidUrl ? 'Invalid URL' : 'Failed to load preview'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {domain}
          </p>
          {error && <p className="text-xs text-destructive/80 mt-1">{error}</p>}
        </div>
        {onRetry && !isInvalidUrl && (
          <button
            onClick={onRetry}
            className="flex-shrink-0 text-xs text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label="Retry loading preview"
          >
            Retry
          </button>
        )}
      </div>
    </Card>
  )
}

LinkPreviewError.displayName = 'LinkPreviewError'
