/**
 * Health & Diagnostics System for MCP Server
 *
 * Provides comprehensive health checks, metrics, and diagnostic tools
 * for monitoring and troubleshooting the MCP server.
 *
 * @module utils/health
 */
export declare enum HealthStatus {
    HEALTHY = "healthy",
    DEGRADED = "degraded",
    UNHEALTHY = "unhealthy"
}
export interface HealthCheckResult {
    name: string;
    status: HealthStatus;
    message?: string;
    duration?: number;
    metadata?: Record<string, unknown>;
}
export interface ServerHealth {
    status: HealthStatus;
    timestamp: string;
    uptime: number;
    version: string;
    checks: HealthCheckResult[];
    metrics: ServerMetrics;
}
export interface ServerMetrics {
    requests: {
        total: number;
        success: number;
        error: number;
        avgDuration: number;
    };
    tools: {
        total: number;
        calls: Record<string, number>;
        errors: Record<string, number>;
    };
    resources: {
        total: number;
        reads: Record<string, number>;
    };
    prompts: {
        total: number;
        gets: Record<string, number>;
    };
    cache: {
        project: CacheStats;
        model: CacheStats;
        example: CacheStats;
    };
    memory: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
    plugins: {
        total: number;
        enabled: number;
    };
}
interface CacheStats {
    size: number;
    maxSize: number;
    hits: number;
    misses: number;
    hitRate: number;
}
declare class MetricsCollector {
    private startTime;
    private requestCount;
    private successCount;
    private errorCount;
    private totalDuration;
    private toolCalls;
    private toolErrors;
    private resourceReads;
    private promptGets;
    /**
     * Enforce map size limits by removing least-used entries
     */
    private enforceMapLimit;
    /**
     * Record a request
     */
    recordRequest(duration: number, success: boolean): void;
    /**
     * Record a tool call
     */
    recordToolCall(name: string, success: boolean): void;
    /**
     * Record a resource read
     */
    recordResourceRead(uri: string): void;
    /**
     * Record a prompt get
     */
    recordPromptGet(name: string): void;
    /**
     * Get server uptime in milliseconds
     */
    getUptime(): number;
    /**
     * Get current metrics
     */
    getMetrics(toolCount: number, resourceCount: number, promptCount: number, pluginStats: {
        total: number;
        enabled: number;
    }): ServerMetrics;
    /**
     * Reset metrics
     */
    reset(): void;
}
type HealthCheckFn = () => Promise<HealthCheckResult> | HealthCheckResult;
declare class HealthChecker {
    private checks;
    /**
     * Register a health check
     */
    register(name: string, check: HealthCheckFn): void;
    /**
     * Unregister a health check
     */
    unregister(name: string): void;
    /**
     * Run all health checks
     */
    runAll(): Promise<HealthCheckResult[]>;
    /**
     * Calculate overall status from check results
     */
    calculateOverallStatus(results: HealthCheckResult[]): HealthStatus;
}
export declare const metrics: MetricsCollector;
export declare const healthChecker: HealthChecker;
/**
 * Get comprehensive server health information
 */
export declare function getServerHealth(version: string, toolCount: number, resourceCount: number, promptCount: number, pluginStats: {
    total: number;
    enabled: number;
}): Promise<ServerHealth>;
/**
 * Get diagnostic information for troubleshooting
 */
export declare function getDiagnostics(): {
    environment: Record<string, string | undefined>;
    process: Record<string, unknown>;
    runtime: Record<string, unknown>;
};
/**
 * Format bytes to human readable string
 */
export declare function formatBytes(bytes: number): string;
/**
 * Format duration to human readable string
 */
export declare function formatDuration(ms: number): string;
export {};
//# sourceMappingURL=health.d.ts.map