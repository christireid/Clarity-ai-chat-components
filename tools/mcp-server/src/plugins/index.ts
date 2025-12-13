/**
 * Plugin Registry System for Clarity Chat MCP Server
 *
 * Allows users to register and use any MCP server/plugin with this library,
 * making it highly extensible and customizable.
 *
 * @module plugins
 */

import { Tool, Resource, Prompt } from '@modelcontextprotocol/sdk/types.js'
import { logger } from '../utils/logger.js'
import { ValidationError } from '../utils/errors.js'
import { EventEmitter } from '../utils/events.js'
import { z } from 'zod'

// =============================================================================
// Plugin Types
// =============================================================================

/**
 * Plugin metadata for identification and display
 */
export interface PluginMetadata {
  /** Unique identifier for the plugin */
  id: string
  /** Display name */
  name: string
  /** Version string (semver) */
  version: string
  /** Plugin description */
  description: string
  /** Plugin author */
  author?: string
  /** Homepage or documentation URL */
  homepage?: string
  /** Repository URL */
  repository?: string
  /** License identifier */
  license?: string
  /** Keywords for search/discovery */
  keywords?: string[]
  /** Minimum MCP server version required */
  minServerVersion?: string
  /** Plugin icon (emoji or URL) */
  icon?: string
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
  /** Called when plugin is registered */
  onRegister?: () => void | Promise<void>
  /** Called when plugin is enabled */
  onEnable?: () => void | Promise<void>
  /** Called when plugin is disabled */
  onDisable?: () => void | Promise<void>
  /** Called when plugin is unregistered */
  onUnregister?: () => void | Promise<void>
  /** Called before a tool is executed */
  beforeToolCall?: (
    toolName: string,
    args: Record<string, unknown>
  ) => Record<string, unknown> | Promise<Record<string, unknown>>
  /** Called after a tool is executed */
  afterToolCall?: (
    toolName: string,
    result: unknown
  ) => unknown | Promise<unknown>
  /** Called when an error occurs */
  onError?: (error: Error, context: ErrorContext) => void | Promise<void>
}

/**
 * Error context for plugin error handlers
 */
export interface ErrorContext {
  type: 'tool' | 'resource' | 'prompt' | 'lifecycle'
  name?: string
  args?: Record<string, unknown>
}

/**
 * Tool handler function type
 */
export type ToolHandler = (
  args: Record<string, unknown>
) => Promise<unknown> | unknown

/**
 * Resource handler function type
 */
export type ResourceHandler = () => Promise<string> | string

/**
 * Prompt handler function type
 */
export type PromptHandler = (
  args: Record<string, string>
) => Promise<string> | string

/**
 * Plugin configuration options
 */
export interface PluginConfig {
  /** Enable/disable the plugin */
  enabled?: boolean
  /** Plugin-specific configuration */
  settings?: Record<string, unknown>
  /** Priority for tool/resource resolution (higher = first) */
  priority?: number
}

/**
 * Complete plugin definition
 */
export interface Plugin {
  /** Plugin metadata */
  metadata: PluginMetadata
  /** Tools provided by the plugin */
  tools?: Array<{
    definition: Tool
    handler: ToolHandler
  }>
  /** Resources provided by the plugin */
  resources?: Array<{
    definition: Resource
    handler: ResourceHandler
  }>
  /** Prompts provided by the plugin */
  prompts?: Array<{
    definition: Prompt
    handler: PromptHandler
  }>
  /** Lifecycle hooks */
  lifecycle?: PluginLifecycle
  /** Default configuration */
  defaultConfig?: PluginConfig
}

/**
 * Registered plugin with runtime state
 */
interface RegisteredPlugin {
  plugin: Plugin
  config: PluginConfig
  state: 'registered' | 'enabled' | 'disabled' | 'error'
  registeredAt: Date
  enabledAt?: Date
  error?: Error
}

// =============================================================================
// Plugin Validation Schemas
// =============================================================================

const PluginMetadataSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      'Plugin ID must be lowercase alphanumeric with hyphens'
    ),
  name: z.string().min(1).max(200),
  version: z.string().regex(/^\d+\.\d+\.\d+/, 'Version must be semver format'),
  description: z.string().min(1).max(1000),
  author: z.string().max(200).optional(),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  license: z.string().max(50).optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  minServerVersion: z.string().optional(),
  icon: z.string().max(200).optional(),
})

// =============================================================================
// Plugin Registry
// =============================================================================

/**
 * Plugin Registry - Manages all registered plugins
 */
class PluginRegistry {
  private plugins = new Map<string, RegisteredPlugin>()
  private toolHandlers = new Map<string, { pluginId: string; handler: ToolHandler }>()
  private resourceHandlers = new Map<string, { pluginId: string; handler: ResourceHandler }>()
  private promptHandlers = new Map<string, { pluginId: string; handler: PromptHandler }>()
  private events = new EventEmitter()

  /**
   * Register a new plugin
   */
  async register(plugin: Plugin, config?: Partial<PluginConfig>): Promise<void> {
    // Validate metadata
    const metadataResult = PluginMetadataSchema.safeParse(plugin.metadata)
    if (!metadataResult.success) {
      throw new ValidationError(
        `Invalid plugin metadata: ${metadataResult.error.errors.map((e) => e.message).join(', ')}`,
        { pluginId: plugin.metadata.id }
      )
    }

    const pluginId = plugin.metadata.id

    // Check for duplicate registration
    if (this.plugins.has(pluginId)) {
      throw new ValidationError(`Plugin already registered: ${pluginId}`, {
        pluginId,
      })
    }

    // Merge configuration
    const finalConfig: PluginConfig = {
      enabled: true,
      priority: 0,
      ...plugin.defaultConfig,
      ...config,
    }

    // Create registered plugin entry
    const registered: RegisteredPlugin = {
      plugin,
      config: finalConfig,
      state: 'registered',
      registeredAt: new Date(),
    }

    // Store plugin
    this.plugins.set(pluginId, registered)

    // Call lifecycle hook
    try {
      await plugin.lifecycle?.onRegister?.()
    } catch (error) {
      logger.error(
        `Plugin onRegister hook failed: ${pluginId}`,
        error instanceof Error ? error : undefined
      )
    }

    // Auto-enable if configured
    if (finalConfig.enabled) {
      await this.enable(pluginId)
    }

    logger.info(`Plugin registered: ${plugin.metadata.name}`, {
      pluginId,
      version: plugin.metadata.version,
    })

    this.events.emit('plugin:registered', { pluginId, plugin })
  }

  /**
   * Enable a registered plugin
   */
  async enable(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId)
    if (!registered) {
      throw new ValidationError(`Plugin not found: ${pluginId}`, { pluginId })
    }

    if (registered.state === 'enabled') {
      return // Already enabled
    }

    const { plugin } = registered

    try {
      // Register tools
      for (const tool of plugin.tools || []) {
        const toolName = tool.definition.name
        if (this.toolHandlers.has(toolName)) {
          logger.warn(`Tool name collision: ${toolName}`, {
            pluginId,
            existingPlugin: this.toolHandlers.get(toolName)?.pluginId,
          })
        }
        this.toolHandlers.set(toolName, { pluginId, handler: tool.handler })
      }

      // Register resources
      for (const resource of plugin.resources || []) {
        const uri = resource.definition.uri
        if (this.resourceHandlers.has(uri)) {
          logger.warn(`Resource URI collision: ${uri}`, {
            pluginId,
            existingPlugin: this.resourceHandlers.get(uri)?.pluginId,
          })
        }
        this.resourceHandlers.set(uri, { pluginId, handler: resource.handler })
      }

      // Register prompts
      for (const prompt of plugin.prompts || []) {
        const promptName = prompt.definition.name
        if (this.promptHandlers.has(promptName)) {
          logger.warn(`Prompt name collision: ${promptName}`, {
            pluginId,
            existingPlugin: this.promptHandlers.get(promptName)?.pluginId,
          })
        }
        this.promptHandlers.set(promptName, {
          pluginId,
          handler: prompt.handler,
        })
      }

      // Call lifecycle hook
      await plugin.lifecycle?.onEnable?.()

      registered.state = 'enabled'
      registered.enabledAt = new Date()

      logger.info(`Plugin enabled: ${plugin.metadata.name}`, { pluginId })
      this.events.emit('plugin:enabled', { pluginId, plugin })
    } catch (error) {
      registered.state = 'error'
      registered.error = error instanceof Error ? error : new Error(String(error))
      throw error
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId)
    if (!registered) {
      throw new ValidationError(`Plugin not found: ${pluginId}`, { pluginId })
    }

    if (registered.state !== 'enabled') {
      return // Already disabled
    }

    const { plugin } = registered

    // Unregister tools
    for (const tool of plugin.tools || []) {
      this.toolHandlers.delete(tool.definition.name)
    }

    // Unregister resources
    for (const resource of plugin.resources || []) {
      this.resourceHandlers.delete(resource.definition.uri)
    }

    // Unregister prompts
    for (const prompt of plugin.prompts || []) {
      this.promptHandlers.delete(prompt.definition.name)
    }

    // Call lifecycle hook
    try {
      await plugin.lifecycle?.onDisable?.()
    } catch (error) {
      logger.error(
        `Plugin onDisable hook failed: ${pluginId}`,
        error instanceof Error ? error : undefined
      )
    }

    registered.state = 'disabled'
    logger.info(`Plugin disabled: ${plugin.metadata.name}`, { pluginId })
    this.events.emit('plugin:disabled', { pluginId, plugin })
  }

  /**
   * Unregister a plugin completely
   */
  async unregister(pluginId: string): Promise<void> {
    const registered = this.plugins.get(pluginId)
    if (!registered) {
      return // Not registered
    }

    // Disable first if enabled
    if (registered.state === 'enabled') {
      await this.disable(pluginId)
    }

    // Call lifecycle hook
    try {
      await registered.plugin.lifecycle?.onUnregister?.()
    } catch (error) {
      logger.error(
        `Plugin onUnregister hook failed: ${pluginId}`,
        error instanceof Error ? error : undefined
      )
    }

    this.plugins.delete(pluginId)
    logger.info(`Plugin unregistered: ${registered.plugin.metadata.name}`, {
      pluginId,
    })
    this.events.emit('plugin:unregistered', {
      pluginId,
      plugin: registered.plugin,
    })
  }

  /**
   * Get all registered tools (including from plugins)
   */
  getAllTools(): Tool[] {
    const tools: Tool[] = []
    for (const [, registered] of this.plugins) {
      if (registered.state === 'enabled' && registered.plugin.tools) {
        tools.push(...registered.plugin.tools.map((t) => t.definition))
      }
    }
    return tools
  }

  /**
   * Get all registered resources (including from plugins)
   */
  getAllResources(): Resource[] {
    const resources: Resource[] = []
    for (const [, registered] of this.plugins) {
      if (registered.state === 'enabled' && registered.plugin.resources) {
        resources.push(...registered.plugin.resources.map((r) => r.definition))
      }
    }
    return resources
  }

  /**
   * Get all registered prompts (including from plugins)
   */
  getAllPrompts(): Prompt[] {
    const prompts: Prompt[] = []
    for (const [, registered] of this.plugins) {
      if (registered.state === 'enabled' && registered.plugin.prompts) {
        prompts.push(...registered.plugin.prompts.map((p) => p.definition))
      }
    }
    return prompts
  }

  /**
   * Get a tool handler by name
   */
  getToolHandler(name: string): ToolHandler | undefined {
    return this.toolHandlers.get(name)?.handler
  }

  /**
   * Get a resource handler by URI
   */
  getResourceHandler(uri: string): ResourceHandler | undefined {
    return this.resourceHandlers.get(uri)?.handler
  }

  /**
   * Get a prompt handler by name
   */
  getPromptHandler(name: string): PromptHandler | undefined {
    return this.promptHandlers.get(name)?.handler
  }

  /**
   * Check if a tool exists (in core or plugins)
   */
  hasToolHandler(name: string): boolean {
    return this.toolHandlers.has(name)
  }

  /**
   * Get plugin by ID
   */
  getPlugin(pluginId: string): RegisteredPlugin | undefined {
    return this.plugins.get(pluginId)
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): RegisteredPlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): RegisteredPlugin[] {
    return Array.from(this.plugins.values()).filter(
      (p) => p.state === 'enabled'
    )
  }

  /**
   * Search plugins by keyword
   */
  searchPlugins(query: string): RegisteredPlugin[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.plugins.values()).filter((registered) => {
      const { metadata } = registered.plugin
      return (
        metadata.name.toLowerCase().includes(lowerQuery) ||
        metadata.description.toLowerCase().includes(lowerQuery) ||
        metadata.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))
      )
    })
  }

  /**
   * Get plugin statistics
   */
  getStats(): {
    total: number
    enabled: number
    disabled: number
    error: number
    tools: number
    resources: number
    prompts: number
  } {
    const plugins = Array.from(this.plugins.values())
    return {
      total: plugins.length,
      enabled: plugins.filter((p) => p.state === 'enabled').length,
      disabled: plugins.filter((p) => p.state === 'disabled').length,
      error: plugins.filter((p) => p.state === 'error').length,
      tools: this.toolHandlers.size,
      resources: this.resourceHandlers.size,
      prompts: this.promptHandlers.size,
    }
  }

  /**
   * Subscribe to plugin events
   */
  on(
    event:
      | 'plugin:registered'
      | 'plugin:enabled'
      | 'plugin:disabled'
      | 'plugin:unregistered',
    handler: (data: { pluginId: string; plugin: Plugin }) => void
  ): () => void {
    return this.events.on(event, handler as (data: unknown) => void)
  }

  /**
   * Execute before-tool-call hooks for all enabled plugins
   */
  async executeBeforeToolCallHooks(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    let currentArgs = { ...args }
    for (const registered of this.getEnabledPlugins()) {
      if (registered.plugin.lifecycle?.beforeToolCall) {
        try {
          currentArgs = await registered.plugin.lifecycle.beforeToolCall(
            toolName,
            currentArgs
          )
        } catch (error) {
          logger.error(
            `Plugin beforeToolCall hook failed: ${registered.plugin.metadata.id}`,
            error instanceof Error ? error : undefined
          )
        }
      }
    }
    return currentArgs
  }

  /**
   * Execute after-tool-call hooks for all enabled plugins
   */
  async executeAfterToolCallHooks(
    toolName: string,
    result: unknown
  ): Promise<unknown> {
    let currentResult = result
    for (const registered of this.getEnabledPlugins()) {
      if (registered.plugin.lifecycle?.afterToolCall) {
        try {
          currentResult = await registered.plugin.lifecycle.afterToolCall(
            toolName,
            currentResult
          )
        } catch (error) {
          logger.error(
            `Plugin afterToolCall hook failed: ${registered.plugin.metadata.id}`,
            error instanceof Error ? error : undefined
          )
        }
      }
    }
    return currentResult
  }

  /**
   * Clear all plugins (for testing)
   */
  clear(): void {
    this.plugins.clear()
    this.toolHandlers.clear()
    this.resourceHandlers.clear()
    this.promptHandlers.clear()
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

export const pluginRegistry = new PluginRegistry()

// =============================================================================
// Plugin Builder Helper
// =============================================================================

/**
 * Helper class for building plugins with a fluent API
 */
export class PluginBuilder {
  private plugin: Partial<Plugin> = {
    tools: [],
    resources: [],
    prompts: [],
  }

  /**
   * Set plugin metadata
   */
  metadata(metadata: PluginMetadata): this {
    this.plugin.metadata = metadata
    return this
  }

  /**
   * Add a tool to the plugin
   */
  tool(definition: Tool, handler: ToolHandler): this {
    this.plugin.tools = this.plugin.tools || []
    this.plugin.tools.push({ definition, handler })
    return this
  }

  /**
   * Add a resource to the plugin
   */
  resource(definition: Resource, handler: ResourceHandler): this {
    this.plugin.resources = this.plugin.resources || []
    this.plugin.resources.push({ definition, handler })
    return this
  }

  /**
   * Add a prompt to the plugin
   */
  prompt(definition: Prompt, handler: PromptHandler): this {
    this.plugin.prompts = this.plugin.prompts || []
    this.plugin.prompts.push({ definition, handler })
    return this
  }

  /**
   * Set lifecycle hooks
   */
  lifecycle(hooks: PluginLifecycle): this {
    this.plugin.lifecycle = hooks
    return this
  }

  /**
   * Set default configuration
   */
  defaultConfig(config: PluginConfig): this {
    this.plugin.defaultConfig = config
    return this
  }

  /**
   * Build the plugin
   */
  build(): Plugin {
    if (!this.plugin.metadata) {
      throw new ValidationError('Plugin metadata is required')
    }
    return this.plugin as Plugin
  }
}

/**
 * Create a new plugin builder
 */
export function createPlugin(): PluginBuilder {
  return new PluginBuilder()
}

// =============================================================================
// Pre-built Plugin Templates
// =============================================================================

/**
 * Create a simple tool plugin
 */
export function createToolPlugin(
  id: string,
  name: string,
  description: string,
  tools: Array<{ definition: Tool; handler: ToolHandler }>
): Plugin {
  return {
    metadata: {
      id,
      name,
      version: '1.0.0',
      description,
    },
    tools,
  }
}

/**
 * Create a simple resource plugin
 */
export function createResourcePlugin(
  id: string,
  name: string,
  description: string,
  resources: Array<{ definition: Resource; handler: ResourceHandler }>
): Plugin {
  return {
    metadata: {
      id,
      name,
      version: '1.0.0',
      description,
    },
    resources,
  }
}
