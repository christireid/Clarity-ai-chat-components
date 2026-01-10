'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

// Animation constants for consistency (300ms)
const ANIMATION_DURATION = 0.3
const ANIMATION_EASE = [0.25, 0.1, 0.25, 1] as const

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings?: Heading[]
  className?: string
}

export function TableOfContents({
  headings: propHeadings,
  className,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isScrolling, setIsScrolling] = useState(false)
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect headings on mount and pathname change
  useEffect(() => {
    if (propHeadings) {
      setHeadings(propHeadings)
      return
    }

    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      // Auto-detect headings from the page
      const headingElements = document.querySelectorAll('h2, h3, h4')
      const detectedHeadings: Heading[] = Array.from(headingElements)
        .map((el) => {
          // Generate ID if not present
          const id =
            el.id ||
            el.textContent
              ?.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .trim() ||
            ''
          if (!el.id && id) {
            el.id = id
          }
          return {
            id,
            text: el.textContent?.trim() || '',
            level: parseInt(el.tagName.charAt(1), 10),
          }
        })
        .filter((h) => h.id && h.text) // Filter out empty headings

      setHeadings(detectedHeadings)

      // Set initial active heading based on URL hash
      if (window.location.hash) {
        const hash = window.location.hash.slice(1)
        if (detectedHeadings.some((h) => h.id === hash)) {
          setActiveId(hash)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [propHeadings, pathname])

  // Improved scroll spy with better intersection logic
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update during programmatic scrolling
        if (isScrolling) return

        // Find the first intersecting entry (topmost visible heading)
        const intersectingEntries = entries.filter((e) => e.isIntersecting)

        if (intersectingEntries.length > 0) {
          // Sort by position and take the topmost
          const sortedEntries = intersectingEntries.sort((a, b) => {
            const aRect = a.boundingClientRect
            const bRect = b.boundingClientRect
            return aRect.top - bRect.top
          })
          setActiveId(sortedEntries[0].target.id)
        }
      },
      {
        // Adjusted rootMargin for better scroll spy accuracy
        // Top: -10% to account for header, Bottom: -60% to trigger before fully visible
        rootMargin: '-10% 0% -60% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings, isScrolling])

  // Handle heading click with smooth scroll
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        // Set scrolling state to prevent scroll spy updates
        setIsScrolling(true)
        setActiveId(id)

        // Scroll to element with offset for sticky header
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })

        // Update URL without scrolling
        window.history.pushState(null, '', `#${id}`)

        // Reset scrolling state after animation completes
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
        }, 500)
      }
    },
    [prefersReducedMotion]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <motion.nav
      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      className={clsx(
        'sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden',
        'hidden xl:block w-56 shrink-0',
        'text-sm pl-6',
        // Border with dark mode support
        'border-l border-border/30 dark:border-slate-700/30',
        // Custom scrollbar
        'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
        className
      )}
      aria-label="Table of contents"
    >
      <div className="mb-4 pr-2">
        <h3 className="text-xs font-semibold text-text-tertiary dark:text-slate-400 uppercase tracking-wider mb-4">
          On this page
        </h3>
        <ul className="space-y-0.5" role="list">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id

            return (
              <motion.li
                key={heading.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: ANIMATION_DURATION,
                  delay: prefersReducedMotion ? 0 : index * 0.03,
                }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={clsx(
                    'block py-1.5 px-3 rounded-md relative',
                    // Transitions
                    'transition-all duration-300 ease-in-out',
                    // Level-based indentation
                    heading.level === 2 && 'font-medium',
                    heading.level === 3 && 'ml-3 text-[13px]',
                    heading.level === 4 && 'ml-6 text-xs',
                    // Active and hover states with dark mode support
                    isActive
                      ? [
                          'text-brand-600 dark:text-brand-400',
                          'bg-brand-50 dark:bg-brand-900/20',
                          'font-medium',
                        ]
                      : [
                          'text-text-secondary dark:text-slate-400',
                          'hover:text-text-primary dark:hover:text-slate-200',
                          'hover:bg-bg-secondary dark:hover:bg-slate-800/50',
                        ],
                    // Focus state
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1'
                  )}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.span
                      layoutId="toc-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-brand-500 dark:bg-brand-400 rounded-full"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="line-clamp-2">{heading.text}</span>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.nav>
  )
}
