'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Button,
  Checkbox,
  cn,
} from '@clarity-chat/primitives'
import {
  Loader2,
  Play,
  Bot,
  Sparkles,
} from 'lucide-react'

export function StreamingTextShimmerDemo() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [text, setText] = useState('')
  const fullText =
    "Hello! I'm an AI assistant. I can help you with coding, writing, analysis, and more. How can I assist you today?"

  const startStreaming = () => {
    setIsStreaming(true)
    setText('')
    let i = 0
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 30)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="min-h-[100px] p-4 rounded-lg bg-muted/30 border">
          <span className={cn('streaming-text', isStreaming && 'text-shimmer')}>
            {text || 'Click "Stream" to see the shimmer effect...'}
            {isStreaming && (
              <span className="message-cursor animate-pulse">▋</span>
            )}
          </span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={startStreaming} disabled={isStreaming}>
            {isStreaming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Streaming...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Stream
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsStreaming(false)
              setText('')
            }}
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          The shimmer effect adds a gradient animation to text during streaming,
          creating a polished visual cue for AI-generated content.
        </div>
      </CardContent>
    </Card>
  )
}

export function TextShimmerDemo() {
  const [variant, setVariant] = useState<
    'text' | 'paragraph' | 'heading' | 'code'
  >('paragraph')
  const [lines, setLines] = useState(4)

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(['text', 'paragraph', 'heading', 'code'] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={variant === v ? 'default' : 'outline'}
              onClick={() => setVariant(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border min-h-[120px]">
          <div
            className={cn(
              'flex flex-col gap-2',
              variant === 'code' && 'font-mono bg-muted/30 rounded-lg p-3'
            )}
          >
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden h-4 bg-muted/40 rounded"
                style={{
                  width:
                    variant === 'paragraph'
                      ? ['100%', '95%', '90%', '70%'][i] || '80%'
                      : variant === 'heading'
                        ? '60%'
                        : variant === 'code'
                          ? ['80%', '60%', '90%', '70%'][i] || '75%'
                          : '100%',
                }}
              >
                <div
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, hsl(var(--muted)) 50%, transparent 100%)',
                    animation: `shimmer 1.5s infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Lines:</span>
          <input
            type="range"
            min={1}
            max={6}
            value={lines}
            onChange={(e) => setLines(Number(e.target.value))}
            className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-mono">{lines}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StreamProgressDemo() {
  const [progress, setProgress] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const tokens = {
    received: Math.floor(progress * 5),
    estimated: 500,
  }

  const startStream = () => {
    setIsStreaming(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsStreaming(false)
          return 100
        }
        return prev + Math.random() * 5
      })
    }, 100)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Processing...
              {isStreaming && (
                <span className="inline-flex ml-1">
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: '100ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                </span>
              )}
            </span>
            <span className="font-semibold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-primary transition-all duration-100',
                isStreaming && 'animate-pulse'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {tokens.received} / {tokens.estimated} tokens
            </span>
            <span>
              {Math.round(
                tokens.received / Math.max(progress / 100, 0.01) / 10
              )}{' '}
              tok/s
            </span>
          </div>
        </div>

        <Button size="sm" onClick={startStream} disabled={isStreaming}>
          {isStreaming ? 'Streaming...' : 'Start Stream'}
        </Button>
      </CardContent>
    </Card>
  )
}

export function StreamingCursorDemo() {
  const cursors = ['▋', '|', '●', '▮', '_', '█']
  const [selectedCursor, setSelectedCursor] = useState('▋')

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {cursors.map((cursor) => (
            <Button
              key={cursor}
              size="sm"
              variant={selectedCursor === cursor ? 'default' : 'outline'}
              onClick={() => setSelectedCursor(cursor)}
              className="font-mono"
            >
              {cursor}
            </Button>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border">
          <p>
            The AI is generating a response
            <span className="animate-pulse ml-0.5 text-primary">
              {selectedCursor}
            </span>
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          The streaming cursor indicates active content generation. Different
          cursor styles can match your UI aesthetic.
        </div>
      </CardContent>
    </Card>
  )
}

export function TypingIndicatorDemo() {
  const [variant, setVariant] = useState<'dots' | 'pulse' | 'wave'>('dots')

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2">
          {(['dots', 'pulse', 'wave'] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={variant === v ? 'default' : 'outline'}
              onClick={() => setVariant(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-1.5">
            {variant === 'dots' && (
              <>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </>
            )}
            {variant === 'pulse' && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
            {variant === 'wave' && (
              <span className="text-muted-foreground">
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: '0s' }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                >
                  .
                </span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StreamingMessageDemo() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [content, setContent] = useState('')
  const [showThinking, setShowThinking] = useState(true)
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  const fullMessage = `Here's a summary of your request:

1. **Analysis Complete** - I've reviewed the code you provided
2. **No Issues Found** - The implementation looks solid
3. **Suggestions** - Consider adding error handling

Would you like me to elaborate on any of these points?`

  const thinkingSteps = [
    'Analyzing code structure...',
    'Checking for potential issues...',
    'Generating recommendations...',
  ]

  const startDemo = () => {
    setIsStreaming(true)
    setContent('')
    setCurrentStep(null)

    // Simulate thinking
    let stepIndex = 0
    const thinkInterval = setInterval(() => {
      if (stepIndex < thinkingSteps.length) {
        setCurrentStep(thinkingSteps[stepIndex])
        stepIndex++
      } else {
        clearInterval(thinkInterval)
        setCurrentStep(null)
        // Start streaming content
        let charIndex = 0
        const streamInterval = setInterval(() => {
          if (charIndex < fullMessage.length) {
            setContent(fullMessage.slice(0, charIndex + 1))
            charIndex++
          } else {
            clearInterval(streamInterval)
            setIsStreaming(false)
          }
        }, 20)
      }
    }, 800)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <Checkbox
            id="show-thinking"
            checked={showThinking}
            onCheckedChange={(checked) => setShowThinking(checked as boolean)}
          />
          <label htmlFor="show-thinking" className="text-sm">
            Show thinking steps
          </label>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border min-h-[200px]">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              {showThinking && currentStep && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-yellow-700 dark:text-yellow-300">
                    {currentStep}
                  </span>
                </div>
              )}
              <div className="prose prose-sm dark:prose-invert">
                {content || (
                  <span className="text-muted-foreground italic">
                    Click "Start Demo" to see streaming in action
                  </span>
                )}
                {isStreaming && !currentStep && (
                  <span className="animate-pulse text-primary">▋</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button size="sm" onClick={startDemo} disabled={isStreaming}>
          {isStreaming ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Start Demo'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
