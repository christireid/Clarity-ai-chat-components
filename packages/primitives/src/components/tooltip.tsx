import * as React from 'react'

// Placeholder for Tooltip component - will be implemented with Radix UI
export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>
}
