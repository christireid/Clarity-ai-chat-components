/**
 * Tests for useClarityObject hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useClarityObject } from '../use-clarity-object'

// Mock fetch
global.fetch = vi.fn()

interface TestProduct {
  name: string
  price: number
  description: string
}

describe('useClarityObject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with null object', () => {
    const { result } = renderHook(() =>
      useClarityObject<TestProduct>({
        api: '/api/generate-product',
      })
    )

    expect(result.current.object).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should initialize with initialInput', () => {
    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
        initialInput: { query: 'laptop' },
      })
    )

    expect(result.current.input).toEqual({ query: 'laptop' })
  })

  it('should handle non-streaming object generation', async () => {
    const mockProduct: TestProduct = {
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop',
    }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ object: mockProduct }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.object).not.toBeNull()
    })

    expect(result.current.object).toEqual(mockProduct)
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle streaming object generation', async () => {
    const mockProduct: TestProduct = {
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop',
    }

    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(mockProduct)}\n\n`)
          )
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
        stream: true,
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.object).not.toBeNull()
    }, { timeout: 3000 })

    expect(result.current.object).toEqual(mockProduct)
  })

  it('should handle errors', async () => {
    const mockError = new Error('Network error')
    vi.mocked(fetch).mockRejectedValueOnce(mockError)

    const onError = vi.fn()

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
        onError,
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.error).toBe(mockError)
    expect(onError).toHaveBeenCalledWith(mockError)
  })

  it('should handle API errors', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.error?.message).toContain('500')
  })

  it('should call onFinish callback', async () => {
    const mockProduct: TestProduct = {
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop',
    }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ object: mockProduct }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const onFinish = vi.fn()

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
        onFinish,
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled()
    })

    expect(onFinish).toHaveBeenCalledWith(mockProduct, { query: 'laptop' })
  })

  it('should support setInput', () => {
    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
      })
    )

    result.current.setInput({ query: 'phone' })
    expect(result.current.input).toEqual({ query: 'phone' })
  })

  it('should support reset', async () => {
    const mockProduct: TestProduct = {
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop',
    }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ object: mockProduct }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
      })
    )

    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.object).not.toBeNull()
    })

    result.current.reset()

    expect(result.current.object).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should require input for run', async () => {
    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
      })
    )

    await result.current.run()

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.error?.message).toContain('Input is required')
  })

  it('should handle overrideInput in run', async () => {
    const mockProduct: TestProduct = {
      name: 'MacBook Pro',
      price: 1999,
      description: 'High-performance laptop',
    }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ object: mockProduct }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityObject<TestProduct, { query: string }>({
        api: '/api/generate-product',
        initialInput: { query: 'phone' },
      })
    )

    // Override input in run call
    await result.current.run({ query: 'laptop' })

    await waitFor(() => {
      expect(result.current.object).not.toBeNull()
    })

    // Verify the request was made with override input
    expect(fetch).toHaveBeenCalledWith(
      '/api/generate-product',
      expect.objectContaining({
        body: expect.stringContaining('"query":"laptop"'),
      })
    )
  })
})
