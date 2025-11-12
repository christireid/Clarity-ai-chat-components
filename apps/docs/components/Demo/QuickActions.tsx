'use client'

import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Download, Share2, Zap } from 'lucide-react'
import clsx from 'clsx'

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
        console.log('Share cancelled or not supported')
      }
    } else {
      // Fallback: copy URL
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyCode}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg',
            copiedCode
              ? 'bg-green-500 text-white'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          )}
        >
          {copiedCode ? (
            <React.Fragment>
              <Check className="w-4 h-4" />
              Code Copied!
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Copy className="w-4 h-4" />
              Copy Full Code
            </React.Fragment>
          )}
        </button>

        {codesandboxUrl && (
          <a
            href={codesandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-all shadow-md hover:shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            Open in CodeSandbox
          </a>
        )}

        {stackblitzUrl && (
          <a
            href={stackblitzUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg"
          >
            <Zap className="w-4 h-4" />
            Open in StackBlitz
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="group relative bg-gray-900 dark:bg-black rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Install command</p>
              <code className="text-sm text-green-400 font-mono">{installCommand}</code>
            </div>
            <button
              onClick={handleCopyInstall}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy install command"
            >
              {copiedInstall ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {componentName && (
          <div className="group relative bg-gray-900 dark:bg-black rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Import statement</p>
                <code className="text-sm text-blue-400 font-mono">{importStatement}</code>
              </div>
              <button
                onClick={handleCopyImport}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Copy import statement"
              >
                {copiedImport ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>

        <a
          href={`https://www.npmjs.com/package/${npmPackage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          📦 View on NPM
        </a>

        <a
          href="/learn/installation"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          📖 Full Docs
        </a>
      </div>
    </div>
  )
}
