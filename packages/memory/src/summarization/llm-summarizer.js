/**
 * Enhanced LLM-Based Summarization
 *
 * Provides sophisticated summarization capabilities using LLMs for
 * conversation compression with 80-90% token reduction while maintaining
 * quality. Implements progressive and hierarchical summarization strategies.
 *
 * Key features:
 * - Provider-agnostic (OpenAI, Anthropic, custom)
 * - Multiple summary styles (bullet, narrative, structured)
 * - Progressive summarization for long conversations
 * - Hierarchical multi-level summaries
 * - Summary caching with TTL
 * - Graceful fallback when LLM unavailable
 *
 * @module summarization/llm-summarizer
 */
import { estimateTokens } from '../utils/core';
/**
 * Hash content for cache key using multiple samples to reduce collisions
 * Samples from start, middle, and end of content
 */
function hashContent(content) {
    if (!content)
        return 'sum_0_empty';
    let hash = 0;
    const len = content.length;
    // Sample from multiple positions to reduce collisions for long docs
    const sampleSize = Math.min(500, len);
    const positions = [
        0, // Start
        Math.floor(len / 2), // Middle
        Math.max(0, len - sampleSize), // End
    ];
    for (const start of positions) {
        const end = Math.min(start + sampleSize, len);
        for (let i = start; i < end; i++) {
            const char = content.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
    }
    return `sum_${len}_${Math.abs(hash).toString(36)}`;
}
// Note: estimateTokens is imported from '../utils/core'
// for consistent token estimation across the codebase
/**
 * Maximum cache entries before eviction
 */
const MAX_CACHE_ENTRIES = 500;
/**
 * Retry configuration
 */
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    /** HTTP status codes that should trigger retry */
    retryableStatuses: [429, 500, 502, 503, 504],
};
/**
 * Simple rate limiter using token bucket algorithm
 */
class RateLimiter {
    tokens;
    lastRefill;
    maxTokens;
    refillRatePerSecond;
    constructor(requestsPerMinute = 60) {
        this.maxTokens = requestsPerMinute;
        this.tokens = requestsPerMinute;
        this.refillRatePerSecond = requestsPerMinute / 60;
        this.lastRefill = Date.now();
    }
    async acquire() {
        this.refill();
        if (this.tokens < 1) {
            // Wait until we have a token
            const waitTime = Math.ceil(((1 - this.tokens) / this.refillRatePerSecond) * 1000);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            this.refill();
        }
        this.tokens -= 1;
    }
    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRatePerSecond);
        this.lastRefill = now;
    }
}
/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Calculate exponential backoff delay with jitter
 */
function getRetryDelay(attempt) {
    const exponentialDelay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
    return Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelayMs);
}
/**
 * Check if an error is retryable
 */
function isRetryableError(error, status) {
    if (status && RETRY_CONFIG.retryableStatuses.includes(status)) {
        return true;
    }
    // Network errors are retryable
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return true;
    }
    // Check for specific error messages
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    return (message.includes('timeout') ||
        message.includes('network') ||
        message.includes('econnreset') ||
        message.includes('socket hang up'));
}
/**
 * Default model selection by provider
 */
const DEFAULT_MODELS = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-5-haiku-20241022',
    custom: 'default',
};
/**
 * Prompts for different summary styles
 */
const SUMMARY_PROMPTS = {
    bullet: `Summarize the following content as bullet points:
- Extract the most important information
- Use concise, clear language
- Maximum {maxTokens} tokens

Content:
{content}`,
    narrative: `Write a concise narrative summary of the following content:
- Maintain flow and context
- Preserve key details
- Maximum {maxTokens} tokens

Content:
{content}`,
    structured: `Provide a structured summary of the following content:

## Key Points
[List main points]

## Details
[Important supporting details]

## Conclusions
[Any conclusions or outcomes]

Maximum {maxTokens} tokens.

Content:
{content}`,
    minimal: `Summarize in one paragraph (max {maxTokens} tokens):

{content}`,
};
/**
 * Conversation summarization prompt
 */
const CONVERSATION_SUMMARY_PROMPT = `Summarize this conversation concisely. Extract:
1. Main topics discussed
2. Key decisions or conclusions
3. Outstanding questions or action items
4. Important facts mentioned

Format as JSON:
{
  "topics": ["topic1", "topic2"],
  "decisions": ["decision1"],
  "openQuestions": ["question1"],
  "actionItems": ["action1"],
  "keyFacts": ["fact1"],
  "narrative": "Brief narrative summary..."
}

Conversation:
{content}

Maximum {maxTokens} tokens total.`;
/**
 * Enhanced LLM Summarizer
 *
 * @example
 * ```ts
 * const summarizer = new LLMSummarizer({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'gpt-4o-mini',
 *   summaryStyle: 'structured',
 * })
 *
 * // Simple summarization
 * const result = await summarizer.summarize(longText, 200)
 *
 * // Conversation summarization
 * const convSummary = await summarizer.summarizeConversation(messages)
 *
 * // Hierarchical summarization
 * const hierarchical = await summarizer.hierarchicalSummarize(content, 3)
 * ```
 */
export class LLMSummarizer {
    config;
    cache = new Map();
    cacheTTL = 3600000; // 1 hour
    rateLimiter;
    stats = {
        summariesGenerated: 0,
        cacheHits: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalSavings: 0,
        retryCount: 0,
        rateLimitWaits: 0,
    };
    constructor(config) {
        // Validate provider-specific requirements
        if (config.provider === 'openai' && !config.apiKey) {
            throw new Error('API key is required for openai provider');
        }
        if (config.provider === 'anthropic' && !config.apiKey) {
            throw new Error('API key is required for anthropic provider');
        }
        if (config.provider === 'custom' && !config.customHandler) {
            throw new Error('customHandler is required for custom provider');
        }
        this.config = {
            provider: config.provider,
            model: config.model ?? DEFAULT_MODELS[config.provider],
            maxSummaryTokens: config.maxSummaryTokens ?? 200,
            preserveKeyFacts: config.preserveKeyFacts ?? true,
            summaryStyle: config.summaryStyle ?? 'structured',
            apiKey: config.apiKey ?? '',
            apiEndpoint: config.apiEndpoint ?? '',
            customHandler: config.customHandler ?? (async () => ''),
            temperature: config.temperature ?? 0.3,
        };
        // Initialize rate limiter (60 requests/min default, adjust per provider limits)
        this.rateLimiter = new RateLimiter(60);
    }
    /**
     * Summarize text
     */
    async summarize(text, maxTokens) {
        const targetTokens = maxTokens ?? this.config.maxSummaryTokens;
        const result = await this.summarizeWithStats(text, targetTokens);
        return result.summary;
    }
    /**
     * Summarize with full statistics
     */
    async summarizeWithStats(text, maxTokens) {
        // Input validation
        if (!text || text.trim().length === 0) {
            throw new Error('Cannot summarize empty text');
        }
        if (!maxTokens || maxTokens <= 0 || Number.isNaN(maxTokens)) {
            throw new Error('maxTokens must be a positive number');
        }
        const startTime = Date.now();
        const originalTokens = estimateTokens(text);
        // Check cache
        const cacheKey = hashContent(text);
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            this.stats.cacheHits++;
            return {
                summary: cached.summary,
                originalTokens,
                summaryTokens: estimateTokens(cached.summary),
                compressionRatio: estimateTokens(cached.summary) / originalTokens,
                generationTime: 0,
                model: this.config.model,
                cached: true,
            };
        }
        // Generate prompt
        const prompt = SUMMARY_PROMPTS[this.config.summaryStyle]
            .replace('{maxTokens}', String(maxTokens))
            .replace('{content}', text);
        // Call LLM
        const summary = await this.callLLM(prompt, maxTokens);
        const summaryTokens = estimateTokens(summary);
        // Update cache with size limit
        if (this.cache.size >= MAX_CACHE_ENTRIES) {
            // Evict oldest entry
            let oldestKey = null;
            let oldestTime = Infinity;
            for (const [key, entry] of this.cache) {
                if (entry.timestamp < oldestTime) {
                    oldestTime = entry.timestamp;
                    oldestKey = key;
                }
            }
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(cacheKey, {
            summary,
            timestamp: Date.now(),
            hash: cacheKey,
        });
        // Update stats
        this.stats.summariesGenerated++;
        this.stats.totalInputTokens += originalTokens;
        this.stats.totalOutputTokens += summaryTokens;
        this.stats.totalSavings += originalTokens - summaryTokens;
        return {
            summary,
            originalTokens,
            summaryTokens,
            compressionRatio: summaryTokens / originalTokens,
            generationTime: Date.now() - startTime,
            model: this.config.model,
            cached: false,
        };
    }
    /**
     * Batch summarize
     */
    async summarizeBatch(texts, maxTokens) {
        return Promise.all(texts.map((text) => this.summarize(text, maxTokens)));
    }
    /**
     * Summarize conversation with structured output
     */
    async summarizeConversation(messages) {
        // Validate input
        if (!messages || messages.length === 0) {
            throw new Error('Cannot summarize empty conversation');
        }
        const originalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
        // Format conversation
        const content = messages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n\n');
        // Generate prompt
        const maxTokens = Math.max(200, Math.floor(originalTokens * 0.2));
        const prompt = CONVERSATION_SUMMARY_PROMPT.replace('{content}', content).replace('{maxTokens}', String(maxTokens));
        // Call LLM
        const response = await this.callLLM(prompt, maxTokens);
        // Parse JSON response
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
            const summaryTokens = estimateTokens(response);
            return {
                topics: parsed.topics ?? [],
                decisions: parsed.decisions ?? [],
                openQuestions: parsed.openQuestions ?? [],
                actionItems: parsed.actionItems ?? [],
                keyFacts: parsed.keyFacts ?? [],
                narrative: parsed.narrative ?? response,
                messageCount: messages.length,
                stats: {
                    originalTokens,
                    summaryTokens,
                    compressionRatio: originalTokens > 0 ? summaryTokens / originalTokens : 0,
                },
            };
        }
        catch {
            // Fallback to narrative summary
            const responseTokens = estimateTokens(response);
            return {
                topics: [],
                decisions: [],
                openQuestions: [],
                actionItems: [],
                keyFacts: [],
                narrative: response,
                messageCount: messages.length,
                stats: {
                    originalTokens,
                    summaryTokens: responseTokens,
                    compressionRatio: originalTokens > 0 ? responseTokens / originalTokens : 0,
                },
            };
        }
    }
    /**
     * Progressive summarization for long conversations
     *
     * When conversation exceeds threshold:
     * 1. Summarize oldest messages
     * 2. Keep recent messages verbatim
     * 3. Combine into optimized context
     */
    async progressiveSummarize(messages, options = {}) {
        // Validate input
        if (!messages || messages.length === 0) {
            throw new Error('Cannot progressively summarize empty conversation');
        }
        const { summarizeThreshold = 20, keepRecentCount = 10,
        // maxSummaryTokens = 500, // Commented out as unused
         } = options;
        const originalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
        // If under threshold or keepRecentCount >= messages.length, no summarization needed
        if (messages.length <= summarizeThreshold) {
            return {
                summarizedPortion: '',
                recentMessages: messages,
                stats: {
                    originalMessages: messages.length,
                    summarizedMessages: 0,
                    originalTokens,
                    finalTokens: originalTokens,
                    compressionRatio: 1,
                },
            };
        }
        // Split messages
        const toSummarize = messages.slice(0, -keepRecentCount);
        const recentMessages = messages.slice(-keepRecentCount);
        // If nothing to summarize (keepRecentCount >= messages.length), return all as recent
        if (toSummarize.length === 0) {
            return {
                summarizedPortion: '',
                recentMessages: messages,
                stats: {
                    originalMessages: messages.length,
                    summarizedMessages: 0,
                    originalTokens,
                    finalTokens: originalTokens,
                    compressionRatio: 1,
                },
            };
        }
        // Summarize older messages
        const summary = await this.summarizeConversation(toSummarize);
        const summarizedPortion = `[Earlier conversation summary]\n${summary.narrative}\n\nKey topics: ${summary.topics.join(', ')}\n${summary.actionItems.length > 0 ? `\nAction items: ${summary.actionItems.join('; ')}` : ''}`;
        const finalTokens = estimateTokens(summarizedPortion) +
            recentMessages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
        return {
            summarizedPortion,
            recentMessages,
            stats: {
                originalMessages: messages.length,
                summarizedMessages: toSummarize.length,
                originalTokens,
                finalTokens,
                compressionRatio: originalTokens > 0 ? finalTokens / originalTokens : 1,
            },
        };
    }
    /**
     * Hierarchical multi-level summarization
     *
     * Creates summaries at multiple levels of detail:
     * - Executive: Ultra-brief overview
     * - Sections: Topic-by-topic breakdown
     * - Detailed: Full summary with context
     */
    async hierarchicalSummarize(content, _levels = 3 // Prefixed with underscore as unused
    ) {
        // Validate input
        if (!content || content.trim().length === 0) {
            throw new Error('Cannot create hierarchical summary of empty content');
        }
        const originalTokens = estimateTokens(content);
        if (originalTokens < 50) {
            throw new Error('Content too short for hierarchical summarization');
        }
        // Level 1: Detailed summary (20% of original)
        const detailedTokens = Math.floor(originalTokens * 0.2);
        const detailed = await this.summarize(content, detailedTokens);
        // Level 2: Section summaries (10% of original)
        const sectionsTokens = Math.floor(originalTokens * 0.1);
        const sectionsPrompt = `Break down this content into 3-5 key sections, each with a title and brief summary:

${content}

Format:
## Section Title
Brief summary

Maximum ${sectionsTokens} tokens total.`;
        const sectionsResponse = await this.callLLM(sectionsPrompt, sectionsTokens);
        // Parse sections
        const sectionMatches = sectionsResponse.matchAll(/##\s*(.+?)\n([\s\S]*?)(?=##|$)/g);
        const sections = Array.from(sectionMatches).map((match) => ({
            title: match[1].trim(),
            summary: match[2].trim(),
            details: match[2]
                .split('\n')
                .filter((l) => l.trim().startsWith('-'))
                .map((l) => l.trim()),
        }));
        // Level 3: Executive summary (5% of original)
        const executiveTokens = Math.max(50, Math.floor(originalTokens * 0.05));
        const executive = await this.summarize(detailed, executiveTokens);
        return {
            executive,
            sections: sections.length > 0
                ? sections
                : [
                    {
                        title: 'Summary',
                        summary: detailed,
                        details: [],
                    },
                ],
            detailed,
            compressionRatios: {
                executive: estimateTokens(executive) / originalTokens,
                sections: estimateTokens(sectionsResponse) / originalTokens,
                detailed: estimateTokens(detailed) / originalTokens,
            },
        };
    }
    /**
     * Get summarization statistics
     */
    getStats() {
        const totalOps = this.stats.summariesGenerated + this.stats.cacheHits;
        return {
            ...this.stats,
            avgCompressionRatio: this.stats.totalInputTokens > 0
                ? this.stats.totalOutputTokens / this.stats.totalInputTokens
                : 0,
            cacheHitRate: totalOps > 0 ? this.stats.cacheHits / totalOps : 0,
        };
    }
    /**
     * Clear summary cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Set cache TTL
     */
    setCacheTTL(ttlMs) {
        if (!ttlMs || ttlMs <= 0) {
            throw new Error('Cache TTL must be a positive number');
        }
        this.cacheTTL = ttlMs;
    }
    /**
     * Call LLM provider with rate limiting
     */
    async callLLM(prompt, maxTokens) {
        // Apply rate limiting
        const startWait = Date.now();
        await this.rateLimiter.acquire();
        if (Date.now() - startWait > 100) {
            this.stats.rateLimitWaits++;
        }
        switch (this.config.provider) {
            case 'openai':
                return this.callWithRetry(() => this.callOpenAI(prompt, maxTokens));
            case 'anthropic':
                return this.callWithRetry(() => this.callAnthropic(prompt, maxTokens));
            case 'custom':
                return this.config.customHandler(prompt, { maxTokens });
            default:
                throw new Error(`Unknown provider: ${this.config.provider}`);
        }
    }
    /**
     * Execute API call with retry logic
     */
    async callWithRetry(fn, attempt = 0) {
        try {
            return await fn();
        }
        catch (error) {
            // Extract status code if available
            const status = error.status;
            if (attempt < RETRY_CONFIG.maxRetries &&
                isRetryableError(error, status)) {
                this.stats.retryCount++;
                const delay = getRetryDelay(attempt);
                await sleep(delay);
                return this.callWithRetry(fn, attempt + 1);
            }
            throw error;
        }
    }
    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt, maxTokens) {
        const endpoint = this.config.apiEndpoint || 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: Math.floor(maxTokens * 1.2),
                temperature: this.config.temperature,
            }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const err = new Error(`OpenAI summarization failed: ${JSON.stringify(error)}`);
            err.status = response.status;
            throw err;
        }
        const data = await response.json();
        return data.choices?.[0]?.message?.content ?? '';
    }
    /**
     * Call Anthropic API
     */
    async callAnthropic(prompt, maxTokens) {
        const endpoint = this.config.apiEndpoint || 'https://api.anthropic.com/v1/messages';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: this.config.model,
                max_tokens: Math.floor(maxTokens * 1.2),
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const err = new Error(`Anthropic summarization failed: ${JSON.stringify(error)}`);
            err.status = response.status;
            throw err;
        }
        const data = await response.json();
        return data.content?.[0]?.text ?? '';
    }
}
/**
 * Create a summarizer with fallback to extractive summarization
 */
export function createSummarizerWithFallback(config) {
    let llmAvailable = true;
    let summarizer = null;
    if (config.apiKey && config.provider) {
        try {
            summarizer = new LLMSummarizer(config);
        }
        catch {
            llmAvailable = false;
        }
    }
    else {
        llmAvailable = false;
    }
    return {
        summarize: async (text, maxTokens) => {
            // Try LLM summarization
            if (llmAvailable && summarizer) {
                try {
                    return await summarizer.summarize(text, maxTokens);
                }
                catch (error) {
                    // Re-throw validation errors - these shouldn't trigger fallback
                    if (error instanceof Error) {
                        const message = error.message;
                        if (message.includes('Cannot summarize empty text') ||
                            message.includes('maxTokens must be a positive number')) {
                            throw error;
                        }
                    }
                    // Network/API errors mark LLM as unavailable
                    llmAvailable = false;
                }
            }
            // Fallback to extractive summarization
            return extractiveSummarize(text, maxTokens);
        },
        isLLMAvailable: () => llmAvailable,
    };
}
/**
 * Simple extractive summarization fallback
 */
export function extractiveSummarize(text, maxTokens) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length === 0)
        return text;
    // Score sentences by importance
    const scored = sentences.map((sentence) => {
        let score = 0;
        // Position scoring (first and last sentences more important)
        const index = sentences.indexOf(sentence);
        if (index === 0)
            score += 3;
        if (index === sentences.length - 1)
            score += 2;
        // Length scoring (medium length preferred)
        const words = sentence.split(/\s+/).length;
        if (words >= 5 && words <= 20)
            score += 2;
        // Keyword scoring
        const keywords = [
            'important',
            'key',
            'main',
            'conclusion',
            'summary',
            'result',
        ];
        if (keywords.some((k) => sentence.toLowerCase().includes(k)))
            score += 2;
        // Question avoidance
        if (sentence.includes('?'))
            score -= 1;
        return { sentence, score };
    });
    // Sort by score and select top sentences
    scored.sort((a, b) => b.score - a.score);
    // Select sentences until token budget is exhausted
    const selected = [];
    let totalTokens = 0;
    const maxChars = maxTokens * 4;
    for (const { sentence } of scored) {
        const sentenceTokens = estimateTokens(sentence);
        if (totalTokens + sentenceTokens > maxTokens)
            break;
        if (selected.join('. ').length + sentence.length > maxChars)
            break;
        selected.push(sentence.trim());
        totalTokens += sentenceTokens;
    }
    // Restore original order
    selected.sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));
    return selected.join('. ') + '.';
}
//# sourceMappingURL=llm-summarizer.js.map