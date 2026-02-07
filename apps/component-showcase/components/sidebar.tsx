'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@clarity-chat/primitives'
import {
  MessageSquare,
  MessagesSquare,
  Brain,
  Wrench,
  Keyboard,
  Search,
  Coins,
  BarChart3,
  Code2,
  FileImage,
  Navigation,
  Bell,
  Lightbulb,
  Palette,
  Loader2,
  Quote,
  Layers,
  Home,
  ChevronDown,
  Sun,
  Moon,
  Copy,
  LayoutDashboard,
  Sparkles,
  Puzzle,
  Gamepad2,
  PieChart,
  Menu,
  X,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { openSearch } from './search-dialog'

interface NavCategory {
  name: string
  href: string
  icon: React.ReactNode
  description: string
  componentCount: number
}

const categories: NavCategory[] = [
  {
    name: 'Overview',
    href: '/',
    icon: <Home className="h-4 w-4" />,
    description: 'Component showcase home',
    componentCount: 0,
  },
  {
    name: 'Chat Components',
    href: '/chat',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Core chat components',
    componentCount: 15,
  },
  {
    name: 'Core Chat',
    href: '/core-chat',
    icon: <MessagesSquare className="h-4 w-4" />,
    description: 'Essential chat building blocks',
    componentCount: 12,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Message display and formatting',
    componentCount: 10,
  },
  {
    name: 'AI & Reasoning',
    href: '/ai-reasoning',
    icon: <Brain className="h-4 w-4" />,
    description: 'Thinking, agent, and AI components',
    componentCount: 15,
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: <Wrench className="h-4 w-4" />,
    description: 'Tool execution and approval',
    componentCount: 8,
  },
  {
    name: 'Input',
    href: '/input',
    icon: <Keyboard className="h-4 w-4" />,
    description: 'Chat input and voice input',
    componentCount: 12,
  },
  {
    name: 'Search & Filter',
    href: '/search',
    icon: <Search className="h-4 w-4" />,
    description: 'Search and filter components',
    componentCount: 10,
  },
  {
    name: 'Token Management',
    href: '/token-management',
    icon: <Coins className="h-4 w-4" />,
    description: 'Token counting and budget',
    componentCount: 8,
  },
  {
    name: 'Dashboards',
    href: '/dashboards',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Analytics dashboards',
    componentCount: 10,
  },
  {
    name: 'Code & Data',
    href: '/code-data',
    icon: <Code2 className="h-4 w-4" />,
    description: 'Code blocks and data display',
    componentCount: 8,
  },
  {
    name: 'Media & Files',
    href: '/media-files',
    icon: <FileImage className="h-4 w-4" />,
    description: 'File attachments and media',
    componentCount: 10,
  },
  {
    name: 'Navigation',
    href: '/navigation',
    icon: <Navigation className="h-4 w-4" />,
    description: 'Command palette and navigation',
    componentCount: 6,
  },
  {
    name: 'Feedback & Status',
    href: '/feedback-status',
    icon: <Bell className="h-4 w-4" />,
    description: 'Notifications and status',
    componentCount: 12,
  },
  {
    name: 'Suggestions',
    href: '/suggestions',
    icon: <Lightbulb className="h-4 w-4" />,
    description: 'Prompts and suggestions',
    componentCount: 6,
  },
  {
    name: 'Theme & Styling',
    href: '/theme',
    icon: <Palette className="h-4 w-4" />,
    description: 'Theme customization',
    componentCount: 4,
  },
  {
    name: 'Loading States',
    href: '/loading-states',
    icon: <Loader2 className="h-4 w-4" />,
    description: 'Skeletons and loading indicators',
    componentCount: 8,
  },
  {
    name: 'Citations',
    href: '/citations',
    icon: <Quote className="h-4 w-4" />,
    description: 'Citation and reference components',
    componentCount: 4,
  },
  {
    name: 'Primitives',
    href: '/primitives',
    icon: <Layers className="h-4 w-4" />,
    description: 'Base UI primitives',
    componentCount: 15,
  },
  {
    name: 'Features',
    href: '/features',
    icon: <Copy className="h-4 w-4" />,
    description: 'Advanced feature components',
    componentCount: 6,
  },
  {
    name: 'Clones',
    href: '/clones',
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: 'Full app clones and layouts',
    componentCount: 5,
  },
  {
    name: 'Hooks',
    href: '/hooks',
    icon: <Puzzle className="h-4 w-4" />,
    description: 'Custom React hooks for AI chat',
    componentCount: 200,
  },
  {
    name: 'Connected Demo',
    href: '/connected',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'Full connected chat interface',
    componentCount: 5,
  },
  {
    name: 'Playground',
    href: '/playground',
    icon: <Gamepad2 className="h-4 w-4" />,
    description: 'Interactive component playground',
    componentCount: 4,
  },
  {
    name: 'Stats',
    href: '/stats',
    icon: <PieChart className="h-4 w-4" />,
    description: 'Library health & metrics',
    componentCount: 0,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Sync state with the actual DOM class (set by layout.tsx inline script from localStorage)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    try {
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    } catch {
      // localStorage may be unavailable (private browsing, quota exceeded)
    }
  }

  const totalComponents = categories.reduce(
    (acc, cat) => acc + cat.componentCount,
    0
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border/50 shadow-sm md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-card flex flex-col transition-all duration-300',
          // Desktop: always visible, respects collapsed state
          'hidden md:flex',
          collapsed ? 'md:w-16' : 'md:w-64',
          // Mobile: overlay mode
          mobileOpen && '!flex w-64 z-50'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                CC
              </div>
              <div>
                <h1 className="font-semibold text-sm">Clarity Chat</h1>
                <p className="text-xs text-muted-foreground">
                  {totalComponents} components
                </p>
              </div>
            </div>
          )}
          {/* Close button on mobile, collapse on desktop */}
          <button
            onClick={() => {
              if (mobileOpen) {
                setMobileOpen(false)
              } else {
                setCollapsed(!collapsed)
              }
            }}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : collapsed
                  ? 'Expand sidebar'
                  : 'Collapse sidebar'
            }
            aria-expanded={mobileOpen ? true : !collapsed}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  collapsed ? '-rotate-90' : 'rotate-90'
                )}
              />
            )}
          </button>
        </div>

        {/* Search trigger */}
        <div className="px-2 pt-2 shrink-0">
          <button
            onClick={() => {
              setMobileOpen(false)
              openSearch()
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm',
              'border border-border/50 bg-muted/30 hover:bg-muted transition-colors text-muted-foreground'
            )}
            aria-label="Search components"
            title={collapsed && !mobileOpen ? 'Search (Cmd+K)' : undefined}
          >
            <Search className="h-4 w-4 shrink-0" />
            {(!collapsed || mobileOpen) && (
              <>
                <span className="flex-1 text-left">Search...</span>
                <kbd className="pointer-events-none hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">&#8984;</span>K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Component categories"
          className="flex-1 overflow-y-auto scrollbar-hidden p-2"
        >
          <ul className="space-y-1">
            {categories.map((category) => {
              const isActive = pathname === category.href
              return (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                    title={collapsed && !mobileOpen ? category.name : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {category.icon}
                    {(!collapsed || mobileOpen) && (
                      <div className="flex-1 flex items-center justify-between">
                        <span>{category.name}</span>
                        {category.componentCount > 0 && (
                          <span
                            className={cn(
                              'text-xs px-1.5 py-0.5 rounded',
                              isActive
                                ? 'bg-primary-foreground/20'
                                : 'bg-muted-foreground/20'
                            )}
                            aria-label={`${category.componentCount} components`}
                          >
                            {category.componentCount}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t p-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={
              collapsed && !mobileOpen
                ? isDark
                  ? 'Light mode'
                  : 'Dark mode'
                : undefined
            }
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {(!collapsed || mobileOpen) && (
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
