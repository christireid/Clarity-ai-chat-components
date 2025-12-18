/**
 * Extension Builder
 *
 * Fluent API for creating extensions with full type safety.
 * Makes it easy to build custom integrations without boilerplate.
 *
 * @packageDocumentation
 */

import type {
  Extension,
  ExtensionBuilder,
  ExtensionCategory,
  ExtensionConfigSchema,
  ExtensionContext,
  ExtensionHealthStatus,
  ExtensionMetadata,
} from './types'

// ============================================
// Builder Implementation
// ============================================

class ExtensionBuilderImpl<
  TConfig = Record<string, unknown>,
> implements ExtensionBuilder<TConfig> {
  private _metadata: Partial<ExtensionMetadata> = {}
  private _configSchema?: ExtensionConfigSchema
  private _defaultConfig?: Partial<TConfig>
  private _initialize?: (
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  private _activate?: (
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  private _deactivate?: (
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  private _dispose?: (
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  private _onConfigChange?: (
    newConfig: TConfig,
    oldConfig: TConfig,
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  private _healthCheck?: (
    context: ExtensionContext<TConfig>
  ) => Promise<ExtensionHealthStatus>

  metadata(metadata: Partial<ExtensionMetadata>): ExtensionBuilder<TConfig> {
    this._metadata = { ...this._metadata, ...metadata }
    return this
  }

  configSchema(schema: ExtensionConfigSchema): ExtensionBuilder<TConfig> {
    this._configSchema = schema
    return this
  }

  defaultConfig(config: Partial<TConfig>): ExtensionBuilder<TConfig> {
    this._defaultConfig = config
    return this
  }

  onInitialize(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig> {
    this._initialize = handler
    return this
  }

  onActivate(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig> {
    this._activate = handler
    return this
  }

  onDeactivate(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig> {
    this._deactivate = handler
    return this
  }

  onDispose(
    handler: (context: ExtensionContext<TConfig>) => Promise<void> | void
  ): ExtensionBuilder<TConfig> {
    this._dispose = handler
    return this
  }

  onConfigChange(
    handler: (
      newConfig: TConfig,
      oldConfig: TConfig,
      context: ExtensionContext<TConfig>
    ) => Promise<void> | void
  ): ExtensionBuilder<TConfig> {
    this._onConfigChange = handler
    return this
  }

  onHealthCheck(
    handler: (
      context: ExtensionContext<TConfig>
    ) => Promise<ExtensionHealthStatus>
  ): ExtensionBuilder<TConfig> {
    this._healthCheck = handler
    return this
  }

  build(): Extension<TConfig> {
    // Validate required metadata
    if (!this._metadata.id) {
      throw new Error('Extension id is required')
    }
    if (!this._metadata.name) {
      throw new Error('Extension name is required')
    }
    if (!this._metadata.version) {
      throw new Error('Extension version is required')
    }
    if (!this._metadata.category) {
      throw new Error('Extension category is required')
    }
    if (!this._metadata.description) {
      throw new Error('Extension description is required')
    }
    if (!this._metadata.author) {
      throw new Error('Extension author is required')
    }

    return {
      metadata: this._metadata as ExtensionMetadata,
      configSchema: this._configSchema,
      defaultConfig: this._defaultConfig,
      initialize: this._initialize,
      activate: this._activate,
      deactivate: this._deactivate,
      dispose: this._dispose,
      onConfigChange: this._onConfigChange,
      healthCheck: this._healthCheck,
    }
  }
}

/**
 * Create a new extension builder
 *
 * @example
 * ```ts
 * const myExtension = createExtensionBuilder<MyConfig>()
 *   .metadata({
 *     id: 'my-extension',
 *     name: 'My Extension',
 *     version: '1.0.0',
 *     category: 'utility',
 *     description: 'A custom extension',
 *     author: 'Your Name',
 *   })
 *   .configSchema({
 *     version: '1.0',
 *     required: ['apiKey'],
 *     properties: {
 *       apiKey: { type: 'secret', label: 'API Key' },
 *     },
 *   })
 *   .onInitialize((ctx) => {
 *     ctx.logger.info('Extension initialized')
 *   })
 *   .build()
 * ```
 */
export function createExtensionBuilder<
  TConfig = Record<string, unknown>,
>(): ExtensionBuilder<TConfig> {
  return new ExtensionBuilderImpl<TConfig>()
}

// ============================================
// Quick Extension Factories
// ============================================

/**
 * Quick extension creation options
 */
export interface QuickExtensionOptions<TConfig = Record<string, unknown>> {
  /** Extension ID */
  id: string
  /** Display name */
  name: string
  /** Version */
  version?: string
  /** Category */
  category: ExtensionCategory
  /** Description */
  description: string
  /** Author */
  author?: string
  /** Config schema */
  configSchema?: ExtensionConfigSchema
  /** Default config */
  defaultConfig?: Partial<TConfig>
  /** Initialize handler */
  initialize?: (context: ExtensionContext<TConfig>) => Promise<void> | void
  /** Activate handler */
  activate?: (context: ExtensionContext<TConfig>) => Promise<void> | void
  /** Deactivate handler */
  deactivate?: (context: ExtensionContext<TConfig>) => Promise<void> | void
  /** Dispose handler */
  dispose?: (context: ExtensionContext<TConfig>) => Promise<void> | void
  /** Config change handler */
  onConfigChange?: (
    newConfig: TConfig,
    oldConfig: TConfig,
    context: ExtensionContext<TConfig>
  ) => Promise<void> | void
  /** Health check handler */
  healthCheck?: (
    context: ExtensionContext<TConfig>
  ) => Promise<ExtensionHealthStatus>
  /** Tags */
  tags?: string[]
  /** Homepage */
  homepage?: string
  /** Documentation */
  documentation?: string
}

/**
 * Create an extension quickly without the builder pattern
 *
 * @example
 * ```ts
 * const extension = defineExtension({
 *   id: 'analytics-tracker',
 *   name: 'Analytics Tracker',
 *   category: 'analytics',
 *   description: 'Track chat analytics',
 *   initialize: (ctx) => {
 *     ctx.logger.info('Tracker ready')
 *   },
 * })
 * ```
 */
export function defineExtension<TConfig = Record<string, unknown>>(
  options: QuickExtensionOptions<TConfig>
): Extension<TConfig> {
  return {
    metadata: {
      id: options.id,
      name: options.name,
      version: options.version ?? '1.0.0',
      category: options.category,
      description: options.description,
      author: options.author ?? 'Unknown',
      tags: options.tags,
      homepage: options.homepage,
      documentation: options.documentation,
    },
    configSchema: options.configSchema,
    defaultConfig: options.defaultConfig,
    initialize: options.initialize,
    activate: options.activate,
    deactivate: options.deactivate,
    dispose: options.dispose,
    onConfigChange: options.onConfigChange,
    healthCheck: options.healthCheck,
  }
}

// ============================================
// Extension Composition
// ============================================

/**
 * Compose multiple extensions into a single extension
 * Useful for bundling related functionality
 */
export function composeExtensions<TConfig = Record<string, unknown>>(
  options: {
    id: string
    name: string
    version: string
    category: ExtensionCategory
    description: string
    author: string
  },
  ...extensions: Extension[]
): Extension<TConfig> {
  return {
    metadata: {
      ...options,
      extensionDependencies: extensions.map((e) => e.metadata.id),
    },

    async initialize(context) {
      for (const ext of extensions) {
        if (ext.initialize) {
          await ext.initialize(context as ExtensionContext)
        }
      }
    },

    async activate(context) {
      for (const ext of extensions) {
        if (ext.activate) {
          await ext.activate(context as ExtensionContext)
        }
      }
    },

    async deactivate(context) {
      // Deactivate in reverse order
      for (const ext of [...extensions].reverse()) {
        if (ext.deactivate) {
          await ext.deactivate(context as ExtensionContext)
        }
      }
    },

    async dispose(context) {
      // Dispose in reverse order
      for (const ext of [...extensions].reverse()) {
        if (ext.dispose) {
          await ext.dispose(context as ExtensionContext)
        }
      }
    },

    async healthCheck(context) {
      const results: ExtensionHealthStatus[] = []
      for (const ext of extensions) {
        if (ext.healthCheck) {
          results.push(await ext.healthCheck(context as ExtensionContext))
        }
      }

      const unhealthy = results.filter((r) => !r.healthy)
      return {
        healthy: unhealthy.length === 0,
        message:
          unhealthy.length > 0
            ? `${unhealthy.length} sub-extension(s) unhealthy`
            : 'All sub-extensions healthy',
        warnings: results.flatMap((r) => r.warnings ?? []),
      }
    },
  }
}

// ============================================
// Extension Decorators (for class-based extensions)
// ============================================

/**
 * Decorator metadata storage
 */
const extensionMetadataMap = new WeakMap<object, Partial<ExtensionMetadata>>()

/**
 * Class decorator to mark a class as an extension
 *
 * @example
 * ```ts
 * @ExtensionClass({
 *   id: 'my-extension',
 *   name: 'My Extension',
 *   version: '1.0.0',
 *   category: 'utility',
 *   description: 'A custom extension',
 *   author: 'Your Name',
 * })
 * class MyExtension implements Extension {
 *   // ...
 * }
 * ```
 */
export function ExtensionClass(metadata: ExtensionMetadata) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends new (...args: any[]) => object>(constructor: T) {
    extensionMetadataMap.set(constructor, metadata)
    return class extends constructor {
      metadata = metadata
    }
  }
}

/**
 * Get extension metadata from a decorated class
 */
export function getExtensionMetadata(
  target: object
): Partial<ExtensionMetadata> | undefined {
  return extensionMetadataMap.get(target.constructor)
}
