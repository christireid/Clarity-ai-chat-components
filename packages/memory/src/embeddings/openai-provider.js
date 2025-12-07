/**
 * OpenAI Embedding Provider
 *
 * Optimized with caching, retry logic, and rate limiting
 */
import { LRUCache } from '../utils/cache';
import { retry, isRetryableError } from '../utils/retry';
import { RateLimiter } from '../utils/rate-limiter';
export class OpenAIEmbeddingProvider {
    apiKey;
    model;
    dimensions;
    cache;
    rateLimiter;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'text-embedding-3-small';
        this.dimensions = config.dimensions || 1536;
        // Setup cache if enabled
        if (config.cache !== false) {
            this.cache = new LRUCache({
                maxSize: config.cacheSize || 1000,
                ttl: config.cacheTTL,
            });
        }
        // Setup rate limiter if configured
        if (config.rateLimit) {
            this.rateLimiter = new RateLimiter(config.rateLimit);
        }
    }
    async embed(text) {
        // Check cache first
        if (this.cache?.has(text)) {
            return this.cache.get(text);
        }
        // Rate limit if configured
        if (this.rateLimiter) {
            await this.rateLimiter.acquire();
        }
        // Retry with exponential backoff
        const embedding = await retry(async () => {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    input: text,
                    dimensions: this.dimensions,
                }),
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Unknown error' }));
                const errorMessage = `OpenAI embedding failed: ${JSON.stringify(error)}`;
                // Check if retryable
                if (isRetryableError(new Error(errorMessage))) {
                    throw new Error(errorMessage);
                }
                // Non-retryable errors (e.g., invalid API key)
                throw new Error(errorMessage);
            }
            const data = await response.json();
            const result = data.data[0]?.embedding || [];
            if (result.length === 0) {
                throw new Error('Empty embedding returned');
            }
            return result;
        }, {
            maxAttempts: 3,
            initialDelay: 1000,
            retryableErrors: ['network', 'timeout', '503', '502', '504'],
        });
        // Cache result
        if (this.cache) {
            this.cache.set(text, embedding);
        }
        return embedding;
    }
    async embedBatch(texts) {
        // Check cache for each text
        const cached = new Map();
        const uncached = [];
        texts.forEach((text, index) => {
            if (this.cache?.has(text)) {
                cached.set(index, this.cache.get(text));
            }
            else {
                uncached.push({ index, text });
            }
        });
        // If all cached, return immediately
        if (uncached.length === 0) {
            return texts.map((_, index) => cached.get(index));
        }
        // Rate limit if configured
        if (this.rateLimiter) {
            await this.rateLimiter.acquire();
        }
        // Fetch uncached embeddings
        const embeddings = await retry(async () => {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    input: uncached.map(item => item.text),
                    dimensions: this.dimensions,
                }),
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`OpenAI batch embedding failed: ${JSON.stringify(error)}`);
            }
            const data = await response.json();
            return data.data.map((item) => item.embedding);
        }, {
            maxAttempts: 3,
            initialDelay: 1000,
            retryableErrors: ['network', 'timeout', '503', '502', '504'],
        });
        // Cache results and build final array
        const results = [];
        let uncachedIndex = 0;
        texts.forEach((text, index) => {
            if (cached.has(index)) {
                results.push(cached.get(index));
            }
            else {
                const embedding = embeddings[uncachedIndex];
                if (this.cache) {
                    this.cache.set(text, embedding);
                }
                results.push(embedding);
                uncachedIndex++;
            }
        });
        return results;
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache?.clear();
    }
    /**
     * Get cache stats
     */
    getCacheStats() {
        if (!this.cache)
            return null;
        return {
            size: this.cache.size(),
            maxSize: this.cache['maxSize'],
        };
    }
}
//# sourceMappingURL=openai-provider.js.map