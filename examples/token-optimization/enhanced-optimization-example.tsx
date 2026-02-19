/**
 * Enhanced Token Optimization Example
 *
 * Demonstrates all token optimization features:
 * - TOON format (30-60% savings)
 * - Accurate tokenization
 * - Prompt caching (50-90% savings)
 * - Prompt compression (20-35% savings)
 * - Real-time cost tracking
 */

import React from 'react'
// 📚 IMPORT PATTERN:
// All @clarity-chat/react exports come from the main package entry point.
// The hook useTokenOptimization is exported directly from @clarity-chat/react
import { useTokenOptimization } from '@clarity-chat/react'

// 💡 Type definitions for the optimization results
// These interfaces document the shape of different optimization result types

interface TokenInfo {
  total: number
  input?: number
  output?: number
}

interface BaseResult {
  type: string
}

interface DataOptimizationResult extends BaseResult {
  type: 'Data Optimization'
  original: string
  optimized: string
  format: string
  tokens: TokenInfo
  savings: number
}

interface PromptCompressionResult extends BaseResult {
  type: 'Prompt Compression'
  original: string
  optimized: string
  tokens: TokenInfo
  savings: number
}

interface MessagePreparationResult extends BaseResult {
  type: 'Message Preparation'
  original: string
  optimized: string
  hasCacheControl: boolean
}

interface FullOptimizationResult extends BaseResult {
  type: 'Full Optimization'
  messages: Array<{ role: string; content: string; cache_control?: unknown }>
  totalTokens: number
  cost: number
  breakdown: {
    systemPrompt: number
    data: number
    format: string
  }
}

type OptimizationResult =
  | DataOptimizationResult
  | PromptCompressionResult
  | MessagePreparationResult
  | FullOptimizationResult

// 💡 Type for chat messages used in the hook
// ⚠️ NOTE: These types are simplified versions of the internal CoreMessage type.
// The prepareMessages function accepts CoreMessage[], but our ChatMessage interface
// is structurally compatible. In production code, you can either:
// 1. Import CoreMessage from @clarity-chat/react if exported
// 2. Use these simplified types with type assertions (as shown below)
// The type assertion is safe because the shapes are compatible.
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface PreparedMessage extends ChatMessage {
  cache_control?: { type: string }
}

export function EnhancedOptimizationExample() {
  const {
    optimizeData,
    optimizePrompt,
    prepareMessages,
    parseResponse,
    countTokens,
    calculateCost,
    stats,
    resetStats,
  } = useTokenOptimization({
    model: 'claude-3-5-sonnet',
    enableToon: true,
    enablePromptCaching: true,
    enablePromptCompression: true,
    enableAccurateTokenization: true,
    enableCostTracking: true,
  })

  const [results, setResults] = React.useState<OptimizationResult[]>([])

  // Example 1: Optimize structured data with TOON
  const handleOptimizeData = async () => {
    const data = [
      { name: 'Alice Johnson', age: 30, city: 'New York', role: 'Engineer' },
      { name: 'Bob Smith', age: 25, city: 'San Francisco', role: 'Designer' },
      { name: 'Carol Williams', age: 35, city: 'Seattle', role: 'Manager' },
      { name: 'David Brown', age: 28, city: 'Austin', role: 'Developer' },
    ]

    const result = await optimizeData(data)

    setResults(prev => [
      ...prev,
      {
        type: 'Data Optimization',
        original: JSON.stringify(data, null, 2),
        optimized: result.content,
        format: result.format,
        tokens: result.tokens,
        savings: result.optimizations.toon?.savingsPercent || 0,
      },
    ])
  }

  // Example 2: Optimize prompt with compression
  const handleOptimizePrompt = async () => {
    const prompt = `
      I really, really want to understand, you know, how I can actually improve
      my code quality and make it more maintainable. Can you basically help me
      with that? I'm just looking for some advice, literally anything would help.
    `

    const result = await optimizePrompt(prompt)

    setResults(prev => [
      ...prev,
      {
        type: 'Prompt Compression',
        original: prompt,
        optimized: result.content,
        tokens: result.tokens,
        savings: result.optimizations.compression?.savingsPercent || 0,
      },
    ])
  }

  // Example 3: Prepare messages with caching
  const handlePrepareMessages = () => {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant specialized in software engineering.
        You have deep knowledge of React, TypeScript, Node.js, and modern web development.
        Always provide practical, robust solutions with clear explanations.
        Consider performance, security, and best practices in all recommendations.`,
      },
      {
        role: 'user',
        content: 'How can I optimize my React components for better performance?',
      },
    ]

    // 🎯 Type assertion needed because prepareMessages expects the internal message format
    const prepared = prepareMessages(messages as ChatMessage[]) as PreparedMessage[]

    setResults(prev => [
      ...prev,
      {
        type: 'Message Preparation',
        original: JSON.stringify(messages, null, 2),
        optimized: JSON.stringify(prepared, null, 2),
        hasCacheControl: prepared.some((m) => m.cache_control !== undefined),
      },
    ])
  }

  // Example 4: Full conversation with all optimizations
  const handleFullOptimization = async () => {
    // 1. Optimize system prompt
    const systemPrompt = await optimizePrompt(
      'You are a helpful AI assistant. Please provide detailed, accurate responses.'
    )

    // 2. Optimize context data
    const contextData = {
      users: [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ],
      settings: { theme: 'dark', language: 'en' },
    }
    const optimizedData = await optimizeData(contextData)

    // 3. Prepare messages with caching
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt.content },
      { role: 'user', content: `Here's the context: ${optimizedData.content}` },
      { role: 'user', content: 'Analyze this data and provide insights.' },
    ]
    const messages = prepareMessages(chatMessages) as PreparedMessage[]

    // 4. Calculate total savings
    const totalTokens =
      systemPrompt.tokens.total + optimizedData.tokens.total + 50 // estimated query tokens
    const cost = calculateCost({ inputTokens: totalTokens, outputTokens: 200 })

    setResults(prev => [
      ...prev,
      {
        type: 'Full Optimization',
        messages,
        totalTokens,
        cost: cost.totalCost,
        breakdown: {
          systemPrompt: systemPrompt.tokens.total,
          data: optimizedData.tokens.total,
          format: optimizedData.format,
        },
      },
    ])
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enhanced Token Optimization Demo</h1>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={handleOptimizeData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Optimize Data (TOON)
        </button>
        <button
          onClick={handleOptimizePrompt}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Compress Prompt
        </button>
        <button
          onClick={handlePrepareMessages}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Prepare w/ Caching
        </button>
        <button
          onClick={handleFullOptimization}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Full Optimization
        </button>
        <button
          onClick={resetStats}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset Stats
        </button>
      </div>

      {/* Statistics Dashboard */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">TOON Savings</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.toon.averageSavingsPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.toon.totalTokensSaved.toLocaleString()} tokens saved
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Compression</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.compression.averageSavingsPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.compression.totalTokensSaved.toLocaleString()} tokens saved
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Total Cost</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${stats.costs.totalCost.toFixed(4)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ${stats.overall.totalCostSaved.toFixed(4)} saved
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Overall</h3>
          <p className="text-2xl font-bold text-orange-600">
            {stats.overall.totalTokensSaved.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">total tokens saved</p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Results</h2>
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold mb-4">{result.type}</h3>

            {result.type === 'Data Optimization' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-600">
                    Original JSON ({result.tokens.total} tokens)
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                    {result.original}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-blue-600">
                    Optimized {result.format.toUpperCase()} ({result.savings.toFixed(1)}% savings)
                  </h4>
                  <pre className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs overflow-x-auto">
                    {result.optimized}
                  </pre>
                </div>
              </div>
            )}

            {result.type === 'Prompt Compression' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-600">
                    Original ({result.tokens.total} tokens)
                  </h4>
                  <p className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                    {result.original}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600">
                    Compressed ({result.savings.toFixed(1)}% savings)
                  </h4>
                  <p className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm">
                    {result.optimized}
                  </p>
                </div>
              </div>
            )}

            {result.type === 'Message Preparation' && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {result.hasCacheControl && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      ✓ Cache Control Applied
                    </span>
                  )}
                </div>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                  {result.optimized}
                </pre>
              </div>
            )}

            {result.type === 'Full Optimization' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">System Prompt</p>
                    <p className="text-xl font-bold">{result.breakdown.systemPrompt}</p>
                    <p className="text-xs text-gray-500">tokens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Data ({result.breakdown.format})</p>
                    <p className="text-xl font-bold">{result.breakdown.data}</p>
                    <p className="text-xs text-gray-500">tokens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-xl font-bold">${result.cost.toFixed(4)}</p>
                    <p className="text-xs text-gray-500">estimated</p>
                  </div>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(result.messages, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Click any button above to see optimization in action
          </div>
        )}
      </div>
    </div>
  )
}
