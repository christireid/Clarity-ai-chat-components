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
import { cn } from '@/lib/utils'

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
            <div className={cn(
              'relative bg-bg-primary/95 backdrop-blur-lg rounded-xl p-3',
              // Multi-layer shadow system with brand glow
              'shadow-[0_4px_12px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.08),0_0_40px_rgba(99,102,241,0.1)]',
              'dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25),0_0_40px_rgba(129,140,248,0.15)]'
            )}>
              {/* Gradient border */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.25) 50%, rgba(244,114,182,0.35) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex justify-around gap-2">
                {quickActions.map((action, i) =>
                  action.href ? (
                    <Link
                      key={i}
                      href={action.href}
                      onClick={() => setShowQuickActions(false)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 min-w-[64px] min-h-[64px] rounded-lg flex-1 justify-center',
                        'transition-all duration-300',
                        'hover:bg-brand-50 dark:hover:bg-brand-900/20',
                        'hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      )}
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
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 min-w-[64px] min-h-[64px] rounded-lg flex-1 justify-center',
                        'transition-all duration-300',
                        'hover:bg-brand-50 dark:hover:bg-brand-900/20',
                        'hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      )}
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
        <div className={cn(
          'bg-bg-primary/95 backdrop-blur-lg safe-area-bottom',
          // Multi-layer shadow on top
          'shadow-[0_-4px_12px_rgba(0,0,0,0.05),0_-8px_24px_rgba(0,0,0,0.04)]',
          'dark:shadow-[0_-4px_12px_rgba(0,0,0,0.2),0_-8px_24px_rgba(0,0,0,0.15)]',
          // Gradient top border
          'border-t border-transparent',
          'before:absolute before:inset-x-0 before:top-0 before:h-px',
          'before:bg-gradient-to-r before:from-transparent before:via-brand-500/30 before:to-transparent'
        )}>
          <div className="flex items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const active = item.isActive?.(pathname) ?? pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] min-h-[48px] rounded-lg justify-center',
                    'transition-all duration-300',
                    active
                      ? 'text-brand-500 bg-brand-500/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  <motion.div
                    animate={{ scale: active ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-[11px] font-medium">{item.label}</span>
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
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] min-h-[48px] rounded-lg justify-center',
                'transition-all duration-300',
                showQuickActions
                  ? 'text-brand-500 bg-brand-500/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              )}
            >
              <motion.div
                animate={{ rotate: showQuickActions ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.div>
              <span className="text-[11px] font-medium">More</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
