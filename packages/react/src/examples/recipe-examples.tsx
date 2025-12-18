/**
 * Recipe Component Examples
 * 
 * Demonstrates the pre-built recipe components for common patterns
 */

import {
  ChatWithMemory,
  ChatWithAnalytics,
  ChatWithPreset,
  ChatWithPersistence,
  ChatWithErrorHandling,
  ChatComplete,
} from '../components/chat-recipes'
import '@clarity-chat/react/styles.css'

/**
 * Example 1: Chat with Memory
 */
export function MemoryChatExample() {
  return (
    <div style={{ height: '600px' }}>
      <ChatWithMemory
        api="/api/chat"
        strategy="vector-store"
        maxTokens={8000}
      />
    </div>
  )
}

/**
 * Example 2: Chat with Analytics
 */
export function AnalyticsChatExample() {
  return (
    <div style={{ height: '600px' }}>
      <ChatWithAnalytics
        api="/api/chat"
        onMessageSent={(content) => {
          logger.debug('Message sent:', content)
          // Send to analytics service
        }}
        onMessageReceived={(messageId) => {
          logger.debug('Message received:', messageId)
          // Track in analytics
        }}
        onError={(error) => {
          logger.logger.error('Chat error:', error)
          // Send to error tracking
        }}
      />
    </div>
  )
}

/**
 * Example 3: Chat with Preset
 */
export function PresetChatExample() {
  return (
    <div style={{ height: '600px' }}>
      {/* Enterprise preset - includes memory, header, message count */}
      <ChatWithPreset preset="enterprise" api="/api/chat" />
    </div>
  )
}

/**
 * Example 4: Chat with Persistence
 */
export function PersistentChatExample() {
  return (
    <div style={{ height: '600px' }}>
      <ChatWithPersistence
        api="/api/chat"
        storageKey="my-chat-session"
        persist={true}
      />
    </div>
  )
}

/**
 * Example 5: Chat with Error Handling
 */
export function ErrorHandlingChatExample() {
  return (
    <div style={{ height: '600px' }}>
      <ChatWithErrorHandling
        api="/api/chat"
        onError={(error, errorInfo) => {
          logger.logger.error('Error caught:', error, errorInfo)
          // Send to error tracking service
        }}
        errorFallback={(error, reset) => (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Something went wrong</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      />
    </div>
  )
}

/**
 * Example 6: Complete Chat - Everything enabled
 */
export function CompleteChatExample() {
  return (
    <div style={{ height: '600px' }}>
      <ChatComplete
        api="/api/chat"
        memoryStrategy="vector-store"
        storageKey="complete-chat"
        onMessageSent={(content) => {
          logger.debug('Sent:', content)
        }}
        onMessageReceived={(id) => {
          logger.debug('Received:', id)
        }}
        onError={(error) => {
          logger.logger.error('Error:', error)
        }}
      />
    </div>
  )
}

/**
 * Example 7: Using Presets Programmatically
 */
export function PresetUsageExample() {
  const { applyChatPreset } = require('../presets/chat-presets')
  
  // Apply preset to custom options
  const options = applyChatPreset('enterprise', {
    api: '/api/chat',
    sessionTitle: 'Custom Enterprise Chat',
  })

  return (
    <div style={{ height: '600px' }}>
      {/* Use with ClarityChat */}
      {/* <ClarityChat {...options} /> */}
    </div>
  )
}
