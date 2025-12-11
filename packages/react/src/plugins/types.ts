/**
 * Plugin System Types
 *
 * Extensible plugin architecture for custom functionality.
 * Bring your own plugins or use community plugins.
 */

/** Value types for plugin configuration */
export type PluginConfigValue = string | number | boolean | string[] | number[] | Record<string, unknown> | null

/** Plugin configuration record */
export type PluginConfigRecord = Record<string, PluginConfigValue>

/** Plugin state value types */
export type PluginStateValue = string | number | boolean | string[] | number[] | Record<string, unknown> | null

/** Plugin event data */
export type PluginEventData = Record<string, unknown>

/** Context passed to plugin hooks */
export interface PluginHookContext {
  /** Current conversation ID */
  conversationId?: string
  /** Current message ID */
  messageId?: string
  /** Custom context data */
  [key: string]: string | number | boolean | undefined
}

/** Tool arguments for plugin hooks */
export type PluginToolArgs = Record<string, string | number | boolean | string[] | number[]>

/** Tool result for plugin hooks */
export type PluginToolResult = string | number | boolean | Record<string, unknown> | unknown[] | null

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

/** Forward declaration for PluginManager interface */
export interface PluginManagerInterface {
  /** Register a plugin */
  register(config: PluginConfig): Promise<void>
  /** Unregister a plugin */
  unregister(name: string): Promise<void>
  /** Get a plugin by name */
  getPlugin(name: string): Plugin | undefined
  /** Emit an event */
  emit(event: string, data: PluginEventData): void
  /** Subscribe to an event */
  on(event: string, handler: (data: PluginEventData) => void): () => void
  /** Call a hook across all plugins */
  callHook<T = unknown>(hookName: string, ...args: unknown[]): Promise<T[]>
  /** Set shared state */
  setState(key: string, value: PluginStateValue): void
}

export interface PluginContext {
  /** Plugin manager instance */
  manager: PluginManagerInterface
  /** Configuration passed to plugin */
  config: PluginConfigRecord
  /** Shared state */
  state: Record<string, PluginStateValue>
  /** Event emitter */
  emit: (event: string, data: PluginEventData) => void
  /** Logger */
  log: (message: string, level?: 'info' | 'warn' | 'error') => void
}

/** Generic plugin hook function type - accepts any function that returns a promise or value */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginHookFn = ((...args: any[]) => Promise<any> | any) | undefined

export interface PluginHooks {
  /**
   * Called before message is sent
   */
  beforeSendMessage?: (message: string, context: PluginHookContext) => Promise<string | void> | string | void

  /**
   * Called after message is received
   */
  afterReceiveMessage?: (message: string, context: PluginHookContext) => Promise<void> | void

  /**
   * Called before tool execution
   */
  beforeToolExecution?: (toolName: string, args: PluginToolArgs) => Promise<boolean | void> | boolean | void

  /**
   * Called after tool execution
   */
  afterToolExecution?: (toolName: string, result: PluginToolResult) => Promise<void> | void

  /**
   * Called on error
   */
  onError?: (error: Error, context: PluginHookContext) => Promise<void> | void

  /**
   * Custom hooks (indexed by name)
   */
  [key: string]: PluginHookFn
}

export interface PluginConfig {
  /** Plugin instance */
  plugin: Plugin
  /** Configuration for plugin */
  config?: PluginConfigRecord
  /** Whether plugin is enabled */
  enabled?: boolean
  /** Priority (lower = higher priority) */
  priority?: number
}

export interface PluginManagerConfig {
  /** Auto-initialize plugins on registration */
  autoInitialize?: boolean
  /** Shared context for all plugins */
  sharedContext?: PluginConfigRecord
}

