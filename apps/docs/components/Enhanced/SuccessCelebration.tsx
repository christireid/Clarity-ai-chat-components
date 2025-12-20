'use client'

import { durations } from '@/lib/animations'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles, ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'

interface SuccessCelebrationProps {
  title?: string
  message?: string
  nextSteps?: Array<{
    title: string
    description: string
    href: string
    icon?: React.ReactNode
  }>
}

export function SuccessCelebration({
  title = 'You did it!',
  message = "Your chat app is up and running. Here's what to explore next:",
  nextSteps = [
    {
      title: 'Add Streaming',
      description: 'Real-time responses as they generate',
      href: '/guides/streaming',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      title: 'Customize Theme',
      description: 'Match your brand colors',
      href: '/learn/concepts/theming',
      icon: <span className="text-lg">🎨</span>,
    },
    {
      title: 'Add Memory',
      description: 'Remember conversation context',
      href: '/guides/memory',
      icon: <span className="text-lg">🧠</span>,
    },
  ],
}: SuccessCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
      className="my-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800 relative overflow-hidden"
    >
      {/* Background celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-100%',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6 relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg"
        >
          <Trophy className="w-6 h-6" />
        </motion.div>
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2"
          >
            {title}
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: durations.slow, delay: 0.5, repeat: 2 }}
            >
              🎉
            </motion.span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-700 dark:text-green-400 mt-1"
          >
            {message}
          </motion.p>
        </div>
      </div>

      {/* Milestone badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/50 w-fit"
      >
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          Milestone: First Chat App Complete
        </span>
      </motion.div>

      {/* Next steps grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-3 gap-3"
      >
        {nextSteps.map((step, index) => (
          <motion.div
            key={step.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={step.href}
              className="block p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 dark:text-green-400">
                  {step.icon}
                </span>
                <span className="font-semibold text-green-800 dark:text-green-300 group-hover:text-green-600 transition-colors">
                  {step.title}
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                {step.description}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-500 dark:text-green-400 group-hover:text-green-600">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
