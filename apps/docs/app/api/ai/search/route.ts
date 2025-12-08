import { NextResponse } from 'next/server'
import { searchData } from '@/lib/search-data'
import {
  type EnhancedSearchItem,
  type SearchAPIResponse,
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
 * AI-Optimized Search API
 *
 * Provides a searchable index of all documentation content
 * optimized for AI retrieval and RAG applications.
 *
 * @route GET /api/ai/search
 * @route GET /api/ai/search?q={query}
 * @route GET /api/ai/search?type={component|hook|guide|example|cookbook}
 * @route GET /api/ai/search?category={category}
 * @route OPTIONS /api/ai/search (CORS preflight)
 */

// Enhance search data with AI-friendly descriptions
function enhanceSearchData(): EnhancedSearchItem[] {
  // Component descriptions
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
      description:
        'Accessible button component with variants and loading states',
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

  return searchData
    .filter(
      (item) =>
        !item.href.includes('[') &&
        !item.href.includes('{') &&
        item.href.startsWith('/')
    )
    .map((item) => {
      // Clean up title and get base name
      const cleanTitle = item.title.replace(/[{}]/g, '').trim()
      const baseName = cleanTitle.split(' - ')[0].trim()

      // Get enhanced description based on type
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

      // Add category-based keywords
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
 * Returns searchable documentation index with filtering and pagination.
 * Supports query, type, category, page, and limit parameters.
 */
export async function GET(request: Request) {
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

    const query = searchParams.get('q')?.toLowerCase()
    const type = searchParams.get('type') as SearchItemType | null
    const category = searchParams.get('category')

    // Pagination parameters with defaults
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
    )

    let results = enhanceSearchData()

    // Filter by query
    if (query) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
      )
    }

    // Filter by type
    if (type) {
      results = results.filter((item) => item.type === type)
    }

    // Filter by category
    if (category) {
      results = results.filter((item) => item.category === category)
    }

    // Sort by relevance (exact title matches first)
    if (query) {
      results.sort((a, b) => {
        const aExact = a.title.toLowerCase() === query ? 1 : 0
        const bExact = b.title.toLowerCase() === query ? 1 : 0
        return bExact - aExact
      })
    }

    // Calculate pagination
    const totalResults = results.length
    const totalPages = Math.ceil(totalResults / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

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
      name: 'Clarity Chat Documentation Search',
      version: PACKAGE_VERSION,
      apiVersion: AI_API_VERSION,
      query: query || null,
      filters: {
        type: type || null,
        category: category || null,
      },
      pagination: {
        page,
        limit,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      totalResults,
      results: paginatedResults,
      availableTypes,
      availableCategories: [...new Set(results.map((r) => r.category))].sort(),
      usage: {
        searchByQuery: '/api/ai/search?q=streaming',
        filterByType: '/api/ai/search?type=component',
        filterByCategory: '/api/ai/search?category=reference',
        combineFilters: '/api/ai/search?q=token&type=hook',
        pagination: '/api/ai/search?page=2&limit=10',
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    console.error('[AI Search API] Error:', error)

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
