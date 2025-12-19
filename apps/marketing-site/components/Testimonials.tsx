'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import {
  Github,
  Puzzle,
  Code,
  Users,
  Star,
  Sparkles,
  Cpu,
  Shield,
} from 'lucide-react'
import { durations } from '@/lib/constants'
import Link from 'next/link'

// Verifiable metrics - these can be confirmed by visiting the repo/npm
const metrics = [
  {
    icon: Cpu,
    value: '170+',
    label: 'React Components',
    description: 'Production-ready, fully typed',
    verifiable: 'Browse in packages/react/src/components',
    gradient: 'from-clarity-500 to-cyan-500',
  },
  {
    icon: Code,
    value: '100%',
    label: 'TypeScript',
    description: 'Strict mode, zero any',
    verifiable: 'Check tsconfig.json',
    gradient: 'from-cosmic-500 to-purple-500',
  },
  {
    icon: Shield,
    value: 'MIT',
    label: 'Open Source',
    description: 'Use it however you want',
    verifiable: 'See LICENSE file',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Puzzle,
    value: '27KB',
    label: 'Gzipped Bundle',
    description: 'Tree-shakeable, no bloat',
    verifiable: 'Check npm package size',
    gradient: 'from-green-500 to-emerald-500',
  },
]

const features = [
  {
    title: 'Multi-Provider Support',
    description:
      'Switch between OpenAI, Anthropic, and Google AI with a single prop change. No rewrites needed.',
    code: `<ClarityChat
  provider="anthropic" // or "openai" | "google"
  model="claude-3-sonnet"
/>`,
  },
  {
    title: 'Token Optimization Built-In',
    description:
      'KV-cache integration reduces repeated context tokens. See exactly how much you save.',
    code: `import { useTokenBudget } from '@clarity-chat/react'

const { savings, usage } = useTokenBudget()
// savings.percentage = 38.5%`,
  },
  {
    title: 'Enterprise-Ready',
    description:
      'SSO, RBAC, audit logging, and SOC 2 compliance support included in Enterprise tier.',
    code: `<ClarityChat
  auth={{ sso: true, provider: 'okta' }}
  audit={{ enabled: true, destination: 's3' }}
/>`,
  },
]

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof metrics)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = metric.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: durations.slow, delay: index * 0.1 }}
      className="relative group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      />

      <div className="relative glass-card p-6 border border-white/10 hover:border-white/20 transition-all h-full flex flex-col items-center text-center">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${metric.gradient} mb-4`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div
          className={`text-4xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-1`}
        >
          {metric.value}
        </div>

        <div className="font-semibold text-white mb-2">{metric.label}</div>
        <p className="text-gray-400 text-sm">{metric.description}</p>
      </div>
    </motion.div>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: durations.slow, delay: index * 0.15 }}
      className="glass-card p-6 border border-white/10 rounded-xl"
    >
      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
      <p className="text-gray-400 mb-4">{feature.description}</p>
      <pre className="bg-surface-950 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-clarity-400 font-mono">
          {feature.code}
        </code>
      </pre>
    </motion.div>
  )
}

export default function Testimonials() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 bg-surface-950"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-clarity-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: durations.slow }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4">
            Built for Developers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Open Source.
            <span className="gradient-text"> Verifiable.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            No marketing fluff. Every claim is verifiable in our public GitHub
            repository. Check the code yourself.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: durations.slow }}
          className="text-center mb-20"
        >
          <Link
            href="https://github.com/christireid/Clarity-ai-chat-components"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-surface-800 border border-white/10 hover:border-white/20 transition-all group"
          >
            <Github className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="text-white font-semibold">Browse the Source</div>
              <div className="text-sm text-gray-400">
                MIT Licensed &middot; Fork it, extend it, ship it
              </div>
            </div>
            <Star className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
          </Link>
        </motion.div>

        {/* Code examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: durations.slow }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            See What You Get
          </h3>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Early Adopter Program */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: durations.slow }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-clarity-500/10 to-cosmic-500/10 border border-white/10">
            <Sparkles className="w-8 h-8 text-clarity-400" />
            <div className="text-left">
              <div className="text-white font-semibold">Join our community</div>
              <div className="text-sm text-gray-400">
                Get help, share feedback, and help shape the roadmap
              </div>
            </div>
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              GitHub Discussions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
