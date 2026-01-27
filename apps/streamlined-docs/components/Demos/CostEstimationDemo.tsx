'use client'

/**
 * Cost Estimation Demo - Real-time API cost tracking
 *
 * Shows estimated costs across different models with
 * input/output breakdown and model comparison.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Coins, TrendingUp, Zap, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModelConfig {
  name: string
  displayName: string
  inputCostPer1M: number
  outputCostPer1M: number
  contextWindow: number
}

const MODELS: ModelConfig[] = [
  {
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    contextWindow: 128000,
  },
  {
    name: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    contextWindow: 200000,
  },
  {
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    contextWindow: 128000,
  },
  {
    name: 'gemini-2.0-flash',
    displayName: 'Gemini 2.0 Flash',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    contextWindow: 1000000,
  },
]

export function CostEstimationDemo() {
  const [selectedModel, setSelectedModel] = React.useState<ModelConfig>(MODELS[0])
  const [inputTokens, setInputTokens] = React.useState(5000)
  const [estimatedOutputTokens, setEstimatedOutputTokens] = React.useState(2000)
  const [requestsPerDay, setRequestsPerDay] = React.useState(100)

  // Calculate costs
  const inputCost = (inputTokens / 1000000) * selectedModel.inputCostPer1M
  const outputCost = (estimatedOutputTokens / 1000000) * selectedModel.outputCostPer1M
  const costPerRequest = inputCost + outputCost
  const dailyCost = costPerRequest * requestsPerDay
  const monthlyCost = dailyCost * 30

  // Find cheapest model for comparison
  const allModelsCosts = MODELS.map((model) => {
    const cost =
      ((inputTokens / 1000000) * model.inputCostPer1M +
        (estimatedOutputTokens / 1000000) * model.outputCostPer1M) *
      requestsPerDay *
      30
    return { model, cost }
  })
  const cheapestModel = allModelsCosts.reduce((min, curr) =>
    curr.cost < min.cost ? curr : min
  )
  const savings =
    selectedModel.name !== cheapestModel.model.name
      ? monthlyCost - cheapestModel.cost
      : 0

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Model</label>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map((model) => (
            <button
              key={model.name}
              onClick={() => setSelectedModel(model)}
              className={cn(
                'p-3 rounded-lg border text-left transition-all',
                selectedModel.name === model.name
                  ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20'
                  : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
              )}
            >
              <div className="font-semibold text-sm">{model.displayName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                ${model.inputCostPer1M.toFixed(2)} / ${model.outputCostPer1M.toFixed(2)} per 1M
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Sliders */}
      <div className="space-y-4">
        {/* Input Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Input Tokens</label>
            <span className="text-sm font-mono text-brand-600 dark:text-brand-400">
              {inputTokens.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="50000"
            step="100"
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

        {/* Output Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Output Tokens (estimated)</label>
            <span className="text-sm font-mono text-brand-600 dark:text-brand-400">
              {estimatedOutputTokens.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="20000"
            step="100"
            value={estimatedOutputTokens}
            onChange={(e) => setEstimatedOutputTokens(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

        {/* Requests Per Day */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Requests Per Day</label>
            <span className="text-sm font-mono text-brand-600 dark:text-brand-400">
              {requestsPerDay.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            step="1"
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="text-xs text-blue-700 dark:text-blue-300">Input Cost</div>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            ${inputCost.toFixed(4)}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            per request
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs text-emerald-700 dark:text-emerald-300">
              Output Cost
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            ${outputCost.toFixed(4)}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            per request
          </div>
        </div>
      </div>

      {/* Total Costs */}
      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-semibold">Per Request</span>
            </div>
            <span className="text-2xl font-bold text-brand-700 dark:text-brand-300">
              ${costPerRequest.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Daily Cost</span>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              ${dailyCost.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            {requestsPerDay} requests per day
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-5 rounded-lg bg-purple-500/10 border-2 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold">Monthly Cost</span>
            </div>
            <span className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              ${monthlyCost.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Savings Alert */}
      {savings > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-sm text-green-700 dark:text-green-300">
              Potential Savings
            </span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Switch to <strong>{cheapestModel.model.displayName}</strong> to save{' '}
            <strong>${savings.toFixed(2)}/month</strong> (
            {((savings / monthlyCost) * 100).toFixed(0)}% reduction)
          </p>
        </motion.div>
      )}

      {/* Model Comparison Table */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Model Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 font-semibold">Model</th>
                <th className="text-right py-2 font-semibold">Monthly</th>
                <th className="text-right py-2 font-semibold">Difference</th>
              </tr>
            </thead>
            <tbody>
              {allModelsCosts
                .sort((a, b) => a.cost - b.cost)
                .map(({ model, cost }) => {
                  const diff = cost - monthlyCost
                  const isSelected = model.name === selectedModel.name
                  return (
                    <tr
                      key={model.name}
                      className={cn(
                        'border-b border-border/30',
                        isSelected && 'bg-brand-500/10'
                      )}
                    >
                      <td className="py-2">
                        <span className={cn(isSelected && 'font-semibold')}>
                          {model.displayName}
                        </span>
                      </td>
                      <td className="text-right py-2 font-mono">
                        ${cost.toFixed(2)}
                      </td>
                      <td
                        className={cn(
                          'text-right py-2 font-mono text-xs',
                          diff < 0
                            ? 'text-green-600 dark:text-green-400'
                            : diff > 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-muted-foreground'
                        )}
                      >
                        {diff === 0
                          ? '—'
                          : `${diff > 0 ? '+' : ''}$${Math.abs(diff).toFixed(2)}`}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
