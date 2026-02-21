'use client'

import { useState, ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'

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
    <div
      className={cn(
        'group/collapsible relative rounded-xl overflow-hidden transition-all duration-300',
        'bg-white dark:bg-gray-900/50',
        'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
        'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
        isOpen && 'shadow-[0_4px_12px_rgba(99,102,241,0.08),0_8px_24px_rgba(99,102,241,0.06)]',
        isOpen && 'dark:shadow-[0_4px_12px_rgba(129,140,248,0.12),0_8px_24px_rgba(129,140,248,0.08)]',
        className
      )}
    >
      {/* Gradient border */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-50'
        )}
        style={{
          padding: '1px',
          background: isOpen
            ? 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 50%, rgba(244,114,182,0.15) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative z-10 w-full flex items-center justify-between p-4 text-left transition-all duration-300',
          'hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500'
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headingId}
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold transition-colors duration-300',
            isOpen && 'text-brand-600 dark:text-brand-400'
          )}>
            {title}
          </span>
          {badge && (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300',
              isOpen
                ? 'bg-gradient-to-r from-brand-100 to-purple-100 dark:from-brand-900/50 dark:to-purple-900/50 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
            )}>
              {badge}
            </span>
          )}
        </div>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
          isOpen
            ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover/collapsible:bg-gray-200 dark:group-hover/collapsible:bg-gray-700'
        )}>
          <svg
            className={cn(
              'w-4 h-4 transition-transform duration-300 ease-out motion-reduce:transition-none',
              isOpen && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* CSS Grid animation technique for smooth height transition */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isOpen}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none relative z-10"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
