/**
 * Search API Route Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock NextResponse
class MockNextResponse {
  data: unknown
  status: number
  headers: Map<string, string>

  constructor(
    body: unknown,
    options?: { status?: number; headers?: Record<string, string> }
  ) {
    this.data = body
    this.status = options?.status || 200
    this.headers = new Map(Object.entries(options?.headers || {}))
  }

  json() {
    return Promise.resolve(this.data)
  }

  static json(
    data: unknown,
    options?: { status?: number; headers?: Record<string, string> }
  ) {
    return new MockNextResponse(data, options)
  }
}

vi.mock('next/server', () => ({
  NextResponse: MockNextResponse,
}))

// Mock search data
vi.mock('@/lib/search-data', () => ({
  searchData: [
    {
      title: 'ClarityChat',
      type: 'component',
      href: '/reference/components/clarity-chat',
      category: 'reference',
    },
    {
      title: 'useChat',
      type: 'hook',
      href: '/reference/hooks/use-chat',
      category: 'reference',
    },
    {
      title: 'Getting Started',
      type: 'guide',
      href: '/guides/getting-started',
      category: 'guides',
    },
    {
      title: 'Streaming Example',
      type: 'example',
      href: '/examples/streaming',
      category: 'examples',
    },
  ],
}))

function createMockRequest(url: string): Request {
  return {
    url: `http://localhost:3000${url}`,
  } as Request
}

describe('Search API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/ai/search', () => {
    it('returns successful response without query', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      expect(data.name).toBe('Clarity Chat Documentation Search')
      expect(data.version).toBeDefined()
      expect(data.apiVersion).toBe('v1')
      expect(data.results).toBeInstanceOf(Array)
    })

    it('includes all required response fields', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('apiVersion')
      expect(data).toHaveProperty('query')
      expect(data).toHaveProperty('filters')
      expect(data).toHaveProperty('totalResults')
      expect(data).toHaveProperty('results')
      expect(data).toHaveProperty('availableTypes')
      expect(data).toHaveProperty('availableCategories')
      expect(data).toHaveProperty('usage')
    })

    it('filters by query parameter', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search?q=chat'))
      const data = await response.json()

      expect(data.query).toBe('chat')
      // All results should contain 'chat' in title, description, or keywords
      data.results.forEach((result: { title: string }) => {
        const matches =
          result.title.toLowerCase().includes('chat') ||
          JSON.stringify(result).toLowerCase().includes('chat')
        expect(matches).toBe(true)
      })
    })

    it('filters by type parameter', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest('/api/ai/search?type=component')
      )
      const data = await response.json()

      expect(data.filters.type).toBe('component')
      data.results.forEach((result: { type: string }) => {
        expect(result.type).toBe('component')
      })
    })

    it('filters by category parameter', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest('/api/ai/search?category=reference')
      )
      const data = await response.json()

      expect(data.filters.category).toBe('reference')
      data.results.forEach((result: { category: string }) => {
        expect(result.category).toBe('reference')
      })
    })

    it('combines multiple filters', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest('/api/ai/search?type=component&category=reference')
      )
      const data = await response.json()

      expect(data.filters.type).toBe('component')
      expect(data.filters.category).toBe('reference')
    })

    it('returns empty results for no matches', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest('/api/ai/search?q=xyznonexistent')
      )
      const data = await response.json()

      expect(data.totalResults).toBe(0)
      expect(data.results).toHaveLength(0)
    })

    it('includes usage examples in response', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      expect(data.usage.searchByQuery).toBeDefined()
      expect(data.usage.filterByType).toBeDefined()
      expect(data.usage.filterByCategory).toBeDefined()
      expect(data.usage.combineFilters).toBeDefined()
    })

    it('returns available types', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      expect(data.availableTypes).toContain('component')
      expect(data.availableTypes).toContain('hook')
      expect(data.availableTypes).toContain('guide')
      expect(data.availableTypes).toContain('example')
    })

    it('returns sorted available categories', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      const sortedCategories = [...data.availableCategories].sort()
      expect(data.availableCategories).toEqual(sortedCategories)
    })

    it('search results include fullUrl', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(createMockRequest('/api/ai/search'))
      const data = await response.json()

      data.results.forEach((result: { fullUrl: string; href: string }) => {
        expect(result.fullUrl).toContain('https://clarity-chat.dev')
        expect(result.fullUrl).toContain(result.href)
      })
    })

    it('validates query length', async () => {
      const longQuery = 'a'.repeat(201)
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest(`/api/ai/search?q=${longQuery}`)
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error.code).toBe('INVALID_PARAMS')
    })

    it('validates type parameter', async () => {
      const { GET } = await import('../search/route')
      const response = await GET(
        createMockRequest('/api/ai/search?type=invalid')
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error.code).toBe('INVALID_PARAMS')
    })

    it('case insensitive search', async () => {
      const { GET } = await import('../search/route')
      const response1 = await GET(createMockRequest('/api/ai/search?q=CHAT'))
      const response2 = await GET(createMockRequest('/api/ai/search?q=chat'))

      const data1 = await response1.json()
      const data2 = await response2.json()

      expect(data1.totalResults).toBe(data2.totalResults)
    })
  })

  describe('OPTIONS /api/ai/search', () => {
    it('returns 204 No Content', async () => {
      const { OPTIONS } = await import('../search/route')
      const response = await OPTIONS()

      expect(response.status).toBe(204)
    })
  })
})
