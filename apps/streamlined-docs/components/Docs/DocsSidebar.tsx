'use client'

/**
 * DocsSidebar - Collapsible navigation tree for documentation
 *
 * Features:
 * - Collapsible sections
 * - Active state highlighting
 * - Nested navigation
 * - Search/filter
 * - Keyboard navigation
 * - Sticky positioning
 * - Dark mode support
 * - Fully accessible
 * - Responsive (mobile drawer)
 */

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  /** Display title */
  title: string
  /** URL path */
  href?: string
  /** Child items */
  items?: NavItem[]
  /** Is this item new? */
  isNew?: boolean
  /** Is this item experimental? */
  isExperimental?: boolean
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
}

export interface DocsSidebarProps {
  /** Navigation items */
  items: NavItem[]
  /** Additional CSS classes */
  className?: string
  /** Enable search/filter */
  enableSearch?: boolean
  /** Default expanded sections */
  defaultExpanded?: string[]
}

export function DocsSidebar({
  items,
  className,
  enableSearch = true,
  defaultExpanded = [],
}: DocsSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(defaultExpanded)
  )
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  // Auto-expand sections containing active page
  React.useEffect(() => {
    const newExpanded = new Set(expandedSections)

    const findAndExpandPath = (items: NavItem[], path: string[] = []): boolean => {
      for (const item of items) {
        const currentPath = [...path, item.title]

        if (item.href === pathname) {
          path.forEach((title) => newExpanded.add(title))
          return true
        }

        if (item.items && findAndExpandPath(item.items, currentPath)) {
          newExpanded.add(item.title)
          return true
        }
      }
      return false
    }

    findAndExpandPath(items)
    setExpandedSections(newExpanded)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSection = React.useCallback((title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }, [])

  const filterItems = React.useCallback(
    (items: NavItem[]): NavItem[] => {
      if (!searchQuery.trim()) return items

      const query = searchQuery.toLowerCase()

      return items.reduce((acc, item) => {
        const matchesTitle = item.title.toLowerCase().includes(query)
        const filteredChildren = item.items ? filterItems(item.items) : []

        if (matchesTitle || filteredChildren.length > 0) {
          acc.push({
            ...item,
            items: filteredChildren.length > 0 ? filteredChildren : item.items,
          })
        }

        return acc
      }, [] as NavItem[])
    },
    [searchQuery]
  )

  const filteredItems = React.useMemo(
    () => filterItems(items),
    [items, filterItems]
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Search */}
      {enableSearch && (
        <div className="px-4 py-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-9 pr-3 py-2 text-sm rounded-lg',
                'bg-muted/50 border border-border/50',
                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
                'placeholder:text-muted-foreground'
              )}
              aria-label="Search documentation"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Documentation navigation">
        {filteredItems.length > 0 ? (
          <NavItemsList
            items={filteredItems}
            pathname={pathname}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onItemClick={() => setIsMobileOpen(false)}
          />
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        )}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50',
          'p-2 rounded-lg bg-background border border-border shadow-lg',
          'hover:bg-muted transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:block',
          'w-64 shrink-0 sticky top-0 h-screen',
          'border-r border-border/50 bg-background',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'lg:hidden fixed inset-y-0 left-0 z-50',
                'w-80 max-w-[85vw]',
                'bg-background border-r border-border/50',
                'shadow-2xl'
              )}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h2 className="font-semibold text-foreground">Documentation</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'p-2 rounded-lg hover:bg-muted transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface NavItemsListProps {
  items: NavItem[]
  pathname: string
  expandedSections: Set<string>
  onToggleSection: (title: string) => void
  onItemClick: () => void
  level?: number
}

function NavItemsList({
  items,
  pathname,
  expandedSections,
  onToggleSection,
  onItemClick,
  level = 0,
}: NavItemsListProps) {
  return (
    <ul className="space-y-1" role="list">
      {items.map((item) => (
        <NavItemComponent
          key={item.title}
          item={item}
          pathname={pathname}
          isExpanded={expandedSections.has(item.title)}
          onToggleSection={onToggleSection}
          onItemClick={onItemClick}
          level={level}
        />
      ))}
    </ul>
  )
}

interface NavItemComponentProps {
  item: NavItem
  pathname: string
  isExpanded: boolean
  onToggleSection: (title: string) => void
  onItemClick: () => void
  level: number
}

function NavItemComponent({
  item,
  pathname,
  isExpanded,
  onToggleSection,
  onItemClick,
  level,
}: NavItemComponentProps) {
  const hasChildren = item.items && item.items.length > 0
  const isActive = item.href === pathname
  const Icon = item.icon

  const content = (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
        isActive
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
          : 'text-foreground hover:bg-muted',
        level > 0 && 'text-sm'
      )}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span className="flex-1 truncate">{item.title}</span>
      {item.isNew && (
        <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          New
        </span>
      )}
      {item.isExperimental && (
        <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Beta
        </span>
      )}
      {hasChildren && (
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </motion.div>
      )}
    </div>
  )

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => onToggleSection(item.title)}
            className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg"
            aria-expanded={isExpanded}
          >
            {content}
          </button>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <NavItemsList
                  items={item.items!}
                  pathname={pathname}
                  expandedSections={new Set()}
                  onToggleSection={onToggleSection}
                  onItemClick={onItemClick}
                  level={level + 1}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : item.href ? (
        <Link
          href={item.href}
          onClick={onItemClick}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg"
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </li>
  )
}
