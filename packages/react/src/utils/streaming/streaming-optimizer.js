/**
 * Streaming Response Optimization
 *
 * Provides output token optimization through early stopping, completion detection,
 * and partial response caching. Can save 10-20% on output tokens.
 *
 * Key features:
 * - Early stopping when sufficient information is received
 * - Completion signal detection (natural endpoints)
 * - Partial response caching for resumption
 * - Loop/repetition detection
 * - Configurable stopping criteria
 *
 * @module utils/streaming-optimizer
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Default completion signals
 */
export const DEFAULT_COMPLETION_SIGNALS = [
    'In conclusion',
    'To summarize',
    'In summary',
    'To sum up',
    'Therefore,',
    'Thus,',
    'Hence,',
    "That's all",
    'That is all',
    'Hope this helps',
    'Let me know if',
    'Is there anything else',
    'Feel free to ask',
    'I hope that answers',
];
/**
 * Default early stop patterns
 *
 * Note: These patterns are designed to be safe from catastrophic backtracking:
 * - All use anchors (^, $) or short fixed patterns
 * - Applied only to last 200 chars of response (see checkEarlyStopPatterns)
 * - Avoid unbounded repetition (.*) without anchors
 */
export const DEFAULT_EARLY_STOP_PATTERNS = [
    /^```\s*$/m, // End of code block (anchored)
    /^\}\s*$/m, // JSON closing brace on its own line (anchored)
    /^<\/[a-zA-Z]{1,20}>\s*$/m, // XML closing tag, limited tag length (anchored)
    /\n\n\*{3,10}\s*$/m, // Section break at end, limited asterisks (anchored)
    /\[END\]/i, // Short fixed pattern
    /\[DONE\]/i, // Short fixed pattern
];
/**
 * Streaming Response Monitor
 *
 * Monitors streaming responses for optimization opportunities.
 *
 * @example
 * ```ts
 * const monitor = new StreamingResponseMonitor({
 *   maxOutputTokens: 2000,
 *   targetCompletionSignals: ['In conclusion'],
 *   detectRepetition: true,
 * })
 *
 * for await (const chunk of stream) {
 *   const analysis = monitor.onChunk(chunk)
 *   if (!analysis.shouldContinue) {
 *     console.log(`Stopping: ${analysis.reason}`)
 *     break
 *   }
 *   // Process chunk...
 * }
 *
 * console.log('Tokens saved:', monitor.getMetrics().potentialTokensSaved)
 * ```
 */
export class StreamingResponseMonitor {
    config;
    accumulatedResponse = '';
    tokenCount = 0;
    startTime = 0;
    stopEvents = 0;
    totalConfidence = 0;
    chunksProcessed = 0;
    lastChunks = [];
    stopped = false;
    stoppedReason;
    stoppedConfidence;
    stoppedSignal;
    constructor(config = {}) {
        this.config = {
            maxOutputTokens: config.maxOutputTokens ?? 4096,
            earlyStopPatterns: config.earlyStopPatterns ?? DEFAULT_EARLY_STOP_PATTERNS,
            cachePartialResponses: config.cachePartialResponses ?? true,
            targetCompletionSignals: config.targetCompletionSignals ?? DEFAULT_COMPLETION_SIGNALS,
            minTokensBeforeCheck: config.minTokensBeforeCheck ?? 100,
            detectRepetition: config.detectRepetition ?? true,
            repetitionWindowSize: config.repetitionWindowSize ?? 50,
            confidenceThreshold: config.confidenceThreshold ?? 0.7,
            model: config.model ?? '',
        };
        this.startTime = Date.now();
    }
    /**
     * Process a streaming chunk
     */
    onChunk(chunk) {
        if (this.stopped) {
            return {
                shouldContinue: false,
                reason: this.stoppedReason ?? 'user-stop',
                confidence: this.stoppedConfidence ?? 1,
                detectedSignal: this.stoppedSignal,
                currentTokens: this.tokenCount,
            };
        }
        this.accumulatedResponse += chunk;
        this.tokenCount = estimateTokens(this.accumulatedResponse, this.config.model);
        this.chunksProcessed++;
        // Track recent chunks for repetition detection
        this.lastChunks.push(chunk);
        if (this.lastChunks.length > 20) {
            this.lastChunks.shift();
        }
        // Check max tokens
        if (this.tokenCount >= this.config.maxOutputTokens) {
            return this.createStopResult('max-tokens', 1.0);
        }
        // Only check for completion after minimum tokens
        if (this.tokenCount < this.config.minTokensBeforeCheck) {
            return {
                shouldContinue: true,
                confidence: 0,
                currentTokens: this.tokenCount,
            };
        }
        // Check for completion signals
        const signalResult = this.detectCompletionSignals();
        if (signalResult) {
            return signalResult;
        }
        // Check for early stop patterns
        const patternResult = this.checkEarlyStopPatterns();
        if (patternResult) {
            return patternResult;
        }
        // Check for repetition
        if (this.config.detectRepetition) {
            const repetitionResult = this.detectRepetition();
            if (repetitionResult) {
                return repetitionResult;
            }
        }
        return {
            shouldContinue: true,
            confidence: 0,
            currentTokens: this.tokenCount,
        };
    }
    /**
     * Get accumulated response
     */
    getAccumulatedResponse() {
        return this.accumulatedResponse;
    }
    /**
     * Get current token count
     */
    getTokensConsumed() {
        return this.tokenCount;
    }
    /**
     * Force stop the monitor
     */
    forceStop() {
        this.stopped = true;
        this.stoppedReason = 'user-stop';
        this.stoppedConfidence = 1;
        this.stoppedSignal = undefined;
    }
    /**
     * Reset the monitor for new stream
     */
    reset() {
        this.accumulatedResponse = '';
        this.tokenCount = 0;
        this.startTime = Date.now();
        this.stopEvents = 0;
        this.totalConfidence = 0;
        this.chunksProcessed = 0;
        this.lastChunks = [];
        this.stopped = false;
        this.stoppedReason = undefined;
        this.stoppedConfidence = undefined;
        this.stoppedSignal = undefined;
    }
    /**
     * Get streaming metrics
     */
    getMetrics() {
        const avgConfidence = this.stopEvents > 0 ? this.totalConfidence / this.stopEvents : 0;
        // Estimate potential savings as 20% of what might have been generated
        const potentialSaved = this.stopped ? Math.floor(this.tokenCount * 0.2) : 0;
        return {
            tokensBeforeStop: this.tokenCount,
            potentialTokensSaved: potentialSaved,
            earlyStopEvents: this.stopEvents,
            averageStopConfidence: avgConfidence,
            chunksProcessed: this.chunksProcessed,
            totalDuration: Date.now() - this.startTime,
        };
    }
    /**
     * Detect completion signals in accumulated response
     */
    detectCompletionSignals() {
        const lowerResponse = this.accumulatedResponse.toLowerCase();
        const lastPortion = lowerResponse.slice(-500); // Check last 500 chars
        for (const signal of this.config.targetCompletionSignals) {
            const lowerSignal = signal.toLowerCase();
            if (lastPortion.includes(lowerSignal)) {
                // Calculate confidence based on position (later = higher confidence)
                const position = lastPortion.lastIndexOf(lowerSignal);
                const confidence = 0.5 + (position / lastPortion.length) * 0.5;
                if (confidence >= this.config.confidenceThreshold) {
                    return this.createStopResult('completion-signal', confidence, signal);
                }
            }
        }
        return null;
    }
    /**
     * Check for early stop patterns
     */
    checkEarlyStopPatterns() {
        const lastPortion = this.accumulatedResponse.slice(-200);
        for (const pattern of this.config.earlyStopPatterns) {
            if (pattern.test(lastPortion)) {
                return this.createStopResult('pattern-match', 0.8);
            }
        }
        return null;
    }
    /**
     * Detect repetition in recent output
     */
    detectRepetition() {
        if (this.lastChunks.length < 10)
            return null;
        const recentText = this.lastChunks.join('');
        const windowSize = Math.min(this.config.repetitionWindowSize, recentText.length / 2);
        if (windowSize < 20)
            return null;
        // Check for repeated patterns
        const lastWindow = recentText.slice(-windowSize);
        const previousWindow = recentText.slice(-windowSize * 2, -windowSize);
        if (previousWindow && lastWindow === previousWindow) {
            return this.createStopResult('repetition', 0.9);
        }
        // Check for stuck loops (same words repeating)
        const words = recentText.split(/\s+/).slice(-30);
        const wordSet = new Set(words);
        const uniqueRatio = wordSet.size / words.length;
        if (uniqueRatio < 0.3 && words.length >= 20) {
            return this.createStopResult('repetition', 0.85);
        }
        return null;
    }
    /**
     * Create a stop result
     */
    createStopResult(reason, confidence, signal) {
        this.stopped = true;
        this.stoppedReason = reason;
        this.stoppedConfidence = confidence;
        this.stoppedSignal = signal;
        this.stopEvents++;
        this.totalConfidence += confidence;
        return {
            shouldContinue: false,
            reason,
            confidence,
            detectedSignal: signal,
            currentTokens: this.tokenCount,
        };
    }
}
/**
 * Partial Response Cache
 *
 * Caches partial responses for potential resumption.
 */
export class PartialResponseCache {
    cache = new Map();
    maxEntries;
    checkpointInterval;
    constructor(options = {}) {
        this.maxEntries = options.maxEntries ?? 100;
        this.checkpointInterval = options.checkpointInterval ?? 500; // tokens
    }
    /**
     * Create checkpoint for a response
     */
    checkpoint(queryHash, content, tokens, isComplete = false) {
        // Only checkpoint at intervals to avoid too many writes
        const existing = this.cache.get(queryHash);
        if (existing &&
            !isComplete &&
            tokens - existing.tokens < this.checkpointInterval) {
            return;
        }
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxEntries) {
            const oldest = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
            if (oldest) {
                this.cache.delete(oldest[0]);
            }
        }
        this.cache.set(queryHash, {
            queryHash,
            content,
            tokens,
            timestamp: Date.now(),
            isComplete,
        });
    }
    /**
     * Get cached partial response
     */
    get(queryHash) {
        return this.cache.get(queryHash);
    }
    /**
     * Check if can resume from cache
     */
    canResume(queryHash, maxAge = 300000) {
        const entry = this.cache.get(queryHash);
        if (!entry)
            return false;
        if (entry.isComplete)
            return false;
        return Date.now() - entry.timestamp < maxAge;
    }
    /**
     * Clear cache
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const entries = Array.from(this.cache.values());
        const totalTokens = entries.reduce((sum, e) => sum + e.tokens, 0);
        const oldestAge = entries.length > 0
            ? Date.now() - Math.min(...entries.map((e) => e.timestamp))
            : 0;
        return { entries: entries.length, totalTokens, oldestAge };
    }
}
/**
 * Create an optimized stream handler that wraps a provider stream
 *
 * @example
 * ```ts
 * const handler = createOptimizedStreamHandler({
 *   maxOutputTokens: 2000,
 *   targetCompletionSignals: ['In conclusion'],
 * })
 *
 * const result = await handler.process(responseStream, {
 *   onChunk: (chunk) => updateUI(chunk),
 *   onComplete: (content) => saveResponse(content),
 * })
 *
 * if (result.earlyStopped) {
 *   console.log('Saved tokens:', result.tokensSaved)
 * }
 * ```
 */
export function createOptimizedStreamHandler(config = {}) {
    const monitor = new StreamingResponseMonitor(config);
    return {
        process: async (stream, callbacks = {}) => {
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let earlyStopped = false;
            let stopReason;
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value, { stream: true });
                    const analysis = monitor.onChunk(chunk);
                    callbacks.onChunk?.(chunk, analysis);
                    if (!analysis.shouldContinue) {
                        earlyStopped = true;
                        stopReason = analysis.reason;
                        callbacks.onEarlyStop?.(analysis.reason ?? 'unknown', monitor.getMetrics());
                        break;
                    }
                }
            }
            finally {
                reader.releaseLock();
            }
            const content = monitor.getAccumulatedResponse();
            const metrics = monitor.getMetrics();
            callbacks.onComplete?.(content, metrics);
            return {
                content,
                earlyStopped,
                stopReason,
                metrics,
            };
        },
        getMonitor: () => monitor,
    };
}
/**
 * Simple hash for query string
 */
export function hashQuery(query) {
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
        const char = query.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return `q_${Math.abs(hash).toString(36)}`;
}
/**
 * Estimate if a query is likely to produce a long response
 */
export function estimateResponseLength(query) {
    const lowerQuery = query.toLowerCase();
    // Long response indicators
    const longIndicators = [
        'explain in detail',
        'comprehensive',
        'step by step',
        'thorough',
        'elaborate',
        'complete guide',
        'full explanation',
        'deep dive',
        'everything about',
        'all aspects',
    ];
    // Short response indicators
    const shortIndicators = [
        'briefly',
        'short answer',
        'yes or no',
        'one word',
        'quick',
        'simple',
        'just tell me',
        'in a nutshell',
        'tldr',
        'summarize',
    ];
    if (longIndicators.some((ind) => lowerQuery.includes(ind))) {
        return 'long';
    }
    if (shortIndicators.some((ind) => lowerQuery.includes(ind))) {
        return 'short';
    }
    // Default based on query length
    // Keep these thresholds conservative so typical questions fall into "medium".
    if (query.length < 25)
        return 'short';
    if (query.length > 160)
        return 'long';
    return 'medium';
}
/**
 * Get recommended max tokens based on query analysis
 */
export function getRecommendedMaxTokens(query, context) {
    const length = estimateResponseLength(query);
    let base = 0;
    switch (length) {
        case 'short':
            base = 500;
            break;
        case 'medium':
            base = 1500;
            break;
        case 'long':
            base = 4000;
            break;
    }
    // Adjust for context
    if (context?.hasCode) {
        base = Math.floor(base * 1.5);
    }
    if (context?.isTechnical) {
        base = Math.floor(base * 1.2);
    }
    return base;
}
//# sourceMappingURL=streaming-optimizer.js.map