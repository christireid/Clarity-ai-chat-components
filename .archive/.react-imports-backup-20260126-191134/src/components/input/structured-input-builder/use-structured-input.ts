'use client'

/**
 * Hook for managing structured input state
 */

import * as React from 'react'
import { estimateTokens } from '../../../utils/tokenization/estimator'
import type {
  StructuredInputField,
  StructuredInputResult,
  TokenBreakdown,
} from './types'
import { defaultFormatPrompt, validateFields } from './utils'

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
 * console.log(result.totalTokens)
 * console.log(result.isValid)
 * ```
 */
export function useStructuredInput(
  fields: StructuredInputField[],
  options?: {
    maxTokens?: number
    formatPrompt?: (
      values: Record<string, string>,
      fields: StructuredInputField[]
    ) => string
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
      if (
        result[field.name] === undefined &&
        field.defaultValue !== undefined
      ) {
        result[field.name] = field.defaultValue
      }
    }
    return result
  }, [fields, initialValues])

  const [values, setValues] =
    React.useState<Record<string, string>>(getInitialValues)

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
