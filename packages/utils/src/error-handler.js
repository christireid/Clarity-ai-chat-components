/**
 * Unified Error Handler
 *
 * Centralized error handling with consistent formatting, retry logic, and reporting
 *
 * @module @clarity-chat/utils/error-handler
 *
 * @example
 * ```ts
 * import { UnifiedErrorHandler } from '@clarity-chat/utils/error-handler'
 *
 * // Handle errors consistently
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   UnifiedErrorHandler.handle(error, { userId, operation: 'api-call' })
 * }
 *
 * // Check if error is retryable
 * if (UnifiedErrorHandler.isRetryable(error)) {
 *   // Retry the operation
 * }
 * ```
 */
import { GenericClarityError } from './errors/base.js';
import { getLogger } from './logger/index.js';
import { isError } from './validation/index.js';
import { formatError } from './errors/utils.js';
const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    maxRetryDelay: 30000,
    retryableErrors: [
        'NetworkError',
        'TimeoutError',
        'ConnectionError',
        'ServiceUnavailableError',
        'RateLimitError',
        'APINetworkError',
        'APITimeoutError',
    ],
};
/**
 * Unified error handling with consistent formatting and retry logic
 */
export class UnifiedErrorHandler {
    static logger = getLogger('error-handler');
    static errorHistory = [];
    static maxHistorySize = 1000;
    static retryConfig = DEFAULT_RETRY_CONFIG;
    /**
     * Handle an error with consistent formatting and logging
     */
    static handle(error, context) {
        const processedError = this.processError(error, context);
        // Log the error based on severity
        this.logError(processedError);
        // Store in history
        this.addToHistory(processedError);
        // Handle based on severity
        this.handleBySeverity(processedError);
        return processedError;
    }
    /**
     * Process raw error into standardized format
     */
    static processError(error, context) {
        const timestamp = new Date();
        const errorObj = isError(error)
            ? error
            : new GenericClarityError(String(error));
        const errorType = errorObj.constructor.name;
        const processedError = {
            id: this.generateErrorId(),
            timestamp,
            type: errorType,
            message: errorObj.message,
            stack: errorObj.stack,
            context: {
                ...context,
                timestamp: context?.timestamp || timestamp,
            },
            isRetryable: this.isRetryable(errorObj),
            severity: this.determineSeverity(errorObj),
            formattedMessage: this.formatForDisplay(errorObj),
        };
        return processedError;
    }
    /**
     * Determine if an error is retryable
     */
    static isRetryable(error) {
        const errorType = error.constructor.name;
        const errorMessage = error.message.toLowerCase();
        // Check if error type is in retryable list
        if (this.retryConfig.retryableErrors.includes(errorType)) {
            return true;
        }
        // Check error message for retryable patterns
        const retryablePatterns = [
            'network',
            'timeout',
            'connection',
            'service unavailable',
            'rate limit',
            'econnrefused',
            'enotfound',
            'etimedout',
        ];
        return retryablePatterns.some((pattern) => errorMessage.includes(pattern));
    }
    /**
     * Determine error severity
     */
    static determineSeverity(error) {
        const errorType = error.constructor.name;
        const errorMessage = error.message.toLowerCase();
        // Critical errors
        if (errorType.includes('OutOfMemoryError') ||
            errorMessage.includes('out of memory')) {
            return 'critical';
        }
        // High severity errors
        const highSeverityPatterns = [
            'unauthorized',
            'forbidden',
            'authentication',
            'permission',
        ];
        if (highSeverityPatterns.some((pattern) => errorMessage.includes(pattern))) {
            return 'high';
        }
        // Medium severity errors
        const mediumSeverityPatterns = [
            'validation',
            'parsing',
            'format',
            'invalid',
        ];
        if (mediumSeverityPatterns.some((pattern) => errorMessage.includes(pattern))) {
            return 'medium';
        }
        // Low severity errors (default)
        return 'low';
    }
    /**
     * Format error for display
     */
    static formatForDisplay(error) {
        return formatError(error);
    }
    /**
     * Log error based on severity
     */
    static logError(processedError) {
        const { severity, type, message, context } = processedError;
        const logMessage = `[${type}] ${message}`;
        switch (severity) {
            case 'critical':
                this.logger.error(logMessage, { context, severity, type });
                break;
            case 'high':
                this.logger.error(logMessage, { context, severity, type });
                break;
            case 'medium':
                this.logger.warn(logMessage, { context, severity, type });
                break;
            case 'low':
                this.logger.info(logMessage, { context, severity, type });
                break;
        }
    }
    /**
     * Handle error based on severity
     */
    static handleBySeverity(processedError) {
        const { severity, isRetryable } = processedError;
        switch (severity) {
            case 'critical':
                // Critical errors might require immediate attention
                this.logger.error('Critical error detected - may require immediate attention', processedError);
                break;
            case 'high':
                // High severity errors should be logged and potentially alerted
                if (isRetryable) {
                    this.logger.info('High severity error is retryable', processedError);
                }
                break;
            case 'medium':
                // Medium severity errors are logged for monitoring
                break;
            case 'low':
                // Low severity errors are informational
                break;
        }
    }
    /**
     * Add error to history
     */
    static addToHistory(processedError) {
        this.errorHistory.push(processedError);
        // Limit history size
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
        }
    }
    /**
     * Generate unique error ID
     */
    static generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Create an error report
     */
    static createErrorReport() {
        if (this.errorHistory.length === 0) {
            return {
                id: this.generateErrorId(),
                timestamp: new Date(),
                errors: [],
                summary: {
                    totalErrors: 0,
                    errorTypes: {},
                    retryableErrors: 0,
                    oldestError: new Date(),
                    newestError: new Date(),
                },
            };
        }
        const errorTypes = {};
        let retryableErrors = 0;
        let oldestError = this.errorHistory[0].timestamp;
        let newestError = this.errorHistory[0].timestamp;
        for (const error of this.errorHistory) {
            errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
            if (error.isRetryable) {
                retryableErrors++;
            }
            if (error.timestamp < oldestError) {
                oldestError = error.timestamp;
            }
            if (error.timestamp > newestError) {
                newestError = error.timestamp;
            }
        }
        return {
            id: this.generateErrorId(),
            timestamp: new Date(),
            errors: [...this.errorHistory],
            summary: {
                totalErrors: this.errorHistory.length,
                errorTypes,
                retryableErrors,
                oldestError,
                newestError,
            },
        };
    }
    /**
     * Retry an operation with exponential backoff
     */
    static async retryWithBackoff(operation, options = {}) {
        const config = { ...this.retryConfig, ...options };
        let lastError;
        for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = isError(error) ? error : new Error(String(error));
                if (!this.isRetryable(lastError) || attempt === config.maxRetries) {
                    throw lastError;
                }
                const delay = Math.min(config.retryDelay * Math.pow(config.backoffMultiplier, attempt - 1), config.maxRetryDelay);
                this.logger.info(`Operation failed (attempt ${attempt}/${config.maxRetries}), retrying in ${delay}ms`, { error: lastError.message });
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError || new Error('Operation failed after all retries');
    }
    /**
     * Configure retry behavior
     */
    static configureRetry(config) {
        this.retryConfig = { ...this.retryConfig, ...config };
    }
    /**
     * Get current retry configuration
     */
    static getRetryConfig() {
        return { ...this.retryConfig };
    }
    /**
     * Clear error history
     */
    static clearHistory() {
        this.errorHistory = [];
    }
    /**
     * Get error statistics
     */
    static getStatistics() {
        if (this.errorHistory.length === 0) {
            return {
                totalErrors: 0,
                retryableErrors: 0,
                errorTypes: {},
                averageSeverity: 0,
                timeRange: { start: new Date(), end: new Date() },
            };
        }
        const severityValues = { low: 1, medium: 2, high: 3, critical: 4 };
        let totalSeverity = 0;
        const errorTypes = {};
        let retryableErrors = 0;
        for (const error of this.errorHistory) {
            errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
            totalSeverity += severityValues[error.severity];
            if (error.isRetryable) {
                retryableErrors++;
            }
        }
        const averageSeverity = totalSeverity / this.errorHistory.length;
        const oldestError = this.errorHistory[0].timestamp;
        const newestError = this.errorHistory[this.errorHistory.length - 1].timestamp;
        return {
            totalErrors: this.errorHistory.length,
            retryableErrors,
            errorTypes,
            averageSeverity,
            timeRange: { start: oldestError, end: newestError },
        };
    }
}
// Convenience functions for backward compatibility
export function handleError(error, context) {
    return UnifiedErrorHandler.handle(error, context);
}
export function isRetryableError(error) {
    return UnifiedErrorHandler.isRetryable(error);
}
export function formatErrorForDisplay(error) {
    return UnifiedErrorHandler.formatForDisplay(error);
}
export function retryOperation(operation, options) {
    return UnifiedErrorHandler.retryWithBackoff(operation, options);
}
export default {
    UnifiedErrorHandler,
    handleError,
    isRetryableError,
    formatErrorForDisplay,
    retryOperation,
};
//# sourceMappingURL=error-handler.js.map