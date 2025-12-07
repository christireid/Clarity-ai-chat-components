/**
 * Feedback Store
 *
 * Tracks user feedback on AI responses for quality improvement.
 * Supports both Redis (production) and local storage (development).
 */
import { Redis } from '@upstash/redis';
/**
 * Redis Feedback Store (Production)
 */
export class RedisFeedbackStore {
    redis;
    constructor() {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }
        this.redis = new Redis({ url, token });
    }
    getFeedbackKey(id) {
        const prefix = process.env.FEEDBACK_PREFIX || 'clarity-docs-feedback';
        return `${prefix}:${id}`;
    }
    getAllFeedbackKey() {
        const prefix = process.env.FEEDBACK_PREFIX || 'clarity-docs-feedback';
        return `${prefix}:all`;
    }
    async saveFeedback(feedback) {
        const id = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toISOString();
        const fullFeedback = {
            ...feedback,
            id,
            timestamp,
        };
        // Save individual feedback
        await this.redis.set(this.getFeedbackKey(id), fullFeedback);
        // Add to list of all feedback IDs
        await this.redis.sadd(this.getAllFeedbackKey(), id);
    }
    async getAllFeedback() {
        const feedbackIds = (await this.redis.smembers(this.getAllFeedbackKey()));
        const feedbacks = [];
        for (const id of feedbackIds) {
            const feedback = await this.redis.get(this.getFeedbackKey(id));
            if (feedback) {
                feedbacks.push(feedback);
            }
        }
        return feedbacks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    async getStats() {
        const allFeedback = await this.getAllFeedback();
        const total = allFeedback.length;
        const positive = allFeedback.filter(f => f.type === 'positive').length;
        const negative = total - positive;
        const positiveRate = total > 0 ? (positive / total) * 100 : 0;
        // Extract common issues from negative feedback comments
        const comments = allFeedback
            .filter(f => f.type === 'negative' && f.comment)
            .map(f => f.comment.toLowerCase());
        const issueKeywords = ['wrong', 'incorrect', 'outdated', 'unclear', 'missing', 'error'];
        const commonIssues = issueKeywords.map(keyword => ({
            issue: keyword,
            count: comments.filter(c => c.includes(keyword)).length,
        })).filter(i => i.count > 0)
            .sort((a, b) => b.count - a.count);
        return {
            total,
            positive,
            negative,
            positiveRate,
            commonIssues,
        };
    }
    async getFeedbackForMessage(messageId) {
        const allFeedback = await this.getAllFeedback();
        return allFeedback.find(f => f.messageId === messageId) || null;
    }
}
/**
 * Local Feedback Store (Development)
 */
export class LocalFeedbackStore {
    feedbacks = new Map();
    async saveFeedback(feedback) {
        const id = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toISOString();
        const fullFeedback = {
            ...feedback,
            id,
            timestamp,
        };
        this.feedbacks.set(id, fullFeedback);
        console.log('📝 Feedback saved (local):', fullFeedback);
    }
    async getAllFeedback() {
        return Array.from(this.feedbacks.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    async getStats() {
        const allFeedback = await this.getAllFeedback();
        const total = allFeedback.length;
        const positive = allFeedback.filter(f => f.type === 'positive').length;
        const negative = total - positive;
        const positiveRate = total > 0 ? (positive / total) * 100 : 0;
        const comments = allFeedback
            .filter(f => f.type === 'negative' && f.comment)
            .map(f => f.comment.toLowerCase());
        const issueKeywords = ['wrong', 'incorrect', 'outdated', 'unclear', 'missing', 'error'];
        const commonIssues = issueKeywords.map(keyword => ({
            issue: keyword,
            count: comments.filter(c => c.includes(keyword)).length,
        })).filter(i => i.count > 0)
            .sort((a, b) => b.count - a.count);
        return {
            total,
            positive,
            negative,
            positiveRate,
            commonIssues,
        };
    }
    async getFeedbackForMessage(messageId) {
        const allFeedback = await this.getAllFeedback();
        return allFeedback.find(f => f.messageId === messageId) || null;
    }
}
/**
 * Get the appropriate feedback store based on environment
 */
export function getFeedbackStore() {
    const useRedis = process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.NODE_ENV === 'production';
    if (useRedis) {
        console.log('Using Redis feedback store (Upstash)');
        return new RedisFeedbackStore();
    }
    else {
        console.log('Using local feedback store (development mode)');
        return new LocalFeedbackStore();
    }
}
//# sourceMappingURL=feedbackStore.js.map