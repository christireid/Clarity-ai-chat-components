/**
 * Runtime validation utilities
 * 
 * Provides developer-friendly validation and error messages for public APIs
 */

/**
 * Validate API endpoint URL
 */
export function validateApiEndpoint(api: unknown): asserts api is string {
  if (typeof api !== 'string') {
    throw new Error(
      `[ClarityChat] Invalid API endpoint: expected string, got ${typeof api}. ` +
      `Please provide a valid API endpoint URL, e.g., '/api/chat' or 'https://api.example.com/chat'`
    )
  }

  if (api.trim() === '') {
    throw new Error(
      `[ClarityChat] API endpoint cannot be empty. ` +
      `Please provide a valid API endpoint URL, e.g., '/api/chat'`
    )
  }

  // Basic URL validation (allow relative paths)
  if (!api.startsWith('/') && !api.startsWith('http://') && !api.startsWith('https://')) {
    throw new Error(
      `[ClarityChat] Invalid API endpoint format: '${api}'. ` +
      `API endpoint must be a relative path (starting with '/') or absolute URL (starting with 'http://' or 'https://')`
    )
  }
}

/**
 * Validate that a required prop is provided
 */
export function validateRequiredProp<T>(
  prop: T | undefined,
  propName: string,
  componentName: string
): asserts prop is T {
  if (prop === undefined || prop === null) {
    throw new Error(
      `[${componentName}] Missing required prop: '${propName}'. ` +
      `Please provide ${propName} to use ${componentName}.`
    )
  }
}

/**
 * Validate memory strategy
 */
export function validateMemoryStrategy(
  strategy: unknown
): asserts strategy is 'sliding-window' | 'semantic-chunks' | 'vector-store' {
  const validStrategies = ['sliding-window', 'semantic-chunks', 'vector-store']
  
  if (typeof strategy !== 'string' || !validStrategies.includes(strategy)) {
    throw new Error(
      `[ClarityChat] Invalid memory strategy: '${strategy}'. ` +
      `Valid strategies are: ${validStrategies.join(', ')}`
    )
  }
}

/**
 * Validate that a hook is used within a provider
 */
export function validateProviderContext<T>(
  context: T | null,
  providerName: string,
  hookName: string
): asserts context is T {
  if (context === null) {
    throw new Error(
      `[${hookName}] ${hookName} must be used within a ${providerName}. ` +
      `Please wrap your component with <${providerName}> to use ${hookName}.`
    )
  }
}

/**
 * Validate messages array
 */
export function validateMessages(messages: unknown): asserts messages is Array<any> {
  if (!Array.isArray(messages)) {
    throw new Error(
      `[ClarityChat] Invalid messages: expected array, got ${typeof messages}. ` +
      `Please provide an array of message objects.`
    )
  }
}

/**
 * Validate that a function is provided
 */
export function validateFunction<T extends (...args: any[]) => any>(
  fn: unknown,
  paramName: string,
  context: string
): asserts fn is T {
  if (typeof fn !== 'function') {
    throw new Error(
      `[${context}] Invalid ${paramName}: expected function, got ${typeof fn}. ` +
      `Please provide a valid function for ${paramName}.`
    )
  }
}

/**
 * Validate model identifier
 */
export function validateModel(model: unknown): asserts model is string {
  if (typeof model !== 'string' || model.trim() === '') {
    throw new Error(
      `[useAgent] Invalid model: expected non-empty string, got ${typeof model}. ` +
      `Please provide a valid model identifier, e.g., 'gpt-4', 'claude-3-opus'.`
    )
  }
}

/**
 * Validate tools array
 */
export function validateTools(tools: unknown): asserts tools is Array<any> {
  if (!Array.isArray(tools)) {
    throw new Error(
      `[useAgent] Invalid tools: expected array, got ${typeof tools}. ` +
      `Please provide an array of tool objects.`
    )
  }
}

/**
 * Validate vector store provider
 */
export function validateVectorStoreProvider(
  provider: unknown
): asserts provider is 'pinecone' | 'qdrant' | 'weaviate' | 'chroma' {
  const validProviders = ['pinecone', 'qdrant', 'weaviate', 'chroma']
  
  if (typeof provider !== 'string' || !validProviders.includes(provider)) {
    throw new Error(
      `[useRAGPipeline] Invalid vector store provider: '${provider}'. ` +
      `Valid providers are: ${validProviders.join(', ')}`
    )
  }
}

/**
 * Validate embedding provider
 */
export function validateEmbeddingProvider(
  provider: unknown
): asserts provider is 'openai' | 'cohere' | 'custom' {
  const validProviders = ['openai', 'cohere', 'custom']
  
  if (typeof provider !== 'string' || !validProviders.includes(provider)) {
    throw new Error(
      `[useRAGPipeline] Invalid embedding provider: '${provider}'. ` +
      `Valid providers are: ${validProviders.join(', ')}`
    )
  }
}

/**
 * Validate streaming protocol
 */
export function validateStreamingProtocol(
  protocol: unknown
): asserts protocol is 'sse' | 'websocket' {
  const validProtocols = ['sse', 'websocket']
  
  if (typeof protocol !== 'string' || !validProtocols.includes(protocol)) {
    throw new Error(
      `[useStreamingChat] Invalid streaming protocol: '${protocol}'. ` +
      `Valid protocols are: ${validProtocols.join(', ')}`
    )
  }
}

/**
 * Create a developer-friendly error message
 */
export function createDeveloperError(
  componentOrHook: string,
  issue: string,
  solution: string
): Error {
  return new Error(
    `[${componentOrHook}] ${issue}\n\nSolution: ${solution}`
  )
}

/**
 * Warn in development mode
 */
export function warnInDevelopment(message: string): void {
  if (process.env['NODE_ENV'] === 'development') {
    console.warn(`[ClarityChat] ${message}`)
  }
}
