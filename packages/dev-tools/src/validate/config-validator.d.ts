/**
 * Configuration validator
 *
 * Validates environment variables, API keys, and configuration files
 */
export interface ValidationResult {
    valid: boolean;
    errors: Array<{
        field: string;
        message: string;
        severity: 'error' | 'warning';
    }>;
    warnings: Array<{
        field: string;
        message: string;
    }>;
}
export interface APIKeyConfig {
    name: string;
    envVar: string;
    required: boolean;
    pattern?: RegExp;
    testEndpoint?: string;
}
/**
 * Validate environment variables
 */
export declare function validateEnv(): ValidationResult;
/**
 * Validate specific API key
 */
export declare function validateAPIKey(provider: 'openai' | 'anthropic' | 'google', apiKey?: string): ValidationResult;
/**
 * Validate chat configuration
 */
export declare function validateChatConfig(config: {
    provider: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
}): ValidationResult;
/**
 * Validate messages array for chat
 */
export declare function validateMessages(messages: any[]): ValidationResult;
/**
 * Print validation results
 */
export declare function printValidationResults(results: ValidationResult, title?: string): void;
/**
 * Validate and throw error if invalid
 */
export declare function assertValid(results: ValidationResult, context?: string): void;
//# sourceMappingURL=config-validator.d.ts.map