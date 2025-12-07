/**
 * Accurate Token Counting
 *
 * Provides accurate token counting for various LLM models.
 * Uses js-tiktoken when available, falls back to estimation.
 */
/**
 * Token counter cache for performance
 */
class TokenCountCache {
    cache = new Map();
    maxSize = 1000;
    get(key) {
        return this.cache.get(key);
    }
    set(key, count) {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry (first item)
            const firstKey = this.cache.keys().next().value;
            if (firstKey)
                this.cache.delete(firstKey);
        }
        this.cache.set(key, count);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
const tokenCache = new TokenCountCache();
/**
 * Model-specific tokenization configurations
 */
const MODEL_CONFIGS = {
    // OpenAI GPT-4 Family
    'gpt-4': { encoding: 'cl100k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4-turbo': { encoding: 'cl100k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4o': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4o-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4.1': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4.1-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-4.1-nano': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'gpt-3.5-turbo': { encoding: 'cl100k_base', charsPerToken: 4, provider: 'openai' },
    // OpenAI O1/O3 Reasoning Models
    'o1': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'o1-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'o1-preview': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    'o3-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
    // Anthropic Claude 3 Family
    'claude-3-opus': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    'claude-3-sonnet': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    'claude-3-haiku': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    'claude-3-5-sonnet': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    'claude-3-5-haiku': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    // Anthropic Claude 4 Family
    'claude-sonnet-4': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    'claude-opus-4': { encoding: 'claude', charsPerToken: 3.8, provider: 'anthropic' },
    // Google Gemini Family
    'gemini-pro': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
    'gemini-1.5-pro': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
    'gemini-1.5-flash': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
    'gemini-2.0-flash': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
    'gemini-2.0-pro': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
    // DeepSeek Models
    'deepseek-chat': { encoding: 'deepseek', charsPerToken: 4, provider: 'deepseek' },
    'deepseek-coder': { encoding: 'deepseek', charsPerToken: 4, provider: 'deepseek' },
    'deepseek-r1': { encoding: 'deepseek', charsPerToken: 4, provider: 'deepseek' },
    // Llama Models
    'llama-3': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
    'llama-3.1': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
    'llama-3.2': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
    'llama-3.3': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
    // Mistral Models
    'mistral-large': { encoding: 'mistral', charsPerToken: 4, provider: 'mistral' },
    'mistral-medium': { encoding: 'mistral', charsPerToken: 4, provider: 'mistral' },
    'mistral-small': { encoding: 'mistral', charsPerToken: 4, provider: 'mistral' },
};
/**
 * Count tokens accurately (uses tiktoken if available)
 *
 * @example
 * ```ts
 * const count = await countTokens("Hello, world!", { model: 'gpt-4' })
 * console.log(count.total) // 4
 * console.log(count.method) // 'accurate' or 'estimated'
 * ```
 */
export async function countTokens(text, options = {}) {
    const { model = 'gpt-4', cache = true, preferAccurate = true } = options;
    // Check cache
    if (cache) {
        const cacheKey = `${model}:${text}`;
        const cached = tokenCache.get(cacheKey);
        if (cached !== undefined) {
            return {
                total: cached,
                model,
                method: 'accurate',
            };
        }
    }
    const config = MODEL_CONFIGS[model];
    if (!config) {
        throw new Error(`Unknown model: ${model}`);
    }
    let count;
    let method = 'estimated';
    // Try accurate tokenization first if preferred
    if (preferAccurate) {
        try {
            count = await countTokensAccurate(text, config.encoding);
            method = 'accurate';
        }
        catch {
            // Fall back to estimation
            count = estimateTokenCount(text, config.charsPerToken);
        }
    }
    else {
        count = estimateTokenCount(text, config.charsPerToken);
    }
    // Cache result
    if (cache) {
        const cacheKey = `${model}:${text}`;
        tokenCache.set(cacheKey, count);
    }
    return {
        total: count,
        model,
        method,
    };
}
/**
 * Count tokens accurately using tiktoken
 * Note: This requires js-tiktoken to be installed
 */
async function countTokensAccurate(text, encoding) {
    try {
        // Dynamic import to avoid errors if package not installed
        // @ts-expect-error - js-tiktoken is an optional peer dependency
        const { encoding_for_model, get_encoding } = await import('js-tiktoken');
        // Try to get encoding by model name first, then by encoding name
        let encoder;
        try {
            encoder = encoding_for_model(encoding);
        }
        catch {
            encoder = get_encoding(encoding);
        }
        const tokens = encoder.encode(text);
        encoder.free?.(); // Clean up if free method exists
        return tokens.length;
    }
    catch (error) {
        throw new Error(`js-tiktoken not available or encoding not found: ${encoding}`);
    }
}
/**
 * Estimate token count (fallback when tiktoken not available)
 */
function estimateTokenCount(text, charsPerToken) {
    return Math.ceil(text.length / charsPerToken);
}
/**
 * Count tokens in a conversation
 */
export async function countConversationTokens(messages, options = {}) {
    const { model = 'gpt-4' } = options;
    // Add overhead for message formatting
    // OpenAI format adds ~4 tokens per message
    const TOKENS_PER_MESSAGE = 4;
    const TOKENS_PER_NAME = 1;
    let totalTokens = 0;
    for (const message of messages) {
        const contentCount = await countTokens(message.content, options);
        totalTokens += contentCount.total;
        totalTokens += TOKENS_PER_MESSAGE;
        // Add extra tokens if message has a name field
        if ('name' in message) {
            totalTokens += TOKENS_PER_NAME;
        }
    }
    // Add 2 tokens for priming the response
    totalTokens += 2;
    return {
        total: totalTokens,
        model,
        method: 'accurate',
    };
}
/**
 * Truncate text to fit within token budget
 */
export async function truncateToTokenBudget(text, maxTokens, options = {}) {
    const count = await countTokens(text, options);
    if (count.total <= maxTokens) {
        return {
            truncated: text,
            tokens: count.total,
            wasTruncated: false,
        };
    }
    // Binary search for optimal length
    let left = 0;
    let right = text.length;
    let bestLength = 0;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const substring = text.substring(0, mid);
        const tokens = await countTokens(substring, options);
        if (tokens.total <= maxTokens) {
            bestLength = mid;
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    // Try to end at sentence boundary
    let truncated = text.substring(0, bestLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    const lastBoundary = Math.max(lastPeriod, lastNewline);
    if (lastBoundary > bestLength * 0.8) {
        truncated = text.substring(0, lastBoundary + 1);
    }
    const finalCount = await countTokens(truncated, options);
    return {
        truncated,
        tokens: finalCount.total,
        wasTruncated: true,
    };
}
/**
 * Split text into chunks that fit within token budget
 */
export async function chunkByTokens(text, maxTokensPerChunk, options = {}) {
    const { overlap = 0 } = options;
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
        const result = await truncateToTokenBudget(remaining, maxTokensPerChunk, options);
        chunks.push(result.truncated);
        if (!result.wasTruncated) {
            break;
        }
        // Move to next chunk with overlap
        const nextStart = result.truncated.length - overlap;
        remaining = remaining.substring(Math.max(0, nextStart));
    }
    return chunks;
}
/**
 * Get token count statistics for debugging
 */
export function getTokenizerStats() {
    return {
        cacheSize: tokenCache.size(),
        cacheMaxSize: 1000,
        cacheHitRate: 'N/A', // Would need hit/miss tracking
    };
}
/**
 * Clear token count cache
 */
export function clearTokenCache() {
    tokenCache.clear();
}
//# sourceMappingURL=accurate-counter.js.map