/**
 * Plugin Manager
 *
 * Manage and orchestrate plugins for extensibility.
 */

import type {
  Plugin,
  PluginConfig,
  PluginManagerConfig,
  PluginContext,
  PluginManagerInterface,
  PluginEventData,
  PluginStateValue,
} from './types'

export class PluginManager implements PluginManagerInterface {
  private plugins = new Map<string, PluginConfig>()
  private config: Required<PluginManagerConfig>
  private sharedState: Record<string, PluginStateValue> = {}
  private eventHandlers = new Map<
    string,
    Set<(data: PluginEventData) => void>
  >()

  constructor(config?: PluginManagerConfig) {
    this.config = {
      autoInitialize: config?.autoInitialize ?? true,
      sharedContext: config?.sharedContext ?? {},
    }
    this.sharedState = { ...this.config.sharedContext }
  }

  /**
   * Register a plugin
   */
  async register(pluginConfig: PluginConfig): Promise<void> {
    const plugin = pluginConfig.plugin

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(
            `Plugin ${plugin.name} requires ${dep} which is not registered`
          )
        }
      }
    }

    // Register plugin
    this.plugins.set(plugin.name, {
      ...pluginConfig,
      enabled: pluginConfig.enabled ?? true,
      priority: pluginConfig.priority ?? 100,
    })

    // Initialize if auto-initialize is enabled
    if (this.config.autoInitialize && pluginConfig.enabled !== false) {
      await this.initializePlugin(plugin, pluginConfig.config)
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(name: string): Promise<void> {
    const config = this.plugins.get(name)
    if (!config) return

    // Cleanup
    if (config.plugin.cleanup) {
      await config.plugin.cleanup()
    }

    this.plugins.delete(name)
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)?.plugin
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
      .sort((a, b) => (a.priority || 100) - (b.priority || 100))
      .map((c) => c.plugin)
  }

  /**
   * Enable a plugin
   */
  async enable(name: string): Promise<void> {
    const config = this.plugins.get(name)
    if (!config) throw new Error(`Plugin ${name} not found`)

    config.enabled = true
    await this.initializePlugin(config.plugin, config.config)
  }

  /**
   * Disable a plugin
   */
  async disable(name: string): Promise<void> {
    const config = this.plugins.get(name)
    if (!config) throw new Error(`Plugin ${name} not found`)

    config.enabled = false

    if (config.plugin.cleanup) {
      await config.plugin.cleanup()
    }
  }

  /**
   * Call a hook across all enabled plugins
   */
  async callHook<T = unknown>(
    hookName: string,
    ...args: unknown[]
  ): Promise<T[]> {
    const results: T[] = []

    const configs = Array.from(this.plugins.values())
    for (const config of configs) {
      if (!config.enabled) continue

      const hook = config.plugin.hooks?.[hookName]
      if (hook) {
        try {
          const result = await hook(...args)
          if (result !== undefined) {
            results.push(result as T)
          }
        } catch (error) {
          console.error(
            `Plugin ${config.plugin.name} hook ${hookName} failed:`,
            error
          )
        }
      }
    }

    return results
  }

  /**
   * Emit an event to plugins
   */
  emit(event: string, data: PluginEventData): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Event handler for ${event} failed:`, error)
        }
      })
    }
  }

  /**
   * Listen to plugin events
   */
  on(event: string, handler: (data: PluginEventData) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }

    this.eventHandlers.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler)
    }
  }

  /**
   * Get shared state
   */
  getState(): Record<string, PluginStateValue> {
    return { ...this.sharedState }
  }

  /**
   * Set shared state
   */
  setState(key: string, value: PluginStateValue): void {
    this.sharedState[key] = value
  }

  private async initializePlugin(
    plugin: Plugin,
    config?: Record<string, unknown>
  ): Promise<void> {
    if (!plugin.initialize) return

    const context: PluginContext = {
      manager: this,
      config: (config || {}) as Record<string, PluginStateValue>,
      state: this.sharedState,
      emit: (event, data) => this.emit(event, data),
      log: (message, level = 'info') => {
        console.debug(`[Plugin:${plugin.name}] [${level}]`, message)
      },
    }

    await plugin.initialize(context)
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}
