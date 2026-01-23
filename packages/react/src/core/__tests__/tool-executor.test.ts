/**
 * Tests for Tool Executor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ToolExecutor,
  ToolValidationError,
  validateToolArguments,
  ToolResultCache,
} from '../tool-executor'
import type { ToolDefinition } from '../../types/tool-definition'

describe('ToolExecutor', () => {
  let executor: ToolExecutor

  const simpleTool: ToolDefinition = {
    name: 'simple_tool',
    description: 'A simple tool',
    parameters: {
      type: 'object',
      properties: {
        value: { type: 'string', description: 'A value' },
      },
      required: ['value'],
    },
    execute: async (args) => ({ result: args.value }),
  }

  beforeEach(() => {
    executor = new ToolExecutor()
  })

  describe('execute', () => {
    it('should execute tool successfully', async () => {
      const result = await executor.execute(simpleTool, { value: 'test' })

      expect(result.result).toEqual({ result: 'test' })
      expect(result.duration).toBeGreaterThanOrEqual(0)
      expect(result.cached).toBe(false)
    })

    it('should validate arguments', async () => {
      await expect(
        executor.execute(simpleTool, {})
      ).rejects.toThrow(ToolValidationError)

      await expect(
        executor.execute(simpleTool, { value: 123 })
      ).rejects.toThrow(ToolValidationError)
    })

    it('should skip validation when requested', async () => {
      const result = await executor.execute(
        simpleTool,
        {},
        { skipValidation: true }
      )

      expect(result).toBeDefined()
    })

    it('should handle execution errors', async () => {
      const errorTool: ToolDefinition = {
        name: 'error_tool',
        description: 'Tool that throws',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          throw new Error('Execution failed')
        },
      }

      await expect(
        executor.execute(errorTool, {})
      ).rejects.toThrow('Execution failed')
    })

    it('should measure execution duration', async () => {
      const slowTool: ToolDefinition = {
        name: 'slow_tool',
        description: 'Slow tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return { done: true }
        },
      }

      const result = await executor.execute(slowTool, {})

      expect(result.duration).toBeGreaterThanOrEqual(90)
    })
  })

  describe('timeout', () => {
    it('should timeout long-running tools', async () => {
      const longTool: ToolDefinition = {
        name: 'long_tool',
        description: 'Long running tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return { done: true }
        },
      }

      await expect(
        executor.execute(longTool, {}, { timeout: 100 })
      ).rejects.toThrow('timeout')
    }, 10000)

    it('should use tool-defined timeout', async () => {
      const timedTool: ToolDefinition = {
        name: 'timed_tool',
        description: 'Tool with timeout',
        parameters: { type: 'object', properties: {} },
        timeout: 100,
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return { done: true }
        },
      }

      await expect(
        executor.execute(timedTool, {})
      ).rejects.toThrow('timeout')
    }, 10000)

    it('should call onTimeout hook', async () => {
      const onTimeout = vi.fn()
      const timeoutTool: ToolDefinition = {
        name: 'timeout_tool',
        description: 'Tool with timeout hook',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
        hooks: { onTimeout },
      }

      await expect(
        executor.execute(timeoutTool, {}, { timeout: 50 })
      ).rejects.toThrow()

      // Wait a bit for hook to be called
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onTimeout).toHaveBeenCalled()
    }, 10000)
  })

  describe('caching', () => {
    it('should cache results for cacheable tools', async () => {
      const cacheableTool: ToolDefinition = {
        name: 'cacheable_tool',
        description: 'Cacheable tool',
        parameters: {
          type: 'object',
          properties: {
            input: { type: 'string' },
          },
          required: ['input'],
        },
        cacheable: true,
        execute: vi.fn(async (args) => ({ result: args.input })),
      }

      // First call - not cached
      const result1 = await executor.execute(cacheableTool, { input: 'test' })
      expect(result1.cached).toBe(false)
      expect(cacheableTool.execute).toHaveBeenCalledTimes(1)

      // Second call - cached
      const result2 = await executor.execute(cacheableTool, { input: 'test' })
      expect(result2.cached).toBe(true)
      expect(result2.result).toEqual(result1.result)
      expect(cacheableTool.execute).toHaveBeenCalledTimes(1) // Not called again
    })

    it('should not cache non-cacheable tools', async () => {
      const nonCacheableTool: ToolDefinition = {
        name: 'non_cacheable',
        description: 'Non-cacheable tool',
        parameters: {
          type: 'object',
          properties: {
            input: { type: 'string' },
          },
          required: ['input'],
        },
        cacheable: false,
        execute: vi.fn(async (args) => ({ result: args.input })),
      }

      await executor.execute(nonCacheableTool, { input: 'test' })
      await executor.execute(nonCacheableTool, { input: 'test' })

      expect(nonCacheableTool.execute).toHaveBeenCalledTimes(2)
    })

    it('should skip cache when requested', async () => {
      const cacheableTool: ToolDefinition = {
        name: 'cacheable_tool',
        description: 'Cacheable tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        cacheable: true,
        execute: vi.fn(async () => ({ result: Date.now() })),
      }

      await executor.execute(cacheableTool, {})
      const result = await executor.execute(cacheableTool, {}, { skipCache: true })

      expect(result.cached).toBe(false)
      expect(cacheableTool.execute).toHaveBeenCalledTimes(2)
    })

    it('should clear cache for specific tool', async () => {
      const cacheableTool: ToolDefinition = {
        name: 'cacheable_tool',
        description: 'Cacheable tool',
        parameters: { type: 'object', properties: {} },
        cacheable: true,
        execute: vi.fn(async () => ({ result: 'test' })),
      }

      await executor.execute(cacheableTool, {})
      executor.clearCache('cacheable_tool')

      const result = await executor.execute(cacheableTool, {})
      expect(result.cached).toBe(false)
      expect(cacheableTool.execute).toHaveBeenCalledTimes(2)
    })

    it('should clear all cache', async () => {
      const tool1: ToolDefinition = {
        name: 'tool1',
        description: 'Tool 1',
        parameters: { type: 'object', properties: {} },
        cacheable: true,
        execute: vi.fn(async () => ({ result: '1' })),
      }

      const tool2: ToolDefinition = {
        name: 'tool2',
        description: 'Tool 2',
        parameters: { type: 'object', properties: {} },
        cacheable: true,
        execute: vi.fn(async () => ({ result: '2' })),
      }

      await executor.execute(tool1, {})
      await executor.execute(tool2, {})
      executor.clearCache()

      await executor.execute(tool1, {})
      await executor.execute(tool2, {})

      expect(tool1.execute).toHaveBeenCalledTimes(2)
      expect(tool2.execute).toHaveBeenCalledTimes(2)
    })
  })

  describe('hooks', () => {
    it('should call onBefore hook', async () => {
      const onBefore = vi.fn()
      const tool: ToolDefinition = {
        name: 'hook_tool',
        description: 'Tool with hooks',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({ result: 'test' }),
        hooks: { onBefore },
      }

      await executor.execute(tool, {})

      expect(onBefore).toHaveBeenCalledWith(
        {},
        expect.objectContaining({ callId: expect.any(String) })
      )
    })

    it('should call onAfter hook', async () => {
      const onAfter = vi.fn()
      const tool: ToolDefinition = {
        name: 'hook_tool',
        description: 'Tool with hooks',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({ result: 'test' }),
        hooks: { onAfter },
      }

      await executor.execute(tool, {})

      expect(onAfter).toHaveBeenCalledWith(
        { result: 'test' },
        {},
        expect.objectContaining({ callId: expect.any(String) })
      )
    })

    it('should call onError hook', async () => {
      const onError = vi.fn()
      const tool: ToolDefinition = {
        name: 'error_tool',
        description: 'Tool with error hook',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          throw new Error('Test error')
        },
        hooks: { onError },
      }

      await expect(executor.execute(tool, {})).rejects.toThrow('Test error')

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        {},
        expect.objectContaining({ callId: expect.any(String) })
      )
    })

    it('should call onCancel hook on abort', async () => {
      const onCancel = vi.fn()
      const abortController = new AbortController()
      const tool: ToolDefinition = {
        name: 'cancellable_tool',
        description: 'Tool with cancel hook',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
        hooks: { onCancel },
      }

      const promise = executor.execute(tool, {}, {
        signal: abortController.signal,
      })

      // Abort immediately
      abortController.abort()

      await expect(promise).rejects.toThrow('cancelled')

      // Wait for hook
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onCancel).toHaveBeenCalled()
    })
  })

  describe('abort signal', () => {
    it('should cancel execution on abort', async () => {
      const abortController = new AbortController()
      const tool: ToolDefinition = {
        name: 'long_tool',
        description: 'Long running tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
      }

      const promise = executor.execute(tool, {}, {
        signal: abortController.signal,
      })

      setTimeout(() => abortController.abort(), 100)

      await expect(promise).rejects.toThrow('cancelled')
    })

    it('should reject immediately if already aborted', async () => {
      const abortController = new AbortController()
      abortController.abort()

      const tool: ToolDefinition = {
        name: 'tool',
        description: 'Tool',
        parameters: { type: 'object', properties: {} },
        execute: vi.fn(async () => ({})),
      }

      await expect(
        executor.execute(tool, {}, { signal: abortController.signal })
      ).rejects.toThrow('aborted')

      expect(tool.execute).not.toHaveBeenCalled()
    })
  })
})

describe('validateToolArguments', () => {
  it('should validate required fields', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          required_field: { type: 'string' },
        },
        required: ['required_field'],
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, {})
    }).toThrow(ToolValidationError)

    expect(() => {
      validateToolArguments(tool, { required_field: 'value' })
    }).not.toThrow()
  })

  it('should validate type', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          str: { type: 'string' },
          num: { type: 'number' },
          bool: { type: 'boolean' },
        },
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { str: 123 })
    }).toThrow('Expected type string')

    expect(() => {
      validateToolArguments(tool, { num: 'not a number' })
    }).toThrow('Expected type number')

    expect(() => {
      validateToolArguments(tool, { bool: 'true' })
    }).toThrow('Expected type boolean')
  })

  it('should validate string constraints', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          short: { type: 'string', minLength: 5 },
          long: { type: 'string', maxLength: 10 },
          pattern: { type: 'string', pattern: '^[A-Z]+$' },
        },
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { short: 'abc' })
    }).toThrow('less than minimum')

    expect(() => {
      validateToolArguments(tool, { long: 'this is too long' })
    }).toThrow('exceeds maximum')

    expect(() => {
      validateToolArguments(tool, { pattern: 'lowercase' })
    }).toThrow('does not match pattern')

    expect(() => {
      validateToolArguments(tool, {
        short: 'valid',
        long: 'valid',
        pattern: 'VALID',
      })
    }).not.toThrow()
  })

  it('should validate number constraints', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          min: { type: 'number', minimum: 0 },
          max: { type: 'number', maximum: 100 },
          int: { type: 'integer' },
          multiple: { type: 'number', multipleOf: 5 },
        },
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { min: -1 })
    }).toThrow('less than minimum')

    expect(() => {
      validateToolArguments(tool, { max: 101 })
    }).toThrow('exceeds maximum')

    expect(() => {
      validateToolArguments(tool, { int: 1.5 })
    }).toThrow('Expected type integer')

    expect(() => {
      validateToolArguments(tool, { multiple: 7 })
    }).toThrow('not a multiple of')

    expect(() => {
      validateToolArguments(tool, {
        min: 0,
        max: 100,
        int: 42,
        multiple: 15,
      })
    }).not.toThrow()
  })

  it('should validate array constraints', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          minItems: { type: 'array', minItems: 2, items: { type: 'string' } },
          maxItems: { type: 'array', maxItems: 3, items: { type: 'number' } },
          unique: { type: 'array', uniqueItems: true, items: { type: 'string' } },
        },
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { minItems: ['one'] })
    }).toThrow('less than minimum')

    expect(() => {
      validateToolArguments(tool, { maxItems: [1, 2, 3, 4] })
    }).toThrow('exceeds maximum')

    expect(() => {
      validateToolArguments(tool, { unique: ['a', 'b', 'a'] })
    }).toThrow('must be unique')

    expect(() => {
      validateToolArguments(tool, {
        minItems: ['one', 'two'],
        maxItems: [1, 2, 3],
        unique: ['a', 'b', 'c'],
      })
    }).not.toThrow()
  })

  it('should validate enum', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          color: { type: 'string', enum: ['red', 'green', 'blue'] },
        },
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { color: 'yellow' })
    }).toThrow('must be one of')

    expect(() => {
      validateToolArguments(tool, { color: 'red' })
    }).not.toThrow()
  })

  it('should reject additional properties when not allowed', () => {
    const tool: ToolDefinition = {
      name: 'test',
      description: 'Test',
      parameters: {
        type: 'object',
        properties: {
          allowed: { type: 'string' },
        },
        additionalProperties: false,
      },
      execute: async () => ({}),
    }

    expect(() => {
      validateToolArguments(tool, { allowed: 'ok', notAllowed: 'bad' })
    }).toThrow('Unknown field')
  })
})

describe('ToolResultCache', () => {
  let cache: ToolResultCache

  beforeEach(() => {
    cache = new ToolResultCache()
  })

  it('should cache and retrieve results', () => {
    cache.set('tool1', { arg: 'value' }, { result: 'test' }, 60000)

    const result = cache.get('tool1', { arg: 'value' })
    expect(result).toEqual({ result: 'test' })
  })

  it('should return undefined for cache miss', () => {
    const result = cache.get('nonexistent', {})
    expect(result).toBeUndefined()
  })

  it('should expire cached results', () => {
    cache.set('tool1', {}, { result: 'test' }, 100)

    // Immediately: should be cached
    expect(cache.get('tool1', {})).toEqual({ result: 'test' })

    // After expiry: should be undefined
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(cache.get('tool1', {})).toBeUndefined()
        resolve(undefined)
      }, 150)
    })
  })

  it('should use sorted keys for consistent caching', () => {
    cache.set('tool1', { b: 2, a: 1 }, { result: 'test' }, 60000)

    const result = cache.get('tool1', { a: 1, b: 2 })
    expect(result).toEqual({ result: 'test' })
  })

  it('should clear cache for specific tool', () => {
    cache.set('tool1', {}, { result: '1' }, 60000)
    cache.set('tool2', {}, { result: '2' }, 60000)

    cache.clear('tool1')

    expect(cache.get('tool1', {})).toBeUndefined()
    expect(cache.get('tool2', {})).toEqual({ result: '2' })
  })

  it('should clear all cache', () => {
    cache.set('tool1', {}, { result: '1' }, 60000)
    cache.set('tool2', {}, { result: '2' }, 60000)

    cache.clear()

    expect(cache.get('tool1', {})).toBeUndefined()
    expect(cache.get('tool2', {})).toBeUndefined()
  })

  it('should provide cache statistics', () => {
    cache.set('tool1', {}, { result: '1' }, 60000)
    cache.set('tool2', {}, { result: '2' }, 60000)

    const stats = cache.getStats()
    expect(stats.size).toBe(2)
    expect(stats.entries).toHaveLength(2)
  })
})
