/**
 * API Inspector for debugging AI provider API calls
 *
 * Provides detailed logging and inspection of:
 * - Request headers and body
 * - Response headers and body
 * - Timing information
 * - Token usage and cost
 * - Streaming chunks
 */
import { keyValueTable } from '../ui/table';
import { successBox, errorBox, infoBox } from '../ui/box';
import chalk from 'chalk';
class APIInspector {
    logs = new Map();
    enabled = false;
    verbose = false;
    maxLogs = 100;
    constructor(options = {}) {
        this.enabled = options.enabled ?? process.env.NODE_ENV === 'development';
        this.verbose = options.verbose ?? false;
        this.maxLogs = options.maxLogs ?? 100;
    }
    /**
     * Start tracking an API call
     */
    startCall(options) {
        if (!this.enabled)
            return '';
        const id = `${options.provider}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const log = {
            id,
            timestamp: new Date(),
            provider: options.provider,
            model: options.model,
            endpoint: options.endpoint,
            request: {
                method: options.method,
                headers: this.sanitizeHeaders(options.headers),
                body: this.sanitizeBody(options.body)
            },
            timing: {
                startTime: performance.now()
            }
        };
        this.logs.set(id, log);
        // Maintain max logs limit
        if (this.logs.size > this.maxLogs) {
            const firstKey = this.logs.keys().next().value;
            if (firstKey) {
                this.logs.delete(firstKey);
            }
        }
        if (this.verbose) {
            const info = [
                `Provider: ${chalk.cyan(options.provider)}`,
                `Model: ${chalk.cyan(options.model)}`,
                `Endpoint: ${chalk.gray(options.endpoint)}`,
            ].join('\n');
            console.log();
            console.log(infoBox(info, `🔍 API Call ${id.substring(0, 12)}...`));
            console.log();
        }
        return id;
    }
    /**
     * Record first byte received (for streaming)
     */
    recordFirstByte(id) {
        if (!this.enabled || !id)
            return;
        const log = this.logs.get(id);
        if (!log)
            return;
        log.timing.ttfb = performance.now() - log.timing.startTime;
        if (this.verbose) {
            console.log(chalk.cyan(`   ⚡ TTFB: ${log.timing.ttfb.toFixed(2)}ms`));
        }
    }
    /**
     * Record streaming chunk
     */
    recordChunk(id, content, tokens) {
        if (!this.enabled || !id)
            return;
        const log = this.logs.get(id);
        if (!log)
            return;
        if (!log.response) {
            log.response = {
                status: 200,
                statusText: 'OK',
                headers: {},
                streaming: true,
                chunks: []
            };
        }
        log.response.chunks = log.response.chunks || [];
        log.response.chunks.push({
            timestamp: new Date(),
            content,
            tokens
        });
        if (this.verbose) {
            const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
            console.log(chalk.gray(`   📦 Chunk ${log.response.chunks.length}: ${preview}`));
        }
    }
    /**
     * Complete an API call
     */
    completeCall(id, response) {
        if (!this.enabled || !id)
            return;
        const log = this.logs.get(id);
        if (!log)
            return;
        log.timing.endTime = performance.now();
        log.timing.duration = log.timing.endTime - log.timing.startTime;
        if (!log.response) {
            log.response = {
                status: response.status,
                statusText: response.statusText,
                headers: this.sanitizeHeaders(response.headers),
                body: this.sanitizeBody(response.body)
            };
        }
        else {
            // Update response info for streaming calls
            log.response.status = response.status;
            log.response.statusText = response.statusText;
            log.response.headers = this.sanitizeHeaders(response.headers);
        }
        // Extract usage information
        if (response.body?.usage) {
            log.usage = {
                promptTokens: response.body.usage.prompt_tokens || 0,
                completionTokens: response.body.usage.completion_tokens || 0,
                totalTokens: response.body.usage.total_tokens || 0
            };
        }
        if (this.verbose) {
            const summary = {
                'Duration': chalk.cyan(`${log.timing.duration?.toFixed(2)}ms`),
            };
            if (log.usage) {
                summary['Total Tokens'] = chalk.cyan(log.usage.totalTokens.toString());
                summary['Prompt Tokens'] = chalk.gray(log.usage.promptTokens.toString());
                summary['Completion Tokens'] = chalk.gray(log.usage.completionTokens.toString());
            }
            if (log.response.chunks) {
                summary['Chunks'] = chalk.cyan(log.response.chunks.length.toString());
            }
            console.log();
            console.log(successBox(keyValueTable(summary), `✅ Call ${id.substring(0, 12)}... Complete`));
            console.log();
        }
    }
    /**
     * Record an error
     */
    recordError(id, error) {
        if (!this.enabled || !id)
            return;
        const log = this.logs.get(id);
        if (!log)
            return;
        log.timing.endTime = performance.now();
        log.timing.duration = log.timing.endTime - log.timing.startTime;
        log.error = {
            message: error.message,
            code: error.code,
            stack: error.stack
        };
        if (this.verbose) {
            const errorInfo = {
                'Duration': chalk.gray(`${log.timing.duration?.toFixed(2)}ms`),
                'Error': chalk.red(error.message),
            };
            if (log.error?.code) {
                errorInfo['Code'] = chalk.yellow(log.error.code);
            }
            console.log();
            console.log(errorBox(keyValueTable(errorInfo), `❌ Call ${id.substring(0, 12)}... Failed`));
            console.log();
        }
    }
    /**
     * Get all logs
     */
    getLogs() {
        return Array.from(this.logs.values());
    }
    /**
     * Get specific log
     */
    getLog(id) {
        return this.logs.get(id);
    }
    /**
     * Get logs by provider
     */
    getLogsByProvider(provider) {
        return Array.from(this.logs.values()).filter(log => log.provider === provider);
    }
    /**
     * Get logs with errors
     */
    getErrorLogs() {
        return Array.from(this.logs.values()).filter(log => log.error);
    }
    /**
     * Get average response time
     */
    getAverageResponseTime(provider) {
        const logs = provider
            ? this.getLogsByProvider(provider)
            : Array.from(this.logs.values());
        const completedLogs = logs.filter(log => log.timing.duration);
        if (completedLogs.length === 0)
            return 0;
        const totalDuration = completedLogs.reduce((sum, log) => sum + (log.timing.duration || 0), 0);
        return totalDuration / completedLogs.length;
    }
    /**
     * Get total token usage
     */
    getTotalUsage(provider) {
        const logs = provider
            ? this.getLogsByProvider(provider)
            : Array.from(this.logs.values());
        return logs.reduce((total, log) => {
            if (!log.usage)
                return total;
            return {
                promptTokens: total.promptTokens + log.usage.promptTokens,
                completionTokens: total.completionTokens + log.usage.completionTokens,
                totalTokens: total.totalTokens + log.usage.totalTokens
            };
        }, { promptTokens: 0, completionTokens: 0, totalTokens: 0 });
    }
    /**
     * Clear all logs
     */
    clear() {
        this.logs.clear();
    }
    /**
     * Export logs to JSON
     */
    exportLogs() {
        return JSON.stringify(Array.from(this.logs.values()), null, 2);
    }
    /**
     * Enable/disable inspector
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Enable/disable verbose logging
     */
    setVerbose(verbose) {
        this.verbose = verbose;
    }
    /**
     * Sanitize headers (remove sensitive data)
     */
    sanitizeHeaders(headers) {
        const sanitized = { ...headers };
        // Remove or mask sensitive headers
        if (sanitized['authorization']) {
            sanitized['authorization'] = sanitized['authorization'].replace(/Bearer .+/, 'Bearer [REDACTED]');
        }
        if (sanitized['api-key']) {
            sanitized['api-key'] = '[REDACTED]';
        }
        if (sanitized['x-api-key']) {
            sanitized['x-api-key'] = '[REDACTED]';
        }
        return sanitized;
    }
    /**
     * Sanitize body (truncate long content)
     */
    sanitizeBody(body) {
        if (!body)
            return body;
        const sanitized = JSON.parse(JSON.stringify(body));
        // Truncate long message content
        if (sanitized.messages) {
            sanitized.messages = sanitized.messages.map((msg) => {
                if (msg.content && typeof msg.content === 'string' && msg.content.length > 500) {
                    return {
                        ...msg,
                        content: msg.content.substring(0, 500) + '... [truncated]'
                    };
                }
                return msg;
            });
        }
        return sanitized;
    }
}
// Global singleton instance
let globalInspector = null;
/**
 * Get the global API inspector instance
 */
export function getAPIInspector() {
    if (!globalInspector) {
        globalInspector = new APIInspector();
    }
    return globalInspector;
}
/**
 * Create a new API inspector instance
 */
export function createAPIInspector(options) {
    return new APIInspector(options);
}
export { APIInspector };
//# sourceMappingURL=api-inspector.js.map