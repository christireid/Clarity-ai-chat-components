'use client'

import React, { useEffect, useRef } from 'react'

interface VoiceVisualizerProps {
  isRecording: boolean
}

export function VoiceVisualizer({ isRecording }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!isRecording || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let offset = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()

      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2

      ctx.moveTo(0, centerY)

      // Simulate a waveform
      for (let x = 0; x < width; x++) {
        const amplitude = 10
        const frequency = 0.05
        const y =
          centerY +
          Math.sin(x * frequency + offset) * amplitude * Math.sin(x * 0.01)
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = '#3b82f6' // Primary color
      ctx.lineWidth = 2
      ctx.stroke()

      offset += 0.2
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording])

  if (!isRecording) return null

  return (
    <div className="absolute inset-0 bg-background/90 z-10 flex items-center justify-center rounded-lg border border-primary/20 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full h-full max-w-[300px] max-h-[60px]"
      />
      <div className="absolute text-xs font-mono text-primary animate-pulse bottom-1">
        Listening...
      </div>
    </div>
  )
}
