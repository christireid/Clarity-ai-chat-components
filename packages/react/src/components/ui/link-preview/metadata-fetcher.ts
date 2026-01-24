/**
 * Metadata fetching utilities for link previews
 */

import type { LinkMetadata, MetadataFetcherConfig } from './types'
import { isValidUrl, getDomain } from './url-utils'
import { detectEmbedDetails } from './embed-detection'

/**
 * Default metadata fetcher that calls a backend API endpoint
 * The backend should handle CORS and return Open Graph / Twitter Card metadata
 */
export function createMetadataFetcher(config: MetadataFetcherConfig) {
  return async function fetchMetadata(url: string): Promise<LinkMetadata> {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL')
    }

    const endpoint = config.apiEndpoint ?? config.endpoint
    if (!endpoint) {
      throw new Error('Missing apiEndpoint')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    const timeoutMs = config.timeout ?? 10000
    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort()
        reject(new Error('Request timed out'))
      }, timeoutMs)
    })

    const fetchPromise = fetch(`${endpoint}?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    const response = await Promise.race([fetchPromise, timeoutPromise]).finally(
      () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`)
    }

    const data = await response.json()

    // Detect embed type
    const { type: embedType, id: embedId } = detectEmbedDetails(url)

    return {
      url,
      title: data.title || data.og_title,
      description: data.description || data.og_description,
      image: data.image || data.og_image,
      siteName: data.site_name || data.og_site_name,
      favicon: data.favicon,
      type: data.type || 'website',
      embedType: embedType ?? undefined,
      embedId: embedId ?? undefined,
    }
  }
}

/**
 * Fallback metadata extractor for demo/development
 * Uses URL parsing to provide basic metadata
 */
export function createFallbackMetadata(url: string): LinkMetadata {
  if (!isValidUrl(url)) {
    return { url, title: url }
  }

  const { type: embedType, id: embedId } = detectEmbedDetails(url)
  const domain = getDomain(url)

  // Generate reasonable fallback data based on URL
  const siteName = domain.split('.')[0]
  const capitalizedSiteName =
    siteName.charAt(0).toUpperCase() + siteName.slice(1)

  return {
    url,
    title: domain,
    siteName: capitalizedSiteName,
    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    type: 'website',
    embedType: embedType ?? undefined,
    embedId: embedId ?? undefined,
  }
}
