'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Code2, Lightbulb, Wrench } from 'lucide-react'
import clsx from 'clsx'

type PageType = 'guide' | 'reference' | 'example' | 'cookbook'

interface RelatedPage {
  title: string
  description: string
  href: string
  type: PageType
}

interface RelatedPagesProps {
  title?: string
  pages: RelatedPage[]
}

const typeConfig: Record<
  PageType,
  { icon: typeof BookOpen; color: string; label: string }
> = {
  guide: {
    icon: BookOpen,
    color: 'blue',
    label: 'Guide',
  },
  reference: {
    icon: Code2,
    color: 'purple',
    label: 'Reference',
  },
  example: {
    icon: Lightbulb,
    color: 'amber',
    label: 'Example',
  },
  cookbook: {
    icon: Wrench,
    color: 'green',
    label: 'Recipe',
  },
}

export function RelatedPages({
  title = 'Related Pages',
  pages,
}: RelatedPagesProps) {
  if (!pages.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow }}
      className="mt-12 pt-8 border-t border-border"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span>{title}</span>
        <ArrowRight className="w-4 h-4 text-text-secondary" />
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {pages.map((page, index) => {
          const config = typeConfig[page.type]
          const Icon = config.icon

          return (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={page.href}
                className={clsx(
                  'block p-4 rounded-xl border transition-all group',
                  'bg-bg-secondary hover:bg-bg-tertiary',
                  'border-border hover:border-brand-500/30',
                  'hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={clsx(
                      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                      config.color === 'blue' &&
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                      config.color === 'purple' &&
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                      config.color === 'amber' &&
                        'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                      config.color === 'green' &&
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-text-primary group-hover:text-brand-500 transition-colors truncate">
                        {page.title}
                      </span>
                      <span
                        className={clsx(
                          'flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase',
                          config.color === 'blue' &&
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                          config.color === 'purple' &&
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                          config.color === 'amber' &&
                            'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                          config.color === 'green' &&
                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {page.description}
                    </p>
                  </div>
                  <ArrowRight className="flex-shrink-0 w-4 h-4 text-text-tertiary group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
