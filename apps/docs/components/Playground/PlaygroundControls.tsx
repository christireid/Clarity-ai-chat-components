'use client'

import React, { useState } from 'react'
import {
  ShareIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon
  // @ts-expect-error - @heroicons/react is an optional dependency for playground functionality
} from '@heroicons/react/24/outline'
import { useToast } from '@clarity-chat/react'

interface PlaygroundControlsProps {
  code: string
  dependencies?: Record<string, string>
  templateName: string
}

export function PlaygroundControls({
  code,
  dependencies = {},
  templateName
}: PlaygroundControlsProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const { success } = useToast()

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    success('Code copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleExportCodeSandbox = () => {
    const parameters = {
      files: {
        'package.json': {
          content: JSON.stringify({
            name: templateName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            dependencies: {
              'react': '^18.2.0',
              'react-dom': '^18.2.0',
              '@clarity-chat/react': 'latest',
              ...dependencies
            }
          }, null, 2)
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
</html>`
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
)`
        },
        'App.tsx': {
          content: code
        }
      }
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

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/playground?code=${encodeURIComponent(btoa(code))}`
    : ''

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <CodeBracketIcon className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Code'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <ShareIcon className="w-4 h-4" />
          Share
        </button>

        <button
          onClick={handleExportCodeSandbox}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          Open in CodeSandbox
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Playground
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share this URL to let others view and edit your code:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl)
                  setCopied(true)
                  success('Share link copied to clipboard')
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
