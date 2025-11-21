'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface ApiTableProps {
  title?: string
  data: PropDefinition[]
  className?: string
}

const containerVariants = {
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

export function ApiTable({ title = 'Props', data, className }: ApiTableProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className={clsx('my-8 not-prose', className)}
    >
      {title && (
        <motion.h3
          variants={rowVariants}
          className="text-xl font-semibold mb-4"
        >
          {title}
        </motion.h3>
      )}

      <motion.div
        variants={rowVariants}
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ duration: 0.2 }}
        className="border-2 border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary/50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Default
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((prop, index) => (
                <motion.tr
                  key={prop.name}
                  variants={rowVariants}
                  whileHover={{ scale: 1.005, backgroundColor: 'rgba(var(--color-bg-secondary), 0.5)' }}
                  transition={{ duration: 0.15 }}
                  className="group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <motion.code
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-400"
                      >
                        {prop.name}
                      </motion.code>
                      {prop.required && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                          whileHover={{ scale: 1.1 }}
                          className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800"
                        >
                          Required
                        </motion.span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <motion.code
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-lg inline-block"
                    >
                      {prop.type}
                    </motion.code>
                  </td>
                  <td className="px-5 py-3">
                    {prop.default ? (
                      <motion.code
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="text-sm font-mono text-text-secondary bg-muted/50 px-2 py-1 rounded-lg inline-block"
                      >
                        {prop.default}
                      </motion.code>
                    ) : (
                      <span className="text-sm text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                    {prop.description}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
