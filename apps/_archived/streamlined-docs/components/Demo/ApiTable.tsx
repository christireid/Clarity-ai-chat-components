'use client'

import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'

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

const containerVariants: Variants = {
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

const rowVariants: Variants = {
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
        className="group/table relative border border-border/60 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_8px_24px_rgba(99,102,241,0.06),0_0_30px_rgba(99,102,241,0.06)] dark:hover:shadow-[0_4px_12px_rgba(129,140,248,0.12),0_8px_24px_rgba(129,140,248,0.08),0_0_30px_rgba(129,140,248,0.1)] transition-all duration-300"
      >
        {/* Gradient border on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />
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
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="group hover:bg-bg-secondary/50"
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
