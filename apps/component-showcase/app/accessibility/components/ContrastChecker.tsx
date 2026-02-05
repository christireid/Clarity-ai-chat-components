'use client'

import { useState } from 'react'
import { Contrast, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ContrastTest {
  foreground: string
  background: string
  ratio: number
  aaLarge: boolean
  aaNormal: boolean
  aaaLarge: boolean
  aaaNormal: boolean
}

export function ContrastChecker() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')

  // Simplified contrast calculation (in production, use a proper library)
  const calculateContrast = (fg: string, bg: string): number => {
    // This is a simplified version - in production use a proper color contrast library
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(fg)
    const l2 = getLuminance(bg)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  const ratio = calculateContrast(foreground, background)
  const test: ContrastTest = {
    foreground,
    background,
    ratio,
    aaLarge: ratio >= 3,
    aaNormal: ratio >= 4.5,
    aaaLarge: ratio >= 4.5,
    aaaNormal: ratio >= 7,
  }

  const presetColors = [
    { name: 'Black on White', fg: '#000000', bg: '#ffffff', ratio: 21 },
    { name: 'White on Black', fg: '#ffffff', bg: '#000000', ratio: 21 },
    { name: 'Dark Gray on White', fg: '#333333', bg: '#ffffff', ratio: 12.6 },
    { name: 'Blue on White', fg: '#0066cc', bg: '#ffffff', ratio: 7.7 },
    { name: 'Light Gray on White', fg: '#cccccc', bg: '#ffffff', ratio: 1.6 },
    { name: 'Dark Blue on Light Blue', fg: '#003366', bg: '#e6f2ff', ratio: 10.5 },
  ]

  return (
    <div className="space-y-6">
      {/* Color Pickers */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-6">
          <label className="block text-sm font-medium mb-3">Foreground (Text)</label>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg glass font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <label className="block text-sm font-medium mb-3">Background</label>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg glass font-mono text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Preview</h3>
        <div
          className="rounded-lg p-8 text-center"
          style={{ backgroundColor: background, color: foreground }}
        >
          <p className="text-sm mb-2">Small Text (14px)</p>
          <p className="text-lg mb-2">Normal Text (18px)</p>
          <p className="text-2xl font-bold">Large Text (24px+)</p>
        </div>
      </div>

      {/* Contrast Ratio */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Contrast Ratio</h3>
          <div className="text-3xl font-bold gradient-text">{ratio.toFixed(2)}:1</div>
        </div>

        {/* WCAG Compliance */}
        <div className="grid gap-3 md:grid-cols-2">
          <div
            className={cn(
              'glass-panel p-4 border-l-4',
              test.aaNormal ? 'border-green-500' : 'border-red-500'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {test.aaNormal ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold">AA Normal Text</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires 4.5:1 (Current: {ratio.toFixed(2)}:1)
            </p>
          </div>

          <div
            className={cn(
              'glass-panel p-4 border-l-4',
              test.aaLarge ? 'border-green-500' : 'border-red-500'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {test.aaLarge ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold">AA Large Text</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires 3:1 (Current: {ratio.toFixed(2)}:1)
            </p>
          </div>

          <div
            className={cn(
              'glass-panel p-4 border-l-4',
              test.aaaNormal ? 'border-green-500' : 'border-orange-500'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {test.aaaNormal ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
              <span className="font-semibold">AAA Normal Text</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires 7:1 (Current: {ratio.toFixed(2)}:1)
            </p>
          </div>

          <div
            className={cn(
              'glass-panel p-4 border-l-4',
              test.aaaLarge ? 'border-green-500' : 'border-orange-500'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {test.aaaLarge ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
              <span className="font-semibold">AAA Large Text</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requires 4.5:1 (Current: {ratio.toFixed(2)}:1)
            </p>
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Preset Color Combinations</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {presetColors.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                setForeground(preset.fg)
                setBackground(preset.bg)
              }}
              className="glass-panel p-4 text-left hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{preset.name}</span>
                <span className="badge-glass text-xs">{preset.ratio.toFixed(1)}:1</span>
              </div>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: preset.fg }}
                />
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: preset.bg }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Contrast Guidelines</h3>
        <div className="space-y-3 text-sm">
          <div className="glass-panel p-3 bg-background/30">
            <p className="font-medium mb-1">Level AA (Minimum)</p>
            <p className="text-muted-foreground">
              • Normal text (under 18px): 4.5:1<br />
              • Large text (18px+ or 14px+ bold): 3:1
            </p>
          </div>
          <div className="glass-panel p-3 bg-background/30">
            <p className="font-medium mb-1">Level AAA (Enhanced)</p>
            <p className="text-muted-foreground">
              • Normal text: 7:1<br />
              • Large text: 4.5:1
            </p>
          </div>
          <div className="glass-panel p-3 bg-background/30">
            <p className="font-medium mb-1">UI Components</p>
            <p className="text-muted-foreground">
              • Interactive elements: 3:1<br />
              • Focus indicators: 3:1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
