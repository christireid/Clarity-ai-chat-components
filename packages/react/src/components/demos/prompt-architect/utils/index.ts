/**
 * Prompt Architect Utilities
 *
 * Re-exports all utility functions for the Prompt Architect Studio.
 *
 * @packageDocumentation
 */

// Variable parsing
export {
  VARIABLE_REGEX,
  inferVariableType,
  formatDisplayName,
  extractVariables,
  extractVariablesFromMultiple,
  validateVariableName,
  containsVariableSyntax,
  getTemplateSegments,
  getVariablePositions,
} from './variable-parser'

// Template compilation
export {
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
} from './template-compiler'
export type {
  CompileOptions,
  CompileResult,
  DiffSegment,
  DiffSegmentType,
} from './template-compiler'

// Structured output
export {
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
} from './structured-output'
export type { StreamingJsonState } from './structured-output'

// Presets
export {
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
} from './presets'
