/**
 * Configuration Validator
 *
 * Validates docs-sync configuration using Zod
 * Aligned with @clarity-chat/cli validation patterns
 */

import { z } from 'zod'
import type { DocsSyncConfig } from '../types/index.js'

/** Schema for package configuration */
export const PackageConfigSchema = z.object({
  name: z
    .string()
    .regex(/^@clarity-chat\//, 'Package name must start with @clarity-chat/'),
  path: z.string().min(1, 'Package path is required'),
  entryPoints: z.array(z.string()).min(1, 'At least one entry point required'),
  docsPath: z.string().min(1, 'Docs path is required'),
  generateComponentDocs: z.boolean().optional().default(true),
  generateHookDocs: z.boolean().optional().default(true),
  generateTypeDocs: z.boolean().optional().default(true),
  includePatterns: z.array(z.string()).optional(),
  excludePatterns: z.array(z.string()).optional(),
})

/** Schema for changelog configuration */
export const ChangelogConfigSchema = z.object({
  outputPath: z.string(),
  types: z.array(z.string()),
  includeBreaking: z.boolean().optional().default(true),
})

/** Schema for CI configuration */
export const CIConfigSchema = z.object({
  botName: z.string(),
  botEmail: z.string().email('Invalid bot email'),
  commitPrefix: z.string(),
  createPR: z.boolean().optional().default(false),
})

/** Full configuration schema */
export const DocsSyncConfigSchema = z.object({
  version: z.literal(1, {
    errorMap: () => ({ message: 'Configuration version must be 1' }),
  }),
  rootDir: z.string().optional(),
  docsDir: z.string(),
  apiDataDir: z.string(),
  cacheDir: z.string(),
  packages: z.array(PackageConfigSchema),
  docsRelevantPatterns: z.array(z.string()),
  excludePatterns: z.array(z.string()),
  templatesDir: z.string().optional(),
  repository: z
    .string()
    .regex(
      /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/,
      'Repository must be in owner/repo format'
    )
    .optional(),
  baseUrl: z.string().optional(),
  changelog: ChangelogConfigSchema,
  ci: CIConfigSchema,
})

/** Validation result */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/** Validation error */
export interface ValidationError {
  path: string
  message: string
  value?: unknown
}

/** Convert Zod errors to our error format */
function formatZodErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path.length > 0 ? `/${err.path.join('/')}` : '/',
    message: err.message,
  }))
}

/** Validate full configuration */
export function validateDocsSyncConfig(config: unknown): ValidationResult {
  const result = DocsSyncConfigSchema.safeParse(config)

  if (result.success) {
    return { valid: true, errors: [] }
  }

  return {
    valid: false,
    errors: formatZodErrors(result.error),
  }
}

/** Validate package configuration */
export function validatePackageConfig(pkg: unknown): ValidationResult {
  const result = PackageConfigSchema.safeParse(pkg)

  if (result.success) {
    return { valid: true, errors: [] }
  }

  return {
    valid: false,
    errors: formatZodErrors(result.error),
  }
}

/** Get the JSON schema for external use (generated from Zod) */
export function getConfigSchema(): object {
  // Return a simple representation since Zod doesn't export JSON Schema directly
  // For full JSON Schema support, consider using zod-to-json-schema package
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://clarity-chat.dev/docs-sync-config.schema.json',
    title: 'Docs Sync Configuration',
    description: 'Configuration for @clarity-chat/docs-sync',
    type: 'object',
    required: ['version', 'docsDir', 'apiDataDir', 'cacheDir', 'packages'],
  }
}

/** Semantic validation beyond schema */
export function validateConfigSemantics(
  config: DocsSyncConfig
): ValidationError[] {
  const errors: ValidationError[] = []

  // Check that package paths don't overlap
  const paths = new Set<string>()
  for (const pkg of config.packages) {
    if (paths.has(pkg.path)) {
      errors.push({
        path: '/packages',
        message: `Duplicate package path: ${pkg.path}`,
        value: pkg.path,
      })
    }
    paths.add(pkg.path)
  }

  // Check that package names are unique
  const names = new Set<string>()
  for (const pkg of config.packages) {
    if (names.has(pkg.name)) {
      errors.push({
        path: '/packages',
        message: `Duplicate package name: ${pkg.name}`,
        value: pkg.name,
      })
    }
    names.add(pkg.name)
  }

  // Check that docsDir and apiDataDir are different
  if (config.docsDir === config.apiDataDir) {
    errors.push({
      path: '/docsDir',
      message: 'docsDir and apiDataDir must be different paths',
    })
  }

  // Validate glob patterns are valid
  for (const pattern of config.docsRelevantPatterns) {
    if (pattern.includes('***')) {
      errors.push({
        path: '/docsRelevantPatterns',
        message: `Invalid glob pattern: ${pattern}`,
        value: pattern,
      })
    }
  }

  return errors
}

/** Full validation with schema and semantics */
export function validateConfigFull(config: unknown): ValidationResult {
  // First, validate schema
  const schemaResult = validateDocsSyncConfig(config)
  if (!schemaResult.valid) {
    return schemaResult
  }

  // Then, validate semantics
  const semanticErrors = validateConfigSemantics(config as DocsSyncConfig)

  return {
    valid: semanticErrors.length === 0,
    errors: semanticErrors,
  }
}

/** Format validation errors for display */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''

  const lines = ['Configuration validation failed:', '']

  for (const err of errors) {
    lines.push(`  ❌ ${err.path}: ${err.message}`)
    if (err.value !== undefined) {
      lines.push(`     Value: ${JSON.stringify(err.value)}`)
    }
  }

  return lines.join('\n')
}

/**
 * Validate and parse input with Zod schema
 * Aligned with @clarity-chat/cli validation patterns
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errorMessage?: string
): z.infer<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return result.data
  }

  const messages = result.error.errors.map((e) => e.message)
  throw new Error(errorMessage || `Validation failed: ${messages.join(', ')}`)
}
