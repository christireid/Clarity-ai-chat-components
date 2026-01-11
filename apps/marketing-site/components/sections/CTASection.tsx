'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Zap } from 'lucide-react'
import { durations } from '@/lib/constants'
import NewsletterSignup from '../ui/NewsletterSignup'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const installCommand = 'npx create-clarity-chat@latest'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMotionProps = (delay = 0) => {
    if (shouldReduceMotion) {
      return { style: { opacity: 1, y: 0, scale: 1 } }
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: { duration: durations.slow, delay },
    }
  }

  const getScaleMotionProps = () => {
    if (shouldReduceMotion) {
      return { style: { opacity: 1, scale: 1 } }
    }
    return {
      initial: { opacity: 0, scale: 0.5 },
      animate: isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 },
      transition: { duration: durations.slow },
    }
  }

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-clarity-600/20 via-cosmic-600/20 to-pink-600/20" />
      <div className="absolute inset-0 bg-surface-950/80" />

      {/* Animated gradient orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-clarity-500/30 rounded-full blur-3xl ${shouldReduceMotion ? '' : 'animate-pulse'}`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-500/30 rounded-full blur-3xl ${shouldReduceMotion ? '' : 'animate-pulse animation-delay-1000'}`} />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

      <div
        ref={ref}
        className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Icon */}
        <motion.div
          {...getScaleMotionProps()}
          className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-clarity-500/20 to-cosmic-500/20 border border-white/10 mb-8"
        >
          <Zap className="w-8 h-8 text-clarity-400" />
        </motion.div>

        {/* Heading - Bold, action-oriented */}
        <motion.h2
          {...getMotionProps(0.1)}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Your AI Chat Ships
          <span className="gradient-text"> This Weekend.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          {...getMotionProps(0.2)}
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          One command. 170+ components. MIT licensed. Start building your AI
          chat interface now.
        </motion.p>

        {/* Install command */}
        <motion.div
          {...getMotionProps(0.3)}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-surface-800 border border-white/10">
            <span className="text-gray-500">$</span>
            <code className="text-clarity-400 font-mono">{installCommand}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label={copied ? 'Copied!' : 'Copy command'}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...getMotionProps(0.4)}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/docs/guides/getting-started"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-clarity-500 to-cosmic-500 hover:from-clarity-400 hover:to-cosmic-400 transition-all shadow-lg shadow-clarity-500/20 hover:shadow-clarity-400/30 hover:-translate-y-0.5"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Read the Docs
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          {...(shouldReduceMotion
            ? { style: { opacity: 1 } }
            : {
                initial: { opacity: 0 },
                animate: isInView ? { opacity: 1 } : { opacity: 0 },
                transition: { duration: durations.slow, delay: 0.5 },
              })}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>MIT Licensed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>TypeScript Strict</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Open Source</span>
          </div>
        </motion.div>
        {/* Newsletter Signup */}
        <motion.div
          {...getMotionProps(0.6)}
          className="mt-20 max-w-3xl mx-auto text-left"
        >
          <NewsletterSignup />
        </motion.div>
      </div>
    </section>
  )
}
