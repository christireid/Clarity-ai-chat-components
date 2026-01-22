/**
 * Agent Orchestration Diagram
 * 
 * Visual representation of multi-agent workflow coordination
 */

'use client'

import { motion } from 'framer-motion'
import { User, Cpu, Search, FileText, TrendingUp, CheckCircle } from 'lucide-react'

export function AgentOrchestrationDiagram() {
  const agents = [
    {
      name: 'Researcher',
      icon: <Search className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      task: 'Gather data',
    },
    {
      name: 'Analyst',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      task: 'Analyze trends',
    },
    {
      name: 'Strategist',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      task: 'Create plan',
    },
  ]

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Multi-Agent Orchestration
          </span>
        </h3>

        <div className="flex flex-col items-center gap-6">
          {/* User */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center shadow-xl">
              <User className="w-8 h-8" />
            </div>
            <div className="mt-2 font-semibold text-sm">User Request</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              "Analyze sales and<br />create strategy"
            </div>
          </motion.div>

          {/* Arrow Down */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <svg width="32" height="48" viewBox="0 0 32 48">
              <path d="M 16 0 L 16 40" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 12 36 L 16 44 L 20 36" fill="#6b7280" />
            </svg>
          </motion.div>

          {/* Orchestrator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800">
              <Cpu className="w-10 h-10" />
            </div>
            <div className="mt-2 font-bold">Orchestrator</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Coordinates agents
            </div>
          </motion.div>

          {/* Arrows to Agents */}
          <div className="relative w-full max-w-2xl h-16">
            {agents.map((_, index) => {
              const totalAgents = agents.length
              const angle = (index - (totalAgents - 1) / 2) * 30 // -30, 0, 30 degrees
              const x1 = '50%'
              const y1 = '0'
              const x2 = `${50 + angle * 1.5}%`
              const y2 = '100%'
              
              return (
                <motion.svg
                  key={index}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <defs>
                    <linearGradient id={`agent-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={`url(#agent-gradient-${index})`}
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  />
                </motion.svg>
              )
            })}
          </div>

          {/* Agents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} text-white flex items-center justify-center shadow-lg`}>
                  {agent.icon}
                </div>
                <div className="mt-3 font-semibold text-sm">{agent.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {agent.task}
                </div>
                
                {/* Tool indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="mt-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs"
                >
                  🛠️ {2 + index} tools
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Results Collection Arrow */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            <svg width="32" height="48" viewBox="0 0 32 48">
              <path d="M 16 0 L 16 40" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 12 36 L 16 44 L 20 36" fill="#10b981" />
            </svg>
          </motion.div>

          {/* Final Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="mt-2 font-bold">Complete Response</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Synthesized from all agents
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap justify-center gap-6 text-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-violet-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Task distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Result synthesis</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="12" viewBox="0 0 20 12">
              <line x1="0" y1="6" x2="20" y2="6" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">Data flow</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

