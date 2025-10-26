import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'
import { CopyIcon, CheckIcon } from './icons'

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
  const { copy, copied } = useClipboard({
    timeout: 2000,
    onSuccess: onCopy,
  })

  const handleCopy = () => {
    copy(text)
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
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-1.5 text-success"
          >
            <CheckIcon size={16} />
            {children || 'Copied!'}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <CopyIcon size={16} />
            {children || 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
