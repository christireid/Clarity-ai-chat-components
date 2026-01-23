/**
 * Audit Logging Module
 *
 * Provides GDPR Article 30 compliant audit logging for memory operations.
 *
 * @module audit
 */

export { AuditLogger } from './audit-logger'
export type {
  AuditEventType,
  AuditEventSeverity,
  AuditEventMetadata,
  AuditLogEntry,
  AuditLogQuery,
  AuditLogStats,
  AuditLoggerConfig,
} from './audit-logger'
