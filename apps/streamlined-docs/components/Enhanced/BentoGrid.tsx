'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4 | 6
  gap?: 'sm' | 'md' | 'lg'
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  span?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3
  gradient?: string
  hover?: boolean
  pattern?: boolean
}

/**
 * BentoGrid - Modern modular grid layout
 * 
 * Inspired by Japanese bento boxes, creates asymmetric but balanced layouts.
 * Perfect for feature showcases, dashboards, and content organization.
 */
export function BentoGrid({
  children,
  className,
  columns = 4,
  gap = 'md',
}: BentoGridProps) {
  const gapSizes = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <div
      className={cn(
        'grid auto-rows-fr',
        columnClasses[columns],
        gapSizes[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * BentoCard - Individual card in bento grid
 */
export function BentoCard({
  children,
  className,
  span = 1,
  rowSpan = 1,
  gradient,
  hover = true,
  pattern = false,
}: BentoCardProps) {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 sm:col-span-2',
    3: 'col-span-1 sm:col-span-2 lg:col-span-3',
    4: 'col-span-1 sm:col-span-2 lg:col-span-4',
  }

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hover ? { y: -4 } : {}}
      className={cn(
        'relative rounded-2xl overflow-hidden p-6 sm:p-8',
        'bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm',
        'border border-neutral-200/60 dark:border-white/[0.06]',
        hover && 'hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all',
        spanClasses[span],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {/* Pattern overlay */}
      {pattern && (
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Gradient background */}
      {gradient && (
        <div
          className={cn('absolute inset-0 opacity-5', gradient)}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
