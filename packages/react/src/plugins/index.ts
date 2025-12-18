/**
 * Plugin System
 *
 * Extensible plugin architecture for custom functionality.
 * Create your own plugins or use community plugins.
 *
 * @example
 * ```tsx
 * import { PluginManager, Plugin } from '@clarity-chat/react'
 *
 * // Create a custom plugin
 * const analyticsPlugin: Plugin = {
 *   name: 'analytics',
 *   version: '1.0.0',
 *   description: 'Track chat analytics',
 *
 *   initialize(context) {
 *     context.log('Analytics plugin initialized')
 *   },
 *
 *   hooks: {
 *     afterReceiveMessage: async (message) => {
 *       // Track message
 *       analytics.track('message_received', { message })
 *     },
 *   },
 * }
 *
 * // Use plugin manager
 * const manager = new PluginManager()
 * await manager.register({ plugin: analyticsPlugin })
 *
 * // Call hooks
 * await manager.callHook('afterReceiveMessage', message)
 * ```
 *
 * @example
 * ```tsx
 * // Plugin with configuration
 * const customPlugin: Plugin = {
 *   name: 'custom',
 *   version: '1.0.0',
 *
 *   initialize(context) {
 *     const apiKey = context.config.apiKey
 *     context.setState('initialized', true)
 *   },
 *
 *   hooks: {
 *     beforeSendMessage: async (message, context) => {
 *       // Transform message before sending
 *       return message.toUpperCase()
 *     },
 *   },
 * }
 *
 * await manager.register({
 *   plugin: customPlugin,
 *   config: { apiKey: 'xxx' },
 * })
 * ```
 */

export * from './types'
export * from './plugin-manager'

import type {
  Plugin,
  PluginHooks,
  PluginContext,
  PluginHookContext,
  PluginToolArgs,
  PluginToolResult,
} from './types'

/**
 * Plugin validation error
 */
export class PluginValidationError extends Error {
  constructor(
    message: string,
    public readonly pluginName: string,
    public readonly field?: string
  ) {
    super(message)
    this.name = 'PluginValidationError'
  }
}

/**
 * Options for creating a plugin
 */
export interface CreatePluginOptions {
  /** Plugin name (required, must be unique) */
  name: string
  /** Plugin version (semver format recommended) */
  version: string
  /** Plugin description */
  description?: string
  /** Plugin author */
  author?: string
  /** Plugin dependencies (other plugin names) */
  dependencies?: string[]
  /** Plugin hooks */
  hooks?: PluginHooks
  /** Initialize function */
  initialize?: (context: PluginContext) => Promise<void> | void
  /** Cleanup function */
  cleanup?: () => Promise<void> | void
}

/**
 * createPlugin - Type-safe Plugin Factory
 *
 * Factory function that creates a validated plugin with proper typing.
 * Use this to ensure your plugin follows the correct structure.
 *
 * @param options - Plugin configuration options
 * @returns A validated Plugin instance
 * @throws {PluginValidationError} If plugin configuration is invalid
 *
 * @example
 * ```tsx
 * import { createPlugin } from '@clarity-chat/react'
 *
 * const analyticsPlugin = createPlugin({
 *   name: 'analytics',
 *   version: '1.0.0',
 *   description: 'Track chat analytics',
 *
 *   hooks: {
 *     afterReceiveMessage: async (message, context) => {
 *       analytics.track('message_received', {
 *         messageId: context.messageId,
 *         conversationId: context.conversationId,
 *       })
 *     },
 *   },
 *
 *   initialize: (context) => {
 *     context.log('Analytics plugin initialized')
 *   },
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Plugin with tool execution hooks
 * const toolPlugin = createPlugin({
 *   name: 'tool-logger',
 *   version: '1.0.0',
 *
 *   hooks: {
 *     beforeToolExecution: async (toolName, args) => {
 *       logger.debug(`Executing tool: ${toolName}`, args)
 *       return true // Allow execution
 *     },
 *     afterToolExecution: async (toolName, result) => {
 *       logger.debug(`Tool result: ${toolName}`, result)
 *     },
 *   },
 * })
 * ```
 */
export function createPlugin(options: CreatePluginOptions): Plugin {
  // Validate required fields
  if (
    !options.name ||
    typeof options.name !== 'string' ||
    options.name.trim() === ''
  ) {
    throw new PluginValidationError(
      'Plugin name is required and must be a non-empty string',
      options.name || 'unknown',
      'name'
    )
  }

  if (
    !options.version ||
    typeof options.version !== 'string' ||
    options.version.trim() === ''
  ) {
    throw new PluginValidationError(
      'Plugin version is required and must be a non-empty string',
      options.name,
      'version'
    )
  }

  // Validate semver format (basic check)
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/
  if (!semverRegex.test(options.version)) {
    logger.warn(
      `[createPlugin] Plugin "${options.name}" version "${options.version}" ` +
        'does not follow semver format (e.g., "1.0.0"). Consider using semver.'
    )
  }

  // Validate dependencies are strings
  if (options.dependencies) {
    if (!Array.isArray(options.dependencies)) {
      throw new PluginValidationError(
        'Plugin dependencies must be an array of strings',
        options.name,
        'dependencies'
      )
    }
    for (const dep of options.dependencies) {
      if (typeof dep !== 'string') {
        throw new PluginValidationError(
          'Each plugin dependency must be a string',
          options.name,
          'dependencies'
        )
      }
    }
  }

  return {
    name: options.name,
    version: options.version,
    description: options.description,
    author: options.author,
    dependencies: options.dependencies,
    initialize: options.initialize,
    cleanup: options.cleanup,
    hooks: options.hooks,
  }
}

/**
 * Type-safe hook definitions for plugins.
 * Use these helpers to create properly typed hook functions.
 */
export const PluginHookHelpers = {
  /**
   * Create a beforeSendMessage hook with proper typing
   */
  beforeSendMessage(
    fn: (
      message: string,
      context: PluginHookContext
    ) => Promise<string | void> | string | void
  ): PluginHooks['beforeSendMessage'] {
    return fn
  },

  /**
   * Create an afterReceiveMessage hook with proper typing
   */
  afterReceiveMessage(
    fn: (message: string, context: PluginHookContext) => Promise<void> | void
  ): PluginHooks['afterReceiveMessage'] {
    return fn
  },

  /**
   * Create a beforeToolExecution hook with proper typing
   */
  beforeToolExecution(
    fn: (
      toolName: string,
      args: PluginToolArgs
    ) => Promise<boolean | void> | boolean | void
  ): PluginHooks['beforeToolExecution'] {
    return fn
  },

  /**
   * Create an afterToolExecution hook with proper typing
   */
  afterToolExecution(
    fn: (toolName: string, result: PluginToolResult) => Promise<void> | void
  ): PluginHooks['afterToolExecution'] {
    return fn
  },

  /**
   * Create an onError hook with proper typing
   */
  onError(
    fn: (error: Error, context: PluginHookContext) => Promise<void> | void
  ): PluginHooks['onError'] {
    return fn
  },
}
