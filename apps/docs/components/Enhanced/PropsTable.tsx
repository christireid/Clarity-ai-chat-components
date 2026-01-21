'use client'

import Link from 'next/link'
import { Check, Copy, ChevronDown, ExternalLink } from 'lucide-react'
import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useClipboard } from '@clarity-chat/react'
import { durations } from '@/lib/animations'
import { getTypeLink, getTypeDefinition } from '@/lib/type-registry'

/** Minimum number of props before showing the filter input */
const FILTER_THRESHOLD = 5

export interface Prop {
  name: string
  type: string
  default?: string
  required?: boolean
  description?: string
  deprecated?: boolean
  deprecatedMessage?: string
  /** Override the auto-detected type link */
  typeLink?: string
  /** Override the auto-detected type definition */
  typeDefinition?: string
}

interface PropsTableProps {
  props: Prop[]
  title?: string
  className?: string
}

const tableVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.05,
    },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.moderate,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function PropsTable({
  props,
  title = 'Props',
  className,
}: PropsTableProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
  const [filterText, setFilterText] = useState('')
  const { copy, copied, value: copiedValue } = useClipboard({ timeout: 2000 })

  const toggleTypeExpansion = useCallback((propName: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(propName)) {
        next.delete(propName)
      } else {
        next.add(propName)
      }
      return next
    })
  }, [])

  // Filter props based on search
  const filteredProps = filterText
    ? props.filter(
        (prop) =>
          prop.name.toLowerCase().includes(filterText.toLowerCase()) ||
          prop.type.toLowerCase().includes(filterText.toLowerCase()) ||
          prop.description?.toLowerCase().includes(filterText.toLowerCase())
      )
    : props

  if (props.length === 0) {
    return null
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={tableVariants}
      className={clsx('my-8', className)}
    >
      <div className="flex items-center justify-between mb-4">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="text-2xl font-bold text-text-primary"
          >
            {title}
          </motion.h3>
        )}

        {/* Search/Filter */}
        {props.length > FILTER_THRESHOLD && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
          >
            <input
              type="text"
              placeholder="Filter props..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </motion.div>
        )}
      </div>

      <motion.div
        variants={rowVariants}
        className="overflow-x-auto rounded-lg border border-border"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="text-left p-4 font-semibold text-text-primary">
                Name
              </th>
              <th className="text-left p-4 font-semibold text-text-primary">
                Type
              </th>
              <th className="text-left p-4 font-semibold text-text-primary">
                Default
              </th>
              <th className="text-left p-4 font-semibold text-text-primary">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProps.map((prop, index) => (
              <motion.tr
                key={prop.name}
                variants={rowVariants}
                whileHover={{
                  backgroundColor:
                    'rgba(var(--color-bg-secondary-rgb, 241 245 249) / 0.5)',
                  scale: 1.002,
                  transition: { duration: durations.normal },
                }}
                className={clsx(
                  'border-b border-border last:border-b-0',
                  'transition-colors group',
                  prop.deprecated && 'opacity-60'
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <motion.code
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: durations.normal }}
                      className="text-sm font-mono font-semibold text-text-primary bg-bg-tertiary px-2 py-1 rounded"
                    >
                      {prop.name}
                    </motion.code>
                    {prop.required && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="text-xs font-medium text-red-500 dark:text-red-400 px-2 py-0.5 bg-red-500/10 rounded-full"
                      >
                        required
                      </motion.span>
                    )}
                    {prop.deprecated && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="text-xs font-medium text-orange-500 dark:text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-full"
                      >
                        deprecated
                      </motion.span>
                    )}
                    <motion.button
                      onClick={() => copy(prop.name)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-auto p-1 rounded hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Copy ${prop.name} to clipboard`}
                    >
                      <AnimatePresence mode="wait">
                        {copied && copiedValue === prop.name ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: durations.normal }}
                          >
                            <Check className="w-3 h-3 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ duration: durations.normal }}
                          >
                            <Copy className="w-3 h-3 text-text-secondary" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </td>
                <td className="p-4">
                  {(() => {
                    const typeLink = prop.typeLink || getTypeLink(prop.type)
                    const typeDef =
                      prop.typeDefinition || getTypeDefinition(prop.type)
                    const isExpanded = expandedTypes.has(prop.name)
                    const isExternal = typeLink?.startsWith('http')

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {typeLink ? (
                            isExternal ? (
                              <a
                                href={typeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-brand-500 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                              >
                                {prop.type}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <Link
                                href={typeLink}
                                className="text-sm font-mono text-brand-500 dark:text-brand-400 hover:underline"
                              >
                                {prop.type}
                              </Link>
                            )
                          ) : (
                            <code className="text-sm font-mono text-brand-500 dark:text-brand-400">
                              {prop.type}
                            </code>
                          )}

                          {typeDef && (
                            <motion.button
                              onClick={() => toggleTypeExpansion(prop.name)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                              aria-label={
                                isExpanded
                                  ? 'Collapse type definition'
                                  : 'Expand type definition'
                              }
                              aria-expanded={isExpanded}
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: durations.normal }}
                              >
                                <ChevronDown className="w-4 h-4 text-text-tertiary" />
                              </motion.div>
                            </motion.button>
                          )}
                        </div>

                        {/* Expandable type definition */}
                        <AnimatePresence>
                          {isExpanded && typeDef && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: durations.normal }}
                              className="overflow-hidden"
                            >
                              <pre className="text-xs font-mono bg-bg-tertiary p-3 rounded-lg overflow-x-auto border border-border">
                                <code className="text-text-secondary">
                                  {typeDef}
                                </code>
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })()}
                </td>
                <td className="p-4">
                  {prop.default ? (
                    <motion.code
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: durations.normal }}
                      className="text-sm font-mono text-text-secondary bg-bg-tertiary px-2 py-1 rounded inline-block"
                    >
                      {prop.default}
                    </motion.code>
                  ) : (
                    <span className="text-text-tertiary">—</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm text-text-secondary">
                    <AnimatePresence>
                      {prop.deprecated && prop.deprecatedMessage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                            marginBottom: 8,
                          }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{
                            duration: durations.moderate,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-orange-600 dark:text-orange-400">
                            <strong>Deprecated:</strong>{' '}
                            {prop.deprecatedMessage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {prop.description || (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
