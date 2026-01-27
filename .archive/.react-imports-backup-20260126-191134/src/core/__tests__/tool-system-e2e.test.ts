/**
 * End-to-End Tool System Integration Tests
 *
 * Tests complete tool calling flows from registration to execution,
 * integrating all components: registry, executor, lifecycle, orchestrator.
 *
 * @module core/__tests__/tool-system-e2e.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToolOrchestrator } from '../tool-orchestrator'
import { ToolRegistry } from '../tool-registry'
import { ToolExecutor } from '../tool-executor'
import { ToolLifecycleManager } from '../tool-lifecycle'
import type { ToolDefinition } from '../../types/tool-definition'

// =============================================================================
// Test Tools
// =============================================================================

/**
 * Create a weather tool for testing
 */
function createWeatherTool(): ToolDefinition {
  return {
    name: 'get_weather',
    description: 'Get current weather for a location',
    cacheable: true,
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name',
        },
        units: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature units',
        },
      },
      required: ['location'],
    },
    execute: async ({ location, units = 'celsius' }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 10))

      const tempCelsius = 22
      const temp =
        units === 'fahrenheit' ? (tempCelsius * 9) / 5 + 32 : tempCelsius

      return {
        location,
        temperature: temp,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 10,
      }
    },
  }
}

/**
 * Create a calculator tool for testing
 */
function createCalculatorTool(): ToolDefinition {
  return {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['add', 'subtract', 'multiply', 'divide'],
        },
        a: { type: 'number' },
        b: { type: 'number' },
      },
      required: ['operation', 'a', 'b'],
    },
    execute: async ({ operation, a, b }) => {
      await new Promise((resolve) => setTimeout(resolve, 5))

      switch (operation) {
        case 'add':
          return { result: a + b }
        case 'subtract':
          return { result: a - b }
        case 'multiply':
          return { result: a * b }
        case 'divide':
          if (b === 0) throw new Error('Division by zero')
          return { result: a / b }
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }
    },
  }
}

/**
 * Create a database query tool that requires approval
 */
function createDatabaseTool(): ToolDefinition {
  return {
    name: 'query_database',
    description: 'Execute a database query',
    requiresApproval: true,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
    execute: async ({ query }) => {
      await new Promise((resolve) => setTimeout(resolve, 15))
      return {
        rows: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        count: 2,
      }
    },
  }
}

/**
 * Create a tool that always fails
 */
function createFailingTool(): ToolDefinition {
  return {
    name: 'failing_tool',
    description: 'A tool that always fails',
    parameters: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      throw new Error('Tool execution failed')
    },
  }
}

// =============================================================================
// E2E Tests: Complete Flow - Auto Approve
// =============================================================================

describe('E2E: Complete Flow - Auto Approve', () => {
  it('should execute complete flow from request to response', async () => {
    // 1. Setup: Create orchestrator with tools
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })

    // 2. User Request: "What's the weather in San Francisco?"
    const toolCall = {
      toolName: 'get_weather',
      args: { location: 'San Francisco', units: 'fahrenheit' },
    }

    // 3. Execute tool through orchestrator
    const result = await orchestrator.executeTool(
      toolCall.toolName,
      toolCall.args
    )

    // 4. Verify result
    expect(result.status).toBe('completed')
    expect(result.result).toEqual({
      location: 'San Francisco',
      temperature: 71.6, // 22°C = 71.6°F
      condition: 'sunny',
      humidity: 65,
      windSpeed: 10,
    })

    // 5. Verify lifecycle tracking
    const lifecycleRecord = orchestrator.getToolCall(result.callId)
    expect(lifecycleRecord.status).toBe('completed')
    expect(lifecycleRecord.toolName).toBe('get_weather')
    expect(lifecycleRecord.duration).toBeGreaterThan(0)

    // 6. Verify cache (second call should be faster)
    const cachedResult = await orchestrator.executeTool(
      toolCall.toolName,
      toolCall.args
    )

    if (cachedResult.status !== 'completed') {
      if (process.env.NODE_ENV === 'development') {
        console.error('Cached result failed:', cachedResult.error)
      }
    }

    expect(cachedResult.status).toBe('completed')
    expect(cachedResult.cached).toBe(true)
    expect(cachedResult.result).toEqual(result.result)
  })

  it('should handle sequential tool calls', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })

    // Simulate conversation:
    // User: "What's the weather in Paris?"
    // AI: Uses get_weather tool
    // User: "What's that in Fahrenheit?"
    // AI: Uses calculate tool

    // First tool call: get weather
    const weatherResult = await orchestrator.executeTool('get_weather', {
      location: 'Paris',
      units: 'celsius',
    })

    expect(weatherResult.status).toBe('completed')
    const temp = weatherResult.result?.temperature as number

    // Second tool call: convert to Fahrenheit
    const convertResult = await orchestrator.executeTool('calculate', {
      operation: 'multiply',
      a: temp,
      b: 9 / 5,
    })

    expect(convertResult.status).toBe('completed')

    // Verify both calls are tracked
    const allCalls = orchestrator.getAllToolCalls()
    expect(allCalls).toHaveLength(2)
    expect(allCalls[0].toolName).toBe('get_weather')
    expect(allCalls[1].toolName).toBe('calculate')
  })

  it('should handle parallel tool calls', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })

    // Simulate: "What's the weather in London and Paris, and calculate 5 * 10?"
    const [weather1, weather2, calc] = await Promise.all([
      orchestrator.executeTool('get_weather', { location: 'London' }),
      orchestrator.executeTool('get_weather', { location: 'Paris' }),
      orchestrator.executeTool('calculate', {
        operation: 'multiply',
        a: 5,
        b: 10,
      }),
    ])

    expect(weather1.status).toBe('completed')
    expect(weather2.status).toBe('completed')
    expect(calc.status).toBe('completed')
    expect(calc.result).toEqual({ result: 50 })

    // Verify all three calls are tracked
    const allCalls = orchestrator.getAllToolCalls()
    expect(allCalls).toHaveLength(3)
  })
})

// =============================================================================
// E2E Tests: Manual Approval Flow
// =============================================================================

describe('E2E: Manual Approval Flow', () => {
  it('should require approval for sensitive tools', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: false,
      tools: [createDatabaseTool()],
    })

    // Attempt to execute tool without approval
    const result = await orchestrator.executeTool('query_database', {
      query: 'SELECT * FROM users',
    })

    expect(result.status).toBe('pending_approval')

    // Verify call is in pending_approval state
    const pendingCalls = orchestrator.getPendingToolCalls()
    expect(pendingCalls).toHaveLength(1)
  })

  it('should execute after manual approval', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: false,
      tools: [createDatabaseTool()],
    })

    // Create lifecycle manager events
    const approvedCalls: string[] = []
    orchestrator.lifecycle.on('tool_approved', (event) => {
      approvedCalls.push(event.call.id)
    })

    // Start execution (will return pending due to approval requirement)
    let callId: string | undefined
    const result = await orchestrator.executeTool('query_database', {
      query: 'SELECT * FROM users',
    })

    if (result.status === 'pending_approval') {
      callId = result.callId
    }

    expect(callId).toBeDefined()

    // Manually approve
    orchestrator.approveTool(callId!, 'admin@example.com')
    expect(approvedCalls).toContain(callId)

    // Execute approved tool
    const approvedResult = await orchestrator.executeApprovedTool(callId!)

    expect(approvedResult.status).toBe('completed')
    expect(approvedResult.result).toEqual({
      rows: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      count: 2,
    })
  })

  it('should reject tool calls', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: false,
      tools: [createDatabaseTool()],
    })

    // Track rejected events
    const rejectedCalls: string[] = []
    orchestrator.lifecycle.on('tool_rejected', (event) => {
      rejectedCalls.push(event.call.id)
    })

    // Start execution
    let callId: string | undefined
    const result = await orchestrator.executeTool('query_database', {
      query: 'DELETE FROM users',
    })

    if (result.status === 'pending_approval') {
      callId = result.callId
    }

    expect(callId).toBeDefined()

    // Reject the call
    orchestrator.rejectTool(callId!, 'Dangerous query', 'admin@example.com')
    expect(rejectedCalls).toContain(callId)

    // Verify call is rejected
    const call = orchestrator.getToolCall(callId!)
    expect(call.status).toBe('rejected')
    expect(call.rejectionReason).toContain('Dangerous query')
  })
})

// =============================================================================
// E2E Tests: Error Handling
// =============================================================================

describe('E2E: Error Handling', () => {
  it('should handle tool execution failures', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFailingTool()],
    })

    const result = await orchestrator.executeTool('failing_tool', {})

    expect(result.status).toBe('failed')
    expect(result.error).toBeDefined()
    expect(result.error?.message).toBe('Tool execution failed')

    // Verify lifecycle tracked the failure
    const call = orchestrator.getToolCall(result.callId)
    expect(call.status).toBe('failed')
  })

  it('should handle tool not found', async () => {
    const orchestrator = new ToolOrchestrator({ autoApprove: true })

    await expect(
      orchestrator.executeTool('nonexistent_tool', {})
    ).rejects.toThrow('Tool not found: nonexistent_tool')
  })

  it('should handle validation errors', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createCalculatorTool()],
    })

    // Missing required parameter
    const result = await orchestrator.executeTool(
      'calculate',
      { operation: 'add', a: 5 } // Missing 'b'
    )

    expect(result.status).toBe('failed')
    expect(result.error?.message).toContain('Parameter validation failed')
  })

  it('should handle timeout', async () => {
    const slowTool: ToolDefinition = {
      name: 'slow_tool',
      description: 'A tool that takes too long',
      parameters: { type: 'object', properties: {} },
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return { done: true }
      },
    }

    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      defaultTimeout: 50,
      tools: [slowTool],
    })

    const result = await orchestrator.executeTool('slow_tool', {})

    expect(result.status).toBe('timeout')
    expect(result.error?.message).toContain('timeout')
  })
})

// =============================================================================
// E2E Tests: Tool Discovery
// =============================================================================

describe('E2E: Tool Discovery', () => {
  it('should list available tools', () => {
    const orchestrator = new ToolOrchestrator({
      tools: [
        createWeatherTool(),
        createCalculatorTool(),
        createDatabaseTool(),
      ],
    })

    const tools = orchestrator.getAllTools()

    expect(tools).toHaveLength(3)
    expect(tools.map((t) => t.name)).toEqual([
      'get_weather',
      'calculate',
      'query_database',
    ])
  })

  it('should get tool by name', () => {
    const orchestrator = new ToolOrchestrator({
      tools: [createWeatherTool()],
    })

    const tool = orchestrator.getTool('get_weather')

    expect(tool).toBeDefined()
    expect(tool?.name).toBe('get_weather')
    expect(tool?.description).toBe('Get current weather for a location')
  })
})

// =============================================================================
// E2E Tests: Lifecycle Events
// =============================================================================

describe('E2E: Lifecycle Events', () => {
  it('should emit events during tool execution', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool()],
    })

    const events: string[] = []

    orchestrator.lifecycle.on('tool_requested', () => events.push('created'))
    orchestrator.lifecycle.on('tool_approved', () => events.push('approved'))
    orchestrator.lifecycle.on('tool_executing', () => events.push('executing'))
    orchestrator.lifecycle.on('tool_completed', () => events.push('completed'))

    await orchestrator.executeTool('get_weather', { location: 'Tokyo' })

    expect(events).toEqual(['created', 'approved', 'executing', 'completed'])
  })

  it('should emit failure events', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFailingTool()],
    })

    const events: string[] = []

    orchestrator.lifecycle.on('tool_requested', () => events.push('created'))
    orchestrator.lifecycle.on('tool_approved', () => events.push('approved'))
    orchestrator.lifecycle.on('tool_executing', () => events.push('executing'))
    orchestrator.lifecycle.on('tool_failed', () => events.push('failed'))

    await orchestrator.executeTool('failing_tool', {})

    expect(events).toEqual(['created', 'approved', 'executing', 'failed'])
  })
})

// =============================================================================
// E2E Tests: Statistics
// =============================================================================

describe('E2E: Statistics', () => {
  it('should track orchestrator statistics', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })

    // Execute some tools
    await orchestrator.executeTool('get_weather', { location: 'Berlin' })
    await orchestrator.executeTool('calculate', {
      operation: 'add',
      a: 2,
      b: 3,
    })
    await orchestrator.executeTool('get_weather', { location: 'Berlin' }) // Cached

    const stats = orchestrator.getStats()

    expect(stats.registry.totalTools).toBe(2)
    expect(stats.calls.total).toBe(3)
    expect(stats.calls.byStatus.completed).toBe(2)
    expect(stats.calls.byStatus.cached).toBe(1)
    expect(stats.cache.hits).toBe(1)
  })

  it('should track cache statistics', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: true,
      tools: [createWeatherTool()],
    })

    // First call - miss
    await orchestrator.executeTool('get_weather', { location: 'Rome' })

    // Second call - hit
    await orchestrator.executeTool('get_weather', { location: 'Rome' })

    // Different args - miss
    await orchestrator.executeTool('get_weather', { location: 'Madrid' })

    const cacheStats = orchestrator.getCacheStats()

    expect(cacheStats.hits).toBe(1)
    expect(cacheStats.misses).toBe(2)
    expect(cacheStats.hitRate).toBeCloseTo(0.333, 2)
  })
})

// =============================================================================
// E2E Tests: Real-World Scenario
// =============================================================================

describe('E2E: Real-World Scenario', () => {
  it('should handle complex multi-turn conversation', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })

    // Turn 1: User asks about weather
    // AI: "Let me check the weather for you"
    const turn1 = await orchestrator.executeTool('get_weather', {
      location: 'San Francisco',
      units: 'fahrenheit',
    })

    expect(turn1.status).toBe('completed')
    const weather = turn1.result as any

    // Turn 2: User asks to compare with another city
    // AI: "Let me check the weather in New York too"
    const turn2 = await orchestrator.executeTool('get_weather', {
      location: 'New York',
      units: 'fahrenheit',
    })

    expect(turn2.status).toBe('completed')
    const weather2 = turn2.result as any

    // Turn 3: User asks about temperature difference
    // AI: "Let me calculate the difference"
    const turn3 = await orchestrator.executeTool('calculate', {
      operation: 'subtract',
      a: weather.temperature,
      b: weather2.temperature,
    })

    expect(turn3.status).toBe('completed')
    expect(turn3.result).toHaveProperty('result')

    // Verify conversation history
    const allCalls = orchestrator.getAllToolCalls()
    expect(allCalls).toHaveLength(3)

    // Verify caching worked for repeated queries
    const cachedWeather = await orchestrator.executeTool('get_weather', {
      location: 'San Francisco',
      units: 'fahrenheit',
    })
    expect(cachedWeather.status).toBe('completed')
    expect(cachedWeather.cached).toBe(true)

    // Verify statistics
    const stats = orchestrator.getStats()
    expect(stats.calls.total).toBe(4) // 3 original + 1 cached
    expect(stats.cache.hits).toBe(1)
  })
})
