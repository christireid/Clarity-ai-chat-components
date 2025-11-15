/**
 * ClarityChat - Drop-in ready chat component
 * 
 * This is the simplest way to get a fully-featured AI chat interface.
 * It combines useClarityChat hook with ChatWindow component and handles
 * all message conversions automatically.
 * 
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * 
 * function App() {
 *   return (
 *     <ClarityChat
 *       api="/api/chat"
 *     />
 *   )
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from '../hooks/use-clarity-chat'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import { ChatWindow, type ChatWindowProps } from './chat-window'
import { validateApiEndpoint } from '../utils/runtime-validation'

// Props that should go to ChatWindow, not useClarityChat
const CHAT_WINDOW_ONLY_PROPS = [
  'onMessageCopy',
  'onMessageFeedback',
  'onMessageRetry',
  'onEditMessage',
  'onRegenerateMessage',
  'onDeleteMessage',
  'emptyState',
  'showHeader',
  'sessionTitle',
  'sessionSubtitle',
  'headerActions',
  'showMessageCount',
  'onExport',
  'onClear',
  'className',
  'aiStatus',
] as const

type ChatWindowOnlyProps = Pick<ChatWindowProps, typeof CHAT_WINDOW_ONLY_PROPS[number]>

export interface ClarityChatProps extends UseClarityChatOptions, ChatWindowOnlyProps {
  /** API endpoint for chat requests */
  api: string
  /** Chat ID for message grouping (default: 'default') */
  chatId?: string
  /** Enable auto-scroll to bottom (default: true) */
  autoScroll?: boolean
}

/**
 * ClarityChat - The simplest way to add AI chat to your app
 * 
 * This component combines useClarityChat hook with ChatWindow component,
 * handling all the complexity of message conversion, state management, and
 * UI rendering automatically.
 * 
 * Features:
 * - Automatic message type conversion
 * - Built-in loading states
 * - Error handling
 * - Auto-scroll support
 * - All ChatWindow features available
 * 
 * @example Minimal usage
 * ```tsx
 * <ClarityChat api="/api/chat" />
 * ```
 * 
 * @example With memory
 * ```tsx
 * <ClarityChat
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'vector-store' }}
 * />
 * ```
 * 
 * @example With custom styling
 * ```tsx
 * <ClarityChat
 *   api="/api/chat"
 *   className="h-screen"
 *   showHeader
 *   sessionTitle="My AI Assistant"
 * />
 * ```
 */
export function ClarityChat(props: ClarityChatProps) {
  // Runtime validation with developer-friendly errors
  validateApiEndpoint(props.api, 'ClarityChat')

  const {
    api,
    chatId = 'default',
    autoScroll = true,
    // ChatWindow-only props
    onMessageCopy,
    onMessageFeedback,
    onMessageRetry,
    onEditMessage,
    onRegenerateMessage,
    onDeleteMessage,
    emptyState,
    showHeader,
    sessionTitle,
    sessionSubtitle,
    headerActions,
    showMessageCount,
    onExport,
    onClear,
    className,
    aiStatus,
    // Rest go to useClarityChat hook
    ...hookOptions
  } = props

  // Collect ChatWindow props
  const chatWindowProps: ChatWindowOnlyProps = {
    onMessageCopy,
    onMessageFeedback,
    onMessageRetry,
    onEditMessage,
    onRegenerateMessage,
    onDeleteMessage,
    emptyState,
    showHeader,
    sessionTitle,
    sessionSubtitle,
    headerActions,
    showMessageCount,
    onExport,
    onClear,
    className,
    aiStatus,
  }

  // Use the clarity chat hook
  const chat = useClarityChat({
    api,
    ...hookOptions,
  })

  // Convert CoreMessage[] to Message[] automatically
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages, chatId),
    [chat.messages, chatId]
  )

  // Handle sending messages
  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await chat.append({
        role: 'user',
        content,
      })
    },
    [chat]
  )

  // Auto-scroll effect
  React.useEffect(() => {
    if (autoScroll && messages.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const container = document.querySelector('[data-chat-container]')
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages.length, autoScroll])

  return (
    <div data-chat-container className={chatWindowProps.className}>
      <ChatWindow
        {...chatWindowProps}
        messages={messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

ClarityChat.displayName = 'ClarityChat'
