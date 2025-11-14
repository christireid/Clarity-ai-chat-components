/**
 * Quick Start Example
 * 
 * Simplest possible example - zero configuration needed
 */

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
} from '../../index'
import { useQuickOptimize } from '../hooks/use-quick-optimize'

export function QuickStartExample() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // That's it! Zero configuration needed
  const { optimizedMessages, wasOptimized, tokenStats } = useQuickOptimize({
    messages: chat.messages,
    model: 'gpt-4', // Default preset: 'balanced'
  })

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h1 className="text-xl font-bold">Quick Start Example</h1>
        {wasOptimized && tokenStats.saved > 0 && (
          <div className="mt-2 text-sm text-green-600">
            ✅ Optimized: Saved {tokenStats.saved} tokens
            ({tokenStats.original} → {tokenStats.optimized})
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-auto p-4">
        <ChatWindow
          messages={convertCoreMessagesToMessages(optimizedMessages)}
          onSendMessage={(message) => {
            chat.append({
              role: 'user',
              content: message,
            })
          }}
          isLoading={chat.isLoading}
        />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input')
            if (input?.value) {
              chat.append({
                role: 'user',
                content: input.value,
              })
              input.value = ''
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={chat.isLoading}
          />
          <button
            type="submit"
            disabled={chat.isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * Example with preset selection
 */
export function QuickStartWithPresetExample() {
  const [preset, setPreset] = React.useState<'balanced' | 'conservative' | 'aggressive'>('balanced')
  
  const chat = useClarityChat({
    api: '/api/chat',
  })

  const { optimizedMessages, tokenStats } = useQuickOptimize({
    messages: chat.messages,
    model: 'gpt-4',
    preset,
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Quick Start with Preset</h1>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as any)}
            className="px-3 py-1 border rounded"
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        {tokenStats.saved > 0 && (
          <div className="mt-2 text-sm">
            Tokens: {tokenStats.optimized} / {tokenStats.original} (saved {tokenStats.saved})
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <ChatWindow
          messages={convertCoreMessagesToMessages(optimizedMessages)}
          onSendMessage={(message) => {
            chat.append({
              role: 'user',
              content: message,
            })
          }}
          isLoading={chat.isLoading}
        />
      </div>

      <div className="border-t p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input')
            if (input?.value) {
              chat.append({
                role: 'user',
                content: input.value,
              })
              input.value = ''
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={chat.isLoading}
          />
          <button
            type="submit"
            disabled={chat.isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
