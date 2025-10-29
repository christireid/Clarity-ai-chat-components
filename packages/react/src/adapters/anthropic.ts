/**
 * Anthropic Model Adapter
 * 
 * Adapter for Anthropic's Claude models
 */

import type { 
  ModelAdapter
  // ChatMessage, // Reserved for future use
  // ModelConfig, // Reserved for future use
  // StreamChunk, // Reserved for future use
  // TokenUsage // Reserved for future use
} from './types'

export const anthropicAdapter: ModelAdapter = {
  name: 'anthropic',
  
  async chat(messages, config) {
    // Extract system message
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')
    
    const response = await fetch(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: typeof m.content === 'string' ? m.content : m.content
          })),
          max_tokens: config.maxTokens || 4096,
          temperature: config.temperature,
          top_p: config.topP,
          stop_sequences: config.stop
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      role: 'assistant',
      content: data.content[0]?.text || ''
    }
  },
  
  async *stream(messages, config) {
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')
    
    const response = await fetch(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: typeof m.content === 'string' ? m.content : m.content
          })),
          max_tokens: config.maxTokens || 4096,
          temperature: config.temperature,
          stream: true
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      yield {
        type: 'error',
        error: error.error?.message || response.statusText
      }
      return
    }
    
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    
    if (!reader) {
      yield { type: 'error', error: 'No response body' }
      return
    }
    
    let buffer = ''
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          yield { type: 'done' }
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          const trimmed = line.trim()
          
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          
          try {
            const json = JSON.parse(trimmed.slice(6))
            
            if (json.type === 'content_block_delta' && json.delta?.text) {
              yield {
                type: 'token',
                content: json.delta.text
              }
              
              config.streamOptions?.onToken?.(json.delta.text)
            }
            
            if (json.type === 'message_delta' && json.usage) {
              yield {
                type: 'done',
                usage: {
                  promptTokens: json.usage.input_tokens || 0,
                  completionTokens: json.usage.output_tokens || 0,
                  totalTokens: (json.usage.input_tokens || 0) + (json.usage.output_tokens || 0),
                  estimatedCost: this.estimateCost({
                    promptTokens: json.usage.input_tokens || 0,
                    completionTokens: json.usage.output_tokens || 0,
                    totalTokens: (json.usage.input_tokens || 0) + (json.usage.output_tokens || 0)
                  }, config.model)
                }
              }
            }
          } catch (e) {
            console.error('Failed to parse streaming chunk:', e)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },
  
  estimateCost(usage, model) {
    // Pricing per 1M tokens (as of 2024)
    const rates: Record<string, { input: number; output: number }> = {
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
      'claude-2.1': { input: 8, output: 24 },
      'claude-2.0': { input: 8, output: 24 }
    }
    
    const rate = rates[model] || rates['claude-3-sonnet-20240229']
    
    return (
      (usage.promptTokens / 1000000) * rate.input +
      (usage.completionTokens / 1000000) * rate.output
    )
  }
}

export const anthropicModels = [
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic' as const,
    speed: 'medium' as const,
    cost: 'high' as const,
    quality: 'best' as const,
    contextWindow: 200000,
    description: 'Most capable Claude model, exceptional reasoning',
    streaming: true,
    toolCalling: true,
    vision: true
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'excellent' as const,
    contextWindow: 200000,
    description: 'Balanced performance and cost',
    streaming: true,
    toolCalling: true,
    vision: true
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 200000,
    description: 'Fastest Claude model, great for simple tasks',
    streaming: true,
    toolCalling: true,
    vision: true
  }
]
