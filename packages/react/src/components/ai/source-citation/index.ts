/**
 * SourceCitation - AI source citation component with multiple display variants
 *
 * @packageDocumentation
 */

// Main component
export { SourceCitation } from './source-citation'

// Types
export type {
  Source,
  SourceCitationVariant,
  SourceCitationSize,
  SourceCitationProps,
  UseSourceCitationOptions,
  UseSourceCitationReturn,
  Source as SourceCitationSource,
} from './types'

// Hooks
export { useSourceCitation } from './hooks/use-source-citation'

// Utilities (for advanced usage)
export {
  extractDomain,
  getFaviconUrl,
  formatDate,
  getConfidenceDisplay,
  truncateText,
  groupSourcesByDomain,
} from './utils'

// Validation utilities (for advanced usage)
export {
  validateSource,
  isValidUrl,
  isValidConfidence,
  isValidDate,
  sanitizeSource,
  filterValidSources,
} from './validation'

// Sub-components (for custom compositions)
export {
  Favicon,
  ConfidenceBadge,
  SourceCitationSkeleton,
  InlineSourceItem,
  CardSourceItem,
  ListSourceItem,
} from './components'

export type {
  FaviconProps,
  ConfidenceBadgeProps,
  SourceCitationSkeletonProps,
  InlineSourceItemProps,
  CardSourceItemProps,
  ListSourceItemProps,
} from './components'
