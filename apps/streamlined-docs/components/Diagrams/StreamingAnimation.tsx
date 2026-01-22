/**
 * Streaming Animation
 * 
 * Real-time visualization of token-by-token streaming
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Zap, Cloud } from 'lucide-react'

export function StreamingAnimation() {
  const fullText = "Hello! I'm streaming this response token by token..."
  const [displayedText, setDisplayedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isStreaming && displayedText.length < fullText.length) {
      interval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length >= fullText.length) {
            setIsStreaming(false)
            return prev
          }
          return fullText.slice(0, prev.length + 1)
        })
      }, 50)
    }

    return () => clearInterval(interval)
  }, [isStreaming, displayedText])

  const startStreaming = () => {
    setDisplayedText('')
    setIsStreaming(true)
  }

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Real-Time Streaming
          </span>
        </h3>

        {/* Streaming Visualization */}
        <div className="grid md:grid-cols-[1fr_auto_2fr] gap-6 items-center">
          {/* Server */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-xl">
              <Cloud className="w-10 h-10" />
            </div>
            <div className="mt-3 font-semibold text-sm">OpenAI API</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Generating</div>
            
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2"
              >
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Streaming Flow */}
          <div className="flex flex-col items-center gap-2">
            <motion.svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Base arrow */}
              <path
                d="M 10 30 L 100 30"
                stroke="url(#stream-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M 96 26 L 108 30 L 96 34" fill="#10b981" opacity="0.8" />
              
              {/* Flowing particles */}
              <AnimatePresence>
                {isStreaming && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.circle
                        key={i}
                        r="4"
                        fill="#10b981"
                        initial={{ cx: 10, cy: 30, opacity: 0 }}
                        animate={{
                          cx: 100,
                          cy: 30,
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: 'linear',
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.svg>
            
            <div className="text-xs font-medium text-green-600 dark:text-green-400">
              {isStreaming ? 'Streaming...' : 'SSE/WebSocket'}
            </div>
          </div>

          {/* Client */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg min-h-[140px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                  AI
                </div>
                <div className="font-semibold text-sm">Assistant</div>
              </div>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 min-h-[60px]">
                {displayedText}
                {isStreaming && (
                  <motion.span
                    className="inline-block w-1.5 h-4 bg-blue-600 ml-0.5"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400">
              User sees tokens instantly
            </div>
          </motion.div>
        </div>

        {/* Control */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={startStreaming}
            disabled={isStreaming}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {isStreaming ? 'Streaming...' : 'Play Demo'}
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Instant feedback', value: '< 100ms', color: 'text-blue-600' },
            { label: 'No waiting', value: '0s delay', color: 'text-green-600' },
            { label: 'Better UX', value: '+40%', color: 'text-purple-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + index * 0.1 }}
              className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

