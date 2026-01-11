'use client'

// Using emoji for lightbulb icon
import { motion, useReducedMotion } from 'framer-motion'

interface Insight {
  id: string
  text: string
  timestamp: Date
}

interface InsightCardsProps {
  insights: Insight[]
}

export function InsightCards({ insights }: InsightCardsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-2">
      {insights.map((insight, idx) => (
        <motion.div
          key={insight.id}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start space-x-2">
            <span className="mt-0.5 flex-shrink-0">💡</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {insight.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
