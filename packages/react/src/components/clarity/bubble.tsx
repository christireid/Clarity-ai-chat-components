'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { cva, type VariantProps } from 'class-variance-authority'

// ============================================================================
// BUBBLE VARIANTS - Superior to Ant Design X with more options
// ============================================================================

const bubbleVariants = cva('relative max-w-[85%] transition-all duration-200', {
  variants: {
    variant: {
      filled: 'bg-muted',
      outlined: 'bg-transparent border border-border',
      shadow: 'bg-background shadow-md',
      borderless: 'bg-transparent',
      gradient: 'bg-gradient-to-br from-primary/10 to-primary/5',
      glass: 'bg-background/80 backdrop-blur-sm border border-border/50',
    },
    shape: {
      default: 'rounded-2xl',
      round: 'rounded-3xl',
      square: 'rounded-lg',
      cornerLeft: 'rounded-2xl rounded-tl-sm',
      cornerRight: 'rounded-2xl rounded-tr-sm',
      pill: 'rounded-full',
    },
    placement: {
      start: '',
      end: '',
    },
    size: {
      sm: 'text-sm px-3 py-2',
      md: 'text-base px-4 py-3',
      lg: 'text-lg px-5 py-4',
    },
  },
  compoundVariants: [
    {
      placement: 'start',
      shape: 'cornerLeft',
      className: 'rounded-tl-sm',
    },
    {
      placement: 'end',
      shape: 'cornerRight',
      className: 'rounded-tr-sm',
    },
    {
      placement: 'start',
      variant: 'filled',
      className: 'bg-muted text-foreground',
    },
    {
      placement: 'end',
      variant: 'filled',
      className: 'bg-primary text-primary-foreground',
    },
  ],
  defaultVariants: {
    variant: 'filled',
    shape: 'default',
    placement: 'start',
    size: 'md',
  },
})

// ============================================================================
// TYPING ANIMATION - Superior typewriter effect with multiple modes
// ============================================================================

interface TypingAnimationOptions {
  effect: 'typing' | 'fade-in' | 'word-by-word' | 'character-reveal'
  step?: number | [number, number]
  interval?: number
  keepPrefix?: boolean
}

function useTypingAnimation(
  content: string,
  options?: boolean | TypingAnimationOptions,
  onTyping?: (rendered: string, current: string) => void,
  onComplete?: (content: string) => void
) {
  const [displayedContent, setDisplayedContent] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)
  const previousContentRef = React.useRef('')

  const config: TypingAnimationOptions = React.useMemo(() => {
    if (typeof options === 'boolean') {
      return options
        ? { effect: 'typing', step: 1, interval: 30 }
        : { effect: 'typing', step: 1000, interval: 0 }
    }
    return {
      effect: options?.effect || 'typing',
      step: options?.step || 1,
      interval: options?.interval || 30,
      keepPrefix: options?.keepPrefix ?? true,
    }
  }, [options])

  React.useEffect(() => {
    if (!options || !content) {
      setDisplayedContent(content)
      setIsComplete(true)
      return
    }

    setIsComplete(false)

    // Find common prefix if keepPrefix is enabled
    let startIndex = 0
    if (config.keepPrefix && previousContentRef.current) {
      while (
        startIndex < previousContentRef.current.length &&
        startIndex < content.length &&
        previousContentRef.current[startIndex] === content[startIndex]
      ) {
        startIndex++
      }
    }

    setDisplayedContent(content.slice(0, startIndex))

    const getStep = () => {
      if (Array.isArray(config.step)) {
        return (
          Math.floor(Math.random() * (config.step[1] - config.step[0] + 1)) +
          config.step[0]
        )
      }
      return config.step || 1
    }

    let currentIndex = startIndex
    const interval = setInterval(() => {
      if (currentIndex >= content.length) {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.(content)
        previousContentRef.current = content
        return
      }

      const step = getStep()
      currentIndex = Math.min(currentIndex + step, content.length)
      const newContent = content.slice(0, currentIndex)
      setDisplayedContent(newContent)
      onTyping?.(newContent, content)
    }, config.interval)

    return () => clearInterval(interval)
  }, [content, options, config, onTyping, onComplete])

  return { displayedContent, isComplete }
}

// ============================================================================
// BUBBLE COMPONENT
// ============================================================================

interface BubbleSlot<T = string> {
  content?: T
  render?: (content: T, info: BubbleInfo) => React.ReactNode
}

interface BubbleInfo {
  status?: 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort'
  key?: string | number
  extraInfo?: Record<string, unknown>
}

interface BubbleProps extends VariantProps<typeof bubbleVariants> {
  content?: React.ReactNode
  contentRender?: (
    content: React.ReactNode,
    info: BubbleInfo
  ) => React.ReactNode
  loading?: boolean
  loadingRender?: () => React.ReactNode
  typing?: boolean | TypingAnimationOptions
  streaming?: boolean
  editable?:
    | boolean
    | {
        editing?: boolean
        okText?: React.ReactNode
        cancelText?: React.ReactNode
      }
  header?:
    | React.ReactNode
    | ((content: React.ReactNode, info: BubbleInfo) => React.ReactNode)
  footer?:
    | React.ReactNode
    | ((content: React.ReactNode, info: BubbleInfo) => React.ReactNode)
  avatar?:
    | React.ReactNode
    | { src?: string; fallback?: string; className?: string }
  extra?: React.ReactNode
  footerPlacement?: 'outer-start' | 'outer-end' | 'inner-start' | 'inner-end'
  onTyping?: (renderedContent: string, currentContent: string) => void
  onTypingComplete?: (content: string) => void
  onEditConfirm?: (content: string) => void
  onEditCancel?: () => void
  className?: string
  style?: React.CSSProperties
  info?: BubbleInfo
}

export function Bubble({
  content,
  contentRender,
  loading = false,
  loadingRender,
  typing = false,
  streaming = false,
  editable = false,
  header,
  footer,
  avatar,
  extra,
  footerPlacement = 'outer-start',
  variant,
  shape,
  placement = 'start',
  size,
  onTyping,
  onTypingComplete,
  onEditConfirm,
  onEditCancel,
  className,
  style,
  info = {},
}: BubbleProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const stringContent = typeof content === 'string' ? content : ''
  const { displayedContent, isComplete } = useTypingAnimation(
    stringContent,
    typing && !loading && !streaming,
    onTyping,
    streaming ? undefined : onTypingComplete
  )

  // Handle streaming completion
  React.useEffect(() => {
    if (!streaming && isComplete && typing && stringContent) {
      onTypingComplete?.(stringContent)
    }
  }, [streaming, isComplete, typing, stringContent, onTypingComplete])

  const editableConfig =
    typeof editable === 'boolean'
      ? { editing: isEditing, okText: 'Save', cancelText: 'Cancel' }
      : editable

  const handleEditStart = () => {
    setEditContent(stringContent)
    setIsEditing(true)
  }

  const handleEditConfirm = () => {
    onEditConfirm?.(editContent)
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    onEditCancel?.()
    setIsEditing(false)
  }

  const renderContent = () => {
    if (loading) {
      return loadingRender?.() || <BubbleLoadingIndicator />
    }

    if (editableConfig.editing || isEditing) {
      return (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[60px] bg-transparent border border-border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleEditCancel}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {editableConfig.cancelText}
            </button>
            <button
              onClick={handleEditConfirm}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {editableConfig.okText}
            </button>
          </div>
        </div>
      )
    }

    const displayContent = typing ? displayedContent : content
    const finalContent = contentRender
      ? contentRender(displayContent, info)
      : displayContent

    return (
      <>
        {finalContent}
        {typing && !isComplete && <TypingCursor />}
      </>
    )
  }

  const renderAvatar = () => {
    if (!avatar) return null

    if (React.isValidElement(avatar)) {
      return avatar
    }

    const avatarConfig = avatar as {
      src?: string
      fallback?: string
      className?: string
    }
    return (
      <Avatar className={cn('h-8 w-8 shrink-0', avatarConfig.className)}>
        {avatarConfig.src && (
          <AvatarImage src={avatarConfig.src || '/placeholder.svg'} />
        )}
        <AvatarFallback className="text-xs">
          {avatarConfig.fallback || (placement === 'start' ? 'AI' : 'U')}
        </AvatarFallback>
      </Avatar>
    )
  }

  const renderHeader = () => {
    if (!header) return null
    return typeof header === 'function' ? header(content, info) : header
  }

  const renderFooter = () => {
    if (!footer) return null
    const footerContent =
      typeof footer === 'function' ? footer(content, info) : footer

    const isInner = footerPlacement.startsWith('inner')
    const isStart = footerPlacement.endsWith('start')

    return (
      <div
        className={cn(
          'text-xs text-muted-foreground',
          isInner ? 'mt-2' : 'mt-1',
          !isStart && 'text-right'
        )}
      >
        {footerContent}
      </div>
    )
  }

  const isStart = placement === 'start'

  return (
    <div
      className={cn(
        'flex gap-3 group',
        !isStart && 'flex-row-reverse',
        className
      )}
      style={style}
    >
      {renderAvatar()}

      <div className={cn('flex flex-col', !isStart && 'items-end')}>
        {renderHeader() && (
          <div
            className={cn(
              'text-xs text-muted-foreground mb-1',
              !isStart && 'text-right'
            )}
          >
            {renderHeader()}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div
            className={cn(
              bubbleVariants({ variant, shape, placement, size }),
              editable && 'cursor-pointer hover:ring-2 hover:ring-primary/20'
            )}
            onDoubleClick={editable ? handleEditStart : undefined}
          >
            {renderContent()}
            {footerPlacement.startsWith('inner') && renderFooter()}
          </div>

          {extra && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {extra}
            </div>
          )}
        </div>

        {footerPlacement.startsWith('outer') && renderFooter()}
      </div>
    </div>
  )
}

// ============================================================================
// TYPING CURSOR
// ============================================================================

function TypingCursor() {
  return (
    <span className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse" />
  )
}

// ============================================================================
// BUBBLE LOADING INDICATOR
// ============================================================================

function BubbleLoadingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
    </div>
  )
}

// ============================================================================
// BUBBLE SYSTEM - For system messages
// ============================================================================

interface BubbleSystemProps {
  content?: React.ReactNode
  variant?: 'filled' | 'outlined' | 'shadow' | 'borderless'
  shape?: 'default' | 'round' | 'square'
  className?: string
  icon?: React.ReactNode
}

export function BubbleSystem({
  content,
  variant = 'shadow',
  shape = 'default',
  className,
  icon,
}: BubbleSystemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 py-2 px-4 mx-auto max-w-fit text-sm text-muted-foreground',
        variant === 'filled' && 'bg-muted',
        variant === 'outlined' && 'border border-border',
        variant === 'shadow' && 'bg-background shadow-sm',
        shape === 'default' && 'rounded-full',
        shape === 'round' && 'rounded-2xl',
        shape === 'square' && 'rounded-lg',
        className
      )}
    >
      {icon}
      {content}
    </div>
  )
}

// ============================================================================
// BUBBLE DIVIDER
// ============================================================================

interface BubbleDividerProps {
  content?: React.ReactNode
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
}

export function BubbleDivider({
  content,
  variant = 'solid',
  className,
}: BubbleDividerProps) {
  return (
    <div className={cn('flex items-center gap-4 py-4', className)}>
      <div
        className={cn(
          'flex-1 h-px bg-border',
          variant === 'dashed' &&
            'border-t border-dashed border-border bg-transparent',
          variant === 'dotted' &&
            'border-t border-dotted border-border bg-transparent'
        )}
      />
      {content && (
        <span className="text-xs text-muted-foreground shrink-0">
          {content}
        </span>
      )}
      <div
        className={cn(
          'flex-1 h-px bg-border',
          variant === 'dashed' &&
            'border-t border-dashed border-border bg-transparent',
          variant === 'dotted' &&
            'border-t border-dotted border-border bg-transparent'
        )}
      />
    </div>
  )
}

// ============================================================================
// BUBBLE LIST - Auto-scrolling container
// ============================================================================

type MessageStatus =
  | 'local'
  | 'loading'
  | 'updating'
  | 'success'
  | 'error'
  | 'abort'

interface BubbleListItem extends Omit<BubbleProps, 'info'> {
  key: string | number
  role: 'ai' | 'user' | 'system' | 'divider' | string
  status?: MessageStatus
  extraInfo?: Record<string, unknown>
}

interface RoleConfig {
  ai?: Partial<BubbleProps>
  user?: Partial<BubbleProps>
  system?: Partial<BubbleSystemProps>
  divider?: Partial<BubbleDividerProps>
  [key: string]:
    | Partial<BubbleProps>
    | Partial<BubbleSystemProps>
    | Partial<BubbleDividerProps>
    | undefined
}

interface BubbleListRef {
  scrollTo: (options: {
    key?: string | number
    offset?: number
    behavior?: 'smooth' | 'instant'
  }) => void
  nativeElement: HTMLDivElement | null
}

interface BubbleListProps {
  items: BubbleListItem[]
  autoScroll?: boolean
  roles?: RoleConfig
  className?: string
  style?: React.CSSProperties
  gap?: number
}

export const BubbleList = React.forwardRef<BubbleListRef, BubbleListProps>(
  (
    { items, autoScroll = true, roles = {}, className, style, gap = 16 },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [userScrolled, setUserScrolled] = React.useState(false)

    React.useImperativeHandle(ref, () => ({
      scrollTo: ({ key, offset, behavior = 'smooth' }) => {
        if (!containerRef.current) return

        if (key !== undefined) {
          const element = containerRef.current.querySelector(
            `[data-bubble-key="${key}"]`
          )
          element?.scrollIntoView({ behavior, block: 'center' })
        } else if (offset !== undefined) {
          containerRef.current.scrollTo({ top: offset, behavior })
        } else {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior,
          })
        }
      },
      nativeElement: containerRef.current,
    }))

    // Auto-scroll effect
    React.useEffect(() => {
      if (!autoScroll || userScrolled || !containerRef.current) return

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }, [items, autoScroll, userScrolled])

    // Detect user scroll
    const handleScroll = React.useCallback(() => {
      if (!containerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      setUserScrolled(!isNearBottom)
    }, [])

    const defaultRoles: RoleConfig = {
      ai: { placement: 'start', variant: 'filled' },
      user: { placement: 'end', variant: 'filled' },
      system: {},
      divider: {},
    }

    const mergedRoles = { ...defaultRoles, ...roles }

    return (
      <div
        ref={containerRef}
        className={cn('flex flex-col overflow-y-auto scroll-smooth', className)}
        style={{ gap, ...style }}
        onScroll={handleScroll}
      >
        {items.map((item) => {
          const { key, role, status, extraInfo, ...bubbleProps } = item
          const roleConfig = mergedRoles[role] || {}
          const info = { status, key, extraInfo }

          if (role === 'system') {
            return (
              <BubbleSystem
                key={key}
                data-bubble-key={key}
                {...(roleConfig as Partial<BubbleSystemProps>)}
                {...(bubbleProps as Partial<BubbleSystemProps>)}
              />
            )
          }

          if (role === 'divider') {
            return (
              <BubbleDivider
                key={key}
                data-bubble-key={key}
                {...(roleConfig as Partial<BubbleDividerProps>)}
                {...(bubbleProps as Partial<BubbleDividerProps>)}
              />
            )
          }

          return (
            <Bubble
              key={key}
              data-bubble-key={key}
              {...(roleConfig as Partial<BubbleProps>)}
              {...bubbleProps}
              info={info}
              loading={status === 'loading'}
            />
          )
        })}
      </div>
    )
  }
)

BubbleList.displayName = 'BubbleList'

// ============================================================================
// EXPORTS
// ============================================================================

export {
  bubbleVariants,
  type BubbleProps,
  type BubbleListItem,
  type BubbleListRef,
  type BubbleListProps,
  type TypingAnimationOptions,
}
