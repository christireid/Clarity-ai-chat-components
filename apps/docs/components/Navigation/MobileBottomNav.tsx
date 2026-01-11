'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Code2,
  Search,
  Menu,
  ChevronUp,
  Rocket,
  FileCode,
  Lightbulb,
} from 'lucide-react'
import clsx from 'clsx'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: 'Home',
    href: '/',
    isActive: (p) => p === '/',
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    label: 'Start',
    href: '/learn/quick-start',
    isActive: (p) => p.includes('/learn'),
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    label: 'API',
    href: '/reference/components',
    isActive: (p) => p.includes('/reference'),
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    label: 'Examples',
    href: '/examples',
    isActive: (p) => p.includes('/examples') || p.includes('/cookbook'),
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [showQuickActions, setShowQuickActions] = useState(false)

  // Use refs to avoid re-creating scroll handler on every scroll
  const lastScrollYRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      // Skip if we're already processing a scroll event
      if (ticking.current) return

      ticking.current = true
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const lastScrollY = lastScrollYRef.current

        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
          setShowQuickActions(false)
        } else {
          setIsVisible(true)
        }

        lastScrollYRef.current = currentScrollY
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // Empty deps - stable handler

  const quickActions = [
    {
      icon: <Search className="w-4 h-4" />,
      label: 'Search',
      action: () => {
        // Trigger search dialog
        document.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'k', metaKey: true })
        )
      },
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Guides',
      href: '/guides',
    },
    {
      icon: <FileCode className="w-4 h-4" />,
      label: 'Hooks',
      href: '/reference/hooks',
    },
  ]

  return (
    <>
      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-bg-primary/95 backdrop-blur-lg border border-border rounded-xl p-3 shadow-xl">
              <div className="flex justify-around gap-2">
                {quickActions.map((action, i) =>
                  action.href ? (
                    <Link
                      key={i}
                      href={action.href}
                      onClick={() => setShowQuickActions(false)}
                      className="flex flex-col items-center gap-1 p-3 min-w-[64px] min-h-[64px] rounded-lg hover:bg-bg-secondary transition-colors flex-1 justify-center"
                    >
                      <span className="text-brand-500">{action.icon}</span>
                      <span className="text-xs text-text-secondary">
                        {action.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={i}
                      onClick={() => {
                        action.action?.()
                        setShowQuickActions(false)
                      }}
                      className="flex flex-col items-center gap-1 p-3 min-w-[64px] min-h-[64px] rounded-lg hover:bg-bg-secondary transition-colors flex-1 justify-center"
                    >
                      <span className="text-brand-500">{action.icon}</span>
                      <span className="text-xs text-text-secondary">
                        {action.label}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="bg-bg-primary/95 backdrop-blur-lg border-t border-border shadow-lg safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const active = item.isActive?.(pathname) ?? pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] min-h-[48px] rounded-lg transition-all justify-center',
                    active
                      ? 'text-brand-500 bg-brand-500/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  <motion.div
                    animate={{ scale: active ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 w-8 h-0.5 bg-brand-500 rounded-full"
                    />
                  )}
                </Link>
              )
            })}

            {/* More button */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] min-h-[48px] rounded-lg transition-all justify-center',
                showQuickActions
                  ? 'text-brand-500 bg-brand-500/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              )}
            >
              <motion.div
                animate={{ rotate: showQuickActions ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
