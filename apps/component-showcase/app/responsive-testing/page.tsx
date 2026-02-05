'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  Grid3x3,
  Zap,
  Eye,
  Settings,
  Check,
  X,
  AlertCircle,
  BarChart3,
  Accessibility,
  Image as ImageIcon,
  Layout,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

// Device presets
const DEVICE_PRESETS = {
  mobile: [
    { name: 'iPhone SE', width: 375, height: 667, dpr: 2 },
    { name: 'iPhone 12/13', width: 390, height: 844, dpr: 3 },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, dpr: 3 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, dpr: 3 },
    { name: 'Pixel 5', width: 393, height: 851, dpr: 2.75 },
  ],
  tablet: [
    { name: 'iPad Mini', width: 768, height: 1024, dpr: 2 },
    { name: 'iPad Air', width: 820, height: 1180, dpr: 2 },
    { name: 'iPad Pro 11"', width: 834, height: 1194, dpr: 2 },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, dpr: 2 },
    { name: 'Surface Pro', width: 912, height: 1368, dpr: 2 },
  ],
  desktop: [
    { name: 'Laptop (1366px)', width: 1366, height: 768, dpr: 1 },
    { name: 'Desktop (1920px)', width: 1920, height: 1080, dpr: 1 },
    { name: 'Desktop (2560px)', width: 2560, height: 1440, dpr: 1 },
    { name: 'iMac 5K', width: 2560, height: 1440, dpr: 2 },
    { name: 'Ultra-wide', width: 3440, height: 1440, dpr: 1 },
  ],
}

// Performance metrics thresholds
const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
}

type Orientation = 'portrait' | 'landscape'
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'custom'

interface Viewport {
  width: number
  height: number
  scale: number
}

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'needsImprovement' | 'poor'
  threshold: { good: number; needsImprovement: number }
}

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  element?: string
}

export default function ResponsiveTestingPage() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_PRESETS.desktop[0])
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [customViewport, setCustomViewport] = useState({ width: 1920, height: 1080 })
  const [scale, setScale] = useState(1)
  const [touchMode, setTouchMode] = useState(false)
  const [showRulers, setShowRulers] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [showBreakpoints, setShowBreakpoints] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonDevices, setComparisonDevices] = useState<typeof selectedDevice[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [a11yIssues, setA11yIssues] = useState<AccessibilityIssue[]>([])
  const [showMetrics, setShowMetrics] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Calculate effective viewport dimensions
  const viewport: Viewport = {
    width: orientation === 'portrait' ? selectedDevice.width : selectedDevice.height,
    height: orientation === 'portrait' ? selectedDevice.height : selectedDevice.width,
    scale,
  }

  // Toggle orientation
  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
  }

  // Capture screenshot
  const captureScreenshot = useCallback(async () => {
    if (!iframeRef.current) return

    try {
      // In a real implementation, this would use html2canvas or a similar library
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Draw iframe content (placeholder)
        ctx.fillStyle = '#f3f4f6'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#1f2937'
        ctx.font = '24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Screenshot captured', canvas.width / 2, canvas.height / 2)
      }

      // Download
      const link = document.createElement('a')
      link.download = `screenshot-${selectedDevice.name}-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
    }
  }, [viewport, selectedDevice.name])

  // Run Lighthouse audit (simulated)
  const runLighthouseAudit = useCallback(() => {
    setShowMetrics(true)

    // Simulate performance metrics
    const metrics: PerformanceMetric[] = [
      {
        name: 'Largest Contentful Paint (LCP)',
        value: Math.random() * 5000,
        unit: 'ms',
        status: 'good',
        threshold: PERFORMANCE_THRESHOLDS.lcp,
      },
      {
        name: 'First Input Delay (FID)',
        value: Math.random() * 400,
        unit: 'ms',
        status: 'good',
        threshold: PERFORMANCE_THRESHOLDS.fid,
      },
      {
        name: 'Cumulative Layout Shift (CLS)',
        value: Math.random() * 0.3,
        unit: '',
        status: 'good',
        threshold: PERFORMANCE_THRESHOLDS.cls,
      },
      {
        name: 'Time to Interactive (TTI)',
        value: Math.random() * 6000,
        unit: 'ms',
        status: 'good',
        threshold: { good: 3800, needsImprovement: 7300 },
      },
    ]

    metrics.forEach((metric) => {
      if (metric.value <= metric.threshold.good) {
        metric.status = 'good'
      } else if (metric.value <= metric.threshold.needsImprovement) {
        metric.status = 'needsImprovement'
      } else {
        metric.status = 'poor'
      }
    })

    setPerformanceMetrics(metrics)
  }, [])

  // Run accessibility check (simulated)
  const runA11yCheck = useCallback(() => {
    const issues: AccessibilityIssue[] = [
      {
        type: 'error',
        message: 'Button missing accessible label',
        element: 'button.icon-only',
      },
      {
        type: 'warning',
        message: 'Low contrast ratio (3.2:1)',
        element: '.muted-text',
      },
      {
        type: 'info',
        message: 'Consider adding ARIA landmarks',
      },
    ]
    setA11yIssues(issues)
  }, [])

  // Add device to comparison
  const addToComparison = (device: typeof selectedDevice) => {
    if (comparisonDevices.length < 3 && !comparisonDevices.find((d) => d.name === device.name)) {
      setComparisonDevices([...comparisonDevices, device])
      setComparisonMode(true)
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Responsive Design Testing</h1>
            <p className="text-muted-foreground">
              Test components across devices, viewports, and accessibility standards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runLighthouseAudit}
              className="px-4 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Run Lighthouse
            </button>
            <button
              onClick={runA11yCheck}
              className="px-4 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Accessibility className="h-4 w-4" />
              Check A11y
            </button>
          </div>
        </div>

        {/* Device Type Tabs */}
        <div className="flex gap-2 mb-4">
          {(['mobile', 'tablet', 'desktop', 'custom'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setDeviceType(type)
                if (type !== 'custom') {
                  setSelectedDevice(DEVICE_PRESETS[type][0])
                }
              }}
              className={cn(
                'px-4 py-2 rounded-lg transition-all',
                deviceType === type
                  ? 'gradient-accent text-white'
                  : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
              )}
            >
              {type === 'mobile' && <Smartphone className="h-4 w-4 inline mr-2" />}
              {type === 'tablet' && <Tablet className="h-4 w-4 inline mr-2" />}
              {type === 'desktop' && <Monitor className="h-4 w-4 inline mr-2" />}
              {type === 'custom' && <Settings className="h-4 w-4 inline mr-2" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Device Selection */}
        {deviceType !== 'custom' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {DEVICE_PRESETS[deviceType].map((device) => (
              <button
                key={device.name}
                onClick={() => setSelectedDevice(device)}
                className={cn(
                  'p-3 rounded-lg text-left transition-all',
                  selectedDevice.name === device.name
                    ? 'bg-primary/20 border-primary/50 border-2'
                    : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
                )}
              >
                <div className="font-medium text-sm mb-1">{device.name}</div>
                <div className="text-xs text-muted-foreground">
                  {device.width} × {device.height}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Viewport */}
        {deviceType === 'custom' && (
          <div className="glass-panel p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Width (px)</label>
                <input
                  type="number"
                  value={customViewport.width}
                  onChange={(e) =>
                    setCustomViewport({ ...customViewport, width: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (px)</label>
                <input
                  type="number"
                  value={customViewport.height}
                  onChange={(e) =>
                    setCustomViewport({ ...customViewport, height: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Orientation */}
          <button
            onClick={toggleOrientation}
            className="px-4 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
          </button>

          {/* Scale */}
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-medium w-12">{Math.round(scale * 100)}%</span>
          </div>

          {/* Touch Mode */}
          <button
            onClick={() => setTouchMode(!touchMode)}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
              touchMode
                ? 'bg-primary/20 text-primary'
                : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
            )}
          >
            <Smartphone className="h-4 w-4" />
            Touch Mode
          </button>

          {/* View Options */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowRulers(!showRulers)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showRulers
                  ? 'bg-primary/20 text-primary'
                  : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
              )}
              title="Show Rulers"
            >
              <Layout className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showGrid
                  ? 'bg-primary/20 text-primary'
                  : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
              )}
              title="Show Grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowBreakpoints(!showBreakpoints)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showBreakpoints
                  ? 'bg-primary/20 text-primary'
                  : 'glass-panel hover:bg-white/50 dark:hover:bg-white/5'
              )}
              title="Show Breakpoints"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={captureScreenshot}
              className="p-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
              title="Capture Screenshot"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Viewport Info */}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Viewport: {viewport.width} × {viewport.height}px
          </span>
          <span>DPR: {selectedDevice.dpr}x</span>
          <span>Scale: {Math.round(scale * 100)}%</span>
          {touchMode && <span className="text-primary">Touch Events Enabled</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Preview */}
        <div className="lg:col-span-3 space-y-4">
          {/* Preview Frame */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {selectedDevice.name} - {orientation}
              </h3>
              <button
                onClick={() => addToComparison(selectedDevice)}
                className="text-sm text-primary hover:underline"
              >
                Add to Comparison
              </button>
            </div>

            <div
              className="relative mx-auto bg-background rounded-lg shadow-2xl overflow-hidden"
              style={{
                width: viewport.width * scale,
                height: viewport.height * scale,
                maxWidth: '100%',
              }}
            >
              {/* Rulers */}
              {showRulers && (
                <>
                  {/* Horizontal Ruler */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-background/95 border-b border-border flex items-end text-xs">
                    {Array.from({ length: Math.ceil(viewport.width / 100) }).map((_, i) => (
                      <div key={i} className="flex-shrink-0" style={{ width: 100 * scale }}>
                        <span className="px-1">{i * 100}</span>
                      </div>
                    ))}
                  </div>
                  {/* Vertical Ruler */}
                  <div className="absolute top-0 left-0 bottom-0 w-6 bg-background/95 border-r border-border flex flex-col justify-end text-xs">
                    {Array.from({ length: Math.ceil(viewport.height / 100) }).map((_, i) => (
                      <div key={i} className="flex-shrink-0" style={{ height: 100 * scale }}>
                        <span className="px-1">{i * 100}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Grid Overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${50 * scale}px ${50 * scale}px`,
                  }}
                />
              )}

              {/* Breakpoint Indicators */}
              {showBreakpoints && (
                <div className="absolute inset-0 pointer-events-none">
                  {[640, 768, 1024, 1280, 1536].map((bp) => {
                    if (bp < viewport.width) {
                      return (
                        <div
                          key={bp}
                          className="absolute top-0 bottom-0 w-px bg-primary/50"
                          style={{ left: bp * scale }}
                        >
                          <div className="absolute top-2 -left-8 px-2 py-1 bg-primary text-white text-xs rounded">
                            {bp}px
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* Content Frame */}
              <iframe
                ref={iframeRef}
                src="/chat"
                className={cn(
                  'w-full h-full border-none',
                  showRulers && 'mt-6 ml-6',
                  touchMode && 'touch-simulation'
                )}
                style={{
                  width: viewport.width,
                  height: viewport.height,
                  transform: `scale(${scale})`,
                  transformOrigin: showRulers ? '24px 24px' : 'top left',
                }}
                title="Component Preview"
              />
            </div>
          </div>

          {/* Comparison View */}
          {comparisonMode && comparisonDevices.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Side-by-Side Comparison</h3>
                <button
                  onClick={() => {
                    setComparisonMode(false)
                    setComparisonDevices([])
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {comparisonDevices.map((device) => (
                  <div key={device.name} className="relative">
                    <div className="glass-panel p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {device.width} × {device.height}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setComparisonDevices(comparisonDevices.filter((d) => d !== device))
                          }
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="relative bg-background rounded-lg shadow-lg overflow-hidden">
                      <iframe
                        src="/chat"
                        className="w-full border-none"
                        style={{
                          height: (device.height / device.width) * 300,
                        }}
                        title={`Preview ${device.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Performance Metrics */}
          {showMetrics && performanceMetrics.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Performance Metrics</h3>
              </div>
              <div className="space-y-3">
                {performanceMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span
                        className={cn(
                          'font-medium',
                          metric.status === 'good' && 'text-green-500',
                          metric.status === 'needsImprovement' && 'text-yellow-500',
                          metric.status === 'poor' && 'text-red-500'
                        )}
                      >
                        {metric.value.toFixed(metric.unit ? 0 : 2)}
                        {metric.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          metric.status === 'good' && 'bg-green-500',
                          metric.status === 'needsImprovement' && 'bg-yellow-500',
                          metric.status === 'poor' && 'bg-red-500'
                        )}
                        style={{
                          width: `${Math.min(100, (metric.value / metric.threshold.needsImprovement) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={runLighthouseAudit}
                className="w-full mt-3 px-3 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Re-run Audit
              </button>
            </div>
          )}

          {/* Accessibility Issues */}
          {a11yIssues.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Accessibility className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Accessibility</h3>
              </div>
              <div className="space-y-2">
                {a11yIssues.map((issue, i) => (
                  <div key={i} className="glass-panel p-3 space-y-1">
                    <div className="flex items-start gap-2">
                      {issue.type === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      {issue.type === 'warning' && (
                        <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      )}
                      {issue.type === 'info' && (
                        <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{issue.message}</p>
                        {issue.element && (
                          <code className="text-xs text-muted-foreground font-mono">
                            {issue.element}
                          </code>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={captureScreenshot}
                className="w-full px-3 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Capture Screenshot
              </button>
              <button
                onClick={() => window.open('/chat', '_blank')}
                className="w-full px-3 py-2 rounded-lg glass-panel hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Open in New Tab
              </button>
            </div>
          </div>

          {/* Common Breakpoints */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Tailwind Breakpoints</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">sm</span>
                <span className="font-mono">640px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">md</span>
                <span className="font-mono">768px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">lg</span>
                <span className="font-mono">1024px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">xl</span>
                <span className="font-mono">1280px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">2xl</span>
                <span className="font-mono">1536px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .touch-simulation {
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .touch-simulation:active {
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  )
}
