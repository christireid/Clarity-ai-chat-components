/**
 * Structured error logging service
 *
 * Provides consistent, structured logging for errors across the application
 * with support for batching, external service integration, and log levels.
 */
import { isClarityError } from '../errors/base-error';
/**
 * Create a structured error logger
 *
 * @example
 * ```typescript
 * const logger = createErrorLogger({
 *   endpoint: 'https://logging.example.com/errors',
 *   batchSize: 10,
 *   apiKey: process.env.LOGGING_API_KEY,
 * });
 *
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   console.error(error, {
 *     context: { operation: 'riskyOperation' },
 *     user: { id: userId },
 *   });
 * }
 * ```
 */
export function createErrorLogger(config = {}) {
    const { endpoint, apiKey, includeStackInProd = false, batchSize = 10, flushInterval = 5000, headers = {}, transform, filter, maxQueueSize = 1000, backpressureStrategy = 'drop-oldest', onDropped, } = config;
    let batch = [];
    let flushTimer = null;
    let isFlushBlocked = false;
    /**
     * Handle backpressure when queue is full
     * Returns true if the new entry should be added, false if it should be dropped
     */
    const handleBackpressure = () => {
        if (batch.length < maxQueueSize) {
            return true;
        }
        switch (backpressureStrategy) {
            case 'drop-oldest': {
                // Remove oldest entries to make room
                const dropped = batch.splice(0, 1);
                onDropped?.(dropped.length, 'queue-full-drop-oldest');
                return true;
            }
            case 'drop-newest': {
                // Don't add the new entry
                onDropped?.(1, 'queue-full-drop-newest');
                return false;
            }
            case 'block': {
                // If we're already flushing, drop the entry
                if (isFlushBlocked) {
                    onDropped?.(1, 'queue-full-blocked');
                    return false;
                }
                // Try to flush synchronously-ish
                flush();
                return batch.length < maxQueueSize;
            }
            default:
                return true;
        }
    };
    const flush = async () => {
        if (batch.length === 0)
            return;
        if (isFlushBlocked)
            return;
        isFlushBlocked = true;
        const toSend = [...batch];
        batch = [];
        try {
            if (endpoint) {
                try {
                    await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
                            ...headers,
                        },
                        body: JSON.stringify({ logs: toSend }),
                    });
                }
                catch (fetchError) {
                    // Re-add to batch if send fails, but respect max queue size
                    const spaceAvailable = maxQueueSize - batch.length;
                    if (spaceAvailable > 0) {
                        const toRequeue = toSend.slice(0, spaceAvailable);
                        batch.push(...toRequeue);
                        const dropped = toSend.length - toRequeue.length;
                        if (dropped > 0) {
                            onDropped?.(dropped, 'send-failed-queue-full');
                        }
                    }
                    else {
                        onDropped?.(toSend.length, 'send-failed-queue-full');
                    }
                    // Also log to console as fallback
                    console.error('[ErrorLogger] Failed to send logs to endpoint:', fetchError);
                    toSend.forEach((entry) => {
                        console[entry.level]('[ErrorLogger]', entry);
                    });
                }
            }
            else {
                // Log to console if no endpoint configured
                toSend.forEach((entry) => {
                    console[entry.level]('[ErrorLogger]', entry);
                });
            }
        }
        finally {
            isFlushBlocked = false;
        }
    };
    const scheduleFlush = () => {
        if (flushTimer)
            return;
        flushTimer = setTimeout(() => {
            flushTimer = null;
            flush();
        }, flushInterval);
    };
    const log = (level, error, options) => {
        const isProduction = process.env['NODE_ENV'] === 'production';
        const includeStack = !isProduction || includeStackInProd;
        let entry = {
            timestamp: new Date().toISOString(),
            level,
            error: {
                name: error.name,
                code: isClarityError(error) ? error.code : undefined,
                message: error.message,
                stack: includeStack ? error.stack : undefined,
            },
            context: {
                ...options?.context,
                ...(isClarityError(error) && error.context),
            },
            user: options?.user,
            request: options?.request,
            component: options?.component,
        };
        // Apply transform if provided
        if (transform) {
            entry = transform(entry);
        }
        // Apply filter if provided
        if (filter && !filter(entry)) {
            return;
        }
        // Check backpressure before adding
        if (!handleBackpressure()) {
            return;
        }
        batch.push(entry);
        if (batch.length >= batchSize) {
            flush();
        }
        else {
            scheduleFlush();
        }
    };
    return {
        error: (error, options) => log('error', error, options),
        warn: (error, options) => log('warn', error, options),
        info: (error, options) => log('info', error, options),
        flush,
        pendingCount: () => batch.length,
        clear: () => {
            batch = [];
            if (flushTimer) {
                clearTimeout(flushTimer);
                flushTimer = null;
            }
        },
    };
}
// Default logger instance (configured for development)
let defaultLogger = null;
/**
 * Get or create the default error logger
 *
 * @example
 * ```typescript
 * import { getErrorLogger } from '@clarity-chat/error-handling'
 *
 * const logger = getErrorLogger()
 * console.error(new Error('Something went wrong'))
 * ```
 */
export function getErrorLogger() {
    if (!defaultLogger) {
        defaultLogger = createErrorLogger({
            endpoint: process.env['ERROR_LOGGING_ENDPOINT'],
            apiKey: process.env['ERROR_LOGGING_API_KEY'],
            includeStackInProd: process.env['INCLUDE_STACK_IN_LOGS'] === 'true',
        });
    }
    return defaultLogger;
}
/**
 * Configure the default error logger
 *
 * @example
 * ```typescript
 * import { configureErrorLogger } from '@clarity-chat/error-handling'
 *
 * configureErrorLogger({
 *   endpoint: 'https://my-logging-service.com/logs',
 *   batchSize: 20,
 * })
 * ```
 */
export function configureErrorLogger(config) {
    defaultLogger = createErrorLogger(config);
}
/**
 * Log an error using the default logger
 *
 * @example
 * ```typescript
 * import { logError } from '@clarity-chat/error-handling'
 *
 * try {
 *   await fetchData()
 * } catch (error) {
 *   logError(error, { context: { action: 'fetchData' } })
 * }
 * ```
 */
export function logError(error, options) {
    getErrorLogger().error(error, options);
}
/**
 * Log a warning using the default logger
 */
export function logWarning(error, options) {
    getErrorLogger().warn(error, options);
}
/**
 * Log info using the default logger
 */
export function logInfo(error, options) {
    getErrorLogger().info(error, options);
}
/**
 * React error info adapter
 * Converts React ErrorInfo to LogOptions format
 *
 * @example
 * ```typescript
 * componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 *   logError(error, reactErrorInfoToLogOptions(errorInfo))
 * }
 * ```
 */
export function reactErrorInfoToLogOptions(errorInfo) {
    return {
        component: {
            stack: errorInfo.componentStack ?? undefined,
        },
    };
}
//# sourceMappingURL=error-logger.js.map