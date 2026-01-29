/**
 * PromptComposer Hooks
 *
 * Progressive disclosure prompt system with token optimization.
 *
 * @example
 * ```tsx
 * import { usePromptComposer } from '@clarity-chat/react/hooks'
 *
 * function ChatInput() {
 *   const composer = usePromptComposer({
 *     api: '/api/chat',
 *     tokenBudget: 8000,
 *     features: {
 *       context: true,
 *       suggestions: true,
 *     },
 *   })
 *
 *   return (
 *     <div>
 *       <textarea
 *         ref={composer.ref}
 *         value={composer.state.value}
 *         onChange={(e) => composer.actions.setValue(e.target.value)}
 *       />
 *       <div>Tokens: {composer.state.totalTokens}/{composer.state.tokenBudget}</div>
 *       <button onClick={composer.actions.submit}>Send</button>
 *     </div>
 *   )
 * }
 * ```
 */

// Main hook
export { usePromptComposer } from './usePromptComposer'

// Commands hook
export {
  usePromptCommands,
  BUILTIN_COMMANDS,
  type UsePromptCommandsConfig,
  type UsePromptCommandsReturn,
} from './usePromptCommands'

// Utility functions
export {
  buildPromptWithContext,
  createContextItem,
  rankByRelevance,
  calculateTokenSavings,
  filterContextItems,
  calculateContextTokens,
  getTokenBudget,
  shouldAutoExpand,
  fuzzyMatch,
} from './context-utils'

// Context Providers
export {
  // File provider
  createFileProvider,
  createMockFileProvider,
  type FileSystemEntry,
  type FileProviderConfig,
  // Doc provider
  createDocProvider,
  createMockDocProvider,
  type DocEntry,
  type DocProviderConfig,
  // User provider
  createUserProvider,
  createMockUserProvider,
  type UserEntry,
  type UserProviderConfig,
  // Web provider
  createWebProvider,
  createMockWebProvider,
  type WebResult,
  type WebProviderConfig,
  // All mock providers
  createMockProviders,
} from './providers'

// Types
export type {
  // Core types
  ContextType,
  ContextItem,
  ContextTokenBudget,
  ContextRelevanceScore,
  ContextProvider,
  ContextConfig,

  // Command types
  Command,
  CommandsConfig,
  CommandCategory,

  // Suggestion types
  Suggestion,
  SuggestionType,
  SuggestionSource,
  SuggestionContext,
  SuggestionsConfig,

  // Attachment types
  Attachment,
  AttachmentType,
  AttachmentsConfig,

  // Settings types
  PromptSettings,

  // State types
  PromptState,
  PromptComposerState,
  PromptComposerActions,
  PromptComposerConfig,
  PromptMessage,

  // Hook return
  UsePromptComposerReturn,

  // Utility types
  Message,
  UserProfile,
} from './types'

// Re-export constants
export { DEFAULT_TOKEN_BUDGETS, DEFAULT_PRIORITY } from './types'
