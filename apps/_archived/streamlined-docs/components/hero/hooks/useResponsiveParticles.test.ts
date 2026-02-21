import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useResponsiveParticles } from './useResponsiveParticles'
import { PARTICLE_COUNTS } from '../particle-config'

describe('useResponsiveParticles', () => {
  let originalInnerWidth: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    vi.useFakeTimers()
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
  }

  it('should return desktop count for large viewports', async () => {
    setWindowWidth(1440)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.shouldRender).toBe(true)
    })

    expect(result.current.count).toBe(PARTICLE_COUNTS.desktop)
    expect(result.current.device).toBe('desktop')
  })

  it('should return tablet count for medium viewports', async () => {
    setWindowWidth(900)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.shouldRender).toBe(true)
    })

    expect(result.current.count).toBe(PARTICLE_COUNTS.tablet)
    expect(result.current.device).toBe('tablet')
  })

  it('should return mobile count for small viewports', async () => {
    setWindowWidth(600)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.shouldRender).toBe(true)
    })

    expect(result.current.count).toBe(PARTICLE_COUNTS.mobile)
    expect(result.current.device).toBe('mobile')
  })

  it('should not render for very small viewports', async () => {
    setWindowWidth(400)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.device).toBe('mobile')
    })

    expect(result.current.shouldRender).toBe(false)
    expect(result.current.count).toBe(0)
  })

  it('should use custom count when provided', async () => {
    setWindowWidth(1440)
    const customCount = 1500

    const { result } = renderHook(() => useResponsiveParticles(customCount))

    await waitFor(() => {
      expect(result.current.shouldRender).toBe(true)
    })

    expect(result.current.count).toBe(customCount)
  })

  it('should update on window resize', async () => {
    setWindowWidth(1440)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.device).toBe('desktop')
    })

    // Change window size
    act(() => {
      setWindowWidth(600)
      window.dispatchEvent(new Event('resize'))
    })

    // Wait for debounce
    act(() => {
      vi.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(result.current.device).toBe('mobile')
    })

    expect(result.current.count).toBe(PARTICLE_COUNTS.mobile)
  })

  it('should debounce resize events', async () => {
    setWindowWidth(1440)

    const { result } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      expect(result.current.device).toBe('desktop')
    })

    // Fire multiple resize events rapidly
    act(() => {
      setWindowWidth(800)
      window.dispatchEvent(new Event('resize'))
      setWindowWidth(600)
      window.dispatchEvent(new Event('resize'))
      setWindowWidth(900)
      window.dispatchEvent(new Event('resize'))
    })

    // Should still be desktop before debounce completes
    expect(result.current.device).toBe('desktop')

    // Wait for debounce
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Should now be tablet (last value: 900px)
    await waitFor(() => {
      expect(result.current.device).toBe('tablet')
    })
  })

  it('should clean up resize listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    setWindowWidth(1440)

    const { unmount } = renderHook(() => useResponsiveParticles())

    await waitFor(() => {
      // Wait for initial setup
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )
  })
})
