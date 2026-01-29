/**
 * Web Provider for PromptComposer
 *
 * Provides web search/fetch for @web mentions with:
 * - Web search integration
 * - URL fetching and parsing
 * - Token cost calculation
 * - Progressive context expansion
 */

import { createContextItem, fuzzyMatch } from '../context-utils'
import type { ContextItem, ContextProvider } from '../types'

// ============================================================================
// Types
// ============================================================================

export interface WebResult {
  url: string
  title: string
  snippet?: string // Search result snippet
  content?: string // Full page content (extracted text)
  author?: string
  publishedDate?: number
  lastModified?: number
  domain?: string
  type?: 'article' | 'documentation' | 'blog' | 'forum' | 'other'
}

export interface WebProviderConfig {
  /**
   * Function to search the web
   * Can integrate with Google Custom Search, Bing, or custom search API
   */
  searchWeb?: (query: string) => Promise<WebResult[]>

  /**
   * Function to fetch and parse web page content
   */
  fetchUrl?: (url: string) => Promise<string>

  /**
   * Maximum number of results to return
   * @default 5
   */
  maxResults?: number

  /**
   * Enable fuzzy search
   * @default true
   */
  fuzzySearch?: boolean

  /**
   * Domains to prioritize in search results
   * @default ['github.com', 'stackoverflow.com', 'docs.*.com']
   */
  priorityDomains?: string[]

  /**
   * Enable URL direct input (user can paste URL to fetch)
   * @default true
   */
  allowDirectUrls?: boolean

  /**
   * Maximum content length to extract from pages (chars)
   * @default 10000
   */
  maxContentLength?: number

  /**
   * Include metadata in context
   * @default true
   */
  includeMetadata?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get web result icon based on type
 */
function getWebIcon(type?: string): string {
  const iconMap: Record<string, string> = {
    article: '📰',
    documentation: '📚',
    blog: '✍️',
    forum: '💬',
    github: '🐙',
    stackoverflow: '📚',
    other: '🌐',
  }

  return iconMap[type || 'other'] || '🌐'
}

/**
 * Detect result type from URL
 */
function detectWebType(url: string): WebResult['type'] {
  const urlLower = url.toLowerCase()

  if (urlLower.includes('github.com')) return 'documentation'
  if (urlLower.includes('stackoverflow.com')) return 'forum'
  if (urlLower.includes('docs.') || urlLower.includes('/docs/')) return 'documentation'
  if (urlLower.includes('blog') || urlLower.includes('medium.com')) return 'blog'
  if (urlLower.includes('news') || urlLower.includes('article')) return 'article'

  return 'other'
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Check if URL is valid
 */
function isValidUrl(text: string): boolean {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

/**
 * Truncate content to max length
 */
function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content

  // Try to truncate at sentence boundary
  const truncated = content.slice(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')
  const lastNewline = truncated.lastIndexOf('\n')
  const breakPoint = Math.max(lastPeriod, lastNewline)

  if (breakPoint > maxLength * 0.8) {
    return truncated.slice(0, breakPoint + 1)
  }

  return truncated + '...'
}

/**
 * Generate web result summary (lightweight context)
 */
function generateWebSummary(result: WebResult): string {
  const icon = getWebIcon(result.type || detectWebType(result.url))
  const domain = result.domain || extractDomain(result.url)

  let summary = `${icon} ${result.title}`

  if (domain) {
    summary += ` (${domain})`
  }

  if (result.snippet) {
    summary += ` - ${result.snippet.slice(0, 100)}`
  }

  return summary
}

/**
 * Generate web result preview (medium context)
 */
function generateWebPreview(result: WebResult, includeMetadata: boolean): string {
  const icon = getWebIcon(result.type || detectWebType(result.url))
  let preview = `${icon} **${result.title}**\n\n`

  // Add metadata
  if (includeMetadata) {
    preview += `URL: ${result.url}\n`

    if (result.author) {
      preview += `Author: ${result.author}\n`
    }

    if (result.publishedDate) {
      const date = new Date(result.publishedDate)
      preview += `Published: ${date.toLocaleDateString()}\n`
    }

    preview += '\n'
  }

  // Add snippet or content excerpt
  if (result.snippet) {
    preview += `**Summary:**\n${result.snippet}\n`
  }

  if (result.content) {
    const excerpt = truncateContent(result.content, 500)
    preview += `\n**Content Preview:**\n${excerpt}\n`
  }

  return preview
}

/**
 * Calculate relevance score for web result
 */
function calculateWebRelevance(result: WebResult, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Title match (+0.4)
  if (result.title.toLowerCase().includes(queryLower)) {
    score += 0.4
  }

  // Snippet match (+0.3)
  if (result.snippet && result.snippet.toLowerCase().includes(queryLower)) {
    score += 0.3
  }

  // URL match (+0.2)
  if (result.url.toLowerCase().includes(queryLower)) {
    score += 0.2
  }

  // Recent content (+0.1)
  if (result.publishedDate) {
    const monthsAgo = (Date.now() - result.publishedDate) / 1000 / 60 / 60 / 24 / 30
    if (monthsAgo < 6) {
      score += 0.1
    }
  }

  return Math.min(score, 1)
}

/**
 * Simple HTML to text converter
 */
function htmlToText(html: string): string {
  return (
    html
      // Remove script and style tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()
  )
}

// ============================================================================
// Web Provider Factory
// ============================================================================

/**
 * Create a web provider for PromptComposer
 *
 * @example
 * ```tsx
 * // With Google Custom Search
 * const webProvider = createWebProvider({
 *   searchWeb: async (query) => {
 *     const response = await fetch(
 *       `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`
 *     )
 *     const data = await response.json()
 *     return data.items.map(item => ({
 *       url: item.link,
 *       title: item.title,
 *       snippet: item.snippet
 *     }))
 *   },
 *   fetchUrl: async (url) => {
 *     const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`)
 *     return response.text()
 *   }
 * })
 *
 * // With DuckDuckGo or Brave Search
 * const webProvider = createWebProvider({
 *   searchWeb: async (query) => {
 *     const response = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`)
 *     const data = await response.json()
 *     return data.RelatedTopics.map(topic => ({
 *       url: topic.FirstURL,
 *       title: topic.Text,
 *       snippet: topic.Text
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
 *       providers: [webProvider]
 *     }
 *   }}
 * />
 * ```
 */
export function createWebProvider(config: WebProviderConfig): ContextProvider {
  const {
    searchWeb,
    fetchUrl,
    maxResults = 5,
    fuzzySearch = true,
    priorityDomains = ['github.com', 'stackoverflow.com'],
    allowDirectUrls = true,
    maxContentLength = 10000,
    includeMetadata = true,
  } = config

  return {
    type: 'web',
    icon: '🌐',
    priority: 20, // Lower priority (expensive)
    enabled: true,
    maxResults,

    search: async (query: string): Promise<ContextItem[]> => {
      try {
        let results: WebResult[] = []

        // Check if query is a direct URL
        if (allowDirectUrls && isValidUrl(query)) {
          const domain = extractDomain(query)
          const type = detectWebType(query)

          // Fetch content if fetchUrl is provided
          const content = fetchUrl
            ? await fetchUrl(query).catch(() => undefined)
            : undefined

          results = [
            {
              url: query,
              title: domain,
              domain,
              type,
              content: content ? htmlToText(content) : undefined,
            },
          ]
        } else if (searchWeb) {
          // Search the web
          results = await searchWeb(query)
        } else {
          console.warn('[WebProvider] No search function configured')
          return []
        }

        // Add domain and type if missing
        results = results.map((result) => ({
          ...result,
          domain: result.domain || extractDomain(result.url),
          type: result.type || detectWebType(result.url),
        }))

        // Filter with fuzzy matching if enabled
        const filtered = fuzzySearch
          ? results.filter(
              (result) =>
                fuzzyMatch(query, result.title) ||
                (result.snippet && fuzzyMatch(query, result.snippet))
            )
          : results

        // Sort by priority and relevance
        const sorted = filtered
          .map((result) => ({
            result,
            relevance: calculateWebRelevance(result, query),
            isPriority: priorityDomains.some(
              (domain) => result.domain?.includes(domain)
            ),
          }))
          .sort((a, b) => {
            // Priority domains first
            if (a.isPriority && !b.isPriority) return -1
            if (!a.isPriority && b.isPriority) return 1

            // Then by relevance
            return b.relevance - a.relevance
          })
          .slice(0, maxResults)

        // Convert to context items
        const contextItems: ContextItem[] = []

        for (const { result, relevance } of sorted) {
          const summary = generateWebSummary(result)
          const preview = generateWebPreview(result, includeMetadata)

          // Get or fetch full content
          let full = result.content

          if (!full && fetchUrl) {
            try {
              const html = await fetchUrl(result.url)
              full = truncateContent(htmlToText(html), maxContentLength)
            } catch (error) {
              console.warn(`[WebProvider] Failed to fetch ${result.url}:`, error)
              full = result.snippet || ''
            }
          }

          const item = createContextItem({
            id: `web:${result.url}`,
            type: 'web',
            label: result.title,
            description: result.snippet,
            icon: getWebIcon(result.type),
            summary,
            preview,
            full: full || preview,
            relevance,
            priority: 20,
            metadata: {
              url: result.url,
              domain: result.domain,
              type: result.type,
              author: result.author,
              publishedDate: result.publishedDate,
              lastModified: result.lastModified,
            },
          })

          contextItems.push(item)
        }

        return contextItems
      } catch (error) {
        console.error('[WebProvider] Search failed:', error)
        return []
      }
    },
  }
}

// ============================================================================
// Mock Web Provider (for testing/demos)
// ============================================================================

/**
 * Create a mock web provider for testing
 */
export function createMockWebProvider(): ContextProvider {
  const mockResults: WebResult[] = [
    {
      url: 'https://react.dev/learn',
      title: 'React Documentation - Learn React',
      snippet: 'The library for web and native user interfaces',
      domain: 'react.dev',
      type: 'documentation',
      content: `# Learn React

React is a JavaScript library for building user interfaces.

## Quick Start
Create a new React app with Create React App:
\`\`\`bash
npx create-react-app my-app
\`\`\`

## Core Concepts
- Components
- Props
- State
- Hooks`,
      publishedDate: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    },
    {
      url: 'https://stackoverflow.com/questions/12345/how-to-use-react-hooks',
      title: 'How to use React Hooks?',
      snippet: 'Best practices for using React Hooks in functional components',
      domain: 'stackoverflow.com',
      type: 'forum',
      content: `# How to use React Hooks?

**Question:** What are the best practices for using React Hooks?

**Answer:** Here are some key points:

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Use useEffect for side effects
4. Use useState for local state

Example:
\`\`\`tsx
function MyComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\``,
      author: 'John Doe',
      publishedDate: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    },
    {
      url: 'https://github.com/facebook/react',
      title: 'React - GitHub Repository',
      snippet: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
      domain: 'github.com',
      type: 'documentation',
      content: `# React

React is a JavaScript library for building user interfaces.

## Installation
\`\`\`bash
npm install react react-dom
\`\`\`

## Features
- Declarative
- Component-Based
- Learn Once, Write Anywhere`,
      publishedDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
  ]

  return createWebProvider({
    searchWeb: async (query) => {
      return mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          (result.snippet &&
            result.snippet.toLowerCase().includes(query.toLowerCase()))
      )
    },
    fetchUrl: async (url) => {
      const result = mockResults.find((r) => r.url === url)
      return result?.content || ''
    },
  })
}
