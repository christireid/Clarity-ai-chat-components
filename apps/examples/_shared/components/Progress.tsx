import React from 'react'

export interface ProgressProps {
  value: number
  max?: number
  color?: string
  bgColor?: string
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const heightClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function Progress({
  value,
  max = 100,
  color = 'bg-blue-500',
  bgColor = 'bg-slate-200',
  height = 'md',
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="w-full">
      <div
        className={`w-full ${bgColor} rounded-full ${heightClasses[height]}`}
      >
        <div
          className={`${color} ${heightClasses[height]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

export default Progress
