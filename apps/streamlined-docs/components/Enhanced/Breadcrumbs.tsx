'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BreadcrumbsProps {
  className?: string
  homeLabel?: string
  separator?: React.ReactNode
}

// Route label mapping for better display names
const routeLabels: Record<string, string> = {
  'get-started': 'Get Started',
  'explore': 'Explore',
  'api': 'API Reference',
  'build': 'Build',
  'playground': 'Playground',
  'about': 'About',
  'contributing': 'Contributing',
  'changelog': 'Changelog',
  'license': 'License',
  'demos': 'Demos',
  'examples': 'Examples',
  'recipes': 'Recipes',
  'components': 'Components',
  'hooks': 'Hooks',
  'utilities': 'Utilities',
  'guides': 'Guides',
  'tutorials': 'Tutorials',
}

export function Breadcrumbs({
  className,
  homeLabel = 'Home',
  separator = <ChevronRight className="w-4 h-4" />,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage
  if (!pathname || pathname === '/') {
    return null
  }

  // Parse pathname into segments
  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const breadcrumbs = [
    {
      label: homeLabel,
      href: '/',
      icon: <Home className="w-3.5 h-3.5" />,
    },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = routeLabels[segment] || formatSegment(segment)
      return { label, href }
    }),
  ]

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 overflow-x-auto',
        'scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700',
        className
      )}
    >
      <ol className="flex items-center gap-2 min-w-0">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          const isFirst = index === 0

          return (
            <motion.li
              key={crumb.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              {isLast ? (
                <span
                  className="font-medium text-neutral-900 dark:text-white truncate"
                  aria-current="page"
                >
                  {isFirst && crumb.icon && (
                    <span className="inline-flex items-center gap-1.5">
                      {crumb.icon}
                      {crumb.label}
                    </span>
                  )}
                  {!isFirst && crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className={cn(
                      'hover:text-brand-500 dark:hover:text-brand-400 transition-colors truncate',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1 -mx-1'
                    )}
                  >
                    {isFirst && crumb.icon ? (
                      <span className="inline-flex items-center gap-1.5">
                        {crumb.icon}
                        <span className="hidden sm:inline">{crumb.label}</span>
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </Link>
                  <span
                    className="text-neutral-400 dark:text-neutral-600 flex-shrink-0"
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                </>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

// Format segment for display (kebab-case to Title Case)
function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Collapsed breadcrumbs for mobile (shows only last 2 items)
export function CollapsedBreadcrumbs(props: BreadcrumbsProps) {
  const pathname = usePathname()

  if (!pathname || pathname === '/') {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)

  // Show only last 2 segments on mobile
  if (segments.length <= 2) {
    return <Breadcrumbs {...props} />
  }

  const lastTwo = segments.slice(-2)
  const remaining = segments.length - 2

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400',
        props.className
      )}
    >
      <Link
        href="/"
        className="hover:text-brand-500 transition-colors"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
      <button
        className="text-neutral-500 hover:text-brand-500 transition-colors"
        aria-label={`Show ${remaining} hidden breadcrumb items`}
      >
        •••
      </button>
      <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
      {lastTwo.map((segment, index) => {
        const href = '/' + segments.slice(0, segments.length - lastTwo.length + index + 1).join('/')
        const label = routeLabels[segment] || formatSegment(segment)
        const isLast = index === lastTwo.length - 1

        return (
          <span key={href} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-medium text-neutral-900 dark:text-white" aria-current="page">
                {label}
              </span>
            ) : (
              <>
                <Link href={href} className="hover:text-brand-500 transition-colors">
                  {label}
                </Link>
                <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
              </>
            )}
          </span>
        )
      })}
    </nav>
  )
}
