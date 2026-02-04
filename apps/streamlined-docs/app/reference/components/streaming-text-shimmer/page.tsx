'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Zap, Eye, Gauge, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR Caching
export const revalidate = 3600

// ============================================================================
// Demo StreamingTextShimmer Component
// ============================================================================

function DemoStreamingTextShimmer({
  isActive,
  intensity,
  color,
  speed,
  direction,
  size,
  variant,
}: {
  isActive: boolean
  intensity: 'subtle' | 'normal' | 'strong'
  color: 'default' | 'brand' | 'success' | 'warning'
  speed: 'slow' | 'normal' | 'fast'
  direction: 'ltr' | 'rtl'
  size: 'sm' | 'md' | 'lg'
  variant: 'shimmer' | 'pulse' | 'wave'
}) {
  const sampleText = 'Streaming AI response with shimmer effect...'

  // Intensity classes
  const intensityClasses = {
    subtle: 'opacity-30',
    normal: 'opacity-50',
    strong: 'opacity-70',
  }

  // Color classes
  const colorClasses = {
    default: 'from-blue-400 via-blue-200 to-blue-400',
    brand: 'from-brand-500 via-brand-300 to-brand-500',
    success: 'from-emerald-400 via-emerald-200 to-emerald-400',
    warning: 'from-amber-400 via-amber-200 to-amber-400',
  }

  // Speed classes (animation duration)
  const speedDurations = {
    slow: 3000,
    normal: 2000,
    fast: 1000,
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative inline-block', sizeClasses[size])}>
        <span className="text-foreground">{sampleText}</span>
        {isActive && (
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: speedDurations[speed] / 1000,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span
              className={cn(
                'bg-gradient-to-r bg-clip-text text-transparent',
                colorClasses[color]
              )}
            >
              {sampleText}
            </span>
          </motion.div>
        )}
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <div className={cn('relative inline-block', sizeClasses[size])}>
        <span className="text-foreground">{sampleText}</span>
        {isActive && (
          <div className="absolute inset-0">
            {sampleText.split('').map((char, i) => (
              <motion.span
                key={i}
                className={cn(
                  'inline-block bg-gradient-to-r bg-clip-text text-transparent',
                  colorClasses[color]
                )}
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: speedDurations[speed] / 1000,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Shimmer variant (default)
  return (
    <div className={cn('relative inline-block overflow-hidden', sizeClasses[size])}>
      <span className="text-foreground">{sampleText}</span>
      {isActive && (
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-r',
            colorClasses[color],
            intensityClasses[intensity]
          )}
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: direction === 'ltr' ? '-100% 0' : '200% 0',
            mixBlendMode: 'overlay',
          }}
          animate={{
            backgroundPosition: direction === 'ltr' ? ['200% 0', '-100% 0'] : ['-100% 0', '200% 0'],
          }}
          transition={{
            duration: speedDurations[speed] / 1000,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}

export default function StreamingTextShimmerPage() {
  const [isActive, setIsActive] = React.useState(true)
  const [intensity, setIntensity] = React.useState<'subtle' | 'normal' | 'strong'>('normal')
  const [color, setColor] = React.useState<'default' | 'brand' | 'success' | 'warning'>('default')
  const [speed, setSpeed] = React.useState<'slow' | 'normal' | 'fast'>('normal')
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr')
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md')
  const [variant, setVariant] = React.useState<'shimmer' | 'pulse' | 'wave'>('shimmer')

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">StreamingTextShimmer</h1>
              <p className="text-sm text-muted-foreground mt-1">Streaming Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Visual shimmer effects for text during streaming. Provides subtle animated feedback to indicate active AI response generation with customizable intensity, colors, and animation styles.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[300px]">
              <DemoStreamingTextShimmer
                isActive={isActive}
                intensity={intensity}
                color={color}
                speed={speed}
                direction={direction}
                size={size}
                variant={variant}
              />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {(['shimmer', 'pulse', 'wave'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        variant === v
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Intensity</label>
                <div className="flex flex-wrap gap-2">
                  {(['subtle', 'normal', 'strong'] as const).map((i) => (
                    <button
                      key={i}
                      onClick={() => setIntensity(i)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        intensity === i
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {(['default', 'brand', 'success', 'warning'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        color === c
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Speed</label>
                <div className="flex flex-wrap gap-2">
                  {(['slow', 'normal', 'fast'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        speed === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Direction</label>
                <div className="flex flex-wrap gap-2">
                  {(['ltr', 'rtl'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDirection(d)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all uppercase',
                        direction === d
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all uppercase',
                        size === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Shimmer Effect</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { StreamingTextShimmer } from '@clarity-chat/react'

function StreamingResponse() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  return (
    <StreamingTextShimmer
      isActive={isStreaming}
      intensity="normal"
      color="default"
    >
      {content}
    </StreamingTextShimmer>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Custom Color and Speed</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextShimmer
  isActive={true}
  variant="shimmer"
  intensity="strong"
  color="brand"
  speed="fast"
  direction="ltr"
>
  AI is generating a response...
</StreamingTextShimmer>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Pulse Variant</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextShimmer
  isActive={isStreaming}
  variant="pulse"
  color="success"
  speed="slow"
  size="lg"
>
  Processing your request...
</StreamingTextShimmer>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Wave Animation</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextShimmer
  isActive={true}
  variant="wave"
  color="warning"
  speed="normal"
  size="md"
>
  Thinking step by step...
</StreamingTextShimmer>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isActive</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether shimmer effect is active</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>variant</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'shimmer' | 'pulse' | 'wave'</td>
                  <td className="py-3 px-4 text-muted-foreground">'shimmer'</td>
                  <td className="py-3 px-4 text-muted-foreground">Animation style variant</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>intensity</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'subtle' | 'normal' | 'strong'</td>
                  <td className="py-3 px-4 text-muted-foreground">'normal'</td>
                  <td className="py-3 px-4 text-muted-foreground">Visual intensity of the effect</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>color</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'default' | 'brand' | 'success' | 'warning'</td>
                  <td className="py-3 px-4 text-muted-foreground">'default'</td>
                  <td className="py-3 px-4 text-muted-foreground">Color theme for shimmer</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>speed</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'slow' | 'normal' | 'fast'</td>
                  <td className="py-3 px-4 text-muted-foreground">'normal'</td>
                  <td className="py-3 px-4 text-muted-foreground">Animation speed (3s, 2s, 1s)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>direction</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'ltr' | 'rtl'</td>
                  <td className="py-3 px-4 text-muted-foreground">'ltr'</td>
                  <td className="py-3 px-4 text-muted-foreground">Shimmer animation direction</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>size</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'sm' | 'md' | 'lg'</td>
                  <td className="py-3 px-4 text-muted-foreground">'md'</td>
                  <td className="py-3 px-4 text-muted-foreground">Text size</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>children</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ReactNode</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Text content to display</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Multiple Variants</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Shimmer, pulse, and wave animations for different visual effects
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Customizable Colors</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Multiple color themes to match your brand and UI context
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Adjustable Intensity</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Control visual prominence from subtle to strong
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Respects reduced motion preferences and WCAG 2.1 AA compliant
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display</p>
            </Link>

            <Link
              href="/reference/components/streaming-progress"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingProgress</h3>
              <p className="text-sm text-muted-foreground">Progress tracking for streaming responses</p>
            </Link>

            <Link
              href="/reference/components/streaming-code-block"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingCodeBlock</h3>
              <p className="text-sm text-muted-foreground">Live syntax-highlighted code streaming</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
