'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Play,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Code2,
  Copy,
  Check,
  Loader2,
  ImageIcon,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'

type StreamingPhase =
  | 'idle'
  | 'sending'
  | 'thinking'
  | 'streaming-text'
  | 'streaming-code'
  | 'loading-image'
  | 'complete'

interface PhaseInfo {
  label: string
  description: string
  color: string
}

const phases: Record<StreamingPhase, PhaseInfo> = {
  idle: {
    label: 'Idle',
    description: 'Waiting for user input',
    color: 'bg-gray-500',
  },
  sending: {
    label: 'Sending',
    description: 'Message being sent to server',
    color: 'bg-blue-500',
  },
  thinking: {
    label: 'Thinking',
    description: 'AI processing with subtle animation',
    color: 'bg-purple-500',
  },
  'streaming-text': {
    label: 'Streaming Text',
    description: 'Character-by-character rendering',
    color: 'bg-green-500',
  },
  'streaming-code': {
    label: 'Streaming Code',
    description: 'Syntax highlighting as it streams',
    color: 'bg-orange-500',
  },
  'loading-image': {
    label: 'Loading Image',
    description: 'Skeleton state while image loads',
    color: 'bg-pink-500',
  },
  complete: {
    label: 'Complete',
    description: 'Final state with actions visible',
    color: 'bg-emerald-500',
  },
}

const demoText = `Here's a great example of how Clarity Chat handles streaming! Notice how the text flows naturally, character by character, creating a smooth reading experience.

The streaming is optimized to feel natural - not too fast, not too slow. Each character arrives with perfect timing.`

const demoCode = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10)); // Output: 55`

export default function StreamingStatesDemo() {
  const [phase, setPhase] = useState<StreamingPhase>('idle')
  const [streamedText, setStreamedText] = useState('')
  const [streamedCode, setStreamedCode] = useState('')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const cancelRef = useRef(false)

  const resetDemo = () => {
    cancelRef.current = true
    setPhase('idle')
    setStreamedText('')
    setStreamedCode('')
    setShowImage(false)
    setShowActions(false)
    setIsAutoPlaying(false)
    setTimeout(() => {
      cancelRef.current = false
    }, 100)
  }

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const streamText = async (text: string, setter: (s: string) => void) => {
    let current = ''
    for (const char of text) {
      if (cancelRef.current) return
      current += char
      setter(current)
      await sleep(15 + Math.random() * 10)
    }
  }

  const runDemo = async () => {
    if (isAutoPlaying) return
    setIsAutoPlaying(true)
    cancelRef.current = false

    // Phase 1: Sending
    setPhase('sending')
    await sleep(500)
    if (cancelRef.current) return

    // Phase 2: Thinking
    setPhase('thinking')
    await sleep(1500)
    if (cancelRef.current) return

    // Phase 3: Streaming text
    setPhase('streaming-text')
    await streamText(demoText, setStreamedText)
    if (cancelRef.current) return
    await sleep(300)

    // Phase 4: Streaming code
    setPhase('streaming-code')
    await streamText(demoCode, setStreamedCode)
    if (cancelRef.current) return
    await sleep(300)

    // Phase 5: Loading image
    setPhase('loading-image')
    await sleep(1200)
    if (cancelRef.current) return
    setShowImage(true)
    await sleep(500)

    // Phase 6: Complete
    setPhase('complete')
    setShowActions(true)
    setIsAutoPlaying(false)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(demoCode)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = demoCode
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container-docs py-12">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Streaming Showcase
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Art of{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Streaming States
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Watch the complete streaming lifecycle: thinking indicators, character-by-character text,
              live syntax highlighting, and polished transitions.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Phase Indicator */}
          <ScrollReveal delay={0.1}>
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <h3 className="font-bold text-lg mb-4">Streaming Phases</h3>
                {Object.entries(phases).map(([key, info]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      phase === key
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                        : 'border-transparent bg-bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${info.color} ${
                        phase === key ? 'animate-pulse' : ''
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{info.label}</div>
                        <div className="text-xs text-text-secondary">{info.description}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Controls */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={runDemo}
                    disabled={isAutoPlaying}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isAutoPlaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Demo
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetDemo}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Chat Demo */}
          <ScrollReveal delay={0.2}>
            <div className="lg:col-span-2">
              <div className="rounded-2xl border-2 border-border shadow-2xl overflow-hidden bg-bg-primary">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Streaming Demo</div>
                        <div className="text-xs opacity-90">
                          Current phase: {phases[phase].label}
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${phases[phase].color} animate-pulse`} />
                  </div>
                </div>

                {/* Messages Area */}
                <div className="p-6 min-h-[500px] space-y-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
                  {/* User Message */}
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 bg-brand-500 text-white">
                      <p className="text-sm">Show me how streaming works with code and images!</p>
                    </div>
                  </div>

                  {/* Sending Indicator */}
                  <AnimatePresence>
                    {phase === 'sending' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending message...
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bot Response */}
                  {phase !== 'idle' && phase !== 'sending' && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        {/* Thinking State */}
                        <AnimatePresence>
                          {phase === 'thinking' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 inline-block"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="w-2 h-2 rounded-full bg-green-500"
                                      animate={{
                                        y: [0, -6, 0],
                                      }}
                                      transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-text-secondary ml-1">Thinking...</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Streamed Text */}
                        {streamedText && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-bg-secondary rounded-2xl rounded-tl-sm px-4 py-3"
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {streamedText}
                              {phase === 'streaming-text' && (
                                <span className="inline-block w-0.5 h-4 ml-0.5 bg-green-500 animate-pulse" />
                              )}
                            </p>
                          </motion.div>
                        )}

                        {/* Streamed Code */}
                        {(streamedCode || phase === 'streaming-code') && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl overflow-hidden border border-border"
                          >
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400 font-mono">typescript</span>
                              </div>
                              {showActions && (
                                <button
                                  onClick={copyCode}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                >
                                  {copied ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              )}
                            </div>
                            <pre className="p-4 bg-gray-900 text-sm font-mono overflow-x-auto">
                              <code className="text-gray-300">
                                {streamedCode}
                                {phase === 'streaming-code' && (
                                  <span className="inline-block w-0.5 h-4 bg-orange-500 animate-pulse" />
                                )}
                              </code>
                            </pre>
                          </motion.div>
                        )}

                        {/* Image Loading */}
                        {(phase === 'loading-image' || showImage) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl overflow-hidden border border-border"
                          >
                            {!showImage ? (
                              <div className="h-48 bg-bg-secondary animate-pulse flex items-center justify-center">
                                <div className="text-center">
                                  <ImageIcon className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                                  <span className="text-sm text-text-secondary">Loading image...</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
                                <div className="text-center">
                                  <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                    Generated visualization
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Action Buttons */}
                        <AnimatePresence>
                          {showActions && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2"
                            >
                              <button className="px-3 py-1.5 text-xs bg-bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                              <button className="px-3 py-1.5 text-xs bg-bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
                                <RotateCcw className="w-3 h-3" />
                                Regenerate
                              </button>
                              <button className="px-3 py-1.5 text-xs bg-bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                👍
                              </button>
                              <button className="px-3 py-1.5 text-xs bg-bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                👎
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Idle State */}
                  {phase === 'idle' && (
                    <div className="flex items-center justify-center h-64 text-text-secondary">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Click "Run Demo" to see the streaming lifecycle</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Character-by-Character',
                description: 'Text streams smoothly with natural timing, not chunky blocks',
              },
              {
                title: 'Live Syntax Highlighting',
                description: 'Code is highlighted as it streams, not after completion',
              },
              {
                title: 'Skeleton States',
                description: 'Images and media show loading states that feel native',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-bg-secondary"
              >
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/streaming"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Streaming Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
