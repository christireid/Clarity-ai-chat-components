'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'

interface ResearchAgentProps {
  name: string
  status: 'active' | 'thinking' | 'idle' | 'completed'
  progress: number
}

export function ResearchAgent({ name, status, progress }: ResearchAgentProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'active':
      case 'thinking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'active':
        return 'bg-blue-500'
      case 'thinking':
        return 'bg-purple-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-xs text-gray-500">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getStatusColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
