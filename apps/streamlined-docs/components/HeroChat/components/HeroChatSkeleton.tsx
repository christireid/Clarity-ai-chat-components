'use client'

import { motion, useReducedMotion, type Transition } from 'framer-motion'

/**
 * Animation duration for skeleton pulse - 1.5s for smooth, non-jarring effect
 */
const SKELETON_DURATION = 1.5

/**
 * Animation duration for typing dots - 0.6s for responsive feel
 */
const TYPING_DURATION = 0.6

/**
 * Skeleton loader for messages during conversation switching
 *
 * Features:
 * - GPU-accelerated opacity animations
 * - Smooth 1.5s pulse cycle (not jarring)
 * - Respects prefers-reduced-motion
 * - Matches actual message layout to prevent shift
 */
export function HeroChatMessageSkeleton() {
  const shouldReduceMotion = useReducedMotion()

  // Static opacity for reduced motion users
  const animate = shouldReduceMotion
    ? { opacity: 0.6 }
    : { opacity: [0.4, 0.7, 0.4] }

  const baseTransition: Transition = {
    duration: shouldReduceMotion ? 0 : SKELETON_DURATION,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: 'easeInOut',
  }

  const delayedTransition = (delay: number): Transition => ({
    ...baseTransition,
    delay: shouldReduceMotion ? 0 : delay,
  })

  return (
    <div className="space-y-6" role="status" aria-label="Loading messages">
      <span className="sr-only">Loading conversation...</span>
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="flex items-start gap-3 flex-row-reverse max-w-[80%]">
          <motion.div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 will-change-[opacity]"
            animate={animate}
            transition={baseTransition}
          />
          <div className="space-y-2">
            <motion.div
              className="h-12 w-48 rounded-2xl bg-slate-200 dark:bg-slate-700 will-change-[opacity]"
              animate={animate}
              transition={delayedTransition(0.1)}
            />
            <motion.div
              className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700 ml-auto will-change-[opacity]"
              animate={animate}
              transition={delayedTransition(0.2)}
            />
          </div>
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-[80%]">
          <motion.div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 will-change-[opacity]"
            animate={animate}
            transition={baseTransition}
          />
          <div className="space-y-2">
            <motion.div
              className="h-20 w-64 rounded-2xl bg-slate-200 dark:bg-slate-700 will-change-[opacity]"
              animate={animate}
              transition={delayedTransition(0.1)}
            />
            <motion.div
              className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 will-change-[opacity]"
              animate={animate}
              transition={delayedTransition(0.2)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading indicator shown before AI response starts
 *
 * Features:
 * - Bouncing dots animation using transform (GPU-accelerated)
 * - Respects prefers-reduced-motion
 * - Accessible with proper status indication
 */
export function HeroChatTypingIndicator() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
      className="flex justify-start"
      role="status"
      aria-label="AI is thinking"
    >
      <div className="flex items-start gap-3">
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
          animate={
            shouldReduceMotion
              ? { scale: 1 }
              : { scale: [1, 1.05, 1] }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-white text-sm" aria-hidden="true">✨</span>
        </motion.div>
        <div className="px-4 py-3 rounded-2xl bg-bg-primary dark:bg-slate-800 border border-border dark:border-slate-700 rounded-tl-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-indigo-500 rounded-full will-change-transform"
                  animate={
                    shouldReduceMotion
                      ? { opacity: [0.5, 0.8, 0.5] }
                      : { y: [0, -5, 0] }
                  }
                  transition={{
                    duration: TYPING_DURATION,
                    repeat: Infinity,
                    delay: shouldReduceMotion ? 0 : i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
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
 *
 * Features:
 * - Subtle breathing animation on icon
 * - Accessible button with proper hover/tap feedback
 * - Respects prefers-reduced-motion
 */
export function HeroChatSidebarEmpty({
  onCreateConversation,
}: {
  onCreateConversation: () => void
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
      className="flex flex-col items-center justify-center h-full text-center p-6"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4"
        animate={
          shouldReduceMotion
            ? { scale: 1 }
            : { scale: [1, 1.03, 1] }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="text-3xl" aria-hidden="true">💬</span>
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No conversations yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Start a new chat to begin exploring
      </p>
      <motion.button
        onClick={onCreateConversation}
        className="px-5 py-3 min-h-[44px] rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      >
        Start New Chat
      </motion.button>
    </motion.div>
  )
}
