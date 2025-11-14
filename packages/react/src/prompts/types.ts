/**
 * Prompt Template System - Types
 * 
 * Flexible prompt management with variables, versioning, and A/B testing.
 * Fully optional and composable.
 */

export interface PromptVariable {
  /** Variable name */
  name: string
  /** Variable description */
  description?: string
  /** Variable type */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  /** Default value */
  default?: any
  /** Whether variable is required */
  required?: boolean
  /** Validation function */
  validate?: (value: any) => boolean | string
}

export interface PromptTemplate {
  /** Template ID */
  id: string
  /** Template name */
  name: string
  /** Template description */
  description?: string
  /** Template content with variables */
  template: string
  /** Variables used in template */
  variables?: PromptVariable[]
  /** Template version */
  version?: string
  /** Template category/tags */
  tags?: string[]
  /** Metadata */
  metadata?: Record<string, any>
}

export interface PromptVersion {
  /** Version ID */
  id: string
  /** Template ID */
  templateId: string
  /** Version number */
  version: string
  /** Template content */
  template: string
  /** When this version was created */
  createdAt: number
  /** Version notes/changelog */
  notes?: string
  /** Whether this is the active version */
  isActive?: boolean
}

export interface PromptVariant {
  /** Variant ID */
  id: string
  /** Variant name */
  name: string
  /** Template content */
  template: string
  /** Variant weight for A/B testing (0-1) */
  weight?: number
  /** Performance metrics */
  metrics?: {
    uses: number
    successRate?: number
    averageScore?: number
  }
}

export interface RenderPromptOptions {
  /** Variable values */
  variables: Record<string, any>
  /** Escape HTML/special characters */
  escape?: boolean
  /** Trim whitespace */
  trim?: boolean
  /** Validation mode */
  validate?: boolean
  /** Custom variable delimiter (default: {{variable}}) */
  delimiter?: { start: string; end: string }
}

export interface PromptRenderResult {
  /** Rendered prompt */
  prompt: string
  /** Variables that were used */
  usedVariables: string[]
  /** Missing required variables */
  missingVariables?: string[]
  /** Validation errors */
  errors?: string[]
  /** Whether render was successful */
  success: boolean
}

