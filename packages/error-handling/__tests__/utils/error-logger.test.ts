import { logger } from '@clarity-chat/utils/logger';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createErrorLogger,
  getErrorLogger,
  configureErrorLogger,
  logError,
  logWarning,
  logInfo,
  reactErrorInfoToLogOptions,
  type ErrorLogEntry,
} from '../../src/utils/error-logger'
import { ApiError, ApiErrorCode } from '../../src/errors/api-error'

describe('error-logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    // Reset default logger
    configureErrorLogger({})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('createErrorLogger', () => {
    it('should create logger with default config', () => {
      const logger = createErrorLogger()

      expect(logger.error).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.info).toBeDefined()
      expect(logger.flush).toBeDefined()
      expect(logger.pendingCount).toBeDefined()
      expect(logger.clear).toBeDefined()
    })

    it('should batch logs up to batchSize', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 3 })

      // Add 2 logs - shouldn't flush yet
      logger.error(new Error('Error 1'))
      logger.error(new Error('Error 2'))

      expect(logger.pendingCount()).toBe(2)
      expect(consoleSpy).not.toHaveBeenCalled()

      // Add 3rd log - should trigger flush
      logger.error(new Error('Error 3'))

      expect(logger.pendingCount()).toBe(0)
      expect(consoleSpy).toHaveBeenCalledTimes(3)

      consoleSpy.mockRestore()
    })

    it('should flush on interval', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({
        batchSize: 100, // High batch size so it won't auto-flush
        flushInterval: 1000,
      })

      logger.error(new Error('Test'))
      expect(logger.pendingCount()).toBe(1)

      // Advance past flush interval
      vi.advanceTimersByTime(1100)

      expect(logger.pendingCount()).toBe(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should not schedule multiple flush timers', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({
        batchSize: 100,
        flushInterval: 1000,
      })

      // Add multiple logs rapidly
      logger.error(new Error('Error 1'))
      logger.error(new Error('Error 2'))
      logger.error(new Error('Error 3'))

      expect(logger.pendingCount()).toBe(3)

      // Advance past flush interval once
      vi.advanceTimersByTime(1100)

      expect(logger.pendingCount()).toBe(0)
      expect(consoleSpy).toHaveBeenCalledTimes(3)

      consoleSpy.mockRestore()
    })
  })

  describe('log levels', () => {
    it('should log errors with error level', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      logger.error(new Error('Test error'))

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorLogger]',
        expect.objectContaining({
          level: 'error',
        })
      )

      consoleSpy.mockRestore()
    })

    it('should log warnings with warn level', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      logger.warn(new Error('Test warning'))

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorLogger]',
        expect.objectContaining({
          level: 'warn',
        })
      )

      consoleSpy.mockRestore()
    })

    it('should log info with info level', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      logger.info(new Error('Test info'))

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorLogger]',
        expect.objectContaining({
          level: 'info',
        })
      )

      consoleSpy.mockRestore()
    })
  })

  describe('log entry structure', () => {
    it('should create structured log entry', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      const testError = new Error('Structured test')
      testError.name = 'TestError'

      logger.error(testError, {
        context: { action: 'test' },
        user: { id: 'user-123', sessionId: 'session-456' },
        request: { url: '/api/test', method: 'POST', userAgent: 'TestAgent' },
        component: { name: 'TestComponent', stack: 'at TestComponent' },
      })

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry

      expect(loggedEntry.timestamp).toBeDefined()
      expect(loggedEntry.level).toBe('error')
      expect(loggedEntry.error.name).toBe('TestError')
      expect(loggedEntry.error.message).toBe('Structured test')
      expect(loggedEntry.context).toEqual({ action: 'test' })
      expect(loggedEntry.user).toEqual({
        id: 'user-123',
        sessionId: 'session-456',
      })
      expect(loggedEntry.request).toEqual({
        url: '/api/test',
        method: 'POST',
        userAgent: 'TestAgent',
      })
      expect(loggedEntry.component).toEqual({
        name: 'TestComponent',
        stack: 'at TestComponent',
      })

      consoleSpy.mockRestore()
    })

    it('should include error code for ClarityErrors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      // Pass endpoint as top-level option (ApiError stores it in context)
      const apiError = new ApiError('API failed', {
        code: ApiErrorCode.SERVER_ERROR,
        statusCode: 500,
        endpoint: '/api/chat',
        method: 'POST',
      })

      logger.error(apiError)

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry

      expect(loggedEntry.error.code).toBe(ApiErrorCode.SERVER_ERROR)
      expect(loggedEntry.context).toEqual({
        endpoint: '/api/chat',
        method: 'POST',
      })

      consoleSpy.mockRestore()
    })

    it('should include stack trace in development', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 1 })

      const error = new Error('With stack')
      logger.error(error)

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry
      expect(loggedEntry.error.stack).toBeDefined()

      process.env['NODE_ENV'] = originalEnv
      consoleSpy.mockRestore()
    })

    it('should exclude stack trace in production by default', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'production'

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({
        batchSize: 1,
        includeStackInProd: false,
      })

      const error = new Error('Without stack')
      logger.error(error)

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry
      expect(loggedEntry.error.stack).toBeUndefined()

      process.env['NODE_ENV'] = originalEnv
      consoleSpy.mockRestore()
    })

    it('should include stack trace in production when configured', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'production'

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({
        batchSize: 1,
        includeStackInProd: true,
      })

      const error = new Error('With stack in prod')
      logger.error(error)

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry
      expect(loggedEntry.error.stack).toBeDefined()

      process.env['NODE_ENV'] = originalEnv
      consoleSpy.mockRestore()
    })
  })

  describe('transform function', () => {
    it('should apply transform to log entries', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const transform = (entry: ErrorLogEntry): ErrorLogEntry => ({
        ...entry,
        context: { ...entry.context, transformed: true },
      })

      const logger = createErrorLogger({ batchSize: 1, transform })
      logger.error(new Error('Transform test'))

      const loggedEntry = consoleSpy.mock.calls[0]?.[1] as ErrorLogEntry
      expect(loggedEntry.context?.transformed).toBe(true)

      consoleSpy.mockRestore()
    })
  })

  describe('filter function', () => {
    it('should filter out entries when filter returns false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const filter = (entry: ErrorLogEntry) => entry.level !== 'error'

      const logger = createErrorLogger({ batchSize: 1, filter })
      logger.error(new Error('Should be filtered'))

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should allow entries when filter returns true', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const filter = (entry: ErrorLogEntry) => entry.level === 'warn'

      const logger = createErrorLogger({ batchSize: 1, filter })
      logger.warn(new Error('Should pass'))

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('external endpoint', () => {
    it('should send logs to external endpoint', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true })
      global.fetch = mockFetch

      const logger = createErrorLogger({
        endpoint: 'https://logs.example.com',
        apiKey: 'test-api-key',
        batchSize: 1,
        headers: { 'X-Custom': 'header' },
      })

      logger.error(new Error('External test'))

      await vi.runAllTimersAsync()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://logs.example.com',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key',
            'X-Custom': 'header',
          }),
        })
      )

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.logs).toHaveLength(1)
      expect(body.logs[0].error.message).toBe('External test')
    })

    it('should handle fetch failure and re-queue logs', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
      global.fetch = mockFetch

      const logger = createErrorLogger({
        endpoint: 'https://logs.example.com',
        batchSize: 1,
      })

      logger.error(new Error('Will fail'))

      await vi.runAllTimersAsync()

      // Should re-add to batch
      expect(logger.pendingCount()).toBe(1)
      // Should log to console as fallback
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should send without Authorization header when no apiKey', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true })
      global.fetch = mockFetch

      const logger = createErrorLogger({
        endpoint: 'https://logs.example.com',
        batchSize: 1,
      })

      logger.error(new Error('No auth test'))

      await vi.runAllTimersAsync()

      const headers = mockFetch.mock.calls[0][1].headers
      expect(headers.Authorization).toBeUndefined()
    })
  })

  describe('flush', () => {
    it('should manually flush pending logs', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 100 })

      logger.error(new Error('Pending 1'))
      logger.error(new Error('Pending 2'))

      expect(logger.pendingCount()).toBe(2)

      await logger.flush()

      expect(logger.pendingCount()).toBe(0)
      expect(consoleSpy).toHaveBeenCalledTimes(2)

      consoleSpy.mockRestore()
    })

    it('should do nothing when no pending logs', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger()

      await logger.flush()

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('clear', () => {
    it('should clear pending logs without sending', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({ batchSize: 100 })

      logger.error(new Error('Will be cleared'))
      expect(logger.pendingCount()).toBe(1)

      logger.clear()

      expect(logger.pendingCount()).toBe(0)

      // Advance timers - should not flush
      vi.advanceTimersByTime(10000)
      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should clear pending flush timer', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = createErrorLogger({
        batchSize: 100,
        flushInterval: 1000,
      })

      logger.error(new Error('Test'))
      logger.clear()

      // Advance past flush interval
      vi.advanceTimersByTime(2000)

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('default logger functions', () => {
    it('getErrorLogger should return singleton', () => {
      const logger1 = getErrorLogger()
      const logger2 = getErrorLogger()

      expect(logger1).toBe(logger2)
    })

    it('configureErrorLogger should replace default logger', () => {
      const logger1 = getErrorLogger()

      configureErrorLogger({ batchSize: 5 })

      const logger2 = getErrorLogger()

      expect(logger1).not.toBe(logger2)
    })

    it('logError should use default logger', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      configureErrorLogger({ batchSize: 1 })

      logError(new Error('Default logger test'))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('logWarning should use default logger', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      configureErrorLogger({ batchSize: 1 })

      logWarning(new Error('Warning test'))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('logInfo should use default logger', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      configureErrorLogger({ batchSize: 1 })

      logInfo(new Error('Info test'))

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('reactErrorInfoToLogOptions', () => {
    it('should convert React ErrorInfo to LogOptions', () => {
      const errorInfo = {
        componentStack: `
    at Button
    at form
    at App`,
      }

      const options = reactErrorInfoToLogOptions(errorInfo)

      expect(options.component?.stack).toBe(errorInfo.componentStack)
    })

    it('should handle null componentStack', () => {
      const errorInfo = { componentStack: null }

      const options = reactErrorInfoToLogOptions(errorInfo)

      expect(options.component?.stack).toBeUndefined()
    })

    it('should handle undefined componentStack', () => {
      const errorInfo = {}

      const options = reactErrorInfoToLogOptions(errorInfo)

      expect(options.component?.stack).toBeUndefined()
    })
  })
})
