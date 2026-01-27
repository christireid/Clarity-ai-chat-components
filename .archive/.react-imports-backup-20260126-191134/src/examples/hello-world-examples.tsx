/**
 * Hello World Examples - Simplest Possible Usage
 *
 * These examples demonstrate the absolute simplest way to use each major API.
 * Each example is 10-20 lines of code and requires minimal configuration.
 */

import * as React from 'react'
import '@clarity-chat/react/styles.css'
import { ClarityChat, ClarityChatPresets } from '../components/ClarityChat'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { useClarityObject } from '../hooks/use-clarity-object'
import { useChatHandlers } from '../hooks/use-chat-handlers'
import { ChatWindow } from '../components/chat/ChatWindow'
import { MemoryProvider } from '../memory/memory-provider'

// ============================================================================
// Example 1: Basic Chat (Simplest - 5 lines)
// ============================================================================

/**
 * The simplest possible chat implementation.
 * Zero configuration, works out of the box.
 */
export function HelloWorldChat() {
  return <ClarityChat api="/api/chat" />
}

// ============================================================================
// Example 1.5: Ultra-Simple Chat (3 lines!)
// ============================================================================

/**
 * Even simpler! Using the ultra-simple API.
 */
export function UltraSimpleChat() {
  return chat('/api/chat') // Returns JSX.Element directly!
}

// ============================================================================
// Example 1.75: Preset Chat (2 lines!)
// ============================================================================

/**
 * Pre-configured chat with presets.
 */
export function PresetChat() {
  return ChatPresets.Minimal('/api/chat') // Even simpler presets!
}

// ============================================================================
// Example 1.8: Builder Pattern (Fluent API)
// ============================================================================

/**
 * Build custom configurations with a fluent API.
 */
export function CustomChatWithBuilder() {
  return ChatBuilder.create('/api/chat')
    .withMemory('vector-store')
    .withHeader('My Custom Chat')
    .withStreaming()
    .withRateLimiting(true)
    .build()
}

// ============================================================================
// Example 2: Chat with Memory (10 lines)
// ============================================================================

/**
 * Chat with memory enabled - just wrap with MemoryProvider.
 */
export function HelloWorldChatWithMemory() {
  return (
    <MemoryProvider config={{ maxTokens: 4000 }}>
      <ClarityChat api="/api/chat" />
    </MemoryProvider>
  )
}

// ============================================================================
// Example 3: Structured Output (15 lines)
// ============================================================================

/**
 * Generate structured data - simplest form.
 */
interface Product {
  name: string
  price: number
  description: string
}

export function HelloWorldStructuredOutput() {
  const { object, run, isLoading } = useClarityObject<Product[]>({
    api: '/api/generate-products',
  })

  return (
    <div>
      <button onClick={() => run({ query: 'laptops' })} disabled={isLoading}>
        Generate Products
      </button>
      {object && <pre>{JSON.stringify(object, null, 2)}</pre>}
    </div>
  )
}

// ============================================================================
// Example 4: Chat with Hook (20 lines)
// ============================================================================

/**
 * Using the hook directly for more control.
 */
export function HelloWorldChatWithHook() {
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

// ============================================================================
// Example 5: Using Presets (10 lines)
// ============================================================================

/**
 * Using pre-configured presets for common scenarios.
 */
export function HelloWorldPresets() {
  return (
    <div>
      {/* Simple chat */}
      <ClarityChatPresets.Simple api="/api/chat" />

      {/* Chat with memory */}
      <ClarityChatPresets.WithMemory api="/api/chat" />
    </div>
  )
}

// ============================================================================
// Imports (for reference - these would be at the top)
// ============================================================================
// import { ClarityChat, ClarityChatPresets } from '@clarity-chat/react'
// import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'
// import { useClarityObject } from '@clarity-chat/react'
// import { MemoryProvider } from '@clarity-chat/react'
