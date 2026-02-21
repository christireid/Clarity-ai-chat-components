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
  MoreHorizontal,
  Keyboard,
  TrendingDown,
} from 'lucide-react'
import { SearchDialog } from './SearchDialog'
import { KeyboardShortcuts } from '@/components/Enhanced/KeyboardShortcuts'
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

// Token Optimization submenu
const tokenOptimizationNav = [
  { name: 'Quick Start', href: '/token-optimization', icon: Zap },
  { name: 'Hero Recipes', href: '/cookbook/token-optimization', icon: ChefHat },
  { name: 'API Reference', href: '/reference/components/token-optimization', icon: Library },
  { name: 'Cookbook', href: '/guides/token-optimization', icon: BookOpen },
  { name: 'Examples', href: '/examples/token-optimization', icon: Code2 },
  { name: 'ROI Calculator', href: '/tools/token-roi-calculator', icon: TrendingDown },
]

// Primary nav items - aligned with new IA structure
const primaryNav = [
  {
    name: 'Get Started',
    href: '/get-started',
    icon: GraduationCap,
    description: 'Quick start guide',
  },
  {
    name: 'Components',
    href: '/explore',
    icon: Play,
    description: 'Interactive demos',
  },
  {
    name: 'Token Optimization',
    href: '/token-optimization',
    icon: TrendingDown,
    description: 'Reduce AI costs by 50-90%',
    highlight: true,
    badge: '50-90% Savings',
    hasSubmenu: true,
    submenu: tokenOptimizationNav,
  },
  {
    name: 'API Reference',
    href: '/api',
    icon: Library,
    description: 'Complete API docs',
  },
]

// Secondary nav items in "More" dropdown
const moreNav = [
  { name: 'Build', href: '/build', icon: Map },
  { name: 'Playground', href: '/playground', icon: Code2 },
  { name: 'About', href: '/about', icon: BookOpen },
]

// Combined for mobile
const navigation = [...primaryNav, ...moreNav]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [tokenOptimizationOpen, setTokenOptimizationOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
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
      // Show keyboard shortcuts on ?
      if (e.key === '?' && !searchOpen) {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

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

  // Close more dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMoreOpen(false)
    if (moreOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [moreOpen])

  // Close token optimization dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setTokenOptimizationOpen(false)
    if (tokenOptimizationOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [tokenOptimizationOpen])

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-50 w-full border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl"
      >
        <nav
          className="container-docs"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex h-14 items-center gap-6">
            {/* Logo - compact with hover glow */}
            <Link
              href="/"
              className="group flex items-center gap-1.5 font-semibold text-base shrink-0"
            >
              <div className="relative">
                <BookOpen className="w-5 h-5 text-brand-500 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                <div
                  className="absolute inset-0 bg-brand-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-hidden="true"
                />
              </div>
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent whitespace-nowrap">
                Clarity Chat
              </span>
            </Link>

            {/* Desktop Navigation - elevated with icons */}
            <div className="hidden md:flex items-center gap-1">
              {primaryNav.map((item) => {
                const Icon = item.icon
                const isHighlight = 'highlight' in item && item.highlight
                const hasBadge = 'badge' in item && item.badge
                const hasSubmenu = 'hasSubmenu' in item && item.hasSubmenu
                const isActive = pathname?.startsWith(item.href)

                // Special handling for Token Optimization with dropdown
                if (hasSubmenu && 'submenu' in item) {
                  return (
                    <div key={item.name} className="relative">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          setTokenOptimizationOpen(!tokenOptimizationOpen)
                        }}
                        onMouseEnter={() => setTokenOptimizationOpen(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: durations.fast }}
                        aria-expanded={tokenOptimizationOpen}
                        aria-haspopup="menu"
                        className={clsx(
                          'group flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all rounded-lg whitespace-nowrap relative',
                          isHighlight
                            ? 'text-purple-700 dark:text-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50'
                            : isActive
                              ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        )}
                      >
                        <Icon
                          className={clsx(
                            'w-4 h-4 transition-transform group-hover:scale-110',
                            isHighlight && 'text-purple-600 dark:text-purple-400',
                            isActive && 'text-brand-500'
                          )}
                        />
                        <span>{item.name}</span>
                        {hasBadge && (
                          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </motion.button>

                      {/* Token Optimization Dropdown */}
                      <AnimatePresence>
                        {tokenOptimizationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: durations.fast, ease: 'easeOut' }}
                            onMouseLeave={() => setTokenOptimizationOpen(false)}
                            className="absolute top-full left-0 mt-2 py-2 bg-white dark:bg-neutral-900 border border-purple-200/80 dark:border-purple-800/80 rounded-xl shadow-xl shadow-purple-500/10 dark:shadow-purple-900/20 min-w-[220px] backdrop-blur-xl z-50"
                          >
                            {item.submenu?.map((subItem) => {
                              const SubIcon = subItem.icon
                              const isSubActive = pathname === subItem.href
                              return (
                                <motion.div
                                  key={subItem.name}
                                  whileHover={{ x: 2 }}
                                  transition={{ duration: durations.fast }}
                                >
                                  <Link
                                    href={subItem.href}
                                    onClick={() => setTokenOptimizationOpen(false)}
                                    className={clsx(
                                      'group flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all whitespace-nowrap',
                                      isSubActive
                                        ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:text-purple-700 dark:hover:text-purple-300'
                                    )}
                                  >
                                    <SubIcon className={clsx(
                                      'w-4 h-4 transition-all group-hover:scale-110',
                                      isSubActive ? 'text-purple-600 dark:text-purple-400' : 'text-neutral-400 group-hover:text-purple-500'
                                    )} />
                                    <span>{subItem.name}</span>
                                  </Link>
                                </motion.div>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                // Regular nav items without submenu
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: durations.fast }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={clsx(
                        'group flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all rounded-lg whitespace-nowrap relative',
                        isHighlight
                          ? 'text-purple-700 dark:text-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50'
                          : isActive
                            ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'w-4 h-4 transition-transform group-hover:scale-110',
                          isHighlight && 'text-purple-600 dark:text-purple-400',
                          isActive && 'text-brand-500'
                        )}
                      />
                      <span>{item.name}</span>
                      {hasBadge && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}

              {/* More dropdown - refined */}
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMoreOpen(!moreOpen)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Browse all sections"
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  className={clsx(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                    moreOpen
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: durations.fast, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 min-w-[160px] backdrop-blur-xl"
                    >
                      {moreNav.map((item) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.name}
                            whileHover={{ x: 2 }}
                            transition={{ duration: durations.fast }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setMoreOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-all whitespace-nowrap"
                            >
                              <Icon className="w-4 h-4 text-neutral-400 group-hover:text-brand-500 transition-colors group-hover:scale-110" />
                              <span>{item.name}</span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Spacer to push right items */}
            <div className="flex-1" />

            {/* Right actions - search and icons */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search - compact on right side with premium focus */}
              <button
                onClick={() => setSearchOpen(true)}
                className="group/search hidden sm:flex w-48 items-center gap-2 px-3 py-1.5 text-[13px] text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-lg hover:border-brand-300 dark:hover:border-brand-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:border-brand-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                aria-label="Search documentation (Press Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400 group-hover/search:text-brand-500 transition-colors" />
                <span className="flex-1 text-left truncate">Search...</span>
                <kbd className="text-[11px] text-neutral-400/80 bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 px-1.5 py-0.5 rounded font-medium group-hover/search:border-brand-300 dark:group-hover/search:border-brand-700 transition-colors">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label={`Theme: ${mounted ? theme : 'system'}`}
              >
                {getThemeIcon()}
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/christireid/Clarity-ai-chat-components"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Keyboard Shortcuts */}
              <button
                onClick={() => setShortcutsOpen(true)}
                className="hidden sm:flex p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {/* Accessibility - in More dropdown for cleaner nav */}
              <div className="hidden">
                <AccessibilityButton
                  onClick={() => setAccessibilityOpen(true)}
                />
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
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
                className="md:hidden overflow-hidden border-t border-border scrollbar-hide"
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
                  className="flex flex-col gap-2 py-4 max-h-[70vh] overflow-y-auto scrollbar-hide"
                >
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname?.startsWith(item.href)
                    const isHighlight = 'highlight' in item && item.highlight
                    const hasBadge = 'badge' in item && item.badge
                    const hasSubmenu = 'hasSubmenu' in item && item.hasSubmenu

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
                            'flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 relative',
                            isHighlight
                              ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                              : isActive
                                ? 'bg-bg-tertiary text-brand-500'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                          )}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span className="flex-1">{item.name}</span>
                          {hasBadge && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>

                        {/* Mobile submenu for Token Optimization */}
                        {hasSubmenu && 'submenu' in item && item.submenu && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.submenu.map((subItem) => {
                              const SubIcon = subItem.icon
                              const isSubActive = pathname === subItem.href
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={clsx(
                                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                                    isSubActive
                                      ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium'
                                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:text-purple-700 dark:hover:text-purple-300'
                                  )}
                                >
                                  <SubIcon className="w-3.5 h-3.5" />
                                  <span>{subItem.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
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

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Accessibility Menu */}
      <AccessibilityMenu
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  )
}
