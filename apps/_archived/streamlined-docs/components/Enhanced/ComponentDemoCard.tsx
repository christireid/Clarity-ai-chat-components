'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ComponentDemoCardProps {
  title: string
  description: string
  preview: ReactNode
  code?: string
  href?: string
  category?: string
  tags?: string[]
  gradient?: string
  className?: string
}

export function ComponentDemoCard({
  title,
  description,
  preview,
  code,
  href = '#',
  category = 'Component',
  tags = [],
  gradient = 'from-brand-500 to-purple-500',
  className,
}: ComponentDemoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-xl',
        className
      )}
    >
      {/* Preview */}
      <div className={cn(
        'relative h-48 bg-gradient-to-br p-6 flex items-center justify-center overflow-hidden',
        gradient
      )}>
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        
        {/* Preview content */}
        <div className="relative z-10 w-full">
          {preview}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Details */}
      <div className="p-6">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 text-xs font-medium rounded">
            {category}
          </span>
          {tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-500 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors group/link"
          >
            View Demo
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          {code && (
            <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
              Code
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
