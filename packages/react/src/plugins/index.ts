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

