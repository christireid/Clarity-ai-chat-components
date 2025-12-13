import React from 'react'

export interface HowToUseCardProps {
  title?: string
  children: React.ReactNode
  variant?: 'light' | 'dark'
}

export function HowToUseCard({
  title = '💡 How to Use',
  children,
  variant = 'light',
}: HowToUseCardProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${
        isDark
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white border-slate-200'
      }`}
    >
      <h2
        className={`text-base font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      <div
        className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default HowToUseCard
