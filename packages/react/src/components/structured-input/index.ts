/**
 * Structured Input Builder
 *
 * Build structured prompts with token-aware field management.
 *
 * @module components/structured-input
 */

// Types
export type {
  FieldPriority,
  FieldSection,
  FieldType,
  SelectOption,
  StructuredInputField,
  TokenBreakdown,
  StructuredInputResult,
  StructuredInputBuilderProps,
  UseStructuredInputOptions,
  UseStructuredInputReturn,
} from './types'

// Re-export from original file
export {
  StructuredInputBuilder,
  useStructuredInput,
  PRESET_FIELDS,
} from '../structured-input-builder'
