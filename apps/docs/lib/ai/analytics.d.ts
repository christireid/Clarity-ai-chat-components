/**
 * Analytics Tracking
 *
 * Track usage patterns, costs, performance metrics, and user behavior
 * for the AI Documentation Assistant.
 */
export interface QueryAnalytics {
    id: string;
    query: string;
    timestamp: string;
    responseTime: number;
    tokenCount: number;
    cost: number;
    cached: boolean;
    ragUsed: boolean;
    sourcesFound: number;
    feedbackType?: 'positive' | 'negative';
    isFollowUp: boolean;
    topicDetected?: string;
    model: string;
    sessionId?: string;
    userId?: string;
}
export interface AnalyticsSummary {
    period: {
        start: string;
        end: string;
        durationDays: number;
    };
    queries: {
        total: number;
        unique: number;
        averagePerDay: number;
        averageResponseTime: number;
        followUpRate: number;
    };
    costs: {
        total: number;
        averagePerQuery: number;
        estimatedMonthlyCost: number;
        cacheSavings: number;
    };
    cache: {
        hitRate: number;
        hits: number;
        misses: number;
        estimatedSavings: number;
    };
    rag: {
        usageRate: number;
        averageSourcesReturned: number;
        averageRelevanceScore: number;
    };
    feedback: {
        total: number;
        positiveRate: number;
        positive: number;
        negative: number;
    };
    popularTopics: Array<{
        topic: string;
        count: number;
        percentage: number;
    }>;
    popularQueries: Array<{
        query: string;
        count: number;
    }>;
    modelUsage: Record<string, number>;
}
export interface AnalyticsStore {
    /** Track a query */
    trackQuery(analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>): Promise<void>;
    /** Get analytics summary */
    getSummary(startDate?: Date, endDate?: Date): Promise<AnalyticsSummary>;
    /** Get recent queries */
    getRecentQueries(limit?: number): Promise<QueryAnalytics[]>;
    /** Get popular topics */
    getPopularTopics(limit?: number): Promise<Array<{
        topic: string;
        count: number;
    }>>;
    /** Clear old analytics data */
    clearOldData(olderThanDays: number): Promise<void>;
}
/**
 * Redis Analytics Store (Production)
 */
export declare class RedisAnalyticsStore implements AnalyticsStore {
    private redis;
    private prefix;
    constructor();
    private getQueryKey;
    private getQueryListKey;
    private getTopicsKey;
    private getMetricsKey;
    trackQuery(analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>): Promise<void>;
    getSummary(startDate?: Date, endDate?: Date): Promise<AnalyticsSummary>;
    getRecentQueries(limit?: number): Promise<QueryAnalytics[]>;
    getPopularTopics(limit?: number): Promise<Array<{
        topic: string;
        count: number;
    }>>;
    clearOldData(olderThanDays: number): Promise<void>;
}
/**
 * Local Analytics Store (Development)
 */
export declare class LocalAnalyticsStore implements AnalyticsStore {
    private queries;
    private metrics;
    trackQuery(analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>): Promise<void>;
    getSummary(startDate?: Date, endDate?: Date): Promise<AnalyticsSummary>;
    getRecentQueries(limit?: number): Promise<QueryAnalytics[]>;
    getPopularTopics(limit?: number): Promise<Array<{
        topic: string;
        count: number;
    }>>;
    clearOldData(olderThanDays: number): Promise<void>;
}
/**
 * Get the appropriate analytics store based on environment
 */
export declare function getAnalyticsStore(): AnalyticsStore;
//# sourceMappingURL=analytics.d.ts.map