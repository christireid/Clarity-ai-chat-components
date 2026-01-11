/**
 * Prompt Components
 *
 * Components for prompt management, testing, and suggestions.
 * Includes playground, library, versioning, and variable editing.
 */

export { FollowUpSuggestions } from './follow-up-suggestions'
export type { FollowUpSuggestion, FollowUpSuggestionsProps } from './follow-up-suggestions'

export { PromptPlayground } from './prompt-playground'
export type { PromptPlaygroundProps } from './prompt-playground'

export { PromptSuggestions, usePromptSuggestions } from './prompt-suggestions'
export type {
  PromptSuggestionsProps,
  PromptSuggestion,
  PromptSuggestionType,
} from './prompt-suggestions'

export { PromptVariablesEditor } from './prompt-variables-editor'
export type { PromptVariablesEditorProps } from './prompt-variables-editor'

export { PromptVersionHistory } from './prompt-version-history'
export type { PromptVersionHistoryProps } from './prompt-version-history'

// Prompt Container - comprehensive container for prompt input with suggestions
export { PromptContainer, useFileAttachments } from './prompt-container'
export type {
  PromptContainerProps,
  SuggestionCategory,
  FileAttachment,
} from './prompt-container'

// Suggestion Cards - grid of interactive suggestion cards with categories
export { SuggestionCards, useSuggestionCards } from './suggestion-cards'
export type {
  SuggestionCardsProps,
  SuggestionCard,
  CategoryFilter,
} from './suggestion-cards'
