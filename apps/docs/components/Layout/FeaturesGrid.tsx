'use client'

import { motion } from 'framer-motion'
import {
  staggerContainer,
  staggerItem,
  cardAnimation,
  iconHover,
  durations,
} from '@/lib/animations'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesGridProps {
  features: Feature[]
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={staggerItem}
          {...cardAnimation}
          className="group relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-400/60 transition-all hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.15),0_8px_16px_-8px_rgba(59,130,246,0.1)] dark:hover:shadow-[0_20px_40px_-12px_rgba(96,165,250,0.2),0_8px_16px_-8px_rgba(96,165,250,0.15)] overflow-hidden cursor-pointer"
        >
          {/* Icon */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 mb-4 relative z-10"
            {...iconHover}
          >
            {feature.icon}
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-2 text-text-primary relative z-10 group-hover:text-brand-500 transition-colors">
            {feature.title}
          </h3>
          <p className="text-text-secondary leading-relaxed relative z-10">
            {feature.description}
          </p>

          {/* Animated Gradient Hover Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: durations.moderate }}
          />

          {/* Glow Effect on Hover */}
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: durations.moderate }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
