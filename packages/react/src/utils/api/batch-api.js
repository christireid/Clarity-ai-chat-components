/**
 * Batch API Support
 *
 * Enables batch processing of LLM requests for 50% cost reduction on
 * non-time-sensitive operations. Supports both OpenAI and Anthropic batch APIs.
 *
 * Key features:
 * - Automatic request batching with configurable thresholds
 * - Priority-based queue management
 * - Provider-specific batch implementations
 * - Cost tracking and savings estimation
 *
 * ## Implementation Status
 *
 * **IMPORTANT**: The `processBatch` method in `BatchRequestManager` is currently
 * a **placeholder implementation** that simulates batch processing. To use this
 * in production, you must:
 *
 * 1. Replace `processBatch` with actual API calls to your LLM provider's batch endpoint
 * 2. Implement polling for batch completion (batch APIs are async, 24hr completion)
 * 3. Handle file upload for large batches (OpenAI requires JSONL file upload)
 *
 * The helper functions `createOpenAIBatchFile`, `createAnthropicBatchFile`, and
 * `parseOpenAIBatchResults` are production-ready for formatting requests/responses.
 *
 * @see https://platform.openai.com/docs/guides/batch
 * @see https://docs.anthropic.com/en/docs/build-with-claude/message-batches
 *
 * @module utils/batch-api
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Provider-specific pricing for batch API (50% discount)
 */
const BATCH_PRICING = {
    // OpenAI - 50% off
    'gpt-4o': { inputPer1M: 1.25, outputPer1M: 5.0 },
    'gpt-4o-mini': { inputPer1M: 0.075, outputPer1M: 0.3 },
    'gpt-4-turbo': { inputPer1M: 5.0, outputPer1M: 15.0 },
    // Anthropic - 50% off
    'claude-3-5-sonnet': { inputPer1M: 1.5, outputPer1M: 7.5 },
    'claude-3-5-haiku': { inputPer1M: 0.4, outputPer1M: 2.0 },
    'claude-3-opus': { inputPer1M: 7.5, outputPer1M: 37.5 },
};
/**
 * Generate unique ID
 */
function generateId() {
    return `batch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
/**
 * Batch Request Manager
 *
 * Manages queuing, batching, and execution of LLM requests.
 *
 * @example
 * ```ts
 * const manager = new BatchRequestManager({
 *   provider: 'openai',
 *   maxBatchSize: 50,
 *   maxWaitTime: 60000,
 * })
 *
 * // Add requests
 * const promise1 = manager.addRequest({
 *   id: 'req1',
 *   model: 'gpt-4o-mini',
 *   messages: [{ role: 'user', content: 'Hello' }],
 *   priority: 'low',
 * })
 *
 * // Submit batch when ready
 * const job = await manager.submitBatch()
 *
 * // Get results
 * const results = await manager.getResults(job.id)
 * ```
 */
export class BatchRequestManager {
    config;
    queue = new Map();
    jobs = new Map();
    results = new Map();
    pendingPromises = new Map();
    stats = {
        totalBatched: 0,
        totalCompleted: 0,
        totalFailed: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalSavings: 0,
        averageBatchSize: 0,
        averageWaitTime: 0,
    };
    batchTimer = null;
    oldestQueueTime = 0;
    cancelledJobs = new Set();
    destroyed = false;
    executor;
    constructor(config) {
        const defaultExecutor = config.executor ?? createSimulatedBatchExecutor();
        this.config = {
            provider: config.provider,
            maxBatchSize: config.maxBatchSize ?? 100,
            maxWaitTime: config.maxWaitTime ?? 60000,
            onProgress: config.onProgress ?? (() => { }),
            onStatusChange: config.onStatusChange ?? (() => { }),
            suppressUnhandledRejections: config.suppressUnhandledRejections ?? true,
            executor: defaultExecutor,
        };
        this.executor = defaultExecutor;
    }
    safeRejectPending(requestId, error) {
        const pending = this.pendingPromises.get(requestId);
        if (!pending)
            return;
        // Reject on a microtask so callers have a chance to attach handlers.
        queueMicrotask(() => pending.reject(error));
        this.pendingPromises.delete(requestId);
    }
    /**
     * Add a request to the batch queue
     *
     * Returns a promise that resolves when the batch completes.
     */
    addRequest(request) {
        if (this.destroyed) {
            return Promise.reject(new Error('BatchRequestManager has been destroyed'));
        }
        if (!request ||
            typeof request.id !== 'string' ||
            request.id.trim().length === 0) {
            return Promise.reject(new Error('Invalid request: "id" is required'));
        }
        if (this.queue.has(request.id) || this.pendingPromises.has(request.id)) {
            return Promise.reject(new Error(`Duplicate request id: ${request.id}`));
        }
        const promise = new Promise((resolve, reject) => {
            // Store request
            this.queue.set(request.id, request);
            this.pendingPromises.set(request.id, { resolve, reject });
            // Track queue timing
            if (this.queue.size === 1) {
                this.oldestQueueTime = Date.now();
                this.startAutoSubmitTimer();
            }
            // Auto-submit if batch is full
            if (this.queue.size >= this.config.maxBatchSize) {
                this.submitBatch();
            }
        });
        if (this.config.suppressUnhandledRejections) {
            promise.catch(() => { });
        }
        return promise;
    }
    /**
     * Enqueue a request in fire-and-forget mode.
     *
     * This is intentionally explicit: if you do not plan to `await` the promise
     * returned by `addRequest`, use this method to avoid noisy unhandled rejection
     * warnings when the manager is destroyed or the queue is cleared.
     */
    enqueueRequest(request) {
        // Fire-and-forget: rejections are silently swallowed
        this.addRequest(request).catch(() => { });
    }
    /**
     * Submit current queue as a batch
     */
    async submitBatch() {
        if (this.queue.size === 0) {
            return null;
        }
        // Clear timer
        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = null;
        }
        // Create batch job
        const requestIds = Array.from(this.queue.keys());
        const job = {
            id: generateId(),
            provider: this.config.provider,
            status: 'pending',
            requestIds,
            createdAt: Date.now(),
        };
        this.jobs.set(job.id, job);
        this.config.onStatusChange(job);
        // Track stats
        const waitTime = Date.now() - this.oldestQueueTime;
        this.stats.totalBatched += requestIds.length;
        this.stats.averageBatchSize =
            (this.stats.averageBatchSize *
                (this.stats.totalBatched - requestIds.length) +
                requestIds.length) /
                this.stats.totalBatched;
        this.stats.averageWaitTime =
            (this.stats.averageWaitTime *
                (this.stats.totalBatched - requestIds.length) +
                waitTime) /
                this.stats.totalBatched;
        // Clear queue
        const requests = Array.from(this.queue.values());
        this.queue.clear();
        this.oldestQueueTime = 0;
        // Process batch (in a real implementation, this would call the provider API)
        // Note: Processing is intentionally not awaited to allow non-blocking batch submission.
        // The simulation yields to the event loop so callers can observe `pending` first.
        this.processBatch(job, requests).catch((error) => {
            job.status = 'failed';
            job.error = error instanceof Error ? error.message : String(error);
            this.config.onStatusChange(job);
            // Reject all pending promises for this batch
            for (const requestId of job.requestIds) {
                this.safeRejectPending(requestId, error instanceof Error ? error : new Error(String(error)));
            }
        });
        return job;
    }
    /**
     * Get batch job status
     */
    getBatchStatus(jobId) {
        return this.jobs.get(jobId);
    }
    /**
     * Cancel a batch job
     */
    async cancelBatch(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return false;
        if (job.status !== 'pending' && job.status !== 'in_progress')
            return false;
        this.cancelledJobs.add(jobId);
        job.status = 'cancelled';
        this.config.onStatusChange(job);
        // Reject pending promises
        for (const requestId of job.requestIds) {
            this.safeRejectPending(requestId, new Error('Batch cancelled'));
        }
        return true;
    }
    /**
     * Get results for a batch job
     */
    getResults(jobId) {
        return this.results.get(jobId);
    }
    /**
     * Get current queue size
     */
    getQueueSize() {
        return this.queue.size;
    }
    /**
     * Get batch statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Flush queue (submit immediately)
     */
    async flush() {
        return this.submitBatch();
    }
    /**
     * Clear queue without submitting
     */
    clearQueue() {
        for (const [requestId] of this.queue) {
            this.safeRejectPending(requestId, new Error('Queue cleared'));
        }
        this.queue.clear();
        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = null;
        }
    }
    /**
     * Destroy the manager and clean up resources
     * Call this when the manager is no longer needed to prevent timer leaks
     */
    destroy() {
        this.destroyed = true;
        this.clearQueue();
        // Clear all stored data
        this.jobs.clear();
        this.results.clear();
        this.pendingPromises.clear();
        this.cancelledJobs.clear();
    }
    /**
     * Start auto-submit timer
     */
    startAutoSubmitTimer() {
        if (this.batchTimer)
            return;
        this.batchTimer = setTimeout(() => {
            this.submitBatch();
        }, this.config.maxWaitTime);
    }
    /**
     * Process batch
     *
     * ⚠️ PLACEHOLDER IMPLEMENTATION ⚠️
     *
     * This method currently simulates batch processing for development/testing.
     * For production use, replace this with actual provider API calls:
     *
     * OpenAI:
     *   1. Upload JSONL file via Files API
     *   2. Create batch via POST /v1/batches
     *   3. Poll GET /v1/batches/{id} until complete
     *   4. Download results file
     *
     * Anthropic:
     *   1. POST /v1/messages/batches with requests array
     *   2. Poll GET /v1/messages/batches/{id} until complete
     *   3. Retrieve results from response
     */
    async processBatch(job, requests) {
        // Yield so callers can observe `pending` before transitioning to `in_progress`.
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (this.cancelledJobs.has(job.id) || job.status === 'cancelled')
            return;
        job.status = 'in_progress';
        this.config.onStatusChange(job);
        const results = await this.executor.execute(requests, {
            provider: this.config.provider,
            onProgress: this.config.onProgress,
            isCancelled: () => this.cancelledJobs.has(job.id) || job.status === 'cancelled',
            now: () => Date.now(),
        });
        // Store results
        this.results.set(job.id, results);
        // Update job
        job.status = 'completed';
        job.completedAt = Date.now();
        job.progress = 100;
        this.config.onStatusChange(job);
        // Update stats
        const successCount = results.filter((r) => r.success).length;
        this.stats.totalCompleted += successCount;
        this.stats.totalFailed += requests.length - successCount;
        // Resolve/reject promises.
        for (const result of results) {
            const pending = this.pendingPromises.get(result.requestId);
            if (!pending)
                continue;
            if (result.success) {
                pending.resolve(result);
            }
            else {
                this.safeRejectPending(result.requestId, new Error(result.error || 'Batch request failed'));
                continue;
            }
            this.pendingPromises.delete(result.requestId);
        }
        // Calculate savings
        const savings = this.calculateBatchSavings(requests);
        this.stats.totalSavings += savings.savings;
    }
    /**
     * Calculate savings for a batch
     */
    calculateBatchSavings(requests) {
        let totalInputTokens = 0;
        let totalOutputTokens = 0;
        for (const request of requests) {
            const inputTokens = request.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
            totalInputTokens += inputTokens;
            totalOutputTokens += Math.floor(inputTokens * 0.5); // Estimate
        }
        // Get model pricing
        const modelKey = requests[0]?.model ?? 'gpt-4o-mini';
        const pricing = BATCH_PRICING[modelKey] ?? BATCH_PRICING['gpt-4o-mini'];
        const batchCost = (totalInputTokens / 1_000_000) * pricing.inputPer1M +
            (totalOutputTokens / 1_000_000) * pricing.outputPer1M;
        // Regular price is 2x batch price
        const regularCost = batchCost * 2;
        return {
            regularCost,
            batchCost,
            savings: regularCost - batchCost,
            savingsPercent: 50,
            estimatedCompletionTime: requests.length * 100, // Rough estimate
        };
    }
}
/**
 * Estimate savings from using batch API
 */
export function estimateBatchSavings(requests) {
    if (requests.length === 0) {
        return {
            regularCost: 0,
            batchCost: 0,
            savings: 0,
            savingsPercent: 50,
            estimatedCompletionTime: 0,
        };
    }
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    for (const request of requests) {
        const inputTokens = request.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
        totalInputTokens += inputTokens;
        totalOutputTokens += Math.floor(inputTokens * 0.5);
    }
    const modelKey = requests[0]?.model ?? 'gpt-4o-mini';
    const pricing = BATCH_PRICING[modelKey] ?? BATCH_PRICING['gpt-4o-mini'];
    const batchCost = (totalInputTokens / 1_000_000) * pricing.inputPer1M +
        (totalOutputTokens / 1_000_000) * pricing.outputPer1M;
    const regularCost = batchCost * 2;
    return {
        regularCost,
        batchCost,
        savings: regularCost - batchCost,
        savingsPercent: 50,
        estimatedCompletionTime: requests.length * 100,
    };
}
/**
 * Check if a request should use batch API
 */
export function shouldUseBatch(request, options = {}) {
    const { urgency = 'normal', minSavingsThreshold = 0.00005, maxWaitAcceptable = 86400000, } = options;
    // High urgency requests should not be batched
    if (urgency === 'high') {
        return { useBatch: false, reason: 'Request is high urgency' };
    }
    // Estimate tokens
    const tokens = request.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
    // Very small requests have minimal savings
    if (tokens < 100) {
        return {
            useBatch: false,
            reason: 'Request too small for meaningful savings',
        };
    }
    // Estimate savings (use gpt-4o-mini baseline, includes output cost estimate).
    const estimatedOutputTokens = Math.max(64, Math.floor(tokens * 0.5));
    const regularCost = (tokens / 1_000_000) * 0.15 + (estimatedOutputTokens / 1_000_000) * 0.6;
    const savings = regularCost * 0.5;
    if (savings < minSavingsThreshold) {
        return {
            useBatch: false,
            reason: `Savings $${savings.toFixed(4)} below threshold`,
        };
    }
    // Check if wait time is acceptable
    // Batch API typically completes within 24 hours
    if (maxWaitAcceptable < 3600000) {
        // Less than 1 hour
        return {
            useBatch: false,
            reason: 'Wait time requirement too strict for batch API',
        };
    }
    return {
        useBatch: true,
        reason: `Batch recommended: ~$${savings.toFixed(4)} savings, ${urgency} urgency`,
    };
}
/**
 * Create a JSONL file content for OpenAI batch API
 */
export function createOpenAIBatchFile(requests) {
    return requests
        .map((req) => {
        const body = {
            model: req.model,
            messages: req.messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            ...(req.options?.maxTokens && { max_tokens: req.options.maxTokens }),
            ...(req.options?.temperature !== undefined && {
                temperature: req.options.temperature,
            }),
        };
        return JSON.stringify({
            custom_id: req.id,
            method: 'POST',
            url: '/v1/chat/completions',
            body,
        });
    })
        .join('\n');
}
/**
 * Create a batch request file for Anthropic
 */
export function createAnthropicBatchFile(requests) {
    return requests.map((req) => ({
        custom_id: req.id,
        params: {
            model: req.model,
            max_tokens: req.options?.maxTokens ?? 1024,
            messages: req.messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
        },
    }));
}
/**
 * Parse OpenAI batch results
 */
export function parseOpenAIBatchResults(jsonlContent) {
    return jsonlContent
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
        try {
            const result = JSON.parse(line);
            const response = result.response?.body;
            if (result.error) {
                return {
                    requestId: result.custom_id,
                    success: false,
                    error: result.error.message,
                };
            }
            return {
                requestId: result.custom_id,
                success: true,
                content: response?.choices?.[0]?.message?.content ?? '',
                usage: {
                    inputTokens: response?.usage?.prompt_tokens ?? 0,
                    outputTokens: response?.usage?.completion_tokens ?? 0,
                },
            };
        }
        catch {
            return {
                requestId: 'unknown',
                success: false,
                error: 'Failed to parse result',
            };
        }
    });
}
function createSimulatedBatchExecutor() {
    return {
        execute: async (requests, context) => {
            // Yield so callers can observe `pending` and cancellations can occur.
            await new Promise((resolve) => setTimeout(resolve, 0));
            const results = [];
            for (let i = 0; i < requests.length; i++) {
                if (context.isCancelled()) {
                    return results;
                }
                // Simulate async work (and make fake timers deterministic in tests)
                await new Promise((resolve) => setTimeout(resolve, 0));
                const request = requests[i];
                const inputTokens = request.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
                const result = {
                    requestId: request.id,
                    success: true,
                    content: `[Batch response for ${request.id}]`,
                    usage: {
                        inputTokens,
                        outputTokens: Math.floor(inputTokens * 0.5),
                    },
                };
                results.push(result);
                context.onProgress(i + 1, requests.length);
            }
            return results;
        },
    };
}
//# sourceMappingURL=batch-api.js.map