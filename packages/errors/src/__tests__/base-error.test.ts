/**
 * Base Error Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { ClarityError, ErrorContext, ErrorSolution } from '../base-error'

// Concrete implementation for testing abstract class
class TestError extends ClarityError {
  constructor(
    code: string,
    userMessage: string,
    technicalMessage: string,
    solutions: ErrorSolution[] = [],
    context: ErrorContext = {},
    originalError?: Error
  ) {
    super(code, userMessage, technicalMessage, solutions, context, originalError)
  }
}

describe('ClarityError', () => {
  describe('Constructor', () => {
    it('should create error with basic properties', () => {
      const error = new TestError(
        'TEST_ERROR',
        'Something went wrong',
        'Technical details here'
      )

      expect(error.code).toBe('TEST_ERROR')
      expect(error.userMessage).toBe('Something went wrong')
      expect(error.technicalMessage).toBe('Technical details here')
      expect(error.message).toBe('Something went wrong')
      expect(error.name).toBe('TestError')
    })

    it('should set timestamp on creation', () => {
      const before = new Date()
      const error = new TestError('TEST', 'message', 'technical')
      const after = new Date()

      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should accept solutions array', () => {
      const solutions: ErrorSolution[] = [
        {
          description: 'Try this fix',
          steps: ['Step 1', 'Step 2'],
          example: 'const x = 1',
          docsUrl: 'https://docs.example.com'
        }
      ]
      const error = new TestError('TEST', 'message', 'technical', solutions)

      expect(error.solutions).toHaveLength(1)
      expect(error.solutions[0].description).toBe('Try this fix')
      expect(error.solutions[0].steps).toEqual(['Step 1', 'Step 2'])
      expect(error.solutions[0].example).toBe('const x = 1')
      expect(error.solutions[0].docsUrl).toBe('https://docs.example.com')
    })

    it('should accept context object', () => {
      const context: ErrorContext = {
        location: 'test file',
        action: 'running test',
        data: { key: 'value' }
      }
      const error = new TestError('TEST', 'message', 'technical', [], context)

      expect(error.context.location).toBe('test file')
      expect(error.context.action).toBe('running test')
      expect(error.context.data).toEqual({ key: 'value' })
    })

    it('should preserve original error', () => {
      const originalError = new Error('Original message')
      const error = new TestError(
        'TEST',
        'message',
        'technical',
        [],
        {},
        originalError
      )

      expect(error.originalError).toBe(originalError)
      expect(error.context.originalStack).toBe(originalError.stack)
    })

    it('should have stack trace', () => {
      const error = new TestError('TEST', 'message', 'technical')

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('TestError')
    })
  })

  describe('toTerminalString', () => {
    it('should format basic error', () => {
      const error = new TestError('TEST_CODE', 'User message', 'Technical message')
      const output = error.toTerminalString()

      expect(output).toContain('TestError')
      expect(output).toContain('User message')
      expect(output).toContain('TEST_CODE')
      expect(output).toContain('Technical Details')
      expect(output).toContain('Technical message')
    })

    it('should include location when provided', () => {
      const error = new TestError('TEST', 'message', 'technical', [], {
        location: 'api/handler.ts:42'
      })
      const output = error.toTerminalString()

      expect(output).toContain('Location')
      expect(output).toContain('api/handler.ts:42')
    })

    it('should include action when provided', () => {
      const error = new TestError('TEST', 'message', 'technical', [], {
        action: 'Saving user data'
      })
      const output = error.toTerminalString()

      expect(output).toContain('Action')
      expect(output).toContain('Saving user data')
    })

    it('should include context data when provided', () => {
      const error = new TestError('TEST', 'message', 'technical', [], {
        data: { userId: 123, action: 'update' }
      })
      const output = error.toTerminalString()

      expect(output).toContain('Context Data')
      expect(output).toContain('userId')
      expect(output).toContain('123')
    })

    it('should format solutions with steps', () => {
      const error = new TestError('TEST', 'message', 'technical', [
        {
          description: 'Fix the issue',
          steps: ['Do step 1', 'Do step 2']
        }
      ])
      const output = error.toTerminalString()

      expect(output).toContain('Suggested Solutions')
      expect(output).toContain('Fix the issue')
      expect(output).toContain('Do step 1')
      expect(output).toContain('Do step 2')
    })

    it('should format solutions with example code', () => {
      const error = new TestError('TEST', 'message', 'technical', [
        {
          description: 'Use this code',
          example: 'const x = 1;\nconst y = 2;'
        }
      ])
      const output = error.toTerminalString()

      expect(output).toContain('Example')
      expect(output).toContain('const x = 1')
    })

    it('should format solutions with docs URL', () => {
      const error = new TestError('TEST', 'message', 'technical', [
        {
          description: 'Read the docs',
          docsUrl: 'https://docs.example.com/fix'
        }
      ])
      const output = error.toTerminalString()

      expect(output).toContain('Documentation')
      expect(output).toContain('https://docs.example.com/fix')
    })

    it('should include original error message', () => {
      const originalError = new Error('Root cause')
      const error = new TestError(
        'TEST',
        'message',
        'technical',
        [],
        {},
        originalError
      )
      const output = error.toTerminalString()

      expect(output).toContain('Original Error')
      expect(output).toContain('Root cause')
    })
  })

  describe('toJSON', () => {
    it('should return serializable object', () => {
      const error = new TestError('TEST_CODE', 'User message', 'Technical message')
      const json = error.toJSON()

      expect(json.name).toBe('TestError')
      expect(json.code).toBe('TEST_CODE')
      expect(json.message).toBe('User message')
      expect(json.technicalMessage).toBe('Technical message')
      expect(json.solutions).toEqual([])
      expect(json.context).toEqual({})
      expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('should include solutions', () => {
      const solutions: ErrorSolution[] = [
        { description: 'Fix it', steps: ['Step 1'] }
      ]
      const error = new TestError('TEST', 'message', 'technical', solutions)
      const json = error.toJSON()

      expect(json.solutions).toHaveLength(1)
      expect(json.solutions[0].description).toBe('Fix it')
    })

    it('should include context', () => {
      const error = new TestError('TEST', 'message', 'technical', [], {
        location: 'file.ts',
        action: 'testing'
      })
      const json = error.toJSON()

      expect(json.context.location).toBe('file.ts')
      expect(json.context.action).toBe('testing')
    })

    it('should include original error when present', () => {
      const originalError = new Error('Original')
      const error = new TestError(
        'TEST',
        'message',
        'technical',
        [],
        {},
        originalError
      )
      const json = error.toJSON()

      expect(json.originalError).toBeDefined()
      expect(json.originalError?.message).toBe('Original')
      expect(json.originalError?.stack).toBeDefined()
    })

    it('should not include originalError when not present', () => {
      const error = new TestError('TEST', 'message', 'technical')
      const json = error.toJSON()

      expect(json.originalError).toBeUndefined()
    })

    it('should produce valid JSON string', () => {
      const error = new TestError('TEST', 'message', 'technical', [], {
        data: { key: 'value' }
      })
      const jsonString = JSON.stringify(error.toJSON())
      const parsed = JSON.parse(jsonString)

      expect(parsed.code).toBe('TEST')
    })
  })

  describe('toLogString', () => {
    it('should return JSON string', () => {
      const error = new TestError('TEST', 'User message', 'Technical details')
      const logString = error.toLogString()

      expect(() => JSON.parse(logString)).not.toThrow()
    })

    it('should include log level', () => {
      const error = new TestError('TEST', 'message', 'technical')
      const log = JSON.parse(error.toLogString())

      expect(log.level).toBe('error')
    })

    it('should include all relevant fields', () => {
      const error = new TestError('TEST_CODE', 'User message', 'Tech details', [], {
        location: 'file.ts:10'
      })
      const log = JSON.parse(error.toLogString())

      expect(log.timestamp).toBeDefined()
      expect(log.name).toBe('TestError')
      expect(log.code).toBe('TEST_CODE')
      expect(log.message).toBe('User message')
      expect(log.technical).toBe('Tech details')
      expect(log.context.location).toBe('file.ts:10')
      expect(log.stack).toBeDefined()
    })
  })

  describe('Error inheritance', () => {
    it('should be instanceof Error', () => {
      const error = new TestError('TEST', 'message', 'technical')
      expect(error).toBeInstanceOf(Error)
    })

    it('should be instanceof ClarityError', () => {
      const error = new TestError('TEST', 'message', 'technical')
      expect(error).toBeInstanceOf(ClarityError)
    })

    it('should be catchable as Error', () => {
      const throwError = () => {
        throw new TestError('TEST', 'message', 'technical')
      }

      expect(throwError).toThrow(Error)
    })
  })
})
