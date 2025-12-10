/**
 * Type definitions for Structured Input Builder
 *
 * @module components/structured-input/types
 */

/**
 * Field priority for token optimization
 * Fields with higher priority are preserved during trimming
 */
export type FieldPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Section type for prompt structure optimization
 */
export type FieldSection =
  | 'instruction'
  | 'context'
  | 'reference'
  | 'question'
  | 'constraint'
  | 'example'

/**
 * Field types supported by the builder
 */
export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'toggle'

/**
 * Option for select fields
 */
export interface SelectOption {
  value: string
  label: string
  description?: string
}

/**
 * Configuration for a structured input field
 */
export interface StructuredInputField {
  /** Unique identifier for the field */
  id: string
  /** Field name (used in output mapping) */
  name: string
  /** Display label */
  label: string
  /** Field type */
  type: FieldType
  /** Whether the field is required */
  required: boolean
  /** Default value */
  defaultValue?: string
  /** Help text/description */
  description?: string
  /** Placeholder text */
  placeholder?: string
  /** Max character length */
  maxLength?: number
  /** Options for select type */
  options?: SelectOption[]
  /** Validation function */
  validate?: (value: string) => boolean | string
  /** Priority for token trimming (higher = more important to keep) */
  priority?: FieldPriority
  /** Section type for prompt structure */
  section?: FieldSection
  /** Number of rows for textarea */
  rows?: number
  /** Whether field is disabled */
  disabled?: boolean
}

/**
 * Token estimate breakdown by field
 */
export interface TokenBreakdown {
  fieldId: string
  fieldName: string
  tokens: number
  percentage: number
}

/**
 * Built output from structured input
 */
export interface StructuredInputResult {
  /** Field values as key-value pairs */
  values: Record<string, string>
  /** Formatted prompt text */
  formattedPrompt: string
  /** Token breakdown by field */
  tokenBreakdown: TokenBreakdown[]
  /** Total estimated tokens */
  totalTokens: number
  /** Validation errors */
  errors: Record<string, string>
  /** Whether all required fields are valid */
  isValid: boolean
}

/**
 * Props for StructuredInputBuilder component
 */
export interface StructuredInputBuilderProps {
  /** Field configurations */
  fields: StructuredInputField[]
  /** Current field values */
  values: Record<string, string>
  /** Callback when values change */
  onChange: (values: Record<string, string>) => void
  /** Callback when user submits the form */
  onSubmit?: (result: StructuredInputResult) => void
  /** Maximum input tokens budget */
  maxTokens?: number
  /** Show token estimates per field */
  showTokenBreakdown?: boolean
  /** Show total token count */
  showTotalTokens?: boolean
  /** Custom prompt formatter */
  formatPrompt?: (
    values: Record<string, string>,
    fields: StructuredInputField[]
  ) => string
  /** Display mode */
  displayMode?: 'form' | 'compact' | 'inline'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Custom CSS class */
  className?: string
  /** Submit button text */
  submitLabel?: string
  /** Whether to show submit button */
  showSubmitButton?: boolean
  /** Title for the builder */
  title?: string
  /** Description for the builder */
  description?: string
}

/**
 * Options for useStructuredInput hook
 */
export interface UseStructuredInputOptions {
  /** Field configurations */
  fields: StructuredInputField[]
  /** Initial values */
  initialValues?: Record<string, string>
  /** Maximum token budget */
  maxTokens?: number
  /** Auto-trim to fit token budget */
  autoTrim?: boolean
  /** Custom prompt formatter */
  formatPrompt?: (
    values: Record<string, string>,
    fields: StructuredInputField[]
  ) => string
  /** Callback when values change */
  onChange?: (values: Record<string, string>) => void
  /** Callback when validation changes */
  onValidationChange?: (
    errors: Record<string, string>,
    isValid: boolean
  ) => void
}

/**
 * Return type for useStructuredInput hook
 */
export interface UseStructuredInputReturn {
  /** Current field values */
  values: Record<string, string>
  /** Set a single field value */
  setValue: (name: string, value: string) => void
  /** Set multiple field values */
  setValues: (values: Record<string, string>) => void
  /** Reset to initial values */
  reset: () => void
  /** Validation errors */
  errors: Record<string, string>
  /** Whether all required fields are valid */
  isValid: boolean
  /** Token breakdown */
  tokenBreakdown: TokenBreakdown[]
  /** Total token count */
  totalTokens: number
  /** Whether over token budget */
  isOverBudget: boolean
  /** Formatted prompt */
  formattedPrompt: string
  /** Build result for submission */
  buildResult: () => StructuredInputResult
  /** Validate all fields */
  validate: () => boolean
}
