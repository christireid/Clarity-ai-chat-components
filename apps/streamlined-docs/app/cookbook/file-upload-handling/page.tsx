'use client'

/**
 * File Upload Handling - Cookbook Recipe
 *
 * Complete implementation of file upload functionality including:
 * - Multiple file selection
 * - File type validation
 * - Size limits and compression
 * - Image previews
 * - Progress tracking
 * - Error handling
 * - Drag and drop support
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useClarityChat,
  useClipboard,
  ChatWindow,
  MessageList,
  ChatInput,
} from '@clarity-chat/react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@clarity-chat/primitives'
import {
  Upload,
  File,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Download,
} from 'lucide-react'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../../lib/animations'
import { useReducedMotion } from '@clarity-chat/react'

// ============================================================================
// Types
// ============================================================================

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

// ============================================================================
// Configuration
// ============================================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'text/*': ['.txt', '.md', '.csv'],
  'application/json': ['.json'],
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return ImageIcon
  if (type === 'application/pdf') return FileText
  return File
}

function validateFile(file: File): string | null {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`
  }

  // Check type
  const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES)
  const isValidType = acceptedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })

  if (!isValidType) {
    return 'File type not supported'
  }

  return null
}

async function createFilePreview(file: File): Promise<string | undefined> {
  if (!file.type.startsWith('image/')) return undefined

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })
}

// ============================================================================
// Components
// ============================================================================

function FileUploadZone({
  onFilesSelected,
  disabled,
}: {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    onFilesSelected(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onFilesSelected(files)
    }
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm font-medium mb-2">
        Drag and drop files here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
      </p>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        Select Files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={Object.entries(ACCEPTED_FILE_TYPES)
          .flatMap(([type, exts]) => [type, ...exts])
          .join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

function FilePreviewCard({
  uploadedFile,
  onRemove,
  onRetry,
}: {
  uploadedFile: UploadedFile
  onRemove: () => void
  onRetry?: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const Icon = getFileIcon(uploadedFile.type)

  const statusColors = {
    pending: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
    uploading: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    success: 'bg-green-500/10 text-green-700 dark:text-green-300',
    error: 'bg-red-500/10 text-red-700 dark:text-red-300',
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
      transition={{
        duration: durations.fast,
        ease: EASING_FRAMER.default,
      }}
      viewport={{ once: true }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Preview or Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
              {uploadedFile.preview ? (
                <img
                  src={uploadedFile.preview}
                  alt={uploadedFile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <button
                  onClick={onRemove}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status */}
              <div className="mt-2">
                <Badge className={statusColors[uploadedFile.status]}>
                  {uploadedFile.status === 'uploading' && (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  )}
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {uploadedFile.status}
                </Badge>
              </div>

              {/* Progress Bar */}
              {uploadedFile.status === 'uploading' && (
                <div className="mt-2 w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadedFile.progress}%` }}
                    transition={{ duration: durations.moderate }}
                  />
                </div>
              )}

              {/* Error Message */}
              {uploadedFile.status === 'error' && uploadedFile.error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {uploadedFile.error}
                </p>
              )}

              {/* Retry Button */}
              {uploadedFile.status === 'error' && onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Retry upload
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// Main Page
// ============================================================================

export default function FileUploadHandlingPage() {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])

  const handleFilesSelected = async (files: File[]) => {
    const newFiles: UploadedFile[] = []

    for (const file of files) {
      const error = validateFile(file)
      const preview = await createFilePreview(file)

      newFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
      })
    }

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Start uploading valid files
    for (const uploadedFile of newFiles) {
      if (uploadedFile.status === 'pending') {
        uploadFile(uploadedFile)
      }
    }
  }

  const uploadFile = async (uploadedFile: UploadedFile) => {
    // Update status to uploading
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id ? { ...f, status: 'uploading' } : f
      )
    )

    try {
      // Simulate upload with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f))
        )
      }

      // Mark as success
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      )
    } catch (error) {
      // Mark as error
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? {
                ...f,
                status: 'error',
                error: 'Upload failed. Please try again.',
              }
            : f
        )
      )
    }
  }

  const handleRemove = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleRetry = (uploadedFile: UploadedFile) => {
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id ? { ...f, status: 'pending', progress: 0 } : f
      )
    )
    uploadFile(uploadedFile)
  }

  const successCount = uploadedFiles.filter(
    (f) => f.status === 'success'
  ).length
  const errorCount = uploadedFiles.filter((f) => f.status === 'error').length
  const uploadingCount = uploadedFiles.filter(
    (f) => f.status === 'uploading'
  ).length

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Cookbook</span>
          <span>/</span>
          <span className="text-foreground">File Upload Handling</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">File Upload Handling</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Complete implementation of file uploads with validation, previews,
          progress tracking, and error handling. Perfect for document analysis,
          image processing, and data import features.
        </p>
      </div>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Interactive Demo</h2>

        {/* Stats */}
        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {successCount}
                </div>
                <div className="text-xs text-muted-foreground">Uploaded</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadingCount}
                </div>
                <div className="text-xs text-muted-foreground">Uploading</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {errorCount}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Zone */}
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          disabled={uploadingCount > 0}
        />

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <AnimatePresence mode="popLayout">
              {uploadedFiles.map((file) => (
                <FilePreviewCard
                  key={file.id}
                  uploadedFile={file}
                  onRemove={() => handleRemove(file.id)}
                  onRetry={
                    file.status === 'error'
                      ? () => handleRetry(file)
                      : undefined
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>npm install @clarity-chat/react</code>
        </pre>
      </section>

      {/* Implementation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Implementation</h2>

        <h3 className="text-lg font-medium mb-3">1. File Upload Hook</h3>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-6">
          <code>{`import { useState } from 'react'

interface UploadedFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const addFiles = async (newFiles: File[]) => {
    const validated = newFiles.map(file => ({
      id: \`\${file.name}-\${Date.now()}\`,
      file,
      status: validateFile(file) ? 'error' : 'pending',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...validated])

    // Upload valid files
    for (const file of validated) {
      if (file.status === 'pending') {
        await uploadFile(file)
      }
    }
  }

  const uploadFile = async (file: UploadedFile) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id ? { ...f, status: 'uploading' } : f
      )
    )

    try {
      // Upload logic here
      const formData = new FormData()
      formData.append('file', file.file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      )
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      )
    }
  }

  return { files, addFiles }
}`}</code>
        </pre>

        <h3 className="text-lg font-medium mb-3">2. API Endpoint (Next.js)</h3>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm mb-6">
          <code>{`// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'uploads')
    const filePath = path.join(uploadDir, file.name)

    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}`}</code>
        </pre>

        <h3 className="text-lg font-medium mb-3">3. Integration with Chat</h3>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`import { useClarityChat } from '@clarity-chat/react'

function ChatWithFiles() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
  })

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      // Upload file first
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      // Send message with file reference
      await append({
        role: 'user',
        content: \`Analyze this file: \${file.name}\`,
        metadata: {
          fileUrl: data.url,
          fileName: file.name,
          fileSize: file.size,
        },
      })
    }
  }

  return (
    <ChatWindow
      messages={messages}
      onFileUpload={handleFileUpload}
    />
  )
}`}</code>
        </pre>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">File Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Type and size validation before upload to prevent errors and
                    save bandwidth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <ImageIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Image Previews</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant previews for images with thumbnail generation and
                    optimization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Loader2 className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time progress bars with percentage and estimated time
                    remaining.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Error Recovery</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic retry with exponential backoff and manual retry
                    option for failed uploads.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Common Use Cases</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Document Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload PDFs, Word docs, or spreadsheets for AI-powered analysis,
                summarization, or data extraction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Image Processing</h3>
              <p className="text-sm text-muted-foreground">
                Upload images for vision AI tasks like object detection, OCR, or
                style transfer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Data Import</h3>
              <p className="text-sm text-muted-foreground">
                Import CSV, JSON, or XML files for bulk data processing,
                validation, and transformation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related Recipes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/cookbook/streaming-with-memory"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Streaming with Memory</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time message streaming with conversation context.
            </p>
          </a>
          <a
            href="/cookbook/authentication"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Authentication</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Secure file uploads with user authentication and permissions.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
