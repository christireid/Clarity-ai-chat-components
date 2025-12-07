/**
 * Analytics Tracking
 *
 * Track usage patterns, costs, performance metrics, and user behavior
 * for the AI Documentation Assistant.
 */
import { Redis } from '@upstash/redis';
/**
 * Redis Analytics Store (Production)
 */
export class RedisAnalyticsStore {
    redis;
    prefix;
    constructor() {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }
        this.redis = new Redis({ url, token });
        this.prefix = process.env.ANALYTICS_PREFIX || 'clarity-docs-analytics';
    }
    getQueryKey(id) {
        return `${this.prefix}:query:${id}`;
    }
    getQueryListKey() {
        return `${this.prefix}:queries`;
    }
    getTopicsKey() {
        return `${this.prefix}:topics`;
    }
    getMetricsKey() {
        return `${this.prefix}:metrics`;
    }
    async trackQuery(analytics) {
        const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toISOString();
        const fullAnalytics = {
            ...analytics,
            id,
            timestamp,
        };
        // Store individual query
        await this.redis.set(this.getQueryKey(id), fullAnalytics, { ex: 30 * 24 * 60 * 60 } // 30 days retention
        );
        // Add to sorted set (by timestamp)
        await this.redis.zadd(this.getQueryListKey(), { score: Date.now(), member: id });
        // Track topic if present
        if (analytics.topicDetected) {
            await this.redis.zincrby(this.getTopicsKey(), 1, analytics.topicDetected);
        }
        // Update aggregate metrics
        const metrics = {
            totalQueries: await this.redis.hincrby(this.getMetricsKey(), 'totalQueries', 1),
            totalCost: await this.redis.hincrbyfloat(this.getMetricsKey(), 'totalCost', analytics.cost),
            totalTokens: await this.redis.hincrby(this.getMetricsKey(), 'totalTokens', analytics.tokenCount),
            totalResponseTime: await this.redis.hincrby(this.getMetricsKey(), 'totalResponseTime', analytics.responseTime),
        };
        if (analytics.cached) {
            await this.redis.hincrby(this.getMetricsKey(), 'cacheHits', 1);
        }
        else {
            await this.redis.hincrby(this.getMetricsKey(), 'cacheMisses', 1);
        }
        if (analytics.ragUsed) {
            await this.redis.hincrby(this.getMetricsKey(), 'ragQueries', 1);
            await this.redis.hincrby(this.getMetricsKey(), 'totalSources', analytics.sourcesFound);
        }
        if (analytics.isFollowUp) {
            await this.redis.hincrby(this.getMetricsKey(), 'followUps', 1);
        }
        console.log(`📊 Analytics tracked: ${analytics.query.substring(0, 50)}... (${analytics.responseTime}ms, $${analytics.cost.toFixed(4)})`);
    }
    async getSummary(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000); // Default: 7 days
        const durationDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        // Get aggregate metrics
        const metrics = await this.redis.hgetall(this.getMetricsKey());
        const totalQueries = parseInt(metrics?.totalQueries || '0');
        const totalCost = parseFloat(metrics?.totalCost || '0');
        const totalTokens = parseInt(metrics?.totalTokens || '0');
        const totalResponseTime = parseInt(metrics?.totalResponseTime || '0');
        const cacheHits = parseInt(metrics?.cacheHits || '0');
        const cacheMisses = parseInt(metrics?.cacheMisses || '0');
        const ragQueries = parseInt(metrics?.ragQueries || '0');
        const totalSources = parseInt(metrics?.totalSources || '0');
        const followUps = parseInt(metrics?.followUps || '0');
        // Calculate cache hit rate
        const cacheTotal = cacheHits + cacheMisses;
        const cacheHitRate = cacheTotal > 0 ? (cacheHits / cacheTotal) * 100 : 0;
        const cacheSavings = cacheHits * 0.0015; // Estimated $0.0015 per cached query
        // Get popular topics
        // @ts-expect-error - zrevrange exists in Redis but not in type definitions
        const topics = await this.redis.zrevrange(this.getTopicsKey(), 0, 9, { withScores: true });
        const popularTopics = [];
        for (let i = 0; i < topics.length; i += 2) {
            const topic = topics[i];
            const count = topics[i + 1];
            popularTopics.push({
                topic,
                count,
                percentage: totalQueries > 0 ? (count / totalQueries) * 100 : 0,
            });
        }
        // Get recent queries for analysis
        // @ts-expect-error - zrevrange exists in Redis but not in type definitions
        const recentIds = await this.redis.zrevrange(this.getQueryListKey(), 0, 99);
        const queries = [];
        for (const id of recentIds) {
            const query = await this.redis.get(this.getQueryKey(id));
            if (query) {
                queries.push(query);
            }
        }
        // Calculate popular queries
        const queryCount = new Map();
        queries.forEach(q => {
            const normalized = q.query.toLowerCase().trim();
            queryCount.set(normalized, (queryCount.get(normalized) || 0) + 1);
        });
        const popularQueries = Array.from(queryCount.entries())
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        // Calculate feedback metrics
        const positiveCount = queries.filter(q => q.feedbackType === 'positive').length;
        const negativeCount = queries.filter(q => q.feedbackType === 'negative').length;
        const feedbackTotal = positiveCount + negativeCount;
        const positiveRate = feedbackTotal > 0 ? (positiveCount / feedbackTotal) * 100 : 0;
        // Calculate model usage
        const modelUsage = {};
        queries.forEach(q => {
            modelUsage[q.model] = (modelUsage[q.model] || 0) + 1;
        });
        return {
            period: {
                start: start.toISOString(),
                end: end.toISOString(),
                durationDays,
            },
            queries: {
                total: totalQueries,
                unique: queryCount.size,
                averagePerDay: totalQueries / durationDays,
                averageResponseTime: totalQueries > 0 ? totalResponseTime / totalQueries : 0,
                followUpRate: totalQueries > 0 ? (followUps / totalQueries) * 100 : 0,
            },
            costs: {
                total: totalCost,
                averagePerQuery: totalQueries > 0 ? totalCost / totalQueries : 0,
                estimatedMonthlyCost: (totalCost / durationDays) * 30,
                cacheSavings,
            },
            cache: {
                hitRate: cacheHitRate,
                hits: cacheHits,
                misses: cacheMisses,
                estimatedSavings: cacheSavings,
            },
            rag: {
                usageRate: totalQueries > 0 ? (ragQueries / totalQueries) * 100 : 0,
                averageSourcesReturned: ragQueries > 0 ? totalSources / ragQueries : 0,
                averageRelevanceScore: 0.85, // TODO: Calculate from actual scores
            },
            feedback: {
                total: feedbackTotal,
                positiveRate,
                positive: positiveCount,
                negative: negativeCount,
            },
            popularTopics,
            popularQueries,
            modelUsage,
        };
    }
    async getRecentQueries(limit = 50) {
        // @ts-expect-error - zrevrange exists in Redis but not in type definitions
        const recentIds = await this.redis.zrevrange(this.getQueryListKey(), 0, limit - 1);
        const queries = [];
        for (const id of recentIds) {
            const query = await this.redis.get(this.getQueryKey(id));
            if (query) {
                queries.push(query);
            }
        }
        return queries;
    }
    async getPopularTopics(limit = 10) {
        // @ts-expect-error - zrevrange exists in Redis but not in type definitions
        const topics = await this.redis.zrevrange(this.getTopicsKey(), 0, limit - 1, { withScores: true });
        const result = [];
        for (let i = 0; i < topics.length; i += 2) {
            result.push({
                topic: topics[i],
                count: topics[i + 1],
            });
        }
        return result;
    }
    async clearOldData(olderThanDays) {
        const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
        // Remove old queries from sorted set
        await this.redis.zremrangebyscore(this.getQueryListKey(), 0, cutoff);
        console.log(`🗑️  Cleared analytics data older than ${olderThanDays} days`);
    }
}
/**
 * Local Analytics Store (Development)
 */
export class LocalAnalyticsStore {
    queries = [];
    metrics = {
        totalQueries: 0,
        totalCost: 0,
        totalTokens: 0,
        totalResponseTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        ragQueries: 0,
        totalSources: 0,
        followUps: 0,
    };
    async trackQuery(analytics) {
        const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toISOString();
        const fullAnalytics = {
            ...analytics,
            id,
            timestamp,
        };
        this.queries.push(fullAnalytics);
        // Update metrics
        this.metrics.totalQueries++;
        this.metrics.totalCost += analytics.cost;
        this.metrics.totalTokens += analytics.tokenCount;
        this.metrics.totalResponseTime += analytics.responseTime;
        if (analytics.cached) {
            this.metrics.cacheHits++;
        }
        else {
            this.metrics.cacheMisses++;
        }
        if (analytics.ragUsed) {
            this.metrics.ragQueries++;
            this.metrics.totalSources += analytics.sourcesFound;
        }
        if (analytics.isFollowUp) {
            this.metrics.followUps++;
        }
        console.log(`📊 Analytics tracked (local): ${analytics.query.substring(0, 50)}...`);
    }
    async getSummary(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        // Filter queries by date range
        const filteredQueries = this.queries.filter(q => {
            const qDate = new Date(q.timestamp);
            return qDate >= start && qDate <= end;
        });
        const durationDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        // Calculate metrics (same logic as Redis store)
        const totalQueries = this.metrics.totalQueries;
        const cacheTotal = this.metrics.cacheHits + this.metrics.cacheMisses;
        const cacheHitRate = cacheTotal > 0 ? (this.metrics.cacheHits / cacheTotal) * 100 : 0;
        // Get popular topics
        const topicCount = new Map();
        filteredQueries.forEach(q => {
            if (q.topicDetected) {
                topicCount.set(q.topicDetected, (topicCount.get(q.topicDetected) || 0) + 1);
            }
        });
        const popularTopics = Array.from(topicCount.entries())
            .map(([topic, count]) => ({
            topic,
            count,
            percentage: totalQueries > 0 ? (count / totalQueries) * 100 : 0,
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        // Get popular queries
        const queryCount = new Map();
        filteredQueries.forEach(q => {
            const normalized = q.query.toLowerCase().trim();
            queryCount.set(normalized, (queryCount.get(normalized) || 0) + 1);
        });
        const popularQueries = Array.from(queryCount.entries())
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        // Feedback metrics
        const positiveCount = filteredQueries.filter(q => q.feedbackType === 'positive').length;
        const negativeCount = filteredQueries.filter(q => q.feedbackType === 'negative').length;
        const feedbackTotal = positiveCount + negativeCount;
        // Model usage
        const modelUsage = {};
        filteredQueries.forEach(q => {
            modelUsage[q.model] = (modelUsage[q.model] || 0) + 1;
        });
        return {
            period: {
                start: start.toISOString(),
                end: end.toISOString(),
                durationDays,
            },
            queries: {
                total: totalQueries,
                unique: queryCount.size,
                averagePerDay: totalQueries / durationDays,
                averageResponseTime: totalQueries > 0 ? this.metrics.totalResponseTime / totalQueries : 0,
                followUpRate: totalQueries > 0 ? (this.metrics.followUps / totalQueries) * 100 : 0,
            },
            costs: {
                total: this.metrics.totalCost,
                averagePerQuery: totalQueries > 0 ? this.metrics.totalCost / totalQueries : 0,
                estimatedMonthlyCost: (this.metrics.totalCost / durationDays) * 30,
                cacheSavings: this.metrics.cacheHits * 0.0015,
            },
            cache: {
                hitRate: cacheHitRate,
                hits: this.metrics.cacheHits,
                misses: this.metrics.cacheMisses,
                estimatedSavings: this.metrics.cacheHits * 0.0015,
            },
            rag: {
                usageRate: totalQueries > 0 ? (this.metrics.ragQueries / totalQueries) * 100 : 0,
                averageSourcesReturned: this.metrics.ragQueries > 0 ? this.metrics.totalSources / this.metrics.ragQueries : 0,
                averageRelevanceScore: 0.85,
            },
            feedback: {
                total: feedbackTotal,
                positiveRate: feedbackTotal > 0 ? (positiveCount / feedbackTotal) * 100 : 0,
                positive: positiveCount,
                negative: negativeCount,
            },
            popularTopics,
            popularQueries,
            modelUsage,
        };
    }
    async getRecentQueries(limit = 50) {
        return this.queries.slice(-limit).reverse();
    }
    async getPopularTopics(limit = 10) {
        const topicCount = new Map();
        this.queries.forEach(q => {
            if (q.topicDetected) {
                topicCount.set(q.topicDetected, (topicCount.get(q.topicDetected) || 0) + 1);
            }
        });
        return Array.from(topicCount.entries())
            .map(([topic, count]) => ({ topic, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    async clearOldData(olderThanDays) {
        const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
        this.queries = this.queries.filter(q => new Date(q.timestamp) > cutoff);
    }
}
/**
 * Get the appropriate analytics store based on environment
 */
export function getAnalyticsStore() {
    const useRedis = process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.NODE_ENV === 'production';
    if (useRedis) {
        console.log('Using Redis analytics store (Upstash)');
        return new RedisAnalyticsStore();
    }
    else {
        console.log('Using local analytics store (development mode)');
        return new LocalAnalyticsStore();
    }
}
//# sourceMappingURL=analytics.js.map