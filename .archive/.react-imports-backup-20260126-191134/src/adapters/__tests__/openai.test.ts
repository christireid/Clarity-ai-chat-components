import { describe, it, expect, vi, beforeEach } from 'vitest'
import { openAIAdapter, openAIModels } from '../openai'
import type { ChatMessage, ModelConfig } from '../types'

// Mock fetch globally
global.fetch = vi.fn()

describe('OpenAI Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('chat', () => {
    it('should send chat completion request', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Hello! How can I help you today?',
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
      ]

      const config: ModelConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'test-key',
      }

      const response = await openAIAdapter.chat(messages, config)

      expect(response.role).toBe('assistant')
      expect(response.content).toBe('Hello! How can I help you today?')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
          }),
        })
      )
    })

    it('should handle API errors', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
      ]

      const config: ModelConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'invalid-key',
      }

      await expect(openAIAdapter.chat(messages, config)).rejects.toThrow()
    })

    it('should use custom base URL', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { role: 'assistant', content: 'Response' } }],
        }),
      })

      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }]
      const config: ModelConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'test-key',
        baseURL: 'https://custom.openai.azure.com',
      }

      await openAIAdapter.chat(messages, config)

      expect(fetch).toHaveBeenCalledWith(
        'https://custom.openai.azure.com/chat/completions',
        expect.any(Object)
      )
    })

    it('should include temperature and maxTokens in request', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { role: 'assistant', content: 'Response' } }],
        }),
      })

      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }]
      const config: ModelConfig = {
        provider: 'openai',
        model: 'gpt-4-turbo',
        apiKey: 'test-key',
        temperature: 0.7,
        maxTokens: 1000,
      }

      await openAIAdapter.chat(messages, config)

      const callArgs = (fetch as any).mock.calls[0][1]
      const body = JSON.parse(callArgs.body)
      
      expect(body.temperature).toBe(0.7)
      expect(body.max_tokens).toBe(1000)
    })
  })

  describe('estimateCost', () => {
    it('should calculate GPT-4 Turbo cost correctly', () => {
      const usage = {
        promptTokens: 1000,
        completionTokens: 500,
        totalTokens: 1500,
      }

      const cost = openAIAdapter.estimateCost(usage, 'gpt-4-turbo')

      // $0.01 per 1K input + $0.03 per 1K output
      // (1000/1000) * 0.01 + (500/1000) * 0.03 = 0.01 + 0.015 = 0.025
      expect(cost).toBe(0.025)
    })

    it('should calculate GPT-3.5 Turbo cost correctly', () => {
      const usage = {
        promptTokens: 1000,
        completionTokens: 500,
        totalTokens: 1500,
      }

      const cost = openAIAdapter.estimateCost(usage, 'gpt-3.5-turbo')

      // $0.0015 per 1K input + $0.002 per 1K output
      // (1000/1000) * 0.0015 + (500/1000) * 0.002 = 0.0015 + 0.001 = 0.0025
      expect(cost).toBe(0.0025)
    })

    it('should return 0 for unknown models', () => {
      const usage = {
        promptTokens: 1000,
        completionTokens: 500,
        totalTokens: 1500,
      }

      const cost = openAIAdapter.estimateCost(usage, 'unknown-model')
      expect(cost).toBe(0)
    })
  })

  describe('openAIModels', () => {
    it('should export model metadata', () => {
      expect(openAIModels).toBeDefined()
      expect(Array.isArray(openAIModels)).toBe(true)
      expect(openAIModels.length).toBeGreaterThan(0)
    })

    it('should have correct GPT-4 Turbo metadata', () => {
      const gpt4Turbo = openAIModels.find(m => m.id === 'gpt-4-turbo')
      
      expect(gpt4Turbo).toBeDefined()
      expect(gpt4Turbo?.name).toBe('GPT-4 Turbo')
      expect(gpt4Turbo?.provider).toBe('openai')
      expect(gpt4Turbo?.speed).toBe('fast')
      expect(gpt4Turbo?.cost).toBe('medium')
      expect(gpt4Turbo?.quality).toBe('best')
      expect(gpt4Turbo?.contextWindow).toBe(128000)
    })

    it('should have correct GPT-3.5 Turbo metadata', () => {
      const gpt35Turbo = openAIModels.find(m => m.id === 'gpt-3.5-turbo')
      
      expect(gpt35Turbo).toBeDefined()
      expect(gpt35Turbo?.speed).toBe('fastest')
      expect(gpt35Turbo?.cost).toBe('low')
    })
  })

  describe('adapter properties', () => {
    it('should have correct adapter name', () => {
      expect(openAIAdapter.name).toBe('openai')
    })

    it('should have required methods', () => {
      expect(typeof openAIAdapter.chat).toBe('function')
      expect(typeof openAIAdapter.stream).toBe('function')
      expect(typeof openAIAdapter.estimateCost).toBe('function')
    })
  })
})
