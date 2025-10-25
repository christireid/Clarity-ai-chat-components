import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useErrorHandler } from '../../src/hooks/useErrorHandler'
import { ClarityChatError, ConfigurationError } from '../../src/errors'

describe('useErrorHandler', () => {
  it('should handle error and log to console in development', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    const { result } = renderHook(() => useErrorHandler({ logErrors: true }))
    const error = new Error('Test error')

    act(() => {
      result.current.handleError(error)
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should call custom error handler', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useErrorHandler({
        logErrors: false,
        onError,
      })
    )
    const error = new Error('Test error')

    act(() => {
      result.current.handleError(error)
    })

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should handle ClarityChatError with full details', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    const { result } = renderHook(() => useErrorHandler({ logErrors: true }))
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      solution: 'Try this fix',
      docs: 'https://example.com/docs',
      context: { key: 'value' },
    })

    act(() => {
      result.current.handleError(error)
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should handle non-Error objects', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useErrorHandler({
        logErrors: false,
        onError,
      })
    )

    act(() => {
      result.current.handleError('string error')
    })

    expect(onError).toHaveBeenCalled()
    const calledError = onError.mock.calls[0]?.[0]
    expect(calledError).toBeInstanceOf(Error)
    expect(calledError?.message).toBe('string error')
  })

  it('should respect logErrors option', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    const { result } = renderHook(() => useErrorHandler({ logErrors: false }))

    act(() => {
      result.current.handleError(new Error('Test'))
    })

    // Should not log when logErrors is false
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should handle showToast option', () => {
    const consoleInfoSpy = vi.spyOn(console, 'info')
    const { result } = renderHook(() =>
      useErrorHandler({
        logErrors: true,
        showToast: true,
      })
    )

    act(() => {
      result.current.handleError(new Error('Toast test'))
    })

    // In current implementation, it logs that toast would be shown
    expect(consoleInfoSpy).toHaveBeenCalled()
  })

  it('should handle different error types', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useErrorHandler({
        logErrors: false,
        onError,
      })
    )

    const errors = [
      new Error('Regular error'),
      new ConfigurationError('Config error', { code: 'CONFIG_ERROR' }),
      'String error',
      { message: 'Object error' },
      null,
      undefined,
    ]

    errors.forEach((error) => {
      act(() => {
        result.current.handleError(error)
      })
    })

    expect(onError).toHaveBeenCalledTimes(errors.length)
  })
})
