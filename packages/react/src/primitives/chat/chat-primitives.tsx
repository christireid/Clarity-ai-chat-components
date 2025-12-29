'use client'

/**
 * Chat Primitives
 *
 * Unstyled, accessible, composable building blocks for chat UIs.
 * These are headless components that handle accessibility and behavior
 * while leaving styling entirely to you.
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'

// ============================================================================
// CONTEXT
// ============================================================================

interface ChatContextValue {
  messages: CoreMessage[]
  isLoading: boolean
  onSend?: (content: string) => void
}

const ChatContext = React.createContext<ChatContextValue | null>(null)

function useChatContext() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error('Chat primitives must be used within ChatPrimitive.Root')
  }
  return context
}

interface MessageContextValue {
  message: CoreMessage
  isStreaming: boolean
}

const MessageContext = React.createContext<MessageContextValue | null>(null)

function useMessageContext() {
  const context = React.useContext(MessageContext)
  if (!context) {
    throw new Error('Message primitives must be used within ChatPrimitive.Message')
  }
  return context
}

// ============================================================================
// ROOT
// ============================================================================

export interface ChatRootProps {
  children: React.ReactNode
  messages?: CoreMessage[]
  isLoading?: boolean
  onSend?: (content: string) => void
  asChild?: boolean
  className?: string
}

export const ChatRoot = React.forwardRef<HTMLDivElement, ChatRootProps>(
  ({ children, messages = [], isLoading = false, onSend, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <ChatContext.Provider value={{ messages, isLoading, onSend }}>
        <Comp
          ref={ref}
          className={className}
          role="region"
          aria-label="Chat interface"
          {...props}
        >
          {children}
        </Comp>
      </ChatContext.Provider>
    )
  }
)
ChatRoot.displayName = 'ChatPrimitive.Root'

// ============================================================================
// MESSAGES CONTAINER
// ============================================================================

export interface ChatMessagesProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export const ChatMessages = React.forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        className={className}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ChatMessages.displayName = 'ChatPrimitive.Messages'

// ============================================================================
// SINGLE MESSAGE
// ============================================================================

export interface ChatMessageProps {
  children: React.ReactNode
  message: CoreMessage
  isStreaming?: boolean
  asChild?: boolean
  className?: string
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ children, message, isStreaming = false, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <MessageContext.Provider value={{ message, isStreaming }}>
        <Comp
          ref={ref}
          className={className}
          role="article"
          aria-label={`${message.role} message`}
          data-role={message.role}
          data-streaming={isStreaming}
          {...props}
        >
          {children}
        </Comp>
      </MessageContext.Provider>
    )
  }
)
ChatMessage.displayName = 'ChatPrimitive.Message'

// ============================================================================
// MESSAGE CONTENT
// ============================================================================

export interface ChatMessageContentProps {
  asChild?: boolean
  className?: string
  children?: React.ReactNode
}

export const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const { message } = useMessageContext()
    const Comp = asChild ? Slot : 'div'

    const content = typeof message.content === 'string'
      ? message.content
      : Array.isArray(message.content)
        ? message.content.map(part => typeof part === 'string' ? part : '').join('')
        : ''

    return (
      <Comp ref={ref} className={className} {...props}>
        {children ?? content}
      </Comp>
    )
  }
)
ChatMessageContent.displayName = 'ChatPrimitive.MessageContent'

// ============================================================================
// MESSAGE ACTIONS
// ============================================================================

export interface ChatMessageActionsProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export const ChatMessageActions = React.forwardRef<HTMLDivElement, ChatMessageActionsProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        className={className}
        role="group"
        aria-label="Message actions"
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ChatMessageActions.displayName = 'ChatPrimitive.MessageActions'

// ============================================================================
// INPUT
// ============================================================================

export interface ChatInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: (content: string) => void
  asChild?: boolean
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSubmit, asChild, onKeyDown, className, ...props }, ref) => {
    const { onSend } = useChatContext()
    const [value, setValue] = React.useState('')

    const handleSubmit = React.useCallback(() => {
      const trimmed = value.trim()
      if (trimmed) {
        (onSubmit ?? onSend)?.(trimmed)
        setValue('')
      }
    }, [value, onSubmit, onSend])

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      onKeyDown?.(e)
    }, [handleSubmit, onKeyDown])

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          {...props}
        />
      )
    }

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={className}
        aria-label="Message input"
        placeholder="Type a message..."
        rows={1}
        {...props}
      />
    )
  }
)
ChatInput.displayName = 'ChatPrimitive.Input'

// ============================================================================
// ACTION BUTTONS
// ============================================================================

export interface ChatCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onCopy?: (content: string) => void
  asChild?: boolean
}

export const ChatCopyButton = React.forwardRef<HTMLButtonElement, ChatCopyButtonProps>(
  ({ onClick, onCopy, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext()
    const Comp = asChild ? Slot : 'button'

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const content = typeof message.content === 'string' ? message.content : ''
      navigator.clipboard.writeText(content)
      onCopy?.(content)
      onClick?.(e)
    }, [message.content, onCopy, onClick])

    return (
      <Comp
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label="Copy message"
        {...props}
      >
        {children ?? 'Copy'}
      </Comp>
    )
  }
)
ChatCopyButton.displayName = 'ChatPrimitive.CopyButton'

export interface ChatRegenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onRegenerate?: (messageId: string) => void
  asChild?: boolean
}

export const ChatRegenerateButton = React.forwardRef<HTMLButtonElement, ChatRegenerateButtonProps>(
  ({ onClick, onRegenerate, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext()
    const Comp = asChild ? Slot : 'button'

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (message.id) {
        onRegenerate?.(message.id)
      }
      onClick?.(e)
    }, [message.id, onRegenerate, onClick])

    return (
      <Comp
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label="Regenerate message"
        {...props}
      >
        {children ?? 'Regenerate'}
      </Comp>
    )
  }
)
ChatRegenerateButton.displayName = 'ChatPrimitive.RegenerateButton'

export interface ChatDeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onDelete?: (messageId: string) => void
  asChild?: boolean
}

export const ChatDeleteButton = React.forwardRef<HTMLButtonElement, ChatDeleteButtonProps>(
  ({ onClick, onDelete, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext()
    const Comp = asChild ? Slot : 'button'

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (message.id) {
        onDelete?.(message.id)
      }
      onClick?.(e)
    }, [message.id, onDelete, onClick])

    return (
      <Comp
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label="Delete message"
        {...props}
      >
        {children ?? 'Delete'}
      </Comp>
    )
  }
)
ChatDeleteButton.displayName = 'ChatPrimitive.DeleteButton'

// ============================================================================
// EMPTY STATE
// ============================================================================

export interface ChatEmptyStateProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export const ChatEmptyState = React.forwardRef<HTMLDivElement, ChatEmptyStateProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const { messages } = useChatContext()
    const Comp = asChild ? Slot : 'div'

    if (messages.length > 0) {
      return null
    }

    return (
      <Comp
        ref={ref}
        className={className}
        role="status"
        aria-label="No messages yet"
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ChatEmptyState.displayName = 'ChatPrimitive.EmptyState'

// ============================================================================
// LOADING INDICATOR
// ============================================================================

export interface ChatLoadingIndicatorProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export const ChatLoadingIndicator = React.forwardRef<HTMLDivElement, ChatLoadingIndicatorProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const { isLoading } = useChatContext()
    const Comp = asChild ? Slot : 'div'

    if (!isLoading) {
      return null
    }

    return (
      <Comp
        ref={ref}
        className={className}
        role="status"
        aria-label="Loading"
        aria-live="polite"
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ChatLoadingIndicator.displayName = 'ChatPrimitive.LoadingIndicator'
