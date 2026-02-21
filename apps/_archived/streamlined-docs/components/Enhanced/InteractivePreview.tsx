'use client'

import { useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Eye, Copy, Download, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnhancedCopyButton } from './EnhancedCopyButton'

interface InteractivePreviewProps {
  /** Component to preview */
  children: ReactNode
  /** Code string to display */
  code?: string
  /** Component title */
  title?: string
  /** Component description */
  description?: string
  /** Default view mode */
  defaultMode?: 'preview' | 'code' | 'split'
  /** Allow fullscreen */
  allowFullscreen?: boolean
  /** Show responsive preview modes */
  showResponsive?: boolean
  /** Custom controls panel */
  controls?: ReactNode
  /** Background color for preview */
  previewBackground?: 'default' | 'grid' | 'dark' | 'light'
  className?: string
}

type ViewMode = 'preview' | 'code' | 'split'
type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const deviceWidths: Record<DeviceMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function InteractivePreview({
  children,
  code = '',
  title,
  description,
  defaultMode = 'preview',
  allowFullscreen = true,
  showResponsive = true,
  controls,
  previewBackground = 'default',
  className,
}: InteractivePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title?.toLowerCase().replace(/\s+/g, '-') || 'component'}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, title])

  const backgroundStyles = {
    default: 'bg-white dark:bg-neutral-950',
    grid: 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-white dark:bg-neutral-950',
    dark: 'bg-neutral-900',
    light: 'bg-neutral-50',
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50 shadow-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-950 rounded-lg p-1 border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-all',
                viewMode === 'preview'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
              aria-label="Preview mode"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-all',
                viewMode === 'code'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
              aria-label="Code mode"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-all',
                viewMode === 'split'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
              aria-label="Split mode"
            >
              <div className="flex gap-0.5">
                <div className="w-1.5 h-4 bg-current" />
                <div className="w-1.5 h-4 bg-current" />
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {code && (
              <EnhancedCopyButton
                text={code}
                label="Copy code"
                size="sm"
                showToast={true}
                celebration="pulse"
              />
            )}
            {code && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-white/50 dark:hover:bg-neutral-800 transition-all"
                aria-label="Download code"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            {allowFullscreen && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-white/50 dark:hover:bg-neutral-800 transition-all"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Device Mode Selector (only in preview/split) */}
      {showResponsive && (viewMode === 'preview' || viewMode === 'split') && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={cn(
              'p-2 rounded-lg transition-all',
              deviceMode === 'mobile'
                ? 'bg-brand-500 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-500'
            )}
            aria-label="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={cn(
              'p-2 rounded-lg transition-all',
              deviceMode === 'tablet'
                ? 'bg-brand-500 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-500'
            )}
            aria-label="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={cn(
              'p-2 rounded-lg transition-all',
              deviceMode === 'desktop'
                ? 'bg-brand-500 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-500'
            )}
            aria-label="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <span className="text-xs text-neutral-500 ml-2">
            {deviceWidths[deviceMode]}
          </span>
        </div>
      )}

      {/* Controls Panel */}
      {controls && (
        <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          {controls}
        </div>
      )}

      {/* Content */}
      <div className={cn('relative', viewMode === 'split' && 'grid md:grid-cols-2')}>
        {/* Preview Pane */}
        <AnimatePresence mode="wait">
          {(viewMode === 'preview' || viewMode === 'split') && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'p-8',
                backgroundStyles[previewBackground],
                viewMode === 'split' && 'border-r border-neutral-200 dark:border-neutral-800'
              )}
            >
              <div
                className="mx-auto transition-all duration-300"
                style={{ maxWidth: deviceWidths[deviceMode] }}
              >
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Pane */}
        <AnimatePresence mode="wait">
          {(viewMode === 'code' || viewMode === 'split') && code && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <pre className="p-4 overflow-x-auto text-sm bg-neutral-950 text-neutral-100 h-full">
                <code>{code}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
