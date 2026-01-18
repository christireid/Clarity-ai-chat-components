'use client'

import { useState, useEffect } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function NetworkOfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Try to fetch a small resource to check connectivity
      await fetch('/api/ping', { method: 'HEAD', cache: 'no-store' })
      setIsOffline(false)
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-3 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="container-docs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">You&apos;re offline</p>
                <p className="text-sm text-amber-100">
                  Some features may not be available. Check your internet connection.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg font-medium transition-colors min-h-[44px] min-w-[44px]"
              aria-label={isRetrying ? 'Retrying connection...' : 'Retry connection'}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {isRetrying ? 'Retrying...' : 'Retry'}
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
