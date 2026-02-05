'use client'

import { useState, useRef } from 'react'
import {
  Card,
  Button,
  Badge,
  Input,
  Avatar,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  Paperclip,
  Send,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Archive,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Download,
  Eye,
} from 'lucide-react'

// ============================================================================
// FILE ATTACHMENT DEMO
// ============================================================================
export function FileAttachmentDemo() {
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    attachments?: Array<{
      id: string
      name: string
      size: number
      type: string
      url?: string
      preview?: string
    }>
  }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! You can upload files by dragging and dropping or clicking the attachment button.',
    },
  ])
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Array<{
    id: string
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'complete' | 'error'
    preview?: string
    error?: string
  }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon
    if (type.startsWith('video/')) return Video
    if (type.startsWith('audio/')) return Music
    if (type.includes('pdf')) return FileText
    if (type.includes('code') || type.includes('javascript') || type.includes('typescript')) return Code
    if (type.includes('zip') || type.includes('rar')) return Archive
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const validateFile = (file: File): string | undefined => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return `File too large (max 10MB)`
    }
    return undefined
  }

  const createPreview = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    }
    return undefined
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const error = validateFile(file)
      const preview = await createPreview(file)

      const attachment = {
        id: String(Date.now() + Math.random()),
        file,
        progress: 0,
        status: error ? ('error' as const) : ('pending' as const),
        preview,
        error,
      }

      setAttachments(prev => [...prev, attachment])

      // Simulate upload
      if (!error) {
        simulateUpload(attachment.id)
      }
    }
  }

  const simulateUpload = async (id: string) => {
    setAttachments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'uploading' as const } : a
    ))

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(r => setTimeout(r, 100))
      setAttachments(prev => prev.map(a =>
        a.id === id ? { ...a, progress } : a
      ))
    }

    setAttachments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'complete' as const, progress: 100 } : a
    ))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return

    const completeAttachments = attachments.filter(a => a.status === 'complete')

    const userMessage = {
      id: String(Date.now()),
      role: 'user' as const,
      content: input || 'Sent files',
      attachments: completeAttachments.map(a => ({
        id: a.id,
        name: a.file.name,
        size: a.file.size,
        type: a.file.type,
        preview: a.preview,
      })),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachments([])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: String(Date.now()),
        role: 'assistant' as const,
        content: completeAttachments.length > 0
          ? `I can see you've uploaded ${completeAttachments.length} file${completeAttachments.length > 1 ? 's' : ''}. How can I help you with ${completeAttachments.length > 1 ? 'them' : 'it'}?`
          : 'How can I help you?',
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <Card className="h-[700px] flex flex-col overflow-hidden glass-card border-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Paperclip className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">File Attachments</h3>
            <p className="text-xs text-muted-foreground">
              Upload images, documents, code, and more
            </p>
          </div>
        </div>
        <Badge variant="outline">{attachments.length} files</Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' && 'flex-row-reverse'
              )}
            >
              <Avatar
                fallback={msg.role === 'assistant' ? 'AI' : 'U'}
                className={cn(
                  'w-8 h-8 shrink-0',
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
                    : 'bg-primary text-primary-foreground'
                )}
              />
              <div
                className={cn(
                  'flex-1 space-y-2',
                  msg.role === 'user' && 'flex flex-col items-end'
                )}
              >
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[85%]',
                    msg.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>

                {/* Attachments in message */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-w-[85%]">
                    {msg.attachments.map((attachment) => {
                      const Icon = getFileIcon(attachment.type)
                      const isImage = attachment.type.startsWith('image/')

                      return (
                        <div
                          key={attachment.id}
                          className={cn(
                            'overflow-hidden rounded-lg border bg-card group',
                            isImage ? 'w-32 h-32' : 'w-48'
                          )}
                        >
                          {isImage && attachment.preview ? (
                            <div className="relative w-full h-full">
                              <img
                                src={attachment.preview}
                                alt={attachment.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-3">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Attachment Preview Area */}
      {attachments.length > 0 && (
        <div className="border-t border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">
              Attachments ({attachments.length})
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachments([])}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {attachments.map((attachment) => {
              const Icon = getFileIcon(attachment.file.type)
              const isImage = attachment.file.type.startsWith('image/')

              return (
                <div
                  key={attachment.id}
                  className={cn(
                    'relative rounded-lg border bg-card overflow-hidden group',
                    isImage ? 'w-20 h-20' : 'w-48'
                  )}
                >
                  {isImage && attachment.preview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={attachment.preview}
                        alt={attachment.file.name}
                        className="w-full h-full object-cover"
                      />
                      {attachment.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-xs font-medium">
                            {attachment.progress}%
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{attachment.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.status === 'uploading' ? `${attachment.progress}%` : formatFileSize(attachment.file.size)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Indicators */}
                  {attachment.status === 'complete' && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {attachment.status === 'error' && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {attachment.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${attachment.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Input Area with Drag & Drop */}
      <div
        className={cn(
          'relative p-4 border-t transition-colors',
          isDragging && 'bg-primary/5 border-primary'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Drop files here</p>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.js,.ts,.tsx,.jsx,.py,.json,.md"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or drag files here..."
              className="h-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() && attachments.filter(a => a.status === 'complete').length === 0}
            className="h-10 px-4 gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            Supports images, PDFs, documents, code files • Max 10MB per file
          </div>
        </div>
      </div>
    </Card>
  )
}
