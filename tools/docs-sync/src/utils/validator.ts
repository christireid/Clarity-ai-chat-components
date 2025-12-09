/**
 * Configuration Validator
 *
 * Validates docs-sync configuration using JSON Schema
 */

import Ajv, { type ValidateFunction, type ErrorObject } from 'ajv'
import type { DocsSyncConfig } from '../types/index.js'

/** JSON Schema for package configuration */
const packageConfigSchema = {
  type: 'object',
  required: ['name', 'path', 'entryPoints', 'docsPath'],
  properties: {
    name: {
      type: 'string',
      pattern: '^@clarity-chat/',
      description: 'Package name (e.g., @clarity-chat/react)',
    },
    path: {
      type: 'string',
      description: 'Path to package root relative to repo root',
    },
    entryPoints: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      description: 'Entry points for API extraction',
    },
    docsPath: {
      type: 'string',
      description: 'Output path for generated docs',
    },
    generateComponentDocs: {
      type: 'boolean',
      default: true,
    },
    generateHookDocs: {
      type: 'boolean',
      default: true,
    },
    generateTypeDocs: {
      type: 'boolean',
      default: true,
    },
    includePatterns: {
      type: 'array',
      items: { type: 'string' },
    },
    excludePatterns: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  additionalProperties: false,
}

/** JSON Schema for full configuration */
const configSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://clarity-chat.dev/docs-sync-config.schema.json',
  title: 'Docs Sync Configuration',
  description: 'Configuration for @clarity-chat/docs-sync',
  type: 'object',
  required: ['version'],
  properties: {
    version: {
      type: 'number',
      const: 1,
      description: 'Configuration version',
    },
    rootDir: {
      type: 'string',
      description: 'Repository root path',
    },
    docsDir: {
      type: 'string',
      description: 'Path to documentation site content',
    },
    apiDataDir: {
      type: 'string',
      description: 'Path to generated API data',
    },
    cacheDir: {
      type: 'string',
      description: 'Path to cache directory',
    },
    packages: {
      type: 'array',
      items: packageConfigSchema,
      description: 'Packages to process',
    },
    docsRelevantPatterns: {
      type: 'array',
      items: { type: 'string' },
      description: 'Glob patterns for docs-relevant files',
    },
    excludePatterns: {
      type: 'array',
      items: { type: 'string' },
      description: 'Glob patterns to exclude',
    },
    templatesDir: {
      type: 'string',
      description: 'Template directory path',
    },
    repository: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-]+/[a-zA-Z0-9-]+$',
      description: 'GitHub repository (owner/repo)',
    },
    baseUrl: {
      type: 'string',
      description: 'Base URL for documentation links',
    },
    changelog: {
      type: 'object',
      properties: {
        outputPath: { type: 'string' },
        types: {
          type: 'array',
          items: { type: 'string' },
        },
        includeBreaking: { type: 'boolean' },
      },
    },
    ci: {
      type: 'object',
      properties: {
        botName: { type: 'string' },
        botEmail: {
          type: 'string',
          format: 'email',
        },
        commitPrefix: { type: 'string' },
        createPR: { type: 'boolean' },
      },
    },
  },
  additionalProperties: false,
}

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

/** Convert AJV errors to our error format */
function formatErrors(
  errors: ErrorObject[] | null | undefined
): ValidationError[] {
  if (!errors) return []

  return errors.map((err) => ({
    path: err.instancePath || '/',
    message: err.message ?? 'Unknown validation error',
    value: err.data,
  }))
}

/** Create validator instance */
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false,
})

// Add email format validation
ajv.addFormat('email', {
  type: 'string',
  validate: (x: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x),
})

const validateConfig: ValidateFunction = ajv.compile(configSchema)
const validatePackage: ValidateFunction = ajv.compile(packageConfigSchema)

/** Validate full configuration */
export function validateDocsSyncConfig(config: unknown): ValidationResult {
  const valid = validateConfig(config)

  return {
    valid,
    errors: formatErrors(validateConfig.errors),
  }
}

/** Validate package configuration */
export function validatePackageConfig(pkg: unknown): ValidationResult {
  const valid = validatePackage(pkg)

  return {
    valid,
    errors: formatErrors(validatePackage.errors),
  }
}

/** Get the JSON schema for external use */
export function getConfigSchema(): object {
  return configSchema
}

/** Semantic validation beyond JSON Schema */
export function validateConfigSemantics(
  config: DocsSyncConfig
): ValidationError[] {
  const errors: ValidationError[] = []

  // Check that package paths don't overlap
  const paths = new Set<string>()
  for (const pkg of config.packages) {
    if (paths.has(pkg.path)) {
      errors.push({
        path: `/packages`,
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
        path: `/packages`,
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
