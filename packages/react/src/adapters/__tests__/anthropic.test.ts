import { describe, it, expect, vi, beforeEach } from 'vitest'
import { anthropicAdapter, anthropicModels } from '../anthropic'
import type { ChatMessage, ModelConfig } from '../types'

// Mock fetch globally
global.fetch = vi.fn()

describe('Anthropic Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('chat', () => {
    it('should send chat completion request', async () => {
      const mockResponse = {
        id: 'msg_123',
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'Hello! How can I assist you today?',
          },
        ],
        model: 'claude-3-opus',
        usage: {
          input_tokens: 10,
          output_tokens: 20,
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
        provider: 'anthropic',
        model: 'claude-3-opus',
        apiKey: 'test-key',
      }

      const response = await anthropicAdapter.chat(messages, config)

      expect(response.role).toBe('assistant')
      expect(response.content).toBe('Hello! How can I assist you today?')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'test-key',
            'anthropic-version': '2023-06-01',
          }),
        })
      )
    })

    it('should handle system messages separately', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: 'Response' }],
        }),
      })

      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' },
      ]

      const config: ModelConfig = {
        provider: 'anthropic',
        model: 'claude-3-opus',
        apiKey: 'test-key',
      }

      await anthropicAdapter.chat(messages, config)

      const callArgs = (fetch as any).mock.calls[0][1]
      const body = JSON.parse(callArgs.body)

      expect(body.system).toBe('You are a helpful assistant.')
      expect(body.messages.length).toBe(1)
      expect(body.messages[0].role).toBe('user')
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
        provider: 'anthropic',
        model: 'claude-3-opus',
        apiKey: 'invalid-key',
      }

      await expect(anthropicAdapter.chat(messages, config)).rejects.toThrow()
    })
  })

  describe('estimateCost', () => {
    it('should calculate Claude 3 Opus cost correctly', () => {
      const usage = {
        promptTokens: 1000000,
        completionTokens: 500000,
        totalTokens: 1500000,
      }

      const cost = anthropicAdapter.estimateCost(usage, 'claude-3-opus')

      // $15 per 1M input + $75 per 1M output
      // (1000000/1000000) * 15 + (500000/1000000) * 75 = 15 + 37.5 = 52.5
      expect(cost).toBe(52.5)
    })

    it('should calculate Claude 3 Sonnet cost correctly', () => {
      const usage = {
        promptTokens: 1000000,
        completionTokens: 500000,
        totalTokens: 1500000,
      }

      const cost = anthropicAdapter.estimateCost(usage, 'claude-3-sonnet')

      // $3 per 1M input + $15 per 1M output
      // (1000000/1000000) * 3 + (500000/1000000) * 15 = 3 + 7.5 = 10.5
      expect(cost).toBe(10.5)
    })

    it('should calculate Claude 3 Haiku cost correctly', () => {
      const usage = {
        promptTokens: 1000000,
        completionTokens: 500000,
        totalTokens: 1500000,
      }

      const cost = anthropicAdapter.estimateCost(usage, 'claude-3-haiku')

      // $0.25 per 1M input + $1.25 per 1M output
      // (1000000/1000000) * 0.25 + (500000/1000000) * 1.25 = 0.25 + 0.625 = 0.875
      expect(cost).toBe(0.875)
    })

    it('should return 0 for unknown models', () => {
      const usage = {
        promptTokens: 1000,
        completionTokens: 500,
        totalTokens: 1500,
      }

      const cost = anthropicAdapter.estimateCost(usage, 'unknown-model')
      expect(cost).toBe(0)
    })
  })

  describe('anthropicModels', () => {
    it('should export model metadata', () => {
      expect(anthropicModels).toBeDefined()
      expect(Array.isArray(anthropicModels)).toBe(true)
      expect(anthropicModels.length).toBe(3)
    })

    it('should have correct Claude 3 Opus metadata', () => {
      const opus = anthropicModels.find(m => m.id === 'claude-3-opus')
      
      expect(opus).toBeDefined()
      expect(opus?.name).toBe('Claude 3 Opus')
      expect(opus?.provider).toBe('anthropic')
      expect(opus?.speed).toBe('medium')
      expect(opus?.cost).toBe('high')
      expect(opus?.quality).toBe('best')
      expect(opus?.contextWindow).toBe(200000)
    })

    it('should have correct Claude 3 Sonnet metadata', () => {
      const sonnet = anthropicModels.find(m => m.id === 'claude-3-sonnet')
      
      expect(sonnet).toBeDefined()
      expect(sonnet?.speed).toBe('fast')
      expect(sonnet?.cost).toBe('medium')
      expect(sonnet?.quality).toBe('better')
    })

    it('should have correct Claude 3 Haiku metadata', () => {
      const haiku = anthropicModels.find(m => m.id === 'claude-3-haiku')
      
      expect(haiku).toBeDefined()
      expect(haiku?.speed).toBe('fastest')
      expect(haiku?.cost).toBe('low')
      expect(haiku?.quality).toBe('good')
    })
  })

  describe('adapter properties', () => {
    it('should have correct adapter name', () => {
      expect(anthropicAdapter.name).toBe('anthropic')
    })

    it('should have required methods', () => {
      expect(typeof anthropicAdapter.chat).toBe('function')
      expect(typeof anthropicAdapter.stream).toBe('function')
      expect(typeof anthropicAdapter.estimateCost).toBe('function')
    })
  })
})
