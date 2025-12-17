import * as React from 'react'
import { Button, cn } from '@clarity-chat/primitives'
import { CopyButton } from '../message/copy-button'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  WrapTextIcon,
} from '../ui/icons'

export interface CodeWindowHeaderProps {
  /** Detected or provided language */
  language?: string
  /** Filename (optional) */
  filename?: string
  /** Code content for copy/download */
  codeString: string
  /** Whether the code is currently folded */
  isFolded?: boolean
  /** Whether folding is enabled */
  enableFolding?: boolean
  /** Toggle fold callback */
  onToggleFold?: () => void
  /** Whether text is wrapped */
  wrapText?: boolean
  /** Toggle wrap callback */
  onToggleWrap?: () => void
  /** Show copy button */
  showCopyButton?: boolean
  /** Custom class name */
  className?: string
  /** Theme */
  theme?: 'light' | 'dark' | 'auto'
}

export function CodeWindowHeader({
  language,
  filename,
  codeString,
  isFolded = false,
  enableFolding = false,
  onToggleFold,
  wrapText = false,
  onToggleWrap,
  showCopyButton = true,
  className,
  theme = 'dark',
}: CodeWindowHeaderProps) {
  const handleDownload = () => {
    try {
      if (typeof window === 'undefined' || !codeString) return

      const blob = new Blob([codeString], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Basic extension detection
      const ext = language && language !== 'text' ? language : 'txt'
      a.download = filename || `snippet.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download code:', err)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2.5 border-b select-none',
        theme === 'dark'
          ? 'bg-[#252526] border-[#333]'
          : 'bg-gray-50 border-gray-200',
        className
      )}
    >
      {/* Left: Window Controls & Filename/Language */}
      <div className="flex items-center gap-3">
        {/* Mac-style Window Controls */}
        <div
          className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        {(filename || language) && (
          <div className="flex items-center gap-2 ml-2">
            {filename && (
              <span className="text-xs font-medium text-muted-foreground">
                {filename}
              </span>
            )}
            {language && language !== 'text' && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider opacity-70',
                  theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-black/5 text-black'
                )}
              >
                {language}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {enableFolding && onToggleFold && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFold}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10"
            title={isFolded ? 'Expand code' : 'Collapse code'}
          >
            {isFolded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronUpIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isFolded ? 'Expand code' : 'Collapse code'}
            </span>
          </Button>
        )}

        {onToggleWrap && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleWrap}
            className={cn(
              'h-7 w-7 transition-colors',
              wrapText
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
            )}
            title="Toggle word wrap"
          >
            <WrapTextIcon className="h-4 w-4" />
            <span className="sr-only">Toggle word wrap</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10"
          title="Download code"
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="sr-only">Download code</span>
        </Button>

        {showCopyButton && (
          <CopyButton text={codeString} iconOnly className="h-7 w-7" />
        )}
      </div>
    </div>
  )
}
