'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

// Animation constants for consistency (300ms)
const ANIMATION_DURATION = 0.3
const ANIMATION_EASE = [0.25, 0.1, 0.25, 1] as const

interface PaginationLink {
  title: string
  href: string
}

interface PaginationProps {
  prev?: PaginationLink
  previous?: PaginationLink // Alias for backwards compatibility
  next?: PaginationLink
}

export function Pagination({ prev, previous, next }: PaginationProps) {
  // Support both 'prev' and 'previous' prop names for backwards compatibility
  const previousLink = prev || previous
  const prefersReducedMotion = useReducedMotion()

  if (!previousLink && !next) return null

  return (
    <motion.nav
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      aria-label="Page navigation"
      className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-12 border-t border-border/50 dark:border-slate-700/50"
    >
      {previousLink ? (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_DURATION, delay: 0.1 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          className="flex-1 sm:max-w-sm"
        >
          <Link
            href={previousLink.href}
            className={clsx(
              'group relative flex items-center gap-3 px-5 py-4 rounded-xl overflow-hidden',
              // Background with glassmorphism
              'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
              // Border
              'border border-border/50 dark:border-slate-700/50',
              // Shadow with brand glow on hover
              'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
              'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
              'hover:shadow-[0_4px_12px_rgba(99,102,241,0.1),0_8px_24px_rgba(99,102,241,0.08),0_0_30px_rgba(99,102,241,0.06)]',
              'dark:hover:shadow-[0_4px_12px_rgba(129,140,248,0.15),0_8px_24px_rgba(129,140,248,0.1),0_0_30px_rgba(129,140,248,0.1)]',
              // Transition
              'transition-all duration-300 ease-in-out',
              // Focus
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
            )}
            aria-label={`Previous page: ${previousLink.title}`}
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />
            <motion.div
              whileHover={prefersReducedMotion ? {} : { x: -3 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 shrink-0"
            >
              <ChevronLeft
                className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-300"
                aria-hidden="true"
              />
            </motion.div>
            <div className="relative z-10 flex-1 min-w-0">
              <div className="text-xs text-text-tertiary mb-1 font-medium uppercase tracking-wide">
                Previous
              </div>
              <div className="font-semibold text-text-primary truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                {previousLink.title}
              </div>
            </div>
          </Link>
        </motion.div>
      ) : (
        <div className="flex-1 hidden sm:block" aria-hidden="true" />
      )}

      {next ? (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_DURATION, delay: 0.1 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          className="flex-1 sm:max-w-sm sm:ml-auto"
        >
          <Link
            href={next.href}
            className={clsx(
              'group relative flex items-center gap-3 px-5 py-4 rounded-xl overflow-hidden',
              // Background with glassmorphism
              'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm',
              // Border
              'border border-border/50 dark:border-slate-700/50',
              // Shadow with brand glow on hover
              'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
              'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
              'hover:shadow-[0_4px_12px_rgba(99,102,241,0.1),0_8px_24px_rgba(99,102,241,0.08),0_0_30px_rgba(99,102,241,0.06)]',
              'dark:hover:shadow-[0_4px_12px_rgba(129,140,248,0.15),0_8px_24px_rgba(129,140,248,0.1),0_0_30px_rgba(129,140,248,0.1)]',
              // Transition
              'transition-all duration-300 ease-in-out',
              // Text alignment
              'text-right',
              // Focus
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
            )}
            aria-label={`Next page: ${next.title}`}
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex-1 min-w-0">
              <div className="text-xs text-text-tertiary mb-1 font-medium uppercase tracking-wide">
                Next
              </div>
              <div className="font-semibold text-text-primary truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                {next.title}
              </div>
            </div>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { x: 3 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 shrink-0"
            >
              <ChevronRight
                className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-300"
                aria-hidden="true"
              />
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        <div className="flex-1 hidden sm:block" aria-hidden="true" />
      )}
    </motion.nav>
  )
}
