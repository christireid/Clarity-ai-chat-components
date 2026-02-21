/**
 * Simple Chat with Hook - More Control
 * 
 * If you need more control, use the hook directly.
 * ChatWindow now accepts CoreMessage[] directly - no conversion needed!
 */

import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function SimpleChatWithHook() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages} // No conversion needed! ✨
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}

/**
 * What changed:
 * - No more convertCoreMessagesToMessages() needed!
 * - ChatWindow automatically handles CoreMessage[] format
 * - Same beautiful UI, less boilerplate
 */
