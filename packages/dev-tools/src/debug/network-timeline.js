/**
 * Network Request Timeline for Clarity Chat Developer Tools
 *
 * Visual timeline for tracking network requests:
 * - Request/response timing visualization
 * - Waterfall chart generation
 * - Request grouping and filtering
 * - Performance metrics (TTFB, total time, etc.)
 * - Request replay capability
 * - HAR export support
 */
import chalk from 'chalk';
import { infoBox, warningBox, errorBox, successBox } from '../ui/box';
import { table, keyValueTable } from '../ui/table';
/**
 * Network Request Timeline
 * Track and visualize network requests
 */
export class NetworkTimeline {
    requests = [];
    maxRequests = 1000;
    enabled = true;
    listeners = new Set();
    interceptors = {};
    constructor(options = {}) {
        this.enabled = options.enabled ?? true;
        this.maxRequests = options.maxRequests ?? 1000;
        if (options.autoIntercept && typeof window !== 'undefined') {
            this.interceptFetch();
        }
    }
    /**
     * Record a network request
     */
    record(request) {
        const fullRequest = {
            id: this.generateId(),
            ...request,
        };
        if (this.enabled) {
            this.requests.push(fullRequest);
            // Maintain max requests
            if (this.requests.length > this.maxRequests) {
                this.requests.shift();
            }
            // Notify listeners
            this.listeners.forEach(listener => listener(fullRequest));
        }
        return fullRequest;
    }
    /**
     * Start tracking a request (returns a function to complete it)
     */
    startRequest(options) {
        const startTime = performance.now();
        let ttfbRecorded = false;
        let ttfb = 0;
        return {
            recordTTFB: () => {
                if (!ttfbRecorded) {
                    ttfb = performance.now() - startTime;
                    ttfbRecorded = true;
                }
            },
            complete: (response) => {
                const endTime = performance.now();
                const total = endTime - startTime;
                return this.record({
                    timestamp: new Date(),
                    method: options.method,
                    url: options.url,
                    status: response.status,
                    statusText: response.statusText,
                    requestHeaders: options.requestHeaders ?? {},
                    responseHeaders: response.responseHeaders,
                    requestBody: options.requestBody,
                    responseBody: response.responseBody,
                    responseSize: response.responseSize,
                    timing: {
                        startTime,
                        ttfb: ttfbRecorded ? ttfb : total,
                        endTime,
                        total,
                    },
                    type: options.type ?? 'fetch',
                    initiator: options.initiator,
                    priority: options.priority,
                    cached: response.cached ?? false,
                    error: response.error,
                    tags: options.tags,
                });
            },
        };
    }
    /**
     * Intercept fetch requests
     */
    interceptFetch() {
        if (typeof window === 'undefined' || this.interceptors.fetch)
            return;
        this.interceptors.fetch = window.fetch;
        window.fetch = async (input, init) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            const method = init?.method ?? 'GET';
            const tracker = this.startRequest({
                method,
                url,
                requestHeaders: this.extractHeaders(init?.headers),
                requestBody: init?.body,
                type: 'fetch',
            });
            try {
                const response = await this.interceptors.fetch(input, init);
                // Clone response to read body
                const clonedResponse = response.clone();
                let responseBody;
                let responseSize = 0;
                try {
                    const contentType = response.headers.get('content-type') ?? '';
                    if (contentType.includes('application/json')) {
                        responseBody = await clonedResponse.json();
                        responseSize = JSON.stringify(responseBody).length;
                    }
                    else {
                        const text = await clonedResponse.text();
                        responseBody = text;
                        responseSize = text.length;
                    }
                }
                catch {
                    responseSize = parseInt(response.headers.get('content-length') ?? '0', 10);
                }
                tracker.recordTTFB();
                tracker.complete({
                    status: response.status,
                    statusText: response.statusText,
                    responseHeaders: this.headersToObject(response.headers),
                    responseBody,
                    responseSize,
                    cached: response.headers.get('x-cache') === 'HIT',
                });
                return response;
            }
            catch (error) {
                tracker.complete({
                    status: 0,
                    statusText: 'Network Error',
                    responseHeaders: {},
                    responseSize: 0,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
                throw error;
            }
        };
    }
    /**
     * Stop intercepting fetch requests
     */
    stopInterceptFetch() {
        if (this.interceptors.fetch) {
            window.fetch = this.interceptors.fetch;
            delete this.interceptors.fetch;
        }
    }
    /**
     * Get all requests
     */
    getRequests(filter) {
        let requests = [...this.requests];
        if (filter) {
            if (filter.methods?.length) {
                requests = requests.filter(r => filter.methods.includes(r.method));
            }
            if (filter.statuses?.length) {
                requests = requests.filter(r => filter.statuses.includes(r.status));
            }
            if (filter.types?.length) {
                requests = requests.filter(r => filter.types.includes(r.type));
            }
            if (filter.urlPattern) {
                const pattern = filter.urlPattern instanceof RegExp
                    ? filter.urlPattern
                    : new RegExp(filter.urlPattern);
                requests = requests.filter(r => pattern.test(r.url));
            }
            if (filter.minDuration !== undefined) {
                requests = requests.filter(r => r.timing.total >= filter.minDuration);
            }
            if (filter.maxDuration !== undefined) {
                requests = requests.filter(r => r.timing.total <= filter.maxDuration);
            }
            if (filter.startTime) {
                requests = requests.filter(r => r.timestamp >= filter.startTime);
            }
            if (filter.endTime) {
                requests = requests.filter(r => r.timestamp <= filter.endTime);
            }
            if (filter.tags?.length) {
                requests = requests.filter(r => r.tags?.some(t => filter.tags.includes(t)));
            }
            if (filter.hasError !== undefined) {
                requests = requests.filter(r => filter.hasError ? !!r.error : !r.error);
            }
        }
        return requests;
    }
    /**
     * Get request by ID
     */
    getRequest(id) {
        return this.requests.find(r => r.id === id);
    }
    /**
     * Get statistics
     */
    getStats(filter) {
        const requests = this.getRequests(filter);
        const stats = {
            totalRequests: requests.length,
            successfulRequests: requests.filter(r => r.status >= 200 && r.status < 300).length,
            failedRequests: requests.filter(r => r.status >= 400 || !!r.error).length,
            cachedRequests: requests.filter(r => r.cached).length,
            totalSize: requests.reduce((sum, r) => sum + r.responseSize, 0),
            totalDuration: requests.reduce((sum, r) => sum + r.timing.total, 0),
            avgDuration: 0,
            avgTTFB: 0,
            requestsByMethod: {},
            requestsByStatus: {},
            requestsByType: {},
        };
        if (requests.length > 0) {
            stats.avgDuration = stats.totalDuration / requests.length;
            stats.avgTTFB = requests.reduce((sum, r) => sum + r.timing.ttfb, 0) / requests.length;
            // Find slowest and largest
            stats.slowestRequest = requests.reduce((slowest, r) => r.timing.total > (slowest?.timing.total ?? 0) ? r : slowest, undefined);
            stats.largestRequest = requests.reduce((largest, r) => r.responseSize > (largest?.responseSize ?? 0) ? r : largest, undefined);
            // Count by method/status/type
            requests.forEach(r => {
                stats.requestsByMethod[r.method] = (stats.requestsByMethod[r.method] ?? 0) + 1;
                stats.requestsByStatus[r.status] = (stats.requestsByStatus[r.status] ?? 0) + 1;
                stats.requestsByType[r.type] = (stats.requestsByType[r.type] ?? 0) + 1;
            });
        }
        return stats;
    }
    /**
     * Add listener for new requests
     */
    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    /**
     * Clear all requests
     */
    clear() {
        this.requests = [];
    }
    /**
     * Enable/disable timeline
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Generate waterfall chart (ASCII)
     */
    generateWaterfall(options) {
        const width = options?.width ?? 60;
        const requests = this.getRequests(options?.filter).slice(0, options?.limit ?? 20);
        if (requests.length === 0) {
            return chalk.gray('No requests to display');
        }
        const lines = [];
        const minTime = Math.min(...requests.map(r => r.timing.startTime));
        const maxTime = Math.max(...requests.map(r => r.timing.endTime));
        const timeSpan = maxTime - minTime || 1;
        lines.push('');
        lines.push(chalk.bold('Network Waterfall'));
        lines.push(chalk.gray('─'.repeat(width + 40)));
        requests.forEach(r => {
            const startOffset = Math.round(((r.timing.startTime - minTime) / timeSpan) * width);
            const barWidth = Math.max(1, Math.round((r.timing.total / timeSpan) * width));
            const statusColor = r.status >= 200 && r.status < 300
                ? chalk.green
                : r.status >= 400
                    ? chalk.red
                    : chalk.yellow;
            const urlShort = r.url.length > 30 ? '...' + r.url.slice(-27) : r.url.padEnd(30);
            const bar = ' '.repeat(startOffset) + '█'.repeat(barWidth);
            const timing = `${r.timing.total.toFixed(0)}ms`;
            lines.push(`${statusColor(r.status.toString().padStart(3))} ${chalk.gray(r.method.padEnd(6))} ${chalk.cyan(urlShort)} ${chalk.blue(bar)} ${chalk.yellow(timing)}`);
        });
        lines.push(chalk.gray('─'.repeat(width + 40)));
        lines.push(`${chalk.gray('0ms')}${' '.repeat(width - 10)}${chalk.gray(`${(maxTime - minTime).toFixed(0)}ms`)}`);
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Export as HAR format
     */
    exportHAR() {
        const requests = this.getRequests();
        const har = {
            log: {
                version: '1.2',
                creator: {
                    name: 'Clarity Chat Dev Tools',
                    version: '1.0.0',
                },
                entries: requests.map(r => ({
                    startedDateTime: r.timestamp.toISOString(),
                    time: r.timing.total,
                    request: {
                        method: r.method,
                        url: r.url,
                        httpVersion: 'HTTP/1.1',
                        headers: Object.entries(r.requestHeaders).map(([name, value]) => ({ name, value })),
                        queryString: [],
                        bodySize: r.requestBody ? JSON.stringify(r.requestBody).length : 0,
                        postData: r.requestBody ? {
                            mimeType: 'application/json',
                            text: JSON.stringify(r.requestBody),
                        } : undefined,
                    },
                    response: {
                        status: r.status,
                        statusText: r.statusText,
                        httpVersion: 'HTTP/1.1',
                        headers: Object.entries(r.responseHeaders).map(([name, value]) => ({ name, value })),
                        content: {
                            size: r.responseSize,
                            mimeType: r.responseHeaders['content-type'] ?? 'application/json',
                            text: r.responseBody ? JSON.stringify(r.responseBody) : '',
                        },
                        bodySize: r.responseSize,
                    },
                    cache: r.cached ? { beforeRequest: null, afterRequest: null } : {},
                    timings: {
                        blocked: 0,
                        dns: r.timing.dnsLookup ?? -1,
                        connect: r.timing.tcpConnect ?? -1,
                        ssl: r.timing.tlsHandshake ?? -1,
                        send: 0,
                        wait: r.timing.ttfb,
                        receive: r.timing.contentDownload ?? (r.timing.total - r.timing.ttfb),
                    },
                })),
            },
        };
        return JSON.stringify(har, null, 2);
    }
    /**
     * Print report
     */
    printReport(filter) {
        const stats = this.getStats(filter);
        console.log('');
        console.log(infoBox('Network Timeline Report', '🌐 Network'));
        console.log('');
        // Overview stats
        const overviewData = {
            'Total Requests': chalk.cyan(stats.totalRequests.toString()),
            'Successful': chalk.green(stats.successfulRequests.toString()),
            'Failed': stats.failedRequests > 0 ? chalk.red(stats.failedRequests.toString()) : chalk.gray('0'),
            'Cached': chalk.gray(stats.cachedRequests.toString()),
            'Total Size': chalk.cyan(this.formatSize(stats.totalSize)),
            'Avg Duration': chalk.cyan(stats.avgDuration.toFixed(2) + 'ms'),
            'Avg TTFB': chalk.cyan(stats.avgTTFB.toFixed(2) + 'ms'),
        };
        console.log(keyValueTable(overviewData));
        console.log('');
        // Slowest request
        if (stats.slowestRequest) {
            console.log(warningBox('Slowest Request', '🐌 Slowest'));
            const slowData = {
                'URL': chalk.cyan(stats.slowestRequest.url.substring(0, 50)),
                'Duration': chalk.yellow(stats.slowestRequest.timing.total.toFixed(2) + 'ms'),
                'Status': stats.slowestRequest.status >= 400
                    ? chalk.red(stats.slowestRequest.status.toString())
                    : chalk.green(stats.slowestRequest.status.toString()),
            };
            console.log(keyValueTable(slowData));
            console.log('');
        }
        // Waterfall
        console.log(this.generateWaterfall({ filter, limit: 10 }));
    }
    /**
     * Helper: Extract headers
     */
    extractHeaders(headers) {
        if (!headers)
            return {};
        if (headers instanceof Headers) {
            return this.headersToObject(headers);
        }
        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }
        return headers;
    }
    /**
     * Helper: Convert Headers to object
     */
    headersToObject(headers) {
        const obj = {};
        headers.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    /**
     * Helper: Format size
     */
    formatSize(bytes) {
        if (bytes >= 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
        if (bytes >= 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }
        return `${bytes} B`;
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
// Global instance
let globalTimeline = null;
/**
 * Get the global network timeline instance
 */
export function getNetworkTimeline() {
    if (!globalTimeline) {
        globalTimeline = new NetworkTimeline({
            enabled: process.env.NODE_ENV === 'development',
        });
    }
    return globalTimeline;
}
/**
 * Create a new network timeline instance
 */
export function createNetworkTimeline(options) {
    return new NetworkTimeline(options);
}
export default NetworkTimeline;
//# sourceMappingURL=network-timeline.js.map