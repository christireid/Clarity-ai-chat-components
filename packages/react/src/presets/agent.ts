/**
 * Agent Preset - AI agent execution configuration
 *
 * Optimized for agent-based workflows with tool execution,
 * plan visualization, and approval mechanisms.
 *
 * @example
 * ```tsx
 * import { agentPreset, createPreset } from './presets'
 *
 * // Use agent preset for AI agent workflows
 * <AgentInterface {...agentPreset.config} />
 *
 * // Create custom agent-based preset
 * const customAgent = createPreset({
 *   features: { approval: true }
 * })
 * ```
 */

import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface AgentProviderConfig {
  /** Model identifier */
  model: string
  /** Provider name */
  provider: string
  /** Temperature for generation (lower = more deterministic) */
  temperature: number
  /** Maximum tokens in response */
  maxTokens: number
  /** Enable streaming responses */
  streaming: boolean
  /** System prompt for agent behavior */
  systemPrompt?: string
  /** API key for authentication */
  apiKey?: string
  /** Base URL for API requests */
  apiBase?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Tool definitions for agent execution */
  tools?: AgentTool[]
}

export interface AgentTool {
  /** Tool identifier */
  id: string
  /** Tool name */
  name: string
  /** Tool description */
  description: string
  /** Tool parameter schema */
  schema?: Record<string, any>
  /** Whether tool execution requires approval */
  requiresApproval?: boolean
}

export interface AgentFeatures {
  /** Display agent thinking process */
  thinking: boolean
  /** Show execution plan */
  executionPlan: boolean
  /** Display tool calls and results */
  toolExecution: boolean
  /** Require approval before executing tools */
  approval: boolean
  /** Show step-by-step progress */
  progress: boolean
  /** Display metrics and timing */
  metrics: boolean
  /** Enable error recovery suggestions */
  errorRecovery: boolean
  /** Auto-scroll during execution */
  autoScroll: boolean
}

export interface AgentComponentProps {
  /** Container class name */
  className?: string
  /** Custom header content */
  header?: ReactNode
  /** Custom footer content */
  footer?: ReactNode
  /** Container height */
  height?: string | number
  /** Container width */
  width?: string | number
  /** Show execution panel */
  showExecutionPanel: boolean
  /** Show tool panel */
  showToolPanel: boolean
  /** Tool panel width */
  toolPanelWidth: string | number
  /** Show approval dialog */
  showApprovalDialog: boolean
  /** Approval required message */
  approvalMessage: string
  /** Show metrics panel */
  showMetrics: boolean
}

export interface AgentTheme {
  /** Primary brand color */
  primary: string
  /** Secondary accent color */
  secondary: string
  /** Background color */
  background: string
  /** Surface/card color */
  surface: string
  /** Text primary color */
  text: string
  /** Text secondary color */
  textSecondary: string
  /** Border color */
  border: string
  /** Success color for completed steps */
  success: string
  /** Warning color for pending approval */
  warning: string
  /** Error color for failures */
  error: string
  /** Info color for execution info */
  info: string
  /** Border radius */
  borderRadius: string
  /** Font family */
  fontFamily: string
  /** Base font size */
  fontSize: string
}

// ============================================================================
// Default Provider Configuration
// ============================================================================

/**
 * Default provider configuration for agent preset
 */
export const defaultProviderConfig: AgentProviderConfig = {
  model: 'claude-opus-4.5',
  provider: 'anthropic',
  temperature: 0.2,
  maxTokens: 8000,
  streaming: true,
  timeout: 60000,
  tools: [],
}

// ============================================================================
// Default Features
// ============================================================================

/**
 * Default features for agent preset
 */
export const defaultFeatures: AgentFeatures = {
  thinking: true,
  executionPlan: true,
  toolExecution: true,
  approval: true,
  progress: true,
  metrics: true,
  errorRecovery: true,
  autoScroll: true,
}

// ============================================================================
// Default Component Props
// ============================================================================

/**
 * Default component props for agent preset
 */
export const defaultComponentProps: AgentComponentProps = {
  height: '100vh',
  width: '100%',
  showExecutionPanel: true,
  showToolPanel: true,
  toolPanelWidth: '360px',
  showApprovalDialog: true,
  approvalMessage: 'Review the execution plan before proceeding',
  showMetrics: true,
}

// ============================================================================
// Default Theme Overrides
// ============================================================================

/**
 * Default theme overrides for agent preset
 */
export const defaultTheme: AgentTheme = {
  primary: '#0066cc',
  secondary: '#5a67d8',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  borderRadius: '8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Monaco", monospace',
  fontSize: '14px',
}

// ============================================================================
// Preset Interface
// ============================================================================

export interface AgentPreset {
  name: string
  description: string
  provider: AgentProviderConfig
  features: AgentFeatures
  componentProps: AgentComponentProps
  theme: AgentTheme
}

// ============================================================================
// Main Preset Export
// ============================================================================

/**
 * Agent chat preset
 *
 * Specialized configuration optimized for:
 * - AI agent execution workflows
 * - Tool execution and approval
 * - Plan visualization
 * - Real-time progress monitoring
 * - Error handling and recovery
 */
export const agentPreset: AgentPreset = {
  name: 'Agent',
  description: 'AI agent execution with plan visualization, tool execution, and approvals',
  provider: defaultProviderConfig,
  features: defaultFeatures,
  componentProps: defaultComponentProps,
  theme: defaultTheme,
}

// ============================================================================
// Factory Function
// ============================================================================

export interface CreateAgentPresetOptions {
  provider?: Partial<AgentProviderConfig>
  features?: Partial<AgentFeatures>
  componentProps?: Partial<AgentComponentProps>
  theme?: Partial<AgentTheme>
}

/**
 * Create a custom agent preset with optional overrides
 *
 * @param options - Configuration options
 * @returns Custom agent preset
 *
 * @example
 * ```tsx
 * const customAgent = createPreset({
 *   theme: { primary: '#5a67d8' },
 *   features: { approval: false },
 *   provider: {
 *     tools: [
 *       {
 *         id: 'bash',
 *         name: 'Execute Bash',
 *         description: 'Execute bash commands'
 *       }
 *     ]
 *   }
 * })
 * ```
 */
export function createPreset(options: CreateAgentPresetOptions = {}): AgentPreset {
  return {
    name: 'Agent (Custom)',
    description: 'Customized agent execution interface',
    provider: {
      ...defaultProviderConfig,
      ...options.provider,
      tools: [
        ...(defaultProviderConfig.tools || []),
        ...(options.provider?.tools || []),
      ],
    },
    features: {
      ...defaultFeatures,
      ...options.features,
    },
    componentProps: {
      ...defaultComponentProps,
      ...options.componentProps,
    },
    theme: {
      ...defaultTheme,
      ...options.theme,
    },
  }
}

/**
 * Merge agent preset with another configuration
 *
 * @param overrides - Properties to override
 * @returns Merged preset
 */
export function mergePreset(overrides: CreateAgentPresetOptions): AgentPreset {
  return createPreset(overrides)
}

/**
 * Clone the agent preset
 *
 * @returns Cloned preset
 */
export function clonePreset(): AgentPreset {
  return {
    ...agentPreset,
    provider: {
      ...agentPreset.provider,
      tools: agentPreset.provider.tools ? [...agentPreset.provider.tools] : [],
    },
    features: { ...agentPreset.features },
    componentProps: { ...agentPreset.componentProps },
    theme: { ...agentPreset.theme },
  }
}

/**
 * Get preset summary
 *
 * @returns Summary string
 */
export function getPresetSummary(): string {
  const toolCount = defaultProviderConfig.tools?.length || 0
  return `${agentPreset.name}: ${agentPreset.description} (${toolCount} tools)`
}

/**
 * Add tool to agent configuration
 *
 * @param tool - Tool definition
 * @returns Updated preset
 */
export function addTool(tool: AgentTool): AgentPreset {
  const updated = clonePreset()
  if (!updated.provider.tools) {
    updated.provider.tools = []
  }
  updated.provider.tools.push(tool)
  return updated
}

/**
 * Export all utilities as object
 */
export const agent = {
  preset: agentPreset,
  defaultProviderConfig,
  defaultFeatures,
  defaultComponentProps,
  defaultTheme,
  createPreset,
  mergePreset,
  clonePreset,
  getPresetSummary,
  addTool,
}
