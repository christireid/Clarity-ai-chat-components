/**
 * Clarity Chat with Memory Example
 *
 * Example demonstrating useClarityChat with memory integration enabled.
 * Shows how to use MemoryProvider and enable memory features.
 *
 * @example
 * ```tsx
 * import {
 *   MemoryProvider,
 *   ClarityChatWithMemoryExample
 * } from '@clarity-chat/react'
 *
 * function App() {
 *   return (
 *     <MemoryProvider config={{ maxMemories: 1000 }}>
 *       <ClarityChatWithMemoryExample />
 *     </MemoryProvider>
 *   )
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat/ChatWindow'
import { convertCoreMessagesToMessages } from '../utils/message/message-conversion'
import { MemoryProvider } from '../memory/memory-provider'
import type { MemoryServiceConfig } from '@clarity-chat/memory'

/**
 * Clarity Chat with Memory Example Component
 *
 * Demonstrates useClarityChat with memory integration enabled.
 * Memory automatically stores conversations and enriches context.
 */
export function ClarityChatWithMemoryExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store', // or 'sliding-window' or 'semantic-chunks'
      maxTokens: 2000,
    },
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await append({
        role: 'user',
        content,
      })
    },
    [append]
  )

  return (
    <div className="flex h-screen w-full flex-col">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        showHeader={true}
        sessionTitle="Clarity Chat with Memory"
        sessionSubtitle="Conversations are automatically stored and enriched"
      />
    </div>
  )
}

/**
 * Wrapper component that includes MemoryProvider
 *
 * Use this if you don't already have MemoryProvider in your app.
 */
export function ClarityChatWithMemoryExampleWrapped({
  memoryConfig,
}: {
  memoryConfig?: MemoryServiceConfig
}) {
  return (
    <MemoryProvider
      config={
        memoryConfig || {
          maxMemories: 1000,
          enableVectorSearch: true,
        }
      }
    >
      <ClarityChatWithMemoryExample />
    </MemoryProvider>
  )
}
