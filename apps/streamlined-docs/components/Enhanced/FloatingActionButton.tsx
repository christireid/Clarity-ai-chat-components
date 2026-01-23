'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, Search, Sparkles, Keyboard, Sun, Moon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface FABAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

interface FloatingActionButtonProps {
  actions?: FABAction[]
  position?: 'bottom-right' | 'bottom-left'
  onSearchClick?: () => void
  onShortcutsClick?: () => void
  onAIClick?: () => void
  className?: string
}

export function FloatingActionButton({
  actions: customActions,
  position = 'bottom-right',
  onSearchClick,
  onShortcutsClick,
  onAIClick,
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showFAB, setShowFAB] = useState(false)
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  // Show FAB when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowFAB(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Default handlers using keyboard events
  const handleSearch = () => {
    if (onSearchClick) {
      onSearchClick()
    } else {
      // Trigger search dialog via window event (Cmd+K)
      const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
      window.dispatchEvent(event)
    }
  }

  const handleAI = () => {
    if (onAIClick) {
      onAIClick()
    } else {
      // Trigger AI assistant (Cmd+.)
      const event = new KeyboardEvent('keydown', { key: '.', metaKey: true })
      window.dispatchEvent(event)
    }
  }

  const handleShortcuts = () => {
    if (onShortcutsClick) {
      onShortcutsClick()
    } else {
      // Show keyboard shortcuts (?)
      const event = new KeyboardEvent('keydown', { key: '?' })
      window.dispatchEvent(event)
    }
  }

  const defaultActions: FABAction[] = [
    {
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      onClick: handleSearch,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'AI Assistant',
      onClick: handleAI,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Keyboard className="w-5 h-5" />,
      label: 'Shortcuts',
      onClick: handleShortcuts,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon:
        theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        ),
      label: 'Theme',
      onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      color: 'from-amber-500 to-orange-500',
    },
  ]

  const actions = customActions || defaultActions

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6 sm:bottom-8 sm:right-8',
    'bottom-left': 'bottom-6 left-6 sm:bottom-8 sm:left-8',
  }

  // Animation variants that respect reduced motion
  const containerVariants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }

  const itemVariants = (index: number) =>
    prefersReducedMotion
      ? { initial: {}, animate: {}, exit: {} }
      : {
          initial: { opacity: 0, x: 20, scale: 0.8 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: 20, scale: 0.8 },
          transition: { delay: index * 0.05 },
        }

  const fabVariants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        exit: { scale: 0, rotate: 180 },
      }

  const backdropVariants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

  return (
    <AnimatePresence>
      {showFAB && (
        <div
          className={cn(
            'fixed z-50 md:hidden',
            positionClasses[position],
            className
          )}
        >
          {/* Speed Dial Actions */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                {...containerVariants}
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: durations.normal, staggerChildren: 0.05 }
                }
                className="absolute bottom-20 right-0 flex flex-col gap-3 items-end"
              >
                {actions.map((action, index) => (
                  <motion.button
                    key={index}
                    {...itemVariants(index)}
                    onClick={() => {
                      action.onClick()
                      setIsOpen(false)
                    }}
                    className="group flex items-center gap-3"
                  >
                    {/* Label */}
                    <span className="px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 whitespace-nowrap">
                      {action.label}
                    </span>

                    {/* Action Button */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg',
                        'bg-gradient-to-r',
                        action.color || 'from-brand-500 to-purple-500',
                        'group-hover:scale-110 transition-transform'
                      )}
                    >
                      {action.icon}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            {...fabVariants}
            transition={
              prefersReducedMotion
                ? undefined
                : { type: 'spring', stiffness: 260, damping: 20 }
            }
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl',
              'bg-gradient-to-r from-brand-500 to-purple-500',
              'hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]',
              'transition-shadow duration-300'
            )}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={
                prefersReducedMotion ? undefined : { rotate: isOpen ? 45 : 0 }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: durations.normal }
              }
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>

          {/* Backdrop */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                {...backdropVariants}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}
