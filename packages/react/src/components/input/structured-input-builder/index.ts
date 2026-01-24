/**
 * Structured Input Builder
 *
 * A form-based component for building structured prompts with token optimization.
 */

export { StructuredInputBuilder as default } from './structured-input-builder'
export { StructuredInputBuilder } from './structured-input-builder'
export { useStructuredInput } from './use-structured-input'
export { PRESET_FIELDS } from './presets'

// Re-export types
export type {
  FieldPriority,
  FieldSection,
  FieldType,
  SelectOption,
  StructuredInputField,
  TokenBreakdown,
  StructuredInputResult,
  StructuredInputBuilderProps,
} from './types'

// Re-export utilities (useful for advanced customization)
export { defaultFormatPrompt, validateFields, sanitizeHtmlId } from './utils'

// Re-export components (useful for custom layouts)
export { FieldInput, PriorityBadge, TokenUsageBar } from './field-components'
