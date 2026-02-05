/**
 * EnhancedChatInput - Fully functional chat input with all features
 *
 * Features:
 * - Real message sending
 * - Slash command support
 * - Mention/@ command support
 * - File upload functionality
 * - Voice input integration
 * - Glassmorphism styling
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Badge,
  Textarea,
  cn,
  glassVariants
} from '@clarity-chat/primitives'
import {
  VoiceInput,
  SlashCommandMenu
} from '@clarity-chat/react'
import {
  FileUpload
} from '@clarity-chat/react/internal'
import type { MessageAttachment } from '@clarity-chat/types'
import {
  Send,
  Paperclip,
  Smile,
  AtSign,
  Slash,
  X
} from 'lucide-react'

// Slash commands configuration
const slashCommands = [
  {
    name: '/search',
    description: 'Search through messages',
    icon: ({ size, className }: any) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8" strokeWidth="2"/>
        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    category: 'Tools',
  },
  {
    name: '/code',
    description: 'Insert code block',
    icon: ({ size, className }: any) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="16 18 22 12 16 6" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="8 6 2 12 8 18" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    category: 'Formatting',
  },
  {
    name: '/image',
    description: 'Upload an image',
    icon: ({ size, className }: any) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
        <polyline points="21 15 16 10 5 21" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    category: 'Media',
  },
  {
    name: '/help',
    description: 'Show help documentation',
    icon: ({ size, className }: any) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    category: 'Tools',
  },
]

// Mention suggestions
const mentionSuggestions = [
  { id: '1', name: 'AI Assistant', avatar: '🤖' },
  { id: '2', name: 'Support Team', avatar: '💬' },
  { id: '3', name: 'Documentation', avatar: '📚' },
  { id: '4', name: 'Community', avatar: '👥' },
]

export interface EnhancedChatInputProps {
  value: string
  onChange: (value: string) => void
  onSendMessage: (content: string, attachments?: MessageAttachment[]) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
}

export function EnhancedChatInput({
  value,
  onChange,
  onSendMessage,
  placeholder = 'Type a message... Use / for commands, @ to mention',
  disabled = false,
  maxLength = 2000,
  className,
}: EnhancedChatInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showMentionMenu, setShowMentionMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [mentionQuery, setMentionQuery] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileUploadRef = useRef<HTMLDivElement>(null)

  // Detect slash commands
  useEffect(() => {
    const beforeCursor = value.slice(0, cursorPosition)
    const match = beforeCursor.match(/\/(\w*)$/)

    if (match) {
      setShowSlashMenu(true)
      setSlashQuery(match[1])
    } else {
      setShowSlashMenu(false)
      setSlashQuery('')
    }
  }, [value, cursorPosition])

  // Detect mentions
  useEffect(() => {
    const beforeCursor = value.slice(0, cursorPosition)
    const match = beforeCursor.match(/@(\w*)$/)

    if (match) {
      setShowMentionMenu(true)
      setMentionQuery(match[1])
    } else {
      setShowMentionMenu(false)
      setMentionQuery('')
    }
  }, [value, cursorPosition])

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setCursorPosition(e.target.selectionStart || 0)
  }

  // Handle slash command selection
  const handleSlashSelect = useCallback((command: any) => {
    const beforeCursor = value.slice(0, cursorPosition)
    const afterCursor = value.slice(cursorPosition)
    const beforeCommand = beforeCursor.replace(/\/\w*$/, '')

    const newValue = `${beforeCommand}${command.name} ${afterCursor}`
    onChange(newValue)
    setShowSlashMenu(false)

    // Focus and set cursor after command
    setTimeout(() => {
      textareaRef.current?.focus()
      const newPosition = beforeCommand.length + command.name.length + 1
      textareaRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }, [value, cursorPosition, onChange])

  // Handle mention selection
  const handleMentionSelect = useCallback((mention: typeof mentionSuggestions[0]) => {
    const beforeCursor = value.slice(0, cursorPosition)
    const afterCursor = value.slice(cursorPosition)
    const beforeMention = beforeCursor.replace(/@\w*$/, '')

    const newValue = `${beforeMention}@${mention.name} ${afterCursor}`
    onChange(newValue)
    setShowMentionMenu(false)

    // Focus and set cursor after mention
    setTimeout(() => {
      textareaRef.current?.focus()
      const newPosition = beforeMention.length + mention.name.length + 2
      textareaRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }, [value, cursorPosition, onChange])

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    const newValue = value ? `${value} ${transcript}` : transcript
    onChange(newValue)
  }, [value, onChange])

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]): Promise<MessageAttachment[]> => {
    // Create mock attachments (in real app, upload to server)
    const newAttachments: MessageAttachment[] = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }))

    setAttachments(prev => [...prev, ...newAttachments])
    setShowFileUpload(false)

    return newAttachments
  }, [])

  // Remove attachment
  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }, [])

  // Handle send
  const handleSend = useCallback(() => {
    if (!value.trim() && attachments.length === 0) return
    if (disabled) return

    onSendMessage(value, attachments.length > 0 ? attachments : undefined)
    onChange('')
    setAttachments([])
  }, [value, attachments, disabled, onSendMessage, onChange])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Update cursor position
    setCursorPosition(e.currentTarget.selectionStart || 0)

    // Enter to send (without shift)
    if (e.key === 'Enter' && !e.shiftKey && !showSlashMenu && !showMentionMenu) {
      e.preventDefault()
      handleSend()
    }
  }

  const charCount = value.length
  const isOverLimit = charCount > maxLength
  const isNearLimit = charCount >= maxLength * 0.8
  const hasContent = value.trim().length > 0 || attachments.length > 0

  // Filter mention suggestions
  const filteredMentions = mentionQuery
    ? mentionSuggestions.filter(m =>
        m.name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
    : mentionSuggestions

  return (
    <div className={cn('relative', className)}>
      {/* Slash Command Menu */}
      <SlashCommandMenu
        commands={slashCommands}
        isOpen={showSlashMenu}
        onSelect={handleSlashSelect}
        onClose={() => setShowSlashMenu(false)}
        query={slashQuery}
        position="above"
      />

      {/* Mention Menu */}
      <AnimatePresence>
        {showMentionMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
              'absolute bottom-full left-0 right-0 mb-2 z-50',
              'glass-strong rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20',
              'max-h-[200px] overflow-y-auto scrollbar-hide'
            )}
          >
            <div className="sticky top-0 glass-subtle border-b border-white/10 dark:border-white/5 px-3 py-2.5 flex items-center gap-2">
              <AtSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Mention
              </span>
              {mentionQuery && (
                <span className="badge-glass text-xs ml-auto">
                  @{mentionQuery}
                </span>
              )}
            </div>

            <div className="p-1">
              {filteredMentions.map((mention) => (
                <button
                  key={mention.id}
                  onClick={() => handleMentionSelect(mention)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-left transition-all duration-200',
                    'hover:glass text-foreground hover:glow-sm'
                  )}
                >
                  <span className="text-2xl">{mention.avatar}</span>
                  <span className="text-sm font-medium">{mention.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Upload Modal */}
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFileUpload(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Files</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileUpload(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <FileUpload
                onUpload={handleFileUpload}
                maxFiles={5}
                maxFileSize={10 * 1024 * 1024}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <motion.div
        className={cn(
          glassVariants({
            intensity: 'strong',
            gradient: 'none',
            border: 'none',
            animated: 'none',
          }),
          'relative flex flex-col gap-3 px-5 py-4',
          'border-t border-glass-light dark:border-glass-dark-light',
          isFocused && 'ring-2 ring-primary/20'
        )}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 4px hsl(var(--primary) / 0.15)'
            : '0 0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 flex-wrap"
            >
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="glass rounded-xl p-2 flex items-center gap-2 group"
                >
                  {attachment.type === 'image' && attachment.url ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 glass rounded-lg flex items-center justify-center">
                      <Paperclip className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div className="flex gap-3 items-end">
          {/* Textarea */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              autoResize
              maxRows={6}
              variant={isOverLimit ? 'error' : 'default'}
              className={cn(
                'transition-all duration-200 shadow-sm border-border/40 pr-20',
                isFocused && 'ring-2 ring-ring/30 shadow-md border-ring/50'
              )}
            />

            {/* Inline Actions */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              {/* Voice Input */}
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                size="sm"
                variant="ghost"
                showInterim
                autoSubmit={false}
              />

              {/* Slash Command Trigger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(value + '/')
                  textareaRef.current?.focus()
                }}
                className="h-8 w-8 p-0"
                title="Insert slash command"
              >
                <Slash className="w-4 h-4" />
              </Button>

              {/* Mention Trigger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(value + '@')
                  textareaRef.current?.focus()
                }}
                className="h-8 w-8 p-0"
                title="Mention someone"
              >
                <AtSign className="w-4 h-4" />
              </Button>

              {/* File Upload Trigger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(true)}
                className="h-8 w-8 p-0"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {/* Character Counter */}
            {charCount > 0 && (
              <div className="absolute top-2 right-3 text-xs tabular-nums">
                <span
                  className={cn(
                    isOverLimit
                      ? 'text-destructive font-semibold'
                      : isNearLimit
                        ? 'text-warning font-medium'
                        : 'text-muted-foreground'
                  )}
                >
                  {charCount}/{maxLength}
                </span>
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || !hasContent || isOverLimit}
            size="icon"
            className={cn(
              'transition-all duration-200 ease-out shrink-0 h-11 w-11 rounded-xl',
              hasContent && !isOverLimit
                ? [
                    'bg-gradient-to-br from-primary via-primary to-primary/85',
                    'text-primary-foreground',
                    'shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.4)]',
                    'hover:shadow-[0_6px_20px_-3px_hsl(var(--primary)/0.5)]',
                    'hover:scale-[1.03] hover:-translate-y-0.5',
                    'active:scale-[0.97] active:translate-y-0',
                  ]
                : 'bg-muted/50 text-muted-foreground'
            )}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Error Message */}
        {isOverLimit && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive px-1 font-medium"
          >
            Message exceeds maximum length by {charCount - maxLength} characters
          </motion.p>
        )}

        {/* Helper Text */}
        {isFocused && !hasContent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground/80 px-1"
          >
            Press{' '}
            <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50">
              Enter
            </kbd>{' '}
            to send •{' '}
            <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50">
              /
            </kbd>{' '}
            for commands •{' '}
            <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50">
              @
            </kbd>{' '}
            to mention
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
