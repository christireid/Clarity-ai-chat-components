/**
 * Request Batching Utilities
 *
 * Batch multiple requests together for better efficiency.
 * Can save 30-40% through batch discounts and reduced overhead.
 */
/**
 * Request batcher for grouping queries
 *
 * @example
 * ```tsx
 * const batcher = new RequestBatcher({
 *   maxBatchSize: 5,
 *   maxWaitTime: 1000, // 1 second
 *   processor: async (requests) => {
 *     // Process all requests in one API call
 *     const responses = await api.batchQuery(
 *       requests.map(r => r.data)
 *     )
 *     return responses
 *   }
 * })
 *
 * // Add requests (will be batched automatically)
 * const result1 = await batcher.add({ query: 'Hello' })
 * const result2 = await batcher.add({ query: 'World' })
 * ```
 */
export class RequestBatcher {
    options;
    queue = [];
    pendingPromises = new Map();
    timer = null;
    processing = false;
    stats = {
        totalRequests: 0,
        totalBatches: 0,
        averageBatchSize: 0,
        totalSavings: 0,
    };
    constructor(options) {
        this.options = options;
        this.options.maxBatchSize = options.maxBatchSize ?? 10;
        this.options.maxWaitTime = options.maxWaitTime ?? 1000;
        this.options.enablePriority = options.enablePriority ?? false;
    }
    /**
     * Add request to batch queue
     */
    async add(data, options) {
        const request = {
            id: this.generateId(),
            data,
            priority: options?.priority ?? 0,
            timestamp: Date.now(),
            tags: options?.tags,
        };
        this.queue.push(request);
        this.stats.totalRequests++;
        // Sort by priority if enabled
        if (this.options.enablePriority) {
            this.queue.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        }
        // Create promise for this request
        const promise = new Promise((resolve, reject) => {
            this.pendingPromises.set(request.id, { resolve, reject });
        });
        // Schedule processing
        this.scheduleProcessing();
        return promise;
    }
    /**
     * Schedule batch processing
     */
    scheduleProcessing() {
        // If already processing, don't schedule again
        if (this.processing)
            return;
        // Clear existing timer
        if (this.timer) {
            clearTimeout(this.timer);
        }
        // Process immediately if batch is full
        if (this.queue.length >= this.options.maxBatchSize) {
            this.processBatch();
            return;
        }
        // Otherwise wait for more requests
        this.timer = setTimeout(() => {
            this.processBatch();
        }, this.options.maxWaitTime);
    }
    /**
     * Process current batch
     */
    async processBatch() {
        if (this.queue.length === 0 || this.processing)
            return;
        this.processing = true;
        const startTime = Date.now();
        // Take batch from queue
        const batchSize = Math.min(this.queue.length, this.options.maxBatchSize);
        const batch = this.queue.splice(0, batchSize);
        try {
            // Process batch
            const responses = await this.options.processor(batch);
            // Resolve all promises
            const processingTime = Date.now() - startTime;
            const results = [];
            batch.forEach((request, index) => {
                const result = {
                    id: request.id,
                    request: request.data,
                    response: responses[index],
                    processingTime,
                };
                results.push(result);
                const promise = this.pendingPromises.get(request.id);
                const response = responses[index];
                if (promise && response !== undefined) {
                    promise.resolve(response);
                    this.pendingPromises.delete(request.id);
                }
            });
            // Update stats
            this.stats.totalBatches++;
            this.stats.averageBatchSize =
                (this.stats.averageBatchSize * (this.stats.totalBatches - 1) + batch.length) /
                    this.stats.totalBatches;
            // Calculate savings (estimated 30% per batched request)
            this.stats.totalSavings += batch.length * 0.3;
            // Callback
            this.options.onBatchProcessed?.(results);
        }
        catch (error) {
            // Reject all promises
            batch.forEach((request) => {
                const promise = this.pendingPromises.get(request.id);
                if (promise) {
                    promise.reject(error);
                    this.pendingPromises.delete(request.id);
                }
            });
        }
        finally {
            this.processing = false;
            // Process next batch if queue not empty
            if (this.queue.length > 0) {
                this.scheduleProcessing();
            }
        }
    }
    /**
     * Flush all pending requests immediately
     */
    async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        await this.processBatch();
    }
    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            queueSize: this.queue.length,
            pendingRequests: this.pendingPromises.size,
        };
    }
    /**
     * Clear queue
     */
    clear() {
        this.queue = [];
        // Reject all pending promises
        for (const [id, promise] of this.pendingPromises.entries()) {
            promise.reject(new Error('Queue cleared'));
            this.pendingPromises.delete(id);
        }
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
/**
 * Debounced batcher - only processes the last request in a time window
 */
export class DebouncedBatcher {
    processor;
    delay;
    pending = null;
    timer = null;
    pendingPromise = null;
    constructor(processor, delay = 500) {
        this.processor = processor;
        this.delay = delay;
    }
    /**
     * Add request (will cancel previous pending request)
     */
    async add(data) {
        // Cancel previous request
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.pendingPromise) {
            this.pendingPromise.reject(new Error('Debounced - newer request added'));
        }
        // Create new request
        const promise = new Promise((resolve, reject) => {
            this.pendingPromise = { resolve, reject };
        });
        this.pending = {
            id: `${Date.now()}`,
            data,
            timestamp: Date.now(),
        };
        // Schedule processing
        this.timer = setTimeout(() => {
            this.process();
        }, this.delay);
        return promise;
    }
    /**
     * Process pending request
     */
    async process() {
        if (!this.pending || !this.pendingPromise)
            return;
        try {
            const result = await this.processor(this.pending.data);
            this.pendingPromise.resolve(result);
        }
        catch (error) {
            this.pendingPromise.reject(error);
        }
        finally {
            this.pending = null;
            this.pendingPromise = null;
        }
    }
    /**
     * Flush immediately
     */
    async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        await this.process();
    }
}
//# sourceMappingURL=request-batcher.js.map