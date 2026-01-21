'use client'

/**
 * VariableField Component
 *
 * A single variable input field with type-appropriate rendering.
 */

import * as React from 'react'
import { cn } from '../../../../utils/cn'
import type { ExtractedVariable, InferredFieldType } from '../types'

export interface VariableFieldProps {
  /** Variable definition */
  variable: ExtractedVariable
  /** Current value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Whether the field is disabled */
  disabled?: boolean
  /** Show inferred type hint */
  showTypeHint?: boolean
}

/**
 * Get placeholder text based on variable type
 */
function getPlaceholder(type: InferredFieldType, name: string): string {
  switch (type) {
    case 'textarea':
      return `Enter ${name.replace(/_/g, ' ')}...`
    case 'number':
      return '0'
    case 'toggle':
      return ''
    default:
      return `Enter ${name.replace(/_/g, ' ')}`
  }
}

/**
 * Single variable input field
 */
export const VariableField = React.memo(function VariableField({
  variable,
  value,
  onChange,
  disabled = false,
  showTypeHint = false,
}: VariableFieldProps) {
  const fieldId = React.useId()
  const { name, displayName, inferredType } = variable

  const baseInputClasses = cn(
    'w-full rounded-md border border-border bg-background',
    'px-3 py-2 text-sm',
    'placeholder:text-muted-foreground/70',
    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-colors duration-200'
  )

  const renderInput = () => {
    switch (inferredType) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder(inferredType, name)}
            disabled={disabled}
            rows={3}
            className={cn(baseInputClasses, 'resize-none font-mono text-xs')}
          />
        )

      case 'number':
        return (
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder(inferredType, name)}
            disabled={disabled}
            className={cn(baseInputClasses, 'font-mono')}
          />
        )

      case 'toggle':
        return (
          <button
            id={fieldId}
            type="button"
            role="switch"
            aria-checked={value === 'true'}
            aria-label={`Toggle ${displayName}`}
            onClick={() => onChange(value === 'true' ? 'false' : 'true')}
            disabled={disabled}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full',
              'transition-colors duration-200',
              value === 'true' ? 'bg-primary' : 'bg-muted',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm',
                'transition-transform duration-200',
                value === 'true' ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        )

      default:
        return (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder(inferredType, name)}
            disabled={disabled}
            className={baseInputClasses}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {displayName}
        </label>
        {showTypeHint && (
          <span className="text-xs text-muted-foreground capitalize">
            {inferredType}
          </span>
        )}
      </div>
      {renderInput()}
    </div>
  )
})

export default VariableField
