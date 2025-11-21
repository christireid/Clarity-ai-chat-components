'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-2"
    >
      <motion.h4
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="font-semibold text-sm text-text-primary mb-4"
      >
        On this page
      </motion.h4>
      <nav>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.03 }}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={clsx(
                    'block text-sm py-1 pl-3 transition-all border-l-2 relative',
                    activeId === item.id
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  )}
                >
                  {item.title}
                  {activeId === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                </a>
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  )
}
