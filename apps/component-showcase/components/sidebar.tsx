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
} from 'lucide-react'
import { useState, useEffect } from 'react'

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
    description: 'Essential chat UI elements',
    componentCount: 8,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Message display components',
    componentCount: 12,
  },
  {
    name: 'Input',
    href: '/input',
    icon: <Keyboard className="h-4 w-4" />,
    description: 'Input and form components',
    componentCount: 10,
  },
  {
    name: 'AI Reasoning',
    href: '/ai-reasoning',
    icon: <Brain className="h-4 w-4" />,
    description: 'AI thinking and reasoning displays',
    componentCount: 8,
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: <Wrench className="h-4 w-4" />,
    description: 'Tool execution components',
    componentCount: 10,
  },
  {
    name: 'Search',
    href: '/search',
    icon: <Search className="h-4 w-4" />,
    description: 'Search and filter components',
    componentCount: 6,
  },
  {
    name: 'Token Management',
    href: '/token-management',
    icon: <Coins className="h-4 w-4" />,
    description: 'Token tracking and usage',
    componentCount: 5,
  },
  {
    name: 'Code & Data',
    href: '/code-data',
    icon: <Code2 className="h-4 w-4" />,
    description: 'Code display and data views',
    componentCount: 8,
  },
  {
    name: 'Media Files',
    href: '/media-files',
    icon: <FileImage className="h-4 w-4" />,
    description: 'File and media components',
    componentCount: 6,
  },
  {
    name: 'Navigation',
    href: '/navigation',
    icon: <Navigation className="h-4 w-4" />,
    description: 'Navigation and routing',
    componentCount: 5,
  },
  {
    name: 'Feedback & Status',
    href: '/feedback-status',
    icon: <Bell className="h-4 w-4" />,
    description: 'Feedback and status indicators',
    componentCount: 8,
  },
  {
    name: 'Suggestions',
    href: '/suggestions',
    icon: <Lightbulb className="h-4 w-4" />,
    description: 'Suggestion and prompt components',
    componentCount: 5,
  },
  {
    name: 'Theme',
    href: '/theme',
    icon: <Palette className="h-4 w-4" />,
    description: 'Theme and styling options',
    componentCount: 4,
  },
  {
    name: 'Loading States',
    href: '/loading-states',
    icon: <Loader2 className="h-4 w-4" />,
    description: 'Loading and skeleton components',
    componentCount: 6,
  },
  {
    name: 'Citations',
    href: '/citations',
    icon: <Quote className="h-4 w-4" />,
    description: 'Citation and reference displays',
    componentCount: 4,
  },
  {
    name: 'Primitives',
    href: '/primitives',
    icon: <Layers className="h-4 w-4" />,
    description: 'Base UI components',
    componentCount: 25,
  },
  {
    name: 'AI Clones',
    href: '/clones',
    icon: <Copy className="h-4 w-4" />,
    description: 'Full AI interface recreations',
    componentCount: 7,
  },
  {
    name: 'Dashboards',
    href: '/dashboards',
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: 'Analytics & management UIs',
    componentCount: 5,
  },
  {
    name: 'Features',
    href: '/features',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'Advanced code & workflow components',
    componentCount: 60,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  const totalComponents = categories.reduce(
    (acc, cat) => acc + cat.componentCount,
    0
  )

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
        {!collapsed && (
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
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed ? '-rotate-90' : 'rotate-90'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hidden p-2">
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
                  title={collapsed ? category.name : undefined}
                >
                  {category.icon}
                  {!collapsed && (
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
          title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  )
}
