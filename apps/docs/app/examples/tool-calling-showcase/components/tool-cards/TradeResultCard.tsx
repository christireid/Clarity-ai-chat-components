'use client'

/**
 * TradeResultCard Component
 *
 * Displays the result of an executed trade with celebration animation.
 */

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, Receipt, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import type { TradeResult } from '../../lib/types'

interface TradeResultCardProps {
  data: TradeResult
}

export const TradeResultCard = memo(function TradeResultCard({ data }: TradeResultCardProps) {
  const isBuy = data.action === 'buy'
  const formattedDate = new Date(data.timestamp).toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`rounded-xl border overflow-hidden shadow-sm ${
        isBuy
          ? 'border-green-200 dark:border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50'
          : 'border-red-200 dark:border-red-500/30 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50'
      }`}
    >
      {/* Success Header */}
      <div
        className={`px-4 py-3 ${
          isBuy ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Check className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="font-semibold">Trade Executed</div>
              <div className="text-xs text-white/80">Order #{data.orderId.slice(-8)}</div>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              data.status === 'filled'
                ? 'bg-white/20'
                : data.status === 'partial'
                  ? 'bg-amber-400/30'
                  : 'bg-red-400/30'
            }`}
          >
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Trade Summary */}
      <div className="p-4">
        {/* Action & Symbol */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
              isBuy
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
            }`}
          >
            {isBuy ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {data.action.toUpperCase()} {data.symbol}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center py-2 border-b border-current/10">
            <span className="text-sm text-muted-foreground">Shares</span>
            <span className="font-semibold">{data.quantity}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-current/10">
            <span className="text-sm text-muted-foreground">Executed Price</span>
            <span className="font-semibold">${data.executedPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-current/10">
            <span className="text-sm text-muted-foreground">Fees</span>
            <span className="font-semibold">${data.fees.toFixed(2)}</span>
          </div>
          <div
            className={`flex justify-between items-center py-3 px-3 -mx-3 rounded-lg ${
              isBuy ? 'bg-green-100/50 dark:bg-green-900/20' : 'bg-red-100/50 dark:bg-red-900/20'
            }`}
          >
            <span className="font-medium">Total Value</span>
            <span className={`text-xl font-bold ${isBuy ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              ${(data.totalValue + data.fees).toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-2 border-t flex items-center justify-between text-xs text-muted-foreground ${
          isBuy ? 'border-green-200/50 dark:border-green-500/20 bg-green-500/5' : 'border-red-200/50 dark:border-red-500/20 bg-red-500/5'
        }`}
      >
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Receipt className="w-3 h-3" />
          <span>Simulated Trade</span>
        </div>
      </div>
    </motion.div>
  )
})
