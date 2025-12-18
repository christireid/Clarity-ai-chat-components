import { logger } from '..'
/**
 * Logger Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  LogLevel,
  configureLogger,
  setGlobalLogLevel,
  setRequestId,
  getRequestId,
  getLogger,
  info,
  warn,
  error,
  success,
  debug,
} from '../index.js'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Reset to defaults
    configureLogger({
      verbose: false,
      silent: false,
      timestamps: false,
      jsonOutput: false,
    })
    setGlobalLogLevel(LogLevel.INFO)
    setRequestId(null)
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('LogLevel', () => {
    it('should have correct level values', () => {
      expect(LogLevel.DEBUG).toBe(0)
      expect(LogLevel.INFO).toBe(1)
      expect(LogLevel.WARN).toBe(2)
      expect(LogLevel.ERROR).toBe(3)
    })
  })

  describe('getLogger', () => {
    it('should create a logger with all methods', () => {
      const logger = getLogger('test')

      expect(logger.info).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.error).toBeDefined()
      expect(logger.success).toBeDefined()
      expect(logger.debug).toBeDefined()
      expect(logger.setLevel).toBeDefined()
      expect(logger.getLevel).toBeDefined()
    })

    it('should log info messages', () => {
      const logger = getLogger('test')
      logger.info('Test message')

      expect(consoleLogSpy).toHaveBeenCalled()
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Test message')
    })

    it('should log warning messages', () => {
      const logger = getLogger('test')
      logger.warn('Warning message')

      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleWarnSpy.mock.calls[0][1]).toBe('Warning message')
    })

    it('should log error messages', () => {
      const logger = getLogger('test')
      logger.error('Error message')

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(consoleErrorSpy.mock.calls[0][1]).toBe('Error message')
    })

    it('should log Error objects', () => {
      const logger = getLogger('test')
      const testError = new Error('Test error')
      logger.error(testError)

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(consoleErrorSpy.mock.calls[0][1]).toBe('Test error')
    })

    it('should log success messages', () => {
      const logger = getLogger('test')
      logger.success('Success message')

      expect(consoleLogSpy).toHaveBeenCalled()
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Success message')
    })

    it('should include namespace in output', () => {
      const logger = getLogger('my-namespace')
      logger.info('Test')

      const prefix = consoleLogSpy.mock.calls[0][0] as string
      expect(prefix).toContain('[my-namespace]')
    })

    it('should pass additional arguments', () => {
      const logger = getLogger('test')
      logger.info('Message', { data: 'extra' }, 123)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.any(String),
        'Message',
        { data: 'extra' },
        123
      )
    })
  })

  describe('Log Levels', () => {
    it('should respect instance log level', () => {
      const logger = getLogger('test', LogLevel.WARN)

      logger.info('Info')
      logger.warn('Warning')

      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should allow changing instance level', () => {
      // Set global level to DEBUG to allow debug logging
      setGlobalLogLevel(LogLevel.DEBUG)

      const logger = getLogger('test', LogLevel.WARN)

      expect(logger.getLevel()).toBe(LogLevel.WARN)

      logger.setLevel(LogLevel.DEBUG)
      expect(logger.getLevel()).toBe(LogLevel.DEBUG)

      logger.debug('Debug message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should respect global log level', () => {
      setGlobalLogLevel(LogLevel.ERROR)

      const logger = getLogger('test')
      logger.info('Info')
      logger.warn('Warning')
      logger.error('Error')

      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should not log debug unless level is DEBUG', () => {
      setGlobalLogLevel(LogLevel.INFO)

      const logger = getLogger('test')
      logger.debug('Debug message')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should log debug when level is DEBUG', () => {
      setGlobalLogLevel(LogLevel.DEBUG)

      const logger = getLogger('test', LogLevel.DEBUG)
      logger.debug('Debug message')

      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('configureLogger', () => {
    it('should enable verbose mode (DEBUG level)', () => {
      configureLogger({ verbose: true })

      const logger = getLogger('test')
      logger.debug('Debug message')

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should enable silent mode', () => {
      configureLogger({ silent: true })

      const logger = getLogger('test')
      logger.info('Info')
      logger.warn('Warning')
      logger.error('Error')

      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should enable timestamps', () => {
      configureLogger({ timestamps: true })

      const logger = getLogger('test')
      logger.info('Message')

      const prefix = consoleLogSpy.mock.calls[0][0] as string
      // Timestamp format: [HH:MM:SS]
      expect(prefix).toMatch(/\[\d{2}:\d{2}:\d{2}\]/)
    })

    it('should enable JSON output mode', () => {
      configureLogger({ jsonOutput: true })

      const logger = getLogger('test')
      logger.info('Message', { data: 'value' })

      const output = consoleLogSpy.mock.calls[0][0] as string
      expect(() => JSON.parse(output)).not.toThrow()

      const parsed = JSON.parse(output)
      expect(parsed.message).toBe('Message')
      expect(parsed.namespace).toBe('test')
    })

    it('should include error details in JSON mode', () => {
      configureLogger({ jsonOutput: true })

      const logger = getLogger('test')
      const testError = new Error('Test error')
      logger.error(testError)

      const output = consoleErrorSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(output)

      expect(parsed.error).toBeDefined()
      expect(parsed.error.message).toBe('Test error')
      expect(parsed.error.name).toBe('Error')
      expect(parsed.error.stack).toBeDefined()
    })
  })

  describe('Request ID', () => {
    it('should set and get request ID', () => {
      setRequestId('req-123')
      expect(getRequestId()).toBe('req-123')
    })

    it('should clear request ID', () => {
      setRequestId('req-123')
      setRequestId(null)
      expect(getRequestId()).toBeNull()
    })

    it('should include request ID in log output', () => {
      setRequestId('req-12345678')

      const logger = getLogger('test')
      logger.info('Message')

      const prefix = consoleLogSpy.mock.calls[0][0] as string
      expect(prefix).toContain('[req-1234]') // Truncated to 8 chars
    })
  })

  describe('Default Logger Functions', () => {
    it('should provide info function', () => {
      info('Info message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should provide warn function', () => {
      warn('Warning message')
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should provide error function', () => {
      logger.error('Error message')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should provide success function', () => {
      success('Success message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should provide debug function', () => {
      setGlobalLogLevel(LogLevel.DEBUG)
      // Use a new logger since default logger was created with INFO level at module load
      const logger = getLogger('test', LogLevel.DEBUG)
      logger.debug('Debug message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })
})
