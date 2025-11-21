'use client'

import { Play, Code2, ChevronDown } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TryItOutProps {
  title?: string
  children: ReactNode
  code?: string
  language?: string
}

export function TryItOut({ title = 'Try it out', children, code, language = 'tsx' }: TryItOutProps) {
  const [isCodeVisible, setIsCodeVisible] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="my-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-4"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"
        >
          <Play className="w-4 h-4 text-blue-500" />
        </motion.div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-4"
      >
        {children}
      </motion.div>

      {code && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4"
        >
          <motion.button
            onClick={() => setIsCodeVisible(!isCodeVisible)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <motion.div
              animate={{ rotate: isCodeVisible ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
            <Code2 className="w-4 h-4" />
            <span>{isCodeVisible ? 'Hide code' : 'Show code'}</span>
          </motion.button>

          <AnimatePresence>
            {isCodeVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <pre className="p-4 rounded-lg bg-bg-secondary border border-border overflow-x-auto">
                  <code className={`language-${language}`}>{code}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
