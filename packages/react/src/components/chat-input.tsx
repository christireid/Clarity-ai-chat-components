import * as React from 'react'
import { motion } from 'framer-motion'
import { Textarea, Button, cn } from '@clarity-chat/primitives'
import { SendIcon } from './icons'
import { INTERACTION_VARIANTS } from '../animations/constants'

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSubmit(value)
      }
    }
  }

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value)
    }
  }

  return (
    <div className={cn('flex gap-2 p-4 border-t', className)}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoResize
        maxRows={6}
        className="flex-1"
      />
      <motion.div
        whileHover={INTERACTION_VARIANTS.button.hover}
        whileTap={INTERACTION_VARIANTS.button.tap}
        transition={INTERACTION_VARIANTS.button.transition}
      >
        <Button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          size="icon"
          className="gap-1.5"
        >
          <SendIcon size={18} />
        </Button>
      </motion.div>
    </div>
  )
}
