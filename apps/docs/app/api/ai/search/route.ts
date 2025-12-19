import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { searchData } from '@/lib/search-data'
import { fuzzyScore } from '@/lib/fuzzy-search'
import {
  type EnhancedSearchItem,
  type SearchItemType,
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  createErrorResponse,
  validateSearchParams,
  getStableTimestamp,
} from '@/lib/ai/types'

/**
 * AI-Optimized Search API (v2)
 *
 * Premium search API with:
 * - Fuzzy matching with typo tolerance
 * - Relevance scoring and ranking
 * - Multi-field weighted search
 * - Query expansion with synonyms
 * - Faceted filtering
 * - Intelligent highlighting
 * - Pagination with cursor support
 * - Search suggestions
 * - Analytics-ready response
 *
 * @route GET /api/ai/search
 * @route GET /api/ai/search?q={query}
 * @route GET /api/ai/search?type={component|hook|guide|example|cookbook}
 * @route GET /api/ai/search?category={category}
 * @route GET /api/ai/search?fuzzy=true
 * @route OPTIONS /api/ai/search (CORS preflight)
 */

// Synonym expansions for query enhancement
const synonyms: Record<string, string[]> = {
  chat: ['message', 'conversation', 'talk'],
  stream: ['streaming', 'realtime', 'live', 'sse'],
  token: ['tokens', 'cost', 'usage', 'pricing'],
  optimize: ['optimization', 'performance', 'speed', 'fast'],
  hook: ['hooks', 'react hook', 'use'],
  component: ['components', 'ui', 'element'],
  error: ['errors', 'exception', 'bug', 'issue'],
  auth: ['authentication', 'authorization', 'login', 'security'],
  style: ['styling', 'css', 'theme', 'design'],
  api: ['apis', 'endpoint', 'route', 'backend'],
}

// Component descriptions for AI-friendly context
const componentDescriptions: Record<
  string,
  { description: string; keywords: string[] }
> = {
  ClarityChat: {
    description:
      'All-in-one chat component with built-in state management, streaming, and token optimization',
    keywords: ['chat', 'messages', 'streaming', 'main'],
  },
  ChatWindow: {
    description:
      'Container component for chat interfaces with responsive design and scroll management',
    keywords: ['container', 'layout', 'wrapper', 'responsive'],
  },
  MessageList: {
    description:
      'Display chat messages with virtualization support for performance',
    keywords: ['messages', 'display', 'virtual', 'scroll'],
  },
  ChatInput: {
    description:
      'User input component with voice, attachments, and keyboard shortcuts',
    keywords: ['input', 'text', 'voice', 'upload'],
  },
  StreamingMessage: {
    description: 'Real-time streaming response display with typing animation',
    keywords: ['streaming', 'realtime', 'typing', 'animation'],
  },
  ThinkingIndicator: {
    description: 'Animated loading indicator for AI processing states',
    keywords: ['loading', 'thinking', 'processing', 'indicator'],
  },
  TokenCounter: {
    description: 'Real-time token usage display with cost estimation',
    keywords: ['tokens', 'usage', 'cost', 'counter'],
  },
  Button: {
    description: 'Accessible button component with variants and loading states',
    keywords: ['button', 'action', 'click', 'ui'],
  },
  Avatar: {
    description: 'User and AI avatar with fallback and status indicators',
    keywords: ['avatar', 'image', 'user', 'profile'],
  },
  Toast: {
    description: 'Notification toast for success, error, and info messages',
    keywords: ['toast', 'notification', 'alert', 'message'],
  },
  CodeBlock: {
    description: 'Syntax-highlighted code display with copy button',
    keywords: ['code', 'syntax', 'highlight', 'copy'],
  },
  MarkdownRenderer: {
    description: 'Rich markdown rendering with math and diagram support',
    keywords: ['markdown', 'render', 'math', 'diagram'],
  },
  VoiceInput: {
    description: 'Speech-to-text input with real-time transcription',
    keywords: ['voice', 'speech', 'audio', 'transcription'],
  },
  FileUpload: {
    description: 'File and image upload component with drag-and-drop',
    keywords: ['file', 'upload', 'drag', 'drop', 'attachment'],
  },
}

// Hook descriptions
const hookDescriptions: Record<
  string,
  { description: string; keywords: string[] }
> = {
  useChat: {
    description:
      'Primary hook for managing chat state, messages, and operations',
    keywords: ['chat', 'state', 'messages', 'send'],
  },
  useStreaming: {
    description: 'Handle streaming responses with SSE or WebSocket',
    keywords: ['stream', 'sse', 'websocket', 'realtime'],
  },
  useTokenTracker: {
    description: 'Track token usage and estimate API costs',
    keywords: ['tokens', 'tracking', 'cost', 'usage'],
  },
  useTokenOptimization: {
    description: 'Optimize token usage through compression and pruning',
    keywords: ['optimize', 'compress', 'prune', 'tokens'],
  },
  useAutoScroll: {
    description: 'Auto-scroll to new messages with user pause detection',
    keywords: ['scroll', 'auto', 'bottom', 'messages'],
  },
  useClipboard: {
    description: 'Copy text to clipboard with success feedback',
    keywords: ['clipboard', 'copy', 'paste'],
  },
  useKeyboardShortcuts: {
    description: 'Register and manage keyboard shortcuts',
    keywords: ['keyboard', 'shortcuts', 'hotkeys'],
  },
  useVoiceInput: {
    description: 'Speech recognition for voice-to-text input',
    keywords: ['voice', 'speech', 'recognition', 'audio'],
  },
  useDebounce: {
    description: 'Debounce values for search and API calls',
    keywords: ['debounce', 'delay', 'throttle'],
  },
  useLocalStorage: {
    description: 'Persist state to localStorage with SSR safety',
    keywords: ['storage', 'persist', 'local', 'save'],
  },
  useMediaQuery: {
    description: 'Responsive design hook for media query matching',
    keywords: ['media', 'responsive', 'breakpoint', 'mobile'],
  },
  useErrorRecovery: {
    description: 'Automatic error recovery with retry and backoff',
    keywords: ['error', 'retry', 'recovery', 'backoff'],
  },
}

// Guide descriptions
const guideDescriptions: Record<
  string,
  { description: string; keywords: string[] }
> = {
  'Quick Start': {
    description: 'Get started with Clarity Chat in 5 minutes',
    keywords: ['start', 'begin', 'setup', 'install'],
  },
  Installation: {
    description: 'Install and configure Clarity Chat in your project',
    keywords: ['install', 'npm', 'setup', 'config'],
  },
  Streaming: {
    description: 'Implement real-time streaming responses',
    keywords: ['stream', 'realtime', 'sse', 'websocket'],
  },
  'Token Optimization': {
    description: 'Reduce API costs by optimizing token usage',
    keywords: ['tokens', 'optimize', 'cost', 'compress'],
  },
  Accessibility: {
    description: 'WCAG compliance and accessibility best practices',
    keywords: ['accessibility', 'a11y', 'wcag', 'keyboard'],
  },
  Performance: {
    description: 'Optimize chat performance for large conversations',
    keywords: ['performance', 'speed', 'optimize', 'fast'],
  },
  Security: {
    description: 'Security best practices for chat applications',
    keywords: ['security', 'auth', 'safe', 'protect'],
  },
  Mobile: {
    description: 'Mobile-optimized chat interfaces',
    keywords: ['mobile', 'responsive', 'touch', 'ios', 'android'],
  },
}

/**
 * Expand query with synonyms
 */
function expandQuery(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/)
  const expansions = new Set<string>([query])

  for (const term of terms) {
    if (synonyms[term]) {
      for (const syn of synonyms[term]) {
        expansions.add(query.toLowerCase().replace(term, syn))
      }
    }
  }

  return Array.from(expansions)
}

/**
 * Enhance search data with AI-friendly descriptions
 */
function enhanceSearchData(): EnhancedSearchItem[] {
  return searchData
    .filter(
      (item) =>
        !item.href.includes('[') &&
        !item.href.includes('{') &&
        item.href.startsWith('/')
    )
    .map((item) => {
      const cleanTitle = item.title.replace(/[{}]/g, '').trim()
      const baseName = cleanTitle.split(' - ')[0].trim()

      let enhancedDescription = item.description || ''
      let keywords: string[] = []

      if (item.type === 'component') {
        const desc = componentDescriptions[baseName]
        if (desc) {
          enhancedDescription = desc.description
          keywords = desc.keywords
        } else {
          keywords = ['component', 'ui', 'react']
        }
      } else if (item.type === 'hook') {
        const hookName = baseName.replace('use-', 'use').replace(/-/g, '')
        const desc = hookDescriptions[hookName] || hookDescriptions[baseName]
        if (desc) {
          enhancedDescription = desc.description
          keywords = desc.keywords
        } else {
          keywords = ['hook', 'react', 'state']
        }
      } else if (item.type === 'guide') {
        const desc = guideDescriptions[baseName]
        if (desc) {
          enhancedDescription = desc.description
          keywords = desc.keywords
        } else {
          keywords = ['guide', 'documentation', 'learn']
        }
      } else if (item.type === 'example') {
        keywords = ['example', 'demo', 'sample', 'code']
      } else if (item.type === 'cookbook') {
        keywords = ['cookbook', 'recipe', 'howto', 'tutorial']
      }

      if (item.category) {
        keywords.push(item.category)
      }

      return {
        title: cleanTitle,
        type: item.type as SearchItemType,
        href: item.href,
        fullUrl: `${BASE_URL}${item.href}`,
        description: enhancedDescription,
        category: item.category || 'general',
        keywords,
        lastUpdated: getStableTimestamp(),
      }
    })
}

/**
 * Calculate search relevance score
 */
function calculateRelevance(
  item: EnhancedSearchItem,
  query: string,
  useFuzzy: boolean
): { score: number; matchType: string; highlights: string[] } {
  const queryLower = query.toLowerCase()
  let score = 0
  let matchType = 'none'
  const highlights: string[] = []

  // Title matching (highest weight)
  const titleResult = fuzzyScore(query, item.title)
  if (titleResult.score > 0) {
    score += titleResult.score * 2 // 2x weight for title
    matchType = titleResult.matchType || 'contains'
    highlights.push(item.title)
  }

  // Description matching
  const descResult = fuzzyScore(query, item.description)
  if (descResult.score > 0) {
    score += descResult.score * 1.2 // 1.2x weight for description
    if (matchType === 'none') matchType = descResult.matchType || 'contains'
    highlights.push(item.description)
  }

  // Keyword matching
  for (const keyword of item.keywords) {
    if (
      keyword.toLowerCase().includes(queryLower) ||
      queryLower.includes(keyword.toLowerCase())
    ) {
      score += 30
      if (matchType === 'none') matchType = 'keyword'
    } else if (useFuzzy) {
      const keywordResult = fuzzyScore(query, keyword)
      if (keywordResult.score > 20) {
        score += keywordResult.score * 0.5
      }
    }
  }

  // Type/category bonus
  if (
    item.type.toLowerCase().includes(queryLower) ||
    item.category.toLowerCase().includes(queryLower)
  ) {
    score += 20
  }

  return { score, matchType, highlights: highlights.slice(0, 2) }
}

/**
 * Generate search suggestions based on partial query
 */
function generateSuggestions(
  query: string,
  results: EnhancedSearchItem[]
): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  // Suggest from matching titles
  for (const result of results.slice(0, 10)) {
    const words = result.title.toLowerCase().split(/\s+/)
    for (const word of words) {
      if (word.startsWith(queryLower) && word !== queryLower) {
        suggestions.add(word)
      }
    }
  }

  // Suggest from keywords
  for (const result of results.slice(0, 20)) {
    for (const keyword of result.keywords) {
      if (keyword.startsWith(queryLower) && keyword !== queryLower) {
        suggestions.add(keyword)
      }
    }
  }

  return Array.from(suggestions).slice(0, 5)
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: API_RESPONSE_HEADERS,
  })
}

/**
 * GET /api/ai/search
 *
 * Premium search endpoint with fuzzy matching, relevance scoring,
 * query expansion, and intelligent filtering.
 */
export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)

    // Validate search parameters
    const validation = validateSearchParams(searchParams)
    if (!validation.valid) {
      const errorResponse = createErrorResponse(
        'INVALID_PARAMS',
        'Invalid search parameters',
        '/api/ai/search',
        validation.errors.join('; ')
      )
      return NextResponse.json(errorResponse, {
        status: 400,
        headers: API_RESPONSE_HEADERS,
      })
    }

    const rawQuery = searchParams.get('q')?.trim()
    // Validate and limit query length to prevent abuse
    const query = rawQuery ? rawQuery.slice(0, 200) : undefined
    const type = searchParams.get('type') as SearchItemType | null
    const category = searchParams.get('category')
    const useFuzzy = searchParams.get('fuzzy') === 'true'
    const expandSynonyms = searchParams.get('expand') !== 'false'

    // Pagination with cursor support - handle NaN from invalid input
    const parsedPage = parseInt(searchParams.get('page') || '1', 10)
    const parsedLimit = parseInt(searchParams.get('limit') || '20', 10)
    const page = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage)
    const limit = Math.min(
      100,
      Math.max(1, Number.isNaN(parsedLimit) ? 20 : parsedLimit)
    )
    const cursor = searchParams.get('cursor')

    let results = enhanceSearchData()
    let expandedQueries: string[] = []
    let suggestions: string[] = []

    // Search with query
    if (query) {
      // Expand query with synonyms
      expandedQueries = expandSynonyms ? expandQuery(query) : [query]

      // Score all items
      const scoredResults = results.map((item) => {
        let bestScore = 0
        let bestMatchType = 'none'
        let bestHighlights: string[] = []

        for (const expandedQuery of expandedQueries) {
          const { score, matchType, highlights } = calculateRelevance(
            item,
            expandedQuery,
            useFuzzy
          )
          if (score > bestScore) {
            bestScore = score
            bestMatchType = matchType
            bestHighlights = highlights
          }
        }

        return {
          ...item,
          relevanceScore: bestScore,
          matchType: bestMatchType,
          highlights: bestHighlights,
        }
      })

      // Filter by minimum score
      const minScore = useFuzzy ? 10 : 20
      results = scoredResults
        .filter((r) => r.relevanceScore >= minScore)
        .sort(
          (a, b) => b.relevanceScore - a.relevanceScore
        ) as EnhancedSearchItem[]

      // Generate suggestions
      suggestions = generateSuggestions(query, results)
    }

    // Filter by type
    if (type) {
      results = results.filter((item) => item.type === type)
    }

    // Filter by category
    if (category) {
      results = results.filter((item) => item.category === category)
    }

    // Calculate facets
    const facets = {
      types: {} as Record<string, number>,
      categories: {} as Record<string, number>,
    }

    for (const result of results) {
      facets.types[result.type] = (facets.types[result.type] || 0) + 1
      facets.categories[result.category] =
        (facets.categories[result.category] || 0) + 1
    }

    // Pagination
    const totalResults = results.length
    const totalPages = Math.ceil(totalResults / limit)

    let startIndex = (page - 1) * limit
    if (cursor) {
      const cursorIndex = results.findIndex((r) => r.href === cursor)
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1
      }
    }

    const paginatedResults = results.slice(startIndex, startIndex + limit)
    const nextCursor =
      paginatedResults.length > 0
        ? paginatedResults[paginatedResults.length - 1]?.href
        : null

    const processingTime = Date.now() - startTime

    const availableTypes: SearchItemType[] = [
      'component',
      'hook',
      'guide',
      'example',
      'cookbook',
      'concept',
      'deployment',
      'integration',
    ]

    const response = {
      // API metadata
      name: 'Clarity Chat Documentation Search',
      version: PACKAGE_VERSION,
      apiVersion: AI_API_VERSION,

      // Query info
      query: query || null,
      expandedQueries: query && expandSynonyms ? expandedQueries : null,
      suggestions: query ? suggestions : null,

      // Filters
      filters: {
        type: type || null,
        category: category || null,
        fuzzy: useFuzzy,
        expand: expandSynonyms,
      },

      // Pagination
      pagination: {
        page,
        limit,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        cursor: nextCursor,
      },

      // Results with relevance
      totalResults,
      results: paginatedResults.map(
        (
          item: EnhancedSearchItem & {
            relevanceScore?: number
            matchType?: string
            highlights?: string[]
          }
        ) => ({
          ...item,
          relevance: item.relevanceScore
            ? {
                score: Math.round(item.relevanceScore),
                matchType: item.matchType,
                highlights: item.highlights,
              }
            : undefined,
        })
      ),

      // Facets for filtering UI
      facets,

      // Available options
      availableTypes,
      availableCategories: [...new Set(results.map((r) => r.category))].sort(),

      // Performance metrics
      meta: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
      },

      // Usage examples
      usage: {
        basicSearch: '/api/ai/search?q=streaming',
        fuzzySearch: '/api/ai/search?q=streeming&fuzzy=true',
        filterByType: '/api/ai/search?type=component',
        filterByCategory: '/api/ai/search?category=reference',
        combineFilters: '/api/ai/search?q=token&type=hook&fuzzy=true',
        pagination: '/api/ai/search?page=2&limit=10',
        cursorPagination: '/api/ai/search?cursor=/docs/hooks/use-chat&limit=10',
        disableExpansion: '/api/ai/search?q=hook&expand=false',
      },
    }

    return NextResponse.json(response, {
      headers: {
        ...API_RESPONSE_HEADERS,
        'X-Processing-Time': `${processingTime}ms`,
        'X-Total-Results': String(totalResults),
      },
    })
  } catch (error) {
    logger.error('[AI Search API] Error:', error)

    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred while searching',
      '/api/ai/search',
      error instanceof Error ? error.message : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
