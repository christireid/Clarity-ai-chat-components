'use client'

import { motion } from 'framer-motion'
import { durations } from '@/lib/animations'

/**
 * Skeleton loader for messages during conversation switching
 */
export function HeroChatMessageSkeleton() {
  return (
    <div className="space-y-6">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="flex items-start gap-3 flex-row-reverse max-w-[80%]">
          <motion.div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: durations.slower, repeat: Infinity }}
          />
          <div className="space-y-2">
            <motion.div
              className="h-12 w-48 rounded-2xl bg-slate-200 dark:bg-slate-700"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                delay: 0.1,
              }}
            />
            <motion.div
              className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700 ml-auto"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-[80%]">
          <motion.div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: durations.slower, repeat: Infinity }}
          />
          <div className="space-y-2">
            <motion.div
              className="h-20 w-64 rounded-2xl bg-slate-200 dark:bg-slate-700"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                delay: 0.1,
              }}
            />
            <motion.div
              className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading indicator shown before AI response starts
 */
export function HeroChatTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="flex items-start gap-3">
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: durations.slower, repeat: Infinity }}
        >
          <span className="text-white text-sm">✨</span>
        </motion.div>
        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-sm">
          <div className="flex items-center gap-2">
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: durations.slower, repeat: Infinity }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: durations.slower,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Empty sidebar state
 */
export function HeroChatSidebarEmpty({
  onCreateConversation,
}: {
  onCreateConversation: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center p-6"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: durations.slower, repeat: Infinity }}
      >
        <span className="text-3xl">💬</span>
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No conversations yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Start a new chat to begin exploring
      </p>
      <motion.button
        onClick={onCreateConversation}
        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start New Chat
      </motion.button>
    </motion.div>
  )
}
