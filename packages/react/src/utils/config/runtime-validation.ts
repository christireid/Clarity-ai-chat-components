/**
 * Runtime Validation Utilities
 *
 * Simple runtime checks for configuration and props.
 * These helpers ensure type safety at runtime, especially for JavaScript consumers.
 */

import type { Tool } from '../../agents/types'

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
 * @param endpoint - The endpoint to validate
 * @param componentName - Optional component name for better error messages
 * @throws Error if endpoint is invalid
 */
export function validateApiEndpoint(
  endpoint: string,
  componentName?: string
): void {
  const prefix = componentName ? `[${componentName}] ` : ''

  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error(`${prefix}API endpoint must be a non-empty string`)
  }

  // Basic URL validation
  // Allow relative paths starting with / or absolute URLs
  if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
    throw new Error(
      `${prefix}API endpoint must be a valid URL or path starting with /`
    )
  }
}

/**
 * Validate that a value is one of the allowed enum values
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param componentName - The component name for error messages
 * @param allowedValues - Array of allowed values
 * @param defaultValue - Default value to return if validation fails (if undefined, throws error)
 * @returns The validated value or default
 */
export function validateEnum<T extends string>(
  value: T | undefined,
  paramName: string,
  componentName: string,
  allowedValues: readonly T[],
  defaultValue?: T
): T {
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`[${componentName}] ${paramName} is required`)
  }

  if (!allowedValues.includes(value)) {
    if (defaultValue !== undefined) {
      console.warn(
        `[${componentName}] Invalid ${paramName}: "${value}". ` +
          `Must be one of: ${allowedValues.join(', ')}. Using default: "${defaultValue}"`
      )
      return defaultValue
    }
    throw new Error(
      `[${componentName}] Invalid ${paramName}: "${value}". ` +
        `Must be one of: ${allowedValues.join(', ')}`
    )
  }

  return value
}

/**
 * Validate a storage key
 * @param key - The storage key to validate
 * @param componentName - Optional component name for better error messages
 * @throws Error if storage key is invalid
 */
export function validateStorageKey(
  key: string | undefined,
  componentName?: string
): void {
  const prefix = componentName ? `[${componentName}] ` : ''

  if (!key || typeof key !== 'string') {
    throw new Error(`${prefix}Storage key must be a non-empty string`)
  }

  if (key.trim().length === 0) {
    throw new Error(`${prefix}Storage key cannot be empty`)
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

/**
 * Validate a required string prop
 * @param value - The value to validate
 * @param propName - The name of the prop
 * @param componentName - The component name for error context
 * @throws Error if value is not a string
 */
export function validateStringProp(
  value: any,
  propName: string,
  componentName: string
): void {
  if (typeof value !== 'string') {
    throw new Error(
      `[${componentName}] "${propName}" prop must be a string. Received: ${typeof value}`
    )
  }
}

/**
 * Validate a required function prop
 * @param value - The value to validate
 * @param propName - The name of the prop
 * @param componentName - The component name for error context
 * @throws Error if value is not a function
 */
export function validateFunctionProp(
  value: any,
  propName: string,
  componentName: string
): void {
  if (typeof value !== 'function') {
    throw new Error(
      `[${componentName}] "${propName}" prop must be a function. Received: ${typeof value}`
    )
  }
}

/**
 * Validate a required array prop
 * @param value - The value to validate
 * @param propName - The name of the prop
 * @param componentName - The component name for error context
 * @throws Error if value is not an array
 */
export function validateArrayProp(
  value: any,
  propName: string,
  componentName: string
): void {
  if (!Array.isArray(value)) {
    throw new Error(
      `[${componentName}] "${propName}" prop must be an array. Received: ${typeof value}`
    )
  }
}
