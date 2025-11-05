/**
 * Audit Logger
 *
 * Simple, flexible audit logging for compliance and security.
 */
import type { AuditEvent, AuditConfig, AuditStorage, AuditQuery } from './types';
export declare class AuditLogger {
    private config;
    constructor(config: AuditConfig);
    /**
     * Log an audit event
     */
    log(action: string, data: Record<string, any>, options?: {
        userId?: string;
        sessionId?: string;
        tenantId?: string;
        resource?: {
            type: string;
            id: string;
        };
        result?: 'success' | 'failure' | 'partial';
        error?: string;
    }): Promise<AuditEvent>;
    /**
     * Query audit logs
     */
    query(query: AuditQuery): Promise<AuditEvent[]>;
    /**
     * Get event by ID
     */
    getEvent(id: string): Promise<AuditEvent | null>;
    /**
     * Clean up old events based on retention policy
     */
    cleanup(): Promise<number>;
    /**
     * Redact sensitive fields from data
     */
    private redactSensitiveData;
    private generateId;
}
/**
 * Memory Audit Storage (for development/testing)
 */
export declare class MemoryAuditStorage implements AuditStorage {
    private events;
    store(event: AuditEvent): Promise<void>;
    query(query: AuditQuery): Promise<AuditEvent[]>;
    get(id: string): Promise<AuditEvent | null>;
    deleteOlderThan(timestamp: number): Promise<number>;
    /**
     * Get all events (for testing)
     */
    getAll(): AuditEvent[];
    /**
     * Clear all events
     */
    clear(): void;
}
//# sourceMappingURL=audit-logger.d.ts.map