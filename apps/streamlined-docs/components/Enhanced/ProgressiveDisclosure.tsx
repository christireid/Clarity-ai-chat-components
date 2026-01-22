'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressiveDisclosureProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  variant?: 'default' | 'bordered' | 'filled'
  icon?: ReactNode
  badge?: string
  className?: string
}

export function ProgressiveDisclosure({
  title,
  children,
  defaultOpen = false,
  variant = 'default',
  icon,
  badge,
  className,
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variants = {
    default: 'border-b border-neutral-200 dark:border-neutral-800',
    bordered: 'border border-neutral-200 dark:border-neutral-800 rounded-lg',
    filled: 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg',
  }

  return (
    <div className={cn(variants[variant], className)}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-4 text-left transition-all',
          variant === 'default' ? 'py-4' : 'p-4',
          'hover:text-brand-500 group'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0 text-brand-500">
              {icon}
            </div>
          )}
          <h3 className="font-semibold truncate">{title}</h3>
          {badge && (
            <span className="px-2 py-1 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-medium rounded">
              {badge}
            </span>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-neutral-400 group-hover:text-brand-500 transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className={cn(
              'text-neutral-600 dark:text-neutral-400',
              variant === 'default' ? 'pb-4' : 'p-4 pt-0'
            )}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Grouped disclosure for FAQ-style layouts
interface DisclosureGroupProps {
  items: Array<{
    title: string
    content: ReactNode
    icon?: ReactNode
    badge?: string
  }>
  allowMultiple?: boolean
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
}

export function DisclosureGroup({
  items,
  allowMultiple = false,
  variant = 'default',
  className,
}: DisclosureGroupProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenIndexes(prev => prev.includes(index) ? [] : [index])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <ProgressiveDisclosure
          key={index}
          title={item.title}
          icon={item.icon}
          badge={item.badge}
          variant={variant}
          defaultOpen={openIndexes.includes(index)}
        >
          {item.content}
        </ProgressiveDisclosure>
      ))}
    </div>
  )
}
