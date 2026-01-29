/**
 * Web Provider Tests
 */

import { describe, it, expect } from 'vitest'
import { createWebProvider, createMockWebProvider } from '../web-provider'
import type { WebResult } from '../web-provider'

describe('WebProvider', () => {
  describe('createWebProvider', () => {
    it('should search web with fuzzy matching', async () => {
      const mockResults: WebResult[] = [
        {
          url: 'https://example.com/react',
          title: 'React Documentation',
          snippet: 'Learn React',
        },
        {
          url: 'https://example.com/vue',
          title: 'Vue Documentation',
          snippet: 'Learn Vue',
        },
      ]

      const provider = createWebProvider({
        searchWeb: async () => mockResults,
      })

      const results = await provider.search('react')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('React Documentation')
      expect(results[0].type).toBe('web')
    })

    it('should handle direct URLs', async () => {
      const provider = createWebProvider({
        fetchUrl: async (url) => '<html><body>Content</body></html>',
        allowDirectUrls: true,
      })

      const results = await provider.search('https://example.com')

      expect(results).toHaveLength(1)
      expect(results[0].metadata?.url).toBe('https://example.com')
    })

    it('should calculate token costs for web results', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
            snippet: 'Short snippet',
            content: 'Full page content here',
          },
        ],
      })

      const results = await provider.search('example')

      expect(results[0].tokens.summary).toBeGreaterThan(0)
      expect(results[0].tokens.preview).toBeGreaterThan(0)
      expect(results[0].tokens.full).toBeGreaterThan(0)
    })

    it('should prioritize certain domains', async () => {
      const mockResults: WebResult[] = [
        {
          url: 'https://example.com',
          title: 'Example',
          domain: 'example.com',
        },
        {
          url: 'https://github.com/test',
          title: 'GitHub',
          domain: 'github.com',
        },
      ]

      const provider = createWebProvider({
        searchWeb: async () => mockResults,
        priorityDomains: ['github.com'],
      })

      const results = await provider.search('test')

      // GitHub should come first due to priority
      expect(results[0].label).toBe('GitHub')
    })

    it('should detect result types from URLs', async () => {
      const mockResults: WebResult[] = [
        { url: 'https://github.com/test', title: 'GitHub' },
        { url: 'https://stackoverflow.com/q/123', title: 'Stack Overflow' },
        { url: 'https://blog.example.com/post', title: 'Blog Post' },
      ]

      const provider = createWebProvider({
        searchWeb: async () => mockResults,
      })

      const results = await provider.search('test')

      expect(results[0].type).toBe('documentation') // github.com
      expect(results[1].type).toBe('forum') // stackoverflow.com
      expect(results[2].type).toBe('blog') // blog subdomain
    })

    it('should calculate relevance scores', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'React Guide',
            snippet: 'Learn React in 2024',
          },
        ],
      })

      const results = await provider.search('react')

      // Title + snippet match should have good relevance
      expect(results[0].relevance).toBeGreaterThan(0.4)
    })

    it('should handle search errors gracefully', async () => {
      const provider = createWebProvider({
        searchWeb: async () => {
          throw new Error('Search failed')
        },
      })

      const results = await provider.search('test')

      expect(results).toEqual([])
    })

    it('should convert HTML to text', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
            content: '<p>Hello <strong>world</strong></p>',
          },
        ],
      })

      const results = await provider.search('example')

      // HTML tags should be stripped
      expect(results[0].full).not.toContain('<p>')
      expect(results[0].full).not.toContain('</p>')
    })

    it('should truncate long content', async () => {
      const longContent = 'A'.repeat(20000)

      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
            content: longContent,
          },
        ],
        maxContentLength: 10000,
      })

      const results = await provider.search('example')

      expect(results[0].full!.length).toBeLessThanOrEqual(10100) // Allow some margin
    })

    it('should include web result metadata', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
            author: 'John Doe',
            publishedDate: Date.now(),
            type: 'article',
          },
        ],
      })

      const results = await provider.search('example')

      expect(results[0].metadata?.url).toBe('https://example.com')
      expect(results[0].metadata?.author).toBe('John Doe')
      expect(results[0].metadata?.type).toBe('article')
      expect(results[0].metadata?.domain).toBe('example.com')
    })

    it('should fetch content when not provided', async () => {
      let fetchCalled = false

      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
            // No content provided
          },
        ],
        fetchUrl: async (url) => {
          fetchCalled = true
          return '<html><body>Fetched content</body></html>'
        },
      })

      const results = await provider.search('example')

      expect(fetchCalled).toBe(true)
      expect(results[0].full).toContain('Fetched content')
    })
  })

  describe('createMockWebProvider', () => {
    it('should create a working mock provider', async () => {
      const provider = createMockWebProvider()

      const results = await provider.search('react')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].type).toBe('web')
    })

    it('should have proper provider configuration', () => {
      const provider = createMockWebProvider()

      expect(provider.type).toBe('web')
      expect(provider.priority).toBe(20)
      expect(provider.enabled).toBe(true)
    })
  })

  describe('URL validation', () => {
    it('should handle valid URLs when allowDirectUrls is true', async () => {
      const provider = createWebProvider({
        fetchUrl: async () => 'content',
        allowDirectUrls: true,
      })

      const results = await provider.search('https://example.com')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].metadata?.url).toBe('https://example.com')
    })

    it('should require searchWeb when allowDirectUrls is false', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example',
          },
        ],
        allowDirectUrls: false,
      })

      // Should use searchWeb instead of treating as direct URL
      const results = await provider.search('example')
      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('Progressive expansion', () => {
    it('should provide summary, preview, and full content', async () => {
      const provider = createWebProvider({
        searchWeb: async () => [
          {
            url: 'https://example.com',
            title: 'Example Article',
            snippet: 'Short description',
            content: 'Full article content with lots of text...',
          },
        ],
      })

      const results = await provider.search('example')

      expect(results[0].summary).toBeDefined()
      expect(results[0].preview).toBeDefined()
      expect(results[0].full).toBeDefined()

      // Summary should be shortest
      expect(results[0].summary.length).toBeLessThan(results[0].preview!.length)
    })
  })
})
