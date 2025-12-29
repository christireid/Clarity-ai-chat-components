'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Linkedin, Link2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LIBRARY_STATS } from '@/lib/library-stats'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
  variant?: 'floating' | 'inline'
}

interface ShareOption {
  name: string
  icon: React.ReactNode
  color: string
  getUrl: (url: string, text: string) => string
}

const shareOptions: ShareOption[] = [
  {
    name: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    color: 'hover:bg-[#1DA1F2] hover:text-white',
    getUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    color: 'hover:bg-[#0A66C2] hover:text-white',
    getUrl: (url, text) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
]

export function ShareButton({
  title = 'Share',
  text = `Check out Clarity Chat - ${LIBRARY_STATS.components} production-ready React components for AI chat UIs 🚀`,
  url,
  className,
  variant = 'inline',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Use current URL if none provided
  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = useCallback(
    async (option: ShareOption) => {
      const shareLink = option.getUrl(shareUrl, text)
      window.open(
        shareLink,
        '_blank',
        'noopener,noreferrer,width=600,height=400'
      )
      setIsOpen(false)
    },
    [shareUrl, text]
  )

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clarity Chat',
          text,
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      setIsOpen(!isOpen)
    }
  }, [text, shareUrl, isOpen])

  if (variant === 'floating') {
    return (
      <div className={cn('fixed bottom-6 right-6 z-40', className)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 right-0 bg-bg-primary border border-border rounded-xl shadow-xl p-2 min-w-[180px]"
            >
              <div className="text-xs font-medium text-text-tertiary px-3 py-2">
                Share via
              </div>
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    option.color
                  )}
                >
                  {option.icon}
                  {option.name}
                </button>
              ))}
              <div className="border-t border-border my-1" />
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-bg-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copy link
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleNativeShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full shadow-lg',
            'bg-gradient-to-r from-brand-500 to-purple-500 text-white',
            'hover:shadow-xl transition-shadow'
          )}
          aria-label="Share"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </motion.button>
      </div>
    )
  }

  // Inline variant
  return (
    <div className={cn('relative inline-block', className)}>
      <motion.button
        onClick={handleNativeShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-bg-secondary hover:bg-bg-tertiary text-text-primary',
          'border border-border hover:border-brand-300 transition-all'
        )}
      >
        <Share2 className="w-4 h-4" />
        {title}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 z-50 bg-bg-primary border border-border rounded-xl shadow-xl p-2 min-w-[180px]"
            >
              <div className="text-xs font-medium text-text-tertiary px-3 py-2">
                Share via
              </div>
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    option.color
                  )}
                >
                  {option.icon}
                  {option.name}
                </button>
              ))}
              <div className="border-t border-border my-1" />
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-bg-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copy link
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
