/**
 * User Provider for PromptComposer
 *
 * Provides user/team mentions for @user with:
 * - Fuzzy user search
 * - Token cost calculation
 * - Progressive context expansion
 * - Presence and activity tracking
 */

import { createContextItem, fuzzyMatch } from '../context-utils'
import type { ContextItem, ContextProvider } from '../types'

// ============================================================================
// Types
// ============================================================================

export interface UserEntry {
  id: string
  name: string
  email?: string
  username?: string
  avatar?: string
  role?: string
  department?: string
  bio?: string
  expertise?: string[] // Areas of expertise
  recentActivity?: string[] // Recent contributions
  status?: 'online' | 'offline' | 'away' | 'busy'
  lastActive?: number
}

export interface UserProviderConfig {
  /**
   * Function to search users
   * Can integrate with your user management system, LDAP, or custom API
   */
  searchUsers: (query: string) => Promise<UserEntry[]>

  /**
   * Function to get full user profile
   */
  getUserProfile?: (id: string) => Promise<UserEntry>

  /**
   * Maximum number of results to return
   * @default 10
   */
  maxResults?: number

  /**
   * Enable fuzzy search
   * @default true
   */
  fuzzySearch?: boolean

  /**
   * Roles to prioritize in search results
   * @default ['admin', 'maintainer', 'expert']
   */
  priorityRoles?: string[]

  /**
   * Include user status in results
   * @default true
   */
  showStatus?: boolean

  /**
   * Include recent activity
   * @default true
   */
  showActivity?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get user status icon
 */
function getStatusIcon(status?: string): string {
  const iconMap: Record<string, string> = {
    online: '🟢',
    offline: '⚫',
    away: '🟡',
    busy: '🔴',
  }

  return iconMap[status || 'offline'] || '⚫'
}

/**
 * Get role icon
 */
function getRoleIcon(role?: string): string {
  const iconMap: Record<string, string> = {
    admin: '👑',
    maintainer: '🔧',
    expert: '⭐',
    developer: '💻',
    designer: '🎨',
    manager: '📊',
  }

  return iconMap[role?.toLowerCase() || ''] || '👤'
}

/**
 * Generate user summary (lightweight context)
 */
function generateUserSummary(user: UserEntry, showStatus: boolean): string {
  const roleIcon = getRoleIcon(user.role)
  const statusIcon = showStatus ? getStatusIcon(user.status) : ''

  let summary = `${statusIcon}${roleIcon} ${user.name}`

  if (user.username) {
    summary += ` (@${user.username})`
  }

  if (user.role) {
    summary += ` - ${user.role}`
  }

  if (user.department) {
    summary += ` (${user.department})`
  }

  return summary
}

/**
 * Generate user preview (medium context)
 */
function generateUserPreview(
  user: UserEntry,
  showStatus: boolean,
  showActivity: boolean
): string {
  const roleIcon = getRoleIcon(user.role)
  let preview = `${roleIcon} **${user.name}**\n\n`

  // Add basic info
  if (user.username) {
    preview += `Username: @${user.username}\n`
  }
  if (user.email) {
    preview += `Email: ${user.email}\n`
  }
  if (user.role) {
    preview += `Role: ${user.role}\n`
  }
  if (user.department) {
    preview += `Department: ${user.department}\n`
  }

  // Add status
  if (showStatus && user.status) {
    const statusIcon = getStatusIcon(user.status)
    preview += `\nStatus: ${statusIcon} ${user.status}`
    if (user.lastActive) {
      const minutesAgo = Math.floor((Date.now() - user.lastActive) / 1000 / 60)
      if (minutesAgo < 60) {
        preview += ` (active ${minutesAgo}m ago)`
      } else if (minutesAgo < 1440) {
        preview += ` (active ${Math.floor(minutesAgo / 60)}h ago)`
      } else {
        preview += ` (active ${Math.floor(minutesAgo / 1440)}d ago)`
      }
    }
    preview += '\n'
  }

  // Add expertise
  if (user.expertise && user.expertise.length > 0) {
    preview += `\n**Expertise:**\n`
    user.expertise.slice(0, 5).forEach((area) => {
      preview += `- ${area}\n`
    })
  }

  // Add recent activity
  if (showActivity && user.recentActivity && user.recentActivity.length > 0) {
    preview += `\n**Recent Activity:**\n`
    user.recentActivity.slice(0, 3).forEach((activity) => {
      preview += `- ${activity}\n`
    })
  }

  return preview
}

/**
 * Generate user full context
 */
function generateUserFull(user: UserEntry): string {
  const roleIcon = getRoleIcon(user.role)
  let full = `${roleIcon} **${user.name}** - Complete Profile\n\n`

  // Contact info
  full += '## Contact Information\n'
  if (user.username) {
    full += `- Username: @${user.username}\n`
  }
  if (user.email) {
    full += `- Email: ${user.email}\n`
  }

  // Professional info
  full += '\n## Professional Information\n'
  if (user.role) {
    full += `- Role: ${user.role}\n`
  }
  if (user.department) {
    full += `- Department: ${user.department}\n`
  }

  // Bio
  if (user.bio) {
    full += `\n## About\n${user.bio}\n`
  }

  // Expertise
  if (user.expertise && user.expertise.length > 0) {
    full += '\n## Areas of Expertise\n'
    user.expertise.forEach((area) => {
      full += `- ${area}\n`
    })
  }

  // Recent activity
  if (user.recentActivity && user.recentActivity.length > 0) {
    full += '\n## Recent Contributions\n'
    user.recentActivity.forEach((activity) => {
      full += `- ${activity}\n`
    })
  }

  return full
}

/**
 * Calculate relevance score for user
 */
function calculateUserRelevance(user: UserEntry, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Exact name match (+0.5)
  if (user.name.toLowerCase() === queryLower) {
    score += 0.5
  }

  // Name contains query (+0.3)
  if (user.name.toLowerCase().includes(queryLower)) {
    score += 0.3
  }

  // Username match (+0.3)
  if (user.username && user.username.toLowerCase().includes(queryLower)) {
    score += 0.3
  }

  // Email match (+0.2)
  if (user.email && user.email.toLowerCase().includes(queryLower)) {
    score += 0.2
  }

  // Expertise match (+0.2)
  if (user.expertise) {
    const matchingExpertise = user.expertise.filter((e) =>
      e.toLowerCase().includes(queryLower)
    )
    if (matchingExpertise.length > 0) {
      score += 0.2
    }
  }

  // Online status boost (+0.1)
  if (user.status === 'online') {
    score += 0.1
  }

  // Recently active boost (+0.1)
  if (user.lastActive) {
    const hoursAgo = (Date.now() - user.lastActive) / 1000 / 60 / 60
    if (hoursAgo < 1) {
      score += 0.1
    }
  }

  return Math.min(score, 1)
}

// ============================================================================
// User Provider Factory
// ============================================================================

/**
 * Create a user provider for PromptComposer
 *
 * @example
 * ```tsx
 * // Basic usage
 * const userProvider = createUserProvider({
 *   searchUsers: async (query) => {
 *     // Search your user directory
 *     return await searchTeamMembers(query)
 *   }
 * })
 *
 * // With full profile fetching
 * const userProvider = createUserProvider({
 *   searchUsers: async (query) => {
 *     const response = await fetch(`/api/users/search?q=${query}`)
 *     return response.json()
 *   },
 *   getUserProfile: async (id) => {
 *     const response = await fetch(`/api/users/${id}`)
 *     return response.json()
 *   }
 * })
 *
 * // Use with PromptComposer
 * <PromptComposer
 *   api="/api/chat"
 *   features={{
 *     context: {
 *       triggers: ['@'],
 *       providers: [userProvider]
 *     }
 *   }}
 * />
 * ```
 */
export function createUserProvider(config: UserProviderConfig): ContextProvider {
  const {
    searchUsers,
    getUserProfile,
    maxResults = 10,
    fuzzySearch = true,
    priorityRoles = ['admin', 'maintainer', 'expert'],
    showStatus = true,
    showActivity = true,
  } = config

  return {
    type: 'user',
    icon: '👤',
    priority: 40, // Medium priority
    enabled: true,
    maxResults,

    search: async (query: string): Promise<ContextItem[]> => {
      try {
        // Search users
        const users = await searchUsers(query)

        // Filter with fuzzy matching if enabled
        const filtered = fuzzySearch
          ? users.filter(
              (user) =>
                fuzzyMatch(query, user.name) ||
                (user.username && fuzzyMatch(query, user.username)) ||
                (user.email && fuzzyMatch(query, user.email))
            )
          : users.filter(
              (user) =>
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                (user.username &&
                  user.username.toLowerCase().includes(query.toLowerCase())) ||
                (user.email &&
                  user.email.toLowerCase().includes(query.toLowerCase()))
            )

        // Sort by priority and relevance
        const sorted = filtered
          .map((user) => ({
            user,
            relevance: calculateUserRelevance(user, query),
            isPriority:
              user.role && priorityRoles.includes(user.role.toLowerCase()),
          }))
          .sort((a, b) => {
            // Priority roles first
            if (a.isPriority && !b.isPriority) return -1
            if (!a.isPriority && b.isPriority) return 1

            // Online users next
            if (a.user.status === 'online' && b.user.status !== 'online') return -1
            if (a.user.status !== 'online' && b.user.status === 'online') return 1

            // Then by relevance
            return b.relevance - a.relevance
          })
          .slice(0, maxResults)

        // Convert to context items
        const contextItems: ContextItem[] = []

        for (const { user, relevance } of sorted) {
          const summary = generateUserSummary(user, showStatus)
          const preview = generateUserPreview(user, showStatus, showActivity)
          const full = generateUserFull(user)

          const item = createContextItem({
            id: `user:${user.id}`,
            type: 'user',
            label: user.name,
            description: user.role || user.department,
            icon: getRoleIcon(user.role),
            summary,
            preview,
            full,
            relevance,
            priority: 40,
            metadata: {
              userId: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              department: user.department,
              status: user.status,
              expertise: user.expertise,
              lastActive: user.lastActive,
            },
          })

          contextItems.push(item)
        }

        return contextItems
      } catch (error) {
        console.error('[UserProvider] Search failed:', error)
        return []
      }
    },
  }
}

// ============================================================================
// Mock User Provider (for testing/demos)
// ============================================================================

/**
 * Create a mock user provider for testing
 */
export function createMockUserProvider(): ContextProvider {
  const mockUsers: UserEntry[] = [
    {
      id: 'user-1',
      name: 'Alice Johnson',
      username: 'alice',
      email: 'alice@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Senior Engineer',
      department: 'Engineering',
      bio: 'Full-stack developer with expertise in React and Node.js',
      expertise: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      recentActivity: [
        'Fixed authentication bug in useAuth hook',
        'Added dark mode support',
        'Reviewed 5 pull requests',
      ],
      status: 'online',
      lastActive: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    },
    {
      id: 'user-2',
      name: 'Bob Smith',
      username: 'bob',
      email: 'bob@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Product Designer',
      department: 'Design',
      bio: 'UI/UX designer focused on accessible, user-centered design',
      expertise: ['UI Design', 'Figma', 'Design Systems', 'Accessibility'],
      recentActivity: [
        'Created new component designs',
        'Updated design system documentation',
      ],
      status: 'away',
      lastActive: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    },
    {
      id: 'user-3',
      name: 'Carol Williams',
      username: 'carol',
      email: 'carol@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Tech Lead',
      department: 'Engineering',
      bio: 'Technical lead for the AI chat components project',
      expertise: ['System Architecture', 'AI/ML', 'Performance', 'Mentoring'],
      recentActivity: [
        'Architected new token optimization system',
        'Mentored 3 junior developers',
        'Reviewed architecture proposal',
      ],
      status: 'busy',
      lastActive: Date.now() - 1000 * 60 * 10, // 10 minutes ago
    },
  ]

  return createUserProvider({
    searchUsers: async (query) => {
      return mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          (user.username &&
            user.username.toLowerCase().includes(query.toLowerCase())) ||
          (user.role && user.role.toLowerCase().includes(query.toLowerCase()))
      )
    },
  })
}
