import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createToolsEngine,
  registerTool,
  createToolCall,
  approveToolCall,
  executeToolCall,
} from '../tools-engine'
import type { ToolsEngineState, ToolExecutionResult } from '../tools-engine'
import type { ToolDefinition } from '../types'

describe('Tools Engine - AbortSignal & Timeout Cleanup', () => {
  let state: ToolsEngineState

  beforeEach(() => {
    vi.useFakeTimers()
    state = createToolsEngine({
      timeoutMs: 1000, // 1 second timeout for tests
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should pass AbortSignal to tool execute function', async () => {
    const executeMock = vi.fn().mockResolvedValue('result')
    const tool: ToolDefinition = {
      name: 'test_tool',
      description: 'Test tool',
      parameters: {},
      execute: executeMock,
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'test_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)
    await vi.runAllTimersAsync()
    await executePromise

    // Should be called with params and signal
    expect(executeMock).toHaveBeenCalledWith({}, expect.any(AbortSignal))
  })

  it('should abort signal on timeout', async () => {
    let capturedSignal: AbortSignal | undefined

    const tool: ToolDefinition = {
      name: 'slow_tool',
      description: 'Slow tool',
      parameters: {},
      execute: async (_params, signal) => {
        capturedSignal = signal
        // Simulate long-running operation
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return 'result'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'slow_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)

    // Fast-forward past timeout
    await vi.advanceTimersByTimeAsync(1100)

    const { result } = await executePromise

    // Signal should be aborted
    expect(capturedSignal?.aborted).toBe(true)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Execution timeout')
  })

  it('should clear timeout on successful completion', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const tool: ToolDefinition = {
      name: 'fast_tool',
      description: 'Fast tool',
      parameters: {},
      execute: async (_params, signal) => {
        // Check signal is not aborted
        expect(signal?.aborted).toBe(false)
        return 'result'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'fast_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)
    await vi.runAllTimersAsync()
    const { result } = await executePromise

    // Should have successfully completed
    expect(result.success).toBe(true)
    expect(result.result).toBe('result')

    // clearTimeout should have been called
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should clear timeout on error', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const tool: ToolDefinition = {
      name: 'error_tool',
      description: 'Error tool',
      parameters: {},
      execute: async () => {
        throw new Error('Tool error')
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'error_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)
    await vi.runAllTimersAsync()
    const { result } = await executePromise

    // Should have failed
    expect(result.success).toBe(false)
    expect(result.error).toBe('Tool error')

    // clearTimeout should have been called in catch block
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should allow tools to respond to abort signal', async () => {
    let wasAborted = false

    const tool: ToolDefinition = {
      name: 'abortable_tool',
      description: 'Abortable tool',
      parameters: {},
      execute: async (_params, signal) => {
        // Check abort before starting work
        if (signal?.aborted) {
          throw new Error('Operation aborted')
        }

        // Simulate work with abort checking
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 200))

          // Check if aborted during work
          if (signal?.aborted) {
            wasAborted = true
            throw new Error('Operation aborted')
          }
        }

        return 'completed'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'abortable_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)

    // Fast-forward to trigger timeout
    await vi.advanceTimersByTimeAsync(1100)

    const { result } = await executePromise

    // Tool should have detected abort
    expect(wasAborted).toBe(true)
    expect(result.success).toBe(false)
  })

  it('should handle tools that check abort before execution', async () => {
    const tool: ToolDefinition = {
      name: 'check_abort',
      description: 'Tool that checks abort immediately',
      parameters: {},
      execute: async (_params, signal) => {
        if (signal?.aborted) {
          throw new Error('Operation aborted')
        }
        return 'result'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'check_abort',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    // Should work normally when not aborted
    const executePromise = executeToolCall(approvedState, call.id)
    await vi.runAllTimersAsync()
    const { result } = await executePromise

    expect(result.success).toBe(true)
    expect(result.result).toBe('result')
  })

  it('should handle tools that ignore abort signal', async () => {
    const tool: ToolDefinition = {
      name: 'ignore_abort',
      description: 'Tool that ignores abort signal',
      parameters: {},
      execute: async () => {
        // Tool doesn't check signal - just does work
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return 'result'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'ignore_abort',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)

    // Fast-forward past timeout
    await vi.advanceTimersByTimeAsync(1100)

    const { result } = await executePromise

    // Should timeout even though tool ignores signal
    expect(result.success).toBe(false)
    expect(result.error).toBe('Execution timeout')
  })

  it('should track timeout status correctly', async () => {
    const tool: ToolDefinition = {
      name: 'timeout_tool',
      description: 'Tool that times out',
      parameters: {},
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return 'result'
      },
    }

    state = registerTool(state, tool)
    const { state: stateWithCall, call } = createToolCall(
      state,
      'timeout_tool',
      {}
    )
    const approvedState = approveToolCall(stateWithCall, call.id)

    const executePromise = executeToolCall(approvedState, call.id)
    await vi.advanceTimersByTimeAsync(1100)
    const { state: finalState } = await executePromise

    // Check completed call has timeout status
    const completedCall = finalState.completedCalls.find(
      (c) => c.id === call.id
    )
    expect(completedCall?.status).toBe('timeout')
    expect(completedCall?.error).toBe('Execution timeout')
  })
})
