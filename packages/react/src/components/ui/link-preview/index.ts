/**
 * Link Preview Components
 *
 * Modular link preview system with rich embed support, metadata fetching,
 * and multiple display variants.
 */

// Types
export type {
  LinkPreviewVariant,
  EmbedType,
  LinkMetadata,
  LinkPreviewProps,
  LinkPreviewSkeletonProps,
  LinkPreviewErrorProps,
  LinkPreviewCompactProps,
  RichEmbedPublicProps,
  InlineLinkProps,
  SmartLinkPreviewProps,
  UseLinkPreviewOptions,
  UseLinkPreviewReturn,
  MetadataFetcherConfig,
} from './types'

// URL Utilities
export { isValidUrl, sanitizeUrl, getDomain } from './url-utils'

// Embed Detection
export { detectEmbedType, detectEmbedDetails } from './embed-detection'

// Cache
export {
  LRUCache,
  getCachedMetadata,
  setCachedMetadata,
  DEFAULT_CACHE_DURATION,
  DEFAULT_MAX_CACHE_SIZE,
  type CacheEntry,
} from './cache'

// Metadata Fetching
export { createMetadataFetcher, createFallbackMetadata } from './metadata-fetcher'

// Components
export { LinkPreviewSkeleton } from './skeleton'
export { LinkPreviewError } from './error'
export { LinkPreviewCompact } from './link-preview-compact'
export { RichEmbed } from './rich-embed'
export { LinkPreview } from './link-preview'
export { InlineLink } from './inline-link'
export { SmartLinkPreview } from './smart-link-preview'

// Hooks
export { useLinkPreview } from './use-link-preview'
