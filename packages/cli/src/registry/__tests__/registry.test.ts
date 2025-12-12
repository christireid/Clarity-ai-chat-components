/**
 * Tests for the Component Registry
 *
 * These tests verify:
 * - Component registry structure and content
 * - Generator registry configuration
 * - Helper functions (getComponent, searchComponents, etc.)
 * - Dependency resolution
 */

import { describe, it, expect } from 'vitest'
import {
  COMPONENT_REGISTRY,
  GENERATOR_REGISTRY,
  TEMPLATE_REGISTRY,
  getComponent,
  getGenerator,
  getTemplate,
  getComponentsByCategory,
  getCategories,
  searchComponents,
  getComponentSlugs,
  getGeneratorSlugs,
  resolveComponentDependencies,
} from '../index.js'

describe('Component Registry', () => {
  it('should contain all expected components', () => {
    const expectedComponents = [
      'chat-interface',
      'model-selector',
      'token-counter',
      'cost-estimator',
      'streaming-handler',
      'message-list',
      'chat-input',
      'typing-indicator',
      'code-block',
      'markdown-renderer',
      'error-boundary',
    ]

    expectedComponents.forEach((slug) => {
      expect(COMPONENT_REGISTRY[slug]).toBeDefined()
      expect(COMPONENT_REGISTRY[slug].slug).toBe(slug)
    })
  })

  it('should have required fields for each component', () => {
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
      expect(component.name).toBeDefined()
      expect(component.slug).toBeDefined()
      expect(component.description).toBeDefined()
      expect(component.icon).toBeDefined()
      expect(component.category).toBeDefined()
      expect(Array.isArray(component.files)).toBe(true)
      expect(Array.isArray(component.dependencies)).toBe(true)
      expect(Array.isArray(component.devDependencies)).toBe(true)
      expect(Array.isArray(component.peerDependencies)).toBe(true)
      expect(Array.isArray(component.registryDependencies)).toBe(true)
      expect(component.docs).toBeDefined()
      expect(Array.isArray(component.examples)).toBe(true)
    })
  })

  it('should have valid categories', () => {
    const validCategories = ['chat', 'ui', 'analytics', 'core']
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
      expect(validCategories).toContain(component.category)
    })
  })
})

describe('Generator Registry', () => {
  it('should contain all expected generators', () => {
    const expectedGenerators = [
      'component',
      'hook',
      'context',
      'adapter',
      'chat-component',
      'test',
      'api-route',
    ]

    expectedGenerators.forEach((slug) => {
      expect(GENERATOR_REGISTRY[slug]).toBeDefined()
      expect(GENERATOR_REGISTRY[slug].slug).toBe(slug)
    })
  })

  it('should have required fields for each generator', () => {
    Object.values(GENERATOR_REGISTRY).forEach((generator) => {
      expect(generator.name).toBeDefined()
      expect(generator.slug).toBeDefined()
      expect(generator.icon).toBeDefined()
      expect(generator.description).toBeDefined()
      expect(generator.defaultDir).toBeDefined()
      expect(Array.isArray(generator.prompts)).toBe(true)
      expect(Array.isArray(generator.templates)).toBe(true)
    })
  })
})

describe('Template Registry', () => {
  it('should contain all expected templates', () => {
    const expectedTemplates = ['basic', 'chat', 'rag', 'analytics']

    expectedTemplates.forEach((slug) => {
      expect(TEMPLATE_REGISTRY[slug]).toBeDefined()
      expect(TEMPLATE_REGISTRY[slug].slug).toBe(slug)
    })
  })

  it('should have valid component references', () => {
    Object.values(TEMPLATE_REGISTRY).forEach((template) => {
      template.components.forEach((componentSlug) => {
        expect(COMPONENT_REGISTRY[componentSlug]).toBeDefined()
      })
    })
  })
})

describe('Helper Functions', () => {
  describe('getComponent', () => {
    it('should return component by slug', () => {
      const component = getComponent('chat-interface')
      expect(component).toBeDefined()
      expect(component?.name).toBe('Chat Interface')
    })

    it('should return undefined for unknown slug', () => {
      expect(getComponent('unknown-component')).toBeUndefined()
    })
  })

  describe('getGenerator', () => {
    it('should return generator by slug', () => {
      const generator = getGenerator('component')
      expect(generator).toBeDefined()
      expect(generator?.name).toBe('React Component')
    })

    it('should return undefined for unknown slug', () => {
      expect(getGenerator('unknown-generator')).toBeUndefined()
    })
  })

  describe('getTemplate', () => {
    it('should return template by slug', () => {
      const template = getTemplate('basic')
      expect(template).toBeDefined()
      expect(template?.name).toBe('Basic')
    })

    it('should return undefined for unknown slug', () => {
      expect(getTemplate('unknown-template')).toBeUndefined()
    })
  })

  describe('getComponentsByCategory', () => {
    it('should return components in chat category', () => {
      const chatComponents = getComponentsByCategory('chat')
      expect(chatComponents.length).toBeGreaterThan(0)
      chatComponents.forEach((component) => {
        expect(component.category).toBe('chat')
      })
    })

    it('should return empty array for unknown category', () => {
      expect(getComponentsByCategory('unknown')).toHaveLength(0)
    })
  })

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      const categories = getCategories()
      expect(categories).toContain('chat')
      expect(categories).toContain('ui')
      expect(categories).toContain('analytics')
      expect(categories).toContain('core')
    })

    it('should return sorted categories', () => {
      const categories = getCategories()
      const sorted = [...categories].sort()
      expect(categories).toEqual(sorted)
    })
  })

  describe('searchComponents', () => {
    it('should find components by name', () => {
      const results = searchComponents('chat')
      expect(results.length).toBeGreaterThan(0)
      results.forEach((component) => {
        const matchesName = component.name.toLowerCase().includes('chat')
        const matchesDesc = component.description.toLowerCase().includes('chat')
        const matchesSlug = component.slug.toLowerCase().includes('chat')
        expect(matchesName || matchesDesc || matchesSlug).toBe(true)
      })
    })

    it('should be case-insensitive', () => {
      const lower = searchComponents('chat')
      const upper = searchComponents('CHAT')
      expect(lower).toEqual(upper)
    })

    it('should return empty array for no matches', () => {
      expect(searchComponents('xyz123nonexistent')).toHaveLength(0)
    })
  })

  describe('getComponentSlugs', () => {
    it('should return all component slugs', () => {
      const slugs = getComponentSlugs()
      expect(slugs).toContain('chat-interface')
      expect(slugs).toContain('model-selector')
      expect(slugs.length).toBe(Object.keys(COMPONENT_REGISTRY).length)
    })
  })

  describe('getGeneratorSlugs', () => {
    it('should return all generator slugs', () => {
      const slugs = getGeneratorSlugs()
      expect(slugs).toContain('component')
      expect(slugs).toContain('hook')
      expect(slugs).toContain('chat-component')
      expect(slugs).toContain('api-route')
      expect(slugs.length).toBe(Object.keys(GENERATOR_REGISTRY).length)
    })
  })

  describe('resolveComponentDependencies', () => {
    it('should include the component itself', () => {
      const deps = resolveComponentDependencies('chat-interface')
      expect(deps).toContain('chat-interface')
    })

    it('should resolve transitive dependencies', () => {
      // chat-interface depends on streaming-handler
      const deps = resolveComponentDependencies('chat-interface')
      expect(deps).toContain('streaming-handler')
    })

    it('should return empty array for unknown component', () => {
      expect(resolveComponentDependencies('unknown')).toHaveLength(0)
    })

    it('should not have duplicates', () => {
      const deps = resolveComponentDependencies('chat-interface')
      const unique = [...new Set(deps)]
      expect(deps.length).toBe(unique.length)
    })
  })
})

describe('Registry Consistency', () => {
  it('should have matching slugs as keys and values', () => {
    Object.entries(COMPONENT_REGISTRY).forEach(([key, value]) => {
      expect(key).toBe(value.slug)
    })

    Object.entries(GENERATOR_REGISTRY).forEach(([key, value]) => {
      expect(key).toBe(value.slug)
    })

    Object.entries(TEMPLATE_REGISTRY).forEach(([key, value]) => {
      expect(key).toBe(value.slug)
    })
  })

  it('should have valid registryDependencies', () => {
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
      component.registryDependencies.forEach((dep) => {
        expect(
          COMPONENT_REGISTRY[dep],
          `${component.slug} has invalid dependency: ${dep}`
        ).toBeDefined()
      })
    })
  })

  it('should have documentation URLs for all components', () => {
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
      expect(component.docs).toMatch(/^https:\/\//)
    })
  })

  it('should have at least one example for each component', () => {
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
      expect(component.examples.length).toBeGreaterThan(0)
      component.examples.forEach((example) => {
        expect(example.name).toBeDefined()
        expect(example.code).toBeDefined()
      })
    })
  })
})
