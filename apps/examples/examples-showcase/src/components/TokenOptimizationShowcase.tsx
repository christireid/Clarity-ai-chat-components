/**
 * Token Optimization Hooks Showcase
 *
 * Interactive demonstrations of:
 * - useTokenBudgetMonitor - Budget tracking and warnings
 * - useTokenOptimization - Compression, caching, cost estimation
 * - useTokenCounter - Real-time token counting
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Zap,
  TrendingDown,
  DollarSign,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Info,
  Minimize2,
  Database,
  Clock,
  BarChart3
} from 'lucide-react'
import { useTokenOptimization } from '@clarity-chat/react'
import {
  useTokenBudgetMonitor,
  useTokenCounter
} from '@clarity-chat/react'

// Types
interface CompressionResult {
  original: string
  compressed: string
  compressionRatio: number
  originalTokens: number
  compressedTokens: number
  tokensSaved: number
  strategyUsed: string
  quality: number
}

interface CachedResponse {
  data: string
  cachedAt: Date
  age: number
}

type DemoSection = 'budget' | 'optimization' | 'counter' | 'all'

// Sample texts for demos
const SAMPLE_TEXTS = {
  short: "Hello, how can I help you today?",
  medium: `
    The quick brown fox jumps over the lazy dog. This is a sample text that demonstrates
    token counting and optimization features. It contains enough content to show meaningful
    compression ratios and token counts.
  `,
  long: `
    Artificial Intelligence has revolutionized the way we interact with technology. From natural
    language processing to computer vision, AI systems are becoming increasingly sophisticated.
    Large Language Models (LLMs) like GPT-4 and Claude have demonstrated remarkable capabilities
    in understanding and generating human-like text. However, managing token usage and costs
    remains a critical challenge for developers building AI-powered applications.

    Token optimization involves several key strategies: compression to reduce token count while
    preserving meaning, caching to avoid redundant API calls, and intelligent routing to select
    the most cost-effective model for each task. By implementing these techniques, developers
    can significantly reduce costs while maintaining high-quality user experiences.
  `,
  code: `
function calculateFibonacci(n: number): number {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// Example usage with type safety
const result = calculateFibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);
  `
}

const CHAT_MESSAGES = [
  { role: 'user' as const, content: 'What is React?' },
  { role: 'assistant' as const, content: 'React is a JavaScript library for building user interfaces.' },
  { role: 'user' as const, content: 'Can you explain hooks?' },
  { role: 'assistant' as const, content: 'Hooks are functions that let you use state and other React features in function components.' },
]

export function TokenOptimizationShowcase() {
  const [activeSection, setActiveSection] = useState<DemoSection>('all')

  return (
    <div className="token-optimization-showcase">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="showcase-header"
      >
        <h1 className="showcase-title">
          <Zap className="inline-block mr-2" />
          Token Optimization Hooks
        </h1>
        <p className="showcase-subtitle">
          Interactive demonstrations of all token optimization features
        </p>
      </motion.div>

      {/* Section Selector */}
      <div className="section-selector">
        {[
          { id: 'all' as const, label: 'All Demos', icon: BarChart3 },
          { id: 'budget' as const, label: 'Budget Monitor', icon: Gauge },
          { id: 'optimization' as const, label: 'Optimization', icon: Zap },
          { id: 'counter' as const, label: 'Token Counter', icon: Activity },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`section-btn ${activeSection === id ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Demo Sections */}
      <div className="demos-container">
        <AnimatePresence mode="wait">
          {(activeSection === 'all' || activeSection === 'budget') && (
            <BudgetMonitorDemo key="budget" />
          )}
          {(activeSection === 'all' || activeSection === 'optimization') && (
            <OptimizationDemo key="optimization" />
          )}
          {(activeSection === 'all' || activeSection === 'counter') && (
            <CounterDemo key="counter" />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Budget Monitor Demo - useTokenBudgetMonitor
 */
function BudgetMonitorDemo() {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS.medium)
  const [budgetLimit, setBudgetLimit] = useState(1000)

  const {
    usage,
    status,
    canSend,
    trimIfNeeded,
  } = useTokenBudgetMonitor({
    budget: budgetLimit,
    model: 'gpt-4o',
    warningThreshold: 0.8,
  })

  const handleTrim = useCallback(() => {
    const result = trimIfNeeded(inputText)
    if (result.wasTrimmed) {
      setInputText(result.text)
    }
  }, [inputText, trimIfNeeded])

  const percentage = (usage.current / usage.limit) * 100
  const statusConfig = {
    safe: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertTriangle },
    danger: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
    exceeded: { color: 'text-red-500', bg: 'bg-red-500/30', icon: AlertTriangle },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="demo-card"
    >
      <div className="demo-header">
        <Gauge className="demo-icon" />
        <div>
          <h2 className="demo-title">useTokenBudgetMonitor</h2>
          <p className="demo-description">
            Track token usage against a budget with warnings and auto-trimming
          </p>
        </div>
      </div>

      <div className="demo-content">
        {/* Budget Controls */}
        <div className="control-group">
          <label className="control-label">
            Budget Limit
            <span className="text-xs text-gray-400 ml-2">(tokens)</span>
          </label>
          <input
            type="range"
            min="100"
            max="4000"
            step="100"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
            className="range-input"
          />
          <span className="control-value">{budgetLimit}</span>
        </div>

        {/* Status Display */}
        <div className={`status-card ${config.bg}`}>
          <div className="status-header">
            <StatusIcon className={`${config.color} mr-2`} size={20} />
            <span className={`${config.color} font-semibold uppercase text-sm`}>
              {status}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bg">
              <motion.div
                className={`progress-bar ${
                  status === 'exceeded' ? 'bg-red-500' :
                  status === 'danger' ? 'bg-orange-500' :
                  status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="progress-text">
              {usage.current} / {usage.limit} tokens ({percentage.toFixed(1)}%)
            </div>
          </div>

          {/* Metrics */}
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Remaining</span>
              <span className={`metric-value ${usage.remaining < 100 ? 'text-red-400' : ''}`}>
                {usage.remaining}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Can Send</span>
              <span className={`metric-value ${canSend ? 'text-green-400' : 'text-red-400'}`}>
                {canSend ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="input-group">
          <label className="control-label">Test Input</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="demo-textarea"
            rows={6}
            placeholder="Type or paste text to test budget monitoring..."
          />
          <div className="input-actions">
            <button
              onClick={() => setInputText(SAMPLE_TEXTS.short)}
              className="action-btn-sm"
            >
              Short
            </button>
            <button
              onClick={() => setInputText(SAMPLE_TEXTS.medium)}
              className="action-btn-sm"
            >
              Medium
            </button>
            <button
              onClick={() => setInputText(SAMPLE_TEXTS.long)}
              className="action-btn-sm"
            >
              Long
            </button>
            {!canSend && (
              <button
                onClick={handleTrim}
                className="action-btn-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              >
                <Minimize2 size={14} className="mr-1" />
                Trim to Fit
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="info-box">
          <Info size={16} className="mr-2" />
          <span>
            The budget monitor tracks token usage and provides warnings at 80% threshold.
            It can automatically trim text to fit within budget limits.
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Optimization Demo - useTokenOptimization
 */
function OptimizationDemo() {
  const [text, setText] = useState(SAMPLE_TEXTS.long)
  const [compressionRatio, setCompressionRatio] = useState(0.5)
  const [strategy, setStrategy] = useState<'llmlingua' | 'extractive' | 'adaptive'>('adaptive')
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [cacheKey, setCacheKey] = useState('')
  const [cacheValue, setCacheValue] = useState('')
  const [cachedData, setCachedData] = useState<CachedResponse | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const {
    countTokens,
    compress,
    getCached,
    setCached,
    estimateCost,
    modelInfo,
    isReady,
    compressionEnabled,
    cachingEnabled,
  } = useTokenOptimization({
    model: 'gpt-4o',
    enableCompression: true,
    enableCaching: true,
  })

  const handleCompress = useCallback(async () => {
    setIsCompressing(true)
    try {
      const compressionResult = await compress(text, {
        targetRatio: compressionRatio,
        strategy,
      })
      setResult(compressionResult)
    } catch (error) {
      console.error('Compression error:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [text, compressionRatio, strategy, compress])

  const handleCache = useCallback(async () => {
    if (cacheKey && cacheValue) {
      await setCached(cacheKey, cacheValue)
      setCacheKey('')
      setCacheValue('')
    }
  }, [cacheKey, cacheValue, setCached])

  const handleGetCache = useCallback(async () => {
    if (cacheKey) {
      const data = await getCached(cacheKey)
      setCachedData(data)
    }
  }, [cacheKey, getCached])

  const tokenCount = countTokens(text)
  const cost = estimateCost(tokenCount, 500)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="demo-card"
    >
      <div className="demo-header">
        <Zap className="demo-icon" />
        <div>
          <h2 className="demo-title">useTokenOptimization</h2>
          <p className="demo-description">
            Compress text, cache responses, and estimate costs
          </p>
        </div>
        <div className="ml-auto flex gap-2 text-xs">
          <span className={`status-badge ${compressionEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20'}`}>
            Compression {compressionEnabled ? 'ON' : 'OFF'}
          </span>
          <span className={`status-badge ${cachingEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20'}`}>
            Caching {cachingEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="demo-content">
        {/* Model Info */}
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Model:</span>
            <span className="info-value">{modelInfo.model}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Max Tokens:</span>
            <span className="info-value">{modelInfo.maxTokens.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Input Price:</span>
            <span className="info-value">${modelInfo.inputPricePerMillion}/M</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`info-value ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
              {isReady ? 'Ready' : 'Initializing...'}
            </span>
          </div>
        </div>

        {/* Compression Section */}
        <div className="section">
          <h3 className="section-title">
            <TrendingDown size={18} className="mr-2" />
            Text Compression
          </h3>

          <div className="control-group">
            <label className="control-label">Compression Ratio</label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={compressionRatio}
              onChange={(e) => setCompressionRatio(Number(e.target.value))}
              className="range-input"
            />
            <span className="control-value">{(compressionRatio * 100).toFixed(0)}%</span>
          </div>

          <div className="control-group">
            <label className="control-label">Strategy</label>
            <div className="button-group">
              {['adaptive', 'llmlingua', 'extractive'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStrategy(s as any)}
                  className={`group-btn ${strategy === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="demo-textarea"
            rows={4}
            placeholder="Enter text to compress..."
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCompress}
              disabled={!isReady || isCompressing}
              className="action-btn"
            >
              {isCompressing ? 'Compressing...' : 'Compress'}
            </button>
            <button
              onClick={() => setText(SAMPLE_TEXTS.long)}
              className="action-btn-outline"
            >
              Load Sample
            </button>
          </div>

          {/* Compression Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="result-card"
            >
              <div className="result-header">
                <CheckCircle className="text-green-400 mr-2" size={18} />
                <span className="font-semibold">Compression Results</span>
              </div>

              <div className="metrics-grid-2">
                <div className="metric-card">
                  <div className="metric-label">Original Tokens</div>
                  <div className="metric-value-large">{result.originalTokens}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Compressed Tokens</div>
                  <div className="metric-value-large text-green-400">{result.compressedTokens}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Tokens Saved</div>
                  <div className="metric-value-large text-blue-400">{result.tokensSaved}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Ratio</div>
                  <div className="metric-value-large text-purple-400">
                    {(result.compressionRatio * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="result-content">
                <div className="result-label">Compressed Text:</div>
                <div className="result-text">{result.compressed}</div>
              </div>

              <div className="result-footer">
                <span className="text-xs">Strategy: {result.strategyUsed}</span>
                <span className="text-xs">Quality: {(result.quality * 100).toFixed(0)}%</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Caching Section */}
        <div className="section">
          <h3 className="section-title">
            <Database size={18} className="mr-2" />
            Response Caching
          </h3>

          <div className="cache-controls">
            <input
              type="text"
              value={cacheKey}
              onChange={(e) => setCacheKey(e.target.value)}
              placeholder="Cache key..."
              className="cache-input"
            />
            <input
              type="text"
              value={cacheValue}
              onChange={(e) => setCacheValue(e.target.value)}
              placeholder="Value to cache..."
              className="cache-input"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCache}
              disabled={!cacheKey || !cacheValue}
              className="action-btn"
            >
              Set Cache
            </button>
            <button
              onClick={handleGetCache}
              disabled={!cacheKey}
              className="action-btn-outline"
            >
              Get Cache
            </button>
          </div>

          {cachedData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="cache-result"
            >
              <div className="cache-result-header">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                Cache Hit
              </div>
              <div className="cache-result-content">
                <div className="text-sm">
                  <span className="text-gray-400">Data:</span> {cachedData.data}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <Clock size={12} className="inline mr-1" />
                  Age: {(cachedData.age / 1000).toFixed(1)}s
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Cost Estimation */}
        <div className="section">
          <h3 className="section-title">
            <DollarSign size={18} className="mr-2" />
            Cost Estimation
          </h3>

          <div className="cost-card">
            <div className="cost-row">
              <span className="cost-label">Input Tokens:</span>
              <span className="cost-value">{tokenCount}</span>
            </div>
            <div className="cost-row">
              <span className="cost-label">Input Cost:</span>
              <span className="cost-value">${cost.inputCost.toFixed(6)}</span>
            </div>
            <div className="cost-row">
              <span className="cost-label">Output Cost (est. 500 tokens):</span>
              <span className="cost-value">${cost.outputCost.toFixed(6)}</span>
            </div>
            <div className="cost-row total">
              <span className="cost-label">Total:</span>
              <span className="cost-value text-green-400">${cost.totalCost.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Counter Demo - useTokenCounter
 */
function CounterDemo() {
  const [text, setText] = useState(SAMPLE_TEXTS.medium)
  const [streamText, setStreamText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const {
    countTokens,
    countChatTokens,
    tokenCount,
    setInput,
    isWithinLimit,
    streamTokenCount,
    onStreamChunk,
    resetStreamCount,
    modelMaxTokens,
    encodingName,
  } = useTokenCounter({
    model: 'gpt-4o',
    debounceMs: 150,
  })

  const manualCount = countTokens(text)
  const chatCount = countChatTokens(CHAT_MESSAGES)

  // Simulate streaming
  const simulateStreaming = useCallback(() => {
    setIsStreaming(true)
    resetStreamCount()
    setStreamText('')

    const fullText = SAMPLE_TEXTS.long
    let index = 0

    const interval = setInterval(() => {
      if (index < fullText.length) {
        const chunk = fullText.slice(index, index + 10)
        setStreamText((prev) => prev + chunk)
        onStreamChunk(chunk)
        index += 10
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 50)
  }, [onStreamChunk, resetStreamCount])

  const percentage = (manualCount / modelMaxTokens) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="demo-card"
    >
      <div className="demo-header">
        <Activity className="demo-icon" />
        <div>
          <h2 className="demo-title">useTokenCounter</h2>
          <p className="demo-description">
            Real-time token counting with debouncing and streaming support
          </p>
        </div>
      </div>

      <div className="demo-content">
        {/* Model Info */}
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Encoding:</span>
            <span className="info-value font-mono">{encodingName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Max Tokens:</span>
            <span className="info-value">{modelMaxTokens.toLocaleString()}</span>
          </div>
        </div>

        {/* Manual Counting */}
        <div className="section">
          <h3 className="section-title">Manual Token Counting</h3>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setInput(e.target.value)
            }}
            className="demo-textarea"
            rows={5}
            placeholder="Type to see token count..."
          />

          <div className="token-display">
            <div className="token-count-large">
              {manualCount}
              <span className="token-label">tokens</span>
            </div>
            <div className="token-details">
              <div className="detail-item">
                <span className="detail-label">Characters:</span>
                <span className="detail-value">{text.length}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ratio:</span>
                <span className="detail-value">
                  {text.length > 0 ? (text.length / manualCount).toFixed(2) : '0'} chars/token
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Usage:</span>
                <span className={`detail-value ${percentage > 80 ? 'text-red-400' : 'text-green-400'}`}>
                  {percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bg">
              <motion.div
                className={`progress-bar ${
                  percentage > 90 ? 'bg-red-500' :
                  percentage > 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="mt-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              isWithinLimit(text, 4000)
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isWithinLimit(text, 4000) ? (
                <>
                  <CheckCircle size={14} className="mr-1" />
                  Within 4000 token limit
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="mr-1" />
                  Exceeds 4000 token limit
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chat Message Counting */}
        <div className="section">
          <h3 className="section-title">Chat Message Counting</h3>

          <div className="chat-messages">
            {CHAT_MESSAGES.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="message-role">{msg.role}</div>
                <div className="message-content">{msg.content}</div>
                <div className="message-tokens">
                  {countTokens(msg.content)} tokens
                </div>
              </div>
            ))}
          </div>

          <div className="chat-total">
            <span className="chat-total-label">Total Chat Tokens:</span>
            <span className="chat-total-value">{chatCount}</span>
          </div>
        </div>

        {/* Streaming Counter */}
        <div className="section">
          <h3 className="section-title">
            <Activity size={18} className="mr-2" />
            Streaming Token Count
          </h3>

          <button
            onClick={simulateStreaming}
            disabled={isStreaming}
            className="action-btn"
          >
            {isStreaming ? 'Streaming...' : 'Start Stream Simulation'}
          </button>

          {streamText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="stream-display"
            >
              <div className="stream-header">
                <span className="stream-label">Streaming Tokens:</span>
                <span className="stream-count">{streamTokenCount}</span>
              </div>
              <div className="stream-content">{streamText}</div>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            onClick={() => setText(SAMPLE_TEXTS.short)}
            className="action-btn-sm"
          >
            Short Text
          </button>
          <button
            onClick={() => setText(SAMPLE_TEXTS.medium)}
            className="action-btn-sm"
          >
            Medium Text
          </button>
          <button
            onClick={() => setText(SAMPLE_TEXTS.long)}
            className="action-btn-sm"
          >
            Long Text
          </button>
          <button
            onClick={() => setText(SAMPLE_TEXTS.code)}
            className="action-btn-sm"
          >
            Code Sample
          </button>
        </div>
      </div>
    </motion.div>
  )
}
