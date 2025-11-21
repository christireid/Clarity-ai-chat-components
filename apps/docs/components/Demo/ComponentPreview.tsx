'use client'

import { useState, ReactNode } from 'react'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Eye, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface ComponentPreviewProps {
  children: ReactNode
  code: string
  title?: string
  description?: string
  language?: string
  className?: string
}

export function ComponentPreview({
  children,
  code,
  title,
  description,
  language = 'tsx',
  className,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.005 }}
      className={clsx('my-6 border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)}
    >
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-4 py-3"
        >
          {title && (
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="font-semibold text-lg mb-1"
            >
              {title}
            </motion.h3>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm text-text-secondary"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex border-t border-border relative"
        >
          <motion.button
            onClick={() => setActiveTab('preview')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 relative',
              activeTab === 'preview'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <motion.div
              animate={activeTab === 'preview' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Eye className="w-4 h-4" />
            </motion.div>
            Preview
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('code')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 relative',
              activeTab === 'code'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <motion.div
              animate={activeTab === 'code' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Code className="w-4 h-4" />
            </motion.div>
            Code
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-8 bg-bg-primary min-h-[300px] flex items-center justify-center"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-0"
          >
            <CodeBlock code={code} language={language} showLineNumbers />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
