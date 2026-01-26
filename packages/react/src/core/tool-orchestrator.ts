/**
 * Tool Orchestrator
 *
 * High-level coordinator for tool execution. Integrates registry, executor,
 * and lifecycle manager into a unified, easy-to-use API.
 *
 * **Features**:
 * - Unified tool management (register, execute, track)
 * - Automatic lifecycle management
 * - Approval flow integration
 * - Comprehensive event system
 * - Statistics and monitoring
 *
 * @module core/tool-orchestrator
 */

import { ToolRegistry } from './tool-registry'
import { ToolExecutor } from './tool-executor'
import { ToolLifecycleManager } from './tool-lifecycle'
import type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
} from '../types/tool-definition'
import type { ToolCallStatus, ToolCallRecord } from './tool-lifecycle'

// =============================================================================
// Orchestrator Configuration
// =============================================================================

/**
 * Orchestrator configuration
 */
export interface OrchestratorConfig {
  /** Auto-approve tools (default: false for security) */
  autoApprove?: boolean

  /** Default timeout in milliseconds (default: 30000) */
  defaultTimeout?: number

  /** Enable caching by default (default: true) */
  enableCaching?: boolean

  /** Default cache TTL in milliseconds (default: 300000 = 5 min) */
  defaultCacheTtl?: number

  /** Pre-registered tools */
  tools?: ToolDefinition[]
}

// =============================================================================
// Orchestration Result
// =============================================================================

/**
 * Tool orchestration result
 *
 * Combines execution result with lifecycle information
 */
export interface OrchestrationResult {
  /** Call ID for tracking */
  callId: string

  /** Tool name */
  toolName: string

  /** Tool arguments */
  args: ToolArguments

  /** Final status */
  status: ToolCallStatus

  /** Execution result (if completed) */
  result?: ToolResult

  /** Error (if failed) */
  error?: Error

  /** Execution duration in milliseconds */
  duration?: number

  /** Whether result came from cache */
  cached?: boolean

  /** Full lifecycle record */
  lifecycleRecord: ToolCallRecord
}

// =============================================================================
// Tool Orchestrator
// =============================================================================

/**
 * Tool Orchestrator
 *
 * High-level API for tool management and execution.
 *
 * @example
 * ```typescript
 * const orchestrator = new ToolOrchestrator({
 *   autoApprove: false,  // Require explicit approval
 *   tools: [weatherTool, calculatorTool]
 * })
 *
 * // Subscribe to events
 * orchestrator.lifecycle.on('tool_completed', (event) => {
 *   console.log(`✓ ${event.call.toolName} completed`)
 * })
 *
 * // Execute tool
 * const result = await orchestrator.executeTool('get_weather', {
 *   location: 'San Francisco'
 * })
 *
 * console.log(`Weather: ${result.result}`)
 * ```
 */
export class ToolOrchestrator {
  /** Tool registry */
  public readonly registry: ToolRegistry

  /** Tool executor */
  public readonly executor: ToolExecutor

  /** Lifecycle manager */
  public readonly lifecycle: ToolLifecycleManager

  private config: Required<OrchestratorConfig>

  constructor(config: OrchestratorConfig = {}) {
    this.config = {
      autoApprove: config.autoApprove ?? false,
      defaultTimeout: config.defaultTimeout ?? 30000,
      enableCaching: config.enableCaching ?? true,
      defaultCacheTtl: config.defaultCacheTtl ?? 300000,
      tools: config.tools ?? [],
    }

    // SECURITY: Prevent autoApprove in production
    if (this.config.autoApprove) {
      const isProduction =
        typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'

      if (isProduction) {
        throw new Error(
          '[ToolOrchestrator] SECURITY ERROR: autoApprove cannot be enabled in production. ' +
            'Tools must require explicit user approval. Set autoApprove: false.'
        )
      }

      // Warn in non-production environments
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[ToolOrchestrator] SECURITY WARNING: autoApprove is enabled. Tools will execute without user consent. ' +
            'This should only be used in trusted development/testing environments.'
        )
      }
    }

    this.registry = new ToolRegistry()
    this.lifecycle = new ToolLifecycleManager()
    this.executor = new ToolExecutor(this.lifecycle)

    // Register initial tools
    if (this.config.tools.length > 0) {
      this.registry.registerMany(this.config.tools)
    }
  }

  // ===========================================================================
  // Tool Management
  // ===========================================================================

  /**
   * Register a tool
   */
  registerTool(tool: ToolDefinition): void {
    this.registry.register(tool)
  }

  /**
   * Register multiple tools
   */
  registerTools(tools: ToolDefinition[]): void {
    this.registry.registerMany(tools)
  }

  /**
   * Unregister a tool
   */
  unregisterTool(name: string): boolean {
    return this.registry.unregister(name)
  }

  /**
   * Get tool definition
   */
  getTool(name: string): ToolDefinition | undefined {
    return this.registry.get(name)
  }

  /**
   * Get all tools
   */
  getAllTools(): ToolDefinition[] {
    return this.registry.getAll()
  }

  // ===========================================================================
  // Tool Execution
  // ===========================================================================

  /**
   * Execute a tool with full lifecycle management
   *
   * @param toolName - Tool name
   * @param args - Tool arguments
   * @param options - Execution options
   * @returns Orchestration result
   *
   * @example
   * ```typescript
   * const result = await orchestrator.executeTool('get_weather', {
   *   location: 'San Francisco'
   * })
   *
   * if (result.status === 'completed') {
   *   console.log('Weather:', result.result)
   * }
   * ```
   */
  async executeTool(
    toolName: string,
    args: ToolArguments,
    options: {
      timeout?: number
      signal?: AbortSignal
      skipValidation?: boolean
      skipCache?: boolean
      context?: Partial<ToolExecutionContext>
      requireApproval?: boolean
    } = {}
  ): Promise<OrchestrationResult> {
    // Get tool definition
    const tool = this.registry.get(toolName)
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`)
    }

    // Create lifecycle record
    const call = this.lifecycle.createToolCall(toolName, args, options.context)

    try {
      // Determine if approval is required
      const needsApproval =
        options.requireApproval ??
        tool.requiresApproval ??
        !this.config.autoApprove

      // Handle approval flow
      if (needsApproval) {
        this.lifecycle.markPendingApproval(call.id, tool)

        // Wait for approval (in real implementation, this would be async)
        // For now, we auto-approve if config says so
        if (this.config.autoApprove) {
          this.lifecycle.approve(call.id, 'auto')
        } else {
          // Return pending status so caller knows to wait for approval
          return {
            callId: call.id,
            toolName,
            args,
            status: 'pending_approval',
            lifecycleRecord: this.lifecycle.getCall(call.id),
          }
        }
      } else {
        // Auto-approved
        this.lifecycle.approve(call.id, 'auto')
      }

      // Mark as executing
      this.lifecycle.markExecuting(call.id)

      // Execute tool
      const executionResult = await this.executor.execute(tool, args, {
        timeout: options.timeout ?? this.config.defaultTimeout,
        signal: options.signal,
        skipValidation: options.skipValidation,
        skipCache: options.skipCache ?? !this.config.enableCaching,
        context: { callId: call.id, ...options.context },
      })

      // Complete lifecycle
      this.lifecycle.complete(
        call.id,
        executionResult.result,
        executionResult.cached
      )

      // Get updated call record
      const lifecycleRecord = this.lifecycle.getCall(call.id)

      return {
        callId: call.id,
        toolName,
        args,
        status: 'completed',
        result: executionResult.result,
        duration: executionResult.duration,
        cached: executionResult.cached,
        lifecycleRecord,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      // Mark as failed in lifecycle
      if (err.message.includes('timeout')) {
        this.lifecycle.timeout(call.id, this.config.defaultTimeout)
      } else if (
        err.message.includes('cancelled') ||
        err.message.includes('aborted')
      ) {
        this.lifecycle.cancel(call.id, err.message)
      } else {
        this.lifecycle.fail(call.id, err)
      }

      const lifecycleRecord = this.lifecycle.getCall(call.id)

      return {
        callId: call.id,
        toolName,
        args,
        status: lifecycleRecord.status,
        error: err,
        duration: lifecycleRecord.duration,
        lifecycleRecord,
      }
    }
  }

  /**
   * Approve a pending tool call
   *
   * @param callId - Call ID
   * @param approvedBy - Who approved (user ID, etc.)
   */
  approveTool(callId: string, approvedBy?: string): void {
    this.lifecycle.approve(callId, approvedBy)
  }

  /**
   * Reject a pending tool call
   *
   * @param callId - Call ID
   * @param reason - Rejection reason
   * @param rejectedBy - Who rejected
   */
  rejectTool(callId: string, reason: string, rejectedBy?: string): void {
    this.lifecycle.reject(callId, reason, rejectedBy)
  }

  /**
   * Execute tool after approval
   *
   * For use with manual approval flow.
   *
   * @param callId - Call ID
   * @returns Orchestration result
   */
  async executeApprovedTool(callId: string): Promise<OrchestrationResult> {
    const call = this.lifecycle.getCall(callId)

    if (call.status !== 'approved') {
      throw new Error(
        `Tool call ${callId} is not approved (current status: ${call.status})`
      )
    }

    const tool = this.registry.get(call.toolName)
    if (!tool) {
      throw new Error(`Tool not found: ${call.toolName}`)
    }

    try {
      // Mark as executing
      this.lifecycle.markExecuting(callId)

      // FIX: TOOL-018 - Re-validate approval status atomically
      const currentCall = this.lifecycle.getCall(callId)
      if (
        currentCall.status !== 'approved' &&
        currentCall.status !== 'executing'
      ) {
        throw new Error(
          `Tool execution rejected: status changed to ${currentCall.status} during approval validation`
        )
      }

      // Now safe to execute
      const result = await this.executor.execute(tool, call.args, {
        context: call.context,
      })

      // Complete
      this.lifecycle.complete(callId, result.result, result.cached)

      const lifecycleRecord = this.lifecycle.getCall(callId)

      return {
        callId,
        toolName: call.toolName,
        args: call.args,
        status: 'completed',
        result: result.result,
        duration: result.duration,
        cached: result.cached,
        lifecycleRecord,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.lifecycle.fail(callId, err)

      const lifecycleRecord = this.lifecycle.getCall(callId)

      return {
        callId,
        toolName: call.toolName,
        args: call.args,
        status: 'failed',
        error: err,
        lifecycleRecord,
      }
    }
  }

  // ===========================================================================
  // Query & Monitoring
  // ===========================================================================

  /**
   * Get tool call by ID
   */
  getToolCall(callId: string): ToolCallRecord {
    return this.lifecycle.getCall(callId)
  }

  /**
   * Get all tool calls
   */
  getAllToolCalls(): ToolCallRecord[] {
    return this.lifecycle.getAllCalls()
  }

  /**
   * Get tool calls by status
   */
  getToolCallsByStatus(status: ToolCallStatus): ToolCallRecord[] {
    return this.lifecycle.getCallsByStatus(status)
  }

  /**
   * Get pending tool calls (awaiting approval)
   */
  getPendingToolCalls(): ToolCallRecord[] {
    return this.lifecycle.getCallsByStatus('pending_approval')
  }

  /**
   * Get orchestrator statistics
   */
  getStats() {
    const calls = this.lifecycle.getAllCalls()
    const byStatus: Record<string, number> = {}

    for (const call of calls) {
      byStatus[call.status] = (byStatus[call.status] || 0) + 1
    }

    return {
      registry: this.registry.getStats(),
      calls: {
        total: calls.length,
        byStatus: byStatus as Record<ToolCallStatus, number>,
      },
      cache: this.executor.getCache().getStats(),
    }
  }

  // ===========================================================================
  // Cache Management
  // ===========================================================================

  /**
   * Clear cache for specific tool
   */
  clearCache(toolName?: string): void {
    this.executor.clearCache(toolName)
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.executor.getCache().getStats()
  }

  // ===========================================================================
  // Lifecycle Management
  // ===========================================================================

  /**
   * Clear completed tool calls
   *
   * Removes completed/failed/cancelled calls from lifecycle tracking
   */
  clearCompletedCalls(): void {
    const calls = this.lifecycle.getAllCalls()
    for (const call of calls) {
      if (
        call.status === 'completed' ||
        call.status === 'failed' ||
        call.status === 'timeout' ||
        call.status === 'cancelled' ||
        call.status === 'rejected' ||
        call.status === 'cached'
      ) {
        this.lifecycle.removeCall(call.id)
      }
    }
  }

  /**
   * Reset orchestrator state
   *
   * Clears all calls and cache (but keeps registered tools)
   */
  reset(): void {
    this.lifecycle.clear()
    this.executor.clearCache()
  }
}

// =============================================================================
// Global Orchestrator (Optional)
// =============================================================================

/**
 * Global tool orchestrator instance
 *
 * Optional: use for simple use cases, or create your own instance.
 */
export const globalToolOrchestrator = new ToolOrchestrator()

// =============================================================================
// Exports (already exported inline above)
// =============================================================================
// All exports are handled inline throughout the file
