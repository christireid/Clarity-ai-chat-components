/**
 * Tests for Tool Registry
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToolRegistry } from '../tool-registry'
import type { ToolDefinition } from '../../types/tool-definition'

describe('ToolRegistry', () => {
  let registry: ToolRegistry

  // Sample tools for testing
  const weatherTool: ToolDefinition = {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name' },
      },
      required: ['location'],
    },
    execute: async () => ({ temp: 72 }),
    category: 'information',
    tags: ['weather', 'api'],
  }

  const calculatorTool: ToolDefinition = {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression' },
      },
      required: ['expression'],
    },
    execute: async () => ({ result: 42 }),
    category: 'utility',
    tags: ['math', 'calculation'],
  }

  const searchTool: ToolDefinition = {
    name: 'web_search',
    description: 'Search the web for information',
    displayName: 'Web Search',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
    execute: async () => ({ results: [] }),
    category: 'information',
    tags: ['search', 'web'],
  }

  beforeEach(() => {
    registry = new ToolRegistry()
  })

  describe('register', () => {
    it('should register a tool', () => {
      registry.register(weatherTool)

      expect(registry.has('get_weather')).toBe(true)
      expect(registry.get('get_weather')).toEqual(weatherTool)
    })

    it('should throw on duplicate registration', () => {
      registry.register(weatherTool)

      expect(() => {
        registry.register(weatherTool)
      }).toThrow('already registered')
    })

    it('should throw on invalid tool', () => {
      const invalidTool = {
        name: 'invalid',
        // missing required fields
      }

      expect(() => {
        registry.register(invalidTool as any)
      }).toThrow()
    })

    it('should emit registered event', () => {
      const listener = vi.fn()
      registry.on(listener)

      registry.register(weatherTool)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'registered',
          toolName: 'get_weather',
        })
      )
    })
  })

  describe('registerMany', () => {
    it('should register multiple tools', () => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])

      expect(registry.getAll()).toHaveLength(3)
      expect(registry.has('get_weather')).toBe(true)
      expect(registry.has('calculator')).toBe(true)
      expect(registry.has('web_search')).toBe(true)
    })
  })

  describe('unregister', () => {
    it('should unregister a tool', () => {
      registry.register(weatherTool)

      const result = registry.unregister('get_weather')

      expect(result).toBe(true)
      expect(registry.has('get_weather')).toBe(false)
    })

    it('should return false for non-existent tool', () => {
      const result = registry.unregister('nonexistent')
      expect(result).toBe(false)
    })

    it('should emit unregistered event', () => {
      const listener = vi.fn()
      registry.on(listener)

      registry.register(weatherTool)
      registry.unregister('get_weather')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unregistered',
          toolName: 'get_weather',
        })
      )
    })
  })

  describe('get', () => {
    it('should get registered tool', () => {
      registry.register(weatherTool)

      const tool = registry.get('get_weather')
      expect(tool).toEqual(weatherTool)
    })

    it('should return undefined for non-existent tool', () => {
      const tool = registry.get('nonexistent')
      expect(tool).toBeUndefined()
    })
  })

  describe('has', () => {
    it('should return true for registered tool', () => {
      registry.register(weatherTool)
      expect(registry.has('get_weather')).toBe(true)
    })

    it('should return false for non-existent tool', () => {
      expect(registry.has('nonexistent')).toBe(false)
    })
  })

  describe('getAll', () => {
    it('should return all registered tools', () => {
      registry.register(weatherTool)
      registry.register(calculatorTool)

      const tools = registry.getAll()
      expect(tools).toHaveLength(2)
      expect(tools).toContainEqual(weatherTool)
      expect(tools).toContainEqual(calculatorTool)
    })

    it('should return empty array when no tools registered', () => {
      expect(registry.getAll()).toEqual([])
    })
  })

  describe('getByCategory', () => {
    beforeEach(() => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])
    })

    it('should return tools in category', () => {
      const infoTools = registry.getByCategory('information')
      expect(infoTools).toHaveLength(2)
      expect(infoTools).toContainEqual(weatherTool)
      expect(infoTools).toContainEqual(searchTool)
    })

    it('should return empty array for non-existent category', () => {
      const tools = registry.getByCategory('nonexistent')
      expect(tools).toEqual([])
    })
  })

  describe('getByTag', () => {
    beforeEach(() => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])
    })

    it('should return tools with tag', () => {
      const mathTools = registry.getByTag('math')
      expect(mathTools).toHaveLength(1)
      expect(mathTools[0]).toEqual(calculatorTool)
    })

    it('should return empty array for non-existent tag', () => {
      const tools = registry.getByTag('nonexistent')
      expect(tools).toEqual([])
    })

    it('should handle tools with multiple tags', () => {
      const weatherTools = registry.getByTag('weather')
      expect(weatherTools).toHaveLength(1)
      expect(weatherTools[0]).toEqual(weatherTool)

      const apiTools = registry.getByTag('api')
      expect(apiTools).toHaveLength(1)
      expect(apiTools[0]).toEqual(weatherTool)
    })
  })

  describe('search', () => {
    beforeEach(() => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])
    })

    it('should search by exact name match', () => {
      const results = registry.search('calculator')
      expect(results[0]).toEqual(calculatorTool)
    })

    it('should search by partial name match', () => {
      const results = registry.search('search')
      expect(results).toContainEqual(searchTool)
    })

    it('should search by display name', () => {
      const results = registry.search('Web Search')
      expect(results).toContainEqual(searchTool)
    })

    it('should search by description', () => {
      const results = registry.search('weather')
      expect(results).toContainEqual(weatherTool)
    })

    it('should search by category', () => {
      const results = registry.search('utility')
      expect(results).toContainEqual(calculatorTool)
    })

    it('should search by tags', () => {
      const results = registry.search('math')
      expect(results).toContainEqual(calculatorTool)
    })

    it('should be case-insensitive', () => {
      const results = registry.search('CALCULATOR')
      expect(results).toContainEqual(calculatorTool)
    })

    it('should return all tools for empty query', () => {
      const results = registry.search('')
      expect(results).toHaveLength(3)
    })

    it('should sort by relevance', () => {
      const results = registry.search('search')
      // 'web_search' should rank higher than tools that only mention 'search' in description
      expect(results[0]).toEqual(searchTool)
    })

    it('should return empty array for no matches', () => {
      const results = registry.search('xyz123')
      expect(results).toEqual([])
    })
  })

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])

      const categories = registry.getCategories()
      expect(categories).toEqual(['information', 'utility'])
    })

    it('should return empty array when no tools', () => {
      expect(registry.getCategories()).toEqual([])
    })

    it('should return sorted categories', () => {
      const categories = registry.getCategories()
      const sorted = [...categories].sort()
      expect(categories).toEqual(sorted)
    })
  })

  describe('getTags', () => {
    it('should return all unique tags', () => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])

      const tags = registry.getTags()
      expect(tags).toEqual(['api', 'calculation', 'math', 'search', 'weather', 'web'])
    })

    it('should return empty array when no tools', () => {
      expect(registry.getTags()).toEqual([])
    })

    it('should return sorted tags', () => {
      registry.registerMany([weatherTool, calculatorTool])
      const tags = registry.getTags()
      const sorted = [...tags].sort()
      expect(tags).toEqual(sorted)
    })
  })

  describe('clear', () => {
    it('should clear all tools', () => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])

      registry.clear()

      expect(registry.getAll()).toEqual([])
    })

    it('should emit cleared events', () => {
      const listener = vi.fn()
      registry.on(listener)

      registry.registerMany([weatherTool, calculatorTool])
      listener.mockClear() // Clear registered events

      registry.clear()

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'cleared' })
      )
    })
  })

  describe('getStats', () => {
    it('should return statistics', () => {
      registry.registerMany([weatherTool, calculatorTool, searchTool])

      const stats = registry.getStats()

      expect(stats.totalTools).toBe(3)
      expect(stats.byCategory).toEqual({
        information: 2,
        utility: 1,
      })
      expect(stats.byTag).toEqual({
        weather: 1,
        api: 1,
        math: 1,
        calculation: 1,
        search: 1,
        web: 1,
      })
    })
  })

  describe('event listeners', () => {
    it('should subscribe to events', () => {
      const listener = vi.fn()
      registry.on(listener)

      registry.register(weatherTool)

      expect(listener).toHaveBeenCalled()
    })

    it('should unsubscribe from events', () => {
      const listener = vi.fn()
      const unsubscribe = registry.on(listener)

      registry.register(weatherTool)
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()

      registry.register(calculatorTool)
      expect(listener).toHaveBeenCalledTimes(1) // Not called again
    })

    it('should handle listener errors gracefully', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error')
      })
      const normalListener = vi.fn()

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      registry.on(errorListener)
      registry.on(normalListener)

      registry.register(weatherTool)

      expect(errorListener).toHaveBeenCalled()
      expect(normalListener).toHaveBeenCalled()
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })
  })

  describe('toJSON / fromJSON', () => {
    it('should export to JSON', () => {
      registry.registerMany([weatherTool, calculatorTool])

      const json = registry.toJSON()
      expect(json).toHaveLength(2)
      expect(json).toContainEqual(weatherTool)
      expect(json).toContainEqual(calculatorTool)
    })

    it('should import from JSON', () => {
      const json = [weatherTool, calculatorTool]
      registry.fromJSON(json)

      expect(registry.getAll()).toHaveLength(2)
      expect(registry.has('get_weather')).toBe(true)
      expect(registry.has('calculator')).toBe(true)
    })

    it('should replace existing tools when replace=true', () => {
      registry.register(searchTool)

      const json = [weatherTool, calculatorTool]
      registry.fromJSON(json, true)

      expect(registry.getAll()).toHaveLength(2)
      expect(registry.has('web_search')).toBe(false)
    })

    it('should merge with existing tools when replace=false', () => {
      registry.register(searchTool)

      const json = [weatherTool, calculatorTool]
      registry.fromJSON(json, false)

      expect(registry.getAll()).toHaveLength(3)
      expect(registry.has('web_search')).toBe(true)
    })
  })

  describe('namespace', () => {
    it('should create namespaced registry', () => {
      const builtinRegistry = registry.namespace('builtin')

      const namespacedTool: ToolDefinition = {
        name: 'calculator',
        description: 'Calculator',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({}),
      }

      builtinRegistry.register(namespacedTool)

      expect(registry.has('builtin.calculator')).toBe(true)
    })

    it('should isolate namespaced queries', () => {
      const builtinRegistry = registry.namespace('builtin')
      const customRegistry = registry.namespace('custom')

      builtinRegistry.register({
        name: 'tool1',
        description: 'Tool 1',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({}),
      })

      customRegistry.register({
        name: 'tool2',
        description: 'Tool 2',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({}),
      })

      expect(builtinRegistry.getAll()).toHaveLength(1)
      expect(customRegistry.getAll()).toHaveLength(1)
      expect(registry.getAll()).toHaveLength(2)
    })

    it('should handle fully qualified names', () => {
      const builtinRegistry = registry.namespace('builtin')

      builtinRegistry.register({
        name: 'builtin.calculator',
        description: 'Calculator',
        parameters: { type: 'object', properties: {} },
        execute: async () => ({}),
      })

      expect(registry.has('builtin.calculator')).toBe(true)
    })
  })
})
