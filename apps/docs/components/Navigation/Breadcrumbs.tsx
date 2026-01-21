'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { href, label }
  })

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1 text-sm text-text-secondary mb-8 flex-wrap',
        'px-3 py-2 -mx-3 rounded-lg',
        'bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-900/30',
        'transition-colors duration-300'
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className={cn(
            'inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg',
            'transition-all duration-300',
            'hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20',
            'hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]',
            'dark:hover:shadow-[0_0_12px_rgba(129,140,248,0.2)]'
          )}
          aria-label="Home"
        >
          <Home className="w-4 h-4" />
        </Link>
      </motion.div>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <Fragment key={crumb.href}>
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
              className="flex items-center"
            >
              <ChevronRight className="w-4 h-4 text-text-tertiary" />
            </motion.div>
            {isLast ? (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className="text-text-primary font-medium px-2 py-1"
              >
                {crumb.label}
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={crumb.href}
                  className={cn(
                    'group relative px-2 py-2 min-h-[44px] inline-flex items-center rounded-lg',
                    'transition-all duration-300',
                    'hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20',
                    'hover:shadow-[0_0_8px_rgba(99,102,241,0.1)]',
                    'dark:hover:shadow-[0_0_8px_rgba(129,140,248,0.15)]'
                  )}
                >
                  {crumb.label}
                  <motion.span
                    className="absolute bottom-1 left-2 right-2 h-px bg-gradient-to-r from-brand-400 to-purple-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: 'calc(100% - 16px)' }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            )}
          </Fragment>
        )
      })}
    </motion.nav>
  )
}
