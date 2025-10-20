import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useClipboard } from '../use-clipboard'

describe('useClipboard', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('should return value, copied, copy, and reset', () => {
    const { result } = renderHook(() => useClipboard())

    expect(result.current.value).toBe('')
    expect(result.current.copied).toBe(false)
    expect(typeof result.current.copy).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Hello World')
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World')
    expect(result.current.value).toBe('Hello World')
    expect(result.current.copied).toBe(true)
  })

  it('should reset copied state after timeout', async () => {
    const { result } = renderHook(() => useClipboard({ timeout: 100 }))

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(result.current.copied).toBe(true)

    await waitFor(
      () => {
        expect(result.current.copied).toBe(false)
      },
      { timeout: 200 }
    )
  })

  it('should call onSuccess callback', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useClipboard({ onSuccess }))

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(onSuccess).toHaveBeenCalled()
  })

  it('should call onError callback on failure', async () => {
    const onError = vi.fn()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Failed')),
      },
    })

    const { result } = renderHook(() => useClipboard({ onError }))

    await act(async () => {
      try {
        await result.current.copy('Test')
      } catch (e) {
        // Expected to throw
      }
    })

    expect(onError).toHaveBeenCalled()
  })

  it('should manually reset copied state', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.copied).toBe(false)
  })
})
