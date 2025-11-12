'use client'

import { motion } from 'framer-motion'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesGridProps {
  features: Feature[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={item}
          className="group relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-lg"
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-2 text-text-primary">
            {feature.title}
          </h3>
          <p className="text-text-secondary leading-relaxed">
            {feature.description}
          </p>

          {/* Hover Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
      ))}
    </motion.div>
  )
}
