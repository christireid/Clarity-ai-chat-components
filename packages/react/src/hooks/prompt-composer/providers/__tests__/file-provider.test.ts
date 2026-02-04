/**
 * File Provider Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { createFileProvider, createMockFileProvider } from '../file-provider'
import type { FileSystemEntry } from '../file-provider'

describe('FileProvider', () => {
  describe('createFileProvider', () => {
    it('should search files with fuzzy matching', async () => {
      const mockFiles: FileSystemEntry[] = [
        {
          path: 'src/components/Button.tsx',
          name: 'Button.tsx',
          type: 'file',
          extension: '.tsx',
          language: 'typescript',
        },
        {
          path: 'src/hooks/useAuth.ts',
          name: 'useAuth.ts',
          type: 'file',
          extension: '.ts',
          language: 'typescript',
        },
      ]

      const provider = createFileProvider({
        searchFiles: async () => mockFiles,
        readFile: async () => 'file content',
      })

      const results = await provider.search('button')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Button.tsx')
      expect(results[0].type).toBe('file')
    })

    it('should calculate token costs for files', async () => {
      const provider = createFileProvider({
        searchFiles: async () => [
          {
            path: 'src/test.ts',
            name: 'test.ts',
            type: 'file',
            extension: '.ts',
            content: 'const test = 123',
          },
        ],
        readFile: async () => 'const test = 123',
      })

      const results = await provider.search('test')

      expect(results[0].tokens.summary).toBeGreaterThan(0)
      expect(results[0].tokens.preview).toBeGreaterThan(0)
      expect(results[0].tokens.full).toBeGreaterThan(0)
    })

    it('should prioritize certain file extensions', async () => {
      const mockFiles: FileSystemEntry[] = [
        {
          path: 'README.md',
          name: 'README.md',
          type: 'file',
          extension: '.md',
        },
        {
          path: 'src/App.tsx',
          name: 'App.tsx',
          type: 'file',
          extension: '.tsx',
        },
      ]

      const provider = createFileProvider({
        searchFiles: async () => mockFiles,
        readFile: async () => '',
        priorityExtensions: ['.tsx', '.ts'],
      })

      const results = await provider.search('app')

      // TSX file should come first due to priority
      expect(results[0].label).toBe('App.tsx')
    })

    it('should calculate relevance scores', async () => {
      const provider = createFileProvider({
        searchFiles: async () => [
          {
            path: 'src/Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            extension: '.tsx',
          },
        ],
        readFile: async () => '',
      })

      const results = await provider.search('Button.tsx')

      // Exact name match should have high relevance
      expect(results[0].relevance).toBeGreaterThan(0.5)
    })

    it('should respect maxResults limit', async () => {
      const mockFiles = Array.from({ length: 20 }, (_, i) => ({
        path: `file${i}.ts`,
        name: `file${i}.ts`,
        type: 'file' as const,
        extension: '.ts',
      }))

      const provider = createFileProvider({
        searchFiles: async () => mockFiles,
        readFile: async () => '',
        maxResults: 5,
      })

      const results = await provider.search('file')

      expect(results).toHaveLength(5)
    })

    it('should handle search errors gracefully', async () => {
      const provider = createFileProvider({
        searchFiles: async () => {
          throw new Error('Search failed')
        },
        readFile: async () => '',
      })

      const results = await provider.search('test')

      expect(results).toEqual([])
    })

    it('should include file metadata', async () => {
      const provider = createFileProvider({
        searchFiles: async () => [
          {
            path: 'src/test.ts',
            name: 'test.ts',
            type: 'file',
            size: 1024,
            extension: '.ts',
            language: 'typescript',
            lastModified: Date.now(),
          },
        ],
        readFile: async () => '',
      })

      const results = await provider.search('test')

      expect(results[0].metadata?.path).toBe('src/test.ts')
      expect(results[0].metadata?.extension).toBe('.ts')
      expect(results[0].metadata?.language).toBe('typescript')
      expect(results[0].metadata?.size).toBe(1024)
    })
  })

  describe('createMockFileProvider', () => {
    it('should create a working mock provider', async () => {
      const provider = createMockFileProvider()

      const results = await provider.search('button')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].type).toBe('file')
    })

    it('should have proper provider configuration', () => {
      const provider = createMockFileProvider()

      expect(provider.type).toBe('file')
      expect(provider.priority).toBe(80)
      expect(provider.enabled).toBe(true)
    })
  })

  describe('File icon detection', () => {
    it('should assign correct icons to different file types', async () => {
      const mockFiles: FileSystemEntry[] = [
        { path: 'test.ts', name: 'test.ts', type: 'file', extension: '.ts' },
        { path: 'test.py', name: 'test.py', type: 'file', extension: '.py' },
        { path: 'test.go', name: 'test.go', type: 'file', extension: '.go' },
      ]

      const provider = createFileProvider({
        searchFiles: async () => mockFiles,
        readFile: async () => '',
      })

      const results = await provider.search('test')

      expect(results[0].icon).toBeDefined()
      expect(results[1].icon).toBeDefined()
      expect(results[2].icon).toBeDefined()
    })
  })

  describe('Progressive expansion', () => {
    it('should provide summary, preview, and full content', async () => {
      const provider = createFileProvider({
        searchFiles: async () => [
          {
            path: 'src/test.ts',
            name: 'test.ts',
            type: 'file',
            extension: '.ts',
            excerpt: 'const x = 1',
            content: 'const x = 1\nconst y = 2',
          },
        ],
        readFile: async () => 'const x = 1\nconst y = 2',
      })

      const results = await provider.search('test')

      expect(results[0].summary).toBeDefined()
      expect(results[0].preview).toBeDefined()
      expect(results[0].full).toBeDefined()

      // Summary should be shortest
      expect(results[0].summary.length).toBeLessThan(results[0].preview!.length)
      expect(results[0].preview!.length).toBeLessThanOrEqual(results[0].full!.length)
    })
  })
})
