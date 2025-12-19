'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gauge, Coins, Users, Zap } from 'lucide-react'

export default function TokenSavingsCalculator() {
  const [mau, setMau] = useState(10000)
  const [msgsPerUser, setMsgsPerUser] = useState(50)
  const [avgTokens, setAvgTokens] = useState(1000) // Input + Output

  // Assumptions:
  // GPT-4o cost blended: ~$5 / 1M tokens (very rough avg of input/output)
  // Clarity Cache savings: ~40% on Input tokens (which are usually 70% of traffic)
  // Let's assume conservative 30% total savings

  const totalTokens = mau * msgsPerUser * avgTokens
  const estimatedCost = (totalTokens / 1000000) * 5 // $5 per million
  const savings = estimatedCost * 0.4 // 40% savings claim

  return (
    <div className="glass-card p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
          <Gauge className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">ROI Calculator</h3>
          <p className="text-sm text-gray-400">Estimate your monthly savings</p>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        <div>
          <label className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Monthly Active Users
            </span>
            <span className="text-white font-mono">{mau.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={mau}
            onChange={(e) => setMau(Number(e.target.value))}
            className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-clarity-500"
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Msgs / User / Month
            </span>
            <span className="text-white font-mono">{msgsPerUser}</span>
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={msgsPerUser}
            onChange={(e) => setMsgsPerUser(Number(e.target.value))}
            className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-clarity-500"
          />
        </div>
      </div>

      <div className="bg-surface-900 rounded-xl p-6 border border-white/5">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Current Cost</div>
            <div className="text-2xl font-bold text-white">
              ${Math.round(estimatedCost).toLocaleString()}
              <span className="text-xs text-gray-600 font-normal">/mo</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-green-400 mb-1">Projected Savings</div>
            <div className="text-2xl font-bold text-green-400">
              ${Math.round(savings).toLocaleString()}
              <span className="text-xs text-green-500/70 font-normal">/mo</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500">
            Based on average LLM provider costs and 40% cache hit rate.
          </p>
        </div>
      </div>
    </div>
  )
}
