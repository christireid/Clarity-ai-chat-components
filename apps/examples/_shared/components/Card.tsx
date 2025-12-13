import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export function Card({
  children,
  className = '',
  variant = 'light',
}: CardProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`rounded-xl border shadow-sm ${
        isDark
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white border-slate-200'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
