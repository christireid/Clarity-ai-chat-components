'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  Brain,
  Coins,
  Puzzle,
  Gauge,
  Cpu,
  Users,
  Lock,
} from 'lucide-react'
import { durations } from '@/lib/constants'
import TokenSavingsCalculator from '../ui/TokenSavingsCalculator'
import SpotlightCard from '../ui/SpotlightCard'

const features = [
  {
    name: 'Never Locked In',
    description:
      'Switch between OpenAI, Claude, and Gemini in one line of code. No vendor lock-in, no rewrites.',
    icon: Globe,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    name: 'Users Love It',
    description:
      'Real-time streaming responses that feel instant. No loading spinners, no waiting.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    name: 'Conversations That Remember',
    description:
      'Your AI remembers context without blowing up your token budget. Smart memory that just works.',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    name: 'Cut API Bills 40%',
    description:
      'Stop overpaying for tokens. Our KV-cache optimization saves you money on every message.',
    icon: Coins,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    name: 'Build Any Chat UI',
    description:
      'Mix and match 50+ components. From simple chatbots to complex multi-agent dashboards.',
    icon: Puzzle,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  {
    name: 'Ship With Confidence',
    description:
      'Full TypeScript strict mode. Catch bugs at compile time, not in production.',
    icon: Cpu,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    name: 'Let AI Do More',
    description:
      'Function calling, tool use, and multi-agent workflows built in. Extend what your AI can do.',
    icon: Users,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    name: 'Blazing Fast',
    description:
      '27KB gzipped. Edge-ready with sub-50ms cold starts. Your users will notice the speed.',
    icon: Gauge,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
]

const highlights = [
  {
    title: 'Ship 10x Faster',
    description:
      'Stop reinventing chat wheels. Intuitive APIs and copy-paste examples get you from zero to production in hours.',
    icon: Sparkles,
    gradient: 'from-clarity-500 to-cosmic-500',
  },
  {
    title: 'Sleep Soundly',
    description:
      'Battle-tested by real companies processing millions of messages. Strict TypeScript. Full test coverage.',
    icon: Shield,
    gradient: 'from-cosmic-500 to-pink-500',
  },
  {
    title: 'Scale Without Fear',
    description:
      'SSO, RBAC, audit logging, and SOC 2 compliance support. Everything enterprises demand, built in.',
    icon: Lock,
    gradient: 'from-pink-500 to-clarity-500',
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: durations.slow, delay: index * 0.1 }}
    >
      <SpotlightCard className={`h-full p-6 border ${feature.borderColor} transition-all duration-300`}>
        <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
          <Icon className={`w-6 h-6 ${feature.color}`} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {feature.description}
        </p>
      </SpotlightCard>
    </motion.div>
  )
}

function HighlightCard({
  highlight,
  index,
}: {
  highlight: (typeof highlights)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = highlight.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
      }
      transition={{ duration: durations.slow, delay: index * 0.15 }}
      className="relative group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${highlight.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}
      />
      <div className="relative glass-card p-8 border border-white/10 hover:border-white/20 transition-all">
        <div
          className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${highlight.gradient} mb-6`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          {highlight.title}
        </h3>
        <p className="text-gray-300 leading-relaxed">{highlight.description}</p>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-surface-950">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" />

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
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Teams Choose
            <span className="gradient-text"> Clarity Chat</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to build world-class AI chat. Nothing you
            don&apos;t.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, i) => (
            <FeatureCard key={feature.name} feature={feature} index={i} />
          ))}
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, i) => (
            <HighlightCard
              key={highlight.title}
              highlight={highlight}
              index={i}
            />
          ))}
        </div>
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: durations.slow }}
          className="mt-32 max-w-4xl mx-auto"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Stop Burning Tokens 🔥
                </h2>
                <p className="text-gray-400">
                    See how much Clarity Cache could save you.
                </p>
            </div>
            <TokenSavingsCalculator />
        </motion.div>
      </div>
    </section>
  )
}
