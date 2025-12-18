/**
 * Extension React Integration
 *
 * React hooks and context for seamless extension usage.
 * Provides declarative API for managing extensions in React apps.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import type {
  Extension,
  ExtensionCategory,
  ExtensionHealthStatus,
  ExtensionRegistration,
  ExtensionRegistry,
  ExtensionRegistryEvent,
  ExtensionRegistryEventData,
} from './types'
import { createExtensionRegistry, getGlobalRegistry } from './registry'

// ============================================
// Context
// ============================================

interface ExtensionContextValue {
  registry: ExtensionRegistry
  extensions: ExtensionRegistration[]
  isLoading: boolean
  error: Error | null
  register: <TConfig>(
    extension: Extension<TConfig>,
    config?: TConfig
  ) => Promise<void>
  unregister: (extensionId: string) => Promise<void>
  enable: (extensionId: string) => Promise<void>
  disable: (extensionId: string) => Promise<void>
  getExtension: <TConfig>(
    extensionId: string
  ) => ExtensionRegistration<TConfig> | undefined
  getByCategory: (category: ExtensionCategory) => ExtensionRegistration[]
}

const ExtensionContext = React.createContext<ExtensionContextValue | undefined>(
  undefined
)

// ============================================
// Provider
// ============================================

export interface ExtensionProviderProps {
  children: React.ReactNode
  /** Custom registry instance */
  registry?: ExtensionRegistry
  /** Auto-register these extensions on mount */
  extensions?: Array<{ extension: Extension; config?: Record<string, unknown> }>
  /** Enable debug logging */
  debug?: boolean
  /** Fallback UI while extensions load */
  fallback?: React.ReactNode
  /** Error boundary fallback */
  onError?: (error: Error) => void
}

/**
 * Provider component for extension system
 *
 * @example
 * ```tsx
 * <ExtensionProvider
 *   extensions={[
 *     { extension: analyticsExtension, config: { apiKey: '...' } },
 *     { extension: authExtension },
 *   ]}
 * >
 *   <App />
 * </ExtensionProvider>
 * ```
 */
export function ExtensionProvider({
  children,
  registry: customRegistry,
  extensions: initialExtensions = [],
  debug = false,
  fallback,
  onError,
}: ExtensionProviderProps): React.ReactElement {
  const [registry] = React.useState(
    () => customRegistry ?? createExtensionRegistry({ debug })
  )
  const [extensions, setExtensions] = React.useState<ExtensionRegistration[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(initialExtensions.length > 0)
  const [error, setError] = React.useState<Error | null>(null)

  // Subscribe to registry changes
  React.useEffect(() => {
    const updateExtensions = () => {
      setExtensions(registry.getAll())
    }

    const events: ExtensionRegistryEvent[] = [
      'extension:registered',
      'extension:unregistered',
      'extension:enabled',
      'extension:disabled',
      'extension:error',
      'extension:config-changed',
    ]

    const unsubscribes = events.map((event) =>
      registry.on(event, updateExtensions)
    )

    return () => {
      unsubscribes.forEach((unsub) => unsub())
    }
  }, [registry])

  // Register initial extensions
  React.useEffect(() => {
    if (initialExtensions.length === 0) return

    let mounted = true

    const registerAll = async () => {
      try {
        for (const { extension, config } of initialExtensions) {
          if (!mounted) return
          await registry.register(extension, config)
        }
        if (mounted) {
          setExtensions(registry.getAll())
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          setIsLoading(false)
          onError?.(error)
        }
      }
    }

    registerAll()

    return () => {
      mounted = false
    }
  }, []) // Only run once on mount

  const register = React.useCallback(
    async <TConfig,>(extension: Extension<TConfig>, config?: TConfig) => {
      try {
        await registry.register(extension, config)
        setExtensions(registry.getAll())
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
        throw error
      }
    },
    [registry, onError]
  )

  const unregister = React.useCallback(
    async (extensionId: string) => {
      await registry.unregister(extensionId)
      setExtensions(registry.getAll())
    },
    [registry]
  )

  const enable = React.useCallback(
    async (extensionId: string) => {
      await registry.enable(extensionId)
      setExtensions(registry.getAll())
    },
    [registry]
  )

  const disable = React.useCallback(
    async (extensionId: string) => {
      await registry.disable(extensionId)
      setExtensions(registry.getAll())
    },
    [registry]
  )

  const getExtension = React.useCallback(
    <TConfig,>(extensionId: string) => {
      return registry.get<TConfig>(extensionId)
    },
    [registry]
  )

  const getByCategory = React.useCallback(
    (category: ExtensionCategory) => {
      return registry.getByCategory(category)
    },
    [registry]
  )

  const value: ExtensionContextValue = {
    registry,
    extensions,
    isLoading,
    error,
    register,
    unregister,
    enable,
    disable,
    getExtension,
    getByCategory,
  }

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  )
}

// ============================================
// Hooks
// ============================================

/**
 * Access the extension context
 */
export function useExtensions(): ExtensionContextValue {
  const context = React.useContext(ExtensionContext)

  if (!context) {
    // Return a minimal implementation using global registry
    const registry = getGlobalRegistry()
    return {
      registry,
      extensions: registry.getAll(),
      isLoading: false,
      error: null,
      register: async (ext, config) => {
        await registry.register(ext, config)
      },
      unregister: async (id) => {
        await registry.unregister(id)
      },
      enable: async (id) => {
        await registry.enable(id)
      },
      disable: async (id) => {
        await registry.disable(id)
      },
      getExtension: (id) => registry.get(id),
      getByCategory: (cat) => registry.getByCategory(cat),
    }
  }

  return context
}

/**
 * Get a specific extension by ID
 */
export function useExtension<TConfig = Record<string, unknown>>(
  extensionId: string
): {
  extension: ExtensionRegistration<TConfig> | undefined
  isActive: boolean
  enable: () => Promise<void>
  disable: () => Promise<void>
  updateConfig: (config: Partial<TConfig>) => Promise<void>
} {
  const { registry, extensions } = useExtensions()

  const extension = React.useMemo(
    () =>
      extensions.find((e) => e.extension.metadata.id === extensionId) as
        | ExtensionRegistration<TConfig>
        | undefined,
    [extensions, extensionId]
  )

  const isActive = extension?.state === 'active'

  const enable = React.useCallback(async () => {
    await registry.enable(extensionId)
  }, [registry, extensionId])

  const disable = React.useCallback(async () => {
    await registry.disable(extensionId)
  }, [registry, extensionId])

  const updateConfig = React.useCallback(
    async (config: Partial<TConfig>) => {
      await registry.updateConfig(extensionId, config)
    },
    [registry, extensionId]
  )

  return { extension, isActive, enable, disable, updateConfig }
}

/**
 * Get extensions by category
 */
export function useExtensionsByCategory(
  category: ExtensionCategory
): ExtensionRegistration[] {
  const { extensions } = useExtensions()

  return React.useMemo(
    () => extensions.filter((e) => e.extension.metadata.category === category),
    [extensions, category]
  )
}

/**
 * Subscribe to extension registry events
 */
export function useExtensionEvents(
  handler: (event: ExtensionRegistryEventData) => void,
  events?: ExtensionRegistryEvent[]
): void {
  const { registry } = useExtensions()

  React.useEffect(() => {
    const eventTypes = events ?? [
      'extension:registered',
      'extension:unregistered',
      'extension:enabled',
      'extension:disabled',
      'extension:error',
      'extension:config-changed',
      'extension:health-changed',
    ]

    const unsubscribes = eventTypes.map((event) => registry.on(event, handler))

    return () => {
      unsubscribes.forEach((unsub) => unsub())
    }
  }, [registry, handler, events])
}

/**
 * Get extension health status
 */
export function useExtensionHealth(extensionId?: string): {
  health: Map<string, ExtensionHealthStatus> | ExtensionHealthStatus | undefined
  isChecking: boolean
  checkHealth: () => Promise<void>
} {
  const { registry } = useExtensions()
  const [health, setHealth] = React.useState<
    Map<string, ExtensionHealthStatus>
  >(new Map())
  const [isChecking, setIsChecking] = React.useState(false)
  const mountedRef = React.useRef(true)

  const checkHealth = React.useCallback(async () => {
    setIsChecking(true)
    try {
      const results = await registry.healthCheck()
      if (mountedRef.current) {
        setHealth(results)
      }
    } finally {
      if (mountedRef.current) {
        setIsChecking(false)
      }
    }
  }, [registry])

  // Track mounted state and run initial health check
  React.useEffect(() => {
    mountedRef.current = true
    checkHealth()
    return () => {
      mountedRef.current = false
    }
  }, [checkHealth])

  if (extensionId) {
    return {
      health: health.get(extensionId),
      isChecking,
      checkHealth,
    }
  }

  return { health, isChecking, checkHealth }
}

/**
 * Register extension on component mount
 */
export function useRegisterExtension<TConfig = Record<string, unknown>>(
  extension: Extension<TConfig>,
  config?: TConfig,
  options?: { enabled?: boolean }
): {
  registration: ExtensionRegistration<TConfig> | undefined
  isRegistering: boolean
  error: Error | null
} {
  const { register, getExtension } = useExtensions()
  const [isRegistering, setIsRegistering] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [registration, setRegistration] = React.useState<
    ExtensionRegistration<TConfig> | undefined
  >()

  React.useEffect(() => {
    if (options?.enabled === false) return

    let mounted = true
    setIsRegistering(true)

    register(extension, config)
      .then(() => {
        if (mounted) {
          setRegistration(getExtension(extension.metadata.id))
          setIsRegistering(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsRegistering(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [extension.metadata.id, options?.enabled])

  return { registration, isRegistering, error }
}

// ============================================
// HOC
// ============================================

/**
 * Higher-order component to provide extension context
 */
export function withExtensions<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ExtensionProviderProps, 'children'>
): React.FC<P> {
  return function WithExtensions(props: P) {
    return (
      <ExtensionProvider {...options}>
        <Component {...props} />
      </ExtensionProvider>
    )
  }
}

/**
 * HOC to inject a specific extension into component props
 */
export function withExtension<
  P extends { extension?: ExtensionRegistration },
  TConfig = Record<string, unknown>,
>(
  Component: React.ComponentType<P>,
  extensionId: string
): React.FC<Omit<P, 'extension'>> {
  return function WithExtension(props: Omit<P, 'extension'>) {
    const { extension } = useExtension<TConfig>(extensionId)
    return <Component {...(props as P)} extension={extension} />
  }
}

// ============================================
// Utility Components
// ============================================

/**
 * Render children only when extension is active
 */
export function ExtensionGuard({
  extensionId,
  children,
  fallback = null,
}: {
  extensionId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}): React.ReactElement | null {
  const { isActive } = useExtension(extensionId)

  if (!isActive) {
    return fallback as React.ReactElement | null
  }

  return <>{children}</>
}

/**
 * Render different content based on extension state
 */
export function ExtensionStatus({
  extensionId,
  active,
  inactive,
  loading,
  error,
}: {
  extensionId: string
  active?: React.ReactNode
  inactive?: React.ReactNode
  loading?: React.ReactNode
  error?: React.ReactNode | ((err: Error) => React.ReactNode)
}): React.ReactElement | null {
  const { extension } = useExtension(extensionId)

  if (!extension) {
    return inactive as React.ReactElement | null
  }

  switch (extension.state) {
    case 'active':
      return active as React.ReactElement | null
    case 'initializing':
      return loading as React.ReactElement | null
    case 'error':
      if (typeof error === 'function' && extension.error) {
        return logger.error(extension.error) as React.ReactElement | null
      }
      return error as React.ReactElement | null
    default:
      return inactive as React.ReactElement | null
  }
}

/**
 * List all registered extensions
 */
export function ExtensionList({
  category,
  renderItem,
  emptyMessage = 'No extensions registered',
}: {
  category?: ExtensionCategory
  renderItem: (registration: ExtensionRegistration) => React.ReactNode
  emptyMessage?: React.ReactNode
}): React.ReactElement {
  const { extensions } = useExtensions()

  const filtered = category
    ? extensions.filter((e) => e.extension.metadata.category === category)
    : extensions

  if (filtered.length === 0) {
    return <>{emptyMessage}</>
  }

  return <>{filtered.map(renderItem)}</>
}
