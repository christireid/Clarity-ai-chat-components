/**
 * Performance Comparison Infographic
 * 
 * Before/After performance improvements visualization
 */

'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Zap, MemoryStick, Activity } from 'lucide-react'

export function PerformanceComparison() {
  const metrics = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Re-renders',
      before: 100,
      after: 10,
      unit: 'per action',
      improvement: '90%',
      color: 'blue',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Render Time',
      before: 100,
      after: 25,
      unit: 'ms',
      improvement: '75%',
      color: 'purple',
    },
    {
      icon: <MemoryStick className="w-5 h-5" />,
      label: 'Memory Leaks',
      before: 'Unknown',
      after: 0,
      unit: '',
      improvement: '100%',
      color: 'green',
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      label: 'Bundle Impact',
      before: '+12KB',
      after: '+8KB',
      unit: '',
      improvement: '33%',
      color: 'orange',
    },
  ]

  const colorMap = {
    blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', light: 'bg-blue-100 dark:bg-blue-950/30' },
    purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', light: 'bg-purple-100 dark:bg-purple-950/30' },
    green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', light: 'bg-green-100 dark:bg-green-950/30' },
    orange: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', light: 'bg-orange-100 dark:bg-orange-950/30' },
  }

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-3 text-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Improvements
          </span>
        </h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          After React.memo optimization
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg"
            >
              {/* Header */}
              <div className={`p-4 bg-gradient-to-r ${colorMap[metric.color as keyof typeof colorMap].bg} text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  {metric.icon}
                  <div className="font-bold text-sm">{metric.label}</div>
                </div>
              </div>

              {/* Before/After */}
              <div className="p-4 space-y-4">
                {/* Before */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Before
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-400 line-through">
                      {metric.before}
                    </span>
                    <span className="text-xs text-gray-400">{metric.unit}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={colorMap[metric.color as keyof typeof colorMap].text}
                  >
                    ↓
                  </motion.div>
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* After */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    After
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      className={`text-3xl font-bold ${colorMap[metric.color as keyof typeof colorMap].text}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    >
                      {metric.after}
                    </motion.span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{metric.unit}</span>
                  </div>
                </div>

                {/* Improvement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className={`${colorMap[metric.color as keyof typeof colorMap].light} px-3 py-2 rounded-lg text-center`}
                >
                  <div className={`text-xl font-bold ${colorMap[metric.color as keyof typeof colorMap].text}`}>
                    {metric.improvement}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">faster</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-8 h-8" />
            <div className="text-3xl font-bold">3-5x</div>
            <Zap className="w-8 h-8" />
          </div>
          <div className="text-blue-100 text-lg font-semibold">Overall Performance Improvement</div>
          <div className="text-blue-200 text-sm mt-2">
            With React.memo optimization on 41 critical components
          </div>
        </motion.div>
      </div>
    </div>
  )
}

