import React, { useState } from 'react'
import {
  usePromptCompression,
  useSmartCache,
  useModelRouter,
  useResponseLimiter,
  useRequestBatcher,
  useSmartThrottle,
  TokenOptimizationDashboard,
  ThemeProvider,
  themes,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

/**
 * Comprehensive Token Optimization Demo
 *
 * Demonstrates all token optimization features working together.
 */
export function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize all optimization features
  const compression = usePromptCompression({
    removeFillers: true,
    useAbbreviations: false, // Keep readable for demo
    trimWhitespace: true,
  })

  const cache = useSmartCache<string>({
    enableSemanticMatching: false, // Set to true with real embeddings
    maxSize: 50,
    defaultTTL: 3600000, // 1 hour
  })

  const router = useModelRouter({
    onRoute: (decision) => {
      console.log(`Routed to ${decision.model.name}`)
      console.log(`Estimated savings: ${decision.savingsPercent.toFixed(1)}%`)
    },
  })

  const limiter = useResponseLimiter({
    preset: 'brief',
    onTruncate: (original, truncated) => {
      console.log(`Truncated ${original.length - truncated.length} characters`)
    },
  })

  const batcher = useRequestBatcher({
    maxBatchSize: 5,
    maxWaitTime: 1000,
    processor: async (queries) => {
      // Simulate batch API call
      console.log(`Processing batch of ${queries.length} queries`)
      return queries.map((q) => `Response to: ${q}`)
    },
  })

  const throttle = useSmartThrottle<string>({
    delay: 500,
    adaptive: true,
    minLength: 3,
    trackSavings: true,
  })

  // Calculate combined metrics
  const totalTokensSaved =
    compression.totalTokensSaved +
    cache.stats.tokensSaved +
    limiter.stats.tokensSaved

  const totalCostSaved =
    cache.stats.costSaved + router.stats.totalEstimatedCost * 0.3 // Rough estimate

  const metrics = {
    totalTokens: compression.compressionCount * 100 + totalTokensSaved, // Rough estimate
    tokensSaved: totalTokensSaved,
    costSaved: totalCostSaved,
    breakdown: {
      promptCompression: {
        tokens: compression.totalTokensSaved,
        percent: compression.averageSavingsPercent,
      },
      caching: {
        hits: cache.stats.hits,
        savings: cache.stats.tokensSaved,
      },
      modelRouting: {
        savings: router.stats.totalEstimatedCost * 0.4,
        percent: router.stats.averageSavings,
      },
      responseLimiting: {
        tokens: limiter.stats.tokensSaved,
        percent: limiter.stats.savingsPercent,
      },
      batching: {
        requests: batcher.stats.totalBatches,
        savings: batcher.stats.totalBatches * 100, // Rough estimate
      },
      throttling: {
        callsSaved: throttle.callsSaved,
      },
      referencing: {
        bytesSaved: 0, // Not used in this demo
        percent: 0,
      },
    },
    savingsPercent:
      totalTokensSaved > 0
        ? (totalTokensSaved /
            (compression.compressionCount * 100 + totalTokensSaved)) *
          100
        : 0,
  }

  const handleSend = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      // Step 1: Compress prompt
      const compressionResult = compression.compress(input)
      console.log(`Compressed: ${compressionResult.tokenSavings} tokens saved`)

      // Step 2: Check cache
      const cached = await cache.get(compressionResult.compressed)
      if (cached) {
        console.log('Cache hit!')
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: cached },
        ])
        setInput('')
        return
      }

      // Step 3: Route to best model
      const routing = router.route(compressionResult.compressed)
      console.log(`Using model: ${routing.model.name}`)

      // Step 4: Create limited prompt
      const limitedPrompt = limiter.createPrompt(compressionResult.compressed)
      console.log(`Constraints: ${limitedPrompt.constraints.join(', ')}`)

      // Step 5: Simulate API call (in real app, call your API here)
      const mockResponse =
        `This is a simulated response using ${routing.model.name}. ` +
        `Your query was: "${compressionResult.compressed}". ` +
        `Token optimization is active with ${metrics.savingsPercent.toFixed(1)}% savings!`

      // Step 6: Enforce response limits
      const limitedResponse = limiter.enforce(mockResponse)
      console.log(
        `Response limited: ${limitedResponse.tokensSaved} tokens saved`
      )

      // Step 7: Cache result
      await cache.set(compressionResult.compressed, limitedResponse.response)

      // Update messages
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: limitedResponse.response },
      ])
      setInput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([])
    compression.resetStats()
    cache.clear()
    router.clearHistory()
    limiter.resetStats()
    batcher.clear()
    throttle.resetStats()
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground">
              Token Optimization Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience all optimization features working together
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 mt-4">
              <span className="font-medium text-green-600">
                {totalTokensSaved.toLocaleString()} saved
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {metrics.savingsPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Dashboard */}
          <TokenOptimizationDashboard
            metrics={metrics}
            showBreakdown={true}
            realTime={false}
          />

          {/* Chat Interface */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Try It Out</h2>

            {/* Messages */}
            <div className="space-y-4 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Send a message to see optimizations in action!</p>
                  <p className="text-sm mt-2">
                    Try: "What is React?" or "Explain machine learning"
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary/10 ml-12'
                        : 'bg-muted mr-12'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 text-muted-foreground">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && !isLoading && handleSend()
                }
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Individual Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Compression Stats */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-medium mb-2">Compression</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compressions:</span>
                  <span className="font-medium">
                    {compression.compressionCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Savings:</span>
                  <span className="font-medium text-success">
                    {compression.averageSavingsPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cache Stats */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-medium mb-2">Cache</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hit Rate:</span>
                  <span className="font-medium text-success">
                    {cache.stats.hitRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entries:</span>
                  <span className="font-medium">{cache.stats.size}</span>
                </div>
              </div>
            </div>

            {/* Router Stats */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-medium mb-2">Routing</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Queries:</span>
                  <span className="font-medium">
                    {router.stats.totalQueries}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Savings:</span>
                  <span className="font-medium text-success">
                    {router.stats.averageSavings.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              This demo simulates API calls. In production, integrate with your
              actual API.
            </p>
            <p className="mt-1">
              Check the browser console for detailed optimization logs.
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
