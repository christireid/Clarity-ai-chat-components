import React, { useState, useEffect, useCallback } from 'react'
import { TokenCounter } from '@clarity-chat/token-optimization'
import { smartCountTokens } from './smart-fallback'
import { tokenAnalyticsMonitor } from './token-analytics'

export interface TokenDemoProps {
  defaultText?: string
  showModelSelector?: boolean
  showRealTimeCounting?: boolean
  showComparison?: boolean
  showAnalytics?: boolean
}

export interface TokenComparison {
  model: string
  tokens: number
  estimatedCost: number
  contextWindow: number
}

export const MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    inputCost: 0.03,
    outputCost: 0.06,
    contextWindow: 8192,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    inputCost: 0.01,
    outputCost: 0.03,
    contextWindow: 128000,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    inputCost: 0.005,
    outputCost: 0.015,
    contextWindow: 128000,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    inputCost: 0.0005,
    outputCost: 0.0015,
    contextWindow: 16384,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    inputCost: 0.015,
    outputCost: 0.075,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    inputCost: 0.003,
    outputCost: 0.015,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    inputCost: 0.00025,
    outputCost: 0.00125,
    contextWindow: 200000,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    inputCost: 0.0005,
    outputCost: 0.001,
    contextWindow: 128000,
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    inputCost: 0.0002,
    outputCost: 0.0004,
    contextWindow: 128000,
  },
]

export const TokenCountingDemo: React.FC<TokenDemoProps> = ({
  defaultText = 'Hello World! This is a token counting demo. Try typing your own text to see how many tokens it uses across different AI models.',
  showModelSelector = true,
  showRealTimeCounting = true,
  showComparison = true,
  showAnalytics = true,
}) => {
  const [text, setText] = useState(defaultText)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [tokenCount, setTokenCount] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [comparisons, setComparisons] = useState<TokenComparison[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Real-time counting effect
  useEffect(() => {
    if (!showRealTimeCounting) return

    const timer = setTimeout(() => {
      setIsCounting(true)

      try {
        const count = TokenCounter.count(text)
        setTokenCount(count)

        // Record for analytics
        tokenAnalyticsMonitor.recordUsage({
          tokens: count,
          model: selectedModel,
          type: 'input',
        })
      } catch (error) {
        console.warn('Token counting error:', error)
        setTokenCount(0)
      } finally {
        setIsCounting(false)
      }
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timer)
  }, [text, selectedModel, showRealTimeCounting])

  // Update comparisons when text changes
  useEffect(() => {
    if (!showComparison) return

    const newComparisons = MODELS.map((model) => {
      const tokens = smartCountTokens(text, { model: model.id })
      const estimatedCost = (tokens / 1000) * model.inputCost

      return {
        model: model.name,
        tokens,
        estimatedCost,
        contextWindow: model.contextWindow,
      }
    }).sort((a, b) => a.tokens - b.tokens)

    setComparisons(newComparisons)
  }, [text, showComparison])

  // Update analytics
  useEffect(() => {
    if (!showAnalytics) return

    const updateAnalytics = () => {
      const analyticsData = tokenAnalyticsMonitor.getAnalytics()
      setAnalytics(analyticsData)
    }

    updateAnalytics()
    const interval = setInterval(updateAnalytics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [showAnalytics])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value)
    },
    []
  )

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(e.target.value)
    },
    []
  )

  const handleClear = useCallback(() => {
    setText('')
  }, [])

  const handleSampleText = useCallback((sampleText: string) => {
    setText(sampleText)
  }, [])

  const getTokenEfficiency = (tokens: number, chars: number): string => {
    return chars > 0 ? ((tokens / chars) * 100).toFixed(1) : '0'
  }

  const getCostColor = (cost: number): string => {
    if (cost < 0.001) return 'text-green-600'
    if (cost < 0.01) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Token Counting Demo
        </h2>
        <p className="text-gray-600">
          Real-time token counting across different AI models with cost
          estimation
        </p>
      </div>

      {/* Text Input Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter your text:
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          rows={4}
          placeholder="Type your text here to see token counting in action..."
        />

        {/* Sample Texts */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Quick samples:</span>
          {[
            'Hello World',
            'The quick brown fox jumps over the lazy dog.',
            'function hello() { console.log("Hello World"); }',
            'Can you help me write a React component?',
            'What is the weather like today?',
          ].map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleText(sample)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {sample.length > 30 ? `${sample.substring(0, 30)}...` : sample}
            </button>
          ))}
        </div>
      </div>

      {/* Model Selector */}
      {showModelSelector && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Model:
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Current Token Count */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Current Count
            </h3>
            <p className="text-blue-700">
              {isCounting ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Counting...
                </span>
              ) : (
                <span className="text-2xl font-bold">{tokenCount} tokens</span>
              )}
            </p>
            <p className="text-sm text-blue-600">
              {text.length} characters •{' '}
              {getTokenEfficiency(tokenCount, text.length)}% efficiency
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">Estimated Cost</p>
            <p className="text-xl font-bold text-blue-900">
              $
              {(
                (tokenCount / 1000) *
                (MODELS.find((m) => m.id === selectedModel)?.inputCost || 0)
              ).toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Model Comparisons */}
      {showComparison && comparisons.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Model Comparisons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons
              .slice(0, showAdvanced ? comparisons.length : 3)
              .map((comparison, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {comparison.model}
                    </h4>
                    <span
                      className={`text-sm font-semibold ${getCostColor(comparison.estimatedCost)}`}
                    >
                      ${comparison.estimatedCost.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{comparison.tokens} tokens</p>
                    <p>Context: {comparison.contextWindow.toLocaleString()}</p>
                    <p>
                      Efficiency:{' '}
                      {getTokenEfficiency(comparison.tokens, text.length)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {!showAdvanced && comparisons.length > 3 && (
            <button
              onClick={() => setShowAdvanced(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show all {comparisons.length} models →
            </button>
          )}
        </div>
      )}

      {/* Analytics */}
      {showAnalytics && analytics && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Usage Analytics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.totalRequests}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.totalTokens.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(analytics.averageTokens)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Peak</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.maxTokens}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Features */}
      {showAdvanced && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Advanced Features
          </h3>

          {/* Token Budget Simulator */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Token Budget Simulator
            </h4>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="10000"
                value={tokenCount}
                onChange={(e) => {
                  const budget = parseInt(e.target.value)
                  const percentage = Math.min(100, (tokenCount / budget) * 100)
                  // You could add budget validation logic here
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">
                Budget: {tokenCount} tokens
              </span>
            </div>
          </div>

          {/* Text Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Characters</p>
              <p className="font-semibold">{text.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Words</p>
              <p className="font-semibold">
                {text.split(/\s+/).filter((w) => w.length > 0).length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sentences</p>
              <p className="font-semibold">
                {text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Paragraphs</p>
              <p className="font-semibold">
                {text.split('\n').filter((p) => p.trim().length > 0).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="text-sm text-gray-500 border-t pt-4">
        <p className="mb-2">
          <strong>How it works:</strong> Token counting uses the Tiktoken
          library to accurately count tokens that would be used by different AI
          models. The cost estimates are based on current pricing and may vary
          by region and usage volume.
        </p>
        <p>
          <strong>Tips:</strong> Use shorter, more concise text to reduce token
          usage. Consider using cheaper models like GPT-3.5 Turbo for simpler
          tasks, and reserve expensive models like GPT-4 for complex reasoning
          tasks.
        </p>
      </div>
    </div>
  )
}

export default TokenCountingDemo
