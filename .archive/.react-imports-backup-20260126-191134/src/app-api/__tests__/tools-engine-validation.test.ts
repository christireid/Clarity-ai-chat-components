import { describe, it, expect } from 'vitest'
import {
  createToolsEngine,
  registerTool,
  createToolCall,
} from '../tools-engine'
import type { ToolsEngineState } from '../tools-engine'
import type { ToolDefinition } from '../types'

describe('Tools Engine - Enhanced Parameter Validation', () => {
  let state: ToolsEngineState

  beforeEach(() => {
    state = createToolsEngine()
  })

  describe('String Validation', () => {
    it('should validate string minLength', () => {
      const tool: ToolDefinition = {
        name: 'string_tool',
        description: 'String tool',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 3,
            },
          },
          required: ['name'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'string_tool', {
        name: 'abc',
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'string_tool', {
        name: 'ab',
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('at least 3 characters')
    })

    it('should validate string maxLength', () => {
      const tool: ToolDefinition = {
        name: 'string_tool',
        description: 'String tool',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 10,
            },
          },
          required: ['name'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'string_tool', {
        name: 'short',
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'string_tool', {
        name: 'this is too long',
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('at most 10 characters')
    })

    it('should validate string pattern', () => {
      const tool: ToolDefinition = {
        name: 'pattern_tool',
        description: 'Pattern tool',
        parameters: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              pattern: '^[A-Z]{3}$',
            },
          },
          required: ['code'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'pattern_tool', {
        code: 'ABC',
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'pattern_tool', {
        code: 'abc',
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('pattern')
    })

    it('should validate email format', () => {
      const tool: ToolDefinition = {
        name: 'email_tool',
        description: 'Email tool',
        parameters: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
          required: ['email'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'email_tool', {
        email: 'test@example.com',
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'email_tool', {
        email: 'invalid-email',
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('valid email')
    })

    it('should validate URL format', () => {
      const tool: ToolDefinition = {
        name: 'url_tool',
        description: 'URL tool',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'url',
            },
          },
          required: ['url'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'url_tool', {
        url: 'https://example.com',
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'url_tool', {
        url: 'not-a-url',
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('valid url')
    })
  })

  describe('Number Validation', () => {
    it('should validate number minimum', () => {
      const tool: ToolDefinition = {
        name: 'number_tool',
        description: 'Number tool',
        parameters: {
          type: 'object',
          properties: {
            age: {
              type: 'number',
              minimum: 0,
            },
          },
          required: ['age'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'number_tool', {
        age: 25,
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'number_tool', {
        age: -5,
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('>= 0')
    })

    it('should validate number maximum', () => {
      const tool: ToolDefinition = {
        name: 'number_tool',
        description: 'Number tool',
        parameters: {
          type: 'object',
          properties: {
            score: {
              type: 'number',
              maximum: 100,
            },
          },
          required: ['score'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'number_tool', {
        score: 95,
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'number_tool', {
        score: 150,
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('<= 100')
    })

    it('should validate number multipleOf', () => {
      const tool: ToolDefinition = {
        name: 'number_tool',
        description: 'Number tool',
        parameters: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              multipleOf: 5,
            },
          },
          required: ['count'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'number_tool', {
        count: 15,
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'number_tool', {
        count: 7,
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('multiple of 5')
    })

    it('should validate integer type', () => {
      const tool: ToolDefinition = {
        name: 'integer_tool',
        description: 'Integer tool',
        parameters: {
          type: 'object',
          properties: {
            count: {
              type: 'integer',
            },
          },
          required: ['count'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'integer_tool', {
        count: 5,
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid (float)
      const { call: invalidCall } = createToolCall(state, 'integer_tool', {
        count: 5.5,
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('type: integer')
    })
  })

  describe('Array Validation', () => {
    it('should validate array minItems', () => {
      const tool: ToolDefinition = {
        name: 'array_tool',
        description: 'Array tool',
        parameters: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              minItems: 2,
            },
          },
          required: ['items'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'array_tool', {
        items: [1, 2],
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'array_tool', {
        items: [1],
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('at least 2 items')
    })

    it('should validate array maxItems', () => {
      const tool: ToolDefinition = {
        name: 'array_tool',
        description: 'Array tool',
        parameters: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              maxItems: 3,
            },
          },
          required: ['items'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'array_tool', {
        items: [1, 2, 3],
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid
      const { call: invalidCall } = createToolCall(state, 'array_tool', {
        items: [1, 2, 3, 4],
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('at most 3 items')
    })

    it('should validate array item types', () => {
      const tool: ToolDefinition = {
        name: 'array_tool',
        description: 'Array tool',
        parameters: {
          type: 'object',
          properties: {
            numbers: {
              type: 'array',
              items: {
                type: 'number',
              },
            },
          },
          required: ['numbers'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'array_tool', {
        numbers: [1, 2, 3],
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid (contains string)
      const { call: invalidCall } = createToolCall(state, 'array_tool', {
        numbers: [1, 'two', 3],
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('type: number')
    })
  })

  describe('Nested Object Validation', () => {
    it('should validate nested object properties', () => {
      const tool: ToolDefinition = {
        name: 'nested_tool',
        description: 'Nested tool',
        parameters: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                },
                age: {
                  type: 'number',
                  minimum: 0,
                },
              },
            },
          },
          required: ['user'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid
      const { call: validCall } = createToolCall(state, 'nested_tool', {
        user: { name: 'Alice', age: 30 },
      })
      expect(validCall.status).not.toBe('failed')

      // Invalid (nested property fails)
      const { call: invalidCall } = createToolCall(state, 'nested_tool', {
        user: { name: '', age: 30 },
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('user.name')
      expect(invalidCall.error).toContain('at least 1 characters')
    })
  })

  describe('Multiple Type Support', () => {
    it('should accept multiple valid types', () => {
      const tool: ToolDefinition = {
        name: 'multi_type_tool',
        description: 'Multi type tool',
        parameters: {
          type: 'object',
          properties: {
            value: {
              type: ['string', 'number'],
            },
          },
          required: ['value'],
        },
        execute: async (params) => params,
      }

      state = registerTool(state, tool)

      // Valid string
      const { call: validCall1 } = createToolCall(state, 'multi_type_tool', {
        value: 'hello',
      })
      expect(validCall1.status).not.toBe('failed')

      // Valid number
      const { call: validCall2 } = createToolCall(state, 'multi_type_tool', {
        value: 42,
      })
      expect(validCall2.status).not.toBe('failed')

      // Invalid type
      const { call: invalidCall } = createToolCall(state, 'multi_type_tool', {
        value: true,
      })
      expect(invalidCall.status).toBe('failed')
      expect(invalidCall.error).toContain('type: string or number')
    })
  })
})
