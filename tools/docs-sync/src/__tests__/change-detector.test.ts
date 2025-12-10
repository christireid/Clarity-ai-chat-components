/**
 * Tests for Change Detection Engine
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock git utilities
vi.mock('../utils/git.js', () => ({
  getChangedFiles: vi.fn(),
  getCurrentCommit: vi.fn(),
  getMergeBase: vi.fn(),
}))

import {
  detectChanges,
  filterDocsRelevant,
  formatAsJSON,
  formatAsText,
  formatAsGitHubOutput,
  getAffectedPackages,
  hasBreakingChanges,
  groupByPackage,
} from '../change-detector.js'
import {
  getChangedFiles,
  getCurrentCommit,
  getMergeBase,
} from '../utils/git.js'
import type { ChangedFile, ChangeDetectionResult } from '../types/index.js'

describe('Change Detector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('detectChanges', () => {
    it('should detect docs-relevant changes in source files', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/hooks/useChat.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
        {
          path: 'packages/react/src/__tests__/useChat.test.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
      })

      expect(result.changedFiles).toHaveLength(2)
      expect(result.summary.totalFiles).toBe(2)

      // Check classification
      const hookClassification = result.classifications.get(
        'packages/react/src/hooks/useChat.ts'
      )
      expect(hookClassification?.isDocsRelevant).toBe(true)

      const testClassification = result.classifications.get(
        'packages/react/src/__tests__/useChat.test.ts'
      )
      expect(testClassification?.isDocsRelevant).toBe(false)
    })

    it('should exclude internal files', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/internal/utils.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
      })

      const classification = result.classifications.get(
        'packages/react/src/internal/utils.ts'
      )
      expect(classification?.isDocsRelevant).toBe(false)
    })

    it('should identify affected packages', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/index.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
        {
          path: 'packages/types/src/index.ts',
          status: 'modified',
          package: '@clarity-chat/types',
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
      })

      expect(result.summary.packagesAffected).toContain('@clarity-chat/react')
      expect(result.summary.packagesAffected).toContain('@clarity-chat/types')
    })

    it('should detect breaking changes on deleted files', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/hooks/useOldHook.ts',
          status: 'deleted',
          package: '@clarity-chat/react',
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
      })

      const classification = result.classifications.get(
        'packages/react/src/hooks/useOldHook.ts'
      )
      expect(classification?.changeType).toBe('breaking')
      expect(result.summary.hasBreakingChanges).toBe(true)
    })

    it('should skip test files when skipTests is true', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/hooks/useChat.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
        {
          path: 'packages/react/src/hooks/useChat.test.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
        skipTests: true,
      })

      expect(result.changedFiles).toHaveLength(1)
      expect(result.changedFiles[0]?.path).toBe(
        'packages/react/src/hooks/useChat.ts'
      )
    })
  })

  describe('filterDocsRelevant', () => {
    it('should filter to only docs-relevant files', async () => {
      vi.mocked(getCurrentCommit).mockReturnValue('abc1234')
      vi.mocked(getMergeBase).mockReturnValue('def5678')
      vi.mocked(getChangedFiles).mockReturnValue([
        {
          path: 'packages/react/src/hooks/useChat.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
        {
          path: 'packages/react/src/__tests__/useChat.test.ts',
          status: 'modified',
          package: '@clarity-chat/react',
        },
        {
          path: 'README.md',
          status: 'modified',
          package: null,
        },
      ])

      const result = await detectChanges({
        base: 'HEAD~1',
        head: 'HEAD',
      })

      const filtered = filterDocsRelevant(result)

      expect(filtered.changedFiles).toHaveLength(1)
      expect(filtered.changedFiles[0]?.path).toBe(
        'packages/react/src/hooks/useChat.ts'
      )
    })
  })

  describe('formatAsGitHubOutput', () => {
    it('should format result for GitHub Actions', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [
          {
            path: 'packages/react/src/hooks/useChat.ts',
            status: 'modified',
            package: '@clarity-chat/react',
          },
        ],
        classifications: new Map([
          [
            'packages/react/src/hooks/useChat.ts',
            {
              isDocsRelevant: true,
              affectedAPIs: ['useChat'],
              affectedDocs: ['hooks/use-chat.mdx'],
              changeType: 'feature',
              priority: 'medium',
              reason: 'File matches docs-relevant pattern',
            },
          ],
        ]),
        summary: {
          totalFiles: 1,
          docsRelevantFiles: 1,
          packagesAffected: ['@clarity-chat/react'],
          estimatedDocUpdates: 1,
          hasBreakingChanges: false,
          hasNewFeatures: true,
        },
        baseCommit: 'def5678',
        headCommit: 'abc1234',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      const output = formatAsGitHubOutput(result)

      expect(output).toContain('docs_relevant=true')
      expect(output).toContain('affected_packages=@clarity-chat/react')
      expect(output).toContain('has_breaking_changes=false')
    })
  })

  describe('formatAsJSON', () => {
    it('should format result as valid JSON', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [],
        classifications: new Map(),
        summary: {
          totalFiles: 0,
          docsRelevantFiles: 0,
          packagesAffected: [],
          estimatedDocUpdates: 0,
          hasBreakingChanges: false,
          hasNewFeatures: false,
        },
        baseCommit: 'abc',
        headCommit: 'def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      const json = formatAsJSON(result)
      const parsed = JSON.parse(json)

      expect(parsed.baseCommit).toBe('abc')
      expect(parsed.summary.totalFiles).toBe(0)
    })
  })

  describe('formatAsText', () => {
    it('should format result as human-readable text', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [
          {
            path: 'packages/react/src/hooks/useChat.ts',
            status: 'modified',
            package: '@clarity-chat/react',
          },
        ],
        classifications: new Map([
          [
            'packages/react/src/hooks/useChat.ts',
            {
              isDocsRelevant: true,
              affectedAPIs: ['useChat'],
              affectedDocs: ['hooks/use-chat.mdx'],
              changeType: 'feature',
              priority: 'high',
              reason: 'File matches docs-relevant pattern',
            },
          ],
        ]),
        summary: {
          totalFiles: 1,
          docsRelevantFiles: 1,
          packagesAffected: ['@clarity-chat/react'],
          estimatedDocUpdates: 1,
          hasBreakingChanges: false,
          hasNewFeatures: true,
        },
        baseCommit: 'def5678abc',
        headCommit: 'abc1234def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      const text = formatAsText(result)

      expect(text).toContain('Change Detection Results')
      expect(text).toContain('def5678')
      expect(text).toContain('Total files: 1')
      expect(text).toContain('@clarity-chat/react')
    })
  })

  describe('getAffectedPackages', () => {
    it('should return list of affected packages', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [],
        classifications: new Map(),
        summary: {
          totalFiles: 0,
          docsRelevantFiles: 0,
          packagesAffected: ['@clarity-chat/react', '@clarity-chat/types'],
          estimatedDocUpdates: 0,
          hasBreakingChanges: false,
          hasNewFeatures: false,
        },
        baseCommit: 'abc',
        headCommit: 'def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      const packages = getAffectedPackages(result)

      expect(packages).toEqual(['@clarity-chat/react', '@clarity-chat/types'])
    })
  })

  describe('hasBreakingChanges', () => {
    it('should return true when breaking changes exist', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [],
        classifications: new Map(),
        summary: {
          totalFiles: 0,
          docsRelevantFiles: 0,
          packagesAffected: [],
          estimatedDocUpdates: 0,
          hasBreakingChanges: true,
          hasNewFeatures: false,
        },
        baseCommit: 'abc',
        headCommit: 'def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      expect(hasBreakingChanges(result)).toBe(true)
    })

    it('should return false when no breaking changes', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [],
        classifications: new Map(),
        summary: {
          totalFiles: 0,
          docsRelevantFiles: 0,
          packagesAffected: [],
          estimatedDocUpdates: 0,
          hasBreakingChanges: false,
          hasNewFeatures: false,
        },
        baseCommit: 'abc',
        headCommit: 'def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      expect(hasBreakingChanges(result)).toBe(false)
    })
  })

  describe('groupByPackage', () => {
    it('should group files by package', () => {
      const result: ChangeDetectionResult = {
        changedFiles: [
          {
            path: 'packages/react/src/a.ts',
            status: 'modified',
            package: '@clarity-chat/react',
          },
          {
            path: 'packages/react/src/b.ts',
            status: 'modified',
            package: '@clarity-chat/react',
          },
          {
            path: 'packages/types/src/c.ts',
            status: 'modified',
            package: '@clarity-chat/types',
          },
        ],
        classifications: new Map(),
        summary: {
          totalFiles: 3,
          docsRelevantFiles: 3,
          packagesAffected: ['@clarity-chat/react', '@clarity-chat/types'],
          estimatedDocUpdates: 3,
          hasBreakingChanges: false,
          hasNewFeatures: false,
        },
        baseCommit: 'abc',
        headCommit: 'def',
        detectedAt: '2024-01-01T00:00:00.000Z',
      }

      const groups = groupByPackage(result)

      expect(groups.get('@clarity-chat/react')).toHaveLength(2)
      expect(groups.get('@clarity-chat/types')).toHaveLength(1)
    })
  })
})
