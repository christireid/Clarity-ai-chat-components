import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWebGLAvailable } from './useWebGLAvailable'

describe('useWebGLAvailable', () => {
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    originalCreateElement = document.createElement.bind(document)
  })

  afterEach(() => {
    document.createElement = originalCreateElement
    vi.restoreAllMocks()
  })

  it('should return isChecked=false initially', () => {
    const { result } = renderHook(() => useWebGLAvailable())

    // Initial state before effect runs
    expect(result.current.isChecked).toBe(false)
  })

  it('should detect WebGL2 availability', async () => {
    const mockCanvas = {
      getContext: vi.fn((contextId: string) => {
        if (contextId === 'webgl2') {
          return {} // Mock WebGL2 context
        }
        return null
      }),
    }

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })

    const { result } = renderHook(() => useWebGLAvailable())

    await waitFor(() => {
      expect(result.current.isChecked).toBe(true)
    })

    expect(result.current.isAvailable).toBe(true)
    expect(result.current.version).toBe(2)
  })

  it('should fall back to WebGL1 when WebGL2 is unavailable', async () => {
    const mockCanvas = {
      getContext: vi.fn((contextId: string) => {
        if (contextId === 'webgl') {
          return {} // Mock WebGL1 context
        }
        return null
      }),
    }

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })

    const { result } = renderHook(() => useWebGLAvailable())

    await waitFor(() => {
      expect(result.current.isChecked).toBe(true)
    })

    expect(result.current.isAvailable).toBe(true)
    expect(result.current.version).toBe(1)
  })

  it('should return unavailable when no WebGL support', async () => {
    const mockCanvas = {
      getContext: vi.fn(() => null),
    }

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })

    const { result } = renderHook(() => useWebGLAvailable())

    await waitFor(() => {
      expect(result.current.isChecked).toBe(true)
    })

    expect(result.current.isAvailable).toBe(false)
    expect(result.current.version).toBe(0)
  })

  it('should handle errors gracefully', async () => {
    const mockCanvas = {
      getContext: vi.fn(() => {
        throw new Error('WebGL not supported')
      }),
    }

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })

    const { result } = renderHook(() => useWebGLAvailable())

    await waitFor(() => {
      expect(result.current.isChecked).toBe(true)
    })

    expect(result.current.isAvailable).toBe(false)
    expect(result.current.version).toBe(0)
  })
})
