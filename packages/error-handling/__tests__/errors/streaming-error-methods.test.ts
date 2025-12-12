/**
 * Tests for StreamingError static factory methods and properties
 */

import { describe, it, expect } from 'vitest'
import {
  StreamingError,
  StreamingErrorCode,
  isStreamingError,
} from '../../src/errors/streaming-error'

describe('StreamingError static methods', () => {
  describe('connectionFailed', () => {
    it('should create connection failed error for SSE', () => {
      const error = StreamingError.connectionFailed('sse')

      expect(error.code).toBe(StreamingErrorCode.CONNECTION_FAILED)
      expect(error.transport).toBe('sse')
      expect(error.message).toContain('connection')
    })

    it('should create connection failed error for WebSocket', () => {
      const error = StreamingError.connectionFailed('websocket')

      expect(error.code).toBe(StreamingErrorCode.CONNECTION_FAILED)
      expect(error.transport).toBe('websocket')
    })

    it('should include cause if provided', () => {
      const cause = new Error('Network down')
      const error = StreamingError.connectionFailed('sse', cause)

      expect(error.cause).toBe(cause)
    })
  })

  describe('connectionLost', () => {
    it('should create connection lost error', () => {
      const error = StreamingError.connectionLost('sse')

      expect(error.code).toBe(StreamingErrorCode.CONNECTION_LOST)
      expect(error.transport).toBe('sse')
    })

    it('should include partial content if provided', () => {
      const error = StreamingError.connectionLost(
        'websocket',
        'partial message...'
      )

      expect(error.partialContent).toBe('partial message...')
      expect(error.hasPartialContent).toBe(true)
    })

    it('should include cause if provided', () => {
      const cause = new Error('Socket closed')
      const error = StreamingError.connectionLost('websocket', undefined, cause)

      expect(error.cause).toBe(cause)
    })
  })

  describe('parseError', () => {
    it('should create parse error', () => {
      const error = StreamingError.parseError('sse')

      expect(error.code).toBe(StreamingErrorCode.PARSE_ERROR)
      expect(error.transport).toBe('sse')
      expect(error.message).toContain('parse')
    })

    it('should include cause if provided', () => {
      const cause = new SyntaxError('Unexpected token')
      const error = StreamingError.parseError('sse', cause)

      expect(error.cause).toBe(cause)
    })

    it('should include partial content if provided', () => {
      const error = StreamingError.parseError(
        'sse',
        undefined,
        'partial JSON...'
      )

      expect(error.partialContent).toBe('partial JSON...')
    })
  })

  describe('timeout', () => {
    it('should create timeout error', () => {
      const error = StreamingError.timeout('sse', 30000)

      expect(error.code).toBe(StreamingErrorCode.TIMEOUT)
      expect(error.transport).toBe('sse')
      expect(error.message).toContain('30000')
    })

    it('should store timeout in context', () => {
      const error = StreamingError.timeout('websocket', 60000)

      expect(error.context?.timeout).toBe(60000)
    })
  })

  describe('aborted', () => {
    it('should create aborted error', () => {
      const error = StreamingError.aborted('sse')

      expect(error.code).toBe(StreamingErrorCode.ABORTED)
      expect(error.transport).toBe('sse')
      expect(error.statusCode).toBe(499)
    })

    it('should include partial content if provided', () => {
      const error = StreamingError.aborted('sse', 'message before abort')

      expect(error.partialContent).toBe('message before abort')
    })
  })

  describe('providerError', () => {
    it('should wrap provider error', () => {
      const providerErr = new Error('Rate limited')
      const error = StreamingError.providerError('sse', providerErr)

      expect(error.code).toBe(StreamingErrorCode.PROVIDER_ERROR)
      expect(error.message).toBe('Rate limited')
      expect(error.cause).toBe(providerErr)
    })

    it('should include partial content if provided', () => {
      const providerErr = new Error('Service error')
      const error = StreamingError.providerError(
        'websocket',
        providerErr,
        'partial response'
      )

      expect(error.partialContent).toBe('partial response')
    })
  })

  describe('hasPartialContent', () => {
    it('should return true when partialContent is non-empty', () => {
      const error = StreamingError.connectionLost('sse', 'some content')
      expect(error.hasPartialContent).toBe(true)
    })

    it('should return false when partialContent is undefined', () => {
      const error = StreamingError.connectionLost('sse')
      expect(error.hasPartialContent).toBe(false)
    })

    it('should return false when partialContent is empty string', () => {
      const error = StreamingError.connectionLost('sse', '')
      expect(error.hasPartialContent).toBe(false)
    })

    it('should return false when partialContent is whitespace only', () => {
      const error = StreamingError.connectionLost('sse', '   ')
      expect(error.hasPartialContent).toBe(false)
    })
  })

  describe('userMessage', () => {
    it('should return connection failed message', () => {
      const error = StreamingError.connectionFailed('sse')
      expect(error.userMessage).toContain('connect')
    })

    it('should return connection lost message with partial content note', () => {
      const error = StreamingError.connectionLost('sse', 'partial')
      expect(error.userMessage).toContain('partial')
      expect(error.userMessage).toContain('saved')
    })

    it('should return connection lost message without partial content', () => {
      const error = StreamingError.connectionLost('sse')
      expect(error.userMessage).toContain('lost')
      expect(error.userMessage).toContain('try again')
    })

    it('should return timeout message', () => {
      const error = StreamingError.timeout('sse', 30000)
      expect(error.userMessage).toContain('long')
    })

    it('should return aborted message', () => {
      const error = StreamingError.aborted('sse')
      expect(error.userMessage).toContain('cancelled')
    })

    it('should return parse error message', () => {
      const error = StreamingError.parseError('sse')
      expect(error.userMessage).toContain('invalid')
    })

    it('should return provider error message', () => {
      const error = StreamingError.providerError('sse', new Error('Test'))
      expect(error.userMessage).toContain('AI service')
    })

    it('should use default message for unknown code', () => {
      const error = new StreamingError('Custom error', {
        code: 'UNKNOWN_CODE' as StreamingErrorCode,
        transport: 'sse',
      })
      expect(error.userMessage).toBeDefined()
    })
  })

  describe('isStreamingError type guard', () => {
    it('should return true for StreamingError instances', () => {
      const error = StreamingError.connectionLost('sse')
      expect(isStreamingError(error)).toBe(true)
    })

    it('should return false for regular Error', () => {
      const error = new Error('Test')
      expect(isStreamingError(error)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isStreamingError(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isStreamingError(undefined)).toBe(false)
    })

    it('should return false for plain object', () => {
      expect(isStreamingError({ code: 'STREAMING_CONNECTION_LOST' })).toBe(
        false
      )
    })
  })
})
