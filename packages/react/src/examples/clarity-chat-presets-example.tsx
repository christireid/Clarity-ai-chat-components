/**
 * ClarityChat Presets Example
 * 
 * Shows how to use pre-configured chat setups for common use cases.
 */

import { ClarityChatPresets } from '../components/clarity-chat-presets'
import '@clarity-chat/react/styles.css'

/**
 * Simple chat - minimal configuration
 */
export function SimpleChatExample() {
  return <ClarityChatPresets.Simple api="/api/chat" />
}

/**
 * Chat with memory - context-aware conversations
 */
export function MemoryChatExample() {
  return (
    <ClarityChatPresets.WithMemory 
      api="/api/chat"
      memoryStrategy="sliding-window"
    />
  )
}

/**
 * Enterprise chat - full-featured with all options
 */
export function EnterpriseChatExample() {
  return (
    <ClarityChatPresets.Enterprise 
      api="/api/chat"
      sessionTitle="Enterprise Assistant"
      showHeader
    />
  )
}

/**
 * Streaming chat - optimized for real-time updates
 */
export function StreamingChatExample() {
  return (
    <ClarityChatPresets.Streaming 
      api="/api/chat"
      useWebSocket={false} // Use SSE (default) or true for WebSocket
    />
  )
}

/**
 * Custom chat using helper utilities
 */
export function CustomChatExample() {
  const { createMemoryChatConfig } = require('../utils/clarity-chat-helpers')
  const { useClarityChat, ChatWindow } = require('../hooks/use-clarity-chat')
  
  const config = createMemoryChatConfig('/api/chat', 'semantic-chunks', 6000)
  const chat = useClarityChat(config)
  
  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
    />
  )
}
