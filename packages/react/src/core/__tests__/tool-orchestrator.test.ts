/**
 * Tests for Tool Orchestrator
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToolOrchestrator } from '../tool-orchestrator'
import type { ToolDefinition } from '../../types/tool-definition'

describe('ToolOrchestrator', () => {
  let orchestrator: ToolOrchestrator

  const simpleTool: ToolDefinition = {
    name: 'simple_tool',
    description: 'A simple tool',
    parameters: {
      type: 'object',
      properties: {
        value: { type: 'string' },
      },
      required: ['value'],
    },
    execute: async (args) => ({ result: args.value }),
  }

  const cacheableTool: ToolDefinition = {
    name: 'cacheable_tool',
    description: 'Cacheable tool',
    parameters: {
      type: 'object',
      properties: {
        input: { type: 'string' },
      },
    },
    cacheable: true,
    execute: vi.fn(async (args) => ({ result: args.input })),
  }

  beforeEach(() => {
    orchestrator = new ToolOrchestrator({
      autoApprove: true, // Auto-approve for easier testing
    })
  })

  describe('tool management', () => {
    it('should register tools', () => {
      orchestrator.registerTool(simpleTool)

      expect(orchestrator.getTool('simple_tool')).toEqual(simpleTool)
    })

    it('should register multiple tools', () => {
      orchestrator.registerTools([simpleTool, cacheableTool])

      expect(orchestrator.getAllTools()).toHaveLength(2)
    })

    it('should unregister tools', () => {
      orchestrator.registerTool(simpleTool)

      const result = orchestrator.unregisterTool('simple_tool')

      expect(result).toBe(true)
      expect(orchestrator.getTool('simple_tool')).toBeUndefined()
    })

    it('should register tools via config', () => {
      const orch = new ToolOrchestrator({
        tools: [simpleTool, cacheableTool],
      })

      expect(orch.getAllTools()).toHaveLength(2)
    })
  })

  describe('tool execution', () => {
    beforeEach(() => {
      orchestrator.registerTool(simpleTool)
    })

    it('should execute tool successfully', async () => {
      const result = await orchestrator.executeTool('simple_tool', {
        value: 'test',
      })

      expect(result.status).toBe('completed')
      expect(result.result).toEqual({ result: 'test' })
      expect(result.duration).toBeGreaterThanOrEqual(0)
      expect(result.cached).toBe(false)
    })

    it('should throw error for unknown tool', async () => {
      await expect(
        orchestrator.executeTool('unknown_tool', {})
      ).rejects.toThrow('Tool not found')
    })

    it('should validate arguments', async () => {
      await expect(
        orchestrator.executeTool('simple_tool', {})
      ).rejects.toThrow()
    })

    it('should handle execution errors', async () => {
      const errorTool: ToolDefinition = {
        name: 'error_tool',
        description: 'Tool that errors',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          throw new Error('Execution failed')
        },
      }

      orchestrator.registerTool(errorTool)

      const result = await orchestrator.executeTool('error_tool', {})

      expect(result.status).toBe('failed')
      expect(result.error?.message).toContain('Execution failed')
    })

    it('should track call in lifecycle', async () => {
      const result = await orchestrator.executeTool('simple_tool', {
        value: 'test',
      })

      const call = orchestrator.getToolCall(result.callId)
      expect(call).toBeDefined()
      expect(call.status).toBe('completed')
      expect(call.result).toEqual({ result: 'test' })
    })
  })

  describe('approval flow', () => {
    const approvalTool: ToolDefinition = {
      name: 'approval_tool',
      description: 'Tool requiring approval',
      parameters: { type: 'object', properties: {} },
      requiresApproval: true,
      execute: async () => ({ approved: true }),
    }

    it('should require approval when tool.requiresApproval is true', async () => {
      const orch = new ToolOrchestrator({ autoApprove: false })
      orch.registerTool(approvalTool)

      await expect(
        orch.executeTool('approval_tool', {})
      ).rejects.toThrow('requires approval')
    })

    it('should auto-approve when config.autoApprove is true', async () => {
      const orch = new ToolOrchestrator({ autoApprove: true })
      orch.registerTool(approvalTool)

      const result = await orch.executeTool('approval_tool', {})

      expect(result.status).toBe('completed')
    })

    it('should support manual approval flow', async () => {
      const orch = new ToolOrchestrator({ autoApprove: false })
      orch.registerTool(simpleTool)

      // Start execution (will throw because needs approval)
      let callId: string
      try {
        await orch.executeTool('simple_tool', { value: 'test' })
      } catch (error) {
        // Get the call ID from lifecycle
        const pending = orch.getPendingToolCalls()
        callId = pending[0].id

        // Approve it
        orch.approveTool(callId, 'user_123')

        // Execute approved tool
        const result = await orch.executeApprovedTool(callId)

        expect(result.status).toBe('completed')
        expect(result.result).toEqual({ result: 'test' })
      }
    })

    it('should support rejection', async () => {
      const orch = new ToolOrchestrator({ autoApprove: false })
      orch.registerTool(simpleTool)

      try {
        await orch.executeTool('simple_tool', { value: 'test' })
      } catch {
        const pending = orch.getPendingToolCalls()
        const callId = pending[0].id

        orch.rejectTool(callId, 'User declined', 'user_123')

        const call = orch.getToolCall(callId)
        expect(call.status).toBe('rejected')
        expect(call.rejectionReason).toBe('User declined')
      }
    })
  })

  describe('caching', () => {
    beforeEach(() => {
      orchestrator.registerTool(cacheableTool)
    })

    it('should cache results for cacheable tools', async () => {
      const result1 = await orchestrator.executeTool('cacheable_tool', {
        input: 'test',
      })
      expect(result1.cached).toBe(false)

      const result2 = await orchestrator.executeTool('cacheable_tool', {
        input: 'test',
      })
      expect(result2.cached).toBe(true)

      // Execute function should only be called once
      expect(cacheableTool.execute).toHaveBeenCalledTimes(1)
    })

    it('should clear cache for specific tool', async () => {
      await orchestrator.executeTool('cacheable_tool', { input: 'test' })

      orchestrator.clearCache('cacheable_tool')

      const result = await orchestrator.executeTool('cacheable_tool', {
        input: 'test',
      })
      expect(result.cached).toBe(false)
    })

    it('should disable caching when configured', async () => {
      const orch = new ToolOrchestrator({ enableCaching: false })
      orch.registerTool(cacheableTool)

      await orch.executeTool('cacheable_tool', { input: 'test' })
      const result = await orch.executeTool('cacheable_tool', { input: 'test' })

      expect(result.cached).toBe(false)
    })
  })

  describe('lifecycle events', () => {
    beforeEach(() => {
      orchestrator.registerTool(simpleTool)
    })

    it('should emit lifecycle events', async () => {
      const events: string[] = []

      orchestrator.lifecycle.on('tool_requested', () => events.push('requested'))
      orchestrator.lifecycle.on('tool_approved', () => events.push('approved'))
      orchestrator.lifecycle.on('tool_executing', () => events.push('executing'))
      orchestrator.lifecycle.on('tool_completed', () => events.push('completed'))

      await orchestrator.executeTool('simple_tool', { value: 'test' })

      expect(events).toEqual(['requested', 'approved', 'executing', 'completed'])
    })

    it('should emit failure events', async () => {
      const errorTool: ToolDefinition = {
        name: 'error_tool',
        description: 'Error tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          throw new Error('Test error')
        },
      }

      orchestrator.registerTool(errorTool)

      const listener = vi.fn()
      orchestrator.lifecycle.on('tool_failed', listener)

      await orchestrator.executeTool('error_tool', {})

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('query methods', () => {
    beforeEach(() => {
      orchestrator.registerTools([simpleTool, cacheableTool])
    })

    it('should get all tool calls', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })
      await orchestrator.executeTool('cacheable_tool', { input: 'test' })

      const calls = orchestrator.getAllToolCalls()
      expect(calls).toHaveLength(2)
    })

    it('should get tool calls by status', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })

      const completed = orchestrator.getToolCallsByStatus('completed')
      expect(completed).toHaveLength(1)
    })

    it('should get pending tool calls', async () => {
      const orch = new ToolOrchestrator({ autoApprove: false })
      orch.registerTool(simpleTool)

      try {
        await orch.executeTool('simple_tool', { value: 'test' })
      } catch {
        const pending = orch.getPendingToolCalls()
        expect(pending).toHaveLength(1)
        expect(pending[0].status).toBe('pending_approval')
      }
    })

    it('should get statistics', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })
      await orchestrator.executeTool('cacheable_tool', { input: 'test' })

      const stats = orchestrator.getStats()

      expect(stats.registry.totalTools).toBe(2)
      expect(stats.calls.total).toBe(2)
      expect(stats.calls.byStatus.completed).toBe(2)
    })

    it('should get cache statistics', async () => {
      await orchestrator.executeTool('cacheable_tool', { input: 'test' })

      const stats = orchestrator.getCacheStats()
      expect(stats.size).toBe(1)
    })
  })

  describe('cleanup', () => {
    beforeEach(() => {
      orchestrator.registerTool(simpleTool)
    })

    it('should clear completed calls', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })

      orchestrator.clearCompletedCalls()

      const calls = orchestrator.getAllToolCalls()
      expect(calls).toHaveLength(0)
    })

    it('should reset orchestrator state', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })

      orchestrator.reset()

      expect(orchestrator.getAllToolCalls()).toHaveLength(0)
      expect(orchestrator.getCacheStats().size).toBe(0)
    })

    it('should keep registered tools after reset', async () => {
      await orchestrator.executeTool('simple_tool', { value: 'test' })

      orchestrator.reset()

      expect(orchestrator.getTool('simple_tool')).toBeDefined()
    })
  })

  describe('timeout handling', () => {
    it('should timeout long-running tools', async () => {
      const longTool: ToolDefinition = {
        name: 'long_tool',
        description: 'Long tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
      }

      orchestrator.registerTool(longTool)

      const result = await orchestrator.executeTool('long_tool', {}, {
        timeout: 100,
      })

      expect(result.status).toBe('timeout')
    }, 10000)

    it('should use default timeout from config', async () => {
      const orch = new ToolOrchestrator({ defaultTimeout: 100 })

      const longTool: ToolDefinition = {
        name: 'long_tool',
        description: 'Long tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
      }

      orch.registerTool(longTool)

      const result = await orch.executeTool('long_tool', {})

      expect(result.status).toBe('timeout')
    }, 10000)
  })

  describe('abort signal', () => {
    it('should cancel execution on abort', async () => {
      const abortController = new AbortController()

      const longTool: ToolDefinition = {
        name: 'long_tool',
        description: 'Long tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return {}
        },
      }

      orchestrator.registerTool(longTool)

      setTimeout(() => abortController.abort(), 100)

      const result = await orchestrator.executeTool('long_tool', {}, {
        signal: abortController.signal,
      })

      expect(result.status).toBe('cancelled')
    })
  })
})
