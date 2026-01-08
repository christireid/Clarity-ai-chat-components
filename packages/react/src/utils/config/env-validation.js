/**
 * Environment Variable Validation Utilities
 *
 * Helps catch configuration issues early in development and production.
 * Provides clear error messages for missing or invalid configuration.
 */
/**
 * Required environment variables for AI functionality
 */
const AI_PROVIDER_VARS = {
    openai: ['OPENAI_API_KEY'],
    anthropic: ['ANTHROPIC_API_KEY'],
    google: ['GOOGLE_AI_API_KEY'],
};
/**
 * Required environment variables for vector store functionality
 */
const VECTOR_STORE_VARS = {
    pinecone: ['PINECONE_API_KEY', 'PINECONE_ENVIRONMENT', 'PINECONE_INDEX_NAME'],
    chroma: ['CHROMA_ENDPOINT'],
    supabase: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
};
/**
 * Check if running in browser environment
 */
const isBrowser = typeof window !== 'undefined';
/**
 * Safely get environment variable value
 */
function getEnvVar(key) {
    if (isBrowser) {
        // Check for NEXT_PUBLIC_ prefix in browser
        return window.__ENV__?.[key] || undefined;
    }
    return typeof process !== 'undefined' ? process.env?.[key] : undefined;
}
/**
 * Check if we're in production environment
 */
function isProduction() {
    return getEnvVar('NODE_ENV') === 'production';
}
/**
 * Validate AI provider configuration
 */
export function validateAIProvider(provider, options = {}) {
    const errors = [];
    const warnings = [];
    const config = {};
    const requiredVars = AI_PROVIDER_VARS[provider];
    for (const varName of requiredVars) {
        const value = getEnvVar(varName);
        config[varName] = value ? '[SET]' : undefined;
        if (!value) {
            if (isProduction()) {
                errors.push(`Missing required environment variable: ${varName}`);
            }
            else {
                warnings.push(`${varName} not set. AI features will use mock responses in development.`);
            }
        }
        else if (value.startsWith('sk-') && value.length < 20) {
            errors.push(`${varName} appears to be invalid (too short)`);
        }
    }
    const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        config,
    };
    if (options.logWarnings && warnings.length > 0) {
        console.warn('[Clarity Chat] Configuration warnings:', warnings);
    }
    if (options.throwOnError && !result.isValid) {
        throw new Error(`AI Provider configuration invalid:\n${errors.join('\n')}`);
    }
    return result;
}
/**
 * Validate vector store configuration
 */
export function validateVectorStore(provider, options = {}) {
    const errors = [];
    const warnings = [];
    const config = {};
    const requiredVars = VECTOR_STORE_VARS[provider];
    for (const varName of requiredVars) {
        const value = getEnvVar(varName);
        config[varName] = value ? '[SET]' : undefined;
        if (!value) {
            if (provider === 'chroma') {
                // Chroma has a localhost fallback, so it's just a warning
                warnings.push(`${varName} not set. Using localhost:8000 fallback (development only).`);
            }
            else if (isProduction()) {
                errors.push(`Missing required environment variable: ${varName}`);
            }
            else {
                warnings.push(`${varName} not set. Vector search features may be limited.`);
            }
        }
    }
    // Additional validation for specific providers
    if (provider === 'chroma') {
        const endpoint = getEnvVar('CHROMA_ENDPOINT');
        if (endpoint?.includes('localhost') && isProduction()) {
            errors.push('CHROMA_ENDPOINT points to localhost but NODE_ENV is production. ' +
                'This will fail in deployed environments.');
        }
    }
    const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        config,
    };
    if (options.logWarnings && warnings.length > 0) {
        console.warn('[Clarity Chat] Vector store warnings:', warnings);
    }
    if (options.throwOnError && !result.isValid) {
        throw new Error(`Vector store configuration invalid:\n${errors.join('\n')}`);
    }
    return result;
}
/**
 * Validate all Clarity Chat configuration
 */
export function validateClarityChatConfig(options = {}) {
    const errors = [];
    const warnings = [];
    const config = {};
    // Check for at least one AI provider
    const hasOpenAI = Boolean(getEnvVar('OPENAI_API_KEY'));
    const hasAnthropic = Boolean(getEnvVar('ANTHROPIC_API_KEY'));
    const hasGoogle = Boolean(getEnvVar('GOOGLE_AI_API_KEY'));
    if (!hasOpenAI && !hasAnthropic && !hasGoogle) {
        if (isProduction()) {
            errors.push('No AI provider configured. Set at least one of: ' +
                'OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_AI_API_KEY');
        }
        else {
            warnings.push('No AI provider configured. Using mock responses in development. ' +
                'Set MOCK_AI_RESPONSES=true to explicitly enable mock mode.');
        }
    }
    config.OPENAI_API_KEY = hasOpenAI ? '[SET]' : undefined;
    config.ANTHROPIC_API_KEY = hasAnthropic ? '[SET]' : undefined;
    config.GOOGLE_AI_API_KEY = hasGoogle ? '[SET]' : undefined;
    // Check mock mode configuration
    const mockEnabled = getEnvVar('MOCK_AI_RESPONSES') === 'true';
    config.MOCK_AI_RESPONSES = mockEnabled ? 'true' : undefined;
    if (mockEnabled && isProduction()) {
        warnings.push('MOCK_AI_RESPONSES is enabled in production. ' +
            'AI features will return mock data.');
    }
    // Check streaming configuration
    const streamingEnabled = getEnvVar('ENABLE_STREAMING') !== 'false';
    config.ENABLE_STREAMING = streamingEnabled ? 'true' : 'false';
    // Check rate limiting
    const rateLimitDisabled = getEnvVar('DISABLE_RATE_LIMIT') === 'true';
    if (rateLimitDisabled && isProduction()) {
        warnings.push('Rate limiting is disabled in production. ' +
            'Consider enabling it to prevent abuse.');
    }
    config.DISABLE_RATE_LIMIT = rateLimitDisabled ? 'true' : undefined;
    const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        config,
    };
    if (options.logWarnings && warnings.length > 0) {
        console.warn('[Clarity Chat] Configuration warnings:', warnings);
    }
    if (options.throwOnError && !result.isValid) {
        throw new Error(`Clarity Chat configuration invalid:\n${errors.join('\n')}`);
    }
    return result;
}
/**
 * Check if mock mode should be used
 */
export function shouldUseMockMode() {
    // Explicit mock mode
    if (getEnvVar('MOCK_AI_RESPONSES') === 'true') {
        return true;
    }
    // No API keys configured in development
    const hasAnyKey = Boolean(getEnvVar('OPENAI_API_KEY')) ||
        Boolean(getEnvVar('ANTHROPIC_API_KEY')) ||
        Boolean(getEnvVar('GOOGLE_AI_API_KEY'));
    return !hasAnyKey && !isProduction();
}
/**
 * Get configuration summary for debugging
 */
export function getConfigSummary() {
    const result = validateClarityChatConfig({ logWarnings: false });
    const lines = [
        '=== Clarity Chat Configuration ===',
        `Environment: ${isProduction() ? 'production' : 'development'}`,
        `Mock Mode: ${shouldUseMockMode() ? 'enabled' : 'disabled'}`,
        '',
        'AI Providers:',
        `  OpenAI: ${result.config.OPENAI_API_KEY ? 'configured' : 'not set'}`,
        `  Anthropic: ${result.config.ANTHROPIC_API_KEY ? 'configured' : 'not set'}`,
        `  Google AI: ${result.config.GOOGLE_AI_API_KEY ? 'configured' : 'not set'}`,
        '',
        'Features:',
        `  Streaming: ${result.config.ENABLE_STREAMING === 'true' ? 'enabled' : 'disabled'}`,
        `  Rate Limiting: ${result.config.DISABLE_RATE_LIMIT ? 'disabled' : 'enabled'}`,
        '',
    ];
    if (result.warnings.length > 0) {
        lines.push('Warnings:');
        result.warnings.forEach((w) => lines.push(`  - ${w}`));
        lines.push('');
    }
    if (result.errors.length > 0) {
        lines.push('Errors:');
        result.errors.forEach((e) => lines.push(`  - ${e}`));
        lines.push('');
    }
    lines.push(`Status: ${result.isValid ? 'VALID' : 'INVALID'}`);
    lines.push('================================');
    return lines.join('\n');
}
//# sourceMappingURL=env-validation.js.map