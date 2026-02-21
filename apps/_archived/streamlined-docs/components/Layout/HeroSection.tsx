'use client'

import { durations } from '@/lib/animations'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Github,
  Star,
  Terminal,
} from 'lucide-react'
import { toast } from '@/lib/toast'
import { FloatingAccents } from '@/components/hero/FloatingAccents'
import dynamic from 'next/dynamic'

// Lazy load the geometric mesh to avoid SSR issues with canvas
const GeometricMesh = dynamic(
  () => import('@/components/hero/GeometricMesh').then((mod) => mod.GeometricMesh),
  { ssr: false }
)
import { CardSkeleton } from './Skeletons'

interface HeroSectionProps {
  title: React.ReactNode
  description: string
  primaryCta: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  installCommand?: string
  showGitHubStars?: boolean
}

// Animated counter component
function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: number
  duration?: number
}) {
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

  return <span>{count}+</span>
}

// Confetti particle for copy animation
function CopyConfetti({ show }: { show: boolean }) {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    delay: i * 0.02,
  }))

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0.5],
                x: Math.cos((particle.angle * Math.PI) / 180) * 30,
                y: Math.sin((particle.angle * Math.PI) / 180) * 30,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: particle.delay,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-green-500"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

// Install command with enhanced copy button
function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setShowConfetti(true)

      // Haptic feedback on mobile if supported
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }

      toast.success('Copied to clipboard!', {
        description: 'Install command ready to paste',
        duration: durations.slower,
      })

      setTimeout(() => {
        setCopied(false)
        setShowConfetti(false)
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy', {
        description: 'Please try selecting and copying manually',
        action: { label: 'Try again', onClick: copyToClipboard },
      })
    }
  }, [command])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow, delay: 0.35 }}
      className="flex items-center justify-center mb-8"
    >
      <div className="relative group">
        <motion.div
          animate={copied ? { scale: [1, 1.02, 1] } : {}}
          viewport={{ once: true }}
          transition={{ duration: durations.normal, type: 'tween' }}
          className="rounded-xl bg-bg-tertiary/90 dark:bg-slate-800/90 backdrop-blur-sm border border-border hover:border-brand-300 transition-all shadow-lg overflow-hidden"
        >
          {/* Terminal window chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-bg-secondary/50 dark:bg-slate-900/50">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs text-text-tertiary font-medium">Terminal</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <Terminal className="w-4 h-4 text-brand-500" />
            <code className="font-mono text-sm text-text-primary">{command}</code>
            <div className="relative">
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Copy to clipboard"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      viewport={{ once: true }}
                      transition={{ duration: durations.normal }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: durations.normal }}
                    >
                      <Copy className="w-4 h-4 text-text-secondary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <CopyConfetti show={showConfetti} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.9 }}
          animate={{
            opacity: copied ? 1 : 0,
            y: copied ? 0 : -4,
            scale: copied ? 1 : 0.9,
          }}
          viewport={{ once: true }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-lg pointer-events-none shadow-lg"
        >
          Copied!
        </motion.div>
      </div>
    </motion.div>
  )
}

// Loading skeleton for GitHub stars
function GitHubStarsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary/80 border border-border"
    >
      <div className="w-4 h-4 rounded-full bg-bg-tertiary animate-pulse" />
      <div className="w-3.5 h-3.5 rounded bg-bg-tertiary animate-pulse" />
      <div className="w-8 h-4 rounded bg-bg-tertiary animate-pulse" />
    </motion.div>
  )
}

// Fetch with retry logic
async function fetchWithRetry(
  url: string,
  retries = 3,
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`)
      }
    } catch (error) {
      if (i === retries - 1) throw error
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      )
    }
  }
  throw new Error('Max retries exceeded')
}

// GitHub stars badge with skeleton and retry logic
function GitHubStarsBadge() {
  const [stars, setStars] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStars = async () => {
      // Check cache first
      const cached = sessionStorage.getItem('github-stars')
      if (cached) {
        try {
          const { stars: cachedStars, timestamp } = JSON.parse(cached)
          // Use cached value if less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            setStars(cachedStars)
            setLoading(false)
            return
          }
        } catch {
          // Invalid cache, continue to fetch
        }
      }

      try {
        const response = await fetchWithRetry(
          'https://api.github.com/repos/christireid/Clarity-ai-chat-components'
        )
        const data = await response.json()

        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count)
          sessionStorage.setItem(
            'github-stars',
            JSON.stringify({
              stars: data.stargazers_count,
              timestamp: Date.now(),
            })
          )
        }
      } catch {
        setError(true)
        // Try to use stale cache as fallback
        const cached = sessionStorage.getItem('github-stars')
        if (cached) {
          try {
            const { stars: cachedStars } = JSON.parse(cached)
            setStars(cachedStars)
          } catch {
            // Give up
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [])

  // Show skeleton while loading
  if (loading) {
    return <GitHubStarsSkeleton />
  }

  // Hide if error and no cached data
  if (error && stars === null) {
    return null
  }

  return (
    <motion.a
      href="https://github.com/christireid/Clarity-ai-chat-components"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-bg-secondary/80 border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-brand-300 transition-all focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`Star us on GitHub - ${stars?.toLocaleString() ?? 'loading'} stars`}
    >
      <Github className="w-4 h-4" aria-hidden="true" />
      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
      <span aria-hidden="true">{stars?.toLocaleString() ?? '—'}</span>
    </motion.a>
  )
}

export function HeroSection({
  title,
  description,
  primaryCta,
  secondaryCta,
  installCommand,
  showGitHubStars = true,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Interactive Geometric Mesh Animation - Premium stunning effect */}
      <GeometricMesh className="-z-10 opacity-60 dark:opacity-80" />

      {/* Floating Geometric Accents - Adds depth and sophistication */}
      <FloatingAccents />

      {/* Animated Background Gradient (subtle overlay) - consistent brand colors */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 80% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
          ],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Secondary gradient layer for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/30 to-bg-primary pointer-events-none"
        aria-hidden="true"
      />

      {/* Animated Grid - subtle pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 dark:opacity-20"
        aria-hidden="true"
      />

      {/* Grain texture overlay - premium feel */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Content */}
      <div className="container-docs relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge + GitHub Stars */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: durations.slow, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 text-xs font-medium"
            >
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                }}
                viewport={{ once: true }}
                transition={{
                  duration: durations.slower,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
              <span>155+ Components · 70+ Hooks · 15 Themes</span>
            </motion.div>
            {showGitHubStars && <GitHubStarsBadge />}
          </div>

          {/* Title - Premium gradient text effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 text-balance max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            {description}
          </motion.p>

          {/* Install Command */}
          {installCommand && <InstallCommand command={installCommand} />}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.div viewport={{ once: true }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={primaryCta.href}
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white text-sm rounded-lg font-medium transition-all duration-500 shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:outline-none"
              >
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite] pointer-events-none" />
                <span className="relative z-10">{primaryCta.text}</span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {secondaryCta && (
              <motion.div
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] bg-bg-secondary hover:bg-bg-tertiary text-text-primary text-sm rounded-lg font-medium transition-all border border-border hover:border-brand-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {secondaryCta.text}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.5 }}
            className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto px-2 sm:px-0"
          >
            {[
              { value: 155, label: 'Components', suffix: '+' },
              { value: 70, label: 'Hooks', suffix: '+' },
              { value: 15, label: 'Themes', suffix: '' },
              { value: 99, label: 'Lighthouse', suffix: '' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: durations.slow,
                  delay: 0.6 + index * 0.1,
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="group relative p-3 rounded-lg bg-bg-secondary/50 border border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* Gradient border overlay - appears on hover */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    padding: '1px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                  aria-hidden="true"
                />
                {/* Subtle glow on hover */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-brand-500/5 to-purple-500/5"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-xl sm:text-2xl font-bold text-brand-500 tracking-tight tabular-nums"
                    initial={{ scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedCounter value={stat.value} duration={1.5} />
                    {stat.suffix && (
                      <span className="text-sm">{stat.suffix}</span>
                    )}
                  </motion.div>
                  <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
