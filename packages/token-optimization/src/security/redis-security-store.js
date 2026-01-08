/**
 * Redis-backed Security Store for Horizontal Scaling
 *
 * Provides distributed security state management using Redis
 * for production deployments with multiple instances
 */
// Optional Redis import - falls back to in-memory if not available
// Redis is an optional peer dependency - consumers install it only if needed
let createClient = null;
// Dynamic import for optional Redis dependency
const initRedis = async () => {
    try {
        // @ts-expect-error - redis is an optional peer dependency
        const redis = await import('redis');
        createClient = redis.createClient;
    }
    catch {
        console.warn('[REDIS SECURITY STORE] Redis not available, using in-memory fallback');
    }
};
initRedis();
/**
 * Redis-backed security store for distributed deployments
 * Falls back to in-memory storage if Redis is not available
 */
export class RedisSecurityStore {
    config;
    client = null;
    isConnected = false;
    cleanupTimer = null;
    fallbackStore = new Map();
    constructor(config) {
        this.config = config;
        if (config.enabled && createClient) {
            this.initializeRedis();
        }
        else {
            console.log('[REDIS SECURITY STORE] Using in-memory fallback');
            this.isConnected = false;
        }
    }
    async initializeRedis() {
        if (!createClient) {
            console.log('[REDIS SECURITY STORE] Redis client not available, using in-memory fallback');
            this.isConnected = false;
            return;
        }
        try {
            this.client = createClient({
                url: this.config.redisUrl,
                socket: {
                    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
                },
            });
            this.client.on('error', (err) => {
                console.error('[REDIS SECURITY STORE] Error:', err);
                this.isConnected = false;
            });
            this.client.on('connect', () => {
                console.log('[REDIS SECURITY STORE] Connected to Redis');
                this.isConnected = true;
            });
            await this.client.connect();
            this.setupCleanup();
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to initialize:', error);
            this.isConnected = false;
        }
    }
    /**
     * Store rate limit requests for a user/session
     */
    async storeRateLimitRequests(key, requests) {
        if (this.isConnected && this.client) {
            try {
                const data = await this.getSecurityData(key);
                data.rateLimitRequests = requests;
                data.lastUpdated = new Date();
                await this.setSecurityData(key, data);
            }
            catch (error) {
                console.error('[REDIS SECURITY STORE] Failed to store rate limit requests:', error);
            }
        }
        else {
            // Fallback to in-memory storage
            const data = this.getFallbackSecurityData(key);
            data.rateLimitRequests = requests;
            data.lastUpdated = new Date();
            this.fallbackStore.set(key, data);
        }
    }
    /**
     * Get rate limit requests for a user/session
     */
    async getRateLimitRequests(key) {
        try {
            const data = await this.getSecurityData(key);
            return data.rateLimitRequests;
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to get rate limit requests:', error);
            return [];
        }
    }
    /**
     * Store threat intelligence data
     */
    async storeThreatIntelligence(key, threats) {
        if (!this.isConnected)
            return;
        try {
            const data = await this.getSecurityData(key);
            data.threatIntelligence = threats;
            data.lastUpdated = new Date();
            await this.setSecurityData(key, data);
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to store threat intelligence:', error);
        }
    }
    /**
     * Get threat intelligence data
     */
    async getThreatIntelligence(key) {
        if (!this.isConnected)
            return [];
        try {
            const data = await this.getSecurityData(key);
            return data.threatIntelligence;
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to get threat intelligence:', error);
            return [];
        }
    }
    /**
     * Add event to quarantine queue
     */
    async addToQuarantine(key, eventId) {
        if (!this.isConnected)
            return;
        try {
            const data = await this.getSecurityData(key);
            data.quarantineEvents.push(eventId);
            data.lastUpdated = new Date();
            await this.setSecurityData(key, data);
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to add to quarantine:', error);
        }
    }
    /**
     * Get quarantine events
     */
    async getQuarantineEvents(key) {
        if (!this.isConnected)
            return [];
        try {
            const data = await this.getSecurityData(key);
            return data.quarantineEvents;
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to get quarantine events:', error);
            return [];
        }
    }
    /**
     * Add event to audit log
     */
    async addToAuditLog(key, eventId) {
        if (!this.isConnected)
            return;
        try {
            const data = await this.getSecurityData(key);
            data.auditLog.push(eventId);
            data.lastUpdated = new Date();
            await this.setSecurityData(key, data);
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to add to audit log:', error);
        }
    }
    /**
     * Get audit log events
     */
    async getAuditLogEvents(key) {
        if (!this.isConnected)
            return [];
        try {
            const data = await this.getSecurityData(key);
            return data.auditLog;
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Failed to get audit log events:', error);
            return [];
        }
    }
    /**
     * Get fallback security data from in-memory store
     */
    getFallbackSecurityData(key) {
        return this.fallbackStore.get(key) || this.getDefaultSecurityData();
    }
    /**
     * Set fallback security data in in-memory store
     */
    setFallbackSecurityData(key, data) {
        this.fallbackStore.set(key, data);
    }
    /**
     * Get security data (Redis or fallback)
     */
    async getSecurityData(key) {
        if (this.isConnected && this.client) {
            // Try to get from Redis
            try {
                const redisKey = `${this.config.keyPrefix}:${key}`;
                const data = await this.client.get(redisKey);
                if (data) {
                    const parsed = JSON.parse(data);
                    // Convert date strings back to Date objects
                    parsed.lastUpdated = new Date(parsed.lastUpdated);
                    return parsed;
                }
            }
            catch (error) {
                console.error('[REDIS SECURITY STORE] Failed to get security data:', error);
            }
        }
        // Fallback to in-memory storage
        return this.getFallbackSecurityData(key);
    }
    /**
     * Set security data (Redis or fallback)
     */
    async setSecurityData(key, data) {
        if (this.isConnected && this.client) {
            try {
                const redisKey = `${this.config.keyPrefix}:${key}`;
                const serialized = JSON.stringify(data);
                await this.client.setEx(redisKey, this.config.ttlSeconds, serialized);
                return;
            }
            catch (error) {
                console.error('[REDIS SECURITY STORE] Failed to set security data:', error);
            }
        }
        // Fallback to in-memory storage
        this.setFallbackSecurityData(key, data);
    }
    /**
     * Get default security data
     */
    getDefaultSecurityData() {
        return {
            rateLimitRequests: [],
            threatIntelligence: [],
            quarantineEvents: [],
            auditLog: [],
            lastUpdated: new Date(),
        };
    }
    /**
     * Setup periodic cleanup
     */
    setupCleanup() {
        this.cleanupTimer = setInterval(() => {
            this.performCleanup();
        }, this.config.cleanupInterval);
    }
    /**
     * Perform cleanup of expired data
     */
    async performCleanup() {
        if (!this.client || !this.isConnected)
            return;
        try {
            // Clean up old data based on TTL
            const keys = await this.client.keys(`${this.config.keyPrefix}:*`);
            for (const key of keys) {
                const data = await this.client.get(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    const age = Date.now() - parsed.lastUpdated.getTime();
                    if (age > this.config.ttlSeconds * 1000) {
                        await this.client.del(key);
                    }
                }
            }
        }
        catch (error) {
            console.error('[REDIS SECURITY STORE] Cleanup error:', error);
        }
    }
    /**
     * Disconnect from Redis
     */
    async disconnect() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        if (this.client && this.isConnected) {
            try {
                await this.client.disconnect();
                this.isConnected = false;
                console.log('[REDIS SECURITY STORE] Disconnected from Redis');
            }
            catch (error) {
                console.error('[REDIS SECURITY STORE] Error disconnecting:', error);
            }
        }
    }
    /**
     * Check if Redis is connected
     */
    isRedisConnected() {
        return this.isConnected;
    }
}
/**
 * Factory function to create security store
 */
export function createSecurityStore(config = {}) {
    const fullConfig = {
        enabled: config.enabled ?? false,
        redisUrl: config.redisUrl ?? 'redis://localhost:6379',
        keyPrefix: config.keyPrefix ?? 'security',
        ttlSeconds: config.ttlSeconds ?? 3600, // 1 hour
        cleanupInterval: config.cleanupInterval ?? 300000, // 5 minutes
    };
    return new RedisSecurityStore(fullConfig);
}
//# sourceMappingURL=redis-security-store.js.map