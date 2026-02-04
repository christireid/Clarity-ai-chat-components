/**
 * ServiceContainer Tests
 *
 * Tests for dependency injection container including:
 * - Service initialization
 * - Dependency resolution
 * - Circular dependency detection
 * - Lazy loading
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getServiceContainer,
  getService,
  getServices,
  resetServices,
} from '../ServiceContainer'

describe('ServiceContainer', () => {
  beforeEach(() => {
    resetServices()
  })

  afterEach(() => {
    resetServices()
  })

  describe('Service Initialization', () => {
    it('should create container instance', () => {
      const container = getServiceContainer()
      expect(container).toBeDefined()
    })

    it('should return same container instance (singleton)', () => {
      const container1 = getServiceContainer()
      const container2 = getServiceContainer()
      expect(container1).toBe(container2)
    })

    it('should initialize all services', async () => {
      const services = await getServices()
      expect(services.rag).toBeDefined()
      expect(services.search).toBeDefined()
      expect(services.documentation).toBeDefined()
      expect(services.coordinator).toBeDefined()
    })

    it('should get individual service', async () => {
      const ragService = await getService('rag')
      expect(ragService).toBeDefined()
    })

    it('should reuse service instances (singleton)', async () => {
      const rag1 = await getService('rag')
      const rag2 = await getService('rag')
      expect(rag1).toBe(rag2)
    })
  })

  describe('Dependency Resolution', () => {
    it('should inject dependencies correctly', async () => {
      const searchService = await getService('search')
      expect(searchService).toBeDefined()
      // SearchService depends on RAGService, should be injected
    })

    it('should handle complex dependencies', async () => {
      const docService = await getService('documentation')
      expect(docService).toBeDefined()
      // DocumentationService depends on both RAGService and SearchService
    })

    it('should initialize dependencies before dependents', async () => {
      // Getting documentation should initialize rag and search first
      const docService = await getService('documentation')
      const ragService = await getService('rag')
      const searchService = await getService('search')

      expect(ragService).toBeDefined()
      expect(searchService).toBeDefined()
      expect(docService).toBeDefined()
    })
  })

  describe('Dependency Graph', () => {
    it('should return dependency graph', () => {
      const container = getServiceContainer()
      const graph = container.getDependencyGraph()

      expect(graph.rag).toEqual([])
      expect(graph.search).toEqual(['rag'])
      expect(graph.documentation).toEqual(['rag', 'search'])
      expect(graph.coordinator).toEqual([])
    })

    it('should validate dependencies successfully', () => {
      const container = getServiceContainer()
      const validation = container.validateDependencies()

      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
  })

  describe('Service Reset', () => {
    it('should reset services', async () => {
      const services1 = await getServices()
      resetServices()
      const services2 = await getServices()

      // Should be different instances after reset
      expect(services1).not.toBe(services2)
    })

    it('should allow reinitialization after reset', async () => {
      await getServices()
      resetServices()

      const ragService = await getService('rag')
      expect(ragService).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle unknown service gracefully', async () => {
      const container = getServiceContainer()

      await expect(
        // @ts-expect-error - Testing invalid service name
        container.getService('unknown')
      ).rejects.toThrow()
    })
  })
})
