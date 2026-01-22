'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Share2, Download, Code2, ExternalLink, Check, X } from 'lucide-react'
import { useToast } from '@clarity-chat/react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface PlaygroundControlsProps {
  code: string
  dependencies?: Record<string, string>
  templateName: string
}

export function PlaygroundControls({
  code,
  dependencies = {},
  templateName,
}: PlaygroundControlsProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const toast = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl+S to download
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleDownload()
      }
      // Escape to close modal
      else if (e.key === 'Escape' && showShareModal) {
        setShowShareModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [showShareModal])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleExportCodeSandbox = async () => {
    try {
      setIsExporting(true)

      const parameters = {
        files: {
          'package.json': {
            content: JSON.stringify(
              {
                name: templateName.toLowerCase().replace(/\s+/g, '-'),
                version: '1.0.0',
                dependencies: {
                  react: '^18.2.0',
                  'react-dom': '^18.2.0',
                  '@clarity-chat/react': 'latest',
                  ...dependencies,
                },
              },
              null,
              2
            ),
          },
          'index.html': {
            content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateName}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
          },
          'index.tsx': {
            content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
          },
          'App.tsx': {
            content: code,
          },
        },
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://codesandbox.io/api/v1/sandboxes/define'
      form.target = '_blank'

      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'parameters'
      input.value = JSON.stringify(parameters)

      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)

      toast.success('Opening in CodeSandbox...')
    } catch (error) {
      toast.error('Failed to export to CodeSandbox')
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/playground?code=${encodeURIComponent(btoa(code))}`
      : ''

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyCode}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium',
            copied &&
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <button
          onClick={handleExportCodeSandbox}
          disabled={isExporting}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all text-sm font-medium',
            isExporting && 'opacity-75 cursor-wait'
          )}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Open in CodeSandbox
            </>
          )}
        </button>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durations.normal }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowShareModal(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: durations.normal,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-modal-title"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 pointer-events-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    id="share-modal-title"
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Share Playground
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className={cn(
                      'p-1.5 rounded-lg text-gray-500 dark:text-gray-400',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500'
                    )}
                    aria-label="Close share modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Share this URL to let others view and edit your code:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Share URL"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareUrl)
                        setCopied(true)
                        toast.success('Share link copied to clipboard')
                        setTimeout(() => setCopied(false), 2000)
                      } catch (error) {
                        toast.error('Failed to copy share link')
                      }
                    }}
                    className={cn(
                      'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      copied && 'bg-green-500 hover:bg-green-600'
                    )}
                    aria-label="Copy share link to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 inline mr-1" />
                        Copied!
                      </>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
