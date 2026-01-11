'use client'

import { useState } from 'react'
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  MessageSquare,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'quote'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50/80 dark:bg-blue-950/40 backdrop-blur-sm',
    borderColor: 'border-blue-200/60 dark:border-blue-800/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50/80 dark:bg-amber-950/40 backdrop-blur-sm',
    borderColor: 'border-amber-200/60 dark:border-amber-800/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50/80 dark:bg-red-950/40 backdrop-blur-sm',
    borderColor: 'border-red-200/60 dark:border-red-800/60',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50/80 dark:bg-emerald-950/40 backdrop-blur-sm',
    borderColor: 'border-emerald-200/60 dark:border-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-900 dark:text-emerald-100',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-violet-50/80 dark:bg-violet-950/40 backdrop-blur-sm',
    borderColor: 'border-violet-200/60 dark:border-violet-800/60',
    iconColor: 'text-violet-600 dark:text-violet-400',
    titleColor: 'text-violet-900 dark:text-violet-100',
  },
  quote: {
    icon: MessageSquare,
    bgColor: 'bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-sm',
    borderColor: 'border-slate-200/60 dark:border-slate-700/60',
    iconColor: 'text-slate-600 dark:text-slate-400',
    titleColor: 'text-slate-900 dark:text-slate-100',
  },
}

export function Callout({
  type = 'info',
  title,
  children,
  className,
  icon,
  collapsible = false,
  defaultCollapsed = false,
}: CalloutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const config = calloutConfig[type]
  const DefaultIcon = config.icon

  const defaultTitles = {
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
    tip: 'Tip',
    quote: 'Quote',
  }

  const displayTitle = title || defaultTitles[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'not-prose my-6 p-5 rounded-xl border transition-all duration-300',
        'shadow-sm hover:shadow-md',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="note"
      aria-label={`${type} callout`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
            'bg-white/50 dark:bg-black/20 shadow-inner',
            config.iconColor
          )}
        >
          {icon || <DefaultIcon className="w-5 h-5" />}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with optional collapse button */}
          {displayTitle && (
            <div className="flex items-center justify-between mb-2 gap-2">
              <div
                className={cn(
                  'font-semibold text-base',
                  config.titleColor
                )}
              >
                {displayTitle}
              </div>
              {collapsible && (
                <motion.button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn(
                    'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors',
                    'hover:bg-black/5 dark:hover:bg-white/5',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    config.iconColor
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isCollapsed ? 'Expand callout' : 'Collapse callout'}
                  aria-expanded={!isCollapsed}
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              )}
            </div>
          )}

          {/* Content with collapse animation */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="text-sm leading-relaxed text-text-secondary [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
