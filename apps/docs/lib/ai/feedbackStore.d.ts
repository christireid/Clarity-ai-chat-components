/**
 * Feedback Store
 *
 * Tracks user feedback on AI responses for quality improvement.
 * Supports both Redis (production) and local storage (development).
 */
export interface Feedback {
    id: string;
    messageId: string;
    sessionId?: string;
    userId?: string;
    type: 'positive' | 'negative';
    comment?: string;
    timestamp: string;
    metadata: {
        messageContent?: string;
        sources?: Array<{
            url: string;
            title: string;
        }>;
        model?: string;
    };
}
export interface FeedbackStats {
    total: number;
    positive: number;
    negative: number;
    positiveRate: number;
    commonIssues: Array<{
        issue: string;
        count: number;
    }>;
}
interface FeedbackStore {
    /** Save feedback */
    saveFeedback(feedback: Omit<Feedback, 'id' | 'timestamp'>): Promise<void>;
    /** Get all feedback */
    getAllFeedback(): Promise<Feedback[]>;
    /** Get feedback stats */
    getStats(): Promise<FeedbackStats>;
    /** Get feedback for a specific message */
    getFeedbackForMessage(messageId: string): Promise<Feedback | null>;
}
/**
 * Redis Feedback Store (Production)
 */
export declare class RedisFeedbackStore implements FeedbackStore {
    private redis;
    constructor();
    private getFeedbackKey;
    private getAllFeedbackKey;
    saveFeedback(feedback: Omit<Feedback, 'id' | 'timestamp'>): Promise<void>;
    getAllFeedback(): Promise<Feedback[]>;
    getStats(): Promise<FeedbackStats>;
    getFeedbackForMessage(messageId: string): Promise<Feedback | null>;
}
/**
 * Local Feedback Store (Development)
 */
export declare class LocalFeedbackStore implements FeedbackStore {
    private feedbacks;
    saveFeedback(feedback: Omit<Feedback, 'id' | 'timestamp'>): Promise<void>;
    getAllFeedback(): Promise<Feedback[]>;
    getStats(): Promise<FeedbackStats>;
    getFeedbackForMessage(messageId: string): Promise<Feedback | null>;
}
/**
 * Get the appropriate feedback store based on environment
 */
export declare function getFeedbackStore(): FeedbackStore;
export {};
//# sourceMappingURL=feedbackStore.d.ts.map