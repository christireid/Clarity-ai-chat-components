'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

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
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
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

export function HeroSection({
  title,
  description,
  primaryCta,
  secondaryCta,
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
      <div className="container-docs relative py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8 shadow-sm"
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
            <span>70+ Components · 35+ Hooks · 150+ Animations</span>
          </motion.div>

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
            className="text-xl md:text-2xl text-text-secondary mb-12 text-balance max-w-3xl mx-auto"
          >
            {description}
          </motion.p>

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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: 70, label: 'Components' },
              { value: 35, label: 'Hooks' },
              { value: 150, label: 'Animations' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border hover:border-brand-300 transition-all duration-300 hover:shadow-lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-4xl font-bold text-brand-500 mb-2"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter value={stat.value} duration={1.5} />
                  </motion.div>
                  <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
