'use client'

import { useState } from 'react'
import { Download, Check, Copy } from 'lucide-react'
import { getFullExample } from '@/lib/demos/examples'
import { copyToClipboard } from '@/lib/demos/utils'
import { trackFullExampleCopied, DemoName } from '@/lib/demos/analytics'

interface CopyFullExampleButtonProps {
  demoId: DemoName
  variant?: 'default' | 'compact'
  className?: string
}

/**
 * Button to copy the full working example code for a demo
 * Shows success state after copying
 */
export function CopyFullExampleButton({
  demoId,
  variant = 'default',
  className = '',
}: CopyFullExampleButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const example = getFullExample(demoId)
    if (!example) return

    const success = await copyToClipboard(example)
    if (success) {
      setCopied(true)
      trackFullExampleCopied(demoId)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className={`p-2 hover:bg-secondary rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
        title="Copy full working example"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        ) : (
          <Download className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Full Example
        </>
      )}
    </button>
  )
}

export default CopyFullExampleButton
