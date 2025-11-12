'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

interface TocItem {
  title: string
  id: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 80 // Account for sticky header
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-text-primary mb-4">
        On this page
      </h4>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={clsx(
                  'block text-sm py-1 transition-colors border-l-2',
                  activeId === item.id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
