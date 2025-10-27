'use client'

import { useState } from 'react'
import { 
  ModelSelector, 
  StreamingMessage,
  allModels,
  type ModelMetadata,
  type ChatMessage 
} from '@clarity-chat/react'
import { useStreamingChat } from '@/hooks/useStreamingChat'

export default function Home() {
  const [leftModel, setLeftModel] = useState('gpt-4-turbo')
  const [rightModel, setRightModel] = useState('claude-3-opus')
  const [prompt, setPrompt] = useState('')
  const [leftResponse, setLeftResponse] = useState('')
  const [rightResponse, setRightResponse] = useState('')
  const [isLeftStreaming, setIsLeftStreaming] = useState(false)
  const [isRightStreaming, setIsRightStreaming] = useState(false)
  const [leftCost, setLeftCost] = useState(0)
  const [rightCost, setRightCost] = useState(0)
  const [leftTime, setLeftTime] = useState(0)
  const [rightTime, setRightTime] = useState(0)
  const [leftError, setLeftError] = useState<string | null>(null)
  const [rightError, setRightError] = useState<string | null>(null)

  const getModelMetadata = (modelId: string): ModelMetadata | undefined => {
    return allModels.find(m => m.id === modelId)
  }

  // Create streaming hooks for both models
  const leftStream = useStreamingChat({
    onToken: (token) => setLeftResponse(prev => prev + token),
    onComplete: (data) => {
      setLeftCost(data.cost)
      setLeftTime(data.duration)
      setIsLeftStreaming(false)
      setLeftError(null)
    },
    onError: (error) => {
      console.error('Left model error:', error)
      setLeftError(error)
      setIsLeftStreaming(false)
    }
  })

  const rightStream = useStreamingChat({
    onToken: (token) => setRightResponse(prev => prev + token),
    onComplete: (data) => {
      setRightCost(data.cost)
      setRightTime(data.duration)
      setIsRightStreaming(false)
      setRightError(null)
    },
    onError: (error) => {
      console.error('Right model error:', error)
      setRightError(error)
      setIsRightStreaming(false)
    }
  })

  const handleCompare = async () => {
    if (!prompt.trim()) return

    setLeftResponse('')
    setRightResponse('')
    setLeftCost(0)
    setRightCost(0)
    setLeftTime(0)
    setRightTime(0)
    setLeftError(null)
    setRightError(null)
    setIsLeftStreaming(true)
    setIsRightStreaming(true)

    // Create messages array
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: prompt
      }
    ]

    // Get model metadata
    const leftModelData = getModelMetadata(leftModel)
    const rightModelData = getModelMetadata(rightModel)

    if (!leftModelData || !rightModelData) {
      console.error('Model metadata not found')
      setIsLeftStreaming(false)
      setIsRightStreaming(false)
      return
    }

    // Stream from both models simultaneously
    try {
      await Promise.all([
        leftStream.stream(messages, {
          provider: leftModelData.provider as any,
          model: leftModel,
          temperature: 0.7,
          maxTokens: 1000
        }),
        rightStream.stream(messages, {
          provider: rightModelData.provider as any,
          model: rightModel,
          temperature: 0.7,
          maxTokens: 1000
        })
      ])
    } catch (error) {
      console.error('Comparison error:', error)
      setIsLeftStreaming(false)
      setIsRightStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCompare()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Model Comparison
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare responses from different AI models side-by-side
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yourusername/clarity-chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                GitHub
              </a>
              <a
                href="/docs"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Prompt Input */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What is the future of artificial intelligence?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={3}
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to compare, Shift+Enter for new line
            </p>
            <button
              onClick={handleCompare}
              disabled={!prompt.trim() || isLeftStreaming || isRightStreaming}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLeftStreaming || isRightStreaming ? 'Comparing...' : 'Compare Models'}
            </button>
          </div>
        </div>

        {/* Model Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Model */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Model A
              </h2>
              <ModelSelector
                models={allModels}
                value={leftModel}
                onChange={(modelId) => setLeftModel(modelId)}
                showMetrics
              />
            </div>

            {leftResponse && (
              <div className="space-y-4">
                <div className="border-t dark:border-gray-700 pt-4">
                  <StreamingMessage
                    content={leftResponse}
                    isStreaming={isLeftStreaming}
                  />
                </div>

                {!isLeftStreaming && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium">Time:</span>{' '}
                        <span className="text-gray-900 dark:text-white">{(leftTime / 1000).toFixed(2)}s</span>
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span>{' '}
                        <span className="text-gray-900 dark:text-white">${leftCost.toFixed(4)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {leftResponse.split(' ').length} tokens (approx)
                    </div>
                  </div>
                )}
              </div>
            )}

            {leftError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h4>
                    <p className="text-sm text-red-700 dark:text-red-400">{leftError}</p>
                  </div>
                </div>
              </div>
            )}

            {!leftResponse && !isLeftStreaming && !leftError && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                Enter a prompt and click "Compare Models" to see results
              </div>
            )}
          </div>

          {/* Right Model */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Model B
              </h2>
              <ModelSelector
                models={allModels}
                value={rightModel}
                onChange={(modelId) => setRightModel(modelId)}
                showMetrics
              />
            </div>

            {rightResponse && (
              <div className="space-y-4">
                <div className="border-t dark:border-gray-700 pt-4">
                  <StreamingMessage
                    content={rightResponse}
                    isStreaming={isRightStreaming}
                  />
                </div>

                {!isRightStreaming && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium">Time:</span>{' '}
                        <span className="text-gray-900 dark:text-white">{(rightTime / 1000).toFixed(2)}s</span>
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span>{' '}
                        <span className="text-gray-900 dark:text-white">${rightCost.toFixed(4)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {rightResponse.split(' ').length} tokens (approx)
                    </div>
                  </div>
                )}
              </div>
            )}

            {rightError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h4>
                    <p className="text-sm text-red-700 dark:text-red-400">{rightError}</p>
                  </div>
                </div>
              </div>
            )}

            {!rightResponse && !isRightStreaming && !rightError && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                Enter a prompt and click "Compare Models" to see results
              </div>
            )}
          </div>
        </div>

        {/* Comparison Summary */}
        {leftResponse && rightResponse && !isLeftStreaming && !isRightStreaming && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Faster Model</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {leftTime < rightTime ? getModelMetadata(leftModel)?.name : getModelMetadata(rightModel)?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.abs(leftTime - rightTime).toFixed(0)}ms difference
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lower Cost</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {leftCost < rightCost ? getModelMetadata(leftModel)?.name : getModelMetadata(rightModel)?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ${Math.abs(leftCost - rightCost).toFixed(4)} saved
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cost Difference</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.abs((leftCost - rightCost) / Math.max(leftCost, rightCost) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {leftCost < rightCost ? 'Model A cheaper' : 'Model B cheaper'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Showcase */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Powered by Clarity Chat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Model-Agnostic
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between OpenAI, Anthropic, and Google AI with just 3 lines of code
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Streaming
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Token-by-token streaming with AsyncGenerator for all providers
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Cost Tracking
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accurate cost estimation for 9 AI models across 3 providers
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>
              Built with <span className="text-red-500">♥</span> using Clarity Chat
            </p>
            <div className="flex items-center gap-4">
              <a href="/docs" className="hover:text-gray-900 dark:hover:text-white">
                Documentation
              </a>
              <a href="/storybook" className="hover:text-gray-900 dark:hover:text-white">
                Storybook
              </a>
              <a href="https://github.com/yourusername/clarity-chat" className="hover:text-gray-900 dark:hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
