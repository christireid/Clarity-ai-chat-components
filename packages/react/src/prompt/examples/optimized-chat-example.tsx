/**
 * Example: Chat with Prompt Optimization
 * 
 * Demonstrates useClarityChat with prompt optimization enabled,
 * including token stats display and debug panel.
 */

import React, { useState } from 'react'
import { useClarityChat } from '../../hooks/use-clarity-chat'
import { usePromptInspector } from '../hooks/use-prompt-inspector'
import { ChatWindow } from '../../components/chat-window'
// Note: In production, use the appropriate message conversion utility
// import { convertCoreMessagesToMessages } from '../../hooks/use-clarity-chat'

/**
 * Chat component with prompt optimization
 */
export function OptimizedChatExample() {
  const [showDebug, setShowDebug] = useState(false)

  const { messages, append, isLoading, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'sliding-window',
      model: {
        id: 'gpt-4',
        maxTokens: 8192,
        inputPricePer1K: 0.03,
        outputPricePer1K: 0.06,
      },
    },
  })

  const { inspection } = usePromptInspector({
    messages,
    model: 'gpt-4',
    enabled: showDebug,
  })

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Optimized Chat</h1>
          <div className="flex items-center gap-4">
            {tokenStats && (
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`px-2 py-1 rounded ${
                    tokenStats.isExceeded
                      ? 'bg-red-100 text-red-800'
                      : tokenStats.usagePercent > 80
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {tokenStats.currentTokens} / {tokenStats.targetTokens} tokens
                </div>
                <div className="text-gray-600">
                  {tokenStats.remainingTokens} remaining
                </div>
                <div className="text-gray-500">
                  ({tokenStats.usagePercent.toFixed(1)}%)
                </div>
              </div>
            )}
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              {showDebug ? 'Hide' : 'Show'} Debug
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages.map(msg => ({
              id: msg.id || '',
              chatId: '',
              role: msg.role as 'user' | 'assistant' | 'system',
              content: typeof msg.content === 'string' ? msg.content : '',
              status: 'sent' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
            }))}
            onSend={(message) => {
              append({
                role: 'user',
                content: message,
              })
            }}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && inspection && (
        <div className="w-80 border-l bg-gray-50 overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Prompt Inspector</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Token Summary</h3>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold">{inspection.totalTokens}</div>
              <div className="text-sm text-gray-600">total tokens</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Breakdown by Role</h3>
            <div className="space-y-2">
              {Object.entries(inspection.roleBreakdown).map(([role, tokens]) => (
                <div
                  key={role}
                  className="flex justify-between items-center bg-white p-2 rounded border"
                >
                  <span className="font-medium capitalize">{role}</span>
                  <span className="text-gray-600">{tokens} tokens</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Message Breakdown</h3>
            <div className="space-y-3">
              {inspection.messageBreakdown.map((msg, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded border text-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">{msg.role}</span>
                    <span className="text-gray-600">{msg.tokens} tokens</span>
                  </div>
                  <div className="text-gray-700 text-xs mt-1 line-clamp-3">
                    {msg.contentPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tokenStats?.lastOptimizationReason && (
            <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Last Optimization
              </div>
              <div className="text-xs text-blue-700">
                {tokenStats.lastOptimizationReason}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Example with different optimization strategies
 */
export function StrategyComparisonExample() {
  const [strategy, setStrategy] = useState<
    'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  >('sliding-window')

  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 3000,
      strategy,
      model: {
        id: 'gpt-4',
        maxTokens: 8192,
      },
    },
  })

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Optimization Strategy
        </label>
        <select
          value={strategy}
          onChange={(e) =>
            setStrategy(
              e.target.value as
                | 'sliding-window'
                | 'summarize-old'
                | 'drop-low-priority'
                | 'hybrid'
            )
          }
          className="border rounded px-3 py-2"
        >
          <option value="sliding-window">Sliding Window</option>
          <option value="summarize-old">Summarize Old</option>
          <option value="drop-low-priority">Drop Low Priority</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {tokenStats && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <div className="text-sm">
            <strong>Tokens:</strong> {tokenStats.currentTokens} /{' '}
            {tokenStats.targetTokens} ({tokenStats.usagePercent.toFixed(1)}%)
          </div>
          {tokenStats.lastOptimizationReason && (
            <div className="text-xs text-gray-600 mt-1">
              {tokenStats.lastOptimizationReason}
            </div>
          )}
        </div>
      )}

      <ChatWindow
        messages={messages.map(msg => ({
          id: msg.id || '',
          chatId: '',
          role: msg.role as 'user' | 'assistant' | 'system',
          content: typeof msg.content === 'string' ? msg.content : '',
          status: 'sent' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))}
        onSend={(message) => {
          append({
            role: 'user',
            content: message,
          })
        }}
      />
    </div>
  )
}
