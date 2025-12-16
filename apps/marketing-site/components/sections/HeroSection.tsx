'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Shield, Sparkles, Zap } from 'lucide-react'
import SplitScreenDemo from '../ui/SplitScreenDemo'
import { durations } from '@/lib/constants'

// Dynamically import Hero3D to avoid SSR issues with Three.js
const Hero3D = dynamic(() => import('../3d/Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-clarity-400/30 border-t-clarity-400 rounded-full animate-spin" />
    </div>
  ),
})

const trustBadges = [
  { icon: Shield, label: 'TypeScript Strict' },
  { icon: Sparkles, label: 'WCAG 2.1 AA' },
  { icon: Zap, label: '27KB gzipped' },
]

// Company logos for social proof - using text-based logos for reliability
const companyLogos = [
  { name: 'TechCorp', color: 'text-blue-400' },
  { name: 'HealthAI', color: 'text-green-400' },
  { name: 'ShopSmart', color: 'text-purple-400' },
  { name: 'FinanceFlow', color: 'text-cyan-400' },
  { name: 'EduTech', color: 'text-pink-400' },
]

import MagneticButton from '../ui/MagneticButton'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-surface-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-noise opacity-[0.15] mix-blend-overlay pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-clarity-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

      {/* 3D Animation */}
      <div className="absolute inset-0 opacity-80">
        <Hero3D />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow }}
            className="text-center lg:text-left"
          >
            {/* Badge with company logos */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: durations.moderate }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Ship AI Chat in Days, Not Months</span>
              </div>

              {/* Company logos row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Trusted by
                </span>
                {companyLogos.map((company) => (
                  <span
                    key={company.name}
                    className={`text-sm font-semibold ${company.color} opacity-70 hover:opacity-100 transition-opacity`}
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Headline - Benefit-driven */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: durations.slow }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
            >
              Stop Building Chat UI.{' '}
              <span className="gradient-text">Start Shipping AI.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: durations.slow }}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              50+ production-ready React components for AI chat. Switch
              providers in one line. Cut token costs 40%. Launch this weekend.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: durations.slow }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 items-center lg:items-center"
            >
              <MagneticButton
                href="/docs/guides/getting-started"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started Free
              </MagneticButton>
              
              <MagneticButton
                href="https://github.com/christireid/Clarity-ai-chat-components"
                variant="secondary"
                icon={<Github className="w-5 h-5" />}
              >
                View on GitHub
              </MagneticButton>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: durations.slow }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {trustBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <Icon className="w-4 h-4 text-clarity-400" />
                    <span>{badge.label}</span>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right column - Code preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: durations.slow }}
            className="relative w-full lg:w-[120%]"
          >
            <SplitScreenDemo />
          </motion.div>
        </div>

        {/* Stats bar - User-focused metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: durations.slow }}
          className="mt-16 lg:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 rounded-2xl glass-card"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-clarity-400 mb-1">
              50+
            </div>
            <div className="text-sm text-gray-400">Ready Components</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-clarity-400 mb-1">
              3
            </div>
            <div className="text-sm text-gray-400">AI Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-clarity-400 mb-1">
              40%
            </div>
            <div className="text-sm text-gray-400">Token Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-clarity-400 mb-1">
              $400K+
            </div>
            <div className="text-sm text-gray-400">Dev Costs Saved</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: durations.slow }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: durations.slower, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-3 rounded-full bg-gray-500" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
