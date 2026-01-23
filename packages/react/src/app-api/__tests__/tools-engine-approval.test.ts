/**
 * Tool Approval System Tests
 *
 * Comprehensive test suite for the capability-based tool approval system
 * including risk levels, approval modes, and audit logging.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createToolsEngine,
  registerTool,
  createToolCall,
  approveToolCall,
  executeToolCall,
  rejectToolCall,
} from '../tools-engine'
import type { ToolDefinition, ToolsConfig } from '../types'

// =============================================================================
// Test Fixtures
// =============================================================================

const safeTool: ToolDefinition = {
  name: 'safe_tool',
  description: 'A safe tool',
  riskLevel: 'safe',
  capabilities: [],
  requiresApproval: false,
  parameters: { type: 'object', properties: {} },
  execute: async () => ({ result: 'success' }),
}

const mediumRiskTool: ToolDefinition = {
  name: 'fetch_url',
  description: 'Fetch content from a URL',
  riskLevel: 'medium',
  capabilities: ['network:outbound'],
  parameters: {
    type: 'object',
    properties: { url: { type: 'string' } },
    required: ['url'],
  },
  execute: async (params) => ({ url: (params as { url: string }).url, content: 'data' }),
}

const highRiskTool: ToolDefinition = {
  name: 'execute_code',
  description: 'Execute arbitrary code',
  riskLevel: 'high',
  capabilities: ['code:execute'],
  requiresApproval: true,
  parameters: {
    type: 'object',
    properties: { code: { type: 'string' } },
    required: ['code'],
  },
  execute: async (params) => ({ executed: true, code: (params as { code: string }).code }),
}

const toolWithSensitiveData: ToolDefinition = {
  name: 'auth_tool',
  description: 'Tool with sensitive parameters',
  riskLevel: 'medium',
  capabilities: ['data:sensitive'],
  parameters: {
    type: 'object',
    properties: {
      apiKey: { type: 'string' },
      password: { type: 'string' },
      username: { type: 'string' },
    },
    required: ['apiKey', 'password', 'username'],
  },
  execute: async () => ({ authenticated: true }),
}

// =============================================================================
// Approval Logic Tests
// =============================================================================

describe('Tool Approval System - Approval Logic', () => {
  describe('Default Behavior (Manual Mode)', () => {
    it('should auto-approve safe tools by default', () => {
      const state = createToolsEngine()
      const stateWithTool = registerTool(state, safeTool)
      const { call } = createToolCall(stateWithTool, 'safe_tool', {})

      expect(call.status).toBe('approved')
    })

    it('should auto-approve built-in safe tools', () => {
      const state = createToolsEngine()
      const { call: timeCall } = createToolCall(state, 'get_current_time', {})
      const { call: calcCall } = createToolCall(state, 'calculate', { expression: '2+2' })
      const { call: uuidCall } = createToolCall(state, 'generate_uuid', {})

      expect(timeCall.status).toBe('approved')
      expect(calcCall.status).toBe('approved')
      expect(uuidCall.status).toBe('approved')
    })

    it('should require approval for medium risk tools when autoApprove=false', () => {
      const state = createToolsEngine({ autoApprove: false })
      const stateWithTool = registerTool(state, mediumRiskTool)
      const { call } = createToolCall(stateWithTool, 'fetch_url', { url: 'https://example.com' })

      expect(call.status).toBe('pending')
    })

    it('should require approval for high risk tools', () => {
      const state = createToolsEngine({ autoApprove: false })
      const stateWithTool = registerTool(state, highRiskTool)
      const { call } = createToolCall(stateWithTool, 'execute_code', { code: 'console.log("test")' })

      expect(call.status).toBe('pending')
    })

    it('should honor explicit requiresApproval=true', () => {
      const explicitTool: ToolDefinition = {
        ...safeTool,
        requiresApproval: true,
      }
      const state = createToolsEngine()
      const stateWithTool = registerTool(state, explicitTool)
      const { call } = createToolCall(stateWithTool, 'safe_tool', {})

      expect(call.status).toBe('pending')
    })

    it('should honor explicit requiresApproval=false even for high risk', () => {
      const explicitTool: ToolDefinition = {
        ...highRiskTool,
        requiresApproval: false,
      }
      const state = createToolsEngine()
      const stateWithTool = registerTool(state, explicitTool)
      const { call } = createToolCall(stateWithTool, 'execute_code', { code: 'test' })

      expect(call.status).toBe('approved')
    })
  })

  describe('Approval Modes', () => {
    it('should auto-approve everything in auto mode', () => {
      const config: ToolsConfig = {
        approvalMode: 'auto',
        registry: [safeTool, mediumRiskTool, highRiskTool],
      }
      const state = createToolsEngine(config)

      const { call: safeCall } = createToolCall(state, 'safe_tool', {})
      const { call: mediumCall } = createToolCall(state, 'fetch_url', { url: 'https://example.com' })
      const { call: highCall } = createToolCall(state, 'execute_code', { code: 'test' })

      expect(safeCall.status).toBe('approved')
      expect(mediumCall.status).toBe('approved')
      expect(highCall.status).toBe('approved')
    })

    it('should only approve allowlist tools in allowlist mode', () => {
      const config: ToolsConfig = {
        approvalMode: 'allowlist',
        allowedTools: ['safe_tool', 'fetch_url'],
        registry: [safeTool, mediumRiskTool, highRiskTool],
      }
      const state = createToolsEngine(config)

      const { call: allowedCall1 } = createToolCall(state, 'safe_tool', {})
      const { call: allowedCall2 } = createToolCall(state, 'fetch_url', { url: 'https://example.com' })
      const { call: blockedCall } = createToolCall(state, 'execute_code', { code: 'test' })

      expect(allowedCall1.status).toBe('approved')
      expect(allowedCall2.status).toBe('approved')
      expect(blockedCall.status).toBe('pending')
    })

    it('should block specific tools in blocklist mode', () => {
      const config: ToolsConfig = {
        approvalMode: 'blocklist',
        blockedTools: ['execute_code'],
        registry: [safeTool, mediumRiskTool, highRiskTool],
      }
      const state = createToolsEngine(config)

      const { call: allowedCall1 } = createToolCall(state, 'safe_tool', {})
      const { call: allowedCall2 } = createToolCall(state, 'fetch_url', { url: 'https://example.com' })
      const { call: blockedCall } = createToolCall(state, 'execute_code', { code: 'test' })

      expect(allowedCall1.status).toBe('approved')
      expect(allowedCall2.status).toBe('approved')
      expect(blockedCall.status).toBe('pending')
    })

    it('should auto-approve configured risk levels', () => {
      const config: ToolsConfig = {
        approvalMode: 'manual',
        autoApproveRiskLevels: ['safe', 'low', 'medium'],
        registry: [safeTool, mediumRiskTool, highRiskTool],
      }
      const state = createToolsEngine(config)

      const { call: safeCall } = createToolCall(state, 'safe_tool', {})
      const { call: mediumCall } = createToolCall(state, 'fetch_url', { url: 'https://example.com' })
      const { call: highCall } = createToolCall(state, 'execute_code', { code: 'test' })

      expect(safeCall.status).toBe('approved')
      expect(mediumCall.status).toBe('approved')
      expect(highCall.status).toBe('pending')
    })
  })

  describe('Approval Workflow', () => {
    it('should allow approving pending calls', () => {
      const state = createToolsEngine({ autoApprove: false })
      const stateWithTool = registerTool(state, mediumRiskTool)
      const { state: stateWithCall, call } = createToolCall(stateWithTool, 'fetch_url', {
        url: 'https://example.com',
      })

      expect(call.status).toBe('pending')

      const approvedState = approveToolCall(stateWithCall, call.id)
      const approvedCall = approvedState.pendingCalls.find((c) => c.id === call.id)

      expect(approvedCall?.status).toBe('approved')
    })

    it('should allow rejecting pending calls', () => {
      const state = createToolsEngine({ autoApprove: false })
      const stateWithTool = registerTool(state, mediumRiskTool)
      const { state: stateWithCall, call } = createToolCall(stateWithTool, 'fetch_url', {
        url: 'https://example.com',
      })

      expect(call.status).toBe('pending')

      const rejectedState = rejectToolCall(stateWithCall, call.id, 'User declined')
      const rejectedCall = rejectedState.completedCalls.find((c) => c.id === call.id)

      expect(rejectedCall?.status).toBe('failed')
      expect(rejectedCall?.error).toContain('Rejected: User declined')
      expect(rejectedState.pendingCalls).toHaveLength(0)
    })
  })
})

// =============================================================================
// Audit Logging Tests
// =============================================================================

describe('Tool Approval System - Audit Logging', () => {
  it('should create audit log on successful execution', async () => {
    const state = createToolsEngine({ registry: [safeTool] })
    const { state: stateWithCall, call } = createToolCall(state, 'safe_tool', {})

    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    expect(executedState.auditLog).toHaveLength(1)
    const log = executedState.auditLog[0]
    expect(log.toolName).toBe('safe_tool')
    expect(log.callId).toBe(call.id)
    expect(log.approved).toBe(true)
    expect(log.executionStatus).toBe('success')
    expect(log.riskLevel).toBe('safe')
    expect(log.executionTimeMs).toBeGreaterThanOrEqual(0)
  })

  it('should create audit log on failed execution', async () => {
    const failingTool: ToolDefinition = {
      ...safeTool,
      execute: async () => {
        throw new Error('Simulated failure')
      },
    }

    const state = createToolsEngine({ registry: [failingTool] })
    const { state: stateWithCall, call } = createToolCall(state, 'safe_tool', {})

    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    expect(executedState.auditLog).toHaveLength(1)
    const log = executedState.auditLog[0]
    expect(log.executionStatus).toBe('failure')
    expect(log.error).toBe('Simulated failure')
  })

  it('should create audit log on timeout', async () => {
    const slowTool: ToolDefinition = {
      ...safeTool,
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100000))
        return { result: 'never reached' }
      },
    }

    const state = createToolsEngine({ registry: [slowTool], timeoutMs: 100 })
    const { state: stateWithCall, call } = createToolCall(state, 'safe_tool', {})

    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    expect(executedState.auditLog).toHaveLength(1)
    const log = executedState.auditLog[0]
    expect(log.executionStatus).toBe('timeout')
    expect(log.error).toBe('Execution timeout')
  })

  it('should create audit log for denied (not approved) execution', async () => {
    const state = createToolsEngine({ registry: [mediumRiskTool], autoApprove: false })
    const { state: stateWithCall, call } = createToolCall(state, 'fetch_url', {
      url: 'https://example.com',
    })

    // Try to execute without approving
    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    expect(executedState.auditLog).toHaveLength(1)
    const log = executedState.auditLog[0]
    expect(log.approved).toBe(false)
    expect(log.executionStatus).toBe('denied')
  })

  it('should sanitize sensitive parameters in audit logs', async () => {
    const state = createToolsEngine({ registry: [toolWithSensitiveData] })
    const { state: stateWithCall, call } = createToolCall(state, 'auth_tool', {
      apiKey: 'secret-key-123',
      password: 'super-secret-password',
      username: 'john.doe',
    })

    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    expect(executedState.auditLog).toHaveLength(1)
    const log = executedState.auditLog[0]
    expect(log.parameters.apiKey).toBe('***REDACTED***')
    expect(log.parameters.password).toBe('***REDACTED***')
    expect(log.parameters.username).toBe('john.doe') // Not sensitive
  })

  it('should track tool capabilities in audit logs', async () => {
    const state = createToolsEngine({ registry: [mediumRiskTool] })
    const { state: stateWithCall, call } = createToolCall(state, 'fetch_url', {
      url: 'https://example.com',
    })

    const { state: executedState } = await executeToolCall(stateWithCall, call.id)

    const log = executedState.auditLog[0]
    expect(log.capabilities).toEqual(['network:outbound'])
    expect(log.riskLevel).toBe('medium')
  })

  it('should accumulate audit logs over multiple executions', async () => {
    const state = createToolsEngine({ registry: [safeTool] })

    // Execute multiple times
    let currentState = state
    for (let i = 0; i < 3; i++) {
      const { state: stateWithCall, call } = createToolCall(currentState, 'safe_tool', {})
      const { state: executedState } = await executeToolCall(stateWithCall, call.id)
      currentState = executedState
    }

    expect(currentState.auditLog).toHaveLength(3)
    expect(currentState.auditLog.every((log) => log.toolName === 'safe_tool')).toBe(true)
  })
})

// =============================================================================
// Integration Tests
// =============================================================================

describe('Tool Approval System - Integration', () => {
  it('should work end-to-end with manual approval', async () => {
    const config: ToolsConfig = {
      approvalMode: 'manual',
      autoApproveRiskLevels: ['safe'],
      registry: [safeTool, mediumRiskTool],
    }
    const state = createToolsEngine(config)

    // Safe tool: auto-approved
    const { state: state1, call: call1 } = createToolCall(state, 'safe_tool', {})
    expect(call1.status).toBe('approved')

    // Medium risk tool: requires approval
    const { state: state2, call: call2 } = createToolCall(state1, 'fetch_url', {
      url: 'https://example.com',
    })
    expect(call2.status).toBe('pending')

    // Approve medium risk tool
    const state3 = approveToolCall(state2, call2.id)
    const approvedCall = state3.pendingCalls.find((c) => c.id === call2.id)
    expect(approvedCall?.status).toBe('approved')

    // Execute both
    const { state: state4 } = await executeToolCall(state3, call1.id)
    const { state: state5 } = await executeToolCall(state4, call2.id)

    // Verify audit logs
    expect(state5.auditLog).toHaveLength(2)
    expect(state5.auditLog[0].toolName).toBe('safe_tool')
    expect(state5.auditLog[1].toolName).toBe('fetch_url')
    expect(state5.auditLog.every((log) => log.executionStatus === 'success')).toBe(true)
  })

  it('should respect allowlist in production mode', async () => {
    const config: ToolsConfig = {
      approvalMode: 'allowlist',
      allowedTools: ['get_current_time', 'calculate'],
    }
    const state = createToolsEngine(config)

    // Built-in allowed tools should be approved
    const { call: timeCall } = createToolCall(state, 'get_current_time', {})
    const { call: calcCall } = createToolCall(state, 'calculate', { expression: '2+2' })
    const { call: uuidCall } = createToolCall(state, 'generate_uuid', {})

    expect(timeCall.status).toBe('approved')
    expect(calcCall.status).toBe('approved')
    expect(uuidCall.status).toBe('pending') // Not in allowlist
  })

  it('should block dangerous tools in blocklist mode', async () => {
    const dangerousTool: ToolDefinition = {
      name: 'delete_database',
      description: 'Delete the entire database',
      riskLevel: 'high',
      capabilities: ['write:filesystem', 'data:sensitive'],
      parameters: { type: 'object', properties: {} },
      execute: async () => ({ deleted: true }),
    }

    const config: ToolsConfig = {
      approvalMode: 'blocklist',
      blockedTools: ['delete_database', 'execute_code'],
      registry: [safeTool, dangerousTool],
    }
    const state = createToolsEngine(config)

    const { call: safeCall } = createToolCall(state, 'safe_tool', {})
    const { call: dangerousCall } = createToolCall(state, 'delete_database', {})

    expect(safeCall.status).toBe('approved')
    expect(dangerousCall.status).toBe('pending') // Blocked
  })
})
