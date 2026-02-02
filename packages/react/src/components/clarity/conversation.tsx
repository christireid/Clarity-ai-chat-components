'use client'

import * as React from 'react'
import {
  MessageSquare,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  ArrowDown,
  Loader2,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp?: Date
  model?: string
  tokens?: number
  loading?: boolean
  error?: string
  metadata?: Record<string, unknown>
}

// Conversation Context
interface ConversationContextValue {
  messages: ConversationMessage[]
  isLoading: boolean
  isStreaming: boolean
}

const ConversationContext =
  React.createContext<ConversationContextValue | null>(null)

export function useConversation() {
  const context = React.useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within a Conversation')
  }
  return context
}

// Conversation Root
export interface ConversationProps {
  messages?: ConversationMessage[]
  isLoading?: boolean
  isStreaming?: boolean
  children: React.ReactNode
  className?: string
}

export function Conversation({
  messages = [],
  isLoading = false,
  isStreaming = false,
  children,
  className,
}: ConversationProps) {
  return (
    <ConversationContext.Provider value={{ messages, isLoading, isStreaming }}>
      <div className={cn('flex flex-col h-full', className)}>{children}</div>
    </ConversationContext.Provider>
  )
}

// Conversation Content
export interface ConversationContentProps {
  children?: React.ReactNode
  className?: string
  autoScroll?: boolean
}

export function ConversationContent({
  children,
  className,
  autoScroll = true,
}: ConversationContentProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { isStreaming } = useConversation()
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  React.useEffect(() => {
    if (autoScroll && isStreaming) {
      scrollToBottom()
    }
  }, [autoScroll, isStreaming, scrollToBottom])

  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isAtBottom)
    }
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden">
      <ScrollArea
        ref={scrollRef}
        className={cn('h-full', className)}
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-4">{children}</div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Message Component
export interface MessageProps {
  from?: 'user' | 'assistant' | 'system' | 'tool'
  children: React.ReactNode
  className?: string
}

export function Message({
  from = 'assistant',
  children,
  className,
}: MessageProps) {
  const isUser = from === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse', className)}>
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-accent text-accent-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn('flex-1 min-w-0', isUser && 'flex justify-end')}>
        {children}
      </div>
    </div>
  )
}

// Message Content
export interface MessageContentProps {
  children: React.ReactNode
  className?: string
}

export function MessageContent({ children, className }: MessageContentProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

// Message Response (the actual text bubble)
export interface MessageResponseProps {
  children: React.ReactNode
  variant?: 'default' | 'user' | 'system' | 'error'
  className?: string
}

export function MessageResponse({
  children,
  variant = 'default',
  className,
}: MessageResponseProps) {
  const variants = {
    default: 'bg-muted text-foreground',
    user: 'bg-accent text-accent-foreground ml-auto',
    system: 'bg-muted/50 text-muted-foreground text-sm italic',
    error: 'bg-destructive/10 text-destructive border border-destructive/20',
  }

  return (
    <div
      className={cn(
        'rounded-2xl px-4 py-3 max-w-[85%] prose-ai',
        variants[variant],
        variant === 'user' && 'rounded-br-md',
        variant !== 'user' && 'rounded-bl-md',
        className
      )}
    >
      {children}
    </div>
  )
}

// Message Actions
export interface MessageActionsProps {
  onCopy?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
  className?: string
}

export function MessageActions({
  onCopy,
  onEdit,
  onRegenerate,
  onDelete,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    onCopy?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex items-center gap-1 mt-1', className)}>
      {onCopy && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onRegenerate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onRegenerate}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Regenerate</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// Message Timestamp
export interface MessageTimestampProps {
  time: Date
  className?: string
}

export function MessageTimestamp({ time, className }: MessageTimestampProps) {
  return (
    <span
      className={cn(
        'text-xs text-muted-foreground flex items-center gap-1',
        className
      )}
    >
      <Clock className="h-3 w-3" />
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

// Message Loading
export interface MessageLoadingProps {
  text?: string
  className?: string
}

export function MessageLoading({
  text = 'Thinking...',
  className,
}: MessageLoadingProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-muted-foreground', className)}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Streaming Indicator
export interface StreamingIndicatorProps {
  className?: string
}

export function StreamingIndicator({ className }: StreamingIndicatorProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      <span
        className="w-1 h-1 bg-current rounded-full animate-pulse"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1 h-1 bg-current rounded-full animate-pulse"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1 h-1 bg-current rounded-full animate-pulse"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  )
}

// Open in Chat Button
export interface OpenInChatProps {
  onClick?: () => void
  label?: string
  className?: string
}

export function OpenInChat({
  onClick,
  label = 'Open in chat',
  className,
}: OpenInChatProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('gap-2', className)}
      onClick={onClick}
    >
      <MessageSquare className="h-4 w-4" />
      {label}
    </Button>
  )
}

// Context Display
export interface ContextDisplayProps {
  tokens: number
  maxTokens: number
  items?: { label: string; tokens: number }[]
  className?: string
}

export function ContextDisplay({
  tokens,
  maxTokens,
  items,
  className,
}: ContextDisplayProps) {
  const percentage = Math.min((tokens / maxTokens) * 100, 100)
  const isWarning = percentage > 75
  const isCritical = percentage > 90

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Context</span>
        <span
          className={cn(
            isCritical
              ? 'text-destructive'
              : isWarning
                ? 'text-yellow-500'
                : 'text-muted-foreground'
          )}
        >
          {tokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isCritical
              ? 'bg-destructive'
              : isWarning
                ? 'bg-yellow-500'
                : 'bg-accent'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {items && items.length > 0 && (
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>{item.label}</span>
              <span>{item.tokens.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Response Component (formatted AI response)
export interface ResponseProps {
  children: React.ReactNode
  model?: string
  tokens?: number
  duration?: number
  className?: string
}

export function Response({
  children,
  model,
  tokens,
  duration,
  className,
}: ResponseProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="prose-ai">{children}</div>
      {(model || tokens || duration) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {model && (
            <Badge variant="outline" className="text-xs h-5">
              <Sparkles className="h-3 w-3 mr-1" />
              {model}
            </Badge>
          )}
          {tokens && <span>{tokens} tokens</span>}
          {duration && <span>{duration}ms</span>}
        </div>
      )}
    </div>
  )
}

// Loader Component
export interface LoaderProps {
  variant?: 'dots' | 'spinner' | 'pulse' | 'shimmer'
  text?: string
  className?: string
}

export function Loader({ variant = 'dots', text, className }: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'pulse':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-current rounded-full animate-pulse"
              style={{ animationDelay: '200ms' }}
            />
            <div
              className="w-2 h-2 bg-current rounded-full animate-pulse"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        )
      case 'shimmer':
        return <div className="h-4 w-32 bg-muted rounded animate-shimmer" />
      default:
        return (
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )
    }
  }

  return (
    <div
      className={cn('flex items-center gap-2 text-muted-foreground', className)}
    >
      {renderLoader()}
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}

// Shimmer Text Component
export interface ShimmerTextProps {
  lines?: number
  className?: string
}

export function ShimmerText({ lines = 3, className }: ShimmerTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-shimmer"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}

// Message Group (for collapsible sections)
export interface MessageGroupProps {
  title: string
  count?: number
  defaultExpanded?: boolean
  children: React.ReactNode
  className?: string
}

export function MessageGroup({
  title,
  count,
  defaultExpanded = true,
  children,
  className,
}: MessageGroupProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <div className={cn('space-y-2', className)}>
      <button
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
        <span>{title}</span>
        {count !== undefined && (
          <Badge variant="secondary" className="text-xs h-5">
            {count}
          </Badge>
        )}
      </button>
      {expanded && <div className="space-y-3 pl-6">{children}</div>}
    </div>
  )
}
