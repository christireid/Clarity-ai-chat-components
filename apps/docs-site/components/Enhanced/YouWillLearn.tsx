'use client'

import { CheckCircle2 } from 'lucide-react'

interface YouWillLearnProps {
  items: string[]
}

export function YouWillLearn({ items }: YouWillLearnProps) {
  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20">
      <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-brand-500" />
        You will learn
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-text-secondary">
            <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
