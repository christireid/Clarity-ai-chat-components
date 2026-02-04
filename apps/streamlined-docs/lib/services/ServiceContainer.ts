/**
 * ServiceContainer - Dependency Injection Container
 *
 * Manages service instantiation and dependency injection for the application.
 * Provides a centralized registry of all services with proper dependency resolution.
 *
 * Key Features:
 * - Singleton service instances
 * - Lazy initialization
 * - Dependency graph resolution
 * - Service lifecycle management
 * - Type-safe service access
 *
 * @example
 * ```typescript
 * // Get services
 * const services = getServices()
 * const doc = await services.documentation.generateAPIDocumentation('useChat')
 *
 * // Get individual service
 * const ragService = getService('rag')
 * ```
 */

import { RAGService } from './RAGService'
import { SearchService } from './SearchService'
import { DocumentationService } from './DocumentationService'
import { AgentCoordinator } from './AgentCoordinator'
import { getLogger } from '../logger'

const logger = getLogger('ServiceContainer')

/**
 * Service registry - maps service names to instances
 */
interface ServiceRegistry {
  rag: RAGService
  search: SearchService
  documentation: DocumentationService
  coordinator: AgentCoordinator
}

/**
 * Service names for type-safe access
 */
export type ServiceName = keyof ServiceRegistry

/**
 * Service container class
 */
class ServiceContainer {
  private services: Partial<ServiceRegistry> = {}
  private initializing = new Set<ServiceName>()
  private initialized = false

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.warn('Services already initialized')
      return
    }

    logger.info('Initializing services...')

    try {
      // Initialize in dependency order
      await this.getService('rag')
      await this.getService('search')
      await this.getService('documentation')
      await this.getService('coordinator')

      this.initialized = true
      logger.info('All services initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize services:', error)
      throw error
    }
  }

  /**
   * Get a service by name (lazy initialization)
   */
  async getService<T extends ServiceName>(
    name: T
  ): Promise<ServiceRegistry[T]> {
    // Check if already instantiated
    if (this.services[name]) {
      return this.services[name] as ServiceRegistry[T]
    }

    // Prevent circular dependencies
    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`)
    }

    this.initializing.add(name)

    try {
      // Create service with dependencies
      const service = await this.createService(name)
      this.services[name] = service as ServiceRegistry[T]
      this.initializing.delete(name)

      logger.debug(`Service created: ${name}`)
      return service as ServiceRegistry[T]
    } catch (error) {
      this.initializing.delete(name)
      logger.error(`Failed to create service: ${name}`, error)
      throw error
    }
  }

  /**
   * Get all services
   */
  async getAll(): Promise<ServiceRegistry> {
    await this.initialize()
    return this.services as ServiceRegistry
  }

  /**
   * Create a service instance with dependencies
   */
  private async createService(name: ServiceName): Promise<unknown> {
    switch (name) {
      case 'rag':
        return new RAGService()

      case 'search': {
        const ragService = await this.getService('rag')
        return new SearchService(ragService)
      }

      case 'documentation': {
        const ragService = await this.getService('rag')
        const searchService = await this.getService('search')
        return new DocumentationService(ragService, searchService)
      }

      case 'coordinator':
        return new AgentCoordinator()

      default:
        throw new Error(`Unknown service: ${name}`)
    }
  }

  /**
   * Reset all services (for testing)
   */
  reset(): void {
    this.services = {}
    this.initializing.clear()
    this.initialized = false
    logger.info('Services reset')
  }

  /**
   * Get service dependency graph
   */
  getDependencyGraph(): Record<ServiceName, ServiceName[]> {
    return {
      rag: [],
      search: ['rag'],
      documentation: ['rag', 'search'],
      coordinator: [],
    }
  }

  /**
   * Validate dependency graph (detect cycles)
   */
  validateDependencies(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const graph = this.getDependencyGraph()

    // Check for circular dependencies
    const visited = new Set<ServiceName>()
    const recursionStack = new Set<ServiceName>()

    const hasCycle = (node: ServiceName): boolean => {
      visited.add(node)
      recursionStack.add(node)

      const dependencies = graph[node] || []
      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          if (hasCycle(dep)) return true
        } else if (recursionStack.has(dep)) {
          errors.push(`Circular dependency: ${node} -> ${dep}`)
          return true
        }
      }

      recursionStack.delete(node)
      return false
    }

    for (const service of Object.keys(graph) as ServiceName[]) {
      if (!visited.has(service)) {
        if (hasCycle(service)) {
          break
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

/**
 * Singleton container instance
 */
let containerInstance: ServiceContainer | null = null

/**
 * Get the service container instance
 */
export function getServiceContainer(): ServiceContainer {
  if (!containerInstance) {
    containerInstance = new ServiceContainer()
  }
  return containerInstance
}

/**
 * Get all services (convenience function)
 */
export async function getServices(): Promise<ServiceRegistry> {
  const container = getServiceContainer()
  return container.getAll()
}

/**
 * Get a specific service (convenience function)
 */
export async function getService<T extends ServiceName>(
  name: T
): Promise<ServiceRegistry[T]> {
  const container = getServiceContainer()
  return container.getService(name)
}

/**
 * Reset services (for testing)
 */
export function resetServices(): void {
  if (containerInstance) {
    containerInstance.reset()
  }
  containerInstance = null
}

/**
 * Service facade for easy imports
 *
 * @example
 * ```typescript
 * import { services } from '@/lib/services'
 * const doc = await services.documentation.generateAPIDocumentation('useChat')
 * ```
 */
export const services = {
  get rag() {
    return getService('rag')
  },
  get search() {
    return getService('search')
  },
  get documentation() {
    return getService('documentation')
  },
  get coordinator() {
    return getService('coordinator')
  },
}
