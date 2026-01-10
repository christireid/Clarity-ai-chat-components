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
    title: 'Install the Package',
    description:
      'Add Clarity Chat to your React project with a single command.',
    icon: <Package className="w-5 h-5" />,
    code: 'npm install @clarity-chat/react',
    language: 'bash',
  },
  {
    id: 2,
    title: 'Import & Use',
    description: 'Import components and build your chat UI in minutes.',
    icon: <Code className="w-5 h-5" />,
    code: `import { ChatWindow, useChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const chat = useChat({
    apiEndpoint: '/api/chat'
  })

  return <ChatWindow {...chat} />
}`,
    language: 'tsx',
  },
  {
    id: 3,
    title: 'Customize & Ship',
    description: 'Apply themes, add features, and deploy your AI chat.',
    icon: <Palette className="w-5 h-5" />,
    code: `<ChatWindow
  {...chat}
  theme="modern-dark"
  features={{
    streaming: true,
    codeHighlighting: true,
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
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 dark:border-slate-600">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-600">
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
    <section className="py-20 bg-bg-secondary/30">
      <div className="container-docs">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 text-sm font-medium text-brand-600 bg-brand-100 dark:bg-brand-900 dark:text-brand-300 rounded-full mb-4"
          >
            Quick Start
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Up and Running in <span className="text-brand-500">3 Steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Get from zero to a fully functional AI chat interface in under 5
            minutes.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Step Navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'w-full flex items-start gap-4 p-4 min-h-[72px] rounded-xl text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeStep === step.id
                    ? 'bg-bg-primary border-2 border-brand-500 shadow-lg shadow-brand-500/10'
                    : 'bg-bg-primary/50 border-2 border-transparent hover:border-border hover:bg-bg-primary'
                )}
                aria-pressed={activeStep === step.id}
              >
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
                <div className="flex-1 min-w-0">
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
                        className="w-1.5 h-1.5 rounded-full bg-brand-500"
                      />
                    )}
                  </div>
                  <h3
                    className={cn(
                      'font-semibold mb-1 transition-colors',
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
                href="/learn/quick-start"
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
            className="sticky top-24"
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
