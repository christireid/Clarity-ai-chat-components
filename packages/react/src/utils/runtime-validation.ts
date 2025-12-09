/**
 * Runtime Validation Utilities
 *
 * Simple runtime checks for agent configuration.
 * These are development-time helpers to catch common mistakes.
 */

import type { Tool } from '../agents/types'

/**
 * Validate a model identifier
 * @throws Error if model is invalid
 */
export function validateModel(model: string): void {
  if (!model || typeof model !== 'string') {
    throw new Error('Model must be a non-empty string')
  }

  if (model.trim().length === 0) {
    throw new Error('Model cannot be an empty string')
  }
}

/**
 * Validate an array of tools
 * @throws Error if any tool is invalid
 */
export function validateTools(tools: Tool[]): void {
  if (!Array.isArray(tools)) {
    throw new Error('Tools must be an array')
  }

  for (const tool of tools) {
    if (!tool.name || typeof tool.name !== 'string') {
      throw new Error('Each tool must have a name string')
    }

    if (typeof tool.execute !== 'function') {
      throw new Error(`Tool "${tool.name}" must have an execute function`)
    }
  }
}

/**
 * Validate an API endpoint URL
 * @throws Error if endpoint is invalid
 */
export function validateApiEndpoint(endpoint: string): void {
  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('API endpoint must be a non-empty string')
  }

  // Basic URL validation
  if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
    throw new Error('API endpoint must be a valid URL or path starting with /')
  }
}

/**
 * Validate a storage key
 * @throws Error if storage key is invalid
 */
export function validateStorageKey(key: string): void {
  if (!key || typeof key !== 'string') {
    throw new Error('Storage key must be a non-empty string')
  }

  if (key.trim().length === 0) {
    throw new Error('Storage key cannot be empty')
  }
}

/**
 * Validate a vector store provider
 * @throws Error if provider is invalid
 */
export function validateVectorStoreProvider(provider: string): void {
  const validProviders = [
    'pinecone',
    'weaviate',
    'qdrant',
    'milvus',
    'chroma',
    'memory',
  ]
  if (!validProviders.includes(provider)) {
    throw new Error(
      `Invalid vector store provider: ${provider}. Must be one of: ${validProviders.join(', ')}`
    )
  }
}

/**
 * Validate an embedding provider
 * @throws Error if provider is invalid
 */
export function validateEmbeddingProvider(provider: string): void {
  const validProviders = [
    'openai',
    'cohere',
    'anthropic',
    'huggingface',
    'custom',
  ]
  if (!validProviders.includes(provider)) {
    throw new Error(
      `Invalid embedding provider: ${provider}. Must be one of: ${validProviders.join(', ')}`
    )
  }
}

/**
 * Validate a streaming protocol
 * @throws Error if protocol is invalid
 */
export function validateStreamingProtocol(protocol: string): void {
  const validProtocols = ['sse', 'websocket', 'polling']
  if (!validProtocols.includes(protocol)) {
    throw new Error(
      `Invalid streaming protocol: ${protocol}. Must be one of: ${validProtocols.join(', ')}`
    )
  }
}
