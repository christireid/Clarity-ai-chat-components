/**
 * Message Flow Sequence Diagram
 * 
 * Shows the complete message lifecycle with optimistic updates
 */

'use client'

import { motion } from 'framer-motion'
import { User, Server, Database, CheckCircle2 } from 'lucide-react'

export function MessageFlowSequence() {
  const steps = [
    {
      from: 'user',
      to: 'client',
      label: '1. User types message',
      description: 'Input event',
      delay: 0,
    },
    {
      from: 'client',
      to: 'ui',
      label: '2. Optimistic update',
      description: 'Show immediately',
      delay: 0.3,
    },
    {
      from: 'client',
      to: 'server',
      label: '3. Send to API',
      description: 'HTTP/WebSocket',
      delay: 0.6,
    },
    {
      from: 'server',
      to: 'client',
      label: '4. Stream response',
      description: 'Token-by-token',
      delay: 0.9,
    },
    {
      from: 'client',
      to: 'db',
      label: '5. Persist',
      description: 'Save to storage',
      delay: 1.2,
    },
    {
      from: 'db',
      to: 'client',
      label: '6. Confirm',
      description: 'Success callback',
      delay: 1.5,
    },
  ]

  const actors = [
    {
      id: 'user',
      icon: <User className="w-6 h-6" />,
      label: 'User',
      color: 'from-blue-500 to-blue-600',
      x: 80,
    },
    {
      id: 'client',
      icon: <span className="text-xl">⚛️</span>,
      label: 'React State',
      color: 'from-purple-500 to-purple-600',
      x: 220,
    },
    {
      id: 'ui',
      icon: <span className="text-xl">💬</span>,
      label: 'UI',
      color: 'from-green-500 to-green-600',
      x: 360,
    },
    {
      id: 'server',
      icon: <Server className="w-6 h-6" />,
      label: 'API',
      color: 'from-orange-500 to-orange-600',
      x: 500,
    },
    {
      id: 'db',
      icon: <Database className="w-6 h-6" />,
      label: 'Storage',
      color: 'from-pink-500 to-pink-600',
      x: 640,
    },
  ]

  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-x-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Message Lifecycle
          </span>
        </h3>

        <svg width="720" height="500" viewBox="0 0 720 500" className="mx-auto">
          {/* Actors */}
          {actors.map((actor, index) => (
            <g key={actor.id}>
              {/* Icon */}
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <defs>
                  <linearGradient id={`gradient-${actor.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={actor.color.split(' ')[0].replace('from-', '#')} />
                  </linearGradient>
                </defs>
                
                <rect
                  x={actor.x - 30}
                  y="20"
                  width="60"
                  height="60"
                  rx="12"
                  className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600"
                  strokeWidth="2"
                />
                
                <foreignObject x={actor.x - 24} y="32" width="48" height="36">
                  <div className="w-full h-full flex items-center justify-center">
                    {actor.icon}
                  </div>
                </foreignObject>
              </motion.g>

              {/* Label */}
              <text
                x={actor.x}
                y="105"
                textAnchor="middle"
                className="fill-gray-900 dark:fill-gray-100 font-semibold text-xs"
              >
                {actor.label}
              </text>

              {/* Lifeline */}
              <motion.line
                x1={actor.x}
                y1="115"
                x2={actor.x}
                y2="470"
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              />
            </g>
          ))}

          {/* Messages/Arrows */}
          {steps.map((step, index) => {
            const fromActor = actors.find((a) => a.id === step.from)
            const toActor = actors.find((a) => a.id === step.to)
            if (!fromActor || !toActor) return null

            const y = 150 + index * 50
            const isReturn = fromActor.x > toActor.x

            return (
              <g key={index}>
                {/* Arrow */}
                <motion.line
                  x1={fromActor.x + (isReturn ? -10 : 10)}
                  y1={y}
                  x2={toActor.x + (isReturn ? 10 : -10)}
                  y2={y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: step.delay, duration: 0.4 }}
                />

                {/* Label */}
                <motion.foreignObject
                  x={(fromActor.x + toActor.x) / 2 - 70}
                  y={y - 30}
                  width="140"
                  height="24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step.delay + 0.2 }}
                >
                  <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg px-2 py-1 text-xs font-semibold text-center shadow-sm">
                    {step.label}
                  </div>
                </motion.foreignObject>

                {/* Description */}
                <motion.text
                  x={(fromActor.x + toActor.x) / 2}
                  y={y + 18}
                  textAnchor="middle"
                  className="fill-gray-600 dark:fill-gray-400 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step.delay + 0.3 }}
                >
                  {step.description}
                </motion.text>
              </g>
            )
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">Step 2</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Optimistic UI</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Instant feedback</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">Step 4</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Streaming</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Real-time tokens</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">Step 6</div>
            <div className="text-sm text-green-800 dark:text-green-200">Persistence</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Reliable storage</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

