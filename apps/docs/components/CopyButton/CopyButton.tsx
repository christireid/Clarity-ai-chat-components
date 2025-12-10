'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CLIPBOARD_TIMEOUT_MS } from '@/lib/timing-constants'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md'
  className?: string
  onCopy?: (success: boolean) => void
}

export function CopyButton({
  text,
  label,
  size = 'md',
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        onCopy?.(true)
        setTimeout(() => setCopied(false), CLIPBOARD_TIMEOUT_MS)
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setCopied(true)
          onCopy?.(true)
          setTimeout(() => setCopied(false), CLIPBOARD_TIMEOUT_MS)
        } catch {
          onCopy?.(false)
        }
        document.body.removeChild(textArea)
      }
    },
    [text, onCopy]
  )

  const sizeClasses = size === 'sm' ? 'p-1' : 'p-1.5'
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded hover:bg-muted-foreground/10 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-brand-500',
        sizeClasses,
        className
      )}
      title={copied ? 'Copied!' : label || 'Copy to clipboard'}
      aria-label={copied ? 'Copied!' : label || 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={cn(iconSize, 'text-success')} />
      ) : (
        <Copy className={cn(iconSize, 'text-muted-foreground')} />
      )}
    </button>
  )
}
