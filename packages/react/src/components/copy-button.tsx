import * as React from 'react'
import { Button, type ButtonProps } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'
import { CopyIcon, CheckIcon } from './icons'

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'state'> {
  text: string
  onCopy?: () => void
  /** Show icon only (no text) */
  iconOnly?: boolean
  /** Custom copy text */
  copyText?: string
  /** Custom copied text */
  copiedText?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  iconOnly = false,
  copyText = 'Copy',
  copiedText = 'Copied!',
  children,
  ...props
}) => {
  const { copy, copied } = useClipboard({
    timeout: 2000,
    onSuccess: onCopy,
  })

  const handleCopy = async () => {
    await copy(text)
  }

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
}
