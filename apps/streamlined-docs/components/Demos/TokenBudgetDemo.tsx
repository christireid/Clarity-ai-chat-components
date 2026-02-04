'use client'

/**
 * Token Budget Demo - Interactive visualization
 *
 * Shows real-time token tracking with visual indicators,
 * threshold warnings, and budget utilization display.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gauge,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens: number
}

interface TokenBudgetDemoProps {
  maxTokens?: number
  warningThreshold?: number
  criticalThreshold?: number
}

export function TokenBudgetDemo({
  maxTokens = 8000,
  warningThreshold = 0.75,
  criticalThreshold = 0.9,
}: TokenBudgetDemoProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'You are a helpful AI assistant.',
      tokens: 8,
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! Can you help me understand token budgets?',
      tokens: 12,
    },
    {
      id: '3',
      role: 'assistant',
      content:
        'Of course! Token budgets help manage context window limits in AI models...',
      tokens: 18,
    },
  ])

  // Calculate current usage
  const currentTokens = messages.reduce((sum, msg) => sum + msg.tokens, 0)
  const utilizationPercent = (currentTokens / maxTokens) * 100
  const available = maxTokens - currentTokens

  // Determine status
  let status: 'safe' | 'warning' | 'critical' | 'exceeded' = 'safe'
  if (utilizationPercent >= 100) status = 'exceeded'
  else if (utilizationPercent >= criticalThreshold * 100) status = 'critical'
  else if (utilizationPercent >= warningThreshold * 100) status = 'warning'

  // Status colors
  const statusColors = {
    safe: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500',
  }

  const statusTextColors = {
    safe: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    critical: 'text-orange-600 dark:text-orange-400',
    exceeded: 'text-red-600 dark:text-red-400',
  }

  const statusBgColors = {
    safe: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-500/10 border-amber-200 dark:border-amber-800',
    critical: 'bg-orange-500/10 border-orange-200 dark:border-orange-800',
    exceeded: 'bg-red-500/10 border-red-200 dark:border-red-800',
  }

  // Status icons
  const StatusIcon = {
    safe: CheckCircle,
    warning: AlertTriangle,
    critical: AlertCircle,
    exceeded: AlertCircle,
  }[status]

  const addMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: Math.random() > 0.5 ? 'user' : 'assistant',
      content: `Message ${messages.length + 1}: This is sample content to demonstrate token usage...`,
      tokens: Math.floor(Math.random() * 50) + 20,
    }
    setMessages([...messages, newMessage])
  }

  const removeMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Budget Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Token Budget</span>
          </div>
          <span className="font-mono text-muted-foreground">
            {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
          <motion.div
            className={cn('absolute inset-y-0 left-0', statusColors[status])}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Warning Threshold Line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-amber-400/50"
            style={{ left: `${warningThreshold * 100}%` }}
          />

          {/* Critical Threshold Line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-orange-400/50"
            style={{ left: `${criticalThreshold * 100}%` }}
          />

          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground mix-blend-difference">
              {utilizationPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm',
              statusBgColors[status]
            )}
          >
            <StatusIcon className={cn('w-4 h-4', statusTextColors[status])} />
            <span className={cn('font-medium capitalize', statusTextColors[status])}>
              {status}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {available} tokens available
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {status === 'warning' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800"
          >
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ Context at {utilizationPercent.toFixed(0)}% - Consider summarizing
              conversation history
            </p>
          </motion.div>
        )}

        {status === 'critical' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-orange-500/10 border border-orange-200 dark:border-orange-800"
          >
            <p className="text-sm text-orange-700 dark:text-orange-300">
              🚨 Critical! Context nearly full - Auto-trim will activate soon
            </p>
          </motion.div>
        )}

        {status === 'exceeded' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-700 dark:text-red-300">
              ⛔ Budget exceeded! Messages will be trimmed automatically
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            Messages ({messages.length})
          </h4>
          <button
            onClick={addMessage}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
              'bg-brand-500 text-white hover:bg-brand-600',
              'transition-colors text-sm font-medium',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={status === 'exceeded'}
          >
            <Plus className="w-4 h-4" />
            Add Message
          </button>
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'text-xs font-medium px-1.5 py-0.5 rounded',
                        message.role === 'system' &&
                          'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                        message.role === 'user' &&
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                        message.role === 'assistant' &&
                          'bg-green-500/10 text-green-600 dark:text-green-400'
                      )}
                    >
                      {message.role}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {message.tokens} tokens
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.content}
                  </p>
                </div>
                {message.role !== 'system' && (
                  <button
                    onClick={() => removeMessage(message.id)}
                    className={cn(
                      'p-1.5 rounded opacity-0 group-hover:opacity-100',
                      'hover:bg-red-500/10 transition-all',
                      'text-muted-foreground hover:text-red-500'
                    )}
                    aria-label="Remove message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Messages</div>
          <div className="text-2xl font-bold text-foreground">{messages.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Used</div>
          <div className="text-2xl font-bold text-foreground">
            {currentTokens}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Available</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {available}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Utilization</div>
          <div className={cn('text-2xl font-bold', statusTextColors[status])}>
            {utilizationPercent.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  )
}
