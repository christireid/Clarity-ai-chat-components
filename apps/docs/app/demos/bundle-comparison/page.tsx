'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  ChevronLeft,
  ArrowRight,
  Check,
  Sparkles,
  Download,
  Zap,
  TreeDeciduous as Trees,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { durations } from '@/lib/animations'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { trackDemoViewed } from '@/lib/demos/analytics'

interface BundleInfo {
  name: string
  size: number
  gzipped: number
  color: string
  features: string[]
}

const competitors: BundleInfo[] = [
  {
    name: 'Competitor A',
    size: 156,
    gzipped: 48,
    color: 'bg-red-500',
    features: ['Basic chat', 'Markdown', 'Theming'],
  },
  {
    name: 'Competitor B',
    size: 89,
    gzipped: 28,
    color: 'bg-orange-500',
    features: ['Chat UI', 'Streaming', 'Basic hooks'],
  },
  {
    name: 'Clarity Chat',
    size: 27,
    gzipped: 8.5,
    color: 'bg-green-500',
    features: [
      '200+ components',
      '95+ hooks',
      'Memory',
      'Streaming',
      'Full theming',
      'Accessibility',
    ],
  },
]

interface TreeShakeExample {
  name: string
  code: string
  size: string
  savings: string
}

const treeShakeExamples: TreeShakeExample[] = [
  {
    name: 'Full Library',
    code: `import { ClarityChat } from '@clarity-chat/react'`,
    size: '27KB',
    savings: '-',
  },
  {
    name: 'Just the Hook',
    code: `import { useClarityChat } from '@clarity-chat/react'`,
    size: '8KB',
    savings: '70% smaller',
  },
  {
    name: 'Core Components Only',
    code: `import { ChatWindow, Message } from '@clarity-chat/react'`,
    size: '12KB',
    savings: '56% smaller',
  },
  {
    name: 'Minimal Setup',
    code: `import { useChat } from '@clarity-chat/react/hooks'`,
    size: '4KB',
    savings: '85% smaller',
  },
]

export default function BundleComparisonDemo() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [selectedTreeShake, setSelectedTreeShake] = useState(0)
  const [runAnimation, setRunAnimation] = useState(false)

  // Track demo view
  useEffect(() => {
    trackDemoViewed('bundle-comparison')
  }, [])

  useEffect(() => {
    // Auto-run animation on mount
    const timer = setTimeout(() => {
      setRunAnimation(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (runAnimation) {
      const timer = setTimeout(() => {
        setAnimationComplete(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [runAnimation])

  const restartAnimation = () => {
    setRunAnimation(false)
    setAnimationComplete(false)
    setShowConfetti(false)
    setTimeout(() => setRunAnimation(true), 100)
  }

  const maxSize = Math.max(...competitors.map((c) => c.size))

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              Performance Comparison
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bundle Size{' '}
              <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                Comparison
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              See how Clarity Chat compares to competitors. Smaller bundles mean
              faster load times and better user experience.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Comparison Chart */}
        <ScrollReveal delay={0.1}>
          <div className="p-8 rounded-2xl bg-bg-secondary border border-border mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Bundle Size Comparison</h2>
              <button
                onClick={restartAnimation}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Replay Animation
              </button>
            </div>

            <div className="space-y-6 relative">
              {/* Confetti */}
              <AnimatePresence>
                {showConfetti && (
                  <>
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: '50%',
                          y: 200,
                          opacity: 1,
                          scale: 1,
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: -100,
                          opacity: 0,
                          scale: 0,
                          rotate: Math.random() * 360,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          ease: 'easeOut',
                        }}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${Math.random() * 100}%`,
                        }}
                      >
                        <Sparkles
                          className={`w-6 h-6 ${
                            [
                              'text-yellow-400',
                              'text-green-400',
                              'text-blue-400',
                              'text-pink-400',
                            ][Math.floor(Math.random() * 4)]
                          }`}
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>

              {competitors.map((lib, idx) => {
                const isClarity = lib.name === 'Clarity Chat'
                const widthPercentage = (lib.size / maxSize) * 100

                return (
                  <div key={lib.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-semibold ${isClarity ? 'text-green-600 dark:text-green-400' : ''}`}
                        >
                          {lib.name}
                        </span>
                        {isClarity && animationComplete && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium"
                          >
                            Winner!
                          </motion.span>
                        )}
                      </div>
                      <span className="text-text-secondary text-sm">
                        {lib.size}KB (gzip: {lib.gzipped}KB)
                      </span>
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      <motion.div
                        className={`h-full ${lib.color} rounded-lg flex items-center justify-end px-4`}
                        initial={{ width: 0 }}
                        animate={{
                          width: runAnimation ? `${widthPercentage}%` : 0,
                        }}
                        transition={{
                          duration: durations.slower,
                          delay: idx * 0.3,
                          ease: 'easeOut',
                        }}
                      >
                        <span className="text-white font-bold text-lg">
                          {lib.size}KB
                        </span>
                      </motion.div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lib.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Savings Highlight */}
            <AnimatePresence>
              {animationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        83% Smaller Than Competitor A
                      </div>
                      <div className="text-text-secondary">
                        With 3x more features included
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          27KB
                        </div>
                        <div className="text-xs text-text-secondary">
                          Minified
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          8.5KB
                        </div>
                        <div className="text-xs text-text-secondary">
                          Gzipped
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Tree Shaking Demo */}
        <ScrollReveal delay={0.2}>
          <div className="p-8 rounded-2xl bg-bg-secondary border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <Trees className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tree Shaking in Action</h2>
                <p className="text-text-secondary">Import only what you need</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Import Options */}
              <div className="space-y-3">
                {treeShakeExamples.map((example, idx) => (
                  <button
                    key={example.name}
                    onClick={() => setSelectedTreeShake(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedTreeShake === idx
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950'
                        : 'border-transparent bg-bg-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{example.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{example.size}</span>
                        {example.savings !== '-' && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                            {example.savings}
                          </span>
                        )}
                      </div>
                    </div>
                    <code className="text-xs text-text-secondary font-mono block truncate">
                      {example.code}
                    </code>
                  </button>
                ))}
              </div>

              {/* Visual Representation */}
              <div className="flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-sky-600 dark:text-sky-400">
                    {treeShakeExamples[selectedTreeShake].size}
                  </div>
                  <div className="text-text-secondary">Final bundle size</div>
                </div>

                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{
                      width: `${(parseFloat(treeShakeExamples[selectedTreeShake].size) / 27) * 100}%`,
                    }}
                    transition={{ duration: durations.slow }}
                  />
                </div>

                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>0KB</span>
                  <span>27KB (Full)</span>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gray-900 font-mono text-sm">
                  <code className="text-green-400">
                    {treeShakeExamples[selectedTreeShake].code}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Performance Benefits */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Faster Load Times',
                description: '27KB loads in under 50ms on 3G networks',
                stat: '<50ms',
              },
              {
                icon: Download,
                title: 'Less Data Transfer',
                description:
                  'Save bandwidth costs and improve mobile experience',
                stat: '8.5KB',
              },
              {
                icon: Check,
                title: 'Better Lighthouse Score',
                description: 'Smaller bundles mean better performance scores',
                stat: '95+',
              },
            ].map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="p-6 rounded-xl border border-border bg-bg-secondary"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-2">
                    {benefit.stat}
                  </div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/performance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Performance Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
