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
} from 'lucide-react'
import { SearchDialog } from './SearchDialog'
import { AccessibilityButton } from '../Layout/AccessibilityMenu'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/lib/toast'

const navigation = [
  { name: 'Demos', href: '/demos' },
  { name: 'Learn', href: '/learn/quick-start' },
  { name: 'Guides', href: '/guides' },
  { name: 'Reference', href: '/reference/components' },
  { name: 'Cookbook', href: '/cookbook' },
  { name: 'Examples', href: '/examples' },
  { name: 'Compare', href: '/compare' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <nav className="container-docs" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2 font-bold text-xl"
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
                      className={clsx(
                        'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-secondary hover:bg-bg-tertiary transition-colors text-sm text-text-secondary hover:shadow-sm"
                aria-label="Search documentation"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-bg-primary px-1.5 font-mono text-xs">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </motion.button>

              {/* Mobile Search */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="sm:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={cycleTheme}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="Cycle through themes: light, dark, and system"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: durations.normal }}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="View on GitHub"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="Toggle mobile menu"
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
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: durations.moderate,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="md:hidden overflow-hidden border-t border-border"
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
                  {navigation.map((item) => (
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
                        className={clsx(
                          'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          pathname?.startsWith(item.href)
                            ? 'bg-bg-tertiary text-brand-500'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
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
