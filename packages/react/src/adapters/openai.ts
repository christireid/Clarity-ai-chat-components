/**
 * OpenAI Model Adapter
 * 
 * Adapter for OpenAI's GPT models (GPT-4, GPT-3.5, etc.)
 */

import type { 
  ModelAdapter
  // ChatMessage, // Used implicitly via ModelAdapter
  // ModelConfig, // Used implicitly via ModelAdapter
  // StreamChunk, // Used implicitly via ModelAdapter
  // TokenUsage // Used implicitly via ModelAdapter
} from './types'

export const openAIAdapter: ModelAdapter = {
  name: 'openai',
  
  async chat(messages, config) {
    const response = await fetch(
      `${config.baseURL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey || process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map(m => ({
            role: m.role,
            content: typeof m.content === 'string' 
              ? m.content 
              : m.content.map(p => {
                  if (p.type === 'text') return { type: 'text', text: p.text }
                  if (p.type === 'image') return { type: 'image_url', image_url: { url: p.imageUrl } }
                  return p
                })
          })),
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
          stop: config.stop
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      role: 'assistant',
      content: data.choices[0].message.content || '',
      toolCalls: data.choices[0].message.tool_calls?.map((tc: any) => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments
        }
      }))
    }
  },
  
  async *stream(messages, config) {
    const response = await fetch(
      `${config.baseURL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey || process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map(m => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : m.content
          })),
          temperature: config.temperature,
          max_tokens: config.maxTokens,
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
          
          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue
          
          try {
            const json = JSON.parse(trimmed.slice(6))
            const delta = json.choices[0]?.delta
            
            if (delta?.content) {
              yield {
                type: 'token',
                content: delta.content
              }
              
              config.streamOptions?.onToken?.(delta.content)
            }
            
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.function) {
                  yield {
                    type: 'tool_call',
                    toolCall: {
                      id: tc.id || 'unknown',
                      type: 'function',
                      function: {
                        name: tc.function.name || '',
                        arguments: tc.function.arguments || '{}'
                      }
                    }
                  }
                }
              }
            }
            
            if (json.usage) {
              yield {
                type: 'done',
                usage: {
                  promptTokens: json.usage.prompt_tokens,
                  completionTokens: json.usage.completion_tokens,
                  totalTokens: json.usage.total_tokens,
                  estimatedCost: this.estimateCost({
                    promptTokens: json.usage.prompt_tokens,
                    completionTokens: json.usage.completion_tokens,
                    totalTokens: json.usage.total_tokens
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
    // Pricing per 1K tokens (as of 2024)
    const rates: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-32k': { input: 0.06, output: 0.12 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
      'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 }
    }
    
    const rate = rates[model] || rates['gpt-3.5-turbo']
    
    return (
      (usage.promptTokens / 1000) * rate.input +
      (usage.completionTokens / 1000) * rate.output
    )
  }
}

export const openAIModels = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 128000,
    description: 'Most capable model, best for complex tasks',
    streaming: true,
    toolCalling: true,
    vision: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai' as const,
    speed: 'medium' as const,
    cost: 'high' as const,
    quality: 'best' as const,
    contextWindow: 8192,
    description: 'Original GPT-4, excellent reasoning',
    streaming: true,
    toolCalling: true,
    vision: false
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 16385,
    description: 'Fast and affordable for simple tasks',
    streaming: true,
    toolCalling: true,
    vision: false
  }
]
