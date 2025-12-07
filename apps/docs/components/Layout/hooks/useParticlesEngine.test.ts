/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useParticlesEngine } from './useParticlesEngine'

// Mock the dynamic import
vi.mock('@tsparticles/react', () => ({
  initParticlesEngine: vi.fn(() => Promise.resolve()),
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn(() => Promise.resolve()),
}))

describe('useParticlesEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes engine successfully', async () => {
    const { result } = renderHook(() => useParticlesEngine())

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true)
    })

    expect(result.current.error).toBe(null)
  })

  it('handles initialization errors', async () => {
    const { initParticlesEngine } = await import('@tsparticles/react')
    vi.mocked(initParticlesEngine).mockRejectedValueOnce(new Error('Init failed'))

    const { result } = renderHook(() => useParticlesEngine())

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.error?.message).toBe('Init failed')
  })

  it('prevents state updates after unmount', async () => {
    const { result, unmount } = renderHook(() => useParticlesEngine())

    unmount()

    // Wait a bit to ensure no state updates occur
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should not have initialized after unmount
    expect(result.current.isInitialized).toBe(false)
  })
})
