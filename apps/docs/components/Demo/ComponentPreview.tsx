'use client'

import { useState, ReactNode } from 'react'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Eye, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
      className={cn(
        'group/preview relative my-6 rounded-xl overflow-hidden',
        // Multi-layer shadow system
        'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
        'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
        'hover:shadow-[0_4px_12px_rgba(99,102,241,0.1),0_8px_24px_rgba(99,102,241,0.08)]',
        'dark:hover:shadow-[0_4px_12px_rgba(129,140,248,0.15),0_8px_24px_rgba(129,140,248,0.1)]',
        'transition-shadow duration-300',
        className
      )}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-xl opacity-50 group-hover/preview:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(244,114,182,0.25) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
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
          role="tablist"
          aria-label="Preview and code tabs"
        >
          <motion.button
            onClick={() => setActiveTab('preview')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              activeTab === 'preview'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
            aria-selected={activeTab === 'preview'}
            role="tab"
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
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              activeTab === 'code'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
            aria-selected={activeTab === 'code'}
            role="tab"
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
