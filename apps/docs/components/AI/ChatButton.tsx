'use client'

/**
 * ChatButton - Premium Floating Action Button for Documentation Assistant
 *
 * A beautifully designed floating button that opens the AI chat assistant.
 * Features smooth animations, accessibility support, and premium visual design.
 */

import { useState, useEffect } from 'react'
import { MessageSquare, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  // Detect if user is on Mac for keyboard shortcut display
  // Uses userAgent string (navigator.platform is deprecated)
  useEffect(() => {
    setIsMac(/mac/i.test(navigator.userAgent))
  }, [])

  // Stop the pulse animation after a few seconds to reduce distraction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: 0.5,
      }}
      className="fixed bottom-6 right-6 z-50 group/container"
    >
      {/* Keyboard Shortcut Tooltip - Desktop only */}
      <AnimatePresence>
        {!isOpen && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'hidden lg:flex items-center gap-2',
              'absolute bottom-full right-0 mb-3',
              'px-3.5 py-2 rounded-xl',
              // Glass morphism background
              'bg-gray-900/95 dark:bg-gray-800/95',
              'backdrop-blur-md',
              'text-white text-sm font-medium',
              'shadow-xl shadow-gray-900/20',
              'border border-white/10',
              'whitespace-nowrap'
            )}
          >
            <span className="text-gray-300">Press</span>
            <kbd className={cn(
              'inline-flex items-center justify-center',
              'px-2 py-0.5 min-w-[24px]',
              'bg-white/10 rounded-md',
              'text-xs font-semibold',
              'border border-white/20'
            )}>
              {isMac ? '⌘' : 'Ctrl'}
            </kbd>
            <span className="text-gray-400">+</span>
            <kbd className={cn(
              'inline-flex items-center justify-center',
              'px-2 py-0.5 min-w-[24px]',
              'bg-white/10 rounded-md',
              'text-xs font-semibold',
              'border border-white/20'
            )}>
              .
            </kbd>
            {/* Tooltip arrow */}
            <div className={cn(
              'absolute bottom-0 right-6 translate-y-1/2 rotate-45',
              'w-2.5 h-2.5',
              'bg-gray-900/95 dark:bg-gray-800/95',
              'border-r border-b border-white/10'
            )} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'relative flex items-center gap-2.5',
          'px-5 py-3.5',
          'rounded-2xl',
          // Premium gradient background
          'bg-gradient-to-br from-primary via-primary to-primary/90',
          'dark:from-primary dark:via-primary/95 dark:to-primary/85',
          // Text styling
          'text-white font-semibold text-sm',
          // Premium shadow with brand color
          'shadow-xl shadow-primary/25',
          'hover:shadow-2xl hover:shadow-primary/30',
          'dark:shadow-primary/20 dark:hover:shadow-primary/25',
          // Transition
          'transition-shadow duration-300 ease-out',
          // Focus styles
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
          // Touch optimization
          'touch-manipulation',
          // Minimum touch target
          'min-h-[52px]'
        )}
        aria-label={
          isOpen
            ? 'Close AI Assistant (Esc)'
            : `Open AI Assistant (${isMac ? 'Cmd' : 'Ctrl'}+.)`
        }
      >
        {/* Subtle inner glow */}
        <div className={cn(
          'absolute inset-0 rounded-2xl',
          'bg-gradient-to-t from-transparent via-white/5 to-white/10',
          'pointer-events-none'
        )} />

        {/* Icon Container with animation */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="relative"
              >
                <MessageSquare className="w-5 h-5" strokeWidth={2} />
                {/* Sparkle indicator for AI */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="absolute -top-1.5 -right-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 drop-shadow-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Label with smooth collapse */}
        <motion.span
          animate={{
            width: isOpen ? 0 : 'auto',
            opacity: isOpen ? 0 : 1,
            marginLeft: isOpen ? 0 : 2,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative z-10 overflow-hidden whitespace-nowrap"
        >
          Ask AI
        </motion.span>

        {/* Pulse Ring Animation - only when closed and showPulse is true */}
        <AnimatePresence>
          {!isOpen && showPulse && (
            <>
              {/* Outer pulse ring */}
              <motion.span
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className={cn(
                  'absolute inset-0 rounded-2xl',
                  'bg-primary/30 dark:bg-primary/20',
                  'pointer-events-none'
                )}
              />
              {/* Inner pulse dot */}
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute top-2 right-2 flex h-2.5 w-2.5"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-sm" />
              </motion.span>
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
