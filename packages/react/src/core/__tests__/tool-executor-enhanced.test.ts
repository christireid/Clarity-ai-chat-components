
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ToolExecutor,
  ToolValidationError,
  ToolTimeoutError,
  ToolExecutionError,
  validateToolArguments,
  ToolResultCache,
} from '../tool-executor'
import type { ToolDefinition } from '../../types/tool-definition'

describe('ToolExecutor Enhanced', () => {
  let executor: ToolExecutor

  beforeEach(() => {
    executor = new ToolExecutor()
  })

  describe('Advanced Validation (TOOL-001)', () => {
    it('should validate oneOf', () => {
      const tool: ToolDefinition = {
        name: 'test',
        description: 'Test',
        parameters: {
          type: 'object',
          properties: {
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'number' }
              ]
            }
          }
        },
        execute: async () => ({})
      }

      expect(() => validateToolArguments(tool, { value: 'string' })).not.toThrow()
      expect(() => validateToolArguments(tool, { value: 123 })).not.toThrow()
      expect(() => validateToolArguments(tool, { value: true })).toThrow(ToolValidationError)
    })

    it('should validate format', () => {
      const tool: ToolDefinition = {
        name: 'test',
        description: 'Test',
        parameters: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            date: { type: 'string', format: 'date-time' },
            ipv4: { type: 'string', format: 'ipv4' }
          }
        },
        execute: async () => ({})
      }

      expect(() => validateToolArguments(tool, { email: 'invalid' })).toThrow('Invalid email')
      expect(() => validateToolArguments(tool, { email: 'test@example.com' })).not.toThrow()
      
      expect(() => validateToolArguments(tool, { date: 'invalid' })).toThrow('Invalid date-time')
      expect(() => validateToolArguments(tool, { date: '2023-01-01T00:00:00Z' })).not.toThrow()

      expect(() => validateToolArguments(tool, { ipv4: '999.999.999.999' })).toThrow('Invalid IPv4')
      expect(() => validateToolArguments(tool, { ipv4: '192.168.1.1' })).not.toThrow()
    })
  })

  describe('Safe Regex (TOOL-003)', () => {
    it('should reject extremely long strings when pattern is present', () => {
      const tool: ToolDefinition = {
        name: 'test',
        description: 'Test',
        parameters: {
          type: 'object',
          properties: {
            code: { type: 'string', pattern: '^[A-Z]+$' }
          }
        },
        execute: async () => ({})
      }

      const longString = 'A'.repeat(10001)
      expect(() => validateToolArguments(tool, { code: longString })).toThrow('exceeds safety limit')
    })
  })

  describe('Stable Caching (TOOL-010)', () => {
    it('should generate same cache key for nested objects with different order', async () => {
      const tool: ToolDefinition = {
        name: 'test',
        description: 'Test',
        parameters: { type: 'object', properties: {} },
        cacheable: true,
        execute: vi.fn(async () => ({ result: 'cached' }))
      }

      const args1 = { nested: { a: 1, b: 2 } }
      const args2 = { nested: { b: 2, a: 1 } }

      await executor.execute(tool, args1)
      const result = await executor.execute(tool, args2)

      expect(result.cached).toBe(true)
      expect(tool.execute).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Classification (TOOL-014)', () => {
    it('should throw ToolTimeoutError on timeout', async () => {
      const tool: ToolDefinition = {
        name: 'timeout_tool',
        description: 'Test',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise(r => setTimeout(r, 100))
          return {}
        }
      }

      await expect(executor.execute(tool, {}, { timeout: 10 })).rejects.toThrow(ToolTimeoutError)
    })
  })

  describe('Idempotency (TOOL-017)', () => {
    it('should cache based on idempotency key', async () => {
      const tool: ToolDefinition = {
        name: 'test',
        description: 'Test',
        parameters: { type: 'object', properties: {} },
        cacheable: true,
        execute: vi.fn(async () => ({ result: Date.now() }))
      }

      // Different args but same idempotency key -> should be cached?
      // Wait, idempotency key usually implies SAME operation.
      // If args differ, it shouldn't match. 
      // The implementation adds idempotencyKey to the cache key.
      // So { args: A, idemp: K } and { args: B, idemp: K } are DIFFERENT keys.
      // But { args: A, idemp: K } and { args: A, idemp: K } are SAME.
      // And { args: A, idemp: K1 } and { args: A, idemp: K2 } are DIFFERENT.
      
      const args = { val: 1 }
      
      await executor.execute(tool, args, { idempotencyKey: 'key1' })
      const res2 = await executor.execute(tool, args, { idempotencyKey: 'key1' })
      const res3 = await executor.execute(tool, args, { idempotencyKey: 'key2' })
      
      expect(res2.cached).toBe(true)
      expect(res3.cached).toBe(false)
    })
  })
})
