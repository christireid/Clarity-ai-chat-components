'use client'

import * as React from 'react'
import { cn } from '../utils/cn'
import { estimateTokens } from '../utils/tokenization/estimator'

/**
 * Field priority for token optimization
 * Fields with higher priority are preserved during trimming
 */
export type FieldPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Section type for prompt structure optimization
 */
export type FieldSection = 'instruction' | 'context' | 'reference' | 'question' | 'constraint' | 'example'

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
  formatPrompt?: (values: Record<string, string>, fields: StructuredInputField[]) => string
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
 * Default prompt formatter that creates structured output
 */
function defaultFormatPrompt(
  values: Record<string, string>,
  fields: StructuredInputField[]
): string {
  const sections: Record<FieldSection, string[]> = {
    instruction: [],
    context: [],
    reference: [],
    example: [],
    constraint: [],
    question: [],
  }

  // Group content by section
  for (const field of fields) {
    const value = values[field.name]?.trim()
    if (!value) continue

    const section = field.section ?? 'context'
    sections[section].push(`**${field.label}:** ${value}`)
  }

  // Build prompt in optimal order (instructions first, question last)
  const parts: string[] = []

  if (sections.instruction.length > 0) {
    parts.push('## Instructions\n' + sections.instruction.join('\n'))
  }
  if (sections.context.length > 0) {
    parts.push('## Context\n' + sections.context.join('\n'))
  }
  if (sections.reference.length > 0) {
    parts.push('## References\n' + sections.reference.join('\n'))
  }
  if (sections.example.length > 0) {
    parts.push('## Examples\n' + sections.example.join('\n'))
  }
  if (sections.constraint.length > 0) {
    parts.push('## Constraints\n' + sections.constraint.join('\n'))
  }
  if (sections.question.length > 0) {
    parts.push('## Question\n' + sections.question.join('\n'))
  }

  return parts.join('\n\n')
}

// Note: estimateTokens is imported from '../utils/tokenization/estimator'
// for consistent token estimation across the codebase

/**
 * Simple hash function for generating unique suffixes
 * Returns a short alphanumeric string derived from input
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 4)
}

/**
 * Sanitize a string for use as an HTML ID
 * Replaces invalid characters with hyphens and ensures it starts with a letter.
 * Uses a hash suffix to prevent collisions when different inputs sanitize to the same result.
 */
function sanitizeHtmlId(id: string): string {
  if (!id) return 'field-empty'
  // Replace invalid chars with hyphens
  let sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '-')
  // Collapse consecutive hyphens to single hyphen
  sanitized = sanitized.replace(/-+/g, '-')
  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, '')
  // If empty after sanitization (all special chars) or starts with non-letter, add hash prefix
  if (!sanitized || !/^[a-zA-Z]/.test(sanitized)) {
    const hash = simpleHash(id)
    sanitized = sanitized ? `f${hash}-${sanitized}` : `f${hash}`
  }
  return sanitized || 'field-fallback'
}

/**
 * Validate fields and return errors map
 * Shared between component and hook to avoid duplication
 */
function validateFields(
  fields: StructuredInputField[],
  values: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const value = values[field.name] ?? ''

    // Required validation
    if (field.required && !value.trim()) {
      errors[field.name] = `${field.label} is required`
      continue
    }

    // Custom validation with error protection
    if (field.validate && value) {
      try {
        const validationResult = field.validate(value)
        if (typeof validationResult === 'string') {
          errors[field.name] = validationResult
        } else if (!validationResult) {
          errors[field.name] = `Invalid ${field.label.toLowerCase()}`
        }
      } catch {
        // Validation function threw - treat as invalid
        errors[field.name] = `Validation error for ${field.label.toLowerCase()}`
      }
    }
  }

  return errors
}

/**
 * Field component for rendering individual inputs
 */
const FieldInput = React.memo(function FieldInput({
  field,
  value,
  onChange,
  error,
  tokenCount,
  showTokens,
  size,
  disabled,
}: {
  field: StructuredInputField
  value: string
  onChange: (value: string) => void
  error?: string
  tokenCount?: number
  showTokens: boolean
  size: 'sm' | 'md' | 'lg'
  disabled: boolean
}) {
  const inputId = `field-${sanitizeHtmlId(field.id)}`
  const descriptionId = field.description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  // Combine description and error IDs for aria-describedby (both should be announced)
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isDisabled = disabled || field.disabled

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  }

  const baseInputClasses = cn(
    'w-full rounded-md border bg-background transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-destructive' : 'border-border',
    sizeClasses[size]
  )

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={field.rows ?? 3}
            disabled={isDisabled}
            className={cn(baseInputClasses, 'resize-none')}
            aria-invalid={!!error}
            aria-required={field.required}
            aria-describedby={describedBy}
          />
        )

      case 'select':
        return (
          <select
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-required={field.required}
            aria-describedby={describedBy}
          >
            <option value="">{field.placeholder ?? 'Select an option...'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            id={inputId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-required={field.required}
            aria-describedby={describedBy}
          />
        )

      case 'toggle':
        return (
          <button
            id={inputId}
            type="button"
            role="switch"
            aria-checked={value === 'true'}
            aria-required={field.required}
            onClick={() => onChange(value === 'true' ? 'false' : 'true')}
            disabled={isDisabled}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              value === 'true' ? 'bg-primary' : 'bg-muted',
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                value === 'true' ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        )

      default:
        return (
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={isDisabled}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-required={field.required}
            aria-describedby={describedBy}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className={cn(
            'font-medium',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}
        >
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        {showTokens && tokenCount !== undefined && (
          <span className="text-xs text-muted-foreground font-mono">
            ~{tokenCount} tokens
          </span>
        )}
      </div>

      {field.description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">{field.description}</p>
      )}

      {renderInput()}

      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
})

/**
 * Priority indicator badge
 */
const PriorityBadge = React.memo(function PriorityBadge({
  priority,
}: {
  priority: FieldPriority
}) {
  const colors: Record<FieldPriority, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  }

  return (
    <span className={cn('text-xs px-1.5 py-0.5 rounded', colors[priority])}>
      {priority}
    </span>
  )
})

/**
 * Token usage bar component
 */
const TokenUsageBar = React.memo(function TokenUsageBar({
  current,
  max,
  breakdown,
}: {
  current: number
  max: number
  breakdown: TokenBreakdown[]
}) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Token Usage</span>
        <span
          className={cn(
            'font-mono font-medium',
            isCritical ? 'text-destructive' : isWarning ? 'text-warning' : 'text-foreground'
          )}
        >
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isCritical ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {breakdown.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {breakdown
            .filter((b) => b.tokens > 0)
            .map((b) => (
              <span key={b.fieldId} className="text-muted-foreground">
                {b.fieldName}: <span className="font-mono">{b.tokens}</span>
              </span>
            ))}
        </div>
      )}
    </div>
  )
})

/**
 * Structured Input Builder Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Token Optimization
 *
 * A form-based component for building structured prompts with token optimization.
 * Helps users organize their inputs into sections that are optimally ordered
 * for LLM processing and KV cache efficiency.
 *
 * **Features:**
 * - Multiple field types (text, textarea, select, number, toggle)
 * - Real-time token estimation per field
 * - Priority-based token allocation
 * - Section-based prompt formatting
 * - Validation support
 * - Accessible form controls
 *
 * **When to use:**
 * - Building structured prompt interfaces for LLM applications
 * - When you need token-aware form inputs
 * - Creating prompt templates with organized sections
 *
 * **When NOT to use:**
 * - Simple single-input chat interfaces (use ChatInput instead)
 * - When token optimization is not a concern
 *
 * @example
 * ```tsx
 * const fields: StructuredInputField[] = [
 *   {
 *     id: 'task',
 *     name: 'task',
 *     label: 'Task Description',
 *     type: 'text',
 *     required: true,
 *     section: 'instruction',
 *     priority: 'critical',
 *     placeholder: 'What do you want the AI to do?',
 *   },
 *   {
 *     id: 'context',
 *     name: 'context',
 *     label: 'Background Context',
 *     type: 'textarea',
 *     required: false,
 *     section: 'context',
 *     priority: 'medium',
 *     placeholder: 'Any relevant background information...',
 *   },
 * ]
 *
 * <StructuredInputBuilder
 *   fields={fields}
 *   values={values}
 *   onChange={setValues}
 *   onSubmit={handleSubmit}
 *   maxTokens={4000}
 *   showTokenBreakdown
 * />
 * ```
 */
export function StructuredInputBuilder({
  fields,
  values,
  onChange,
  onSubmit,
  maxTokens = 4000,
  showTokenBreakdown = false,
  showTotalTokens = true,
  formatPrompt = defaultFormatPrompt,
  displayMode = 'form',
  size = 'md',
  disabled = false,
  className,
  submitLabel = 'Build Prompt',
  showSubmitButton = true,
  title,
  description,
}: StructuredInputBuilderProps) {
  // Warn about duplicate field IDs in development mode
  React.useEffect(() => {
    if (process.env['NODE_ENV'] !== 'production') {
      const ids = fields.map((f) => f.id)
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
      if (duplicates.length > 0) {
        logger.warn(
          `[StructuredInputBuilder] Duplicate field IDs detected: ${[...new Set(duplicates)].join(', ')}. ` +
          `Each field must have a unique ID to avoid accessibility and rendering issues.`
        )
      }
    }
  }, [fields])

  // Calculate token breakdown
  const tokenBreakdown = React.useMemo((): TokenBreakdown[] => {
    return fields.map((field) => {
      const value = values[field.name] ?? ''
      const tokens = estimateTokens(value)
      return {
        fieldId: field.id,
        fieldName: field.label,
        tokens,
        percentage: 0, // Will be calculated below
      }
    })
  }, [fields, values])

  const totalTokens = React.useMemo(() => {
    return tokenBreakdown.reduce((sum, b) => sum + b.tokens, 0)
  }, [tokenBreakdown])

  // Update percentages
  const breakdownWithPercentages = React.useMemo((): TokenBreakdown[] => {
    if (totalTokens === 0) return tokenBreakdown
    return tokenBreakdown.map((b) => ({
      ...b,
      percentage: (b.tokens / totalTokens) * 100,
    }))
  }, [tokenBreakdown, totalTokens])

  // Create O(1) lookup map for token counts by field ID
  const tokensByFieldId = React.useMemo((): Map<string, number> => {
    const map = new Map<string, number>()
    for (const b of breakdownWithPercentages) {
      map.set(b.fieldId, b.tokens)
    }
    return map
  }, [breakdownWithPercentages])

  // Validate fields using shared function
  const errors = React.useMemo(
    () => validateFields(fields, values),
    [fields, values]
  )

  const isValid = Object.keys(errors).length === 0

  // Handle field change
  const handleFieldChange = React.useCallback(
    (fieldName: string, value: string) => {
      onChange({
        ...values,
        [fieldName]: value,
      })
    },
    [values, onChange]
  )

  // Handle submit
  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!isValid || !onSubmit) return

      let formattedPrompt: string
      try {
        formattedPrompt = formatPrompt(values, fields)
      } catch {
        // Fallback to default formatter if custom one throws
        formattedPrompt = defaultFormatPrompt(values, fields)
      }

      const result: StructuredInputResult = {
        values,
        formattedPrompt,
        tokenBreakdown: breakdownWithPercentages,
        totalTokens,
        errors,
        isValid,
      }

      onSubmit(result)
    },
    [isValid, onSubmit, values, formatPrompt, fields, breakdownWithPercentages, totalTokens, errors]
  )

  // Group fields by section for organized display
  const fieldsBySection = React.useMemo(() => {
    const grouped: Record<string, StructuredInputField[]> = {}

    for (const field of fields) {
      const section = field.section ?? 'other'
      if (!grouped[section]) {
        grouped[section] = []
      }
      grouped[section].push(field)
    }

    return grouped
  }, [fields])

  // Section display order
  const sectionOrder: FieldSection[] = ['instruction', 'context', 'reference', 'example', 'constraint', 'question']

  // Size classes for the container
  const containerClasses = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  }

  if (displayMode === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {fields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={values[field.name] ?? field.defaultValue ?? ''}
              onChange={(v) => handleFieldChange(field.name, v)}
              error={errors[field.name]}
              tokenCount={tokensByFieldId.get(field.id)}
              showTokens={showTokenBreakdown}
              size="sm"
              disabled={disabled}
            />
          ))}
        </div>

        {showTotalTokens && (
          <div className="text-xs text-muted-foreground text-right">
            ~{totalTokens} / {maxTokens} tokens
          </div>
        )}

        {showSubmitButton && (
          <button
            type="submit"
            disabled={disabled || !isValid}
            className={cn(
              'w-full px-3 py-1.5 text-sm font-medium rounded-md',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {submitLabel}
          </button>
        )}
      </form>
    )
  }

  if (displayMode === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex flex-wrap gap-3 items-end', className)}>
        {fields.map((field) => (
          <div key={field.id} className="flex-1 min-w-[150px]">
            <FieldInput
              field={field}
              value={values[field.name] ?? field.defaultValue ?? ''}
              onChange={(v) => handleFieldChange(field.name, v)}
              error={errors[field.name]}
              tokenCount={tokensByFieldId.get(field.id)}
              showTokens={false}
              size="sm"
              disabled={disabled}
            />
          </div>
        ))}

        {showSubmitButton && (
          <button
            type="submit"
            disabled={disabled || !isValid}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {submitLabel}
          </button>
        )}
      </form>
    )
  }

  // Default: form mode
  return (
    <form onSubmit={handleSubmit} className={cn(containerClasses[size], className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className={cn('font-semibold', size === 'lg' ? 'text-lg' : 'text-base')}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Token usage bar */}
      {showTotalTokens && (
        <TokenUsageBar
          current={totalTokens}
          max={maxTokens}
          breakdown={showTokenBreakdown ? breakdownWithPercentages : []}
        />
      )}

      {/* Fields grouped by section */}
      <div className={containerClasses[size]}>
        {sectionOrder.map((section) => {
          const sectionFields = fieldsBySection[section]
          if (!sectionFields?.length) return null

          return (
            <fieldset key={section} className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground capitalize flex items-center gap-2">
                {section}
                <span className="text-xs">({sectionFields.length} fields)</span>
              </legend>

              <div className="space-y-4 pl-3 border-l-2 border-border">
                {sectionFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    {field.priority && (
                      <div className="flex justify-end">
                        <PriorityBadge priority={field.priority} />
                      </div>
                    )}
                    <FieldInput
                      field={field}
                      value={values[field.name] ?? field.defaultValue ?? ''}
                      onChange={(v) => handleFieldChange(field.name, v)}
                      error={errors[field.name]}
                      tokenCount={tokensByFieldId.get(field.id)}
                      showTokens={showTokenBreakdown}
                      size={size}
                      disabled={disabled}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          )
        })}

        {/* Fields without section */}
        {fieldsBySection['other']?.map((field) => (
          <div key={field.id} className="space-y-1">
            {field.priority && (
              <div className="flex justify-end">
                <PriorityBadge priority={field.priority} />
              </div>
            )}
            <FieldInput
              field={field}
              value={values[field.name] ?? field.defaultValue ?? ''}
              onChange={(v) => handleFieldChange(field.name, v)}
              error={errors[field.name]}
              tokenCount={tokensByFieldId.get(field.id)}
              showTokens={showTokenBreakdown}
              size={size}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* Submit button */}
      {showSubmitButton && (
        <button
          type="submit"
          disabled={disabled || !isValid}
          className={cn(
            'w-full font-medium rounded-lg transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {submitLabel}
        </button>
      )}
    </form>
  )
}

/**
 * Hook for managing structured input state
 *
 * Provides convenient state management for StructuredInputBuilder
 * with automatic validation and token counting.
 *
 * @example
 * ```tsx
 * const { values, setValues, result, reset } = useStructuredInput(fields, {
 *   maxTokens: 4000,
 * })
 *
 * <StructuredInputBuilder
 *   fields={fields}
 *   values={values}
 *   onChange={setValues}
 *   maxTokens={4000}
 * />
 *
 * // Access computed result
 * logger.debug(result.totalTokens)
 * logger.debug(result.isValid)
 * ```
 */
export function useStructuredInput(
  fields: StructuredInputField[],
  options?: {
    maxTokens?: number
    formatPrompt?: (values: Record<string, string>, fields: StructuredInputField[]) => string
    initialValues?: Record<string, string>
  }
) {
  const {
    maxTokens = 4000,
    formatPrompt = defaultFormatPrompt,
    initialValues,
  } = options ?? {}

  // Initialize values from defaults
  const getInitialValues = React.useCallback((): Record<string, string> => {
    const result: Record<string, string> = { ...initialValues }
    for (const field of fields) {
      if (result[field.name] === undefined && field.defaultValue !== undefined) {
        result[field.name] = field.defaultValue
      }
    }
    return result
  }, [fields, initialValues])

  const [values, setValues] = React.useState<Record<string, string>>(getInitialValues)

  // Calculate result
  const result = React.useMemo((): StructuredInputResult => {
    const tokenBreakdown: TokenBreakdown[] = fields.map((field) => {
      const value = values[field.name] ?? ''
      const tokens = estimateTokens(value)
      return {
        fieldId: field.id,
        fieldName: field.label,
        tokens,
        percentage: 0,
      }
    })

    const totalTokens = tokenBreakdown.reduce((sum, b) => sum + b.tokens, 0)

    // Update percentages
    if (totalTokens > 0) {
      for (const b of tokenBreakdown) {
        b.percentage = (b.tokens / totalTokens) * 100
      }
    }

    // Validate using shared function
    const errors = validateFields(fields, values)

    let formattedPrompt: string
    try {
      formattedPrompt = formatPrompt(values, fields)
    } catch {
      // Fallback to default formatter if custom one throws
      formattedPrompt = defaultFormatPrompt(values, fields)
    }

    return {
      values,
      formattedPrompt,
      tokenBreakdown,
      totalTokens,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }, [fields, values, formatPrompt])

  // Reset to initial values
  const reset = React.useCallback(() => {
    setValues(getInitialValues())
  }, [getInitialValues])

  // Set a single field value
  const setFieldValue = React.useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  return {
    /** Current field values */
    values,
    /** Set all values */
    setValues,
    /** Set a single field value */
    setFieldValue,
    /** Computed result with validation and tokens */
    result,
    /** Reset to initial values */
    reset,
    /** Max tokens budget */
    maxTokens,
    /** Whether over token budget */
    isOverBudget: result.totalTokens > maxTokens,
  }
}

/**
 * Pre-built field configurations for common use cases.
 *
 * **Important:** Each preset generates a field with a default `id` and `name`.
 * If using the same preset multiple times, override `id` and `name` to avoid conflicts:
 *
 * @example
 * ```tsx
 * const fields = [
 *   PRESET_FIELDS.task({ id: 'task1', name: 'task1', label: 'First Task' }),
 *   PRESET_FIELDS.task({ id: 'task2', name: 'task2', label: 'Second Task' }),
 * ]
 * ```
 */
export const PRESET_FIELDS = {
  /** Task description field */
  task: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'task',
    name: 'task',
    label: 'Task',
    type: 'textarea',
    required: true,
    section: 'instruction',
    priority: 'critical',
    placeholder: 'Describe what you want the AI to do...',
    rows: 2,
    ...overrides,
  }),

  /** Background context field */
  context: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'context',
    name: 'context',
    label: 'Context',
    type: 'textarea',
    required: false,
    section: 'context',
    priority: 'medium',
    placeholder: 'Any background information the AI should know...',
    rows: 3,
    ...overrides,
  }),

  /** Constraints field */
  constraints: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'constraints',
    name: 'constraints',
    label: 'Constraints',
    type: 'textarea',
    required: false,
    section: 'constraint',
    priority: 'high',
    placeholder: 'Any limitations or requirements...',
    rows: 2,
    ...overrides,
  }),

  /** Output format field */
  format: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'format',
    name: 'format',
    label: 'Output Format',
    type: 'select',
    required: false,
    section: 'instruction',
    priority: 'high',
    options: [
      { value: 'text', label: 'Plain Text' },
      { value: 'markdown', label: 'Markdown' },
      { value: 'json', label: 'JSON' },
      { value: 'code', label: 'Code' },
      { value: 'bullet', label: 'Bullet Points' },
    ],
    ...overrides,
  }),

  /** Tone/style field */
  tone: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'tone',
    name: 'tone',
    label: 'Tone',
    type: 'select',
    required: false,
    section: 'instruction',
    priority: 'low',
    options: [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'technical', label: 'Technical' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'formal', label: 'Formal' },
    ],
    ...overrides,
  }),

  /** Examples field */
  examples: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'examples',
    name: 'examples',
    label: 'Examples',
    type: 'textarea',
    required: false,
    section: 'example',
    priority: 'medium',
    placeholder: 'Provide example inputs/outputs...',
    rows: 3,
    ...overrides,
  }),

  /** Question field */
  question: (overrides?: Partial<StructuredInputField>): StructuredInputField => ({
    id: 'question',
    name: 'question',
    label: 'Question',
    type: 'textarea',
    required: true,
    section: 'question',
    priority: 'critical',
    placeholder: 'What specific question do you have?',
    rows: 2,
    ...overrides,
  }),
} as const

export default StructuredInputBuilder
