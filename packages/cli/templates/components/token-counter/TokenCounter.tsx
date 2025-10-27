/**
 * Token Counter Component
 * Real-time token usage display with cost estimation
 */

import React from 'react'

interface TokenCounterProps {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost?: number
  className?: string
}

export function TokenCounter({
  promptTokens,
  completionTokens,
  totalTokens,
  estimatedCost,
  className = '',
}: TokenCounterProps) {
  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-gray-500">📝</span>
        <span className="font-mono">{promptTokens.toLocaleString()}</span>
        <span className="text-gray-500 text-xs">prompt</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-500">💬</span>
        <span className="font-mono">{completionTokens.toLocaleString()}</span>
        <span className="text-gray-500 text-xs">completion</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-500">📊</span>
        <span className="font-mono font-semibold">{totalTokens.toLocaleString()}</span>
        <span className="text-gray-500 text-xs">total</span>
      </div>

      {estimatedCost !== undefined && (
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-gray-500">💰</span>
          <span className="font-mono font-semibold">${estimatedCost.toFixed(6)}</span>
          <span className="text-gray-500 text-xs">cost</span>
        </div>
      )}
    </div>
  )
}
