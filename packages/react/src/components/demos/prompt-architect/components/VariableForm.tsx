'use client'

/**
 * VariableForm Component
 *
 * Auto-generates input fields based on detected variables.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { ExtractedVariable } from '../types'
import { VariableField } from './VariableField'

export interface VariableFormProps {
  /** Extracted variables from templates */
  variables: ExtractedVariable[]
  /** Current variable values */
  values: Record<string, string>
  /** Change handler for individual variable */
  onChange: (name: string, value: string) => void
  /** Whether form is disabled */
  disabled?: boolean
  /** Show type hints */
  showTypeHints?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Dynamic form for template variables
 */
export function VariableForm({
  variables,
  values,
  onChange,
  disabled = false,
  showTypeHints = true,
  className,
}: VariableFormProps) {
  if (variables.length === 0) {
    return (
      <div className={cn('p-4 text-center text-muted-foreground', className)}>
        <p className="text-sm">No variables detected</p>
        <p className="text-xs mt-1">
          Add{' '}
          <code className="px-1 py-0.5 bg-muted rounded text-cyan-600 dark:text-cyan-400">
            {'{{ variable }}'}
          </code>{' '}
          to your prompts
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Variables</h3>
        <span className="text-xs text-muted-foreground">
          {variables.length} detected
        </span>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {variables.map((variable) => (
          <VariableField
            key={variable.name}
            variable={variable}
            value={values[variable.name] ?? ''}
            onChange={(value) => onChange(variable.name, value)}
            disabled={disabled}
            showTypeHint={showTypeHints}
          />
        ))}
      </div>

      {/* Clear button */}
      {variables.length > 0 && (
        <button
          type="button"
          onClick={() => {
            for (const v of variables) {
              onChange(v.name, '')
            }
          }}
          disabled={disabled}
          className={cn(
            'w-full py-2 text-xs text-muted-foreground',
            'hover:text-foreground transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Clear all variables
        </button>
      )}
    </div>
  )
}

export default VariableForm
