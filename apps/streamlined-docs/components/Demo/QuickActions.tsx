'use client'

import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Download, Share2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { logger } from '@/lib/logger'
import { durations } from '@/lib/animations'

interface QuickActionsProps {
  code: string
  componentName?: string
  codesandboxUrl?: string
  stackblitzUrl?: string
  npmPackage?: string
  className?: string
}

export function QuickActions({
  code,
  componentName,
  codesandboxUrl,
  stackblitzUrl,
  npmPackage = '@clarity-chat/react',
  className,
}: QuickActionsProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedImport, setCopiedImport] = useState(false)

  const installCommand = `npm install ${npmPackage}`
  const importStatement = componentName
    ? `import { ${componentName} } from '${npmPackage}'`
    : `import components from '${npmPackage}'`

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const handleCopyImport = async () => {
    await navigator.clipboard.writeText(importStatement)
    setCopiedImport(true)
    setTimeout(() => setCopiedImport(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${componentName} Example`,
          text: 'Check out this component example',
          url: window.location.href,
        })
      } catch (err) {
        // Silently handle if user cancels or share is not supported
        logger.debug('Share cancelled or not supported')
      }
    } else {
      // Fallback: copy URL
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('space-y-3', className)}
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="flex flex-wrap gap-2"
      >
        <motion.button
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: { opacity: 1, scale: 1 },
          }}
          onClick={handleCopyCode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={copiedCode ? { scale: [1, 1.1, 1] } : {}}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300',
            copiedCode
              ? 'bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.2)]'
              : 'bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3),0_8px_24px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4),0_12px_32px_rgba(99,102,241,0.25),0_0_40px_rgba(99,102,241,0.15)]'
          )}
        >
          <AnimatePresence mode="wait">
            {copiedCode ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: durations.normal }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Code Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ duration: durations.normal }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Full Code
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {codesandboxUrl && (
          <motion.a
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 },
            }}
            href={codesandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-all shadow-md hover:shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            Open in CodeSandbox
          </motion.a>
        )}

        {stackblitzUrl && (
          <motion.a
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 },
            }}
            href={stackblitzUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-md hover:shadow-lg"
          >
            <Zap className="w-4 h-4" />
            Open in StackBlitz
          </motion.a>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.moderate, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            'group relative rounded-lg p-3 overflow-hidden transition-all duration-300',
            'bg-gray-900 dark:bg-black',
            'shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
            'hover:shadow-[0_4px_12px_rgba(34,197,94,0.15),0_8px_24px_rgba(34,197,94,0.1)]'
          )}
        >
          {/* Gradient border */}
          <div
            className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(16,185,129,0.2) 50%, rgba(34,197,94,0.3) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Install command</p>
              <code className="text-sm text-green-400 font-mono">
                {installCommand}
              </code>
            </div>
            <motion.button
              onClick={handleCopyInstall}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy install command"
            >
              <AnimatePresence mode="wait">
                {copiedInstall ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: durations.normal }}
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: durations.normal }}
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {componentName && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              'group relative rounded-lg p-3 overflow-hidden transition-all duration-300',
              'bg-gray-900 dark:bg-black',
              'shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
              'hover:shadow-[0_4px_12px_rgba(59,130,246,0.15),0_8px_24px_rgba(59,130,246,0.1)]'
            )}
          >
            {/* Gradient border */}
            <div
              className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(99,102,241,0.2) 50%, rgba(59,130,246,0.3) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Import statement</p>
                <code className="text-sm text-blue-400 font-mono">
                  {importStatement}
                </code>
              </div>
              <motion.button
                onClick={handleCopyImport}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Copy import statement"
              >
                <AnimatePresence mode="wait">
                  {copiedImport ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: durations.normal }}
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -180 }}
                      transition={{ duration: durations.normal }}
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.moderate, delay: 0.3 }}
        className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700"
      >
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </motion.button>

        <motion.a
          href={`https://www.npmjs.com/package/${npmPackage}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          📦 View on NPM
        </motion.a>

        <motion.a
          href="/get-started/installation"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          📖 Full Docs
        </motion.a>
      </motion.div>
    </motion.div>
  )
}
