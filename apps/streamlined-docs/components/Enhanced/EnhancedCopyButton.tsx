'use client'

import { useState, useCallback } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CLIPBOARD_TIMEOUT_MS } from '@/lib/timing-constants'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/lib/toast'

interface EnhancedCopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  celebration?: 'confetti' | 'pulse' | 'minimal'
  showToast?: boolean
  onCopy?: (success: boolean) => void
}

export function EnhancedCopyButton({
  text,
  label,
  size = 'md',
  className,
  celebration = 'confetti',
  showToast = true,
  onCopy,
}: EnhancedCopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        onCopy?.(true)

        // Show toast notification
        if (showToast) {
          toast.success('Copied to clipboard!', {
            description: label || 'Code snippet copied successfully',
            duration: 2000,
          })
        }

        // Create confetti particles
        if (celebration === 'confetti') {
          const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
          }))
          setParticles(newParticles)
          setTimeout(() => setParticles([]), 1000)
        }

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
          if (showToast) {
            toast.success('Copied!', { duration: 2000 })
          }
          setTimeout(() => setCopied(false), CLIPBOARD_TIMEOUT_MS)
        } catch {
          onCopy?.(false)
          if (showToast) {
            toast.error('Failed to copy', { duration: 2000 })
          }
        }
        document.body.removeChild(textArea)
      }
    },
    [text, onCopy, label, showToast, celebration]
  )

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }[size]

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size]

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'group/copy relative rounded-lg transition-all duration-300',
        'bg-white/5 hover:bg-white/10',
        'border border-white/10 hover:border-white/20',
        'backdrop-blur-sm',
        // Glow effect on hover
        'hover:shadow-[0_0_16px_rgba(99,102,241,0.2)]',
        'dark:hover:shadow-[0_0_16px_rgba(129,140,248,0.25)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        'min-w-[44px] min-h-[44px] flex items-center justify-center',
        sizeClasses,
        className
      )}
      title={copied ? 'Copied!' : label || 'Copy to clipboard'}
      aria-label={copied ? 'Copied!' : label || 'Copy to clipboard'}
    >
      {/* Confetti particles */}
      <AnimatePresence>
        {celebration === 'confetti' && particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 1,
              x: particle.x,
              y: particle.y,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: `hsl(${Math.random() * 360}, 70%, 60%)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Icon */}
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Check className={cn(iconSizes, 'text-emerald-500')} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Copy
              className={cn(
                iconSizes,
                'text-neutral-400 transition-all duration-300',
                'group-hover/copy:text-brand-400 dark:group-hover/copy:text-brand-300'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse celebration */}
      {celebration === 'pulse' && copied && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-emerald-500"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
}
