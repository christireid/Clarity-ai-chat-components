'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Send,
  Paperclip,
  Smile,
  AtSign,
  Slash,
  Mic,
  MicOff,
  Loader2,
  X,
  Image as ImageIcon,
  FileText,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import type { SlashCommand, Mention, Attachment } from './types'
import { useVoice } from './useVoice'
import { VoiceVisualizer } from './VoiceVisualizer'

// ... (Keep existing interfaces) ...
interface ChatInputProps {
  onSend: (content: string, attachments?: Attachment[]) => void
  placeholder?: string
  className?: string
  slashCommands?: SlashCommand[]
  mentions?: Mention[]
  disabled?: boolean
}

export function ChatInput({
  onSend,
  placeholder = 'Type a message...',
  className,
  slashCommands = [],
  mentions = [],
  disabled,
}: ChatInputProps) {
  // ... (Keep existing state) ...
  const [value, setValue] = React.useState('')
  const [attachments, setAttachments] = React.useState<Attachment[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [showSlashMenu, setShowSlashMenu] = React.useState(false)
  const [showMentionMenu, setShowMentionMenu] = React.useState(false)
  const [slashQuery, setSlashQuery] = React.useState('')
  const [mentionQuery, setMentionQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = React.useState(0)

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoice()

  // Sync voice transcript
  React.useEffect(() => {
    if (transcript) setValue(transcript)
  }, [transcript])

  // Drag & Drop Handlers (Keep existing)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files))
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files))
  }
  const handleFiles = (files: File[]) => {
    const newAttachments: Attachment[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file),
      size: file.size,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // Filter Logic (Keep existing)
  const filteredCommands = React.useMemo(() => {
    if (!slashQuery) return slashCommands
    return slashCommands.filter((cmd) =>
      cmd.label.toLowerCase().includes(slashQuery.toLowerCase())
    )
  }, [slashCommands, slashQuery])
  const filteredMentions = React.useMemo(() => {
    if (!mentionQuery) return mentions
    return mentions.filter((m) =>
      m.label.toLowerCase().includes(mentionQuery.toLowerCase())
    )
  }, [mentions, mentionQuery])

  // Handle input change (Keep existing)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursor = e.target.selectionStart
    setValue(newValue)
    setCursorPosition(cursor)

    const textBeforeCursor = newValue.slice(0, cursor)
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/')
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (
      lastSlashIndex !== -1 &&
      lastSlashIndex === textBeforeCursor.length - 1
    ) {
      setShowSlashMenu(true)
      setShowMentionMenu(false)
      setSlashQuery('')
    } else if (
      lastSlashIndex !== -1 &&
      textBeforeCursor.length > lastSlashIndex + 1 &&
      !textBeforeCursor.slice(lastSlashIndex).includes(' ')
    ) {
      setShowSlashMenu(true)
      setSlashQuery(textBeforeCursor.slice(lastSlashIndex + 1))
    } else {
      setShowSlashMenu(false)
    }

    if (lastAtIndex !== -1 && lastAtIndex === textBeforeCursor.length - 1) {
      setShowMentionMenu(true)
      setShowSlashMenu(false)
      setMentionQuery('')
    } else if (
      lastAtIndex !== -1 &&
      textBeforeCursor.length > lastAtIndex + 1 &&
      !textBeforeCursor.slice(lastAtIndex).includes(' ')
    ) {
      setShowMentionMenu(true)
      setMentionQuery(textBeforeCursor.slice(lastAtIndex + 1))
    } else {
      setShowMentionMenu(false)
    }
  }

  const handleSend = () => {
    if ((!value.trim() && attachments.length === 0) || disabled) return
    onSend(value.trim(), attachments)
    setValue('')
    setAttachments([])
    resetTranscript()
    setShowSlashMenu(false)
    setShowMentionMenu(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        'relative border-t border-border transition-colors',
        isDragging && 'bg-primary/5 border-primary/50',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-primary font-medium flex flex-col items-center gap-2">
            <Paperclip className="w-8 h-8" />
            Drop files here
          </div>
        </div>
      )}

      {/* Voice Visualizer Overlay */}
      <VoiceVisualizer isRecording={isListening} />

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin">
          {attachments.map((att) => (
            <div key={att.id} className="relative group shrink-0">
              {att.type === 'image' ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-border bg-muted flex flex-col items-center justify-center text-xs p-1 text-center">
                  <FileText className="w-6 h-6 mb-1 text-muted-foreground" />
                  <span className="truncate w-full">{att.name}</span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Menus */}
      {showSlashMenu && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 glass-heavy rounded-lg shadow-lg max-h-64 overflow-y-auto scrollbar-none z-10 p-1">
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => {
                /* select */
              }}
              className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-3">
        <div className="flex gap-1">
          <div className="relative">
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
              onChange={handleFileSelect}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 pointer-events-none"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>

          {isSupported && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 shrink-0',
                isListening && 'text-red-500 bg-red-50 dark:bg-red-950/20'
              )}
              onClick={() => (isListening ? stopListening() : startListening())}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? ''
              : attachments.length > 0
                ? 'Add a caption...'
                : placeholder
          }
          disabled={disabled}
          className={cn(
            'flex-1 resize-none bg-transparent',
            'text-sm text-foreground placeholder:text-muted-foreground',
            'outline-none focus:outline-none',
            'min-h-[36px] max-h-[200px]',
            'scrollbar-none'
          )}
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={(!value.trim() && attachments.length === 0) || disabled}
          size="icon"
          className="h-8 w-8 shrink-0 gradient-pastel-blue border-0"
        >
          <Send className="w-4 h-4 text-neutral-700" />
        </Button>
      </div>
    </div>
  )
}
