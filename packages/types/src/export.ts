/**
 * Export-related type definitions
 *
 * This module contains types for exporting chats, projects,
 * and knowledge bases to various formats.
 *
 * @packageDocumentation
 */

/**
 * Supported export file formats.
 */
export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'json' | 'html'

/**
 * Export job status.
 */
export type ExportStatus = 'pending' | 'processing' | 'complete' | 'error'

/**
 * Styling options for document exports.
 *
 * @example
 * ```typescript
 * const style: ExportStyle = {
 *   fontFamily: 'Inter',
 *   fontSize: 12,
 *   lineHeight: 1.5,
 *   margins: { top: 72, right: 72, bottom: 72, left: 72 },
 *   headerFooter: true,
 *   pageNumbers: true,
 *   tableOfContents: false,
 * }
 * ```
 */
export interface ExportStyle {
  /** Font family name */
  fontFamily?: string
  /** Font size in points */
  fontSize?: number
  /** Line height multiplier */
  lineHeight?: number
  /** Page margins in points */
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  /** Include header/footer */
  headerFooter?: boolean
  /** Include page numbers */
  pageNumbers?: boolean
  /** Generate table of contents */
  tableOfContents?: boolean
}

/**
 * Options for configuring an export.
 *
 * @example
 * ```typescript
 * const options: ExportOptions = {
 *   format: 'pdf',
 *   includeMetadata: true,
 *   includeImages: true,
 *   includeAttachments: false,
 *   dateRange: {
 *     from: new Date('2024-01-01'),
 *     to: new Date('2024-01-31'),
 *   },
 *   styling: { fontSize: 12, pageNumbers: true },
 * }
 * ```
 */
export interface ExportOptions {
  /** Output format */
  format: ExportFormat
  /** Include message metadata (timestamps, model, etc.) */
  includeMetadata: boolean
  /** Include embedded images */
  includeImages: boolean
  /** Include file attachments */
  includeAttachments: boolean
  /** Filter by date range */
  dateRange?: {
    /** Start date */
    from: Date
    /** End date */
    to: Date
  }
  /** Document styling options */
  styling?: ExportStyle
  /** Watermark configuration */
  watermark?: {
    /** Watermark text */
    text: string
    /** Opacity (0-1) */
    opacity: number
  }
}

/**
 * Export job tracking.
 *
 * @remarks
 * Represents an asynchronous export operation that may take
 * time to complete, especially for large datasets.
 *
 * @example
 * ```typescript
 * const job: ExportJob = {
 *   id: 'export-123',
 *   userId: 'user-1',
 *   resourceType: 'chat',
 *   resourceId: 'chat-456',
 *   options: { format: 'pdf', includeMetadata: true, ... },
 *   status: 'processing',
 *   progress: 0.75,
 *   createdAt: new Date(),
 * }
 * ```
 */
export interface ExportJob {
  /** Unique job identifier */
  id: string
  /** ID of the user who requested the export */
  userId: string
  /** Type of resource being exported */
  resourceType: 'chat' | 'project' | 'knowledge-base'
  /** ID of the resource being exported */
  resourceId: string
  /** Export configuration */
  options: ExportOptions
  /** Current job status */
  status: ExportStatus
  /** Progress percentage (0-1) */
  progress: number
  /** URL to download completed export */
  downloadUrl?: string
  /** Error message if status is 'error' */
  error?: string
  /** When the job was created */
  createdAt: Date
  /** When the job completed */
  completedAt?: Date
}

/**
 * Saved export template for reuse.
 *
 * @example
 * ```typescript
 * const template: ExportTemplate = {
 *   id: 'template-1',
 *   name: 'Weekly Report',
 *   format: 'pdf',
 *   options: {
 *     includeMetadata: true,
 *     styling: { pageNumbers: true, tableOfContents: true },
 *   },
 *   isDefault: true,
 * }
 * ```
 */
export interface ExportTemplate {
  /** Template identifier */
  id: string
  /** Template name */
  name: string
  /** Default format for this template */
  format: ExportFormat
  /** Partial export options (merged with defaults) */
  options: Partial<ExportOptions>
  /** Whether this is the default template */
  isDefault: boolean
}
