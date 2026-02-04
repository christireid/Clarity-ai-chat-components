'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  User,
  Bot,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Volume2,
  StopCircle,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import type { Message } from './types'
import { renderGenerativeComponent } from './GenerativeUIRegistry'
import { useTTS } from './useTTS'
import { ThinkingIndicator } from '@/components/ai/thinking-indicator' // Import ThinkingIndicator

interface ChatBubbleProps {
  message: Message
  className?: string
  onCopy?: (content: string) => void
  onRegenerate?: () => void
  onFeedback?: (type: 'up' | 'down') => void
}

export function ChatBubble({
  message,
  className,
  onCopy,
  onRegenerate,
  onFeedback,
}: ChatBubbleProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isSystem = message.role === 'system'
  const [copied, setCopied] = React.useState(false)

  // TTS Hook
  const { speak, stop, isSpeaking, isSupported } = useTTS()
  const [isThisSpeaking, setIsThisSpeaking] = React.useState(false)

  const StatusIcon = {
    sending: Clock,
    sent: CheckCircle2,
    error: AlertCircle,
    streaming: Clock, // Map 'streaming' status to Clock
  }[message.status || 'sent']

  const handleCopy = () => {
    if (onCopy) onCopy(message.content)
    else navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    if (isThisSpeaking) {
      stop()
      setIsThisSpeaking(false)
    } else {
      speak(message.content)
      setIsThisSpeaking(true)
    }
  }

  // Sync state with global speaking
  React.useEffect(() => {
    if (!isSpeaking) setIsThisSpeaking(false)
  }, [isSpeaking])

  const hasThinking = message.thinkingSteps && message.thinkingSteps.length > 0
  const isStreaming =
    message.status === 'streaming' || message.status === 'sending'

  return (
    <div
      className={cn(
        'group flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser && 'flex-row-reverse',
        className
      )}
      role="article"
      aria-label={`${message.role} message`}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isAssistant && 'gradient-pastel-purple',
          isUser && 'bg-neutral-200 dark:bg-neutral-800',
          isSystem && 'bg-neutral-300 dark:bg-neutral-700'
        )}
      >
        {isAssistant && <Bot className="w-4 h-4 text-neutral-700" />}
        {isUser && <User className="w-4 h-4 text-neutral-600" />}
        {isSystem && (
          <span className="text-xs font-medium text-neutral-600">SYS</span>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] space-y-1',
          isUser && 'flex flex-col items-end'
        )}
      >
        {/* Thinking Steps - Displayed ABOVE the content */}
        {hasThinking && !isUser && (
          <ThinkingIndicator
            steps={message.thinkingSteps!}
            isActive={isStreaming}
            className="mb-2"
          />
        )}

        {/* Attachments Display */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {message.attachments.map((att) =>
              att.type === 'image' ? (
                <img
                  key={att.id}
                  src={att.url}
                  alt={att.name}
                  className="max-w-[200px] max-h-[200px] rounded-lg border border-border"
                />
              ) : (
                <div
                  key={att.id}
                  className="p-2 bg-muted rounded border text-xs"
                >
                  {att.name}
                </div>
              )
            )}
          </div>
        )}

        <div
          className={cn(
            'rounded-lg p-3 text-sm relative group/bubble',
            isAssistant && 'glass-medium bg-secondary',
            isUser &&
              'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900',
            isSystem &&
              'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
          )}
        >
          {message.content}
          {message.metadata?.component && (
            <div className="mt-3 w-full border-t border-border/10 pt-3">
              {renderGenerativeComponent(
                message.metadata.component,
                message.metadata.props
              )}
            </div>
          )}
        </div>

        {/* Metadata & Actions */}
        <div
          className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground min-h-[20px]',
            isUser && 'flex-row-reverse'
          )}
        >
          <time
            dateTime={message.timestamp.toISOString()}
            suppressHydrationWarning
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
          {message.status && StatusIcon && (
            <StatusIcon
              className={cn(
                'w-3 h-3',
                message.status === 'error' && 'text-error-500'
              )}
            />
          )}

          {/* Action Buttons */}
          {!isUser && message.status !== 'sending' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={handleSpeak}
                  title={isThisSpeaking ? 'Stop' : 'Read Aloud'}
                >
                  {isThisSpeaking ? (
                    <StopCircle className="w-3 h-3 text-red-500" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={onRegenerate}
                >
                  <RotateCw className="w-3 h-3" />
                </Button>
              )}
              {onFeedback && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onFeedback('up')}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onFeedback('down')}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ... List component remains same ...
interface ChatBubbleListProps {
  items: Message[]
  className?: string
  renderItem?: (message: Message) => React.ReactNode
}

export function ChatBubbleList({
  items,
  className,
  renderItem,
}: ChatBubbleListProps) {
  return (
    <div className="h-full flex flex-col">
      <div
        className={cn('space-y-4 flex-1', className)}
        role="list"
        aria-label="Messages"
      >
        {items.map((item) => (
          <div key={item.id} role="listitem">
            {renderItem ? renderItem(item) : <ChatBubble message={item} />}
          </div>
        ))}
      </div>
    </div>
  )
}
ChatBubble.List = ChatBubbleList
