'use client'

import { Check, X, Copy } from 'lucide-react'
import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

export interface Prop {
  name: string
  type: string
  default?: string
  required?: boolean
  description?: string
  deprecated?: boolean
  deprecatedMessage?: string
}

interface PropsTableProps {
  props: Prop[]
  title?: string
  className?: string
}

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.05,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function PropsTable({ props, title = 'Props', className }: PropsTableProps) {
  const [copiedProp, setCopiedProp] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedProp(text)
      setTimeout(() => setCopiedProp(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

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
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold mb-4 text-text-primary"
        >
          {title}
        </motion.h3>
      )}

      <motion.div
        variants={rowVariants}
        className="overflow-x-auto rounded-lg border border-border"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="text-left p-4 font-semibold text-text-primary">Name</th>
              <th className="text-left p-4 font-semibold text-text-primary">Type</th>
              <th className="text-left p-4 font-semibold text-text-primary">Default</th>
              <th className="text-left p-4 font-semibold text-text-primary">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <motion.tr
                key={prop.name}
                variants={rowVariants}
                whileHover={{
                  backgroundColor: 'rgba(var(--color-bg-secondary-rgb, 241 245 249) / 0.5)',
                  scale: 1.002,
                  transition: { duration: 0.2 },
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
                      transition={{ duration: 0.2 }}
                      className="text-sm font-mono font-semibold text-text-primary bg-bg-tertiary px-2 py-1 rounded"
                    >
                      {prop.name}
                    </motion.code>
                    {prop.required && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
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
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="text-xs font-medium text-orange-500 dark:text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-full"
                      >
                        deprecated
                      </motion.span>
                    )}
                    <motion.button
                      onClick={() => copyToClipboard(prop.name)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-auto p-1 rounded hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Copy ${prop.name}`}
                    >
                      <AnimatePresence mode="wait">
                        {copiedProp === prop.name ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-3 h-3 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Copy className="w-3 h-3 text-text-secondary" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </td>
                <td className="p-4">
                  <code className="text-sm font-mono text-brand-500 dark:text-brand-400">
                    {prop.type}
                  </code>
                </td>
                <td className="p-4">
                  {prop.default ? (
                    <motion.code
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
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
                          animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-orange-600 dark:text-orange-400">
                            <strong>Deprecated:</strong> {prop.deprecatedMessage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {prop.description || <span className="text-text-tertiary">—</span>}
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
