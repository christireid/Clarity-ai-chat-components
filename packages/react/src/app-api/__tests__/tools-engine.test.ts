/**
 * Tests for tools engine - non-deterministic tool caching
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { executeTool, ToolsEngineState } from '../tools-engine'
import { ToolDefinition } from '../types'

describe('Tools Engine - Non-Deterministic Caching', () => {
  let state: ToolsEngineState

  beforeEach(() => {
    state = {
      registry: new Map<string, ToolDefinition>(),
      pendingCalls: [],
      completedCalls: [],
      autoApprove: true,
      cache: new Map(),
      cacheTtlMs: 60000, // 1 minute
      timeoutMs: 30000, // 30 seconds
    }
  })

  describe('get_current_time (non-deterministic)', () => {
    it('should not cache results', async () => {
      // Add get_current_time tool to registry
      const timeTool: ToolDefinition = {
        name: 'get_current_time',
        description: 'Get current time',
        deterministic: false,
        parameters: {},
        execute: async () => new Date().toISOString(),
      }
      state.registry.set('get_current_time', timeTool)

      // First call
      const result1 = await executeTool(state, 'get_current_time', {})
      const time1 = result1.result.result

      // Wait a small amount to ensure time changes
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Second call with same parameters
      const result2 = await executeTool(result1.state, 'get_current_time', {})
      const time2 = result2.result.result

      // Results should be DIFFERENT (not cached)
      expect(time1).not.toBe(time2)
      expect(result1.result.success).toBe(true)
      expect(result2.result.success).toBe(true)

      // Cache should remain empty for non-deterministic tools
      expect(result2.state.cache.size).toBe(0)
    })

    it('should not use cached results even with same parameters', async () => {
      // Use milliseconds for precision
      let counter = 0
      const timeTool: ToolDefinition = {
        name: 'get_current_time',
        description: 'Get current time',
        deterministic: false,
        parameters: {},
        execute: async () => {
          // Use counter to ensure different results
          return `${Date.now()}-${++counter}`
        },
      }
      state.registry.set('get_current_time', timeTool)

      const params = { timezone: 'America/New_York' }

      // Multiple calls with same parameters
      const results = []
      let currentState = state

      for (let i = 0; i < 3; i++) {
        const result = await executeTool(currentState, 'get_current_time', params)
        results.push(result.result.result)
        currentState = result.state
        await new Promise((resolve) => setTimeout(resolve, 5))
      }

      // All results should be different (not cached)
      expect(results[0]).not.toBe(results[1])
      expect(results[1]).not.toBe(results[2])
      expect(currentState.cache.size).toBe(0)
    })
  })

  describe('generate_uuid (non-deterministic)', () => {
    it('should generate unique IDs on each call', async () => {
      const uuidTool: ToolDefinition = {
        name: 'generate_uuid',
        description: 'Generate UUID',
        deterministic: false,
        parameters: {},
        execute: async () =>
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
          }),
      }
      state.registry.set('generate_uuid', uuidTool)

      // Generate multiple UUIDs
      const uuids = []
      let currentState = state

      for (let i = 0; i < 5; i++) {
        const result = await executeTool(currentState, 'generate_uuid', {})
        uuids.push(result.result.result)
        currentState = result.state
      }

      // All UUIDs should be unique (not cached)
      const uniqueUuids = new Set(uuids)
      expect(uniqueUuids.size).toBe(5)

      // Cache should be empty
      expect(currentState.cache.size).toBe(0)
    })

    it('should not cache short format IDs', async () => {
      const uuidTool: ToolDefinition = {
        name: 'generate_uuid',
        description: 'Generate UUID',
        deterministic: false,
        parameters: {},
        execute: async (params) => {
          const { format = 'uuid' } = params as { format?: string }
          if (format === 'short') {
            return Math.random().toString(36).slice(2, 10)
          }
          return 'uuid'
        },
      }
      state.registry.set('generate_uuid', uuidTool)

      const params = { format: 'short' }

      let currentState = state
      const ids = []

      for (let i = 0; i < 2; i++) {
        const result = await executeTool(currentState, 'generate_uuid', params)
        ids.push(result.result.result)
        currentState = result.state
      }

      // IDs should be different (not cached)
      expect(ids[0]).not.toBe(ids[1])
      expect(currentState.cache.size).toBe(0)
    })
  })

  describe('Deterministic tools (default behavior)', () => {
    it('should cache results for deterministic tools', async () => {
      const calcTool: ToolDefinition = {
        name: 'calculate',
        description: 'Calculate expression',
        // deterministic not specified, defaults to true
        parameters: {},
        execute: async (params) => {
          const { expression } = params as { expression: string }
          return { result: eval(expression), expression }
        },
      }
      state.registry.set('calculate', calcTool)

      const params = { expression: '2 + 2' }

      // First call
      const result1 = await executeTool(state, 'calculate', params)
      expect(result1.result.success).toBe(true)
      expect((result1.result.result as any).result).toBe(4)

      // Cache should have one entry
      expect(result1.state.cache.size).toBe(1)

      // Second call with same parameters (should use cache)
      const result2 = await executeTool(result1.state, 'calculate', params)
      expect(result2.result.success).toBe(true)
      expect((result2.result.result as any).result).toBe(4)

      // Cache should still have one entry (not duplicated)
      expect(result2.state.cache.size).toBe(1)

      // Execution time should be 0 for cached result
      expect(result2.result.executionTimeMs).toBe(0)
    })

    it('should explicitly cache when deterministic=true', async () => {
      const deterministicTool: ToolDefinition = {
        name: 'reverse_string',
        description: 'Reverse a string',
        deterministic: true, // Explicitly set
        parameters: {},
        execute: async (params) => {
          const { text } = params as { text: string }
          return text.split('').reverse().join('')
        },
      }
      state.registry.set('reverse_string', deterministicTool)

      const params = { text: 'hello' }

      // First call
      const result1 = await executeTool(state, 'reverse_string', params)

      expect(result1.result.result).toBe('olleh')
      expect(result1.state.cache.size).toBe(1)

      // Second call (should use cache)
      const result2 = await executeTool(result1.state, 'reverse_string', params)

      expect(result2.result.result).toBe('olleh')
      expect(result2.result.executionTimeMs).toBe(0) // Cached
      expect(result2.state.cache.size).toBe(1)
    })
  })

  describe('Mixed deterministic and non-deterministic tools', () => {
    it('should handle both types correctly in same state', async () => {
      // Add both types of tools
      const timeTool: ToolDefinition = {
        name: 'get_time',
        description: 'Get time',
        deterministic: false,
        parameters: {},
        execute: async () => Date.now(),
      }

      const calcTool: ToolDefinition = {
        name: 'add',
        description: 'Add numbers',
        deterministic: true,
        parameters: {},
        execute: async (params) => {
          const { a, b } = params as { a: number; b: number }
          return a + b
        },
      }

      state.registry.set('get_time', timeTool)
      state.registry.set('add', calcTool)

      // Call non-deterministic tool
      let result = await executeTool(state, 'get_time', {})

      expect(result.state.cache.size).toBe(0) // Not cached

      // Call deterministic tool
      result = await executeTool(result.state, 'add', { a: 5, b: 3 })

      expect(result.result.result).toBe(8)
      expect(result.state.cache.size).toBe(1) // Only deterministic cached

      // Call non-deterministic again
      result = await executeTool(result.state, 'get_time', {})

      expect(result.state.cache.size).toBe(1) // Still only deterministic cached
    })
  })
})
