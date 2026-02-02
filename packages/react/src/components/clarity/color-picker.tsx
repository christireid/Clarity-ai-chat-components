'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import { Check, Copy, Pipette, RefreshCw } from 'lucide-react'

// Preset color palettes
const presetColors = {
  basic: [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff',
    '#c0c0c0',
    '#808080',
  ],
  tailwind: [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#78716c',
    '#71717a',
    '#737373',
  ],
  pastel: [
    '#fecaca',
    '#fed7aa',
    '#fef08a',
    '#d9f99d',
    '#bbf7d0',
    '#a7f3d0',
    '#99f6e4',
    '#a5f3fc',
    '#bae6fd',
    '#c7d2fe',
    '#ddd6fe',
    '#e9d5ff',
    '#f5d0fe',
    '#fbcfe8',
    '#fecdd3',
  ],
}

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  showAlpha?: boolean
  presets?: string[]
  className?: string
}

export function ColorPicker({
  value = '#3b82f6',
  onChange,
  showAlpha = false,
  presets,
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [color, setColor] = React.useState(value)
  const [hue, setHue] = React.useState(220)
  const [saturation, setSaturation] = React.useState(90)
  const [lightness, setLightness] = React.useState(54)
  const [alpha, setAlpha] = React.useState(100)
  const [copied, setCopied] = React.useState(false)

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Parse hex to HSL on mount
  React.useEffect(() => {
    const hex = value.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2

    let h = 0
    let s = 0

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    setHue(Math.round(h * 360))
    setSaturation(Math.round(s * 100))
    setLightness(Math.round(l * 100))
  }, [value])

  // Draw color gradient canvas
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Draw saturation-lightness gradient
    for (let x = 0; x <= width; x++) {
      for (let y = 0; y <= height; y++) {
        const s = (x / width) * 100
        const l = 100 - (y / height) * 100
        ctx.fillStyle = `hsl(${hue}, ${s}%, ${l}%)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }, [hue])

  const handleColorChange = (
    h: number,
    s: number,
    l: number,
    a: number = alpha
  ) => {
    setHue(h)
    setSaturation(s)
    setLightness(l)
    setAlpha(a)

    // Convert HSL to hex
    const hslToHex = (h: number, s: number, l: number) => {
      s /= 100
      l /= 100
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    const hex = hslToHex(h, s, l)
    setColor(hex)
    onChange?.(hex)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const s = Math.round((x / canvas.width) * 100)
    const l = Math.round(100 - (y / canvas.height) * 100)

    handleColorChange(hue, s, l)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleHexInput = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColor(hex)
      onChange?.(hex)
    }
  }

  const displayPresets = presets ?? presetColors.tailwind

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start gap-2', className)}
        >
          <div
            className="h-5 w-5 rounded border border-border"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-sm">{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        {/* Color Gradient */}
        <canvas
          ref={canvasRef}
          width={240}
          height={150}
          className="w-full h-36 rounded-md cursor-crosshair border border-border mb-3"
          onClick={handleCanvasClick}
        />

        {/* Hue Slider */}
        <div className="space-y-2 mb-3">
          <Label className="text-xs">Hue</Label>
          <div
            className="h-3 rounded-md"
            style={{
              background:
                'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          >
            <Slider
              value={[hue]}
              max={360}
              step={1}
              onValueChange={([h]) =>
                handleColorChange(h, saturation, lightness)
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-2"
            />
          </div>
        </div>

        {/* Alpha Slider */}
        {showAlpha && (
          <div className="space-y-2 mb-3">
            <Label className="text-xs">Alpha</Label>
            <div
              className="h-3 rounded-md"
              style={{
                background: `linear-gradient(to right, transparent, ${color})`,
              }}
            >
              <Slider
                value={[alpha]}
                max={100}
                step={1}
                onValueChange={([a]) =>
                  handleColorChange(hue, saturation, lightness, a)
                }
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-2"
              />
            </div>
          </div>
        )}

        {/* Hex Input */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-9 w-9 rounded border border-border shrink-0"
            style={{ backgroundColor: color }}
          />
          <Input
            value={color}
            onChange={(e) => handleHexInput(e.target.value)}
            className="font-mono text-sm"
            maxLength={7}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <Label className="text-xs">Presets</Label>
          <div className="grid grid-cols-10 gap-1">
            {displayPresets.map((preset) => (
              <button
                key={preset}
                className={cn(
                  'h-5 w-5 rounded border border-border transition-transform hover:scale-110',
                  color === preset && 'ring-2 ring-accent ring-offset-1'
                )}
                style={{ backgroundColor: preset }}
                onClick={() => {
                  setColor(preset)
                  onChange?.(preset)
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Color swatch display
interface ColorSwatchProps {
  colors: string[]
  selected?: string
  onSelect?: (color: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatch({
  colors,
  selected,
  onSelect,
  size = 'md',
  className,
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  }

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {colors.map((color) => (
        <button
          key={color}
          className={cn(
            'rounded border border-border transition-transform hover:scale-110',
            sizeClasses[size],
            selected === color && 'ring-2 ring-accent ring-offset-2'
          )}
          style={{ backgroundColor: color }}
          onClick={() => onSelect?.(color)}
        />
      ))}
    </div>
  )
}

// Theme selector
interface ThemeSelectorProps {
  themes: {
    id: string
    name: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
    }
  }[]
  selected?: string
  onSelect?: (themeId: string) => void
  className?: string
}

export function ThemeSelector({
  themes,
  selected,
  onSelect,
  className,
}: ThemeSelectorProps) {
  return (
    <div className={cn('grid gap-3', className)}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-colors text-left',
            selected === theme.id
              ? 'border-accent bg-accent/10'
              : 'border-border hover:border-accent/50'
          )}
          onClick={() => onSelect?.(theme.id)}
        >
          <div className="flex gap-1">
            <div
              className="h-8 w-8 rounded-l"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="h-8 w-4"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="h-8 w-4"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div
              className="h-8 w-8 rounded-r border"
              style={{ backgroundColor: theme.colors.background }}
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{theme.name}</div>
          </div>
          {selected === theme.id && <Check className="h-4 w-4 text-accent" />}
        </button>
      ))}
    </div>
  )
}

// Gradient picker
interface GradientPickerProps {
  value?: string
  onChange?: (gradient: string) => void
  className?: string
}

export function GradientPicker({
  value = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  onChange,
  className,
}: GradientPickerProps) {
  const [color1, setColor1] = React.useState('#667eea')
  const [color2, setColor2] = React.useState('#764ba2')
  const [angle, setAngle] = React.useState(135)

  const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`

  React.useEffect(() => {
    onChange?.(gradient)
  }, [color1, color2, angle, onChange, gradient])

  const presetGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preview */}
      <div
        className="h-24 rounded-lg border border-border"
        style={{ background: gradient }}
      />

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Start Color</Label>
          <ColorPicker value={color1} onChange={setColor1} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">End Color</Label>
          <ColorPicker value={color2} onChange={setColor2} />
        </div>
      </div>

      {/* Angle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Angle</Label>
          <span className="text-xs text-muted-foreground">{angle}°</span>
        </div>
        <Slider
          value={[angle]}
          max={360}
          step={1}
          onValueChange={([a]) => setAngle(a)}
        />
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <Label className="text-xs">Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          {presetGradients.map((g, i) => (
            <button
              key={i}
              className="h-10 rounded-md border border-border transition-transform hover:scale-105"
              style={{ background: g }}
              onClick={() => {
                // Parse preset and apply
                const match = g.match(/#[0-9a-f]{6}/gi)
                if (match && match.length >= 2) {
                  setColor1(match[0])
                  setColor2(match[1])
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
