'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

// Animation constants for consistency (300ms)
const ANIMATION_DURATION = 0.3
const ANIMATION_EASE = [0.25, 0.1, 0.25, 1] as const

interface TocItem {
  title: string
  id: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isScrolling, setIsScrolling] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Improved scroll spy with better intersection logic
  useEffect(() => {
    if (items.length === 0) return

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
        rootMargin: '-10% 0% -60% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items, isScrolling])

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

  if (items.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      className="space-y-2"
    >
      <motion.h4
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION, delay: 0.1 }}
        className="font-semibold text-sm bg-gradient-to-r from-text-primary to-text-secondary dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-4"
      >
        On this page
      </motion.h4>
      <nav aria-label="Table of contents">
        <ul className="space-y-1" role="list">
          {items.map((item, index) => {
            const isActive = activeId === item.id

            return (
              <motion.li
                key={item.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: ANIMATION_DURATION,
                  delay: prefersReducedMotion ? 0 : 0.15 + index * 0.03,
                }}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={clsx(
                      'block text-sm py-1.5 pl-3 rounded-r-md relative',
                      // Transitions
                      'transition-all duration-300 ease-in-out',
                      // Border
                      'border-l-2',
                      // Active and hover states with dark mode support
                      isActive
                        ? [
                            'border-brand-500 dark:border-brand-400',
                            'text-brand-600 dark:text-brand-400',
                            'bg-gradient-to-r from-brand-50/80 to-brand-50/40 dark:from-brand-900/30 dark:to-brand-900/10',
                            'font-medium',
                            'shadow-[0_0_12px_rgba(99,102,241,0.1)] dark:shadow-[0_0_12px_rgba(129,140,248,0.15)]',
                          ]
                        : [
                            'border-transparent',
                            'text-text-secondary dark:text-slate-400',
                            'hover:text-text-primary dark:hover:text-slate-200',
                            'hover:border-brand-300/50 dark:hover:border-brand-700/50',
                            'hover:bg-bg-secondary/50 dark:hover:bg-slate-800/30',
                          ],
                      // Focus state
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1'
                    )}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span className="line-clamp-2">{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-brand-500 dark:bg-brand-400 rounded-full"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
      </nav>
    </motion.div>
  )
}
