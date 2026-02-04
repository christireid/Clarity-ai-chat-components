/**
 * Type definitions for SourceCitation component
 */

/**
 * Individual source data
 */
export interface Source {
  /** Source URL */
  url: string
  /** Source title/name */
  title: string
  /** Text snippet/excerpt from the source */
  snippet: string
  /** Optional favicon URL (auto-fetched if not provided) */
  favicon?: string
  /** Relevance/confidence score (0-1) */
  confidence?: number
  /** Source domain (auto-extracted if not provided) */
  domain?: string
  /** Publication date */
  date?: string | Date
  /** Author name */
  author?: string
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>
}

/**
 * Display variant for the component
 */
export type SourceCitationVariant = 'inline' | 'card' | 'list'

/**
 * Size variant for the component
 */
export type SourceCitationSize = 'sm' | 'md' | 'lg'

/**
 * Props for the SourceCitation component
 */
export interface SourceCitationProps {
  /** Array of source citations */
  sources: Source[]
  /** Display variant */
  variant?: SourceCitationVariant
  /** Size variant */
  size?: SourceCitationSize
  /** Maximum sources to show before "show more" */
  maxVisible?: number
  /** Show confidence/relevance scores */
  showConfidence?: boolean
  /** Show source domain */
  showDomain?: boolean
  /** Show publication date */
  showDate?: boolean
  /** Show author */
  showAuthor?: boolean
  /** Show favicons */
  showFavicons?: boolean
  /** Expand on hover (for inline/list) */
  expandOnHover?: boolean
  /** Callback when a source is clicked */
  onSourceClick?: (source: Source, index: number) => void
  /** Callback when expand/collapse state changes */
  onExpandChange?: (expanded: boolean) => void
  /** Open links in new tab */
  openInNewTab?: boolean
  /** Group sources by domain */
  groupByDomain?: boolean
  /** Header title */
  title?: string
  /** Custom class name */
  className?: string
  /** Custom class for individual source items */
  sourceClassName?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Loading state */
  loading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Accessible label */
  'aria-label'?: string
}

/**
 * Hook options for managing source citation state
 */
export interface UseSourceCitationOptions {
  /** Initial sources */
  initialSources?: Source[]
  /** Maximum sources to keep in state */
  maxSources?: number
}

/**
 * Hook return type for source citation management
 */
export interface UseSourceCitationReturn {
  /** Current sources */
  sources: Source[]
  /** Add a source */
  addSource: (source: Source) => void
  /** Add multiple sources */
  addSources: (sources: Source[]) => void
  /** Remove a source by URL */
  removeSource: (url: string) => void
  /** Clear all sources */
  clearSources: () => void
  /** Set all sources (replace) */
  setSources: (sources: Source[]) => void
  /** Update a source by URL */
  updateSource: (url: string, updates: Partial<Omit<Source, 'url'>>) => void
  /** Get source by URL */
  getSource: (url: string) => Source | undefined
  /** Check if a source exists */
  hasSource: (url: string) => boolean
  /** Get sources sorted by confidence */
  sortedByConfidence: Source[]
  /** Get unique domains */
  domains: string[]
}
