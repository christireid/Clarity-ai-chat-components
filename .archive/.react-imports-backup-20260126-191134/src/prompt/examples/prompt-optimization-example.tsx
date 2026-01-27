/**
 * Prompt Optimization Example
 *
 * Demonstrates prompt optimization with token stats display
 */

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
} from '../../index'
import { usePromptInspector } from '../hooks/hooks/use-prompt-inspector'

export function PromptOptimizationExample() {
  const [showInspector, setShowInspector] = React.useState(false)

  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'sliding-window',
      model: {
        model: 'gpt-4',
        maxTokens: 8000,
        inputPricePer1K: 0.03,
        outputPricePer1K: 0.06,
        tokenizer: 'openai',
      },
    },
  })

  const inspector = usePromptInspector({
    messages: chat.messages,
    model: {
      model: 'gpt-4',
      maxTokens: 8000,
      tokenizer: 'openai',
    },
    enabled: showInspector,
  })

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Token Stats */}
        <div className="border-b p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Chat with Optimization</h1>
            <div className="flex items-center gap-4">
              {chat.tokenStats && (
                <div className="text-sm">
                  <span className="font-medium">Tokens:</span>{' '}
                  <span
                    className={
                      chat.tokenStats.wasOptimized
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }
                  >
                    {chat.tokenStats.optimized}
                  </span>
                  {chat.tokenStats.wasOptimized && (
                    <>
                      {' '}
                      <span className="text-gray-500">
                        / {chat.tokenStats.original}
                      </span>{' '}
                      <span className="text-green-600">
                        (saved {chat.tokenStats.saved})
                      </span>
                    </>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowInspector(!showInspector)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showInspector ? 'Hide' : 'Show'} Inspector
              </button>
            </div>
          </div>
          {chat.tokenStats?.lastOptimizationReason && (
            <div className="mt-2 text-xs text-gray-600">
              Last optimization: {chat.tokenStats.lastOptimizationReason}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-auto">
          <ChatWindow
            messages={convertCoreMessagesToMessages(chat.messages)}
            onSendMessage={(message) => {
              chat.append({
                role: 'user',
                content: message,
              })
            }}
            isLoading={chat.isLoading}
          />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
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

      {/* Inspector Panel */}
      {showInspector && (
        <div className="w-80 border-l bg-gray-50 p-4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">Prompt Inspector</h2>

          {/* Token Summary */}
          <div className="mb-6 p-3 bg-white rounded border">
            <h3 className="font-medium mb-2">Token Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono">{inspector.totalTokens}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="font-mono">
                  {inspector.budgetPercentage.toFixed(1)}%
                </span>
              </div>
              {inspector.isOverBudget && (
                <div className="text-red-600 font-medium">⚠️ Over budget!</div>
              )}
              {inspector.estimatedCost && (
                <div className="flex justify-between pt-2 border-t">
                  <span>Est. Cost:</span>
                  <span className="font-mono">
                    ${inspector.estimatedCost.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown by Role */}
          <div className="mb-6 p-3 bg-white rounded border">
            <h3 className="font-medium mb-2">Breakdown by Role</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(inspector.breakdown).map(([role, tokens]) => (
                <div key={role} className="flex justify-between">
                  <span className="capitalize">{role}:</span>
                  <span className="font-mono">{tokens}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Inspections */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Messages</h3>
            <div className="space-y-2">
              {inspector.messageInspections.map((inspection, i) => (
                <div key={i} className="p-2 bg-white rounded border text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium capitalize">
                      {inspection.role}
                    </span>
                    <span className="font-mono text-gray-600">
                      {inspection.tokens} tokens
                    </span>
                  </div>
                  <div className="text-gray-600 truncate">
                    {inspection.contentPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Info */}
          {chat.tokenStats && (
            <div className="p-3 bg-white rounded border">
              <h3 className="font-medium mb-2">Optimization</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Was Optimized:</span>
                  <span>
                    {chat.tokenStats.wasOptimized ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                {chat.tokenStats.wasOptimized && (
                  <>
                    <div className="flex justify-between">
                      <span>Compression:</span>
                      <span className="font-mono">
                        {(chat.tokenStats.compressionRatio * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saved:</span>
                      <span className="font-mono text-green-600">
                        {chat.tokenStats.saved} tokens
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
