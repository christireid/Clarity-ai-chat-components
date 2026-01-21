/**
 * Collapsible Section Component
 *
 * Animated expand/collapse section with smooth height transitions.
 * Perfect for accordions, FAQ sections, and expandable list items.
 *
 * Accessibility features:
 * - aria-expanded on trigger
 * - aria-controls linking trigger to content
 * - Unique IDs for ARIA relationships
 * - Reduced motion support
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'

export interface CollapsibleSectionProps {
  /** Whether the section is open */
  open?: boolean
  /** Controlled open state */
  onOpenChange?: (open: boolean) => void
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Trigger element (button to toggle) */
  trigger: React.ReactNode
  /** Content to show/hide */
  children: React.ReactNode
  /** Custom CSS class for container */
  className?: string
  /** Custom CSS class for trigger */
  triggerClassName?: string
  /** Custom CSS class for content */
  contentClassName?: string
  /** Animation duration in seconds */
  duration?: number
  /** Disabled state */
  disabled?: boolean
  /** Unique ID for accessibility linking (auto-generated if not provided) */
  id?: string
}

/**
 * Collapsible section with smooth height animation
 */
export function CollapsibleSection({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  trigger,
  children,
  className,
  triggerClassName,
  contentClassName,
  duration = 0.3,
  disabled = false,
  id,
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const prefersReducedMotion = useReducedMotion()

  // Generate unique IDs for ARIA linking
  const generatedId = React.useId()
  const baseId = id || `collapsible-${generatedId}`
  const triggerId = `${baseId}-trigger`
  const contentId = `${baseId}-content`

  // Use instant animations when reduced motion is preferred
  const animationDuration = prefersReducedMotion ? 0 : duration

  const toggle = () => {
    if (disabled) return
    const newOpen = !isOpen
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <div
      className={cn('border border-border/40 rounded-lg shadow-sm', className)}
    >
      {/* Trigger */}
      <motion.button
        id={triggerId}
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'text-left font-medium transition-all duration-150 ease-out',
          'hover:bg-muted/40',
          'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          triggerClassName
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-disabled={disabled}
      >
        {trigger}

        {/* Chevron icon */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: animationDuration, ease: [0.4, 0, 0.2, 1] }}
          className="w-5 h-5 flex-shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={
              prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
            }
            animate={{ height: 'auto', opacity: 1 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{ duration: animationDuration, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'p-4 pt-0 border-t border-border/40',
                contentClassName
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Accordion - Multiple collapsible sections where only one can be open
 */
export interface AccordionProps {
  /** Accordion items */
  items: Array<{
    id: string
    trigger: React.ReactNode
    content: React.ReactNode
  }>
  /** Currently open item ID */
  openId?: string
  /** Callback when open item changes */
  onOpenChange?: (id: string | null) => void
  /** Default open item ID */
  defaultOpenId?: string
  /** Allow multiple items open at once */
  allowMultiple?: boolean
  /** Custom CSS class */
  className?: string
  /** Animation duration */
  duration?: number
}

export function Accordion({
  items,
  openId: controlledOpenId,
  onOpenChange,
  defaultOpenId,
  allowMultiple = false,
  className,
  duration = 0.3,
}: AccordionProps) {
  const [internalOpenId, setInternalOpenId] = React.useState<string | null>(
    defaultOpenId || null
  )
  const [multipleOpen, setMultipleOpen] = React.useState<Set<string>>(
    new Set(defaultOpenId ? [defaultOpenId] : [])
  )

  const openId =
    controlledOpenId !== undefined ? controlledOpenId : internalOpenId

  const handleToggle = (id: string) => {
    if (allowMultiple) {
      setMultipleOpen((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
    } else {
      const newId = openId === id ? null : id
      if (controlledOpenId === undefined) {
        setInternalOpenId(newId)
      }
      onOpenChange?.(newId)
    }
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      {items.map((item) => {
        const isOpen = allowMultiple
          ? multipleOpen.has(item.id)
          : openId === item.id

        return (
          <CollapsibleSection
            key={item.id}
            id={`accordion-${item.id}`}
            open={isOpen}
            onOpenChange={() => handleToggle(item.id)}
            trigger={item.trigger}
            duration={duration}
          >
            {item.content}
          </CollapsibleSection>
        )
      })}
    </div>
  )
}

Accordion.displayName = 'Accordion'

/**
 * Simple expandable list item
 */
export interface ExpandableListItemProps {
  /** Title */
  title: string
  /** Badge or extra info */
  badge?: React.ReactNode
  /** Icon */
  icon?: React.ReactNode
  /** Content to show when expanded */
  children: React.ReactNode
  /** Default open state */
  defaultOpen?: boolean
  /** Custom CSS class */
  className?: string
}

export function ExpandableListItem({
  title,
  badge,
  icon,
  children,
  defaultOpen = false,
  className,
}: ExpandableListItemProps) {
  return (
    <CollapsibleSection
      defaultOpen={defaultOpen}
      trigger={
        <div className="flex items-center gap-3.5 flex-1">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <span className="flex-1">{title}</span>
          {badge}
        </div>
      }
      className={className}
    >
      {children}
    </CollapsibleSection>
  )
}

ExpandableListItem.displayName = 'ExpandableListItem'
