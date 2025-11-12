import { useState, useRef, useEffect, useTransition, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea, Button, Badge, cn } from '@clarity-chat/primitives'
import type { SavedPrompt, MessageAttachment } from '@clarity-chat/types'

export interface InputSuggestion {
  id: string
  type: 'prompt' | 'command' | 'mention'
  label: string
  description?: string
  value: string
  icon?: string
}

export interface AdvancedChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments?: MessageAttachment[]) => void
  
  // Autocomplete features
  suggestions?: InputSuggestion[]
  onSuggestionRequest?: (query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>
  
  // File upload
  onFileUpload?: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  acceptedFileTypes?: string[]
  
  // Link preview
  onLinkPaste?: (url: string) => Promise<{ title: string; description?: string; image?: string }>
  
  // Prompts
  savedPrompts?: SavedPrompt[]
  onPromptSelect?: (prompt: SavedPrompt) => void
  
  // State
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  className?: string
}

// Default commands - extracted as constant
const DEFAULT_COMMANDS: InputSuggestion[] = [
  { id: '1', type: 'command', label: 'help', description: 'Show available commands', value: '/help' },
  { id: '2', type: 'command', label: 'clear', description: 'Clear conversation', value: '/clear' },
  { id: '3', type: 'command', label: 'export', description: 'Export chat', value: '/export' },
  { id: '4', type: 'command', label: 'model', description: 'Switch AI model', value: '/model' },
] as const

export const AdvancedChatInput = forwardRef<HTMLTextAreaElement, AdvancedChatInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onSuggestionRequest,
      onFileUpload,
      maxFiles = 5,
      acceptedFileTypes = ['image/*', 'application/pdf', '.txt', '.doc', '.docx'],
      savedPrompts = [],
      disabled = false,
      placeholder = 'Type a message... Use @ for prompts, / for commands',
      maxLength,
      className,
    },
    ref
  ) => {
    const [attachments, setAttachments] = useState<MessageAttachment[]>([])
    const [suggestions, setSuggestions] = useState<InputSuggestion[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [triggerChar, setTriggerChar] = useState<'@' | '/' | null>(null)
    const [cursorPosition, setCursorPosition] = useState(0)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // React Concurrent Features - useTransition for non-blocking suggestion updates
    const [isPending, startTransition] = useTransition()

    // Merge refs
    useImperativeHandle(ref, () => textareaRef.current!)

    // Memoized loadSuggestions function
    const loadSuggestions = useCallback(async (query: string, trigger: '@' | '/') => {
      // Use startTransition to make suggestion updates non-blocking
      startTransition(() => {
        if (onSuggestionRequest) {
          // For async requests, handle outside of transition
          onSuggestionRequest(query, trigger).then((results) => {
            startTransition(() => {
              setSuggestions(results)
              setSelectedIndex(0)
            })
          })
        } else {
          // Default suggestions
          if (trigger === '@') {
            const filtered = savedPrompts
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .map((p) => ({
                id: p.id,
                type: 'prompt' as const,
                label: p.name,
                description: p.description,
                value: p.content,
              }))
            setSuggestions(filtered)
          } else if (trigger === '/') {
            const filtered = DEFAULT_COMMANDS.filter((c) => c.label.includes(query.toLowerCase()))
            setSuggestions(filtered)
          }
          setSelectedIndex(0)
        }
      })
    }, [onSuggestionRequest, savedPrompts])

    // Handle @ mentions and / commands
    useEffect(() => {
      const checkForTrigger = () => {
        const beforeCursor = value.slice(0, cursorPosition)
        const lastAtIndex = beforeCursor.lastIndexOf('@')
        const lastSlashIndex = beforeCursor.lastIndexOf('/')
        const lastSpaceIndex = beforeCursor.lastIndexOf(' ')

        // Check if @ or / is the last trigger before cursor and after last space
        if (lastAtIndex > lastSpaceIndex && lastAtIndex === beforeCursor.length - 1) {
          setTriggerChar('@')
          setShowSuggestions(true)
          loadSuggestions('', '@')
        } else if (lastSlashIndex > lastSpaceIndex && lastSlashIndex === beforeCursor.length - 1) {
          setTriggerChar('/')
          setShowSuggestions(true)
          loadSuggestions('', '/')
        } else if (lastAtIndex > lastSpaceIndex) {
          const query = beforeCursor.slice(lastAtIndex + 1)
          if (!query.includes(' ')) {
            setTriggerChar('@')
            setShowSuggestions(true)
            loadSuggestions(query, '@')
          }
        } else if (lastSlashIndex > lastSpaceIndex) {
          const query = beforeCursor.slice(lastSlashIndex + 1)
          if (!query.includes(' ')) {
            setTriggerChar('/')
            setShowSuggestions(true)
            loadSuggestions(query, '/')
          }
        } else {
          setShowSuggestions(false)
          setTriggerChar(null)
        }
      }

      checkForTrigger()
    }, [value, cursorPosition, loadSuggestions])

    // Memoized selectSuggestion handler
    const selectSuggestion = useCallback((suggestion: InputSuggestion) => {
      const beforeCursor = value.slice(0, cursorPosition)
      const afterCursor = value.slice(cursorPosition)
      
      // Find the trigger position
      const triggerIndex = triggerChar === '@' 
        ? beforeCursor.lastIndexOf('@')
        : beforeCursor.lastIndexOf('/')

      const newValue = beforeCursor.slice(0, triggerIndex) + suggestion.value + ' ' + afterCursor
      onChange(newValue)
      setShowSuggestions(false)
      setTriggerChar(null)

      // Focus back to textarea
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }, [value, cursorPosition, triggerChar, onChange])

    // Memoize keyboard handler to prevent recreation on every render
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Handle suggestions navigation
        if (showSuggestions && suggestions.length > 0) {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev + 1) % suggestions.length)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
          } else if (e.key === 'Tab' || e.key === 'Enter') {
            if (showSuggestions) {
              e.preventDefault()
              selectSuggestion(suggestions[selectedIndex])
              return
            }
          } else if (e.key === 'Escape') {
            e.preventDefault()
            setShowSuggestions(false)
            return
          }
        }

        // Handle submit
        if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
          e.preventDefault()
          handleSubmit()
        }
      },
      [showSuggestions, suggestions, selectedIndex, selectSuggestion]
    )

    // Memoize cursor change handler
    const handleCursorChange = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement
      setCursorPosition(target.selectionStart)
    }, [])

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      if (attachments.length + files.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      setIsUploading(true)
      try {
        if (onFileUpload) {
          const newAttachments = await onFileUpload(files)
          setAttachments((prev) => [...prev, ...newAttachments])
        } else {
          // Default: create attachments from files
          const newAttachments: MessageAttachment[] = files.map((file) => ({
            id: `${Date.now()}-${file.name}`,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            name: file.name,
            size: file.size,
            mimeType: file.type,
            url: URL.createObjectURL(file),
          }))
          setAttachments((prev) => [...prev, ...newAttachments])
        }
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }, [attachments.length, maxFiles, onFileUpload])

    // Memoize drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDrop = useCallback(async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) return

      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        files.forEach(file => dataTransfer.items.add(file))
        input.files = dataTransfer.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }, [])

    // Memoize attachment removal
    const removeAttachment = useCallback((id: string) => {
      setAttachments((prev) => prev.filter((a) => a.id !== id))
    }, [])

    // Memoize submit handler
    const handleSubmit = useCallback(() => {
      if (value.trim() || attachments.length > 0) {
        onSubmit(value, attachments.length > 0 ? attachments : undefined)
        onChange('')
        setAttachments([])
      }
    }, [value, attachments, onSubmit, onChange])

    // Memoized computed values
    const charCount = useMemo(() => value.length, [value])
    const isOverLimit = useMemo(() => (maxLength ? charCount > maxLength : false), [maxLength, charCount])
    const canSubmit = useMemo(() => value.trim() || attachments.length > 0, [value, attachments.length])

    return (
      <div className={cn('relative border-t bg-background', className)}>
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 p-4 pb-0 overflow-x-auto"
            >
              {attachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                >
                  {attachment.type === 'image' && attachment.url && (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    {attachment.size && (
                      <p className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${attachment.name}`}
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-popover border border-border/60 rounded-lg shadow-[0_24px_48px_rgba(15,23,42,0.32)] max-h-64 overflow-y-auto z-50 backdrop-blur-sm"
              role="listbox"
              aria-label="Suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => selectSuggestion(suggestion)}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-accent transition-colors',
                    index === selectedIndex && 'bg-accent'
                  )}
                  aria-selected={index === selectedIndex}
                  role="option"
                >
                  <div className="flex items-center gap-2">
                    {suggestion.icon && <span>{suggestion.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{suggestion.label}</p>
                      {suggestion.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {triggerChar}{suggestion.label}
                    </Badge>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/50 flex items-center justify-between">
                <div>
                  <kbd className="px-1.5 py-0.5 text-xs border rounded">Tab</kbd> or{' '}
                  <kbd className="px-1.5 py-0.5 text-xs border rounded">Enter</kbd> to select •{' '}
                  <kbd className="px-1.5 py-0.5 text-xs border rounded">↑↓</kbd> to navigate
                </div>
                {isPending && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex gap-2 p-4" onDragOver={handleDragOver} onDrop={handleDrop}>
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading || attachments.length >= maxFiles}
            title="Attach files"
            aria-label="Attach files"
          >
            {isUploading ? '⏳' : '📎'}
          </Button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onSelect={handleCursorChange}
              onClick={handleCursorChange}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              autoResize
              maxRows={6}
              className={cn(isOverLimit && 'border-destructive')}
            />
            {maxLength && (
              <div
                className={cn(
                  'absolute bottom-2 right-2 text-xs',
                  isOverLimit ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {charCount}/{maxLength}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={disabled || !canSubmit || isOverLimit}
            size="icon"
            title="Send message (Enter)"
            aria-label="Send message"
          >
            ↑
          </Button>
        </div>
      </div>
    )
  }
)
AdvancedChatInput.displayName = 'AdvancedChatInput'
