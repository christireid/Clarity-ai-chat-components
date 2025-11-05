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
export interface APICallLog {
    id: string;
    timestamp: Date;
    provider: string;
    model: string;
    endpoint: string;
    request: {
        method: string;
        headers: Record<string, string>;
        body: any;
    };
    response?: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        body?: any;
        streaming?: boolean;
        chunks?: Array<{
            timestamp: Date;
            content: string;
            tokens?: number;
        }>;
    };
    timing: {
        startTime: number;
        endTime?: number;
        duration?: number;
        ttfb?: number;
    };
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        cost?: number;
    };
    error?: {
        message: string;
        code?: string;
        stack?: string;
    };
}
declare class APIInspector {
    private logs;
    private enabled;
    private verbose;
    private maxLogs;
    constructor(options?: {
        enabled?: boolean;
        verbose?: boolean;
        maxLogs?: number;
    });
    /**
     * Start tracking an API call
     */
    startCall(options: {
        provider: string;
        model: string;
        endpoint: string;
        method: string;
        headers: Record<string, string>;
        body: any;
    }): string;
    /**
     * Record first byte received (for streaming)
     */
    recordFirstByte(id: string): void;
    /**
     * Record streaming chunk
     */
    recordChunk(id: string, content: string, tokens?: number): void;
    /**
     * Complete an API call
     */
    completeCall(id: string, response: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        body?: any;
    }): void;
    /**
     * Record an error
     */
    recordError(id: string, error: Error): void;
    /**
     * Get all logs
     */
    getLogs(): APICallLog[];
    /**
     * Get specific log
     */
    getLog(id: string): APICallLog | undefined;
    /**
     * Get logs by provider
     */
    getLogsByProvider(provider: string): APICallLog[];
    /**
     * Get logs with errors
     */
    getErrorLogs(): APICallLog[];
    /**
     * Get average response time
     */
    getAverageResponseTime(provider?: string): number;
    /**
     * Get total token usage
     */
    getTotalUsage(provider?: string): {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    /**
     * Clear all logs
     */
    clear(): void;
    /**
     * Export logs to JSON
     */
    exportLogs(): string;
    /**
     * Enable/disable inspector
     */
    setEnabled(enabled: boolean): void;
    /**
     * Enable/disable verbose logging
     */
    setVerbose(verbose: boolean): void;
    /**
     * Sanitize headers (remove sensitive data)
     */
    private sanitizeHeaders;
    /**
     * Sanitize body (truncate long content)
     */
    private sanitizeBody;
}
/**
 * Get the global API inspector instance
 */
export declare function getAPIInspector(): APIInspector;
/**
 * Create a new API inspector instance
 */
export declare function createAPIInspector(options?: {
    enabled?: boolean;
    verbose?: boolean;
    maxLogs?: number;
}): APIInspector;
export { APIInspector };
//# sourceMappingURL=api-inspector.d.ts.map