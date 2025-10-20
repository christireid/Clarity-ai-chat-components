import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps, copyToClipboard } from '@clarity-chat/primitives'

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string
  onCopy?: () => void
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  children,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      onCopy?.()
      
      // Hooked principle: Immediate feedback
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            ✓ {children || 'Copied!'}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            📋 {children || 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
