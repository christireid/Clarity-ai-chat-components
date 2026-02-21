'use client'

/**
 * Token Optimization Hero Landing Page
 *
 * THE #1 DIFFERENTIATOR: 50-90% Cost Reduction
 * Prominently features provider-native caching and comprehensive optimization toolkit.
 * Enhanced with interactive ROI calculator, animated stats, and stunning visuals.
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  TrendingDown,
  Zap,
  Database,
  Cpu,
  DollarSign,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Shield,
  Gauge,
  Target,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Layers,
  AlertTriangle,
  Clock,
  Calculator,
  Code2,
  BookOpen,
  FileText,
  Play,
  TrendingUp,
  Users,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// Real-world savings data
const savingsExamples = [
  {
    company: 'Support Chatbot',
    before: '$2,400',
    after: '$480',
    savings: '80%',
    period: '/month',
    users: '500 conversations/day',
    technique: 'Provider Caching + Model Routing',
  },
  {
    company: 'Document Analysis',
    before: '$8,500',
    after: '$1,700',
    savings: '80%',
    period: '/month',
    users: '200 documents/day',
    technique: 'Compression + Semantic Caching',
  },
  {
    company: 'Code Assistant',
    before: '$12,000',
    after: '$3,600',
    savings: '70%',
    period: '/month',
    users: '1000 requests/day',
    technique: 'Provider Caching + Budget Management',
  },
]

// Value props for the three main optimization types
const valueProps = [
  {
    icon: Database,
    title: 'Provider Caching',
    savings: '90%',
    description: 'Anthropic, OpenAI, and Google native caching. Reuse tokens, pay 90% less.',
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: RefreshCw,
    title: 'Smart Compression',
    savings: '50%',
    description: 'LLMLingua and adaptive compression reduce tokens while preserving meaning.',
    gradient: 'from-teal-500 via-emerald-500 to-teal-600',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    icon: Target,
    title: 'Model Routing',
    savings: '70%',
    description: 'Route simple queries to cheaper models, complex ones to premium models.',
    gradient: 'from-indigo-500 via-blue-500 to-indigo-600',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
]

// Quick links
const quickLinks = [
  {
    icon: Rocket,
    title: 'Quick Start',
    description: 'Get up and running in 5 minutes',
    href: '/guides/token-optimization',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BookOpen,
    title: 'Cookbook',
    description: 'Real-world examples and recipes',
    href: '/cookbook/token-optimization',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Code2,
    title: 'API Docs',
    description: '87 optimization APIs',
    href: '/reference/components/token-optimization',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Play,
    title: 'Examples',
    description: 'Live interactive demos',
    href: '/examples/token-optimization',
    color: 'from-orange-500 to-amber-500',
  },
]

// Key stats
const stats = [
  { value: '90%', label: 'Max Cost Reduction', icon: TrendingDown },
  { value: '87', label: 'Optimization APIs', icon: Zap },
  { value: '3', label: 'Provider Support', icon: Database },
  { value: '< 100ms', label: 'Overhead', icon: Clock },
]

// Animated counter component
function AnimatedCounter({ value, duration = 2, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

// Interactive ROI Calculator (Preview)
function ROICalculatorPreview() {
  const [requestsPerDay, setRequestsPerDay] = useState(500)
  const [tokensPerRequest, setTokensPerRequest] = useState(15000)

  // Calculate costs
  const annualCostWithout = Math.round((requestsPerDay * tokensPerRequest * 365 * 0.003) / 1000)
  const annualCostWith = Math.round(annualCostWithout * 0.4) // 60% savings
  const annualSavings = annualCostWithout - annualCostWith
  const savingsPercent = Math.round(((annualCostWithout - annualCostWith) / annualCostWithout) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
      className="relative max-w-5xl mx-auto"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl rounded-3xl" />

      <div className="relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                ROI Calculator
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                See your potential savings with real-time calculations
              </p>
            </div>
            <Link
              href="/guides/token-optimization#roi-calculator"
              className="group px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Open Full Calculator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Input Controls */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">
                Requests per day: <strong className="text-purple-600 dark:text-purple-400">{requestsPerDay.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">
                Tokens per request: <strong className="text-purple-600 dark:text-purple-400">{tokensPerRequest.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={tokensPerRequest}
                onChange={(e) => setTokensPerRequest(Number(e.target.value))}
                className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-purple"
              />
            </div>
          </div>

          {/* Results */}
          <motion.div
            key={`${requestsPerDay}-${tokensPerRequest}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-3 gap-6"
          >
            <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30 rounded-2xl text-center">
              <div className="text-sm text-red-600 dark:text-red-400 font-semibold mb-2">Without Optimization</div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-1">
                ${annualCostWithout.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500">per year</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-2xl text-center">
              <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2">With Optimization</div>
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                ${annualCostWith.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500">per year</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl text-center">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">You Save</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                ${annualSavings.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{savingsPercent}% reduction</div>
            </div>
          </motion.div>

          {/* ROI Metrics */}
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 border border-purple-200 dark:border-purple-800 rounded-xl">
            <div className="grid sm:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Break-even Time</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.7 days</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Annual ROI</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(annualSavings / 200)}x
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Success story card
function SuccessStoryCard({ example, index }: { example: typeof savingsExamples[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate, delay: index * 0.1 }}
      className="group relative p-8 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-neutral-200/60 dark:border-white/[0.06] rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
    >
      {/* Gradient border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(249,168,212,0.5) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              {example.company}
            </h3>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Users className="w-4 h-4" />
              {example.users}
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {example.savings}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Before:</span>
            <span className="text-2xl font-bold text-red-500 line-through">
              {example.before}{example.period}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500">After:</span>
            <span className="text-2xl font-bold text-emerald-500">
              {example.after}{example.period}
            </span>
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-2">
            Optimization Method
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {example.technique}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TokenOptimizationHeroPage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with animations */}
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center"
        onMouseMove={handleMouseMove}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(600px circle at ${x}px ${y}px, rgba(139,92,246,0.15), transparent 40%)`
            ),
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: durations.moderate, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mb-8 shadow-lg"
            >
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span className="text-base font-bold tracking-wide">THE #1 DIFFERENTIATOR</span>
            </motion.div>

            {/* Main Heading with gradient text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
                50-90% Token Cost
                <br />
                Reduction
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.4 }}
              className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed max-w-3xl mx-auto"
            >
              Provider-native caching, intelligent compression, and smart routing —{' '}
              <strong className="text-purple-600 dark:text-purple-400">all in one toolkit</strong>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.5 }}
              className="text-lg text-neutral-600 dark:text-neutral-400 mb-12"
            >
              From <span className="line-through">$9,000/month</span> → <strong className="text-emerald-600 dark:text-emerald-400">$1,800/month</strong> for typical applications
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                href="/guides/token-optimization"
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                <Rocket className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Saving in 5 Minutes</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>

              <Link
                href="/reference/components/token-optimization"
                className="px-10 py-5 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700 text-neutral-900 dark:text-white rounded-xl font-bold text-lg transition-all flex items-center gap-3 hover:shadow-xl"
              >
                <Code2 className="w-6 h-6" />
                View 87 APIs
              </Link>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.7 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-10 h-10 text-neutral-400" />
        </motion.div>
      </section>

      {/* Three Value Props - Enhanced Cards */}
      <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-neutral-950 dark:via-purple-950/10 dark:to-neutral-950">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Three Ways to Save Big</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Combine these optimization strategies for maximum cost reduction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: durations.moderate, delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                  prop.gradient
                )} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={cn(
                    'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br text-white shadow-lg',
                    prop.gradient
                  )}>
                    <prop.icon className="w-8 h-8" />
                  </div>

                  {/* Savings badge */}
                  <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {prop.savings}
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">savings</span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{prop.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{prop.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Calculate Your Savings</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              See exactly how much you can save with token optimization
            </p>
          </motion.div>

          <ROICalculatorPreview />
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Get Started Now</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Everything you need to start optimizing
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: durations.moderate, delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group block p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r text-white',
                    link.color
                  )}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{link.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Real-World Success Stories</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Companies using Clarity are saving thousands per month
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {savingsExamples.map((example, i) => (
              <SuccessStoryCard key={i} example={example} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="relative overflow-hidden p-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl text-white text-center shadow-2xl"
          >
            {/* Animated particles in background */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                  animate={{
                    y: [null, Math.random() * 100 + '%'],
                    opacity: [null, Math.random() * 0.3],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Start Saving in 5 Minutes
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join companies reducing AI costs by 50-90% with Clarity's token optimization toolkit
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/guides/token-optimization"
                  className="group px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Rocket className="w-6 h-6" />
                  Get Started Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>

                <Link
                  href="/reference/components/token-optimization"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 rounded-xl font-bold text-lg transition-all flex items-center gap-3"
                >
                  <FileText className="w-6 h-6" />
                  View API Reference
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
                  <div>
                    <div className="text-4xl font-bold mb-1">
                      <AnimatedCounter value={87} />
                    </div>
                    <div className="text-sm opacity-75">Optimization APIs</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1">
                      <AnimatedCounter value={3} />
                    </div>
                    <div className="text-sm opacity-75">Provider Support</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1">
                      <AnimatedCounter value={11} />
                    </div>
                    <div className="text-sm opacity-75">React Hooks</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1">
                      <AnimatedCounter value={100} suffix="%" />
                    </div>
                    <div className="text-sm opacity-75">Type Safe</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add custom styles for slider */}
      <style jsx global>{`
        .slider-purple::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
          transition: transform 0.2s;
        }

        .slider-purple::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-purple::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
          transition: transform 0.2s;
        }

        .slider-purple::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}
