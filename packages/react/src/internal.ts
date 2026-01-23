'use client'

/**
 * @clarity-chat/react/internal
 *
 * INTERNAL EXPORTS - NOT PART OF PUBLIC API
 *
 * These exports are provided for advanced use cases only.
 * They may change without notice between minor versions.
 *
 * For stable APIs, use the main '@clarity-chat/react' import.
 *
 * @internal
 */

if (
  typeof window !== 'undefined' &&
  typeof process !== 'undefined' &&
  process.env.NODE_ENV !== 'production'
) {
  // Use a flag to ensure we only warn once per session
  const GLOBAL_WARNING_KEY = '__CLARITY_INTERNAL_WARNING_SHOWN__'
  if (!(window as any)[GLOBAL_WARNING_KEY]) {
    console.warn(
      '[@clarity-chat/react] ⚠️ WARNING: You are importing from "@clarity-chat/react/internal".\n' +
        'These APIs are experimental, unstable, and NOT part of the public semantic versioning guarantees.\n' +
        'They may change or be removed without notice between minor versions.\n' +
        'Please prefer using the public API from "@clarity-chat/react".'
    )
    ;(window as any)[GLOBAL_WARNING_KEY] = true
  }
}

// Re-export everything from public API
export * from './public-api'

// Re-export components from internal that aren't in public-api
// Note: Some items are excluded to avoid duplicate export conflicts
export { AdvancedChatInput } from './components/input/advanced-chat-input'
export { ChatLayout } from './components/chat/chat-layout'
export { Message } from './components/message/message'
export { MessageMetadata } from './components/message/message-metadata'
export { StreamBlock } from './components/message/stream-block'
export { ToolInvocationCard } from './components/message/tool-invocation-card'
export { ClarityToolResult } from './components/message/clarity-tool-result'
export { CopyButton } from './components/message/copy-button'
export { FileUpload } from './components/input/file-upload'
export { ModelSelector } from './components/ai/model-selector'
export { ContextCard } from './components/context/context-card'
export { ContextManager } from './components/context/context-manager'
export { ProjectSidebar } from './components/context/project-sidebar'
// PromptLibrary - not yet implemented
export { SettingsPanel } from './components/context/settings-panel'
export { UsageDashboard } from './components/dashboards/usage-dashboard'
export { KnowledgeBaseViewer } from './components/ai/knowledge-base-viewer'
export { BatchExportDialog } from './components/media/batch-export-dialog'
export { StreamCancellation } from './components/message/stream-cancellation'
export { EnhancedCodeBlock } from './components/ai/enhanced-code-block'
export { StreamingTextRenderer } from './components/message/streaming-text-renderer'
export { PersonaPanel } from './components/ai/persona-panel'
export { ConversationTimeline } from './components/conversation/conversation-timeline'
export { MemoryInspector } from './components/context/memory-inspector'
export { SafetyStatusCard } from './components/ai/safety-status-card'
export { AuditLogViewer } from './components/ai/audit-log-viewer'
export { DocumentViewer } from './components/media/document-viewer'
export { ResponseQualityMeter } from './components/dashboards/response-quality-meter'
export { MultiModalPreview } from './components/media/multi-modal-preview'
export { AgentRunFeed } from './components/ai/agent-run-feed'
export { SessionSummaryCard } from './components/ai/session-summary-card'
export { WorkflowSuggestionList } from './components/ai/workflow-suggestion-list'
export { AnalyticsDashboard } from './components/dashboards/analytics-dashboard'
export { RetryButton } from './components/feedback/retry-button'
export {
  ConsoleAlertHandler,
  useConsoleAlerts,
} from './components/feedback/console-alert-handler'
export type {
  ConsoleAlert,
  ConsoleAlertHandlerProps,
} from './components/feedback/console-alert-handler'
export { TokenOptimizationPanel } from './components/token/TokenOptimizationPanel'
export { TokenOptimizationBadge } from './components/token/TokenOptimizationBadge'
export {
  TokenBudgetBar,
  TokenBudgetIndicator,
} from './components/token/token-budget-bar'
export { TokenOptimizationDashboard } from './components/token/TokenOptimizationDashboard'
export {
  TokenCostPreview,
  useTokenEstimate,
  type TokenCostPreviewProps,
  type UseTokenEstimateOptions,
  type TokenEstimate,
} from './components/token/TokenCostPreview'
export {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  type TokenUsage,
  type ModelPricing,
  type TokenUsageMeterProps,
} from './components/token/token-usage-meter'
export { ContextVisualizer } from './components/context/context-visualizer'
export { ConversationList } from './components/conversation/conversation-list'
export { ConversationBranchVisualizer } from './components/conversation/conversation-branch-visualizer'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export { VirtualizedMessageList } from './components/chat/virtualized-message-list'
export { MessageList } from './components/message/message-list'
export { VoiceInput } from './components/input/voice-input'
export * from './components/ui/link-preview'

// Re-export hooks from internal domains
export { useChatHandlers } from './hooks/chat/use-chat-handlers'
export { useChatHistory } from './hooks/chat/use-chat-history'
export { useMemoryStore } from './hooks/storage/use-memory-store'
export { useTokenBudgetMonitor } from './hooks/token/use-token-budget-monitor'
export * from './hooks/token'
// Note: useKeyboardNavigation is already exported from accessibility, so exclude it from hooks/keyboard
export {
  KeyboardNavigationProvider,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
  useIsMac,
  formatShortcutDisplay,
  defaultChatShortcuts,
} from './hooks/keyboard'
export * from './hooks/keyboard/use-keyboard-shortcuts'
export * from './hooks/keyboard/use-chat-keyboard-navigation'
export * from './hooks/keyboard/use-command-palette'
// Note: useReducedMotion is already exported from public-api, so exclude it from hooks/ui
export * from './hooks/ui/use-auto-scroll'
export * from './hooks/ui/use-clipboard'
export * from './hooks/ui/use-debounce'
export * from './hooks/ui/use-throttle'
export * from './hooks/ui/use-toggle'
export * from './hooks/ui/use-previous'
export * from './hooks/ui/use-is-mounted'
export * from './hooks/ui/use-merged-ref'
export * from './hooks/ui/use-window-size'
export * from './hooks/ui/use-intersection-observer'
export * from './hooks/ui/use-event-listener'
export * from './hooks/ui/use-media-query'
export * from './hooks/ui/use-animated-value'
export * from './hooks/ui/use-safe-timeout'
export * from './hooks/storage'
export * from './hooks/context'
export * from './hooks/model'
export * from './hooks/message'
export * from './hooks/input'
export * from './hooks/dashboard'
export * from './hooks/theme'

// Re-export full theme system
// Note: Theme exports are already included via './public-api', so excluding to avoid duplicates
// export * from './theme'

// Re-export components from additional domains
export * from './components/ui'
export * from './components/ai'
export * from './components/context'
// Note: Using explicit exports from './components/code' to avoid conflict with
// getDarkThemes/getLightThemes exported from './theme'
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeFontFamily,
  StreamingCodeBlock,
  type StreamingCodeBlockProps,
  InlineCode,
  type InlineCodeProps,
  LineNumbers,
  type LineNumbersProps,
  CodeBlockHeader,
  type CodeBlockHeaderProps,
  CodeBlockCopyButton,
  type CodeBlockCopyButtonProps,
  CODE_THEMES,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getThemeDefinition,
  isValidTheme,
  type CodeThemeDefinition,
  type CodeThemeName,
  parseLineRanges,
  escapeHtml,
  normalizeLanguage,
  detectLanguage,
  getLanguageDisplayName,
  extractLanguageFromClassName,
  countLines,
  truncateCode,
  COMMON_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  type CommonLanguage,
  // Rename conflicting theme functions to avoid collision with './theme' exports
  getDarkThemes as getCodeDarkThemes,
  getLightThemes as getCodeLightThemes,
} from './components/code'
export * from './components/conversation'
export * from './components/feedback'
export * from './components/media'
export * from './components/search'
// Note: SkipLink is already exported from public-api via utils/accessibility-helpers
// export * from './components/navigation'
export { ContextMenu } from './components/navigation'
export * from './components/theme-components'
export * from './components/input'
// Export only working prompt components (excluding problematic ones with TypeScript issues)
export { FollowUpSuggestions } from './components/prompt/follow-up-suggestions'
export { PromptSuggestions } from './components/prompt/prompt-suggestions'
export type {
  PromptSuggestionsProps,
  PromptSuggestion,
  PromptSuggestionType,
} from './components/prompt/prompt-suggestions'
// PromptSuggestionsEnhanced - not yet implemented

// Re-export accessibility utilities
// Note: Focus management exports (getFocusableElements, useFocusManagement) are already via public-api
// export * from './accessibility/focus-management'
// export * from './accessibility/accessibility-automation'

// Re-export types that are commonly needed
export type { CoreMessage } from './hooks/chat/use-chat-enhanced'
export * from './types/chat-types'
export * from './utils/tools'
export * from './utils/streaming'
export { convertCoreMessagesToMessages } from './utils/message/message-conversion'
// Security utilities (available exports only)
export {
  safeEvaluate,
  detectDangerousPatterns,
  formatEvaluateResult,
  sanitizeCodeHtml,
  escapeHtmlEntities,
  createSafeCodeHtml,
  detectDangerousHtml,
  sanitizeSQL,
  sanitizeSQLIdentifier,
  sanitizeShellArg,
  detectCommandInjection,
  sanitizePath,
  sanitizeFilename,
  sanitizeLDAP,
  sanitizeXML,
  sanitizeURLParam,
  isSafeInput,
  truncateInput,
  sanitization,
  type SafeEvaluateResult,
  type SafeEvaluateOptions,
} from './utils/security'

// Re-export types from @clarity-chat/types for convenience
export type { MessageAttachment, SavedPrompt } from '@clarity-chat/types'

// Re-export input types
export type { InputSuggestion } from './components/input/advanced-chat-input'

// Re-export additional types for docs pages
export type { AgentRunStep } from './components/ai/agent-run-feed'
export type { ModelInfo, ToolCall } from './adapters/types'

// ============================================================================
// INTERNAL UTILITIES (Development warnings, debug, assertions)
// ============================================================================
// Note: Some internal exports (measurePerformance) conflict with public-api
// Use specific imports instead of export * to avoid conflicts
export {
  assertDefined,
  isDefined,
  isNonEmptyString,
  isValidNumber,
  isPlainObject,
  isArray,
  isFunction,
  isPromise,
  assert,
  assertNever,
  DEFAULT_TOKEN_LIMITS,
  // Note: DEFAULT_STREAMING_CONFIG, DEFAULT_MEMORY_CONFIG exported elsewhere
  ANIMATION_DURATIONS,
  Z_INDEX,
  BREAKPOINTS,
  ERROR_CODES,
  MESSAGE_ROLES,
  STORAGE_KEYS,
  debounce,
  throttle,
  generateId,
  deepClone,
  deepMerge,
  clamp,
  sleep,
  retry,
  formatBytes,
} from './internal/index'

// ============================================================================
// AI CHAT HOOKS (Advanced)
// ============================================================================
export { useAssistant } from './hooks/chat/use-assistant'
export { useCompletion } from './hooks/chat/use-completion'
export {
  useChat,
  useChat as useChatEnhanced,
} from './hooks/chat/use-chat-enhanced'

// ============================================================================
// STREAMING HOOKS (Advanced)
// ============================================================================
export * from './hooks/streaming'

// ============================================================================
// RESILIENCE HOOKS (AI-Ops)
// ============================================================================
export * from './hooks/resilience'

// ============================================================================
// ANALYTICS & OBSERVABILITY
// ============================================================================
// Note: Analytics exports (AnalyticsConfig, AnalyticsEvent, AnalyticsProvider, useAnalytics)
// are already via public-api
// export * from './analytics'
// export * from './observability'

// ============================================================================
// ERROR HANDLING & REPORTING
// ============================================================================
// Note: ErrorSeverity excluded to avoid conflict with components/feedback
export {
  ErrorReporterProvider,
  useErrorReporter,
  createSentryProvider,
  createRollbarProvider,
  createBugsnagProvider,
  createCustomAPIProvider,
  createConsoleErrorProvider,
  createLocalStorageErrorProvider,
  getStoredErrors,
  clearStoredErrors,
  ErrorFeedback,
  ErrorFeedbackButton,
  ClarityError,
  validateArrayProp,
  validateRequiredProp,
  validateMessageRole,
  validateMessagesArray,
} from './error'
export type {
  ErrorReport,
  ErrorProvider,
  ErrorReporterConfig,
  ErrorFeedbackType,
  ErrorBoundaryState,
  ErrorStats,
  ClarityErrorCode,
  ClarityErrorContext,
} from './error'

// ============================================================================
// ENTERPRISE FEATURES
// ============================================================================
export * from './quotas'
export * from './rbac'
export * from './multi-tenancy'
export * from './audit'
export * from './webhooks'

// ============================================================================
// ADVANCED COMPONENTS
// ============================================================================
// Note: useInteractionTracking is already exported via public-api
// export * from './components/dashboards' - conflicts with public-api
export * from './components/ai-ops'
export * from './components/ab-testing'
export * from './components/pro'

// ============================================================================
// VECTOR STORES & EMBEDDINGS
// ============================================================================
export * from './vector-stores'

// ============================================================================
// DOCUMENT LOADERS
// ============================================================================
export * from './document-loaders/docx-loader'
export * from './document-loaders/pdf-loader'

// ============================================================================
// RERANKING
// ============================================================================
export * from './reranking'

// ============================================================================
// RAG EVALUATION
// ============================================================================
export * from './evaluation'

// ============================================================================
// AGENTS & TOOLS
// ============================================================================
export * from './agents/tool-ui-registry'

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================
// Note: Animation exports are already in public-api, additional internal
// animation utilities can be imported directly from './animations'

// ============================================================================
// APP API ESCAPE HATCHES (For advanced customization)
// ============================================================================
// These utilities allow advanced users to customize the unified ClarityChatApp
// without using the full component. Use these if you need fine-grained control
// over configuration resolution or need to build custom integrations.
export {
  // Configuration resolution
  resolveConfig,
  isFeatureEnabled,
  describeActiveFeatures,
  createPresetConfig,
  mergeConfigs,
  ConfigValidationError,
  type ResolveConfigOptions,
} from './app-api/resolve-config'

// Default configurations (for overriding specific defaults)
export {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MEMORY_CONFIG,
  DEFAULT_TOKEN_OPTIMIZATION_CONFIG,
  DEFAULT_TOOLS_CONFIG,
  DEFAULT_RAG_CONFIG,
  DEFAULT_SAFETY_CONFIG,
  DEFAULT_OBSERVABILITY_CONFIG,
  DEFAULT_UI_CONFIG,
  DEFAULT_ERROR_RECOVERY_CONFIG,
  DEFAULT_STREAMING_CONFIG,
  PRESET_DEFINITIONS,
  DEFAULT_RESOLVED_CONFIG,
  MODEL_TOKEN_BUDGETS,
  getModelTokenBudget,
} from './app-api/defaults'
