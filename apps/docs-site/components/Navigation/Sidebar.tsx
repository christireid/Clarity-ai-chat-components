'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

interface SidebarProps {
  navigation: NavItem[]
}

function NavGroup({ item, level = 0 }: { item: NavItem; level?: number }) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const hasChildren = item.items && item.items.length > 0

  const isActive = pathname === item.href
  const isParentActive = item.items?.some((child) => pathname === child.href)

  if (!hasChildren && item.href) {
    // Leaf node (link)
    return (
      <Link
        href={item.href}
        className={clsx(
          'block px-3 py-2 rounded-md text-sm transition-colors',
          level === 0 && 'font-medium',
          level > 0 && 'ml-4',
          isActive
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
        )}
      >
        {item.title}
      </Link>
    )
  }

  // Group node (collapsible)
  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={clsx(
            'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors',
            level === 0 && 'font-semibold',
            level > 0 && 'ml-4',
            isActive || isParentActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-text-primary hover:bg-bg-secondary'
          )}
        >
          <span>{item.title}</span>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
              className="p-1 hover:bg-bg-tertiary rounded"
            >
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors text-left',
            level === 0 && 'font-semibold',
            level > 0 && 'ml-4',
            isParentActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-text-primary hover:bg-bg-secondary'
          )}
        >
          <span>{item.title}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {isOpen && hasChildren && (
        <div className="mt-1 space-y-1">
          {item.items!.map((child, index) => (
            <NavGroup key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ navigation }: SidebarProps) {
  return (
    <nav className="space-y-1" aria-label="Documentation navigation">
      {navigation.map((item, index) => (
        <NavGroup key={index} item={item} />
      ))}
    </nav>
  )
}
