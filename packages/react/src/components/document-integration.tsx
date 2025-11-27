'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { FileIcon, DownloadIcon, RefreshIcon, CheckIcon, CloseIcon } from './icons'
import { useIsMounted } from '../hooks/use-is-mounted'

/**
 * Supported document platforms
 */
export type DocumentPlatform =
  | 'google-docs'
  | 'google-sheets'
  | 'google-slides'
  | 'notion'
  | 'confluence'
  | 'dropbox'
  | 'onedrive'
  | 'sharepoint'
  | 'local'

/**
 * Document metadata
 */
export interface DocumentMetadata {
  id: string
  title: string
  platform: DocumentPlatform
  mimeType: string
  size: number
  createdAt: Date
  modifiedAt: Date
  owner?: string
  shared?: boolean
  url?: string
  thumbnail?: string
}

/**
 * Document content
 */
export interface DocumentContent {
  id: string
  text: string
  html?: string
  markdown?: string
  chunks?: DocumentChunk[]
  metadata: DocumentMetadata
}

/**
 * Document chunk for RAG
 */
export interface DocumentChunk {
  id: string
  content: string
  startIndex: number
  endIndex: number
  embedding?: number[]
  metadata?: Record<string, unknown>
}

/**
 * Document export options
 */
export interface DocumentExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'md' | 'html'
  includeComments?: boolean
  includeImages?: boolean
  pageRange?: { start: number; end: number }
}

/**
 * Document integration state
 */
interface DocumentIntegrationState {
  documents: DocumentMetadata[]
  selectedDocument: DocumentContent | null
  loading: boolean
  error: string | null
  syncing: boolean
}

/**
 * Props for DocumentIntegration
 */
export interface DocumentIntegrationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Enabled platforms */
  platforms?: DocumentPlatform[]
  /** Initial documents */
  initialDocuments?: DocumentMetadata[]
  /** Callback when document selected */
  onDocumentSelect?: (document: DocumentContent) => void
  /** Callback when document content extracted */
  onContentExtract?: (content: DocumentContent) => void
  /** Callback when document exported */
  onExport?: (documentId: string, options: DocumentExportOptions) => Promise<Blob>
  /** Custom fetch function */
  fetchDocument?: (id: string, platform: DocumentPlatform) => Promise<DocumentContent>
  /** Custom list function */
  listDocuments?: (platform: DocumentPlatform) => Promise<DocumentMetadata[]>
  /** Show platform selector */
  showPlatformSelector?: boolean
  /** Allow multi-select */
  multiSelect?: boolean
  /** Max documents to display */
  maxDocuments?: number
}

/**
 * Platform configuration
 */
const PLATFORM_CONFIG: Record<DocumentPlatform, { name: string; icon: string; color: string }> = {
  'google-docs': { name: 'Google Docs', icon: '📄', color: '#4285F4' },
  'google-sheets': { name: 'Google Sheets', icon: '📊', color: '#0F9D58' },
  'google-slides': { name: 'Google Slides', icon: '📽️', color: '#F4B400' },
  'notion': { name: 'Notion', icon: '📝', color: '#000000' },
  'confluence': { name: 'Confluence', icon: '📘', color: '#0052CC' },
  'dropbox': { name: 'Dropbox', icon: '📦', color: '#0061FF' },
  'onedrive': { name: 'OneDrive', icon: '☁️', color: '#0078D4' },
  'sharepoint': { name: 'SharePoint', icon: '🔗', color: '#038387' },
  'local': { name: 'Local File', icon: '💾', color: '#6B7280' },
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * DocumentIntegration Component
 *
 * Integrate with external document platforms for:
 * - Document browsing and selection
 * - Content extraction for RAG
 * - Document export
 * - Cross-platform sync
 */
export const DocumentIntegration = React.forwardRef<HTMLDivElement, DocumentIntegrationProps>(
  function DocumentIntegration(
    {
      platforms = ['google-docs', 'notion', 'local'],
      initialDocuments = [],
      onDocumentSelect,
      onContentExtract,
      onExport,
      fetchDocument,
      listDocuments,
      showPlatformSelector = true,
      multiSelect = false,
      maxDocuments = 50,
      className,
      ...props
    },
    ref
  ) {
  const isMounted = useIsMounted()
  const [state, setState] = React.useState<DocumentIntegrationState>({
    documents: initialDocuments,
    selectedDocument: null,
    loading: false,
    error: null,
    syncing: false,
  })

  // Handle empty platforms array safely and filter out invalid platforms
  const validPlatforms = platforms.filter(p => PLATFORM_CONFIG[p] !== undefined)
  const safePlatforms = validPlatforms.length > 0 ? validPlatforms : ['local' as DocumentPlatform]
  const [selectedPlatform, setSelectedPlatform] = React.useState<DocumentPlatform>(safePlatforms[0])
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Clear error helper
  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Load documents from platform
  const loadDocuments = React.useCallback(async (platform: DocumentPlatform) => {
    if (!listDocuments) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const docs = await listDocuments(platform)
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          documents: docs.slice(0, maxDocuments),
          loading: false,
        }))
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load documents',
          loading: false,
        }))
      }
    }
  }, [listDocuments, maxDocuments, isMounted])

  // Select document and fetch content
  const selectDocument = React.useCallback(async (doc: DocumentMetadata) => {
    if (!fetchDocument) {
      // If no fetch function, just notify selection
      onDocumentSelect?.({
        id: doc.id,
        text: '',
        metadata: doc,
      })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const content = await fetchDocument(doc.id, doc.platform)
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          selectedDocument: content,
          loading: false,
        }))
        onDocumentSelect?.(content)
        onContentExtract?.(content)
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch document',
          loading: false,
        }))
      }
    }
  }, [fetchDocument, onDocumentSelect, onContentExtract, isMounted])

  // Toggle document selection (for multi-select)
  const toggleSelection = React.useCallback((docId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(docId)) {
        newSet.delete(docId)
      } else {
        newSet.add(docId)
      }
      return newSet
    })
  }, [])

  // Export document
  const exportDocument = React.useCallback(async (docId: string, options: DocumentExportOptions) => {
    if (!onExport) return

    setState(prev => ({ ...prev, syncing: true }))

    let objectUrl: string | null = null

    try {
      const blob = await onExport(docId, options)
      if (!isMounted.current) return

      // Trigger download with proper cleanup
      objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `document.${options.format}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      // Delay removal to ensure download starts
      setTimeout(() => {
        if (a.parentNode) {
          document.body.removeChild(a)
        }
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
      }, 100)
    } catch (error) {
      // Clean up URL if created
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Export failed',
        }))
      }
    } finally {
      if (isMounted.current) {
        setState(prev => ({ ...prev, syncing: false }))
      }
    }
  }, [onExport, isMounted])

  // Load documents when platform changes
  React.useEffect(() => {
    if (listDocuments) {
      loadDocuments(selectedPlatform)
    }
  }, [selectedPlatform, loadDocuments, listDocuments])

  return (
    <div ref={ref} className={cn('space-y-4', className)} role="region" aria-label="Document integration" {...props}>
      {/* Platform selector */}
      {showPlatformSelector && safePlatforms.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Document platforms">
          {safePlatforms.map(platform => {
            const config = PLATFORM_CONFIG[platform]
            return (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className="gap-2"
                role="tab"
                aria-selected={selectedPlatform === platform}
                aria-label={`Select ${config.name}`}
              >
                <span aria-hidden="true">{config.icon}</span>
                <span>{config.name}</span>
              </Button>
            )
          })}
        </div>
      )}

      {/* Error display */}
      {state.error && (
        <div
          className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between"
          role="alert"
        >
          <span>{state.error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            aria-label="Dismiss error"
            className="ml-2 h-6 w-6 p-0"
          >
            <CloseIcon className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Loading state */}
      {state.loading && (
        <div className="flex items-center justify-center p-8">
          <RefreshIcon className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Document list */}
      {!state.loading && state.documents.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <AnimatePresence>
                {state.documents.map((doc, index) => {
                  const isSelected = selectedIds.has(doc.id)
                  const config = PLATFORM_CONFIG[doc.platform] || PLATFORM_CONFIG['local']

                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        'flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors',
                        isSelected && 'bg-primary/10'
                      )}
                      onClick={() => {
                        if (multiSelect) {
                          toggleSelection(doc.id)
                        } else {
                          selectDocument(doc)
                        }
                      }}
                    >
                      {/* Selection checkbox for multi-select */}
                      {multiSelect && (
                        <div
                          className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center',
                            isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                          )}
                        >
                          {isSelected && <CheckIcon className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      )}

                      {/* Document icon */}
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        {doc.thumbnail ? (
                          <img src={doc.thumbnail} alt="" className="w-full h-full object-cover rounded" />
                        ) : (
                          <FileIcon className="w-5 h-5" style={{ color: config.color }} />
                        )}
                      </div>

                      {/* Document info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>-</span>
                          <span>{formatDate(doc.modifiedAt)}</span>
                          {doc.shared && (
                            <Badge variant="secondary" className="text-xs">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {onExport && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              exportDocument(doc.id, { format: 'pdf' })
                            }}
                            disabled={state.syncing}
                            aria-label="Export document"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!state.loading && state.documents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileIcon className="w-12 h-12 text-muted-foreground mb-3" />
          <div className="text-muted-foreground">No documents found</div>
          {listDocuments && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDocuments(selectedPlatform)}
              className="mt-3"
            >
              Refresh
            </Button>
          )}
        </div>
      )}

      {/* Selected document preview */}
      {state.selectedDocument && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">{state.selectedDocument.metadata.title}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, selectedDocument: null }))}
              >
                Close
              </Button>
            </div>
            <div className="text-sm text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap">
              {state.selectedDocument.text.slice(0, 500)}
              {state.selectedDocument.text.length > 500 && '...'}
            </div>
            {state.selectedDocument.chunks && (
              <div className="mt-3 text-xs text-muted-foreground">
                {state.selectedDocument.chunks.length} chunks extracted for RAG
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Multi-select actions */}
      {multiSelect && selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm">
            {selectedIds.size} document{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const selectedDocs = state.documents.filter(d => selectedIds.has(d.id))
                selectedDocs.forEach(doc => selectDocument(doc))
              }}
            >
              Import Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})

// Display name for debugging
DocumentIntegration.displayName = 'DocumentIntegration'

/**
 * Hook for document integration
 */
export function useDocumentIntegration(options: {
  platform?: DocumentPlatform
  apiEndpoint?: string
  apiKey?: string
}) {
  const [documents, setDocuments] = React.useState<DocumentMetadata[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // List documents
  const listDocuments = React.useCallback(async (platform?: DocumentPlatform) => {
    const targetPlatform = platform || options.platform || 'local'
    setLoading(true)
    setError(null)

    try {
      if (options.apiEndpoint) {
        const response = await fetch(`${options.apiEndpoint}/documents?platform=${targetPlatform}`, {
          headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        setDocuments(data.documents || [])
        return data.documents || []
      }

      // Local implementation placeholder
      return []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to list documents'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options.platform, options.apiEndpoint, options.apiKey])

  // Fetch document content
  const fetchDocument = React.useCallback(async (
    id: string,
    platform?: DocumentPlatform
  ): Promise<DocumentContent> => {
    const targetPlatform = platform || options.platform || 'local'
    setLoading(true)
    setError(null)

    try {
      if (options.apiEndpoint) {
        const response = await fetch(`${options.apiEndpoint}/documents/${id}?platform=${targetPlatform}`, {
          headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return await response.json()
      }

      throw new Error('No API endpoint configured')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch document'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options.platform, options.apiEndpoint, options.apiKey])

  // Extract content for RAG
  const extractContent = React.useCallback(async (
    document: DocumentContent,
    chunkSize = 1000,
    overlap = 200
  ): Promise<DocumentChunk[]> => {
    const text = document.text
    const chunks: DocumentChunk[] = []

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const content = text.slice(i, i + chunkSize)
      chunks.push({
        id: `${document.id}-chunk-${chunks.length}`,
        content,
        startIndex: i,
        endIndex: Math.min(i + chunkSize, text.length),
      })
    }

    return chunks
  }, [])

  // Export document
  const exportDocument = React.useCallback(async (
    id: string,
    exportOptions: DocumentExportOptions
  ): Promise<Blob> => {
    if (!options.apiEndpoint) {
      throw new Error('No API endpoint configured')
    }

    const response = await fetch(`${options.apiEndpoint}/documents/${id}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      body: JSON.stringify(exportOptions),
    })

    if (!response.ok) {
      throw new Error(`Export failed: HTTP ${response.status}`)
    }

    return await response.blob()
  }, [options.apiEndpoint, options.apiKey])

  return {
    documents,
    loading,
    error,
    listDocuments,
    fetchDocument,
    extractContent,
    exportDocument,
  }
}
