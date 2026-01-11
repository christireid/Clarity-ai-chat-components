/**
 * Runtime validation utilities for hooks
 */

import type { Tool } from '../agents/types'

/**
 * Valid model prefixes
 */
const VALID_MODEL_PREFIXES = [
  'gpt-',
  'claude-',
  'gemini-',
  'llama-',
  'mistral-',
  'command-',
]

/**
 * Validate model identifier
 */
export function validateModel(model: string): void {
  if (!model || typeof model !== 'string') {
    throw new Error('Model must be a non-empty string')
  }

  const isValidPrefix = VALID_MODEL_PREFIXES.some((prefix) =>
    model.toLowerCase().startsWith(prefix)
  )

  if (!isValidPrefix && process.env['NODE_ENV'] === 'development') {
    console.warn(
      `[validateModel] Unknown model prefix: ${model}. Expected one of: ${VALID_MODEL_PREFIXES.join(', ')}`
    )
  }
}

/**
 * Validate tools array
 */
export function validateTools(tools: Tool[]): void {
  if (!Array.isArray(tools)) {
    throw new Error('Tools must be an array')
  }

  for (const tool of tools) {
    if (!tool.name || typeof tool.name !== 'string') {
      throw new Error('Each tool must have a valid name')
    }

    if (!tool.description || typeof tool.description !== 'string') {
      throw new Error(`Tool "${tool.name}" must have a description`)
    }

    if (typeof tool.execute !== 'function') {
      throw new Error(`Tool "${tool.name}" must have an execute function`)
    }
  }
}

/**
 * Valid vector store providers
 */
const VALID_VECTOR_STORES = ['pinecone', 'qdrant', 'weaviate', 'chroma']

/**
 * Validate vector store provider
 */
export function validateVectorStoreProvider(provider: string): void {
  if (!provider || typeof provider !== 'string') {
    throw new Error('Vector store provider must be a non-empty string')
  }

  if (!VALID_VECTOR_STORES.includes(provider)) {
    throw new Error(
      `Invalid vector store provider: ${provider}. Expected one of: ${VALID_VECTOR_STORES.join(', ')}`
    )
  }
}

/**
 * Valid embedding providers
 */
const VALID_EMBEDDING_PROVIDERS = ['openai', 'cohere', 'custom']

/**
 * Validate embedding provider
 */
export function validateEmbeddingProvider(provider: string): void {
  if (!provider || typeof provider !== 'string') {
    throw new Error('Embedding provider must be a non-empty string')
  }

  if (!VALID_EMBEDDING_PROVIDERS.includes(provider)) {
    throw new Error(
      `Invalid embedding provider: ${provider}. Expected one of: ${VALID_EMBEDDING_PROVIDERS.join(', ')}`
    )
  }
}
