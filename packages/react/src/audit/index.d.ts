/**
 * Audit Logging System
 *
 * Track all actions for compliance, security, and debugging.
 * Flexible storage backend - use memory, database, or cloud service.
 *
 * @example
 * ```tsx
 * import { AuditLogger, MemoryAuditStorage } from '@clarity-chat/react'
 *
 * const audit = new AuditLogger({
 *   storage: new MemoryAuditStorage(),
 *   retentionDays: 90,
 *   redactFields: ['password', 'apiKey'],
 * })
 *
 * // Log actions
 * await audit.log('chat.message.sent', {
 *   messageId: '123',
 *   content: 'Hello',
 * }, {
 *   userId: 'user-456',
 *   sessionId: 'session-789',
 *   result: 'success',
 * })
 *
 * // Query logs
 * const events = await audit.query({
 *   userId: 'user-456',
 *   action: 'chat.message.sent',
 *   startTime: Date.now() - 86400000, // Last 24h
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Custom storage backend
 * class DatabaseAuditStorage implements AuditStorage {
 *   async store(event: AuditEvent) {
 *     await db.auditLogs.insert(event)
 *   }
 *
 *   async query(query: AuditQuery) {
 *     return await db.auditLogs.find(query)
 *   }
 *
 *   // ... implement other methods
 * }
 *
 * const audit = new AuditLogger({
 *   storage: new DatabaseAuditStorage(),
 * })
 * ```
 */
export * from './types';
export * from './audit-logger';
/**
 * Common audit actions for AI applications
 */
export declare const AuditActions: {
    readonly USER_LOGIN: "auth.user.login";
    readonly USER_LOGOUT: "auth.user.logout";
    readonly USER_REGISTER: "auth.user.register";
    readonly CHAT_MESSAGE_SENT: "chat.message.sent";
    readonly CHAT_MESSAGE_RECEIVED: "chat.message.received";
    readonly CHAT_MESSAGE_EDITED: "chat.message.edited";
    readonly CHAT_MESSAGE_DELETED: "chat.message.deleted";
    readonly DOCUMENT_UPLOADED: "document.uploaded";
    readonly DOCUMENT_DELETED: "document.deleted";
    readonly DOCUMENT_ACCESSED: "document.accessed";
    readonly AI_COMPLETION_REQUESTED: "ai.completion.requested";
    readonly AI_COMPLETION_COMPLETED: "ai.completion.completed";
    readonly AI_EMBEDDING_GENERATED: "ai.embedding.generated";
    readonly AI_TOOL_EXECUTED: "ai.tool.executed";
    readonly SAFETY_VIOLATION_DETECTED: "safety.violation.detected";
    readonly SAFETY_PII_REDACTED: "safety.pii.redacted";
    readonly ADMIN_SETTINGS_CHANGED: "admin.settings.changed";
    readonly ADMIN_USER_MODIFIED: "admin.user.modified";
    readonly ADMIN_QUOTA_CHANGED: "admin.quota.changed";
};
//# sourceMappingURL=index.d.ts.map