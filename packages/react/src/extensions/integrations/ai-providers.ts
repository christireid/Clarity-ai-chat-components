import { logger } from '@clarity-chat/utils/logger';
/**
 * AI Model Provider Extensions
 *
 * Comprehensive integrations for AI/LLM providers.
 * Supports 12+ providers with unified interface.
 *
 * @packageDocumentation
 */

import type {
  ChatMessage,
  ModelAdapter,
  ModelConfig,
  ModelInfo,
  StreamChunk,
  TokenUsage,
} from '../../adapters/types'
import { defineExtension } from '../builder'
import type { Extension, ExtensionContext } from '../types'

// ============================================
// Types
// ============================================

/** Base AI provider config */
interface BaseAIProviderConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
  maxRetries?: number
  defaultModel?: string
}

// Cohere
export interface CohereConfig extends BaseAIProviderConfig {
  model?: 'command-r-plus' | 'command-r' | 'command' | 'command-light' | string
}

// Mistral
export interface MistralConfig extends BaseAIProviderConfig {
  model?:
    | 'mistral-large'
    | 'mistral-medium'
    | 'mistral-small'
    | 'codestral'
    | string
  safeMode?: boolean
}

// Together AI
export interface TogetherConfig extends BaseAIProviderConfig {
  model?: string
}

// Groq
export interface GroqConfig extends BaseAIProviderConfig {
  model?:
    | 'llama-3.1-70b-versatile'
    | 'mixtral-8x7b-32768'
    | 'gemma-7b-it'
    | string
}

// Ollama (local)
export interface OllamaConfig {
  baseURL?: string
  model?: string
  keepAlive?: string
  numCtx?: number
}

// Azure OpenAI
export interface AzureOpenAIConfig {
  apiKey: string
  endpoint: string
  deploymentName: string
  apiVersion?: string
  timeout?: number
}

// Fireworks
export interface FireworksConfig extends BaseAIProviderConfig {
  model?: string
}

// Perplexity
export interface PerplexityConfig extends BaseAIProviderConfig {
  model?:
    | 'llama-3.1-sonar-large-128k-online'
    | 'llama-3.1-sonar-small-128k-online'
    | string
  searchDomainFilter?: string[]
  returnImages?: boolean
  returnRelatedQuestions?: boolean
}

// Replicate
export interface ReplicateConfig extends BaseAIProviderConfig {
  model?: string
  version?: string
}

// Hugging Face
export interface HuggingFaceConfig extends BaseAIProviderConfig {
  model?: string
  useInferenceAPI?: boolean
}

// DeepSeek
export interface DeepSeekConfig extends BaseAIProviderConfig {
  model?: 'deepseek-chat' | 'deepseek-coder' | string
}

// AI21
export interface AI21Config extends BaseAIProviderConfig {
  model?: 'jamba-1.5-large' | 'jamba-1.5-mini' | string
}

// ============================================
// Model Information
// ============================================

export const cohereModels: ModelInfo[] = [
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'openai', // Use openai as placeholder, custom providers not in type
    speed: 'medium',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    vision: false,
  },
  {
    id: 'command-r',
    name: 'Command R',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    vision: false,
  },
]

export const mistralModels: ModelInfo[] = [
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'openai',
    speed: 'medium',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'codestral',
    name: 'Codestral',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 32000,
    streaming: true,
    toolCalling: false,
    vision: false,
  },
]

export const groqModels: ModelInfo[] = [
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 131072,
    streaming: true,
    toolCalling: true,
    vision: false,
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 32768,
    streaming: true,
    toolCalling: true,
    vision: false,
  },
]

// ============================================
// Adapter Implementations
// ============================================

function createGenericOpenAIAdapter(
  name: string,
  baseURL: string,
  apiKey: string,
  defaultModel: string
): ModelAdapter {
  return {
    name,

    async chat(
      messages: ChatMessage[],
      config: ModelConfig
    ): Promise<ChatMessage> {
      const response = await fetch(
        `${config.baseURL || baseURL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey || apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || defaultModel,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            top_p: config.topP,
            frequency_penalty: config.frequencyPenalty,
            presence_penalty: config.presencePenalty,
            stop: config.stop,
          }),
          signal: config.signal,
        }
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`${name} API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      return {
        role: 'assistant',
        content: data.choices[0].message.content,
      }
    },

    async *stream(
      messages: ChatMessage[],
      config: ModelConfig
    ): AsyncGenerator<StreamChunk, void, unknown> {
      const response = await fetch(
        `${config.baseURL || baseURL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey || apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || defaultModel,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            stream: true,
          }),
          signal: config.signal,
        }
      )

      if (!response.ok) {
        const error = await response.text()
        yield {
          type: 'error',
          error: `${name} API error: ${response.status} - ${error}`,
        }
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        yield { type: 'error', error: 'No response body' }
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                yield { type: 'done' }
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  yield { type: 'token', content }
                  config.streamOptions?.onToken?.(content)
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      yield { type: 'done' }
    },

    estimateCost(usage: TokenUsage, model: string): number {
      // Basic cost estimation - providers have different pricing
      const costPer1kInput = 0.001
      const costPer1kOutput = 0.002
      return (
        (usage.promptTokens / 1000) * costPer1kInput +
        (usage.completionTokens / 1000) * costPer1kOutput
      )
    },
  }
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Cohere AI extension
 */
export function createCohereExtension(
  config?: Partial<CohereConfig>
): Extension<CohereConfig> {
  return defineExtension<CohereConfig>({
    id: 'ai-cohere',
    name: 'Cohere',
    category: 'ai-provider',
    description: 'Cohere AI models with advanced RAG capabilities',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'rag', 'embeddings'],
    homepage: 'https://cohere.com',
    documentation: 'https://docs.cohere.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'COHERE_API_KEY' },
        model: { type: 'string', label: 'Model', default: 'command-r-plus' },
        baseURL: {
          type: 'string',
          label: 'Base URL',
          default: 'https://api.cohere.ai/v1',
        },
      },
    },

    defaultConfig: {
      model: 'command-r-plus',
      baseURL: 'https://api.cohere.ai/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'cohere',
        ctx.config.baseURL || 'https://api.cohere.ai/v1',
        ctx.config.apiKey,
        ctx.config.model || 'command-r-plus'
      )
      ctx.services.register('adapter', adapter)
      ctx.services.register('models', cohereModels)
      ctx.logger.info('Cohere extension initialized')
    },

    healthCheck: async (ctx) => {
      try {
        const response = await fetch('https://api.cohere.ai/v1/models', {
          headers: { Authorization: `Bearer ${ctx.config.apiKey}` },
        })
        return {
          healthy: response.ok,
          message: response.ok ? 'Connected' : 'Connection failed',
        }
      } catch (error) {
        return { healthy: false, message: String(error) }
      }
    },
  })
}

/**
 * Create Mistral AI extension
 */
export function createMistralExtension(
  config?: Partial<MistralConfig>
): Extension<MistralConfig> {
  return defineExtension<MistralConfig>({
    id: 'ai-mistral',
    name: 'Mistral AI',
    category: 'ai-provider',
    description: 'Mistral AI models - fast and efficient',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'mistral', 'code'],
    homepage: 'https://mistral.ai',
    documentation: 'https://docs.mistral.ai',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'MISTRAL_API_KEY' },
        model: { type: 'string', label: 'Model', default: 'mistral-large' },
        safeMode: { type: 'boolean', label: 'Safe Mode', default: false },
      },
    },

    defaultConfig: {
      model: 'mistral-large',
      baseURL: 'https://api.mistral.ai/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'mistral',
        ctx.config.baseURL || 'https://api.mistral.ai/v1',
        ctx.config.apiKey,
        ctx.config.model || 'mistral-large'
      )
      ctx.services.register('adapter', adapter)
      ctx.services.register('models', mistralModels)
      ctx.logger.info('Mistral extension initialized')
    },

    healthCheck: async (ctx) => {
      try {
        const response = await fetch('https://api.mistral.ai/v1/models', {
          headers: { Authorization: `Bearer ${ctx.config.apiKey}` },
        })
        return { healthy: response.ok }
      } catch {
        return { healthy: false }
      }
    },
  })
}

/**
 * Create Together AI extension
 */
export function createTogetherExtension(
  config?: Partial<TogetherConfig>
): Extension<TogetherConfig> {
  return defineExtension<TogetherConfig>({
    id: 'ai-together',
    name: 'Together AI',
    category: 'ai-provider',
    description: 'Access 100+ open source models via Together AI',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'open-source', 'inference'],
    homepage: 'https://together.ai',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'TOGETHER_API_KEY',
        },
        model: {
          type: 'string',
          label: 'Model',
          default: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
        },
      },
    },

    defaultConfig: {
      model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
      baseURL: 'https://api.together.xyz/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'together',
        ctx.config.baseURL || 'https://api.together.xyz/v1',
        ctx.config.apiKey,
        ctx.config.model || 'meta-llama/Llama-3.1-70B-Instruct-Turbo'
      )
      ctx.services.register('adapter', adapter)
      ctx.logger.info('Together AI extension initialized')
    },
  })
}

/**
 * Create Groq extension (ultra-fast inference)
 */
export function createGroqExtension(
  config?: Partial<GroqConfig>
): Extension<GroqConfig> {
  return defineExtension<GroqConfig>({
    id: 'ai-groq',
    name: 'Groq',
    category: 'ai-provider',
    description: 'Ultra-fast LLM inference with Groq LPU',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'fast', 'inference'],
    homepage: 'https://groq.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'GROQ_API_KEY' },
        model: {
          type: 'string',
          label: 'Model',
          default: 'llama-3.1-70b-versatile',
        },
      },
    },

    defaultConfig: {
      model: 'llama-3.1-70b-versatile',
      baseURL: 'https://api.groq.com/openai/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'groq',
        ctx.config.baseURL || 'https://api.groq.com/openai/v1',
        ctx.config.apiKey,
        ctx.config.model || 'llama-3.1-70b-versatile'
      )
      ctx.services.register('adapter', adapter)
      ctx.services.register('models', groqModels)
      ctx.logger.info('Groq extension initialized')
    },
  })
}

/**
 * Create Ollama extension (local models)
 */
export function createOllamaExtension(
  config?: Partial<OllamaConfig>
): Extension<OllamaConfig> {
  return defineExtension<OllamaConfig>({
    id: 'ai-ollama',
    name: 'Ollama',
    category: 'ai-provider',
    description: 'Run open-source LLMs locally with Ollama',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'local', 'privacy', 'open-source'],
    homepage: 'https://ollama.ai',

    configSchema: {
      version: '1.0',
      properties: {
        baseURL: {
          type: 'string',
          label: 'Base URL',
          default: 'http://localhost:11434',
        },
        model: { type: 'string', label: 'Model', default: 'llama3.1' },
        keepAlive: { type: 'string', label: 'Keep Alive', default: '5m' },
        numCtx: { type: 'number', label: 'Context Size', default: 4096 },
      },
    },

    defaultConfig: {
      baseURL: 'http://localhost:11434',
      model: 'llama3.1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter: ModelAdapter = {
        name: 'ollama',

        async chat(
          messages: ChatMessage[],
          modelConfig: ModelConfig
        ): Promise<ChatMessage> {
          const response = await fetch(`${ctx.config.baseURL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: modelConfig.model || ctx.config.model,
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              options: {
                temperature: modelConfig.temperature,
                num_ctx: ctx.config.numCtx,
              },
              keep_alive: ctx.config.keepAlive,
              stream: false,
            }),
            signal: modelConfig.signal,
          })

          if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`)
          }

          const data = await response.json()
          return { role: 'assistant', content: data.message.content }
        },

        async *stream(
          messages: ChatMessage[],
          modelConfig: ModelConfig
        ): AsyncGenerator<StreamChunk, void, unknown> {
          const response = await fetch(`${ctx.config.baseURL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: modelConfig.model || ctx.config.model,
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              options: { temperature: modelConfig.temperature },
              stream: true,
            }),
            signal: modelConfig.signal,
          })

          if (!response.ok) {
            yield { type: 'error', error: `Ollama error: ${response.status}` }
            return
          }

          const reader = response.body?.getReader()
          if (!reader) {
            yield { type: 'error', error: 'No response body' }
            return
          }

          const decoder = new TextDecoder()

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const text = decoder.decode(value, { stream: true })
              const lines = text.split('\n').filter((l) => l.trim())

              for (const line of lines) {
                try {
                  const data = JSON.parse(line)
                  if (data.message?.content) {
                    yield { type: 'token', content: data.message.content }
                    modelConfig.streamOptions?.onToken?.(data.message.content)
                  }
                  if (data.done) {
                    yield { type: 'done' }
                    return
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          } finally {
            reader.releaseLock()
          }

          yield { type: 'done' }
        },

        estimateCost(): number {
          return 0 // Local models are free
        },
      }

      ctx.services.register('adapter', adapter)
      ctx.logger.info('Ollama extension initialized')
    },

    healthCheck: async (ctx) => {
      try {
        const response = await fetch(`${ctx.config.baseURL}/api/tags`)
        return {
          healthy: response.ok,
          message: response.ok ? 'Ollama running' : 'Ollama offline',
        }
      } catch {
        return { healthy: false, message: 'Ollama not reachable' }
      }
    },
  })
}

/**
 * Create Azure OpenAI extension
 */
export function createAzureOpenAIExtension(
  config?: Partial<AzureOpenAIConfig>
): Extension<AzureOpenAIConfig> {
  return defineExtension<AzureOpenAIConfig>({
    id: 'ai-azure-openai',
    name: 'Azure OpenAI',
    category: 'ai-provider',
    description: 'Enterprise-grade OpenAI models via Azure',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'enterprise', 'azure', 'microsoft'],
    homepage: 'https://azure.microsoft.com/products/ai-services/openai-service',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'endpoint', 'deploymentName'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'AZURE_OPENAI_API_KEY',
        },
        endpoint: {
          type: 'string',
          label: 'Endpoint',
          envVar: 'AZURE_OPENAI_ENDPOINT',
        },
        deploymentName: { type: 'string', label: 'Deployment Name' },
        apiVersion: {
          type: 'string',
          label: 'API Version',
          default: '2024-02-15-preview',
        },
      },
    },

    defaultConfig: {
      apiVersion: '2024-02-15-preview',
      ...config,
    } as AzureOpenAIConfig,

    initialize: (ctx) => {
      const adapter: ModelAdapter = {
        name: 'azure-openai',

        async chat(
          messages: ChatMessage[],
          modelConfig: ModelConfig
        ): Promise<ChatMessage> {
          const url = `${ctx.config.endpoint}/openai/deployments/${ctx.config.deploymentName}/chat/completions?api-version=${ctx.config.apiVersion}`

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': ctx.config.apiKey,
            },
            body: JSON.stringify({
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens,
            }),
            signal: modelConfig.signal,
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(`Azure OpenAI error: ${response.status} - ${error}`)
          }

          const data = await response.json()
          return { role: 'assistant', content: data.choices[0].message.content }
        },

        async *stream(
          messages: ChatMessage[],
          modelConfig: ModelConfig
        ): AsyncGenerator<StreamChunk, void, unknown> {
          const url = `${ctx.config.endpoint}/openai/deployments/${ctx.config.deploymentName}/chat/completions?api-version=${ctx.config.apiVersion}`

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': ctx.config.apiKey,
            },
            body: JSON.stringify({
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens,
              stream: true,
            }),
            signal: modelConfig.signal,
          })

          if (!response.ok) {
            yield {
              type: 'error',
              error: `Azure OpenAI error: ${response.status}`,
            }
            return
          }

          const reader = response.body?.getReader()
          if (!reader) {
            yield { type: 'error', error: 'No response body' }
            return
          }

          const decoder = new TextDecoder()
          let buffer = ''

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() || ''

              for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.slice(6))
                    const content = data.choices?.[0]?.delta?.content
                    if (content) {
                      yield { type: 'token', content }
                      modelConfig.streamOptions?.onToken?.(content)
                    }
                  } catch {
                    // Skip
                  }
                }
              }
            }
          } finally {
            reader.releaseLock()
          }

          yield { type: 'done' }
        },

        estimateCost(usage: TokenUsage): number {
          // Azure pricing varies by region and tier
          return (
            (usage.promptTokens / 1000) * 0.003 +
            (usage.completionTokens / 1000) * 0.004
          )
        },
      }

      ctx.services.register('adapter', adapter)
      ctx.logger.info('Azure OpenAI extension initialized')
    },
  })
}

/**
 * Create Fireworks AI extension
 */
export function createFireworksExtension(
  config?: Partial<FireworksConfig>
): Extension<FireworksConfig> {
  return defineExtension<FireworksConfig>({
    id: 'ai-fireworks',
    name: 'Fireworks AI',
    category: 'ai-provider',
    description: 'Fast and efficient model inference',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'fast', 'inference'],
    homepage: 'https://fireworks.ai',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'FIREWORKS_API_KEY',
        },
        model: {
          type: 'string',
          label: 'Model',
          default: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
        },
      },
    },

    defaultConfig: {
      model: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
      baseURL: 'https://api.fireworks.ai/inference/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'fireworks',
        ctx.config.baseURL || 'https://api.fireworks.ai/inference/v1',
        ctx.config.apiKey,
        ctx.config.model || 'accounts/fireworks/models/llama-v3p1-70b-instruct'
      )
      ctx.services.register('adapter', adapter)
      ctx.logger.info('Fireworks AI extension initialized')
    },
  })
}

/**
 * Create Perplexity extension (AI search)
 */
export function createPerplexityExtension(
  config?: Partial<PerplexityConfig>
): Extension<PerplexityConfig> {
  return defineExtension<PerplexityConfig>({
    id: 'ai-perplexity',
    name: 'Perplexity',
    category: 'ai-provider',
    description: 'AI-powered search with real-time information',
    author: 'Clarity Chat',
    tags: ['ai', 'search', 'realtime', 'rag'],
    homepage: 'https://perplexity.ai',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'PERPLEXITY_API_KEY',
        },
        model: {
          type: 'string',
          label: 'Model',
          default: 'llama-3.1-sonar-large-128k-online',
        },
        returnImages: {
          type: 'boolean',
          label: 'Return Images',
          default: false,
        },
        returnRelatedQuestions: {
          type: 'boolean',
          label: 'Related Questions',
          default: true,
        },
      },
    },

    defaultConfig: {
      model: 'llama-3.1-sonar-large-128k-online',
      baseURL: 'https://api.perplexity.ai',
      returnRelatedQuestions: true,
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'perplexity',
        ctx.config.baseURL || 'https://api.perplexity.ai',
        ctx.config.apiKey,
        ctx.config.model || 'llama-3.1-sonar-large-128k-online'
      )
      ctx.services.register('adapter', adapter)
      ctx.logger.info('Perplexity extension initialized')
    },
  })
}

/**
 * Create Replicate extension
 */
export function createReplicateExtension(
  config?: Partial<ReplicateConfig>
): Extension<ReplicateConfig> {
  return defineExtension<ReplicateConfig>({
    id: 'ai-replicate',
    name: 'Replicate',
    category: 'ai-provider',
    description: 'Run open-source models in the cloud',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'open-source', 'cloud'],
    homepage: 'https://replicate.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Token',
          envVar: 'REPLICATE_API_TOKEN',
        },
        model: {
          type: 'string',
          label: 'Model',
          default: 'meta/llama-2-70b-chat',
        },
      },
    },

    defaultConfig: {
      model: 'meta/llama-2-70b-chat',
      ...config,
    },

    initialize: (ctx) => {
      ctx.logger.info('Replicate extension initialized')
      // Replicate uses a different API pattern - would need custom adapter
    },
  })
}

/**
 * Create Hugging Face extension
 */
export function createHuggingFaceExtension(
  config?: Partial<HuggingFaceConfig>
): Extension<HuggingFaceConfig> {
  return defineExtension<HuggingFaceConfig>({
    id: 'ai-huggingface',
    name: 'Hugging Face',
    category: 'ai-provider',
    description: 'Access thousands of models via Hugging Face',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'open-source', 'models'],
    homepage: 'https://huggingface.co',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Token',
          envVar: 'HUGGINGFACE_API_KEY',
        },
        model: {
          type: 'string',
          label: 'Model',
          default: 'meta-llama/Llama-3.1-70B-Instruct',
        },
        useInferenceAPI: {
          type: 'boolean',
          label: 'Use Inference API',
          default: true,
        },
      },
    },

    defaultConfig: {
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      useInferenceAPI: true,
      ...config,
    },

    initialize: (ctx) => {
      ctx.logger.info('Hugging Face extension initialized')
    },
  })
}

/**
 * Create DeepSeek extension
 */
export function createDeepSeekExtension(
  config?: Partial<DeepSeekConfig>
): Extension<DeepSeekConfig> {
  return defineExtension<DeepSeekConfig>({
    id: 'ai-deepseek',
    name: 'DeepSeek',
    category: 'ai-provider',
    description: 'Powerful AI models from DeepSeek',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'code', 'reasoning'],
    homepage: 'https://deepseek.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'DEEPSEEK_API_KEY',
        },
        model: { type: 'string', label: 'Model', default: 'deepseek-chat' },
      },
    },

    defaultConfig: {
      model: 'deepseek-chat',
      baseURL: 'https://api.deepseek.com/v1',
      ...config,
    },

    initialize: (ctx) => {
      const adapter = createGenericOpenAIAdapter(
        'deepseek',
        ctx.config.baseURL || 'https://api.deepseek.com/v1',
        ctx.config.apiKey,
        ctx.config.model || 'deepseek-chat'
      )
      ctx.services.register('adapter', adapter)
      ctx.logger.info('DeepSeek extension initialized')
    },
  })
}

/**
 * Create AI21 extension
 */
export function createAI21Extension(
  config?: Partial<AI21Config>
): Extension<AI21Config> {
  return defineExtension<AI21Config>({
    id: 'ai-ai21',
    name: 'AI21 Labs',
    category: 'ai-provider',
    description: 'Jamba models from AI21 Labs',
    author: 'Clarity Chat',
    tags: ['ai', 'llm', 'enterprise'],
    homepage: 'https://ai21.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'AI21_API_KEY' },
        model: { type: 'string', label: 'Model', default: 'jamba-1.5-large' },
      },
    },

    defaultConfig: {
      model: 'jamba-1.5-large',
      baseURL: 'https://api.ai21.com/studio/v1',
      ...config,
    },

    initialize: (ctx) => {
      ctx.logger.info('AI21 extension initialized')
    },
  })
}
