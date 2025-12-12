/**
 * Context-related type definitions
 *
 * Context represents supplementary information attached to a project,
 * such as documents, images, links, and other media that inform
 * AI responses within that project.
 *
 * @packageDocumentation
 */

/**
 * Type of context content.
 *
 * @remarks
 * - `document`: PDF, Word, text files, etc.
 * - `image`: Static images (PNG, JPG, etc.)
 * - `link`: Web URLs
 * - `text`: Plain text snippets
 * - `video`: Video files
 * - `audio`: Audio files
 */
export type ContextType =
  | 'document'
  | 'image'
  | 'link'
  | 'text'
  | 'video'
  | 'audio'

/**
 * Metadata associated with a context item.
 *
 * @remarks
 * Contains file-specific properties like dimensions for images or
 * duration for audio/video. Supports custom properties through an
 * index signature typed as `unknown` for type safety.
 *
 * @example
 * ```typescript
 * const imageMetadata: ContextMetadata = {
 *   fileSize: 102400,
 *   mimeType: 'image/png',
 *   dimensions: { width: 1920, height: 1080 },
 *   title: 'Architecture Diagram',
 * }
 * ```
 */
export interface ContextMetadata {
  /** File size in bytes */
  fileSize?: number
  /** MIME type of the content */
  mimeType?: string
  /** Dimensions for images/videos */
  dimensions?: { width: number; height: number }
  /** Duration in seconds for audio/video */
  duration?: number
  /** Number of pages for documents */
  pageCount?: number
  /** Document/content title */
  title?: string
  /** Author of the content */
  author?: string
  /** Text extracted from the content (e.g., OCR for images) */
  extractedText?: string
  /** Additional custom metadata properties (requires type narrowing) */
  [key: string]: unknown
}

/**
 * A context item attached to a project.
 *
 * @remarks
 * Context items provide additional information to the AI within a project.
 * They can be documents, images, links, or other media that inform
 * the AI's responses.
 *
 * @example
 * ```typescript
 * const context: Context = {
 *   id: 'ctx-1',
 *   projectId: 'proj-1',
 *   type: 'document',
 *   name: 'Technical Spec',
 *   content: 'Document content or summary...',
 *   metadata: { pageCount: 10, mimeType: 'application/pdf' },
 *   isActive: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface Context {
  /** Unique context identifier */
  id: string
  /** ID of the project this context belongs to */
  projectId: string
  /** Type of context content */
  type: ContextType
  /** Display name */
  name: string
  /** Content or summary text */
  content: string
  /** Source URL (for links or remote content) */
  url?: string
  /** Context metadata */
  metadata: ContextMetadata
  /** Whether this context is currently active/included */
  isActive: boolean
  /** When the context was created */
  createdAt: Date
  /** When the context was last updated */
  updatedAt: Date
}

/**
 * Lightweight context preview for listings.
 *
 * @example
 * ```typescript
 * const preview: ContextPreview = {
 *   id: 'ctx-1',
 *   name: 'Technical Spec',
 *   type: 'document',
 *   preview: 'First 200 characters of the document...',
 *   thumbnail: 'https://example.com/thumb.png',
 * }
 * ```
 */
export interface ContextPreview {
  /** Unique context identifier */
  id: string
  /** Display name */
  name: string
  /** Type of context content */
  type: ContextType
  /** Preview text or description */
  preview: string
  /** Thumbnail image URL */
  thumbnail?: string
}

/**
 * Progress information for context uploads.
 *
 * @example
 * ```typescript
 * const progress: ContextUploadProgress = {
 *   contextId: 'ctx-1',
 *   fileName: 'document.pdf',
 *   progress: 0.75,
 *   status: 'uploading',
 * }
 * ```
 */
export interface ContextUploadProgress {
  /** ID of the context being uploaded */
  contextId: string
  /** Name of the file being uploaded */
  fileName: string
  /** Upload progress (0-1) */
  progress: number
  /** Current upload status */
  status: 'uploading' | 'processing' | 'complete' | 'error'
  /** Error message if status is 'error' */
  error?: string
}
