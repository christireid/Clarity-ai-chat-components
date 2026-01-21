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

  const sizeClasses = size === 'sm' ? 'p-2' : 'p-2.5'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'group/copy relative rounded-lg transition-all duration-300',
        'hover:bg-muted-foreground/10',
        // Subtle glow on hover
        'hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]',
        'dark:hover:shadow-[0_0_12px_rgba(129,140,248,0.2)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        'min-w-[44px] min-h-[44px] flex items-center justify-center', // WCAG touch target
        sizeClasses,
        className
      )}
      title={copied ? 'Copied!' : label || 'Copy to clipboard'}
      aria-label={copied ? 'Copied!' : label || 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={cn(iconSize, 'text-success transition-transform duration-300 scale-110')} />
      ) : (
        <Copy className={cn(iconSize, 'text-muted-foreground transition-all duration-300 group-hover/copy:text-brand-500 dark:group-hover/copy:text-brand-400')} />
      )}
    </button>
  )
}
