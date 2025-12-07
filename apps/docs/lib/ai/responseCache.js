/**
 * Response Cache
 *
 * Caches AI responses to reduce API costs and improve response times.
 * Uses query content + RAG context as cache key for accuracy.
 */
import { Redis } from '@upstash/redis';
import crypto from 'crypto';
/**
 * Generate cache key from query and optional context
 */
function generateCacheKey(query, contextHash) {
    const normalizedQuery = query.toLowerCase().trim();
    const content = contextHash
        ? `${normalizedQuery}:${contextHash}`
        : normalizedQuery;
    return crypto.createHash('sha256').update(content).digest('hex');
}
/**
 * Redis Response Cache (Production)
 */
export class RedisResponseCache {
    redis;
    defaultTTL; // in seconds
    constructor(ttl = 24 * 60 * 60) {
        // Default: 24 hours
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }
        this.redis = new Redis({ url, token });
        this.defaultTTL = ttl;
    }
    getCacheKey(query, contextHash) {
        const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache';
        const hash = generateCacheKey(query, contextHash);
        return `${prefix}:${hash}`;
    }
    getStatsKey() {
        const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache';
        return `${prefix}:stats`;
    }
    async get(query, contextHash) {
        const key = this.getCacheKey(query, contextHash);
        const cached = await this.redis.get(key);
        if (cached) {
            const response = cached;
            // Increment hit counter
            response.hits = (response.hits || 0) + 1;
            await this.redis.set(key, response, { ex: this.defaultTTL });
            // Track cache hit
            await this.redis.hincrby(this.getStatsKey(), 'hits', 1);
            console.log(`✅ Cache HIT for query: "${query.substring(0, 50)}..."`);
            return response;
        }
        // Track cache miss
        await this.redis.hincrby(this.getStatsKey(), 'misses', 1);
        console.log(`❌ Cache MISS for query: "${query.substring(0, 50)}..."`);
        return null;
    }
    async set(query, response, options) {
        const key = this.getCacheKey(query, options.contextHash);
        const ttl = options.ttl || this.defaultTTL;
        const cachedResponse = {
            query,
            response,
            sources: options.sources,
            model: options.model || 'unknown',
            timestamp: new Date().toISOString(),
            hits: 0,
        };
        await this.redis.set(key, cachedResponse, { ex: ttl });
        console.log(`💾 Cached response for query: "${query.substring(0, 50)}..."`);
    }
    async getStats() {
        const stats = await this.redis.hgetall(this.getStatsKey());
        const hits = parseInt(stats?.hits || '0');
        const misses = parseInt(stats?.misses || '0');
        const total = hits + misses;
        const hitRate = total > 0 ? (hits / total) * 100 : 0;
        // Estimate savings: assume $0.0015 per query (GPT-4 average)
        const estimatedSavings = hits * 0.0015;
        return {
            totalQueries: total,
            cacheHits: hits,
            cacheMisses: misses,
            hitRate,
            estimatedSavings,
        };
    }
    async clear() {
        const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache';
        const keys = await this.redis.keys(`${prefix}:*`);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
        console.log(`🗑️  Cleared ${keys.length} cached responses`);
    }
}
/**
 * Local Response Cache (Development)
 */
export class LocalResponseCache {
    cache = new Map();
    stats = { hits: 0, misses: 0 };
    async get(query, contextHash) {
        const key = generateCacheKey(query, contextHash);
        const cached = this.cache.get(key);
        if (cached) {
            // Increment hit counter
            cached.hits++;
            this.stats.hits++;
            console.log(`✅ Cache HIT (local) for query: "${query.substring(0, 50)}..."`);
            return cached;
        }
        this.stats.misses++;
        console.log(`❌ Cache MISS (local) for query: "${query.substring(0, 50)}..."`);
        return null;
    }
    async set(query, response, options) {
        const key = generateCacheKey(query, options.contextHash);
        const cachedResponse = {
            query,
            response,
            sources: options.sources,
            model: options.model || 'unknown',
            timestamp: new Date().toISOString(),
            hits: 0,
        };
        this.cache.set(key, cachedResponse);
        console.log(`💾 Cached response (local) for query: "${query.substring(0, 50)}..."`);
        // Auto-cleanup: remove oldest entries if cache grows too large
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
    }
    async getStats() {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
        const estimatedSavings = this.stats.hits * 0.0015;
        return {
            totalQueries: total,
            cacheHits: this.stats.hits,
            cacheMisses: this.stats.misses,
            hitRate,
            estimatedSavings,
        };
    }
    async clear() {
        const size = this.cache.size;
        this.cache.clear();
        this.stats = { hits: 0, misses: 0 };
        console.log(`🗑️  Cleared ${size} cached responses (local)`);
    }
}
/**
 * Get the appropriate response cache based on environment
 */
export function getResponseCache() {
    const useRedis = process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.NODE_ENV === 'production';
    if (useRedis) {
        console.log('Using Redis response cache (Upstash)');
        return new RedisResponseCache();
    }
    else {
        console.log('Using local response cache (development mode)');
        return new LocalResponseCache();
    }
}
/**
 * Generate context hash for RAG queries
 * Uses source URLs to create a stable hash
 */
export function generateContextHash(sources) {
    const urls = sources.map(s => s.url).sort().join(',');
    return crypto.createHash('md5').update(urls).digest('hex').substring(0, 8);
}
//# sourceMappingURL=responseCache.js.map