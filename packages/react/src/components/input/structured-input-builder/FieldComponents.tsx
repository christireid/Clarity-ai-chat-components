'use client'

/**
 * Field components for Structured Input Builder
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type {
  FieldPriority,
  StructuredInputField,
  TokenBreakdown,
} from './types'
import { sanitizeHtmlId } from './utils'

/**
 * Field component for rendering individual inputs
 */
export const FieldInput = React.memo(function FieldInput({
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
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined
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
            <option value="">
              {field.placeholder ?? 'Select an option...'}
            </option>
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
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {field.description}
        </p>
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
export const PriorityBadge = React.memo(function PriorityBadge({
  priority,
}: {
  priority: FieldPriority
}) {
  const colors: Record<FieldPriority, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    medium:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
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
export const TokenUsageBar = React.memo(function TokenUsageBar({
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
            isCritical
              ? 'text-destructive'
              : isWarning
                ? 'text-warning'
                : 'text-foreground'
          )}
        >
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isCritical
              ? 'bg-destructive'
              : isWarning
                ? 'bg-warning'
                : 'bg-primary'
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
