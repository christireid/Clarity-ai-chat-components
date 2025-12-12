'use client'

/**
 * TradeConfirmationModal Component
 *
 * Human-in-the-loop confirmation for critical trade actions.
 * Requires explicit user approval before execution.
 *
 * Accessibility features:
 * - Focus trap within modal
 * - ARIA labels and roles
 * - Keyboard navigation (Enter to confirm, Escape to cancel)
 * - Live region announcements
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  ShieldCheck,
  X,
  TrendingUp,
  TrendingDown,
  Check,
  Loader2,
} from 'lucide-react'
import type { ExecuteTradeArgs } from '../../lib/types'

interface TradeConfirmationModalProps {
  toolCall: {
    name: 'execute_trade'
    args: ExecuteTradeArgs
  }
  currentPrice: number
  onApprove: () => void
  onReject: () => void
  isProcessing?: boolean
}

export function TradeConfirmationModal({
  toolCall,
  currentPrice,
  onApprove,
  onReject,
  isProcessing = false,
}: TradeConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { action, symbol, quantity, orderType, limitPrice } = toolCall.args

  const isBuy = action === 'buy'
  const effectivePrice = orderType === 'limit' && limitPrice ? limitPrice : currentPrice
  const estimatedTotal = effectivePrice * quantity
  const estimatedFees = estimatedTotal * 0.001

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<Element | null>(null)

  // Store previously focused element and focus confirm button on mount
  useEffect(() => {
    previousActiveElement.current = document.activeElement
    setIsVisible(true)

    // Focus the confirm button after animation
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus()
    }, 100)

    return () => {
      clearTimeout(timer)
      // Restore focus when unmounting
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus()
      }
    }
  }, [])

  // Focus trap within modal
  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [])

  // Keyboard shortcuts for confirm/cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProcessing) return
      if (e.key === 'Enter' && document.activeElement === confirmButtonRef.current) {
        // Only trigger on Enter if confirm button is focused (natural behavior)
        // Let the button's onClick handle it
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onReject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onReject, isProcessing])

  const handleApprove = useCallback(() => {
    if (!isProcessing) onApprove()
  }, [isProcessing, onApprove])

  const handleReject = useCallback(() => {
    if (!isProcessing) onReject()
  }, [isProcessing, onReject])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={modalRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="trade-confirmation-title"
          aria-describedby="trade-confirmation-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border-2 border-amber-400 dark:border-amber-500/50
                     bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50
                     overflow-hidden shadow-lg shadow-amber-500/10"
        >
          {/* Screen reader announcement */}
          <div className="sr-only" role="status" aria-live="assertive">
            Trade confirmation required for {action}ing {quantity} shares of {symbol}
          </div>

          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                <span id="trade-confirmation-title" className="font-semibold">
                  Trade Confirmation Required
                </span>
              </div>
              <button
                ref={cancelButtonRef}
                onClick={handleReject}
                disabled={isProcessing}
                className="p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-50"
                aria-label="Cancel trade"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Action Badge */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
                  isBuy
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                }`}
              >
                {isBuy ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {action.toUpperCase()} {symbol}
              </motion.div>
            </div>

            {/* Trade Details */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-3 mb-5"
            >
              <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-500/20">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="font-semibold">{quantity} shares</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-500/20">
                <span className="text-sm text-muted-foreground">Order Type</span>
                <span className="font-semibold capitalize">{orderType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-500/20">
                <span className="text-sm text-muted-foreground">
                  {orderType === 'limit' ? 'Limit Price' : 'Current Price'}
                </span>
                <span className="font-semibold">${effectivePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-500/20">
                <span className="text-sm text-muted-foreground">Est. Fees (0.1%)</span>
                <span className="font-semibold">${estimatedFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg px-3 -mx-3">
                <span className="font-medium">Estimated Total</span>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  ${(estimatedTotal + estimatedFees).toFixed(2)}
                </span>
              </div>
            </motion.div>

            {/* Warning */}
            <motion.div
              id="trade-confirmation-description"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <strong>This action cannot be undone.</strong> By approving, you confirm this trade.
                {orderType === 'market' && (
                  <span className="block mt-1">
                    Market orders execute at the best available price, which may differ from the
                    displayed price.
                  </span>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex gap-3"
              role="group"
              aria-label="Trade confirmation actions"
            >
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                           bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-200 rounded-lg font-medium
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Cancel ${action} order for ${symbol}`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Cancel
                <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded" aria-hidden="true">
                  ESC
                </kbd>
              </button>
              <button
                ref={confirmButtonRef}
                onClick={handleApprove}
                disabled={isProcessing}
                aria-label={`Confirm ${action} ${quantity} shares of ${symbol} for $${(estimatedTotal + estimatedFees).toFixed(2)}`}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3
                           rounded-lg font-semibold transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${
                             isBuy
                               ? 'bg-green-500 hover:bg-green-600 text-white'
                               : 'bg-red-500 hover:bg-red-600 text-white'
                           }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                    <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded">
                      Enter
                    </kbd>
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-200/50 dark:border-amber-500/20">
            <p className="text-[10px] text-center text-muted-foreground">
              This is a simulated trade for demonstration purposes only. No real transactions will occur.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

TradeConfirmationModal.displayName = 'TradeConfirmationModal'
