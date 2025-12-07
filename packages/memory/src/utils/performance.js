/**
 * Performance Monitoring Utilities
 */
export class PerformanceMonitor {
    metrics = [];
    maxMetrics = 1000;
    /**
     * Measure execution time of an async function
     */
    async measure(operation, fn, metadata) {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = performance.now() - start;
            this.record({
                operation,
                duration,
                timestamp: Date.now(),
                metadata,
            });
            return result;
        }
        catch (error) {
            const duration = performance.now() - start;
            this.record({
                operation,
                duration,
                timestamp: Date.now(),
                metadata: {
                    ...metadata,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
            throw error;
        }
    }
    /**
     * Record a metric
     */
    record(metric) {
        this.metrics.push(metric);
        // Keep only recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }
    }
    /**
     * Get metrics for an operation
     */
    getMetrics(operation) {
        if (operation) {
            return this.metrics.filter(m => m.operation === operation);
        }
        return [...this.metrics];
    }
    /**
     * Get statistics for an operation
     */
    getStats(operation) {
        const operationMetrics = this.getMetrics(operation);
        if (operationMetrics.length === 0) {
            return null;
        }
        const durations = operationMetrics.map(m => m.duration).sort((a, b) => a - b);
        const sum = durations.reduce((a, b) => a + b, 0);
        const avg = sum / durations.length;
        const min = durations[0];
        const max = durations[durations.length - 1];
        const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
        const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
        const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
        return {
            count: durations.length,
            avgDuration: avg,
            minDuration: min,
            maxDuration: max,
            p50,
            p95,
            p99,
        };
    }
    /**
     * Clear all metrics
     */
    clear() {
        this.metrics = [];
    }
}
// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
//# sourceMappingURL=performance.js.map