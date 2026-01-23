import { describe, it, expect, vi } from 'vitest'
import {
  toOpenAIFunction,
  toOpenAIFunctions,
  fromOpenAIFunction,
  parseOpenAIToolCallArguments,
  fromLegacyAgentTool,
  fromLegacyEngineTool,
  detectToolFormat,
  toCanonicalFormat,
  convertToolsToCanonical,
  convertToolsToOpenAI,
  isOpenAICompatible,
  getOpenAICompatibilityWarnings,
  type OpenAIFunction,
  type LegacyAgentTool,
  type LegacyEngineToolDefinition,
} from '../tool-formats'
import type { ToolDefinition } from '../../types/tool-definition'

describe('Tool Format Adapters', () => {
  const mockExecute = vi.fn((_args, _context) => Promise.resolve('result'))

  const canonicalTool: ToolDefinition = {
    name: 'test_tool',
    description: 'A test tool',
    parameters: {
      type: 'object',
      properties: {
        arg1: { type: 'string' },
      },
      required: ['arg1'],
    },
    execute: mockExecute,
    requiresApproval: true,
  }

  const openaiFunction: OpenAIFunction = {
    type: 'function',
    function: {
      name: 'test_tool',
      description: 'A test tool',
      parameters: {
        type: 'object',
        properties: {
          arg1: { type: 'string' },
        },
        required: ['arg1'],
      },
    },
  }

  describe('Canonical -> OpenAI', () => {
    it('should convert canonical tool to OpenAI function', () => {
      const result = toOpenAIFunction(canonicalTool)
      expect(result).toEqual(openaiFunction)
    })

    it('should convert multiple canonical tools to OpenAI functions', () => {
      const result = toOpenAIFunctions([canonicalTool])
      expect(result).toEqual([openaiFunction])
      expect(convertToolsToOpenAI([canonicalTool])).toEqual([openaiFunction])
    })
  })

  describe('OpenAI -> Canonical', () => {
    it('should convert OpenAI function to canonical tool', () => {
      const result = fromOpenAIFunction(openaiFunction, mockExecute)

      expect(result.name).toBe(canonicalTool.name)
      expect(result.description).toBe(canonicalTool.description)
      expect(result.parameters).toEqual(canonicalTool.parameters)
      expect(result.execute).toBe(mockExecute)
    })

    it('should include additional options', () => {
      const result = fromOpenAIFunction(openaiFunction, mockExecute, {
        requiresApproval: true,
      })
      expect(result.requiresApproval).toBe(true)
    })
  })

  describe('Tool Call Parsing', () => {
    it('should parse valid JSON arguments', () => {
      const toolCall = {
        id: 'call_123',
        type: 'function' as const,
        function: {
          name: 'test_tool',
          arguments: '{"arg1": "value1"}',
        },
      }

      const args = parseOpenAIToolCallArguments(toolCall)
      expect(args).toEqual({ arg1: 'value1' })
    })

    it('should throw error for invalid JSON', () => {
      const toolCall = {
        id: 'call_123',
        type: 'function' as const,
        function: {
          name: 'test_tool',
          arguments: '{invalid}',
        },
      }

      expect(() => parseOpenAIToolCallArguments(toolCall)).toThrow()
    })
  })

  describe('Legacy Formats', () => {
    it('should convert legacy agent tool', async () => {
      const legacyTool: LegacyAgentTool = {
        name: 'legacy_tool',
        description: 'Legacy description',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => 'legacy result',
        requiresApproval: true,
        category: 'test',
        tags: ['tag1'],
      }

      const result = fromLegacyAgentTool(legacyTool)
      expect(result.name).toBe(legacyTool.name)
      expect(result.requiresApproval).toBe(true)
      expect(result.category).toBe('test')
      expect(result.tags).toEqual(['tag1'])

      // Check execution wrapper
      const execResult = await result.execute({}, {} as any)
      expect(execResult).toBe('legacy result')
    })

    it('should convert legacy engine tool', async () => {
      const legacyTool: LegacyEngineToolDefinition = {
        name: 'engine_tool',
        description: 'Engine description',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => 'engine result',
      }

      const result = fromLegacyEngineTool(legacyTool)
      expect(result.name).toBe(legacyTool.name)

      // Check execution wrapper
      const execResult = await result.execute({}, {} as any)
      expect(execResult).toBe('engine result')
    })
  })

  describe('Format Detection', () => {
    it('should detect canonical format', () => {
      expect(detectToolFormat(canonicalTool)).toBe('canonical')
    })

    it('should detect OpenAI format', () => {
      expect(detectToolFormat(openaiFunction)).toBe('openai')
    })

    it('should detect legacy agent format', () => {
      const legacyTool = {
        name: 'legacy',
        description: 'desc',
        parameters: {},
        execute: () => {},
        category: 'cat',
      }
      expect(detectToolFormat(legacyTool)).toBe('legacy-agent')
    })

    it('should detect legacy engine format', () => {
      const legacyTool = {
        name: 'legacy',
        description: 'desc',
        parameters: {},
        execute: (params: any) => {}, // 1 arg
      }
      expect(detectToolFormat(legacyTool)).toBe('legacy-engine')
    })

    it('should return unknown for invalid objects', () => {
      expect(detectToolFormat(null)).toBe('unknown')
      expect(detectToolFormat({})).toBe('unknown')
    })
  })

  describe('Auto Conversion', () => {
    it('should pass through canonical tools', () => {
      const result = toCanonicalFormat(canonicalTool)
      expect(result).toBe(canonicalTool)
    })

    it('should convert OpenAI format with execute function', () => {
      const result = toCanonicalFormat(openaiFunction, mockExecute)
      expect(result.name).toBe(openaiFunction.function.name)
      expect(result.execute).toBe(mockExecute)
    })

    it('should throw when converting OpenAI without execute function', () => {
      expect(() => toCanonicalFormat(openaiFunction)).toThrow()
    })

    it('should convert legacy formats', () => {
      const legacyTool: LegacyEngineToolDefinition = {
        name: 'engine_tool',
        description: 'Engine description',
        parameters: { type: 'object', properties: {} },
        execute: async () => 'result',
      }
      const result = toCanonicalFormat(legacyTool)
      expect(result.name).toBe(legacyTool.name)
    })

    it('should convert array of tools', () => {
      const executeMap = new Map()
      executeMap.set(openaiFunction.function.name, mockExecute)

      const results = convertToolsToCanonical(
        [canonicalTool, openaiFunction],
        executeMap
      )

      expect(results).toHaveLength(2)
      expect(results[0]).toBe(canonicalTool)
      expect(results[1].name).toBe(openaiFunction.function.name)
    })
  })

  describe('Validation', () => {
    it('should validate OpenAI compatible tool', () => {
      expect(isOpenAICompatible(canonicalTool)).toBe(true)
      expect(getOpenAICompatibilityWarnings(canonicalTool)).toHaveLength(1) // requiresApproval lost
    })

    it('should detect incompatible tool names', () => {
      const tool = { ...canonicalTool, name: 'invalid name' }
      expect(isOpenAICompatible(tool)).toBe(false)
      expect(getOpenAICompatibilityWarnings(tool)).toContainEqual(
        expect.stringContaining('Tool name')
      )
    })

    it('should detect missing description', () => {
      const tool = { ...canonicalTool, description: '' }
      expect(isOpenAICompatible(tool)).toBe(false)
      expect(getOpenAICompatibilityWarnings(tool)).toContainEqual(
        expect.stringContaining('description is required')
      )
    })

    it('should list lost properties', () => {
      const tool = {
        ...canonicalTool,
        requiresApproval: true,
        timeout: 1000,
        category: 'utils',
      }
      const warnings = getOpenAICompatibilityWarnings(tool)
      const lostPropsWarning = warnings.find((w) =>
        w.startsWith('Properties will not be preserved')
      )

      expect(lostPropsWarning).toContain('requiresApproval')
      expect(lostPropsWarning).toContain('timeout')
      expect(lostPropsWarning).toContain('category')
    })
  })
})
