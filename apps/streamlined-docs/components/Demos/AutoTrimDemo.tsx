'use client'

/**
 * Auto-Trim Demo - Visualizes automatic context trimming
 *
 * Shows how messages are automatically removed when budget
 * is exceeded, with priority-based trimming and visual feedback.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scissors,
  Star,
  MessageSquare,
  TrendingDown,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  tokens: number
  priority: number
  trimmable: boolean
  role: 'user' | 'assistant' | 'system'
}

interface TrimEvent {
  id: string
  removedCount: number
  tokensSaved: number
  timestamp: number
}

export function AutoTrimDemo() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: 'System: You are a helpful assistant',
      tokens: 10,
      priority: 10,
      trimmable: false,
      role: 'system',
    },
    {
      id: '2',
      content: 'User: Hello!',
      tokens: 5,
      priority: 0,
      trimmable: true,
      role: 'user',
    },
    {
      id: '3',
      content: 'Assistant: Hi there!',
      tokens: 6,
      priority: 0,
      trimmable: true,
      role: 'assistant',
    },
    {
      id: '4',
      content: 'User: What is token optimization?',
      tokens: 8,
      priority: 0,
      trimmable: true,
      role: 'user',
    },
    {
      id: '5',
      content: 'Assistant: Token optimization helps manage context efficiently...',
      tokens: 15,
      priority: 1,
      trimmable: true,
      role: 'assistant',
    },
  ])

  const [trimEvents, setTrimEvents] = React.useState<TrimEvent[]>([])
  const [autoTrimEnabled, setAutoTrimEnabled] = React.useState(true)
  const maxTokens = 50
  const criticalThreshold = 0.9

  const currentTokens = messages.reduce((sum, msg) => sum + msg.tokens, 0)
  const utilizationPercent = (currentTokens / maxTokens) * 100
  const isCritical = utilizationPercent >= criticalThreshold * 100

  // Auto-trim when critical
  React.useEffect(() => {
    if (!autoTrimEnabled || !isCritical) return

    // Sort by priority (lower = trim first) and trimmable
    const sortedMessages = [...messages]
      .filter((msg) => msg.trimmable)
      .sort((a, b) => a.priority - b.priority)

    let tokensToRemove = currentTokens - maxTokens * criticalThreshold
    const messagesToRemove: string[] = []
    let tokensSaved = 0

    for (const msg of sortedMessages) {
      if (tokensToRemove <= 0) break
      messagesToRemove.push(msg.id)
      tokensToRemove -= msg.tokens
      tokensSaved += msg.tokens
    }

    if (messagesToRemove.length > 0) {
      setMessages(messages.filter((msg) => !messagesToRemove.includes(msg.id)))
      setTrimEvents([
        {
          id: Date.now().toString(),
          removedCount: messagesToRemove.length,
          tokensSaved,
          timestamp: Date.now(),
        },
        ...trimEvents.slice(0, 4),
      ])
    }
  }, [currentTokens, isCritical, autoTrimEnabled])

  const addRandomMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `New message: Sample content for demonstration purposes...`,
      tokens: Math.floor(Math.random() * 15) + 10,
      priority: Math.random() > 0.7 ? 1 : 0,
      trimmable: true,
      role: Math.random() > 0.5 ? 'user' : 'assistant',
    }
    setMessages([...messages, newMessage])
  }

  const reset = () => {
    setMessages([
      {
        id: '1',
        content: 'System: You are a helpful assistant',
        tokens: 10,
        priority: 10,
        trimmable: false,
        role: 'system',
      },
    ])
    setTrimEvents([])
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-brand-500" />
          <div>
            <div className="font-semibold text-sm">Auto-Trim</div>
            <div className="text-xs text-muted-foreground">
              {autoTrimEnabled ? 'Active' : 'Disabled'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={autoTrimEnabled}
              onChange={(e) => setAutoTrimEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-brand-500 transition-colors cursor-pointer" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
          </label>
        </div>
      </div>

      {/* Budget Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Context Budget</span>
          <span className="font-mono text-muted-foreground">
            {currentTokens} / {maxTokens}
          </span>
        </div>
        <div className="relative h-6 rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
          <motion.div
            className={cn(
              'absolute inset-y-0 left-0',
              isCritical ? 'bg-orange-500' : 'bg-emerald-500'
            )}
            animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-orange-400/50"
            style={{ left: `${criticalThreshold * 100}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Messages</h4>
          <div className="flex gap-2">
            <button
              onClick={addRandomMessage}
              className="px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
            >
              Add Message
            </button>
            <button
              onClick={reset}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Reset demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1 max-h-[250px] overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-md border',
                  message.trimmable
                    ? 'bg-muted/20 border-border/50'
                    : 'bg-purple-500/10 border-purple-200 dark:border-purple-800'
                )}
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      {message.tokens} tokens
                    </span>
                    {message.priority > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3" />
                        Priority {message.priority}
                      </span>
                    )}
                    {!message.trimmable && (
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        Protected
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Trim Events */}
      {trimEvents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Recent Trim Events
          </h4>
          <div className="space-y-1">
            <AnimatePresence>
              {trimEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-md bg-orange-500/10 border border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-700 dark:text-orange-300">
                      Trimmed {event.removedCount} messages
                    </span>
                    <span className="text-xs font-mono text-orange-600 dark:text-orange-400">
                      -{event.tokensSaved} tokens
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>How it works:</strong> When context reaches {criticalThreshold * 100}%,
          messages with lower priority are automatically removed. System messages (purple)
          are never trimmed. Messages with ⭐ Priority have higher retention.
        </p>
      </div>
    </div>
  )
}
