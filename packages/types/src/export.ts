/**
 * Export-related type definitions
 */

export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'json' | 'html'

export type ExportStatus = 'pending' | 'processing' | 'complete' | 'error'

export interface ExportStyle {
  fontFamily?: string
  fontSize?: number
  lineHeight?: number
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerFooter?: boolean
  pageNumbers?: boolean
  tableOfContents?: boolean
}

export interface ExportOptions {
  format: ExportFormat
  includeMetadata: boolean
  includeImages: boolean
  includeAttachments: boolean
  dateRange?: {
    from: Date
    to: Date
  }
  styling?: ExportStyle
  watermark?: {
    text: string
    opacity: number
  }
}

export interface ExportJob {
  id: string
  userId: string
  resourceType: 'chat' | 'project' | 'knowledge-base'
  resourceId: string
  options: ExportOptions
  status: ExportStatus
  progress: number
  downloadUrl?: string
  error?: string
  createdAt: Date
  completedAt?: Date
}

export interface ExportTemplate {
  id: string
  name: string
  format: ExportFormat
  options: Partial<ExportOptions>
  isDefault: boolean
}
