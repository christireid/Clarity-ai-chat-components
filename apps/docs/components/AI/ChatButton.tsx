'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMac, setIsMac] = useState(false)

  // Detect if user is on Mac for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 right-6 z-50 group/container"
    >
      {/* Keyboard Shortcut Tooltip - Desktop only */}
      <AnimatePresence>
        {!isOpen && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: durations.normal }}
            className={cn(
              'hidden lg:block',
              'absolute bottom-full right-0 mb-2',
              'px-3 py-1.5 rounded-lg',
              'bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium',
              'shadow-lg border border-gray-700',
              'whitespace-nowrap'
            )}
          >
            Press {isMac ? '⌘' : 'Ctrl'}+.
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-800 border-r border-b border-gray-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-full',
          'bg-gradient-to-r from-brand-500 to-brand-600',
          'text-white font-medium text-sm',
          'shadow-lg hover:shadow-xl',
          'transition-shadow duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          'group'
        )}
        aria-label={
          isOpen
            ? 'Close AI Assistant (Esc)'
            : `Open AI Assistant (${isMac ? 'Cmd' : 'Ctrl'}+.)`
        }
      >
        {/* Icon Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: durations.normal }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: durations.normal }}
                className="relative"
              >
                <MessageSquare className="w-5 h-5" />
                {/* Sparkle indicator for AI */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Label */}
        <motion.span
          animate={{
            width: isOpen ? 0 : 'auto',
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: durations.moderate }}
          className="overflow-hidden whitespace-nowrap"
        >
          Ask AI
        </motion.span>

        {/* Pulse Indicator (when closed) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 flex h-2 w-2"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
