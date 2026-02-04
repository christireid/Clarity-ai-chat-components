/**
 * Type definitions for link preview components
 */

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

export interface LinkPreviewCompactProps {
  metadata: LinkMetadata
  onClick?: () => void
  showFavicon?: boolean
  className?: string
}

export interface RichEmbedPublicProps {
  url: string
  embedType: EmbedType
  className?: string
}

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
