/**
 * Tests for Changelog Generator
 */

import { describe, it, expect } from 'vitest'
import {
  parseConventionalCommit,
  generateChangelogEntries,
  formatChangelogMarkdown,
  suggestNextVersion,
} from '../changelog-generator.js'
import type { CommitInfo } from '../types/index.js'

describe('Changelog Generator', () => {
  describe('parseConventionalCommit', () => {
    it('should parse a simple feat commit', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'feat: add new feature',
        body: '',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed).not.toBeNull()
      expect(parsed?.type).toBe('feat')
      expect(parsed?.message).toBe('add new feature')
      expect(parsed?.breaking).toBe(false)
      expect(parsed?.scope).toBeUndefined()
    })

    it('should parse a scoped commit', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'fix(hooks): resolve memory leak',
        body: '',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed?.type).toBe('fix')
      expect(parsed?.scope).toBe('hooks')
      expect(parsed?.message).toBe('resolve memory leak')
    })

    it('should detect breaking change from exclamation mark', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'feat!: remove deprecated API',
        body: '',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed?.breaking).toBe(true)
    })

    it('should detect breaking change from body', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'feat: update API',
        body: 'BREAKING CHANGE: the API signature has changed',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed?.breaking).toBe(true)
    })

    it('should extract PR number from subject', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'feat: add feature (#123)',
        body: '',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed?.prNumber).toBe(123)
    })

    it('should return null for non-conventional commits', () => {
      const commit: CommitInfo = {
        hash: 'abc123def456',
        shortHash: 'abc123d',
        subject: 'Updated readme',
        body: '',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        date: '2024-01-01',
        files: [],
      }

      const parsed = parseConventionalCommit(commit)

      expect(parsed).toBeNull()
    })
  })

  describe('generateChangelogEntries', () => {
    it('should group commits by type', () => {
      const commits: CommitInfo[] = [
        {
          hash: 'abc1',
          shortHash: 'abc1',
          subject: 'feat: add feature A',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-01',
          files: [],
        },
        {
          hash: 'abc2',
          shortHash: 'abc2',
          subject: 'feat: add feature B',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-02',
          files: [],
        },
        {
          hash: 'abc3',
          shortHash: 'abc3',
          subject: 'fix: resolve bug',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-03',
          files: [],
        },
      ]

      const entry = generateChangelogEntries(commits, '1.0.0')

      expect(entry.version).toBe('1.0.0')
      expect(entry.sections['Features']).toHaveLength(2)
      expect(entry.sections['Bug Fixes']).toHaveLength(1)
    })

    it('should put breaking changes in their own section', () => {
      const commits: CommitInfo[] = [
        {
          hash: 'abc1',
          shortHash: 'abc1',
          subject: 'feat!: breaking feature',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-01',
          files: [],
        },
      ]

      const entry = generateChangelogEntries(commits, '2.0.0')

      expect(entry.sections['Breaking Changes']).toHaveLength(1)
    })

    it('should skip chore and test commits', () => {
      const commits: CommitInfo[] = [
        {
          hash: 'abc1',
          shortHash: 'abc1',
          subject: 'chore: update deps',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-01',
          files: [],
        },
        {
          hash: 'abc2',
          shortHash: 'abc2',
          subject: 'test: add tests',
          body: '',
          author: 'Author',
          authorEmail: 'a@b.com',
          date: '2024-01-02',
          files: [],
        },
      ]

      const entry = generateChangelogEntries(commits, '1.0.0')

      expect(Object.keys(entry.sections)).toHaveLength(0)
    })
  })

  describe('formatChangelogMarkdown', () => {
    it('should format entry as markdown', () => {
      const entry = {
        version: '1.0.0',
        date: '2024-01-01',
        sections: {
          Features: [
            {
              message: 'add new feature',
              scope: 'hooks',
              hash: 'abc123def',
              shortHash: 'abc123d',
              author: 'Author',
            },
          ],
          'Bug Fixes': [
            {
              message: 'fix a bug',
              hash: 'def456abc',
              shortHash: 'def456a',
              author: 'Author',
            },
          ],
        },
      }

      const markdown = formatChangelogMarkdown(
        entry,
        'https://github.com/user/repo'
      )

      expect(markdown).toContain('## [1.0.0] - 2024-01-01')
      expect(markdown).toContain('### ✨ Features')
      expect(markdown).toContain('**hooks:**')
      expect(markdown).toContain('add new feature')
      expect(markdown).toContain('### 🐛 Bug Fixes')
      expect(markdown).toContain('fix a bug')
    })

    it('should include links when repo URL is provided', () => {
      const entry = {
        version: '1.0.0',
        date: '2024-01-01',
        sections: {
          Features: [
            {
              message: 'add feature',
              hash: 'abc123def456',
              shortHash: 'abc123d',
              author: 'Author',
              prNumber: 42,
            },
          ],
        },
      }

      const markdown = formatChangelogMarkdown(
        entry,
        'https://github.com/user/repo'
      )

      expect(markdown).toContain('[#42](https://github.com/user/repo/pull/42)')
      expect(markdown).toContain(
        '[`abc123d`](https://github.com/user/repo/commit/abc123def456)'
      )
    })
  })

  describe('suggestNextVersion', () => {
    it('should bump major for breaking changes (non-0.x)', () => {
      expect(suggestNextVersion('1.2.3', true, false)).toBe('2.0.0')
    })

    it('should bump minor for breaking changes in 0.x', () => {
      expect(suggestNextVersion('0.2.3', true, false)).toBe('0.3.0')
    })

    it('should bump minor for new features', () => {
      expect(suggestNextVersion('1.2.3', false, true)).toBe('1.3.0')
    })

    it('should bump patch for fixes only', () => {
      expect(suggestNextVersion('1.2.3', false, false)).toBe('1.2.4')
    })

    it('should handle edge cases', () => {
      expect(suggestNextVersion('invalid', false, false)).toBe('0.1.0')
    })
  })
})
