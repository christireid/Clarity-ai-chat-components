'use client'

/**
 * ChatButton - Floating action button for docs assistant
 */

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
  className?: string
}

export function ChatButton({ onClick, isOpen, className }: ChatButtonProps) {
  if (isOpen) return null

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: durations.moderate }}
      className={cn(
        'fixed bottom-6 right-6 z-[60]',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-brand-500 to-purple-600',
        'text-white shadow-xl',
        'flex items-center justify-center',
        'hover:shadow-2xl transition-shadow',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        className
      )}
      aria-label="Open documentation assistant"
      title="Ask about Clarity Chat (⌘.)"
      viewport={{ once: true }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  )
}
