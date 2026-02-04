'use client'

/**
 * ComponentRegistry
 *
 * A registry system for AI-driven generative components.
 * Components are registered with schemas that define their props,
 * enabling AI to understand and render them appropriately.
 *
 * Based on generative UI patterns where AI decides which components
 * to render based on natural language conversations.
 *
 * Features:
 * - Zod schema integration for prop validation
 * - Component metadata (name, description, category)
 * - Runtime component lookup and validation
 * - Type-safe component rendering
 * - Support for both generative and interactable components
 *
 * @example
 * ```tsx
 * import { z } from 'zod'
 *
 * const registry = createComponentRegistry([
 *   {
 *     name: 'Chart',
 *     description: 'Displays data as charts',
 *     component: Chart,
 *     propsSchema: z.object({
 *       data: z.array(z.object({ name: z.string(), value: z.number() })),
 *       type: z.enum(['line', 'bar', 'pie']),
 *     }),
 *   },
 * ])
 *
 * // In provider
 * <ComponentRegistryProvider registry={registry}>
 *   <App />
 * </ComponentRegistryProvider>
 * ```
 */

import * as React from 'react'
import { z } from 'zod'

// ============================================================================
// Types
// ============================================================================

/** Component type for generative UI */
export type GenerativeComponentType = 'generative' | 'interactable'

/** Base schema type using Zod */
export type PropsSchema<T = unknown> = z.ZodType<T>

/** Registered component definition */
export interface RegisteredComponent<P = Record<string, unknown>> {
  /** Unique component name */
  name: string
  /** Human-readable description for AI understanding */
  description: string
  /** The React component */
  component: React.ComponentType<P>
  /** Zod schema for props validation */
  propsSchema: PropsSchema<P>
  /** Component type */
  type?: GenerativeComponentType
  /** Optional category for grouping */
  category?: string
  /** Optional tags for search/filtering */
  tags?: string[]
  /** Optional examples for AI context */
  examples?: Array<{
    description: string
    props: P
  }>
  /** Whether component requires authentication */
  requiresAuth?: boolean
  /** Minimum required permissions */
  permissions?: string[]
}

/** Registry configuration */
export interface ComponentRegistryConfig {
  /** Whether to validate props at runtime */
  validateProps?: boolean
  /** Whether to log validation errors */
  logErrors?: boolean
  /** Custom error handler */
  onError?: (error: Error, componentName: string) => void
}

/** Component registry instance */
export interface ComponentRegistry {
  /** Get all registered components */
  getComponents: () => RegisteredComponent[]
  /** Get a component by name */
  getComponent: (name: string) => RegisteredComponent | undefined
  /** Check if a component exists */
  hasComponent: (name: string) => boolean
  /** Validate props against schema */
  validateProps: <P>(name: string, props: P) => { success: boolean; error?: z.ZodError }
  /** Render a component by name with props */
  renderComponent: <P>(name: string, props: P, key?: string | number) => React.ReactNode
  /** Get components by type */
  getComponentsByType: (type: GenerativeComponentType) => RegisteredComponent[]
  /** Get components by category */
  getComponentsByCategory: (category: string) => RegisteredComponent[]
  /** Search components by query */
  searchComponents: (query: string) => RegisteredComponent[]
  /** Get schema for a component */
  getSchema: (name: string) => PropsSchema | undefined
  /** Export registry as JSON schema (for AI context) */
  toJsonSchema: () => Record<string, unknown>
}

/** Context value for registry provider */
export interface ComponentRegistryContextValue {
  registry: ComponentRegistry
}

// ============================================================================
// Registry Implementation
// ============================================================================

/**
 * Create a component registry instance
 */
export function createComponentRegistry(
  components: RegisteredComponent[],
  config: ComponentRegistryConfig = {}
): ComponentRegistry {
  const { validateProps: shouldValidate = true, logErrors = true, onError } = config

  // Index components by name for fast lookup
  const componentMap = new Map<string, RegisteredComponent>()
  components.forEach((comp) => {
    if (componentMap.has(comp.name)) {
      console.warn(`ComponentRegistry: Duplicate component name "${comp.name}"`)
    }
    componentMap.set(comp.name, comp)
  })

  const handleError = (error: Error, componentName: string) => {
    if (logErrors) {
      console.error(`ComponentRegistry error for "${componentName}":`, error)
    }
    onError?.(error, componentName)
  }

  return {
    getComponents: () => [...componentMap.values()],

    getComponent: (name: string) => componentMap.get(name),

    hasComponent: (name: string) => componentMap.has(name),

    validateProps: <P = unknown>(name: string, props: P) => {
      const component = componentMap.get(name)
      if (!component) {
        return { success: false, error: undefined }
      }

      const result = component.propsSchema.safeParse(props)
      return {
        success: result.success,
        error: result.success ? undefined : result.error,
      }
    },

    renderComponent: <P = unknown>(name: string, props: P, key?: string | number) => {
      const registered = componentMap.get(name)
      if (!registered) {
        handleError(new Error(`Component "${name}" not found`), name)
        return null
      }

      // Validate props if enabled
      if (shouldValidate) {
        const result = registered.propsSchema.safeParse(props)
        if (!result.success) {
          handleError(result.error, name)
          return null
        }
      }

      const Component = registered.component as React.ComponentType<P>
      return <Component key={key} {...props} />
    },

    getComponentsByType: (type: GenerativeComponentType) =>
      [...componentMap.values()].filter(
        (comp) => (comp.type || 'generative') === type
      ),

    getComponentsByCategory: (category: string) =>
      [...componentMap.values()].filter((comp) => comp.category === category),

    searchComponents: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return [...componentMap.values()].filter(
        (comp) =>
          comp.name.toLowerCase().includes(lowerQuery) ||
          comp.description.toLowerCase().includes(lowerQuery) ||
          comp.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    },

    getSchema: (name: string) => componentMap.get(name)?.propsSchema,

    toJsonSchema: () => {
      const schema: Record<string, unknown> = {
        type: 'object',
        properties: {},
        components: [],
      }

      const componentsList: unknown[] = []
      componentMap.forEach((comp) => {
        componentsList.push({
          name: comp.name,
          description: comp.description,
          type: comp.type || 'generative',
          category: comp.category,
          tags: comp.tags,
          examples: comp.examples,
          // Note: Zod schemas can be converted to JSON schema using zod-to-json-schema
          // This is a simplified representation
          propsDescription: comp.propsSchema.description || 'See schema for details',
        })
      })

      schema.components = componentsList
      return schema
    },
  }
}

// ============================================================================
// Context and Provider
// ============================================================================

const ComponentRegistryContext = React.createContext<ComponentRegistryContextValue | null>(null)

export interface ComponentRegistryProviderProps {
  /** The component registry instance */
  registry: ComponentRegistry
  /** Children */
  children: React.ReactNode
}

/**
 * Provider for component registry context
 */
export function ComponentRegistryProvider({
  registry,
  children,
}: ComponentRegistryProviderProps) {
  const value = React.useMemo(() => ({ registry }), [registry])

  return (
    <ComponentRegistryContext.Provider value={value}>
      {children}
    </ComponentRegistryContext.Provider>
  )
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to access the component registry
 */
export function useComponentRegistry(): ComponentRegistry {
  const context = React.useContext(ComponentRegistryContext)
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider')
  }
  return context.registry
}

/**
 * Hook to render a component from the registry
 */
export function useRegisteredComponent<P = Record<string, unknown>>(
  name: string
): {
  component: RegisteredComponent<P> | undefined
  render: (props: P, key?: string | number) => React.ReactNode
  validate: (props: P) => { success: boolean; error?: z.ZodError }
} {
  const registry = useComponentRegistry()

  const component = React.useMemo(
    () => registry.getComponent(name) as RegisteredComponent<P> | undefined,
    [registry, name]
  )

  const render = React.useCallback(
    (props: P, key?: string | number) => registry.renderComponent(name, props, key),
    [registry, name]
  )

  const validate = React.useCallback(
    (props: P) => registry.validateProps(name, props),
    [registry, name]
  )

  return { component, render, validate }
}

// ============================================================================
// Component Renderer
// ============================================================================

export interface GenerativeComponentProps {
  /** Component name from registry */
  name: string
  /** Props to pass to the component */
  props: Record<string, unknown>
  /** Fallback content if component not found */
  fallback?: React.ReactNode
  /** Error boundary fallback */
  errorFallback?: React.ReactNode
}

/**
 * Render a component from the registry by name
 */
export function GenerativeComponent({
  name,
  props,
  fallback = null,
  errorFallback,
}: GenerativeComponentProps) {
  const registry = useComponentRegistry()
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    setError(null)
  }, [name, props])

  if (error) {
    return <>{errorFallback || <div className="generative-component-error">{error.message}</div>}</>
  }

  if (!registry.hasComponent(name)) {
    return <>{fallback}</>
  }

  try {
    return <>{registry.renderComponent(name, props)}</>
  } catch (err) {
    setError(err instanceof Error ? err : new Error(String(err)))
    return <>{errorFallback || fallback}</>
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Helper to create a registered component definition with type inference
 */
export function defineComponent<P extends Record<string, unknown>>(
  config: RegisteredComponent<P>
): RegisteredComponent<P> {
  return config
}

/**
 * Extract props type from a registered component
 */
export type InferComponentProps<T> = T extends RegisteredComponent<infer P> ? P : never

/**
 * Create multiple component definitions
 */
export function defineComponents<T extends RegisteredComponent[]>(
  components: T
): T {
  return components
}

export default ComponentRegistryProvider
