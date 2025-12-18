import { logger } from '@clarity-chat/utils/logger'
/**
 * Extension System Types
 *
 * World-class extension framework for Clarity Chat Components.
 * Build custom integrations, middleware, and plugins with full type safety.
 *
 * @packageDocumentation
 */

// ============================================
// Core Extension Types
// ============================================

/**
 * Extension categories for organization and discovery
 */
export type ExtensionCategory =
  | 'ai-provider'
  | 'vector-store'
  | 'authentication'
  | 'analytics'
  | 'storage'
  | 'realtime'
  | 'notification'
  | 'search'
  | 'crm'
  | 'observability'
  | 'security'
  | 'utility'
  | 'ui'
  | 'custom'

/**
 * Extension lifecycle states
 */
export type ExtensionState =
  | 'unregistered'
  | 'registered'
  | 'initializing'
  | 'active'
  | 'paused'
  | 'error'
  | 'disabled'

/**
 * Extension capability flags
 */
export interface ExtensionCapabilities {
  /** Supports hot reload without restart */
  hotReload?: boolean
  /** Can run in server-side environments */
  serverSide?: boolean
  /** Can run in browser environments */
  clientSide?: boolean
  /** Supports streaming operations */
  streaming?: boolean
  /** Has visual UI components */
  hasUI?: boolean
  /** Requires authentication */
  requiresAuth?: boolean
  /** Is fully offline capable */
  offline?: boolean
}

/**
 * Extension metadata for registry and discovery
 */
export interface ExtensionMetadata {
  /** Unique extension identifier (lowercase, kebab-case) */
  id: string
  /** Display name */
  name: string
  /** Semantic version */
  version: string
  /** Extension category */
  category: ExtensionCategory
  /** Brief description */
  description: string
  /** Long description with features */
  longDescription?: string
  /** Author or organization */
  author: string
  /** Homepage URL */
  homepage?: string
  /** Documentation URL */
  documentation?: string
  /** Repository URL */
  repository?: string
  /** License type */
  license?: string
  /** Extension icon URL or component */
  icon?: string | React.ComponentType
  /** Tags for search and filtering */
  tags?: string[]
  /** Capability flags */
  capabilities?: ExtensionCapabilities
  /** Required peer dependencies */
  peerDependencies?: Record<string, string>
  /** Other extensions this depends on */
  extensionDependencies?: string[]
  /** Minimum Clarity Chat version required */
  minClarityVersion?: string
  /** Whether this is an official Clarity extension */
  official?: boolean
  /** Whether this is verified by Clarity team */
  verified?: boolean
  /** Download/usage count (for marketplace) */
  downloads?: number
  /** Average rating (1-5) */
  rating?: number
}

/**
 * Extension configuration schema for validation
 */
export interface ExtensionConfigSchema {
  /** Schema version */
  version: '1.0'
  /** Required fields */
  required?: string[]
  /** Field definitions */
  properties: Record<string, ExtensionConfigField>
}

/**
 * Individual config field definition
 */
export interface ExtensionConfigField {
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'secret'
  /** Field label for UI */
  label: string
  /** Field description */
  description?: string
  /** Default value */
  default?: unknown
  /** Placeholder text */
  placeholder?: string
  /** Validation pattern (regex for strings) */
  pattern?: string
  /** Minimum value (numbers) or length (strings/arrays) */
  min?: number
  /** Maximum value (numbers) or length (strings/arrays) */
  max?: number
  /** Allowed values (enum) */
  enum?: unknown[]
  /** Environment variable to read from */
  envVar?: string
  /** Whether field is sensitive (hidden in UI) */
  sensitive?: boolean
}

// ============================================
// Extension Context & Lifecycle
// ============================================

/**
 * Context passed to extensions during lifecycle
 */
export interface ExtensionContext<TConfig = Record<string, unknown>> {
  /** Extension metadata */
  metadata: ExtensionMetadata
  /** Validated configuration */
  config: TConfig
  /** Extension state management */
  state: ExtensionStateManager
  /** Logger with extension prefix */
  logger: ExtensionLogger
  /** Event emitter for inter-extension communication */
  events: ExtensionEventEmitter
  /** Dependency injection container */
  services: ExtensionServiceContainer
  /** Storage for persisting data */
  storage: ExtensionStorage
  /** Abort signal for cancellation */
  signal: AbortSignal
}

/**
 * Extension state manager for local state
 */
export interface ExtensionStateManager {
  /** Get a state value */
  get<T>(key: string): T | undefined
  /** Set a state value */
  set<T>(key: string, value: T): void
  /** Check if key exists */
  has(key: string): boolean
  /** Delete a key */
  delete(key: string): boolean
  /** Clear all state */
  clear(): void
  /** Subscribe to state changes */
  subscribe(key: string, callback: (value: unknown) => void): () => void
  /** Get all state as object */
  getAll(): Record<string, unknown>
  /** Clean up all state and subscribers to prevent memory leaks */
  dispose?(): void
}

/**
 * Extension logger interface for structured logging within extensions
 */
export interface ExtensionLogger {
  /** Log debug-level message (development only) */
  debug(message: string, ...args: unknown[]): void
  /** Log informational message */
  info(message: string, ...args: unknown[]): void
  /** Log warning message */
  warn(message: string, ...args: unknown[]): void
  /** Log error message */
  error(message: string, ...args: unknown[]): void
  /** Create child logger with additional prefix */
  child(prefix: string): ExtensionLogger
}

/**
 * Extension event emitter for communication
 */
export interface ExtensionEventEmitter {
  /** Emit an event */
  emit(event: string, data?: unknown): void
  /** Subscribe to an event */
  on(event: string, handler: (data: unknown) => void): () => void
  /** Subscribe to event once */
  once(event: string, handler: (data: unknown) => void): () => void
  /** Remove all handlers for an event */
  off(event: string): void
  /** Clean up all handlers to prevent memory leaks */
  dispose?(): void
}

/**
 * Service container for dependency injection
 */
export interface ExtensionServiceContainer {
  /** Register a service */
  register<T>(key: string, service: T): void
  /** Get a service */
  get<T>(key: string): T | undefined
  /** Check if service exists */
  has(key: string): boolean
  /** Get the registry (for accessing other extensions) */
  getRegistry(): ExtensionRegistry
}

/**
 * Extension storage interface
 */
export interface ExtensionStorage {
  /** Get a value */
  get<T>(key: string): Promise<T | undefined>
  /** Set a value */
  set<T>(key: string, value: T): Promise<void>
  /** Delete a value */
  delete(key: string): Promise<boolean>
  /** Clear all storage for this extension */
  clear(): Promise<void>
  /** Get all keys */
  keys(): Promise<string[]>
}

// ============================================
// Extension Definition
// ============================================

/**
 * Core extension definition
 */
export interface Extension<TConfig = Record<string, unknown>> {
  /** Extension metadata */
  metadata: ExtensionMetadata
  /** Configuration schema */
  configSchema?: ExtensionConfigSchema
  /** Default configuration */
  defaultConfig?: Partial<TConfig>

  /**
   * Initialize the extension
   * Called when extension is first loaded
   */
  initialize?(context: ExtensionContext<TConfig>): Promise<void> | void

  /**
   * Activate the extension
   * Called when extension becomes active
   */
  activate?(context: ExtensionContext<TConfig>): Promise<void> | void

  /**
   * Deactivate the extension
   * Called when extension is paused or disabled
   */
  deactivate?(context: ExtensionContext<TConfig>): Promise<void> | void

  /**
   * Cleanup when extension is unregistered
   */
  dispose?(context: ExtensionContext<TConfig>): Promise<void> | void

  /**
   * Hot reload handler
   * Called when extension config changes at runtime
   */
  onConfigChange?(
    newConfig: TConfig,
    oldConfig: TConfig,
    context: ExtensionContext<TConfig>
  ): Promise<void> | void

  /**
   * Health check for monitoring
   */
  healthCheck?(
    context: ExtensionContext<TConfig>
  ): Promise<ExtensionHealthStatus>
}

/**
 * Health status for monitoring
 */
export interface ExtensionHealthStatus {
  /** Overall health */
  healthy: boolean
  /** Status message */
  message?: string
  /** Detailed metrics */
  metrics?: Record<string, number>
  /** Last successful operation timestamp */
  lastSuccess?: Date
  /** Any warnings */
  warnings?: string[]
}

// ============================================
// Extension Registry
// ============================================

/**
 * Extension registration entry
 */
export interface ExtensionRegistration<TConfig = Record<string, unknown>> {
  /** Extension definition */
  extension: Extension<TConfig>
  /** Runtime configuration */
  config: TConfig
  /** Current state */
  state: ExtensionState
  /** Error if in error state */
  error?: Error
  /** Registration timestamp */
  registeredAt: Date
  /** Last state change timestamp */
  lastStateChange: Date
  /** Instance context */
  context?: ExtensionContext<TConfig>
}

/**
 * Extension registry for managing all extensions
 */
export interface ExtensionRegistry {
  /** Register an extension */
  register<TConfig>(
    extension: Extension<TConfig>,
    config?: TConfig
  ): Promise<ExtensionRegistration<TConfig>>

  /** Unregister an extension */
  unregister(extensionId: string): Promise<void>

  /** Get extension by ID */
  get<TConfig>(extensionId: string): ExtensionRegistration<TConfig> | undefined

  /** Get all extensions */
  getAll(): ExtensionRegistration[]

  /** Get extensions by category */
  getByCategory(category: ExtensionCategory): ExtensionRegistration[]

  /** Check if extension is registered */
  has(extensionId: string): boolean

  /** Enable an extension */
  enable(extensionId: string): Promise<void>

  /** Disable an extension */
  disable(extensionId: string): Promise<void>

  /** Update extension config */
  updateConfig<TConfig>(
    extensionId: string,
    config: Partial<TConfig>
  ): Promise<void>

  /** Get health status of all extensions */
  healthCheck(): Promise<Map<string, ExtensionHealthStatus>>

  /** Subscribe to registry events */
  on(
    event: ExtensionRegistryEvent,
    handler: (data: ExtensionRegistryEventData) => void
  ): () => void

  /** Get the global event emitter for inter-extension communication */
  getEventEmitter?(): ExtensionEventEmitter

  /** Dispose the registry and all extensions */
  dispose?(): Promise<void>
}

/**
 * Registry event types
 */
export type ExtensionRegistryEvent =
  | 'extension:registered'
  | 'extension:unregistered'
  | 'extension:enabled'
  | 'extension:disabled'
  | 'extension:error'
  | 'extension:config-changed'
  | 'extension:health-changed'

/**
 * Registry event data
 */
export interface ExtensionRegistryEventData {
  extensionId: string
  event: ExtensionRegistryEvent
  timestamp: Date
  data?: unknown
}

// ============================================
// Middleware System
// ============================================

/**
 * Middleware function type
 */
export type MiddlewareFunction<TInput, TOutput = TInput> = (
  input: TInput,
  context: MiddlewareContext,
  next: () => Promise<TOutput>
) => Promise<TOutput>

/**
 * Middleware context
 */
export interface MiddlewareContext {
  /** Request/operation ID */
  requestId: string
  /** Timestamp */
  timestamp: Date
  /** Metadata */
  metadata: Record<string, unknown>
  /** Logger */
  logger: ExtensionLogger
  /** Abort signal */
  signal: AbortSignal
}

/**
 * Middleware definition
 */
export interface Middleware<TInput, TOutput = TInput> {
  /** Middleware name */
  name: string
  /** Priority (lower = earlier execution) */
  priority?: number
  /** Middleware function */
  handler: MiddlewareFunction<TInput, TOutput>
}

/**
 * Middleware pipeline
 */
export interface MiddlewarePipeline<TInput, TOutput = TInput> {
  /** Add middleware */
  use(middleware: Middleware<TInput, TOutput>): void
  /** Remove middleware */
  remove(name: string): void
  /** Execute pipeline */
  execute(input: TInput, context?: Partial<MiddlewareContext>): Promise<TOutput>
  /** Get all middleware */
  getAll(): Middleware<TInput, TOutput>[]
}

// ============================================
// Extension Builder (Fluent API)
// ============================================

/**
 * Fluent builder for creating extensions
 */
export interface ExtensionBuilder<TConfig = Record<string, unknown>> {
  /** Set metadata */
  metadata(metadata: Partial<ExtensionMetadata>): ExtensionBuilder<TConfig>
  /** Set config schema */
  configSchema(schema: ExtensionConfigSchema): ExtensionBuilder<TConfig>
  /** Set default config */
  defaultConfig(config: Partial<TConfig>): ExtensionBuilder<TConfig>
  /** Set initialize handler */
  onInitialize(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig>
  /** Set activate handler */
  onActivate(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig>
  /** Set deactivate handler */
  onDeactivate(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig>
  /** Set dispose handler */
  onDispose(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig>
  /** Set config change handler */
  onConfigChange(
    handler: (
      newConfig: TConfig,
      oldConfig: TConfig,
      context: ExtensionContext<TConfig>
    ) => Promise<void> | void
  ): ExtensionBuilder<TConfig>
  /** Set health check handler */
  onHealthCheck(
    handler: (
      context: ExtensionContext<TConfig>
    ) => Promise<ExtensionHealthStatus>
  ): ExtensionBuilder<TConfig>
  /** Build the extension */
  build(): Extension<TConfig>
}

// ============================================
// Type Helpers
// ============================================

/** Extract config type from extension */
export type ExtensionConfigType<T> = T extends Extension<infer C> ? C : never

/** Type for extension factory function */
export type ExtensionFactory<TConfig = Record<string, unknown>> = (
  config?: Partial<TConfig>
) => Extension<TConfig>

/** Type for async extension factory */
export type AsyncExtensionFactory<TConfig = Record<string, unknown>> = (
  config?: Partial<TConfig>
) => Promise<Extension<TConfig>>

// Import React for icon component type
import type * as React from 'react'
