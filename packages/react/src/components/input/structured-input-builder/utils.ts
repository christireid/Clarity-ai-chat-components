/**
 * Utility functions for Structured Input Builder
 */

import type { FieldSection, StructuredInputField } from './types'

/**
 * Simple hash function for generating unique suffixes
 * Returns a short alphanumeric string derived from input
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 4)
}

/**
 * Sanitize a string for use as an HTML ID
 * Replaces invalid characters with hyphens and ensures it starts with a letter.
 * Uses a hash suffix to prevent collisions when different inputs sanitize to the same result.
 */
export function sanitizeHtmlId(id: string): string {
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
export function validateFields(
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
 * Default prompt formatter that creates structured output
 */
export function defaultFormatPrompt(
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
