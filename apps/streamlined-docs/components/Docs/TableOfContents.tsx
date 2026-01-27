'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Table of Contents Item
 */
export interface TocItem {
  id: string
  title: string
  children?: TocItem[]
}

/**
 * TableOfContents - Sticky sidebar navigation with active section highlighting
 *
 * Extracted from chat-window/page.tsx. Uses Intersection Observer to track
 * which section is currently visible and highlights it in the TOC.
 *
 * @example
 * ```tsx
 * const tableOfContents: TocItem[] = [
 *   { id: 'overview', title: 'Overview' },
 *   {
 *     id: 'props',
 *     title: 'Props',
 *     children: [
 *       { id: 'core-props', title: 'Core Props' },
 *       { id: 'message-actions', title: 'Message Actions' }
 *     ]
 *   }
 * ]
 *
 * <TableOfContents items={tableOfContents} />
 * ```
 */
export interface TableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0.5,
      }
    )

    // Observe all sections and subsections
    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={cn('sticky top-24 space-y-1 text-sm', className)}
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {items.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
