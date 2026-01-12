'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Search,
  ExternalLink,
  BookOpen,
  Play,
  GraduationCap,
  Map,
  Library,
  ChefHat,
  Code2,
  GitCompare,
} from 'lucide-react'
import { SearchDialog } from './SearchDialog'
import {
  AccessibilityButton,
  AccessibilityMenu,
} from '../Layout/AccessibilityMenu'
import clsx from 'clsx'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { toast } from '@/lib/toast'
import { durations } from '@/lib/animations'

// Animation constants for consistency (300ms)
const ANIMATION_DURATION = 0.3
const ANIMATION_EASE = [0.25, 0.1, 0.25, 1] as const

const navigation = [
  { name: 'Demos', href: '/demos', icon: Play },
  { name: 'Learn', href: '/learn/quick-start', icon: GraduationCap },
  { name: 'Guides', href: '/guides', icon: Map },
  { name: 'Reference', href: '/reference/components', icon: Library },
  { name: 'Cookbook', href: '/cookbook', icon: ChefHat },
  { name: 'Examples', href: '/examples', icon: Code2 },
  { name: 'Compare', href: '/compare', icon: GitCompare },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const cycleTheme = () => {
    let newTheme: string
    if (theme === 'light') {
      newTheme = 'dark'
      setTheme('dark')
    } else if (theme === 'dark') {
      newTheme = 'system'
      setTheme('system')
    } else {
      newTheme = 'light'
      setTheme('light')
    }

    const themeIcons = {
      light: '☀️',
      dark: '🌙',
      system: '💻',
    }

    toast.success(
      `Theme: ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`,
      {
        description: `Switched to ${themeIcons[newTheme as keyof typeof themeIcons]} ${newTheme} mode`,
        duration: durations.slower,
      }
    )
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="w-5 h-5" />
    if (theme === 'light') return <Sun className="w-5 h-5" />
    if (theme === 'dark') return <Moon className="w-5 h-5" />
    return <Monitor className="w-5 h-5" />
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-[var(--glass-medium-bg)] backdrop-blur-[var(--glass-medium-blur)] backdrop-saturate-150 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)] border-[var(--glass-border-subtle)] transition-all duration-300">
        <nav className="container-docs" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2 font-bold text-xl min-h-[44px]"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <BookOpen className="w-6 h-6 text-brand-500" />
                </motion.div>
                <span className="group-hover:text-brand-500 transition-colors">
                  Clarity Chat
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: durations.moderate,
                      delay: index * 0.05,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname?.startsWith(item.href) ? 'page' : undefined}
                      className={clsx(
                        'relative px-4 py-2 min-h-[44px] flex items-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                        pathname?.startsWith(item.href)
                          ? 'bg-bg-tertiary text-brand-500'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                      )}
                    >
                      {item.name}
                      {!pathname?.startsWith(item.href) && (
                        <motion.span
                          className="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-500"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: durations.normal }}
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={clsx(
                  'hidden sm:flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg',
                  'border border-border/50 dark:border-slate-700/50',
                  'bg-bg-secondary/80 dark:bg-slate-800/50',
                  'hover:bg-bg-tertiary dark:hover:bg-slate-700/50',
                  'text-sm text-text-secondary hover:text-text-primary',
                  'transition-all duration-300 ease-in-out',
                  'hover:shadow-sm hover:border-brand-500/30',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
                )}
                aria-label="Search documentation (Press Cmd+K)"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:inline">Search docs...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 dark:border-slate-600 bg-bg-primary dark:bg-slate-800 px-1.5 font-mono text-xs text-text-tertiary">
                  <span className="text-xs">Cmd</span>K
                </kbd>
              </motion.button>

              {/* Mobile Search */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                className={clsx(
                  'sm:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg',
                  'hover:bg-bg-secondary dark:hover:bg-slate-800',
                  'transition-colors duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                )}
                aria-label="Search documentation"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={cycleTheme}
                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 15 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                className={clsx(
                  'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg',
                  'hover:bg-bg-secondary dark:hover:bg-slate-800',
                  'transition-colors duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                )}
                aria-label={`Current theme: ${mounted ? theme : 'system'}. Click to cycle through themes: light, dark, and system`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mounted ? theme : 'loading'}
                    initial={prefersReducedMotion ? {} : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                    transition={{ duration: ANIMATION_DURATION }}
                  >
                    {getThemeIcon()}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Accessibility Menu */}
              <AccessibilityButton onClick={() => setAccessibilityOpen(true)} />

              {/* GitHub */}
              <motion.a
                href="https://github.com/christireid/Clarity-ai-chat-components"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                className={clsx(
                  'hidden sm:flex p-2.5 min-w-[44px] min-h-[44px] items-center justify-center rounded-lg',
                  'hover:bg-bg-secondary dark:hover:bg-slate-800',
                  'transition-colors duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                )}
                aria-label="View project on GitHub (opens in new tab)"
              >
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
              </motion.a>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: durations.normal }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: durations.normal }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: durations.moderate,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="md:hidden overflow-hidden border-t border-border"
                role="navigation"
                aria-label="Mobile navigation"
              >
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="flex flex-col gap-2 py-4"
                >
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname?.startsWith(item.href)
                    return (
                      <motion.div
                        key={item.name}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                            isActive
                              ? 'bg-bg-tertiary text-brand-500'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                          )}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Accessibility Menu */}
      <AccessibilityMenu
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  )
}
