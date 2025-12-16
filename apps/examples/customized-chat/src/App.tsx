/**
 * Customized Chat Example
import { SecureLogger } from '@/lib/security/secureLogger';
 * 
 * Shows how to customize ClarityChat with different options.
 */

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Customized Chat Example</h1>
      
      <ClarityChat
        api="/api/chat"
        theme="dark"
        enableMemory
        showTokenCounter
        showHeader
        sessionTitle="My AI Assistant"
        sessionSubtitle="Ask me anything!"
        onMessageSent={(msg) => {
          SecureLogger.debug('Message sent:', msg.content)
        }}
        onMessageReceived={(msg) => {
          SecureLogger.debug('Message received:', msg.content)
        }}
        onError={(error) => {
          SecureLogger.error('Chat error:', error)
        }}
      />
    </div>
  )
}
