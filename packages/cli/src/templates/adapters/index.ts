/**
 * Adapter Templates
 *
 * Templates for generating AI provider adapters with streaming support.
 */

export const adapter = `import type { ChatMessage, ModelConfig, StreamChunk } from '@clarity-chat/types'

/**
 * {{pascalName}}Adapter Configuration
 */
export interface {{pascalName}}Config {
  /** API key for authentication */
  apiKey: string
  /** Base URL for API calls */
  baseUrl?: string
  /** Default model to use */
  model?: string
  /** Default temperature */
  temperature?: number
  /** Default max tokens */
  maxTokens?: number
  /** Request timeout in milliseconds */
  timeout?: number
  /** Custom headers to include */
  headers?: Record<string, string>
}

/**
 * {{pascalName}}Adapter Interface
 */
export interface {{pascalName}}Adapter {
  /** Stream chat completions */
  stream: (
    messages: ChatMessage[],
    config?: Partial<ModelConfig>
  ) => AsyncGenerator<StreamChunk>
  /** Non-streaming chat completion */
  complete: (
    messages: ChatMessage[],
    config?: Partial<ModelConfig>
  ) => Promise<string>
  /** Count tokens for messages */
  countTokens?: (messages: ChatMessage[]) => Promise<number>
  /** List available models */
  listModels?: () => Promise<string[]>
}

/**
 * {{pascalName}}Adapter - {{description}}
 *
 * @example
 * \`\`\`tsx
 * const adapter = create{{pascalName}}Adapter({ apiKey: 'your-key' })
 *
 * // Streaming
 * for await (const chunk of adapter.stream(messages)) {
 *   console.log(chunk.content)
 * }
 *
 * // Non-streaming
 * const response = await adapter.complete(messages)
 * \`\`\`
 */
export function create{{pascalName}}Adapter(
  config: {{pascalName}}Config
): {{pascalName}}Adapter {
  const {
    apiKey,
    baseUrl = '{{#if (eq provider "openai")}}https://api.openai.com/v1{{else if (eq provider "anthropic")}}https://api.anthropic.com/v1{{else if (eq provider "google")}}https://generativelanguage.googleapis.com/v1beta{{else}}https://api.example.com/v1{{/if}}',
    model = '{{#if (eq provider "openai")}}gpt-4{{else if (eq provider "anthropic")}}claude-3-opus-20240229{{else if (eq provider "google")}}gemini-pro{{else}}default-model{{/if}}',
    temperature = 0.7,
    maxTokens = 1000,
    timeout = 30000,
    headers = {},
  } = config

  /**
   * Make a fetch request with timeout
   */
  async function fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Stream chat completions
   */
  async function* stream(
    messages: ChatMessage[],
    overrides?: Partial<ModelConfig>
  ): AsyncGenerator<StreamChunk> {
    const response = await fetchWithTimeout(\`\${baseUrl}/chat/completions\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        model: overrides?.model || model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: overrides?.temperature ?? temperature,
        max_tokens: overrides?.maxTokens ?? maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(\`API error: \${response.status} - \${error}\`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content

              if (content) {
                yield {
                  type: 'content' as const,
                  content,
                }
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Non-streaming chat completion
   */
  async function complete(
    messages: ChatMessage[],
    overrides?: Partial<ModelConfig>
  ): Promise<string> {
    const response = await fetchWithTimeout(\`\${baseUrl}/chat/completions\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        model: overrides?.model || model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: overrides?.temperature ?? temperature,
        max_tokens: overrides?.maxTokens ?? maxTokens,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(\`API error: \${response.status} - \${error}\`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  return {
    stream,
    complete,
  }
}
`

export const adapterTest = `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { create{{pascalName}}Adapter } from './{{camelName}}Adapter'


describe('{{pascalName}}Adapter', () => {
  const mockApiKey = 'test-api-key'
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create{{pascalName}}Adapter', () => {
    it('should create an adapter with required config', () => {
      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })

      expect(adapter).toHaveProperty('stream')
      expect(adapter).toHaveProperty('complete')
    })
  })

  describe('complete', () => {
    it('should make a non-streaming request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Hello!' } }],
        }),
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })
      const result = await adapter.complete([
        { role: 'user', content: 'Hi' },
      ])

      expect(result).toBe('Hello!')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: \`Bearer \${mockApiKey}\`,
          }),
        })
      )
    })

    it('should throw on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })

      await expect(
        adapter.complete([{ role: 'user', content: 'Hi' }])
      ).rejects.toThrow('API error: 401')
    })

    it('should use custom config overrides', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Response' } }],
        }),
      })

      const adapter = create{{pascalName}}Adapter({
        apiKey: mockApiKey,
        model: 'default-model',
      })

      await adapter.complete(
        [{ role: 'user', content: 'Hi' }],
        { model: 'custom-model', temperature: 0.5 }
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('custom-model'),
        })
      )
    })
  })

  describe('stream', () => {
    it('should yield chunks from streaming response', async () => {
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\\n'),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":" World"}}]}\\n'),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: [DONE]\\n'),
          })
          .mockResolvedValueOnce({ done: true }),
        releaseLock: vi.fn(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })
      const chunks: string[] = []

      for await (const chunk of adapter.stream([{ role: 'user', content: 'Hi' }])) {
        if (chunk.type === 'content') {
          chunks.push(chunk.content)
        }
      }

      expect(chunks).toEqual(['Hello', ' World'])
    })
  })
})
`
