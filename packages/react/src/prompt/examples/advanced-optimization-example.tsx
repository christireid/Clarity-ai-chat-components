/**
 * Advanced Prompt Optimization Example
 * 
 * Demonstrates the full optimization engine with visualization
 */

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
} from '../../index'
import {
  usePromptOptimizer,
  useDynamicModelRouting,
  usePromptDebugger,
} from '../hooks'
import { getModelProfile, type ModelProfile } from '../core/model-profiles'

export function AdvancedOptimizationExample() {
  const [showDebugger, setShowDebugger] = React.useState(false)
  const [targetTokens, setTargetTokens] = React.useState(4000)
  const [selectedModel, setSelectedModel] = React.useState<ModelProfile>(
    getModelProfile('gpt-4')!
  )

  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Advanced optimization
  const optimizer = usePromptOptimizer({
    messages: chat.messages,
    model: selectedModel,
    targetTokens,
    autoOptimize: true,
    options: {
      enableSemanticPrioritization: true,
      enableCompression: true,
    },
  })

  // Dynamic model routing
  const routing = useDynamicModelRouting({
    messages: chat.messages,
    currentModel: selectedModel,
    criteria: {
      tokenBudget: targetTokens,
      costBudget: 0.1, // $0.10 budget
      complexity: 0.5,
    },
    autoRoute: true,
  })

  // Debugger
  const debugger = usePromptDebugger({
    messages: chat.messages,
    model: selectedModel,
    targetTokens,
    enabled: showDebugger,
  })

  // Trigger debug when enabled
  React.useEffect(() => {
    if (showDebugger && chat.messages.length > 0) {
      debugger.debug()
    }
  }, [showDebugger, chat.messages.length])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Advanced Optimization Demo</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDebugger(!showDebugger)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  showDebugger
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {showDebugger ? 'Hide' : 'Show'} Debugger
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Token Budget */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Target Tokens:</label>
              <input
                type="number"
                value={targetTokens}
                onChange={(e) => setTargetTokens(Number(e.target.value))}
                className="px-3 py-1 border rounded w-24"
                min={1000}
                max={100000}
              />
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Model:</label>
              <select
                value={selectedModel.model}
                onChange={(e) => {
                  const profile = getModelProfile(e.target.value)
                  if (profile) setSelectedModel(profile)
                }}
                className="px-3 py-1 border rounded"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4-mini">GPT-4 Mini</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </select>
            </div>

            {/* Token Stats */}
            {optimizer.tokenStats && (
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tokens:</span>{' '}
                  <span
                    className={`font-mono font-bold ${
                      optimizer.tokenStats.optimized > targetTokens
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {optimizer.tokenStats.optimized}
                  </span>
                  {optimizer.tokenStats.original !==
                    optimizer.tokenStats.optimized && (
                    <>
                      {' '}
                      <span className="text-gray-500">
                        / {optimizer.tokenStats.original}
                      </span>
                      {' '}
                      <span className="text-green-600">
                        (saved {optimizer.tokenStats.saved})
                      </span>
                    </>
                  )}
                </div>
                {optimizer.costEstimate && (
                  <div>
                    <span className="text-gray-600">Est. Cost:</span>{' '}
                    <span className="font-mono">
                      ${optimizer.costEstimate.total.toFixed(4)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Compression:</span>{' '}
                  <span className="font-mono">
                    {(optimizer.tokenStats.compressionRatio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Model Routing Suggestion */}
            {routing.recommendedModel &&
              routing.recommendedModel.model !== selectedModel.model && (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                  💡 Consider switching to{' '}
                  <strong>{routing.recommendedModel.model}</strong>
                </div>
              )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-auto p-4">
          <ChatWindow
            messages={convertCoreMessagesToMessages(optimizer.optimizedMessages)}
            onSendMessage={(message) => {
              chat.append({
                role: 'user',
                content: message,
              })
            }}
            isLoading={chat.isLoading || optimizer.isOptimizing}
          />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
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
              disabled={chat.isLoading || optimizer.isOptimizing}
            />
            <button
              type="submit"
              disabled={chat.isLoading || optimizer.isOptimizing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Debugger Panel */}
      {showDebugger && debugger.debugInfo && (
        <div className="w-96 border-l bg-white p-4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">Optimization Debugger</h2>

          {/* Optimization History */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Optimization History</h3>
            <div className="space-y-2">
              {debugger.debugInfo.history.map((entry, i) => (
                <div
                  key={i}
                  className="p-2 bg-gray-50 rounded text-xs border"
                >
                  <div className="font-medium">{entry.stage}</div>
                  <div className="text-gray-600 mt-1">{entry.action}</div>
                  <div className="flex justify-between mt-1">
                    <span>
                      {entry.tokensBefore} → {entry.tokensAfter} tokens
                    </span>
                    <span className="text-gray-500">
                      {entry.details.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Counts */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Token Counts by Stage</h3>
            <div className="space-y-1">
              {debugger.debugInfo.tokenCounts.map((count, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm p-1 bg-gray-50 rounded"
                >
                  <span>{count.stage}:</span>
                  <span className="font-mono">{count.tokens}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compression Logs */}
          {debugger.debugInfo.compressionLogs.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Compression Logs</h3>
              <div className="space-y-2">
                {debugger.debugInfo.compressionLogs.map((log, i) => (
                  <div
                    key={i}
                    className="p-2 bg-blue-50 rounded text-xs"
                  >
                    <div className="font-medium">{log.strategy}</div>
                    <div className="text-gray-600 mt-1">
                      {log.inputMessages} → {log.outputMessages} messages
                    </div>
                    <div className="text-green-600 mt-1">
                      Saved {log.tokensSaved} tokens
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routing Decisions */}
          {debugger.debugInfo.routingDecisions &&
            debugger.debugInfo.routingDecisions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Routing Decisions</h3>
                <div className="space-y-2">
                  {debugger.debugInfo.routingDecisions.map((decision, i) => (
                    <div
                      key={i}
                      className="p-2 bg-purple-50 rounded text-xs"
                    >
                      <div className="font-medium">
                        → {decision.toModel}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {decision.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  )
}
