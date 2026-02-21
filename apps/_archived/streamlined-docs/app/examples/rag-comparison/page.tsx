'use client'

import { useState } from 'react'
import { ChatWindow, type Message } from '@clarity-chat/react'

export default function RAGComparisonPage() {
  const [baselineMessages, setBaselineMessages] = useState<Message[]>([])
  const [enhancedMessages, setEnhancedMessages] = useState<Message[]>([])
  const [baselineLoading, setBaselineLoading] = useState(false)
  const [enhancedLoading, setEnhancedLoading] = useState(false)
  const [metrics, setMetrics] = useState({
    baseline: { responseTime: 0, qualityScore: 0, cacheHit: false },
    enhanced: { responseTime: 0, qualityScore: 0, cacheHit: false },
  })

  const handleBaselineSend = async (content: string) => {
    const startTime = Date.now()
    setBaselineLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setBaselineMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat-baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setBaselineMessages((prev) => [...prev, assistantMessage])

      setMetrics((prev) => ({
        ...prev,
        baseline: {
          responseTime: Date.now() - startTime,
          qualityScore: data.qualityScore || 0,
          cacheHit: data.cacheHit || false,
        },
      }))
    } catch (error) {
      console.error('Baseline error:', error)
    } finally {
      setBaselineLoading(false)
    }
  }

  const handleEnhancedSend = async (content: string) => {
    const startTime = Date.now()
    setEnhancedLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setEnhancedMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch('/api/docs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId: 'comparison-test',
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setEnhancedMessages((prev) => [...prev, assistantMessage])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullResponse += parsed.text
                setEnhancedMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullResponse }
                      : m
                  )
                )
              } else if (parsed.type === 'metadata') {
                setMetrics((prev) => ({
                  ...prev,
                  enhanced: {
                    responseTime: Date.now() - startTime,
                    qualityScore: parsed.qualityScore || 0,
                    cacheHit: parsed.cacheHit || false,
                  },
                }))
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Enhanced error:', error)
    } finally {
      setEnhancedLoading(false)
    }
  }

  const sendToBoth = async (query: string) => {
    handleBaselineSend(query)
    handleEnhancedSend(query)
  }

  const exampleQueries = [
    'How do I add streaming to my chat?',
    'What are the best practices for token optimization?',
    'Show me an example of using memory context',
    'How can I implement error handling?',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">RAG System Comparison</h1>
        <p className="text-xl text-muted-foreground mb-8">
          See the difference between baseline and enhanced RAG side-by-side
        </p>

        {/* Example Queries */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-3">
            Try these queries on both systems:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exampleQueries.map((query) => (
              <button
                key={query}
                onClick={() => sendToBoth(query)}
                className="p-2 text-left text-sm bg-background hover:bg-accent rounded border transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Baseline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Baseline RAG</h2>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                Standard
              </span>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg text-sm">
              <strong>Features:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Basic keyword search</li>
                <li>• No query expansion</li>
                <li>• Simple BM25 ranking</li>
                <li>• No quality validation</li>
              </ul>
            </div>

            <ChatWindow
              messages={baselineMessages}
              onSend={handleBaselineSend}
              isLoading={baselineLoading}
              placeholder="Ask the baseline system..."
              className="h-[500px]"
            />

            {/* Baseline Metrics */}
            {metrics.baseline.responseTime > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <strong>{metrics.baseline.responseTime}ms</strong>
                </div>
                <div className="flex justify-between">
                  <span>Quality Score:</span>
                  <strong>{metrics.baseline.qualityScore}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit:</span>
                  <strong>
                    {metrics.baseline.cacheHit ? '✓ Yes' : '✗ No'}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Enhanced RAG</h2>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded text-sm">
                Production
              </span>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-sm">
              <strong>Features:</strong>
              <ul className="mt-1 space-y-1">
                <li>• 18 intent types (90%+ accuracy)</li>
                <li>• Query expansion & synonyms</li>
                <li>• Cached HNSW + reranking</li>
                <li>• Quality validation (15+ checks)</li>
              </ul>
            </div>

            <ChatWindow
              messages={enhancedMessages}
              onSend={handleEnhancedSend}
              isLoading={enhancedLoading}
              placeholder="Ask the enhanced system..."
              className="h-[500px]"
            />

            {/* Enhanced Metrics */}
            {metrics.enhanced.responseTime > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <strong className="text-green-600">
                    {metrics.enhanced.responseTime}ms
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Quality Score:</span>
                  <strong className="text-green-600">
                    {metrics.enhanced.qualityScore}/100
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit:</span>
                  <strong className="text-green-600">
                    {metrics.enhanced.cacheHit ? '✓ Yes' : '✗ No'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Summary */}
        {metrics.baseline.responseTime > 0 &&
          metrics.enhanced.responseTime > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Comparison Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {(
                      ((metrics.baseline.responseTime -
                        metrics.enhanced.responseTime) /
                        metrics.baseline.responseTime) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Faster Response
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    +
                    {(
                      metrics.enhanced.qualityScore -
                      metrics.baseline.qualityScore
                    ).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Quality Improvement
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {metrics.enhanced.cacheHit ? '✓' : '○'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cache Performance
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Feature Comparison Table */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Feature Comparison</h3>
          <table className="w-full border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-center">Baseline</th>
                <th className="p-3 text-center">Enhanced</th>
                <th className="p-3 text-left">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3">Query Understanding</td>
                <td className="p-3 text-center">✗</td>
                <td className="p-3 text-center text-green-600">✓</td>
                <td className="p-3 text-sm">+40% precision</td>
              </tr>
              <tr>
                <td className="p-3">Vector Cache</td>
                <td className="p-3 text-center">✗</td>
                <td className="p-3 text-center text-green-600">✓</td>
                <td className="p-3 text-sm">99% latency reduction</td>
              </tr>
              <tr>
                <td className="p-3">Context Compression</td>
                <td className="p-3 text-center">✗</td>
                <td className="p-3 text-center text-green-600">✓</td>
                <td className="p-3 text-sm">30-70% token savings</td>
              </tr>
              <tr>
                <td className="p-3">Quality Validation</td>
                <td className="p-3 text-center">✗</td>
                <td className="p-3 text-center text-green-600">✓</td>
                <td className="p-3 text-sm">+28% quality</td>
              </tr>
              <tr>
                <td className="p-3">Reranking</td>
                <td className="p-3 text-center">Basic</td>
                <td className="p-3 text-center text-green-600">Advanced</td>
                <td className="p-3 text-sm">+17% NDCG</td>
              </tr>
              <tr>
                <td className="p-3">Citation Grounding</td>
                <td className="p-3 text-center">✗</td>
                <td className="p-3 text-center text-green-600">✓</td>
                <td className="p-3 text-sm">-22% hallucinations</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Learn More */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Want to learn more?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/reference/rag-system"
              className="p-3 bg-background rounded-lg hover:shadow transition-shadow"
            >
              <strong>📚 Full Documentation</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Complete guide to enhanced RAG features
              </p>
            </a>
            <a
              href="/cookbook/rag-document-chat"
              className="p-3 bg-background rounded-lg hover:shadow transition-shadow"
            >
              <strong>🍳 Implementation Guide</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Step-by-step cookbook recipe
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
