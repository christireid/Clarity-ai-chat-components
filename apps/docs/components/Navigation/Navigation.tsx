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
  Zap,
  ChevronDown,
  Sparkles,
  Palette,
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

// Primary navigation - always visible
const primaryNavigation = [
  { name: 'Token Optimization', href: '/tools/roi-calculator', icon: Zap, highlight: true },
  { name: 'Showcase', href: '/showcase', icon: Sparkles },
  { name: 'Learn', href: '/learn/quick-start', icon: GraduationCap },
  { name: 'Reference', href: '/reference/components', icon: Library },
]

// Secondary navigation - in dropdown
const secondaryNavigation = [
  { name: 'Examples', href: '/examples', icon: Code2 },
  { name: 'Cookbook', href: '/cookbook', icon: ChefHat },
  { name: 'Themes', href: '/demos/theming', icon: Palette },
  { name: 'Compare', href: '/compare', icon: GitCompare },
]

// All navigation for mobile
const navigation = [...primaryNavigation, ...secondaryNavigation]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

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
      `${themeIcons[newTheme as keyof typeof themeIcons]} Switched to ${newTheme} mode`,
      {
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
              <div className="hidden lg:flex items-center gap-2">
                {/* Primary Navigation Items */}
                {primaryNavigation.map((item, index) => (
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
                        'relative px-4 py-2 min-h-[44px] flex items-center gap-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                        pathname?.startsWith(item.href)
                          ? 'bg-bg-tertiary text-brand-500'
                          : 'highlight' in item && item.highlight
                          ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* More Dropdown */}
                <div className="relative" data-dropdown>
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      'relative px-4 py-2 min-h-[44px] flex items-center gap-1 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      dropdownOpen
                        ? 'bg-bg-tertiary text-brand-500'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    )}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    More
                    <ChevronDown className={clsx('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')} />
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-bg-primary border border-border shadow-lg overflow-hidden z-50"
                      >
                        <div className="py-2">
                          {secondaryNavigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname?.startsWith(item.href)
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setDropdownOpen(false)}
                                className={clsx(
                                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                                  isActive
                                    ? 'bg-bg-secondary text-brand-500'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                {item.name}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={clsx(
                  'hidden sm:flex items-center gap-2 px-4 py-2 min-h-[44px] min-w-[180px] rounded-lg',
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
                <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">Search docs...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 dark:border-slate-600 bg-bg-primary dark:bg-slate-800 px-1.5 font-mono text-xs text-text-tertiary flex-shrink-0">
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
                className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                className="lg:hidden overflow-hidden border-t border-border"
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
