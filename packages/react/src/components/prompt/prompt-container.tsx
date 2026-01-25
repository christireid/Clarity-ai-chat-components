'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'
import { DURATION_SECONDS as durations } from '../../animations/constants'

/**
 * A single suggestion category with items
 */
export interface SuggestionCategory {
  /** Icon for the category (can be emoji or React node) */
  icon: React.ReactNode
  /** Category title */
  title: string
  /** Suggestion items within this category */
  items: string[]
  /** Optional description for the category */
  description?: string
}

/**
 * File attachment representation
 */
export interface FileAttachment {
  /** Unique identifier */
  id: string
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** Preview URL (for images) */
  previewUrl?: string
  /** Upload progress (0-100) */
  progress?: number
  /** Upload status */
  status?: 'uploading' | 'complete' | 'error'
  /** Error message if status is error */
  error?: string
}

/**
 * Props for PromptContainer component
 */
export interface PromptContainerProps {
  /** Main content (typically ChatInput) */
  children: React.ReactNode
  /** Suggestion categories to display above input */
  suggestions?: SuggestionCategory[]
  /** Callback when a suggestion is clicked */
  onSuggestionClick?: (text: string) => void
  /** File attachments */
  attachments?: FileAttachment[]
  /** Callback when attachment is removed */
  onRemoveAttachment?: (id: string) => void
  /** Callback when files are dropped/selected */
  onFilesAdd?: (files: File[]) => void
  /** Voice input button slot */
  voiceInputSlot?: React.ReactNode
  /** Templates picker slot */
  templatesSlot?: React.ReactNode
  /** Optional sidebar content */
  sidebar?: React.ReactNode
  /** Sidebar position */
  sidebarPosition?: 'left' | 'right'
  /** Show file drop zone */
  showDropZone?: boolean
  /** Whether files are being dragged over */
  isDragging?: boolean
  /** Maximum suggestions to show per category */
  maxSuggestionsPerCategory?: number
  /** Show suggestions in collapsed state initially */
  collapsedSuggestions?: boolean
  /** Layout variant */
  variant?: 'default' | 'compact' | 'floating'
  /** Custom class name */
  className?: string
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * PromptContainer Component
 *
 * A comprehensive container for prompt input with suggestions, file attachments,
 * and optional sidebar. Inspired by HeroUI Pro's Prompt Container patterns.
 *
 * Features:
 * - Categorized suggestion cards above input
 * - File attachment area with drag-and-drop
 * - Voice input button slot
 * - Templates picker slot
 * - Optional sidebar for additional context
 * - Animated transitions
 * - Accessible design
 *
 * @example
 * ```tsx
 * <PromptContainer
 *   suggestions={[
 *     { icon: '💡', title: 'Examples', items: ['Write a story', 'Explain code'] },
 *     { icon: '⚡', title: 'Capabilities', items: ['Answer questions', 'Generate code'] }
 *   ]}
 *   onSuggestionClick={(text) => setInput(text)}
 *   voiceInputSlot={<VoiceInput onTranscript={handleVoice} />}
 *   templatesSlot={<TemplatesPicker onSelect={handleTemplate} />}
 * >
 *   <ChatInput {...props} />
 * </PromptContainer>
 * ```
 */
export function PromptContainer({
  children,
  suggestions = [],
  onSuggestionClick,
  attachments = [],
  onRemoveAttachment,
  onFilesAdd,
  voiceInputSlot,
  templatesSlot,
  sidebar,
  sidebarPosition = 'right',
  showDropZone = false,
  isDragging = false,
  maxSuggestionsPerCategory = 4,
  collapsedSuggestions = false,
  variant = 'default',
  className,
}: PromptContainerProps) {
  const prefersReducedMotion = useReducedMotion()
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    () => new Set(collapsedSuggestions ? [] : suggestions.map((s) => s.title))
  )
  const dropZoneRef = React.useRef<HTMLDivElement>(null)

  // Handle file drop
  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (onFilesAdd && e.dataTransfer.files.length > 0) {
        onFilesAdd(Array.from(e.dataTransfer.files))
      }
    },
    [onFilesAdd]
  )

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Toggle category expansion
  const toggleCategory = React.useCallback((title: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }, [])

  const hasSuggestions = suggestions.length > 0
  const hasAttachments = attachments.length > 0
  const hasSidebar = !!sidebar

  const containerClasses = cn(
    'relative flex flex-col',
    variant === 'default' && 'w-full',
    variant === 'compact' && 'max-w-2xl mx-auto',
    variant === 'floating' && [
      'max-w-3xl mx-auto',
      'bg-card/95 backdrop-blur-xl',
      'border border-border/40',
      'rounded-2xl shadow-2xl',
      'p-4',
    ],
    className
  )

  return (
    <div className={containerClasses}>
      {/* Main layout with optional sidebar */}
      <div
        className={cn(
          'flex',
          hasSidebar && sidebarPosition === 'left' && 'flex-row',
          hasSidebar && sidebarPosition === 'right' && 'flex-row-reverse'
        )}
      >
        {/* Sidebar */}
        {hasSidebar && (
          <aside
            className={cn(
              'flex-shrink-0 w-64 border-border/40',
              sidebarPosition === 'left' ? 'border-r pr-4 mr-4' : 'border-l pl-4 ml-4'
            )}
          >
            {sidebar}
          </aside>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Suggestions area */}
          {hasSuggestions && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
              className="mb-4 space-y-3"
            >
              {suggestions.map((category, categoryIndex) => {
                const isExpanded = expandedCategories.has(category.title)
                const displayItems = isExpanded
                  ? category.items
                  : category.items.slice(0, maxSuggestionsPerCategory)

                return (
                  <motion.div
                    key={category.title}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 25,
                      stiffness: 300,
                      delay: categoryIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                      {/* Category header */}
                      <button
                        onClick={() => toggleCategory(category.title)}
                        className={cn(
                          'flex items-center gap-2 w-full text-left',
                          'px-2 py-1 -mx-2 rounded-lg',
                          'hover:bg-muted/50 transition-colors duration-150',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                        )}
                        aria-expanded={isExpanded}
                      >
                        <span className="flex-shrink-0 text-lg">{category.icon}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {category.title}
                        </span>
                        {category.description && (
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            - {category.description}
                          </span>
                        )}
                        <svg
                          className={cn(
                            'w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                    {/* Suggestion items */}
                    {isExpanded && (
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                        transition={{ duration: durations.fast }}
                        className="flex flex-wrap gap-2 pl-7"
                      >
                        {displayItems.map((item, itemIndex) => (
                          <motion.button
                            key={item}
                            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                            transition={{
                              type: 'spring',
                              damping: 22,
                              stiffness: 300,
                              delay: itemIndex * 0.03,
                            }}
                            viewport={{ once: true }}
                            onClick={() => onSuggestionClick?.(item)}
                            className={cn(
                              'group px-3 py-1.5 rounded-full text-sm',
                              'bg-muted/50 hover:bg-primary/10',
                              'border border-border/40 hover:border-primary/30',
                              'text-foreground/80 hover:text-primary',
                              'transition-all duration-200 ease-out',
                              'hover:-translate-y-0.5 hover:shadow-sm',
                              'active:scale-[0.98] active:translate-y-0',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                            )}
                          >
                            {item}
                          </motion.button>
                        ))}
                        {!isExpanded && category.items.length > maxSuggestionsPerCategory && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{category.items.length - maxSuggestionsPerCategory} more
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* File attachments area */}
          {hasAttachments && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
              transition={{ duration: durations.fast }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  viewport={{ once: true }}
                  className={cn(
                    'group relative flex items-center gap-2 px-3 py-2',
                    'bg-muted/50 hover:bg-muted/70',
                    'border border-border/40 rounded-xl',
                    'transition-colors duration-150',
                    attachment.status === 'error' && 'border-destructive/50 bg-destructive/5'
                  )}
                >
                    {/* File icon based on type */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                      {attachment.previewUrl ? (
                        <img
                          src={attachment.previewUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attachment.status === 'error'
                          ? attachment.error || 'Upload failed'
                          : attachment.status === 'uploading'
                            ? `${attachment.progress || 0}%`
                            : formatFileSize(attachment.size)}
                      </p>
                    </div>

                  {/* Progress bar for uploading */}
                  {attachment.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={prefersReducedMotion ? false : { width: 0 }}
                        animate={{ width: `${attachment.progress || 0}%` }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      />
                    </div>
                  )}

                  {/* Remove button */}
                  {onRemoveAttachment && (
                    <button
                      onClick={() => onRemoveAttachment(attachment.id)}
                      className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full',
                        'flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100',
                        'bg-muted hover:bg-destructive/10',
                        'text-muted-foreground hover:text-destructive',
                        'transition-all duration-150',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                      )}
                      aria-label={`Remove ${attachment.name}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Drop zone overlay */}
          {(showDropZone || isDragging) && (
            <motion.div
              ref={dropZoneRef}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? false : { opacity: 0 }}
              transition={{ duration: durations.fast }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={cn(
                'absolute inset-0 z-10',
                'flex items-center justify-center',
                'bg-primary/5 backdrop-blur-sm',
                'border-2 border-dashed border-primary/30',
                'rounded-xl',
                isDragging && 'border-primary/50 bg-primary/10'
              )}
            >
                <div className="text-center p-6">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-primary/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium text-foreground/80">
                    Drop files here to attach
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
              </div>
            </motion.div>
          )}

          {/* Input area with slots */}
          <div className="relative">
            {/* Slots container */}
            {(voiceInputSlot || templatesSlot) && (
              <div className="flex items-center gap-2 mb-2">
                {templatesSlot && (
                  <div className="flex-shrink-0">{templatesSlot}</div>
                )}
                <div className="flex-1" />
                {voiceInputSlot && (
                  <div className="flex-shrink-0">{voiceInputSlot}</div>
                )}
              </div>
            )}

            {/* Main input (children) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

PromptContainer.displayName = 'PromptContainer'

/**
 * Hook for managing file attachments
 */
export function useFileAttachments(options?: {
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  onError?: (error: string) => void
}) {
  const {
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes,
    onError,
  } = options || {}

  const [attachments, setAttachments] = React.useState<FileAttachment[]>([])
  const [isDragging, setIsDragging] = React.useState(false)

  const addFiles = React.useCallback(
    (files: File[]) => {
      const newAttachments: FileAttachment[] = []

      for (const file of files) {
        // Check max files
        if (attachments.length + newAttachments.length >= maxFiles) {
          onError?.(`Maximum ${maxFiles} files allowed`)
          break
        }

        // Check file size
        if (file.size > maxSize) {
          onError?.(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`)
          continue
        }

        // Check file type
        if (allowedTypes && !allowedTypes.some((type) => file.type.startsWith(type))) {
          onError?.(`${file.name} is not an allowed file type`)
          continue
        }

        // Create attachment
        const attachment: FileAttachment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'complete',
        }

        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setAttachments((prev) =>
              prev.map((a) =>
                a.id === attachment.id
                  ? { ...a, previewUrl: e.target?.result as string }
                  : a
              )
            )
          }
          reader.readAsDataURL(file)
        }

        newAttachments.push(attachment)
      }

      if (newAttachments.length > 0) {
        setAttachments((prev) => [...prev, ...newAttachments])
      }
    },
    [attachments.length, maxFiles, maxSize, allowedTypes, onError]
  )

  const removeAttachment = React.useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const clearAttachments = React.useCallback(() => {
    setAttachments([])
  }, [])

  return {
    attachments,
    isDragging,
    setIsDragging,
    addFiles,
    removeAttachment,
    clearAttachments,
  }
}
