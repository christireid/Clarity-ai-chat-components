/**
 * Extension Registry
 *
 * Central registry for managing all Clarity Chat extensions.
 * Handles registration, lifecycle, dependency resolution, and health monitoring.
 *
 * @packageDocumentation
 */

import type {
  Extension,
  ExtensionCategory,
  ExtensionConfigSchema,
  ExtensionContext,
  ExtensionEventEmitter,
  ExtensionHealthStatus,
  ExtensionLogger,
  ExtensionRegistration,
  ExtensionRegistry,
  ExtensionRegistryEvent,
  ExtensionRegistryEventData,
  ExtensionServiceContainer,
  ExtensionState,
  ExtensionStateManager,
  ExtensionStorage,
} from './types'

// ============================================
// State Manager Implementation
// ============================================

class StateManagerImpl implements ExtensionStateManager {
  private state = new Map<string, unknown>()
  private subscribers = new Map<string, Set<(value: unknown) => void>>()

  get<T>(key: string): T | undefined {
    return this.state.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.state.set(key, value)
    this.notifySubscribers(key, value)
  }

  has(key: string): boolean {
    return this.state.has(key)
  }

  delete(key: string): boolean {
    const result = this.state.delete(key)
    if (result) {
      this.notifySubscribers(key, undefined)
    }
    return result
  }

  clear(): void {
    // Notify all subscribers before clearing
    const keys = Array.from(this.state.keys())
    this.state.clear()
    keys.forEach((key) => this.notifySubscribers(key, undefined))
  }

  /** Clean up all subscribers to prevent memory leaks */
  dispose(): void {
    this.state.clear()
    this.subscribers.clear()
  }

  subscribe(key: string, callback: (value: unknown) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key)!.add(callback)
    return () => {
      this.subscribers.get(key)?.delete(callback)
    }
  }

  getAll(): Record<string, unknown> {
    const obj: Record<string, unknown> = {}
    this.state.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }

  private notifySubscribers(key: string, value: unknown): void {
    this.subscribers.get(key)?.forEach((cb) => {
      try {
        cb(value)
      } catch (e) {
        logger.error('State subscriber error:', e)
      }
    })
  }
}

// ============================================
// Logger Implementation
// ============================================

class LoggerImpl implements ExtensionLogger {
  private isDev = process.env.NODE_ENV === 'development'

  constructor(private prefix: string) {}

  debug(message: string, ...args: unknown[]): void {
    if (this.isDev) {
      logger.debug(`[${this.prefix}]`, message, ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.isDev) {
      logger.info(`[${this.prefix}]`, message, ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    logger.warn(`[${this.prefix}]`, message, ...args)
  }

  logger.error(message: string, ...args: unknown[]): void {
    logger.error(`[${this.prefix}]`, message, ...args)
  }

  child(childPrefix: string): ExtensionLogger {
    return new LoggerImpl(`${this.prefix}:${childPrefix}`)
  }
}

// ============================================
// Event Emitter Implementation
// ============================================

class EventEmitterImpl implements ExtensionEventEmitter {
  private handlers = new Map<string, Set<(data: unknown) => void>>()
  private onceHandlers = new Map<string, Set<(data: unknown) => void>>()

  emit(event: string, data?: unknown): void {
    // Regular handlers
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(data)
      } catch (e) {
        logger.error(`Event handler error for ${event}:`, e)
      }
    })

    // Once handlers
    const once = this.onceHandlers.get(event)
    if (once) {
      once.forEach((handler) => {
        try {
          handler(data)
        } catch (e) {
          logger.error(`Once handler error for ${event}:`, e)
        }
      })
      this.onceHandlers.delete(event)
    }
  }

  on(event: string, handler: (data: unknown) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
    return () => {
      this.handlers.get(event)?.delete(handler)
    }
  }

  once(event: string, handler: (data: unknown) => void): () => void {
    if (!this.onceHandlers.has(event)) {
      this.onceHandlers.set(event, new Set())
    }
    this.onceHandlers.get(event)!.add(handler)
    return () => {
      this.onceHandlers.get(event)?.delete(handler)
    }
  }

  off(event: string): void {
    this.handlers.delete(event)
    this.onceHandlers.delete(event)
  }

  /** Clean up all handlers to prevent memory leaks */
  dispose(): void {
    this.handlers.clear()
    this.onceHandlers.clear()
  }
}

// ============================================
// Service Container Implementation
// ============================================

class ServiceContainerImpl implements ExtensionServiceContainer {
  private services = new Map<string, unknown>()

  constructor(private registry: ExtensionRegistry) {}

  register<T>(key: string, service: T): void {
    this.services.set(key, service)
  }

  get<T>(key: string): T | undefined {
    return this.services.get(key) as T | undefined
  }

  has(key: string): boolean {
    return this.services.has(key)
  }

  getRegistry(): ExtensionRegistry {
    return this.registry
  }
}

// ============================================
// Storage Implementation
// ============================================

/** Sanitize storage key to prevent injection attacks */
function sanitizeStorageKey(key: string): string {
  // Only allow alphanumeric, dashes, underscores, and dots
  return key.replace(/[^a-zA-Z0-9\-_.]/g, '_')
}

/** Safely parse JSON with error handling */
function safeJsonParse<T>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

class StorageImpl implements ExtensionStorage {
  private prefix: string
  private inMemoryFallback = new Map<string, unknown>()
  private useLocalStorage: boolean

  constructor(extensionId: string) {
    // Sanitize extension ID to prevent storage key injection
    const safeId = sanitizeStorageKey(extensionId)
    this.prefix = `clarity-ext:${safeId}:`
    this.useLocalStorage = typeof localStorage !== 'undefined'
  }

  async get<T>(key: string): Promise<T | undefined> {
    const safeKey = sanitizeStorageKey(key)
    const fullKey = this.prefix + safeKey
    if (this.useLocalStorage) {
      const value = localStorage.getItem(fullKey)
      return value ? safeJsonParse<T>(value) : undefined
    }
    return this.inMemoryFallback.get(fullKey) as T | undefined
  }

  async set<T>(key: string, value: T): Promise<void> {
    const safeKey = sanitizeStorageKey(key)
    const fullKey = this.prefix + safeKey
    if (this.useLocalStorage) {
      try {
        localStorage.setItem(fullKey, JSON.stringify(value))
      } catch {
        this.inMemoryFallback.set(fullKey, value)
      }
    } else {
      this.inMemoryFallback.set(fullKey, value)
    }
  }

  async delete(key: string): Promise<boolean> {
    const safeKey = sanitizeStorageKey(key)
    const fullKey = this.prefix + safeKey
    if (this.useLocalStorage) {
      const existed = localStorage.getItem(fullKey) !== null
      localStorage.removeItem(fullKey)
      return existed
    }
    return this.inMemoryFallback.delete(fullKey)
  }

  async clear(): Promise<void> {
    if (this.useLocalStorage) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))
    }
    this.inMemoryFallback.forEach((_, key) => {
      if (key.startsWith(this.prefix)) {
        this.inMemoryFallback.delete(key)
      }
    })
  }

  async keys(): Promise<string[]> {
    const keys: string[] = []
    if (this.useLocalStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length))
        }
      }
    }
    this.inMemoryFallback.forEach((_, key) => {
      if (key.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length))
      }
    })
    return [...new Set(keys)]
  }
}

// ============================================
// ID Validation
// ============================================

/** Regex for valid extension IDs: alphanumeric, dashes, underscores, dots, and colons */
const VALID_EXTENSION_ID_REGEX = /^[a-zA-Z][a-zA-Z0-9\-_.:]*$/

/**
 * Validate extension ID to prevent injection attacks
 * @throws Error if the ID is invalid
 */
function validateExtensionId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error('Extension ID must be a non-empty string')
  }

  if (id.length > 128) {
    throw new Error('Extension ID must not exceed 128 characters')
  }

  if (!VALID_EXTENSION_ID_REGEX.test(id)) {
    throw new Error(
      'Extension ID must start with a letter and contain only alphanumeric characters, dashes, underscores, dots, or colons'
    )
  }
}

// ============================================
// Config Validation
// ============================================

function validateConfig(
  config: Record<string, unknown>,
  schema: ExtensionConfigSchema
): void {
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (config[field] === undefined || config[field] === null) {
        throw new Error(`Required configuration field "${field}" is missing`)
      }
    }
  }

  // Validate each property
  for (const [key, fieldSchema] of Object.entries(schema.properties)) {
    const value = config[key]

    // Skip undefined optional fields
    if (value === undefined && !schema.required?.includes(key)) {
      continue
    }

    // Type validation
    if (fieldSchema.type === 'string' && typeof value !== 'string') {
      throw new Error(`Field "${key}" must be a string`)
    }
    if (fieldSchema.type === 'number' && typeof value !== 'number') {
      throw new Error(`Field "${key}" must be a number`)
    }
    if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
      throw new Error(`Field "${key}" must be a boolean`)
    }
    if (fieldSchema.type === 'array' && !Array.isArray(value)) {
      throw new Error(`Field "${key}" must be an array`)
    }
    if (
      fieldSchema.type === 'object' &&
      (typeof value !== 'object' || Array.isArray(value))
    ) {
      throw new Error(`Field "${key}" must be an object`)
    }

    // Pattern validation
    if (fieldSchema.pattern && typeof value === 'string') {
      const regex = new RegExp(fieldSchema.pattern)
      if (!regex.test(value)) {
        throw new Error(`Field "${key}" does not match required pattern`)
      }
    }

    // Min/max validation
    if (typeof value === 'number') {
      if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        throw new Error(`Field "${key}" must be at least ${fieldSchema.min}`)
      }
      if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        throw new Error(`Field "${key}" must be at most ${fieldSchema.max}`)
      }
    }

    // Enum validation
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      throw new Error(
        `Field "${key}" must be one of: ${fieldSchema.enum.join(', ')}`
      )
    }
  }
}

// ============================================
// Extension Registry Implementation
// ============================================

export interface ExtensionRegistryOptions {
  /** Enable debug logging */
  debug?: boolean
  /** Auto-resolve dependencies */
  autoResolveDependencies?: boolean
  /** Health check interval in ms (0 to disable) */
  healthCheckInterval?: number
}

export class ExtensionRegistryImpl implements ExtensionRegistry {
  private extensions = new Map<string, ExtensionRegistration>()
  private eventHandlers = new Map<
    ExtensionRegistryEvent,
    Set<(data: ExtensionRegistryEventData) => void>
  >()
  private abortControllers = new Map<string, AbortController>()
  private options: Required<ExtensionRegistryOptions>
  private healthCheckTimer?: ReturnType<typeof setInterval>
  private globalEventEmitter = new EventEmitterImpl()

  constructor(options: ExtensionRegistryOptions = {}) {
    this.options = {
      debug: options.debug ?? false,
      autoResolveDependencies: options.autoResolveDependencies ?? true,
      healthCheckInterval: options.healthCheckInterval ?? 60000,
    }

    if (this.options.healthCheckInterval > 0) {
      this.startHealthChecks()
    }
  }

  async register<TConfig = Record<string, unknown>>(
    extension: Extension<TConfig>,
    config?: TConfig
  ): Promise<ExtensionRegistration<TConfig>> {
    const { id } = extension.metadata

    // Validate extension ID
    validateExtensionId(id)

    // Check if already registered
    if (this.extensions.has(id)) {
      throw new Error(`Extension "${id}" is already registered`)
    }

    // Merge default config
    const mergedConfig = {
      ...extension.defaultConfig,
      ...config,
    } as TConfig

    // Validate config if schema exists
    if (extension.configSchema) {
      validateConfig(
        mergedConfig as Record<string, unknown>,
        extension.configSchema
      )
    }

    // Check dependencies
    const deps = extension.metadata.extensionDependencies || []
    for (const dep of deps) {
      if (!this.extensions.has(dep)) {
        if (this.options.autoResolveDependencies) {
          this.log(`Dependency "${dep}" not found for extension "${id}"`)
        } else {
          throw new Error(`Required dependency "${dep}" is not registered`)
        }
      }
    }

    // Create abort controller
    const abortController = new AbortController()
    this.abortControllers.set(id, abortController)

    // Create context
    const context = this.createContext(
      extension,
      mergedConfig,
      abortController.signal
    )

    // Create registration
    const registration: ExtensionRegistration<TConfig> = {
      extension,
      config: mergedConfig,
      state: 'registered',
      registeredAt: new Date(),
      lastStateChange: new Date(),
      context,
    }

    // Store registration
    this.extensions.set(id, registration as ExtensionRegistration)

    // Initialize
    try {
      registration.state = 'initializing'
      registration.lastStateChange = new Date()

      if (extension.initialize) {
        await extension.initialize(context)
      }

      // Activate
      if (extension.activate) {
        await extension.activate(context)
      }

      registration.state = 'active'
      registration.lastStateChange = new Date()

      this.emitEvent('extension:registered', id)
      this.log(`Extension "${id}" registered and activated`)
    } catch (error) {
      registration.state = 'error'
      registration.error =
        error instanceof Error ? error : new Error(String(error))
      registration.lastStateChange = new Date()
      this.emitEvent('extension:error', id, { error: registration.error })
      this.log(`Extension "${id}" failed to initialize:`, registration.error)
    }

    return registration
  }

  async unregister(extensionId: string): Promise<void> {
    const registration = this.extensions.get(extensionId)
    if (!registration) {
      return
    }

    // Abort any pending operations
    const abortController = this.abortControllers.get(extensionId)
    abortController?.abort()

    // Deactivate and dispose
    try {
      if (registration.extension.deactivate && registration.context) {
        await registration.extension.deactivate(registration.context)
      }
      if (registration.extension.dispose && registration.context) {
        await registration.extension.dispose(registration.context)
      }
    } catch (error) {
      this.log(`Error disposing extension "${extensionId}":`, error)
    }

    // Clean up internal resources to prevent memory leaks
    if (registration.context) {
      registration.context.state.dispose?.()
    }

    // Remove from registry
    this.extensions.delete(extensionId)
    this.abortControllers.delete(extensionId)

    this.emitEvent('extension:unregistered', extensionId)
    this.log(`Extension "${extensionId}" unregistered`)
  }

  get<TConfig>(
    extensionId: string
  ): ExtensionRegistration<TConfig> | undefined {
    return this.extensions.get(extensionId) as
      | ExtensionRegistration<TConfig>
      | undefined
  }

  getAll(): ExtensionRegistration[] {
    return Array.from(this.extensions.values())
  }

  getByCategory(category: ExtensionCategory): ExtensionRegistration[] {
    return Array.from(this.extensions.values()).filter(
      (reg) => reg.extension.metadata.category === category
    )
  }

  has(extensionId: string): boolean {
    return this.extensions.has(extensionId)
  }

  async enable(extensionId: string): Promise<void> {
    const registration = this.extensions.get(extensionId)
    if (!registration) {
      throw new Error(`Extension "${extensionId}" not found`)
    }

    if (registration.state === 'active') {
      return
    }

    try {
      if (registration.extension.activate && registration.context) {
        await registration.extension.activate(registration.context)
      }
      registration.state = 'active'
      registration.lastStateChange = new Date()
      registration.error = undefined
      this.emitEvent('extension:enabled', extensionId)
    } catch (error) {
      registration.state = 'error'
      registration.error =
        error instanceof Error ? error : new Error(String(error))
      registration.lastStateChange = new Date()
      throw error
    }
  }

  async disable(extensionId: string): Promise<void> {
    const registration = this.extensions.get(extensionId)
    if (!registration) {
      throw new Error(`Extension "${extensionId}" not found`)
    }

    if (registration.state === 'disabled') {
      return
    }

    try {
      if (registration.extension.deactivate && registration.context) {
        await registration.extension.deactivate(registration.context)
      }
      registration.state = 'disabled'
      registration.lastStateChange = new Date()
      this.emitEvent('extension:disabled', extensionId)
    } catch (error) {
      registration.state = 'error'
      registration.error =
        error instanceof Error ? error : new Error(String(error))
      registration.lastStateChange = new Date()
      throw error
    }
  }

  async updateConfig<TConfig>(
    extensionId: string,
    config: Partial<TConfig>
  ): Promise<void> {
    const registration = this.extensions.get(extensionId) as
      | ExtensionRegistration<TConfig>
      | undefined
    if (!registration) {
      throw new Error(`Extension "${extensionId}" not found`)
    }

    const oldConfig = { ...registration.config }
    const newConfig = { ...oldConfig, ...config }

    // Validate new config
    if (registration.extension.configSchema) {
      validateConfig(
        newConfig as Record<string, unknown>,
        registration.extension.configSchema
      )
    }

    registration.config = newConfig

    // Notify extension of config change
    if (registration.extension.onConfigChange && registration.context) {
      try {
        await registration.extension.onConfigChange(
          newConfig,
          oldConfig,
          registration.context as ExtensionContext<TConfig>
        )
      } catch (error) {
        // Rollback on error
        registration.config = oldConfig
        throw error
      }
    }

    this.emitEvent('extension:config-changed', extensionId, {
      oldConfig,
      newConfig,
    })
  }

  async healthCheck(): Promise<Map<string, ExtensionHealthStatus>> {
    const results = new Map<string, ExtensionHealthStatus>()

    for (const [id, registration] of this.extensions) {
      if (registration.state === 'disabled') {
        results.set(id, { healthy: true, message: 'Extension is disabled' })
        continue
      }

      if (registration.extension.healthCheck && registration.context) {
        try {
          const status = await registration.extension.healthCheck(
            registration.context
          )
          results.set(id, status)
        } catch (error) {
          results.set(id, {
            healthy: false,
            message:
              error instanceof Error ? error.message : 'Health check failed',
          })
        }
      } else {
        // Default health status based on state
        results.set(id, {
          healthy: registration.state === 'active',
          message: `State: ${registration.state}`,
        })
      }
    }

    return results
  }

  on(
    event: ExtensionRegistryEvent,
    handler: (data: ExtensionRegistryEventData) => void
  ): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
    return () => {
      this.eventHandlers.get(event)?.delete(handler)
    }
  }

  /**
   * Get the global event emitter for inter-extension communication
   */
  getEventEmitter(): ExtensionEventEmitter {
    return this.globalEventEmitter
  }

  /**
   * Dispose the registry and all extensions
   */
  async dispose(): Promise<void> {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = undefined
    }

    const extensionIds = Array.from(this.extensions.keys())
    for (const id of extensionIds) {
      await this.unregister(id)
    }

    // Clean up global event emitter
    this.globalEventEmitter.dispose()

    // Clear all registry event handlers
    this.eventHandlers.clear()
  }

  private createContext<TConfig>(
    extension: Extension<TConfig>,
    config: TConfig,
    signal: AbortSignal
  ): ExtensionContext<TConfig> {
    return {
      metadata: extension.metadata,
      config,
      state: new StateManagerImpl(),
      logger: new LoggerImpl(`Clarity:${extension.metadata.id}`),
      events: this.globalEventEmitter,
      services: new ServiceContainerImpl(this),
      storage: new StorageImpl(extension.metadata.id),
      signal,
    }
  }

  private emitEvent(
    event: ExtensionRegistryEvent,
    extensionId: string,
    data?: unknown
  ): void {
    const eventData: ExtensionRegistryEventData = {
      extensionId,
      event,
      timestamp: new Date(),
      data,
    }

    this.eventHandlers.get(event)?.forEach((handler) => {
      try {
        handler(eventData)
      } catch (e) {
        logger.error('Registry event handler error:', e)
      }
    })
  }

  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(async () => {
      const results = await this.healthCheck()
      results.forEach((status, id) => {
        if (!status.healthy) {
          this.emitEvent('extension:health-changed', id, status)
        }
      })
    }, this.options.healthCheckInterval)
  }

  private log(...args: unknown[]): void {
    if (this.options.debug) {
      logger.debug('[ExtensionRegistry]', ...args)
    }
  }
}

/**
 * Create a new extension registry
 */
export function createExtensionRegistry(
  options?: ExtensionRegistryOptions
): ExtensionRegistry {
  return new ExtensionRegistryImpl(options)
}

/**
 * Default global registry instance
 */
let globalRegistry: ExtensionRegistry | null = null

/**
 * Get or create the global extension registry
 */
export function getGlobalRegistry(): ExtensionRegistry {
  if (!globalRegistry) {
    globalRegistry = createExtensionRegistry()
  }
  return globalRegistry
}

/**
 * Set a custom global registry
 */
export function setGlobalRegistry(registry: ExtensionRegistry): void {
  globalRegistry = registry
}
