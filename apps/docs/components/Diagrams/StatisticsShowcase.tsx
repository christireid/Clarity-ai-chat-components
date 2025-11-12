/**
 * Statistics Showcase
 * 
 * Animated statistics display with counters
 */

'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
  color?: string
}

interface StatisticsShowcaseProps {
  stats: Stat[]
  title?: string
  columns?: 2 | 3 | 4
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: 'easeOut',
      })
      return controls.stop
    }
  }, [isInView, motionValue, value])

  return (
    <motion.span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

export function StatisticsShowcase({ stats, title, columns = 3 }: StatisticsShowcaseProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  return (
    <div className="not-prose my-12">
      {title && (
        <h3 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h3>
      )}

      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            className="relative"
          >
            <div className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              {/* Number */}
              <div className={`text-5xl font-bold mb-3 ${stat.color || 'text-blue-600 dark:text-blue-400'}`}>
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              {stat.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.description}
                </div>
              )}

              {/* Decorative circle */}
              <motion.div
                className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Predefined stats showcases
export function LibraryStats() {
  return (
    <StatisticsShowcase
      title="By The Numbers"
      stats={[
        {
          value: 70,
          suffix: '+',
          label: 'Components',
          description: 'Production-ready UI components',
          color: 'text-blue-600 dark:text-blue-400',
        },
        {
          value: 30,
          suffix: '+',
          label: 'React Hooks',
          description: 'Powerful state management',
          color: 'text-purple-600 dark:text-purple-400',
        },
        {
          value: 150,
          suffix: '+',
          label: 'Animations',
          description: 'Smooth Framer Motion effects',
          color: 'text-green-600 dark:text-green-400',
        },
        {
          value: 95,
          suffix: '%',
          label: 'Accessible',
          description: 'WCAG 2.1 AA compliant',
          color: 'text-orange-600 dark:text-orange-400',
        },
        {
          value: 12,
          suffix: '',
          label: 'Industry Demos',
          description: 'Real-world examples',
          color: 'text-pink-600 dark:text-pink-400',
        },
        {
          value: 100,
          suffix: '%',
          label: 'TypeScript',
          description: 'Full type safety',
          color: 'text-cyan-600 dark:text-cyan-400',
        },
      ]}
      columns={3}
    />
  )
}

export function PerformanceStats() {
  return (
    <StatisticsShowcase
      title="Performance Metrics"
      stats={[
        {
          value: 90,
          suffix: '%',
          label: 'Fewer Re-renders',
          description: 'After React.memo optimization',
          color: 'text-green-600 dark:text-green-400',
        },
        {
          value: 5,
          suffix: 'x',
          label: 'Faster',
          description: 'Render performance improvement',
          color: 'text-blue-600 dark:text-blue-400',
        },
        {
          value: 0,
          suffix: '',
          label: 'Memory Leaks',
          description: 'All effects properly cleaned',
          color: 'text-purple-600 dark:text-purple-400',
        },
        {
          value: 60,
          suffix: ' FPS',
          label: 'Smooth Animations',
          description: 'GPU-accelerated',
          color: 'text-orange-600 dark:text-orange-400',
        },
      ]}
      columns={4}
    />
  )
}

