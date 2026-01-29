/**
 * ToolCard Module
 *
 * Lightweight, color-coded tool execution indicator components
 * @packageDocumentation
 */

// Main components
export { ToolCard } from './ToolCard'
export { ToolCardList } from './ToolCardList'

// Sub-components (exported for advanced use cases)
export { ToolStatusIndicator } from './ToolStatusIndicator'
export { ToolMetadata } from './ToolMetadata'
export { ToolExpandableContent } from './ToolExpandableContent'

// Hook
export { useToolCard } from './useToolCard'

// Types
export type {
  ToolCardStatus,
  ToolCardSize,
  ToolCardProps,
  ToolCardListProps,
  UseToolCardOptions,
  UseToolCardReturn,
  SizeConfig,
} from './types'

// Constants (for advanced customization)
export {
  SIZE_CONFIG,
  STATUS_CSS_CLASSES,
  STATUS_LABELS,
  GAP_CLASSES,
} from './constants'

// Utilities
export { formatDuration, formatPreview } from './utils'

// Icons (for custom status indicators)
export {
  ToolIcon,
  SpinnerIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  ChevronIcon,
  getStatusIcon,
} from './icons'
