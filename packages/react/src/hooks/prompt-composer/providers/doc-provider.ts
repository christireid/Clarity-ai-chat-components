/**
 * Documentation Provider for PromptComposer
 *
 * Provides documentation lookup for @doc mentions with:
 * - Fuzzy documentation search
 * - Token cost calculation
 * - Progressive context expansion
 * - Relevance scoring
 */

import { createContextItem, fuzzyMatch } from '../context-utils'
import type { ContextItem, ContextProvider } from '../types'

// ============================================================================
// Types
// ============================================================================

export interface DocEntry {
  id: string
  title: string
  category: string
  url?: string
  excerpt?: string // Short description
  content: string // Full markdown content
  headings?: string[] // H1-H3 headings
  keywords?: string[]
  lastUpdated?: number
}

export interface DocProviderConfig {
  /**
   * Function to search documentation
   * Can integrate with Algolia, MeiliSearch, or custom search
   */
  searchDocs: (query: string) => Promise<DocEntry[]>

  /**
   * Function to fetch full documentation content
   */
  getDocContent?: (id: string) => Promise<string>

  /**
   * Maximum number of results to return
   * @default 8
   */
  maxResults?: number

  /**
   * Enable fuzzy search
   * @default true
   */
  fuzzySearch?: boolean

  /**
   * Categories to prioritize in search results
   * @default ['api', 'guides', 'tutorials']
   */
  priorityCategories?: string[]

  /**
   * Base URL for documentation links
   * @default ''
   */
  baseUrl?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get documentation icon based on category
 */
function getDocIcon(category: string): string {
  const iconMap: Record<string, string> = {
    api: '📚',
    reference: '📖',
    guide: '📘',
    tutorial: '🎓',
    example: '💡',
    concept: '🧠',
    troubleshooting: '🔧',
    migration: '🔄',
    changelog: '📝',
    faq: '❓',
  }

  return iconMap[category.toLowerCase()] || '📄'
}

/**
 * Generate documentation summary (lightweight context)
 */
function generateDocSummary(doc: DocEntry): string {
  const icon = getDocIcon(doc.category)
  let summary = `${icon} ${doc.title}`

  if (doc.category) {
    summary += ` (${doc.category})`
  }

  if (doc.excerpt) {
    summary += ` - ${doc.excerpt}`
  }

  return summary
}

/**
 * Generate documentation preview (medium context)
 */
function generateDocPreview(doc: DocEntry): string {
  const icon = getDocIcon(doc.category)
  let preview = `${icon} **${doc.title}**\n\n`

  // Add metadata
  preview += `Category: ${doc.category}\n`

  if (doc.url) {
    preview += `URL: ${doc.url}\n`
  }

  if (doc.excerpt) {
    preview += `\n${doc.excerpt}\n`
  }

  // Add headings if available
  if (doc.headings && doc.headings.length > 0) {
    preview += '\n**Table of Contents:**\n'
    doc.headings.slice(0, 5).forEach((heading) => {
      preview += `- ${heading}\n`
    })
  }

  // Add excerpt from content (first 300 chars)
  if (doc.content) {
    const contentExcerpt = doc.content
      .replace(/```[\s\S]*?```/g, '[code block]') // Remove code blocks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .slice(0, 300)
    preview += `\n**Preview:**\n${contentExcerpt}...`
  }

  return preview
}

/**
 * Calculate relevance score for documentation
 */
function calculateDocRelevance(doc: DocEntry, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Exact title match (+0.5)
  if (doc.title.toLowerCase() === queryLower) {
    score += 0.5
  }

  // Title contains query (+0.3)
  if (doc.title.toLowerCase().includes(queryLower)) {
    score += 0.3
  }

  // Keywords match (+0.2)
  if (doc.keywords) {
    const matchingKeywords = doc.keywords.filter((k) =>
      k.toLowerCase().includes(queryLower)
    )
    if (matchingKeywords.length > 0) {
      score += 0.2 * (matchingKeywords.length / doc.keywords.length)
    }
  }

  // Excerpt contains query (+0.1)
  if (doc.excerpt && doc.excerpt.toLowerCase().includes(queryLower)) {
    score += 0.1
  }

  // Recently updated (+0.1)
  if (doc.lastUpdated) {
    const daysAgo = (Date.now() - doc.lastUpdated) / 1000 / 60 / 60 / 24
    if (daysAgo < 30) {
      score += 0.1
    }
  }

  return Math.min(score, 1)
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,3}\s+(.+)$/gm
  const headings: string[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1])
  }

  return headings
}

// ============================================================================
// Documentation Provider Factory
// ============================================================================

/**
 * Create a documentation provider for PromptComposer
 *
 * @example
 * ```tsx
 * // Basic usage
 * const docProvider = createDocProvider({
 *   searchDocs: async (query) => {
 *     // Search your documentation
 *     return await searchDocsAPI(query)
 *   }
 * })
 *
 * // With Algolia
 * const docProvider = createDocProvider({
 *   searchDocs: async (query) => {
 *     const { hits } = await algoliaClient.search(query, {
 *       indexName: 'docs',
 *       hitsPerPage: 10
 *     })
 *     return hits.map(hit => ({
 *       id: hit.objectID,
 *       title: hit.title,
 *       category: hit.category,
 *       content: hit.content,
 *       excerpt: hit.excerpt,
 *       keywords: hit.keywords,
 *       url: hit.url
 *     }))
 *   }
 * })
 *
 * // Use with PromptComposer
 * <PromptComposer
 *   api="/api/chat"
 *   features={{
 *     context: {
 *       triggers: ['@'],
 *       providers: [docProvider]
 *     }
 *   }}
 * />
 * ```
 */
export function createDocProvider(config: DocProviderConfig): ContextProvider {
  const {
    searchDocs,
    getDocContent,
    maxResults = 8,
    fuzzySearch = true,
    priorityCategories = ['api', 'guides', 'tutorials'],
    baseUrl = '',
  } = config

  return {
    type: 'doc',
    icon: '📚',
    priority: 60, // Medium-high priority
    enabled: true,
    maxResults,

    search: async (query: string): Promise<ContextItem[]> => {
      try {
        // Search documentation
        const docs = await searchDocs(query)

        // Filter with fuzzy matching if enabled
        const filtered = fuzzySearch
          ? docs.filter(
              (doc) =>
                fuzzyMatch(query, doc.title) ||
                (doc.excerpt && fuzzyMatch(query, doc.excerpt)) ||
                (doc.keywords &&
                  doc.keywords.some((k) => fuzzyMatch(query, k)))
            )
          : docs.filter(
              (doc) =>
                doc.title.toLowerCase().includes(query.toLowerCase()) ||
                (doc.excerpt &&
                  doc.excerpt.toLowerCase().includes(query.toLowerCase()))
            )

        // Sort by priority and relevance
        const sorted = filtered
          .map((doc) => ({
            doc,
            relevance: calculateDocRelevance(doc, query),
            isPriority: priorityCategories.includes(doc.category.toLowerCase()),
          }))
          .sort((a, b) => {
            // Priority categories first
            if (a.isPriority && !b.isPriority) return -1
            if (!a.isPriority && b.isPriority) return 1

            // Then by relevance
            return b.relevance - a.relevance
          })
          .slice(0, maxResults)

        // Convert to context items
        const contextItems: ContextItem[] = []

        for (const { doc, relevance } of sorted) {
          // Extract headings if not provided
          const headings = doc.headings || extractHeadings(doc.content)

          const summary = generateDocSummary(doc)
          const preview = generateDocPreview({ ...doc, headings })

          // Get full content
          const full =
            getDocContent && doc.id
              ? await getDocContent(doc.id).catch(() => doc.content)
              : doc.content

          const item = createContextItem({
            id: `doc:${doc.id}`,
            type: 'doc',
            label: doc.title,
            description: doc.excerpt,
            icon: getDocIcon(doc.category),
            summary,
            preview,
            full,
            relevance,
            priority: 60,
            metadata: {
              category: doc.category,
              url: doc.url ? `${baseUrl}${doc.url}` : undefined,
              keywords: doc.keywords,
              headings,
              lastUpdated: doc.lastUpdated,
            },
          })

          contextItems.push(item)
        }

        return contextItems
      } catch (error) {
        console.error('[DocProvider] Search failed:', error)
        return []
      }
    },
  }
}

// ============================================================================
// Mock Documentation Provider (for testing/demos)
// ============================================================================

/**
 * Create a mock documentation provider for testing
 */
export function createMockDocProvider(): ContextProvider {
  const mockDocs: DocEntry[] = [
    {
      id: 'authentication',
      title: 'Authentication Guide',
      category: 'guide',
      url: '/guides/authentication',
      excerpt: 'Learn how to implement authentication in your application',
      content: `# Authentication Guide

## Overview
This guide covers authentication implementation using JWT tokens.

## Quick Start
\`\`\`typescript
const { login, logout } = useAuth()
\`\`\`

## Configuration
Configure your auth provider with the following options...`,
      headings: ['Overview', 'Quick Start', 'Configuration', 'Best Practices'],
      keywords: ['auth', 'login', 'jwt', 'security', 'tokens'],
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      category: 'api',
      url: '/api/reference',
      excerpt: 'Complete API reference for all components and hooks',
      content: `# API Reference

## Components

### Button
\`\`\`tsx
<Button onClick={handleClick}>Click me</Button>
\`\`\`

### Input
\`\`\`tsx
<Input value={value} onChange={handleChange} />
\`\`\``,
      headings: ['Components', 'Hooks', 'Utilities'],
      keywords: ['api', 'reference', 'components', 'hooks', 'props'],
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      category: 'tutorial',
      url: '/tutorials/getting-started',
      excerpt: 'Get up and running in minutes',
      content: `# Getting Started

## Installation
\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Usage
\`\`\`tsx
import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return <ClarityChatApp api="/api/chat" />
}
\`\`\``,
      headings: ['Installation', 'Usage', 'Configuration', 'Next Steps'],
      keywords: ['getting started', 'installation', 'quickstart', 'setup'],
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    },
  ]

  return createDocProvider({
    searchDocs: async (query) => {
      return mockDocs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          (doc.excerpt && doc.excerpt.toLowerCase().includes(query.toLowerCase())) ||
          (doc.keywords &&
            doc.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())))
      )
    },
  })
}
