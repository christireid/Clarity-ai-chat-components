import { NextResponse } from 'next/server'
import { searchData } from '@/lib/search-data'

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
 */

interface EnhancedSearchItem {
  title: string
  type: 'component' | 'hook' | 'guide' | 'example' | 'cookbook' | 'concept' | 'deployment' | 'integration'
  href: string
  fullUrl: string
  description: string
  category: string
  keywords: string[]
  lastUpdated?: string
}

// Enhance search data with AI-friendly descriptions
function enhanceSearchData(): EnhancedSearchItem[] {
  const baseUrl = 'https://clarity-chat.dev'

  // Component descriptions
  const componentDescriptions: Record<string, { description: string; keywords: string[] }> = {
    'ClarityChat': { description: 'All-in-one chat component with built-in state management, streaming, and token optimization', keywords: ['chat', 'messages', 'streaming', 'main'] },
    'ChatWindow': { description: 'Container component for chat interfaces with responsive design and scroll management', keywords: ['container', 'layout', 'wrapper', 'responsive'] },
    'MessageList': { description: 'Display chat messages with virtualization support for performance', keywords: ['messages', 'display', 'virtual', 'scroll'] },
    'ChatInput': { description: 'User input component with voice, attachments, and keyboard shortcuts', keywords: ['input', 'text', 'voice', 'upload'] },
    'StreamingMessage': { description: 'Real-time streaming response display with typing animation', keywords: ['streaming', 'realtime', 'typing', 'animation'] },
    'ThinkingIndicator': { description: 'Animated loading indicator for AI processing states', keywords: ['loading', 'thinking', 'processing', 'indicator'] },
    'TokenCounter': { description: 'Real-time token usage display with cost estimation', keywords: ['tokens', 'usage', 'cost', 'counter'] },
    'Button': { description: 'Accessible button component with variants and loading states', keywords: ['button', 'action', 'click', 'ui'] },
    'Avatar': { description: 'User and AI avatar with fallback and status indicators', keywords: ['avatar', 'image', 'user', 'profile'] },
    'Toast': { description: 'Notification toast for success, error, and info messages', keywords: ['toast', 'notification', 'alert', 'message'] },
    'CodeBlock': { description: 'Syntax-highlighted code display with copy button', keywords: ['code', 'syntax', 'highlight', 'copy'] },
    'MarkdownRenderer': { description: 'Rich markdown rendering with math and diagram support', keywords: ['markdown', 'render', 'math', 'diagram'] },
    'VoiceInput': { description: 'Speech-to-text input with real-time transcription', keywords: ['voice', 'speech', 'audio', 'transcription'] },
    'FileUpload': { description: 'File and image upload component with drag-and-drop', keywords: ['file', 'upload', 'drag', 'drop', 'attachment'] },
  }

  // Hook descriptions
  const hookDescriptions: Record<string, { description: string; keywords: string[] }> = {
    'useChat': { description: 'Primary hook for managing chat state, messages, and operations', keywords: ['chat', 'state', 'messages', 'send'] },
    'useStreaming': { description: 'Handle streaming responses with SSE or WebSocket', keywords: ['stream', 'sse', 'websocket', 'realtime'] },
    'useTokenTracker': { description: 'Track token usage and estimate API costs', keywords: ['tokens', 'tracking', 'cost', 'usage'] },
    'useTokenOptimization': { description: 'Optimize token usage through compression and pruning', keywords: ['optimize', 'compress', 'prune', 'tokens'] },
    'useAutoScroll': { description: 'Auto-scroll to new messages with user pause detection', keywords: ['scroll', 'auto', 'bottom', 'messages'] },
    'useClipboard': { description: 'Copy text to clipboard with success feedback', keywords: ['clipboard', 'copy', 'paste'] },
    'useKeyboardShortcuts': { description: 'Register and manage keyboard shortcuts', keywords: ['keyboard', 'shortcuts', 'hotkeys'] },
    'useVoiceInput': { description: 'Speech recognition for voice-to-text input', keywords: ['voice', 'speech', 'recognition', 'audio'] },
    'useDebounce': { description: 'Debounce values for search and API calls', keywords: ['debounce', 'delay', 'throttle'] },
    'useLocalStorage': { description: 'Persist state to localStorage with SSR safety', keywords: ['storage', 'persist', 'local', 'save'] },
    'useMediaQuery': { description: 'Responsive design hook for media query matching', keywords: ['media', 'responsive', 'breakpoint', 'mobile'] },
    'useErrorRecovery': { description: 'Automatic error recovery with retry and backoff', keywords: ['error', 'retry', 'recovery', 'backoff'] },
  }

  // Guide descriptions
  const guideDescriptions: Record<string, { description: string; keywords: string[] }> = {
    'Quick Start': { description: 'Get started with Clarity Chat in 5 minutes', keywords: ['start', 'begin', 'setup', 'install'] },
    'Installation': { description: 'Install and configure Clarity Chat in your project', keywords: ['install', 'npm', 'setup', 'config'] },
    'Streaming': { description: 'Implement real-time streaming responses', keywords: ['stream', 'realtime', 'sse', 'websocket'] },
    'Token Optimization': { description: 'Reduce API costs by optimizing token usage', keywords: ['tokens', 'optimize', 'cost', 'compress'] },
    'Accessibility': { description: 'WCAG compliance and accessibility best practices', keywords: ['accessibility', 'a11y', 'wcag', 'keyboard'] },
    'Performance': { description: 'Optimize chat performance for large conversations', keywords: ['performance', 'speed', 'optimize', 'fast'] },
    'Security': { description: 'Security best practices for chat applications', keywords: ['security', 'auth', 'safe', 'protect'] },
    'Mobile': { description: 'Mobile-optimized chat interfaces', keywords: ['mobile', 'responsive', 'touch', 'ios', 'android'] },
  }

  return searchData
    .filter(item => !item.href.includes('[') && !item.href.includes('{') && item.href.startsWith('/'))
    .map(item => {
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
        type: item.type,
        href: item.href,
        fullUrl: `${baseUrl}${item.href}`,
        description: enhancedDescription,
        category: item.category || 'general',
        keywords,
        lastUpdated: new Date().toISOString(),
      }
    })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase()
  const type = searchParams.get('type')
  const category = searchParams.get('category')

  let results = enhanceSearchData()

  // Filter by query
  if (query) {
    results = results.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.keywords.some(k => k.toLowerCase().includes(query))
    )
  }

  // Filter by type
  if (type) {
    results = results.filter(item => item.type === type)
  }

  // Filter by category
  if (category) {
    results = results.filter(item => item.category === category)
  }

  // Sort by relevance (exact title matches first)
  if (query) {
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query ? 1 : 0
      const bExact = b.title.toLowerCase() === query ? 1 : 0
      return bExact - aExact
    })
  }

  const response = {
    name: 'Clarity Chat Documentation Search',
    version: '0.1.0',
    query: query || null,
    filters: {
      type: type || null,
      category: category || null,
    },
    totalResults: results.length,
    results,
    availableTypes: ['component', 'hook', 'guide', 'example', 'cookbook', 'concept', 'deployment', 'integration'],
    availableCategories: [...new Set(results.map(r => r.category))].sort(),
    usage: {
      searchByQuery: '/api/ai/search?q=streaming',
      filterByType: '/api/ai/search?type=component',
      filterByCategory: '/api/ai/search?category=reference',
      combineFilters: '/api/ai/search?q=token&type=hook',
    },
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json',
    },
  })
}
