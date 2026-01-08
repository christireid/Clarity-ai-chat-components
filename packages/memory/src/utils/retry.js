/**
 * Retry Utilities
 *
 * Exponential backoff retry logic for network operations
 */
export class RetryError extends Error {
    attempts;
    lastError;
    constructor(message, attempts, lastError) {
        super(message);
        this.attempts = attempts;
        this.lastError = lastError;
        this.name = 'RetryError';
    }
}
/**
 * Retry a function with exponential backoff
 */
export async function retry(fn, options = {}) {
    const { maxAttempts = 3, initialDelay = 1000, maxDelay = 10000, backoffFactor = 2, retryableErrors = ['network', 'timeout', 'ECONNRESET', 'ETIMEDOUT'], } = options;
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            const errorMessage = lastError.message.toLowerCase();
            // Check if error is retryable
            const isRetryable = retryableErrors.some(retryable => errorMessage.includes(retryable.toLowerCase()));
            if (!isRetryable || attempt === maxAttempts) {
                throw lastError;
            }
            // Calculate delay with exponential backoff
            const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new RetryError(`Failed after ${maxAttempts} attempts`, maxAttempts, lastError);
}
/**
 * Check if an error is retryable
 */
export function isRetryableError(error) {
    const message = error.message.toLowerCase();
    const retryablePatterns = [
        'network',
        'timeout',
        'econnreset',
        'etimedout',
        'econnrefused',
        'enotfound',
        '503',
        '502',
        '504',
    ];
    return retryablePatterns.some(pattern => message.includes(pattern));
}
//# sourceMappingURL=retry.js.map