/**
 * Performance profiler for AI chat applications
 *
 * Tracks:
 * - API call latency
 * - Token throughput
 * - Memory usage
 * - Streaming performance
 */
import { table, keyValueTable } from '../ui/table';
import { infoBox } from '../ui/box';
import chalk from 'chalk';
class Profiler {
    metrics = new Map();
    enabled = false;
    constructor(enabled = true) {
        this.enabled = enabled;
    }
    /**
     * Start profiling an operation
     */
    start(name, options = {}) {
        if (!this.enabled)
            return;
        const metrics = {
            name,
            startTime: performance.now()
        };
        if (options.trackMemory) {
            metrics.memoryBefore = process.memoryUsage();
        }
        this.metrics.set(name, metrics);
    }
    /**
     * End profiling an operation
     */
    end(name, custom) {
        if (!this.enabled)
            return;
        const metrics = this.metrics.get(name);
        if (!metrics) {
            console.warn(`No metrics found for operation: ${name}`);
            return;
        }
        metrics.endTime = performance.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        if (metrics.memoryBefore) {
            metrics.memoryAfter = process.memoryUsage();
            metrics.memoryDelta = {
                heapUsed: metrics.memoryAfter.heapUsed - metrics.memoryBefore.heapUsed,
                heapTotal: metrics.memoryAfter.heapTotal - metrics.memoryBefore.heapTotal,
                external: metrics.memoryAfter.external - metrics.memoryBefore.external,
                rss: metrics.memoryAfter.rss - metrics.memoryBefore.rss
            };
        }
        if (custom) {
            metrics.custom = custom;
        }
        return metrics;
    }
    /**
     * Profile an async function
     */
    async profile(name, fn, options = {}) {
        this.start(name, options);
        try {
            const result = await fn();
            const metrics = this.end(name);
            return { result, metrics };
        }
        catch (error) {
            this.end(name);
            throw error;
        }
    }
    /**
     * Profile streaming performance
     */
    async profileStream(stream, options = {}) {
        const chunks = [];
        const chunkTimes = [];
        let startTime = performance.now();
        let lastChunkTime = startTime;
        let ttfb = 0;
        let totalBytes = 0;
        let isFirstChunk = true;
        for await (const chunk of stream) {
            const now = performance.now();
            if (isFirstChunk) {
                ttfb = now - startTime;
                isFirstChunk = false;
            }
            else {
                chunkTimes.push(now - lastChunkTime);
            }
            lastChunkTime = now;
            chunks.push(chunk);
            if (options.extractSize) {
                totalBytes += options.extractSize(chunk);
            }
        }
        const duration = performance.now() - startTime;
        const throughput = totalBytes > 0 ? (totalBytes / duration) * 1000 : 0;
        const metrics = {
            ttfb,
            chunks: chunks.length,
            totalBytes,
            duration,
            throughput,
            chunkTimes,
            avgChunkTime: chunkTimes.length > 0
                ? chunkTimes.reduce((a, b) => a + b, 0) / chunkTimes.length
                : 0,
            maxChunkTime: chunkTimes.length > 0 ? Math.max(...chunkTimes) : 0,
            minChunkTime: chunkTimes.length > 0 ? Math.min(...chunkTimes) : 0
        };
        return { chunks, metrics };
    }
    /**
     * Get metrics for an operation
     */
    getMetrics(name) {
        return this.metrics.get(name);
    }
    /**
     * Get all metrics
     */
    getAllMetrics() {
        return Array.from(this.metrics.values());
    }
    /**
     * Get metrics summary
     */
    getSummary() {
        const allMetrics = this.getAllMetrics();
        const completedMetrics = allMetrics.filter(m => m.duration !== undefined);
        if (completedMetrics.length === 0) {
            return {
                totalOperations: 0,
                totalDuration: 0,
                avgDuration: 0
            };
        }
        const totalDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
        const avgDuration = totalDuration / completedMetrics.length;
        const slowestOperation = completedMetrics.reduce((slowest, current) => (current.duration || 0) > (slowest.duration || 0) ? current : slowest);
        const fastestOperation = completedMetrics.reduce((fastest, current) => (current.duration || 0) < (fastest.duration || 0) ? current : fastest);
        return {
            totalOperations: completedMetrics.length,
            totalDuration,
            avgDuration,
            slowestOperation,
            fastestOperation
        };
    }
    /**
     * Print metrics report with beautiful formatting
     */
    printReport() {
        const summary = this.getSummary();
        // Summary box
        const summaryContent = [
            `Total Operations: ${chalk.cyan(summary.totalOperations)}`,
            `Total Duration: ${chalk.cyan(summary.totalDuration.toFixed(2) + 'ms')}`,
            `Average Duration: ${chalk.cyan(summary.avgDuration.toFixed(2) + 'ms')}`,
        ].join('\n');
        console.log();
        console.log(infoBox(summaryContent, '📊 Performance Summary'));
        console.log();
        // Operations table
        const operations = this.getAllMetrics()
            .filter(m => m.duration !== undefined)
            .sort((a, b) => (b.duration || 0) - (a.duration || 0));
        if (operations.length > 0) {
            const columns = [
                { header: 'Operation', width: 30, color: chalk.yellow },
                { header: 'Duration', width: 15, align: 'right', color: chalk.cyan },
                { header: 'Memory', width: 15, align: 'right' },
                { header: 'Details', width: 30 },
            ];
            const tableData = operations.map(m => {
                const memory = m.memoryDelta
                    ? `${(m.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB`
                    : '—';
                const details = m.custom
                    ? Object.entries(m.custom).map(([k, v]) => `${k}: ${v}`).join(', ')
                    : '—';
                return [
                    m.name,
                    `${m.duration?.toFixed(2)}ms`,
                    memory,
                    details,
                ];
            });
            console.log(table(tableData, columns));
            console.log();
            // Highlight slowest/fastest
            if (summary.slowestOperation && summary.fastestOperation) {
                const highlight = [
                    chalk.yellow('⚡ Fastest: ') + chalk.green(summary.fastestOperation.name) +
                        chalk.gray(` (${summary.fastestOperation.duration?.toFixed(2)}ms)`),
                    chalk.yellow('🐌 Slowest: ') + chalk.red(summary.slowestOperation.name) +
                        chalk.gray(` (${summary.slowestOperation.duration?.toFixed(2)}ms)`),
                ].join('\n');
                console.log(infoBox(highlight, '⚡ Highlights'));
                console.log();
            }
        }
    }
    /**
     * Print streaming metrics with beautiful formatting
     */
    printStreamingMetrics(metrics) {
        const metricsData = {
            'Time to First Byte': chalk.cyan(metrics.ttfb.toFixed(2) + 'ms'),
            'Total Chunks': chalk.cyan(metrics.chunks.toString()),
            'Total Bytes': chalk.cyan(formatBytes(metrics.totalBytes)),
            'Duration': chalk.cyan(metrics.duration.toFixed(2) + 'ms'),
            'Throughput': chalk.cyan((metrics.throughput / 1024).toFixed(2) + ' KB/s'),
        };
        const timingData = {
            'Average': chalk.cyan(metrics.avgChunkTime.toFixed(2) + 'ms'),
            'Min': chalk.green(metrics.minChunkTime.toFixed(2) + 'ms'),
            'Max': chalk.yellow(metrics.maxChunkTime.toFixed(2) + 'ms'),
        };
        console.log();
        console.log(infoBox(keyValueTable(metricsData), '📡 Streaming Performance'));
        console.log();
        console.log(infoBox(keyValueTable(timingData), '⏱️  Chunk Timing'));
        console.log();
    }
    /**
     * Clear all metrics
     */
    clear() {
        this.metrics.clear();
    }
    /**
     * Export metrics as JSON
     */
    export() {
        return JSON.stringify({
            metrics: Array.from(this.metrics.values()),
            summary: this.getSummary()
        }, null, 2);
    }
    /**
     * Enable/disable profiler
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
// Global profiler instance
let globalProfiler = null;
/**
 * Get the global profiler instance
 */
export function getProfiler() {
    if (!globalProfiler) {
        globalProfiler = new Profiler(process.env.NODE_ENV === 'development');
    }
    return globalProfiler;
}
/**
 * Create a new profiler instance
 */
export function createProfiler(enabled) {
    return new Profiler(enabled);
}
/**
 * Measure token throughput
 */
export function calculateTokenThroughput(tokens, durationMs) {
    const tokensPerSecond = (tokens / durationMs) * 1000;
    const tokensPerMinute = tokensPerSecond * 60;
    return {
        tokensPerSecond,
        tokensPerMinute
    };
}
/**
 * Format bytes to human readable
 */
export function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
/**
 * Format duration to human readable
 */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${ms.toFixed(2)}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
}
export { Profiler };
//# sourceMappingURL=profiler.js.map