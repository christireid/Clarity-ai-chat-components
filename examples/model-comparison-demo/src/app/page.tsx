'use client'

import { useState } from 'react'
import { 
  ModelSelector, 
  StreamingMessage,
  allModels,
  type ModelMetadata 
} from '@clarity-chat/react'

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

  const getModelMetadata = (modelId: string): ModelMetadata | undefined => {
    return allModels.find(m => m.id === modelId)
  }

  const handleCompare = async () => {
    if (!prompt.trim()) return

    setLeftResponse('')
    setRightResponse('')
    setLeftCost(0)
    setRightCost(0)
    setLeftTime(0)
    setRightTime(0)
    setIsLeftStreaming(true)
    setIsRightStreaming(true)

    // Simulate streaming for both models
    // In a real app, you would call the actual adapters here
    const leftStart = Date.now()
    const rightStart = Date.now()

    // Simulate left model streaming
    const leftWords = `Response from ${getModelMetadata(leftModel)?.name}: This is a simulated response that demonstrates how different AI models handle the same prompt. Each model has different characteristics in terms of speed, cost, and quality. This response is being streamed token by token to show real-time updates.`.split(' ')
    
    for (const word of leftWords) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setLeftResponse(prev => prev + (prev ? ' ' : '') + word)
    }
    
    setIsLeftStreaming(false)
    setLeftTime(Date.now() - leftStart)
    setLeftCost(0.025) // Simulated cost

    // Simulate right model streaming (slightly different timing)
    const rightWords = `Response from ${getModelMetadata(rightModel)?.name}: This demonstration shows how Clarity Chat enables easy comparison between different AI providers. Notice how the streaming happens independently for each model, allowing you to evaluate their performance side by side. The model adapter system makes this comparison trivial to implement.`.split(' ')
    
    for (const word of rightWords) {
      await new Promise(resolve => setTimeout(resolve, 60))
      setRightResponse(prev => prev + (prev ? ' ' : '') + word)
    }
    
    setIsRightStreaming(false)
    setRightTime(Date.now() - rightStart)
    setRightCost(0.012) // Simulated cost
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

            {!leftResponse && !isLeftStreaming && (
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

            {!rightResponse && !isRightStreaming && (
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
