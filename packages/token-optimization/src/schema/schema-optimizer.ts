/**
 * Function Schema Optimizer
 *
 * Optimizes OpenAI/Anthropic function schemas to reduce token usage
 * while maintaining functionality.
 *
 * Techniques:
 * - Remove unnecessary properties (title, examples, default)
 * - Flatten nested schemas where possible
 * - Shorten descriptions
 * - Remove optional unused parameters
 * - Simplify enum values
 */

import { encode } from 'gpt-tokenizer'

/**
 * JSON Schema types
 */
export type JSONSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'

export interface JSONSchema {
  type?: JSONSchemaType | JSONSchemaType[]
  description?: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  items?: JSONSchema
  enum?: any[]
  default?: any
  title?: string
  examples?: any[]
  $schema?: string
  $id?: string
  $ref?: string
  additionalProperties?: boolean | JSONSchema
  minItems?: number
  maxItems?: number
  minimum?: number
  maximum?: number
  pattern?: string
  format?: string
  oneOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  allOf?: JSONSchema[]
  not?: JSONSchema
}

export interface FunctionSchema {
  name: string
  description?: string
  parameters: JSONSchema
}

export interface ToolSchema {
  type: 'function'
  function: FunctionSchema
}

/**
 * Schema optimization configuration
 */
export interface SchemaOptimizationConfig {
  /** Remove description fields */
  removeDescriptions?: boolean
  /** Shorten descriptions instead of removing */
  shortenDescriptions?: boolean
  /** Max description length */
  maxDescriptionLength?: number
  /** Remove title fields */
  removeTitles?: boolean
  /** Remove examples */
  removeExamples?: boolean
  /** Remove default values */
  removeDefaults?: boolean
  /** Remove $schema and $id */
  removeMetadata?: boolean
  /** Flatten nested objects where possible */
  flattenNested?: boolean
  /** Remove additionalProperties: false */
  removeAdditionalProperties?: boolean
  /** Remove format constraints */
  removeFormats?: boolean
  /** Remove pattern constraints */
  removePatterns?: boolean
  /** Simplify enums (use shorter values) */
  simplifyEnums?: boolean
  /** Minimum required properties to keep object (else flatten) */
  minPropertiesForObject?: number
}

/**
 * Optimization result with metrics
 */
export interface OptimizationResult {
  /** Optimized schema */
  schema: FunctionSchema | ToolSchema
  /** Original token count */
  tokensBefore: number
  /** Optimized token count */
  tokensAfter: number
  /** Tokens saved */
  tokensSaved: number
  /** Percentage saved */
  percentageSaved: number
  /** Optimizations applied */
  optimizations: string[]
}

/**
 * Preset optimization levels
 */
export const OPTIMIZATION_PRESETS: Record<
  'conservative' | 'balanced' | 'aggressive',
  SchemaOptimizationConfig
> = {
  conservative: {
    removeDescriptions: false,
    shortenDescriptions: true,
    maxDescriptionLength: 100,
    removeTitles: true,
    removeExamples: true,
    removeDefaults: false,
    removeMetadata: true,
    flattenNested: false,
    removeAdditionalProperties: true,
    removeFormats: false,
    removePatterns: false,
    simplifyEnums: false,
    minPropertiesForObject: 3,
  },
  balanced: {
    removeDescriptions: false,
    shortenDescriptions: true,
    maxDescriptionLength: 50,
    removeTitles: true,
    removeExamples: true,
    removeDefaults: true,
    removeMetadata: true,
    flattenNested: true,
    removeAdditionalProperties: true,
    removeFormats: true,
    removePatterns: true,
    simplifyEnums: true,
    minPropertiesForObject: 2,
  },
  aggressive: {
    removeDescriptions: true,
    shortenDescriptions: false,
    removeTitles: true,
    removeExamples: true,
    removeDefaults: true,
    removeMetadata: true,
    flattenNested: true,
    removeAdditionalProperties: true,
    removeFormats: true,
    removePatterns: true,
    simplifyEnums: true,
    minPropertiesForObject: 1,
  },
}

/**
 * Schema Optimizer
 */
export class SchemaOptimizer {
  private config: Required<SchemaOptimizationConfig>
  private optimizations: string[] = []

  constructor(config: SchemaOptimizationConfig = {}) {
    this.config = {
      removeDescriptions: config.removeDescriptions ?? false,
      shortenDescriptions: config.shortenDescriptions ?? true,
      maxDescriptionLength: config.maxDescriptionLength ?? 50,
      removeTitles: config.removeTitles ?? true,
      removeExamples: config.removeExamples ?? true,
      removeDefaults: config.removeDefaults ?? true,
      removeMetadata: config.removeMetadata ?? true,
      flattenNested: config.flattenNested ?? true,
      removeAdditionalProperties: config.removeAdditionalProperties ?? true,
      removeFormats: config.removeFormats ?? true,
      removePatterns: config.removePatterns ?? false,
      simplifyEnums: config.simplifyEnums ?? false,
      minPropertiesForObject: config.minPropertiesForObject ?? 2,
    }
  }

  /**
   * Optimize a function schema
   */
  optimize(schema: FunctionSchema | ToolSchema): OptimizationResult {
    this.optimizations = []

    // Extract function schema
    const funcSchema =
      'function' in schema ? schema.function : (schema as FunctionSchema)

    // Count original tokens
    const tokensBefore = this.countTokens(funcSchema)

    // Optimize
    const optimized = this.optimizeFunction(funcSchema)

    // Count optimized tokens
    const tokensAfter = this.countTokens(optimized)

    // Calculate savings
    const tokensSaved = tokensBefore - tokensAfter
    const percentageSaved =
      tokensBefore > 0 ? (tokensSaved / tokensBefore) * 100 : 0

    // Reconstruct result
    const result: FunctionSchema | ToolSchema =
      'function' in schema
        ? { type: 'function', function: optimized }
        : optimized

    return {
      schema: result,
      tokensBefore,
      tokensAfter,
      tokensSaved,
      percentageSaved,
      optimizations: this.optimizations,
    }
  }

  /**
   * Optimize function schema
   */
  private optimizeFunction(schema: FunctionSchema): FunctionSchema {
    const optimized: FunctionSchema = {
      name: schema.name,
      parameters: this.optimizeJSONSchema({ ...schema.parameters }),
    }

    // Optimize function description
    if (schema.description) {
      if (this.config.removeDescriptions) {
        this.optimizations.push('Removed function description')
      } else if (this.config.shortenDescriptions) {
        optimized.description = this.shortenDescription(schema.description)
        if (optimized.description !== schema.description) {
          this.optimizations.push('Shortened function description')
        }
      } else {
        optimized.description = schema.description
      }
    }

    return optimized
  }

  /**
   * Optimize JSON schema recursively
   */
  private optimizeJSONSchema(schema: JSONSchema): JSONSchema {
    const optimized: JSONSchema = {}

    // Type is required
    if (schema.type) {
      optimized.type = schema.type
    }

    // Handle description
    if (schema.description) {
      if (!this.config.removeDescriptions) {
        if (this.config.shortenDescriptions) {
          optimized.description = this.shortenDescription(schema.description)
        } else {
          optimized.description = schema.description
        }
      }
    }

    // Remove metadata
    if (this.config.removeMetadata) {
      // Skip $schema, $id
      this.optimizations.push('Removed schema metadata')
    } else {
      if (schema.$schema) optimized.$schema = schema.$schema
      if (schema.$id) optimized.$id = schema.$id
    }

    // Remove title
    if (!this.config.removeTitles && schema.title) {
      optimized.title = schema.title
    } else if (schema.title) {
      this.optimizations.push('Removed title fields')
    }

    // Remove examples
    if (!this.config.removeExamples && schema.examples) {
      optimized.examples = schema.examples
    } else if (schema.examples) {
      this.optimizations.push('Removed examples')
    }

    // Remove defaults
    if (!this.config.removeDefaults && schema.default !== undefined) {
      optimized.default = schema.default
    } else if (schema.default !== undefined) {
      this.optimizations.push('Removed default values')
    }

    // Handle properties (objects)
    if (schema.properties) {
      // Check if we should flatten
      const propertyCount = Object.keys(schema.properties).length
      if (
        this.config.flattenNested &&
        propertyCount < this.config.minPropertiesForObject &&
        !schema.required?.length
      ) {
        // Flatten to simple type if possible
        const firstProp = Object.values(schema.properties)[0]
        if (firstProp && !firstProp.properties) {
          this.optimizations.push('Flattened nested object')
          return this.optimizeJSONSchema(firstProp)
        }
      }

      // Optimize each property
      optimized.properties = {}
      for (const [key, value] of Object.entries(schema.properties)) {
        optimized.properties[key] = this.optimizeJSONSchema(value)
      }

      // Keep required fields
      if (schema.required) {
        optimized.required = schema.required
      }
    }

    // Handle arrays
    if (schema.items) {
      optimized.items = this.optimizeJSONSchema(schema.items)

      // Remove min/max items if not critical
      if (schema.minItems !== undefined) {
        optimized.minItems = schema.minItems
      }
      if (schema.maxItems !== undefined) {
        optimized.maxItems = schema.maxItems
      }
    }

    // Handle enums
    if (schema.enum) {
      if (this.config.simplifyEnums) {
        // Try to shorten enum values
        optimized.enum = schema.enum.map((v) => {
          if (typeof v === 'string' && v.length > 10) {
            return v.substring(0, 10)
          }
          return v
        })
        if (JSON.stringify(optimized.enum) !== JSON.stringify(schema.enum)) {
          this.optimizations.push('Simplified enum values')
        }
      } else {
        optimized.enum = schema.enum
      }
    }

    // Remove additionalProperties
    if (!this.config.removeAdditionalProperties && schema.additionalProperties !== undefined) {
      optimized.additionalProperties = schema.additionalProperties
    } else if (schema.additionalProperties !== undefined) {
      this.optimizations.push('Removed additionalProperties')
    }

    // Remove format
    if (!this.config.removeFormats && schema.format) {
      optimized.format = schema.format
    } else if (schema.format) {
      this.optimizations.push('Removed format constraints')
    }

    // Remove pattern
    if (!this.config.removePatterns && schema.pattern) {
      optimized.pattern = schema.pattern
    } else if (schema.pattern) {
      this.optimizations.push('Removed pattern constraints')
    }

    // Keep numeric constraints
    if (schema.minimum !== undefined) optimized.minimum = schema.minimum
    if (schema.maximum !== undefined) optimized.maximum = schema.maximum

    // Handle composition (oneOf, anyOf, allOf)
    if (schema.oneOf) {
      optimized.oneOf = schema.oneOf.map((s) => this.optimizeJSONSchema(s))
    }
    if (schema.anyOf) {
      optimized.anyOf = schema.anyOf.map((s) => this.optimizeJSONSchema(s))
    }
    if (schema.allOf) {
      optimized.allOf = schema.allOf.map((s) => this.optimizeJSONSchema(s))
    }
    if (schema.not) {
      optimized.not = this.optimizeJSONSchema(schema.not)
    }

    // Handle $ref
    if (schema.$ref) {
      optimized.$ref = schema.$ref
    }

    return optimized
  }

  /**
   * Shorten description while preserving key information
   */
  private shortenDescription(description: string): string {
    if (description.length <= this.config.maxDescriptionLength) {
      return description
    }

    // Remove common filler words
    let shortened = description
      .replace(/\s+(optional|required)\s*$/i, '')
      .replace(/^(The|A|An)\s+/i, '')
      .replace(/\s+\(.*?\)/g, '') // Remove parentheticals
      .replace(/\s{2,}/g, ' ')
      .trim()

    // Truncate if still too long
    if (shortened.length > this.config.maxDescriptionLength) {
      shortened = shortened.substring(0, this.config.maxDescriptionLength).trim()

      // Try to end at a word boundary
      const lastSpace = shortened.lastIndexOf(' ')
      if (lastSpace > this.config.maxDescriptionLength * 0.8) {
        shortened = shortened.substring(0, lastSpace)
      }
    }

    return shortened
  }

  /**
   * Count tokens in schema
   */
  private countTokens(schema: FunctionSchema): number {
    const json = JSON.stringify(schema)
    return encode(json).length
  }
}

/**
 * Quick optimization helper
 */
export function optimizeSchema(
  schema: FunctionSchema | ToolSchema,
  preset: 'conservative' | 'balanced' | 'aggressive' = 'balanced'
): OptimizationResult {
  const optimizer = new SchemaOptimizer(OPTIMIZATION_PRESETS[preset])
  return optimizer.optimize(schema)
}

/**
 * Analyze schema token usage
 */
export interface SchemaAnalysis {
  totalTokens: number
  functionNameTokens: number
  descriptionTokens: number
  parametersTokens: number
  breakdown: {
    type: string
    tokens: number
    percentage: number
  }[]
  recommendations: string[]
}

export function analyzeSchema(
  schema: FunctionSchema | ToolSchema
): SchemaAnalysis {
  const funcSchema =
    'function' in schema ? schema.function : (schema as FunctionSchema)

  const totalTokens = encode(JSON.stringify(funcSchema)).length
  const nameTokens = encode(funcSchema.name).length
  const descTokens = funcSchema.description
    ? encode(funcSchema.description).length
    : 0
  const paramsTokens = encode(JSON.stringify(funcSchema.parameters)).length

  const breakdown = [
    { type: 'name', tokens: nameTokens, percentage: (nameTokens / totalTokens) * 100 },
    { type: 'description', tokens: descTokens, percentage: (descTokens / totalTokens) * 100 },
    { type: 'parameters', tokens: paramsTokens, percentage: (paramsTokens / totalTokens) * 100 },
  ]

  const recommendations: string[] = []

  // Generate recommendations
  if (descTokens > totalTokens * 0.3) {
    recommendations.push('Description uses >30% of tokens - consider shortening')
  }

  if (funcSchema.description && funcSchema.description.length > 100) {
    recommendations.push('Description is verbose - shorten to <100 characters')
  }

  const params = funcSchema.parameters
  if (params.properties) {
    const propCount = Object.keys(params.properties).length
    const requiredCount = params.required?.length || 0

    if (propCount > requiredCount + 3) {
      recommendations.push(
        `${propCount - requiredCount} optional parameters - consider removing unused ones`
      )
    }
  }

  if (JSON.stringify(funcSchema.parameters).includes('title')) {
    recommendations.push('Schema contains title fields - these can be removed')
  }

  if (JSON.stringify(funcSchema.parameters).includes('examples')) {
    recommendations.push('Schema contains examples - these can be removed')
  }

  if (JSON.stringify(funcSchema.parameters).includes('default')) {
    recommendations.push('Schema contains default values - consider removing')
  }

  return {
    totalTokens,
    functionNameTokens: nameTokens,
    descriptionTokens: descTokens,
    parametersTokens: paramsTokens,
    breakdown,
    recommendations,
  }
}

/**
 * Batch optimize multiple schemas
 */
export function optimizeBatch(
  schemas: (FunctionSchema | ToolSchema)[],
  config?: SchemaOptimizationConfig
): {
  results: OptimizationResult[]
  totalTokensBefore: number
  totalTokensAfter: number
  totalTokensSaved: number
  averagePercentageSaved: number
} {
  const optimizer = new SchemaOptimizer(config)
  const results = schemas.map((schema) => optimizer.optimize(schema))

  const totalTokensBefore = results.reduce((sum, r) => sum + r.tokensBefore, 0)
  const totalTokensAfter = results.reduce((sum, r) => sum + r.tokensAfter, 0)
  const totalTokensSaved = totalTokensBefore - totalTokensAfter
  const averagePercentageSaved =
    totalTokensBefore > 0 ? (totalTokensSaved / totalTokensBefore) * 100 : 0

  return {
    results,
    totalTokensBefore,
    totalTokensAfter,
    totalTokensSaved,
    averagePercentageSaved,
  }
}
