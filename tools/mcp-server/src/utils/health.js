/**
 * Health & Diagnostics System for MCP Server
 *
 * Provides comprehensive health checks, metrics, and diagnostic tools
 * for monitoring and troubleshooting the MCP server.
 *
 * @module utils/health
 */
import { logger as _logger } from './logger.js';
import { Cache as _Cache, projectCache, modelCache, exampleCache, } from './cache.js';
// =============================================================================
// Health Check Types
// =============================================================================
export var HealthStatus;
(function (HealthStatus) {
    HealthStatus["HEALTHY"] = "healthy";
    HealthStatus["DEGRADED"] = "degraded";
    HealthStatus["UNHEALTHY"] = "unhealthy";
})(HealthStatus || (HealthStatus = {}));
// =============================================================================
// Metrics Configuration
// =============================================================================
const METRICS_LIMITS = {
    /** Maximum unique tools to track */
    maxToolEntries: 500,
    /** Maximum unique resources to track */
    maxResourceEntries: 500,
    /** Maximum unique prompts to track */
    maxPromptEntries: 200,
};
// =============================================================================
// Metrics Collector
// =============================================================================
class MetricsCollector {
    startTime = Date.now();
    requestCount = 0;
    successCount = 0;
    errorCount = 0;
    totalDuration = 0;
    toolCalls = new Map();
    toolErrors = new Map();
    resourceReads = new Map();
    promptGets = new Map();
    /**
     * Enforce map size limits by removing least-used entries
     */
    enforceMapLimit(map, limit) {
        if (map.size <= limit)
            return;
        // Sort by count (ascending) and remove lowest entries
        const entries = Array.from(map.entries()).sort(([, a], [, b]) => a - b);
        const toRemove = map.size - limit;
        for (let i = 0; i < toRemove; i++) {
            map.delete(entries[i][0]);
        }
    }
    /**
     * Record a request
     */
    recordRequest(duration, success) {
        this.requestCount++;
        this.totalDuration += duration;
        if (success) {
            this.successCount++;
        }
        else {
            this.errorCount++;
        }
    }
    /**
     * Record a tool call
     */
    recordToolCall(name, success) {
        // Enforce limit before adding new entry
        if (!this.toolCalls.has(name)) {
            this.enforceMapLimit(this.toolCalls, METRICS_LIMITS.maxToolEntries - 1);
        }
        this.toolCalls.set(name, (this.toolCalls.get(name) || 0) + 1);
        if (!success) {
            if (!this.toolErrors.has(name)) {
                this.enforceMapLimit(this.toolErrors, METRICS_LIMITS.maxToolEntries - 1);
            }
            this.toolErrors.set(name, (this.toolErrors.get(name) || 0) + 1);
        }
    }
    /**
     * Record a resource read
     */
    recordResourceRead(uri) {
        if (!this.resourceReads.has(uri)) {
            this.enforceMapLimit(this.resourceReads, METRICS_LIMITS.maxResourceEntries - 1);
        }
        this.resourceReads.set(uri, (this.resourceReads.get(uri) || 0) + 1);
    }
    /**
     * Record a prompt get
     */
    recordPromptGet(name) {
        if (!this.promptGets.has(name)) {
            this.enforceMapLimit(this.promptGets, METRICS_LIMITS.maxPromptEntries - 1);
        }
        this.promptGets.set(name, (this.promptGets.get(name) || 0) + 1);
    }
    /**
     * Get server uptime in milliseconds
     */
    getUptime() {
        return Date.now() - this.startTime;
    }
    /**
     * Get current metrics
     */
    getMetrics(toolCount, resourceCount, promptCount, pluginStats) {
        const memUsage = process.memoryUsage();
        return {
            requests: {
                total: this.requestCount,
                success: this.successCount,
                error: this.errorCount,
                avgDuration: this.requestCount > 0 ? this.totalDuration / this.requestCount : 0,
            },
            tools: {
                total: toolCount,
                calls: Object.fromEntries(this.toolCalls),
                errors: Object.fromEntries(this.toolErrors),
            },
            resources: {
                total: resourceCount,
                reads: Object.fromEntries(this.resourceReads),
            },
            prompts: {
                total: promptCount,
                gets: Object.fromEntries(this.promptGets),
            },
            cache: {
                project: projectCache.getStats(),
                model: modelCache.getStats(),
                example: exampleCache.getStats(),
            },
            memory: {
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external,
                rss: memUsage.rss,
            },
            plugins: pluginStats,
        };
    }
    /**
     * Reset metrics
     */
    reset() {
        this.requestCount = 0;
        this.successCount = 0;
        this.errorCount = 0;
        this.totalDuration = 0;
        this.toolCalls.clear();
        this.toolErrors.clear();
        this.resourceReads.clear();
        this.promptGets.clear();
    }
}
class HealthChecker {
    checks = new Map();
    /**
     * Register a health check
     */
    register(name, check) {
        this.checks.set(name, check);
    }
    /**
     * Unregister a health check
     */
    unregister(name) {
        this.checks.delete(name);
    }
    /**
     * Run all health checks
     */
    async runAll() {
        const results = [];
        for (const [name, check] of this.checks) {
            const startTime = Date.now();
            try {
                const result = await check();
                result.duration = Date.now() - startTime;
                results.push(result);
            }
            catch (error) {
                results.push({
                    name,
                    status: HealthStatus.UNHEALTHY,
                    message: error instanceof Error ? error.message : 'Unknown error',
                    duration: Date.now() - startTime,
                });
            }
        }
        return results;
    }
    /**
     * Calculate overall status from check results
     */
    calculateOverallStatus(results) {
        if (results.some((r) => r.status === HealthStatus.UNHEALTHY)) {
            return HealthStatus.UNHEALTHY;
        }
        if (results.some((r) => r.status === HealthStatus.DEGRADED)) {
            return HealthStatus.DEGRADED;
        }
        return HealthStatus.HEALTHY;
    }
}
// =============================================================================
// Singleton Instances
// =============================================================================
export const metrics = new MetricsCollector();
export const healthChecker = new HealthChecker();
// =============================================================================
// Built-in Health Checks
// =============================================================================
// Memory health check
healthChecker.register('memory', () => {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    let status = HealthStatus.HEALTHY;
    let message = 'Memory usage normal';
    if (heapUsedPercent > 90) {
        status = HealthStatus.UNHEALTHY;
        message = `Critical memory usage: ${heapUsedPercent.toFixed(1)}%`;
    }
    else if (heapUsedPercent > 75) {
        status = HealthStatus.DEGRADED;
        message = `High memory usage: ${heapUsedPercent.toFixed(1)}%`;
    }
    return {
        name: 'memory',
        status,
        message,
        metadata: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            heapUsedPercent: heapUsedPercent.toFixed(1),
        },
    };
});
// Cache health check
healthChecker.register('cache', () => {
    const projectStats = projectCache.getStats();
    const modelStats = modelCache.getStats();
    const exampleStats = exampleCache.getStats();
    const totalHitRate = (projectStats.hits + modelStats.hits + exampleStats.hits) /
        Math.max(1, projectStats.hits +
            projectStats.misses +
            modelStats.hits +
            modelStats.misses +
            exampleStats.hits +
            exampleStats.misses);
    let status = HealthStatus.HEALTHY;
    let message = `Cache hit rate: ${(totalHitRate * 100).toFixed(1)}%`;
    if (totalHitRate < 0.3) {
        status = HealthStatus.DEGRADED;
        message = `Low cache hit rate: ${(totalHitRate * 100).toFixed(1)}%`;
    }
    return {
        name: 'cache',
        status,
        message,
        metadata: {
            project: projectStats,
            model: modelStats,
            example: exampleStats,
        },
    };
});
// Event loop health check (checks if event loop is not blocked)
healthChecker.register('eventLoop', async () => {
    const start = Date.now();
    await new Promise((resolve) => setImmediate(resolve));
    const lag = Date.now() - start;
    let status = HealthStatus.HEALTHY;
    let message = `Event loop lag: ${lag}ms`;
    if (lag > 100) {
        status = HealthStatus.UNHEALTHY;
        message = `Critical event loop lag: ${lag}ms`;
    }
    else if (lag > 50) {
        status = HealthStatus.DEGRADED;
        message = `High event loop lag: ${lag}ms`;
    }
    return {
        name: 'eventLoop',
        status,
        message,
        metadata: { lag },
    };
});
// =============================================================================
// Health Service
// =============================================================================
/**
 * Get comprehensive server health information
 */
export async function getServerHealth(version, toolCount, resourceCount, promptCount, pluginStats) {
    const checks = await healthChecker.runAll();
    const status = healthChecker.calculateOverallStatus(checks);
    return {
        status,
        timestamp: new Date().toISOString(),
        uptime: metrics.getUptime(),
        version,
        checks,
        metrics: metrics.getMetrics(toolCount, resourceCount, promptCount, pluginStats),
    };
}
// =============================================================================
// Diagnostic Helpers
// =============================================================================
/**
 * Get diagnostic information for troubleshooting
 */
export function getDiagnostics() {
    return {
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            DEBUG: process.env.DEBUG,
            LOG_LEVEL: process.env.LOG_LEVEL,
        },
        process: {
            pid: process.pid,
            ppid: process.ppid,
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            cwd: process.cwd(),
        },
        runtime: {
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage(),
        },
    };
}
/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = bytes;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    return `${value.toFixed(2)} ${units[unitIndex]}`;
}
/**
 * Format duration to human readable string
 */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
        return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
}
//# sourceMappingURL=health.js.map