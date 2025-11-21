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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  },
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
          whileHover={{
            scale: 1.03,
            y: -5,
            transition: { duration: 0.2, ease: 'easeOut' }
          }}
          whileTap={{ scale: 0.98 }}
          className="group relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-xl overflow-hidden cursor-pointer"
        >
          {/* Icon */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 mb-4 relative z-10"
            whileHover={{
              scale: 1.15,
              rotate: [0, -5, 5, -5, 0],
              transition: {
                scale: { duration: 0.2 },
                rotate: { duration: 0.4, ease: 'easeInOut' }
              }
            }}
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
            transition={{ duration: 0.3 }}
          />

          {/* Glow Effect on Hover */}
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
