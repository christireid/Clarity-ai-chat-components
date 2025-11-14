/**
 * Performance profiler for AI chat applications
 *
 * Tracks:
 * - API call latency
 * - Token throughput
 * - Memory usage
 * - Streaming performance
 */
export interface PerformanceMetrics {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    memoryBefore?: NodeJS.MemoryUsage;
    memoryAfter?: NodeJS.MemoryUsage;
    memoryDelta?: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
    custom?: Record<string, any>;
}
export interface StreamingMetrics {
    ttfb: number;
    chunks: number;
    totalBytes: number;
    duration: number;
    throughput: number;
    chunkTimes: number[];
    avgChunkTime: number;
    maxChunkTime: number;
    minChunkTime: number;
}
declare class Profiler {
    private metrics;
    private enabled;
    constructor(enabled?: boolean);
    /**
     * Start profiling an operation
     */
    start(name: string, options?: {
        trackMemory?: boolean;
    }): void;
    /**
     * End profiling an operation
     */
    end(name: string, custom?: Record<string, any>): PerformanceMetrics | undefined;
    /**
     * Profile an async function
     */
    profile<T>(name: string, fn: () => Promise<T>, options?: {
        trackMemory?: boolean;
    }): Promise<{
        result: T;
        metrics: PerformanceMetrics;
    }>;
    /**
     * Profile streaming performance
     */
    profileStream<T>(stream: AsyncIterable<T>, options?: {
        extractSize?: (chunk: T) => number;
    }): Promise<{
        chunks: T[];
        metrics: StreamingMetrics;
    }>;
    /**
     * Get metrics for an operation
     */
    getMetrics(name: string): PerformanceMetrics | undefined;
    /**
     * Get all metrics
     */
    getAllMetrics(): PerformanceMetrics[];
    /**
     * Get metrics summary
     */
    getSummary(): {
        totalOperations: number;
        totalDuration: number;
        avgDuration: number;
        slowestOperation?: PerformanceMetrics;
        fastestOperation?: PerformanceMetrics;
    };
    /**
     * Print metrics report
     */
    printReport(): void;
    /**
     * Print streaming metrics
     */
    printStreamingMetrics(metrics: StreamingMetrics): void;
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Export metrics as JSON
     */
    export(): string;
    /**
     * Enable/disable profiler
     */
    setEnabled(enabled: boolean): void;
}
/**
 * Get the global profiler instance
 */
export declare function getProfiler(): Profiler;
/**
 * Create a new profiler instance
 */
export declare function createProfiler(enabled?: boolean): Profiler;
/**
 * Measure token throughput
 */
export declare function calculateTokenThroughput(tokens: number, durationMs: number): {
    tokensPerSecond: number;
    tokensPerMinute: number;
};
/**
 * Format bytes to human readable
 */
export declare function formatBytes(bytes: number): string;
/**
 * Format duration to human readable
 */
export declare function formatDuration(ms: number): string;
export { Profiler };
//# sourceMappingURL=profiler.d.ts.map