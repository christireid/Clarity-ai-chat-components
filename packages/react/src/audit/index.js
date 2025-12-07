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
export const AuditActions = {
    // Authentication
    USER_LOGIN: 'auth.user.login',
    USER_LOGOUT: 'auth.user.logout',
    USER_REGISTER: 'auth.user.register',
    // Chat
    CHAT_MESSAGE_SENT: 'chat.message.sent',
    CHAT_MESSAGE_RECEIVED: 'chat.message.received',
    CHAT_MESSAGE_EDITED: 'chat.message.edited',
    CHAT_MESSAGE_DELETED: 'chat.message.deleted',
    // Documents
    DOCUMENT_UPLOADED: 'document.uploaded',
    DOCUMENT_DELETED: 'document.deleted',
    DOCUMENT_ACCESSED: 'document.accessed',
    // AI Operations
    AI_COMPLETION_REQUESTED: 'ai.completion.requested',
    AI_COMPLETION_COMPLETED: 'ai.completion.completed',
    AI_EMBEDDING_GENERATED: 'ai.embedding.generated',
    AI_TOOL_EXECUTED: 'ai.tool.executed',
    // Safety
    SAFETY_VIOLATION_DETECTED: 'safety.violation.detected',
    SAFETY_PII_REDACTED: 'safety.pii.redacted',
    // Admin
    ADMIN_SETTINGS_CHANGED: 'admin.settings.changed',
    ADMIN_USER_MODIFIED: 'admin.user.modified',
    ADMIN_QUOTA_CHANGED: 'admin.quota.changed',
};
//# sourceMappingURL=index.js.map