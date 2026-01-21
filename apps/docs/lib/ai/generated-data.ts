/**
 * Auto-generated Component and Hook Data
 *
 * This file is auto-generated from source files. It provides metadata
 * about components and hooks for the AI API endpoints.
 */

export interface GeneratedComponent {
  name: string
  file: string
  description?: string
  importPath: string
  props: Array<{
    name: string
    type: string
    required: boolean
    description?: string
  }>
  examples: string[]
  deprecated?: boolean
}

export interface GeneratedHook {
  name: string
  file: string
  description?: string
  importPath: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description?: string
  }>
  returns: Array<{
    name: string
    type: string
    description?: string
  }>
  examples: string[]
  deprecated?: boolean
}

export interface GenerationMetadata {
  generatedAt: string
  sourceFiles: string[]
  totalComponents: number
  totalHooks: number
}

// Empty arrays as fallback - will be populated by build scripts
export const generatedComponents: GeneratedComponent[] = []
export const generatedHooks: GeneratedHook[] = []
export const generationMetadata: GenerationMetadata = {
  generatedAt: new Date().toISOString(),
  sourceFiles: [],
  totalComponents: 0,
  totalHooks: 0,
}
