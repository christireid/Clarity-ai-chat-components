/**
 * Hook for managing link preview metadata fetching and caching
 */

import * as React from 'react'
import type { UseLinkPreviewOptions, UseLinkPreviewReturn, LinkMetadata } from './types'
import {
  LRUCache,
  type CacheEntry,
  getCachedMetadata,
  setCachedMetadata,
  DEFAULT_CACHE_DURATION,
  DEFAULT_MAX_CACHE_SIZE,
} from './cache'
import { isValidUrl } from './url-utils'
import { detectEmbedDetails } from './embed-detection'
import { createMetadataFetcher, createFallbackMetadata } from './metadata-fetcher'

export function useLinkPreview(
  options: UseLinkPreviewOptions = {}
): UseLinkPreviewReturn {
  const {
    cacheDuration = DEFAULT_CACHE_DURATION,
    maxCacheSize = DEFAULT_MAX_CACHE_SIZE,
    fetchFn,
    apiEndpoint,
    timeout = 10000,
  } = options

  const [loading, setLoading] = React.useState(false)
  const [metadata, setMetadata] = React.useState<LinkMetadata | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const cacheRef = React.useRef<LRUCache<string, CacheEntry> | null>(null)
  if (!cacheRef.current) {
    cacheRef.current = new LRUCache<string, CacheEntry>(maxCacheSize)
  }

  // Track in-flight requests to prevent duplicate fetches
  const pendingRequests = React.useRef<Map<string, Promise<LinkMetadata>>>(
    new Map()
  )

  const fetchMetadata = React.useCallback(
    async (url: string): Promise<LinkMetadata> => {
      // Validate URL first
      if (!isValidUrl(url)) {
        const errorMsg = 'Invalid or unsafe URL'
        setError(errorMsg)
        throw new Error(errorMsg)
      }

      // Check cache first
      const cached = getCachedMetadata(cacheRef.current!, url, cacheDuration)
      if (cached) {
        setMetadata(cached)
        setError(null)
        return cached
      }

      // Check for pending request
      const pending = pendingRequests.current.get(url)
      if (pending) {
        const result = await pending
        setMetadata(result)
        return result
      }

      setLoading(true)
      setError(null)

      const fetchPromise = (async (): Promise<LinkMetadata> => {
        try {
          // Ensure `loading` can be observed before completion (esp. fallback path).
          await Promise.resolve()

          let result: LinkMetadata

          if (fetchFn) {
            // Use custom fetch function
            result = await fetchFn(url)
          } else if (apiEndpoint) {
            // Use provided API endpoint
            const fetcher = createMetadataFetcher({
              apiEndpoint,
              timeout,
            })
            result = await fetcher(url)
          } else {
            // Use fallback metadata (extracts from URL)
            result = createFallbackMetadata(url)
          }

          // Ensure embed detection is done
          if (!result.embedType) {
            const { type, id } = detectEmbedDetails(url)
            result.embedType = type
            result.embedId = id || undefined
          }

          setCachedMetadata(cacheRef.current!, url, result)
          setMetadata(result)
          return result
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Failed to fetch link metadata'
          setError(errorMsg)
          throw err
        } finally {
          setLoading(false)
          pendingRequests.current.delete(url)
        }
      })()

      pendingRequests.current.set(url, fetchPromise)
      return fetchPromise
    },
    [cacheDuration, fetchFn, apiEndpoint, timeout]
  )

  const reset = React.useCallback(() => {
    setMetadata(null)
    setError(null)
    setLoading(false)
  }, [])

  const clearCache = React.useCallback(() => {
    cacheRef.current?.clear()
  }, [])

  return {
    loading,
    metadata,
    error,
    fetchMetadata,
    reset,
    clearCache,
  }
}
