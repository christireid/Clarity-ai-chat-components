'use client'

import { useState, ReactNode, useId } from 'react'

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
  const contentId = useId()
  const headingId = useId()

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headingId}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* CSS Grid animation technique for smooth height transition */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isOpen}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
