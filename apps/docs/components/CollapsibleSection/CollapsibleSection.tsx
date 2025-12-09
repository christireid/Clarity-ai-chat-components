'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  badge?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = '',
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      // After animation, set to auto for responsive resizing
      const timer = setTimeout(() => setHeight(undefined), 300)
      return () => clearTimeout(timer)
    } else {
      // First set the current height, then animate to 0
      setHeight(contentRef.current?.scrollHeight)
      requestAnimationFrame(() => {
        setHeight(0)
      })
    }
  }, [isOpen])

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{ height: height }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="p-4 pt-0 border-t">
          {children}
        </div>
      </div>
    </div>
  )
}
