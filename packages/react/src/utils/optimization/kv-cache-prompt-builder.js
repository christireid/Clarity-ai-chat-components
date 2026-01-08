/**
 * KV Cache-Aligned Prompt Builder
 *
 * Enforces optimal prompt structure for Key-Value cache reuse on LLM servers.
 * By placing static content (system prompts, rules) at the beginning,
 * the server can cache these tokens and reuse them across requests.
 *
 * Assembly Order (STRICT):
 * 1. System Instructions (static, cacheable prefix)
 * 2. Static Context Documents (cacheable)
 * 3. RAG Results (dynamic)
 * 4. Conversation History (dynamic, trimmed oldest-first)
 * 5. Current User Query (always last, must-have)
 *
 * @module utils/kv-cache-prompt-builder
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Error thrown when must-have content exceeds budget
 */
export class PromptBudgetExceededError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'PromptBudgetExceededError';
    }
}
/**
 * Segment type ordering (lower = earlier in prompt)
 */
const SEGMENT_ORDER = {
    system: 0,
    'static-context': 1,
    rag: 2,
    history: 3,
    user: 4,
};
/**
 * Priority ordering for trimming (higher = trim first)
 */
const PRIORITY_TRIM_ORDER = {
    'must-have': 0, // Never trim
    high: 1,
    normal: 2,
    low: 3, // Trim first
};
/**
 * Calculate tokens for a segment
 */
function getSegmentTokens(segment, model) {
    if (segment.tokenCount !== undefined) {
        return segment.tokenCount;
    }
    return estimateTokens(segment.content, model);
}
/**
 * Sort segments by type order and priority
 */
function sortSegmentsByOrder(segments) {
    return [...segments].sort((a, b) => {
        const orderDiff = SEGMENT_ORDER[a.type] - SEGMENT_ORDER[b.type];
        if (orderDiff !== 0)
            return orderDiff;
        // Within same type, sort by priority (must-have first)
        return PRIORITY_TRIM_ORDER[a.priority] - PRIORITY_TRIM_ORDER[b.priority];
    });
}
/**
 * Get trimmable segments sorted by trim priority
 */
function getTrimmableSegments(segments) {
    return segments
        .filter((s) => s.priority !== 'must-have')
        .sort((a, b) => {
        // First by priority (low priority first for trimming)
        const priorityDiff = PRIORITY_TRIM_ORDER[b.priority] - PRIORITY_TRIM_ORDER[a.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by type (history before RAG before static)
        return SEGMENT_ORDER[b.type] - SEGMENT_ORDER[a.type];
    });
}
/**
 * Build a KV cache-optimized prompt from segments
 *
 * Enforces strict ordering to maximize server-side KV cache hits:
 * 1. System instructions (cacheable prefix)
 * 2. Static context (cacheable)
 * 3. RAG results (dynamic)
 * 4. History (dynamic, trimmed oldest-first)
 * 5. User query (always last)
 *
 * @param segments - Array of prompt segments
 * @param config - Builder configuration
 * @returns Built prompt with messages and metadata
 * @throws PromptBudgetExceededError if must-have content exceeds budget
 *
 * @example
 * ```ts
 * const result = buildKVCacheOptimizedPrompt([
 *   { id: 'sys', type: 'system', content: 'You are helpful', priority: 'must-have' },
 *   { id: 'ctx', type: 'static-context', content: 'Background info...', priority: 'high' },
 *   { id: 'h1', type: 'history', content: 'Previous exchange', priority: 'normal' },
 *   { id: 'user', type: 'user', content: 'Current question?', priority: 'must-have' },
 * ], {
 *   maxInputTokens: 8000,
 *   reservedForOutput: 2000,
 * })
 *
 * console.log(result.messages) // Formatted for API
 * console.log(result.kvCacheablePrefix) // Tokens in cacheable prefix
 * ```
 */
export function buildKVCacheOptimizedPrompt(segments, config) {
    const { maxInputTokens, reservedForOutput, model, strictOrdering = true, minHistoryTokens = 0, } = config;
    // Input validation
    if (maxInputTokens <= 0) {
        throw new Error('maxInputTokens must be positive');
    }
    if (reservedForOutput < 0) {
        throw new Error('reservedForOutput cannot be negative');
    }
    if (reservedForOutput >= maxInputTokens) {
        throw new Error('reservedForOutput must be less than maxInputTokens');
    }
    if (segments.length === 0) {
        throw new Error('segments array cannot be empty');
    }
    const effectiveBudget = maxInputTokens - reservedForOutput;
    // Calculate tokens for all segments
    const segmentsWithTokens = segments.map((segment) => ({
        ...segment,
        tokenCount: getSegmentTokens(segment, model),
    }));
    // Separate must-have and optional segments
    const mustHaveSegments = segmentsWithTokens.filter((s) => s.priority === 'must-have');
    const optionalSegments = segmentsWithTokens.filter((s) => s.priority !== 'must-have');
    // Calculate must-have token total
    const mustHaveTokens = mustHaveSegments.reduce((sum, s) => sum + s.tokenCount, 0);
    const TOKENS_PER_MESSAGE = 4; // Overhead per message
    const mustHaveOverhead = mustHaveSegments.length * TOKENS_PER_MESSAGE + 2; // +2 for priming
    // Validate must-have content fits
    if (mustHaveTokens + mustHaveOverhead > effectiveBudget) {
        const systemTokens = mustHaveSegments
            .filter((s) => s.type === 'system')
            .reduce((sum, s) => sum + s.tokenCount, 0);
        const userTokens = mustHaveSegments
            .filter((s) => s.type === 'user')
            .reduce((sum, s) => sum + s.tokenCount, 0);
        const breakdown = {};
        for (const segment of mustHaveSegments) {
            breakdown[segment.id] = segment.tokenCount;
        }
        throw new PromptBudgetExceededError(`Must-have content (${mustHaveTokens + mustHaveOverhead} tokens) exceeds available budget (${effectiveBudget} tokens). ` +
            `System: ${systemTokens}, User: ${userTokens}. ` +
            `Consider reducing system prompt or splitting the request.`, {
            mustHaveTokens: mustHaveTokens + mustHaveOverhead,
            availableBudget: effectiveBudget,
            systemTokens,
            userTokens,
            breakdown,
        });
    }
    // Calculate remaining budget for optional content
    let remainingBudget = effectiveBudget - mustHaveTokens - mustHaveOverhead;
    const trimmedSegments = [];
    // Sort optional segments by trim priority (what to keep vs trim)
    const sortedOptional = getTrimmableSegments(optionalSegments);
    // Separate history segments to enforce minHistoryTokens
    const historySegments = sortedOptional.filter((s) => s.type === 'history');
    const nonHistoryOptional = sortedOptional.filter((s) => s.type !== 'history');
    // Greedily include optional segments that fit
    const includedOptional = [];
    let includedHistoryTokens = 0;
    // First pass: add non-history segments (highest priority first)
    for (const segment of nonHistoryOptional.reverse()) {
        const segmentCost = segment.tokenCount + TOKENS_PER_MESSAGE;
        if (segmentCost <= remainingBudget) {
            includedOptional.push(segment);
            remainingBudget -= segmentCost;
        }
        else {
            trimmedSegments.push({
                id: segment.id,
                type: segment.type,
                preview: segment.content.substring(0, 50) +
                    (segment.content.length > 50 ? '...' : ''),
                tokensRemoved: segment.tokenCount,
                reason: 'budget',
            });
        }
    }
    // Second pass: add history segments, respecting minHistoryTokens if possible
    // Sort history by priority (highest first, then most recent)
    const sortedHistory = [...historySegments].reverse();
    for (const segment of sortedHistory) {
        const segmentCost = segment.tokenCount + TOKENS_PER_MESSAGE;
        if (segmentCost <= remainingBudget) {
            includedOptional.push(segment);
            remainingBudget -= segmentCost;
            includedHistoryTokens += segment.tokenCount;
        }
        else {
            trimmedSegments.push({
                id: segment.id,
                type: segment.type,
                preview: segment.content.substring(0, 50) +
                    (segment.content.length > 50 ? '...' : ''),
                tokensRemoved: segment.tokenCount,
                reason: 'budget',
            });
        }
    }
    // Check if minHistoryTokens requirement was met
    const minHistoryTokensMet = minHistoryTokens === 0 || includedHistoryTokens >= minHistoryTokens;
    // Combine and sort all included segments
    const allIncluded = [...mustHaveSegments, ...includedOptional];
    const orderedSegments = strictOrdering
        ? sortSegmentsByOrder(allIncluded)
        : allIncluded;
    // Build messages array
    const messages = [];
    const tokenBreakdown = {
        system: 0,
        'static-context': 0,
        rag: 0,
        history: 0,
        user: 0,
    };
    let kvCacheablePrefix = 0;
    let totalTokens = 0;
    for (const segment of orderedSegments) {
        const role = segment.role ?? (segment.type === 'system' ? 'system' : 'user');
        messages.push({
            role,
            content: segment.content,
        });
        tokenBreakdown[segment.type] += segment.tokenCount;
        totalTokens += segment.tokenCount + TOKENS_PER_MESSAGE;
        // Count cacheable prefix (system + static-context)
        if (segment.type === 'system' || segment.type === 'static-context') {
            kvCacheablePrefix += segment.tokenCount + TOKENS_PER_MESSAGE;
        }
    }
    // Add priming tokens
    totalTokens += 2;
    return {
        messages,
        tokenCount: totalTokens,
        trimmedSegments,
        kvCacheablePrefix,
        tokenBreakdown,
        availableForOutput: maxInputTokens - totalTokens,
        budgetWarning: remainingBudget < 100, // Warn if very tight
        historyTokensIncluded: includedHistoryTokens,
        minHistoryTokensMet,
    };
}
/**
 * Create a segment helper
 */
export function createSegment(id, type, content, priority = 'normal', options) {
    return {
        id,
        type,
        content,
        priority,
        ...options,
    };
}
/**
 * Create common segment types with appropriate defaults
 */
export const createSystemSegment = (id, content, priority = 'must-have') => createSegment(id, 'system', content, priority, { role: 'system' });
export const createContextSegment = (id, content, priority = 'high') => createSegment(id, 'static-context', content, priority);
export const createRAGSegment = (id, content, priority = 'normal') => createSegment(id, 'rag', content, priority);
export const createHistorySegment = (id, content, role, priority = 'low') => createSegment(id, 'history', content, priority, { role });
export const createUserSegment = (id, content) => createSegment(id, 'user', content, 'must-have', { role: 'user' });
/**
 * Convert a conversation history array to segments
 */
export function conversationToSegments(messages, options) {
    const { idPrefix = 'history', priority = 'low', recentHighPriority = 2, } = options ?? {};
    return messages.map((msg, index) => {
        const isRecent = index >= messages.length - recentHighPriority;
        return createHistorySegment(`${idPrefix}-${index}`, msg.content, msg.role, isRecent ? 'normal' : priority);
    });
}
/**
 * Validate segments before building
 */
export function validateSegments(segments) {
    const errors = [];
    const warnings = [];
    // Check for required segments
    const hasSystem = segments.some((s) => s.type === 'system');
    const hasUser = segments.some((s) => s.type === 'user');
    if (!hasUser) {
        errors.push('Missing user segment - at least one user message is required');
    }
    if (!hasSystem) {
        warnings.push('No system segment - consider adding system instructions');
    }
    // Check for must-have user segment
    const userSegments = segments.filter((s) => s.type === 'user');
    const hasMustHaveUser = userSegments.some((s) => s.priority === 'must-have');
    if (!hasMustHaveUser && userSegments.length > 0) {
        warnings.push('User segment is not marked as must-have - it may be trimmed');
    }
    // Check for duplicate IDs
    const ids = segments.map((s) => s.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        errors.push(`Duplicate segment IDs: ${[...new Set(duplicateIds)].join(', ')}`);
    }
    // Check for empty content
    const emptySegments = segments.filter((s) => !s.content || s.content.trim() === '');
    if (emptySegments.length > 0) {
        warnings.push(`Empty segments: ${emptySegments.map((s) => s.id).join(', ')}`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Estimate token savings from KV caching
 */
export function estimateKVCacheSavings(builtPrompt, requestCount = 10) {
    const cacheableTokens = builtPrompt.kvCacheablePrefix;
    const dynamicTokens = builtPrompt.tokenCount - cacheableTokens;
    // Without caching: every request sends full prompt
    const uncachedTotal = builtPrompt.tokenCount * requestCount;
    // With caching: first request full, subsequent only dynamic
    // (In practice, cache reads are billed at 10% for Anthropic, 50% for OpenAI)
    const cachedTotal = builtPrompt.tokenCount + dynamicTokens * (requestCount - 1);
    const tokensSaved = uncachedTotal - cachedTotal;
    const savingsPercent = uncachedTotal > 0 ? (tokensSaved / uncachedTotal) * 100 : 0;
    return {
        cacheableTokens,
        uncachedTotal,
        cachedTotal,
        tokensSaved,
        savingsPercent,
    };
}
//# sourceMappingURL=kv-cache-prompt-builder.js.map