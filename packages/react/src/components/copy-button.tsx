import React, { memo, useCallback } from 'react'
import { Button, type ButtonProps } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'
import { CopyIcon, CheckIcon } from './icons'

export interface CopyButtonProps
  extends Omit<ButtonProps, 'onClick' | 'state'> {
  text: string
  onCopy?: () => void
  /** Show icon only (no text) */
  iconOnly?: boolean
  /** Custom copy text */
  copyText?: string
  /** Custom copied text */
  copiedText?: string
}

export const CopyButton = memo(function CopyButton({
  text,
  onCopy,
  iconOnly = false,
  copyText = 'Copy',
  copiedText = 'Copied!',
  children,
  ...props
}: CopyButtonProps) {
  const { copy, copied } = useClipboard({
    timeout: 2000,
    onSuccess: onCopy,
  })

  // Memoize copy handler to prevent recreation on every render
  const handleCopy = React.useCallback(async () => {
    await copy(text)
  }, [copy, text])

  return (
    <Button
      variant="ghost"
      size="sm"
      state={copied ? 'success' : 'idle'}
      onClick={handleCopy}
      aria-label={copied ? copiedText : copyText}
      {...props}
    >
      {copied ? (
        <>
          <CheckIcon size={16} />
          {!iconOnly && (children || copiedText)}
        </>
      ) : (
        <>
          <CopyIcon size={16} />
          {!iconOnly && (children || copyText)}
        </>
      )}
    </Button>
  )
})

CopyButton.displayName = 'CopyButton'
