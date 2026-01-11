'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Sparkles, Code, Zap, ArrowRight } from 'lucide-react'
import { durations } from '@/lib/constants'
import {
  fadeInUp,
  reducedMotionConfig,
} from '@/lib/animations'

const steps = [
  {
    number: '01',
    title: 'Install',
    description:
      'Add to your React project with npm or scaffold a new project with our CLI.',
    icon: Sparkles,
    code: `npm install @clarity-chat/react
# or scaffold a new project
npx create-clarity-chat@latest`,
  },
  {
    number: '02',
    title: 'Import & Configure',
    description:
      'Import the components you need. Configure your AI provider with a single prop.',
    icon: Code,
    code: `import { ClarityChat } from '@clarity-chat/react'

export default function Chat() {
  return (
    <ClarityChat
      provider="openai"
      model="gpt-4"
      apiKey={process.env.OPENAI_API_KEY}
    />
  )
}`,
  },
  {
    number: '03',
    title: 'Customize & Ship',
    description:
      'Style with Tailwind, add memory hooks, enable token tracking. Deploy when ready.',
    icon: Zap,
    code: `<ClarityChat
  provider="anthropic"
  model="claude-3-sonnet"
  className="h-screen"
  memory={{ strategy: 'window', maxTokens: 4000 }}
  tokenTracking={{ enabled: true }}
/>`,
  },
]

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()
  const Icon = step.icon

  const motionProps = shouldReduceMotion
    ? { style: { opacity: 1, y: 0 } }
    : {
        variants: fadeInUp,
        initial: 'hidden',
        animate: isInView ? 'visible' : 'hidden',
        transition: { delay: index * 0.15 },
      }

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      className="relative"
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-clarity-500/50 to-transparent" />
      )}

      <div className="glass-card p-6 border border-white/10 rounded-xl h-full">
        {/* Step number and icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-clarity-500 to-cosmic-500 text-white font-bold">
            {step.number}
          </div>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-clarity-400" />
            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-4">{step.description}</p>

        {/* Code block */}
        <pre className="bg-surface-950 rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-clarity-400 font-mono whitespace-pre">
            {step.code}
          </code>
        </pre>
      </div>
    </motion.div>
  )
}

/**
 * Three-step guide showing the developer journey from install to ship.
 * Displays code examples for each step with animated cards.
 */
export default function HowItWorksSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()

  const headerMotionProps = shouldReduceMotion
    ? { style: { opacity: 1, y: 0 } }
    : {
        variants: fadeInUp,
        initial: 'hidden',
        animate: isHeaderInView ? 'visible' : 'hidden',
      }

  const ctaMotionProps = shouldReduceMotion
    ? { style: { opacity: 1, y: 0 } }
    : {
        variants: fadeInUp,
        ...reducedMotionConfig,
        transition: { delay: 0.3 },
      }

  return (
    <section className="relative py-24 sm:py-32 bg-surface-900">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          {...headerMotionProps}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Steps to
            <span className="gradient-text"> AI Chat</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From install to production in minutes. No complex setup required.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          {...ctaMotionProps}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-clarity-400 hover:text-clarity-300 font-medium transition-colors"
          >
            View full documentation on GitHub
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
