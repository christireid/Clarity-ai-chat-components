/**
 * DocsAssistant AI Components and Utilities
 *
 * This module exports all AI-related components, hooks, and utilities
 * for the Documentation Assistant.
 */

// ============================================================================
// Components
// ============================================================================

export { DocsAssistant } from './DocsAssistant'
export { ChatButton } from './ChatButton'
export { CodeBlock } from './CodeBlock'
export { ExportButton } from './ExportButton'
export { FeedbackButtons } from './FeedbackButtons'
export { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
export { PromptSelector } from './PromptSelector'
export { SourceCard } from './SourceCard'
export { SourcesList } from './SourcesList'
export { SuggestionsPanel } from './SuggestionsPanel'
export { AnalyticsDashboard } from './AnalyticsDashboard'

// ============================================================================
// System Prompt & Utilities
// ============================================================================

export {
  // Main prompt
  DOCS_ASSISTANT_SYSTEM_PROMPT,
  // Personality modes
  getSystemPromptWithPersonality,
  type PersonalityMode,
  // Documentation links
  DOC_LINKS,
  type DocLinkKey,
  // Link formatters
  formatDocLink,
  formatDocLinks,
  getDocLink,
  // Response builders
  buildLearnMoreSection,
  buildComparisonTable,
  buildQuickChecks,
} from './systemPrompt'

// ============================================================================
// Constants
// ============================================================================

export {
  // Storage
  SESSION_ID_KEY,
  MESSAGES_KEY,
  // Timing
  CONVERSATION_TTL_MS,
  STREAM_THROTTLE_MS,
  CLIPBOARD_TIMEOUT_MS,
  TOAST_DURATION_MS,
  FOCUS_DELAY_MS,
  // Retry
  MAX_RETRY_ATTEMPTS,
  INITIAL_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  RETRY_BACKOFF_MULTIPLIER,
  // Tokens
  MODEL_MAX_TOKENS,
  TOKEN_COST_PER_TOKEN,
  TOKEN_WARNING_THRESHOLD,
  TOKEN_CRITICAL_THRESHOLD,
  // Animation
  BACKDROP_VARIANTS,
  DIALOG_VARIANTS_REDUCED,
  DIALOG_VARIANTS_NORMAL,
} from './constants'

// ============================================================================
// Types
// ============================================================================

export type * from './types'

// ============================================================================
// Utilities
// ============================================================================

export * from './utils'

// ============================================================================
// Hooks
// ============================================================================

export * from './hooks'
