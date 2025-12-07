/**
 * Session Store
 *
 * Manages conversation sessions with persistent storage using Redis/Upstash.
 * Supports session creation, retrieval, updates, and expiration.
 */
export interface SessionMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}
export interface Session {
    id: string;
    userId?: string;
    sessionId: string;
    messages: SessionMessage[];
    metadata: {
        createdAt: string;
        lastActivity: string;
        totalMessages: number;
        userAgent?: string;
    };
    preferences: {
        theme?: 'light' | 'dark';
        language?: string;
    };
}
interface SessionStore {
    /** Get a session by ID */
    get(sessionId: string): Promise<Session | null>;
    /** Create or update a session */
    set(session: Session): Promise<void>;
    /** Add a message to a session */
    addMessage(sessionId: string, message: SessionMessage): Promise<void>;
    /** Delete a session */
    delete(sessionId: string): Promise<void>;
    /** Get all sessions for a user */
    getUserSessions(userId: string): Promise<Session[]>;
    /** Clean up expired sessions */
    cleanup(): Promise<number>;
}
/**
 * Upstash Redis Session Store (Production)
 */
export declare class RedisSessionStore implements SessionStore {
    private redis;
    private ttlSeconds;
    constructor(ttlSeconds?: number);
    private getKey;
    private getUserKey;
    get(sessionId: string): Promise<Session | null>;
    set(session: Session): Promise<void>;
    addMessage(sessionId: string, message: SessionMessage): Promise<void>;
    delete(sessionId: string): Promise<void>;
    getUserSessions(userId: string): Promise<Session[]>;
    cleanup(): Promise<number>;
}
/**
 * Local Session Store (Development)
 * Stores sessions in memory with optional disk persistence
 */
export declare class LocalSessionStore implements SessionStore {
    private sessions;
    private userSessions;
    get(sessionId: string): Promise<Session | null>;
    set(session: Session): Promise<void>;
    addMessage(sessionId: string, message: SessionMessage): Promise<void>;
    delete(sessionId: string): Promise<void>;
    getUserSessions(userId: string): Promise<Session[]>;
    cleanup(): Promise<number>;
}
/**
 * Get the appropriate session store based on environment
 */
export declare function getSessionStore(): SessionStore;
/**
 * Generate a new session
 */
export declare function createSession(sessionId: string, options?: {
    userId?: string;
    userAgent?: string;
    initialMessage?: SessionMessage;
}): Session;
/**
 * Generate a browser fingerprint for session identification
 * This is a simple implementation - can be enhanced with libraries like fingerprintjs
 */
export declare function generateSessionFingerprint(): string;
/**
 * Get or create a session ID from localStorage
 */
export declare function getOrCreateSessionId(): string;
/**
 * Session middleware helpers for API routes
 *
 * Note: sessionId is used as both the lookup key and stored in session.id
 * to ensure consistency between creation and retrieval.
 */
export declare function getOrCreateSessionForRequest(sessionId: string, userId?: string, userAgent?: string): Promise<Session>;
/**
 * Update session with new messages
 */
export declare function updateSessionWithMessages(sessionId: string, messages: SessionMessage[]): Promise<void>;
export {};
//# sourceMappingURL=sessionStore.d.ts.map