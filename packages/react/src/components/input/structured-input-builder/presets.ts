/**
 * Pre-built field configurations for common use cases
 */

import type { StructuredInputField } from './types'

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
  context: (
    overrides?: Partial<StructuredInputField>
  ): StructuredInputField => ({
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
  constraints: (
    overrides?: Partial<StructuredInputField>
  ): StructuredInputField => ({
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
  format: (
    overrides?: Partial<StructuredInputField>
  ): StructuredInputField => ({
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
  examples: (
    overrides?: Partial<StructuredInputField>
  ): StructuredInputField => ({
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
  question: (
    overrides?: Partial<StructuredInputField>
  ): StructuredInputField => ({
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
