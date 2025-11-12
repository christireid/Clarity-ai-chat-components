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
  Github,
  BookOpen
} from 'lucide-react'
import { SearchDialog } from './SearchDialog'
import clsx from 'clsx'

const navigation = [
  { name: 'Learn', href: '/learn' },
  { name: 'Reference', href: '/reference' },
  { name: 'Examples', href: '/examples' },
  { name: 'Blog', href: '/blog' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
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
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <BookOpen className="w-6 h-6 text-brand-500" />
                <span>Clarity Chat</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname?.startsWith(item.href)
                        ? 'bg-bg-tertiary text-brand-500'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-secondary hover:bg-bg-tertiary transition-colors text-sm text-text-secondary"
                aria-label="Search documentation"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-bg-primary px-1.5 font-mono text-xs">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label={`Current theme: ${theme}. Click to cycle through themes.`}
              >
                {getThemeIcon()}
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/clarity-chat/ui"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-down">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      pathname?.startsWith(item.href)
                        ? 'bg-bg-tertiary text-brand-500'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
