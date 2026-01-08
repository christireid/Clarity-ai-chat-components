/**
 * Performance Monitor
 *
 * Unified performance monitoring and metrics collection
 *
 * @module @clarity-chat/utils/performance
 *
 * @example
 * ```ts
 * import { PerformanceMonitor } from '@clarity-chat/utils/performance'
 *
 * // Track function execution
 * const result = PerformanceMonitor.track('api-call', () => {
 *   return expensiveOperation()
 * })
 *
 * // Manual timing
 * PerformanceMonitor.time('database-query')
 * await queryDatabase()
 * PerformanceMonitor.timeEnd('database-query')
 *
 * // Get metrics
 * const metrics = PerformanceMonitor.getMetrics()
 * console.log(`Average time: ${metrics.averageTime}ms`)
 * ```
 */
import { formatDuration, formatBytes } from './format/index.js';
import { getLogger } from './logger/index.js';
/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
    static operations = new Map();
    static activeTimers = new Map();
    static logger = getLogger('performance');
    static options = {
        logLevel: 'info',
        enableWarnings: true,
        warningThreshold: 1000, // 1 second
        maxOperations: 1000,
    };
    /**
     * Configure performance monitoring
     */
    static configure(options) {
        this.options = { ...this.options, ...options };
    }
    /**
     * Track execution time of a function
     */
    static track(name, fn) {
        const startTime = performance.now();
        try {
            const result = fn();
            // Handle both sync and async results
            if (result && typeof result === 'object' && 'then' in result) {
                return (async () => {
                    try {
                        const asyncResult = await result;
                        const endTime = performance.now();
                        this.recordTiming(name, startTime, endTime);
                        return asyncResult;
                    }
                    catch (error) {
                        const endTime = performance.now();
                        this.recordTiming(name, startTime, endTime);
                        throw error;
                    }
                })();
            }
            else {
                const endTime = performance.now();
                this.recordTiming(name, startTime, endTime);
                return result;
            }
        }
        catch (error) {
            const endTime = performance.now();
            this.recordTiming(name, startTime, endTime);
            throw error;
        }
    }
    /**
     * Track async function execution time
     */
    static async trackAsync(name, fn) {
        const startTime = performance.now();
        try {
            const result = await fn();
            const endTime = performance.now();
            this.recordTiming(name, startTime, endTime);
            return result;
        }
        catch (error) {
            const endTime = performance.now();
            this.recordTiming(name, startTime, endTime);
            throw error;
        }
    }
    /**
     * Start timing an operation
     */
    static time(name) {
        if (this.activeTimers.has(name)) {
            this.logger.warn(`Timer '${name}' already started`);
            return;
        }
        this.activeTimers.set(name, performance.now());
    }
    /**
     * End timing an operation and record the duration
     */
    static timeEnd(name) {
        const startTime = this.activeTimers.get(name);
        if (!startTime) {
            this.logger.warn(`Timer '${name}' was not started`);
            return undefined;
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.activeTimers.delete(name);
        this.recordTiming(name, startTime, endTime);
        return duration;
    }
    /**
     * Record timing information
     */
    static recordTiming(name, startTime, endTime) {
        const duration = endTime - startTime;
        // Check if we should warn about slow operations
        if (this.options.enableWarnings &&
            duration > this.options.warningThreshold) {
            this.logger.warn(`Slow operation detected: ${name} took ${formatDuration(duration)}`);
        }
        const existing = this.operations.get(name);
        if (existing) {
            existing.count++;
            existing.totalTime += duration;
            existing.averageTime = existing.totalTime / existing.count;
            existing.minTime = Math.min(existing.minTime, duration);
            existing.maxTime = Math.max(existing.maxTime, duration);
        }
        else {
            // Limit the number of tracked operations
            if (this.operations.size >= this.options.maxOperations) {
                // Remove the oldest operation
                const firstKey = this.operations.keys().next().value;
                if (firstKey) {
                    this.operations.delete(firstKey);
                }
            }
            this.operations.set(name, {
                name,
                startTime,
                endTime,
                duration,
                count: 1,
                totalTime: duration,
                averageTime: duration,
                minTime: duration,
                maxTime: duration,
            });
        }
        // Log based on configured level
        if (this.shouldLog()) {
            this.logger.info(`Operation '${name}' completed in ${formatDuration(duration)}`);
        }
    }
    /**
     * Check if we should log performance information
     */
    static shouldLog() {
        const levels = { trace: 0, debug: 1, info: 2, warn: 3, error: 4 };
        const currentLevel = levels[this.options.logLevel];
        const infoLevel = levels['info'];
        return currentLevel <= infoLevel;
    }
    /**
     * Get current performance metrics
     */
    static getMetrics() {
        let totalTime = 0;
        let operationCount = 0;
        for (const operation of this.operations.values()) {
            totalTime += operation.totalTime;
            operationCount += operation.count;
        }
        const averageTime = operationCount > 0 ? totalTime / operationCount : 0;
        return {
            operations: new Map(this.operations),
            totalTime,
            averageTime,
            operationCount,
        };
    }
    /**
     * Get metrics for a specific operation
     */
    static getOperationMetrics(name) {
        return this.operations.get(name);
    }
    /**
     * Get all operation names
     */
    static getOperationNames() {
        return Array.from(this.operations.keys());
    }
    /**
     * Clear all metrics
     */
    static clear() {
        this.operations.clear();
        this.activeTimers.clear();
    }
    /**
     * Clear metrics for a specific operation
     */
    static clearOperation(name) {
        this.operations.delete(name);
        this.activeTimers.delete(name);
    }
    /**
     * Get a summary of performance metrics
     */
    static getSummary() {
        const metrics = this.getMetrics();
        const operations = Array.from(metrics.operations.values());
        operations.sort((a, b) => b.averageTime - a.averageTime);
        const slowestOperations = operations.slice(0, 10);
        operations.sort((a, b) => a.averageTime - b.averageTime);
        const fastestOperations = operations.slice(0, 10);
        operations.sort((a, b) => b.count - a.count);
        const mostFrequentOperations = operations.slice(0, 10);
        return {
            totalOperations: operations.length,
            totalTime: metrics.totalTime,
            averageTime: metrics.averageTime,
            slowestOperations,
            fastestOperations,
            mostFrequentOperations,
        };
    }
    /**
     * Format metrics for display
     */
    static formatMetrics(metrics) {
        const data = metrics || this.getMetrics();
        const operations = Array.from(data.operations.values());
        if (operations.length === 0) {
            return 'No performance data available';
        }
        const lines = [
            'Performance Metrics:',
            `Total operations: ${data.operationCount}`,
            `Total time: ${formatDuration(data.totalTime)}`,
            `Average time: ${formatDuration(data.averageTime)}`,
            '',
            'Top 5 operations by average time:',
        ];
        operations
            .sort((a, b) => b.averageTime - a.averageTime)
            .slice(0, 5)
            .forEach((op, index) => {
            lines.push(`${index + 1}. ${op.name}: ${formatDuration(op.averageTime)} (avg), ${op.count} calls`);
        });
        return lines.join('\n');
    }
    /**
     * Measure memory usage
     */
    static measureMemory() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage();
        }
        // Fallback for browser environments
        return {
            rss: 0,
            heapTotal: 0,
            heapUsed: 0,
            external: 0,
            arrayBuffers: 0,
        };
    }
    /**
     * Format memory usage
     */
    static formatMemoryUsage(usage) {
        const data = usage || this.measureMemory();
        return [
            `RSS: ${formatBytes(data.rss)}`,
            `Heap Total: ${formatBytes(data.heapTotal)}`,
            `Heap Used: ${formatBytes(data.heapUsed)}`,
            `External: ${formatBytes(data.external)}`,
            `Array Buffers: ${formatBytes(data.arrayBuffers)}`,
        ].join(', ');
    }
}
// Convenience functions for backward compatibility
export function measurePerformance(name, fn) {
    return PerformanceMonitor.track(name, fn);
}
export function measureAsyncPerformance(name, fn) {
    return PerformanceMonitor.trackAsync(name, fn);
}
export function startPerformanceTimer(name) {
    PerformanceMonitor.time(name);
}
export function endPerformanceTimer(name) {
    return PerformanceMonitor.timeEnd(name);
}
export function getPerformanceMetrics() {
    return PerformanceMonitor.getMetrics();
}
export function formatPerformanceMetrics(metrics) {
    return PerformanceMonitor.formatMetrics(metrics);
}
export function getPerformanceSummary() {
    return PerformanceMonitor.getSummary();
}
//# sourceMappingURL=performance.js.map