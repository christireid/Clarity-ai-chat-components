/**
 * Clarity Chat Extensions System
 *
 * World-class extension framework for building custom integrations.
 * Create, manage, and compose extensions with full type safety.
 *
 * @packageDocumentation
 *
 * @example
 * ```tsx
 * import {
 *   defineExtension,
 *   ExtensionProvider,
 *   useExtensions,
 * } from '@clarity-chat/react/extensions'
 *
 * // Define a custom extension
 * const myExtension = defineExtension({
 *   id: 'my-extension',
 *   name: 'My Extension',
 *   category: 'utility',
 *   description: 'A custom extension',
 *   initialize: (ctx) => {
 *     ctx.console.info('Extension initialized!')
 *   },
 * })
 *
 * // Use in your app
 * function App() {
 *   return (
 *     <ExtensionProvider extensions={[{ extension: myExtension }]}>
 *       <Chat />
 *     </ExtensionProvider>
 *   )
 * }
 * ```
 */

// ============================================
// Core Types
// ============================================

export type {
  // Extension types
  Extension,
  ExtensionBuilder,
  ExtensionCapabilities,
  ExtensionCategory,
  ExtensionConfigField,
  ExtensionConfigSchema,
  ExtensionContext,
  ExtensionEventEmitter,
  ExtensionFactory,
  ExtensionHealthStatus,
  ExtensionLogger,
  ExtensionMetadata,
  ExtensionRegistration,
  ExtensionRegistry,
  ExtensionRegistryEvent,
  ExtensionRegistryEventData,
  ExtensionServiceContainer,
  ExtensionState,
  ExtensionStateManager,
  ExtensionStorage,
  AsyncExtensionFactory,
  ExtensionConfigType,
  // Middleware types
  Middleware,
  MiddlewareContext,
  MiddlewareFunction,
  MiddlewarePipeline,
} from './types'

// ============================================
// Registry
// ============================================

export {
  ExtensionRegistryImpl,
  createExtensionRegistry,
  getGlobalRegistry,
  setGlobalRegistry,
} from './registry'

export type { ExtensionRegistryOptions } from './registry'

// ============================================
// Builder
// ============================================

export {
  createExtensionBuilder,
  defineExtension,
  composeExtensions,
  ExtensionClass,
  getExtensionMetadata,
} from './builder'

export type { QuickExtensionOptions } from './builder'

// ============================================
// Middleware
// ============================================

export {
  // Pipeline
  createMiddlewarePipeline,
  createMiddlewareContext,
  // Pre-built middleware
  createLoggingMiddleware,
  createTimeoutMiddleware,
  createRetryMiddleware,
  createRateLimitMiddleware,
  createCachingMiddleware,
  createValidationMiddleware,
  createTransformMiddleware,
  createSideEffectMiddleware,
  createErrorHandlerMiddleware,
  createMetricsMiddleware,
  // Chat-specific middleware
  createContentFilterMiddleware,
  createPIIRedactionMiddleware,
  // Composition utilities
  composeMiddleware,
  conditionalMiddleware,
} from './middleware'

export type { ChatMessageInput, ChatMessageOutput } from './middleware'

// ============================================
// React Integration
// ============================================

export {
  // Provider
  ExtensionProvider,
  // Hooks
  useExtensions,
  useExtension,
  useExtensionsByCategory,
  useExtensionEvents,
  useExtensionHealth,
  useRegisterExtension,
  // HOCs
  withExtensions,
  withExtension,
  // Components
  ExtensionGuard,
  ExtensionStatus,
  ExtensionList,
} from './react'

export type { ExtensionProviderProps } from './react'

// ============================================
// UI Components
// ============================================

export {
  ExtensionStatusBadge,
  ExtensionHealthIndicator,
  ExtensionCard,
  ExtensionMarketplace,
  ExtensionManager,
  ExtensionConfigWizard,
} from './components'

export type {
  ExtensionCardProps,
  ExtensionMarketplaceProps,
  ExtensionManagerProps,
  ExtensionConfigWizardProps,
} from './components'

// ============================================
// Built-in Extensions (Re-exports)
// ============================================

export * from './integrations'
