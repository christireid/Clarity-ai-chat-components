'use client'

import { useCallback, useRef, useState } from 'react'
import { Download, Camera, Check, Loader2 } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ScreenshotCaptureProps {
  targetRef: React.RefObject<HTMLElement>
  fileName?: string
  format?: 'png' | 'jpeg' | 'webp'
  quality?: number
  className?: string
}

export function ScreenshotCapture({
  targetRef,
  fileName = 'screenshot',
  format = 'png',
  quality = 0.95,
  className,
}: ScreenshotCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCaptured, setIsCaptured] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const captureScreenshot = useCallback(async () => {
    if (!targetRef.current) return

    setIsCapturing(true)
    setIsCaptured(false)

    try {
      // In a real implementation, use html2canvas or similar
      // For now, we'll create a placeholder
      const element = targetRef.current
      const rect = element.getBoundingClientRect()

      const canvas = document.createElement('canvas')
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Draw placeholder
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#1f2937'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Screenshot captured', canvas.width / 2, canvas.height / 2)

      // Convert to blob and download
      canvas.toBlob(
        (blob) => {
          if (!blob) return

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `${fileName}-${Date.now()}.${format}`
          link.href = url
          link.click()

          URL.revokeObjectURL(url)

          setIsCaptured(true)
          setTimeout(() => setIsCaptured(false), 2000)
        },
        `image/${format}`,
        quality
      )
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
    } finally {
      setIsCapturing(false)
    }
  }, [targetRef, fileName, format, quality])

  return (
    <button
      onClick={captureScreenshot}
      disabled={isCapturing}
      className={cn(
        'px-4 py-2 rounded-lg transition-all flex items-center gap-2',
        isCaptured
          ? 'bg-green-500/20 text-green-500'
          : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5',
        isCapturing && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isCapturing && <Loader2 className="h-4 w-4 animate-spin" />}
      {isCaptured && <Check className="h-4 w-4" />}
      {!isCapturing && !isCaptured && <Camera className="h-4 w-4" />}
      <span>
        {isCapturing && 'Capturing...'}
        {isCaptured && 'Captured!'}
        {!isCapturing && !isCaptured && 'Capture Screenshot'}
      </span>
    </button>
  )
}
