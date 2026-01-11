'use client'

import React, { useState } from 'react'
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Code2,
} from 'lucide-react'
import { SandpackWrapper } from './Sandpack/SandpackWrapper'
import { playgroundTemplates } from '@/lib/playground-templates'

interface CodePlaygroundProps {
  initialCode: string
  title?: string
  dependencies?: Record<string, string>
  onCodeChange?: (code: string) => void
  className?: string
  height?: string
}

export function CodePlayground({
  initialCode,
  title = 'Clarity Chat Example',
  dependencies = {},
  onCodeChange,
  className,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Reset handler
  const handleReset = () => {
    setCode(initialCode)
    onCodeChange?.(initialCode)
  }

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-background'
    : `w-full bg-background rounded-lg border border-border shadow-sm ${className || ''}`

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview via Sandpack */}
      <div className={isFullscreen ? 'h-[calc(100vh-53px)]' : 'h-[600px]'}>
        <SandpackWrapper
          code={code}
          dependencies={dependencies}
          template="react-ts"
        />
      </div>
    </div>
  )
}
