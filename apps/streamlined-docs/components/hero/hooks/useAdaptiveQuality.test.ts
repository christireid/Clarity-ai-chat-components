import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAdaptiveQuality } from './useAdaptiveQuality'

describe('useAdaptiveQuality', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start with 100% quality level', () => {
    const { result } = renderHook(() => useAdaptiveQuality())

    expect(result.current.qualityLevel).toBe(100)
  })

  it('should not disable effects at initial quality', () => {
    const { result } = renderHook(() => useAdaptiveQuality())

    expect(result.current.shouldDisableEffects).toBe(false)
  })

  it('should provide current FPS as a number', () => {
    const { result } = renderHook(() => useAdaptiveQuality())

    expect(typeof result.current.currentFps).toBe('number')
  })

  it('should accept custom configuration', () => {
    const { result } = renderHook(() =>
      useAdaptiveQuality({
        targetFps: 30,
        measurementInterval: 500,
        qualityStep: 5,
        minQuality: 20,
      })
    )

    expect(result.current.qualityLevel).toBe(100)
  })

  it('should clean up animation frame on unmount', () => {
    const { unmount } = renderHook(() => useAdaptiveQuality())

    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('should expose isRecovering as false initially', () => {
    const { result } = renderHook(() => useAdaptiveQuality())

    expect(result.current.isRecovering).toBe(false)
  })

  it('should have shouldDisableEffects as boolean', () => {
    const { result } = renderHook(() => useAdaptiveQuality())

    expect(typeof result.current.shouldDisableEffects).toBe('boolean')
  })
})
