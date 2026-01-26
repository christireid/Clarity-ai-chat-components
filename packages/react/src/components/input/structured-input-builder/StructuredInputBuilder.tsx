'use client'

/**
 * Structured Input Builder Component
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { estimateTokens } from '../../../utils/tokenization/estimator'
import { FieldInput, PriorityBadge, TokenUsageBar } from './FieldComponents'
import type {
  FieldSection,
  StructuredInputBuilderProps,
  StructuredInputField,
  StructuredInputResult,
  TokenBreakdown,
} from './types'
import { defaultFormatPrompt, validateFields } from './utils'

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
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[StructuredInputBuilder] Duplicate field IDs detected: ${[...new Set(duplicates)].join(', ')}. ` +
              `Each field must have a unique ID to avoid accessibility and rendering issues.`
          )
        }
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
    [
      isValid,
      onSubmit,
      values,
      formatPrompt,
      fields,
      breakdownWithPercentages,
      totalTokens,
      errors,
    ]
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
  const sectionOrder: FieldSection[] = [
    'instruction',
    'context',
    'reference',
    'example',
    'constraint',
    'question',
  ]

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
      <form
        onSubmit={handleSubmit}
        className={cn('flex flex-wrap gap-3 items-end', className)}
      >
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
    <form
      onSubmit={handleSubmit}
      className={cn(containerClasses[size], className)}
    >
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3
              className={cn(
                'font-semibold',
                size === 'lg' ? 'text-lg' : 'text-base'
              )}
            >
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
            size === 'sm'
              ? 'px-3 py-1.5 text-sm'
              : size === 'lg'
                ? 'px-6 py-3 text-base'
                : 'px-4 py-2 text-sm',
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

export default StructuredInputBuilder
