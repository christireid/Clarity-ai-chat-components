/**
 * Runtime Validation Utilities
 *
 * Simple runtime checks for agent configuration.
 * These are development-time helpers to catch common mistakes.
 */
/**
 * Validate a model identifier
 * @throws Error if model is invalid
 */
export function validateModel(model) {
    if (!model || typeof model !== 'string') {
        throw new Error('Model must be a non-empty string');
    }
    if (model.trim().length === 0) {
        throw new Error('Model cannot be an empty string');
    }
}
/**
 * Validate an array of tools
 * @throws Error if any tool is invalid
 */
export function validateTools(tools) {
    if (!Array.isArray(tools)) {
        throw new Error('Tools must be an array');
    }
    for (const tool of tools) {
        if (!tool.name || typeof tool.name !== 'string') {
            throw new Error('Each tool must have a name string');
        }
        if (typeof tool.execute !== 'function') {
            throw new Error(`Tool "${tool.name}" must have an execute function`);
        }
    }
}
/**
 * Validate an API endpoint URL
 * @param endpoint - The endpoint to validate
 * @param componentName - Optional component name for better error messages
 * @throws Error if endpoint is invalid
 */
export function validateApiEndpoint(endpoint, componentName) {
    const prefix = componentName ? `[${componentName}] ` : '';
    if (!endpoint || typeof endpoint !== 'string') {
        throw new Error(`${prefix}API endpoint must be a non-empty string`);
    }
    // Basic URL validation
    if (!endpoint.startsWith('/') && !endpoint.startsWith('http')) {
        throw new Error(`${prefix}API endpoint must be a valid URL or path starting with /`);
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
export function validateEnum(value, paramName, componentName, allowedValues, defaultValue) {
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`[${componentName}] ${paramName} is required`);
    }
    if (!allowedValues.includes(value)) {
        if (defaultValue !== undefined) {
            console.warn(`[${componentName}] Invalid ${paramName}: "${value}". ` +
                `Must be one of: ${allowedValues.join(', ')}. Using default: "${defaultValue}"`);
            return defaultValue;
        }
        throw new Error(`[${componentName}] Invalid ${paramName}: "${value}". ` +
            `Must be one of: ${allowedValues.join(', ')}`);
    }
    return value;
}
/**
 * Validate a storage key
 * @param key - The storage key to validate
 * @param componentName - Optional component name for better error messages
 * @throws Error if storage key is invalid
 */
export function validateStorageKey(key, componentName) {
    const prefix = componentName ? `[${componentName}] ` : '';
    if (!key || typeof key !== 'string') {
        throw new Error(`${prefix}Storage key must be a non-empty string`);
    }
    if (key.trim().length === 0) {
        throw new Error(`${prefix}Storage key cannot be empty`);
    }
}
/**
 * Validate a vector store provider
 * @throws Error if provider is invalid
 */
export function validateVectorStoreProvider(provider) {
    const validProviders = [
        'pinecone',
        'weaviate',
        'qdrant',
        'milvus',
        'chroma',
        'memory',
    ];
    if (!validProviders.includes(provider)) {
        throw new Error(`Invalid vector store provider: ${provider}. Must be one of: ${validProviders.join(', ')}`);
    }
}
/**
 * Validate an embedding provider
 * @throws Error if provider is invalid
 */
export function validateEmbeddingProvider(provider) {
    const validProviders = [
        'openai',
        'cohere',
        'anthropic',
        'huggingface',
        'custom',
    ];
    if (!validProviders.includes(provider)) {
        throw new Error(`Invalid embedding provider: ${provider}. Must be one of: ${validProviders.join(', ')}`);
    }
}
/**
 * Validate a streaming protocol
 * @throws Error if protocol is invalid
 */
export function validateStreamingProtocol(protocol) {
    const validProtocols = ['sse', 'websocket', 'polling'];
    if (!validProtocols.includes(protocol)) {
        throw new Error(`Invalid streaming protocol: ${protocol}. Must be one of: ${validProtocols.join(', ')}`);
    }
}
//# sourceMappingURL=runtime-validation.js.map