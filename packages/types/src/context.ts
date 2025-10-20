/**
 * Context-related type definitions
 */

import type { ContextType } from './project'

export interface ContextMetadata {
  fileSize?: number
  mimeType?: string
  dimensions?: { width: number; height: number }
  duration?: number
  pageCount?: number
  title?: string
  author?: string
  extractedText?: string
  [key: string]: any
}

export interface Context {
  id: string
  projectId: string
  type: ContextType
  name: string
  content: string
  url?: string
  metadata: ContextMetadata
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ContextPreview {
  id: string
  name: string
  type: ContextType
  preview: string
  thumbnail?: string
}

export interface ContextUploadProgress {
  contextId: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}
