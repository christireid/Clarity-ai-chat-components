'use client'

import { usePlayground } from '../context/PlaygroundContext'
import {
  Share2,
  Download,
  Upload,
  Sun,
  Moon,
  RotateCcw,
  Check,
  Copy,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { useState, useRef } from 'react'

export function PlaygroundToolbar() {
  const { theme, setTheme, exportConfig, importConfig, resetProps, shareableUrl } =
    usePlayground()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareableUrl)
    setShareStatus('copied')
    setTimeout(() => setShareStatus('idle'), 2000)
  }

  const handleExport = () => {
    const config = exportConfig()
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playground-config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const config = event.target?.result as string
      importConfig(config)
    }
    reader.readAsText(file)
  }

  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-4 w-4" />
              <span className="text-sm">Dark</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span className="text-sm">Light</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20" />

        {/* Share */}
        <button
          onClick={handleShare}
          className={cn(
            'px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2',
            shareStatus === 'copied' && 'bg-green-500/10 border border-green-500/30'
          )}
        >
          {shareStatus === 'copied' ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-sm">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </>
          )}
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm">Export</span>
        </button>

        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">Import</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* Divider */}
        <div className="h-6 w-px bg-white/20" />

        {/* Reset All */}
        <button
          onClick={resetProps}
          className="px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="text-sm">Reset All</span>
        </button>

        {/* Copy URL Badge */}
        {shareStatus === 'copied' && (
          <div className="ml-auto badge-glass text-xs flex items-center gap-1 animate-in fade-in slide-in-from-right">
            <Copy className="h-3 w-3" />
            URL copied to clipboard
          </div>
        )}
      </div>
    </div>
  )
}
