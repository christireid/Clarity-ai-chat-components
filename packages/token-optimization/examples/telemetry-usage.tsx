/**
 * OpenTelemetry Integration Examples
 *
 * Complete examples showing how to use telemetry for observability
 * in token optimization operations.
 */

import React, { useState, useCallback } from 'react'
import {
  useTelemetry,
  useTelemetryMetrics,
  usePerformanceMonitor,
  useTokenOptimization,
  useStreamingOptimization,
  TelemetryCollector,
  instrumentTokenCount,
  instrumentOptimization,
  type TelemetryMetrics,
  type TelemetrySpan,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Example 1: Basic Telemetry Dashboard
// ============================================================================

export function BasicTelemetryDashboard() {
  const {
    metrics,
    recentSpans,
    totalSpans,
    startSpan,
    endSpan,
    recordError,
    incrementCounter,
  } = useTelemetry({
    serviceName: 'token-optimizer',
    enableTracing: true,
    enableMetrics: true,
    autoExportInterval: 5000, // Update UI every 5s
    enableConsoleExporter: true, // Log to console
  })

  const [result, setResult] = useState<string>('')

  const handleTokenCount = useCallback(async () => {
    const spanId = startSpan('token_count', {
      operation: 'manual_count',
    })

    try {
      // Simulate token counting
      await new Promise((resolve) => setTimeout(resolve, 100))
      const tokens = Math.floor(Math.random() * 1000)

      incrementCounter('tokensCounted')
      endSpan(spanId, { tokens })

      setResult(`Counted ${tokens} tokens`)
    } catch (error) {
      recordError(spanId, error as Error)
      incrementCounter('errorsEncountered')
      endSpan(spanId)
      setResult('Error counting tokens')
    }
  }, [startSpan, endSpan, recordError, incrementCounter])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Basic Telemetry Dashboard</h2>

      <button onClick={handleTokenCount}>Count Tokens</button>
      {result && <p>{result}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Metrics</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Tokens Counted
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.tokensCounted}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Optimizations
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.optimizationsPerformed}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Cache Hits
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.cacheHits}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Cache Misses
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.cacheMisses}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Errors
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.errorsEncountered}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Spans</h3>
        <p>Total Spans: {totalSpans}</p>
        <p>Recent Spans: {recentSpans.length}</p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 2: Performance Monitoring
// ============================================================================

export function PerformanceMonitoringExample() {
  const { track, stats, durations, reset } = usePerformanceMonitor()

  const [status, setStatus] = useState<string>('')

  const runOperation = useCallback(
    async (complexity: 'simple' | 'medium' | 'complex') => {
      setStatus('Running...')

      await track('optimization_operation', async () => {
        // Simulate different complexity levels
        const delay = complexity === 'simple' ? 50 : complexity === 'medium' ? 150 : 300
        await new Promise((resolve) => setTimeout(resolve, delay))
      })

      setStatus('Complete')
    },
    [track]
  )

  const getPerformanceRating = (p95: number): string => {
    if (p95 < 100) return '🟢 Excellent'
    if (p95 < 200) return '🟡 Good'
    if (p95 < 300) return '🟠 Fair'
    return '🔴 Poor'
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Performance Monitoring</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => runOperation('simple')}>Simple Operation</button>
        <button onClick={() => runOperation('medium')}>Medium Operation</button>
        <button onClick={() => runOperation('complex')}>Complex Operation</button>
        <button onClick={reset}>Reset Stats</button>
      </div>

      {status && <p>Status: {status}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Performance Statistics</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                P50 (Median)
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.p50.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                P95
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.p95.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                P99
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.p99.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Average
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.avg.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Min
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.min.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Max
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {stats.max.toFixed(1)}ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Samples
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {durations.length}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
          <h4>Performance Rating</h4>
          <p style={{ fontSize: '24px' }}>{getPerformanceRating(stats.p95)}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: Optimization Pipeline with Telemetry
// ============================================================================

export function OptimizationPipelineWithTelemetry() {
  const {
    startSpan,
    endSpan,
    addEvent,
    recordError,
    incrementCounter,
    metrics,
  } = useTelemetry({
    serviceName: 'optimization-pipeline',
    enableTracing: true,
    enableMetrics: true,
    autoExportInterval: 3000,
  })

  const { optimize } = useTokenOptimization({
    preset: 'cost-optimized',
  })

  const [result, setResult] = useState<string>('')
  const [processing, setProcessing] = useState(false)

  const processMessage = useCallback(
    async (message: string) => {
      setProcessing(true)
      setResult('')

      // Create main span
      const mainSpan = startSpan('message_processing', {
        messageLength: message.length,
      })

      try {
        // Step 1: Validation
        addEvent(mainSpan, 'validation_start')
        await new Promise((resolve) => setTimeout(resolve, 50))
        addEvent(mainSpan, 'validation_complete', { valid: true })

        // Step 2: Token counting
        addEvent(mainSpan, 'token_count_start')
        const countSpan = startSpan('token_counting')
        await new Promise((resolve) => setTimeout(resolve, 100))
        const tokens = Math.floor(message.length / 4)
        incrementCounter('tokensCounted')
        endSpan(countSpan, { tokens })
        addEvent(mainSpan, 'token_count_complete', { tokens })

        // Step 3: Optimization
        addEvent(mainSpan, 'optimization_start')
        const optSpan = startSpan('optimization')
        const optimized = await optimize(message)
        incrementCounter('optimizationsPerformed')
        endSpan(optSpan, {
          tokensSaved: optimized.savings.tokens,
          percentSaved: optimized.savings.percentage,
        })
        addEvent(mainSpan, 'optimization_complete')

        // Step 4: Cache check
        const cacheSpan = startSpan('cache_check')
        const isCached = Math.random() > 0.5
        if (isCached) {
          incrementCounter('cacheHits')
        } else {
          incrementCounter('cacheMisses')
        }
        endSpan(cacheSpan, { hit: isCached })

        // Complete main span
        endSpan(mainSpan, {
          success: true,
          finalTokens: optimized.optimized.tokens,
        })

        setResult(
          `✅ Optimized: ${optimized.original.tokens} → ${optimized.optimized.tokens} tokens (${optimized.savings.percentage}% saved)`
        )
      } catch (error) {
        recordError(mainSpan, error as Error)
        incrementCounter('errorsEncountered')
        endSpan(mainSpan)
        setResult('❌ Error during optimization')
      } finally {
        setProcessing(false)
      }
    },
    [startSpan, endSpan, addEvent, recordError, incrementCounter, optimize]
  )

  const cacheHitRate =
    metrics.cacheHits + metrics.cacheMisses > 0
      ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
      : 0

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Optimization Pipeline with Telemetry</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            processMessage(
              'This is a test message that will be optimized and monitored via telemetry.'
            )
          }
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Process Message'}
        </button>
      </div>

      {result && (
        <div
          style={{
            padding: '10px',
            backgroundColor: result.startsWith('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${result.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          {result}
        </div>
      )}

      <div>
        <h3>Pipeline Metrics</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Messages Processed
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.optimizationsPerformed}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Cache Hit Rate
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {cacheHitRate.toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Errors
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.errorsEncountered}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                Avg Optimization Time
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {metrics.optimizationDurations.length > 0
                  ? (
                      metrics.optimizationDurations.reduce((a, b) => a + b, 0) /
                      metrics.optimizationDurations.length
                    ).toFixed(1)
                  : 0}
                ms
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// Example 4: Streaming with Telemetry
// ============================================================================

export function StreamingWithTelemetry() {
  const {
    startSpan,
    endSpan,
    addEvent,
    incrementCounter,
    recordMetric,
    metrics,
  } = useTelemetry({
    serviceName: 'streaming-chat',
    enableTracing: true,
    enableMetrics: true,
  })

  const { startStream, response, isStreaming, tokenStats, costStats } =
    useStreamingOptimization({
      pricing: {
        model: 'gpt-4o',
        provider: 'openai',
        inputCostPer1M: 2.5,
        outputCostPer1M: 10,
      },
      enablePrediction: true,
      enableTiming: true,
    })

  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleStream = useCallback(async () => {
    const mainSpan = startSpan('streaming_response')
    addLog('Started streaming...')

    try {
      // Mock streaming generator
      async function* mockStream() {
        const text = 'This is a streaming response that arrives chunk by chunk.'
        const words = text.split(' ')

        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100))

          const chunk = {
            content: words[i] + ' ',
            sequence: i,
            cumulative: words.slice(0, i + 1).join(' ') + ' ',
            isFinal: i === words.length - 1,
          }

          addEvent(mainSpan, 'chunk_received', {
            sequence: i,
            length: chunk.content.length,
          })

          incrementCounter('tokensCounted')

          yield chunk
        }
      }

      await startStream('test prompt', 10, mockStream())

      endSpan(mainSpan, {
        chunksReceived: tokenStats?.chunkCount || 0,
        totalTokens: tokenStats?.totalTokens || 0,
        totalCost: costStats?.totalCost || 0,
      })

      addLog('Streaming complete')
    } catch (error) {
      recordError(mainSpan, error as Error)
      incrementCounter('errorsEncountered')
      endSpan(mainSpan)
      addLog('Error during streaming')
    }
  }, [
    startSpan,
    endSpan,
    addEvent,
    incrementCounter,
    startStream,
    tokenStats,
    costStats,
  ])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Streaming with Telemetry</h2>

      <button onClick={handleStream} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start Stream'}
      </button>

      {response && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
          }}
        >
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}

      {tokenStats && (
        <div style={{ marginTop: '20px' }}>
          <h3>Stream Stats</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Chunks
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {tokenStats.chunkCount}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Total Tokens
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {tokenStats.totalTokens}
                </td>
              </tr>
              {tokenStats.estimatedFinalTokens && (
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    Estimated Final
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {tokenStats.estimatedFinalTokens} (
                    {(tokenStats.estimationConfidence! * 100).toFixed(0)}% confidence)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {costStats && (
        <div style={{ marginTop: '20px' }}>
          <h3>Cost Stats</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Total Cost
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ${costStats.totalCost.toFixed(6)}
                </td>
              </tr>
              {costStats.tokensPerSecond && (
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    Tokens/Second
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {costStats.tokensPerSecond.toFixed(1)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Event Log</h3>
        <div
          style={{
            maxHeight: '200px',
            overflow: 'auto',
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ fontSize: '12px', marginBottom: '4px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Metrics-Only Dashboard
// ============================================================================

export function MetricsOnlyDashboard() {
  const { metrics, incrementCounter, recordMetric, reset } = useTelemetryMetrics({
    serviceName: 'metrics-dashboard',
  })

  const simulateActivity = () => {
    // Simulate various activities
    incrementCounter('tokensCounted', Math.floor(Math.random() * 100))
    incrementCounter('optimizationsPerformed', 1)

    if (Math.random() > 0.5) {
      incrementCounter('cacheHits', 1)
    } else {
      incrementCounter('cacheMisses', 1)
    }

    recordMetric('currentTokens', Math.floor(Math.random() * 2000))
    recordMetric('currentCost', Math.random() * 0.01)
  }

  const cacheHitRate =
    metrics.cacheHits + metrics.cacheMisses > 0
      ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
      : 0

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Metrics-Only Dashboard</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={simulateActivity}>Simulate Activity</button>
        <button onClick={reset}>Reset Metrics</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}
      >
        <MetricCard
          title="Tokens Counted"
          value={metrics.tokensCounted}
          color="#007bff"
        />
        <MetricCard
          title="Optimizations"
          value={metrics.optimizationsPerformed}
          color="#28a745"
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${cacheHitRate.toFixed(1)}%`}
          color="#17a2b8"
        />
        <MetricCard
          title="Current Tokens"
          value={metrics.currentTokens}
          color="#ffc107"
        />
        <MetricCard
          title="Current Cost"
          value={`$${metrics.currentCost.toFixed(6)}`}
          color="#dc3545"
        />
        <MetricCard title="Errors" value={metrics.errorsEncountered} color="#6c757d" />
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string
  value: number | string
  color: string
}) {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        border: `2px solid ${color}`,
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  )
}

// ============================================================================
// Example 6: Instrumentation Wrapper
// ============================================================================

export function InstrumentationExample() {
  const [result, setResult] = useState<string>('')

  const collector = new TelemetryCollector({
    serviceName: 'instrumentation-demo',
    enableTracing: true,
    enableMetrics: true,
  })

  // Original functions
  const countTokens = (text: string): number => {
    return Math.floor(text.length / 4)
  }

  const optimizeText = async (text: string): Promise<{
    optimized: string
    tokensSaved: number
    strategy: string
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
      optimized: text.toLowerCase(),
      tokensSaved: Math.floor(text.length * 0.2),
      strategy: 'lowercase',
    }
  }

  // Instrument them
  const instrumentedCount = instrumentTokenCount(countTokens, collector)
  const instrumentedOptimize = instrumentOptimization(optimizeText, collector)

  const runInstrumented = async () => {
    const text = 'HELLO WORLD THIS IS A TEST MESSAGE'

    // Count tokens (instrumented)
    const tokens = instrumentedCount(text)

    // Optimize (instrumented)
    const optimized = await instrumentedOptimize(text)

    // Get metrics
    const metrics = collector.getMetrics()
    const spans = collector.getSpans()

    setResult(`
      Tokens: ${tokens}
      Optimized: ${optimized.optimized}
      Tokens Saved: ${optimized.tokensSaved}

      Metrics:
      - Token counts: ${metrics.tokensCounted}
      - Optimizations: ${metrics.optimizationsPerformed}
      - Spans collected: ${spans.length}
    `)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Instrumentation Wrapper Example</h2>

      <button onClick={runInstrumented}>Run Instrumented Operations</button>

      {result && (
        <pre
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}

// ============================================================================
// Main Demo App
// ============================================================================

export function TelemetryDemo() {
  const [activeExample, setActiveExample] = useState<number>(1)

  const examples = [
    { id: 1, name: 'Basic Dashboard', component: <BasicTelemetryDashboard /> },
    { id: 2, name: 'Performance Monitor', component: <PerformanceMonitoringExample /> },
    {
      id: 3,
      name: 'Optimization Pipeline',
      component: <OptimizationPipelineWithTelemetry />,
    },
    { id: 4, name: 'Streaming', component: <StreamingWithTelemetry /> },
    { id: 5, name: 'Metrics Only', component: <MetricsOnlyDashboard /> },
    { id: 6, name: 'Instrumentation', component: <InstrumentationExample /> },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h1 style={{ margin: 0 }}>OpenTelemetry Integration Examples</h1>
        <p style={{ margin: '10px 0 0 0', color: '#6c757d' }}>
          Week 6: Observability for Token Optimization
        </p>
      </div>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            minHeight: 'calc(100vh - 100px)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Examples</h3>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                backgroundColor: activeExample === example.id ? '#007bff' : '#fff',
                color: activeExample === example.id ? '#fff' : '#000',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {example.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {examples.find((e) => e.id === activeExample)?.component}
        </div>
      </div>
    </div>
  )
}

export default TelemetryDemo
