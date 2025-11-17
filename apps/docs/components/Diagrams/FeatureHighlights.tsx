/**
 * Feature Highlights Infographic
 * 
 * Visual showcase of key features
 */

'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  stat?: string
  color: string
}

interface FeatureHighlightsProps {
  features: Feature[]
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4
}

export function FeatureHighlights({
  features,
  title = 'Key Features',
  subtitle,
  columns = 3,
}: FeatureHighlightsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  return (
    <div className="not-prose my-12">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h3>
        {subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            className="relative group"
          >
            {/* Card */}
            <div className="h-full p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Stat (if provided) */}
              {feature.stat && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                  className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg"
                >
                  {feature.stat}
                </motion.div>
              )}

              {/* Content */}
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

