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

// Primary nav items - aligned with new IA structure
const primaryNav = [
  { name: 'Get Started', href: '/get-started', icon: GraduationCap, description: 'Quick start guide' },
  { name: 'Components', href: '/explore', icon: Play, description: 'Interactive demos' },
  { name: 'API Reference', href: '/api', icon: Library, description: 'Complete API docs' },
]

// Secondary nav items in "More" dropdown
const moreNav = [
  { name: 'Build', href: '/build', icon: Map },
  { name: 'Playground', href: '/playground', icon: Code2 },
  { name: 'About', href: '/about', icon: BookOpen },
  { name: 'Contributing', href: '/contributing', icon: GitCompare },
]

// Combined for mobile
const navigation = [...primaryNav, ...moreNav]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
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

  // Close more dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMoreOpen(false)
    if (moreOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [moreOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <nav className="container-docs" aria-label="Main navigation">
          <div className="flex h-14 items-center gap-6">
            {/* Logo - compact with hover glow */}
            <Link
              href="/"
              className="group flex items-center gap-1.5 font-semibold text-base shrink-0"
            >
              <div className="relative">
                <BookOpen className="w-5 h-5 text-brand-500 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                <div className="absolute inset-0 bg-brand-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
              </div>
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent whitespace-nowrap">Clarity Chat</span>
            </Link>

            {/* Desktop Navigation - elevated with icons */}
            <div className="hidden md:flex items-center gap-1">
              {primaryNav.map((item) => {
                const Icon = item.icon
                const isHighlight = 'highlight' in item && item.highlight
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={pathname?.startsWith(item.href) ? 'page' : undefined}
                    className={clsx(
                      'flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium transition-all',
                      isHighlight
                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 rounded-full border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                        : pathname?.startsWith(item.href)
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', isHighlight && 'text-indigo-500 dark:text-indigo-400')} />
                    {item.name}
                  </Link>
                )
              })}

              {/* More dropdown - refined */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMoreOpen(!moreOpen)
                  }}
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
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 min-w-[160px] backdrop-blur-xl"
                    >
                      {moreNav.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 text-neutral-400" />
                            {item.name}
                          </Link>
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
                <kbd className="text-[11px] text-neutral-400/80 bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 px-1.5 py-0.5 rounded font-medium group-hover/search:border-brand-300 dark:group-hover/search:border-brand-700 transition-colors">⌘K</kbd>
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

              {/* Accessibility - in More dropdown for cleaner nav */}
              <div className="hidden">
                <AccessibilityButton onClick={() => setAccessibilityOpen(true)} />
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
