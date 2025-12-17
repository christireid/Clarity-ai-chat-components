import { logger } from '@clarity-chat/utils/logger';
/**
 * ClarityChat Quickstart Example
 * 
 * This demonstrates the simplest way to use Clarity Chat - just one component!
 */

import { ClarityChat } from '../components/clarity-chat'
import '@clarity-chat/react/dist/styles/index.css'

/**
 * Minimal Example - Just provide an API endpoint
 */
export function MinimalExample() {
  return (
    <div style={{ height: '600px', width: '100%', maxWidth: '800px' }}>
      <ClarityChat api="/api/chat" />
    </div>
  )
}

/**
 * With Custom Styling
 */
export function StyledExample() {
  return (
    <div style={{ height: '100vh' }}>
      <ClarityChat
        api="/api/chat"
        className="h-full"
        showHeader
        sessionTitle="My AI Assistant"
        sessionSubtitle="Powered by Clarity Chat"
      />
    </div>
  )
}

/**
 * With Memory Enabled
 */
export function WithMemoryExample() {
  return (
    <div style={{ height: '600px' }}>
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'vector-store',
        }}
      />
    </div>
  )
}

/**
 * With All Features
 */
export function FullFeaturedExample() {
  return (
    <div style={{ height: '600px' }}>
      <ClarityChat
        api="/api/chat"
        chatId="my-chat-session"
        showHeader
        sessionTitle="Full Featured Chat"
        showMessageCount
        onMessageCopy={(id, content) => {
          logger.debug('Message copied:', id, content)
        }}
        onMessageFeedback={(id, type) => {
          logger.debug('Feedback:', id, type)
        }}
        onExport={() => {
          logger.debug('Export conversation')
        }}
        onClear={() => {
          logger.debug('Clear conversation')
        }}
        memory={{
          enabled: true,
          strategy: 'vector-store',
        }}
      />
    </div>
  )
}
