/**
 * User Provider Tests
 */

import { describe, it, expect } from 'vitest'
import { createUserProvider, createMockUserProvider } from '../user-provider'
import type { UserEntry } from '../user-provider'

describe('UserProvider', () => {
  describe('createUserProvider', () => {
    it('should search users with fuzzy matching', async () => {
      const mockUsers: UserEntry[] = [
        {
          id: 'user-1',
          name: 'Alice Johnson',
          username: 'alice',
          role: 'Engineer',
        },
        {
          id: 'user-2',
          name: 'Bob Smith',
          username: 'bob',
          role: 'Designer',
        },
      ]

      const provider = createUserProvider({
        searchUsers: async () => mockUsers,
      })

      const results = await provider.search('alice')

      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Alice Johnson')
      expect(results[0].type).toBe('user')
    })

    it('should calculate token costs for users', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'John Doe',
            username: 'john',
            role: 'Engineer',
            bio: 'Software engineer with 10 years experience',
          },
        ],
      })

      const results = await provider.search('john')

      expect(results[0].tokens.summary).toBeGreaterThan(0)
      expect(results[0].tokens.preview).toBeGreaterThan(0)
      expect(results[0].tokens.full).toBeGreaterThan(0)
    })

    it('should prioritize certain roles', async () => {
      const mockUsers: UserEntry[] = [
        {
          id: 'user-1',
          name: 'User 1',
          username: 'user1',
          role: 'Developer',
        },
        {
          id: 'user-2',
          name: 'User 2',
          username: 'user2',
          role: 'Admin',
        },
      ]

      const provider = createUserProvider({
        searchUsers: async () => mockUsers,
        priorityRoles: ['admin'],
      })

      const results = await provider.search('user')

      // Admin should come first due to priority
      expect(results[0].label).toBe('User 2')
    })

    it('should prioritize online users', async () => {
      const mockUsers: UserEntry[] = [
        {
          id: 'user-1',
          name: 'Offline User',
          username: 'offline',
          status: 'offline',
        },
        {
          id: 'user-2',
          name: 'Online User',
          username: 'online',
          status: 'online',
        },
      ]

      const provider = createUserProvider({
        searchUsers: async () => mockUsers,
      })

      const results = await provider.search('user')

      // Online user should come first
      expect(results[0].label).toBe('Online User')
    })

    it('should calculate relevance scores', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'Alice',
            username: 'alice',
            status: 'online',
          },
        ],
      })

      const results = await provider.search('alice')

      // Exact name match + online should have high relevance
      expect(results[0].relevance).toBeGreaterThan(0.5)
    })

    it('should include user status in summary', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'Alice',
            username: 'alice',
            status: 'online',
          },
        ],
        showStatus: true,
      })

      const results = await provider.search('alice')

      expect(results[0].summary).toContain('🟢') // Online icon
    })

    it('should handle search errors gracefully', async () => {
      const provider = createUserProvider({
        searchUsers: async () => {
          throw new Error('Search failed')
        },
      })

      const results = await provider.search('test')

      expect(results).toEqual([])
    })

    it('should include user metadata', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'Alice',
            username: 'alice',
            email: 'alice@example.com',
            role: 'Engineer',
            department: 'Engineering',
            expertise: ['React', 'TypeScript'],
            status: 'online',
          },
        ],
      })

      const results = await provider.search('alice')

      expect(results[0].metadata?.userId).toBe('user-1')
      expect(results[0].metadata?.username).toBe('alice')
      expect(results[0].metadata?.email).toBe('alice@example.com')
      expect(results[0].metadata?.role).toBe('Engineer')
      expect(results[0].metadata?.expertise).toEqual(['React', 'TypeScript'])
    })

    it('should include recent activity in preview', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'Alice',
            username: 'alice',
            recentActivity: ['Fixed bug #123', 'Reviewed PR #456'],
          },
        ],
        showActivity: true,
      })

      const results = await provider.search('alice')

      expect(results[0].preview).toContain('Recent Activity')
      expect(results[0].preview).toContain('Fixed bug #123')
    })
  })

  describe('createMockUserProvider', () => {
    it('should create a working mock provider', async () => {
      const provider = createMockUserProvider()

      const results = await provider.search('alice')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].type).toBe('user')
    })

    it('should have proper provider configuration', () => {
      const provider = createMockUserProvider()

      expect(provider.type).toBe('user')
      expect(provider.priority).toBe(40)
      expect(provider.enabled).toBe(true)
    })
  })

  describe('User status and role icons', () => {
    it('should assign correct icons to different statuses', async () => {
      const mockUsers: UserEntry[] = [
        { id: '1', name: 'User 1', username: 'u1', status: 'online' },
        { id: '2', name: 'User 2', username: 'u2', status: 'offline' },
        { id: '3', name: 'User 3', username: 'u3', status: 'away' },
        { id: '4', name: 'User 4', username: 'u4', status: 'busy' },
      ]

      const provider = createUserProvider({
        searchUsers: async () => mockUsers,
        showStatus: true,
      })

      const results = await provider.search('user')

      results.forEach((result) => {
        expect(result.summary).toMatch(/[🟢⚫🟡🔴]/u) // Should have status icon
      })
    })
  })

  describe('Progressive expansion', () => {
    it('should provide summary, preview, and full content', async () => {
      const provider = createUserProvider({
        searchUsers: async () => [
          {
            id: 'user-1',
            name: 'Alice Johnson',
            username: 'alice',
            role: 'Engineer',
            bio: 'Senior software engineer',
            expertise: ['React', 'TypeScript'],
            recentActivity: ['Fixed bug', 'Reviewed PR'],
          },
        ],
      })

      const results = await provider.search('alice')

      expect(results[0].summary).toBeDefined()
      expect(results[0].preview).toBeDefined()
      expect(results[0].full).toBeDefined()

      // Summary should be shortest
      expect(results[0].summary.length).toBeLessThan(results[0].preview!.length)
      expect(results[0].preview!.length).toBeLessThan(results[0].full!.length)
    })
  })
})
