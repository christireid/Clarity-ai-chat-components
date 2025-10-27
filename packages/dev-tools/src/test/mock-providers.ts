/**
 * Mock AI providers for testing
 * 
 * Provides fake implementations of OpenAI, Anthropic, and Google AI
 * for testing without making real API calls
 */

export interface MockResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  delay?: number
}

export interface MockStreamChunk {
  content: string
  delay?: number
}

export interface MockProviderOptions {
  responses?: MockResponse[]
  streamChunks?: MockStreamChunk[]
  error?: Error
  delay?: number
}

/**
 * Mock OpenAI client
 */
export class MockOpenAI {
  private options: MockProviderOptions
  private callCount = 0

  constructor(options: MockProviderOptions = {}) {
    this.options = options
  }

  chat = {
    completions: {
      create: async (params: any) => {
        this.callCount++

        // Simulate error
        if (this.options.error) {
          throw this.options.error
        }

        // Simulate delay
        if (this.options.delay) {
          await this.delay(this.options.delay)
        }

        // Handle streaming
        if (params.stream) {
          return this.createMockStream()
        }

        // Return mock response
        const response = this.options.responses?.[this.callCount - 1] || {
          content: 'Mock response from OpenAI',
          model: params.model || 'gpt-4-turbo',
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30
          }
        }

        return {
          id: `mock-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: response.model,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: response.content
              },
              finish_reason: 'stop'
            }
          ],
          usage: {
            prompt_tokens: response.usage.promptTokens,
            completion_tokens: response.usage.completionTokens,
            total_tokens: response.usage.totalTokens
          }
        }
      }
    }
  }

  private async *createMockStream() {
    const chunks = this.options.streamChunks || [
      { content: 'Mock ' },
      { content: 'streaming ' },
      { content: 'response' }
    ]

    for (const chunk of chunks) {
      if (chunk.delay) {
        await this.delay(chunk.delay)
      }

      yield {
        id: `mock-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: 'gpt-4-turbo',
        choices: [
          {
            index: 0,
            delta: {
              content: chunk.content
            },
            finish_reason: null
          }
        ]
      }
    }

    // Final chunk
    yield {
      id: `mock-${Date.now()}`,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: 'gpt-4-turbo',
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }
      ]
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getCallCount(): number {
    return this.callCount
  }

  reset(): void {
    this.callCount = 0
  }
}

/**
 * Mock Anthropic client
 */
export class MockAnthropic {
  private options: MockProviderOptions
  private callCount = 0

  constructor(options: MockProviderOptions = {}) {
    this.options = options
  }

  messages = {
    create: async (params: any) => {
      this.callCount++

      // Simulate error
      if (this.options.error) {
        throw this.options.error
      }

      // Simulate delay
      if (this.options.delay) {
        await this.delay(this.options.delay)
      }

      // Handle streaming
      if (params.stream) {
        return this.createMockStream()
      }

      // Return mock response
      const response = this.options.responses?.[this.callCount - 1] || {
        content: 'Mock response from Claude',
        model: params.model || 'claude-3-opus-20240229',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30
        }
      }

      return {
        id: `msg_mock${Date.now()}`,
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: response.content
          }
        ],
        model: response.model,
        stop_reason: 'end_turn',
        usage: {
          input_tokens: response.usage.promptTokens,
          output_tokens: response.usage.completionTokens
        }
      }
    }
  }

  private async *createMockStream() {
    const chunks = this.options.streamChunks || [
      { content: 'Mock ' },
      { content: 'streaming ' },
      { content: 'response' }
    ]

    // Start event
    yield {
      type: 'message_start',
      message: {
        id: `msg_mock${Date.now()}`,
        type: 'message',
        role: 'assistant',
        content: [],
        model: 'claude-3-opus-20240229',
        usage: { input_tokens: 10, output_tokens: 0 }
      }
    }

    // Content chunks
    for (const chunk of chunks) {
      if (chunk.delay) {
        await this.delay(chunk.delay)
      }

      yield {
        type: 'content_block_delta',
        index: 0,
        delta: {
          type: 'text_delta',
          text: chunk.content
        }
      }
    }

    // End event
    yield {
      type: 'message_delta',
      delta: {
        stop_reason: 'end_turn'
      },
      usage: { output_tokens: 20 }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getCallCount(): number {
    return this.callCount
  }

  reset(): void {
    this.callCount = 0
  }
}

/**
 * Mock Google AI client
 */
export class MockGoogleAI {
  private options: MockProviderOptions
  private callCount = 0

  constructor(options: MockProviderOptions = {}) {
    this.options = options
  }

  getGenerativeModel(config: any) {
    return {
      generateContent: async (prompt: string) => {
        this.callCount++

        // Simulate error
        if (this.options.error) {
          throw this.options.error
        }

        // Simulate delay
        if (this.options.delay) {
          await this.delay(this.options.delay)
        }

        // Return mock response
        const response = this.options.responses?.[this.callCount - 1] || {
          content: 'Mock response from Gemini',
          model: config.model || 'gemini-pro',
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30
          }
        }

        return {
          response: {
            text: () => response.content,
            usageMetadata: {
              promptTokenCount: response.usage.promptTokens,
              candidatesTokenCount: response.usage.completionTokens,
              totalTokenCount: response.usage.totalTokens
            }
          }
        }
      },

      generateContentStream: (async function* (this: MockGoogleAI, prompt: string) {
        const chunks = this.options.streamChunks || [
          { content: 'Mock ' },
          { content: 'streaming ' },
          { content: 'response' }
        ]

        for (const chunk of chunks) {
          if (chunk.delay) {
            await this.delay(chunk.delay)
          }

          yield {
            text: () => chunk.content
          }
        }
      }).bind(this)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getCallCount(): number {
    return this.callCount
  }

  reset(): void {
    this.callCount = 0
  }
}

/**
 * Create mock providers
 */
export function createMockProviders(options?: MockProviderOptions) {
  return {
    openai: new MockOpenAI(options),
    anthropic: new MockAnthropic(options),
    google: new MockGoogleAI(options)
  }
}

/**
 * Predefined mock scenarios
 */
export const mockScenarios = {
  success: {
    responses: [
      {
        content: 'This is a successful mock response',
        model: 'gpt-4-turbo',
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
      }
    ]
  },

  multiTurn: {
    responses: [
      {
        content: 'First response',
        model: 'gpt-4-turbo',
        usage: { promptTokens: 10, completionTokens: 15, totalTokens: 25 }
      },
      {
        content: 'Second response',
        model: 'gpt-4-turbo',
        usage: { promptTokens: 12, completionTokens: 18, totalTokens: 30 }
      }
    ]
  },

  streaming: {
    streamChunks: [
      { content: 'The ', delay: 50 },
      { content: 'quick ', delay: 50 },
      { content: 'brown ', delay: 50 },
      { content: 'fox ', delay: 50 },
      { content: 'jumps ', delay: 50 },
      { content: 'over ', delay: 50 },
      { content: 'the ', delay: 50 },
      { content: 'lazy ', delay: 50 },
      { content: 'dog', delay: 50 }
    ]
  },

  rateLimitError: {
    error: Object.assign(new Error('Rate limit exceeded'), {
      status: 429,
      type: 'rate_limit_error'
    })
  },

  authError: {
    error: Object.assign(new Error('Invalid API key'), {
      status: 401,
      type: 'authentication_error'
    })
  },

  networkError: {
    error: Object.assign(new Error('Network connection failed'), {
      code: 'ECONNREFUSED'
    })
  },

  slowResponse: {
    delay: 5000,
    responses: [
      {
        content: 'This is a slow response',
        model: 'gpt-4-turbo',
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
      }
    ]
  }
}
