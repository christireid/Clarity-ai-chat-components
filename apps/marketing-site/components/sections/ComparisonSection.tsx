'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X, ArrowRight, Minus } from 'lucide-react'
import { durations } from '@/lib/constants'

const comparisonData = [
  {
    feature: 'Development Time',
    clarity: '2 Days',
    custom: '3+ Months',
    highlight: true,
  },
  {
    feature: 'Initial Cost',
    clarity: '$49/mo',
    custom: '$45,000+',
    highlight: true,
  },
  {
    feature: 'Maintenance',
    clarity: 'Included',
    custom: '$2,000/mo',
    highlight: false,
  },
  {
    feature: 'Streaming Logic',
    clarity: 'Built-in (60fps)',
    custom: 'Manual impl.',
    highlight: false,
  },
  {
    feature: 'Accessibility (WCAG)',
    clarity: '100% Compliant',
    custom: 'Rarely prioritized',
    highlight: false,
  },
  {
    feature: 'Token Optimization',
    clarity: '40% Savings',
    custom: 'None',
    highlight: true,
  },
]

export default function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 bg-surface-950 overflow-hidden">
        {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-clarity-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Reinvent the <span className="gradient-text">Chat Interface</span>
          </h2>
          <p className="text-gray-400">
            Building a production-grade chat UI is harder than it looks. We've done the heavy lifting.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: durations.slow }}
          className="rounded-2xl border border-white/10 bg-surface-900/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="grid grid-cols-3 border-b border-white/10 bg-surface-900/80">
            <div className="p-6 text-sm font-semibold text-gray-400">Feature</div>
            <div className="p-6 text-lg font-bold text-white bg-clarity-500/5 border-x border-white/5 flex items-center justify-center gap-2">
                Clarity Chat
                <span className="px-2 py-0.5 rounded-full bg-clarity-500 text-white text-[10px] uppercase tracking-wider">Pro</span>
            </div>
            <div className="p-6 text-lg font-semibold text-gray-500 flex items-center justify-center">
                Building In-House
            </div>
          </div>

          {comparisonData.map((row, i) => (
            <div 
                key={row.feature}
                className={`grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors ${row.highlight ? 'bg-white/[0.02]' : ''}`}
            >
                <div className="p-5 flex items-center text-sm font-medium text-gray-300 pl-8">
                    {row.feature}
                </div>
                
                <div className="p-5 flex items-center justify-center border-x border-white/5 bg-clarity-500/[0.02]">
                    {row.highlight ? (
                        <span className="text-clarity-400 font-bold flex items-center gap-2">
                            <Check className="w-4 h-4" /> {row.clarity}
                        </span>
                    ) : (
                        <span className="text-white flex items-center gap-2">
                            <Check className="w-4 h-4 text-gray-500" /> {row.clarity}
                        </span>
                    )}
                </div>

                <div className="p-5 flex items-center justify-center text-gray-500">
                    {row.custom.includes('Month') || row.custom.includes('$') ? (
                        <span className="text-red-400/80 flex items-center gap-2">
                           <X className="w-4 h-4" /> {row.custom}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Minus className="w-4 h-4 opacity-50" /> {row.custom}
                        </span>
                    )}
                </div>
            </div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
             <p className="text-sm text-gray-500 mb-4">
                "We estimated it would take 3 engineers 2 months to build what Clarity provides out of the box."
             </p>
             <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                — CTO, FinanceFlow
             </div>
        </div>
      </div>
    </section>
  )
}
