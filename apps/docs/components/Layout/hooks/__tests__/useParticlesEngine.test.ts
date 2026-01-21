import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useParticlesEngine } from '../useParticlesEngine'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

vi.mock('@tsparticles/react', () => ({
  initParticlesEngine: vi.fn(),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn(() => Promise.resolve()),
}))

const mockInitParticlesEngine = vi.mocked(initParticlesEngine)

describe('useParticlesEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize successfully', async () => {
    mockInitParticlesEngine.mockResolvedValue(undefined as any)

    const { result } = renderHook(() => useParticlesEngine())

    expect(result.current.isInitializing).toBe(true)
    expect(result.current.isInitialized).toBe(false)

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.isInitializing).toBe(false)
  })

  it('should handle initialization errors', async () => {
    const error = new Error('Initialization failed')
    mockInitParticlesEngine.mockRejectedValue(error)

    const { result } = renderHook(() => useParticlesEngine())

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isInitializing).toBe(false)
  })

  it('should cleanup on unmount', () => {
    mockInitParticlesEngine.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    )

    const { unmount } = renderHook(() => useParticlesEngine())
    unmount()

    // Should not throw or cause memory leaks
    expect(mockInitParticlesEngine).toHaveBeenCalled()
  })
})
