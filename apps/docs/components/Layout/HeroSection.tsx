'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Github,
  Star,
  Terminal,
} from 'lucide-react'

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

// Install command with copy button
function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }, [command])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="flex items-center justify-center mb-8"
    >
      <div className="relative group">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-tertiary/80 backdrop-blur-sm border border-border hover:border-brand-300 transition-all shadow-lg">
          <Terminal className="w-4 h-4 text-brand-500" />
          <code className="font-mono text-sm text-text-primary">{command}</code>
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md hover:bg-bg-secondary transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary" />
            )}
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : -4 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-green-500 rounded pointer-events-none"
        >
          Copied!
        </motion.div>
      </div>
    </motion.div>
  )
}

// GitHub stars badge
function GitHubStarsBadge() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    // Fetch GitHub stars (with cache)
    const cached = sessionStorage.getItem('github-stars')
    if (cached) {
      const { stars: cachedStars, timestamp } = JSON.parse(cached)
      // Use cached value if less than 1 hour old
      if (Date.now() - timestamp < 3600000) {
        setStars(cachedStars)
        return
      }
    }

    fetch('https://api.github.com/repos/christireid/Clarity-ai-chat-components')
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch(() => {
        // Use a reasonable default for display
        setStars(null)
      })
  }, [])

  if (stars === null) return null

  return (
    <motion.a
      href="https://github.com/christireid/Clarity-ai-chat-components"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary/80 border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-brand-300 transition-all"
    >
      <Github className="w-4 h-4" />
      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      <span>{stars.toLocaleString()}</span>
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
    <section className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-50"
      />

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Content */}
      <div className="container-docs relative py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge + GitHub Stars */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium shadow-sm"
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
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>70+ Components · 35+ Hooks · 11 Themes</span>
            </motion.div>
            {showGitHubStars && <GitHubStarsBadge />}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-balance"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-text-secondary mb-8 text-balance max-w-3xl mx-auto"
          >
            {description}
          </motion.p>

          {/* Install Command */}
          {installCommand && <InstallCommand command={installCommand} />}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={primaryCta.href}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">{primaryCta.text}</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {secondaryCta && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-lg font-semibold transition-all border border-border hover:border-brand-300 hover:shadow-md"
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: 70, label: 'Components', suffix: '+' },
              { value: 35, label: 'Hooks', suffix: '+' },
              { value: 11, label: 'Themes', suffix: '' },
              { value: 99, label: 'Lighthouse', suffix: '' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="group relative p-4 sm:p-5 rounded-xl bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border hover:border-brand-300 transition-all duration-300 hover:shadow-lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-2xl sm:text-3xl font-bold text-brand-500 mb-1"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter value={stat.value} duration={1.5} />
                    {stat.suffix && (
                      <span className="text-lg">{stat.suffix}</span>
                    )}
                  </motion.div>
                  <div className="text-xs sm:text-sm text-text-secondary font-medium">
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
