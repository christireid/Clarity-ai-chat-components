/**
 * Installation Flow Diagram
 * 
 * Step-by-step installation visualization
 */

'use client'

import { motion } from 'framer-motion'
import { Package, Download, FileCode, Rocket } from 'lucide-react'

export function InstallationFlow() {
  const steps = [
    {
      number: 1,
      icon: <Package className="w-6 h-6" />,
      title: 'Install Package',
      command: 'npm install @clarity-chat/react',
      color: 'from-blue-500 to-blue-600',
      time: '~30s',
    },
    {
      number: 2,
      icon: <Download className="w-6 h-6" />,
      title: 'Import Components',
      command: "import { ChatWindow } from '@clarity-chat/react'",
      color: 'from-purple-500 to-purple-600',
      time: '~10s',
    },
    {
      number: 3,
      icon: <FileCode className="w-6 h-6" />,
      title: 'Configure',
      command: 'Add to your React app',
      color: 'from-green-500 to-green-600',
      time: '~20s',
    },
    {
      number: 4,
      icon: <Rocket className="w-6 h-6" />,
      title: 'Start Building',
      command: 'npm run dev',
      color: 'from-orange-500 to-orange-600',
      time: '~5s',
    },
  ]

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Installation in 4 Simple Steps
          </span>
        </h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          Get started in under 2 minutes
        </p>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                {/* Step number & icon */}
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.1, type: 'spring' }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {step.time}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-sm shadow`}>
                      {step.number}
                    </div>
                    <h4 className="font-bold text-lg">{step.title}</h4>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                    className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl border border-slate-700 font-mono text-sm text-green-400 shadow-inner"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500">$</span>
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {step.command}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 0.2 }}
                  className="ml-8 my-3"
                >
                  <svg width="24" height="32" viewBox="0 0 24 32">
                    <path
                      d="M 12 0 L 12 28"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path d="M 8 24 L 12 32 L 16 24" fill="#9ca3af" />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl text-white text-center"
        >
          <div className="text-4xl font-bold mb-2">~65 seconds</div>
          <div className="text-green-100">Total installation time</div>
          <div className="mt-4 text-sm text-green-50">
            ⚡ One of the fastest setups in the React ecosystem
          </div>
        </motion.div>
      </div>
    </div>
  )
}

