'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Brain, Search, FileText, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR caching - revalidate every hour
export const revalidate = 3600

// Demo ThinkingIndicator component
function DemoThinkingIndicator({
  stage,
  topic,
  showProgress,
  showEstimatedTime,
  animated,
}: {
  stage: 'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
  topic?: string
  showProgress: boolean
  showEstimatedTime: boolean
  animated: boolean
}) {
  const [progress, setProgress] = React.useState(0)
  const [estimatedSeconds, setEstimatedSeconds] = React.useState(5)

  // Simulate progress
  React.useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10
        return next >= 100 ? 0 : next
      })
      setEstimatedSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [showProgress])

  const getStageIcon = () => {
    const iconProps = { className: 'w-[18px] h-[18px]', 'aria-hidden': 'true' }
    switch (stage) {
      case 'thinking':
        return <Brain {...iconProps} />
      case 'researching':
        return <Search {...iconProps} />
      case 'compiling':
        return <FileText {...iconProps} />
      case 'generating':
        return <Sparkles {...iconProps} />
      case 'finalizing':
        return <CheckCircle2 {...iconProps} />
    }
  }

  const getStageLabel = () => {
    switch (stage) {
      case 'thinking':
        return 'Thinking'
      case 'researching':
        return 'Researching'
      case 'compiling':
        return 'Compiling'
      case 'generating':
        return 'Generating'
      case 'finalizing':
        return 'Finalizing'
    }
  }

  const ariaLabel = topic
    ? `AI is ${getStageLabel().toLowerCase()}: ${topic}${showEstimatedTime && estimatedSeconds > 0 ? `, approximately ${estimatedSeconds} seconds remaining` : ''}`
    : `AI is ${getStageLabel().toLowerCase()}${showEstimatedTime && estimatedSeconds > 0 ? `, approximately ${estimatedSeconds} seconds remaining` : ''}`

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animated ? 0.3 : 0.1 }}
      className={cn(
        'flex items-center gap-3.5 rounded-2xl',
        'border border-border/30',
        'bg-gradient-to-r from-card/95 via-card to-muted/50',
        'backdrop-blur-sm',
        'px-4 py-3.5',
        'shadow-[0_4px_20px_-6px_rgba(0,0,0,0.1)]'
      )}
    >
      {/* Animated Icon with Pulse Ring */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-[32px] h-[32px]">
        {/* Pulse Ring Animation */}
        {animated && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full bg-blue-500/30"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-full bg-blue-500/20"
            />
          </>
        )}

        {/* Icon Container */}
        <motion.div
          animate={
            animated
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0],
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {}
          }
          className="relative z-10 flex items-center justify-center w-[32px] h-[32px] rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400 shadow-sm"
        >
          {getStageIcon()}
        </motion.div>
      </div>

      {/* Status Text */}
      <div className="flex-1 min-w-0">
        {/* Label and dots */}
        <div className="flex items-center">
          <span className="font-semibold text-sm leading-none">{getStageLabel()}</span>

          {/* Animated Dots */}
          {animated && (
            <div className="ml-1.5 inline-flex gap-0.5">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay,
                  }}
                  className="w-1 h-1 rounded-full bg-current"
                />
              ))}
            </div>
          )}
        </div>

        {/* Topic/Detail */}
        {topic && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animated ? 0.2 : 0.1 }}
            className="text-xs text-muted-foreground/90 mt-1 truncate"
          >
            {topic}
          </motion.p>
        )}

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted/60 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: animated ? 0.5 : 0.1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-500/80 rounded-full shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Estimated Time */}
      {showEstimatedTime && estimatedSeconds > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: animated ? 0.2 : 0.1 }}
          className="flex-shrink-0 text-xs font-medium text-muted-foreground/90 tabular-nums"
        >
          ~{estimatedSeconds}s
        </motion.span>
      )}
    </motion.div>
  )
}

export default function ThinkingIndicatorPage() {
  const [stage, setStage] = React.useState<
    'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
  >('thinking')
  const [topic, setTopic] = React.useState('Analyzing your question')
  const [showTopic, setShowTopic] = React.useState(true)
  const [showProgress, setShowProgress] = React.useState(true)
  const [showEstimatedTime, setShowEstimatedTime] = React.useState(true)
  const [animated, setAnimated] = React.useState(true)

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ThinkingIndicator</h1>
              <p className="text-sm text-muted-foreground mt-1">AI Processing Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Visual indicator for AI thinking and processing states with animated stages, progress
            tracking, and estimated completion time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-lg">
                <DemoThinkingIndicator
                  stage={stage}
                  topic={showTopic ? topic : undefined}
                  showProgress={showProgress}
                  showEstimatedTime={showEstimatedTime}
                  animated={animated}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Processing Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    ['thinking', 'researching', 'compiling', 'generating', 'finalizing'] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        stage === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Topic Text
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={!showTopic}
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm disabled:opacity-50"
                  placeholder="Enter topic description..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTopic}
                    onChange={(e) => setShowTopic(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Topic</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showProgress}
                    onChange={(e) => setShowProgress(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Progress Bar</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEstimatedTime}
                    onChange={(e) => setShowEstimatedTime(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Estimated Time</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animated}
                    onChange={(e) => setAnimated(e.target.checked)}
                    className="rounded"
                  />
                  <span>Enable Animations</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Usage</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ThinkingIndicator } from '@clarity-chat/react'

function ChatMessages() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [aiStatus, setAIStatus] = useState({
    stage: 'thinking',
    topic: 'Analyzing your question',
    startedAt: new Date()
  })

  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      {isProcessing && <ThinkingIndicator status={aiStatus} />}
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Progress Tracking</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ThinkingIndicator
  status={{
    stage: 'generating',
    topic: 'Composing response',
    progress: 0.65,
    startedAt: new Date(),
    estimatedCompletion: new Date(Date.now() + 5000)
  }}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Different Stages</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// Researching stage
<ThinkingIndicator
  status={{
    stage: 'researching',
    topic: 'Searching knowledge base',
    progress: 0.3,
    startedAt: new Date()
  }}
/>

// Finalizing stage
<ThinkingIndicator
  status={{
    stage: 'finalizing',
    topic: 'Final formatting',
    progress: 0.95,
    startedAt: new Date()
  }}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Minimal Usage</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// Simplest form - just the stage
<ThinkingIndicator
  status={{
    stage: 'thinking',
    startedAt: new Date()
  }}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">AIStatus</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    AI processing status object
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status.stage</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Current processing stage
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status.topic</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">undefined</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Description of what is being processed
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status.progress</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">undefined</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Progress percentage (0-1, e.g., 0.65 for 65%)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status.startedAt</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">Date</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">When processing started</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status.estimatedCompletion</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">Date</td>
                  <td className="py-3 px-4 text-muted-foreground">undefined</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Expected completion time
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">undefined</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Multi-Stage Processing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Five distinct stages (thinking, researching, compiling, generating, finalizing)
                with unique icons and visual indicators
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Smooth Animations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Pulsing rings, rotating icons, animated dots, and smooth transitions with
                reduced-motion support
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="font-semibold">Progress Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Optional progress bar with smooth animations and estimated completion time display
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <h3 className="font-semibold">Fully Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with proper ARIA attributes, live regions, and descriptive
                labels for screen readers
              </p>
            </div>
          </div>
        </section>

        {/* Processing Stages */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Processing Stages</h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">Thinking</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Initial processing and understanding of the user's request
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">Researching</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Gathering additional information from knowledge bases, documents, or the web
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">Compiling</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Organizing and structuring the gathered information into a coherent response
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">Generating</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Creating the actual response content with proper formatting and context
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">Finalizing</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Final formatting, quality checks, and preparing the response for delivery
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Best Practices</h2>

          <div className="rounded-lg border border-border/50 bg-card p-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Update in real-time:</strong> Update the
                  status object as the AI progresses through different stages
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Provide context:</strong> Use the topic field
                  to give users meaningful information about what's happening
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Show progress:</strong> For long-running
                  operations, include progress percentage and estimated completion time
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Match your workflow:</strong> Use appropriate
                  stages that reflect your actual AI processing pipeline
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Clean up:</strong> Remove the indicator when
                  AI processing completes to avoid confusion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Respect preferences:</strong> The component
                  automatically respects user's reduced-motion preferences
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">
                Display AI responses with typewriter effect
              </p>
            </Link>

            <Link
              href="/reference/components/typing-indicator"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">TypingIndicator</h3>
              <p className="text-sm text-muted-foreground">
                Simple typing animation for chat interfaces
              </p>
            </Link>

            <Link
              href="/reference/components/streaming-progress"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingProgress</h3>
              <p className="text-sm text-muted-foreground">
                Progress tracking for streaming responses
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
