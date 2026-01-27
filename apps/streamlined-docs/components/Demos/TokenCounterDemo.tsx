'use client'

/**
 * Token Counter Demo - Live token counting
 *
 * Shows real-time token counting as user types,
 * with character/word stats and model comparison.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Calculator, Type, Hash, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TokenCounterDemo() {
  const [text, setText] = React.useState(
    'Token optimization helps you manage context windows efficiently. Try editing this text to see the token count update in real-time!'
  )
  const [isCalculating, setIsCalculating] = React.useState(false)

  // Simple token estimation (4 chars per token average)
  const estimatedTokens = Math.ceil(text.length / 4)
  const characters = text.length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const charsPerToken = characters > 0 ? (characters / estimatedTokens).toFixed(2) : '0'

  // Simulate calculation delay for realism
  React.useEffect(() => {
    setIsCalculating(true)
    const timer = setTimeout(() => setIsCalculating(false), 150)
    return () => clearTimeout(timer)
  }, [text])

  const exampleTexts = [
    'Hello world!',
    'The quick brown fox jumps over the lazy dog.',
    'In the realm of artificial intelligence, token optimization plays a crucial role in managing computational resources and ensuring efficient processing of natural language.',
  ]

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Input Text</label>
          {isCalculating && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-3 h-3" />
              </motion.div>
              Counting...
            </span>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className={cn(
            'w-full min-h-[150px] p-4 rounded-lg',
            'bg-muted/30 border border-border/50',
            'focus:outline-none focus:ring-2 focus:ring-brand-500',
            'text-foreground placeholder:text-muted-foreground',
            'resize-none transition-all',
            'font-sans text-sm leading-relaxed'
          )}
        />
      </div>

      {/* Token Count Display */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="p-6 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 border-2 border-brand-200 dark:border-brand-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-brand-500/10">
              <Calculator className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Token Count</div>
              <motion.div
                key={estimatedTokens}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-brand-700 dark:text-brand-300"
              >
                {estimatedTokens.toLocaleString()}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-300">Characters</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {characters.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300">Words</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {words.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-700 dark:text-purple-300">
              Chars/Token
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {charsPerToken}
          </div>
        </div>
      </div>

      {/* Example Texts */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Try These Examples</h4>
        <div className="grid gap-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className={cn(
                'p-3 rounded-lg text-left text-sm',
                'bg-muted/20 border border-border/50',
                'hover:border-brand-500/30 hover:bg-brand-500/5',
                'transition-all group'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground group-hover:text-foreground line-clamp-1">
                  {example}
                </span>
                <span className="text-xs font-mono text-brand-600 dark:text-brand-400 shrink-0 ml-2">
                  ~{Math.ceil(example.length / 4)} tokens
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Model Comparison */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Estimated Across Models</h4>
        <div className="space-y-1">
          {[
            { model: 'GPT-4', ratio: 4.0 },
            { model: 'Claude', ratio: 3.8 },
            { model: 'Gemini', ratio: 4.2 },
          ].map(({ model, ratio }) => {
            const tokens = Math.ceil(characters / ratio)
            return (
              <div
                key={model}
                className="flex items-center justify-between p-2 rounded-md bg-muted/20"
              >
                <span className="text-sm font-medium">{model}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {ratio.toFixed(1)} chars/token
                  </span>
                  <span className="text-sm font-mono text-brand-600 dark:text-brand-400">
                    ~{tokens} tokens
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> This is an estimated count using a simple heuristic.
          For accurate counts, use the <code>useTokenCount</code> hook with real
          tokenization.
        </p>
      </div>
    </div>
  )
}
