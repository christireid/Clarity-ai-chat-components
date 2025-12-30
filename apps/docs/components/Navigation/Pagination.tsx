'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaginationProps {
  prev?: {
    title: string
    href: string
  }
  /** @deprecated Use prev instead */
  previous?: {
    title: string
    href: string
  }
  next?: {
    title: string
    href: string
  }
}

export function Pagination({
  prev: prevProp,
  previous,
  next,
}: PaginationProps) {
  // Support both 'prev' and 'previous' for backward compatibility
  const prev = prevProp ?? previous
  if (!prev && !next) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
      aria-label="Page navigation"
      className="flex justify-between gap-4 pt-8 mt-8 border-t border-border"
    >
      {prev ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 max-w-sm"
        >
          <Link
            href={prev.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all hover:shadow-md"
          >
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ duration: durations.normal }}
            >
              <ChevronLeft className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-text-tertiary mb-1 font-medium">
                Previous
              </div>
              <div className="font-semibold text-text-primary truncate group-hover:text-brand-500 transition-colors">
                {prev.title}
              </div>
            </div>
          </Link>
        </motion.div>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 max-w-sm"
        >
          <Link
            href={next.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all text-right hover:shadow-md"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-text-tertiary mb-1 font-medium">
                Next
              </div>
              <div className="font-semibold text-text-primary truncate group-hover:text-brand-500 transition-colors">
                {next.title}
              </div>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: durations.normal }}
            >
              <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        <div className="flex-1" />
      )}
    </motion.nav>
  )
}
