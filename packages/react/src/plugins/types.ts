/**
 * Plugin System Types
 *
 * Extensible plugin architecture for custom functionality.
 * Bring your own plugins or use community plugins.
 */

export interface Plugin {
  /** Plugin name */
  name: string
  /** Plugin version */
  version: string
  /** Plugin description */
  description?: string
  /** Plugin author */
  author?: string
  /** Plugin dependencies */
  dependencies?: string[]

  /**
   * Initialize plugin
   */
  initialize?(context: PluginContext): Promise<void> | void

  /**
   * Cleanup when plugin is unloaded
   */
  cleanup?(): Promise<void> | void

  /**
   * Plugin hooks
   */
  hooks?: PluginHooks
}

export interface PluginContext {
  /** Plugin manager instance */
  manager: any
  /** Configuration passed to plugin */
  config: Record<string, any>
  /** Shared state */
  state: Record<string, any>
  /** Event emitter */
  emit: (event: string, data: any) => void
  /** Logger */
  log: (message: string, level?: 'info' | 'warn' | 'error') => void
}

export interface PluginHooks {
  /**
   * Called before message is sent
   */
  beforeSendMessage?: (message: string, context: any) => Promise<string | void> | string | void

  /**
   * Called after message is received
   */
  afterReceiveMessage?: (message: string, context: any) => Promise<void> | void

  /**
   * Called before tool execution
   */
  beforeToolExecution?: (toolName: string, args: any) => Promise<boolean | void> | boolean | void

  /**
   * Called after tool execution
   */
  afterToolExecution?: (toolName: string, result: any) => Promise<void> | void

  /**
   * Called on error
   */
  onError?: (error: Error, context: any) => Promise<void> | void

  /**
   * Custom hooks
   */
  [key: string]: any
}

export interface PluginConfig {
  /** Plugin instance */
  plugin: Plugin
  /** Configuration for plugin */
  config?: Record<string, any>
  /** Whether plugin is enabled */
  enabled?: boolean
  /** Priority (lower = higher priority) */
  priority?: number
}

export interface PluginManagerConfig {
  /** Auto-initialize plugins on registration */
  autoInitialize?: boolean
  /** Shared context for all plugins */
  sharedContext?: Record<string, any>
}

