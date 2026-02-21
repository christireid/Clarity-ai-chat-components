'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Type, Zap, Sparkles, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR caching configuration
export const revalidate = 3600

// Demo StreamingTextRenderer component
function DemoStreamingTextRenderer({
  text,
  variant,
  speed,
  showCursor,
  cursorStyle,
  isStreaming,
}: {
  text: string
  variant: 'typewriter' | 'smooth' | 'fade-in' | 'instant'
  speed: number
  showCursor: boolean
  cursorStyle: 'block' | 'line' | 'underline'
  isStreaming: boolean
}) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const animationRef = React.useRef<number | undefined>(undefined)

  // Reset when variant or text changes
  React.useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
  }, [variant, text])

  // Handle text streaming based on variant
  React.useEffect(() => {
    if (!isStreaming || variant === 'instant') {
      setDisplayedText(text)
      setCurrentIndex(text.length)
      return
    }

    if (currentIndex < text.length) {
      const char = text[currentIndex]
      if (!char) return

      animationRef.current = window.setTimeout(
        () => {
          setDisplayedText((prev) => prev + char)
          setCurrentIndex((prev) => prev + 1)
        },
        variant === 'typewriter' ? speed : speed * 0.5
      )
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [currentIndex, text, variant, speed, isStreaming])

  const cursorChar = {
    block: '▋',
    line: '|',
    underline: '_',
  }[cursorStyle]

  const getVariantAnimation = () => {
    switch (variant) {
      case 'fade-in':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        }
      case 'smooth':
        return {
          initial: { opacity: 0, y: 2 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2 },
        }
      case 'typewriter':
      case 'instant':
      default:
        return {}
    }
  }

  const animation = getVariantAnimation()

  return (
    <div className="font-mono text-base leading-relaxed">
      {variant === 'instant' ? (
        <span>{displayedText}</span>
      ) : (
        <motion.span {...animation}>{displayedText}</motion.span>
      )}
      {isStreaming && showCursor && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          className="inline-block ml-0.5 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        >
          {cursorChar}
        </motion.span>
      )}
    </div>
  )
}

export default function StreamingTextRendererPage() {
  const [variant, setVariant] = React.useState<'typewriter' | 'smooth' | 'fade-in' | 'instant'>(
    'typewriter'
  )
  const [speed, setSpeed] = React.useState(30)
  const [showCursor, setShowCursor] = React.useState(true)
  const [cursorStyle, setCursorStyle] = React.useState<'block' | 'line' | 'underline'>('block')
  const [isStreaming, setIsStreaming] = React.useState(true)
  const [textSample, setTextSample] = React.useState('default')

  const sampleTexts = {
    default:
      'The quick brown fox jumps over the lazy dog. This is a demonstration of the StreamingTextRenderer component with smooth typewriter-style text animation.',
    short: 'Hello, World! Welcome to streaming text.',
    long: 'In the realm of artificial intelligence, language models have revolutionized how we interact with technology. These sophisticated systems can understand context, generate human-like responses, and adapt to various communication styles. The StreamingTextRenderer component brings this experience to life with elegant, smooth animations that enhance user engagement.',
    code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst result = greet("World");',
  }

  const displayText = sampleTexts[textSample as keyof typeof sampleTexts] || sampleTexts.default

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
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">StreamingTextRenderer</h1>
              <p className="text-sm text-muted-foreground mt-1">Streaming Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Smooth text streaming with typewriter effects, customizable animation styles, and
            accessible cursor indicators for real-time AI responses.
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
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 min-h-[300px] flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <DemoStreamingTextRenderer
                  text={displayText}
                  variant={variant}
                  speed={speed}
                  showCursor={showCursor}
                  cursorStyle={cursorStyle}
                  isStreaming={isStreaming}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Text Sample
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['default', 'short', 'long', 'code'] as const).map((sample) => (
                    <button
                      key={sample}
                      onClick={() => setTextSample(sample)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        textSample === sample
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {(['typewriter', 'smooth', 'fade-in', 'instant'] as const).map((v) => (
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
                <label className="text-sm font-medium text-foreground block mb-3">
                  Speed: {speed}ms per character
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Cursor Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['block', 'line', 'underline'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setCursorStyle(style)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        cursorStyle === style
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCursor}
                    onChange={(e) => setShowCursor(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Cursor</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStreaming}
                    onChange={(e) => setIsStreaming(e.target.checked)}
                    className="rounded"
                  />
                  <span>Is Streaming</span>
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
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Basic Typewriter Effect
              </h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { StreamingTextRenderer } from '@clarity-chat/react'

function MyComponent() {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  return (
    <StreamingTextRenderer
      text={text}
      isStreaming={isStreaming}
      typingSpeed={30}
      displayMode="character"
      showCursor={true}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Smooth Animation</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextRenderer
  text={streamingResponse}
  isStreaming={true}
  displayMode="chunk"
  chunkSize={5}
  typingSpeed={20}
  showCursor={true}
  cursorChar="|"
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                With Completion Callback
              </h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextRenderer
  text={text}
  isStreaming={isStreaming}
  onStreamingComplete={() => {
    console.log('Streaming finished!')
    setIsStreaming(false)
  }}
  onCharacterDisplayed={(char, index) => {
    // Track character-by-character progress
    console.log(\`Character \${index}: \${char}\`)
  }}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Custom Cursor Styling
              </h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingTextRenderer
  text={text}
  isStreaming={true}
  showCursor={true}
  cursorChar="▋"
  className="text-lg font-medium text-purple-600 dark:text-purple-400"
/>`}</code>
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
                    <code>text</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Text content to render</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isStreaming</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Whether content is currently streaming
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>typingSpeed</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">30</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Milliseconds per character
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>displayMode</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    'character' | 'chunk' | 'instant'
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'character'</td>
                  <td className="py-3 px-4 text-muted-foreground">Text display animation mode</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>chunkSize</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">5</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Characters per chunk (chunk mode only)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showCursor</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Show animated cursor during streaming
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>cursorChar</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">'▋'</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Character to use for cursor
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Custom CSS classes for styling
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onStreamingComplete</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">() =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Callback when streaming completes
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onCharacterDisplayed</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    (char: string, index: number) =&gt; void
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Callback for each character displayed
                  </td>
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
                <Type className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Multiple Animation Modes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Character-by-character, chunk-based, or instant display modes for different UX
                needs
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Customizable Speed</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Adjustable typing speed from 10ms to 200ms per character for perfect pacing
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Animated Cursor</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Smooth blinking cursor with customizable styles (block, line, underline)
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with reduced motion support and proper ARIA attributes
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
              <p className="text-sm text-muted-foreground">
                Real-time streaming message display
              </p>
            </Link>

            <Link
              href="/reference/components/streaming-progress"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingProgress</h3>
              <p className="text-sm text-muted-foreground">
                Progress indicator for AI response streaming
              </p>
            </Link>

            <Link
              href="/reference/components/streaming-code-block"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingCodeBlock</h3>
              <p className="text-sm text-muted-foreground">
                Live syntax-highlighted code streaming
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
