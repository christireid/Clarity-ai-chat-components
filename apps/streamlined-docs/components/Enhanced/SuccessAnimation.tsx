'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessAnimationProps {
  show: boolean
  variant?: 'checkmark' | 'confetti' | 'sparkles'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  onComplete?: () => void
}

export function SuccessAnimation({
  show,
  variant = 'checkmark',
  size = 'md',
  message,
  onComplete,
}: SuccessAnimationProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 1500)
          }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {/* Icon Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, times: [0, 0.6, 1] }}
            className={cn(
              'rounded-full flex items-center justify-center',
              'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
              'shadow-lg shadow-emerald-500/50',
              sizes[size]
            )}
          >
            {variant === 'checkmark' && <Check className={iconSizes[size]} />}
            {variant === 'sparkles' && <Sparkles className={iconSizes[size]} />}
            {variant === 'confetti' && <PartyPopper className={iconSizes[size]} />}
          </motion.div>

          {/* Checkmark path animation */}
          {variant === 'checkmark' && (
            <svg className="absolute" width="0" height="0">
              <defs>
                <motion.path
                  id="checkPath"
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </defs>
            </svg>
          )}

          {/* Ripple effect */}
          <motion.div
            className={cn(
              'absolute rounded-full border-4 border-emerald-500',
              sizes[size]
            )}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-900 dark:text-white font-semibold text-center"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
