'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

interface SidebarProps {
  navigation: NavItem[]
  onNavigate?: () => void // Callback for mobile sidebar close on navigation
}

// Animation duration constant for consistency (300ms)
const ANIMATION_DURATION = 0.3
const ANIMATION_EASE = [0.25, 0.1, 0.25, 1] as const

// Recursive function to check if any descendant is active
function hasActiveDescendant(item: NavItem, pathname: string): boolean {
  if (item.href === pathname) return true
  if (item.items) {
    return item.items.some((child) => hasActiveDescendant(child, pathname))
  }
  return false
}

function NavGroup({
  item,
  level = 0,
  onNavigate
}: {
  item: NavItem
  level?: number
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const hasChildren = item.items && item.items.length > 0

  const isActive = pathname === item.href
  const isParentActive = hasActiveDescendant(item, pathname)

  // Initialize open state based on whether item has active descendants
  const [isOpen, setIsOpen] = useState(() => isParentActive || level === 0)

  // Auto-open parent if child is active (handles navigation changes)
  useEffect(() => {
    if (isParentActive && !isOpen) {
      setIsOpen(true)
    }
  }, [isParentActive, isOpen])

  // Handle link click for mobile navigation
  const handleLinkClick = useCallback(() => {
    onNavigate?.()
  }, [onNavigate])

  // Calculate proper indentation based on nesting level
  const indentPadding = level > 0 ? `${level * 12}px` : '0'

  if (!hasChildren && item.href) {
    // Leaf node (link) with animations
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      >
        <Link
          href={item.href}
          onClick={handleLinkClick}
          className={cn(
            'block px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm',
            // Smooth 300ms transitions for all properties
            'transition-all duration-300 ease-in-out',
            // Subtle scale effect
            'hover:scale-[1.02] active:scale-[0.98]',
            // Font weight based on level
            level === 0 && 'font-medium',
            // Text overflow handling
            'truncate',
            // Active state with enhanced visibility
            isActive
              ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 font-medium shadow-[0_2px_8px_rgba(99,102,241,0.15)] dark:shadow-[0_2px_8px_rgba(129,140,248,0.2)]'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:hover:bg-slate-800/50 hover:shadow-sm'
          )}
          style={{ marginLeft: indentPadding }}
          title={item.title} // Show full title on hover for truncated text
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
          onClick={handleLinkClick}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 min-h-[44px] rounded-lg text-sm',
            // Smooth 300ms transitions
            'transition-all duration-300 ease-in-out',
            'hover:scale-[1.01] active:scale-[0.99]',
            level === 0 && 'font-semibold',
            // Active/parent active states
            isActive
              ? 'text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30 shadow-[0_2px_8px_rgba(99,102,241,0.12)] dark:shadow-[0_2px_8px_rgba(129,140,248,0.15)]'
              : isParentActive
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
                : 'text-text-primary hover:bg-bg-secondary dark:hover:bg-slate-800/50 hover:shadow-sm'
          )}
          style={{ marginLeft: indentPadding }}
        >
          <span className="truncate flex-1 mr-2" title={item.title}>
            {item.title}
          </span>
          {hasChildren && (
            <motion.button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className={cn(
                'p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md shrink-0',
                'transition-colors duration-300 ease-in-out',
                'hover:bg-bg-tertiary dark:hover:bg-slate-700/50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              )}
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
              aria-expanded={isOpen}
            >
              <motion.div
                animate={{ rotate: isOpen ? 0 : -90 }}
                transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </Link>
      ) : (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 min-h-[44px] rounded-lg text-sm text-left',
            // Smooth 300ms transitions
            'transition-all duration-300 ease-in-out',
            'hover:scale-[1.01] active:scale-[0.99]',
            level === 0 && 'font-semibold',
            // Parent active state
            isParentActive
              ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
              : 'text-text-primary hover:bg-bg-secondary dark:hover:bg-slate-800/50',
            // Focus state
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
          )}
          style={{ marginLeft: indentPadding }}
          whileHover={prefersReducedMotion ? {} : { x: 2 }}
          aria-label={`${item.title} section`}
          aria-expanded={isOpen}
        >
          <span className="truncate flex-1 mr-2" title={item.title}>
            {item.title}
          </span>
          <motion.div
            className="shrink-0"
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5 border-l-2 border-border/30 dark:border-slate-700/50 ml-3 pl-2">
              {item.items!.map((child, index) => (
                <motion.div
                  key={child.href || child.title || index}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : index * 0.03,
                    duration: ANIMATION_DURATION
                  }}
                >
                  <NavGroup item={child} level={level + 1} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({ navigation, onNavigate }: SidebarProps) {
  return (
    <nav
      className="space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      aria-label="Documentation navigation"
    >
      {navigation.map((item, index) => (
        <NavGroup
          key={item.href || item.title || index}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
