/**
 * Tests for Tool Lifecycle Manager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ToolLifecycleManager,
  isValidTransition,
  type ToolCallStatus,
  type ToolLifecycleEvent,
} from '../tool-lifecycle'

describe('ToolLifecycleManager', () => {
  let lifecycle: ToolLifecycleManager

  beforeEach(() => {
    lifecycle = new ToolLifecycleManager()
  })

  describe('createToolCall', () => {
    it('should create a tool call with requested status', () => {
      const call = lifecycle.createToolCall('test_tool', { arg: 'value' })

      expect(call.id).toBeTruthy()
      expect(call.toolName).toBe('test_tool')
      expect(call.args).toEqual({ arg: 'value' })
      expect(call.status).toBe('requested')
      expect(call.timestamps.requested).toBeTruthy()
    })

    it('should emit tool_requested event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_requested', listener)

      lifecycle.createToolCall('test_tool', { arg: 'value' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_requested',
          call: expect.objectContaining({
            toolName: 'test_tool',
            status: 'requested',
          }),
        })
      )
    })

    it('should accept custom context', () => {
      const call = lifecycle.createToolCall('test_tool', { arg: 'value' }, {
        sessionId: 'session_123',
        userId: 'user_456',
      })

      expect(call.context.sessionId).toBe('session_123')
      expect(call.context.userId).toBe('user_456')
    })
  })

  describe('approval flow', () => {
    it('should transition to pending_approval', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      const mockTool = {
        name: 'test_tool',
        description: 'test',
        parameters: { type: 'object' as const, properties: {} },
        execute: vi.fn(),
      }

      lifecycle.markPendingApproval(call.id, mockTool)

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('pending_approval')
    })

    it('should approve tool call', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      const mockTool = {
        name: 'test_tool',
        description: 'test',
        parameters: { type: 'object' as const, properties: {} },
        execute: vi.fn(),
      }

      lifecycle.markPendingApproval(call.id, mockTool)
      lifecycle.approve(call.id, 'user_123')

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('approved')
      expect(updated.timestamps.approved).toBeTruthy()
    })

    it('should emit tool_approved event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_approved', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      const mockTool = {
        name: 'test_tool',
        description: 'test',
        parameters: { type: 'object' as const, properties: {} },
        execute: vi.fn(),
      }

      lifecycle.markPendingApproval(call.id, mockTool)
      lifecycle.approve(call.id, 'user_123')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_approved',
          approvedBy: 'user_123',
        })
      )
    })

    it('should reject tool call', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      const mockTool = {
        name: 'test_tool',
        description: 'test',
        parameters: { type: 'object' as const, properties: {} },
        execute: vi.fn(),
      }

      lifecycle.markPendingApproval(call.id, mockTool)
      lifecycle.reject(call.id, 'User declined', 'user_123')

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('rejected')
      expect(updated.rejectionReason).toBe('User declined')
      expect(updated.timestamps.rejected).toBeTruthy()
    })

    it('should emit tool_rejected event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_rejected', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      const mockTool = {
        name: 'test_tool',
        description: 'test',
        parameters: { type: 'object' as const, properties: {} },
        execute: vi.fn(),
      }

      lifecycle.markPendingApproval(call.id, mockTool)
      lifecycle.reject(call.id, 'User declined')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_rejected',
          reason: 'User declined',
        })
      )
    })
  })

  describe('execution flow', () => {
    it('should mark tool as executing', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('executing')
      expect(updated.timestamps.executionStarted).toBeTruthy()
    })

    it('should update progress', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.updateProgress(call.id, 50, 'Processing...')

      const updated = lifecycle.getCall(call.id)
      expect(updated.progress).toBe(50)
      expect(updated.statusMessage).toBe('Processing...')
    })

    it('should clamp progress to 0-100', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.updateProgress(call.id, 150)

      const updated = lifecycle.getCall(call.id)
      expect(updated.progress).toBe(100)

      lifecycle.updateProgress(call.id, -10)
      const updated2 = lifecycle.getCall(call.id)
      expect(updated2.progress).toBe(0)
    })

    it('should emit tool_progress event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_progress', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.updateProgress(call.id, 75, 'Almost done')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_progress',
          progress: 75,
          message: 'Almost done',
        })
      )
    })

    it('should complete tool execution', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.complete(call.id, { result: 'success' })

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('completed')
      expect(updated.result).toEqual({ result: 'success' })
      expect(updated.timestamps.executionEnded).toBeTruthy()
      expect(updated.duration).toBeGreaterThanOrEqual(0)
    })

    it('should emit tool_completed event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_completed', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.complete(call.id, { result: 'success' })

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_completed',
          result: { result: 'success' },
        })
      )
    })

    it('should handle cached results', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.complete(call.id, { cached: 'result' }, true)

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('cached')
      expect(updated.cached).toBe(true)
    })

    it('should emit tool_cached event for cached results', () => {
      const listener = vi.fn()
      lifecycle.on('tool_cached', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.complete(call.id, { cached: 'result' }, true)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_cached',
          result: { cached: 'result' },
        })
      )
    })
  })

  describe('error handling', () => {
    it('should fail tool execution', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)

      const error = new Error('Execution failed')
      lifecycle.fail(call.id, error, 'EXEC_ERROR')

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('failed')
      expect(updated.error?.message).toBe('Execution failed')
      expect(updated.error?.code).toBe('EXEC_ERROR')
      expect(updated.timestamps.executionEnded).toBeTruthy()
    })

    it('should emit tool_failed event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_failed', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)

      const error = new Error('Execution failed')
      lifecycle.fail(call.id, error)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_failed',
          error,
        })
      )
    })

    it('should timeout tool execution', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.timeout(call.id, 5000)

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('timeout')
      expect(updated.timestamps.executionEnded).toBeTruthy()
    })

    it('should emit tool_timeout event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_timeout', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.timeout(call.id, 5000)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_timeout',
          timeoutMs: 5000,
        })
      )
    })

    it('should cancel tool execution', () => {
      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.cancel(call.id, 'User cancelled')

      const updated = lifecycle.getCall(call.id)
      expect(updated.status).toBe('cancelled')
    })

    it('should emit tool_cancelled event', () => {
      const listener = vi.fn()
      lifecycle.on('tool_cancelled', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.cancel(call.id, 'User cancelled')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tool_cancelled',
          reason: 'User cancelled',
        })
      )
    })
  })

  describe('state transitions', () => {
    it('should throw on invalid transition', () => {
      const call = lifecycle.createToolCall('test_tool', {})

      // Cannot go from 'requested' to 'completed'
      expect(() => {
        lifecycle.complete(call.id, {})
      }).toThrow('Invalid state transition')
    })

    it('should allow valid transitions', () => {
      const call = lifecycle.createToolCall('test_tool', {})

      // requested → executing → completed (valid)
      expect(() => {
        lifecycle.markExecuting(call.id)
        lifecycle.complete(call.id, {})
      }).not.toThrow()
    })
  })

  describe('event listeners', () => {
    it('should support multiple listeners', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      lifecycle.on('tool_requested', listener1)
      lifecycle.on('tool_requested', listener2)

      lifecycle.createToolCall('test_tool', {})

      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)
    })

    it('should support "all" event listener', () => {
      const listener = vi.fn()
      lifecycle.on('all', listener)

      const call = lifecycle.createToolCall('test_tool', {})
      lifecycle.markExecuting(call.id)
      lifecycle.complete(call.id, {})

      // Should receive all events
      expect(listener).toHaveBeenCalledTimes(3)
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'tool_requested' })
      )
      expect(listener).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ type: 'tool_executing' })
      )
      expect(listener).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ type: 'tool_completed' })
      )
    })

    it('should return unsubscribe function', () => {
      const listener = vi.fn()
      const unsubscribe = lifecycle.on('tool_requested', listener)

      lifecycle.createToolCall('test_tool', {})
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()

      lifecycle.createToolCall('test_tool_2', {})
      expect(listener).toHaveBeenCalledTimes(1) // Not called again
    })

    it('should handle listener errors gracefully', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error')
      })
      const normalListener = vi.fn()

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      lifecycle.on('tool_requested', errorListener)
      lifecycle.on('tool_requested', normalListener)

      lifecycle.createToolCall('test_tool', {})

      expect(errorListener).toHaveBeenCalled()
      expect(normalListener).toHaveBeenCalled()
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })
  })

  describe('query methods', () => {
    it('should get all calls', () => {
      lifecycle.createToolCall('tool1', {})
      lifecycle.createToolCall('tool2', {})

      const calls = lifecycle.getAllCalls()
      expect(calls).toHaveLength(2)
    })

    it('should get calls by status', () => {
      const call1 = lifecycle.createToolCall('tool1', {})
      const call2 = lifecycle.createToolCall('tool2', {})

      lifecycle.markExecuting(call1.id)

      const executingCalls = lifecycle.getCallsByStatus('executing')
      const requestedCalls = lifecycle.getCallsByStatus('requested')

      expect(executingCalls).toHaveLength(1)
      expect(executingCalls[0].toolName).toBe('tool1')
      expect(requestedCalls).toHaveLength(1)
      expect(requestedCalls[0].toolName).toBe('tool2')
    })

    it('should throw when getting non-existent call', () => {
      expect(() => {
        lifecycle.getCall('nonexistent')
      }).toThrow('Tool call not found')
    })
  })

  describe('utility methods', () => {
    it('should clear all calls', () => {
      lifecycle.createToolCall('tool1', {})
      lifecycle.createToolCall('tool2', {})

      lifecycle.clear()

      expect(lifecycle.getAllCalls()).toHaveLength(0)
    })

    it('should remove individual call', () => {
      const call = lifecycle.createToolCall('tool1', {})
      lifecycle.createToolCall('tool2', {})

      const removed = lifecycle.removeCall(call.id)

      expect(removed).toBe(true)
      expect(lifecycle.getAllCalls()).toHaveLength(1)
    })

    it('should return false when removing non-existent call', () => {
      const removed = lifecycle.removeCall('nonexistent')
      expect(removed).toBe(false)
    })
  })
})

describe('isValidTransition', () => {
  it('should validate correct transitions', () => {
    expect(isValidTransition('requested', 'pending_approval')).toBe(true)
    expect(isValidTransition('pending_approval', 'approved')).toBe(true)
    expect(isValidTransition('approved', 'executing')).toBe(true)
    expect(isValidTransition('executing', 'completed')).toBe(true)
    expect(isValidTransition('executing', 'failed')).toBe(true)
    expect(isValidTransition('executing', 'timeout')).toBe(true)
  })

  it('should reject invalid transitions', () => {
    expect(isValidTransition('requested', 'completed')).toBe(false)
    expect(isValidTransition('pending_approval', 'completed')).toBe(false)
    expect(isValidTransition('completed', 'executing')).toBe(false)
    expect(isValidTransition('failed', 'completed')).toBe(false)
  })
})
