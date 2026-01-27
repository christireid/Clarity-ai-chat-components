'use client'

import * as React from 'react'
import type { SmartLinkPreviewProps } from './types'
import { isValidUrl, sanitizeUrl } from './url-utils'
import { useLinkPreview } from './use-link-preview'
import { LinkPreview } from './LinkPreview'
import { LinkPreviewError } from './error'

export function SmartLinkPreview({
  url,
  variant = 'card',
  onClick,
  onRemove,
  onLoad,
  onError,
  showImage = true,
  showFavicon = true,
  showDomain = true,
  showDescription = true,
  expandableDescription = false,
  fallback,
  className,
  fetchFn,
  apiEndpoint,
}: SmartLinkPreviewProps) {
  const { metadata, loading, error, fetchMetadata } = useLinkPreview({
    fetchFn,
    apiEndpoint,
  })

  // Validate URL immediately
  const isValid = isValidUrl(url)

  // Fetch metadata on mount
  React.useEffect(() => {
    if (!isValid) {
      onError?.(new Error('Invalid or unsafe URL'))
      return
    }

    fetchMetadata(url)
      .then((data) => onLoad?.(data))
      .catch((err) =>
        onError?.(err instanceof Error ? err : new Error(String(err)))
      )
  }, [url, fetchMetadata, onLoad, onError, isValid])

  // Invalid URL state
  if (!isValid) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <LinkPreviewError
        url={url}
        error="Invalid or unsafe URL"
        className={className}
      />
    )
  }

  // Error state
  if (error && !loading) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <LinkPreviewError
        url={url}
        error={error}
        onRetry={() => fetchMetadata(url)}
        className={className}
      />
    )
  }

  // Loading or success state
  return (
    <LinkPreview
      metadata={metadata || { url }}
      variant={variant}
      onClick={
        onClick ||
        (() =>
          window.open(sanitizeUrl(url) || url, '_blank', 'noopener,noreferrer'))
      }
      onRemove={onRemove}
      loading={loading}
      showImage={showImage}
      showFavicon={showFavicon}
      showDomain={showDomain}
      showDescription={showDescription}
      expandableDescription={expandableDescription}
      className={className}
    />
  )
}

SmartLinkPreview.displayName = 'SmartLinkPreview'
