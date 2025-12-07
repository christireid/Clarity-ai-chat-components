/**
 * Prompt Caching Manager
 *
 * Manages prompt caching for Anthropic and OpenAI models
 * Can achieve 50-90% cost reduction on repeated context
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Prompt Cache Manager
 *
 * Manages caching of prompts across different providers
 *
 * @example
 * ```ts
 * const cacheManager = new PromptCacheManager({
 *   provider: 'anthropic',
 *   model: 'claude-3-5-sonnet'
 * })
 *
 * // Mark content for caching
 * const messages = cacheManager.prepareMessages([
 *   { role: 'system', content: longSystemPrompt },
 *   { role: 'user', content: userQuery }
 * ])
 *
 * // 90% cost reduction on cached system prompt!
 * ```
 */
export class PromptCacheManager {
    options;
    stats = {
        requests: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        tokensSaved: 0,
        costSaved: 0,
    };
    cacheRegistry = new Map();
    constructor(options = {}) {
        this.options = {
            provider: options.provider ?? 'auto',
            model: options.model ?? 'claude-3-5-sonnet',
            defaultMinLength: options.defaultMinLength ?? 1024,
            autoManage: options.autoManage ?? true,
            trackStats: options.trackStats ?? true,
        };
    }
    /**
     * Register content for caching
     */
    registerCacheable(id, content) {
        this.cacheRegistry.set(id, content);
    }
    /**
     * Unregister cacheable content
     */
    unregisterCacheable(id) {
        this.cacheRegistry.delete(id);
    }
    /**
     * Prepare messages with cache control (Anthropic format)
     */
    prepareMessagesAnthropic(messages) {
        const prepared = messages.map((msg, index) => {
            const isLongContent = typeof msg.content === 'string' && this.estimateTokens(msg.content) >= this.options.defaultMinLength;
            // Anthropic: Cache long system messages and last user message with context
            const shouldCache = (msg.role === 'system' && isLongContent) ||
                (msg.role === 'user' && isLongContent && index === messages.length - 1);
            if (shouldCache && this.options.autoManage) {
                return {
                    ...msg,
                    cache_control: { type: 'ephemeral' },
                };
            }
            return msg;
        });
        return prepared;
    }
    /**
     * Prepare request with cache control (OpenAI format)
     */
    prepareRequestOpenAI(params) {
        const { messages, system } = params;
        // OpenAI: Can cache system prompt separately
        if (system && this.estimateTokens(system) >= this.options.defaultMinLength) {
            return {
                messages,
                cached_content: system,
            };
        }
        return { messages };
    }
    /**
     * Detect if content is cacheable
     */
    isCacheable(content, minLength) {
        const threshold = minLength ?? this.options.defaultMinLength;
        return this.estimateTokens(content) >= threshold;
    }
    /**
     * Get optimal cache points in conversation
     */
    getOptimalCachePoints(messages) {
        const cachePoints = [];
        messages.forEach((msg, index) => {
            // Cache system messages
            if (msg.role === 'system' && this.isCacheable(msg.content)) {
                cachePoints.push(index);
            }
            // Cache long context or document messages
            if (msg.role === 'user' && this.isCacheable(msg.content, 2048)) {
                cachePoints.push(index);
            }
        });
        return cachePoints;
    }
    /**
     * Estimate tokens (uses centralized estimator)
     */
    estimateTokens(text) {
        return estimateTokens(text);
    }
    /**
     * Record cache hit
     */
    recordCacheHit(tokensSaved, costSaved = 0) {
        if (!this.options.trackStats)
            return;
        this.stats.requests++;
        this.stats.hits++;
        this.stats.tokensSaved += tokensSaved;
        this.stats.costSaved += costSaved;
        this.updateHitRate();
    }
    /**
     * Record cache miss
     */
    recordCacheMiss() {
        if (!this.options.trackStats)
            return;
        this.stats.requests++;
        this.stats.misses++;
        this.updateHitRate();
    }
    /**
     * Update hit rate
     */
    updateHitRate() {
        if (this.stats.requests > 0) {
            this.stats.hitRate = (this.stats.hits / this.stats.requests) * 100;
        }
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            requests: 0,
            hits: 0,
            misses: 0,
            hitRate: 0,
            tokensSaved: 0,
            costSaved: 0,
        };
    }
    /**
     * Calculate potential savings from caching
     */
    calculatePotentialSavings(params) {
        const { inputTokens, cacheHitRate, provider } = params;
        // Anthropic: Cache reads are 90% cheaper
        // OpenAI: Cache reads are 50% cheaper
        const cacheDiscount = provider === 'anthropic' ? 0.9 : 0.5;
        const cachedTokens = Math.floor(inputTokens * cacheHitRate);
        const uncachedTokens = inputTokens - cachedTokens;
        // Assuming base cost of $3 per 1M tokens (Claude Sonnet)
        const costPer1M = provider === 'anthropic' ? 3.0 : 2.5;
        const cachedCostPer1M = costPer1M * (1 - cacheDiscount);
        const withoutCache = (inputTokens / 1_000_000) * costPer1M;
        const withCache = (uncachedTokens / 1_000_000) * costPer1M + (cachedTokens / 1_000_000) * cachedCostPer1M;
        const savings = withoutCache - withCache;
        const savingsPercent = withoutCache > 0 ? (savings / withoutCache) * 100 : 0;
        return {
            withoutCache,
            withCache,
            savings,
            savingsPercent,
        };
    }
}
/**
 * Create cache-aware message format for Anthropic
 */
export function createAnthropicCachedMessages(systemPrompt, conversationMessages, minCacheLength = 1024) {
    const messages = [];
    // Add system message with cache control if long enough
    if (systemPrompt) {
        const tokens = estimateTokens(systemPrompt);
        messages.push({
            role: 'system',
            content: systemPrompt,
            ...(tokens >= minCacheLength ? { cache_control: { type: 'ephemeral' } } : {}),
        });
    }
    // Add conversation messages
    // Cache the last long user message (typically contains context)
    conversationMessages.forEach((msg, index) => {
        const tokens = estimateTokens(msg.content);
        const isLastUserMessage = msg.role === 'user' && index === conversationMessages.length - 1;
        const shouldCache = isLastUserMessage && tokens >= minCacheLength;
        messages.push({
            ...msg,
            ...(shouldCache ? { cache_control: { type: 'ephemeral' } } : {}),
        });
    });
    return messages;
}
/**
 * Estimate cache savings for a conversation
 */
export function estimateCacheSavings(params) {
    const { systemPromptTokens, contextTokens, conversationsPerDay, provider } = params;
    // Assume system prompt and context are cached after first use
    const cacheableTokens = systemPromptTokens + contextTokens;
    const cacheDiscount = provider === 'anthropic' ? 0.9 : 0.5;
    // Cost per 1M tokens
    const costPer1M = provider === 'anthropic' ? 3.0 : 2.5;
    // Without cache: pay full price every time
    const costPerConversationWithout = (cacheableTokens / 1_000_000) * costPer1M;
    // With cache: pay full price once, then discounted price
    const costPerConversationWith = (cacheableTokens / 1_000_000) * costPer1M * (1 - cacheDiscount);
    const savingsPerConversation = costPerConversationWithout - costPerConversationWith;
    const dailySavings = savingsPerConversation * conversationsPerDay;
    const monthlySavings = dailySavings * 30;
    const annualSavings = dailySavings * 365;
    return {
        dailySavings,
        monthlySavings,
        annualSavings,
        details: `Saving ${(cacheDiscount * 100).toFixed(0)}% on ${cacheableTokens} tokens per conversation`,
    };
}
/**
 * Calculate optimal cache breakpoints for multi-turn conversations
 *
 * Anthropic supports up to 4 cache breakpoints, which can be strategically
 * placed to maximize cache hits across different conversation patterns.
 *
 * @example
 * ```ts
 * const breakpoints = calculateCacheBreakpoints(messages, {
 *   maxBreakpoints: 4,
 *   provider: 'anthropic'
 * })
 * // Returns optimal positions for cache markers
 * ```
 */
export function calculateCacheBreakpoints(messages, config = {}) {
    const { maxBreakpoints = 4, minTokensBetweenBreakpoints = 1024, provider = 'anthropic', } = config;
    // OpenAI doesn't support multiple breakpoints the same way
    if (provider === 'openai') {
        return calculateOpenAIBreakpoints(messages);
    }
    const breakpoints = [];
    let cumulativeTokens = 0;
    // Always include system message as first breakpoint
    const systemIndex = messages.findIndex(m => m.role === 'system');
    if (systemIndex >= 0 && messages[systemIndex]) {
        const systemTokens = estimateTokens(messages[systemIndex].content);
        if (systemTokens >= 1024) {
            breakpoints.push({
                index: systemIndex,
                cumulativeTokens: systemTokens,
                priority: 'critical',
                reason: 'System prompt (static, high reuse)',
            });
            cumulativeTokens = systemTokens;
        }
    }
    // Calculate remaining message tokens
    let lastBreakpointTokens = cumulativeTokens;
    for (let i = 0; i < messages.length; i++) {
        if (i === systemIndex)
            continue;
        const msg = messages[i];
        const msgTokens = estimateTokens(msg.content);
        cumulativeTokens += msgTokens;
        // Check if this is a good breakpoint candidate
        const tokensSinceLastBreakpoint = cumulativeTokens - lastBreakpointTokens;
        const isGoodBreakpoint = tokensSinceLastBreakpoint >= minTokensBetweenBreakpoints &&
            breakpoints.length < maxBreakpoints;
        if (isGoodBreakpoint) {
            // Prefer breaking after assistant messages (natural conversation boundary)
            if (msg.role === 'assistant') {
                breakpoints.push({
                    index: i,
                    cumulativeTokens,
                    priority: 'high',
                    reason: 'Conversation turn boundary',
                });
                lastBreakpointTokens = cumulativeTokens;
            }
            // Or after long user messages with context
            else if (msg.role === 'user' && msgTokens >= 512) {
                breakpoints.push({
                    index: i,
                    cumulativeTokens,
                    priority: 'medium',
                    reason: 'Long user context',
                });
                lastBreakpointTokens = cumulativeTokens;
            }
        }
    }
    // Ensure we have the maximum breakpoints if possible
    // Fill remaining slots with evenly distributed breakpoints
    while (breakpoints.length < maxBreakpoints) {
        const availableMessages = messages.filter((_, i) => !breakpoints.some(bp => bp.index === i));
        if (availableMessages.length === 0)
            break;
        // Find the largest gap between breakpoints
        const sortedBreakpoints = [...breakpoints].sort((a, b) => a.index - b.index);
        let largestGap = 0;
        let gapStart = 0;
        let gapEnd = messages.length - 1;
        for (let i = 0; i < sortedBreakpoints.length; i++) {
            const prev = sortedBreakpoints[i - 1]?.index ?? -1;
            const curr = sortedBreakpoints[i].index;
            if (curr - prev > largestGap) {
                largestGap = curr - prev;
                gapStart = prev + 1;
                gapEnd = curr - 1;
            }
        }
        // Add breakpoint in the middle of the gap
        if (gapEnd > gapStart) {
            const midIndex = Math.floor((gapStart + gapEnd) / 2);
            if (messages[midIndex]) {
                const midTokens = messages
                    .slice(0, midIndex + 1)
                    .reduce((sum, m) => sum + estimateTokens(m.content), 0);
                breakpoints.push({
                    index: midIndex,
                    cumulativeTokens: midTokens,
                    priority: 'low',
                    reason: 'Fill gap for coverage',
                });
            }
        }
        else {
            break;
        }
    }
    return breakpoints.sort((a, b) => a.index - b.index);
}
/**
 * Calculate breakpoints for OpenAI (simpler approach)
 */
function calculateOpenAIBreakpoints(messages) {
    const breakpoints = [];
    // OpenAI mainly caches the system message
    const systemIndex = messages.findIndex(m => m.role === 'system');
    if (systemIndex >= 0 && messages[systemIndex]) {
        const systemTokens = estimateTokens(messages[systemIndex].content);
        if (systemTokens >= 1024) {
            breakpoints.push({
                index: systemIndex,
                cumulativeTokens: systemTokens,
                priority: 'critical',
                reason: 'System prompt caching',
            });
        }
    }
    return breakpoints;
}
/**
 * Apply cache breakpoints to messages (Anthropic format)
 */
export function applyBreakpointsToMessages(messages, breakpoints) {
    const breakpointIndices = new Set(breakpoints.map(bp => bp.index));
    return messages.map((msg, index) => {
        if (breakpointIndices.has(index)) {
            return {
                ...msg,
                cache_control: { type: 'ephemeral' },
            };
        }
        return msg;
    });
}
/**
 * Create cache warming requests
 *
 * Cache warming sends minimal requests to populate the cache before
 * actual user requests arrive, ensuring cache hits from the start.
 *
 * @example
 * ```ts
 * const warmingRequests = createCacheWarmingRequests({
 *   content: [
 *     { id: 'system', content: systemPrompt, type: 'system', priority: 1 },
 *     { id: 'docs', content: documentation, type: 'document', priority: 2 },
 *   ],
 *   provider: 'anthropic'
 * })
 *
 * // Execute warming requests in parallel before user traffic
 * await Promise.all(warmingRequests.map(req => executeWarmingRequest(req)))
 * ```
 */
export function createCacheWarmingRequests(config) {
    const { content, provider } = config;
    // Sort by priority
    const sorted = [...content].sort((a, b) => a.priority - b.priority);
    return sorted.map(item => {
        const tokens = estimateTokens(item.content);
        // Create minimal request that will populate the cache
        const messages = [];
        if (item.type === 'system') {
            messages.push({
                role: 'system',
                content: item.content,
                ...(provider === 'anthropic' ? { cache_control: { type: 'ephemeral' } } : {}),
            });
            // Add minimal user message to complete the request
            messages.push({
                role: 'user',
                content: 'Confirm cache ready.',
            });
        }
        else {
            // For context/documents, include as user message
            messages.push({
                role: 'user',
                content: `[Cache warming] ${item.content}`,
                ...(provider === 'anthropic' ? { cache_control: { type: 'ephemeral' } } : {}),
            });
        }
        return {
            messages,
            isWarmingRequest: true,
            contentId: item.id,
            estimatedTokens: tokens,
        };
    });
}
/**
 * Calculate optimal warming schedule
 *
 * Returns a schedule that spreads cache warming requests to avoid
 * overwhelming the API while ensuring caches are populated.
 */
export function calculateWarmingSchedule(warmingRequests, config = {}) {
    const { maxConcurrent = 3, delayBetweenBatches = 1000, cacheTTL = 5 * 60 * 1000, // 5 minutes default
    refreshMargin = 30 * 1000, // Refresh 30s before expiry
     } = config;
    const schedule = [];
    let currentTime = 0;
    for (let i = 0; i < warmingRequests.length; i += maxConcurrent) {
        const batch = warmingRequests
            .slice(i, i + maxConcurrent)
            .map(r => r.contentId);
        schedule.push({
            batch,
            executeAt: currentTime,
            refreshAt: currentTime + cacheTTL - refreshMargin,
        });
        currentTime += delayBetweenBatches;
    }
    return schedule;
}
export function calculateTTLRefreshSchedule(lastCacheHit, config = {}) {
    const { baseTTL = 5 * 60 * 1000, // 5 minutes
    refreshBefore = 30 * 1000, // 30 seconds
    maxExtension = 30 * 60 * 1000, // 30 minutes max
     } = config;
    const now = Date.now();
    const expiresAt = lastCacheHit + baseTTL;
    const timeRemaining = expiresAt - now;
    const refreshAt = expiresAt - refreshBefore;
    // Check if we've exceeded max extension
    const shouldRefresh = timeRemaining <= refreshBefore && timeRemaining > 0;
    return {
        shouldRefresh,
        refreshAt,
        expiresAt,
        timeRemaining: Math.max(0, timeRemaining),
    };
}
//# sourceMappingURL=cache-manager.js.map