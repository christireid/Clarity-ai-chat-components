/**
 * Hello World Examples - The Simplest Possible Usage
 * 
 * These examples demonstrate the absolute minimum code needed to get
 * Clarity Chat working. Each example is 10-20 lines of code.
 */

import * as React from 'react'
import { ClarityChat, useChat, ChatWindow, ChatWithMemory } from '../index'

/**
 * Example 1: ClarityChat Component (1 line)
 * 
 * The absolute simplest way to add AI chat to your app.
 * Zero configuration, automatic everything.
 * 
 * LOC: 1 (component) + 2 (imports) = 3 total
 */
export function HelloWorld_ClarityChat() {
  return <ClarityChat api="/api/chat" />
}

/**
 * Example 2: ClarityChat with Styling (3 lines)
 * 
 * Add basic styling with minimal code.
 * 
 * LOC: 3
 */
export function HelloWorld_ClarityChatStyled() {
  return (
    <div className="h-screen">
      <ClarityChat api="/api/chat" />
    </div>
  )
}

/**
 * Example 3: useChat Hook (10 lines)
 * 
 * Using the simplified hook for more control.
 * 
 * LOC: 10
 */
export function HelloWorld_UseChat() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}

/**
 * Example 4: ChatWithMemory (1 line)
 * 
 * Chat with memory pre-configured.
 * 
 * LOC: 1 (component) + 2 (imports) = 3 total
 */
export function HelloWorld_ChatWithMemory() {
  return <ChatWithMemory api="/api/chat" strategy="vector-store" />
}

/**
 * Example 5: useChat with Persistence (12 lines)
 * 
 * Chat with localStorage persistence.
 * 
 * LOC: 12
 */
export function HelloWorld_UseChatPersistent() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat({
    api: '/api/chat',
    persistMessages: true,
  })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
      onClear={clearMessages}
    />
  )
}
