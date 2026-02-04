/**
 * Context Provider Tests
 *
 * Tests for @file, @doc, @user, and @web context providers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createContextItem, filterContextItems } from '../context-utils'
import type { ContextProvider, ContextItem } from '../types'

describe('Context Providers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // File Provider Tests
  // ==========================================================================

  describe('FileProvider', () => {
    const mockFileProvider: ContextProvider = {
      type: 'file',
      search: vi.fn(async (query: string) => {
        const files = [
          {
            id: 'src/components/Button.tsx',
            type: 'file' as const,
            label: 'Button.tsx',
            description: 'src/components/Button.tsx',
            summary: 'Button component - 250 lines, exports Button, ButtonProps',
            preview: 'export function Button(props: ButtonProps) {...}',
            full: '// Full file contents...',
          },
          {
            id: 'src/components/Input.tsx',
            type: 'file' as const,
            label: 'Input.tsx',
            description: 'src/components/Input.tsx',
            summary: 'Input component - 180 lines',
          },
          {
            id: 'src/utils/helpers.ts',
            type: 'file' as const,
            label: 'helpers.ts',
            description: 'src/utils/helpers.ts',
            summary: 'Utility helper functions',
          },
        ]

        return files
          .filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
          .map((f) => createContextItem(f))
      }),
      priority: 80,
      enabled: true,
      maxResults: 10,
    }

    it('searches for files by name', async () => {
      const results = await mockFileProvider.search('Button')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Button.tsx')
      expect(results[0].type).toBe('file')
    })

    it('returns all files for empty query', async () => {
      const results = await mockFileProvider.search('')

      expect(results).toHaveLength(3)
    })

    it('is case insensitive', async () => {
      const results = await mockFileProvider.search('button')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Button.tsx')
    })

    it('includes file path in description', async () => {
      const results = await mockFileProvider.search('Button')

      expect(results[0].description).toContain('src/components')
    })

    it('calculates token counts', async () => {
      const results = await mockFileProvider.search('Button')

      expect(results[0].tokens.summary).toBeGreaterThan(0)
      expect(results[0].tokens.preview).toBeGreaterThan(0)
      expect(results[0].tokens.full).toBeGreaterThan(0)
    })

    it('respects maxResults limit', async () => {
      const limitedProvider: ContextProvider = {
        ...mockFileProvider,
        maxResults: 2,
      }

      const allResults = await mockFileProvider.search('')
      expect(allResults.length).toBeGreaterThan(2)

      // Apply limit manually (would be done by system)
      const limitedResults = allResults.slice(0, limitedProvider.maxResults)
      expect(limitedResults).toHaveLength(2)
    })

    it('has correct priority', () => {
      expect(mockFileProvider.priority).toBe(80)
    })
  })

  // ==========================================================================
  // Doc Provider Tests
  // ==========================================================================

  describe('DocProvider', () => {
    const mockDocProvider: ContextProvider = {
      type: 'doc',
      search: vi.fn(async (query: string) => {
        const docs = [
          {
            id: 'api-reference',
            type: 'doc' as const,
            label: 'API Reference',
            description: 'Complete API documentation',
            summary: 'API Reference - Authentication, endpoints, schemas',
            preview: '## Authentication\nUse JWT tokens...',
          },
          {
            id: 'getting-started',
            type: 'doc' as const,
            label: 'Getting Started',
            description: 'Quick start guide',
            summary: 'Getting Started - Installation and setup',
          },
          {
            id: 'best-practices',
            type: 'doc' as const,
            label: 'Best Practices',
            description: 'Development best practices',
            summary: 'Best Practices - Code quality guidelines',
          },
        ]

        return docs
          .filter(
            (d) =>
              d.label.toLowerCase().includes(query.toLowerCase()) ||
              (d.description &&
                d.description.toLowerCase().includes(query.toLowerCase()))
          )
          .map((d) => createContextItem(d))
      }),
      priority: 60,
      enabled: true,
      maxResults: 10,
    }

    it('searches documentation by title', async () => {
      const results = await mockDocProvider.search('API')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('API Reference')
    })

    it('searches by description', async () => {
      const results = await mockDocProvider.search('Quick start')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Getting Started')
    })

    it('returns structured documentation', async () => {
      const results = await mockDocProvider.search('API')

      expect(results[0].summary).toContain('Authentication')
      expect(results[0].preview).toContain('## Authentication')
    })

    it('has lower priority than files', () => {
      expect(mockDocProvider.priority).toBeLessThan(80) // File priority
    })
  })

  // ==========================================================================
  // User Provider Tests
  // ==========================================================================

  describe('UserProvider', () => {
    const mockUserProvider: ContextProvider = {
      type: 'user',
      search: vi.fn(async (query: string) => {
        const users = [
          {
            id: 'user-sarah',
            type: 'user' as const,
            label: 'sarah',
            description: 'Sarah Chen - Senior Engineer',
            summary: '@sarah - Senior Engineer, expert in React',
            preview: 'Recent activity: Fixed authentication bug, merged 5 PRs',
          },
          {
            id: 'user-john',
            type: 'user' as const,
            label: 'john',
            description: 'John Doe - Backend Lead',
            summary: '@john - Backend Lead, Node.js specialist',
          },
          {
            id: 'user-alice',
            type: 'user' as const,
            label: 'alice',
            description: 'Alice Wong - Designer',
            summary: '@alice - Designer, UI/UX expert',
          },
        ]

        return users
          .filter(
            (u) =>
              u.label.toLowerCase().includes(query.toLowerCase()) ||
              (u.description &&
                u.description.toLowerCase().includes(query.toLowerCase()))
          )
          .map((u) => createContextItem(u))
      }),
      priority: 40,
      enabled: true,
      maxResults: 5,
    }

    it('searches users by username', async () => {
      const results = await mockUserProvider.search('sarah')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('sarah')
    })

    it('searches by role/title', async () => {
      const results = await mockUserProvider.search('Engineer')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('sarah')
    })

    it('includes user expertise in summary', async () => {
      const results = await mockUserProvider.search('sarah')

      expect(results[0].summary).toContain('React')
    })

    it('includes recent activity in preview', async () => {
      const results = await mockUserProvider.search('sarah')

      expect(results[0].preview).toContain('Recent activity')
    })

    it('has lower priority than docs', () => {
      expect(mockUserProvider.priority).toBeLessThan(60) // Doc priority
    })
  })

  // ==========================================================================
  // Web Provider Tests
  // ==========================================================================

  describe('WebProvider', () => {
    const mockWebProvider: ContextProvider = {
      type: 'web',
      search: vi.fn(async (query: string) => {
        // Validate URL
        if (!query.startsWith('http://') && !query.startsWith('https://')) {
          return []
        }

        return [
          createContextItem({
            id: `web-${query}`,
            type: 'web',
            label: new URL(query).hostname,
            description: query,
            summary: `Web content from ${new URL(query).hostname}`,
            preview: 'Fetching content...',
          }),
        ]
      }),
      priority: 20,
      enabled: true,
      maxResults: 3,
    }

    it('validates URL format', async () => {
      const results = await mockWebProvider.search('not a url')

      expect(results).toHaveLength(0)
    })

    it('accepts valid HTTP URLs', async () => {
      const results = await mockWebProvider.search('http://example.com')

      expect(results).toHaveLength(1)
      expect(results[0].type).toBe('web')
    })

    it('accepts valid HTTPS URLs', async () => {
      const results = await mockWebProvider.search('https://example.com')

      expect(results).toHaveLength(1)
    })

    it('extracts hostname from URL', async () => {
      const results = await mockWebProvider.search('https://docs.example.com/api')

      expect(results[0].label).toBe('docs.example.com')
    })

    it('has lowest priority', () => {
      expect(mockWebProvider.priority).toBe(20) // Lowest priority
    })
  })

  // ==========================================================================
  // Multi-Provider Tests
  // ==========================================================================

  describe('Multi-Provider', () => {
    const mockFileProvider: ContextProvider = {
      type: 'file',
      search: vi.fn(async () => [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'test.ts',
          summary: 'Test file',
        }),
      ]),
      priority: 80,
    }

    const mockDocProvider: ContextProvider = {
      type: 'doc',
      search: vi.fn(async () => [
        createContextItem({
          id: 'doc1',
          type: 'doc',
          label: 'API',
          summary: 'API docs',
        }),
      ]),
      priority: 60,
    }

    it('searches all providers in parallel', async () => {
      const results = await Promise.all([
        mockFileProvider.search('test'),
        mockDocProvider.search('test'),
      ])

      expect(results).toHaveLength(2)
      expect(mockFileProvider.search).toHaveBeenCalled()
      expect(mockDocProvider.search).toHaveBeenCalled()
    })

    it('combines results from multiple providers', async () => {
      const fileResults = await mockFileProvider.search('test')
      const docResults = await mockDocProvider.search('test')

      const combined = [...fileResults, ...docResults]

      expect(combined).toHaveLength(2)
      expect(combined[0].type).toBe('file')
      expect(combined[1].type).toBe('doc')
    })

    it('sorts by priority', () => {
      const providers = [mockDocProvider, mockFileProvider]

      const sorted = providers.sort((a, b) => (b.priority || 0) - (a.priority || 0))

      expect(sorted[0].type).toBe('file') // Higher priority
      expect(sorted[1].type).toBe('doc')
    })

    it('filters disabled providers', () => {
      const disabledProvider: ContextProvider = {
        type: 'user',
        search: vi.fn(),
        priority: 40,
        enabled: false,
      }

      const providers = [mockFileProvider, mockDocProvider, disabledProvider]

      const enabled = providers.filter((p) => p.enabled !== false)

      expect(enabled).toHaveLength(2)
      expect(enabled.some((p) => p.type === 'user')).toBe(false)
    })
  })

  // ==========================================================================
  // Provider Timeout Tests
  // ==========================================================================

  describe('Provider Timeouts', () => {
    it('handles slow providers with timeout', async () => {
      const slowProvider: ContextProvider = {
        type: 'file',
        search: vi.fn(
          () => new Promise((resolve) => setTimeout(() => resolve([]), 5000))
        ),
        priority: 80,
      }

      const timeout = 1000 // 1 second timeout
      const timeoutPromise = new Promise<ContextItem[]>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )

      await expect(
        Promise.race([slowProvider.search('test'), timeoutPromise])
      ).rejects.toThrow('Timeout')
    })

    it('returns fast provider results immediately', async () => {
      const fastProvider: ContextProvider = {
        type: 'file',
        search: vi.fn(async () => [
          createContextItem({
            id: 'file1',
            type: 'file',
            label: 'test.ts',
            summary: 'Test',
          }),
        ]),
        priority: 80,
      }

      const start = Date.now()
      await fastProvider.search('test')
      const duration = Date.now() - start

      expect(duration).toBeLessThan(100) // Should be fast
    })
  })

  // ==========================================================================
  // Fuzzy Search Tests
  // ==========================================================================

  describe('Fuzzy Search', () => {
    const items = [
      createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        description: 'Button component',
        summary: 'Button',
      }),
      createContextItem({
        id: 'file2',
        type: 'file',
        label: 'Input.tsx',
        description: 'Input component',
        summary: 'Input',
      }),
      createContextItem({
        id: 'file3',
        type: 'file',
        label: 'Modal.tsx',
        description: 'Modal component',
        summary: 'Modal',
      }),
    ]

    it('filters with fuzzy matching enabled', () => {
      const filtered = filterContextItems(items, 'btn', true)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].label).toBe('Button.tsx')
    })

    it('filters without fuzzy matching', () => {
      const filtered = filterContextItems(items, 'btn', false)

      expect(filtered).toHaveLength(0) // Exact match only
    })

    it('handles partial matches', () => {
      const filtered = filterContextItems(items, 'Butt', true)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].label).toBe('Button.tsx')
    })
  })

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('handles provider search errors', async () => {
      const errorProvider: ContextProvider = {
        type: 'file',
        search: vi.fn().mockRejectedValue(new Error('Search failed')),
        priority: 80,
      }

      await expect(errorProvider.search('test')).rejects.toThrow('Search failed')
    })

    it('continues with other providers on error', async () => {
      const errorProvider: ContextProvider = {
        type: 'file',
        search: vi.fn().mockRejectedValue(new Error('Failed')),
        priority: 80,
      }

      const successProvider: ContextProvider = {
        type: 'doc',
        search: vi.fn(async () => [
          createContextItem({
            id: 'doc1',
            type: 'doc',
            label: 'API',
            summary: 'API',
          }),
        ]),
        priority: 60,
      }

      const results = await Promise.allSettled([
        errorProvider.search('test'),
        successProvider.search('test'),
      ])

      expect(results[0].status).toBe('rejected')
      expect(results[1].status).toBe('fulfilled')
    })
  })

  // ==========================================================================
  // Custom Icon Tests
  // ==========================================================================

  describe('Custom Icons', () => {
    it('preserves custom provider icons', () => {
      const iconProvider: ContextProvider = {
        type: 'file',
        search: vi.fn(),
        icon: '📄',
        priority: 80,
      }

      expect(iconProvider.icon).toBeDefined()
    })
  })
})
