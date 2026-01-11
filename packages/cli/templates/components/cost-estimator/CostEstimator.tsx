/**
 * Cost Estimator Component
 * Calculate and display API costs in real-time
 */

import React, { useMemo } from 'react'

// Pricing per 1K tokens (as of 2024)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3.5-sonnet': { input: 0.003, output: 0.015 },
  'gemini-pro': { input: 0.00025, output: 0.0005 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
}

interface CostEstimatorProps {
  model: string
  inputTokens: number
  outputTokens: number
  showBreakdown?: boolean
  currency?: 'USD' | 'EUR' | 'GBP'
  className?: string
}

export function CostEstimator({
  model,
  inputTokens,
  outputTokens,
  showBreakdown = true,
  currency = 'USD',
  className = '',
}: CostEstimatorProps) {
  const { inputCost, outputCost, totalCost, pricing } = useMemo(() => {
    const pricing = MODEL_PRICING[model] || { input: 0.01, output: 0.03 }
    const inputCost = (inputTokens / 1000) * pricing.input
    const outputCost = (outputTokens / 1000) * pricing.output
    const totalCost = inputCost + outputCost

    return { inputCost, outputCost, totalCost, pricing }
  }, [model, inputTokens, outputTokens])

  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    })
    return formatter.format(value)
  }

  const currencySymbol = { USD: '$', EUR: '\u20AC', GBP: '\u00A3' }[currency]

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Cost Estimate</h3>
        <span className="text-xs text-gray-500">{model}</span>
      </div>

      {showBreakdown && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Input ({inputTokens.toLocaleString()} tokens)
            </span>
            <span className="font-mono">{formatCurrency(inputCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Output ({outputTokens.toLocaleString()} tokens)
            </span>
            <span className="font-mono">{formatCurrency(outputCost)}</span>
          </div>
          <div className="border-t pt-2" />
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">Total Cost</span>
        <span className="text-lg font-bold font-mono text-green-600">
          {formatCurrency(totalCost)}
        </span>
      </div>

      {/* Pricing info tooltip */}
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-400">
          Pricing: {currencySymbol}
          {pricing.input}/1K input, {currencySymbol}
          {pricing.output}/1K output
        </p>
      </div>
    </div>
  )
}

// Hook for tracking costs across a session
export function useCostTracking(model: string) {
  const [totals, setTotals] = React.useState({
    inputTokens: 0,
    outputTokens: 0,
    requests: 0,
  })

  const addUsage = React.useCallback(
    (inputTokens: number, outputTokens: number) => {
      setTotals((prev) => ({
        inputTokens: prev.inputTokens + inputTokens,
        outputTokens: prev.outputTokens + outputTokens,
        requests: prev.requests + 1,
      }))
    },
    []
  )

  const reset = React.useCallback(() => {
    setTotals({ inputTokens: 0, outputTokens: 0, requests: 0 })
  }, [])

  const pricing = MODEL_PRICING[model] || { input: 0.01, output: 0.03 }
  const totalCost =
    (totals.inputTokens / 1000) * pricing.input +
    (totals.outputTokens / 1000) * pricing.output

  return {
    ...totals,
    totalCost,
    addUsage,
    reset,
  }
}
