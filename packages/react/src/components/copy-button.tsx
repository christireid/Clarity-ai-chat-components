import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'

// Icons (placeholder SVGs - will be replaced with Lucide)
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

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
            <CheckIcon />
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
            <CopyIcon />
            {children || 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
