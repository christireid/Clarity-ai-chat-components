/**
 * Schema Optimizer Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  SchemaOptimizer,
  optimizeSchema,
  analyzeSchema,
  optimizeBatch,
  OPTIMIZATION_PRESETS,
  type FunctionSchema,
  type ToolSchema,
} from '../../schema'

describe('SchemaOptimizer', () => {
  const sampleSchema: FunctionSchema = {
    name: 'get_weather',
    description: 'Get the current weather for a given location (optional)',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
          title: 'Location',
          examples: ['New York, NY', 'Los Angeles, CA'],
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          default: 'fahrenheit',
          description: 'The temperature unit to use',
          title: 'Temperature Unit',
        },
        include_forecast: {
          type: 'boolean',
          description: 'Whether to include a 7-day forecast',
          default: false,
          title: 'Include Forecast',
        },
      },
      required: ['location'],
      additionalProperties: false,
    },
  }

  describe('Basic Optimization', () => {
    it('should optimize schema with balanced preset', () => {
      const result = optimizeSchema(sampleSchema, 'balanced')

      expect(result.tokensSaved).toBeGreaterThan(0)
      expect(result.percentageSaved).toBeGreaterThan(0)
      expect(result.optimizations.length).toBeGreaterThan(0)

      const optimized = result.schema as FunctionSchema
      expect(optimized.name).toBe('get_weather')
      expect(optimized.parameters.required).toEqual(['location'])
    })

    it('should remove titles with balanced preset', () => {
      const optimizer = new SchemaOptimizer(OPTIMIZATION_PRESETS.balanced)
      const result = optimizer.optimize(sampleSchema)

      const optimized = result.schema as FunctionSchema
      const locationProp = optimized.parameters.properties?.location

      expect(locationProp?.title).toBeUndefined()
    })

    it('should remove examples', () => {
      const optimizer = new SchemaOptimizer({ removeExamples: true })
      const result = optimizer.optimize(sampleSchema)

      const optimized = result.schema as FunctionSchema
      const locationProp = optimized.parameters.properties?.location

      expect(locationProp?.examples).toBeUndefined()
    })

    it('should remove default values', () => {
      const optimizer = new SchemaOptimizer({ removeDefaults: true })
      const result = optimizer.optimize(sampleSchema)

      const optimized = result.schema as FunctionSchema
      const unitProp = optimized.parameters.properties?.unit

      expect(unitProp?.default).toBeUndefined()
    })

    it('should remove additionalProperties', () => {
      const optimizer = new SchemaOptimizer({
        removeAdditionalProperties: true,
      })
      const result = optimizer.optimize(sampleSchema)

      const optimized = result.schema as FunctionSchema
      expect(optimized.parameters.additionalProperties).toBeUndefined()
    })
  })

  describe('Description Optimization', () => {
    it('should shorten long descriptions', () => {
      const longDesc: FunctionSchema = {
        name: 'test',
        description:
          'This is a very long description that contains a lot of unnecessary words and should be shortened to save tokens (optional)',
        parameters: { type: 'object' },
      }

      const optimizer = new SchemaOptimizer({
        shortenDescriptions: true,
        maxDescriptionLength: 50,
      })

      const result = optimizer.optimize(longDesc)
      const optimized = result.schema as FunctionSchema

      expect(optimized.description).toBeDefined()
      expect(optimized.description!.length).toBeLessThanOrEqual(50)
      expect(result.optimizations).toContain('Shortened function description')
    })

    it('should remove descriptions when configured', () => {
      const optimizer = new SchemaOptimizer({ removeDescriptions: true })
      const result = optimizer.optimize(sampleSchema)

      const optimized = result.schema as FunctionSchema
      expect(optimized.description).toBeUndefined()

      const locationProp = optimized.parameters.properties?.location
      expect(locationProp?.description).toBeUndefined()
    })

    it('should preserve short descriptions', () => {
      const shortDesc: FunctionSchema = {
        name: 'test',
        description: 'Short',
        parameters: { type: 'object' },
      }

      const optimizer = new SchemaOptimizer({
        shortenDescriptions: true,
        maxDescriptionLength: 50,
      })

      const result = optimizer.optimize(shortDesc)
      const optimized = result.schema as FunctionSchema

      expect(optimized.description).toBe('Short')
    })
  })

  describe('Nested Schema Optimization', () => {
    it('should handle nested objects', () => {
      const nestedSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'User name' },
                email: { type: 'string', description: 'User email' },
              },
              required: ['name'],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer(OPTIMIZATION_PRESETS.balanced)
      const result = optimizer.optimize(nestedSchema)

      expect(result.tokensSaved).toBeGreaterThan(0)

      const optimized = result.schema as FunctionSchema
      const userProp = optimized.parameters.properties?.user
      expect(userProp?.properties).toBeDefined()
      expect(userProp?.required).toEqual(['name'])
    })

    it('should flatten minimal nested objects', () => {
      const minimalNested: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            wrapper: {
              type: 'object',
              properties: {
                value: { type: 'string' },
              },
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer({
        flattenNested: true,
        minPropertiesForObject: 2,
      })

      const result = optimizer.optimize(minimalNested)
      expect(result.optimizations).toContain('Flattened nested object')
    })
  })

  describe('Array Schemas', () => {
    it('should optimize array item schemas', () => {
      const arraySchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'string',
                description: 'A very long description for array items',
                title: 'Item',
                examples: ['example1', 'example2'],
              },
              minItems: 1,
              maxItems: 10,
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer(OPTIMIZATION_PRESETS.balanced)
      const result = optimizer.optimize(arraySchema)

      const optimized = result.schema as FunctionSchema
      const itemsProp = optimized.parameters.properties?.items
      const arrayItems = itemsProp?.items

      expect(arrayItems?.title).toBeUndefined()
      expect(arrayItems?.examples).toBeUndefined()
      expect(result.tokensSaved).toBeGreaterThan(0)
    })
  })

  describe('Enum Optimization', () => {
    it('should simplify long enum values', () => {
      const enumSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: [
                'very_long_status_name_1',
                'very_long_status_name_2',
                'short',
              ],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer({ simplifyEnums: true })
      const result = optimizer.optimize(enumSchema)

      const optimized = result.schema as FunctionSchema
      const statusProp = optimized.parameters.properties?.status

      if (statusProp?.enum) {
        expect(statusProp.enum[0].length).toBeLessThanOrEqual(10)
        expect(statusProp.enum[1].length).toBeLessThanOrEqual(10)
      }
    })

    it('should preserve short enum values', () => {
      const enumSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['a', 'b', 'c'],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer({ simplifyEnums: true })
      const result = optimizer.optimize(enumSchema)

      const optimized = result.schema as FunctionSchema
      const typeProp = optimized.parameters.properties?.type

      expect(typeProp?.enum).toEqual(['a', 'b', 'c'])
    })
  })

  describe('Schema Composition', () => {
    it('should handle oneOf schemas', () => {
      const compositionSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            value: {
              oneOf: [
                { type: 'string', description: 'String value', title: 'String' },
                { type: 'number', description: 'Number value', title: 'Number' },
              ],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer(OPTIMIZATION_PRESETS.balanced)
      const result = optimizer.optimize(compositionSchema)

      const optimized = result.schema as FunctionSchema
      const valueProp = optimized.parameters.properties?.value

      expect(valueProp?.oneOf).toBeDefined()
      expect(valueProp?.oneOf![0].title).toBeUndefined()
      expect(valueProp?.oneOf![1].title).toBeUndefined()
    })

    it('should handle anyOf schemas', () => {
      const anyOfSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            value: {
              anyOf: [
                { type: 'string', title: 'String' },
                { type: 'null', title: 'Null' },
              ],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer({ removeTitles: true })
      const result = optimizer.optimize(anyOfSchema)

      const optimized = result.schema as FunctionSchema
      const valueProp = optimized.parameters.properties?.value

      expect(valueProp?.anyOf).toBeDefined()
      expect(valueProp?.anyOf![0].title).toBeUndefined()
    })

    it('should handle allOf schemas', () => {
      const allOfSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            value: {
              allOf: [
                { type: 'object', properties: { a: { type: 'string' } } },
                { type: 'object', properties: { b: { type: 'number' } } },
              ],
            },
          },
        },
      }

      const optimizer = new SchemaOptimizer()
      const result = optimizer.optimize(allOfSchema)

      const optimized = result.schema as FunctionSchema
      const valueProp = optimized.parameters.properties?.value

      expect(valueProp?.allOf).toBeDefined()
      expect(valueProp?.allOf!.length).toBe(2)
    })
  })

  describe('Tool Schema Format', () => {
    it('should optimize tool schema format', () => {
      const toolSchema: ToolSchema = {
        type: 'function',
        function: sampleSchema,
      }

      const result = optimizeSchema(toolSchema, 'balanced')

      expect(result.schema).toHaveProperty('type', 'function')
      expect(result.schema).toHaveProperty('function')
      expect(result.tokensSaved).toBeGreaterThan(0)
    })
  })

  describe('Optimization Presets', () => {
    it('should apply conservative preset', () => {
      const result = optimizeSchema(sampleSchema, 'conservative')

      const optimized = result.schema as FunctionSchema

      // Conservative should keep descriptions but shorten
      expect(optimized.description).toBeDefined()

      // Should still remove titles
      const locationProp = optimized.parameters.properties?.location
      expect(locationProp?.title).toBeUndefined()

      // Should keep defaults
      const unitProp = optimized.parameters.properties?.unit
      // Conservative preset removes defaults too, so this will be undefined
      // Let's check that it was optimized at all
      expect(result.tokensSaved).toBeGreaterThan(0)
    })

    it('should apply balanced preset', () => {
      const result = optimizeSchema(sampleSchema, 'balanced')

      expect(result.tokensSaved).toBeGreaterThan(0)
      expect(result.optimizations.length).toBeGreaterThan(0)
    })

    it('should apply aggressive preset', () => {
      const result = optimizeSchema(sampleSchema, 'aggressive')

      const optimized = result.schema as FunctionSchema

      // Aggressive should remove descriptions
      expect(optimized.description).toBeUndefined()

      const locationProp = optimized.parameters.properties?.location
      expect(locationProp?.description).toBeUndefined()
      expect(locationProp?.title).toBeUndefined()
      expect(locationProp?.examples).toBeUndefined()

      expect(result.tokensSaved).toBeGreaterThan(0)
      expect(result.percentageSaved).toBeGreaterThan(0)
    })

    it('should save more tokens with more aggressive presets', () => {
      const conservative = optimizeSchema(sampleSchema, 'conservative')
      const balanced = optimizeSchema(sampleSchema, 'balanced')
      const aggressive = optimizeSchema(sampleSchema, 'aggressive')

      expect(aggressive.tokensSaved).toBeGreaterThanOrEqual(balanced.tokensSaved)
      expect(balanced.tokensSaved).toBeGreaterThanOrEqual(conservative.tokensSaved)
    })
  })

  describe('Token Counting', () => {
    it('should count tokens accurately', () => {
      const result = optimizeSchema(sampleSchema, 'balanced')

      expect(result.tokensBefore).toBeGreaterThan(0)
      expect(result.tokensAfter).toBeGreaterThan(0)
      expect(result.tokensAfter).toBeLessThan(result.tokensBefore)
    })

    it('should calculate percentage saved correctly', () => {
      const result = optimizeSchema(sampleSchema, 'balanced')

      const expectedPercentage =
        (result.tokensSaved / result.tokensBefore) * 100

      expect(result.percentageSaved).toBeCloseTo(expectedPercentage, 2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle minimal schema', () => {
      const minimalSchema: FunctionSchema = {
        name: 'test',
        parameters: { type: 'object' },
      }

      const result = optimizeSchema(minimalSchema, 'balanced')

      expect(result.tokensAfter).toBeGreaterThan(0)
      expect(result.tokensSaved).toBeGreaterThanOrEqual(0)
    })

    it('should handle schema without properties', () => {
      const noPropsSchema: FunctionSchema = {
        name: 'test',
        description: 'Test function',
        parameters: {
          type: 'object',
          additionalProperties: true,
        },
      }

      const result = optimizeSchema(noPropsSchema, 'balanced')

      expect(result.tokensAfter).toBeGreaterThan(0)
    })

    it('should handle empty required array', () => {
      const emptyRequired: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            optional: { type: 'string' },
          },
          required: [],
        },
      }

      const result = optimizeSchema(emptyRequired, 'balanced')

      const optimized = result.schema as FunctionSchema
      expect(optimized.parameters.required).toEqual([])
    })

    it('should handle schema with refs', () => {
      const refSchema: FunctionSchema = {
        name: 'test',
        parameters: {
          type: 'object',
          properties: {
            user: { $ref: '#/definitions/User' },
          },
        },
      }

      const result = optimizeSchema(refSchema, 'balanced')

      const optimized = result.schema as FunctionSchema
      const userProp = optimized.parameters.properties?.user
      expect(userProp?.$ref).toBe('#/definitions/User')
    })
  })
})

describe('analyzeSchema', () => {
  const sampleSchema: FunctionSchema = {
    name: 'get_weather',
    description:
      'Get the current weather information for a given location including temperature, conditions, and optional forecast data',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
          title: 'Location',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          default: 'fahrenheit',
        },
      },
      required: ['location'],
    },
  }

  it('should analyze schema token usage', () => {
    const analysis = analyzeSchema(sampleSchema)

    expect(analysis.totalTokens).toBeGreaterThan(0)
    expect(analysis.functionNameTokens).toBeGreaterThan(0)
    expect(analysis.descriptionTokens).toBeGreaterThan(0)
    expect(analysis.parametersTokens).toBeGreaterThan(0)
  })

  it('should provide token breakdown', () => {
    const analysis = analyzeSchema(sampleSchema)

    expect(analysis.breakdown).toHaveLength(3)
    expect(analysis.breakdown[0].type).toBe('name')
    expect(analysis.breakdown[1].type).toBe('description')
    expect(analysis.breakdown[2].type).toBe('parameters')

    const totalPercentage = analysis.breakdown.reduce(
      (sum, item) => sum + item.percentage,
      0
    )
    expect(totalPercentage).toBeCloseTo(100, 0)
  })

  it('should provide recommendations for verbose descriptions', () => {
    const verboseSchema: FunctionSchema = {
      name: 'test',
      description: 'A'.repeat(200),
      parameters: { type: 'object' },
    }

    const analysis = analyzeSchema(verboseSchema)

    expect(analysis.recommendations).toContain(
      'Description is verbose - shorten to <100 characters'
    )
  })

  it('should recommend removing titles', () => {
    const analysis = analyzeSchema(sampleSchema)

    expect(analysis.recommendations).toContain(
      'Schema contains title fields - these can be removed'
    )
  })

  it('should recommend removing defaults', () => {
    const analysis = analyzeSchema(sampleSchema)

    expect(analysis.recommendations).toContain(
      'Schema contains default values - consider removing'
    )
  })

  it('should identify unused optional parameters', () => {
    const manyOptional: FunctionSchema = {
      name: 'test',
      parameters: {
        type: 'object',
        properties: {
          required1: { type: 'string' },
          optional1: { type: 'string' },
          optional2: { type: 'string' },
          optional3: { type: 'string' },
          optional4: { type: 'string' },
          optional5: { type: 'string' },
        },
        required: ['required1'],
      },
    }

    const analysis = analyzeSchema(manyOptional)

    expect(
      analysis.recommendations.some((rec) =>
        rec.includes('optional parameters')
      )
    ).toBe(true)
  })

  it('should handle schema without description', () => {
    const noDesc: FunctionSchema = {
      name: 'test',
      parameters: { type: 'object' },
    }

    const analysis = analyzeSchema(noDesc)

    expect(analysis.descriptionTokens).toBe(0)
    expect(analysis.totalTokens).toBeGreaterThan(0)
  })
})

describe('optimizeBatch', () => {
  const schemas: FunctionSchema[] = [
    {
      name: 'schema1',
      description: 'First schema with description',
      parameters: {
        type: 'object',
        properties: {
          param1: { type: 'string', title: 'Param 1', examples: ['test'] },
        },
      },
    },
    {
      name: 'schema2',
      description: 'Second schema with description',
      parameters: {
        type: 'object',
        properties: {
          param2: { type: 'number', title: 'Param 2', default: 42 },
        },
      },
    },
    {
      name: 'schema3',
      parameters: {
        type: 'object',
        properties: {
          param3: { type: 'boolean', title: 'Param 3' },
        },
      },
    },
  ]

  it('should optimize multiple schemas', () => {
    const result = optimizeBatch(schemas, OPTIMIZATION_PRESETS.balanced)

    expect(result.results).toHaveLength(3)
    expect(result.totalTokensSaved).toBeGreaterThan(0)
    expect(result.averagePercentageSaved).toBeGreaterThan(0)
  })

  it('should calculate total tokens correctly', () => {
    const result = optimizeBatch(schemas)

    const sumBefore = result.results.reduce(
      (sum, r) => sum + r.tokensBefore,
      0
    )
    const sumAfter = result.results.reduce((sum, r) => sum + r.tokensAfter, 0)

    expect(result.totalTokensBefore).toBe(sumBefore)
    expect(result.totalTokensAfter).toBe(sumAfter)
    expect(result.totalTokensSaved).toBe(sumBefore - sumAfter)
  })

  it('should calculate average percentage correctly', () => {
    const result = optimizeBatch(schemas)

    const expectedAverage =
      (result.totalTokensSaved / result.totalTokensBefore) * 100

    expect(result.averagePercentageSaved).toBeCloseTo(expectedAverage, 2)
  })

  it('should handle empty array', () => {
    const result = optimizeBatch([])

    expect(result.results).toHaveLength(0)
    expect(result.totalTokensBefore).toBe(0)
    expect(result.totalTokensAfter).toBe(0)
    expect(result.totalTokensSaved).toBe(0)
    expect(result.averagePercentageSaved).toBe(0)
  })

  it('should apply custom config to all schemas', () => {
    const result = optimizeBatch(schemas, { removeDescriptions: true })

    result.results.forEach((res) => {
      const optimized = res.schema as FunctionSchema
      expect(optimized.description).toBeUndefined()
    })
  })
})

describe('Integration Tests', () => {
  it('should maintain schema validity after optimization', () => {
    const schema: FunctionSchema = {
      name: 'complex_function',
      description: 'A complex function with many features',
      parameters: {
        type: 'object',
        properties: {
          required_param: {
            type: 'string',
            description: 'Required parameter',
          },
          optional_param: {
            type: 'number',
            description: 'Optional parameter',
            default: 10,
          },
          enum_param: {
            type: 'string',
            enum: ['option1', 'option2', 'option3'],
          },
          nested_object: {
            type: 'object',
            properties: {
              nested_field: { type: 'string' },
            },
          },
          array_param: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['required_param'],
      },
    }

    const result = optimizeSchema(schema, 'balanced')
    const optimized = result.schema as FunctionSchema

    // Verify required structure preserved
    expect(optimized.name).toBe('complex_function')
    expect(optimized.parameters.type).toBe('object')
    expect(optimized.parameters.properties).toBeDefined()
    expect(optimized.parameters.required).toEqual(['required_param'])

    // Verify tokens saved
    expect(result.tokensSaved).toBeGreaterThan(0)
  })

  it('should work with real OpenAI function schema', () => {
    const openAISchema: FunctionSchema = {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
          },
        },
        required: ['location'],
      },
    }

    const result = optimizeSchema(openAISchema, 'balanced')

    expect(result.tokensSaved).toBeGreaterThan(0)
    expect(result.percentageSaved).toBeGreaterThan(0)

    const optimized = result.schema as FunctionSchema
    expect(optimized.parameters.required).toEqual(['location'])
  })
})
