/**
 * Structured Input Builder (Barrel Export)
 *
 * This file maintains backward compatibility while delegating to the new modular structure.
 * All functionality is now organized in the structured-input-builder/ directory.
 *
 * @deprecated Import from './structured-input-builder/index' instead
 */

export { StructuredInputBuilder as default } from './structured-input-builder/StructuredInputBuilder'
export { StructuredInputBuilder } from './structured-input-builder/StructuredInputBuilder'
export { useStructuredInput } from './structured-input-builder/use-structured-input'
export { PRESET_FIELDS } from './structured-input-builder/presets'
export {
  defaultFormatPrompt,
  validateFields,
  sanitizeHtmlId,
} from './structured-input-builder/utils'
export {
  FieldInput,
  PriorityBadge,
  TokenUsageBar,
} from './structured-input-builder/FieldComponents'

export type {
  FieldPriority,
  FieldSection,
  FieldType,
  SelectOption,
  StructuredInputField,
  TokenBreakdown,
  StructuredInputResult,
  StructuredInputBuilderProps,
} from './structured-input-builder/types'
