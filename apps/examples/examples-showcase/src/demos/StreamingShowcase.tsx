/**
 * Streaming Message Showcase
 *
 * Comprehensive demonstration of streaming functionality with:
 * - Real-time message streaming simulation
 * - Token-by-token rendering
 * - Multiple streaming scenarios
 * - Glassmorphism styled containers
 * - Smooth animations and transitions
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Glassmorphism styles for containers
const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
  light: 'backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl',
  dark: 'backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl',
}

// Streaming scenarios with realistic examples
const STREAMING_SCENARIOS = {
  fast: {
    name: 'Fast Streaming',
    speed: 20,
    color: 'from-blue-500 to-cyan-500',
    content: 'The quick brown fox jumps over the lazy dog. This demonstrates fast streaming at 20ms per character, ideal for short messages.',
  },
  normal: {
    name: 'Normal Streaming',
    speed: 50,
    color: 'from-purple-500 to-pink-500',
    content: 'This is a normal streaming speed demonstration. The characters appear at a comfortable reading pace of 50ms per character, which is typical for most AI chat applications like ChatGPT and Claude.',
  },
  slow: {
    name: 'Slow Streaming',
    speed: 100,
    color: 'from-green-500 to-emerald-500',
    content: 'Slow streaming at 100ms per character creates a more deliberate, thoughtful appearance. This can be useful for dramatic effect or when processing complex queries.',
  },
  code: {
    name: 'Code Streaming',
    speed: 30,
    color: 'from-orange-500 to-red-500',
    content: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // Output: 55`,
  },
  multiline: {
    name: 'Multiline Content',
    speed: 40,
    color: 'from-indigo-500 to-purple-500',
    content: `# Streaming Features

Here are some key features of streaming:

1. Real-time updates
2. Token-by-token rendering
3. Smooth animations
4. Glassmorphism effects
5. Multiple speed controls

Try clicking different scenarios to see the streaming in action!`,
  },
}

type ScenarioKey = keyof typeof STREAMING_SCENARIOS

interface StreamingMessageProps {
  content: string
  speed: number
  isStreaming: boolean
  onComplete?: () => void
  showCursor?: boolean
  className?: string
}

// StreamingMessage component with token-by-token rendering
const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  speed,
  isStreaming,
  onComplete,
  showCursor = true,
  className = '',
}) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content)
      return
    }

    if (currentIndex < content.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)
    } else if (onComplete) {
      onComplete()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, speed, isStreaming, currentIndex, onComplete])

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent('')
    setCurrentIndex(0)
  }, [content])

  return (
    <div className={`relative ${className}`}>
      <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100">
        {displayedContent}
        {isStreaming && showCursor && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block ml-1 w-2 h-5 bg-current align-middle"
          />
        )}
      </pre>
    </div>
  )
}

// Streaming indicator component
const StreamingIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex gap-1">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          </div>
          <span>Streaming...</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Stats display component
const StreamStats: React.FC<{
  charsStreamed: number
  totalChars: number
  speed: number
  startTime: number | null
}> = ({ charsStreamed, totalChars, speed, startTime }) => {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 100)

    return () => clearInterval(interval)
  }, [startTime])

  const progress = totalChars > 0 ? (charsStreamed / totalChars) * 100 : 0
  const charsPerSecond = elapsed > 0 ? (charsStreamed / (elapsed / 1000)).toFixed(1) : '0'

  return (
    <div className={`${glassStyles.light} rounded-lg p-4 space-y-3`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Progress</span>
        <span className="font-mono text-gray-900 dark:text-gray-100">
          {charsStreamed} / {totalChars} chars
        </span>
      </div>

      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {charsPerSecond}
          </div>
          <div>chars/sec</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {speed}ms
          </div>
          <div>delay</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {(elapsed / 1000).toFixed(1)}s
          </div>
          <div>elapsed</div>
        </div>
      </div>
    </div>
  )
}

// Main showcase component
export const StreamingShowcase: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('normal')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamStartTime, setStreamStartTime] = useState<number | null>(null)
  const [charsStreamed, setCharsStreamed] = useState(0)

  const scenario = STREAMING_SCENARIOS[selectedScenario]

  const handleStart = useCallback(() => {
    setIsStreaming(true)
    setStreamStartTime(Date.now())
    setCharsStreamed(0)
  }, [])

  const handleStop = useCallback(() => {
    setIsStreaming(false)
    setStreamStartTime(null)
  }, [])

  const handleComplete = useCallback(() => {
    setIsStreaming(false)
  }, [])

  // Track characters streamed
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      setCharsStreamed((prev) => {
        const next = prev + 1
        return next <= scenario.content.length ? next : prev
      })
    }, scenario.speed)

    return () => clearInterval(interval)
  }, [isStreaming, scenario.speed, scenario.content.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Streaming Message Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real-time message streaming with multiple scenarios and smooth animations
          </p>
        </motion.div>

        {/* Scenario Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${glassStyles.base} rounded-2xl p-6`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Choose a Scenario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(STREAMING_SCENARIOS).map(([key, scenario]) => (
              <motion.button
                key={key}
                onClick={() => {
                  setSelectedScenario(key as ScenarioKey)
                  handleStop()
                }}
                className={`
                  relative p-4 rounded-xl transition-all duration-300
                  ${
                    selectedScenario === key
                      ? `bg-gradient-to-br ${scenario.color} text-white shadow-lg scale-105`
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-900 dark:text-white'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-sm font-semibold">{scenario.name}</div>
                <div className="text-xs mt-1 opacity-75">{scenario.speed}ms</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Streaming Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Streaming Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className={`${glassStyles.light} rounded-2xl p-6 space-y-4 min-h-[400px]`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {scenario.name}
                </h3>
                <StreamingIndicator isActive={isStreaming} />
              </div>

              <div className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-6 min-h-[300px]">
                <StreamingMessage
                  content={scenario.content}
                  speed={scenario.speed}
                  isStreaming={isStreaming}
                  onComplete={handleComplete}
                  className="text-lg leading-relaxed"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={handleStart}
                  disabled={isStreaming}
                  className={`
                    flex-1 py-3 px-6 rounded-xl font-semibold
                    bg-gradient-to-r ${scenario.color}
                    text-white shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                  `}
                  whileHover={!isStreaming ? { scale: 1.02 } : {}}
                  whileTap={!isStreaming ? { scale: 0.98 } : {}}
                >
                  {isStreaming ? 'Streaming...' : 'Start Streaming'}
                </motion.button>

                <motion.button
                  onClick={handleStop}
                  disabled={!isStreaming}
                  className="
                    px-6 py-3 rounded-xl font-semibold
                    bg-red-500 text-white shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                  "
                  whileHover={isStreaming ? { scale: 1.02 } : {}}
                  whileTap={isStreaming ? { scale: 0.98 } : {}}
                >
                  Stop
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <StreamStats
              charsStreamed={charsStreamed}
              totalChars={scenario.content.length}
              speed={scenario.speed}
              startTime={streamStartTime}
            />

            {/* Features List */}
            <div className={`${glassStyles.light} rounded-xl p-4`}>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Streaming Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Token-by-token rendering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Smooth cursor animation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Real-time statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Glassmorphism effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Multiple speed controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Streaming indicators</span>
                </li>
              </ul>
            </div>

            {/* Color Legend */}
            <div className={`${glassStyles.light} rounded-xl p-4`}>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Scenario Colors
              </h4>
              <div className="space-y-2">
                {Object.entries(STREAMING_SCENARIOS).map(([key, scenario]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${scenario.color}`} />
                    <span className="text-gray-600 dark:text-gray-400">{scenario.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Multi-Stream Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${glassStyles.base} rounded-2xl p-6`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Multi-Stream Comparison
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(['fast', 'normal', 'slow'] as ScenarioKey[]).map((key) => {
              const s = STREAMING_SCENARIOS[key]
              return (
                <div key={key} className={`${glassStyles.light} rounded-xl p-4`}>
                  <div className={`text-sm font-semibold mb-2 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.name} ({s.speed}ms)
                  </div>
                  <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 min-h-[120px] text-sm">
                    <StreamingMessage
                      content={s.content.slice(0, 120) + '...'}
                      speed={s.speed}
                      isStreaming={isStreaming}
                      showCursor={false}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className={`${glassStyles.light} rounded-xl p-6`}>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              When to Use Streaming
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>Long-form AI responses (articles, essays)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>Code generation and explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>Real-time chat applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>Improved perceived performance</span>
              </li>
            </ul>
          </div>

          <div className={`${glassStyles.light} rounded-xl p-6`}>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Implementation Details
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Uses Framer Motion for smooth animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Glassmorphism with backdrop-blur effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Real-time character streaming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Responsive design with Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StreamingShowcase
