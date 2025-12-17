/**
 * Minimal Examples - Top-Level APIs
 *
 * These examples demonstrate the simplest usage of each top-level API.
 * Each example is 10-20 lines of code and shows the "happy path".
 */

import * as React from 'react'
import '@clarity-chat/react/styles.css'
import {
  ClarityChat,
  ClarityChatPresets,
} from '../components/chat/clarity-chat'
import { useClarityChat } from '../hooks/chat/use-clarity-chat'
import { useClarityObject } from '../hooks/chat/use-clarity-object'
import { useChatHandlers } from '../hooks/chat/use-chat-handlers'
import { ChatWindow } from '../components/chat/chat-window'

// ============================================================================
// Example 1: ClarityChat Component (3 lines)
// ============================================================================

/**
 * Simplest chat interface - just provide an API endpoint
 */
export function MinimalClarityChat() {
  return <ClarityChat api="/api/chat" />
}

// ============================================================================
// Example 2: useClarityChat Hook (10 lines)
// ============================================================================

/**
 * Chat with hook - more control, still simple
 */
export function MinimalUseClarityChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{String(msg.content)}</div>
      ))}
      <button onClick={() => append({ role: 'user', content: 'Hello!' })}>
        Send
      </button>
    </div>
  )
}

// ============================================================================
// Example 3: ClarityChatPresets (5 lines)
// ============================================================================

/**
 * Chat with memory using presets
 */
export function MinimalChatWithMemory() {
  return (
    <ClarityChatPresets.WithMemory
      api="/api/chat"
      memoryStrategy="sliding-window"
    />
  )
}

// ============================================================================
// Example 4: useClarityObject (15 lines)
// ============================================================================

/**
 * Structured output generation
 */
interface UserProfile {
  name: string
  email: string
  age: number
}

export function MinimalStructuredOutput() {
  const { object, run, isLoading } = useClarityObject<UserProfile>({
    api: '/api/generate-profile',
  })

  React.useEffect(() => {
    run({ prompt: 'Create a user profile' })
  }, [])

  return (
    <div>
      {isLoading && <p>Generating...</p>}
      {object && (
        <div>
          <h3>{object.name}</h3>
          <p>{object.email}</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 5: Chat with Handlers (12 lines)
// ============================================================================

/**
 * Chat with pre-configured handlers
 */
export function MinimalChatWithHandlers() {
  const chat = useClarityChat({ api: '/api/chat' })
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
    />
  )
}
