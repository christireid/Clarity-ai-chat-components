'use client'

import { useState, useCallback } from 'react'

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
  className = '',
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.(true)
      setTimeout(() => setCopied(false), 2000)
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
        setTimeout(() => setCopied(false), 2000)
      } catch {
        onCopy?.(false)
      }
      document.body.removeChild(textArea)
    }
  }, [text, onCopy])

  const sizeClasses = size === 'sm' ? 'p-1' : 'p-1.5'
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <button
      onClick={handleCopy}
      className={`rounded hover:bg-muted-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${sizeClasses} ${className}`}
      title={copied ? 'Copied!' : (label || 'Copy to clipboard')}
      aria-label={copied ? 'Copied!' : (label || 'Copy to clipboard')}
    >
      {copied ? (
        <svg className={`${iconSize} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={`${iconSize} text-muted-foreground`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}
