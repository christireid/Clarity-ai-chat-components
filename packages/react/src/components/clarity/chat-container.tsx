'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { ChevronDown } from 'lucide-react'
import { Button } from '@clarity-chat/primitives'

// ============================================================================
// CHAT CONTAINER - Superior to Prompt-Kit with intelligent auto-scroll
// ============================================================================

interface ChatContainerRef {
  scrollToBottom: (behavior?: 'smooth' | 'instant') => void
  scrollToTop: (behavior?: 'smooth' | 'instant') => void
  scrollToMessage: (messageId: string, behavior?: 'smooth' | 'instant') => void
  isAtBottom: () => boolean
  nativeElement: HTMLDivElement | null
}

interface ChatContainerProps {
  children: React.ReactNode
  autoScroll?: boolean
  autoScrollThreshold?: number
  showScrollButton?: boolean
  scrollButtonPosition?: 'left' | 'center' | 'right'
  onScrollChange?: (isAtBottom: boolean) => void
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
}

export const ChatContainer = React.forwardRef<
  ChatContainerRef,
  ChatContainerProps
>(
  (
    {
      children,
      autoScroll = true,
      autoScrollThreshold = 100,
      showScrollButton = true,
      scrollButtonPosition = 'center',
      onScrollChange,
      className,
      contentClassName,
      style,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [isAtBottom, setIsAtBottom] = React.useState(true)
    const [showButton, setShowButton] = React.useState(false)
    const isScrollingRef = React.useRef(false)

    // Check if scrolled to bottom
    const checkIfAtBottom = React.useCallback(() => {
      if (!containerRef.current) return true
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      return scrollHeight - scrollTop - clientHeight <= autoScrollThreshold
    }, [autoScrollThreshold])

    // Scroll to bottom
    const scrollToBottom = React.useCallback(
      (behavior: 'smooth' | 'instant' = 'smooth') => {
        if (!containerRef.current) return
        isScrollingRef.current = true
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior,
        })
        // Reset scrolling flag after animation
        setTimeout(
          () => {
            isScrollingRef.current = false
          },
          behavior === 'smooth' ? 300 : 0
        )
      },
      []
    )

    // Scroll to top
    const scrollToTop = React.useCallback(
      (behavior: 'smooth' | 'instant' = 'smooth') => {
        if (!containerRef.current) return
        containerRef.current.scrollTo({ top: 0, behavior })
      },
      []
    )

    // Scroll to specific message
    const scrollToMessage = React.useCallback(
      (messageId: string, behavior: 'smooth' | 'instant' = 'smooth') => {
        if (!containerRef.current) return
        const messageEl = containerRef.current.querySelector(
          `[data-message-id="${messageId}"]`
        )
        messageEl?.scrollIntoView({ behavior, block: 'center' })
      },
      []
    )

    // Expose ref methods
    React.useImperativeHandle(ref, () => ({
      scrollToBottom,
      scrollToTop,
      scrollToMessage,
      isAtBottom: checkIfAtBottom,
      nativeElement: containerRef.current,
    }))

    // Handle scroll events
    const handleScroll = React.useCallback(() => {
      if (isScrollingRef.current) return

      const atBottom = checkIfAtBottom()
      setIsAtBottom(atBottom)
      setShowButton(!atBottom)
      onScrollChange?.(atBottom)
    }, [checkIfAtBottom, onScrollChange])

    // Auto-scroll on content changes
    React.useEffect(() => {
      if (autoScroll && isAtBottom) {
        scrollToBottom('smooth')
      }
    }, [children, autoScroll, isAtBottom, scrollToBottom])

    // Initial scroll to bottom
    React.useEffect(() => {
      scrollToBottom('instant')
    }, [scrollToBottom])

    return (
      <div
        className={cn('relative flex flex-col h-full', className)}
        style={style}
      >
        {/* Scrollable content area */}
        <div
          ref={containerRef}
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden scroll-smooth',
            contentClassName
          )}
          onScroll={handleScroll}
        >
          {children}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && showButton && (
          <ScrollButton
            onClick={() => scrollToBottom('smooth')}
            position={scrollButtonPosition}
          />
        )}
      </div>
    )
  }
)

ChatContainer.displayName = 'ChatContainer'

// ============================================================================
// SCROLL BUTTON
// ============================================================================

interface ScrollButtonProps {
  onClick: () => void
  position: 'left' | 'center' | 'right'
  className?: string
}

function ScrollButton({ onClick, position, className }: ScrollButtonProps) {
  return (
    <div
      className={cn(
        'absolute bottom-4 z-10',
        position === 'left' && 'left-4',
        position === 'center' && 'left-1/2 -translate-x-1/2',
        position === 'right' && 'right-4'
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={cn(
          'rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background',
          'transition-all duration-200 hover:scale-105',
          className
        )}
      >
        <ChevronDown className="w-4 h-4" />
        <span className="sr-only">Scroll to bottom</span>
      </Button>
    </div>
  )
}

// ============================================================================
// CHAT VIEWPORT - Thread-style viewport with primitives
// ============================================================================

interface ChatViewportProps {
  children: React.ReactNode
  className?: string
}

export function ChatViewport({ children, className }: ChatViewportProps) {
  return (
    <div className={cn('flex flex-col min-h-0', className)}>{children}</div>
  )
}

// ============================================================================
// CHAT MESSAGES AREA - Area for messages with proper spacing
// ============================================================================

interface ChatMessagesProps {
  children: React.ReactNode
  className?: string
  gap?: 'sm' | 'md' | 'lg'
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export function ChatMessages({
  children,
  className,
  gap = 'md',
  padding = 'md',
}: ChatMessagesProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// CHAT COMPOSER AREA - Area for input composer
// ============================================================================

interface ChatComposerAreaProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'floating' | 'fixed' | 'inline'
}

export function ChatComposerArea({
  children,
  className,
  variant = 'default',
}: ChatComposerAreaProps) {
  return (
    <div
      className={cn(
        'shrink-0',
        variant === 'default' && 'border-t border-border bg-background p-4',
        variant === 'floating' && 'absolute bottom-4 left-4 right-4 z-10',
        variant === 'fixed' &&
          'sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4',
        variant === 'inline' && 'p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SENDER COMPONENT - Enhanced chat input (superior to Ant Design X Sender)
// ============================================================================

interface SenderProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  maxLength?: number
  autoFocus?: boolean
  allowEmpty?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  actions?: React.ReactNode
  onPaste?: (event: React.ClipboardEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  variant?: 'default' | 'bordered' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Sender({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  loading = false,
  maxLength,
  autoFocus = false,
  allowEmpty = false,
  prefix,
  suffix,
  actions,
  onPaste,
  onKeyDown,
  variant = 'default',
  size = 'md',
  className,
}: SenderProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [localValue, setLocalValue] = React.useState(value)

  const currentValue = onChange ? value : localValue

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [currentValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return

    if (onChange) {
      onChange(newValue)
    } else {
      setLocalValue(newValue)
    }
  }

  const handleSubmit = () => {
    if (disabled || loading) return
    if (!allowEmpty && !currentValue.trim()) return

    onSubmit?.(currentValue)

    if (!onChange) {
      setLocalValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    onKeyDown?.(e)
  }

  const sizeClasses = {
    sm: 'text-sm min-h-[36px] py-2',
    md: 'text-base min-h-[44px] py-3',
    lg: 'text-lg min-h-[52px] py-4',
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl transition-all',
        variant === 'default' &&
          'border border-border bg-background focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10',
        variant === 'bordered' &&
          'border-2 border-border bg-transparent focus-within:border-primary',
        variant === 'filled' &&
          'border border-transparent bg-muted focus-within:bg-muted/80',
        variant === 'ghost' &&
          'border border-transparent focus-within:bg-muted/50',
        className
      )}
    >
      {prefix && <div className="pl-3 pb-3">{prefix}</div>}

      <textarea
        ref={textareaRef}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={onPaste}
        placeholder={placeholder}
        disabled={disabled || loading}
        autoFocus={autoFocus}
        rows={1}
        className={cn(
          'flex-1 bg-transparent resize-none focus:outline-none px-4',
          'placeholder:text-muted-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-[200px]',
          sizeClasses[size]
        )}
      />

      <div className="flex items-center gap-1 pr-2 pb-2">
        {suffix}
        {actions || (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              disabled || loading || (!allowEmpty && !currentValue.trim())
            }
            className="rounded-xl"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// USE AUTO SCROLL HOOK
// ============================================================================

interface UseAutoScrollOptions {
  threshold?: number
  smooth?: boolean
}

export function useAutoScroll<T extends HTMLElement>(
  options: UseAutoScrollOptions = {}
) {
  const { threshold = 100, smooth = true } = options
  const ref = React.useRef<T>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true)

  const checkIfAtBottom = React.useCallback(() => {
    if (!ref.current) return true
    const { scrollTop, scrollHeight, clientHeight } = ref.current
    return scrollHeight - scrollTop - clientHeight <= threshold
  }, [threshold])

  const scrollToBottom = React.useCallback(() => {
    if (!ref.current) return
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }, [smooth])

  const handleScroll = React.useCallback(() => {
    const atBottom = checkIfAtBottom()
    setIsAtBottom(atBottom)
    setShouldAutoScroll(atBottom)
  }, [checkIfAtBottom])

  // Auto-scroll when content changes and we're at the bottom
  const autoScroll = React.useCallback(() => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [shouldAutoScroll, scrollToBottom])

  return {
    ref,
    isAtBottom,
    shouldAutoScroll,
    scrollToBottom,
    handleScroll,
    autoScroll,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ChatContainerRef, ChatContainerProps, SenderProps }
