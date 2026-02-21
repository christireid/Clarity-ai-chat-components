/**
 * Components API Route Tests
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
  NextRequest: class MockNextRequest {
    url: string
    method: string
    headers: Map<string, string>

    constructor(input: string | URL, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.toString()
      this.method = init?.method || 'GET'
      this.headers = new Map()
    }
  }
}))

// Helper to create a mock request
function createMockRequest(url = 'http://localhost/api/ai/components') {
  return { url } as { url: string }
}

describe('Components API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/ai/components', () => {
    it('returns successful response with components', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      expect(data.name).toBe('Clarity Chat Components')
      expect(data.version).toBeDefined()
      expect(data.apiVersion).toBe('v1')
      expect(data.components).toBeInstanceOf(Array)
      expect(data.totalComponents).toBeGreaterThan(0)
    })

    it('includes all required response fields', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('apiVersion')
      expect(data).toHaveProperty('description')
      expect(data).toHaveProperty('totalComponents')
      expect(data).toHaveProperty('categories')
      expect(data).toHaveProperty('lastUpdated')
      expect(data).toHaveProperty('components')
      expect(data).toHaveProperty('usage')
    })

    it('includes usage information', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      expect(data.usage.installation).toBe('npm install @clarity-chat/react')
      expect(data.usage.basicImport).toContain('@clarity-chat/react')
      expect(data.usage.documentation).toBeDefined()
    })

    it('returns unique categories', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      const uniqueCategories = [...new Set(data.categories)]
      expect(data.categories).toEqual(uniqueCategories)
    })

    it('each component has required fields', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      data.components.forEach(
        (component: {
          name: string
          description: string
          category: string
          props: unknown[]
          importPath: string
          docsUrl: string
          examples: unknown[]
          version: string
        }) => {
          expect(component).toHaveProperty('name')
          expect(component).toHaveProperty('description')
          expect(component).toHaveProperty('category')
          expect(component).toHaveProperty('props')
          expect(component).toHaveProperty('importPath')
          expect(component).toHaveProperty('docsUrl')
          expect(component).toHaveProperty('examples')
          expect(component).toHaveProperty('version')
        }
      )
    })

    it('component props have required fields', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      data.components.forEach(
        (component: {
          props: Array<{
            name: string
            type: string
            required: boolean
            description: string
          }>
        }) => {
          component.props.forEach((prop) => {
            expect(prop).toHaveProperty('name')
            expect(prop).toHaveProperty('type')
            expect(prop).toHaveProperty('required')
            expect(prop).toHaveProperty('description')
          })
        }
      )
    })

    it('returns valid lastUpdated timestamp', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      expect(() => new Date(data.lastUpdated)).not.toThrow()
    })

    it('includes known core components', async () => {
      const { GET } = await import('../components/route')
      const response = await GET(createMockRequest() as never)
      const data = await response.json()

      const componentNames = data.components.map(
        (c: { name: string }) => c.name
      )

      expect(componentNames).toContain('ClarityChat')
      expect(componentNames).toContain('ChatWindow')
      expect(componentNames).toContain('MessageList')
      expect(componentNames).toContain('ChatInput')
    })
  })

  describe('OPTIONS /api/ai/components', () => {
    it('returns 204 No Content', async () => {
      const { OPTIONS } = await import('../components/route')
      const response = await OPTIONS()

      expect(response.status).toBe(204)
    })
  })
})
