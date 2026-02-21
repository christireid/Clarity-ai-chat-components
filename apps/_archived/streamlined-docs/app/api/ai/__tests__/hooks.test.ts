/**
 * Hooks API Route Tests
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

describe('Hooks API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/ai/hooks', () => {
    it('returns successful response with hooks', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      expect(data.name).toBe('Clarity Chat Hooks')
      expect(data.version).toBeDefined()
      expect(data.apiVersion).toBe('v1')
      expect(data.hooks).toBeInstanceOf(Array)
      expect(data.totalHooks).toBeGreaterThan(0)
    })

    it('includes all required response fields', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('apiVersion')
      expect(data).toHaveProperty('description')
      expect(data).toHaveProperty('totalHooks')
      expect(data).toHaveProperty('categories')
      expect(data).toHaveProperty('lastUpdated')
      expect(data).toHaveProperty('hooks')
      expect(data).toHaveProperty('usage')
    })

    it('includes usage information', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      expect(data.usage.installation).toBe('npm install @clarity-chat/react')
      expect(data.usage.basicImport).toContain('useChat')
      expect(data.usage.documentation).toContain('/reference/hooks')
    })

    it('returns unique categories', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      const uniqueCategories = [...new Set(data.categories)]
      expect(data.categories).toEqual(uniqueCategories)
    })

    it('each hook has required fields', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      data.hooks.forEach(
        (hook: {
          name: string
          description: string
          category: string
          signature: string
          parameters: unknown[]
          returns: unknown
          importPath: string
          docsUrl: string
          examples: unknown[]
          version: string
        }) => {
          expect(hook).toHaveProperty('name')
          expect(hook).toHaveProperty('description')
          expect(hook).toHaveProperty('category')
          expect(hook).toHaveProperty('signature')
          expect(hook).toHaveProperty('parameters')
          expect(hook).toHaveProperty('returns')
          expect(hook).toHaveProperty('importPath')
          expect(hook).toHaveProperty('docsUrl')
          expect(hook).toHaveProperty('examples')
          expect(hook).toHaveProperty('version')
        }
      )
    })

    it('hook parameters have required fields', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      data.hooks.forEach(
        (hook: {
          parameters: Array<{
            name: string
            type: string
            required: boolean
            description: string
          }>
        }) => {
          hook.parameters.forEach((param) => {
            expect(param).toHaveProperty('name')
            expect(param).toHaveProperty('type')
            expect(param).toHaveProperty('required')
            expect(param).toHaveProperty('description')
          })
        }
      )
    })

    it('hook returns have required fields', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      data.hooks.forEach(
        (hook: { returns: { type: string; properties: unknown[] } }) => {
          expect(hook.returns).toHaveProperty('type')
          expect(hook.returns).toHaveProperty('properties')
        }
      )
    })

    it('returns valid lastUpdated timestamp', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      expect(() => new Date(data.lastUpdated)).not.toThrow()
    })

    it('includes known core hooks', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      const hookNames = data.hooks.map((h: { name: string }) => h.name)

      expect(hookNames).toContain('useChat')
      expect(hookNames).toContain('useStreaming')
      expect(hookNames).toContain('useTokenTracker')
    })

    it('hook names follow React convention (use prefix)', async () => {
      const { GET } = await import('../hooks/route')
      const response = await GET()
      const data = await response.json()

      data.hooks.forEach((hook: { name: string }) => {
        expect(hook.name).toMatch(/^use[A-Z]/)
      })
    })
  })

  describe('OPTIONS /api/ai/hooks', () => {
    it('returns 204 No Content', async () => {
      const { OPTIONS } = await import('../hooks/route')
      const response = await OPTIONS()

      expect(response.status).toBe(204)
    })
  })
})
