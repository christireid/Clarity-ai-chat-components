import React from 'react'

export interface TypingIndicatorProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

export function TypingIndicator({
  color = 'bg-blue-500',
  size = 'md',
}: TypingIndicatorProps) {
  const dotClass = `${sizeClasses[size]} ${color} rounded-full animate-bounce`

  return (
    <div className="flex items-center gap-1">
      <span className={dotClass} style={{ animationDelay: '0ms' }} />
      <span className={dotClass} style={{ animationDelay: '150ms' }} />
      <span className={dotClass} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default TypingIndicator
