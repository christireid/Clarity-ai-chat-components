import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useEnhancedErrorHandler } from '../../src/hooks/useEnhancedErrorHandler'
import { ApiError, ApiErrorCode } from '../../src/errors/api-error'

// Wrapper component that provides ErrorBoundary context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={<div>Error</div>}>{children}</ErrorBoundary>
)

describe('useEnhancedErrorHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      expect(result.current.error).toBeNull()
      expect(result.current.hasError).toBe(false)
      expect(result.current.isRecoverable).toBe(false)
    })

    it('should accept custom options', () => {
      const onError = vi.fn()
      const { result } = renderHook(
        () =>
          useEnhancedErrorHandler({
            onError,
            showBoundary: false,
            logInDev: false,
          }),
        { wrapper }
      )

      expect(result.current.error).toBeNull()
    })
  })

  describe('handleError', () => {
    it('should handle Error objects', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })
      const testError = new Error('Test error')

      act(() => {
        result.current.handleError(testError)
      })

      expect(result.current.error).toBe(testError)
      expect(result.current.hasError).toBe(true)
    })

    it('should normalize non-Error values to Error', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError('string error')
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('string error')
    })

    it('should normalize object errors', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError({ message: 'object error' })
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('[object Object]')
    })

    it('should call onError callback', () => {
      const onError = vi.fn()
      const { result } = renderHook(
        () => useEnhancedErrorHandler({ onError }),
        { wrapper }
      )

      const testError = new Error('Test')

      act(() => {
        result.current.handleError(testError)
      })

      expect(onError).toHaveBeenCalledWith(testError)
    })

    it('should log errors in development when logInDev is true', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(
        () => useEnhancedErrorHandler({ logInDev: true }),
        { wrapper }
      )

      act(() => {
        result.current.handleError(new Error('Test'))
      })

      expect(consoleSpy).toHaveBeenCalled()

      process.env['NODE_ENV'] = originalEnv
      consoleSpy.mockRestore()
    })

    it('should log ClarityError details in development', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(
        () => useEnhancedErrorHandler({ logInDev: true }),
        { wrapper }
      )

      const apiError = new ApiError('API failed', {
        code: ApiErrorCode.SERVER_ERROR,
        statusCode: 500,
      })

      act(() => {
        result.current.handleError(apiError)
      })

      // Should be called twice: once for error, once for details
      expect(consoleSpy).toHaveBeenCalledTimes(2)
      expect(consoleSpy).toHaveBeenCalledWith(
        '[useEnhancedErrorHandler]',
        expect.any(ApiError)
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        'Details:',
        expect.any(Object)
      )

      process.env['NODE_ENV'] = originalEnv
      consoleSpy.mockRestore()
    })

    it('should identify recoverable ClarityErrors', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const recoverableError = new ApiError('Rate limited', {
        code: ApiErrorCode.RATE_LIMITED,
        statusCode: 429,
        recoverable: true,
      })

      act(() => {
        result.current.handleError(recoverableError)
      })

      expect(result.current.isRecoverable).toBe(true)
    })

    it('should identify non-recoverable errors', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      // 5xx errors are non-recoverable by default in ApiError
      const nonRecoverableError = new ApiError('Server Error', {
        code: ApiErrorCode.SERVER_ERROR,
        statusCode: 500,
      })

      act(() => {
        result.current.handleError(nonRecoverableError)
      })

      expect(result.current.isRecoverable).toBe(false)
    })
  })

  describe('handleAsync', () => {
    it('should return result on successful promise', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const value = await act(async () => {
        return result.current.handleAsync(Promise.resolve('success'))
      })

      expect(value).toBe('success')
      expect(result.current.error).toBeNull()
    })

    it('should handle rejected promise and return undefined', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })
      const testError = new Error('Async error')

      const value = await act(async () => {
        return result.current.handleAsync(Promise.reject(testError))
      })

      expect(value).toBeUndefined()
      expect(result.current.error).toBe(testError)
    })

    it('should clear previous error on new async call', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      // First call fails
      await act(async () => {
        await result.current.handleAsync(Promise.reject(new Error('First')))
      })

      expect(result.current.error?.message).toBe('First')

      // Second call succeeds - should clear error
      await act(async () => {
        await result.current.handleAsync(Promise.resolve('success'))
      })

      expect(result.current.error).toBeNull()
    })

    it('should handle complex async operations', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const fetchData = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return { data: 'test' }
      }

      const value = await act(async () => {
        return result.current.handleAsync(fetchData())
      })

      expect(value).toEqual({ data: 'test' })
    })
  })

  describe('withErrorHandling', () => {
    it('should wrap sync function', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const syncFn = (a: number, b: number) => a + b

      const wrapped = result.current.withErrorHandling(syncFn)
      const value = await act(async () => wrapped(2, 3))

      expect(value).toBe(5)
    })

    it('should wrap async function', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const asyncFn = async (x: number) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return x * 2
      }

      const wrapped = result.current.withErrorHandling(asyncFn)
      const value = await act(async () => wrapped(5))

      expect(value).toBe(10)
    })

    it('should catch sync function errors', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const throwingFn = () => {
        throw new Error('Sync error')
      }

      const wrapped = result.current.withErrorHandling(throwingFn)
      const value = await act(async () => wrapped())

      expect(value).toBeUndefined()
      expect(result.current.error?.message).toBe('Sync error')
    })

    it('should catch async function errors', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const asyncThrowingFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        throw new Error('Async error')
      }

      const wrapped = result.current.withErrorHandling(asyncThrowingFn)
      const value = await act(async () => wrapped())

      expect(value).toBeUndefined()
      expect(result.current.error?.message).toBe('Async error')
    })

    it('should clear error on new wrapped call', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      let shouldThrow = true
      const fn = () => {
        if (shouldThrow) throw new Error('Conditional')
        return 'success'
      }

      const wrapped = result.current.withErrorHandling(fn)

      // First call throws
      await act(async () => wrapped())
      expect(result.current.error).not.toBeNull()

      // Second call succeeds
      shouldThrow = false
      await act(async () => wrapped())
      expect(result.current.error).toBeNull()
    })

    it('should preserve function arguments', async () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      const fn = (a: string, b: number, c: boolean) => ({ a, b, c })

      const wrapped = result.current.withErrorHandling(fn)
      const value = await act(async () => wrapped('hello', 42, true))

      expect(value).toEqual({ a: 'hello', b: 42, c: true })
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError(new Error('Test'))
      })

      expect(result.current.error).not.toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.hasError).toBe(false)
      expect(result.current.isRecoverable).toBe(false)
    })
  })

  describe('showBoundary option', () => {
    it('should not trigger boundary by default', () => {
      let boundaryTriggered = false
      const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorBoundary
          fallback={<div>Error</div>}
          onError={() => {
            boundaryTriggered = true
          }}
        >
          {children}
        </ErrorBoundary>
      )

      const { result } = renderHook(
        () => useEnhancedErrorHandler({ showBoundary: false }),
        { wrapper: TestWrapper }
      )

      act(() => {
        result.current.handleError(new Error('Test'))
      })

      // Local error state should be set
      expect(result.current.error).not.toBeNull()
      // But boundary should not be triggered
      expect(boundaryTriggered).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle null error', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError(null)
      })

      expect(result.current.error?.message).toBe('null')
    })

    it('should handle undefined error', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError(undefined)
      })

      expect(result.current.error?.message).toBe('undefined')
    })

    it('should handle number error', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError(404)
      })

      expect(result.current.error?.message).toBe('404')
    })

    it('should handle multiple errors in sequence', () => {
      const { result } = renderHook(() => useEnhancedErrorHandler(), {
        wrapper,
      })

      act(() => {
        result.current.handleError(new Error('First'))
      })
      expect(result.current.error?.message).toBe('First')

      act(() => {
        result.current.handleError(new Error('Second'))
      })
      expect(result.current.error?.message).toBe('Second')

      act(() => {
        result.current.handleError(new Error('Third'))
      })
      expect(result.current.error?.message).toBe('Third')
    })
  })
})
