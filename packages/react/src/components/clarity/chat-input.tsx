'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Square,
  ImageIcon,
  FileText,
  AtSign,
  Slash,
  Sparkles,
  X,
  Plus,
  Loader2,
  ChevronDown,
  Globe,
  Code,
  FileCode,
  User,
  Folder,
  Wrench,
  MessageSquare,
  Keyboard,
} from 'lucide-react'
import type { Attachment, SlashCommand, MentionItem } from './types/ai-types'
import { CommandPalette } from './command-palette'
import { ModelSelector } from './model-selector'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop?: () => void
  isLoading?: boolean
  isRecording?: boolean
  onStartRecording?: () => void
  onStopRecording?: () => void
  attachments?: Attachment[]
  onAttachmentsChange?: (attachments: Attachment[]) => void
  placeholder?: string
  maxLength?: number
  showModelSelector?: boolean
  showWebSearch?: boolean
  onWebSearchToggle?: () => void
  webSearchEnabled?: boolean
  slashCommands?: SlashCommand[]
  mentionItems?: MentionItem[]
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  attachments = [],
  onAttachmentsChange,
  placeholder = 'Ask anything...',
  maxLength,
  showModelSelector = true,
  showWebSearch = true,
  onWebSearchToggle,
  webSearchEnabled = false,
  slashCommands = [],
  mentionItems = [],
  className,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [showSlashPalette, setShowSlashPalette] = React.useState(false)
  const [showMentionPalette, setShowMentionPalette] = React.useState(false)
  const [slashQuery, setSlashQuery] = React.useState('')
  const [mentionQuery, setMentionQuery] = React.useState('')

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !showSlashPalette &&
      !showMentionPalette
    ) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }

    // Detect / for slash commands
    if (e.key === '/' && value === '') {
      setShowSlashPalette(true)
      setSlashQuery('')
    }

    // Detect @ for mentions
    if (e.key === '@') {
      setShowMentionPalette(true)
      setMentionQuery('')
    }

    // Close palettes on Escape
    if (e.key === 'Escape') {
      setShowSlashPalette(false)
      setShowMentionPalette(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Update slash query
    if (showSlashPalette) {
      const slashMatch = newValue.match(/^\/(\w*)$/)
      if (slashMatch) {
        setSlashQuery(slashMatch[1])
      } else {
        setShowSlashPalette(false)
      }
    }

    // Update mention query
    if (showMentionPalette) {
      const mentionMatch = newValue.match(/@(\w*)$/)
      if (mentionMatch) {
        setMentionQuery(mentionMatch[1])
      } else {
        setShowMentionPalette(false)
      }
    }
  }

  const handleSlashSelect = (command: SlashCommand) => {
    onChange('')
    setShowSlashPalette(false)
    command.action()
    textareaRef.current?.focus()
  }

  const handleMentionSelect = (item: MentionItem) => {
    const newValue = value.replace(/@\w*$/, `@${item.label} `)
    onChange(newValue)
    setShowMentionPalette(false)
    textareaRef.current?.focus()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments: Attachment[] = files.map((file) => ({
      id: crypto.randomUUID(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
    }))
    onAttachmentsChange?.([...attachments, ...newAttachments])
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    onAttachmentsChange?.(attachments.filter((a) => a.id !== id))
  }

  const filteredSlashCommands = slashCommands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(slashQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(slashQuery.toLowerCase())
  )

  const filteredMentionItems = mentionItems.filter((item) =>
    item.label.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  return (
    <div className={cn('relative', className)}>
      {/* Slash Command Palette */}
      {showSlashPalette && filteredSlashCommands.length > 0 && (
        <SlashCommandPalette
          commands={filteredSlashCommands}
          onSelect={handleSlashSelect}
          onClose={() => setShowSlashPalette(false)}
        />
      )}

      {/* Mention Palette */}
      {showMentionPalette && filteredMentionItems.length > 0 && (
        <MentionPalette
          items={filteredMentionItems}
          onSelect={handleMentionSelect}
          onClose={() => setShowMentionPalette(false)}
        />
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment) => (
            <AttachmentChip
              key={attachment.id}
              attachment={attachment}
              onRemove={() => removeAttachment(attachment.id)}
            />
          ))}
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative flex flex-col rounded-2xl border border-border bg-secondary/30 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
        {/* Top Row - Model & Options */}
        <div className="flex items-center gap-2 px-3 pt-3">
          {showModelSelector && <ModelSelector compact />}

          {showWebSearch && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={webSearchEnabled ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-7 gap-1.5 text-xs',
                      webSearchEnabled &&
                        'bg-ai-user/10 text-ai-user hover:bg-ai-user/20'
                    )}
                    onClick={onWebSearchToggle}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Web
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {webSearchEnabled
                    ? 'Disable web search'
                    : 'Enable web search'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Keyboard className="h-3 w-3" />
            <span>/ for commands</span>
            <span className="mx-1">·</span>
            <span>@ to mention</span>
          </div>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />

        {/* Bottom Row - Actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.md"
            />

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach files</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8',
                      isRecording && 'bg-destructive/10 text-destructive'
                    )}
                    onClick={isRecording ? onStopRecording : onStartRecording}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRecording ? 'Stop recording' : 'Voice input'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            {maxLength && (
              <span
                className={cn(
                  'text-xs',
                  value.length > maxLength * 0.9
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                )}
              >
                {value.length}/{maxLength}
              </span>
            )}

            {isLoading ? (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-2"
                onClick={onStop}
              >
                <Square className="h-3 w-3 fill-current" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 gap-2"
                onClick={onSubmit}
                disabled={!value.trim() || isLoading}
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment
  onRemove: () => void
}) {
  const Icon = attachment.type === 'image' ? ImageIcon : FileText

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border group">
      {attachment.type === 'image' && attachment.url ? (
        <img
          src={attachment.url || '/placeholder.svg'}
          alt={attachment.name}
          className="h-6 w-6 rounded object-cover"
        />
      ) : (
        <Icon className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

function SlashCommandPalette({
  commands,
  onSelect,
  onClose,
}: {
  commands: SlashCommand[]
  onSelect: (command: SlashCommand) => void
  onClose: () => void
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % commands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + commands.length) % commands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSelect(commands[selectedIndex])
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commands, selectedIndex, onSelect, onClose])

  return (
    <div className="absolute bottom-full mb-2 left-0 w-80 rounded-lg border border-border bg-popover shadow-lg overflow-hidden animate-scale-in">
      <div className="px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground">Commands</p>
      </div>
      <div className="max-h-64 overflow-auto py-1">
        {commands.map((command, idx) => (
          <button
            key={command.name}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-secondary transition-colors',
              idx === selectedIndex && 'bg-secondary'
            )}
            onClick={() => onSelect(command)}
            onMouseEnter={() => setSelectedIndex(idx)}
          >
            <div className="p-1.5 rounded-md bg-secondary">
              {command.icon || (
                <Slash className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">/{command.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {command.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function MentionPalette({
  items,
  onSelect,
  onClose,
}: {
  items: MentionItem[]
  onSelect: (item: MentionItem) => void
  onClose: () => void
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const typeIcons = {
    file: FileCode,
    user: User,
    tool: Wrench,
    prompt: MessageSquare,
    context: Folder,
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % items.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        onSelect(items[selectedIndex])
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [items, selectedIndex, onSelect, onClose])

  return (
    <div className="absolute bottom-full mb-2 left-0 w-72 rounded-lg border border-border bg-popover shadow-lg overflow-hidden animate-scale-in">
      <div className="px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground">Mention</p>
      </div>
      <div className="max-h-64 overflow-auto py-1">
        {items.map((item, idx) => {
          const Icon = typeIcons[item.type] || AtSign
          return (
            <button
              key={item.id}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-secondary transition-colors',
                idx === selectedIndex && 'bg-secondary'
              )}
              onClick={() => onSelect(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="p-1.5 rounded-md bg-secondary">
                {item.icon || (
                  <Icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {item.type}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Simple prompt input for basic use cases
export function SimplePromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  isLoading = false,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  isLoading?: boolean
  className?: string
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  return (
    <div className={cn('flex items-end gap-2', className)}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[44px] max-h-[200px] resize-none"
        disabled={isLoading}
      />
      <Button
        size="icon"
        className="h-11 w-11 shrink-0"
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
