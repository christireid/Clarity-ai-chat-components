'use client'

import { ReactNode } from 'react'
import { cn } from '@clarity-chat/primitives'

interface DeviceFrameProps {
  device: 'iphone' | 'ipad' | 'macbook' | 'imac' | 'none'
  width: number
  height: number
  children: ReactNode
  className?: string
}

export function DeviceFrame({ device, width, height, children, className }: DeviceFrameProps) {
  if (device === 'none') {
    return (
      <div className={cn('relative overflow-hidden rounded-lg', className)} style={{ width, height }}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* iPhone Frame */}
      {device === 'iphone' && (
        <div
          className="relative mx-auto bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-gray-900"
          style={{ width: width + 28, height: height + 28 }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-3xl z-10" />
          {/* Screen */}
          <div className="relative w-full h-full bg-white dark:bg-gray-950 overflow-hidden">
            {children}
          </div>
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full" />
        </div>
      )}

      {/* iPad Frame */}
      {device === 'ipad' && (
        <div
          className="relative mx-auto bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border-[12px] border-gray-900"
          style={{ width: width + 24, height: height + 24 }}
        >
          {/* Screen */}
          <div className="relative w-full h-full bg-white dark:bg-gray-950 overflow-hidden">
            {children}
          </div>
          {/* Camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full" />
        </div>
      )}

      {/* MacBook Frame */}
      {device === 'macbook' && (
        <div className="relative">
          {/* Screen */}
          <div
            className="relative mx-auto bg-gray-900 rounded-t-xl shadow-2xl overflow-hidden border-t-[6px] border-x-[6px] border-gray-900"
            style={{ width: width + 12, height: height + 6 }}
          >
            <div className="relative w-full h-full bg-white dark:bg-gray-950 overflow-hidden">
              {children}
            </div>
            {/* Camera */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full" />
          </div>
          {/* Base */}
          <div
            className="h-3 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg mx-auto"
            style={{ width: width + 40 }}
          />
          {/* Keyboard indent */}
          <div
            className="h-1 bg-gray-900 mx-auto"
            style={{ width: width + 20 }}
          />
        </div>
      )}

      {/* iMac Frame */}
      {device === 'imac' && (
        <div className="relative">
          {/* Screen */}
          <div
            className="relative mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-[8px] border-gray-900"
            style={{ width: width + 16, height: height + 16 }}
          >
            <div className="relative w-full h-full bg-white dark:bg-gray-950 overflow-hidden">
              {children}
            </div>
            {/* Camera */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full" />
          </div>
          {/* Chin */}
          <div
            className="h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 mx-auto"
            style={{ width: width + 16 }}
          />
          {/* Stand */}
          <div className="relative">
            <div className="w-32 h-16 bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800 mx-auto rounded-t-lg" />
            <div className="w-48 h-3 bg-gray-500 dark:bg-gray-800 mx-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
