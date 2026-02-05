'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Download,
  FileText,
  Code,
  FileJson,
  X,
  Check,
  File,
} from 'lucide-react'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  onExport: (format: string) => void
  formats?: Array<{
    id: string
    label: string
    description: string
    icon: React.ReactNode
  }>
}

const defaultFormats = [
  {
    id: 'markdown',
    label: 'Markdown',
    description: 'Formatted with headers and code blocks',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data with full metadata',
    icon: <FileJson className="h-4 w-4" />,
  },
  {
    id: 'text',
    label: 'Plain Text',
    description: 'Simple text without formatting',
    icon: <File className="h-4 w-4" />,
  },
]

export function ChatExportDialog({
  open,
  onClose,
  onExport,
  formats = defaultFormats,
}: ExportDialogProps) {
  const [selected, setSelected] = useState(formats[0]?.id || 'markdown')
  const [exported, setExported] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape key to close
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Focus trap
  useEffect(() => {
    if (!open || !dialogRef.current) return
    const dialog = dialogRef.current
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) focusable[0].focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [open])

  if (!open) return null

  const handleExport = () => {
    onExport(selected)
    setExported(true)
    setTimeout(() => {
      setExported(false)
      onClose()
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Export Conversation"
        className="w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Export Conversation</h3>
            <p className="text-sm text-muted-foreground">
              Choose an export format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelected(format.id)}
              className={cn(
                'flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all',
                selected === format.id
                  ? 'bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  selected === format.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {format.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{format.label}</div>
                <div className="text-xs text-muted-foreground">
                  {format.description}
                </div>
              </div>
              {selected === format.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
              exported
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            {exported ? (
              <>
                <Check className="h-4 w-4" />
                Exported!
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
