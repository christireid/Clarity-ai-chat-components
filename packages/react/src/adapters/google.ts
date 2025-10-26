/**
 * Google AI Model Adapter
 * 
 * Adapter for Google's Gemini models
 */

import type { 
  ModelAdapter, 
  ChatMessage, 
  ModelConfig, 
  StreamChunk, 
  TokenUsage 
} from './types'

export const googleAdapter: ModelAdapter = {
  name: 'google',
  
  async chat(messages, config) {
    const response = await fetch(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:generateContent?key=${config.apiKey || process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [
              {
                text: typeof m.content === 'string' ? m.content : 
                      m.content.find(p => p.type === 'text')?.text || ''
              }
            ]
          })),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
            topP: config.topP,
            stopSequences: config.stop
          }
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Google AI API error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      role: 'assistant',
      content: data.candidates[0]?.content?.parts[0]?.text || ''
    }
  },
  
  async *stream(messages, config) {
    const response = await fetch(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:streamGenerateContent?key=${config.apiKey || process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [
              {
                text: typeof m.content === 'string' ? m.content : 
                      m.content.find(p => p.type === 'text')?.text || ''
              }
            ]
          })),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
            topP: config.topP
          }
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
          
          if (!trimmed || trimmed === '[DONE]') continue
          
          try {
            const json = JSON.parse(trimmed)
            const candidate = json.candidates?.[0]
            
            if (candidate?.content?.parts) {
              for (const part of candidate.content.parts) {
                if (part.text) {
                  yield {
                    type: 'token',
                    content: part.text
                  }
                  
                  config.streamOptions?.onToken?.(part.text)
                }
              }
            }
            
            if (json.usageMetadata) {
              yield {
                type: 'done',
                usage: {
                  promptTokens: json.usageMetadata.promptTokenCount || 0,
                  completionTokens: json.usageMetadata.candidatesTokenCount || 0,
                  totalTokens: json.usageMetadata.totalTokenCount || 0,
                  estimatedCost: this.estimateCost({
                    promptTokens: json.usageMetadata.promptTokenCount || 0,
                    completionTokens: json.usageMetadata.candidatesTokenCount || 0,
                    totalTokens: json.usageMetadata.totalTokenCount || 0
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
      'gemini-1.5-pro': { input: 3.5, output: 10.5 },
      'gemini-1.5-flash': { input: 0.35, output: 1.05 },
      'gemini-1.0-pro': { input: 0.5, output: 1.5 }
    }
    
    const rate = rates[model] || rates['gemini-1.5-flash']
    
    return (
      (usage.promptTokens / 1000000) * rate.input +
      (usage.completionTokens / 1000000) * rate.output
    )
  }
}

export const googleModels = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google' as const,
    speed: 'medium' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 1000000,
    description: 'Largest context window, excellent reasoning',
    streaming: true,
    toolCalling: true,
    vision: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 1000000,
    description: 'Fast and affordable with huge context',
    streaming: true,
    toolCalling: true,
    vision: true
  },
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    provider: 'google' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 32000,
    description: 'Original Gemini model',
    streaming: true,
    toolCalling: true,
    vision: false
  }
]
