'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

interface Toast {
  message: string
  type: 'success' | 'error'
}

interface HeroChatToastProps {
  toast: Toast | null
}

export function HeroChatToast({ toast }: HeroChatToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg z-50 ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
          role="alert"
          aria-live="polite"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
          ) : (
            <XCircle className="w-4 h-4" aria-hidden="true" />
          )}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
