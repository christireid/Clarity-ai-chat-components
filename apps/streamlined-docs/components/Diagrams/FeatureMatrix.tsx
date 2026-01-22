/**
 * Feature Comparison Matrix
 * 
 * Compare Clarity vs competitors
 */

'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'

export function FeatureMatrix() {
  const features = [
    { name: 'React.memo Optimization', clarity: true, vercel: false, langchain: false, gradio: false },
    { name: 'WCAG 2.1 AA Accessible', clarity: true, vercel: 'partial', langchain: false, gradio: false },
    { name: 'AI Agents Support', clarity: true, vercel: false, langchain: true, gradio: false },
    { name: 'Vector Store Integration', clarity: true, vercel: false, langchain: true, gradio: false },
    { name: 'Multi-tenancy', clarity: true, vercel: false, langchain: false, gradio: false },
    { name: 'RBAC System', clarity: true, vercel: false, langchain: false, gradio: false },
    { name: 'PII Detection', clarity: true, vercel: false, langchain: false, gradio: false },
    { name: 'Real-time Streaming', clarity: true, vercel: true, langchain: true, gradio: 'partial' },
    { name: 'Dark Mode', clarity: true, vercel: true, langchain: false, gradio: true },
    { name: 'TypeScript Support', clarity: true, vercel: true, langchain: true, gradio: false },
    { name: 'Customizable Themes', clarity: true, vercel: 'partial', langchain: false, gradio: 'partial' },
    { name: 'Industry Demos', clarity: 12, vercel: 3, langchain: 2, gradio: 4 },
  ]

  const Icon = ({ value }: { value: boolean | string | number }) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500" />
    if (value === false) return <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
    if (value === 'partial') return <Minus className="w-5 h-5 text-yellow-500" />
    return <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{value}</span>
  }

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-3 text-center">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Feature Comparison
          </span>
        </h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          How Clarity stacks up against alternatives
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-6 py-4 text-left text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-brand-600 dark:text-brand-400">Clarity</span>
                    <span className="px-2 py-0.5 bg-brand-500 text-white rounded-full text-xs">You</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700">
                  Vercel AI
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700">
                  LangChain
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold">
                  Gradio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800">
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium border-r border-slate-100 dark:border-slate-700">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700">
                    <div className="flex justify-center">
                      <Icon value={feature.clarity} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700">
                    <div className="flex justify-center">
                      <Icon value={feature.vercel} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700">
                    <div className="flex justify-center">
                      <Icon value={feature.langchain} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Icon value={feature.gradio} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Fully supported</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-yellow-500" />
            <span>Partially supported</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-gray-300" />
            <span>Not supported</span>
          </div>
        </motion.div>

        {/* Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-6 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl shadow-xl text-white text-center"
        >
          <div className="text-xl font-bold mb-2">🏆 Most Feature-Complete</div>
          <div className="text-brand-100">
            Clarity offers enterprise features that others don't
          </div>
        </motion.div>
      </div>
    </div>
  )
}

