import { describe, it, expect } from 'vitest'
import { calculatorTool, builtInTools } from '../tools'
import { ToolRegistry } from '../../core/tool-registry'

describe('calculatorTool', () => {
  describe('basic operations', () => {
    it('should add two numbers', async () => {
      const result = await calculatorTool.execute({ expression: '2 + 3' })
      expect(result).toEqual({ result: 5, expression: '2 + 3' })
    })

    it('should subtract two numbers', async () => {
      const result = await calculatorTool.execute({ expression: '10 - 4' })
      expect(result).toEqual({ result: 6, expression: '10 - 4' })
    })

    it('should multiply two numbers', async () => {
      const result = await calculatorTool.execute({ expression: '3 * 4' })
      expect(result).toEqual({ result: 12, expression: '3 * 4' })
    })

    it('should divide two numbers', async () => {
      const result = await calculatorTool.execute({ expression: '20 / 4' })
      expect(result).toEqual({ result: 5, expression: '20 / 4' })
    })
  })

  describe('operator precedence', () => {
    it('should respect multiplication precedence over addition', async () => {
      const result = await calculatorTool.execute({ expression: '2 + 3 * 4' })
      expect(result).toEqual({ result: 14, expression: '2 + 3 * 4' })
    })

    it('should respect division precedence over subtraction', async () => {
      const result = await calculatorTool.execute({ expression: '10 - 4 / 2' })
      expect(result).toEqual({ result: 8, expression: '10 - 4 / 2' })
    })

    it('should evaluate parentheses first', async () => {
      const result = await calculatorTool.execute({ expression: '(2 + 3) * 4' })
      expect(result).toEqual({ result: 20, expression: '(2 + 3) * 4' })
    })

    it('should handle nested parentheses', async () => {
      const result = await calculatorTool.execute({
        expression: '((2 + 3) * (4 - 1))',
      })
      expect(result).toEqual({ result: 15, expression: '((2 + 3) * (4 - 1))' })
    })
  })

  describe('decimal numbers', () => {
    it('should handle decimal numbers', async () => {
      const result = await calculatorTool.execute({ expression: '1.5 + 2.5' })
      expect(result).toEqual({ result: 4, expression: '1.5 + 2.5' })
    })

    it('should handle numbers starting with decimal', async () => {
      const result = await calculatorTool.execute({ expression: '.5 + .5' })
      expect(result).toEqual({ result: 1, expression: '.5 + .5' })
    })

    it('should reject multiple decimal points in one number', async () => {
      await expect(
        calculatorTool.execute({ expression: '1.2.3 + 1' })
      ).rejects.toThrow('Invalid number: multiple decimal points')
    })
  })

  describe('unary operators', () => {
    it('should handle unary minus', async () => {
      const result = await calculatorTool.execute({ expression: '-5 + 3' })
      expect(result).toEqual({ result: -2, expression: '-5 + 3' })
    })

    it('should handle unary plus', async () => {
      const result = await calculatorTool.execute({ expression: '+5 + +3' })
      expect(result).toEqual({ result: 8, expression: '+5 + +3' })
    })

    it('should handle double negative', async () => {
      const result = await calculatorTool.execute({ expression: '--5' })
      expect(result).toEqual({ result: 5, expression: '--5' })
    })
  })

  describe('whitespace handling', () => {
    it('should ignore whitespace', async () => {
      const result = await calculatorTool.execute({ expression: '  2  +  3  ' })
      expect(result).toEqual({ result: 5, expression: '  2  +  3  ' })
    })

    it('should work without whitespace', async () => {
      const result = await calculatorTool.execute({ expression: '2+3*4' })
      expect(result).toEqual({ result: 14, expression: '2+3*4' })
    })
  })

  describe('error handling', () => {
    it('should throw on division by zero', async () => {
      await expect(
        calculatorTool.execute({ expression: '1 / 0' })
      ).rejects.toThrow('Division by zero')
    })

    it('should throw on invalid characters', async () => {
      await expect(
        calculatorTool.execute({ expression: '2 + a' })
      ).rejects.toThrow('Invalid character')
    })

    it('should throw on missing closing parenthesis', async () => {
      await expect(
        calculatorTool.execute({ expression: '(2 + 3' })
      ).rejects.toThrow('Missing closing parenthesis')
    })

    it('should throw on unexpected tokens', async () => {
      await expect(
        calculatorTool.execute({ expression: '2 3' })
      ).rejects.toThrow('Unexpected token')
    })

    it('should throw on empty expression', async () => {
      await expect(calculatorTool.execute({ expression: '' })).rejects.toThrow(
        'Unexpected end of expression'
      )
    })

    it('should throw on non-string expression', async () => {
      await expect(
        calculatorTool.execute({ expression: 123 as unknown as string })
      ).rejects.toThrow('Expression must be a string')
    })
  })

  describe('DoS protection', () => {
    it('should reject expressions over 1000 characters', async () => {
      const longExpression = '1' + '+1'.repeat(500)
      await expect(
        calculatorTool.execute({ expression: longExpression })
      ).rejects.toThrow('Expression too long')
    })

    it('should reject deeply nested expressions', async () => {
      const deeplyNested = '('.repeat(101) + '1' + ')'.repeat(101)
      await expect(
        calculatorTool.execute({ expression: deeplyNested })
      ).rejects.toThrow('Expression too deeply nested')
    })
  })

  describe('edge cases', () => {
    it('should handle single number', async () => {
      const result = await calculatorTool.execute({ expression: '42' })
      expect(result).toEqual({ result: 42, expression: '42' })
    })

    it('should handle result of zero', async () => {
      const result = await calculatorTool.execute({ expression: '5 - 5' })
      expect(result).toEqual({ result: 0, expression: '5 - 5' })
    })

    it('should handle negative result', async () => {
      const result = await calculatorTool.execute({ expression: '3 - 10' })
      expect(result).toEqual({ result: -7, expression: '3 - 10' })
    })

    it('should handle large numbers', async () => {
      const result = await calculatorTool.execute({
        expression: '999999 * 999999',
      })
      expect(result).toEqual({
        result: 999998000001,
        expression: '999999 * 999999',
      })
    })
  })
})

describe('ToolRegistry', () => {
  it('should register and retrieve tools', () => {
    const registry = new ToolRegistry()
    registry.register(calculatorTool)

    expect(registry.get('calculator')).toBe(calculatorTool)
  })

  it('should initialize with tools', () => {
    const registry = new ToolRegistry()
    registry.register(calculatorTool)

    expect(registry.get('calculator')).toBe(calculatorTool)
  })

  it('should return all tools', () => {
    const registry = new ToolRegistry()
    registry.registerMany(builtInTools)

    const allTools = registry.getAll()
    expect(allTools.length).toBe(builtInTools.length)
  })

  it('should filter by category', () => {
    const registry = new ToolRegistry()
    registry.registerMany(builtInTools)

    const utilityTools = registry.getByCategory('utility')
    expect(utilityTools.every((t) => t.category === 'utility')).toBe(true)
  })

  it('should filter by tag', () => {
    const registry = new ToolRegistry()
    registry.registerMany(builtInTools)

    const mathTools = registry.getByTag('math')
    expect(mathTools.every((t) => t.tags?.includes('math'))).toBe(true)
  })

  it('should search tools', () => {
    const registry = new ToolRegistry()
    registry.registerMany(builtInTools)

    const results = registry.search('calculator')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe('calculator')
  })

  it('should unregister tools', () => {
    const registry = new ToolRegistry()
    registry.register(calculatorTool)

    const removed = registry.unregister('calculator')
    expect(removed).toBe(true)
    expect(registry.get('calculator')).toBeUndefined()
  })
})
