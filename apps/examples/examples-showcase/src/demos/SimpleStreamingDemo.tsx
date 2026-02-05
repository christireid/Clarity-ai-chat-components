/**
 * Simple Streaming Demo
 *
 * A simplified version that can be easily integrated into the showcase
 * without complex dependencies. Shows core streaming concepts.
 */

import React, { useState, useEffect, useRef } from 'react'

interface SimpleStreamingProps {
  text: string
  speed?: number
  onComplete?: () => void
}

const SimpleStreaming: React.FC<SimpleStreamingProps> = ({
  text,
  speed = 50,
  onComplete
}) => {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (index < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, speed)
    } else if (onComplete) {
      onComplete()
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [index, text, speed, onComplete])

  useEffect(() => {
    setDisplayed('')
    setIndex(0)
  }, [text])

  return (
    <div className="relative">
      <pre className="whitespace-pre-wrap font-sans">
        {displayed}
        {index < text.length && (
          <span className="inline-block ml-1 w-2 h-5 bg-blue-500 animate-pulse" />
        )}
      </pre>
    </div>
  )
}

export const SimpleStreamingDemo: React.FC = () => {
  const [scenario, setScenario] = useState<'fast' | 'normal' | 'slow'>('normal')
  const [isStreaming, setIsStreaming] = useState(false)
  const [key, setKey] = useState(0)

  const scenarios = {
    fast: {
      speed: 20,
      text: 'Fast streaming: The quick brown fox jumps over the lazy dog.',
      color: 'blue'
    },
    normal: {
      speed: 50,
      text: 'Normal streaming: This demonstrates a comfortable reading pace for AI chat applications.',
      color: 'purple'
    },
    slow: {
      speed: 100,
      text: 'Slow streaming: This creates a more deliberate, thoughtful appearance.',
      color: 'green'
    }
  }

  const current = scenarios[scenario]

  const handleStart = () => {
    setIsStreaming(true)
    setKey(prev => prev + 1) // Force remount to restart
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Streaming Demo</h1>
        <p className="text-gray-600">Token-by-token message rendering</p>
      </div>

      {/* Scenario Selector */}
      <div className="flex justify-center gap-4">
        {(['fast', 'normal', 'slow'] as const).map(s => (
          <button
            key={s}
            onClick={() => {
              setScenario(s)
              setIsStreaming(false)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              scenario === s
                ? `bg-${scenarios[s].color}-500 text-white`
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({scenarios[s].speed}ms)
          </button>
        ))}
      </div>

      {/* Streaming Container */}
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[200px]">
        {isStreaming ? (
          <SimpleStreaming
            key={key}
            text={current.text}
            speed={current.speed}
            onComplete={() => setIsStreaming(false)}
          />
        ) : (
          <div className="text-gray-400 italic">
            Click "Start Streaming" to begin
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleStart}
          disabled={isStreaming}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            isStreaming
              ? 'bg-gray-300 cursor-not-allowed'
              : `bg-${current.color}-500 hover:bg-${current.color}-600 text-white`
          }`}
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming'}
        </button>

        <button
          onClick={() => setIsStreaming(false)}
          disabled={!isStreaming}
          className="px-8 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Stop
        </button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Token-by-token rendering</li>
            <li>✓ Animated cursor</li>
            <li>✓ Multiple speed options</li>
            <li>✓ Clean and simple implementation</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Use Cases</h3>
          <ul className="space-y-2 text-sm">
            <li>→ AI chat responses</li>
            <li>→ Code generation</li>
            <li>→ Real-time updates</li>
            <li>→ Improved UX perception</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SimpleStreamingDemo
