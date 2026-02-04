/**
 * Prompt Components
 *
 * Components for prompt management, testing, and suggestions.
 * Includes playground, library, versioning, and variable editing.
 */

export { FollowUpSuggestions } from './FollowUpSuggestions'
export type {
  FollowUpSuggestion,
  FollowUpSuggestionsProps,
} from './FollowUpSuggestions'

export { PromptPlayground } from './PromptPlayground'
export type { PromptPlaygroundProps } from './PromptPlayground'

export { PromptSuggestions, usePromptSuggestions } from './PromptSuggestions'
export type {
  PromptSuggestionsProps,
  PromptSuggestion,
  PromptSuggestionType,
} from './PromptSuggestions'

export { PromptVariablesEditor } from './PromptVariablesEditor'
export type { PromptVariablesEditorProps } from './PromptVariablesEditor'

export { PromptVersionHistory } from './PromptVersionHistory'
export type { PromptVersionHistoryProps } from './PromptVersionHistory'

// Prompt Container - comprehensive container for prompt input with suggestions
export { PromptContainer, useFileAttachments } from './PromptContainer'
export type {
  PromptContainerProps,
  SuggestionCategory,
  FileAttachment,
} from './PromptContainer'

// Suggestion Cards - grid of interactive suggestion cards with categories
export { SuggestionCards, useSuggestionCards } from './SuggestionCards'
export type {
  SuggestionCardsProps,
  SuggestionCard,
  CategoryFilter,
} from './SuggestionCards'
