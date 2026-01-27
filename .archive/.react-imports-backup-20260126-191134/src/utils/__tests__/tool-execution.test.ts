/**
 * Tool Execution Utilities Tests
 *
 * Tests for retry, fallback, timeout, logging, and batch execution utilities
 *
 * @module utils/__tests__/tool-execution.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  executeWithRetry,
  executeWithFallback,
  executeWithTimeout,
  executeWithLogging,
  executeBatch,
} from '../tool-execution'
import { ToolOrchestrator } from '../../core/tool-orchestrator'
import type { ToolDefinition } from '../../../types/tool-definition'

// =============================================================================
// Test Tools
// =============================================================================

function createSuccessTool(): ToolDefinition {
  return {
    name: 'success_tool',
    description: 'Always succeeds',
    parameters: { type: 'object', properties: {} },
    handler: async () => ({ result: 'success' }),
  }
}

function createFlakyTool(failCount = 2): ToolDefinition {
  let attempts = 0

  return {
    name: 'flaky_tool',
    description: 'Fails first N times, then succeeds',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      attempts++
      if (attempts <= failCount) {
        throw new Error(`Attempt ${attempts} failed`)
      }
      return { result: 'success', attempts }
    },
  }
}

function createSlowTool(delay: number): ToolDefinition {
  return {
    name: 'slow_tool',
    description: 'Takes time to execute',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return { result: 'success' }
    },
  }
}

function createFailingTool(): ToolDefinition {
  return {
    name: 'failing_tool',
    description: 'Always fails',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      throw new Error('Tool failed')
    },
  }
}

// =============================================================================
// Tests: Retry Execution
// =============================================================================

describe('executeWithRetry', () => {
  it('should succeed on first attempt if tool succeeds', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSuccessTool()],
    })

    const result = await executeWithRetry(orchestrator, 'success_tool', {})

    expect(result).toEqual({ result: 'success' })
  })

  it('should retry on failure and eventually succeed', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFlakyTool(2)], // Fails 2 times, succeeds on 3rd
    })

    const onRetry = vi.fn()

    const result = await executeWithRetry(orchestrator, 'flaky_tool', {}, {
      maxRetries: 3,
      initialDelay: 10,
      onRetry,
    })

    expect(result).toHaveProperty('result', 'success')
    expect(result).toHaveProperty('attempts', 3)
    expect(onRetry).toHaveBeenCalledTimes(2) // Retried twice
  })

  it('should respect maxRetries limit', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFailingTool()],
    })

    await expect(
      executeWithRetry(orchestrator, 'failing_tool', {}, {
        maxRetries: 2,
        initialDelay: 10,
      })
    ).rejects.toThrow('Tool failed')
  })

  it('should use exponential backoff', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFlakyTool(3)],
    })

    const delays: number[] = []
    const onRetry = vi.fn((attempt, delay) => {
      delays.push(delay)
    })

    await executeWithRetry(orchestrator, 'flaky_tool', {}, {
      maxRetries: 4,
      initialDelay: 100,
      backoffMultiplier: 2,
      onRetry,
    })

    // Delays should be: 100, 200, 400
    expect(delays).toEqual([100, 200, 400])
  })

  it('should respect maxDelay', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFlakyTool(3)],
    })

    const delays: number[] = []
    const onRetry = vi.fn((attempt, delay) => {
      delays.push(delay)
    })

    await executeWithRetry(orchestrator, 'flaky_tool', {}, {
      maxRetries: 4,
      initialDelay: 100,
      backoffMultiplier: 2,
      maxDelay: 150,
      onRetry,
    })

    // Delays should be capped at 150: 100, 150, 150
    expect(delays).toEqual([100, 150, 150])
  })

  it('should support custom retry condition', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFailingTool()],
    })

    const shouldRetry = vi.fn(() => false)

    await expect(
      executeWithRetry(orchestrator, 'failing_tool', {}, {
        maxRetries: 3,
        shouldRetry,
      })
    ).rejects.toThrow()

    expect(shouldRetry).toHaveBeenCalledTimes(1)
  })
})

// =============================================================================
// Tests: Fallback Execution
// =============================================================================

describe('executeWithFallback', () => {
  it('should succeed with primary tool', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSuccessTool()],
    })

    const result = await executeWithFallback(orchestrator, {}, {
      tools: ['success_tool'],
    })

    expect(result).toEqual({ result: 'success' })
  })

  it('should fallback to secondary tool on primary failure', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        createFailingTool(),
        {
          name: 'secondary_tool',
          description: 'Secondary tool',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ result: 'secondary' }),
        },
      ],
    })

    const onFallback = vi.fn()

    const result = await executeWithFallback(orchestrator, {}, {
      tools: ['failing_tool', 'secondary_tool'],
      onFallback,
    })

    expect(result).toEqual({ result: 'secondary' })
    expect(onFallback).toHaveBeenCalledWith('failing_tool', 'secondary_tool')
  })

  it('should try all tools in order', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        { name: 'tool1', description: '', parameters: { type: 'object', properties: {} }, handler: async () => { throw new Error('fail') } },
        { name: 'tool2', description: '', parameters: { type: 'object', properties: {} }, handler: async () => { throw new Error('fail') } },
        { name: 'tool3', description: '', parameters: { type: 'object', properties: {} }, handler: async () => ({ result: 'tool3' }) },
      ],
    })

    const result = await executeWithFallback(orchestrator, {}, {
      tools: ['tool1', 'tool2', 'tool3'],
    })

    expect(result).toEqual({ result: 'tool3' })
  })

  it('should throw if all tools fail', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        { name: 'tool1', description: '', parameters: { type: 'object', properties: {} }, handler: async () => { throw new Error('fail1') } },
        { name: 'tool2', description: '', parameters: { type: 'object', properties: {} }, handler: async () => { throw new Error('fail2') } },
      ],
    })

    await expect(
      executeWithFallback(orchestrator, {}, {
        tools: ['tool1', 'tool2'],
      })
    ).rejects.toThrow('All fallback tools failed')
  })

  it('should support different args per tool', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        {
          name: 'tool1',
          description: '',
          parameters: { type: 'object', properties: { value: { type: 'number' } } },
          handler: async ({ value }) => ({ result: value * 2 }),
        },
        {
          name: 'tool2',
          description: '',
          parameters: { type: 'object', properties: { value: { type: 'number' } } },
          handler: async ({ value }) => ({ result: value * 3 }),
        },
      ],
    })

    const result = await executeWithFallback(orchestrator, { value: 5 }, {
      tools: ['tool1'],
      argsPerTool: {
        tool1: { value: 10 },
      },
    })

    expect(result).toEqual({ result: 20 })
  })
})

// =============================================================================
// Tests: Timeout Execution
// =============================================================================

describe('executeWithTimeout', () => {
  it('should succeed if execution completes within timeout', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSlowTool(50)],
    })

    const result = await executeWithTimeout(orchestrator, 'slow_tool', {}, {
      timeout: 100,
    })

    expect(result).toEqual({ result: 'success' })
  })

  it('should throw if execution exceeds timeout', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSlowTool(200)],
    })

    const onTimeout = vi.fn()

    await expect(
      executeWithTimeout(orchestrator, 'slow_tool', {}, {
        timeout: 100,
        onTimeout,
      })
    ).rejects.toThrow('timed out')

    expect(onTimeout).toHaveBeenCalledWith('slow_tool', {})
  })

  it('should support custom timeout message', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSlowTool(200)],
    })

    await expect(
      executeWithTimeout(orchestrator, 'slow_tool', {}, {
        timeout: 100,
        message: 'Custom timeout message',
      })
    ).rejects.toThrow('Custom timeout message')
  })
})

// =============================================================================
// Tests: Logged Execution
// =============================================================================

describe('executeWithLogging', () => {
  it('should log execution start and completion', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSuccessTool()],
    })

    const logger = vi.fn()

    const result = await executeWithLogging(orchestrator, 'success_tool', {}, {
      logger,
      logArgs: true,
      logResults: true,
    })

    expect(result).toEqual({ result: 'success' })
    expect(logger).toHaveBeenCalledTimes(2) // Start + completion
    expect(logger).toHaveBeenNthCalledWith(
      1,
      'info',
      expect.stringContaining('Executing tool: success_tool'),
      expect.objectContaining({ args: {} })
    )
    expect(logger).toHaveBeenNthCalledWith(
      2,
      'info',
      expect.stringContaining('Tool completed: success_tool'),
      expect.objectContaining({ result: { result: 'success' } })
    )
  })

  it('should log errors', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFailingTool()],
    })

    const logger = vi.fn()

    await expect(
      executeWithLogging(orchestrator, 'failing_tool', {}, {
        logger,
      })
    ).rejects.toThrow()

    expect(logger).toHaveBeenCalledWith(
      'error',
      expect.stringContaining('Tool error: failing_tool'),
      expect.objectContaining({ error: 'Tool failed' })
    )
  })

  it('should not log if disabled', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSuccessTool()],
    })

    const logger = vi.fn()

    await executeWithLogging(orchestrator, 'success_tool', {}, {
      enabled: false,
      logger,
    })

    expect(logger).not.toHaveBeenCalled()
  })

  it('should respect logArgs and logResults options', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createSuccessTool()],
    })

    const logger = vi.fn()

    await executeWithLogging(orchestrator, 'success_tool', { foo: 'bar' }, {
      logger,
      logArgs: false,
      logResults: false,
    })

    // Check that args/results weren't logged
    const completionCall = logger.mock.calls.find((call) =>
      call[1].includes('completed')
    )
    expect(completionCall[2]).not.toHaveProperty('args')
    expect(completionCall[2]).not.toHaveProperty('result')
  })
})

// =============================================================================
// Tests: Batch Execution
// =============================================================================

describe('executeBatch', () => {
  it('should execute multiple tools in parallel', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        { name: 'tool1', description: '', parameters: { type: 'object', properties: {} }, handler: async () => ({ result: 1 }) },
        { name: 'tool2', description: '', parameters: { type: 'object', properties: {} }, handler: async () => ({ result: 2 }) },
        { name: 'tool3', description: '', parameters: { type: 'object', properties: {} }, handler: async () => ({ result: 3 }) },
      ],
    })

    const results = await executeBatch(orchestrator, [
      { toolName: 'tool1', args: {} },
      { toolName: 'tool2', args: {} },
      { toolName: 'tool3', args: {} },
    ])

    expect(results).toHaveLength(3)
    expect(results[0]).toEqual({ success: true, result: { result: 1 } })
    expect(results[1]).toEqual({ success: true, result: { result: 2 } })
    expect(results[2]).toEqual({ success: true, result: { result: 3 } })
  })

  it('should handle individual failures', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [
        createSuccessTool(),
        createFailingTool(),
      ],
    })

    const results = await executeBatch(orchestrator, [
      { toolName: 'success_tool', args: {} },
      { toolName: 'failing_tool', args: {} },
    ])

    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({ success: true, result: { result: 'success' } })
    expect(results[1]).toEqual({ success: false, error: expect.any(Error) })
  })
})
