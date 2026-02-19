'use client'

import { durations } from '@/lib/animations'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Package,
  Code,
  Palette,
  ArrowRight,
  Check,
  Copy,
  Terminal,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  code: string
  language: string
}

const steps: Step[] = [
  {
    id: 1,
    title: 'One-Line Install',
    description:
      'Add Clarity Chat to your React project with a single command.',
    icon: <Package className="w-5 h-5" />,
    code: `# Coming Soon — Join the waitlist at clarity-chat.dev/waitlist
npm install @clarity-chat/react`,
    language: 'bash',
  },
  {
    id: 2,
    title: 'Import & Build',
    description: 'Robust chat with built-in Token Optimization.',
    icon: <Code className="w-5 h-5" />,
    code: `import { ChatWindow, useClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    // Token Optimization: 90% cost reduction built-in
    tokenOptimization: true,
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}`,
    language: 'tsx',
  },
  {
    id: 3,
    title: 'Customize & Ship',
    description: 'Themes, streaming, and advanced features out of the box.',
    icon: <Palette className="w-5 h-5" />,
    code: `<ChatWindow
  {...chat}
  theme="modern-dark"
  features={{
    streaming: true,
    codeHighlighting: true,
    tokenOptimization: true, // Reduce API costs by 90%
    fileUploads: true,
  }}
/>`,
    language: 'tsx',
  },
]

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }, [code])

  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/[0.08] bg-[#011627] shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25),0_8px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25),0_8px_16px_rgba(0,0,0,0.2),0_0_30px_rgba(129,140,248,0.15)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#011627] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">{language}</span>
        </div>
        <motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <pre
        className="p-4 overflow-x-auto rounded-b-lg"
        style={{ backgroundColor: 'var(--color-code-bg)', margin: 0, border: 'none' }}
      >
        <code className="text-sm font-mono text-slate-100 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}

export function QuickStartTutorial() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <section className="py-20 bg-bg-secondary/30 overflow-x-hidden relative">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-15 pointer-events-none"
        aria-hidden="true"
      />
      {/* Radial gradient accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="container-docs relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-brand-600 bg-brand-100 dark:bg-brand-900 dark:text-brand-300 rounded-full mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Preview — Coming Soon
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ship in <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">3 Simple Steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            From zero to production chat with{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Token Optimization</span>{' '}
            built in. Reduce your API costs by 90%.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start max-w-full overflow-hidden">
          {/* Step Navigation */}
          <div className="space-y-4 overflow-hidden">
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'group/step w-full max-w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-4 min-h-[72px] rounded-xl text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none overflow-hidden relative',
                  activeStep === step.id
                    ? 'bg-bg-primary border-2 border-transparent shadow-lg shadow-brand-500/10'
                    : 'bg-bg-primary/50 border-2 border-transparent hover:border-border hover:bg-bg-primary'
                )}
                aria-pressed={activeStep === step.id}
              >
                {/* Gradient border for active step */}
                {activeStep === step.id && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      padding: '2px',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(139,92,246,0.6) 50%, rgba(244,114,182,0.7) 100%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    activeStep === step.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-bg-tertiary text-text-secondary'
                  )}
                >
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wide',
                        activeStep === step.id
                          ? 'text-brand-500'
                          : 'text-text-tertiary'
                      )}
                    >
                      Step {step.id}
                    </span>
                    {activeStep === step.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"
                      />
                    )}
                  </div>
                  <h3
                    className={cn(
                      'font-semibold mb-1 transition-colors truncate',
                      activeStep === step.id
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-tertiary line-clamp-2">
                    {step.description}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    'w-5 h-5 flex-shrink-0 mt-2.5 transition-all',
                    activeStep === step.id
                      ? 'text-brand-500 translate-x-1'
                      : 'text-text-tertiary'
                  )}
                />
              </motion.button>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Link
                href="/get-started/quick-start"
                className="group inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                View full documentation
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-24 min-w-0 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {steps.map(
                (step) =>
                  activeStep === step.id && (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: durations.normal }}
                    >
                      <CodeBlock code={step.code} language={step.language} />
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-3 mt-4" role="tablist" aria-label="Tutorial steps">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                    activeStep === step.id
                      ? 'bg-brand-500'
                      : 'bg-transparent hover:bg-bg-tertiary'
                  )}
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                  aria-selected={activeStep === step.id}
                  role="tab"
                >
                  <span
                    className={cn(
                      'block rounded-full transition-all',
                      activeStep === step.id
                        ? 'w-6 h-2 bg-white'
                        : 'w-2 h-2 bg-border'
                    )}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
