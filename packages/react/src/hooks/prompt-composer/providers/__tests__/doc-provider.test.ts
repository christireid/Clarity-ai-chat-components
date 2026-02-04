/**
 * Documentation Provider Tests
 */

import { describe, it, expect } from 'vitest'
import { createDocProvider, createMockDocProvider } from '../doc-provider'
import type { DocEntry } from '../doc-provider'

describe('DocProvider', () => {
  describe('createDocProvider', () => {
    it('should search documentation with fuzzy matching', async () => {
      const mockDocs: DocEntry[] = [
        {
          id: 'auth-guide',
          title: 'Authentication Guide',
          category: 'guide',
          content: 'How to implement authentication',
        },
        {
          id: 'api-ref',
          title: 'API Reference',
          category: 'api',
          content: 'Complete API documentation',
        },
      ]

      const provider = createDocProvider({
        searchDocs: async () => mockDocs,
      })

      const results = await provider.search('auth')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Authentication Guide')
      expect(results[0].type).toBe('doc')
    })

    it('should calculate token costs for documentation', async () => {
      const provider = createDocProvider({
        searchDocs: async () => [
          {
            id: 'test-doc',
            title: 'Test Documentation',
            category: 'guide',
            content: 'This is test documentation content',
          },
        ],
      })

      const results = await provider.search('test')

      expect(results[0].tokens.summary).toBeGreaterThan(0)
      expect(results[0].tokens.preview).toBeGreaterThan(0)
      expect(results[0].tokens.full).toBeGreaterThan(0)
    })

    it('should prioritize certain categories', async () => {
      const mockDocs: DocEntry[] = [
        {
          id: 'tutorial',
          title: 'Tutorial',
          category: 'tutorial',
          content: 'Tutorial content',
        },
        {
          id: 'api',
          title: 'API',
          category: 'api',
          content: 'API content',
        },
      ]

      const provider = createDocProvider({
        searchDocs: async () => mockDocs,
        priorityCategories: ['api'],
      })

      const results = await provider.search('test')

      // API should come first due to priority
      expect(results[0].label).toBe('API')
    })

    it('should calculate relevance scores', async () => {
      const provider = createDocProvider({
        searchDocs: async () => [
          {
            id: 'exact-match',
            title: 'Authentication',
            category: 'guide',
            content: 'Auth content',
          },
        ],
      })

      const results = await provider.search('Authentication')

      // Exact title match should have high relevance
      expect(results[0].relevance).toBeGreaterThan(0.5)
    })

    it('should extract headings from markdown', async () => {
      const provider = createDocProvider({
        searchDocs: async () => [
          {
            id: 'with-headings',
            title: 'Guide',
            category: 'guide',
            content: '# Main Title\n## Section 1\n### Subsection',
          },
        ],
      })

      const results = await provider.search('guide')

      const headings = results[0].metadata?.headings as string[]
      expect(headings).toBeDefined()
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should handle search errors gracefully', async () => {
      const provider = createDocProvider({
        searchDocs: async () => {
          throw new Error('Search failed')
        },
      })

      const results = await provider.search('test')

      expect(results).toEqual([])
    })

    it('should include documentation metadata', async () => {
      const provider = createDocProvider({
        searchDocs: async () => [
          {
            id: 'test-doc',
            title: 'Test',
            category: 'api',
            url: '/docs/test',
            keywords: ['test', 'example'],
            content: 'Content',
          },
        ],
        baseUrl: 'https://docs.example.com',
      })

      const results = await provider.search('test')

      expect(results[0].metadata?.category).toBe('api')
      expect(results[0].metadata?.url).toBe('https://docs.example.com/docs/test')
      expect(results[0].metadata?.keywords).toEqual(['test', 'example'])
    })
  })

  describe('createMockDocProvider', () => {
    it('should create a working mock provider', async () => {
      const provider = createMockDocProvider()

      const results = await provider.search('auth')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].type).toBe('doc')
    })

    it('should have proper provider configuration', () => {
      const provider = createMockDocProvider()

      expect(provider.type).toBe('doc')
      expect(provider.priority).toBe(60)
      expect(provider.enabled).toBe(true)
    })
  })

  describe('Documentation icon detection', () => {
    it('should assign correct icons to different categories', async () => {
      const mockDocs: DocEntry[] = [
        { id: '1', title: 'API', category: 'api', content: '' },
        { id: '2', title: 'Guide', category: 'guide', content: '' },
        { id: '3', title: 'Tutorial', category: 'tutorial', content: '' },
      ]

      const provider = createDocProvider({
        searchDocs: async () => mockDocs,
      })

      const results = await provider.search('test')

      results.forEach((result) => {
        expect(result.icon).toBeDefined()
      })
    })
  })

  describe('Progressive expansion', () => {
    it('should provide summary, preview, and full content', async () => {
      const provider = createDocProvider({
        searchDocs: async () => [
          {
            id: 'test',
            title: 'Test Documentation',
            category: 'guide',
            excerpt: 'Short description',
            content: '# Full Documentation\n\nLong content here...',
          },
        ],
      })

      const results = await provider.search('test')

      expect(results[0].summary).toBeDefined()
      expect(results[0].preview).toBeDefined()
      expect(results[0].full).toBeDefined()

      // Summary should be shortest
      expect(results[0].summary.length).toBeLessThan(results[0].preview!.length)
    })
  })
})
