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

/**
 * Validate a number prop
 * @param value - The value to validate
 * @param propName - The name of the prop
 * @param componentName - The component name for error context
 * @param options - Validation options (min, max, integer)
 * @throws Error if value is not a valid number
 */
export function validateNumberProp(
  value: any,
  propName: string,
  componentName: string,
  options?: {
    min?: number
    max?: number
    integer?: boolean
    positive?: boolean
  }
): void {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(
      `[${componentName}] "${propName}" must be a number. Received: ${typeof value}`
    )
  }

  if (options?.integer && !Number.isInteger(value)) {
    throw new Error(
      `[${componentName}] "${propName}" must be an integer. Received: ${value}`
    )
  }

  if (options?.positive && value <= 0) {
    throw new Error(
      `[${componentName}] "${propName}" must be positive. Received: ${value}`
    )
  }

  if (options?.min !== undefined && value < options.min) {
    throw new Error(
      `[${componentName}] "${propName}" must be at least ${options.min}. Received: ${value}`
    )
  }

  if (options?.max !== undefined && value > options.max) {
    throw new Error(
      `[${componentName}] "${propName}" must be at most ${options.max}. Received: ${value}`
    )
  }
}

/**
 * Validate virtualization props
 * @param props - The virtualization props to validate
 * @param componentName - The component name for error context
 * @throws Error if any prop is invalid
 */
export function validateVirtualizationProps(
  props: {
    itemHeight?: number | ((index: number) => number)
    overscan?: number
    threshold?: number
    maxMessages?: number
  },
  componentName: string
): void {
  const { itemHeight, overscan, threshold, maxMessages } = props

  // Validate itemHeight
  if (itemHeight !== undefined) {
    if (typeof itemHeight === 'number') {
      validateNumberProp(itemHeight, 'itemHeight', componentName, {
        min: 1,
        positive: true,
      })
    } else if (typeof itemHeight !== 'function') {
      throw new Error(
        `[${componentName}] "itemHeight" must be a number or function. Received: ${typeof itemHeight}`
      )
    }
  }

  // Validate overscan
  if (overscan !== undefined) {
    validateNumberProp(overscan, 'overscan', componentName, {
      min: 0,
      integer: true,
    })

    if (overscan > 50) {
      console.warn(
        `[${componentName}] Large "overscan" value (${overscan}) may impact performance. ` +
        `Recommended: 2-10 items`
      )
    }
  }

  // Validate threshold
  if (threshold !== undefined) {
    validateNumberProp(threshold, 'threshold', componentName, {
      min: 0,
      max: 1,
    })
  }

  // Validate maxMessages
  if (maxMessages !== undefined) {
    validateNumberProp(maxMessages, 'maxMessages', componentName, {
      min: 1,
      integer: true,
      positive: true,
    })

    if (maxMessages < 100) {
      console.warn(
        `[${componentName}] Small "maxMessages" value (${maxMessages}) may cause ` +
        `frequent message pruning. Recommended: 100-1000 messages`
      )
    }
  }
}

/**
 * Validate streaming configuration props
 * @param props - The streaming props to validate
 * @param componentName - The component name for error context
 * @throws Error if any prop is invalid
 */
export function validateStreamingProps(
  props: {
    stream?: boolean
    streamProtocol?: 'sse' | 'data' | 'webstream'
    maxSteps?: number
    keepLastMessageOnError?: boolean
  },
  componentName: string
): void {
  const { stream, streamProtocol, maxSteps, keepLastMessageOnError } = props

  // Validate stream
  if (stream !== undefined && typeof stream !== 'boolean') {
    throw new Error(
      `[${componentName}] "stream" must be a boolean. Received: ${typeof stream}`
    )
  }

  // Validate streamProtocol
  if (streamProtocol !== undefined) {
    const validProtocols = ['sse', 'data', 'webstream'] as const
    validateEnum(
      streamProtocol,
      'streamProtocol',
      componentName,
      validProtocols,
      'sse'
    )
  }

  // Validate maxSteps
  if (maxSteps !== undefined) {
    validateNumberProp(maxSteps, 'maxSteps', componentName, {
      min: 1,
      integer: true,
      positive: true,
    })

    if (maxSteps > 100) {
      console.warn(
        `[${componentName}] Large "maxSteps" value (${maxSteps}) may cause long waits. ` +
        `Consider limiting to 10-20 steps`
      )
    }
  }

  // Validate keepLastMessageOnError
  if (keepLastMessageOnError !== undefined && typeof keepLastMessageOnError !== 'boolean') {
    throw new Error(
      `[${componentName}] "keepLastMessageOnError" must be a boolean. Received: ${typeof keepLastMessageOnError}`
    )
  }
}

/**
 * Validate callback props
 * @param callbacks - Object containing callback props
 * @param componentName - The component name for error context
 * @throws Error if any callback is not a function
 */
export function validateCallbacks(
  callbacks: Record<string, any>,
  componentName: string
): void {
  for (const [name, callback] of Object.entries(callbacks)) {
    if (callback !== undefined && typeof callback !== 'function') {
      throw new Error(
        `[${componentName}] "${name}" must be a function. Received: ${typeof callback}`
      )
    }
  }
}

/**
 * Validate messages array prop
 * @param messages - The messages array to validate
 * @param componentName - The component name for error context
 * @throws Error if messages is invalid
 */
export function validateMessages(
  messages: any,
  componentName: string
): void {
  if (!Array.isArray(messages)) {
    throw new Error(
      `[${componentName}] "messages" must be an array. Received: ${typeof messages}`
    )
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]

    if (!message || typeof message !== 'object') {
      throw new Error(
        `[${componentName}] messages[${i}] must be an object. Received: ${typeof message}`
      )
    }

    if (!message.role || typeof message.role !== 'string') {
      throw new Error(
        `[${componentName}] messages[${i}].role must be a string. Received: ${typeof message.role}`
      )
    }

    const validRoles = ['user', 'assistant', 'system', 'function', 'tool']
    if (!validRoles.includes(message.role)) {
      throw new Error(
        `[${componentName}] messages[${i}].role must be one of: ${validRoles.join(', ')}. ` +
        `Received: "${message.role}"`
      )
    }

    if (message.content === undefined) {
      throw new Error(
        `[${componentName}] messages[${i}].content is required`
      )
    }
  }
}
