'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { ChevronRight, List, X } from 'lucide-react'

interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

// Desktop table of contents
interface TableOfContentsProps {
  items: TOCItem[]
  activeId?: string
  onItemClick?: (id: string) => void
  title?: string
  className?: string
}

export function TableOfContents({
  items,
  activeId,
  onItemClick,
  title = 'On this page',
  className,
}: TableOfContentsProps) {
  const handleClick = (id: string) => {
    onItemClick?.(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const renderItems = (tocItems: TOCItem[], depth = 0) => {
    return tocItems.map((item) => (
      <div key={item.id}>
        <button
          className={cn(
            'block w-full text-left py-1.5 text-sm transition-colors',
            'hover:text-foreground',
            item.id === activeId
              ? 'text-accent font-medium'
              : 'text-muted-foreground',
            depth > 0 && 'pl-4'
          )}
          style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : undefined }}
          onClick={() => handleClick(item.id)}
        >
          {item.title}
        </button>
        {item.children && item.children.length > 0 && (
          <div>{renderItems(item.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <nav className={cn('space-y-2', className)}>
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="space-y-1">{renderItems(items)}</div>
    </nav>
  )
}

// Auto-scrolling TOC that highlights current section
interface AutoScrollTOCProps {
  items: TOCItem[]
  title?: string
  offset?: number
  className?: string
}

export function AutoScrollTOC({
  items,
  title = 'On this page',
  offset = 100,
  className,
}: AutoScrollTOCProps) {
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const getAllIds = (tocItems: TOCItem[]): string[] => {
      return tocItems.flatMap((item) => [
        item.id,
        ...(item.children ? getAllIds(item.children) : []),
      ])
    }

    const ids = getAllIds(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: `-${offset}px 0px -80% 0px`,
      }
    )

    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items, offset])

  return (
    <TableOfContents
      items={items}
      activeId={activeId}
      title={title}
      className={className}
    />
  )
}

// Mobile floating TOC button
interface FloatingTOCProps {
  items: TOCItem[]
  title?: string
  className?: string
}

export function FloatingTOC({
  items,
  title = 'Table of Contents',
  className,
}: FloatingTOCProps) {
  const [open, setOpen] = React.useState(false)

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
  }

  const renderItems = (tocItems: TOCItem[], depth = 0) => {
    return tocItems.map((item) => (
      <div key={item.id}>
        <button
          className={cn(
            'block w-full text-left py-2 text-sm transition-colors',
            'hover:text-foreground text-muted-foreground'
          )}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
          onClick={() => handleClick(item.id)}
        >
          {item.title}
        </button>
        {item.children && item.children.length > 0 && (
          <div>{renderItems(item.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 md:hidden', className)}>
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-background border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h4 className="font-medium text-sm">{title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="max-h-64">
            <div className="py-2">{renderItems(items)}</div>
          </ScrollArea>
        </div>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  )
}

// Progress bar with TOC
interface ProgressTOCProps {
  items: TOCItem[]
  className?: string
}

export function ProgressTOC({ items, className }: ProgressTOCProps) {
  const [progress, setProgress] = React.useState(0)
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollProgress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    const getAllIds = (tocItems: TOCItem[]): string[] => {
      return tocItems.flatMap((item) => [
        item.id,
        ...(item.children ? getAllIds(item.children) : []),
      ])
    }

    const ids = getAllIds(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={cn('space-y-4', className)}>
      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* TOC items */}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex items-center gap-2 w-full text-left py-1.5 text-sm transition-colors',
              item.id === activeId
                ? 'text-accent font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handleClick(item.id)}
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                item.id === activeId && 'text-accent'
              )}
            />
            {item.title}
          </button>
        ))}
      </div>

      {/* Progress text */}
      <div className="text-xs text-muted-foreground">
        {Math.round(progress)}% read
      </div>
    </nav>
  )
}

// Generate TOC from markdown content
export function generateTOCFromMarkdown(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const items: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    items.push({ id, title, level })
  }

  // Nest items based on level
  const nested: TOCItem[] = []
  const stack: TOCItem[] = []

  items.forEach((item) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      nested.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) parent.children = []
      parent.children.push(item)
    }

    stack.push(item)
  })

  return nested
}

// Generate TOC from DOM headings
export function generateTOCFromDOM(container: HTMLElement): TOCItem[] {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const items: TOCItem[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1])
    const title = heading.textContent || ''
    let id = heading.id

    if (!id) {
      id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      heading.id = id
    }

    items.push({ id, title, level })
  })

  return items
}
