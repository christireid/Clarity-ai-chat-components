import { describe, it, expect, vi } from 'vitest'
import {
  successResponse,
  errorResponse,
  apiHandler,
  streamingApiHandler,
  parseSSEError,
} from '../../src/utils/api-handler'
import { ApiError, ApiErrorCode } from '../../src/errors/api-error'
import {
  ProviderError,
  ProviderErrorCode,
} from '../../src/errors/provider-error'

describe('successResponse', () => {
  it('should create successful response with data', async () => {
    const data = { user: { id: '123', name: 'John' } }
    const response = successResponse(data)

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({
      success: true,
      data: { user: { id: '123', name: 'John' } },
    })
  })

  it('should create response with custom status', async () => {
    const response = successResponse({ created: true }, 201)

    expect(response.status).toBe(201)

    const body = await response.json()
    expect(body.success).toBe(true)
  })
})

describe('errorResponse', () => {
  it('should create error response for ApiError', async () => {
    const error = new ApiError('Not found', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    const response = errorResponse(error)

    expect(response.status).toBe(404)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe(ApiErrorCode.NOT_FOUND)
  })

  it('should create error response for regular Error', async () => {
    const error = new Error('Something went wrong')
    const response = errorResponse(error)

    expect(response.status).toBe(500)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('UNKNOWN_ERROR')
  })

  it('should use custom status code', async () => {
    const error = new Error('Bad request')
    const response = errorResponse(error, 400)

    expect(response.status).toBe(400)
  })
})

describe('apiHandler', () => {
  const mockRequest = {
    url: 'http://localhost/api/test',
    method: 'POST',
    json: vi.fn(),
    headers: new Headers(),
  }

  const mockContext = {
    params: Promise.resolve({ id: '123' }),
  }

  it('should pass through successful handler', async () => {
    const handler = apiHandler(async () => {
      return successResponse({ result: 'ok' })
    })

    const response = await handler(mockRequest, mockContext)
    const body = await response.json()

    expect(body.success).toBe(true)
    expect(body.data.result).toBe('ok')
  })

  it('should catch and handle ClarityError', async () => {
    const handler = apiHandler(async () => {
      throw new ApiError('Test error', {
        code: ApiErrorCode.BAD_REQUEST,
        statusCode: 400,
      })
    })

    const response = await handler(mockRequest, mockContext)

    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe(ApiErrorCode.BAD_REQUEST)
  })

  it('should catch and handle regular Error', async () => {
    const handler = apiHandler(async () => {
      throw new Error('Something went wrong')
    })

    const response = await handler(mockRequest, mockContext)

    expect(response.status).toBe(500)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('UNKNOWN_ERROR')
  })

  it('should detect rate limit errors from message', async () => {
    const handler = apiHandler(async () => {
      throw new Error('Rate limit exceeded')
    })

    const response = await handler(mockRequest, mockContext)

    expect(response.status).toBe(429)

    const body = await response.json()
    expect(body.error.code).toBe(ApiErrorCode.RATE_LIMITED)
  })

  it('should detect unauthorized errors from message', async () => {
    const handler = apiHandler(async () => {
      throw new Error('User is unauthorized')
    })

    const response = await handler(mockRequest, mockContext)

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.error.code).toBe(ApiErrorCode.UNAUTHORIZED)
  })
})

describe('streamingApiHandler', () => {
  const mockRequest = {
    url: 'http://localhost/api/stream',
    method: 'POST',
    json: vi.fn(),
    headers: new Headers(),
  }

  it('should pass through successful streaming handler', async () => {
    const handler = streamingApiHandler(async () => {
      return new Response('test stream', {
        headers: { 'Content-Type': 'text/event-stream' },
      })
    })

    const response = await handler(mockRequest)

    expect(response.headers.get('Content-Type')).toBe('text/event-stream')
  })

  it('should return SSE-formatted error on failure', async () => {
    const handler = streamingApiHandler(async () => {
      throw new ApiError('Stream failed', {
        code: ApiErrorCode.SERVER_ERROR,
        statusCode: 500,
      })
    })

    const response = await handler(mockRequest)

    expect(response.status).toBe(500)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')

    // Read the stream fully
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let content = ''

    if (reader) {
      // Read all chunks from the stream
      let done = false
      while (!done) {
        const result = await reader.read()
        done = result.done
        if (result.value) {
          content += decoder.decode(result.value, { stream: !done })
        }
      }
    }

    expect(content).toContain('event: error')
    expect(content).toContain('[DONE]')
  })
})

describe('parseSSEError', () => {
  it('should parse valid SSE error', () => {
    const data = JSON.stringify({
      type: 'error',
      error: {
        code: 'API_ERROR',
        message: 'Something went wrong',
      },
    })

    const result = parseSSEError(data)

    expect(result).not.toBeNull()
    expect(result?.type).toBe('error')
    expect(result?.error.code).toBe('API_ERROR')
  })

  it('should return null for non-error data', () => {
    const data = JSON.stringify({ type: 'message', content: 'Hello' })

    const result = parseSSEError(data)

    expect(result).toBeNull()
  })

  it('should return null for invalid JSON', () => {
    const result = parseSSEError('not json')

    expect(result).toBeNull()
  })
})
