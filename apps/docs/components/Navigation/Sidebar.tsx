'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Auto-open parent if child is active
  useEffect(() => {
    if (isParentActive && !isOpen) {
      setIsOpen(true)
    }
  }, [isParentActive, isOpen])

  if (!hasChildren && item.href) {
    // Leaf node (link) with animations
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={item.href}
          className={clsx(
            'block px-3 py-2 rounded-lg text-sm transition-all',
            'hover:scale-[1.02] active:scale-[0.98]',
            level === 0 && 'font-medium',
            level > 0 && 'ml-4',
            isActive
              ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
          )}
        >
          {item.title}
        </Link>
      </motion.div>
    )
  }

  // Group node (collapsible) with animations
  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={clsx(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all',
            'hover:scale-[1.01] active:scale-[0.99]',
            level === 0 && 'font-semibold',
            level > 0 && 'ml-4',
            isActive || isParentActive
              ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
              : 'text-text-primary hover:bg-bg-secondary'
          )}
        >
          <span>{item.title}</span>
          {hasChildren && (
            <motion.button
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
              className="p-1 hover:bg-bg-tertiary rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
              aria-expanded={isOpen}
            >
              <motion.div
                animate={{ rotate: isOpen ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </Link>
      ) : (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all text-left',
            'hover:scale-[1.01] active:scale-[0.99]',
            level === 0 && 'font-semibold',
            level > 0 && 'ml-4',
            isParentActive
              ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
              : 'text-text-primary hover:bg-bg-secondary'
          )}
          whileHover={{ x: 2 }}
          aria-label={`${item.title} section`}
          aria-expanded={isOpen}
        >
          <span>{item.title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.items!.map((child, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <NavGroup item={child} level={level + 1} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
