/**
 * Media Components
 *
 * Document, file, and media handling components including
 * viewers, integrations, and export functionality.
 */

export { DocumentViewer } from './document-viewer'
export {
  DocumentIntegration,
  useDocumentIntegration,
  type DocumentPlatform,
  type DocumentMetadata,
  type DocumentContent,
  type DocumentExportOptions,
  type DocumentChunk,
} from './document-integration'
export { MultiModalPreview } from './multi-modal-preview'
export {
  CalendarIntegration,
  useCalendarIntegration,
  useAvailabilityCheck,
  type CalendarEvent,
  type ActionItem,
  type AvailabilitySlot,
  type EventAttendee,
  type EventReminder,
  type RecurrenceRule,
} from './calendar-integration'
export {
  EmailIntegration,
  useEmailIntegration,
  type EmailProvider,
  type EmailAccount,
  type EmailThread,
  type EmailMessage,
  type EmailNotification,
  type EmailTemplate,
  type DigestConfig,
  type EmailParticipant,
  type EmailAttachment,
} from './email-integration'
export { ExportDialog } from './export-dialog'
export { BatchExportDialog } from './batch-export-dialog'
