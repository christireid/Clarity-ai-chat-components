/**
 * Simple Copy-Paste Example
 * 
 * The simplest possible example - just copy, paste, and use!
 * No configuration needed.
 */

import { useClarityChat, ChatWindow } from '@clarity-chat/react'

/**
 * Simplest possible usage - zero configuration
 */
export function SimpleOptimizedChat() {
  const { messages, append, isLoading, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,  // That's it! Everything else is automatic
    },
  })

  return (
    <div>
      <ChatWindow 
        messages={messages} 
        onSend={append}
        isLoading={isLoading}
      />
      
      {/* Optional: Show token stats */}
      {tokenStats && (
        <div style={{ padding: '10px', background: '#f5f5f5' }}>
          Tokens: {tokenStats.currentTokens} / {tokenStats.targetTokens}
        </div>
      )}
    </div>
  )
}

/**
 * With custom token budget
 */
export function CustomBudgetChat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,  // Your token budget
      strategy: 'hybrid',  // Best strategy
    },
  })

  return (
    <ChatWindow messages={messages} onSend={append} />
  )
}

/**
 * Using the optimization hook directly
 */
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react/prompt'

export function DirectOptimizationChat({ messages }) {
  const { optimizedMessages, tokenStats } = usePromptOptimizer({
    messages,
    model: getModelProfile('gpt-4'),  // Pre-configured model
    targetTokens: 4000,
    autoOptimize: true,  // Automatic optimization
  })

  return <ChatWindow messages={optimizedMessages} />
}
