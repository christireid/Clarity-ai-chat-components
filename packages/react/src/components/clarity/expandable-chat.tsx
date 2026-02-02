'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { ScrollArea } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// ============================================================================
// TYPES
// ============================================================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ExpandableChatProps {
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => void
  onClearChat?: () => void
  title?: string
  subtitle?: string
  placeholder?: string
  assistantName?: string
  assistantAvatar?: string
  userName?: string
  userAvatar?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  defaultOpen?: boolean
  defaultExpanded?: boolean
  triggerIcon?: React.ReactNode
  headerExtra?: React.ReactNode
  footerExtra?: React.ReactNode
  showAttachment?: boolean
  showVoice?: boolean
  isLoading?: boolean
  className?: string
  triggerClassName?: string
  panelClassName?: string
}

export interface ChatWidgetProps extends Omit<
  ExpandableChatProps,
  'messages' | 'onSendMessage'
> {
  children?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

export interface FloatingChatButtonProps {
  onClick: () => void
  isOpen: boolean
  icon?: React.ReactNode
  unreadCount?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

// ============================================================================
// POSITION STYLES
// ============================================================================

const positionStyles = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
}

const panelOrigin = {
  'bottom-right': 'origin-bottom-right',
  'bottom-left': 'origin-bottom-left',
  'top-right': 'origin-top-right',
  'top-left': 'origin-top-left',
}

// ============================================================================
// FLOATING CHAT BUTTON
// ============================================================================

export function FloatingChatButton({
  onClick,
  isOpen,
  icon,
  unreadCount = 0,
  position = 'bottom-right',
  className,
}: FloatingChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        'fixed z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105',
        positionStyles[position],
        isOpen && 'scale-0 opacity-0',
        className
      )}
    >
      {icon || <MessageCircle className="h-6 w-6" />}
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  )
}

// ============================================================================
// EXPANDABLE CHAT - Main component
// ============================================================================

export function ExpandableChat({
  messages = [],
  onSendMessage,
  onClearChat,
  title = 'Chat Support',
  subtitle = 'We typically reply within minutes',
  placeholder = 'Type your message...',
  assistantName = 'Assistant',
  assistantAvatar,
  userName = 'You',
  userAvatar,
  position = 'bottom-right',
  defaultOpen = false,
  defaultExpanded = false,
  triggerIcon,
  headerExtra,
  footerExtra,
  showAttachment = true,
  showVoice = false,
  isLoading = false,
  className,
  triggerClassName,
  panelClassName,
}: ExpandableChatProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const [inputValue, setInputValue] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('fixed z-50', positionStyles[position], className)}>
      {/* Floating Button */}
      <FloatingChatButton
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
        icon={triggerIcon}
        position={position}
        className={triggerClassName}
      />

      {/* Chat Panel */}
      <div
        className={cn(
          'absolute transition-all duration-300 ease-out',
          position.includes('bottom') ? 'bottom-0' : 'top-0',
          position.includes('right') ? 'right-0' : 'left-0',
          panelOrigin[position],
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none',
          isExpanded ? 'w-[480px] h-[600px]' : 'w-[380px] h-[500px]',
          'flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden',
          panelClassName
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={assistantAvatar || '/placeholder.svg'} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {assistantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {headerExtra}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? (
                    <>
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Minimize
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Expand
                    </>
                  )}
                </DropdownMenuItem>
                {onClearChat && (
                  <DropdownMenuItem onClick={onClearChat}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear chat
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Start a conversation by typing below
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={
                        message.role === 'user' ? userAvatar : assistantAvatar
                      }
                    />
                    <AvatarFallback
                      className={cn(
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.role === 'user'
                        ? userName.charAt(0)
                        : assistantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <p
                        className={cn(
                          'text-[10px] mt-1',
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={assistantAvatar || '/placeholder.svg'} />
                  <AvatarFallback className="bg-muted">
                    {assistantName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {footerExtra && (
          <div className="px-4 py-2 border-t border-border bg-muted/20">
            {footerExtra}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            {showAttachment && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-[40px] max-h-[120px] resize-none pr-10 rounded-xl"
                rows={1}
              />
            </div>
            {showVoice && !inputValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              className="h-9 w-9 flex-shrink-0 rounded-xl"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CHAT WIDGET - Flexible wrapper component
// ============================================================================

export function ChatWidget({
  children,
  header,
  footer,
  title = 'Chat',
  position = 'bottom-right',
  defaultOpen = false,
  triggerIcon,
  className,
  triggerClassName,
  panelClassName,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className={cn('fixed z-50', positionStyles[position], className)}>
      <FloatingChatButton
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
        icon={triggerIcon}
        position={position}
        className={triggerClassName}
      />

      <div
        className={cn(
          'absolute transition-all duration-300 ease-out',
          position.includes('bottom') ? 'bottom-0' : 'top-0',
          position.includes('right') ? 'right-0' : 'left-0',
          panelOrigin[position],
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none',
          isExpanded ? 'w-[480px] h-[600px]' : 'w-[380px] h-[500px]',
          'flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden',
          panelClassName
        )}
      >
        {header || (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">{children}</div>

        {footer}
      </div>
    </div>
  )
}

// ============================================================================
// CHAT POPOVER - Alternative popover style
// ============================================================================

export interface ChatPopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function ChatPopover({
  trigger,
  children,
  title,
  open,
  onOpenChange,
  side = 'top',
  align = 'end',
  className,
}: ChatPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'absolute z-50 w-[360px] rounded-xl border border-border bg-background shadow-xl',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              align === 'start' && 'left-0',
              align === 'center' && 'left-1/2 -translate-x-1/2',
              align === 'end' && 'right-0',
              'animate-in fade-in-0 zoom-in-95',
              side === 'top' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="font-medium text-sm">{title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            {children}
          </div>
        </>
      )}
    </div>
  )
}
