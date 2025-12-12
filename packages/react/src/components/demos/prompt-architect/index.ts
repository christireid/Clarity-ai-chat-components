/**
 * Prompt Architect Studio
 *
 * A mini-IDE for prompt engineering that demonstrates the library's
 * prompt construction, variable injection, and template management capabilities.
 *
 * ## Features
 * - **Dynamic Variables**: Auto-generates input fields from {{ variable }} syntax
 * - **Prompt Versioning**: Save and switch between prompt versions
 * - **Structured Output Mode**: Force JSON responses with schema validation
 * - **Real-time Token Counting**: Monitor prompt size
 * - **Debug View**: See raw messages array sent to API
 * - **Preset Library**: Pre-configured prompts for common use cases
 *
 * ## Quick Start
 * ```tsx
 * import { PromptArchitectDemo } from '@clarity-chat/react'
 *
 * function App() {
 *   return <PromptArchitectDemo />
 * }
 * ```
 *
 * ## Using the Hook Directly
 * ```tsx
 * import { usePromptArchitect, PROMPT_PRESETS } from '@clarity-chat/react'
 *
 * function MyPromptBuilder() {
 *   const {
 *     state,
 *     compiledSystemPrompt,
 *     setSystemPrompt,
 *     setVariableValue,
 *     loadPreset,
 *     runPrompt,
 *   } = usePromptArchitect({
 *     autoSave: true,
 *     defaultModel: 'gpt-4o',
 *   })
 *
 *   return (
 *     // Your custom UI
 *   )
 * }
 * ```
 *
 * @packageDocumentation
 */

// Main hook
export { usePromptArchitect } from './hooks/usePromptArchitect'
export type {
  UsePromptArchitectOptions,
  UsePromptArchitectReturn,
} from './types'

// Types
export type {
  // Variable types
  InferredFieldType,
  ExtractedVariable,
  VariableExtractionResult,
  // Version types
  PromptVersion,
  // Preview types
  PreviewMessage as PreviewMessageData,
  DebugViewMode,
  // Structured output types
  StructuredLLMResponse,
  StructuredOutputParseResult,
  // Token types
  TokenStats,
  // Preset types
  PromptPreset,
  // State types
  PromptArchitectState,
  PromptArchitectAction,
  // Model types
  ModelConfig,
} from './types'

// Type utilities
export { MODEL_CONFIGS, getModelConfig, getDefaultModelConfig } from './types'

// Utilities
export {
  // Variable parsing
  VARIABLE_REGEX,
  inferVariableType,
  formatDisplayName,
  extractVariables,
  extractVariablesFromMultiple,
  validateVariableName,
  containsVariableSyntax,
  getTemplateSegments,
  getVariablePositions,
  // Template compilation
  compileTemplate,
  compileTemplateWithResult,
  buildMessagesArray,
  buildMessagesFromTemplates,
  generateDiff,
  formatMessagesAsJson,
  formatMessagesAsText,
  validateRequiredVariables,
  getMissingVariables,
  STRUCTURED_OUTPUT_INSTRUCTION,
  // Structured output
  STRUCTURED_OUTPUT_SCHEMA,
  extractJsonFromResponse,
  parseStructuredOutput,
  formatStructuredResponse,
  looksLikeJson,
  isStructuredResponse,
  validateResultType,
  createMockStructuredResponse,
  createErrorStructuredResponse,
  createStreamingState,
  updateStreamingState,
  // Presets
  PROMPT_PRESETS,
  CODE_REFACTORER_PRESET,
  CODE_REVIEWER_PRESET,
  EMAIL_WRITER_PRESET,
  CONTENT_SUMMARIZER_PRESET,
  DATA_EXTRACTOR_PRESET,
  JSON_TRANSFORMER_PRESET,
  BUG_ANALYZER_PRESET,
  getPresetById,
  getPresetsByCategory,
  searchPresets,
  getPresetCategories,
} from './utils'

export type {
  CompileOptions,
  CompileResult,
  DiffSegment,
  DiffSegmentType,
  StreamingJsonState,
} from './utils'

// Main component
export { PromptArchitectDemo } from './PromptArchitectDemo'
export type { PromptArchitectDemoProps } from './PromptArchitectDemo'

// Sub-components
export {
  HighlightedTextarea,
  PromptEditor,
  VariableField,
  VariableForm,
  PreviewMessage,
  PreviewPane,
  DebugView,
  TokenBadge,
  PresetSelector,
  VersionSelector,
} from './components'

export type {
  HighlightedTextareaProps,
  PromptEditorProps,
  VariableFieldProps,
  VariableFormProps,
  PreviewMessageProps,
  PreviewPaneProps,
  DebugViewProps,
  TokenBadgeProps,
  PresetSelectorProps,
  VersionSelectorProps,
} from './components'
