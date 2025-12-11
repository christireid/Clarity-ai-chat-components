/**
 * Tests for utils/index.ts exports
 * This file verifies that all utilities are properly exported from the barrel file
 */

import { describe, it, expect } from 'vitest'

// Import from the barrel file
import {
  successResponse,
  errorResponse,
  apiHandler,
  streamingApiHandler,
  writeErrorToStream,
  parseSSEError,
  createErrorLogger,
  getErrorLogger,
  configureErrorLogger,
  logError,
  logWarning,
  logInfo,
  reactErrorInfoToLogOptions,
} from '../../src/utils'

// Also verify types are exported
import type {
  ApiResponse,
  ApiHandlerContext,
  ApiHandler,
  ErrorLogEntry,
  ErrorLoggerConfig,
  ErrorLogger,
  LogOptions,
} from '../../src/utils'

describe('utils/index.ts exports', () => {
  describe('API handler exports', () => {
    it('should export successResponse', () => {
      expect(typeof successResponse).toBe('function')
      const response = successResponse({ test: 'data' })
      expect(response).toBeInstanceOf(Response)
    })

    it('should export errorResponse', () => {
      expect(typeof errorResponse).toBe('function')
      const response = errorResponse(new Error('Test'))
      expect(response).toBeInstanceOf(Response)
    })

    it('should export apiHandler', () => {
      expect(typeof apiHandler).toBe('function')
    })

    it('should export streamingApiHandler', () => {
      expect(typeof streamingApiHandler).toBe('function')
    })

    it('should export writeErrorToStream', () => {
      expect(typeof writeErrorToStream).toBe('function')
    })

    it('should export parseSSEError', () => {
      expect(typeof parseSSEError).toBe('function')
    })
  })

  describe('Error logger exports', () => {
    it('should export createErrorLogger', () => {
      expect(typeof createErrorLogger).toBe('function')
      const logger = createErrorLogger()
      expect(logger.error).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.info).toBeDefined()
    })

    it('should export getErrorLogger', () => {
      expect(typeof getErrorLogger).toBe('function')
      const logger = getErrorLogger()
      expect(logger.error).toBeDefined()
    })

    it('should export configureErrorLogger', () => {
      expect(typeof configureErrorLogger).toBe('function')
    })

    it('should export logError', () => {
      expect(typeof logError).toBe('function')
    })

    it('should export logWarning', () => {
      expect(typeof logWarning).toBe('function')
    })

    it('should export logInfo', () => {
      expect(typeof logInfo).toBe('function')
    })

    it('should export reactErrorInfoToLogOptions', () => {
      expect(typeof reactErrorInfoToLogOptions).toBe('function')
      const options = reactErrorInfoToLogOptions({
        componentStack: 'at Component',
      })
      expect(options.component?.stack).toBe('at Component')
    })
  })

  describe('type exports', () => {
    it('should export ApiResponse type', () => {
      // Type check - this will compile if types are properly exported
      const response: ApiResponse<{ id: string }> = {
        success: true,
        data: { id: '123' },
      }
      expect(response.success).toBe(true)
    })

    it('should export ErrorLogEntry type', () => {
      const entry: ErrorLogEntry = {
        timestamp: new Date().toISOString(),
        level: 'error',
        error: { name: 'Error', message: 'Test' },
      }
      expect(entry.level).toBe('error')
    })

    it('should export ErrorLoggerConfig type', () => {
      const config: ErrorLoggerConfig = {
        batchSize: 10,
        flushInterval: 5000,
      }
      expect(config.batchSize).toBe(10)
    })

    it('should export LogOptions type', () => {
      const options: LogOptions = {
        context: { action: 'test' },
        user: { id: 'user-123' },
      }
      expect(options.context?.action).toBe('test')
    })
  })
})
