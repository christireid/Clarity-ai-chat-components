'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Card, Badge, cn } from '@clarity-chat/primitives'
import { duration } from '../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type LinkPreviewVariant = 'card' | 'compact' | 'inline'

export type EmbedType =
  | 'youtube'
  | 'twitter'
  | 'github'
  | 'vimeo'
  | 'spotify'
  | 'generic'
  | 'default'

export interface LinkMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
  type?: 'website' | 'article' | 'video' | 'music' | 'profile'
  /** Detected embed type for rich rendering */
  embedType?: EmbedType
  /** Platform-specific ID (e.g., YouTube video ID) */
  embedId?: string
}

export interface LinkPreviewProps {
  /** The metadata to display */
  metadata: LinkMetadata
  /** Visual variant of the preview */
  variant?: LinkPreviewVariant
  /** Called when the preview is clicked */
  onClick?: () => void
  /** Called when the remove button is clicked */
  onRemove?: () => void
  /** Show loading skeleton */
  loading?: boolean
  /** Show image thumbnail */
  showImage?: boolean
  /** Show favicon */
  showFavicon?: boolean
  /** Show domain badge */
  showDomain?: boolean
  /** Show description text */
  showDescription?: boolean
  /** Allow expanding long descriptions */
  expandableDescription?: boolean
  /** Fallback content when no metadata */
  fallback?: React.ReactNode
  /** Custom className */
  className?: string
  /** Accessible label for the preview */
  'aria-label'?: string
}

export interface LinkPreviewSkeletonProps {
  /** Visual variant */
  variant?: LinkPreviewVariant
  /** Custom className */
  className?: string
}

export interface LinkPreviewErrorProps {
  /** The URL that failed */
  url: string
  /** Error message */
  error?: string
  /** Called when retry is clicked */
  onRetry?: () => void
  /** Custom className */
  className?: string
}

export interface UseLinkPreviewOptions {
  /** Cache duration in milliseconds (default: 5 minutes) */
  cacheDuration?: number
  /** Maximum cache size for LRU eviction (default: 100) */
  maxCacheSize?: number
  /** Custom fetch function for metadata */
  fetchFn?: (url: string) => Promise<LinkMetadata>
  /** API endpoint for metadata fetching (used if no fetchFn provided) */
  apiEndpoint?: string
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number
}

export interface UseLinkPreviewReturn {
  loading: boolean
  metadata: LinkMetadata | null
  error: string | null
  fetchMetadata: (url: string) => Promise<LinkMetadata>
  reset: () => void
  clearCache: () => void
}

/** Configuration for the default metadata fetcher */
export interface MetadataFetcherConfig {
  /** API endpoint that proxies metadata requests */
  endpoint?: string
  /** API endpoint that proxies metadata requests (preferred name) */
  apiEndpoint?: string
  /** Optional API key for authenticated requests */
  apiKey?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Custom headers to include */
  headers?: Record<string, string>
}

// ============================================================================
// URL Validation & Sanitization (Option B)
// ============================================================================

/** Allowed URL protocols for security */
const ALLOWED_PROTOCOLS = ['http:', 'https:']

/** Dangerous URL patterns to block */
const DANGEROUS_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^vbscript:/i,
  /^file:/i,
]

/**
 * Validates if a string is a safe HTTP/HTTPS URL
 * @param urlString - The URL string to validate
 * @returns true if the URL is valid and safe
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') {
    return false
  }

  // Check for dangerous patterns first
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(urlString.trim())) {
      return false
    }
  }

  try {
    const url = new URL(urlString)
    return ALLOWED_PROTOCOLS.includes(url.protocol)
  } catch {
    return false
  }
}

/**
 * Sanitizes a URL by ensuring it's valid and safe
 * @param urlString - The URL to sanitize
 * @returns The sanitized URL or null if invalid
 */
export function sanitizeUrl(urlString: string): string {
  const trimmed = urlString?.trim()
  if (!trimmed || !isValidUrl(trimmed)) {
    // Safe fallback for invalid or unsafe URLs
    return 'about:blank'
  }
  // Preserve the original string to avoid surprising normalization (e.g. adding trailing '/')
  return trimmed
}

/**
 * Extracts domain from a URL safely
 */
function getDomain(url: string): string {
  if (!isValidUrl(url)) {
    return url
  }
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

// ============================================================================
// Rich Embed Detection (Option F - Foundation)
// ============================================================================

interface EmbedPattern {
  type: EmbedType
  patterns: RegExp[]
  extractId: (url: string) => string | null
}

const EMBED_PATTERNS: EmbedPattern[] = [
  {
    type: 'youtube',
    patterns: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ],
    extractId: (url: string) => {
      for (const pattern of EMBED_PATTERNS[0].patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
  },
  {
    type: 'vimeo',
    patterns: [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/],
    extractId: (url: string) => {
      const match = url.match(
        /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
      )
      return match ? match[1] : null
    },
  },
  {
    type: 'twitter',
    patterns: [/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/],
    extractId: (url: string) => {
      const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
      return match ? match[1] : null
    },
  },
  {
    type: 'github',
    patterns: [
      /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/,
      /gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const repoMatch = url.match(
        /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/
      )
      if (repoMatch) return repoMatch[1].replace(/\/$/, '')

      const gistMatch = url.match(
        /gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/
      )
      return gistMatch ? gistMatch[1].replace(/\/$/, '') : null
    },
  },
  {
    type: 'spotify',
    patterns: [
      /open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(
        /open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/
      )
      return match ? `${match[1]}/${match[2]}` : null
    },
  },
]

/**
 * Internal helper: detect embed type + extracted ID from URL.
 */
function detectEmbedDetails(url: string): {
  type: EmbedType
  id: string | null
} {
  if (!isValidUrl(url)) {
    return { type: 'generic', id: null }
  }

  for (const embedPattern of EMBED_PATTERNS) {
    for (const pattern of embedPattern.patterns) {
      if (pattern.test(url)) {
        return {
          type: embedPattern.type,
          id: embedPattern.extractId(url),
        }
      }
    }
  }

  return { type: 'generic', id: null }
}

/**
 * Detects the embed type for a URL.
 */
export function detectEmbedType(url: string): EmbedType {
  return detectEmbedDetails(url).type
}

// ============================================================================
// LRU Cache with Eviction (Option C)
// ============================================================================

interface CacheEntry {
  metadata: LinkMetadata
  timestamp: number
}

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const DEFAULT_MAX_CACHE_SIZE = 100

class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number = DEFAULT_MAX_CACHE_SIZE) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    // Move to end (most recently used)
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    // Delete if exists to update position
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, value)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }
}

function getCachedMetadata(
  cache: LRUCache<string, CacheEntry>,
  url: string,
  cacheDuration: number
): LinkMetadata | null {
  const entry = cache.get(url)
  if (!entry) return null

  const isExpired = Date.now() - entry.timestamp > cacheDuration
  if (isExpired) {
    cache.delete(url)
    return null
  }

  return entry.metadata
}

function setCachedMetadata(
  cache: LRUCache<string, CacheEntry>,
  url: string,
  metadata: LinkMetadata
): void {
  cache.set(url, { metadata, timestamp: Date.now() })
}

// ============================================================================
// Metadata Fetcher (Option A - Real Implementation)
// ============================================================================

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

// ============================================================================
// LinkPreviewSkeleton Component
// ============================================================================

export function LinkPreviewSkeleton({
  variant = 'card',
  className,
}: LinkPreviewSkeletonProps) {
  if (variant === 'compact') {
    return (
      <Card className={cn('p-3 animate-pulse shadow-sm', className)}>
        <span className="sr-only">Loading link preview</span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted/60 rounded flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted/60 rounded w-3/4" />
            <div className="h-3 bg-muted/60 rounded w-1/2" />
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 animate-pulse',
          className
        )}
      >
        <span className="sr-only">Loading link preview</span>
        <span className="w-4 h-4 bg-muted/60 rounded" />
        <span className="h-3.5 bg-muted/60 rounded w-24" />
      </span>
    )
  }

  // Default card variant with shimmer effect
  return (
    <Card className={cn('overflow-hidden shadow-sm', className)}>
      <div className="relative">
        <span className="sr-only">Loading link preview</span>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex gap-3.5 p-4">
          <div className="w-24 h-24 bg-muted/60 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/60 rounded" />
              <div className="h-3 bg-muted/60 rounded w-20" />
            </div>
            <div className="h-4 bg-muted/60 rounded w-3/4" />
            <div className="h-3 bg-muted/60 rounded w-full" />
            <div className="h-3 bg-muted/60 rounded w-2/3" />
          </div>
        </div>
      </div>
    </Card>
  )
}

LinkPreviewSkeleton.displayName = 'LinkPreviewSkeleton'

// ============================================================================
// LinkPreviewError Component
// ============================================================================

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

// ============================================================================
// Expandable Description Component (Option E)
// ============================================================================

interface ExpandableDescriptionProps {
  description: string
  maxLength?: number
  className?: string
}

function ExpandableDescription({
  description,
  maxLength = 120,
  className,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const needsExpansion = description.length > maxLength
  const prefersReducedMotion = useReducedMotion()

  const displayText =
    needsExpansion && !isExpanded
      ? description.slice(0, maxLength).trim() + '...'
      : description

  return (
    <div className={className}>
      <motion.p
        className="text-xs text-muted-foreground/90"
        initial={false}
        animate={{ height: 'auto' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: duration('normal') }
        }
      >
        {displayText}
      </motion.p>
      {needsExpansion && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="text-xs text-primary hover:underline mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

// ============================================================================
// LinkPreviewCompact Component
// ============================================================================

export interface LinkPreviewCompactProps {
  metadata: LinkMetadata
  onClick?: () => void
  showFavicon?: boolean
  className?: string
}

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
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: duration('fast') }}
    >
      {content}
    </motion.div>
  )
}

LinkPreviewCompact.displayName = 'LinkPreviewCompact'

// ============================================================================
// RichEmbed (Public API expected by tests)
// ============================================================================

export interface RichEmbedPublicProps {
  url: string
  embedType: EmbedType
  className?: string
}

/**
 * RichEmbed component (public) - renders an iframe for supported providers,
 * otherwise falls back to a safe link.
 */
export function RichEmbed({ url, embedType, className }: RichEmbedPublicProps) {
  let { id } = detectEmbedDetails(url)
  const safeUrl = sanitizeUrl(url)

  const type = embedType === 'default' ? 'generic' : embedType

  // Some tests/callers provide non-canonical IDs; fall back to parsing.
  if (!id && isValidUrl(url)) {
    try {
      const parsed = new URL(url)
      if (type === 'youtube') {
        id = parsed.searchParams.get('v')
      }
    } catch {
      // ignore
    }
  }

  if (!id || type === 'generic') {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
          className
        )}
      >
        {url}
      </a>
    )
  }

  switch (type) {
    case 'youtube':
      return (
        <iframe
          className={cn('w-full aspect-video rounded-lg', className)}
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video"
          role="presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    case 'vimeo':
      return (
        <iframe
          className={cn('w-full aspect-video rounded-lg', className)}
          src={`https://player.vimeo.com/video/${id}`}
          title="Vimeo video"
          role="presentation"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    case 'spotify':
      return (
        <iframe
          className={cn('w-full rounded-lg', className)}
          src={`https://open.spotify.com/embed/${id}`}
          title="Spotify"
          role="presentation"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )
    default:
      return (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
            className
          )}
        >
          {url}
        </a>
      )
  }
}

// ============================================================================
// LinkPreview Component (Main)
// ============================================================================

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
                className="w-8 h-8 text-muted-foreground/50"
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: duration('normal') }}
      className={className}
    >
      {cardContent}
    </motion.div>
  )
}

LinkPreview.displayName = 'LinkPreview'

// ============================================================================
// useLinkPreview Hook
// ============================================================================

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

  const cacheRef = React.useRef<LRUCache<string, CacheEntry>>()
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

// ============================================================================
// InlineLink Component
// ============================================================================

export interface InlineLinkProps {
  /** The URL to link to */
  url: string
  /** Called when user wants to preview (prevents default navigation) */
  onPreview?: (url: string) => void
  /** Link content (defaults to URL) */
  children?: React.ReactNode
  /** Custom className */
  className?: string
  /** Show preview on hover */
  showHoverPreview?: boolean
}

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

// ============================================================================
// SmartLinkPreview Component (Auto-fetching)
// ============================================================================

export interface SmartLinkPreviewProps {
  /** The URL to preview */
  url: string
  /** Visual variant */
  variant?: LinkPreviewVariant
  /** Called when the preview is clicked */
  onClick?: () => void
  /** Called when the remove button is clicked */
  onRemove?: () => void
  /** Called when metadata is successfully loaded */
  onLoad?: (metadata: LinkMetadata) => void
  /** Called when loading fails */
  onError?: (error: Error) => void
  /** Show image thumbnail */
  showImage?: boolean
  /** Show favicon */
  showFavicon?: boolean
  /** Show domain badge */
  showDomain?: boolean
  /** Show description text */
  showDescription?: boolean
  /** Allow expanding long descriptions */
  expandableDescription?: boolean
  /** Fallback content when loading fails */
  fallback?: React.ReactNode
  /** Custom className */
  className?: string
  /** Custom fetch function */
  fetchFn?: (url: string) => Promise<LinkMetadata>
  /** API endpoint for metadata fetching */
  apiEndpoint?: string
}

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
