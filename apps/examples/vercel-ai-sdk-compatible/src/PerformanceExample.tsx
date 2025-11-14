/**
 * Performance Example: Demonstrates optimized hooks and performance monitoring
 */

import * as React from 'react'
import { useChatOptimized } from '@clarity-chat/react'
import { PerformanceMonitor, measurePerformance } from '@clarity-chat/react'

function PerformanceExample() {
  const [perfMonitor] = React.useState(() => new PerformanceMonitor())
  const [metrics, setMetrics] = React.useState<Record<string, any>>({})

  const { messages, append, isLoading, debouncedInput } = useChatOptimized({
    api: '/api/chat',
    debounceMs: 300,
    memoizeMessages: true,
    batchUpdates: true,
  })

  const handleSend = async () => {
    const stopTimer = perfMonitor.start('message-send')
    
    await measurePerformance('append-message', async () => {
      await append({
        role: 'user',
        content: `Test message ${Date.now()}`,
      })
    })
    
    stopTimer()
    
    // Update metrics
    setMetrics(perfMonitor.getReport())
  }

  React.useEffect(() => {
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(perfMonitor.getReport())
    }, 1000)

    return () => clearInterval(interval)
  }, [perfMonitor])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Performance Monitoring</h2>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Performance Metrics</h3>
        <div className="space-y-1 text-sm">
          {Object.entries(metrics).map(([label, stats]) => (
            <div key={label} className="flex justify-between">
              <span className="font-mono">{label}:</span>
              <span>
                avg: {stats.avg.toFixed(2)}ms, 
                min: {stats.min.toFixed(2)}ms, 
                max: {stats.max.toFixed(2)}ms, 
                count: {stats.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Input (debounced): {debouncedInput || '(empty)'}
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Send Message (Tracked)
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
            }`}
          >
            <div className="text-sm font-semibold mb-1">{msg.role}</div>
            <div>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</div>
          </div>
        ))}
      </div>

      {isLoading && <div className="text-gray-500 mt-2">Processing...</div>}
    </div>
  )
}

export default PerformanceExample
