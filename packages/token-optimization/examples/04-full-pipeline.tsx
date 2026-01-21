/**
 * Example 04: Full Optimization Pipeline
 *
 * Complete example showing caching, compression, and routing.
 * For production applications that need maximum optimization.
 */

import { useState, useCallback } from 'react'
import {
  useTokenOptimization,
  useOptimizationPipeline,
  createOptimizer,
  ModelRouter,
  DEFAULTS,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Level 2: useTokenOptimization (Recommended for Most Apps)
// ============================================================================

export function OptimizedPromptEditor() {
  const [text, setText] = useState('')

  // All-in-one hook with preset configuration
  const { count, isLoading, optimizedText, savings, cacheHit, error } =
    useTokenOptimization(text, {
      preset: 'standard', // or 'minimal', 'production', 'enterprise'
      enableCache: true,
      enableCompression: true,
      enableRouting: true,
    })

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h3>Optimized Prompt Editor</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ width: '100%', height: 150 }}
      />

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>Error: {error.message}</div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 16,
        }}
      >
        <div>
          <strong>Tokens</strong>
          <div style={{ fontSize: 24 }}>{isLoading ? '...' : count}</div>
        </div>
        <div>
          <strong>Savings</strong>
          <div style={{ fontSize: 24, color: 'green' }}>
            {savings > 0 ? `-${(savings * 100).toFixed(0)}%` : '-'}
          </div>
        </div>
        <div>
          <strong>Cache</strong>
          <div style={{ fontSize: 24, color: cacheHit ? 'green' : '#666' }}>
            {cacheHit ? 'HIT' : 'MISS'}
          </div>
        </div>
      </div>

      {optimizedText && optimizedText !== text && (
        <div style={{ marginTop: 16 }}>
          <strong>Optimized Version:</strong>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 4,
              overflow: 'auto',
            }}
          >
            {optimizedText}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Level 3: useOptimizationPipeline (Full Control)
// ============================================================================

export function AdvancedPipelineDemo() {
  const [text, setText] = useState('')
  const [compressionLevel, setCompressionLevel] = useState<
    'light' | 'moderate' | 'aggressive'
  >('moderate')

  const { result, stats, isProcessing, error, reprocess } =
    useOptimizationPipeline(text, {
      // Cache configuration
      cache: {
        maxSize: 1000,
        ttl: 3600000, // 1 hour
        enableSemanticMatch: true,
      },
      // Compression configuration
      compression: {
        level: compressionLevel,
        preserveCode: true,
        preserveInstructions: true,
        minQuality: 0.85,
      },
      // Routing configuration
      routing: {
        strategy: 'balanced',
        preferTier: 'standard',
      },
    })

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h3>Advanced Pipeline</h3>

      <div style={{ marginBottom: 16 }}>
        <label>Compression Level: </label>
        <select
          value={compressionLevel}
          onChange={(e) =>
            setCompressionLevel(e.target.value as typeof compressionLevel)
          }
        >
          <option value="light">Light (fast, minimal)</option>
          <option value="moderate">Moderate (balanced)</option>
          <option value="aggressive">Aggressive (max savings)</option>
        </select>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a long prompt to optimize..."
        style={{ width: '100%', height: 200 }}
      />

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>Error: {error.message}</div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={reprocess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Reprocess'}
        </button>
      </div>

      {stats && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: '#f9f9f9',
            borderRadius: 8,
          }}
        >
          <h4 style={{ marginTop: 0 }}>Pipeline Statistics</h4>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td>Original tokens</td>
                <td style={{ textAlign: 'right' }}>{stats.originalTokens}</td>
              </tr>
              <tr>
                <td>Optimized tokens</td>
                <td style={{ textAlign: 'right' }}>{stats.optimizedTokens}</td>
              </tr>
              <tr>
                <td>Savings</td>
                <td style={{ textAlign: 'right', color: 'green' }}>
                  {(stats.savingsPercent * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td>Cache hit</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.cacheHit ? '✅ Yes' : '❌ No'}
                </td>
              </tr>
              <tr>
                <td>Suggested model</td>
                <td style={{ textAlign: 'right' }}>{stats.suggestedModel}</td>
              </tr>
              <tr>
                <td>Estimated cost</td>
                <td style={{ textAlign: 'right' }}>
                  ${stats.estimatedCost.toFixed(6)}
                </td>
              </tr>
              <tr>
                <td>Processing time</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.processingTimeMs}ms
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {result?.optimizedText && result.optimizedText !== text && (
        <div style={{ marginTop: 16 }}>
          <h4>Optimized Output</h4>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#fff',
              padding: 16,
              borderRadius: 8,
              overflow: 'auto',
              maxHeight: 300,
            }}
          >
            {result.optimizedText}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Non-React: createOptimizer Factory
// ============================================================================

export function factoryExample() {
  // Create optimizer with preset
  const optimizer = createOptimizer({
    preset: 'production',
    model: 'gpt-4o',
  })

  // Process text
  const result = optimizer.process('Your long prompt here...')

  console.log({
    originalTokens: result.originalTokens,
    optimizedTokens: result.optimizedTokens,
    savings: `${(result.savings * 100).toFixed(1)}%`,
    suggestedModel: result.model,
    cost: `$${result.cost.toFixed(6)}`,
  })

  return result
}

// ============================================================================
// Complete App Example
// ============================================================================

export function CompleteChatOptimizer() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [model, setModel] = useState('gpt-4o')

  // Optimize system prompt
  const systemOpt = useTokenOptimization(systemPrompt, {
    preset: 'production',
    enableCompression: true,
  })

  // Count user message tokens
  const userOpt = useTokenOptimization(userMessage, {
    preset: 'minimal', // Don't compress user messages
    enableCompression: false,
  })

  // Calculate totals
  const totalTokens = systemOpt.count + userOpt.count
  const totalSavings = systemOpt.savings

  // Get routing suggestion
  const router = ModelRouter.default()
  const routingResult = router.route(systemPrompt + '\n' + userMessage)

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto' }}>
      <h2>Chat Optimizer</h2>

      {/* System Prompt */}
      <div style={{ marginBottom: 24 }}>
        <label>
          <strong>System Prompt</strong> ({systemOpt.count} tokens)
          {systemOpt.savings > 0 && (
            <span style={{ color: 'green', marginLeft: 8 }}>
              -{(systemOpt.savings * 100).toFixed(0)}% optimized
            </span>
          )}
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          style={{ width: '100%', height: 100, marginTop: 4 }}
        />
      </div>

      {/* User Message */}
      <div style={{ marginBottom: 24 }}>
        <label>
          <strong>User Message</strong> ({userOpt.count} tokens)
        </label>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message..."
          style={{ width: '100%', height: 80, marginTop: 4 }}
        />
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>Total Tokens</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{totalTokens}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>Savings</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>
            {totalSavings > 0 ? `${(totalSavings * 100).toFixed(0)}%` : '-'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>Suggested Model</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>
            {routingResult.model}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>Est. Cost</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>
            ${routingResult.cost.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  )
}
